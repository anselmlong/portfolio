import { projects } from "./portfolio-content";

export const intents = [
  "work",
  "experience",
  "play",
  "photos",
  "contact",
  "clarify",
] as const;
export type Intent = (typeof intents)[number];
export type Reply = {
  text: string;
  intent: Intent;
  projects: string[];
  note?: string;
};
export const choices: { label: string; intent: Intent }[] = [
  { label: "Show me your work", intent: "work" },
  { label: "What are you working on?", intent: "experience" },
  { label: "Let’s play something", intent: "play" },
  { label: "Beyond the code", intent: "photos" },
];

export function curatedReply(intent: Intent): Reply {
  const replies: Record<Intent, Reply> = {
    work: {
      intent,
      text: "I like building things that solve a problem I’ve actually run into. A climbing archive, a very local typing test, a research workspace. Pick one to take a closer look.",
      projects: ["route archiver", "kopitype", "bonsai"],
    },
    experience: {
      intent,
      text: "I’m a Software Engineer Intern at Open Government Products, working on the Maps team since August 2026. Before that: Visa, machine learning at IMDA, and leading Project Aegis for a cybersecurity event.",
      projects: [],
    },
    play: {
      intent,
      text: "Okay, fingers on the keyboard. This is a tiny, local preview of Kopitype—my Singlish typing project. Your score stays right here.",
      projects: ["kopitype"],
    },
    photos: {
      intent,
      text: "Away from the keyboard, I take photographs, climb, and try to make better coffee. Here’s the photography side of my world.",
      projects: [],
    },
    contact: {
      intent,
      text: "Have a project in mind, a question, or just want to say hello? Send me a note. This chat is an AI guide, not a direct message to me.",
      projects: [],
    },
    clarify: {
      intent,
      text: "Which part would you like to explore: my projects, experience, photography, or getting in touch?",
      projects: [],
    },
  };
  return replies[intent];
}

export function isIntent(value: unknown): value is Intent {
  return (
    typeof value === "string" && intents.some((intent) => intent === value)
  );
}

export function isReply(value: unknown): value is Reply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<Reply>;
  return (
    typeof reply.text === "string" &&
    reply.text.length <= 5000 &&
    isIntent(reply.intent) &&
    Array.isArray(reply.projects) &&
    reply.projects.length <= 3 &&
    reply.projects.every((name) => projects.some((p) => p.name === name)) &&
    (reply.note === undefined || typeof reply.note === "string")
  );
}
