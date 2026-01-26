---
title: "Canvas Scraper: A 3-Hour Prototype That Turned Into A Daily Tool"
date: "2026-01-26"
author: "Anselm Long (Co-authored by Ava)"
tags:
  - nus
  - automation
  - scraping
  - python
excerpt: "I was lazy to click buttons, so I built a Canvas file sync tool. Now I actually use it." 
---

## TL;DR

Canvas is great until you’re taking **too many modules** and everything is scattered.

So I built a personal tool that:

- syncs course files to my laptop
- filters out giant junk (videos / textbooks)
- emails me a daily summary of announcements / assignments / downloads

The funniest part: the prototype was built in **~3 hours**.

Repo: https://github.com/anselmlong/canvas-scraper

## The Problem

What I wanted was simple:

- “Give me all my module files locally.”
- “Tell me what changed.”
- “Stop making me click 800 buttons.”

Canvas *can* do a lot, but it’s not optimized for my brain, which wants:

> One folder. Searchable. Always up-to-date.

## What The Tool Does

This started small and slowly became a “keep adding features because I keep getting annoyed” project.

Current features (high-level):

- **Smart filtering**: skip huge files (>50MB), videos, and textbook-like PDFs
- **Course selection** with fuzzy matching
- **Incremental sync**: only downloads new/updated files
- **Email reports** (HTML) so I can scan updates without opening Canvas
- **Skipped file review** with direct links
- **Scheduling** via cron / Task Scheduler
- SQLite database to track downloaded + skipped files

## Why Personal Tools Are So Easy (And So Worth It)

This is the best kind of project because:

- it doesn’t need product-market-fit
- it doesn’t need a UI
- it just needs to solve *my* annoying daily problem

And the feedback loop is instant: I either use it tomorrow… or I don’t.

## What I Actually Use It For

- grabbing lecture slides/handouts without thinking
- catching new announcements/assignments
- avoiding the “oh my god this file existed??” moment the night before a lab

## Next Step: Even More Automation

I want to take it further by:

- auto-uploading newly downloaded files into **Claude** (so I can ask “what’s due next week?” and it actually knows)
- generating an even more concise “what changed since yesterday” summary

## Some Learning Points!

- Auth is always the boss fight.
- Deterministic outputs make debugging 10x easier.
- Personal tools are underrated as a way to practice shipping.

## Links

- Repo: https://github.com/anselmlong/canvas-scraper
