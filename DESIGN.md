---
name: Anselm Long Portfolio
description: Dark copper photographic identity with a guided conversational homepage.
colors:
  primary: "oklch(0.72 0.12 65)"
  background: "oklch(0.12 0.01 85)"
  foreground: "oklch(0.88 0.01 85)"
  card: "oklch(0.15 0.01 85)"
  border: "oklch(0.25 0.01 85)"
  guide-copper: "#dca063"
  guide-text: "#e9e2d8"
  guide-muted: "#bcb2a6"
  guide-artifact: "#211c17"
  guide-action: "#e0a770"
  guide-focus: "#dea367"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(38px, 5.4vw, 72px)"
    fontWeight: 350
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Source Serif 4, ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
    fontSize: "17px"
    lineHeight: 1.8
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "12px"
rounded:
  input: "4px"
  artifact: "6px"
spacing:
  inline-gap: "12px"
  action-gap: "16px"
  artifact-padding: "28px"
  conversation-gap: "48px"
components:
  path-choice:
    backgroundColor: "transparent"
    textColor: "#f1e8dc"
    padding: "24px 22px"
  path-choice-selected:
    backgroundColor: "#2a2119"
  artifact:
    backgroundColor: "{colors.guide-artifact}"
    rounded: "{rounded.artifact}"
  typing-input:
    backgroundColor: "#15120f"
    textColor: "#f4eadc"
    rounded: "{rounded.input}"
    padding: "14px"
  detail-toggle:
    textColor: "{colors.guide-action}"
---

# Design System: Anselm Long Portfolio

## Overview

The existing dark copper photographic identity carries into a guided, conversational homepage. Warm charcoal, copper accents, generous display type and restrained framed artifacts keep software demonstrations and photography in the same visual family.

This records the implemented system, not a new brand direction. Sources: `src/styles/globals.css`, `src/styles/theme.css`, `src/app/layout.tsx`, and `src/app/_components/GuidedPortfolio.{tsx,module.css}`.

## Colors

Copper marks emphasis, navigation and selection; warm charcoal supports images and demonstration panels. The global palette retains its native OKLCH values. Guided-home colors retain their actual local hex values; they are not aliases for the global tokens. Cream text and warm grey supporting copy soften the dark surfaces.

The root layout uses the warm root palette without the generic `.dark` override. Earlier pink/blue declarations remain in `theme.css`; they are not the visual authority for this homepage.

## Typography

Bricolage Grotesque supplies the guided display and chapter headings. Source Serif 4 is the inherited reading face; Geist identifies labels, identity and utility links. Playfair Display remains the italic editorial accent elsewhere in the portfolio.

The introductory paragraph uses 18px/1.7, dropping to 16px on narrow screens. Chapter prose uses the body role above. Preserve the distinction between conversational reading copy and compact utility labels.

## Layout

The guided container has a 1160px maximum width and 120px 32px 64px padding. Its three equal path choices sit between hairlines; an active conversation pairs story and artifact in two equal columns with the conversation gap above.

At a maximum width of 760px, choices and conversation stack. Container padding becomes 94px 22px 40px, conversation gap becomes 20px and artifact interior padding becomes 22px. Identity links wrap onto their own row. Existing film tracks and experience rows use a separate 768px breakpoint.

## Elevation & Depth

Guided artifacts use tonal surfaces, thin warm borders and clipping, without a raised shadow. Selected choices have a copper inset underline. The wider portfolio retains subtle grain, film frames and localized copper hover depth; these are existing photographic treatments, not requirements for every control.

## Shapes

Guided artifact and input corners use the small radii above. Identity portraits are circular. Existing film cards are nearly square at 4px; optional AI prompt pills retain their separate fully rounded treatment.

## Components

Path choices use a title, supporting hint and direction icon, with a darker hover/selected surface and a selected inset line. Keep their `aria-pressed` state.

Chapter controls and project links have at least 44px interaction height. The typing field has at least 48px height, an explicit label, a placeholder and a disabled opacity of 0.75. Correct typing is pale green; incorrect characters are salmon with a wavy underline.

Keyboard focus uses a 2px copper outline offset by 5px throughout the guide. Conversation and artifact arrival lasts 0.35s, moving upward from 8px while opacity rises from 0.5. Reduced motion disables these animations and choice transitions.

Photographic artifacts crop with object-fit cover; the guided photo is capped at 360px tall, positioned at center 35%, and followed by a caption. Route previews are labelled illustrative examples. Optional AI conversation remains a separate disclosure.

## Do's and Don'ts

- Do retain the dark copper palette and photographic identity.
- Do preserve visible keyboard focus, readable labels and reduced-motion behavior.
- Don't treat legacy pink and blue theme declarations as the homepage palette.
- Don't promote the guided homepage composition into a rule for every page.

