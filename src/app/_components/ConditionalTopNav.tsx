"use client";
import { TopNav } from "./topnav";
import { usePathname } from "next/navigation";

export function ConditionalTopNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <TopNav />;
}
