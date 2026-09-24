// app/ClientHome.tsx
"use client";

import GuidedPortfolio from "~/app/_components/GuidedPortfolio";
import AboutSection from "~/app/_components/AboutSection";
import ExperienceTimeline from "~/app/_components/ExperienceTimeline";
import EcosystemSection from "~/app/_components/EcosystemSection";
const experiences = [
  {
    name: "software engineer intern @ open government products",
    period: "aug 2026 - present",
    description: "working on the maps team at Open Government Products (OGP).",
    url: "",
  },
  {
    name: "software engineering intern @ visa",
    period: "2026",
    description: "software engineering internship in the payments space.",
    url: "",
  },
  {
    name: "machine learning intern @ imda",
    period: "may 2025 - aug 2025",
    description:
      "machine learning for cybersecurity use cases - detecting malicious certificates!",
    url: "/blog/machine-learning-intern",
  },
  {
    name: "lead developer, project aegis @ national cybersecurity olympiad",
    period: "jan 2026 - mar 2026",
    description:
      "led full-stack development of an ai-access platform for 80 ctf participants, with rate limiting, llm-guard middleware, playwright e2e tests, and docker containerisation.",
    url: "",
  },
  {
    name: "strategic digital projects intern @ imda",
    period: "may 2024 - aug 2024",
    description:
      "technical research on emerging technologies applied to companies.",
    url: "/blog/sdp-intern",
  },
  {
    name: "national university of singapore",
    period: "2023-2027 (expected)",
    description:
      "pursuing bachelor of computer science, ridge view residential college programme",
    url: "",
  },
  {
    name: "eunoia junior college",
    period: "2019-2020",
    description: "joined ejc media",
    url: "",
  },
];

const projects = [
  {
    name: "confessit.space",
    tech: "Next.js, Supabase, anonymous posting",
    description:
      "an anonymous confession board for campus communities, deployed as a small social product with moderation and fast posting flows.",
    url: "https://confessit.space",
    status: "live site",
  },
  {
    name: "@sg_daily_gospel_bot",
    tech: "Telegram Bot API, scheduled messages",
    description:
      "a telegram bot that sends the daily mass readings to subscribers at the hour they choose, without making them open another app or newsletter.",
    url: "https://bot.anselmlong.com/gospel",
    status: "live site + telegram bot",
  },
  {
    name: "@aircon_checker_bot",
    tech: "TypeScript, Telegram Bot API, reverse-engineered EVS2 API",
    description:
      "a telegram bot that checks nus aircon credits from the EVS2 portal. type /balance and get the current balance instantly.",
    url: "https://bot.anselmlong.com/aircon",
    status: "live site + telegram bot",
  },
  {
    name: "canvas scraper",
    tech: "Python, Canvas API, SQLite, Jinja2, GitHub Actions",
    description:
      "a cli that syncs canvas course files to your machine, skips the 2GB lecture recordings and textbooks, and emails a daily digest of what's new. runs locally or on GitHub Actions so your iPad gets your files while you nap.",
    url: "https://canvas.anselmlong.com",
    status: "live site + cli",
  },
  {
    name: "linkedin shitpost generator",
    tech: "Next.js, React, Tailwind CSS, Google Gemini, OpenRouter",
    description:
      "a satirical web app that generates absurd linkedin-style posts powered by ai. enter a topic, get six comedic personas, from tech-bro earnestness to singapore uncle vibes.",
    url: "https://shitpost.anselmlong.com",
    status: "live site",
  },
  {
    name: "personal portfolio website",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, GSAP, LangChain.js",
    description:
      "this site: a portfolio with interactive animation, blog posts, and an ai chat interface backed by rag over my work and experience.",
    url: "/blog/portfolio-website",
    status: "live site",
  },
  {
    name: "kopitype",
    tech: "Next.js, TypeScript, SQLite, typing analytics",
    description:
      "a Singlish-themed typing test with local word lists, MRT stations, live WPM and accuracy stats, challenge mode, and a glossary of Singaporean terms.",
    url: "https://kopitype.com",
    status: "live site",
  },
  {
    name: "bonsai",
    tech: "FastAPI, React, research agents, streaming",
    description:
      "an AI research workspace that turns a question into a sourced report, with streaming progress and controllable research depth.",
    url: "https://bonsai.anselmlong.com",
    status: "live site",
  },
  {
    name: "route archiver",
    tech: "Python, FastAPI, SQLite, Telegram Mini App",
    description:
      "a climbing-route archive for the NUS USC gym: Telegram posts become searchable routes with grades, wall sections, photos, and ratings.",
    url: "https://routes.anselmlong.com/",
    status: "live site + API",
  },
  {
    name: "computah",
    tech: "TypeScript, desktop automation, local AI",
    description:
      "a desktop AI assistant that can see and operate the computer, with explicit security boundaries and a signed-app release workflow.",
    url: "https://computah.anselmlong.com",
    status: "live site + prototype",
  },
  {
    name: "miccdrop",
    tech: "React Native, Node.js, Supabase, Spotify API",
    description:
      "a mobile app that rewards users for singing off key with pitch detection and karaoke style lyrics.",
    url: "/blog/miccdrop",
    status: "project write-up",
  },
  {
    name: "freak-cha",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, Supabase, YOLOv8",
    description:
      "a captcha-inspired challenge to distinguish humans from ai using facial expression recognition. awarded funniest hack at HackHarvard 2025.",
    url: "/blog/freak-cha",
    status: "hackathon build",
  },
  {
    name: "vbook",
    tech: "Java, JavaFX",
    description:
      "a fast and efficient contact manager for developers, with emphasis on keyboard shortcuts and productivity.",
    url: "/blog/vbook",
    status: "school project",
  },
];

export default function ClientHome() {
  return (
    <main className="bg-background text-foreground selection:bg-primary/20 min-h-screen">
      <GuidedPortfolio />
      <section
        id="projects"
        aria-labelledby="projects-title"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="projects-title"
            className="font-bricolage text-4xl tracking-tight"
          >
            The work, at a glance.
          </h2>
          <p className="text-muted-foreground">
            No tour required. Pick something that catches your eye.
          </p>
        </div>
        <div className="grid gap-x-12 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.name} className="border-border border-t py-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bricolage text-2xl">
                  <a
                    href={project.url}
                    target={
                      project.url.startsWith("https") ? "_blank" : undefined
                    }
                    rel={
                      project.url.startsWith("https")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover:text-primary focus-visible:outline-primary underline-offset-4 hover:underline"
                  >
                    {project.name}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </h3>
                <span className="text-primary text-xs">{project.status}</span>
              </div>
              <p className="mt-3 text-base leading-relaxed text-stone-300">
                {project.description}
              </p>
              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                {project.tech}
              </p>
            </article>
          ))}
        </div>
      </section>
      <AboutSection />
      <ExperienceTimeline experiences={experiences} />
      <EcosystemSection />
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-bricolage text-4xl">
          A good conversation starts somewhere.
        </h2>
        <a
          href="mailto:anselmpius@gmail.com"
          className="text-primary mt-6 inline-block text-xl underline underline-offset-8"
        >
          Say hello →
        </a>
      </section>
    </main>
  );
}
