"use client";

import { useEffect, useRef, useState } from "react";
import {
  chatErrorMessage,
  pickTopic,
  streamAnswer,
  TimeoutError,
  type Turn,
} from "~/lib/home-chat";
import { starters, topics, type TopicKey } from "~/lib/home-content";
import styles from "./home.module.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
};

/** Answers render as plain text, so drop the markdown emphasis the model sometimes adds. */
const tidy = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "");

/** The answer admits it doesn't know, so no card should suggest otherwise. */
const unsure = (answer: string) =>
  /not sure|don't know|do not know|email me|anselmpius@gmail/i.test(
    answer.slice(0, 400),
  );

const examples = [
  "what did you build at visa?",
  "how does the aircon bot work?",
  "won anything?",
  "do you climb?",
  "what's your stack?",
];

export function HomeChat({
  still,
  onTopic,
  onPeek,
  onType,
  onStart,
}: {
  still: boolean;
  onTopic: (topic: TopicKey | null) => void;
  onPeek: (topic: TopicKey | null) => void;
  onType: () => void;
  /** Called once, when the first question is asked. */
  onStart?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<TopicKey[]>(starters);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState(
    "ask me about kopitype, OGP, the aircon bot…",
  );
  const asked = useRef(new Set<TopicKey>());
  const nextId = useRef(1);
  const abort = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLInputElement>(null);

  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    log.current?.scrollTo?.({
      top: log.current.scrollHeight,
      behavior: still ? "auto" : "smooth",
    });
  }, [messages, still]);

  // While the box is idle, the placeholder types out example questions.
  useEffect(() => {
    if (still) return;
    let i = 0,
      typer = 0;
    const every = window.setInterval(() => {
      if (document.activeElement === box.current || box.current?.value) return;
      const ex = examples[i++ % examples.length]!;
      let k = 0;
      window.clearInterval(typer);
      typer = window.setInterval(() => {
        setPlaceholder(`ask me… ${ex.slice(0, ++k)}`);
        if (k >= ex.length) window.clearInterval(typer);
      }, 38);
    }, 4200);
    return () => {
      window.clearInterval(every);
      window.clearInterval(typer);
    };
  }, [still]);

  const update = (id: number, patch: Partial<Message>) =>
    setMessages((all) =>
      all.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  // The tapped chip flies into the conversation and becomes your message. The
  // copy is styled as the bubble and lives inside the page's root (so it keeps
  // the site's fonts), and it chases the bubble's position every frame, so it
  // lands right even while the log scrolls.
  function fly(from: HTMLElement | null, userId: number) {
    if (still || !from) return;
    const a = from.getBoundingClientRect();
    const host = from.closest(`.${styles.root}`) ?? document.body;
    requestAnimationFrame(() => {
      const bubble = log.current?.querySelector<HTMLElement>(
        `[data-id="${userId}"]`,
      );
      if (!bubble) return;
      const ghost = document.createElement("div");
      ghost.className = `${styles.msg} ${styles.me} ${styles.flying}`;
      ghost.textContent = bubble.textContent;
      ghost.setAttribute("aria-hidden", "true");
      host.append(ghost);
      bubble.style.visibility = "hidden";
      const start = performance.now();
      const ease = (t: number) => 1 - (1 - t) ** 3;
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / 620),
          e = ease(t);
        const b = bubble.getBoundingClientRect();
        const lift = Math.sin(t * Math.PI) * 36;
        Object.assign(ghost.style, {
          left: `${a.left + (b.left - a.left) * e}px`,
          top: `${a.top + (b.top - a.top) * e - lift}px`,
          width: `${a.width + (b.width - a.width) * e}px`,
          height: `${a.height + (b.height - a.height) * e}px`,
          rotate: `${Math.sin(t * Math.PI) * -2}deg`,
        });
        if (t < 1) requestAnimationFrame(frame);
        else {
          ghost.remove();
          bubble.style.visibility = "";
        }
      };
      requestAnimationFrame(frame);
    });
  }

  async function ask(
    text: string,
    topic: TopicKey | null,
    from: HTMLElement | null,
  ) {
    const question = text.trim();
    if (!question || busy) return;
    abort.current?.abort();
    const request = new AbortController();
    abort.current = request;
    onStart?.();
    setBusy(true);
    setError("");
    onPeek(null);
    if (topic) asked.current.add(topic);
    const history: Turn[] = messages
      .filter((m) => !m.pending && m.text)
      .map((m) => ({ role: m.role, content: m.text }));
    const userId = nextId.current++,
      replyId = nextId.current++;
    setMessages((all) => [
      ...all,
      { id: userId, role: "user", text: question },
      { id: replyId, role: "assistant", text: "", pending: true },
    ]);
    // On the first question the whole page morphs instead.
    if (history.length) fly(from, userId);

    // A chip knows its card. For free text, Jev picks one once it can see the
    // start of the answer, so the card matches what was actually said; until
    // then, the last answer's card is cleared.
    let chosen: TopicKey | null = topic;
    let asking = false;
    const reveal = (answer: string) => {
      if (topic || asking) return;
      asking = true;
      if (unsure(answer)) return;
      void pickTopic(history, question, request.signal, answer).then(
        (picked) => {
          if (picked && !request.signal.aborted) {
            chosen = picked;
            onTopic(picked);
          }
        },
      );
    };
    onTopic(topic);

    try {
      const query = topic ? (topics[topic].ask ?? question) : question;
      const answer = await streamAnswer(
        history,
        query,
        request.signal,
        (text) => {
          update(replyId, { text, pending: false });
          if (text.length >= 180) reveal(text);
        },
      );
      reveal(answer);
      if (!topic && unsure(answer)) {
        chosen = null;
        onTopic(null);
      }
      const next = (chosen ? topics[chosen].next : starters).filter(
        (k) => !asked.current.has(k),
      );
      const rest = (Object.keys(topics) as TopicKey[]).filter(
        (k) => !asked.current.has(k) && !next.includes(k),
      );
      setChips([...next, ...rest].slice(0, 3));
    } catch (failure) {
      const timedOut = failure instanceof TimeoutError;
      setMessages((all) => all.filter((m) => m.id !== replyId));
      console.error("[chat] request failed", failure);
      if (!request.signal.aborted || timedOut) {
        setError(chatErrorMessage(failure, timedOut));
        if (!topic) setInput((current) => current || question);
      }
    } finally {
      if (abort.current === request) {
        abort.current = null;
        setBusy(false);
      }
    }
  }

  return (
    <div className={styles.chatbox}>
      <div
        ref={log}
        className={styles.log}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            data-id={m.id}
            className={`${styles.msg} ${m.role === "user" ? styles.me : ""} ${m.pending ? styles.dots : ""}`}
          >
            {m.pending ? (
              <span aria-label="Anselm is typing">
                <i />
                <i />
                <i />
              </span>
            ) : m.role === "assistant" ? (
              tidy(m.text)
            ) : (
              m.text
            )}
          </div>
        ))}
      </div>
      <div
        className={`${styles.chips} ${busy ? styles.leaving : ""}`}
        aria-label="Suggested questions"
        data-chips
      >
        {chips.map((key, i) => (
          <button
            key={key}
            type="button"
            className={styles.chip}
            style={{ animationDelay: `${i * 80}ms` }}
            disabled={busy}
            onClick={(e) =>
              void ask(topics[key].question, key, e.currentTarget)
            }
            onPointerEnter={() => !busy && onPeek(key)}
            onPointerLeave={() => onPeek(null)}
            onFocus={() => !busy && onPeek(key)}
            onBlur={() => onPeek(null)}
          >
            {topics[key].question}
          </button>
        ))}
      </div>
      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          const text = input;
          setInput("");
          void ask(text, null, null);
        }}
      >
        <label className={styles.sr} htmlFor="ask-anselm">
          Ask Anselm
        </label>
        <input
          ref={box}
          id="ask-anselm"
          autoComplete="off"
          maxLength={1200}
          value={input}
          placeholder={placeholder}
          onChange={(e) => {
            setInput(e.target.value);
            onType();
          }}
        />
        <button type="submit" disabled={!input.trim() || busy}>
          send
        </button>
      </form>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <p className={styles.fine}>
        Replies are AI-generated from my notes, so they can be wrong.
      </p>
    </div>
  );
}
