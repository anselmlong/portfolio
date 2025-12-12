---
title: "My First Software Engineering Project - VBook (VimBook)"
date: "2024-11-11"
author: "Anselm Long"
tags:
  - java
  - javafx
  - cs2103t
excerpt: "My first software engineering project for CS2103T"
---

<video controls width="720" autoplay loop>
  <source src="/videos/vbook_demo.mp4" type="video/mp4" />
  Your browser does not support the video tag. <a href="/videos/vbook_demo.mp4">Download</a>.
</video>

Meet **vbook**, a **command-line-based contact manager** inspired by vim, tailored for developers who love keyboard shortcuts and minimal interfaces.

Check out our site [here!](https://ay2425s1-cs2103t-f12-4.github.io/tp/index.html). You can navigate to our user/developer guide to see the UML diagrams we had to draw...


## Context

In my second year at NUS, I took **CS2103T: Software Engineering** — a core module that pretty much every computing student both dreads and looks forward to.  

The premise was simple (at least at first): Take an existing address book app and morph it into something new and useful. The catch? We had to do it in a real team, using real software engineering practices — version control, code reviews, documentation, issue tracking, testing... basically everything you'd expect in an actual development environment.  

The workload for this course was insane, with our team having to pull late nights pretty often. However, it was memorable and a really great time with my really cracked team (shoutout Leroy, Rachel, and Raihan!). We would have meetings at terrace after class and code with our lunch right next to us :)

## How We Built It

The app was built in **Java**, using **JavaFX** for the interface (which was horrible). Most of our logic and architecture followed the Model-View-Controller (MVC) pattern, which we had to learn and implement from scratch. We also followed the command pattern due to the different commands required in our program.

We used **GitHub Projects** to track issues and milestones, and everyone had to submit **pull requests** that were reviewed before merging — so it really felt like working in a small company. This was my first experience with merge conflicts. Horrible.

I handled:
- The **frontend interface**, making sure user commands felt smooth and responsive (JavaFX...)
- Parts of the **command parsing logic**, where the user's keyboard inputs were translated into actions  
- Ensuring the **UI stayed consistent** across different resolutions (which broke more times than I'd like to admit)  

But beyond the code, there was a lot of invisible work — keeping the team aligned, managing deadlines, and figuring out what "done" really meant.

## What I Learned

The biggest lesson was **communication**. Even in a small team, people have different coding styles, expectations, and priorities. A feature that makes perfect sense to one person can confuse another.  

Learning to discuss and document everything — from command formats to UI color schemes — was what kept the project moving.  

I also realised how fun it is to **turn abstract ideas into something real**. Watching vbook go from an empty repo to an app that actually runs (and doesn't crash instantly!) was such a rewarding experience. Some classmates even came up to us after the presentation and said they'll use this app!


## What's Next

This module taught me the foundations of **team-based software engineering** — version control, testing, documentation, and communication. These are the same skills I've carried into every project since, from hackathons to my portfolio site.  

I think vbook was the first project that made me feel like an actual developer, not just a student writing assignments. And that's probably the best thing I could've gotten out of it! And also... I actually started using Vim more (and I use it in most of my work today)

## Try VBook! (Taken from Our User Guide)

1. Ensure you have Java `17` or above installed in your computer. For Mac users, you should use the specific `Azul JDK 17` distribution following this [guide](https://se-education.org/guides/tutorials/javaInstallationMac.html).

2. Download the latest `VBook.jar` file from [here](https://github.com/AY2425S1-CS2103T-F12-4/tp/releases). Should be v1.6!

3. Copy the file to the folder you want to use as the _home folder_ for VBook.

4. Open a command terminal, change directory (`cd`) into the folder you put the `VBook.jar` file in, and use the `java -jar VBook.jar` command to run the application.<br>

```shell
cd path/to/vbook
java -jar VBook.jar
```

5. Once in, you can do `:help` to see a list of available commands.
