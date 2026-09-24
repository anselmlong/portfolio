"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Message, MessageContent } from "~/components/ai-elements/message";
import { Response } from "~/components/ai-elements/response";
import { Actions, Action } from "~/components/ai-elements/actions";
import { Loader } from "~/components/ai-elements/loader";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "~/components/ai-elements/prompt-input";
import { EXAMPLE_PROMPTS } from "~/constants/example-prompts";

const examplePrompts = EXAMPLE_PROMPTS;

type LiquidPromptStyle = CSSProperties & {
  "--liquid-x": string;
  "--liquid-y": string;
};

type LiquidPromptButtonProps = {
  prompt: string;
  disabled: boolean;
  onSelect: (prompt: string) => void;
};

const liquidPromptStyle: LiquidPromptStyle = {
  "--liquid-x": "50%",
  "--liquid-y": "50%",
};

const handleLiquidPromptPointerMove = (
  event: ReactPointerEvent<HTMLButtonElement>,
) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  event.currentTarget.style.setProperty("--liquid-x", `${x}%`);
  event.currentTarget.style.setProperty("--liquid-y", `${y}%`);
};

const handleLiquidPromptPointerLeave = (
  event: ReactPointerEvent<HTMLButtonElement>,
) => {
  event.currentTarget.style.setProperty("--liquid-x", "50%");
  event.currentTarget.style.setProperty("--liquid-y", "50%");
};

const LiquidPromptButton = ({
  prompt,
  disabled,
  onSelect,
}: LiquidPromptButtonProps) => (
  <button
    type="button"
    onClick={() => onSelect(prompt)}
    onPointerMove={handleLiquidPromptPointerMove}
    onPointerLeave={handleLiquidPromptPointerLeave}
    className="liquid-prompt-button group"
    style={liquidPromptStyle}
    disabled={disabled}
  >
    <span className="liquid-prompt-button__glare" aria-hidden="true" />
    <span className="liquid-prompt-button__content">{prompt}</span>
  </button>
);

// Helper to get random prompts
const getRandomPrompts = (prompts: string[], count = 2) => {
  const shuffled = [...prompts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled.slice(0, count);
};

const loadingMessages = [
  "searching my notes...",
  "putting together an answer...",
  "thinking...",
  "digging through context...",
];

const ChatInterface = ({ inline = false }: { inline?: boolean }) => {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [displayedPrompts, setDisplayedPrompts] = useState(() =>
    getRandomPrompts(examplePrompts, 2),
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  // ref to the expanding history area so we can scroll it into view when opened
  const historyRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, regenerate, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat/agentic",
    }),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Handle example prompt clicks
  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    setExpanded(true);
    void sendMessage({
      text: prompt,
    });
    setInput("");

    // Remove clicked prompt and add a new random one
    setDisplayedPrompts((prev) => {
      const remaining = prev.filter((p) => p !== prompt);
      const unused = examplePrompts.filter((p) => !prev.includes(p));

      if (unused.length > 0) {
        // Pick a random unused prompt
        const newPrompt = unused[Math.floor(Math.random() * unused.length)];
        return [...remaining, newPrompt!];
      }

      // If all prompts have been shown, just keep the remaining ones
      return remaining;
    });
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) {
      return;
    }

    // Expand chat area when the user sends a message
    setExpanded(true);
    void sendMessage({
      text: message.text,
    });
    setInput("");
  };

  useEffect(() => {
    if (status !== "submitted") {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (!container.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [expanded]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <svg
        className="pointer-events-none absolute size-0"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="liquid-prompt-distortion" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.055"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="flex flex-col">
        <div ref={containerRef} className="relative">
          {/* History overlays above the input (no layout shift) */}
          <div
            ref={historyRef}
            className={`border-border bg-background/80 ${inline ? "relative" : "absolute right-0 bottom-full left-0 z-10"} mb-2 overflow-hidden rounded-md border backdrop-blur transition-[max-height,opacity] duration-300 ease-out ${
              expanded || inline
                ? "max-h-[40svh] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }`}
            aria-hidden={!expanded && !inline}
            inert={!expanded && !inline}
          >
            <Conversation className="scrollbar-neutral h-[40svh]">
              <ConversationContent>
                {messages.map((message: UIMessage) => (
                  <Fragment key={message.id}>
                    <Message from={message.role}>
                      <MessageContent>
                        {message.parts.map((part, i) =>
                          part.type === "text" ? (
                            <Response key={i}>{part.text}</Response>
                          ) : null,
                        )}
                      </MessageContent>
                    </Message>
                    {message.role === "assistant" &&
                      message.id === messages.at(-1)?.id && (
                        <Actions className="mt-2">
                          <Action
                            onClick={() => regenerate()}
                            label="Retry"
                            tooltip="Regenerate response"
                          >
                            <RefreshCcwIcon className="size-3" />
                          </Action>
                          <Action
                            onClick={() => {
                              const text = message.parts
                                .filter((p) => p.type === "text")
                                .map((p) => (p.type === "text" ? p.text : ""))
                                .join("");
                              void navigator.clipboard.writeText(text);
                            }}
                            label="Copy"
                            tooltip="Copy to clipboard"
                          >
                            <CopyIcon className="size-3" />
                          </Action>
                        </Actions>
                      )}
                  </Fragment>
                ))}
                {status === "submitted" && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Loader />
                    <span className="text-muted-foreground animate-pulse text-sm font-light">
                      {loadingMessages[loadingMsgIndex]}
                    </span>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-primary/30 mb-4 h-px w-12" />
                    <p className="text-muted-foreground/60 text-sm font-light text-pretty">
                      go ahead, ask me anything — i don&apos;t bite
                    </p>
                    <div className="bg-primary/30 mt-4 h-px w-12" />
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {error && (
            <p role="alert" className="my-3 text-sm text-orange-200">
              The AI couldn’t answer just now. Please try again, or explore the
              projects directly.
            </p>
          )}
          <PromptInput onSubmit={handleSubmit} className="mt-2">
            <PromptInputBody>
              <PromptInputTextarea
                className="text-medium max-h-20 min-h-10 py-3"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder="ask me anything..."
                onFocus={() => setExpanded(true)}
                rows={1}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <div className="flex-1" />
              <PromptInputSubmit
                disabled={
                  !input.trim() ||
                  status === "submitted" ||
                  status === "streaming"
                }
                status={status}
                variant="ghost"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>

        {/* Example prompts - always visible, rotate on click */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {displayedPrompts.map((prompt) => (
            <LiquidPromptButton
              key={prompt}
              prompt={prompt}
              disabled={status === "submitted" || status === "streaming"}
              onSelect={handleExampleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
