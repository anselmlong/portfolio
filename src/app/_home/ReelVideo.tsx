"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

/** A launch video inside a reel frame: plays muted only while on screen, with a sound toggle that doesn't follow the frame's link. */
export function ReelVideo({
  src,
  poster,
  name,
}: {
  src: string;
  poster: string;
  name: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        className={styles.reelVideo}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label={`${name} launch video`}
      />
      <button
        type="button"
        className={styles.sound}
        aria-pressed={!muted}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const v = ref.current;
          if (!v) return;
          v.muted = !muted;
          setMuted(!muted);
          if (muted) {
            v.currentTime = 0;
            void v.play().catch(() => undefined);
          }
        }}
      >
        {muted ? "▶ sound on" : "sound off"}
      </button>
    </>
  );
}
