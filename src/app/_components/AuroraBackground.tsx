"use client";

export default function AuroraBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-violet-900/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-900/10 blur-3xl" />
    </div>
  );
}
