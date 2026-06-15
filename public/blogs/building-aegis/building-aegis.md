---
title: "Building AEGIS"
date: "2026-06-14"
author: "Anselm Long"
image: "/blogs/building-aegis/images/cover.png"
tags:
  - ai
  - cybersecurity
  - ctf
  - rag
  - leadership
excerpt: "What I learnt building a controlled AI-access platform for a CTF, and why handover does not mean letting go."
---

## TL;DR

AEGIS was a controlled AI-access platform we built for a CTF.

The idea was simple: participants were going to use AI anyway, so instead of pretending that we could ban it perfectly, we built the sanctioned version.

AEGIS gave participants an approved AI assistant with:

- RAG over organiser-approved documents
- per-user token budgets
- server-enforced model settings
- prompt, response, and retrieval logging
- shadow scoring for suspicious behaviour
- an admin dashboard for organisers

It was one of the more intense projects I have worked on because it was not just a technical build. It was also a product, deployment, trust, and leadership problem.

The biggest lesson came on the actual competition day, when things went wrong in ways that were not supposed to happen.

## The Problem

CTFs are weirdly affected by AI.

On one hand, AI can be a great mentor. It can explain concepts, clarify commands, and help participants learn faster. On the other hand, if you let everyone use arbitrary external models, the competition can quickly become less about cybersecurity skill and more about who can prompt a model into solving the challenge.

So the question was not really:

> Can we stop everyone from using AI?

The more realistic question was:

> Can we give participants a controlled assistant that helps them learn without turning the CTF into an AI benchmark?

That was the goal of AEGIS.

We wanted an assistant that behaved like a mentor, not a solver. It could explain concepts and give hints, but it should not hand out full exploit scripts, flags, or step-by-step challenge solutions.

## What We Built

The stack was pretty standard, but the constraints made it interesting:

- FastAPI backend
- Next.js frontend
- PostgreSQL with pgvector
- Nginx reverse proxy
- OpenAI embeddings and chat models
- LLM-Guard middleware
- Docker Compose for local and deployment environments
- Playwright tests for participant and admin flows

The core request flow looked something like this:

1. User sends a prompt
2. Backend verifies auth and session state
3. Token budget is checked
4. Prompt is logged
5. Suspicious patterns are scored
6. Relevant document chunks are retrieved from the RAG corpus
7. The model receives only the server-controlled prompt, retrieved context, and limited conversation history
8. Response is streamed back
9. Response, token counts, citations, and retrieval metadata are logged

The important part was that the user never controlled the model settings. No tools, no browsing, no agentic behaviour, no random model override. The backend owned the policy.

For the organisers, the admin dashboard showed users, token usage, prompt history, retrieval details, and shadow scores. Shadow scoring was deliberately not automatic punishment. It was visibility.

I think this was the right trade-off for an MVP. Perfect jailbreak prevention is a trap. You will never get there in a month. But logging everything, making suspicious behaviour visible, and keeping the system controlled gives organisers a much better basis for judgement.

## My Role

My official role was QA, documentation, and handover.

In practice, it became broader than that.

I owned a lot of the "will this actually run when it matters?" layer:

- Docker Compose and local reproducibility
- setup scripts
- deployment and developer docs
- E2E testing
- CI fixes
- migration issues
- Nginx routing
- token/session edge cases
- admin settings and integration bugs
- merge conflict cleanup
- last-mile product hardening

This was also my first time properly leading a full dev team on a project that had to be used by real people on a fixed date.

That changed the way I thought about code.

When you are building alone, a bug is annoying. When you are leading a team, a bug is also a coordination problem. Someone else's feature might depend on your endpoint. A migration conflict can block everyone. A small environment mismatch can become a deployment issue. A "minor" frontend bug can make the organiser think the whole system is broken.

I had to learn that leadership is not just assigning work and reviewing PRs. Sometimes it means getting your hands dirty, writing the fix yourself, and unblocking everyone quickly.

## The Trade-Offs

The hardest part of AEGIS was not choosing the tech stack. It was deciding what not to build.

We had a lot of tempting ideas:

- per-challenge session isolation
- automatic lockouts
- upload UI for documents
- stronger jailbreak prevention
- dynamic corpus updates
- more advanced behavioural scoring

Most of these were reasonable. Some were even cool.

But the MVP had to survive a real CTF.

So we prioritised the boring, important things:

- can participants log in?
- can they chat?
- are token budgets enforced?
- are prompts and responses logged?
- are retrieved documents auditable?
- can organisers inspect suspicious usage?
- can the whole thing run locally and be handed over?

This was a good reminder that product engineering is mostly about sequencing. A feature can be good and still be wrong for the current version.

For example, automatic punishment sounds useful until you think about false positives. If someone asks "how do I bypass a filter?" in a web security context, that might be legitimate learning. In a CTF, context matters. We chose to flag and highlight instead of auto-blocking because organisers should make the final judgement.

Token budgets had a similar trade-off. They do not prevent cheating by themselves. But they force participants to be intentional. If you only have a limited budget, you are less likely to spam the model with "solve this" until something works.

The goal was not to make AI useless. It was to preserve skill expression.

## Competition Day

The most memorable part of the project was the actual competition day.

AEGIS was originally meant to run on a contained network for the competition. That made sense: keep the platform inside the event environment, reduce exposure, and avoid random internet dependencies where possible.

Then the organisers had network issues.

Suddenly, the plan changed. We had to pivot to clearnet.

The deployment itself was not handled by me, but at that moment it did not really matter. The product was mine too. Participants needed it to work, organisers needed it to work, and "I was not the one deploying it" was not a useful sentence.

The painful part was that we were struggling to port it over because we could not find where some of the environment variable names were stored. The organisers said nothing had been hardcoded. But the system was still pointing at the wrong place.

Eventually, I found it: a hardcoded URL sitting in a `.env` file.

Which was both funny and not funny.

Once we fixed that, AEGIS came back up and the rest of the experience was pretty seamless. But that moment stuck with me.

The lesson was very clear:

> Handover does not mean letting go of responsibility.

If I build the product, I need to understand how it behaves in production. I need to know where configuration lives. I need to make the deployment assumptions explicit. I need to verify the exact environment that will be used on the day.

Documentation is not enough if nobody knows which document matters under pressure.

Since then, I have become much more sensitive to deployment checklists, environment variables, and "obvious" assumptions. The things that break on launch day are rarely the interesting algorithms. It is usually the boring config that everyone thought someone else checked.

## Leading The Team

Another challenge was learning how to lead while still being technically accountable.

There were merge conflicts. There were bugs. Some of them were introduced by me.

That part is humbling.

It is easy to imagine leadership as being the person with the clean high-level plan. But in a real project, especially one moving quickly, leadership also means being willing to sit with an ugly conflict, trace the bug, read the failing test, and fix the thing properly.

There were moments where I had to switch between:

- product manager mode: what do organisers actually need?
- reviewer mode: is this safe to merge?
- engineer mode: why is this test failing?
- deployment mode: why does this work locally but not in the stack?
- teammate mode: how do I unblock someone without taking over their work?

That was tiring, but it also made the project meaningful.

By the end, my team genuinely appreciated the help. Not because I had perfect code, but because I was willing to own the messy parts too.

That is probably the biggest difference between a school project and a real product-shaped project. You cannot just own the clean parts.

## What I Would Do Differently

If I were doing AEGIS again, I would be much stricter about deployment readiness earlier.

Specifically:

1. Create a single source of truth for every environment variable
2. Add a pre-event deployment rehearsal on the exact target network
3. Document the rollback path, not just the happy path
4. Make configuration visible in an admin-safe diagnostics page
5. Require the handover team to run through the checklist themselves before event day

I would also separate "demo works" from "ops ready" more clearly.

Those are very different standards.

A demo can survive with a few manual steps and one person who knows the system. An event platform cannot. The deployment path needs to be boring enough that someone else can run it while stressed.

## What I Learned

AEGIS taught me a few things that I do not think I would have learnt from a normal assignment.

First, controlled AI access is a product problem, not just a model problem. The important decisions were around permissions, logs, budgets, admin visibility, and failure modes.

Second, auditability is underrated. If you cannot perfectly prevent misuse, you should at least make behaviour reviewable. Logs, retrieval metadata, and shadow scores gave organisers a way to reason about what happened after the fact.

Third, deployment is part of the product. If users cannot reach it on the day, the architecture diagram does not matter.

Finally, leading a dev team means taking responsibility for the parts between everyone's work. Interfaces, merge conflicts, test failures, documentation, deployment assumptions - all the unglamorous glue.

I used to think of those as secondary engineering tasks.

After AEGIS, I think they are the job.

## Closing Thoughts

AEGIS started as a controlled AI assistant for a CTF, but the project ended up teaching me more about ownership than AI.

The technical side was fun: RAG, guardrails, token budgets, admin dashboards, streaming responses, tests, Docker.

But the real lesson was that shipping software means owning the whole path from idea to event day.

Even when deployment is handed over.

Especially when deployment is handed over.
