---
title: "Building a Retrieval-Augmented Investigation Assistant"
date: "2026-07-31"
author: "Anselm Long"
tags:
  - rag
  - visa
  - internship
  - retrieval
  - llm
  - fastapi
  - nextjs
excerpt: "12 weeks at Visa, watching the largest payment network in the world scroll past on green-on-black terminals, and building SAGE, a retrieval-augmented assistant to help operators investigate incidents faster."
---

This is the story of my 12 weeks at Visa. My first time actually working at a big company, and it was genuinely cool to see the stuff my team was working on.

Read the [full technical report here](/blog/visa-internship-report).

## The first day

I remember my first day. I walked in, and I could see my teammates had screens on their monitors, three monitors each. On one of them, there were nine different windows with blue terminal text rapidly scrolling. Apparently that's the commands being run on the mainframe, and the outputs. So we could actually see the actual mainframe of Visa, the largest payment network in the world, on the terminal screens themselves. I thought that was pretty insane.

Another thing I could do was use this Visa tool called Vital Signs. You could find someone's transactions just from there, using their Primary Account Number, the 16-digit number on any Visa card. Give me any number, and I could see what you bought in the last 24 hours, the last week, and so forth. That blew my mind. That scale, and the kind of things you could do because of it.

And on top of that, there were pretty crazy things. Searching just the last 5 minutes, there were 10,000 transactions that returned errors. The fact that there were that many errors just shows the volume we had to deal with. I think our main processing system could handle around 80,000 transactions per second, which is honestly pretty insane.

## An old system that refuses to die

The thing that impressed me most was the amount of risk riding on a system that didn't change at all. It's a very legacy system called z/TPF, which stands for Transaction Processing Facility. It was made in the 1960s by IBM. And I kept wondering, why are we still using such an old system? Apparently they actually tried to modernise and move to a different system, but z/TPF was just so fast and so reliable that nothing could replace it. Hence, there are engineers who have worked on this system their whole lives, and they're here at Visa because not a lot of places use this system anymore.

That was quite poignant. Something written in, I think, assembly code was still faster than the programs people write nowadays.

## The real hurdle: domain knowledge

Because of that, the main hurdle of this internship was that, for most of the things I was working on, I had no idea about them. It was really hard to get domain knowledge about this system and the entire transaction space itself. And a lot of the things I worked on with SAGE weren't really easy to decipher.

## What I actually built: SAGE

Since I'm talking about SAGE, let me run you through what I spent those 12 weeks on. It's essentially building a system to make investigations easier. My team works on incidents. Things like transaction declines, transactions failing where they're not supposed to fail, config issues, disk failures, system malfunctions.

SAGE, the Searchable Archive for Guided Escalation, was built to help operators get a sense of what actually went wrong. Incident records were scattered across diary dumps, incident reports, and email threads, with no single searchable database. I built a pipeline that cleans and consolidates those records, taking 7,950 source records down to 2,693 incident clusters. It embeds them with OpenAI's `text-embedding-3-large` into `pgvector`, and retrieves them with a hybrid of BM25 keyword search and vector search fused by Reciprocal Rank Fusion.

On top of retrieval, SAGE parses raw logprints, the dense transaction traces from z/TPF. It surfaces critical fields like STIP reason codes, renders the transaction flow, and uses a Claude agent to ground a first diagnosis in both historical incidents and the Visa technical specs.

On my synthetic 100-question benchmark it hit a 92% top-8 retrieval hit rate, 0.728 MRR, and a 4.62/5 LLM-judged answer score. The team's informal estimate was roughly an hour saved per incident investigation.

<figcaption>Continued in the full report 🚧</figcaption>
