"""
Blog Indexer for Supabase PGVector

Usage:
    python src/server/indexer.py

This script:
1. Loads markdown files from public/data and public/blogs
2. Splits them into chunks
3. Creates embeddings with OpenAI
4. Uploads to Supabase Postgres with PGVector
"""

import os
import sys
from pathlib import Path
from urllib.parse import urlparse, urlunparse
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

load_dotenv()

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DATA_DIR = PROJECT_ROOT / "public" / "data"
BLOGS_DIR = PROJECT_ROOT / "public" / "blogs"


def get_connection_string() -> str | None:
    conn_str = os.getenv("DATABASE_URL")
    if not conn_str:
        return None

    if conn_str.startswith("postgres://"):
        conn_str = conn_str.replace("postgres://", "postgresql://", 1)

    parsed = urlparse(conn_str)

    from urllib.parse import parse_qs, urlencode

    params = parse_qs(parsed.query)

    params.pop("pgbouncer", None)

    if "connect_timeout" not in params:
        params["connect_timeout"] = ["30"]
    if "sslmode" not in params:
        params["sslmode"] = ["require"]

    flat_params = {k: v[0] for k, v in params.items()}

    new_parsed = parsed._replace(query=urlencode(flat_params))
    return urlunparse(new_parsed)


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBED_MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")
CONNECTION_STRING = get_connection_string()


def validate_env():
    if not CONNECTION_STRING:
        print("❌ DATABASE_URL is not set")
        sys.exit(1)
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY is not set")
        sys.exit(1)

    # Show connection info (masked)
    parsed = urlparse(CONNECTION_STRING)
    masked_url = f"postgresql://{parsed.username}:***@{parsed.hostname}{parsed.path}?connect_timeout=30&sslmode=require"
    print(f"✓ Environment validated")
    print(f"  Model: {EMBED_MODEL}")
    print(f"  DB: {masked_url}")


def load_documents():
    print(f"📁 Loading from: {DATA_DIR}")
    print(f"📁 Loading from: {BLOGS_DIR}")

    loader_txt = DirectoryLoader(
        str(DATA_DIR), glob="**/*.txt", loader_cls=TextLoader, show_progress=True
    )
    loader_md = DirectoryLoader(
        str(DATA_DIR), glob="**/*.md", loader_cls=TextLoader, show_progress=True
    )
    loader_md_blogs = DirectoryLoader(
        str(BLOGS_DIR), glob="**/*.md", loader_cls=TextLoader, show_progress=True
    )

    documents_txt = loader_txt.load()
    documents_md = loader_md.load() + loader_md_blogs.load()
    print(f"📂 Loaded {len(documents_txt)} .txt and {len(documents_md)} .md documents")
    return documents_txt, documents_md


def split_documents(documents_txt, documents_md):
    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    md_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on, strip_headers=True
    )

    txt_docs = splitter.split_documents(documents_txt)

    md_header_docs = []
    for d in documents_md:
        md_header_docs.extend(md_splitter.split_text(d.page_content))
    md_docs = splitter.split_documents(md_header_docs)

    print(f"🪚 Split into {len(txt_docs)} (.txt) and {len(md_docs)} (.md) chunks")
    return txt_docs + md_docs


def test_connection():
    """Test database connection before uploading."""
    print("🔌 Testing database connection...")
    import psycopg

    try:
        conn = psycopg.connect(CONNECTION_STRING, connect_timeout=30)
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            result = cur.fetchone()
        conn.close()
        print(f"✅ Database connection successful!")
        return True
    except Exception as e:
        error_type = type(e).__name__
        print(f"❌ Database connection failed: {error_type}")
        print()
        print("=" * 60)
        print("TROUBLESHOOTING:")
        print("=" * 60)
        print("1. If you see 'Connection refused' or timeout:")
        print("   - Port 5432 may be blocked in your current environment")
        print("   - Try running from your local machine or a cloud environment")
        print()
        print("2. For Neon's serverless Postgres:")
        print("   - The compute may be suspended (cold start)")
        print("   - First connection can take 10-30 seconds")
        print()
        print("3. Alternative: Use the Next.js API to index from a deployed app")
        print("   - Deploy to Vercel, then call the API endpoint")
        print()
        print("Error details:")
        print(f"   {e}")
        return False


def index_to_pgvector(docs):
    print("🤖 Creating embeddings with OpenAI...")
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model=EMBED_MODEL)

    print(
        "📤 Uploading to PGVector (this may take a few minutes for large datasets)..."
    )
    print(f"   Collection: portfolio_docs_v2")
    print(f"   Documents: {len(docs)}")

    PGVector.from_documents(
        documents=docs,
        embedding=embeddings,
        connection=CONNECTION_STRING,
        collection_name="portfolio_docs_v2",
        pre_delete_collection=True,
    )

    print("✅ Successfully indexed documents into Neon PGVector!")


def main():
    print("=" * 60)
    print("Blog Indexer for Neon PGVector")
    print("=" * 60)

    validate_env()

    if not test_connection():
        print("\n⚠️  Please check your DATABASE_URL and network connection.")
        sys.exit(1)

    documents_txt, documents_md = load_documents()
    docs = split_documents(documents_txt, documents_md)
    index_to_pgvector(docs)


if __name__ == "__main__":
    main()
