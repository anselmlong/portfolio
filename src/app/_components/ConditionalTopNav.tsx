"use client";
import { usePathname } from "next/navigation";
import { TopNav } from "./topnav";

export function ConditionalTopNav() {
  const pathname = usePathname();
  
  // Hide TopNav on the /xuan route
  if (pathname === "/xuan") {
    return null;
  }
  
  return <TopNav />;
}
