---
title: "Canvas Scraper (because i’m lazy)"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - scraping
  - automation
  - nus
  - python
excerpt: "i prototyped a personal canvas file sync tool in ~3 hours. now i use it all the time." 
---

## TL;DR

canvas is great until you have **too many modules** and everything is scattered.

so i built a personal tool that:

- syncs course files to my laptop
- filters out giant junk (videos/textbooks)
- emails me a daily summary of announcements/assignments/files

and the funniest part is: the prototype was built in **~3 hours**.

repo: https://github.com/anselmlong/canvas-scraper

## the problem

what i wanted was simple:

- “give me all my module files locally”
- “tell me what changed”
- “stop making me click 800 buttons”

canvas *can* do a lot, but it’s not optimized for *my brain*, which wants:

> one folder, searchable, always up to date.

## the solution (what it does)

features i ended up adding (because i kept getting annoyed by new edge cases):

- **smart filtering**: skip huge files (>50mb), videos, and textbook-like pdfs
- **course selection** with fuzzy matching
- **incremental sync**: only download new/updated files
- **email reports** (html) so i can scan what changed without opening canvas
- **skipped file review**: email includes links for anything skipped
- **scheduled runs** via cron / task scheduler
- sqlite db to track downloads + skipped items

## why personal tools are so easy to build (and so worth it)

this project is the perfect example of “small tool, huge quality-of-life”.

- it doesn’t need product-market-fit
- it doesn’t need a fancy ui
- it just needs to solve *my* annoying problem

and because the feedback loop is immediate (i use it daily), it’s ridiculously motivating.

## what i actively use it for

- grabbing lecture slides/handouts without thinking
- catching new announcements/assignments
- making sure i don’t miss some random file the night before a lab

## next step: even more automation

i’m planning to push it further:

- upload newly downloaded files into **claude** automatically (so i can ask “what’s due next week” and it actually knows)
- add a “what changed since yesterday” diff that’s even more concise

## some learning points!

- auth is always the boss fight
- deterministic outputs make debugging 10x easier
- personal tools are underrated as a way to practice shipping

## links

- repo: https://github.com/anselmlong/canvas-scraper
