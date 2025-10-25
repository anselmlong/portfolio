"use client";

import { useMemo, useState } from "react";
import Typing from "~/app/_components/Typing";

function chooseArticle(word?: string) {
  if (!word) return "a";
  const firstAlpha = (word.trim().match(/[A-Za-z]/)?.[0] || "").toLowerCase();
  if (!firstAlpha) return "a";
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  // Simple heuristic per request: vowel => "an", else "a"
  return vowels.has(firstAlpha) ? "an" : "a";
}

export default function TypingLine({
  strings,
}: {
  strings: string[];
}) {
  const [article, setArticle] = useState(() => chooseArticle(strings?.[0]));

  const gradientClass =
    "inline-block align-baseline ml-2 bg-gradient-to-b from-[#FE4E00] to-[#55433F] bg-clip-text text-transparent";

  return (
    <h3 className="text-2xl md:text-3xl text-gray-300 mb-4 max-w-3xl mx-auto leading-normal">
      i'm {article}{" "}
      <Typing
        strings={strings}
        typeSpeed={60}
        backSpeed={40}
        backDelay={800}
        className={gradientClass}
        onPreStringTyped={(_, value) => setArticle(chooseArticle(value))}
      />
    </h3>
  );
}
