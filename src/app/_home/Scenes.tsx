"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";

/** The homepage told as scenes, in scroll order. Each id is a section on the page. */
export const chapters = [
  { id: "about", label: "who i am" },
  { id: "experience", label: "where i've worked" },
  { id: "work", label: "what i build" },
  { id: "writing", label: "what i think" },
  { id: "glimpses", label: "off the clock" },
  { id: "say-hi", label: "say hi" },
] as const;

const number = (n: number) => String(n + 1).padStart(2, "0");

/** A clapperboard label that opens each section: "SC 02 · where i've worked". */
export function Slate({ n }: { n: number }) {
  return (
    <span className={styles.slate}>
      <i aria-hidden="true" />
      <b>SC {number(n)}</b>
      {chapters[n]!.label}
    </span>
  );
}

/**
 * A slim scene index on the right edge (wide screens only). It appears once
 * you scroll past the chat, lights the scene you're in, and jumps on click.
 */
export function SceneRail() {
  const [on, setOn] = useState(-1);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      let cur = -1;
      chapters.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.55) cur = i;
      });
      setOn(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      className={styles.rail}
      aria-label="Scenes"
      data-on={on >= 0 || undefined}
    >
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={i === on ? "location" : undefined}
              data-past={i < on || undefined}
              data-label="JUMP"
            >
              <b>{number(i)}</b>
              <span>{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
