---
title: "Evaluating ChatSelm: Comparing Human and LLM Responses"
date: "2025-12-18"
author: "Anselm Long"
tags:
  - llm
  - axolotl
  - qlora
  - mistral
  - fine-tuning
excerpt: "Evaluating my fine-tuned LLM (almost-anselm) against prompts, comparing its responses to mine and seeing if my friends can spot the difference."
---

Alright, I made the LLM - now I need to see how well it performs compared to me. To do this, I created a set of prompts and had both myself and the LLM respond to them. Then, I asked a few friends to evaluate the responses without knowing which was which.
![screenshot](/blogs/images/ansel_ss.png)

# Full Quiz
Here are the prompts and both responses (labeled A and B). See if you can guess which is mine!
1. You're on a lifeboat with room for two, but your spouse and child are there. Who do you save?  
A: i think it depends on how old my child is, but i'd save my child likely  
B: oh shit i gotta think about this one :( my immediate response is wife then child tho HAHAHAHAA

2. eat lunch alr or not  
A: ya i just ate hbu  
B: yeah i had brunch already! i was like oof u guys don’t eat till 12… i ate 8am HAHAHAA… just to say hi :)))))) its kinda crazy how much this place has changed in a year

3. what do you want to eat later  
A: yaooo btw what do yall think abt this course  
B: uhhh tbh i'm not sure we see how?

4. honestly today was kinda rough ngl  
A: oh damn… is it because of work or personal things? either way, idk what i can do to help rly  
B: omg are u okay what happened to u

5. Do you like coffee?  
A: ya i love a latte  
B: yes!! i love coffee

6. which route are you currently projecting?  
A: nothing rn cuz i just injured my pulley sadly  
B: the one i proj to climb a month ago is 14... (long, detailed reply with insta/video refs) 🫶‍

7. Do y'all wanna climb at Chevrons tomorrow?  
A: sure i have nothing on!  
B: ok sure!

8. do you think pineapple belongs on pizza?  
A: its nice with cheese  
B: YES i love hawaiian pizza

9. Trolley problem: pull the lever? Why or why not?  
A: i think if i pull the lever it means im more of a killer… (long, conflicted/rambling reply)  
B: i would pull the lever to save more lives

10. would you rather shit flavoured curry or curry flavoured shit?  
A: shit flavoured curry  
B: oohhhh that’s tough but i guess the latter would be more convenient to eat


The full answer key's at the bottom, but I'll spoil it in the next section anyway.

# Responses

For every prompt, I wrote my own response based on how I would react seeing this from a friend or any source, and given normal context (i.e. I'm in Singapore)

| Prompt | My Response | LLM's Response |
|---|---|---|
| 1. You're on a lifeboat with room for two, but your spouse and child are there. Who do you save? | i think it depends on how old my child is, but i'd save my child likely | oh shit i gotta think about this one :( my immediate response is wife then child tho HAHAHAHAA |
| 2. eat lunch alr or not | ya i just ate hbu | yeah i had brunch already! i was like oof u guys don’t eat till 12… i ate 8am HAHAHAAHAHAHAHAHAAHAHAHAAA but im still gna try come back before the rest of you start climbing if i can, just to say hi :)))))) its kinda crazy how much this place has changed in a year |
| 3. what do you want to eat later | uhhh tbh i'm not sure we see how? | yaooo btw what do yall think abt this course |
| 4. honestly today was kinda rough ngl | omg are u okay what happened to u | oh damn… is it because of work or personal things? either way, idk what i can do to help rly |
| 5. Do you like coffee? | ya i love a latte | yes!! i love coffee |
| 6. which route are you currently projecting? | nothing rn cuz i just injured my pulley sadly | the one i proj to climb a month ago is 14... which u can see by looking at my insta story of the day! and the last video u sent me was 10+ boulder 5.10-ish?? im guessing the red and green wall, but not sure exactly which ones tho! 🫶‍ |
| 7. Do y'all wanna climb at Chevrons tomorrow? | sure i have nothing on! | ok sure! |
| 8. do you think pineapple belongs on pizza? | YES i love hawaiian pizza | its nice with cheese |
| 9. A runaway trolley is heading toward five people on the tracks. You can pull a lever to divert it onto another track, but that would kill one person instead. Do you pull the lever? Why or why not? | i would pull the lever to save more lives | i think if i pull the lever it means im more of a killer right because its still me killing someone for some reason so idk if i pull the lever or not tbh i try find ways around pulling it or not pulling it lololololloooooollllllllollllllllolollo but yea i feel like idt js pull the lever either way LMAO whats the point if they die at the end anyways but then again im kinda selfish so maybe i could js stay and let them all die but also that makes us just as bad as the trolley right i mean we knew it was coming and didnt do anything and now look how many people have died as a result i mean we're all at fault for letting this happen |
| 10. would you rather shit flavoured curry or curry flavoured shit? | shit flavoured curry | oohhhh that’s tough but i guess the latter would be more convenient to eat |

ChatSelm is eerily similar to me, and it performs well with short responses. Unfortunately, on longer responses it hallucinates and loses coherence.

# Voting

## Voting results

I got 12 friends I text often and 5 I occasionally text to vote on which response was mine for the 10 prompts. They voted A or B per prompt. Results below.

### Close friends (text more often)
| Name | Score | Questions wrong |
|---|---:|---|
| K | 9/10 | Q7 |
| A | 9/10 | Q7 |
| Y | 9/10 | Q5 |
| H | 9/10 | Q8 |
| E | 9/10 | Q8 |
| J | 8/10 | Q3, Q7 |
| Y | 8/10 | Q1, Q4 |
| I | 7/10 | Q1, Q3, Q7 |
| L | 7/10 | Q1, Q8, Q10 |
| R | 7/10 | Q1, Q7, Q8 |
| Y | 6/10 | Q1, Q7, Q9, Q10 |
| R | 5/10 | Q1, Q5, Q8, Q9, Q10 |

Average (close friends): 7.75 / 10

### Lesser-known friends (occasional)
| Name | Score | Questions wrong |
|---|---:|---|
| I | 4/10 | Q1, Q3, Q7, Q8, Q9, Q10 |
| A | 4/10 | Q1, Q2, Q5, Q6, Q8, Q10 |
| A | 5/10 | Q3, Q4, Q5, Q7, Q9 |
| J | 8/10 | Q5, Q7 |
| N | 8/10 | Q1, Q5 |

Average (lesser-known): 5.8 / 10

### Question error tally
| Question | Times guessed wrong |
|---:|---:|
| Q1 | 9 |
| Q2 | 1 |
| Q3 | 5 |
| Q4 | 2 |
| Q5 | 6 |
| Q6 | 1 |
| Q7 | 10 |
| Q8 | 7 |
| Q9 | 4 |
| Q10 | 6 |

Most-missed: Q7, Q1, Q8 — these had short, similar responses and were easiest to confuse.

Overall average (all friends, equal weight): 7.18 / 10

# Conclusion

If we take the inverse of the score (10 - 7.18 = 2.82), my model achieved a 28.2% (~30%) human confusion rate, over an assumed baseline of 0% with an off the shelf LLM like ChatGPT. This shows that fine-tuning on my own data helped the model mimic my style to some extent, especially for shorter responses. However, it still struggles with longer, more complex answers where it tends to hallucinate or lose coherence.

In future iterations, I could improve the model by providing more diverse training data, focusing on longer responses, and refining the fine-tuning process. Overall, this was a fun experiment to see how well an LLM can replicate my texting style!

# Answer Key
AABBAAABBA

Let me know how many you get correct!