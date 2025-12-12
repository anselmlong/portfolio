---
title: "What did I do during my Y1 summer intern? Googling... lots of it"
date: "2025-10-23"
author: "Anselm Long"
tags:
  - python
  - research
  - bs4
excerpt: "My first internship at IMDA wasn't very technical but I still learnt a lot!"
---

![presenting my data initiative](/blogs/images/sdp-intern.png)
<figcaption>this is me presenting my final data initiative to the division!</figcaption>

## Context

In summer 2024, I joined IMDA as a strategic digital projects intern. I was just finishing my first year at NUS... so I was still figuring out what I wanted to do in computer science (I still don't really know). Nonetheless, I secured a summer internship through IMDA and I found myself doing research on generative AI and digital transformation in Singapore.  

And originally -- I didn't want it but it was the best they could give me given my limited experience. Here's the job scope:

> Project Title
>
> **Support GenAI for Enterprises initiatives**
>
> Project Scope
> 1. Support research and analysis on Gen AI tech development and impact to Singapore economy and enterprise
> 2. Support industry and company engagements such as e.g. pre-meeting background research and post-meeting follow-ups, tech discovery workshops and proposal developments
>
> Learning outcomes
> 1. Gain insights on govt role in digital transformation that helps Singapore to stay relevant and competitive
> 2. Gain insights in stakeholder engagements with internal and external senior executives, including enterprises and tech giants
> 3. Gain insights on global trends of tech development

So by "research and analysis"... they basically meant googling. At the end of the day, it wasn't a technical internship at all - I wasn't writing production code or building ML models. But I did get to learn a lot about how *data*, *policy*, and *technology* intersect in real organisations!


## My Day-to-Day

Most of my day-to-day work revolved around **researching Gen AI developments** — from tools like ChatGPT to enterprise use cases across different industries. Otherwise, we were basically *saikang warriors*, doing random tasks that the team needed help with. It was pretty boring, but I had a lot of free time.

After a while, I realised that researching manually was... extremely slow. 

## Web Scraping Tool

![python scraper](/blogs/images/sdp-intern-tool.png)
<figcaption>My very rudimentary web scraper</figcaption>

So I started experimenting with **Python and BS4** to automate part of my research. I found *Apify*, a web crawler I could call with an API. With that, I built a small **web scraping tool** that could pull URLs from news sites based off a query. It wasn't fancy, and it wasn't very good, but it helped me go through dozens of pages of data much faster. You can still find my repo [here](https://github.com/anselmlong/Desktop-Research), although you need an Apify API key for it to work. I also tried using Gemini to summarise the text across the websites, but I found that it wasn't very suited for my use case which needed nuances.

## Salesforce Pitch

One day, my managers handed me an Excel sheet and asked me to compile the information across different divisions and to track the companies that we've visited so far. Needless to say, it was so messy! My fellow intern and I were frustrated and we had to talk to so many people to get stuff sorted out.

From this - I realised that the way they collected data was extremely inefficient. Managers went around to see clients and inputted their information into a form of sorts, which was different across teams. I was wondering - why not have a centralised database of contacts, a single source of truth that teams could pull data from? So, I went researching for a tool that could do this - and landed on Salesforce's Customer Relationship Management (CRM)!

I was excited! I went to ask my supervisor for opinions, and he supported me on the idea and thought there was a valid use case for this. After approval, I went around various teams to pitch the idea, along with liaising with the digital transformation office of IMDA to find licenses. Eventually, this initiative went up to my director, who was also interested.

So, I pitched the project to the entire division. The plan was basically to push for more process efficiency in the division. And they liked it! Most officers said it was a good plan, and that there was a use case for it. 

Unfortunately, due to governments and their inefficiency, the procurement was quite delayed and I left before I could see it happen. Nonetheless, I estimated that we could save time by up to 50% just by coordinating across teams. I think this was the highlight of this internship because I got to make something happen.

## What Else I Did?

Well, outside of that, I:
- Supported pre-meeting research and post-meeting follow-ups for **industry engagements** (Microsoft, AWS, EASMed, etc.)
- Helped scope potential **Gen AI pilot projects** through brainstorming sessions and whiteboarding discussions
- Got to sit in for lots of meetings, and got free food at some events
- Became their unofficial photographer for tech events (I didn't get paid extra)

---

## What I Learned (and what went wrong)

Well, I learned that not every internship needs to be "super technical" to be valuable. I picked up a lot of **soft skills** — from writing executive summaries and presenting to directors, to just figuring out how to communicate data ideas clearly.  

I kind of wish that I could have done bigger projects in my spare time, but I was also building NUSphere (my Orbital project), so I guess it was reasonable.

---

## What's Next

On the bright side, this internship planted the seed for my interest in **machine learning and data engineering**. I realised how important structured data is before any analysis or modelling can happen, and how shared data can lead to more efficient processes.

After this experience, I wanted to do something more technical — so I spent the next semester learning more Python, ML, and data visualization. That led to my **machine learning internship at IMDA** the following year, where I finally got to apply those skills on real cybersecurity data.  

So yeah, maybe I didn't build the next big AI model that summer — but I learned how to think like someone who could.
