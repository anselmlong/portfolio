---
task: Photography portfolio page
page_goal: Create an aesthetic, accessible photo portfolio page reachable from the site nav
---

# Task: Photography Business Portfolio Page

Build a dedicated portfolio page for a photography business. The page must be reachable from the site’s navigation bar and display photos in a clean, modern, *aesthetic* layout that is responsive and accessible.

## Background / Intent

This site needs a “Portfolio” section that showcases photography work. Visitors should be able to quickly scan a curated set of images, open them for a closer look, and navigate comfortably on mobile and desktop.

## Scope

- Add a new portfolio page/route (e.g., `/portfolio` or `/photography`).
- Add a navigation link so the page is discoverable site-wide.
- Implement an attractive photo gallery layout with good UX.
- Ensure accessibility (keyboard, screen reader, reduced motion).

## UX + Visual Design Guidelines

- Gallery should feel “editorial”: generous spacing, consistent rhythm, minimal chrome.
- Use a responsive grid that adapts from 1 column (small screens) to multi-column (desktop).
- Images should be optimized: correct sizing, lazy-loading, and smooth but subtle hover/transition.
- Provide a lightbox/modal experience for viewing larger images.

## Accessibility Requirements

- All images must have meaningful `alt` text (or empty alt only if purely decorative).
- Lightbox/modal must be keyboard accessible:
  - `Enter`/click opens a photo.
  - `Esc` closes.
  - Focus is trapped while open and returns to the triggering element on close.
  - Arrow keys (optional) move prev/next, or provide visible buttons.
- Respect `prefers-reduced-motion` (disable heavy animations).
- Ensure sufficient color contrast for text and controls.

## Photo Content

Use one of the following (choose what best fits the repo):

- **Preferred:** Real portfolio images placed in an assets folder already used by the project.
- **Acceptable for development:** A small set of placeholder images (but keep the structure so real images can be swapped in easily).

Each photo should support:
- `src`
- `width`/`height` (or aspect ratio)
- `alt`
- Optional metadata: `title`, `location`, `year` (only if it improves the page)

## Functional Requirements

- A “Portfolio” nav item is visible and routes correctly.
- The portfolio page renders a gallery of photos.
- Clicking/tapping a photo opens a larger view (lightbox).
- Gallery is responsive and performs well.

## Success Criteria (Acceptance Checklist)

1. [ ] A new portfolio route/page exists and is reachable at a stable URL.
2. [ ] The navigation bar includes a “Portfolio” link that highlights correctly (if active state exists).
3. [ ] The portfolio page displays a curated set of photos in a responsive, aesthetic gallery layout.
4. [ ] Images are optimized (lazy-loading, appropriate sizing, no obvious layout shift).
5. [ ] Lightbox/modal supports open/close and does not break scrolling or page focus.
6. [ ] Lightbox/modal is accessible (keyboard, focus management, `Esc` closes).
7. [ ] All images have appropriate `alt` text.
8. [ ] Layout works on mobile, tablet, and desktop (no overflow, controls reachable).
9. [ ] Styling matches existing site design system (fonts, spacing, colors).

## Implementation Notes (Use Frontend Skills)

- Prefer a **masonry-like** layout or balanced grid for visual interest.
- Use modern CSS (Grid/Flex), `object-fit: cover`, consistent border radius/shadow (subtle).
- Consider progressive enhancement:
  - Basic grid works without JS.
  - Lightbox enhances interaction when JS is available.
- If the stack supports it, use image components/features already present in the repo (e.g., responsive image helpers) rather than reinventing.

## Manual QA Checklist

- Nav link works from every page.
- Tabbing reaches the gallery items; pressing `Enter` opens a photo.
- `Esc` closes the lightbox and focus returns to the same photo.
- Mobile: gallery is comfortable to scroll; lightbox controls are tappable.
- Reduced motion: animations are minimal/disabled.

---

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ]).
2. Check off completed criteria (change [ ] to [x]).
3. Run the project’s usual lint/test/build checks after changes (use the repo’s standard commands).
4. Do not commit unless explicitly requested.
5. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`.
6. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`.
