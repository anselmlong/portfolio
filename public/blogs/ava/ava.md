---
title: "Ava: How I Code Now (Mostly From Telegram)"
date: "2026-09-27"
author: "Anselm Long"
image: "/videos/launch/ava.jpg"
tags:
  - agents
  - hermes
  - telegram
  - vercel
  - workflow
excerpt: "My agentic setup: a Hermes agent on a $12 VPS that takes an idea from a Telegram message all the way to a deployed site on my own domain."
---

## TL;DR

Ava is my personal agent. It's [Hermes Agent](https://github.com/NousResearch/hermes-agent) hooked up to Telegram, running DeepSeek V4 Flash, living on an OVH VPS that costs me about $12 a month. It has my GitHub and Vercel, so I can go from "hey what if..." to a live site on my own domain without ever opening a terminal.

Lowkey, it's changed how I code.

<video controls preload="metadata" playsinline poster="/videos/launch/ava.jpg">
  <source src="/videos/launch/ava.mp4" type="video/mp4" />
  <a href="/videos/launch/ava.mp4">Watch the video</a>.
</video>
<figcaption>ava in 20 seconds</figcaption>

## Wait, didn't you already build an Ava?

Yes... kind of. The [first Ava](https://github.com/anselmlong/ava) was a LangGraph + Gemini Telegram bot I was building from scratch: long-term memory with pgvector, user approvals, goal tracking marked "coming soon". It was a project in progress, and honestly I was spending more time building the agent than using it.

So I stopped. The current Ava runs on Hermes, and the old repo is now officially superseded. Same name, same Telegram chat, completely different brain.

## The setup

It's surprisingly simple:

- **Hermes Agent**: the agent itself. It keeps memory across sessions, drives a real terminal and browser, learns skills, and runs scheduled jobs.
- **Telegram**: how I talk to it. That's the whole interface.
- **DeepSeek V4 Flash** (through OpenRouter): the model. Cheap and fast enough that I don't think twice about sending it a random idea at 1am.
- **An OVH VPS**: about $12 a month. Ava lives there 24/7, so it doesn't care whether my laptop is open.
- **GitHub + Vercel**: this is the magic part. With access to my repos and my Vercel account, it can actually ship things.
- **My own domain**: which I also bought, so everything it deploys lands somewhere real.

## How I actually code now

This is the part I wanted to write about. My workflow these days looks something like this:

1. **I send Ava an idea.** Usually from my phone, usually half-formed.
2. **Ava triages it.** Is this a new project or a change to an existing one? If it's existing, it pulls the repo from my GitHub so it's working from the real code, not vibes.
3. **We plan it together.** Back and forth on Telegram until the plan makes sense. This step matters more than I expected: a bad plan just gets you a bad PR faster.
4. **It builds and pushes to git.** Commits go to GitHub like any other change.
5. **Vercel deploys it.** On my own domain, with a preview I can check from my phone.

So I can craft ideas on the go and deploy them without even opening a terminal. Wherever I am. A lot of the stuff on this site started as a Telegram message to Ava.

## It learns skills

Hermes has this idea of **skills**: reusable procedures the agent writes for itself after figuring something out. Instead of rediscovering the same fix every time, it saves the recipe.

Some of Ava's are hilariously specific, because they came from real pain:

- how to send Telegram messages *reliably*
- how to debug a cron job whose environment is different from your shell's
- how to debug environment variables that come back masked
- how to dig into Vercel analytics

Every one of those is a problem it hit once, solved, and now just knows. It's kind of like watching a junior dev build up their personal notes, except it never forgets them.

## Cron jobs

The other thing I use a lot is scheduled jobs. Ava runs a bunch of things on its own, like:

- a daily Hacker News digest
- pre-caching tomorrow's readings for my [gospel bot](https://bot.anselmlong.com/gospel)
- keeping [ConfessIT's](https://confessit.space) reaction counts fresh
- birthday reminders pulled from my calendar (a lifesaver, genuinely)

No separate servers, no GitHub Actions YAML to babysit. I just ask for it in Telegram and it sets up the schedule.

## Is it perfect?

No. It's an agent, so sometimes it confidently does the wrong thing. My favourite entry in its own work log is cleaning up a deployment conflict... that it caused itself. I still read what it does before anything important goes out.

But the barrier between "I have an idea" and "it's live" is basically gone now, and that's changed what I bother to build. Small, dumb, fun projects are suddenly worth doing, because they cost me a few messages instead of a free weekend.

If you've been meaning to try an agent setup like this, just do it. $12 a month is less than my matcha budget.
