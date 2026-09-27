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

  // The tapped chip flies into the conversation and becomes your message.
  function fly(from: HTMLElement | null, userId: number) {
    if (still || !from) return;
    const a = from.getBoundingClientRect();
    requestAnimationFrame(() => {
      const bubble = log.current?.querySelector<HTMLElement>(
        `[data-id="${userId}"]`,
      );
      if (!bubble) return;
      const b = bubble.getBoundingClientRect();
      const ghost = from.cloneNode(true) as HTMLElement;
      ghost.className = `${styles.chip} ${styles.flying}`;
      Object.assign(ghost.style, {
        left: `${a.left}px`,
        top: `${a.top}px`,
        width: `${a.width}px`,
        height: `${a.height}px`,
        translate: "",
        rotate: "",
      });
      document.body.append(ghost);
      bubble.style.visibility = "hidden";
      ghost.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          {
            transform: `translate(${(b.left - a.left) * 0.5}px,${(b.top - a.top) * 0.5 - 40}px) scale(1.06) rotate(-2deg)`,
            offset: 0.55,
          },
          {
            transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(1)`,
            width: `${b.width}px`,
            height: `${b.height}px`,
          },
        ],
        { duration: 560, easing: "cubic-bezier(.3,.7,.2,1)" },
      ).onfinish = () => {
        ghost.remove();
        bubble.style.visibility = "";
      };
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
    fly(from, userId);

    // A chip knows its card; free text asks Jev, in parallel with the answer.
    let chosen: TopicKey | null = topic;
    if (topic) onTopic(topic);
    else
      void pickTopic(history, question, request.signal).then((picked) => {
        if (picked && !request.signal.aborted) {
          chosen = picked;
          onTopic(picked);
        }
      });

    try {
      const query = topic ? (topics[topic].ask ?? question) : question;
      await streamAnswer(history, query, request.signal, (answer) =>
        update(replyId, { text: answer, pending: false }),
      );
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
