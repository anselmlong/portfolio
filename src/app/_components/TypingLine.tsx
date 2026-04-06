"use client";

import { useState } from "react";
import Typing from "~/app/_components/Typing";

function chooseArticle(word?: string) {
  if (!word) return "a";
  const firstAlpha = (/[A-Za-z]/.exec(word.trim())?.[0] ?? "").toLowerCase();
  if (!firstAlpha) return "a";
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  // Simple heuristic per request: vowel => "an", else "a"
  return vowels.has(firstAlpha) ? "an" : "a";
}

export default function TypingLine({ strings }: { strings: string[] }) {
  const [article, setArticle] = useState(() => chooseArticle(strings?.[0]));

  const accentClass = "inline-block align-baseline ml-2 text-primary";

  return (
    <h3 className="mx-auto mb-4 max-w-3xl text-2xl leading-normal text-gray-300 md:text-3xl">
      i&apos;m {article}{" "}
      <Typing
        strings={strings}
        typeSpeed={60}
        backSpeed={40}
        backDelay={800}
        className={accentClass}
        onPreStringTyped={(_, value) => setArticle(chooseArticle(value))}
      />
    </h3>
  );
}
