---
title: "Ava: Anselm’s Virtual Assistant (WIP)"
date: "2026-01-26"
author: "Anselm Long (with Ava)"
tags:
  - clawdbot
  - automation
  - agents
  - productivity
excerpt: "i set up ava (my virtual assistant) on clawdbot. here’s what she can do so far, what i configured, and what’s next. (this is a wip draft)"
---

> **note:** this post is a **work-in-progress**. i’m writing it as i set things up, so it’s messy + incomplete by design.

## TL;DR

i’m running **ava** — my virtual assistant — inside **clawdbot**.

so far she can:
- talk to me on telegram
- run browser automation (now with real chrome, not snap chromium headaches)
- schedule reminders (anki, etc)
- help edit my codebase + portfolio posts

## why i wanted a virtual assistant at all

i keep accumulating tiny tasks that aren’t *hard*, but they have enough friction that i just… don’t do them.

stuff like:
- “remind me to do anki daily”
- “summarize what i did this week”
- “open a site and scrape one thing”
- “touch up a blog post”

so the goal is: outsource the friction.

## what is ava?

ava is basically:
- a clawdbot agent (running on a server)
- with tools (browser, web search/fetch, github, cron reminders)
- connected to my telegram

not trying to be jarvis. more like: a really fast intern that never sleeps and doesn’t mind tedious things.

## what i’ve configured so far (concrete steps)

### 1) telegram as the main interface
- set up the **telegram** channel
- dm policy: pairing (so it doesn’t reply to random people)
- group policy: allowlist (only allowed groups)

### 2) browser automation that actually works
this was surprisingly annoying at first.

linux servers often default to `chromium` as a snap wrapper, which then… doesn’t work in the ways you’d like for headless automation.

i ended up installing **google chrome stable** (deb) and configuring clawdbot to use:

- `browser.executablePath=/usr/bin/google-chrome-stable`

then we sanity-checked it by opening a page and snapshotting it successfully.

### 3) reminders / cron jobs
- nightly **anki reminder** at 22:00 (asia/singapore)

### 4) portfolio + dev workflow help
ava helped with:
- drafting/updating portfolio blog posts
- tweaking the `/blog` listing to show cards (more above-the-fold)
- dealing with npm dependency nonsense (`ERESOLVE`) in the portfolio repo

## things that didn’t work (yet)

### linkedin (option 1)
we tried using the managed browser to read my linkedin profile.

linkedin immediately throws you into the login wall, and doing login properly requires either:
- a visible browser (vnc/noVNC/etc), or
- controlling my already-logged-in local chrome tab via browser relay

i didn’t want to set up remote desktop just for this, so we dropped it for now.

## what’s next (todo)

- gmail integration (oauth + tailscale funnel)
- make ava better at “weekly summary” style check-ins
- more automations (calendar? school admin chores?)

---

wip. i’ll come back and make this a real post once the setup stabilizes.
