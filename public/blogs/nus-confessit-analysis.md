---
title: "What 72,000 Confessions Reveal About NUS Students"
date: "2026-05-22"
author: "Anselm Long"
image: "/blogs/images/score_distribution.png"
tags:
  - machine learning
  - data analysis
  - nus
  - embeddings
  - umap
excerpt: "A deep dive into the embedding landscape, viral dynamics, and thematic structure of NUSConfessIT — a channel with 72K confessions and 129M views."
---

![Score distribution histogram](/blogs/images/score_distribution.png)

## Introduction

NUSConfessIT is a Telegram-based anonymous confession channel serving the NUS community. Since February 2024, it's accumulated over **72,000 confessions**, generating **129 million views** and countless reactions, replies, and discussions.

But what are students actually confessing about? Which topics go viral? Can we predict what content will blow up? This analysis uses ML embeddings (OpenAI text-embedding-3-small), UMAP dimensionality reduction, and clustering to map the confession landscape.

## At a Glance

- **72,172** total confessions
- **129M** total views
- **816** days active
- **23.3** mean composite score
- **11,121** highest score (a whistleblowing STD post, naturally)
- **26%** viral rate (top 25% of posts by score)

## The Score Distribution — A Long Tail of Engagement

Engagement follows a **heavily skewed distribution**. The median post scores just **15**, while the most viral post hit **11,121** — a 740× gap. The top 25% threshold sits at **28**, meaning 75% of all confessions cluster in a narrow low-engagement band.

This is classic social media dynamics: a small fraction of content captures most of the attention. The challenge is identifying *which* posts break through.

![Category breakdown](/blogs/images/category_breakdown.png)

## Categorisation Problem — And How ML Fixed It

The raw category field in the database is mostly useless — **78% of posts are uncategorised**, because the tag system was introduced late or confessors simply didn't use it. Among tagged posts, only vague "others" (21.7%) and a few niche tags exist.

This is exactly why we need **embedding-based clustering** — by looking at the *semantic content* of every post, we can build a more meaningful taxonomy without relying on user-applied tags.

## Growth Over Time — A Channel in Its Prime

![Monthly activity](/blogs/images/monthly_activity.png)

Since launching in February 2024, the channel has grown from a few hundred posts per month to **sustained volumes of 3,000+ posts monthly**. The peak occurred in late 2024, coinciding with the start of the academic year and major campus events.

The channel's longevity (816 days and counting) is unusual for anonymous confession pages, which typically burn out within months. NUSConfessIT's continued relevance suggests it fills a genuine community need.

## Mapping the Confession Universe

![UMAP embedding landscape](/blogs/images/umap_landscape.png)

We embedded all 72K confessions using **OpenAI text-embedding-3-small** (512 dimensions), then projected them into 2D using **UMAP**. The resulting landscape reveals a **continuous gradient** rather than hard cluster boundaries — confessions blend into one another along thematic axes.

The left plot shows every post as a dot, with viral posts (top 25%) highlighted in orange. The right plot reveals score intensity — hotter colours indicate higher engagement. Notice how viral posts concentrate in specific regions rather than being uniformly distributed.

### Four Main Regions

- **Academics (32%)** — mods, finals, major, course, lecture
- **Career & Hot Takes (31%)** — internship, work, students, linkedin, hustle
- **Dating & Relationships (29%)** — girl, guys, love, crush, friend
- **Lonely & Admin (8%)** — bored, chat, sleep, wanna, swap

The landscape splits into four broad regions, discovered through Mean Shift clustering (bandwidth=2.14) on the UMAP projection, validated against HDBSCAN. The regions are distinct in keyword profile but blend into one another at the boundaries — a true semantic gradient rather than hard clusters.

## What Goes Viral

![Viral rate by topic region](/blogs/images/viral_by_category.png)

The single most important finding: **dating & relationship content dramatically outperforms everything else**. The viral rate among dating-region posts is **~32%**, compared to ~23-25% for academics and career posts. That's a **~40% relative increase** in viral probability.

This makes intuitive sense: anonymous platforms lower the barrier for sharing personal romantic stories that people are reluctant to discuss publicly. The most viral post ever (score 11,121) was a whistleblowing post about a hall resident contracting an STD — a story that combines romance, scandal, and campus gossip.

> **Key insight:** If you want to go viral on NUSConfessIT, talk about relationships. Romance plus scandal is the most powerful combination. Pure academic complaints and career rants rarely break through the noise.

## Methodology

- **Embedding:** Each confession encoded with `text-embedding-3-small` (512 dimensions).
- **Dimensionality Reduction:** UMAP (15 neighbours, min distance 0.1) fit on 15K sample, transformed across all 72K posts.
- **Clustering:** Mean Shift (bandwidth=2.14) for region detection, validated against HDBSCAN. Four stable regions identified.
- **Virality:** Composite score = reactions + 2× replies + 3× forwards. Top 25% scored posts classified as viral.
- **Data Source:** Telegram API via t.me/NUSConfessIT. Live dashboard at [confessit.anselmlong.com](https://confessit.anselmlong.com).