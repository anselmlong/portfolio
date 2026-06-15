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
from argparse import ArgumentParser
from collections import defaultdict
from hashlib import sha256
from pathlib import Path
from urllib.parse import urlparse, urlunparse
from dotenv import load_dotenv

# Load .env from project root
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
load_dotenv(PROJECT_ROOT / ".env")

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

DATA_DIR = PROJECT_ROOT / "public" / "data"
BLOGS_DIR = PROJECT_ROOT / "public" / "blogs"
COLLECTION_NAME = "portfolio_docs_v2"
CONTENT_HASH_KEY = "content_sha256"


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
    params.pop("sslaccept", None)

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


def _source_for(doc) -> str:
    source = doc.metadata.get("source", "") if doc.metadata else ""
    if not source:
        return ""

    try:
        return Path(source).resolve().relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        return str(source)


def _content_hash(content: str) -> str:
    return sha256(content.encode("utf-8")).hexdigest()


def _prepare_loaded_doc(doc):
    source = _source_for(doc)
    doc.metadata = {
        **(doc.metadata or {}),
        "source": source,
        CONTENT_HASH_KEY: _content_hash(doc.page_content),
    }
    return doc


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

    documents_txt = [_prepare_loaded_doc(doc) for doc in loader_txt.load()]
    documents_md = [
        _prepare_loaded_doc(doc) for doc in loader_md.load() + loader_md_blogs.load()
    ]
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
        for header_doc in md_splitter.split_text(d.page_content):
            header_doc.metadata = {
                **d.metadata,
                **(header_doc.metadata or {}),
            }
            md_header_docs.append(header_doc)
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


def get_existing_doc_state() -> tuple[dict[str, set[str]], int]:
    print("🔍 Checking for existing embeddings...")

    import psycopg

    source_hashes: dict[str, set[str]] = defaultdict(set)
    try:
        conn = psycopg.connect(CONNECTION_STRING, connect_timeout=30)
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    e.cmetadata->>'source' AS source,
                    e.cmetadata->>%s AS content_hash,
                    COUNT(*) AS chunk_count
                FROM langchain_pg_embedding e
                JOIN langchain_pg_collection c ON c.uuid = e.collection_id
                WHERE c.name = %s
                GROUP BY source, content_hash
                """,
                (CONTENT_HASH_KEY, COLLECTION_NAME),
            )

            legacy_chunks = 0
            chunk_total = 0
            for source, content_hash, chunk_count in cur.fetchall():
                chunk_total += chunk_count
                if source and content_hash:
                    source_hashes[source].add(content_hash)
                else:
                    legacy_chunks += chunk_count

        conn.close()

        print(f"   Found {chunk_total} existing chunks in DB")
        print(f"   Found {len(source_hashes)} hash-tracked source documents")
        if legacy_chunks:
            print(f"   Found {legacy_chunks} legacy chunks without source/hash metadata")
        return dict(source_hashes), legacy_chunks

    except Exception as e:
        print(f"   No existing collection found (first run): {type(e).__name__}")
        return {}, 0


def delete_sources(sources: set[str]) -> int:
    if not sources:
        return 0

    import psycopg

    with psycopg.connect(CONNECTION_STRING, connect_timeout=30) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM langchain_pg_embedding e
                USING langchain_pg_collection c
                WHERE e.collection_id = c.uuid
                  AND c.name = %s
                  AND e.cmetadata->>'source' = ANY(%s)
                """,
                (COLLECTION_NAME, list(sources)),
            )
            deleted = cur.rowcount

    return deleted


def filter_incremental_docs(
    docs, existing_source_hashes: dict[str, set[str]]
) -> tuple[list, set[str], int]:
    docs_by_source: dict[str, list] = defaultdict(list)
    for doc in docs:
        source = doc.metadata.get("source", "") if doc.metadata else ""
        docs_by_source[source].append(doc)

    docs_to_index = []
    changed_sources: set[str] = set()
    skipped_chunks = 0

    for source, source_docs in docs_by_source.items():
        current_hashes = {
            doc.metadata.get(CONTENT_HASH_KEY)
            for doc in source_docs
            if doc.metadata and doc.metadata.get(CONTENT_HASH_KEY)
        }
        existing_hashes = existing_source_hashes.get(source)

        if source and existing_hashes == current_hashes:
            skipped_chunks += len(source_docs)
            continue

        if source and existing_hashes:
            changed_sources.add(source)
        docs_to_index.extend(source_docs)

    return docs_to_index, changed_sources, skipped_chunks


def _ids_for_docs(docs) -> list[str]:
    source_counts: dict[str, int] = defaultdict(int)
    ids = []

    for doc in docs:
        metadata = doc.metadata or {}
        source = metadata.get("source", "")
        content_hash = metadata.get(CONTENT_HASH_KEY, "")
        chunk_index = source_counts[source]
        source_counts[source] += 1
        ids.append(sha256(f"{source}:{content_hash}:{chunk_index}".encode()).hexdigest())

    return ids


def index_to_pgvector(docs, incremental: bool = True):
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model=EMBED_MODEL)

    docs_to_index = docs
    if incremental:
        existing_source_hashes, legacy_chunks = get_existing_doc_state()
        if legacy_chunks:
            print(
                "⚠️  Existing collection has legacy chunks without source/hash metadata."
            )
            print("   Running one full refresh to migrate metadata for future increments.")
            incremental = False
        else:
            docs_to_index, changed_sources, skipped = filter_incremental_docs(
                docs, existing_source_hashes
            )
            current_sources = {
                doc.metadata.get("source")
                for doc in docs
                if doc.metadata and doc.metadata.get("source")
            }
            removed_sources = set(existing_source_hashes) - current_sources

            stale_sources = changed_sources | removed_sources
            if stale_sources:
                deleted = delete_sources(stale_sources)
                print(
                    f"♻️  Deleted {deleted} stale chunks from {len(stale_sources)} changed/removed sources"
                )
            if skipped > 0:
                print(f"⏭️  Skipping {skipped} unchanged chunks")
            print(f"📝 Will index {len(docs_to_index)} new/changed chunks")
    else:
        print(f"📝 Full re-index: {len(docs)} documents")

    if not docs_to_index:
        print("✅ No new documents to index!")
        return

    print("🤖 Creating embeddings with OpenAI...")

    print(
        "📤 Uploading to PGVector (this may take a few minutes for large datasets)..."
    )
    print(f"   Collection: portfolio_docs_v2")
    print(f"   Documents: {len(docs_to_index)}")

    PGVector.from_documents(
        documents=docs_to_index,
        embedding=embeddings,
        connection=CONNECTION_STRING,
        collection_name=COLLECTION_NAME,
        ids=_ids_for_docs(docs_to_index),
        pre_delete_collection=not incremental,
    )

    action = "indexed" if incremental else "re-indexed"
    print(f"✅ Successfully {action} documents into Neon PGVector!")


def main():
    parser = ArgumentParser(description="Index portfolio markdown into PGVector.")
    parser.add_argument(
        "--full",
        action="store_true",
        help="Force a full collection refresh instead of incremental indexing.",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("Blog Indexer for Neon PGVector")
    print("=" * 60)

    validate_env()

    if not test_connection():
        print("\n⚠️  Please check your DATABASE_URL and network connection.")
        sys.exit(1)

    documents_txt, documents_md = load_documents()
    docs = split_documents(documents_txt, documents_md)
    index_to_pgvector(docs, incremental=not args.full)


if __name__ == "__main__":
    main()
