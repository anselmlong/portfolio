"use client";

/**
 * EmberBackground — warm, cinematic atmosphere for the hero.
 * Drifting copper/amber orbs + a faint grid + radial vignette,
 * all CSS-animated so it costs nothing on the main thread.
 */
export default function AuroraBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint editorial grid */}
      <div className="ember-grid absolute inset-0" />

      {/* Drifting ember orbs */}
      <div className="ember-orb ember-orb-1 absolute top-1/4 left-1/4 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="ember-orb ember-orb-2 absolute top-1/3 right-1/5 h-96 w-96 rounded-full" />
      <div className="ember-orb ember-orb-3 absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full" />

      {/* Vignette to pull focus center */}
      <div className="ember-vignette absolute inset-0" />
    </div>
  );
}
