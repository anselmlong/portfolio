---
title: "Hack & Roll 2026"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - hackathon
  - product
  - teamwork
excerpt: "what i built, what broke, and what i’d do differently next time."
---

## TL;DR

hack & roll 2026 was (1) chaotic, (2) sleep-deprived, (3) weirdly fun.

i went in wanting to ship something that was **actually demo-able**, not just “we have an idea” + a figma.

## why i joined

i’ve done enough projects where i overthink architecture and end up with nothing shipped.

hackathons are great because they force one thing:

> make something real enough to show a stranger in 2 minutes.

## what we built

**project:** *(add 1-liner here once you’re happy with the description)*

- the “user problem” we tried to solve: *(todo)*
- what we shipped for the demo: *(todo)*
- what we cut last minute (and should probably add later): *(todo)*

## process (aka: how we didn’t die)

### 1) pick the smallest possible demo

the main hackathon trap: trying to build *a platform*.

we instead aimed for:

- 1 user flow
- 1 wow moment
- 0 “please imagine this works” slides

### 2) split the work by risk, not by feature

we divided tasks into:

- **high risk / unknown** (do first)
- **boring but necessary** (do later)

this saved us from the classic “frontend looks nice but backend is fake” situation.

### 3) keep the scope aggressively violent

things we rejected mid-way:

- adding more pages
- supporting every edge case
- polishing animations

we only cared about: *does the main path work?*

## what broke (and what we learned)

### “it works on my laptop” is real

the demo environment is always different:

- auth breaks
- network is slow
- someone clicks the one button you didn’t test

**lesson:** have a “demo mode” fallback if possible.

### integration is where time goes to die

each piece works alone.

the moment you connect them, you discover:

- mismatched data shapes
- missing env vars
- weird CORS / deployment issues

**lesson:** integrate early, even if ugly.

## what i’d do differently next time

- write a 5-line demo script early (so we don’t improvise the pitch)
- start deployment earlier than feels reasonable
- keep one person “on call” to debug integration issues

## links

- repo: *(todo)*
- demo / slides: *(todo)*
