---
name: Viewfinder
description: A screening room for Anselm's own footage. His name is the window, answers open the frame, and the page below is scroll-driven.
colors:
  night: "#0d0a0a"
  panel: "#171414"
  line: "#2e2929"
  paper: "#f1efe8"
  dim: "#a09a98"
  accent: "#ff6f55"   # chilli, chosen by Anselm
  accent-ink: "#120b0a"
typography:
  display: "Big Shoulders 800/900, uppercase: names, section titles, the hero mask"
  body: "Schibsted Grotesk: interface and chat"
  read: "Newsreader: long-form blog posts"
  mono: "JetBrains Mono: labels, metadata, code"
---

# Viewfinder

## Principles
- **Real material is the spectacle.** The hero plays Anselm's own stabilized footage; the work reel shows live sites; photos are his. Designed frames (Ava, 67 bot, shitpost) are labelled "illustration".
- **The chat speaks as Anselm.** Answers come from the RAG in his voice, marked "AI-generated". Jev only picks which trusted card and scene to show; the page renders them.
- **Chilli is the only accent.** Everything else is night, paper and dim.
- **Motion has one job per place:** the name mask and lens in the hero, chip springs and streaming in the chat, one scroll mechanic per section (reel, dial, deck, contact-sheet zoom), and the shy "say hi".

## Motion rules
- Every scroll-driven section eases toward the scroll position; section heights come from a measured viewport in px.
- If the frame is much taller than the screen (a host scrolling for us), or the visitor prefers reduced motion, the page lays out flat: nothing pins or scrubs.
- The cursor reticle and springs only run for fine pointers.

## Where things live
- `src/lib/home-content.ts`: every topic, card, reel frame, role and post, with verified facts.
- `src/app/_home/*-engine.ts`: imperative engines, each `start(...) → cleanup`.
- `src/app/blog/blog.module.css`: the blog in the same tokens.
