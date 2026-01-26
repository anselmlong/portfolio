---
title: "NUS Aircon Checker: Reverse Engineering A Flutter Portal (With Opencode)"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - nus
  - automation
  - reverse-engineering
  - telegram
excerpt: "Reverse engineering an API from a website was weirdly thrilling. Also, opencode is cracked." 
---

## TL;DR

I got tired of forgetting to top up my aircon credits and waking up sweaty.

So I built a Telegram bot that checks your EVS2 portal aircon credits in one command.

Repo: https://github.com/anselmlong/nus-aircon-checker

## The Fun Part: Reverse Engineering The API

This was weirdly thrilling.

The EVS2 consumer portal is a Flutter web app, which usually means:

- the UI is annoying to scrape
- but the network requests are pretty consistent

So instead of doing brittle DOM scraping, I just watched the network calls and copied the backend endpoints.

It calls the same backend endpoints as the portal.

If you’ve never done this before, it feels like cheating:

> The website is just a UI. The real product is the API behind it.

## I Just Had To Guide Opencode

A big reason this shipped quickly is that I used **opencode**.

It’s one of those tools where you feel like:

> Wait… why is this allowed?

My workflow was basically:

- I do the thinking / decide the plan
- opencode does the boring implementation
- I keep it on a leash so it doesn’t hallucinate a whole new architecture

This is also why I’m bullish on **oh-my-opencode** — it’s genuinely insane leverage if you have decent taste + a clear plan.

## What The Bot Does

Commands:

- `/login <user> <pass>` (DM only; stored in-memory)
- `/balance` for current credits
- `/usage`, `/avg`, `/predict` for breakdowns and run-out estimation
- optional low-balance reminders

## Security Notes

- Login only works in private DMs
- Credentials are stored in-memory only (cleared on restart)
- Optional allowlist via `TELEGRAM_ALLOWED_USER_IDS`

## Some Learning Points!

- The best “scraping” is not scraping. It’s copying the API.
- Backend permissions are a puzzle (sometimes “read” works where “list” is forbidden)
- Building small utility bots is ridiculously fun

## Links

- Repo: https://github.com/anselmlong/nus-aircon-checker
