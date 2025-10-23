"use client";

import { cn } from "~/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "prose prose-invert prose-sm", // Add prose styling like your blog
        "prose-p:text-gray-300 prose-p:leading-relaxed",
        "prose-a:text-gray-400 prose-a:underline",
        "prose-code:text-gray-300 prose-code:bg-gray-900",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
