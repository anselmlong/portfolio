import "~/styles/globals.css";

import { ConditionalTopNav } from "./_components/ConditionalTopNav";
import { type Metadata } from "next";
import {
  Geist,
  Bricolage_Grotesque,
  Source_Serif_4,
  Playfair_Display,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TRPCReactProvider } from "~/trpc/react";

console.log(
  "%c👋 Hey there, fellow dev! Like what you see? Let's connect: anselmpius@gmail.com",
  "color: #c4956a; font-size: 14px; font-weight: bold; font-family: monospace;",
);

export const metadata: Metadata = {
  title: "portfolio - anselm long",
  description: "my projects, thoughts, and more!",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bg-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${bricolageGrotesque.variable} ${sourceSerif.variable} ${playfairDisplay.variable}`}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ConditionalTopNav />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
