---
name: Anselm Long Portfolio
description: Neutral conversation homepage with a charcoal project showcase.
colors:
  background: "#fafafa"
  text: "#202124"
  surface: "#fff"
  reply: "#eaecef"
  focus: "#4362d0"
  gallery: "#17191d"
  gallery-text: "#f5f5f6"
  kopitype: "#e2e7f1"
  routes: "#dce5dd"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(30px, 4vw, 42px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(32px, 4.5vw, 58px)"
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
rounded:
  reveal: "12px"
  feature: "14px"
  composer: "16px"
  choice: "22px"
spacing:
  choice-gap: "8px"
  reveal-gap: "10px"
  feature-gap: "24px"
components:
  suggested-reply:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.choice}"
    padding: "10px 13px"
  composer:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.composer}"
    padding: "16px 18px 10px"
  inline-project:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.reveal}"
    padding: "18px"
---

# Design System: Anselm Long Portfolio

## Overview

**Creative North Star: "A conversation with the work"**

A ChatGPT-like neutral conversation introduces the person and reveals real work inline. A charcoal gallery gives projects their own browsing space, with pale blue and green feature artwork and a quiet light biography below.

This replaces the copper visual world on the homepage only. Other routes retain legacy styling. Sources: `src/app/ConversationHome.tsx` and `src/app/ConversationHome.module.css`.

## Colors

Light neutral surfaces carry the conversation. User replies have a grey fill; assistant replies sit directly on the page. Blue identifies keyboard focus and the text caret. Pale blue and green project artwork sits inside the charcoal gallery. Global legacy copper tokens do not define this homepage.

## Typography

Geist, supplied through `--font-geist-sans`, handles every homepage role. Headings use tight tracking and moderate weights. Introductory prose uses the body role; conversation text uses 14px/1.6. Utility text ranges from 10px to 13px. Introductory prose is capped at 65ch and assistant replies at 70ch.

## Layout

The header is capped at 1440px. The conversation is capped at 840px, with 24px side clearance on desktop. Active transcripts scroll within 560px; suggestions and the composer stay below the transcript. The showcase uses an 1180px content span, two featured columns with a 24px gap and two project columns with a 48px gap.

At 760px and below, featured work, project listings and biography stack. The hero uses 16px side clearance; showcase and biography use 24px. The transcript cap becomes 480px, hero heading becomes 29px and messages become 13px. Some header links hide while footer navigation remains available.

## Elevation & Depth

Flat surfaces, thin borders and tonal separation provide depth without box shadows. Hover changes surfaces or underlines text; featured arrows move diagonally by 3px. Reply arrival lasts 0.35s with `cubic-bezier(0.16, 1, 0.3, 1)`, moving from 9px below while opacity rises from 0.4. Reduced motion disables animations and transitions.

## Shapes

Suggestion pills, a rounded composer and circular avatar/send control establish a familiar chat interface. User bubbles use asymmetric corners (18px 18px 4px 18px). Inline reveals and photos use the reveal radius; featured projects use the feature radius. Ordinary project listings remain open rows separated by hairlines.

## Components

Suggested replies append a user bubble and a curated answer with relevant project, experience, photo, contact or typing-game content. Assistant text stays unboxed. The typing preview has a visible label, per-character feedback, a status announcement and reset control; incorrect characters also use a wavy underline.

The composer is a labelled textarea with a circular 44px send button, a focus-within border and a nearby AI/privacy disclosure. Empty or busy submission is disabled. Errors appear as alerts and preserve the draft. New-chat, close and reopen controls manage the conversation. Browsing moves focus to the showcase; returning focuses the composer.

Inline project links combine a thin border, descriptive text and an arrow; hover changes the surface. Photo reveals crop with object-fit cover at center 35%. Gallery filters use `aria-pressed`, a check icon and a filled selected pill; a status announces the resulting count.

Buttons and primary navigation links have 44px interaction dimensions. Controls use a 2px blue focus outline offset by 4px. The transcript is a keyboard-focusable polite live log. Preserve visible labels, accessible icon-button names and reduced-motion behavior.

## Do's and Don'ts

- Do keep the conversation light and the project showcase charcoal.
- Do preserve keyboard focus, accessible labels, status feedback and reduced motion.
- Do reveal relevant work inline while keeping direct browsing available.
- Don't restore copper accents, serif display typography or photographic film framing to this homepage.
- Don't assume other routes have adopted this homepage design.
