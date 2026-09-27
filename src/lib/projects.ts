/**
 * The project map's curated layer. GitHub is the source of truth for what
 * exists, stars, language and start dates (see src/server/projects.ts); this
 * file says what each project is to me: where it stands, what it's near, and
 * how many people use it. Only put real numbers in `users`.
 */

export type Status = "live" | "building" | "done" | "shelved" | "unsorted";

export const statuses: Record<Status, { label: string; note: string }> = {
  live: { label: "live", note: "deployed and running" },
  building: { label: "building", note: "work in progress" },
  done: { label: "done", note: "finished; not running anymore" },
  shelved: { label: "shelved", note: "half-built; may pick it up again" },
  unsorted: { label: "new", note: "on GitHub, not sorted yet" },
};

export const groups = {
  agents: "agents",
  ml: "models & data",
  bots: "telegram bots",
  nus: "nus life",
  play: "for fun",
  climbing: "climbing",
  tools: "tools",
  web: "my sites",
  work: "work",
  unsorted: "unsorted",
} as const;
export type Group = keyof typeof groups;

export type Project = {
  id: string;
  name: string;
  /** GitHub repo name under anselmlong, if there is one. */
  repo?: string;
  status: Status;
  group: Group;
  /** Overrides the GitHub description. */
  blurb?: string;
  url?: string;
  post?: string;
  /** Real counts only, e.g. "80 CTF players". Leave out when unknown. */
  users?: string;
  /** yyyy-mm; defaults to when the repo was created. */
  started?: string;
  award?: string;
};

export const projects: Project[] = [
  // agents
  {
    id: "ava",
    name: "Ava",
    repo: "ava",
    status: "live",
    group: "agents",
    users: "just me",
    blurb:
      "My personal agent on Telegram, running on Hermes Agent on my VPS, with GitHub and Vercel access. A lot of what I build starts as a message to her.",
  },
  {
    id: "computah",
    name: "Computah",
    repo: "computah",
    status: "live",
    group: "agents",
    url: "https://computah.anselmlong.com",
    blurb:
      "A macOS voice companion in the notch that sees your screen and operates the computer, inside explicit security boundaries.",
  },
  {
    id: "optifiner",
    name: "Optifiner",
    started: "2026-01",
    repo: "optifiner",
    status: "live",
    group: "agents",
    url: "https://optifiner.dev",
    post: "/blog/hack-and-roll-2026",
    award: "Marshall Wace prize, Hack & Roll 2026",
    blurb:
      "Darwinian code optimisation: parallel agents propose changes, and only the ones that beat your benchmark survive.",
  },
  {
    id: "bonsai",
    name: "Bonsai",
    repo: "bonsai",
    status: "live",
    group: "agents",
    url: "https://bonsai.anselmlong.com",
  },
  {
    id: "seacodex",
    name: "SEA Codex",
    repo: "seacodex",
    status: "done",
    group: "agents",
    blurb:
      "A Shopee-style market simulation: product listings, a social contagion engine and agent swarms.",
  },
  {
    id: "sequence",
    name: "Sequence",
    repo: "sequence",
    status: "done",
    group: "agents",
    post: "/blog/sequence",
    blurb: "An AI-powered video editor, built at the Gemini 3 Hackathon.",
  },

  // models & data
  {
    id: "almost-anselm",
    name: "Almost Anselm",
    repo: "almost-anselm",
    status: "done",
    group: "ml",
    post: "/blog/almost-anselm",
    blurb:
      "A 7B model fine-tuned on my Telegram replies, rated by friends against the real me.",
  },
  {
    id: "govml",
    name: "govML",
    repo: "govML",
    status: "building",
    group: "ml",
  },
  {
    id: "six-seven",
    name: "six-seven vision",
    repo: "six-seven",
    status: "done",
    group: "ml",
    post: "/blog/computer-vision",
    blurb:
      "Gesture detection with YOLOv8 that pulls up brainrot images to match. Don't ask why it's called six-seven.",
  },
  {
    id: "turnover",
    name: "Employee turnover",
    repo: "predicting-employee-turnover",
    status: "done",
    group: "ml",
    post: "/blog/employee-turnover",
    blurb:
      "Classifiers for predicting employee turnover on an HR dataset; best F1 0.73.",
  },
  {
    id: "skinmatch",
    name: "SkinMatch",
    repo: "skincare-recommendation",
    status: "shelved",
    group: "ml",
    blurb:
      "Skin analysis from photos, then skincare recommendations. Got as far as the plan.",
  },

  // telegram bots
  {
    id: "67bot",
    users: "274 users in 82 group chats",
    name: "67 bot",
    repo: "six-seven-bot",
    status: "live",
    group: "bots",
    blurb:
      "Add it to a group chat and it spots 6 and 7 in every photo, video and telebubble, then keeps a leaderboard.",
  },
  {
    id: "aircon",
    users: "452 users",
    name: "Aircon checker",
    repo: "nus-aircon-checker",
    status: "live",
    group: "bots",
    url: "https://bot.anselmlong.com/aircon",
    post: "/blog/nus-aircon-checker",
    blurb:
      "Warns you before your hall aircon credits run out, from a reverse-engineered portal.",
  },
  {
    id: "gospel",
    users: "197 users",
    name: "Gospel bot",
    repo: "catholic-bot",
    status: "live",
    group: "bots",
    url: "https://bot.anselmlong.com",
    blurb: "Sends the day's mass readings at the hour you choose.",
  },
  {
    id: "prayer",
    name: "Surprise prayer bot",
    repo: "surprise-prayer-bot",
    status: "building",
    group: "bots",
  },
  {
    id: "laundry",
    name: "Laundry bot",
    repo: "laundry_bot",
    status: "shelved",
    group: "bots",
  },
  {
    id: "distance",
    name: "Distance bot",
    repo: "anselmbot",
    status: "done",
    group: "bots",
    post: "/blog/ldr-bot",
    blurb: "A Telegram bot to make long distance feel less far.",
  },

  // nus life
  {
    id: "confessit",
    name: "ConfessIT",
    repo: "confessit-scraper",
    status: "live",
    group: "nus",
    url: "https://confessit.space",
    post: "/blog/nus-confessit-analysis",
    blurb:
      "NUS ConfessIT on the web, 72,000 confessions embedded and mapped, and a Qwen 2.5 7B fine-tune that writes new ones.",
  },
  {
    id: "canvas",
    name: "Canvas scraper",
    repo: "canvas-scraper",
    status: "live",
    group: "nus",
    url: "https://canvas-scraper.vercel.app",
    post: "/blog/canvas-scraper",
    blurb:
      "Syncs your course files daily, skips the 2 GB recordings, and emails what's new. Runs free on GitHub Actions.",
  },
  {
    id: "cheatsheets",
    name: "Cheatsheets",
    repo: "cheatsheets",
    status: "done",
    group: "nus",
    post: "/blog/open-sourcing-cheatsheets",
  },
  {
    id: "nusphere",
    name: "NUSphere",
    repo: "nusphere",
    status: "done",
    group: "nus",
    blurb:
      "Orbital 2024: one place for NUS students to publicise and find events.",
  },

  // for fun
  {
    id: "kopitype",
    users: "142 players",
    name: "Kopitype",
    repo: "kopitype",
    status: "live",
    group: "play",
    url: "https://kopitype.com",
    blurb:
      "Monkeytype, but Singaporean: Singlish, MRT stations and xmm texting.",
  },
  {
    id: "shitpost",
    name: "Shitpost generator",
    repo: "linkedin-shitpost",
    status: "live",
    group: "play",
    url: "https://shitpost.anselmlong.com",
    post: "/blog/shitpost",
    blurb:
      "Give it a topic, get six comedic LinkedIn posts, from tech-bro earnest to Singapore uncle.",
  },
  {
    id: "freakcha",
    name: "Freak-cha",
    repo: "hackharvard",
    status: "done",
    group: "play",
    post: "/blog/freak-cha",
    award: "Funniest Hack, HackHarvard 2025",
    blurb:
      "A CAPTCHA you pass by sticking your tongue out: a YOLOv8 tongue detector, then a MediaPipe face check. 36 hours, 8 of them asleep.",
  },
  {
    id: "miccdrop",
    name: "Miccdrop",
    repo: "miccdrop",
    status: "done",
    group: "play",
    post: "/blog/miccdrop",
    blurb: "A shitty karaoke app, from Hack & Roll 2025.",
  },
  {
    id: "stickfreak",
    name: "stickfreak",
    repo: "stickfreak",
    status: "shelved",
    group: "play",
  },

  // climbing
  {
    id: "routes",
    name: "Route archive",
    repo: "route-archiver",
    status: "live",
    group: "climbing",
    url: "https://routes.anselmlong.com",
    blurb:
      "The NUS USC gym's climbing routes, posted by setters on Telegram and browsable in a mini app.",
  },
  {
    id: "betaview",
    name: "BetaView",
    repo: "betaview",
    status: "building",
    group: "climbing",
    url: "https://betaview.vercel.app",
    blurb:
      "Upload a bouldering video, get technique feedback like a coach in your pocket.",
  },

  // tools
  {
    id: "autocorrect",
    name: "autocorrect",
    repo: "autocorrect",
    status: "shelved",
    group: "tools",
    blurb:
      "A privacy-first, system-wide autocorrect for Windows in Rust, using SymSpell.",
  },
  {
    id: "protolog",
    name: "proto optimizer",
    repo: "protolog",
    status: "building",
    group: "tools",
    blurb:
      "An experimental C++ Protocol Buffers generator: lazy parsing and other tricks.",
  },
  {
    id: "research",
    name: "Desktop research",
    repo: "Desktop-Research",
    status: "done",
    group: "tools",
  },
  {
    id: "vbook",
    name: "VBook",
    repo: "tp",
    status: "done",
    group: "tools",
    post: "/blog/vbook",
    blurb: "My first software engineering project, for CS2103T.",
  },

  // my sites
  {
    id: "portfolio",
    name: "This site",
    repo: "portfolio",
    status: "live",
    group: "web",
    url: "https://anselmlong.com",
    blurb: "The site you're on: a RAG chat that answers as me, and this map.",
  },
  {
    id: "photos",
    name: "Photos",
    repo: "photos",
    status: "live",
    group: "web",
    url: "https://photos.anselmlong.com",
  },

  // work, not on my GitHub
  {
    id: "aegis",
    name: "Project Aegis",
    status: "done",
    group: "work",
    started: "2026-01",
    post: "/blog/building-aegis",
    users: "80 CTF players",
    blurb:
      "Guarded LLM access for the National Cybersecurity Olympiad: rate limits, guardrails, a RAG over security knowledge and token budgets. 316 PRs in two months.",
  },
  {
    id: "certs",
    name: "ML for security",
    status: "done",
    group: "work",
    started: "2025-05",
    post: "/blog/detecting-malicious-certificates",
    blurb:
      "Machine learning for cybersecurity use cases, from my IMDA internship.",
  },
  {
    id: "sage",
    name: "SAGE at Visa",
    status: "done",
    group: "work",
    started: "2026-05",
    post: "/blog/visa-internship",
    blurb:
      "A retrieval-augmented assistant for incident investigation, built during my Visa internship.",
  },
];

/** Repos on GitHub that are deliberately left off the map. */
export const hiddenRepos = new Set([
  "anselmgpt",
  "StuckInCOM1",
  "photos-portfolio",
  "hoodscore",
  "pe",
  "ped",
  "ip",
  "catcher-smoke-test",
  "samplerepo-pr-practice",
  "samplerepo-things",
  "javafx-tutorial",
  "first-fork",
  "emeraldscorpion",
  "React-Landing-Page-Template",
  "UltimateTicTacToeAI",
  "resiwash",
  "nuscc-bot-2627",
]);

/** Edges: [a, b, why they're related]. */
export const links: [string, string, string][] = [
  ["almost-anselm", "confessit", "same fine-tuning playbook"],
  ["almost-anselm", "ava", "telegram, but make it me"],
  ["almost-anselm", "portfolio", "the chat here answers as me too"],
  ["ava", "portfolio", "ava opens PRs on this site"],
  ["ava", "computah", "personal agents: telegram and the mac"],
  ["optifiner", "bonsai", "multi-agent orchestration"],
  ["bonsai", "seacodex", "agent swarms"],
  ["bonsai", "research", "automating research"],
  ["optifiner", "protolog", "making code faster"],
  ["six-seven", "67bot", "the experiment that became the bot"],
  ["six-seven", "betaview", "computer vision"],
  ["skinmatch", "betaview", "vision on your photos"],
  ["skinmatch", "turnover", "classic ml"],
  ["govml", "turnover", "ml pipelines"],
  ["67bot", "gospel", "same bot host"],
  ["aircon", "gospel", "both on bot.anselmlong.com"],
  ["aircon", "laundry", "hall life"],
  ["gospel", "prayer", "faith bots"],
  ["routes", "67bot", "telegram bots"],
  ["routes", "betaview", "climbing"],
  ["canvas", "cheatsheets", "surviving modules"],
  ["canvas", "nusphere", "tools for nus students"],
  ["confessit", "nusphere", "nus on the web"],
  ["aircon", "canvas", "fixing nus annoyances"],
  ["kopitype", "shitpost", "singaporean humour"],
  ["shitpost", "freakcha", "built to make people laugh"],
  ["freakcha", "stickfreak", "freaky"],
  ["kopitype", "autocorrect", "typing"],
  ["portfolio", "photos", "sister sites"],
  ["aegis", "sage", "rag with guardrails"],
  ["sage", "portfolio", "rag, again"],
  ["certs", "aegis", "security, with ml"],
  ["miccdrop", "freakcha", "hackathon brainrot"],
  ["sequence", "optifiner", "january 2026 hackathons"],
  ["sequence", "photos", "i film things"],
  ["distance", "almost-anselm", "bots for my own chats"],
  ["vbook", "nusphere", "first team projects"],
];
