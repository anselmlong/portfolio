import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter, MarkdownHeaderTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

load_dotenv()
# Load environment variables
CONNECTION_STRING = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBED_MODEL = os.getenv("EMBED_MODEL")

# Load your portfolio documents
loader_txt = DirectoryLoader("../../public/data/", glob="**/*.txt", loader_cls=TextLoader)
loader_md = DirectoryLoader("../../public/data/", glob="**/*.md", loader_cls=TextLoader)
loader_md_blogs = DirectoryLoader("../../public/blogs/", glob="**/*.md", loader_cls=TextLoader)
documents_txt = loader_txt.load()
documents_md = loader_md.load() + loader_md_blogs.load()
print(f"📂 Loaded {len(documents_txt)} .txt and {len(documents_md)} .md documents")
headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]


# Split into smaller overlapping chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
md_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on, strip_headers=True)

# Split plain text docs with character splitter
txt_docs = splitter.split_documents(documents_txt)

# Split markdown docs by headers first, then by characters for size control
md_header_docs = []
for d in documents_md:
    md_header_docs.extend(md_splitter.split_text(d.page_content))
md_docs = splitter.split_documents(md_header_docs)

print(f"🪚 Split into {len(txt_docs)} (.txt) and {len(md_docs)} (.md) chunks")
docs = txt_docs + md_docs

# Embed with OpenAI
embeddings = OpenAIEmbeddings(
    openai_api_key=OPENAI_API_KEY,
    model=EMBED_MODEL
)
print ("🤖 Created embeddings using OpenAI")

# Store in Postgres using the new langchain-postgres PGVector
# Note: This will create a NEW table with the modern schema
# If you want to use existing data, keep using langchain-community for now
PGVector.from_documents(
    documents=docs,
    embedding=embeddings,
    connection=CONNECTION_STRING,
    collection_name="portfolio_docs_v2",  # new collection name for new schema
    pre_delete_collection=True  # Clear any old data in this collection
)

print ("✅ Successfully indexed documents into Neon PGVector!")