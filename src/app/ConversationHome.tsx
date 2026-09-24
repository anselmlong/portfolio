"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  MessageCircle,
  RotateCcw,
  X,
} from "lucide-react";
import {
  choices,
  curatedReply,
  isReply,
  type Intent,
  type Reply,
} from "~/lib/conversation";
import { experiences, projects } from "~/lib/portfolio-content";
import styles from "./ConversationHome.module.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  reply?: Reply;
};
const phrase = "steady lah, one step at a time";

function TypingPreview({ id }: { id: number }) {
  const [value, setValue] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const start = useRef<number | null>(null);
  return (
    <div className={styles.game}>
      <div className={styles.gameHeader}>
        <span>Kopitype / mini round</span>
        <span>Local preview</span>
      </div>
      <p className={styles.typePhrase} aria-hidden="true">
        {[...phrase].map((char, i) => (
          <span
            key={i}
            data-match={
              i < value.length ? (value[i] === char ? "yes" : "no") : undefined
            }
          >
            {char}
          </span>
        ))}
      </p>
      <label htmlFor={`typing-${id}`}>Type: {phrase}</label>
      <input
        id={`typing-${id}`}
        value={value}
        disabled={score !== null}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        maxLength={phrase.length}
        onPaste={(e) => e.preventDefault()}
        onChange={(e) => {
          if (e.target.value && start.current === null)
            start.current = Date.now();
          setValue(e.target.value);
          if (e.target.value === phrase && start.current !== null)
            setScore(
              Math.round(
                phrase.length /
                  5 /
                  (Math.max(Date.now() - start.current, 1000) / 60000),
              ),
            );
        }}
        placeholder="Your first keystroke starts the clock"
      />
      <div className={styles.gameFooter}>
        <span role="status">
          {score === null
            ? "No account. No leaderboard. Just you."
            : `${score} WPM. Steady! Short round, not a benchmark.`}
        </span>
        <button
          onClick={() => {
            setValue("");
            setScore(null);
            start.current = null;
          }}
        >
          Retry <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}

function Reveal({ reply, id }: { reply: Reply; id: number }) {
  return (
    <div className={styles.reveal}>
      {reply.intent === "play" && <TypingPreview id={id} />}
      {reply.intent === "experience" && (
        <div className={styles.experienceReveal}>
          <BriefcaseBusiness size={22} />
          <div>
            <strong>Open Government Products</strong>
            <span>Software Engineer Intern · Maps team</span>
            <small>Aug 2026–present</small>
          </div>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Résumé <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      {reply.intent === "photos" && (
        <a
          className={styles.photoReveal}
          href="https://photos.anselmlong.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/photos/main/portrait.jpeg"
            alt="Anselm Long"
            width={600}
            height={420}
          />
          <span>
            Life through a different lens <ArrowUpRight size={18} />
          </span>
        </a>
      )}
      {reply.intent === "contact" && (
        <a className={styles.contactLink} href="mailto:anselmpius@gmail.com">
          anselmpius@gmail.com <ArrowUpRight size={18} />
        </a>
      )}
      {reply.projects.map((name) => {
        const project = projects.find((p) => p.name === name);
        return project ? (
          <a
            key={name}
            className={styles.inlineProject}
            href={project.url}
            target={project.url.startsWith("https") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            <span>
              <strong>{project.name}</strong>
              <small>{project.description}</small>
              <em>{project.tech}</em>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        ) : null;
      })}
    </div>
  );
}

export default function ConversationHome() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All projects");
  const [closed, setClosed] = useState(false);
  const nextId = useRef(1);
  const pending = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    const el = transcript.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);
  function add(role: Message["role"], text: string, reply?: Reply) {
    setMessages((previous) => [
      ...previous,
      { id: nextId.current++, role, text, reply },
    ]);
  }
  function reset() {
    abort.current?.abort();
    abort.current = null;
    pending.current = false;
    setMessages([]);
    setInput("");
    setBusy(false);
    setError("");
    composer.current?.focus();
  }
  function choose(intent: Intent, label: string) {
    if (pending.current) return;
    setError("");
    add("user", label);
    const reply = curatedReply(intent);
    add("assistant", reply.text, reply);
  }
  async function send() {
    const text = input.trim();
    if (!text || pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    setInput("");
    const request = new AbortController();
    abort.current = request;
    const history = messages
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.text.slice(0, 1200) }));
    add("user", text);
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(28000)]),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text }],
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !isReply(data)) throw new Error("Unavailable");
      if (!request.signal.aborted) add("assistant", data.text, data);
    } catch {
      if (!request.signal.aborted) {
        setError(
          "The AI guide couldn’t answer just now. Your draft is preserved—try again, or choose a reply below.",
        );
        setInput((current) => current || text);
      }
    } finally {
      if (abort.current === request) {
        pending.current = false;
        setBusy(false);
        abort.current = null;
      }
    }
  }
  function browse() {
    gallery.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    gallery.current?.focus({ preventScroll: true });
  }
  const visible = projects.filter(
    (p) =>
      filter === "All projects" ||
      (filter === "Live sites"
        ? p.status.includes("live site")
        : !p.status.includes("live site")),
  );
  return (
    <main className={styles.page} data-conversation-home>
      <header className={styles.header}>
        <a href="#conversation" className={styles.wordmark}>
          Anselm Long<span>Software engineer & curious human</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Work</a>
          <Link href="/blog">Writing</Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Résumé <ArrowUpRight size={14} />
          </a>
          <a href="mailto:anselmpius@gmail.com" className={styles.navContact}>
            Say hello <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>
      <section
        id="conversation"
        ref={hero}
        className={`${styles.hero} ${closed ? styles.collapsed : ""}`}
        aria-label="Portfolio conversation"
      >
        <div className={styles.chatBar}>
          <span>
            <span className={styles.statusDot} /> A little conversation with my
            work
          </span>
          {messages.length > 0 && !closed && (
            <button onClick={reset} aria-label="Start a new conversation">
              <RotateCcw size={15} /> New chat
            </button>
          )}
          {!closed && (
            <button
              onClick={() => {
                abort.current?.abort();
                abort.current = null;
                pending.current = false;
                setBusy(false);
                setClosed(true);
                browse();
              }}
              aria-label="Close conversation and browse projects"
            >
              <X size={17} />
            </button>
          )}
        </div>
        {closed ? (
          <div className={styles.closed}>
            <p>Your conversation is here when you want it.</p>
            <button onClick={() => setClosed(false)}>
              <MessageCircle size={17} /> Reopen conversation
            </button>
          </div>
        ) : (
          <>
            <div
              ref={transcript}
              role="log"
              aria-label="Conversation messages"
              aria-live="polite"
              aria-relevant="additions"
              className={`${styles.transcript} ${messages.length ? styles.activeTranscript : ""}`}
              tabIndex={0}
            >
              <div className={styles.intro}>
                <Image
                  className={styles.avatar}
                  src="/photos/main/portrait.jpeg"
                  width={52}
                  height={52}
                  alt="Anselm Long"
                  priority
                />
                <div>
                  <h1>
                    Hey, I’m Anselm.
                    <br />
                    <span>What brings you here?</span>
                  </h1>
                  <p>
                    I build software, take photographs, and follow my curiosity.
                    <br className={styles.desktopOnly} /> Ask about my work—or
                    let’s find something you can play with.
                  </p>
                  <p className={styles.current}>
                    <BriefcaseBusiness size={15} /> Currently at OGP · Maps team
                  </p>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? styles.userMessage
                      : styles.assistantMessage
                  }
                >
                  <span className={styles.speaker}>
                    {message.role === "user" ? "You" : "Anselm’s guide"}
                  </span>
                  <p>{message.text}</p>
                  {message.reply && (
                    <Reveal reply={message.reply} id={message.id} />
                  )}{" "}
                  {message.reply?.note && (
                    <small className={styles.note}>{message.reply.note}</small>
                  )}
                </div>
              ))}
              {busy && (
                <div className={styles.thinking} role="status">
                  <span />
                  <span />
                  <span /> Finding the right thread…
                </div>
              )}
            </div>
            <div className={styles.chatBottom}>
              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}
              <div className={styles.choices} aria-label="Suggested replies">
                {choices.map((choice) => (
                  <button
                    disabled={busy}
                    key={choice.intent}
                    onClick={() => choose(choice.intent, choice.label)}
                  >
                    {choice.label}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
                {messages.length > 0 && (
                  <button
                    disabled={busy}
                    onClick={() => choose("contact", "How can I get in touch?")}
                  >
                    Get in touch <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
              <form
                className={styles.composer}
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <label className={styles.srOnly} htmlFor="portfolio-question">
                  Ask about Anselm’s work
                </label>
                <textarea
                  id="portfolio-question"
                  ref={composer}
                  rows={2}
                  maxLength={1200}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my projects, experience, or anything in between…"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <div className={styles.composerFooter}>
                  <span>
                    <MessageCircle size={14} /> Your curiosity, the starting
                    point.
                  </span>
                  <button
                    type="submit"
                    disabled={!input.trim() || busy}
                    aria-label="Send message"
                  >
                    <ArrowUp size={19} />
                  </button>
                </div>
              </form>
              <p className={styles.disclosure}>
                AI guide, not a live chat with me. Free text goes to TypeSafe
                and OpenAI. Please don’t share sensitive information.
              </p>
            </div>
          </>
        )}
        <button className={styles.browse} onClick={browse}>
          Rather look around? Browse the work <ArrowDown size={16} />
        </button>
      </section>
      <section
        id="projects"
        ref={gallery}
        tabIndex={-1}
        className={styles.showcase}
        aria-labelledby="work-title"
      >
        <div className={styles.sectionTop}>
          <div>
            <h2 id="work-title">
              Less talk.
              <br />
              <span>More things I’ve made.</span>
            </h2>
            <p>
              Useful tools, small experiments, and a few ideas that got out of
              hand.
            </p>
          </div>
          <button
            onClick={() => {
              setClosed(false);
              hero.current?.scrollIntoView({ behavior: "instant" });
              requestAnimationFrame(() =>
                composer.current?.focus({ preventScroll: true }),
              );
            }}
          >
            <MessageCircle size={16} /> Back to the conversation
          </button>
        </div>
        <div className={styles.featured}>
          <a
            href="https://kopitype.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.feature} ${styles.kopitype}`}
          >
            <div className={styles.featureArt}>
              <span>kopitype</span>
              <p>
                steady lah,
                <br />
                one keystroke
                <br />
                at a time<span className={styles.caret}>|</span>
              </p>
              <small>A typing test. With a local accent.</small>
            </div>
            <div className={styles.featureCaption}>
              <span>Made in Singapore. Typed anywhere.</span>
              <ArrowUpRight size={22} />
            </div>
          </a>
          <a
            href="https://routes.anselmlong.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.feature} ${styles.routes}`}
          >
            <div className={styles.featureArt}>
              <span>Route Archiver</span>
              <p>
                From the wall.
                <br />
                To your next
                <br />
                climb.
              </p>
              <div className={styles.gradeRow} aria-hidden="true">
                <span>V2</span>
                <span>V4</span>
                <span>V6</span>
              </div>
              <small>Find a route. Keep the beta.</small>
            </div>
            <div className={styles.featureCaption}>
              <span>A climbing archive, born in Telegram.</span>
              <ArrowUpRight size={22} />
            </div>
          </a>
        </div>
        <div className={styles.filterRow}>
          <h3>All the other rabbit holes.</h3>
          <div aria-label="Filter projects">
            {["All projects", "Live sites", "Experiments"].map((option) => (
              <button
                key={option}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {filter === option && <Check size={13} />} {option}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.srOnly} role="status">
          {visible.length} projects shown
        </p>
        <div className={styles.projectGrid}>
          {visible.map((project) => (
            <article key={project.name}>
              <a
                href={project.url}
                target={project.url.startsWith("https") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <div>
                  <h4>{project.name}</h4>
                  <ArrowUpRight size={19} />
                </div>
                <p>{project.description}</p>
                <footer>
                  <span>{project.status}</span>
                  <span>{project.tech}</span>
                </footer>
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.about} aria-labelledby="about-title">
        <div>
          <Image
            src="/photos/main/portrait.jpeg"
            width={600}
            height={720}
            alt="Anselm Long"
            className={styles.aboutPhoto}
          />
          <a
            href="https://photos.anselmlong.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            A different kind of portfolio <ArrowUpRight size={18} />
          </a>
        </div>
        <div>
          <h2 id="about-title">
            A person behind
            <br />
            the projects.
          </h2>
          <p>
            I’m Anselm, a computer science student at NUS and a Software
            Engineer Intern on the Maps team at Open Government Products.
          </p>
          <p>
            I’m drawn to things that make everyday life a little easier. Outside
            of software: photography, climbing, coffee, and whatever I’m curious
            about next.
          </p>
          <div className={styles.history}>
            {experiences.slice(0, 5).map((experience) => (
              <div key={experience.name}>
                <strong>{experience.name}</strong>
                <span>{experience.period}</span>
              </div>
            ))}
          </div>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            The longer version, on my résumé <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <footer className={styles.footer}>
        <div>
          <h2>
            Let’s make
            <br />
            something useful.
          </h2>
          <a href="mailto:anselmpius@gmail.com">
            Say hello <ArrowUpRight size={25} />
          </a>
        </div>
        <div className={styles.footerBottom}>
          <span>Anselm Long · Singapore</span>
          <nav aria-label="Social links">
            <a
              href="https://github.com/anselmlong"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link href="/blog">Writing</Link>
            <a
              href="https://photos.anselmlong.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photography
            </a>
          </nav>
          <a href="#conversation">
            Back to top <ArrowUp size={15} />
          </a>
        </div>
      </footer>
    </main>
  );
}
