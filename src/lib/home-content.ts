// Everything the homepage shows, in one place. Facts here are verified against
// Anselm's repos, blog, résumé and LinkedIn posts, or were confirmed by him.

export type SceneKey =
  | "sf"
  | "lake"
  | "elcap"
  | "computah"
  | "optifiner"
  | "confessit"
  | "almost"
  | "kopi"
  | "bots"
  | "canvas"
  | "photos";

export type Scene =
  | { kind: "clip"; clip: number; label: string }
  | { kind: "pan"; src: string; label: string }
  | { kind: "slides"; srcs: string[]; label: string };

export const clips = [
  { src: "/home/hero-sf.mp4", poster: "/home/hero-sf.jpg", label: "Golden Gate, San Francisco" },
  { src: "/home/hero-lake.mp4", poster: "/home/hero-lake.jpg", label: "A lake in Slovenia" },
  { src: "/home/hero-elcap.mp4", poster: "/home/hero-elcap.jpg", label: "El Capitan, Yosemite" },
];

export const photos = [
  { src: "/home/p-anselm-0440.jpg", alt: "Mount Fuji under a clear sky", caption: "Fuji" },
  { src: "/home/p-copy-of-dscf0630.jpg", alt: "A New York street between tall buildings", caption: "New York" },
  { src: "/home/p-copy-of-dscf0792.jpg", alt: "The white ribs of the Oculus against the sky", caption: "Oculus" },
  { src: "/home/p-dscf4266.jpg", alt: "An alley strung with bunting", caption: "Alley" },
  { src: "/home/p-anselm-0673.jpg", alt: "Dancers mid-performance on a dark stage", caption: "On stage" },
  { src: "/home/p-anselm-4364.jpg", alt: "A black cat staring into the lens", caption: "Cat" },
];
/** The photo the contact sheet zooms into. */
export const heroPhotoIndex = 4;

export const scenes: Record<SceneKey, Scene> = {
  sf: { kind: "clip", clip: 0, label: clips[0]!.label },
  lake: { kind: "clip", clip: 1, label: clips[1]!.label },
  elcap: { kind: "clip", clip: 2, label: clips[2]!.label },
  computah: { kind: "pan", src: "/home/s-computah.jpg", label: "computah.anselmlong.com, live" },
  optifiner: { kind: "pan", src: "/home/s-optifiner.jpg", label: "optifiner.dev, live" },
  confessit: { kind: "pan", src: "/home/s-confessit-umap.jpg", label: "72,000 confessions, embedded" },
  almost: { kind: "pan", src: "/home/s-almost.jpg", label: "fine-tuning log, 38 hours to go" },
  kopi: { kind: "pan", src: "/home/s-kopitype.jpg", label: "kopitype.com, live" },
  bots: { kind: "pan", src: "/home/s-bots.jpg", label: "bot.anselmlong.com, live" },
  canvas: { kind: "pan", src: "/home/s-canvas.jpg", label: "canvas-scraper.vercel.app, live" },
  photos: { kind: "slides", srcs: [0, 1, 4, 2].map((i) => photos[i]!.src), label: "photos, by me" },
};

export type Card =
  | { kind: "text"; kicker: string; title: string; body: string; link?: { href: string; label: string } }
  | { kind: "experience" }
  | { kind: "game" }
  | { kind: "contact" };

export type TopicKey =
  | "shipped"
  | "working"
  | "technical"
  | "kopi"
  | "computah"
  | "ava"
  | "almost"
  | "confessit"
  | "canvas"
  | "shitpost"
  | "aircon"
  | "sixseven"
  | "visa"
  | "aegis"
  | "stack"
  | "hack"
  | "life"
  | "climb"
  | "footage"
  | "contact";

export type Topic = { question: string; scene: SceneKey; next: TopicKey[]; card: Card };

export const topics: Record<TopicKey, Topic> = {
  shipped: {
    question: "what have you shipped?",
    scene: "computah",
    next: ["technical", "ava", "sixseven"],
    card: { kind: "text", kicker: "related", title: "Computah", body: "A desktop AI assistant that sees and operates your computer, inside explicit security boundaries.", link: { href: "https://computah.anselmlong.com", label: "computah.anselmlong.com" } },
  },
  working: {
    question: "what are you working on?",
    scene: "sf",
    next: ["visa", "aegis", "stack"],
    card: { kind: "experience" },
  },
  technical: {
    question: "what's the most technical thing you've built?",
    scene: "optifiner",
    next: ["computah", "almost", "aegis"],
    card: { kind: "text", kicker: "hack & roll 2026", title: "Optifiner", body: "Darwinian, multi-agent code optimisation: 10+ agents propose changes, and only the ones that beat your benchmark survive.", link: { href: "https://optifiner.dev", label: "optifiner.dev" } },
  },
  kopi: {
    question: "let me play something",
    scene: "kopi",
    next: ["hack", "life", "shipped"],
    card: { kind: "game" },
  },
  computah: {
    question: "how does computah work?",
    scene: "computah",
    next: ["ava", "technical", "stack"],
    card: { kind: "text", kicker: "desktop ai", title: "Computah", body: "Sees the screen and operates the computer, within explicit security boundaries, shipped through a signed-app release workflow.", link: { href: "https://computah.anselmlong.com", label: "computah.anselmlong.com" } },
  },
  ava: {
    question: "who's ava?",
    scene: "lake",
    next: ["almost", "computah", "stack"],
    card: { kind: "text", kicker: "my agent", title: "Ava", body: "Runs on Hermes Agent on my own VPS, lives on Telegram, and has GitHub and Vercel integrations. A lot of what I build starts as a message to her.", link: { href: "https://github.com/anselmlong/ava", label: "github" } },
  },
  almost: {
    question: "can an ai text like you?",
    scene: "almost",
    next: ["confessit", "ava", "technical"],
    card: { kind: "text", kicker: "almost anselm", title: "Fine-tuned me", body: "Telethon → cleaned dataset → Axolotl + QLoRA on Mistral-7B → a bot that texts like me, mostly.", link: { href: "/blog/almost-anselm", label: "read the post" } },
  },
  confessit: {
    question: "what's confessit?",
    scene: "confessit",
    next: ["almost", "technical", "shipped"],
    card: { kind: "text", kicker: "data + ml", title: "72,000 confessions", body: "A web version of NUS ConfessIT, an embedding map of what goes viral, and a Qwen 2.5 7B fine-tune.", link: { href: "https://confessit.space", label: "confessit.space" } },
  },
  canvas: {
    question: "what's the canvas scraper?",
    scene: "canvas",
    next: ["aircon", "shipped", "life"],
    card: { kind: "text", kicker: "automation", title: "Canvas scraper", body: "Daily sync of course files, junk filtered out, a digest emailed. Runs free on GitHub Actions.", link: { href: "https://canvas-scraper.vercel.app", label: "canvas-scraper.vercel.app" } },
  },
  shitpost: {
    question: "anything just for fun?",
    scene: "sf",
    next: ["sixseven", "kopi", "life"],
    card: { kind: "text", kicker: "satire", title: "Your career depends on this.", body: "The LinkedIn shitpost generator: six comedic personas, one topic, zero shame.", link: { href: "https://shitpost.anselmlong.com", label: "shitpost.anselmlong.com" } },
  },
  aircon: {
    question: "how does the aircon bot work?",
    scene: "bots",
    next: ["sixseven", "hack", "working"],
    card: { kind: "text", kicker: "aircon bot", title: "@aircon_checker_bot", body: "Reverse-engineered the EVS2 portal's API. Works for RVRC, Acacia, Pioneer House and other cp2evs residences.", link: { href: "https://bot.anselmlong.com/aircon", label: "try it" } },
  },
  sixseven: {
    question: "what's the 67 bot?",
    scene: "sf",
    next: ["hack", "shitpost", "life"],
    card: { kind: "text", kicker: "one evening's work", title: "67 bot", body: "EasyOCR, a regex pass, a vision-model fallback, and a SQLite leaderboard.", link: { href: "https://github.com/anselmlong/six-seven-bot", label: "github" } },
  },
  visa: {
    question: "what did you do at visa?",
    scene: "lake",
    next: ["aegis", "stack", "working"],
    card: { kind: "text", kicker: "visa, 2026", title: "Investigation assistant", body: "A retrieval-augmented assistant for incident investigation, built to support operators.", link: { href: "/blog/visa-internship", label: "read the write-up" } },
  },
  aegis: {
    question: "tell me about project aegis",
    scene: "elcap",
    next: ["hack", "stack", "shipped"],
    card: { kind: "text", kicker: "jan – mar 2026", title: "Project Aegis", body: "Guarded LLM access for 80 CTF players: rate limits, guardrails, a RAG over security knowledge, and token budgets. 316 PRs in two months.", link: { href: "/blog/building-aegis", label: "read the post" } },
  },
  stack: {
    question: "what's your stack?",
    scene: "lake",
    next: ["shipped", "hack", "working"],
    card: { kind: "text", kicker: "tools", title: "TypeScript + Python", body: "Next.js · tRPC · FastAPI · Postgres/pgvector · LangGraph · Playwright · Docker" },
  },
  hack: {
    question: "won anything?",
    scene: "sf",
    next: ["kopi", "shipped", "life"],
    card: { kind: "text", kicker: "hackathons", title: "Funniest Hack", body: "Freak-cha at HackHarvard 2025, out of 532 participants. Plus a Marshall Wace prize for Optifiner at Hack & Roll 2026.", link: { href: "/blog/freak-cha", label: "read about freak-cha" } },
  },
  life: {
    question: "what's outside the code?",
    scene: "photos",
    next: ["climb", "footage", "hack"],
    card: { kind: "text", kicker: "photos by me", title: "Glimpses", body: "Fuji, New York, a dance show, the Oculus.", link: { href: "https://photos.anselmlong.com", label: "photos.anselmlong.com" } },
  },
  climb: {
    question: "do you climb?",
    scene: "elcap",
    next: ["footage", "life", "shipped"],
    card: { kind: "text", kicker: "climbing", title: "On the wall", body: "Climbing around Singapore with friends, and setting routes at the NUS USC gym.", link: { href: "https://routes.anselmlong.com", label: "the route archive" } },
  },
  footage: {
    question: "where's this footage from?",
    scene: "lake",
    next: ["life", "climb", "shipped"],
    card: { kind: "text", kicker: "reels", title: "Shot by me", body: "San Francisco, Yosemite, Slovenia, and more on the photo site.", link: { href: "https://photos.anselmlong.com", label: "photos.anselmlong.com" } },
  },
  contact: {
    question: "how do i reach you?",
    scene: "sf",
    next: ["shipped", "working", "life"],
    card: { kind: "contact" },
  },
};

export const starters: TopicKey[] = ["shipped", "working", "technical", "kopi"];

/** Maps a project name Jev can choose (see portfolio-content.ts) to a topic. */
export const projectTopics: Record<string, TopicKey> = {
  "Computah (desktop AI assistant)": "computah",
  "Ava (Anselm's personal AI agent)": "ava",
  "Optifiner (evolutionary multi-agent code optimiser)": "technical",
  "ConfessIT (NUS confessions site and analysis)": "confessit",
  "Almost Anselm (an AI fine-tuned to text like Anselm)": "almost",
  "Kopitype (Singlish typing test)": "kopi",
  "67 bot (Telegram bot that spots the number 67)": "sixseven",
  "Aircon checker bot": "aircon",
  "Daily gospel bot": "aircon",
  "Canvas scraper": "canvas",
  "LinkedIn shitpost generator": "shitpost",
};

/** Maps Jev's intent choice to a topic when no specific project was named. */
export const intentTopics: Partial<Record<string, TopicKey>> = {
  experience: "working",
  play: "kopi",
  photos: "life",
  contact: "contact",
};

export const roles = [
  { when: "Aug 2026 – now", name: "OGP", what: "Software engineer intern on the Maps team at Open Government Products, shipping features to production and building an enhanced ingestion feature." },
  { when: "May 2026", name: "Visa", what: "Software engineering intern. Built a retrieval-augmented assistant for incident investigation, and met z/TPF." },
  { when: "Jan – Mar 2026", name: "Project Aegis", what: "Lead developer of a guarded AI-access platform for 80 CTF players at the National Cybersecurity Olympiad. 316 PRs in two months." },
  { when: "May – Aug 2025", name: "IMDA · ML", what: "Built an ML pipeline to classify malicious SSL/TLS certificates, reaching 0.994 F1, with LIME explanations." },
  { when: "May – Aug 2024", name: "IMDA · SDP", what: "Ran GenAI workshops with Microsoft and AWS; 30+ companies started GenAI projects after them." },
];

export type ReelFrame = {
  name: string;
  href: string;
  label: "OPEN" | "PLAY" | "CODE";
  body: string;
  tech: string;
  visual:
    | { kind: "image"; src: string; alt: string; position?: string; note?: string }
    | { kind: "ava" }
    | { kind: "sixseven" }
    | { kind: "shitpost" };
};

export const reel: ReelFrame[] = [
  { name: "Computah", href: "https://computah.anselmlong.com", label: "OPEN", body: "A desktop AI assistant that can see and operate your computer, inside explicit security boundaries, shipped through a signed-app release workflow.", tech: "TypeScript · desktop automation · local AI", visual: { kind: "image", src: "/home/s-computah.jpg", alt: "Computah landing page" } },
  { name: "Ava", href: "https://github.com/anselmlong/ava", label: "CODE", body: "My personal agent. She runs on Hermes Agent on my own VPS, talks to me on Telegram, and has GitHub and Vercel access, so a lot of what I build starts as a message to her.", tech: "Hermes Agent · self-hosted VPS · GitHub + Vercel · Telegram", visual: { kind: "ava" } },
  { name: "Optifiner", href: "https://optifiner.dev", label: "OPEN", body: "A Darwinian code optimiser: 10+ parallel agents propose changes, and only the ones that beat your benchmark survive, generation after generation. Marshall Wace prize at Hack & Roll 2026.", tech: "Multi-agent · Git-tracked evolution · live dashboard", visual: { kind: "image", src: "/home/s-optifiner.jpg", alt: "Optifiner landing page" } },
  { name: "ConfessIT", href: "https://confessit.space", label: "OPEN", body: "NUS confessions, on the web. Then 72,000 of them embedded and mapped, and Qwen 2.5 7B fine-tuned to write new ones.", tech: "Next.js · Supabase · embeddings · Qwen fine-tune", visual: { kind: "image", src: "/home/s-confessit-umap.jpg", alt: "UMAP embedding landscape of 72,000 confessions", position: "center" } },
  { name: "Almost Anselm", href: "/blog/almost-anselm", label: "OPEN", body: "I fine-tuned a 7B model on my own Telegram replies to see if it could text like me, then measured how people rated it against the real thing.", tech: "Telethon · Axolotl · QLoRA · Mistral-7B", visual: { kind: "image", src: "/home/s-almost.jpg", alt: "Training log with a 38 hour estimate", position: "left bottom", note: "“aw hell nah i ain't waiting 38 hours.”" } },
  { name: "Kopitype", href: "https://kopitype.com", label: "PLAY", body: "Monkeytype, but Singaporean. Singlish, MRT stations, xmm texting, and a mode you have to confirm you asked for.", tech: "Next.js · static corpora · leaderboard", visual: { kind: "image", src: "/home/s-kopitype.jpg", alt: "Kopitype typing test full of Singlish words" } },
  { name: "67 bot", href: "https://github.com/anselmlong/six-seven-bot", label: "CODE", body: "Add it to a group chat and it spots the number 67 in every photo, video and telebubble, then keeps a leaderboard. Possibly my stupidest bot.", tech: "EasyOCR · vision-model fallback · SQLite", visual: { kind: "sixseven" } },
  { name: "Aircon + Gospel bots", href: "https://bot.anselmlong.com", label: "OPEN", body: "One warns you before your aircon credits run out, from a reverse-engineered portal. The other sends the day's readings at the hour you choose.", tech: "TypeScript · Python · Telegram", visual: { kind: "image", src: "/home/s-bots.jpg", alt: "Landing pages for the gospel and aircon bots" } },
  { name: "Canvas scraper", href: "https://canvas-scraper.vercel.app", label: "OPEN", body: "A 3-hour prototype that became a daily tool: syncs course files, skips the 2 GB recordings, and emails what's new.", tech: "Python · Canvas API · GitHub Actions", visual: { kind: "image", src: "/home/s-canvas.jpg", alt: "Canvas scraper landing page" } },
  { name: "LinkedIn shitpost generator", href: "https://shitpost.anselmlong.com", label: "OPEN", body: "Give it a topic, get six comedic LinkedIn posts, from tech-bro earnest to Singapore uncle.", tech: "Next.js · Gemini · OpenRouter", visual: { kind: "shitpost" } },
];

export const linkedinPosts = [
  { topic: "aircon bot", date: "Feb 2026", href: "https://www.linkedin.com/feed/update/urn:li:activity:7426683670129790977/", quote: "every week, i'd wake up sweaty. in my dorm, we pay for our own aircon… not everything has to be a startup. sometimes the best projects are the ones that just fix your own annoying problems." },
  { topic: "kopitype", date: "Jul 2026", href: "https://www.linkedin.com/feed/update/urn:li:activity:7484811875101122560/", quote: "how fast can you type singlish? i can type 120 wpm in standard english. but ask me to type my kopi order? i'm way too slow. and that's unacceptable." },
  { topic: "67 bot", date: "Aug 2026", href: "https://www.linkedin.com/feed/update/urn:li:activity:7488091079049637888/", quote: "i might have built my stupidest bot yet. a group chat spots the number 67 in the wild. i wanted to be the best 67 spotter. so… one evening later, 67 bot." },
];

export const contactEmail = "anselmpius@gmail.com";
