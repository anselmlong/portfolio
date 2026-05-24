---
title: "Hack & Roll 2026: Building Optifiner, a Multi-Agent, Evolutionary Framework"
date: "2026-01-26"
author: "Anselm Long (Co-authored by Ava)"
image: "/blogs/hack-and-roll-2026/images/38-hours.png"
tags:
  - hackathon
  - agents
  - evolutionary
  - product
  - teamwork
excerpt: "We built a self-evolving agentic code optimizer. Also: the welfare was insane."
---

## TL;DR

Hack & Roll 2026 was chaotic in the best way possible.

We built **Optifiner** â€” an evolutionary, multi-agent AI code optimizer that:

- spawns parallel agents to propose code changes
- runs benchmarks/tests to score those changes
- only keeps improvements that measurably beat the baseline

Website: https://optifiner.ai

## Context

I came into this hackathon with the usual fear:

> Iâ€™m about to embarrass myself next to people who ship faster than I can open VS Code.

Turns out building with people way smarter than you isâ€¦ kind of amazing.

Not because they do everything for you, but because you get dragged into a higher bar:

- sharper product decisions
- cleaner engineering taste
- less â€œletâ€™s build a platformâ€ and more â€œship one good demo pathâ€

## What Is Optifiner?

Optifiner is basically a Darwinian loop for code.

Instead of â€œone agent edits files and hopes for the bestâ€, it works like:

1. Spawn multiple agents in parallel (analyzer / refactorer / optimizer / etc)
2. Each agent proposes changes in an isolated workspace
3. Run an evaluator (benchmark + test gate) to produce a score
4. Keep only the changes that improve the score
5. Repeat across generations until it converges

The part I liked most is that it forces you to define what â€œbetterâ€ means.

Because without a metric, â€œAI optimizerâ€ becomes: random refactors with vibes.

## What We Shipped

Basing this off our repo write-up (which is way more put-together than my sleep schedule), we shipped:

- a multi-agent evolution loop (parallel runs)
- benchmark-driven acceptance (improve score or revert)
- git-integrated history (every improvement is a commit)
- a dashboard to watch evolution progress
- multi-model support (Claude / GPT / Gemini)

## The Hackathon Experience

### Best Welfare Iâ€™ve Seen At A Hackathon

Iâ€™m used to hackathons that are like:

- â€œHereâ€™s a banana.â€
- â€œGood luck.â€
- â€œSleep on concrete if you want.â€

Hack & Roll 2026 was the opposite. Legit the best hackathon Iâ€™ve been to in terms of welfare.

And yes, it changes the entire experience. Suffering builds character, but so doesâ€¦ not suffering.

### We Won A Tiny Prize (And It Leaks)

We won a small prize from **Marshall Wace** â€” a **Stanley bottle**.

It leaks sadly. But itâ€™s the thought that counts.

### Building With Cracked People

Biggest reflection:

> Building with people way smarter than you is a cheat code.

You end up asking better questions:

- Is this the simplest thing that works?
- How do we make the demo robust?
- Whatâ€™s the metric? Whatâ€™s the failure mode?

## Reflections

- **Benchmarks > vibes.** If you canâ€™t measure it, youâ€™re doing interpretive dance.
- **Parallelism is your friend.** Letting agents explore different approaches feels like the AI version of splitting tasks.
- **Shipping a demo is a separate skill.** â€œIt works locallyâ€ is not a demo.

## Thanks

Huge thanks to my teammates: **Philippe**, **Verity**, and **Leroy**.

## Whatâ€™s Next

Weâ€™re going to keep working on this after the hackathon too (because apparently we enjoy pain).

## Links

- Optifiner: https://optifiner.ai
- Repo: (Private for now)

