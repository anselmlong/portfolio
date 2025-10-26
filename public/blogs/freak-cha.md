---
title: "freak-cha"
date: "2025-10-24"
author: "Anselm Long"
tags:
  - hackathon
  - next.js
  - tailwind css
  - computer vision
  - yolov8
excerpt: "36 hours. 8 hours of sleep. no showers. Funniest Hack at HackHarvard 2025."
---

![freak-cha at HackHarvard](/blogs/images/freakcha.png)
<figcaption>us, probably 15 hours into the hackathon and losing it</figcaption>

## the backstory

joined hackharvard 2025 on a whim - it was a wild idea to fly all the way to boston for a hackathon! but when my friends asked me to join their team, i couldn't say no. the entire experience was... interesting to say the least. the venue had no showers at all, non-existent sleeping areas, and slightly questionable organising. yet, the memories i made here - i probably won't forget anytime soon.


## our project

**freak-cha**, a multi-factor authentication tool that tells humans and AI apart.  
but not with a boring “select all squares with traffic lights” test... we used your **tongue**. 👅

## how we came up with it

we had no idea what to build in the first 3 hours. we had some generic ideas about automating social media posts, but nothing that we were particularly passionate about. jokingly, i remembered seeing tiktoks about apple's new ios 26 accessibility feature - where you could doomscroll with your tongue, and suggested it - "what if we do something with tongue?"

after a lot of questionable iterations, that became our entire project.  

we called it **freak-cha** — Facial Recognition and Expression Authentication Kit to tell computers and Humans Apart.

## how it works

we built a custom SOTA tongue detection model using **YOLOv8** and **Python** to track facial features and tongue movement in real time.  
users are asked True/False questions, and they respond by moving their tongue **left/right** or **up/down** — an extremely scientific authentication method.

after clearing the captcha, users are asked to capture their face - which is then matched against a stored embedding vector computed by **MediaPipe FaceMesh** to ensure an additional layer of security.

our dataset?  
a very real, very cursed collection of people willing to wiggle their tongues for us on camera (it was probably the weirdest thing i had to pitch at a hackathon). 

## the result

it was funny, chaotic, and surprisingly functional.  
our model actually worked — it could detect tongue movement direction and classify user intent with reasonable accuracy.

we ended up winning **Funniest Hack** among 532 participants and became one of the most memorable projects of the hackathon. we even had fans, a group of people approached us after we uploaded our project onto DevPost asking if we were freakcha... it was wild.

you can try it (if you dare) at [freakcha.com](https://freakcha.com). you might have to let our server run a bit to warm up, but you can wiggle your tongue all you want after that.

check out our devpost [here](https://devpost.com/software/freak-cha?_gl=1*19zwjzx*_gcl_au*ODA1OTA3Mjk4LjE3NTk2NDkxMzQ.*_ga*MzkwODc4MzUwLjE3NTk2NDkxMzQ.*_ga_0YHJK3Y10M*czE3NjE1MTM3OTUkbzckZzEkdDE3NjE1MTM4MzUkajIwJGwwJGgw) to see my demo video that we filmed at 3am.

## reflections

this hackathon was easily one of the most fun and unhinged experiences i’ve had. from playing cornhole at 11pm and losing our minds over how hard it was, to consuming copious amounts of redbull, i would do this again in a hearbeat.
i learned a ton about **computer vision**, **real-time inference**, and **working on zero sleep** — but more than anything, I learned that creativity doesn’t always come from overthinking.

sometimes, the dumbest ideas make the best memories.  

huge thanks to my amazing team: **jensen huang**, **junjie hu**, and **isabel wang**.  
wouldn’t have done it without you all <3
