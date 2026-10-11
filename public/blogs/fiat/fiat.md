---
title: "Fiat: Volunteering, Prayer and a Saint Collection for Catholics in Singapore"
date: "2026-10-11"
author: "Anselm Long"
image: "/blogs/fiat/images/cover.jpg"
tags:
  - hackathon
  - catholic
  - nextjs
  - product
  - design
excerpt: "What I built for the FIAT Catholic Hackathon 2026: a place to give an hour, a skill, a prayer or an invite. You also collect holy cards along the way."
---

## TL;DR

I built **Fiat** for the **FIAT Catholic Hackathon 2026**. It connects Catholics in Singapore with Catholic organisations that need help, and every request is vetted by the Catholic Foundation.

The tagline kinda wrote itself:

> Mary's yes changed everything. Yours can be an hour, a skill, a prayer or an invite.

- **Site:** https://fiat.anselmlong.com
- **Code:** https://github.com/anselmlong/fiatsg

Every time you serve, pray or bring someone along, you **meet a saint** who did the same thing, and their holy card joins your collection. Yes, I made Pokémon cards for saints. I regret nothing.

## The Problem

Lots of Catholic organisations in Singapore need help, and lots of Catholics would like to help. The two just don't find each other very well.

Requests live in parish bulletins, WhatsApp forwards and someone's aunt's Facebook post. If you're young and keen, you honestly don't know where to start. And if you can't commit to a weekly shift, it feels like there's nothing for you at all.

So the question I kept coming back to was:

> What if saying yes was as easy as tapping a button, and an hour, a prayer or an invite all counted?

## What I Built

![A cause page: computer literacy trainer with ACMI](/blogs/fiat/images/cause.jpg)
<figcaption>A cause from ACMI, with the gifts it needs</figcaption>

**For volunteers (we call them supporters):**

- **Find a cause** by area, schedule and the gifts it needs. The causes that match your skills are highlighted.
- **Say yes** to helping, or if you can't make it, **light a candle and pray** for the cause instead.
- **Check in at the venue** by scanning a QR code. It's signed on the server, so you have to actually be there (no checking in from your bed, sorry).
- **See what your help made possible**, with real outcomes once a cause wraps up.
- **Invite a friend** with your own link.

**For organisations:**

- Register, describe your work, and post requests for the volunteers you need.
- The **Catholic Foundation reviews** every organisation and request before it goes live, which matters a lot when people are signing up to show up somewhere.

It's also available in **English, Bahasa Melayu and Tamil**, because the Church in Singapore doesn't only speak English.

![The causes list](/blogs/fiat/images/causes.jpg)
<figcaption>Where the Church needs you</figcaption>

## The Saint Collection (a.k.a. The Fun Part)

![Your Faith Companions: a grid of 28 holy cards](/blogs/fiat/images/saints.jpg)
<figcaption>All 28 Faith Companions, unlocked</figcaption>

Volunteering apps tend to reward you with points, badges and leaderboards. That felt wrong for this. Nobody serves at a soup kitchen to climb a leaderboard (I hope).

So instead, **each act of service brings a saint who did the same thing**:

- Pray for a cause, and you meet **St Monica**, who prayed for her son for seventeen years.
- Invite a friend, and you meet **St Andrew**, who brought his brother to Jesus.
- Ask a question about the faith, and you meet **St Anselm of Canterbury** (no, I did not add him because of my name. Okay, maybe a little).

Every saint has a short story, a sourced quote and a one-line prayer. The paintings are public-domain works from Wikimedia Commons, all cropped to the same holy-card look and credited in the repo.

There are 28 saints in the main collection, plus four hidden bonus cards for curious people. One of them involves a cheat code that's older than me. I'll let you figure it out.

## The Reveal

![A saint card being turned in the hand, with gold foil light across it](/blogs/fiat/images/reveal-drag.jpg)
<figcaption>Grab it and spin it</figcaption>

The moment you meet a saint is the part I spent way too long on.

The card arrives face down. Tap it and it trembles and gathers light (your phone buzzes faster and faster, like a held breath), then it flips with a flash of gold.

Then you can **pick it up**. The card leans toward your cursor and you can drag it to spin it in 3D. Flick it and it keeps spinning, then a spring settles it face forward. As it turns, a band of foil light slides across the painting and the gold edge shows, so it feels like an actual holy card and not a JPEG.

It's all plain CSS 3D transforms and a tiny spring loop that writes CSS variables every frame. No three.js, nothing new to download, and it runs smoothly on phones. If you've turned on reduced motion, it all stays still.

![The revealed card of St Anselm of Canterbury](/blogs/fiat/images/reveal.jpg)
<figcaption>"I believe in order that I may understand." — St Anselm</figcaption>

## How It's Built

| Layer | What |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions), React 19 |
| Styling | Tailwind CSS 4 |
| Data | Postgres on Neon, with Drizzle ORM |
| Auth | Signed session cookies (`jose`) |
| Hosting | Vercel |

Nothing fancy, and that was on purpose. A hackathon is not the time to learn a new database (I have learnt this the hard way, many times).

## Learning points!

1. **The reward shapes the behaviour.** Swapping points for saints changed the whole tone of the app. It stopped feeling like a game and started feeling like being accompanied.
2. **Let small things count.** "Can't come? You can still pray." is probably the most important line in the app. Most people can't commit to every Sunday, but almost everyone can pray.
3. **Trust is a feature.** Having the Catholic Foundation vet every request is what makes it okay for a stranger to show up at a migrant centre on a Sunday.
4. **Polish is where the love shows.** Nobody needs to be able to spin a holy card. But people will, and they'll smile when they do.

If you're in Singapore and have an hour, a skill or a prayer to spare, come say yes: https://fiat.anselmlong.com
