---
title: "Hack & Roll 2026"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - hackathon
  - agents
  - product
  - teamwork
excerpt: "we built a self-evolving agentic code optimizer. also: i slept. and the welfare was insane." 
---

## TL;DR

hack & roll 2026 was (1) chaotic, (2) surprisingly well taken care of, and (3) the best hackathon i’ve been to in terms of welfare.

we built **optifiner** — an *evolutionary, agentic ai code optimizer* that spawns parallel agents to propose changes, runs benchmarks/tests, and only keeps improvements that **measurably** make the code better.

- website: https://optifiner.dev
- repo: *(private for now, because we are cowards)*

## the backstory

i came in with the usual hackathon fear:

> i’m about to embarrass myself next to people who ship faster than i can open vscode.

turns out, building with people way smarter than you is… actually great?

- you get exposed to how they think
- you learn what “good taste” in engineering looks like
- and you stop pretending you’re the main character (very healthy)

## our project: optifiner

optifiner is basically a darwinian loop for code.

instead of “one agent edits files and hopes for the best”, it does:

1. **spawn multiple agents in parallel** (analyzer/refactorer/optimizer/etc)
2. each agent proposes changes in a sandbox workspace
3. run a **benchmark evaluator** that outputs a score + a test gate
4. **keep only improvements** that beat the baseline
5. repeat for multiple generations until convergence

what i really liked about this approach is that it forces you to answer:

- what does “better” even mean?
- what metric do we optimize?
- what’s our safety check to prevent breaking everything?

because without that, “ai code optimizer” becomes: *random code edits with vibes*.

## what we actually shipped

- multi-agent evolution loop (parallel agents)
- benchmark-driven acceptance (score improves or we revert)
- git-integrated history (every improvement is a commit)
- a web dashboard to watch the evolution progress
- multi-model support (claude/gpt/gemini)

*(i’m basing this on our repo readme, which is way more put-together than my sleep schedule.)*

## the hackathon part

### welfare was insane

i’m used to hackathons that are like:

- “here’s a banana”
- “good luck”
- “sleep on concrete if you want”

this one was the opposite. genuinely the best hackathon i’ve been to **in terms of welfare**.

(and yes, that changes the entire experience. suffering builds character, but so does… not suffering.)

### building with cracked people

most valuable reflection for me:

> building with people smarter than you is a cheat code.

not because they do everything for you — but because you get pulled into a higher bar.

you start asking:

- “is this the simplest thing that works?”
- “how do we make this demo robust?”
- “what’s the metric? what’s the failure mode?”

## what i learned

- **benchmarks > vibes.** if you can’t measure it, you’re just doing interpretive dance.
- **parallelism is your friend.** letting agents explore different approaches simultaneously is oddly similar to letting humans split tasks.
- **shipping a demo is a separate skill.** “it works locally” is not a demo.

## links

- optifiner website: https://optifiner.dev
- optifiner repo: *(private for now)*
