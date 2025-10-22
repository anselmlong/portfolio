"""
DEPRECATED: This Python RAG implementation has been replaced by the TypeScript version.

The RAG logic has been ported to TypeScript and is now available as a Next.js API route:
  - Location: src/app/api/chat/route.ts
  - Endpoint: POST /api/chat
  
This file is kept for reference and can be removed once the TypeScript version is fully tested.
If you need to test RAG logic standalone, use this file. Otherwise, use the TypeScript API.
"""

import os
from typing import List, Tuple
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_postgres import PGVector

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from operator import itemgetter

load_dotenv()

# --- Load keys & DB connection ---
CONNECTION_STRING = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBED_MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")
CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")

assert CONNECTION_STRING, "DATABASE_URL is not set"
assert OPENAI_API_KEY, "OPENAI_API_KEY is not set"

# --- LLM & Embeddings ---
llm = ChatOpenAI(model=CHAT_MODEL, api_key=OPENAI_API_KEY, temperature=0.5)
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model=EMBED_MODEL)

# --- Connect to Postgres PGVector (new schema/collection created by indexer.py) ---
vector = PGVector(
    connection=CONNECTION_STRING,
    embeddings=embeddings,            # not strictly required for querying, but safe to include
    collection_name="portfolio_docs_v2",
)

# Creates retriever abstraction, embeds given query and returns similarity search for k = 4
retriever = vector.as_retriever(search_kwargs={"k": 3})

# --- 1) Build a history-aware question rewriter (LCEL) ---
contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", "Rewrite the user's question given the chat history so it can be answered from context."),
    MessagesPlaceholder("history"),
    ("human", "{input}")
])

# Making sure that the LLM knows the historical context of the conversation
rewrite_chain = contextualize_prompt | llm | StrOutputParser()

# --- 2) Retrieve docs for the rewritten question, format to a single context string ---
def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

def rewrite(inputs):
    """Only rewrite if there's meaningful history, otherwise pass through."""
    history = inputs.get("history", [])
    question = inputs.get("input", "")
    
    # Skip rewriting if history is empty or trivial
    if not history or len(history) < 2:
        return question
    
    # Rewrite if there's substantial conversation context
    return rewrite_chain.invoke(inputs)

context_chain = (
    {"input": itemgetter("input"), "history": itemgetter("history")}
    | RunnableLambda(rewrite)  # -> conditionally rewrite based on history
    | retriever                      # -> should return similarity search as List[Document]
    | format_docs                    # -> str context, concatenated
)

# --- 3) Answer with stuffed context ---
answer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Anselm Long's portfolio assistant. Your role is to provide detailed, accurate information about his education, work experience, projects, and skills based on the provided context.

Guidelines:
- Be professional yet approachable
- Cite specific projects, companies, or achievements when relevant
- If the context doesn't contain the answer, politely say so
- If there is a question that the context does not cover, respond with "I'm sorry, I don't have that information available."
- Use bullet points for lists of skills or responsibilities

Context:
{context}"""),
    MessagesPlaceholder("history"),
    ("human", "{input}")
])

answer_chain = answer_prompt | llm | StrOutputParser()

rag_chain = (
    {"context": context_chain, "history": itemgetter("history"), "input": itemgetter("input")}
    | answer_chain
)


def _to_messages(history: List[Tuple[str, str]]):
    msgs = []
    for role, content in history:
        if role.lower() in ("human", "user"):
            msgs.append(HumanMessage(content=content))
        elif role.lower() == "ai":
            msgs.append(AIMessage(content=content))
        else:
            raise ValueError(f"Unknown role in history: {role}")
    return msgs


def run_chat(question: str, chat_history: List[Tuple[str, str]]) -> str:
    """Non-streaming helper: returns the full answer as a string."""
    history_msgs = _to_messages(chat_history)
    try:
        answer = rag_chain.invoke({
            "input": question,
            "history": history_msgs,
        })
    except Exception as e:
        print(f"Error occurred: {e}")
        answer = "I'm sorry, I couldn't process your request. Please try again later."
    return answer


def stream_chat(question: str, chat_history: List[Tuple[str, str]]):
    """Streaming helper: yields chunks of the answer as they arrive."""
    history_msgs = _to_messages(chat_history)
    
    # Signal that retrieval is starting
    yield "[RETRIEVING]"
    
    # Precompute context (retrieval isn't streamed), then stream LLM output
    try: 
        ctx = context_chain.invoke({
            "input": question,
            "history": history_msgs,
        })
    except Exception as e:
        print(f"Error occurred during context retrieval: {e}")
        ctx = "No context available due to an error. Tell the user to try again later."
    
    # Signal that generation is starting
    yield "[GENERATING]"
    
    for chunk in answer_chain.stream({
        "context": ctx,
        "history": history_msgs,
        "input": question,
    }):
        if chunk:  # Only yield non-empty chunks
            yield chunk



if __name__ == "__main__":
    import time

    history = []
    
    question = "what are you interested in?"
    print(f"\n❓ Question: {question}")
    print("\n🤖 Chatbot Response:\n", end="", flush=True)
    
    start = time.time()
    retrieval_time = 0
    gen_start = None
    
    for chunk in stream_chat(question, history):
        if chunk == "[RETRIEVING]":
            print(chunk, end="", flush=True)
            retrieval_start = time.time()
        elif chunk == "[GENERATING]":
            retrieval_time = time.time() - retrieval_start
            print(chunk, end="", flush=True)
            gen_start = time.time()
        else:
            print(chunk, end="", flush=True)
    
    total_time = time.time() - start
    gen_time = time.time() - gen_start if gen_start else 0
    
    print(f"\n\nRetrieval: {retrieval_time:.2f}s")
    print(f"Generation: {gen_time:.2f}s")
    print(f"⏱️  Total: {total_time:.2f}s")
    print()
