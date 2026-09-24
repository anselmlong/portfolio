"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, ArrowRight, RotateCcw, ChevronLeft } from "lucide-react";
import styles from "./GuidedPortfolio.module.css";

const ChatInterface = dynamic(() => import("./ChatInterface"), {
  ssr: false,
  loading: () => <p role="status">Opening the conversation…</p>,
});

type Stop = "routes" | "typing" | "engineering" | "photos" | "canvas";
type Path = "hiring" | "play" | "explore";
const paths: Record<Path, { label: string; hint: string; stops: Stop[] }> = {
  hiring: {
    label: "I’m hiring",
    hint: "The work, the decisions, the person.",
    stops: ["engineering", "routes", "canvas"],
  },
  play: {
    label: "Show me something cool",
    hint: "A little less reading. A little more doing.",
    stops: ["typing", "routes"],
  },
  explore: {
    label: "Just exploring",
    hint: "Cameras, climbing, and useful side quests.",
    stops: ["photos", "routes", "typing"],
  },
};
const stories: Record<
  Stop,
  { title: string; message: string; detail: string; url: string; link: string }
> = {
  routes: {
    title: "A climbing wall, made searchable.",
    message:
      "I climb. Route photos were already being posted in Telegram, so I built a way to turn those posts into a browsable climbing archive.",
    detail:
      "The bot parses a photo caption into a route name, grade and wall section. SQLite stores the record; a FastAPI mini-app makes it searchable. The important product decision: setters can keep posting the way they already do.",
    url: "https://routes.anselmlong.com",
    link: "Explore Route Archiver",
  },
  typing: {
    title: "Your fingers. A little Singlish.",
    message:
      "I made Kopitype because typing tests could use a little more Singapore. Here’s a tiny taste. No account. No stakes. Just type the line.",
    detail:
      "The full project has local word lists, MRT stations, typing statistics and challenge mode. This miniature runs entirely in your browser; it doesn’t submit a score or touch the leaderboard.",
    url: "https://kopitype.com",
    link: "Play the full Kopitype",
  },
  engineering: {
    title: "Beyond the interface.",
    message:
      "I’m a Software Engineer Intern on the Maps team at Open Government Products. For a look at my previous engineering work, let’s start with Project Aegis.",
    detail:
      "As lead developer on Aegis, I worked on a controlled AI-access platform for a CTF event: usage policies, LLM-guard middleware, Docker environments and Playwright tests. It’s a useful example of the engineering behind an interface—not just the interface itself.",
    url: "https://github.com/anselmlong/aegis",
    link: "Inspect Aegis on GitHub",
  },
  photos: {
    title: "Sometimes I put the laptop down.",
    message:
      "You’ll also find me behind a camera, bouldering, or attempting latte art. Photography is part of how I look at things. Software is another way of doing something with what I notice.",
    detail:
      "My photography site collects portraits, weddings, events and motion work. It lives alongside my software projects, with its own visual space.",
    url: "https://photos.anselmlong.com",
    link: "Step into my photography",
  },
  canvas: {
    title: "Less downloading. More getting on with life.",
    message:
      "Some of my favourite projects start with something mundane. Canvas Scraper syncs course files and sends a digest, so checking for new material doesn’t become another daily chore.",
    detail:
      "A Python CLI with SQLite tracks course files and updates. Course selection stays explicit, large unwanted files can be filtered, and scheduled runs can send an email summary.",
    url: "https://canvas.anselmlong.com",
    link: "Meet Canvas Scraper",
  },
};

export const TYPING_PHRASE = "steady lah, one step at a time";

export function TypingDemo() {
  const [value, setValue] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const started = useRef<number | null>(null);
  function reset() {
    setValue("");
    setScore(null);
    started.current = null;
  }
  return (
    <div className={styles.typing}>
      <p className={styles.artifactLabel}>Kopitype · a tiny playable preview</p>
      <p className={styles.phrase} aria-hidden="true">
        {[...TYPING_PHRASE].map((letter, i) => (
          <span
            key={i}
            className={
              i < value.length
                ? value[i] === letter
                  ? styles.correct
                  : styles.incorrect
                : undefined
            }
          >
            {letter}
          </span>
        ))}
      </p>
      <label htmlFor="kopitype-preview" className={styles.inputLabel}>
        Type: {TYPING_PHRASE}
      </label>
      <input
        id="kopitype-preview"
        value={value}
        disabled={score !== null}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={TYPING_PHRASE.length}
        placeholder="Start typing here…"
        onPaste={(e) => e.preventDefault()}
        onChange={(e) => {
          const next = e.target.value;
          if (next && started.current === null) started.current = Date.now();
          setValue(next);
          if (next === TYPING_PHRASE && started.current !== null) {
            setScore(
              Math.round(
                TYPING_PHRASE.length /
                  5 /
                  (Math.max(Date.now() - started.current, 1000) / 60000),
              ),
            );
          }
        }}
      />
      <div className={styles.gameFooter}>
        <p role="status">
          {score === null
            ? "Your first keystroke starts the clock."
            : `${score} WPM. Steady! A short round, not a benchmark.`}
        </p>
        <button type="button" onClick={reset}>
          Try again <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function RouteDemo() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={styles.routeDemo}>
      <p className={styles.artifactLabel}>
        Route Archiver · illustrative example
      </p>
      <div className={styles.wall} aria-hidden="true">
        <svg viewBox="0 0 400 210" fill="none">
          <path
            d="M130 195C105 142 246 166 211 108S266 79 256 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={revealed ? undefined : "4 8"}
          />
          {[
            [130, 183],
            [174, 151],
            [223, 130],
            [209, 94],
            [255, 65],
            [255, 23],
          ].map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={i % 2 ? 15 : 10}
              ry={7}
              transform={`rotate(${i * 28} ${x} ${y})`}
              fill="currentColor"
            />
          ))}
        </svg>
        <span>
          {revealed
            ? "from a post → to a route"
            : "it starts with a photo + caption"}
        </span>
      </div>
      <div className={styles.routeRecord} aria-live="polite">
        {revealed ? (
          <>
            <strong>Crack Line</strong>
            <span>V4 · left wall</span>
            <p>
              A structured record you can browse by grade and wall. This example
              isn’t live gym data.
            </p>
          </>
        ) : (
          <>
            <strong>“Crack Line / V4 / left wall”</strong>
            <p>A sample caption, in the format a setter already posts.</p>
          </>
        )}
      </div>
      <button
        type="button"
        className={styles.artifactButton}
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? "Back to the caption" : "Turn the post into a route"}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

function Artifact({ stop }: { stop: Stop }) {
  if (stop === "typing") return <TypingDemo />;
  if (stop === "routes") return <RouteDemo />;
  if (stop === "photos")
    return (
      <div className={styles.photo}>
        <img
          src="/photos/main/portrait.jpeg"
          alt="Anselm Long"
          width={500}
          height={500}
        />
        <p>the person on the other side of the screen.</p>
      </div>
    );
  if (stop === "canvas")
    return (
      <div className={styles.pipeline}>
        <p className={styles.artifactLabel}>Canvas Scraper · the workflow</p>
        {[
          "Choose your courses",
          "Sync the files you need",
          "Read one daily digest",
        ].map((text, i) => (
          <div key={text}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{text}</strong>
          </div>
        ))}
        <p>A small tool for a recurring annoyance.</p>
      </div>
    );
  return (
    <div className={styles.pipeline}>
      <p className={styles.artifactLabel}>Project Aegis · engineering layers</p>
      {[
        "Participant interface",
        "Usage policies + LLM guard",
        "Model access",
      ].map((text, i) => (
        <div key={text}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <strong>{text}</strong>
        </div>
      ))}
      <p>Reproducible environments. Tested workflows. Clear boundaries.</p>
    </div>
  );
}

export default function GuidedPortfolio() {
  const [path, setPath] = useState<Path | null>(null);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(false);
  const [askAI, setAskAI] = useState(false);
  const reply = useRef<HTMLHeadingElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const didInteract = useRef(false);
  const stop = path ? paths[path].stops[step] : undefined;
  const story = stop ? stories[stop] : undefined;
  useEffect(() => {
    if (!didInteract.current) return;
    if (path) reply.current?.focus();
    else picker.current?.querySelector("button")?.focus();
  }, [path, step]);
  function choose(next: Path) {
    didInteract.current = true;
    setPath(next);
    setStep(0);
    setDetails(false);
  }
  function move(next: number) {
    setStep(next);
    setDetails(false);
  }
  return (
    <section className={styles.guide} aria-labelledby="guide-title">
      <div className={styles.identity}>
        <img src="/photos/main/portrait.jpeg" alt="" width={42} height={42} />
        <div>
          <strong>Anselm Long</strong>
          <span>Software Engineer Intern · OGP Maps</span>
        </div>
        <a href="#projects">
          Skip to the work <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.opening}>
        <h1 id="guide-title">
          hey, i’m anselm.
          <br />
          <span>where should we start?</span>
        </h1>
        <p>
          I build useful things, take photographs, and occasionally touch grass.
          <br className={styles.desktopBreak} /> Pick a thread. I’ll show you
          around.
        </p>
      </div>
      <div
        className={styles.choices}
        ref={picker}
        aria-label="Choose your tour"
      >
        {(Object.keys(paths) as Path[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => choose(key)}
            aria-pressed={path === key}
          >
            <span>
              {paths[key].label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
            <small>{paths[key].hint}</small>
          </button>
        ))}
      </div>
      {path && story && stop ? (
        <div className={styles.conversation}>
          <div className={styles.story}>
            <div className={styles.chapter}>
              <span>
                You: {paths[path].label} · {step + 1} /{" "}
                {paths[path].stops.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPath(null);
                  setStep(0);
                  setDetails(false);
                }}
                aria-label="Start a new tour"
              >
                <RotateCcw size={16} aria-hidden="true" /> Start over
              </button>
            </div>
            <h2 ref={reply} tabIndex={-1}>
              {story.title}
            </h2>
            <p>{story.message}</p>
            <button
              type="button"
              className={styles.detailToggle}
              aria-expanded={details}
              onClick={() => setDetails(!details)}
            >
              {details ? "A little less detail" : "How did you build it?"}
            </button>
            {details && <p className={styles.details}>{story.detail}</p>}
            <a
              className={styles.projectLink}
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {story.link} <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <div className={styles.tourNavigation}>
              {step > 0 && (
                <button type="button" onClick={() => move(step - 1)}>
                  <ChevronLeft size={16} aria-hidden="true" /> Back
                </button>
              )}
              {step < paths[path].stops.length - 1 ? (
                <button type="button" onClick={() => move(step + 1)}>
                  Show me another <ArrowRight size={17} aria-hidden="true" />
                </button>
              ) : (
                <a href="mailto:anselmpius@gmail.com">
                  That’s a little of me. Say hello{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
          <div key={`${path}-${step}`} className={styles.artifact}>
            <Artifact stop={stop} />
          </div>
        </div>
      ) : (
        <div className={styles.invitation}>
          <span>Made in Singapore. Best explored with a little curiosity.</span>
          <span>Guided tour · no typing required</span>
        </div>
      )}
      <div className={styles.aiSection}>
        <button
          type="button"
          className={styles.aiToggle}
          aria-expanded={askAI}
          aria-controls="portfolio-ai"
          onClick={() => setAskAI(!askAI)}
        >
          {askAI ? "Close AI chat" : "Or, ask me your own question"}
          <span>{askAI ? "−" : "+"}</span>
        </button>
        {askAI && (
          <div id="portfolio-ai">
            <p className={styles.aiNote}>
              An AI guide to my work. It can make mistakes; you can always{" "}
              <a href="mailto:anselmpius@gmail.com">ask me directly</a>.
            </p>
            <ChatInterface inline />
          </div>
        )}
      </div>
    </section>
  );
}
