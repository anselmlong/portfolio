# MassGoWhere

## what is it?
massgowhere is a mobile website built by anselm, at massgowhere.com, that answers one question for catholics in singapore: which mass can i actually make from where i am, and how do i get there. there's also a telegram bot, @massgowherebot, and a nearest mass button in his daily gospel bot, and all three give the same answer.

## how does it work?
you tap "find a mass near me" (or type a postal code), pick bus & mrt, driving or walking, and it answers with one mass: the time, the church, and when to leave, with a navigate button that hands off to google maps. it ranks singapore's 32 parishes by the mass you can still reach in time, not just the nearest church, and lists the other churches you can make it to underneath. there's also a map of every church and a page per church with its mass times.

## where do the mass times come from?
mycatholicsg is the source of truth. once a month a script checks each parish's own website, read by llms, and the church page says when the times were last confirmed there. it's honest about uncertainty: it shows the source and when it was checked, flags feast days and public holidays, and marks travel times as estimates until live routes load.

## what tech does it use?
a plain html, css and javascript site on vercel, with one serverless endpoint (/api/next) that does the ranking so the website and both telegram bots agree. travel times come from onemap, the singapore land authority's routing api. the map uses maplibre. the telegram bot is a dependency-free python long-polling bot on anselm's vps.

## why did you build it?
finding a mass away from your own parish meant googling "nearest church", then checking its times, then working out if you could get there. massgowhere does all of that in one tap, and the accent colour even follows the church's liturgical season.
