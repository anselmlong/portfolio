"use client";

/**
 * Marquee — an editorial scrolling text divider.
 * Two identical tracks create a seamless loop; pauses on hover.
 */
export default function Marquee({ items }: { items: string[] }) {
  const track = (ariaHidden: boolean) => (
    <div className="marquee-track" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-bricolage text-foreground/70 px-6 text-2xl font-extralight tracking-tight whitespace-nowrap md:px-10 md:text-4xl">
            {item}
          </span>
          <span className="text-primary/60 text-lg select-none md:text-2xl">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee border-border/60 my-8 border-y py-5 md:py-7">
      {track(false)}
      {track(true)}
    </div>
  );
}
