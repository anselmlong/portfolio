---
title: "Making anselmlong.com"
date: "2025-10-23"
author: "Anselm Long"
tags:
  - next.js
  - typescript
  - RAG
  - langchain.js
  - tailwind css
excerpt: "Finally got off my ass and tried to build something."
---

## Problem

After my recent San Francisco trip, I was inspired by the caliber of some of my batchmates who were in NOC SF. Those guys lived and breathed tech, and I was probably the least stacked person there. So - I took it as a challenge: I was going to "uncook" myself and start building stuff while I had time on exchange. 

My first target? A simple personal website.

But I realised soon that a simple website wouldn't help me stand out against the thousands of personal websites out there. 

Then, one day - I had to do a PayPal online assessment where they asked me to build a Retrieval Augmented Generation pipeline! Thought it was pretty cool so I tried to implement that in my website. The idea was, I create a chatbot that could pull information about myself and reply in natural text.

My main challenge - I had almost nothing about myself written down. Hence, this started the series of blog posts, which are currently being fed to my model as context too!

## Process

### 1. Indexing the Context

Using LangChain's text splitters (`RecursiveCharacterTextSplitter`/`MarkdownHeaderTextSplitter`), I wrote `indexer.py`, a short Python script that scans certain parts of my directory for `.txt` and `.md` files (mostly blogs + my parsed resume), then recursively splits them according to headers (for markdown files), and then by length (after initial split).

### 2. Embedding the Chunks

These text chunks are then embedded with OpenAI's embedding model (`text-embedding-3-small`), and stored in a PostgreSQL database with pgvector.

### 3. Getting the Query

On the frontend, `ChatInterface.tsx` is a component that I built upon from Vercel's ai-elements, which settles the submitting of the query. When the user submits the query, I use the `useChat` hook by `@ai-sdk/react` which makes managing the chat functionality pretty easy. An instance of `TextStreamChatTransport` is created, which sends the message to the backend endpoint at `/api/chat`.

### 4. Rewriting the Query

Upon receiving the query from the frontend, `/api/chat/route.ts`, I rewrite the query to include chat history by using LangChain's `ChatPromptTemplate` and a system prompt that says

> Rewrite the user's question given the chat history so it can be answered from context.

This allows the LLM to be history aware, and allows for a nice conversational flow. 

Next, I use the rewritten question to fetch relevant documents from the vector store, with k (the number of context chunks to retrieve) set as `k = 2` (this can be tuned, but I left it as 2 for speed).

### 5. Generating Final Prompt

Including context, chat history, and my system prompt, I construct a prompt for the AI (text model used was `gpt-4o-mini`). The AI's response is then sent back to the client in real time using a `ReadableStream`.

The output then appears on the main web page as my response!

## Optimisations

While my initial chatbot worked, I wasn't very satisfied with the speed and relevance of the responses. Initially, it took up to 10 seconds for a query to get a response, and the responses weren't as relevant. After the optimisations below, the average time dropped to around 2-3 seconds, an improvement of 70%.

Rating relevancy scores from 1 - 10, I fired off some sample prompts and rated their relevancy based on how a prospective user would rate them and obtained relevancies below, along with the time taken from prompt sending to the end of the response.

| Prompt | Relevancy | 
|--------|-----------|
| tell me about yourself       |   5        | 
| tell me about your internships at imda      |   8        | 
| what projects have you worked on?       |   8        | 
| what are your technical skills?       |   9        | 
| tell me about your education       |   10        | 
| what do you do for fun       |   9        | 
| tell me about your time in rvrc       |   9        | 
| tell me more about your cs2103t project       |   9        | 
| tell me about a challenge you faced in a project       |  6         | 
| how about a challenge in another project       |   6        | 

Given the context that I've been feeding the model doesn't really include information about challenges, the average relevancy is 7.9, which is pretty high. 

1. Recursive text splitting
  - Text splitters used split text on the paragraph level first, then sentence, then word if necessary, preserving semantic context.
  - There are other chunking methods such as semantic chunking, but I didn't think it was necessary given the small nature of my database.


2. Only rewrite past 5 messages
  - Instead of rewriting the entire context, I chose to only keep the past 5 messages because it's unlikely that users will have a conversation for that long, especially revolving around my projects.

3. Only rewrite when semantically needed
  - Rudimentary semantic check to see if the user referenced an above message by checking for words like "above", "former", "that".
  - The LLM only rewrites when it sees this and there is enough history

4. Singleton pattern for models
  - I create a single instance and reuse them on subsequent runs for:
    - LLM: The language model for generating answers.
    - OpenAIEmbeddings: For embedding text for retrieval.
    - PGVectorStore: For storing and retrieving context documents from a database.


## more potential optimisations

1. caching to reduce repeated retrieval
  - common questions don't need to be generated repeatedly. placing them in a cache for easier and cheaper retrieval would help performance.
  - i explored setting up a redis database to cache my common questions, but my model was already performing pretty fast, so i decided this would be an optimisation for the future.

2. implementing hybrid search with hypothetical document embeddings (HyDE)
  - Wang et al. (2024) suggest generating fake responses to a user’s query without any context. 
  - to explain, we can generate some hypothetical questions that users may ask in the future, and later on when the user asks a question, we can go and find the most similar hypothetical questions that we have, then return the relevant chunks.

3. implementing a reranker to rank documents
  - after the initial retrieval, a reranking phase is employed to enhance the relevance of the retrieved documents, ensuring that the most pertinent information appears at the top of the list (Wang et al., 2024).
  - but once again, due to the small nature of my context base, i decided against it

## Scroll Animations

Other than the cool AI stuff, I also ventured into scroll animations for my frontend using GSAP! 

## Tech Stack for Reference

Next.js, TypeScript, Tailwind CSS, tRPC, LangChain.js, OpenAI API, PGVector, PostgreSQL, Bun

## References

- Wang, X., Wang, Z., Gao, X., Zhang, F., Wu, Y., Xu, Z., Shi, T., Wang, Z., Li, S., Qian, Q., Yin, R., Lv, C., Zheng, X., Xuanjing Huang, School of Computer Science, Fudan University, Shanghai, China, & Shanghai Key Laboratory of Intelligent Information Processing. (2024). Searching for best practices in Retrieval-Augmented Generation [Preprint]. arXiv. https://arxiv.org/abs/2407.01219v1


