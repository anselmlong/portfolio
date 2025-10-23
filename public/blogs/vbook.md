---
title: "what i did during CS2103T"
date: "2025-10-23"
author: "Anselm Long"
tags:
  - java
  - javafx
  - cs2103t
excerpt: "my first software engineering project"
---

![vbook interface](/blogs/images/vbook.png)
<figcaption>our vim-like user interface</figcaption>

## context

in my second year at nus, i took **CS2103T: Software Engineering** — a core module that pretty much every computing student both dreads and looks forward to.  

the premise was simple (at least at first): take an existing address book app and morph it into something new and useful. the catch? we had to do it in a real team, using real software engineering practices — version control, code reviews, documentation, issue tracking, testing... basically everything you’d expect in an actual development environment.  

our team decided to build **vbook**, a **command-line-based contact manager** inspired by vim, tailored for developers who love keyboard shortcuts and minimal interfaces.

---

## how we built it

the app was built in **java**, using **javafx** for the interface (which was horrible). most of our logic and architecture followed the Model-View-Controller (MVC) pattern, which we had to learn and implement from scratch.  

we used **GitHub Projects** to track issues and milestones, and everyone had to submit **pull requests** that were reviewed before merging — so it really felt like working in a small company.  

i handled:
- the **frontend interface**, making sure user commands felt smooth and responsive  
- parts of the **command parsing logic**, where the user’s keyboard inputs were translated into actions  
- ensuring the **UI stayed consistent** across different resolutions (which broke more times than i’d like to admit)  

but beyond the code, there was a lot of invisible work — keeping the team aligned, managing deadlines, and figuring out what “done” really meant.

---

## what i did

- led a 4-person team to design and develop a javaFX-based CLI contact manager tailored for developers  
- engineered an intuitive frontend interface using javaFX, delivering a smooth and efficient user experience  
- coordinated project milestones and delegated tasks to ensure timely completion of all deliverables  

these sound neat and tidy on a resume, but in reality it was a mix of late-night debugging, git conflicts, and lots of learning-by-doing. it was the first time i really *understood* how many moving parts go into even a simple app.

---

## what i learned

the biggest lesson was **communication**. even in a small team, people have different coding styles, expectations, and priorities. a feature that makes perfect sense to one person can confuse another.  

learning to discuss and document everything — from command formats to UI color schemes — was what kept the project moving.  

i also realised how fun it is to **turn abstract ideas into something real**. watching vbook go from an empty repo to an app that actually runs (and doesn’t crash instantly!) was such a rewarding experience.  

and maybe most importantly:  
coming up with ideas is fun, but **finishing them** is even better.  

---

## what’s next

this module taught me the foundations of **team-based software engineering** — version control, testing, documentation, and communication. these are the same skills i’ve carried into every project since, from hackathons to my portfolio site.  

i think vbook was the first project that made me feel like an actual developer, not just a student writing assignments. and that’s probably the best thing i could’ve gotten out of it!
