# Aurora Fluid Hero Background

## TL;DR

> **Quick Summary**: Add a WebGL aurora/fluid light shader as an atmospheric hero background behind the existing content in ClientHome.tsx. Slow organic flowing warm light using copper and charcoal palette.
>
> **Deliverables**:
>
> - `src/app/_components/AuroraBackground.tsx` — WebGL canvas component with fragment shader
> - Updated `src/app/ClientHome.tsx` — integrate AuroraBackground into hero section
>
> **Estimated Effort**: Short
> **Parallel Execution**: NO — single component, sequential implementation
> **Critical Path**: Shader implementation → Component integration → Visual polish

---

## Context

### Original Request

"i want to add a nicer hero page for my website, but i'm not sure what would be a good visualisation/shower for me." User chose aurora/fluid light wash after reviewing options.

### Interview Summary

**Key Discussions**:

- Visual direction: Slow, organic flowing warm light — atmospheric and elegant
- Palette: Must match existing cinematic editorial theme (deep warm charcoal + muted copper/gold)
- Interaction: Subtle mouse influence on flow

**Research Findings**:

- Hero section is a client component in `src/app/ClientHome.tsx` with GSAP animations
- Color system uses oklch tokens defined in `src/styles/globals.css`
- Body already has a noise texture overlay via CSS (z-index 50)

### Metis Review

Not available (task aborted). Self-review covers edge cases below.

---

## Work Objectives

### Core Objective

Create a WebGL fragment shader that renders slow-flowing aurora-like light using simplex noise FBM, composited behind hero text. Must match existing copper/charcoal palette, handle resize, cleanup on unmount, and degrade gracefully.

### Concrete Deliverables

- `src/app/_components/AuroraBackground.tsx` — new component
- `src/app/ClientHome.tsx` — add AuroraBackground to hero section

### Definition of Done

- [ ] Aurora renders behind hero text without blocking interaction
- [ ] Colors match existing palette (copper/gold on charcoal)
- [ ] 60fps on desktop, graceful degradation on mobile
- [ ] Respects prefers-reduced-motion
- [ ] WebGL unsupported → fallback to animated CSS gradient
- [ ] Canvas cleans up on unmount, no memory leaks
- [ ] Canvas resize handles window resize and retina displays

### Must Have

- WebGL fragment shader using simplex noise + FBM for organic flow
- Time-based animation uniform
- Mouse position uniform for subtle flow displacement
- CSS fallback for no-WebGL environments
- prefers-reduced-motion → static gradient or reduced animation speed

### Must NOT Have (Guardrails)

- No new npm dependencies — pure WebGL, no Three.js or libraries
- No interference with existing GSAP animations
- No blocking of initial page paint (lazy-load after content visible)
- No full-viewport coverage — constrained to hero section area only
- No opaque background — must be semi-transparent to preserve body background color

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: NO (no test framework configured)
- **Automated tests**: None
- **Agent-Executed QA**: Browser automation via Playwright to verify visual rendering, interaction, and fallback behavior

### QA Policy

Every task MUST include agent-executed QA scenarios.

- **Frontend/UI**: Playwright — open page, inspect canvas element, verify rendering, test mouse interaction, screenshot

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Single task — component creation):
└── Task 1: Create AuroraBackground component with WebGL shader

Wave 2 (Integration):
└── Task 2: Integrate into ClientHome.tsx hero section

Wave 3 (Polish + fallback):
└── Task 3: Add WebGL fallback, reduced-motion support, retina sizing
```

### Dependency Matrix

- **1**: -
- **2**: 1
- **3**: 2

### Agent Dispatch Summary

- **1**: T1 → `visual-engineering` (shader + canvas work)
- **2**: T2 → `visual-engineering` (integration)
- **3**: T3 → `visual-engineering` (fallbacks + polish)

---

## TODOs

- [ ] 1. Create AuroraBackground component

  **What to do**:
  - Create `src/app/_components/AuroraBackground.tsx` as a `"use client"` component
  - Implement WebGL vertex shader (fullscreen quad pass-through)
  - Implement fragment shader with:
    - Simplex noise function for organic flow
    - Fractal Brownian Motion (FBM) with 3-4 octaves for layered movement
    - Time uniform `u_time` for animation
    - Mouse uniform `u_mouse` for subtle flow displacement
    - Color mapping: blend copper (`vec3(0.72, 0.55, 0.35)`) through gold to charcoal/dark
    - Soft edge falloff at top/bottom for atmospheric fade
  - Setup WebGL context, compile shaders, create buffer
  - Use `requestAnimationFrame` loop to drive `u_time`
  - Track mouse position via `mousemove` listener, normalize to 0-1
  - Handle canvas resize with `ResizeObserver` or window resize
  - Cleanup: cancel animation frame, remove listeners, lose WebGL context on unmount
  - Apply semi-transparent background so body color shows through

  **Must NOT do**:
  - Use Three.js, p5.js, or any WebGL library
  - Block initial paint (component should mount after first render)
  - Cover more than hero section area (not full page)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: WebGL shader + canvas work + React integration
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (only task in Wave 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/app/_components/TypingLine.tsx` — Example of `"use client"` component structure in this project

  **API/Type References**:
  - WebGL2RenderingContext — https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext

  **External References**:
  - Simplex noise GLSL: https://www.shadertoy.com/view/Msf3WH — Standard simplex noise implementation
  - FBM pattern: https://thebookofshaders.com/13/ — Fractal Brownian Motion explanation

  **WHY Each Reference Matters**:
  - TypingLine.tsx shows the project's component conventions (client directive, imports)
  - WebGL2 docs for API reference during implementation
  - Shadertoy/BookOfShaders for proven noise shader patterns

  **Acceptance Criteria**:
  - Component renders a `<canvas>` element
  - Canvas has WebGL2 context (or falls back to WebGL1)
  - Fragment shader compiles without errors
  - Animation loop runs at ~60fps
  - Mouse tracking updates u_mouse uniform

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Aurora renders on page load
    Tool: Playwright
    Preconditions: Browser with WebGL support
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for hero section to be visible
      3. Assert a <canvas> element exists within the hero section
      4. Assert the canvas has non-zero width and height
      5. Take screenshot of hero section
    Expected Result: Canvas visible behind hero text with flowing warm-toned light
    Evidence: .sisyphus/evidence/task-1-aurora-renders.png

  Scenario: Aurora responds to mouse movement
    Tool: Playwright
    Preconditions: Aurora component mounted and rendering
    Steps:
      1. Move mouse to center of hero section
      2. Take screenshot (before)
      3. Move mouse to top-left corner
      4. Wait 2 seconds for animation frame
      5. Take screenshot (after)
    Expected Result: Flow pattern subtly shifts near mouse position
    Evidence: .sisyphus/evidence/task-1-mouse-interaction.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots of rendered aurora
  - [ ] Screenshots showing mouse interaction effect

  **Commit**: NO
  - Message: `feat(hero): add WebGL aurora background component`
  - Files: `src/app/_components/AuroraBackground.tsx`

---

- [ ] 2. Integrate AuroraBackground into ClientHome.tsx

  **What to do**:
  - Import AuroraBackground in `src/app/ClientHome.tsx`
  - Add component inside the hero `<section ref={headerRef}>` as an absolutely-positioned background layer
  - Apply z-index so it sits behind text but above body background
  - Ensure pointer-events: none so it doesn't block scroll or click interactions
  - Verify existing GSAP animations and ChatInterface still work correctly
  - Verify scroll arrow fade animation still works

  **Must NOT do**:
  - Move or modify existing hero content structure
  - Change existing animation timing or behavior
  - Add new props to AuroraBackground (keep it simple — no config needed yet)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Component integration + z-index layering in hero section
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/app/ClientHome.tsx:217-254` — Hero section structure (section with headerRef)

  **API/Type References**:
  - React component composition — standard pattern for nesting components

  **WHY Each Reference Matters**:
  - ClientHome.tsx hero section is where the aurora must be inserted; need exact location

  **Acceptance Criteria**:
  - [ ] AuroraBackground rendered inside hero section
  - [ ] Hero text remains visible and readable over aurora
  - [ ] ChatInterface remains functional (clickable, scrollable)
  - [ ] Scroll arrow still fades on scroll

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Hero content remains interactive over aurora
    Tool: Playwright
    Preconditions: Aurora integrated into ClientHome.tsx
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll down past hero section
      3. Assert scroll arrow fades out
      4. Scroll back up
      5. Click on ChatInterface input field
      6. Type "hello" and press Enter
      7. Assert chat responds
    Expected Result: All existing hero interactions work with aurora behind them
    Evidence: .sisyphus/evidence/task-2-hero-interactive.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of hero with aurora + text visible
  - [ ] Screenshot of chat interaction working

  **Commit**: NO
  - Message: `feat(hero): integrate aurora background into hero section`
  - Files: `src/app/ClientHome.tsx`

---

- [ ] 3. Add WebGL fallback, reduced-motion support, retina sizing

  **What to do**:
  - Add WebGL support detection: if WebGL2/WebGL1 unavailable, render a CSS gradient fallback
  - CSS fallback: animated `background-position` gradient using copper/charcoal tones, subtle keyframe animation
  - Add `prefers-reduced-motion` media query check:
    - If user prefers reduced motion → disable shader animation, show static gradient or very slow drift
  - Handle retina/HiDPI displays: scale canvas by `window.devicePixelRatio` for crisp rendering
  - Ensure canvas CSS size matches container, canvas buffer size = CSS size \* devicePixelRatio
  - Add `aria-hidden="true"` to canvas element (decorative)
  - Test on mobile viewport widths (375px, 768px) — ensure no horizontal scroll, proportional sizing

  **Must NOT do**:
  - Add heavy device detection or feature sniffing beyond WebGL support
  - Break existing responsive layout

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Polish, edge cases, browser compatibility
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: (final)
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/styles/globals.css:77-122` — Color tokens to use in CSS fallback gradient
  - `src/styles/globals.css:150-182` — Dark mode tokens (if applicable)

  **External References**:
  - MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - WebGL fallback pattern: graceful degradation via feature detection

  **WHY Each Reference Matters**:
  - globals.css has the exact oklch color tokens to match in CSS fallback
  - prefers-reduced-motion docs for correct implementation
  - WebGL fallback is critical for accessibility and older browsers

  **Acceptance Criteria**:
  - [ ] Canvas has `aria-hidden="true"`
  - [ ] On non-WebGL browser: CSS gradient fallback renders instead of canvas
  - [ ] On prefers-reduced-motion: animation stops or becomes static
  - [ ] Canvas is crisp on retina displays (no blurry edges)
  - [ ] Mobile: no horizontal scroll, hero fills viewport width

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Fallback renders on WebGL unsupported browser
    Tool: Playwright
    Preconditions: Disable WebGL via browser context (or mock)
    Steps:
      1. Navigate to http://localhost:3000 with WebGL disabled
      2. Assert no <canvas> element in hero
      3. Assert a div with CSS gradient background is visible instead
      4. Take screenshot
    Expected Result: Animated CSS gradient renders in place of canvas
    Evidence: .sisyphus/evidence/task-3-fallback.png

  Scenario: Reduced motion respected
    Tool: Playwright
    Preconditions: Set prefers-reduced-motion: reduce media query
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert aurora renders static or with minimal animation
      3. Take screenshot
    Expected Result: Aurora is static or barely moving
    Evidence: .sisyphus/evidence/task-3-reduced-motion.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of CSS fallback
  - [ ] Screenshot of reduced-motion mode
  - [ ] Screenshot of mobile viewport (375px)

  **Commit**: YES
  - Message: `feat(hero): add fallback, reduced-motion, and retina support for aurora`
  - Files: `src/app/_components/AuroraBackground.tsx`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Check: AuroraBackground component exists, integrated in ClientHome, all acceptance criteria met.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `bun run check` (lint + typecheck). Review shader for correctness, React cleanup for memory leaks.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` + `playwright`
      Open browser, verify aurora renders, mouse interaction works, text readable, chat works, fallback works.
      Output: `Scenarios [N/N pass] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      Verify no new npm deps added, no existing animations modified, no full-page coverage.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN] | VERDICT`

---

## Commit Strategy

- **1+2+3**: `feat(hero): add WebGL aurora fluid background` — AuroraBackground.tsx, ClientHome.tsx

---

## Success Criteria

### Verification Commands

```bash
bun run check  # lint + typecheck must pass
bun run dev    # dev server starts, aurora renders on localhost:3000
```

### Final Checklist

- [ ] Aurora renders behind hero text
- [ ] Colors match copper/charcoal palette
- [ ] Mouse interaction works
- [ ] WebGL fallback works
- [ ] Reduced motion respected
- [ ] Retina displays crisp
- [ ] Mobile responsive
- [ ] No new dependencies
- [ ] Lint + typecheck pass
