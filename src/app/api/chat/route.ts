import { NextRequest } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import type { UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Types
interface ChatRequest {
  messages: UIMessage[];
}

// Helper: Format docs
function formatDocs(docs: Document[]): string {
  return docs.map((d) => d.pageContent).join("\n\n");
}

// Helper: Extract text from UIMessage parts
function extractText(message: UIMessage): string {
  return message.parts
    .filter(p => p.type === 'text')
    .map(p => (p.type === 'text' ? p.text : ''))
    .join('');
}

// POST Endpoint -> Takes in AI SDK messages format
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // Get the latest user message as the question
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }
    
    const question = extractText(lastMessage);
    console.log("Question:", question);
    
    if (!question) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    // Initialize LLM and embeddings
    const llm = new ChatOpenAI({
      modelName: process.env.CHAT_MODEL || "gpt-4o-mini",
      temperature: 0.5,
      openAIApiKey: process.env.OPENAI_API_KEY!,
      streaming: true,
    });

    const embeddings = new OpenAIEmbeddings({
      modelName: process.env.EMBED_MODEL || "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    // Initialize vector store with dynamic import of pg Pool
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });

    const vectorStore = await PGVectorStore.initialize(embeddings, {
      pool,
      tableName: "langchain_pg_embedding",
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "document",
        metadataColumnName: "cmetadata",
      },
    });

    const retriever = vectorStore.asRetriever({ k: 3 });

    // Convert AI SDK messages to LangChain format (excluding the last user message)
    const historyMessages: BaseMessage[] = messages
      .slice(0, -1)
      .map((msg: UIMessage) => {
        const text = extractText(msg);
        return msg.role === 'user' 
          ? new HumanMessage(text)
          : new AIMessage(text);
      });

    // Question rewriter chain (for follow-up questions)
    const contextualizePrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Rewrite the user's question given the chat history so it can be answered from context.",
      ],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    const rewriteChain = contextualizePrompt.pipe(llm).pipe(new StringOutputParser());

    // Smart rewrite: skip if no meaningful history
    let rewrittenQuestion = question;
    if (historyMessages.length >= 2) {
      rewrittenQuestion = await rewriteChain.invoke({
        input: question,
        history: historyMessages,
      });
    }

    // Answer prompt
    const answerPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are Anselm Long's portfolio assistant. Your role is to provide detailed, accurate information about his education, work experience, projects, and skills based on the provided context.

Guidelines:
- Be professional yet approachable
- Cite specific projects, companies, or achievements when relevant
- If the context doesn't contain the answer, politely say so
- If there is a question that the context does not cover, respond with "I'm sorry, I don't have that information available."
- Use bullet points for lists of skills or responsibilities

Context:
{context}`,
      ],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Retrieve documents
          const docs = await retriever.invoke(rewrittenQuestion);
          const context = formatDocs(docs);

          // Stream LLM response
          const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

          const answerStream = await answerChain.stream({
            context,
            history: historyMessages,
            input: question,
          });

          // Stream chunks to client
          for await (const chunk of answerStream) {
            if (chunk) {
              controller.enqueue(encoder.encode(chunk));
            }
          }

          controller.close();
        } catch (error) {
          console.error("Error during streaming:", error);
          controller.enqueue(
            encoder.encode(
              "I'm sorry, I encountered an error processing your request. Please try again later."
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}