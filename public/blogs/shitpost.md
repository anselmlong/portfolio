---
title: "shitpost.anselmlong.com"
date: "2025-04-19"
author: "Anselm Long"
tags:
  - side project
  - next.js
  - ai
  - humor
excerpt: "i made a thing that generates absurd linkedin posts so you don't have to."
---

![shitpost](/blogs/images/shitpost.png)

<figcaption>one person's trash is another person's linkedin post</figcaption>

## backstory

i've been doomscrolling linkedin lately and honestly? the algo has been serving me some wild stuff.

"excited to share that i just got promoted to senior L1 cookie! 🍪"

"after 12 years, i'm finally ready to share my journey..."

"to the developer who pushed to main on a friday — i see you, and i forgive you."

at some point i stopped asking "who writes this stuff?" and started wondering... what if i could make a machine do it for me?

## what i built

**[shitpost.anselmlong.com](https://shitpost.anselmlong.com)** — a satirical linkedin post generator powered by AI.

you enter a topic (like "sprint planning" or "coworker who doesn't refactor") and get back 6 different comedic personas:

1. **tech-bro** — the classic "journey" post, all about learnings and growth
2. **tryhard** — motivational LinkedIn that treats "replied to email within 24h" as a watershed career moment
3. **unhinged** — lowercased rage hooks that start alarming, become sincere, end subtly flexing
4. **singaporean** — like texting friends on WhatsApp, casually unbothered
5. **lowercase** — Gen Z performing authenticity as a brand strategy
6. **anselm** — a computing student who posts on LinkedIn by accident, builds overkill solutions to tiny friction

then there's an evaluation step where the AI scores each post on humor, virality, originality, and cringe — and finally synthesizes a "director's cut" that cherry-picks the best parts.

## how it works

**next.js 16** (app router), **react 19**, **tailwind css v4**, and **google gemini** via **openrouter** as the LLM.

it's actually pretty straightforward:

- user input → 5 parallel calls to the LLM (one per persona)
- each call generates a post in that persona's "voice"
- evaluation prompt asks the model to score each on various dimensions
- synthesis prompt grabs the best elements and combines them

the whole thing was surprisingly fast to build. genuinely finished it in a single day.

## why

honestly? it was funny, and i wanted to see if AI could replicate the specific kind of linkedin brain that produces content like "hot take: sleeping is underrated."

turns out... yes. yes it can.

i also wanted an excuse to try **next.js 16** with **react 19** — the new app router patterns are pretty clean.

## try it

[shitpost.anselmlong.com](https://shitpost.anselmlong.com)

enter a topic, get some posts, laugh (or cringe).

please don't actually post these to linkedin. i am not your mother — but i am asking you nicely.

## reflections

side projects don't need to be serious. this one exists purely because i thought it would be funny, and honestly? it was worth it for that alone.

sometimes you build things because they're useful.  
sometimes you build things because they're cool.

sometimes you build things because you saw a post about "my 5 am morning routine that doubled my productivity" and you thought "what if an AI wrote this but make it unhinged."

this is the third one.

if you want: check out the repo [here](https://github.com/anselmlong/linkedin-shitpost). PRs welcome — especially for new personas.
