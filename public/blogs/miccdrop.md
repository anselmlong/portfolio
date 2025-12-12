---
title: "Miccdrop: a shitty karaoke app"
date: "2025-01-20"
author: "Anselm Long"
tags:
  - hackathon
  - supabase
  - react native
excerpt: "Hack and Roll 2025"
---

## Context

This was my first ever hackathon!
I worked on the frontend, hooked up real-time lyrics using the Spotify lyrics API, and somehow made it all run on React Native + Supabase.

Checkout the repo [here](https://github.com/leroytan/miccdrop)

## What is Miccdrop?

Miccdrop turns your phone into a mini karaoke booth.
You pick a song, sing along, and it scores you based on how close (or far) your pitch is from the original. But you can't just sing realllyyyy off-key, you have to be close enough (within one semitone), in order to get the best points.

## How It Works

You sign in, pick a track, and the app fetches the instrumental, lyrics, and pitch guide from Supabase.  
As you sing, it tracks your pitch in real-time, showing you a live graph that either makes you proud or deeply ashamed.  
When the song ends, it gives you a score — and a little recap so you can pretend you'll do better next time.  

Behind the scenes, it's just a bunch of Expo modules duct-taped together:
- `expo-av` for playback  
- `expo-audio-stream` + `pitchy` for live pitch detection  
- `react-native-lyric` for lyric syncing  
- And an Express + Supabase backend to handle songs, storage, and auth


## Reflections

The hackathon was really well ran, I personally loved the live coffee station, and the Marshall Wace mouse pad I still use today.
We didn't have the most complex idea, but we had fun, learned a lot, and shipped something real in less than two days. 

Hack and Roll 2025 was my intro to hackathons, and I'll be sure to participate in the next one! Big thanks to Leroy, Haleema, and Rachel for carrying me in this project :)

More to come 🎤


