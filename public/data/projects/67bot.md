# 67 Bot

## what is it?
a telegram bot that watches group chats for photos containing the number 67 and counts them. every time someone posts a 67, the bot detects it, counts a "drop" for that member, and keeps a running leaderboard. run by anselm, with a landing page at bot.anselmlong.com/67bot.

## how does it detect 67?
it uses a hybrid vision pipeline. photos and sampled video frames go through local OCR first (easyocr), and if that's unsure, a gpt-4o vision pass takes a second look. it can even handle fuzzy typing like "s c u b a" for the scuba reaction.

## what are the features?
a per-group leaderboard, message deduplication so one screenshot only counts once, admin leaderboard resets (manual and scheduled daily/weekly/monthly), an owner-only broadcast command for announcements, and a reaction when someone types "scuba". it also detects when both 69 and 67 appear in the same image.

## what tech does it use?
python, easyocr, gpt-4o, opencv, sqlite, docker, and the telegram bot api. it runs in a docker container on anselm's vps and handles dozens of group chats.

## how popular is it?
it's live in a bunch of group chats and the leaderboard is genuinely competitive. it's one of anselm's favourite silly-but-delightful projects.
