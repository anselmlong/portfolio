---
title: "miccdrop: a shitty karaoke app"
date: "2025-01-20"
author: "Anselm Long"
tags:
  - hackathon
  - supabase
  - react native
excerpt: "hack and roll 2025"
---

## context

this was my first ever hackathon!
i worked on the frontend, hooked up real-time lyrics using the spotify lyrics api, and somehow made it all run on react native + supabase.

checkout the repo [here](https://github.com/leroytan/miccdrop)

## what is miccdrop?

miccdrop turns your phone into a mini karaoke booth.
you pick a song, sing along, and it scores you based on how close (or far) your pitch is from the original. but you can't just sing realllyyyy off-key, you have to be close enough (within one semitone), in order to get the best points.

## how it works

you sign in, pick a track, and the app fetches the instrumental, lyrics, and pitch guide from supabase.  
as you sing, it tracks your pitch in real-time, showing you a live graph that either makes you proud or deeply ashamed.  
when the song ends, it gives you a score — and a little recap so you can pretend you’ll do better next time.  

behind the scenes, it’s just a bunch of expo modules duct-taped together:
- `expo-av` for playback  
- `expo-audio-stream` + `pitchy` for live pitch detection  
- `react-native-lyric` for lyric syncing  
- and an express + supabase backend to handle songs, storage, and auth  


## reflections

the hackathon was really well ran, i personally loved the live coffee station, and the marshall wace mouse pad i still use today.
we didn’t have the most complex idea, but we had fun, learned a lot, and shipped something real in less than two days. 

hack and roll 2025 was my intro to hackathons, and i'll be sure to participate in the next one! big thanks to Leroy, Haleema, and Rachel for carrying me in this project :)

more to come 🎤


