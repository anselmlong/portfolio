---
title: "NUS Aircon Checker"
date: "2026-01-26"
author: "Anselm Long"
tags:
  - nus
  - automation
  - quality-of-life
excerpt: "the fastest way to become a builder is to get mildly annoyed by something daily."
---

## TL;DR

i got tired of guessing whether a room’s aircon would be on (or whether i’d be sweating in 10 minutes).

so i built a tiny “aircon checker” tool.

## the problem

this is one of those problems that’s not *important*, but it’s *frequent*.

- you walk somewhere
- you sit down
- the aircon is either freezing or nonexistent
- you regret your life choices

i wanted a quick way to check *(whatever signal is available)* before committing to a location.

## what the tool does

- pulls the current status from a source *(todo: specify source)*
- shows a simple output:
  - on/off (or “unknown”)
  - last updated time
  - optional: room/location

bonus goal: make it usable in <10 seconds.

## design notes

### keep the interface stupid

the best utility tools:

- one command
- one screen
- one answer

### handle uncertainty explicitly

real-world data is messy.

so rather than pretending we know, i prefer:

- `ON`
- `OFF`
- `UNKNOWN` (and why)

## what i learned

- “small” projects are great practice for shipping
- most real problems are integration + data quality, not code
- a clear output format beats a fancy ui

## next steps

- add a simple dashboard view
- add notifications (e.g. “aircon is on now”) if there’s a reliable signal

## links

- repo: *(todo)*
