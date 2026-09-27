"use client";

import { useEffect, useRef, useState } from "react";
import { contactEmail } from "~/lib/home-content";
import styles from "./home.module.css";

/** The email address with a copy button that falls back to selecting the text. */
export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const code = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const settle = (next: "copied" | "selected") => {
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  };
  // No clipboard access (older browsers, insecure frames): select the address
  // so a long-press or Ctrl+C finishes the job.
  const select = () => {
    const sel = getSelection();
    if (code.current && sel) {
      sel.selectAllChildren(code.current);
      settle("selected");
    }
  };

  return (
    <div className={styles.mail}>
      <a href={`mailto:${contactEmail}`} data-label="EMAIL">
        <code ref={code}>{contactEmail}</code>
      </a>
      <button
        type="button"
        data-state={state}
        onClick={() => {
          if (!navigator.clipboard) return select();
          navigator.clipboard
            .writeText(contactEmail)
            .then(() => settle("copied"), select);
        }}
      >
        {state === "idle"
          ? "copy"
          : state === "copied"
            ? "copied ✓"
            : "selected"}
      </button>
      <span className={styles.sr} role="status">
        {state === "copied"
          ? "Email address copied"
          : state === "selected"
            ? "Email address selected, copy it from here"
            : ""}
      </span>
    </div>
  );
}
