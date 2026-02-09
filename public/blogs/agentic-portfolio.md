---
title: "Making anselmlong.com"
date: "2025-10-23"
author: "Anselm Long"
tags:
  - langgraph
excerpt: "Enhancing my portfolio website to do more stuff. Agentic."
---

## Agentic this, Agentic that

I've heard this term thrown around so much that I got a little FOMO. What if I make my portfolio website agentic?

## Learning LangGraph

I decided to dive deep into LangGraph and build this system from scratch, without prompting any LLMs. I'll be writing my summary notes here to try and consolidate my learning.

LangGraph models agent workflows using a graph. There are 3 main components:

1. State: Data structure that represents the current state of the agent. 
- Consists of a schema and reducer functions -> represent how to update the state
2. Nodes: Functions that perform some action. 
- Takes in State, Config, and Runtime
- Add to a graph with `add_node()`
3. Edges: Connections between nodes - can be conditional.
- How logic is routed
- Normal Edges - go directly
- Conditional Edges - call a function to decide
- Entry point - Which node to call first

We can pass in additional context during runtime using a `ContextSchema`.
Graphs must be compiled using `.compile()` before they can be run.

## Defining the Graph

I'm going to integrate my chatbot with a few things:
- Google Calendar
- Gmail
- Telegram
- GitHub
And allow for specific actions to be taken upon specific prompts.

