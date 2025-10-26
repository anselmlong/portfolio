---
title: "data and a dream"
date: "2025-08-01"
author: "Anselm Long"
tags:
  - python
  - machine learning
  - scikit-learn
  - anomaly detection
excerpt: "probably my most tech-focused experience to date. i had 3 months and 1 priority - to detect which web certificates were malicious and which weren't. all i had was data and a dream..."
---

![me final presenting](/blogs/images/machine-learning-intern.png)
<figcaption>my final presentation for this internship</figcaption>

read my full report [here](/blog/detecting-malicious-certificates)!

## context

this was my second internship at imda — and unlike my first, it was fully technical. there wasn’t a fixed guidebook or daily hand-holding; i had a goal, a dataset, and the freedom (and pressure) to make something real.  

my task: detect **malicious SSL/TLS certificates** using machine learning.  
that meant sifting through millions of certificate records, engineering useful features, training anomaly detection models, and eventually explaining *why* the models made certain predictions.  

it was my first deep dive into applied machine learning, and it ended up being the experience that solidified my interest in ai.

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

## reflections

i actually finished the initial model early — and that gave me time to explore the “why” behind it. i spent days trying to visualise decision boundaries, interpret tree structures, and trace feature interactions.  

the hardest part wasn’t training the model; it was explaining it. communicating *how* it worked to people who weren’t data scientists forced me to simplify without oversimplifying.  

one of my favourite moments was finding the original source code for the feature pipeline and refactoring it to make everything modular and reproducible — a small change that made future iterations so much easier.

---

## what i learned

- explainability isn’t optional — it’s what makes ai trustworthy  
- most of machine learning is about **data**: cleaning it, understanding it, and extracting the right features  
- reproducibility and documentation matter just as much as model performance  
- cybersecurity is genuinely fascinating — there’s so much overlap with ml, and it’s all about patterns, anomalies, and context  

---

## what’s next

this internship laid the foundation for everything i want to do in ai. it taught me how to move from theory to practice — from “training a model” to **building a system that solves a real-world problem**.  

it’s also what sparked my interest in explainable ai and semi-supervised learning, which i’ve been exploring through side projects ever since.  

so yeah — it started with data and a dream. and it’s still going!
