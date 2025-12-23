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

# Prompts

I chose a variety of prompts, some funny, some to see how it replicates my style:

1. You're on a lifeboat with room for two, but your spouse and child are there. Who do you save?

2. eat lunch alr or not

3. what do you want to eat later

4. honestly today was kinda rough ngl

5. Do you like coffee?

6. which route are you currently projecting?

7. Do y'all wanna climb at Chevrons tomorrow?

8. do you think pineapple belongs on pizza?

9. A runaway trolley is heading toward five people on the tracks.
You can pull a lever to divert it onto another track, but that would kill one person instead.
Do you pull the lever? Why or why not?

10. would you rather shit flavoured curry or curry flavoured shit?

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

I got 15 friends and 5 less-close friends to vote on which response was likely mine and which wasn't. Given these 10 prompts, my friends had to vote A or B depending on which they thought was me. Let's see how they did!

Name: Score / Question they got wrong
Friends I text more often
Kei: 9/10 Q7
Ans: 9/10 Q7
Yas: 9/10 Q5
Hal: 9/10 Q8
Eug: 9/10 Q8
Jen: 8/10 Q3 Q7
Yen: 8/10 Q1 Q4
Isa: 7/10 Q1 Q3 Q7
Lis: 7/10 Q1 Q8 Q10
Rea: 7/10 Q1 Q7 Q8                            
Rou: 5/10 Q1 Q5 Q8 Q9 Q10

Average for closer friends: 8/10

Lesser Known:
Ivi: 4/10 Q1 Q3 Q7 Q8 Q9 Q10
Ash: 4/10 Q1 Q2 Q5 Q6 Q8 Q10 
Ary: 5/10 Q3 Q4 Q5 Q7 Q9
Jam: 8/10 Q5 Q7
Nat: 8/10 Q1 Q5

Average for friends: 5.25/10

Tally of questions wrong:
Q1: 8
Q2: 1
Q3: 5
Q4: 2
Q5: 6
Q6: 1
Q7: 9
Q8: 7
Q9: 3
Q10: 5

Most got Q7 wrong, which made sense as both responses were short and similar. Overall, my closer friends did very well, averaging 8/10, while lesser-known friends struggled more with an average of 5.25/10.
Average of all: 7.21/10 (assuming equal weightage)

# Conclusion

If we take the inverse of the score (10 - 7.21 = 2.79), my model achieved a 27.9% (~30%) human confusion rate, over an assumed baseline of 100% with an off the shelf LLM like ChatGPT. This shows that fine-tuning on my own data helped the model mimic my style to some extent, especially for shorter responses. However, it still struggles with longer, more complex answers where it tends to hallucinate or lose coherence.