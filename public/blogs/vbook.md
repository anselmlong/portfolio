---
title: "my first software engineering project - VBook (VimBook)"
date: "2024-11-11"
author: "Anselm Long"
tags:
  - java
  - javafx
  - cs2103t
excerpt: "my first software engineering project for CS2103T"
---

<video controls width="720" autoplay loop>
  <source src="/videos/vbook_demo.mp4" type="video/mp4" />
  Your browser does not support the video tag. <a href="/videos/vbook_demo.mp4">Download</a>.
</video>

meet **vbook**, a **command-line-based contact manager** inspired by vim, tailored for developers who love keyboard shortcuts and minimal interfaces.

check out our site [here!](https://ay2425s1-cs2103t-f12-4.github.io/tp/index.html). you can navigate to our user/developer guide to see the UML diagrams we had to draw...


## context

in my second year at nus, i took **CS2103T: Software Engineering** — a core module that pretty much every computing student both dreads and looks forward to.  

the premise was simple (at least at first): take an existing address book app and morph it into something new and useful. the catch? we had to do it in a real team, using real software engineering practices — version control, code reviews, documentation, issue tracking, testing... basically everything you’d expect in an actual development environment.  

the workload for this course was insane, with our team having to pull late nights pretty often. however, it was memorable and a really great time with my really cracked team (shoutout Leroy, Rachel, and Raihan!). we would have meetings at terrace after class and code with our lunch right next to us :)

## how we built it

the app was built in **java**, using **javafx** for the interface (which was horrible). most of our logic and architecture followed the Model-View-Controller (MVC) pattern, which we had to learn and implement from scratch. we also followed the command pattern due to the different commands required in our program.

we used **GitHub Projects** to track issues and milestones, and everyone had to submit **pull requests** that were reviewed before merging — so it really felt like working in a small company. this was my first experience with merge conflicts. horrible.

i handled:
- the **frontend interface**, making sure user commands felt smooth and responsive (JavaFX...)
- parts of the **command parsing logic**, where the user’s keyboard inputs were translated into actions  
- ensuring the **UI stayed consistent** across different resolutions (which broke more times than i’d like to admit)  

but beyond the code, there was a lot of invisible work — keeping the team aligned, managing deadlines, and figuring out what “done” really meant.

## what i learned

the biggest lesson was **communication**. even in a small team, people have different coding styles, expectations, and priorities. a feature that makes perfect sense to one person can confuse another.  

learning to discuss and document everything — from command formats to UI color schemes — was what kept the project moving.  

i also realised how fun it is to **turn abstract ideas into something real**. watching vbook go from an empty repo to an app that actually runs (and doesn’t crash instantly!) was such a rewarding experience. some classmates even came up to us after the presentation and said they'll use this app! 


## what’s next

this module taught me the foundations of **team-based software engineering** — version control, testing, documentation, and communication. these are the same skills i’ve carried into every project since, from hackathons to my portfolio site.  

i think vbook was the first project that made me feel like an actual developer, not just a student writing assignments. and that’s probably the best thing i could’ve gotten out of it! and also... I actually started using Vim more (and I use it in most of my work today)

## try VBook! (taken from our user guide)

1. Ensure you have Java `17` or above installed in your computer. For Mac users, you should use the specific `Azul JDK 17` distribution following this [guide](https://se-education.org/guides/tutorials/javaInstallationMac.html).

2. Download the latest `VBook.jar` file from [here](https://github.com/AY2425S1-CS2103T-F12-4/tp/releases). Should be v1.6!

3. Copy the file to the folder you want to use as the _home folder_ for VBook.

4. Open a command terminal, change directory (`cd`) into the folder you put the `VBook.jar` file in, and use the `java -jar VBook.jar` command to run the application.<br>

```shell
cd path/to/vbook
java -jar VBook.jar
```

5. Once in, you can do `:help` to see a list of available commands.
