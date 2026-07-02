/**
 * Deployed sub-sites of the anselmlong.com ecosystem.
 * Each entry renders as a card in the homepage ecosystem section —
 * adding a new deployed project is a one-line change here.
 */
export type EcosystemSite = {
  name: string;
  url: string;
  tagline: string;
  emoji: string;
};

export const ecosystemSites: EcosystemSite[] = [
  {
    name: "canvas scraper",
    url: "https://canvas.anselmlong.com",
    tagline: "auto-downloads your canvas course files, skips the 2GB lectures",
    emoji: "📚",
  },
  {
    name: "hood score",
    url: "https://hood.anselmlong.com",
    tagline: "data-driven livability scores for every planning area in singapore",
    emoji: "🏙️",
  },
  {
    name: "photos",
    url: "https://photos.anselmlong.com",
    tagline: "portraits, weddings, events, and motion work",
    emoji: "📷",
  },
  {
    name: "shitpost",
    url: "https://shitpost.anselmlong.com",
    tagline: "ai-generated linkedin shitposts, six comedic personas",
    emoji: "💼",
  },
];
