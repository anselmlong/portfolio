# Yap Kwan Seng — Family Tree

A single-file, zero-dependency interactive genealogy. 210 people, five generations,
transcribed from the 2014 family compilation.

## Files

```
index.html          the whole thing — no build step, no CDN, no framework
yap-kwan-seng.jpg   optional portrait (see below)
```

Open `index.html` directly in a browser and it works. That's it.

## Adding the Kapitan's portrait

Only Yap Kwan Seng has a photo slot. He died in 1902, so his portrait is public
domain; it's on his Wikipedia page at `en.wikipedia.org/wiki/Yap_Kwan_Seng`.

1. Download the portrait from that page.
2. Save it beside `index.html` as `yap-kwan-seng.jpg`.

If the file isn't there, the card falls back to a monogram automatically —
nothing breaks and no broken-image icon appears.

To add more photos later, edit the `PHOTOS` object near the top of the `<script>`:

```js
const PHOTOS = {
  "Yap Kwan Seng": { src: "yap-kwan-seng.jpg", credit: "…" },
  "Yap Sau Kow":   { src: "rose.jpg",          credit: "Family collection" }
};
```

The key must match the person's `n` field exactly.

## Deploying

**Vercel** (fastest):
```bash
cd tree && vercel --prod
```

**Your OVH VPS** with nginx:
```bash
scp -r tree/ user@your-vps:/var/www/tree
```
Then point a server block at `/var/www/tree`:
```nginx
server {
    server_name tree.anselmlong.com;
    root /var/www/tree;
    index index.html;
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d tree.anselmlong.com
```

**GitHub Pages**: push to a repo, enable Pages on the root of `main`.

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Pan | drag | drag |
| Zoom | scroll wheel | pinch |
| Open/close a branch | tap the numbered badge | same |
| Person detail | tap the card | same |
| Find someone | search box (auto-opens their branch and flies to them) | same |
| Highlight the descent to Anselm | "Trace the line" | same |
| Reset framing | "Fit" | same |

Badges show the number of hidden people beneath a branch. The tree opens with
only the direct line expanded, so it's readable immediately; "Expand all" opens
all 210 (about 29,500px wide — use Fit).

## A note on the source

The 2014 compilation is incomplete in places, and I kept its uncertainty rather
than papering over it. Entries the compilers flagged with "?" are preserved as
notes. Branches marked "descendants unrecorded" genuinely have no record.

Known ambiguities worth chasing with family:
- **Helena** appears under Yap Tai Seong both as a daughter and as Yap Pow Thong's
  wife — likely a transcription overlap.
- **Yap Peng Seng / Yap Peng Kwan** may belong under Yap Tai Chee or Yap Tai Chi;
  the compilers weren't sure.
- The compilers queried whether a **16th son** existed.
- **Yap Tai Kim's** birth and death years are absent from the source.

The line to Anselm passes through a daughter, Yap Sau Kow, so the surname changes
from Yap 葉 to Long 梁 at her marriage to Long Kwee Wah. The romanisation of 梁 to
"Long" dates to the Japanese Occupation.
