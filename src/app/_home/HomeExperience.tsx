"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  clips,
  contactEmail,
  heroPhotoIndex,
  linkedinPosts,
  photos,
  reel,
  roles,
  scenes,
  topics,
  type Card,
  type TopicKey,
} from "~/lib/home-content";
import { startCursor } from "./cursor-engine";
import { ReelVideo } from "./ReelVideo";
import { startHero, type HeroHandle } from "./hero-engine";
import { HomeChat } from "./HomeChat";
import { AboutCover } from "./AboutCover";
import { GithubLog } from "./GithubLog";
import type { GithubActivity } from "~/server/github";
import { measureViewport, startScroll } from "./scroll-engine";
import styles from "./home.module.css";

export type PostTeaser = { slug: string; title: string; date: string };

const month = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-SG", {
    month: "short",
    year: "numeric",
  });

export default function HomeExperience({
  posts,
  totalPosts,
  github = null,
}: {
  posts: PostTeaser[];
  totalPosts: number;
  github?: GithubActivity | null;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const hero = useRef<HeroHandle | null>(null);
  const reticle = useRef<HTMLDivElement>(null);
  const reticleLabel = useRef<HTMLElement>(null);
  const shy = useRef<HTMLDivElement>(null);
  const work = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLOutputElement>(null);
  const bar = useRef<HTMLElement>(null);
  const exp = useRef<HTMLElement>(null);
  const ring = useRef<SVGGElement>(null);
  const deckSection = useRef<HTMLElement>(null);
  const deckCards = useRef<(HTMLAnchorElement | null)[]>([]);
  const glimpses = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const focusShot = useRef<HTMLElement>(null);
  const sheetCaption = useRef<HTMLDivElement>(null);

  const [still, setStill] = useState(false);
  const [label, setLabel] = useState(clips[0]!.label);
  const [topic, setTopic] = useState<TopicKey | null>(null);
  const [role, setRole] = useState(0);
  // Once a conversation starts, the frame eases down and the chat takes the full width.
  const [chatting, setChatting] = useState(false);

  useEffect(() => {
    const el = root.current,
      st = stage.current,
      cv = canvas.current;
    if (!el || !st || !cv) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    setStill(reduce);
    const viewport = measureViewport(el);
    if (reduce || viewport.flat) el.dataset.flat = "true";

    const h = startHero({
      stage: st,
      canvas: cv,
      videos: videos.current.filter((v): v is HTMLVideoElement => !!v),
      posters: clips.map((c) => c.poster),
      still: reduce,
      finePointer: fine,
      onLabel: (clip, scene) =>
        setLabel(scene?.label ?? clips[clip ?? 0]!.label),
    });
    hero.current = h;

    const stopCursor =
      !reduce && fine && reticle.current && reticleLabel.current && shy.current
        ? startCursor({
            root: el,
            reticle: reticle.current,
            label: reticleLabel.current,
            shy: shy.current,
          })
        : () => undefined;

    const labels = [...(ring.current?.querySelectorAll("text") ?? [])];
    const stopScroll =
      work.current &&
      track.current &&
      ghost.current &&
      count.current &&
      bar.current &&
      exp.current &&
      ring.current &&
      deckSection.current &&
      glimpses.current &&
      sheet.current &&
      focusShot.current &&
      sheetCaption.current
        ? startScroll({
            root: el,
            stage: st,
            reel: {
              section: work.current,
              track: track.current,
              ghost: ghost.current,
              count: count.current,
              bar: bar.current,
            },
            dial: {
              section: exp.current,
              ring: ring.current,
              labels,
              steps: roles.length,
              onStep: setRole,
            },
            deck: {
              section: deckSection.current,
              cards: deckCards.current.filter(
                (c): c is HTMLAnchorElement => !!c,
              ),
            },
            sheet: {
              section: glimpses.current,
              sheet: sheet.current,
              focus: focusShot.current,
              caption: sheetCaption.current,
            },
            onHeroScroll: (k) => h.setScroll(k),
          })
        : () => undefined;

    // Writing titles rise word by word; anything already on screen stays put.
    const rising = [...el.querySelectorAll<HTMLElement>("[data-rise]")];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          delete (en.target as HTMLElement).dataset.pre;
          io.unobserve(en.target);
        }),
      { threshold: 0.4 },
    );
    if (!reduce)
      rising.forEach((r) => {
        if (r.getBoundingClientRect().top > innerHeight) {
          r.dataset.pre = "true";
          io.observe(r);
        }
      });

    return () => {
      h.destroy();
      hero.current = null;
      stopCursor();
      stopScroll();
      viewport.cleanup();
      io.disconnect();
    };
  }, []);

  function showTopic(key: TopicKey | null) {
    setTopic(key);
    hero.current?.setScene(key ? scenes[topics[key].scene] : null);
  }
  const peek = (key: TopicKey | null) =>
    hero.current?.setPeek(key ? scenes[topics[key].scene] : null);
  const toWork = () =>
    work.current?.scrollIntoView({ behavior: still ? "auto" : "smooth" });
  // Glide back to the chat and leave the cursor in the box, ready to type.
  const toChat = () => {
    const box = document.getElementById("ask-anselm");
    box?.focus({ preventScroll: true });
    box?.scrollIntoView({
      behavior: still ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div
      ref={root}
      className={styles.root}
      data-chatting={chatting || undefined}
    >
      <div
        ref={reticle}
        className={styles.reticle}
        aria-hidden="true"
        data-state="free"
      >
        <i />
        <i />
        <i />
        <i />
        <b />
        <em ref={reticleLabel} />
      </div>

      <div className={styles.wrap}>
        <header className={styles.top}>
          <Link href="/" className={styles.wordmark}>
            Anselm Long
          </Link>
          <nav aria-label="Site" className={styles.nav}>
            <a href="#work" data-label="SCROLL">
              Work
            </a>
            <Link href="/blog" data-label="READ">
              Writing
            </Link>
            <a href="https://photos.anselmlong.com" data-label="OPEN">
              Photos
            </a>
            <a
              href="/resume.pdf"
              download="Anselm-Long-Resume.pdf"
              className={styles.resume}
              data-label="SAVE"
            >
              Resume ↓
            </a>
            <button
              type="button"
              className={styles.exit}
              onClick={toWork}
              data-label="SCROLL"
            >
              Show me the full site ↓
            </button>
          </nav>
        </header>

        <h1 className={styles.sr}>Anselm Long</h1>
        <div className={styles.stageWrap}>
          <div ref={stage} className={styles.stage} data-stage>
            {/* Shown before the canvas takes over, and instead of it if scripts fail. */}
            <div className={styles.stillName} aria-hidden="true">
              ANSELM
            </div>
            <canvas ref={canvas} aria-hidden="true" />
            <div className={styles.grain} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.tl}`}>
              <span className={styles.rec} />
              {label}
            </span>
            <span className={`${styles.corner} ${styles.tr}`}>shot by me</span>
            <div
              className={`${styles.reveal} ${topic ? styles.on : ""}`}
              data-reveal
              role="region"
              aria-live="polite"
              aria-label="Related to the answer"
            >
              {topic && (
                <RevealCard
                  card={topics[topic].card}
                  onBack={() => showTopic(null)}
                  onType={() => hero.current?.bump()}
                />
              )}
            </div>
          </div>
        </div>

        <section className={styles.talk} aria-label="Talk to Anselm">
          <div className={styles.intro}>
            <p className={styles.say}>
              hi, i&apos;m anselm. i build small tools that fix{" "}
              <em>everyday annoyances</em>, film things, and climb when i can.
            </p>
            <p className={styles.sub}>
              ask me anything. hover a question to preview it, and whatever
              i&apos;m answering about shows up in the frame above.
            </p>
          </div>
          <div>
            <HomeChat
              still={still}
              onTopic={showTopic}
              onPeek={peek}
              onType={() => hero.current?.bump()}
              onStart={() => setChatting(true)}
            />
          </div>
        </section>
      </div>

      <div className={styles.wrap}>
        <AboutCover />
      </div>

      <section
        id="work"
        ref={work}
        className={`${styles.pin} ${styles.workPin}`}
        aria-label="Work"
      >
        <div className={styles.sticky}>
          <div ref={ghost} className={styles.ghost} aria-hidden="true">
            WORK · WORK · WORK
          </div>
          <div className={`${styles.wrap} ${styles.kicker}`}>
            <h2>Work</h2>
            <span className={styles.mono}>
              <span className={styles.onDesk}>scroll to wind the reel</span>
              <span className={styles.onPhone}>swipe through</span> · live
              sites, captured this month
            </span>
          </div>
          <div ref={track} className={styles.track}>
            {reel.map((f) => (
              <a
                key={f.name}
                className={styles.frame}
                href={f.href}
                data-label={f.label}
              >
                <div
                  className={`${styles.shot} ${!f.video && f.visual.kind !== "image" ? styles.typeShot : ""} ${!f.video && f.visual.kind === "shitpost" ? styles.shit : ""}`}
                >
                  {f.video && (
                    <ReelVideo
                      src={f.video.src}
                      poster={f.video.poster}
                      name={f.name}
                    />
                  )}
                  {!f.video && f.visual.kind === "image" && (
                    <>
                      <div className={styles.drift} data-drift>
                        <Image
                          src={f.visual.src}
                          alt={f.visual.alt}
                          fill
                          sizes="(max-width: 800px) 80vw, 860px"
                          style={{
                            objectFit: "cover",
                            objectPosition: f.visual.position ?? "top",
                          }}
                        />
                      </div>
                      {f.visual.note && (
                        <em className={styles.note}>{f.visual.note}</em>
                      )}
                    </>
                  )}
                  {!f.video && f.visual.kind === "ava" && (
                    <div className={styles.tchat} data-drift aria-hidden="true">
                      <p className={styles.u}>
                        fix the typo on my blog and open a PR
                      </p>
                      <p className={styles.a}>
                        done. the PR is open, and vercel is building a preview.
                      </p>
                      <p className={styles.u}>
                        send me the link when it&apos;s ready
                      </p>
                      <p className={styles.a}>will do.</p>
                    </div>
                  )}
                  {!f.video && f.visual.kind === "sixseven" && (
                    <>
                      <span
                        className={styles.n67}
                        data-drift
                        aria-hidden="true"
                      >
                        6<span>7</span>
                      </span>
                      <span className={styles.ocr} aria-hidden="true" />
                    </>
                  )}
                  {!f.video && f.visual.kind === "shitpost" && (
                    <div
                      data-drift
                      className={styles.shitInner}
                      aria-hidden="true"
                    >
                      <b>Your career depends on this.</b>
                      <span>six personas · one topic · zero shame</span>
                    </div>
                  )}
                  {!f.video && f.visual.kind !== "image" && (
                    <em className={styles.illus}>illustration</em>
                  )}
                </div>
                <div className={styles.cap}>
                  <b>{f.name}</b>
                  <span>{f.body}</span>
                  <small>{f.tech}</small>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.counter}>
            <output ref={count}>
              01 / {String(reel.length).padStart(2, "0")}
            </output>
            <div className={styles.bar}>
              <i ref={bar} />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={exp}
        className={`${styles.pin} ${styles.expPin}`}
        aria-label="Experience"
      >
        <div className={`${styles.sticky} ${styles.expSticky}`}>
          <div className={styles.dial} aria-hidden="true">
            <svg viewBox="-260 -260 520 520">
              <defs>
                <radialGradient id="dial-glow">
                  <stop offset="0%" stopColor="#ff6f55" stopOpacity="0.16" />
                  <stop offset="70%" stopColor="#ff6f55" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle r={180} fill="url(#dial-glow)" />
              <g ref={ring}>
                {Array.from({ length: 120 }, (_, i) => {
                  const a = (i / 120) * Math.PI * 2,
                    long = i % 10 === 0,
                    r2 = long ? 186 : 198;
                  return (
                    <line
                      key={i}
                      x1={Math.sin(a) * 210}
                      y1={-Math.cos(a) * 210}
                      x2={Math.sin(a) * r2}
                      y2={-Math.cos(a) * r2}
                      stroke={long ? "#f1efe8" : "#4a4e59"}
                      strokeWidth={long ? 2 : 1}
                      data-r2={r2}
                    />
                  );
                })}
                {roles.map((r, i) => {
                  const a = (i * 60 * Math.PI) / 180;
                  return (
                    <text
                      key={r.ring}
                      x={Math.sin(a) * 162}
                      y={-Math.cos(a) * 162 + 4}
                      textAnchor="middle"
                      className={i === role ? styles.ringOn : ""}
                    >
                      {r.ring}
                    </text>
                  );
                })}
                <circle r={226} fill="none" stroke="#2a2d35" />
              </g>
              {/* The active role always turns to the top, under the pointer. */}
              <path
                className={styles.activeArc}
                d="M -77.3 -212.4 A 226 226 0 0 1 77.3 -212.4"
              />
              <polygon className={styles.mark} points="0,-238 -8,-252 8,-252" />
            </svg>
            <span key={`shutter-${role}`} className={styles.shutter} />
            <div key={role} className={styles.dialLogo}>
              {roles[role]!.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- small static SVG logos
                <img src={roles[role]!.logo} alt="" />
              ) : (
                <svg viewBox="0 0 64 72" className={styles.shield}>
                  <path
                    d="M32 3 L59 13 V35 C59 52 47 63 32 69 C17 63 5 52 5 35 V13 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M20 36 L29 45 L45 26"
                    fill="none"
                    stroke="#ff6f55"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className={styles.role} aria-live="polite">
            <span className={styles.ghostIndex} aria-hidden="true">
              <span
                className={styles.odometer}
                style={{ transform: `translateY(${-role}em)` }}
              >
                {roles.map((_, i) => (
                  <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                ))}
              </span>
            </span>
            <div key={role} className={styles.swap}>
              <div className={styles.when}>
                <span className={styles.typed}>{roles[role]!.when}</span>
                {roles[role]!.current && (
                  <span className={styles.nowPill}>now</span>
                )}
              </div>
              <h3 aria-label={roles[role]!.org}>
                {roles[role]!.org.split(" ").map((word, w, words) => {
                  const before = words.slice(0, w).join("").length + w;
                  return (
                    <span key={w} className={styles.word} aria-hidden="true">
                      {[...word].map((ch, c) => (
                        <span
                          key={c}
                          className={styles.char}
                          style={{ animationDelay: `${(before + c) * 22}ms` }}
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </h3>
              <div className={styles.roleTitle}>{roles[role]!.title}</div>
              <p>{roles[role]!.what}</p>
            </div>
            <div className={styles.steps}>
              {roles.map((r, i) => (
                <i key={r.ring} className={i <= role ? styles.stepOn : ""} />
              ))}
            </div>
            <ol className={styles.sr}>
              {roles.map((r) => (
                <li key={r.ring}>
                  {r.when}: {r.title}, {r.org}. {r.what}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className={styles.wrap}>
        {github && <GithubLog data={github} />}
        <section id="writing" className={styles.writing} aria-label="Writing">
          <div className={styles.kicker}>
            <h2>Writing</h2>
            <Link className={styles.mono} href="/blog" data-label="READ">
              all {totalPosts} posts →
            </Link>
          </div>
          <div className={styles.posts}>
            {posts.map((p) => (
              <Link
                key={p.slug}
                className={styles.post}
                href={`/blog/${p.slug}`}
                data-rise
                data-label="READ"
              >
                <b>
                  {p.title.split(" ").map((w, i) => (
                    <span key={i}>
                      {i > 0 && " "}
                      <span className={styles.w}>
                        <span style={{ transitionDelay: `${i * 45}ms` }}>
                          {w}
                        </span>
                      </span>
                    </span>
                  ))}
                </b>
                <span>{month(p.date)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section
        ref={deckSection}
        className={`${styles.pin} ${styles.deckPin}`}
        aria-label="On LinkedIn"
      >
        <div className={styles.sticky}>
          <div className={`${styles.wrap} ${styles.kicker}`}>
            <h2>On LinkedIn</h2>
            <span className={styles.mono}>picked by hand · scroll to deal</span>
          </div>
          <div className={styles.table}>
            {linkedinPosts.map((p, i) => (
              <a
                key={p.href}
                ref={(el) => {
                  deckCards.current[i] = el;
                }}
                className={styles.card}
                href={p.href}
                data-label="READ"
              >
                <div className={styles.cardTop}>
                  <span>{p.topic}</span>
                  <span>{p.date}</span>
                </div>
                <q>{p.quote}</q>
                <span className={styles.go}>read on LinkedIn ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="glimpses"
        ref={glimpses}
        className={`${styles.pin} ${styles.sheetPin}`}
        aria-label="Photos"
      >
        <div className={styles.sticky}>
          <div ref={sheet} className={styles.sheet}>
            {photos.map((p, i) => (
              <figure
                key={p.src}
                ref={i === heroPhotoIndex ? focusShot : undefined}
                className={i === heroPhotoIndex ? styles.focusShot : ""}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={900}
                  height={600}
                  sizes="(max-width: 800px) 33vw, 360px"
                />
                <figcaption>
                  {String(i + 1).padStart(2, "0")} · {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div ref={sheetCaption} className={styles.overlayCap}>
            <b>More where that came from</b>
            <a href="https://photos.anselmlong.com" data-label="OPEN">
              photos.anselmlong.com ↗
            </a>
          </div>
        </div>
      </section>

      <div className={styles.wrap}>
        <section className={styles.outro} aria-label="Say hi">
          <div ref={shy} className={styles.hi} aria-label="Say hi">
            {"SAY HI".split("").map((c, i) => (
              <span key={i}>{c === " " ? " " : c}</span>
            ))}
          </div>
          <CopyEmail />
          <button
            type="button"
            className={`${styles.mono} ${styles.backUp}`}
            onClick={toChat}
            data-label="ASK"
          >
            or keep asking the chat, it&apos;s still up there ↑
          </button>
        </section>
      </div>

      {clips.map((c, i) => (
        <video
          key={c.src}
          ref={(el) => {
            videos.current[i] = el;
          }}
          src={c.src}
          poster={c.poster}
          muted
          playsInline
          loop
          preload={i === 0 ? "auto" : "none"}
          hidden
        />
      ))}
    </div>
  );
}

function RevealCard({
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
