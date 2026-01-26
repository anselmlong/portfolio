---
title: "Canvas Scraper (because i’m lazy)"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - scraping
  - automation
  - nus
  - python
excerpt: "i wanted my canvas stuff in one place, so i made a scraper."
---

## TL;DR

canvas is great until you have **too many modules** and everything is scattered.

i wanted a way to pull my course content + deadlines into something i control (and can query/search).

so i wrote a canvas scraper.

## the problem

canvas has all the information i need, but it’s:

- spread across pages
- annoying to export cleanly
- hard to “see everything at a glance”

what i actually wanted:

- a local folder of content i can search
- a list of upcoming deadlines
- a single “what changed since last sync” view

## constraints (aka: things that make scraping painful)

- auth (cookies, tokens, redirects)
- rate limits / “please stop botting”
- html that changes when you look at it funny

also: i didn’t want to maintain a million brittle selectors.

## what it does (current)

- logs in *(method depends on your setup)*
- crawls course pages
- downloads/normalizes content into a local structure
- optionally emits a summary (new/updated items)

*(i’ll add exact commands + screenshots once i clean it up a bit.)*

## high-level design

### 1) fetch layer

- keeps a session alive
- retries on flaky requests
- respects pacing (sleep/backoff)

### 2) parse + normalize

i prefer saving “good enough” structured artifacts:

- raw html (for debugging)
- markdown/text (for searching)
- json metadata (ids, timestamps, urls)

### 3) storage

i kept it simple:

- filesystem as the source of truth
- deterministic paths so diffs are meaningful

## what went wrong

### auth is the boss fight

if you take only one thing away:

> scraping is easy. authentication is the real feature.

### attachments are messy

some files have:

- weird filenames
- duplicates
- broken links

so you need content-addressing or de-duping eventually.

## some learning points!

- build the smallest successful sync first
- save raw responses so you can debug later
- make outputs deterministic so `git diff` tells you what changed

## links

- repo: *(todo)*
- writeup / docs: *(todo)*
