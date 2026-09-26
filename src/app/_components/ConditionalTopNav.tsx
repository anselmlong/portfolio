"use client";
import { TopNav } from "./topnav";
import { usePathname } from "next/navigation";

export function ConditionalTopNav() {
  const pathname = usePathname();
  // The homepage and blog carry their own header.
  if (pathname === "/" || pathname.startsWith("/blog")) return null;
  return <TopNav />;
}
