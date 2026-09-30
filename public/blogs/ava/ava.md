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

## What else lives on the box

Ava isn't the only tenant. That same $12 VPS (about 8 GB of RAM, no swap) runs pretty much everything I've built this year:

| Project | What it is | Users |
|---|---|---|
| [Aircon checker](https://bot.anselmlong.com/aircon) | NUS hostel aircon credit watcher | ~450 |
| [67 bot](https://bot.anselmlong.com/67bot) | Counts every "67" posted in a group chat, with OCR + vision | ~270 |
| [Kopitype](https://kopitype.com) leaderboard | Leaderboard API for my Singlish typing test | ~140 |
| [NUS USC Routes](https://bot.anselmlong.com/routes) | Climbing-route archive bot + mini-app API | ~90 |
| [Daily gospel bot](https://bot.anselmlong.com/gospel) | Full Mass readings at the hour you choose | |
| [Random gospel bot](https://bot.anselmlong.com/random-gospel) | Whole gospel passages at random times of day | |
| [MassGoWhere bot](https://bot.anselmlong.com/massgowhere) | Finds the Mass you can actually reach in time | |
| [Surprise prayer bot](https://bot.anselmlong.com/prayer) | Anonymous prayer partners, reshuffled weekly | |
| [Laundry bot](https://bot.anselmlong.com/laundry) | "Can I hang my laundry today?" from NEA forecasts | |
| [NUSCC attendance bot](https://bot.anselmlong.com/attendance) | Geofenced climbing club check-in | |
| ConfessIT | Scraper + API behind [confessit.space](https://confessit.space) | |
| govML | API for my government-datasets ML project | |
| BetaView | Climbing-video computer vision API | |

Most are systemd services, three are Docker containers, and nginx sits in front of the ones that need to be public. All nine bots now have landing pages at [bot.anselmlong.com](https://bot.anselmlong.com).

## The September health pass

Thirteen projects on one box means things break quietly. So in late September I sat down with Claude Code and did a proper health pass: every service, every container, every public endpoint, every cron job. Most things were fine. These weren't.

### BetaView had been crash-looping for 19 days

Over **11,000 restarts in a single day**, and it had been doing that since September 9.

The cause was embarrassing. I had an uncommitted change that switched BetaView's coaching feature from the Anthropic SDK to OpenAI (plus a new, very rude "abusive coach" mode). The code imported `openai`, but I never installed it in the service's virtualenv. Uvicorn died on import, systemd restarted it, forever.

The fix was installing the package and actually pinning it in `requirements.txt`.

**Lesson:** "restart always" hides failures. A service can show as `active` and be dead in every way that matters. Check restart counts, not just status.

### A TLS certificate was about to expire (and a second would have followed)

Certbot's renewal for the Kopitype API had been failing for days, with **21 days** left on the certificate.

This one was sneaky. Every site has an nginx block for port 80, and certbot renews by adding a temporary challenge path to the matching block. But one site, the routes mini-app, listened on port 80 on the server's **specific public IP**, while the others used the generic `listen 80`. Nginx always prefers the more specific address, so every plain-HTTP request landed in the routes block, including Let's Encrypt's challenge for Kopitype. 404.

Switching routes to the generic `listen 80` fixed it. The govML certificate would have hit exactly the same wall about a month later.

**Lesson:** read the actual challenge error. A 404 from the right IP means "the request reached you, and something else answered it."

### gbrain had been dead since July

gbrain, a knowledge-base server Ava could query, was meant to start on boot from a cron `@reboot` line. The server rebooted on July 9, cron couldn't find the `gbrain` binary on its minimal `PATH`, and it never came back. Nobody noticed for eighty days.

If nobody notices something's dead for eighty days, you don't need it. I removed it completely, and kept a backup of its data just in case.

### Housekeeping

The disk was at 80%. Clearing package caches (npm, bun, pip, uv), stale Next.js build folders for sites Vercel serves anyway, and the systemd journal (the BetaView crash loop had filled a lot of it) took it down to **65%**, about 10 GB freed. No `.env` files, databases or virtualenvs were touched.

### Still rough

- **Memory is tight.** No swap, and the 67 bot's vision pipeline alone holds over 1 GB.
- **Vercel blocks deploys** from commits whose email isn't linked to my GitHub account. I hit it while shipping the new bot pages. I should fix my git email.

Next step: turn this pass into one of Ava's cron jobs, so it reports restart loops and failing renewals before they're three weeks old.

## Is it perfect?

No. It's an agent, so sometimes it confidently does the wrong thing. My favourite entry in its own work log is cleaning up a deployment conflict... that it caused itself. I still read what it does before anything important goes out.

But the barrier between "I have an idea" and "it's live" is basically gone now, and that's changed what I bother to build. Small, dumb, fun projects are suddenly worth doing, because they cost me a few messages instead of a free weekend.

If you've been meaning to try an agent setup like this, just do it. $12 a month is less than my matcha budget.
