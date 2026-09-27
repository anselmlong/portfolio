# Ava

## what is ava?
ava is anselm's personal agent. it's hermes agent (nous research) with a telegram integration, running deepseek v4 flash through openrouter. anselm talks to it on telegram, and it manages a lot of things for him.

## where does ava run?
on an ovh vps that anselm pays about $12 a month for, so it's up 24/7.

## what can ava do?
ava has github and vercel access, so anselm can code and deploy on the go without opening a terminal. he sends ava an idea, ava triages it (or pulls the existing repo from github), they plan it together on telegram, then ava pushes to git and vercel deploys it on anselm's own domain. ava also learns reusable skills from problems it solves, and runs cron jobs for him, like a daily hacker news digest, caching readings for his gospel bot, and birthday reminders.

## what happened to the old ava repo?
github.com/anselmlong/ava was an earlier, in-progress langgraph + gemini version. it's been superseded by the current hermes setup.

## where can i read more?
anselm wrote about his setup in the blog post "ava: how i code now (mostly from telegram)" at /blog/ava.
