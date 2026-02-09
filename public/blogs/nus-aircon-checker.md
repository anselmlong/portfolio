---
title: "NUS Aircon Checker: Reverse Engineering A Flutter Portal (With Opencode)"
date: "2026-01-26"
author: "Anselm Long (Co-authored by Ava)"
tags:
  - nus
  - automation
  - reverse-engineering
  - telegram
excerpt: "I reverse engineered an API from a website with oh-my-opencode." 
---

## TL;DR

I got tired of forgetting to top up my aircon credits and waking up sweaty.

So I built a Telegram bot that checks your EVS2 portal aircon credits in one command.

Check it out on Telegram @aircon_checker_bot!

Repo: https://github.com/anselmlong/nus-aircon-checker

## The Fun Part: Reverse Engineering The API

This was weirdly thrilling.

The EVS2 consumer portal is a Flutter web app, which usually means:

- the UI is annoying to scrape
- but the network requests are pretty consistent

The website is just a UI. The real product is the API behind it.

## I Just Had To Guide Opencode

A big reason this shipped quickly is that I used **opencode**.

My workflow was basically:

- I do the thinking / decide the plan
- opencode does the boring implementation
- I keep it on a leash so it doesn’t hallucinate a whole new architecture

oh-my-opencode is opencode on steroids - it creates multiple agents that do your work super fast.

There were some bugs here and there - it didn't work for certain rooms because the API requests were different. There was once I had to inspect the network calls and feed that into opencode manually so it could change its own API calls. Otherwise, it managed to one shot the most important feature - checking the balance.

> Building small utility bots is ridiculously fun

## What The Bot Does

Commands:

- `/login <user> <pass>` (DM only; stored in-memory)
- `/balance` for current credits
- `/usage`, `/avg`, `/predict` for breakdowns and run-out estimation
- optional low-balance reminders

## Build your own personal tool!

It's easier than ever to build something for a very specific use case. Even if no one else uses this - it still saves me time and effort. So it's worth the build!
