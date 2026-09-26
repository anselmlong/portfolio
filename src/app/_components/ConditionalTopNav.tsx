"use client";
import { TopNav } from "./topnav";
import { usePathname } from "next/navigation";

export function ConditionalTopNav() {
  const pathname = usePathname();
  // Only the older /photos page still uses this nav; everything else has its own header.
  if (!pathname.startsWith("/photos")) return null;
  return <TopNav />;
}
