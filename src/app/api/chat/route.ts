import { NextRequest } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import type { UIMessage } from "ai";
import { pool } from "~/server/pg";

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

// Note: in-memory retrieval cache removed to avoid stale per-process state.

// Singletons for LLM, embeddings, and vector store
let llmSingleton: ChatOpenAI | null = null;
let embeddingsSingleton: OpenAIEmbeddings | null = null;
let vectorStoreSingleton: PGVectorStore | null = null;


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

    // --- Timing: start request ---
    const t0 = Date.now();

    // Initialize/reuse singletons
    const llm =
      llmSingleton ??
      (llmSingleton = new ChatOpenAI({
        modelName: process.env.CHAT_MODEL || "gpt-4o-mini",
        temperature: 0.5,
        openAIApiKey: process.env.OPENAI_API_KEY!,
        streaming: true,
        // Optional: cap response length for speed
        maxTokens: 600,
      }));

    const embeddings =
      embeddingsSingleton ??
      (embeddingsSingleton = new OpenAIEmbeddings({
        modelName: process.env.EMBED_MODEL || "text-embedding-3-small",
        openAIApiKey: process.env.OPENAI_API_KEY!,
      }));

    const vectorStore =
      vectorStoreSingleton ??
      (vectorStoreSingleton = await PGVectorStore.initialize(embeddings, {
        pool,
        tableName: "langchain_pg_embedding",
        columns: {
          idColumnName: "id",
          vectorColumnName: "embedding",
          contentColumnName: "document",
          metadataColumnName: "cmetadata",
        },
      }));

    // Small dataset: fewer docs are usually sufficient and faster
    const retriever = vectorStore.asRetriever({ k: 2 });
    const t1 = Date.now();

    // Convert AI SDK messages to LangChain format (limit history for speed)
    const historyWindow = 5; // last N messages before the latest
    const startIdx = Math.max(0, messages.length - 1 - historyWindow);
    const historyMessages: BaseMessage[] = messages
      .slice(startIdx, -1)
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

    // --- Timing: rewrite phase ---
    let rewrittenQuestion = question;
    const needsRewrite =
      historyMessages.length >= 2 &&
      /\b(it|that|this|they|them|those|he|she|there|former|latter|previous|above)\b/i.test(
        question
      );
    let rewriteMs = 0;
    if (needsRewrite) {
      const tRewriteStart = Date.now();
      rewrittenQuestion = await rewriteChain.invoke({
        input: question,
        history: historyMessages,
      });
      rewriteMs = Date.now() - tRewriteStart;
    }
    const t2 = Date.now();

    // System Prompt!
    const answerPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are Anselm. Your role is to provide detailed, accurate information about your personality, education, work experience, projects, and skills based on the provided context.

          Guidelines:
          - answer in lower case, with an excited and enthusiastic tone
          - Be casual yet approachable
          - Cite specific projects, companies, or achievements when relevant
          - If there is a question that the context does not cover, respond with your best estimate based on the context available.
          - If the question is not about you, answer to the best of your ability.
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
          // --- Timing: retrieval phase ---
          const tRetrievalStart = Date.now();
          const docs = await retriever.invoke(rewrittenQuestion);
          const context = formatDocs(docs);
          const retrievalMs = Date.now() - tRetrievalStart;
          const t3 = Date.now();

          // --- Timing: LLM phase ---
          const tLLMStart = Date.now();
          const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

          const answerStream = await answerChain.stream({
            context,
            history: historyMessages,
            input: question,
          });

          let firstTokenMs = 0;
          let firstChunk = true;
          for await (const chunk of answerStream) {
            if (chunk) {
              if (firstChunk) {
                firstTokenMs = Date.now() - tLLMStart;
                firstChunk = false;
              }
              controller.enqueue(encoder.encode(chunk));
            }
          }

          controller.close();

          // --- Timing: log all phases ---
          const t4 = Date.now();
          console.log(
            `[RAG Timing] Total: ${t4-t0}ms | Init: ${t1-t0}ms | Rewrite: ${rewriteMs}ms | Retrieval: ${retrievalMs}ms | LLM first token: ${firstTokenMs}ms | LLM total: ${t4-tLLMStart}ms`
          );
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