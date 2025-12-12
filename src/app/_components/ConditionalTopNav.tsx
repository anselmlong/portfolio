"use client";
import { usePathname } from "next/navigation";
import { TopNav } from "./topnav";

export function ConditionalTopNav() {
  const pathname = usePathname();
  
  return <TopNav />;
}
