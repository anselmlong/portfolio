---
title: "managing the distance with Python and Telegram Bots"
date: "2025-08-13"
author: "Anselm Long"
tags:
  - personal
  - python
  - telegram bot
excerpt: "long distance sucks! i created a telegram bot with python to help the distance feel less far :)"
---


## context

i'm doing my semester exchange programme in new orleans from aug - dec 2025, and my girlfriend is doing hers in prague at around the same time! and long distance sucks - we have a time difference of 7 hours and when i wake up, it's usually near the end of her day. with long distance coming up, i decided to make something to help us cope with the distance.

after some brainstorming, i came up with the idea of a telegram bot! i've always wanted to make one, and as telegram is our main form of communication, using telegram would be easy to integrate into our routines.

## features

![introductory message](/blogs/images/tele-bot-intro.png)

i decided on a list of features:
- some pick up lines chosen at random (so we can get a laugh)
- motivational quotes and messages
- pictures that you can submit and your partner can see at random (main feature)
- telegram bubbles on demand (same as above)
- relationship stats: how many days till we see each other!
- reminders: i ran into technical issues on this sadly, so this isn't done

## tech used

the entire bot was coded with Python, along with the Telegram Bot API. it was honestly shocking how easy it was to create a telegram bot with @BotFather. after creating the bot, i hosted it on DigitalOcean (for free! shoutout to Jensen for putting me on that).

## reflections

i'm glad to say my girlfriend loved it! as we went about our LDR, the need for the bot became less and less as we got used to life overseas, but there were days where i was really comforted by the pictures i received in the bot. this also helped me realise that creating something isn't very hard, and inspired me to make something else for my girlfriend on her birthday (see [this blog!](/blog/birthday-website.md)).
