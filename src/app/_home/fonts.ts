import localFont from "next/font/local";
import {
  JetBrains_Mono,
  Newsreader,
  Schibsted_Grotesk,
} from "next/font/google";

// Loaded only by the home and blog segments, not the root layout.
// Self-hosted: fetching Big Shoulders from Google during the build failed
// intermittently in CI. SIL Open Font License, see fonts/OFL.txt.
const display = localFont({
  src: "./fonts/BigShoulders-latin.woff2",
  weight: "800 900",
  variable: "--vf-display",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});
const body = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--vf-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--vf-mono",
  display: "swap",
});
const read = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--vf-read",
  display: "swap",
});

export const viewfinderFonts = [display, body, mono, read]
  .map((f) => f.variable)
  .join(" ");
