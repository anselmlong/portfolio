import os

from langchain_community.vectorstores import PGVector
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from state import AgentState

RAG_SYSTEM = """\
You are an AI assistant representing Anselm Long, a software engineer.
Answer questions about Anselm based only on the provided context from his portfolio.
Be specific, accurate, and professional.
If the context doesn't contain a clear answer, say so honestly rather than guessing."""

_vectorstore: PGVector | None = None


def _get_vectorstore() -> PGVector:
    global _vectorstore
    if _vectorstore is None:
        embeddings = OpenAIEmbeddings(
            model=os.environ.get("EMBED_MODEL", "text-embedding-3-small")
        )
        _vectorstore = PGVector(
            connection_string=os.environ["DATABASE_URL_DIRECT"],
            embedding_function=embeddings,
            collection_name="portfolio_docs_v2",
        )
    return _vectorstore


def rag_node(state: AgentState) -> dict:
    messages = state["messages"]
    query = next(
        (m.content for m in reversed(messages) if isinstance(m, HumanMessage)),
        "",
    )

    docs = _get_vectorstore().similarity_search(query, k=4)
    context = "\n\n---\n\n".join(doc.page_content for doc in docs)

    llm = ChatOpenAI(
        model=os.environ.get("CHAT_MODEL", "gpt-4o"),
        streaming=True,
    )

    response = llm.invoke(
        [
            SystemMessage(
                content=f"{RAG_SYSTEM}\n\nContext from Anselm's portfolio:\n{context}"
            ),
            *messages,
        ]
    )

    return {"messages": [AIMessage(content=response.content)]}
