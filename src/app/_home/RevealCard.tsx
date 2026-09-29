"use client";

import Link from "next/link";
import { useState } from "react";
import { roles, type Card } from "~/lib/home-content";
import { CopyEmail } from "./CopyEmail";
import styles from "./home.module.css";

/** The trusted card shown in the hero frame beside an answer. */
export function RevealCard({
  card,
  onBack,
  onType,
}: {
  card: Card;
  onBack: () => void;
  onType: () => void;
}) {
  const back = (
    <button type="button" className={styles.back} onClick={onBack}>
      back to the name
    </button>
  );
  if (card.kind === "experience")
    return (
      <>
        <span className={styles.mono}>experience</span>
        <div className={styles.tlList}>
          {roles.slice(0, 4).map((r) => (
            <div key={r.ring}>
              <span>{r.when}</span>
              {r.org}
            </div>
          ))}
        </div>
        {back}
      </>
    );
  if (card.kind === "game")
    return (
      <>
        <span className={styles.mono}>kopitype, tiny round</span>
        <KopiRound onType={onType} />
        <div className={styles.row}>
          <a href="https://kopitype.com" data-label="PLAY">
            full game at kopitype.com ↗
          </a>
          {back}
        </div>
      </>
    );
  if (card.kind === "contact")
    return (
      <>
        <span className={styles.mono}>say hi</span>
        <h3>Email me</h3>
        <CopyEmail />
        <div className={styles.row}>{back}</div>
      </>
    );
  return (
    <>
      <span className={styles.mono}>{card.kicker}</span>
      <h3>{card.title}</h3>
      <p>{card.body}</p>
      <div className={styles.row}>
        {card.link &&
          (card.link.href.startsWith("/") ? (
            <Link href={card.link.href} data-label="READ">
              {card.link.label} →
            </Link>
          ) : (
            <a href={card.link.href} data-label="OPEN">
              {card.link.label} ↗
            </a>
          ))}
        {back}
      </div>
    </>
  );
}

const round = "shiok lah kopi peng tapao";
function KopiRound({ onType }: { onType: () => void }) {
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState(0);
  const [wpm, setWpm] = useState<number | null>(null);
  return (
    <>
      <div className={styles.kt} aria-hidden="true">
        {[...round].map((c, i) => (
          <span
            key={i}
            className={
              i >= typed.length ? "" : typed[i] === c ? styles.ok : styles.bad
            }
          >
            {c}
          </span>
        ))}
        {wpm !== null && <span> · {wpm} wpm, shiok</span>}
      </div>
      <input
        className={styles.ktIn}
        aria-label={`Type: ${round}`}
        autoComplete="off"
        spellCheck={false}
        disabled={wpm !== null}
        value={typed}
        onChange={(e) => {
          const v = e.target.value;
          const t0 = start || performance.now();
          if (!start) setStart(t0);
          setTyped(v);
          onType();
          if (v === round)
            setWpm(
              Math.round(round.length / 5 / ((performance.now() - t0) / 60000)),
            );
        }}
      />
    </>
  );
}
