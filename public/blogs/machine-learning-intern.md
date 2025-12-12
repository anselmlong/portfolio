---
title: "Data and a Dream"
date: "2025-08-01"
author: "Anselm Long"
tags:
  - python
  - machine learning
  - scikit-learn
  - anomaly detection
excerpt: "Probably my most tech-focused experience to date. I had 3 months and 1 priority - to detect which web certificates were malicious and which weren't. All I had was data and a dream..."
---

![me final presenting](/blogs/images/machine-learning-intern.png)
<figcaption>My final presentation for this internship</figcaption>

Read my full report [here](/blog/detecting-malicious-certificates)!

## Context

This was my second internship at IMDA — and unlike my first, it was fully technical. There wasn't a fixed guidebook or daily hand-holding; I had a goal, a dataset, and the freedom (and pressure) to make something real.  

My task: Detect **malicious SSL/TLS certificates** using machine learning.  
That meant sifting through millions of certificate records, engineering useful features, training anomaly detection models, and eventually explaining *why* the models made certain predictions.  

It was my first deep dive into applied machine learning, and it ended up being the experience that solidified my interest in AI.

---

## what i did

i started by designing a **modular machine learning pipeline** in python that handled data parsing, feature engineering, model training, evaluation, and explainability.  

the dataset was massive — about **3 million certificate records**. i engineered **32 analytical features**, including things like certificate lifetime, issuer reputation, and domain entropy. this helped improve interpretability and remove redundant variables.  

i then experimented with and compared multiple **anomaly detection models**:
- isolation forest  
- one-class svm  
- random forest  
- half-space trees  
- k-means  
- graph convolution networks  
- large language model embeddings  

after rounds of ablation studies, hyperparameter tuning, and cross-validation, my best model hit a **0.994 F1-score** on detecting malicious certificates.  

the next challenge was explainability. i applied **LIME** and **feature importance analysis** to identify which factors most influenced predictions — this was crucial for building stakeholder trust and showing that the model wasn’t a “black box.”  

by the end, i also performed **data analysis on model outputs** to uncover behavioural trends in malicious certificates, helping refine future detection systems.

---

## Reflections

I actually finished the initial model early — and that gave me time to explore the "why" behind it. I spent days trying to visualise decision boundaries, interpret tree structures, and trace feature interactions.  

The hardest part wasn't training the model; it was explaining it. Communicating *how* it worked to people who weren't data scientists forced me to simplify without oversimplifying.  

One of my favourite moments was finding the original source code for the feature pipeline and refactoring it to make everything modular and reproducible — a small change that made future iterations so much easier.

---

## What I Learned

- Explainability isn't optional — it's what makes AI trustworthy  
- Most of machine learning is about **data**: cleaning it, understanding it, and extracting the right features  
- Reproducibility and documentation matter just as much as model performance  
- Cybersecurity is genuinely fascinating — there's so much overlap with ML, and it's all about patterns, anomalies, and context

---

## What's Next

This internship laid the foundation for everything I want to do in AI. It taught me how to move from theory to practice — from "training a model" to **building a system that solves a real-world problem**.  

It's also what sparked my interest in explainable AI and semi-supervised learning, which I've been exploring through side projects ever since.  

So yeah — it started with data and a dream. And it's still going!
