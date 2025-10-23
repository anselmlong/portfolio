---
title: "what did i do during my Y1 summer intern? googling... lots of it"
date: "2025-10-23"
author: "Anselm Long"
tags:
  - python
  - research
  - bs4
excerpt: "my first internship at IMDA wasn't very technical but i still learnt a lot!"
---

![presenting my data initiative](/blogs/images/sdp-intern.png)
<figcaption>this is me presenting my final data initiative to the division!</figcaption>

## context

in summer 2024, i joined IMDA as a strategic digital projects intern. i was just finishing my first year at nus... so i was still figuring out what i wanted to do in computer science (i still don't really know). nonetheless, i secured a summer internship through IMDA and i found myself doing research on generative ai and digital transformation in singapore.  

and originally -- i didn't want it but it was the best they could give me given my limited experience. here's the job scope:

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

so by "research and analysis"... they basically meant googling. at the end of the day, it wasn’t a technical internship at all - i wasn’t writing production code or building ml models. but i did get to learn a lot about how *data*, *policy*, and *technology* intersect in real organisations!


## my day-to-day

most of my day-to-day work revolved around **researching gen ai developments** — from tools like chatgpt to enterprise use cases across different industries. otherwise, we were basically *saikang warriors*, doing random tasks that the team needed help with. it was pretty boring, but i had a lot of free time.

after a while, i realised that researching manually was... extremely slow. 

## web scraping tool

![python scraper](/blogs/images/sdp-intern-tool.png)
<figcaption>my very rudimentary web scraper</figcaption>

so i started experimenting with **python and bs4** to automate part of my research. i found *apify*, a web crawler i could call with an API. with that, i built a small **web scraping tool** that could pull urls from news sites based off a query. it wasn’t fancy, and it wasn't very good, but it helped me go through dozens of pages of data much faster. you can still find my repo [here](https://github.com/anselmlong/Desktop-Research), although you need an Apify API key for it to work. i also tried using gemini to summarise the text across the websites, but i found that it wasn't very suited for my use case which needed nuances.

## salesforce pitch

one day, my managers handed me an excel sheet and asked me to compile the information across different divisions and to track the companies that we've visited so far. needless to say, it was so messy! my fellow intern and i were frustrated and we had to talk to so many people to get stuff sorted out.

from this - i realised that the way they collected data was extremely inefficient. managers went around to see clients and inputted their information into a form of sorts, which was different across teams. i was wondering - why not have a centralised database of contacts, a single source of truth that teams could pull data from? so, i went researching for a tool that could do this - and landed on Salesforce's Customer Relationship Management (CRM)!

i was excited! i went to ask my supervisor for opinions, and he supported me on the idea and thought there was a valid use case for this. after approval, i went around various teams to pitch the idea, along with liaising with the digital transformation office of IMDA to find licenses. eventually, this initiative went up to my director, who was also interested.

so, i pitched the project to the entire division. the plan was basically to push for more process efficiency in the division. and they liked it! most officers said it was a good plan, and that there was a use case for it. 

unfortunately, due to governments and their inefficiency, the procurement was quite delayed and i left before i could see it happen. nonetheless, i estimated that we could save time by up to 50% just by coordinating across teams. i think this was the highlight of this internship because i got to make something happen.

## what else i did?

well, outside of that, i:
- supported pre-meeting research and post-meeting follow-ups for **industry engagements** (microsoft, aws, easmed, etc.)
- helped scope potential **gen ai pilot projects** through brainstorming sessions and whiteboarding discussions
- got to sit in for lots of meetings, and got free food at some events
- because their unofficial photographer for tech events (i didn't get paid extra)

---

## what i learned (and what went wrong)

well, i learned that not every internship needs to be “super technical” to be valuable. i picked up a lot of **soft skills** — from writing executive summaries and presenting to directors, to just figuring out how to communicate data ideas clearly.  

i kind of wish that i could have done bigger projects in my spare time, but i was also building NUSphere (my orbital project), so i guess it was reasonable.

---

## what’s next

on the bright side, this internship planted the seed for my interest in **machine learning and data engineering**. i realised how important structured data is before any analysis or modelling can happen, and how shared data can lead to more efficient processes.

after this experience, i wanted to do something more technical — so i spent the next semester learning more python, ml, and data visualization. that led to my **machine learning internship at IMDA** the following year, where i finally got to apply those skills on real cybersecurity data.  

so yeah, maybe i didn’t build the next big ai model that summer — but i learned how to think like someone who could.  
