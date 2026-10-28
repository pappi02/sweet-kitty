# My Sweet Kitty: video production plan

Plan for replacing every placeholder video on the site with our own AI-generated clips, all
starring one consistent Sweet Kitty character, and for building the first ads from the same shots.

Status: **approved 2026-10-26: going with the recommendations in section 3.** Slippery Kitty (P5)
waits until the client confirms which item it is. Product images on the site are handled separately
(another agent); this plan only uses them as references.

---

## 1. Ground rules (apply to every shot)

- **One star, always the same cat:** the cat from the box lid and logo (section 4). No other "hero" cats.
- **Brand colours:** hot pink `#ff0090` and white, soft pink tints. No black-heavy or dark scenes except the "before" mood.
- **Cartoon cats only.** No real people. Human hands may appear (handing over a parcel), never faces.
- **Ingredients stay secret.** Never show juice being mixed, herbs, fruit going into a bottle, or labels with contents.
- **Discreet.** Delivery is always a plain parcel. The pink box only appears once she opens it at home.
- **Tasteful for intimate products.** Tight and Slippery are shown only as packs on a vanity or in the kit. Never show use.
- **No other brands.** No Chanel, McDonald's, Apple logos or shop signs. Shopping bags are plain pink and white.
- **Kenyan setting where it shows:** a Nairobi apartment, a sunny Nairobi street, prices in KSh.
- **Format:** vertical 9:16 masters. Keep the cat in the centre band so the same clip also works cropped
  to 4:5 (site cards) and in the wide banners.

## 2. What we have, and what's missing

**Have**
- Box photo: `~/Videos/wan22/refs/sweet-kitty-box.png` (pink lid, "My Sweet Kitty" logo, pink bow)
- Logo art: `public/brand/my-sweet-kitty.png` (the mascot holding cash)
- Kit scene: `public/products/kit.jpg` (white and pink gift bag, pink tissue, small box, towel, jar)
- GPU setup on Vast.ai: Wan 2.2 image-to-video, about 70 s per 5-second clip

- Real product images (added 2026-10-26) in `public/products/`:
  - `sweet-kitty-7-day-kit.png`: the whole kit (gift bag, bow box, tall pink box, small pink bottle, jar, two crown towels)
  - `sweet-kitty-tight.png`: the pink box with satin bow (the same box as the box photo)
  - `sweet-kitty-magic-juice.png`: pink wine-style bottle, label "Magic Juice, Premium Blend", plus a tall pink gift box
  - `sweet-kitty-magic-bath.png`: pink jar of crystals with a shiny pink lid, plus a towel with an embroidered pink crown
  - `slippery-kitty.png`: ⚠️ shows only the pink gift bag with tissue (the bag the kit comes in), no product

**Missing**
- **What Slippery Kitty actually looks like.** Its image is the kit's gift bag. My guess from the kit photo
  is the small pink bottle standing between the box and the jar (section 3, decision 2).
- **A second character** for the bestie (and optionally "him" from the story).
- **Music and sound.** Generated clips are silent. We need royalty-free music (and optional voice-over).
- **Wide (landscape) clips** for the shop and contact banners, which currently crop a vertical clip to a thin strip.

## 3. Decisions needed before we start

| # | Question | My recommendation |
|---|---|---|
| 1 | Does the mascot have a name? | Just "Sweet Kitty" so the brand and the character are the same |
| 2 | Slippery Kitty: which item is it? Its image shows only the gift bag | Confirm with the client. If it's the small pink bottle in the kit photo, we use that bottle. ✅ The other four products are settled from the real images |
| 3 | Bestie character | A second cat with a clearly different look (for example a tabby with gold hoops and braids), a secondary character only |
| 4 | Show "him" (story: "He stopped looking")? | Leave him out of the first batch. Keep the story about her |
| 5 | Language for captions and voice-over | Captions in English, with Swahili and Sheng variants for ads later |
| 6 | Okay to download extra models on the GPU? | Yes: image editor (about 22 GB, for keyframes with the real box) and a sharpener/upscaler (about 70 MB). Delete the two unused image models that came with the template to make room |
| 7 | Final resolution | Site: 720x1280 (upscaled from 480x832). Ads: 1080x1920, using the AI upscaler |

## 4. Character bible

**Sweet Kitty (main character).** Taken from the box lid:
- White, very fluffy long-haired cat (Persian look), blue eyes, pink nose
- **Pink jewelled crown**, **pink round sunglasses**, **pink pearl necklace with a heart pendant**
- Feminine, poised, a little sassy. Walks upright in the "after" shots

**Her visual arc: she gets her crown back.**

| Stage | Look | Setting |
|---|---|---|
| Before | No crown, no sunglasses, fur a bit flat, grey oversized hoodie, tired eyes | Dim bedroom, grey blanket, curtains half shut |
| Turning point | Same as before, then eyes light up when she opens the pink box | Same bedroom, warmer light |
| Ritual (days 1–7) | Pink satin robe, crown on, sunglasses pushed up | Bright white and pink bathroom and vanity |
| After | Full look: crown, heart sunglasses, pearls, pink outfit, confident walk | Sunny Nairobi street, pink café, airport |

Master reference: the logo (`public/brand/my-sweet-kitty.png`). Short, flat Persian/Exotic face,
**pink cat-eye sunglasses**, a tiara with pink heart gems, a pink pearl necklace with a heart pendant.
In the logo she holds cash; in the videos the cash is replaced by the kit.

**Props: always copy the real product images in `public/products/`**

| Prop | Look | Reference image |
|---|---|---|
| Gift bag (the kit) | Pale pink bag, hot pink side, pink rope handles, hot pink tissue on top, logo on front | `sweet-kitty-7-day-kit.png` |
| Tight | Pale pink lid with logo, hot pink base, hot pink satin bow | `sweet-kitty-tight.png` |
| Magic Juice | Pink wine-style bottle with a pink foil top and a "Magic Juice" label, plus a tall pink gift box | `sweet-kitty-magic-juice.png` |
| Magic Bath | Pink jar of crystals with a shiny hot pink lid, plus a pale pink towel with an embroidered crown | `sweet-kitty-magic-bath.png` |
| Slippery Kitty | Waiting on decision 2 (probably the small pink bottle) | `sweet-kitty-7-day-kit.png` |
| Delivery parcel | Plain brown or white parcel, no writing (discreet) | none |

The whole kit, unpacked, is: gift bag + Tight box + Magic Juice (bottle and box) + Magic Bath (jar and
towel) + Slippery Kitty.

## 5. Shot list

Every shot is one 5-second clip (81 frames at 16 fps), made from a keyframe image of the mascot.
"Joined" means the shot is made with both a start and an end image, so it cuts cleanly into the next one.

### A. Website clips (replace the Pinterest placeholders)

| ID | Shot | Keyframe and motion | Replaces on the site |
|---|---|---|---|
| W1 | **Before** | Sad mascot in bed, crown left on the bedside table. She pushes away a plate and sighs. Slow push-in | `before` (slider, home story "Before", reels) |
| W2 | **The message** | Still in bed, her phone lights up. She reads, her ears perk up, she sits up | `bestie` ("Girl, haven't you heard?") |
| W3 | **Delivery** | A hand hands a plain parcel through the door. She takes it, curious | new story clip (home "The order") |
| W4 | **The reveal** (joined to W3, W5) | She opens the parcel. Inside is the pink Sweet Kitty gift bag with hot pink tissue (she ordered the 7-Day Kit). Her eyes go wide | new (this replaces the money scene) |
| W5 | **Crown back** | She lifts the bow box out of the bag and hugs it. Sparkles, and her crown floats back onto her head. She smiles | new, home story turning point |
| W6 | **Wake & sip** | Morning sun, she pours pink Magic Juice from the labelled bottle into a glass and sips | `morning` (ritual page, product pages) |
| W7 | **Soak** | Rose bath, she sprinkles pink crystals from the Magic Bath jar, crown towel on the edge, eyes closed | `reset` ("Day one: reset") |
| W8 | **Glow** | At the vanity mirror. She touches her cheek, sees her glow, slides on the heart sunglasses | `glow` (about page, product pages) |
| W9 | **After** | Full look, strutting down a sunny Nairobi street with plain pink shopping bags | `after` (slider, home, kit, shop, contact) |
| W10 | **Booked** | Pink suitcase at the airport, or a business-class seat, lifting her sunglasses | `holiday` (home story "After") |
| W11 | **Calls her bestie** | On the phone, laughing: "You still don't have Sweet Kitty?" | new reel |

**Before/after slider pair.** The slider shows two clips on top of each other, so they must have the same framing.
- C1: the mascot sitting on the edge of her bed, sad (before look)
- C2: the same spot and camera, glowing (after look)

These two replace `before` and `after` in the slider only.

### B. 7-day ritual micro-clips (optional, second batch)

One short clip per day for the ritual page and reels. W6–W8 are reused where marked.

| Day | Shot |
|---|---|
| 1 Reset | W7 (bath) |
| 2 Energy | Stretching by the window with a big glass of water |
| 3 Glow | W8 (mirror) |
| 4 Confidence | Walking down a hallway, head up, tail swishing |
| 5 Self-love | Hugging herself in the mirror, hearts float up |
| 6 Magnetic | Walks into a café, other cats turn to look |
| 7 Reborn | Twirls in a pink dress, crown sparkling |

### C. Product clips (4:5 safe, for the shop and product pages)

| ID | Shot | Waiting on |
|---|---|---|
| P1 | **Kit:** the full kit laid out as in the kit photo, slow camera glide, sparkles, the mascot's paw lifts the tissue | nothing |
| P2 | **Magic Juice:** the bottle and its box on a sunny counter, the mascot's paw pours a glass | nothing |
| P3 | **Magic Bath:** the jar and crown towel beside a rose-petal bath, steam rising | nothing |
| P4 | **Tight:** the bow box on the vanity, soft sparkles, the bow ribbon moves slightly, no use shown | nothing |
| P5 | **Slippery:** the product on the vanity with silk fabric, no use shown | decision 2 |

Every product shot starts from the real product image, so the packs look exactly like the photos.

### D. Wide banners (832x480 landscape)

| ID | Shot | Used on |
|---|---|---|
| L1 | The mascot lounging on a pink sofa with the kit box and gift bag | shop page banner |
| L2 | The mascot texting happily on the sofa (no WhatsApp logo) | contact page banner |

### E. First ads (edited together from the shots above)

| Ad | Length | Shots |
|---|---|---|
| 1. Her story | 45 s | W1, W2, W3, W4, W5, W6, W7, W8, W9, end card |
| 2. What's in the kit | 30 s | W3, W4, P1, P2, P3, end card with price KSh 10,000 |
| 3. Morning ritual | 30 s | W6, W7, W8, Days 2 and 4, end card |
| 4. Bestie to bestie | 30 s | W11, W2, W5, W9, end card "Order on WhatsApp" |

End card: logo, "7-Day Kit KSh 10,000", "Order on WhatsApp", the site address.

**Total unique shots:** 11 (A) + 2 (slider) + 5 (products) + 2 (banners) = **20 for the first batch**, plus 5 more for the 7-day clips.

## 6. Production to-do

### Phase 0: prepare (on your computer, free)
- [ ] Get answers to the decisions in section 3
- [x] Collect product photos (done 2026-10-26, except Slippery, see decision 2)
- [ ] Choose 2–3 royalty-free music tracks (for example YouTube Audio Library or Pixabay Music), upbeat, feminine
- [ ] Write the end-card text and the captions for each ad

### Phase 1: GPU setup (about 20 minutes)
- [ ] Start the instance (needs a 2FA code)
- [ ] Delete the two unused template image models (SD 1.5 and SDXL Turbo) to free disk space
- [ ] Download the image editor (Qwen-Image-Edit, quantised, about 22 GB) and the 4-step speed-up for it
- [ ] Download the upscaler (4x-UltraSharp or RealESRGAN, about 70 MB)
- [ ] Add the "start and end image" workflow (Wan 2.2 first-last-frame) next to the existing one
- [ ] Test one image edit and one joined clip

### Phase 2: character sheet (about 15 minutes, needs your approval)
- [ ] Make the mascot from the box art: front, side, sitting, lying in bed, standing
- [ ] Make her three looks: before, ritual, after
- [ ] Make the bestie character (if approved)
- [ ] Make the props: parcel, gift bag, and the single products (if approved)
- [ ] **You approve the character sheet.** Every keyframe after this uses these images as references

### Phase 3: keyframes (about 20 minutes, needs your approval)
- [ ] One keyframe image per shot (20 shots), 2–3 options each
- [ ] End keyframes for the joined shots (W3 → W4 → W5)
- [ ] Check every keyframe: same cat, the real box, no logos, no ingredients, nothing explicit
- [ ] **You pick one keyframe per shot**

### Phase 4: animate (about 75 minutes of GPU time)
- [ ] 3 versions (seeds) per shot, so 60 clips at about 75 s each
- [ ] Save every version with the shot ID in the file name (for example `W4_seed2.mp4`)
- [ ] Copy all versions to your computer as they finish

### Phase 5: pick and finish
- [ ] Pick the best version of each shot (I make a comparison sheet, you choose)
- [ ] Smooth the motion (RIFE, 16 → 32 fps) and upscale: 720x1280 for the site, 1080x1920 for ads
- [ ] Re-generate any shot where the cat drifts off-model or the box looks wrong
- [ ] **Stop the instance**

### Phase 6: put them on the site (on your computer) — done 2026-10-26
Done: all 19 clips encoded to `public/videos/kitty-*.mp4`, `kit-reveal`, `magic-juice`, `magic-bath`,
`tight-box` (720x1280 / 1280x720, no sound yet), wired in `videos.ts`, home story, slider (C1/C2),
shop kit tile (P1), contact card (L2), kit page arch (W5). Still open: music, product pages still use
`morning`/`glow` (product pages are being reworked separately), Slippery (P5), 7-day clips, ad upscales.
Masters: `~/Videos/wan22/final/` (32 fps), keyframes in `final/keyframes/`.
- [ ] Encode web versions with posters, the same way as today's clips (fast start, about 1–2 MB each)
- [ ] Update `src/lib/videos.ts`: the new IDs, plus the new story clips (delivery, reveal, crown back, bestie call)
- [ ] Update the home story scenes in `src/components/home/story.tsx`
- [ ] Point the before/after slider at C1/C2
- [ ] Use L1/L2 in the shop and contact banners
- [ ] Add music to the clips that play with sound in the full-screen player
- [ ] Remove the Pinterest files from `public/videos` once nothing uses them
- [ ] Check every page on desktop and phone

### Phase 7: ads (on your computer, in CapCut or similar)
- [ ] Edit ads 1–4 from section 5E: shots, music, captions, end card
- [ ] Export at 1080x1920, 30 fps
- [ ] Make Swahili and Sheng caption versions (decision 5)

## 7. Cost and time

| Item | GPU time | Cost (at $0.46/hr) |
|---|---|---|
| Setup and downloads | ~20 min | ~$0.15 |
| Character sheet and keyframes | ~35 min | ~$0.30 |
| 60 clips (20 shots x 3) | ~75 min | ~$0.60 |
| Smoothing and upscaling | ~20 min | ~$0.15 |
| **First batch total** | **~2.5 hours** | **~$1.20** |

The instance is stopped between sessions, so waiting for your approvals costs nothing except storage
(about $0.02/hr).

## 8. Risks

- **Box lettering may wobble** in motion. Keep the box steady and close to the camera in key shots. If
  the "My Sweet Kitty" text must be perfect in an ad, overlay the real box image in the edit.
- **The cat can drift off-model** over 5 seconds, or between shots. We use the same reference images
  for every keyframe, joined shots for cuts, and re-generate any shot that drifts.
- **Hands and paws holding objects** are the hardest thing for video AI. Expect the reveal shots (W4, W5)
  to need the most tries.
- **Product labels are small.** The "Magic Juice" label and the logos may blur or warp in motion. Keep
  product shots close and slow, and overlay the real photo in the edit if a label must be readable.
- **Instance availability:** if someone else rents the GPU while it's stopped, we wait or rebuild on another
  machine (about 15 minutes).
