---
title: "NUS Aircon Checker"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - nus
  - automation
  - reverse-engineering
  - telegram
excerpt: "reverse engineering an api from a website was weirdly thrilling. also, opencode is cracked." 
---

## TL;DR

i got tired of forgetting to top up my aircon credits and waking up sweaty.

so i built a telegram bot that checks your EVS2 portal aircon credits in one command.

repo: https://github.com/anselmlong/nus-aircon-checker

## the fun part: reverse engineering the api

this was *weirdly thrilling*.

the EVS2 consumer portal is a flutter web app, which usually means:

- the ui is annoying to scrape
- but the network requests are actually very consistent

so instead of doing brittle dom scraping, i just… watched the network calls and copied the backend endpoints.

it calls the same backend endpoints as the portal.

## “i just had to guide opencode”

honestly, a big part of why this was fast is that i used **opencode**.

it’s one of those tools where you feel like:

> wait… why is this allowed?

my workflow was basically:

- i do the thinking / decide the plan
- opencode does the boring implementation
- i keep it on a leash so it doesn’t hallucinate an entire new architecture

this is also why i’m bullish on **oh-my-opencode** — it’s genuinely insane how much leverage you get when you have a decent “agentic” workflow + good prompts.

## what the bot does

- `/login <user> <pass>` (dm only; stored in-memory)
- `/balance` to check current credits
- `/usage`, `/avg`, `/predict` for breakdowns + run-out estimation
- optional low-balance reminders

## security notes

- login only works in private dms
- credentials are in-memory only (cleared on restart)
- optional allowlist via `TELEGRAM_ALLOWED_USER_IDS`

## some learning points!

- the best “scraping” is not scraping. it’s copying the api.
- backend permissions are a puzzle (sometimes “read” works where “list” is forbidden)
- building small utility bots is ridiculously fun

## links

- repo: https://github.com/anselmlong/nus-aircon-checker
