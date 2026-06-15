"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

function formatViews(viewCount: number) {
  return new Intl.NumberFormat("en-US", {
    notation: viewCount >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(viewCount);
}

export function BlogViewBeacon({
  slug,
  initialViewCount,
}: {
  slug: string;
  initialViewCount: number | null | undefined;
}) {
  const [viewCount, setViewCount] = useState(initialViewCount ?? null);
  const { mutate } = api.blog.recordView.useMutation({
    onSuccess: (data) => {
      setViewCount(data.viewCount);
    },
  });

  useEffect(() => {
    const storageKey = `blog-viewed:${slug}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }

      window.sessionStorage.setItem(storageKey, "true");
    } catch {
      // If sessionStorage is blocked, still record a normal page view.
    }

    mutate({ slug });
  }, [mutate, slug]);

  if (viewCount === null) {
    return null;
  }

  return (
    <span className="blog-count-pop inline-flex items-center gap-2">
      <span
        className="bg-primary/70 size-1.5 rounded-full"
        aria-hidden="true"
      />
      <span>{formatViews(viewCount)} views</span>
    </span>
  );
}
