# Mascot artwork — what the app needs, and what we have

The app is getting a mascot chooser: Mila picks the animal and types its name.
Whichever she picks has to cover **every** place a mascot appears, so a set is
only usable when it is complete. This file is the checklist for getting there.

Three sets exist so far, in `Mascots/Rabbit`, `Mascots/Fox` and `Mascots/Bear`.
Contact sheets of everything, with the names I gave each file, are
`pregled-rabbit.jpg`, `pregled-fox.jpg` and `pregled-bear.jpg` — **look at those
first and correct me** where a pose is labelled wrong. Nothing in `www/` has
been changed yet.

Where each set stands, counting only what actually ships:

| | Exercise poses (of 19) | Mascot states (of 5) | What is left |
| --- | --- | --- | --- |
| Rabbit | **19** | **5** | `linija` — it is the same one-leg balance as `prsti` |
| Fox | **19** | **5** | `mostic`, `arabeska`, `pretklon` have ragged cutouts |
| Bear | 17 | **5** | `mostic` and `cucanj` missing, `arabeska` wrong pose |

All three are usable today; anything missing falls back to the drawn figure.
**`STILL-NEEDED.md` is the working list** — it carries the prompts.

## Naming

`<species>-<pose>.png` — `rabbit-mostic.png`, `fox-mostic.png`, `bear-mostic.png`.

The prefix is the **species, not the name**. Mila can call the fox anything she
likes, and the filenames must not care — which matters more now that there are
three of them and only one has a name so far. It also avoids `lili-` and
`luli-` sitting next to each other, one letter apart, in the same folder.

## What a complete set is

### The nineteen exercise poses

Every exercise in `EX` needs one. The pose has to be recognisable at 96 px in
the list and hold up at ~500 px on the workout screen.

| Pose file | Exercise | What it must show | Rabbit | Fox | Bear |
| --- | --- | --- | :---: | :---: | :---: |
| `zvezdice` | Zvezdice u mestu | jumping jack mid-air, arms up in a V, legs apart | ✅ | ✅ | ✅ |
| `macka` | Mačka–krava | on all fours, back arched up, head tucked, side view | ✅ | ✅ | ✅ |
| `psic` | Psić | downward dog, hips high, straight legs, head between paws | ✅ | ✅ | ✅ |
| `leptiric` | Leptirić | sitting, soles pressed together, knees out, paws holding feet | ❌ | ✅ | ✅ |
| `pretklon` | Sedeći pretklon | sitting, legs straight out, folding forward to the toes | ✅ | ❌ | ❌ |
| `kobra` | Kobra | on tummy, chest lifted on straight front paws, legs flat | ⚠️ | ⚠️ | ❌ |
| `mostic` | Mostić | **backbend bridge, tummy facing up**, all four paws down | ❌ | ❌ | ❌ |
| `spaga` | Špaga | a split, held, paws on the floor | ✅ | ✅ | ✅ |
| `arabeska` | Streličar (arabeska) | **one leg straight back, body tipped forward**, arms out | ❌ | ❌ | ❌ |
| `linija` | Hodanje po liniji | **walking heel-to-toe along a line**, arms out sideways | ⚠️ | ⚠️ | ⚠️ |
| `prsti` | Ravnoteža na prstima | standing tall **on tiptoes**, arms out, both feet up | ⚠️ | ⚠️ | ⚠️ |
| `sveca` | Sveća | shoulder stand, legs straight up, paws supporting the hips | ✅ | ✅ | ❌ |
| `daska` | Daska | forearm plank, body one straight line head to heels | ⚠️ | ⚠️ | ⚠️ |
| `noge` | Podigni noge | on her back, legs raised straight up to ninety degrees | ✅ | ✅ | ❌ |
| `cuk` | Ćuk (držanje) | tucked, knees hugged in, feet off the floor | ✅ | ✅ | ❌ |
| `lastavica` | Lastavica na podu | on tummy, arms forward and legs lifted, flying | ✅ | ✅ | ✅ |
| `cucanj` | Polučučanj + ruke napred | half squat, both arms straight forward | ✅ | ✅ | ❌ |
| `iskorak` | Iskorak | forward lunge, back knee toward the floor, paws on hips | ❌ | ⚠️ | ❌ |
| `dete` | Dete poza | kneeling, sitting back on heels, forehead down, arms forward | ✅ | ✅ | ❌ |

✅ have it · ⚠️ have something close, see "Provisional" below · ❌ missing

### The mascot's own states

These are not exercises — they are the mascot being a character. They appear far
more often than any single pose, so they matter more.

| File | Where it is used | Rabbit | Fox | Bear |
| --- | --- | :---: | :---: | :---: |
| `sit` | the card on Početna, on Plan, on Obaveze, on Podsetnik — the everyday face | ✅ | ✅ | ✅ |
| `happy` | every congratulation after an exercise, the finish screen, "sve gotovo" | ✅ | ✅ | ❌ |
| `hero` | the big picture on Početna. Portrait, roughly 4:5, the most flattering pose there is | ❌ | ❌ | ❌ |
| `spava` | sleeping. Not used yet — it would suit the Podsetnik screen far better than today's drawn alarm clock | ✅ | ✅ | ❌ |
| `portret` | head and shoulders, for the chooser itself: one card per mascot, "which one do you want?" | ❌ | ❌ | ❌ |

`hero` can be faked from `zvezdice` or `happy` for a first pass, but both are
landscape-ish and the slot is portrait, so it will letterbox.

### Left alone deliberately

The sticker badges (`ILLU.badge`), the app icon and the rail logo are not the
mascot and do not need a version per animal. The Podsetnik illustration
(`ILLU.reminderScene`) is a drawn alarm clock — it can stay, or `spava` can
replace it once every set has one.

## The shopping list

Two things left, and that is all:

1. **The bear needs `mostic` and `cucanj`.**
2. **The fox needs its five bad files generated again** — `mostic`, `arabeska`,
   `pretklon`, `hero`, `portret`.

Optional after that: `linija`, `prsti`, `daska` and `kobra` for any of them are
the poses where I had to guess between near-identical pictures, and the bear's
`arabeska` is a side extension rather than a true arabesque.

### Provisional identifications ⚠️

Each set has three or four near-identical "standing on one leg, arms out"
pictures, and I split them across `prsti`, `linija` and a spare. None of them is
actually walking heel-to-toe, and only one is on tiptoes. Likewise `daska` and
`kobra` are two similar lying-down poses in each set and the split between them
is a judgement call.

They are usable — a child will not file a bug — but if you are generating
anyway, these four are the ones worth doing properly. Check `pregled-*.jpg` and
tell me if you disagree with any label; renaming is instant.

The rabbit has two spares I could not match to any exercise:
`rabbit-extra-ravnoteza.png` and `rabbit-extra-sedeci-raskorak.png`.

## Generating the missing ones

**`STILL-NEEDED.md` is the current list** — everything outstanding, including
the pictures that exist but show the wrong pose, in three prompts. `PROMPTS.md`
is the older round and is kept only for reference.

The older writeup** — one complete block per missing image, nothing to
fill in. What follows here is the reasoning behind them.

Attach an existing file from that mascot's folder as a reference image every
time — that is what keeps it the same character rather than a new animal.

### What every prompt has to say

- Same character as the references — fur colours, eyes, bow, leotard.
- Full body, head to toe, nothing cropped, generous margin.
- **Transparent background, PNG with alpha. No floor, no shadow, no glow.**

The last one is already what the tool has been delivering: **every one of the 49
images so far is an RGBA PNG with a genuinely transparent background** (65–82%
of each file is fully transparent). That is the ideal input — there is no
background to cut out at all, only a trim to the character's bounding box and a
downscale. Keep asking for it.

### The pose lines

| File | Pose line to append |
| --- | --- |
| `mostic` | *in a gymnastics backbend bridge on a pink yoga mat, tummy facing up, body arched high, all four paws flat on the floor, head hanging back, side view* |
| `arabeska` | *balancing on one leg, the other leg stretched straight out behind her at hip height, body tipped forward, both arms stretched out to the sides, side view* |
| `linija` | *walking heel-to-toe along a straight line marked on the floor, both arms stretched out sideways for balance, looking down at the line, front view* |
| `prsti` | *standing tall on tiptoes on both feet, heels lifted high off the floor, arms stretched out to the sides, chin up, front view* |
| `daska` | *forearm plank on a pink yoga mat, resting on both forearms and toes, body in one straight line from head to heels, looking forward, side view* |
| `kobra` | *lying on her tummy on a pink yoga mat, chest lifted up on straight front paws, head up looking forward, back gently arched, hips staying on the floor, side view* |
| `leptiric` | *sitting on a pink yoga mat, soles of her feet pressed together, knees dropped out to the sides, both paws holding her feet, smiling, front view* |
| `pretklon` | *sitting on a pink yoga mat with both legs straight out in front, folding forward, paws reaching toward her toes, side view* |
| `iskorak` | *in a forward lunge, one leg bent in front, back knee lowered toward the floor, paws on her hips, side view* |
| `hero` | *standing proudly facing the camera, one arm raised in a victory wave, big happy smile, full body, portrait framing with room above her head* |
| `portret` | *head and shoulders only, facing the camera, big happy smile, portrait framing* |

## Format

- **PNG with an alpha channel**, transparent background. This is what has been
  arriving and it is exactly right.
- At least 1024 px on the short side. What is here now (1024×1536 and 1536×1024)
  is far better than the old board, where each pose was only 90–290 px wide and
  went soft on the workout screen.
- One pose per file. Nothing cropped by the frame — full body, margin all round.

## Once a set is complete

Nothing in `www/` changes until then. When it is:

1. Trim each to its alpha bounding box and downscale into
   `www/img/<species>-<pose>.png`. No cutting out needed — they are already
   transparent, so `tools/crop-gimi.py` and its flood fill are not involved.
2. `MASCOTS` in `app.js` gets each species, its default name and its file prefix;
   `st.mascot` and `st.mascotIme` join the saved state (additive, so no
   migration — see `CLAUDE.md`).
3. `exPic()` and `lili()` take the prefix from the chosen mascot instead of
   hardcoding `lili-`, and every "Lili" in the copy becomes her chosen name.
4. `ASSETS` in `sw.js` gets both sets, and `CACHE` and `BUILD` go up.

**Note on the current build:** the rabbit here is *not* the same drawing as the
Lili now in `www/img` — different style, different render. Choosing it means
replacing all eighteen existing pictures, not adding to them.

## Repository note

These masters are ~140 MB. They are deliberately **not** committed: the repo is
public and GitHub Pages serves it. The processed versions that ship are tiny —
the eighteen currently in `www/img` come to 248 KB in total. Keep this folder
backed up somewhere outside the repo.

## Appendix — original filenames

Everything arrived as `ChatGPT Image Jul 31, 2026, …`. The mapping, in case a
label needs checking against the original download:

### Bear
| Original | Now |
| --- | --- |
| `…01_02_20 PM (1).png` | `bear-zvezdice.png` |
| `…01_02_20 PM (2).png` | `bear-sit.png` |
| `…01_02_20 PM (3).png` | `bear-psic.png` |
| `…01_02_20 PM (4).png` | `bear-prsti.png` |
| `…01_02_20 PM (5).png` | `bear-daska.png` |
| `…01_02_21 PM (10).png` | `bear-linija.png` |
| `…01_02_21 PM (6).png` | `bear-lastavica.png` |
| `…01_02_21 PM (7).png` | `bear-macka.png` |
| `…01_02_21 PM (8).png` | `bear-leptiric.png` |
| `…01_02_21 PM (9).png` | `bear-spaga.png` |

### Rabbit
| Original | Now |
| --- | --- |
| `…11_35_03 AM (1).png` | `rabbit-zvezdice.png` |
| `…11_35_03 AM (2).png` | `rabbit-sit.png` |
| `…11_35_04 AM (3).png` | `rabbit-psic.png` |
| `…11_35_04 AM (4).png` | `rabbit-prsti.png` |
| `…11_35_04 AM (5).png` | `rabbit-daska.png` |
| `…11_35_05 AM (6).png` | `rabbit-kobra.png` |
| `…11_35_05 AM (7).png` | `rabbit-macka.png` |
| `…11_35_05 AM (8).png` | `rabbit-pretklon.png` |
| `…11_35_06 AM (10).png` | `rabbit-spava.png` |
| `…11_35_06 AM (9).png` | `rabbit-spaga.png` |
| `…11_42_20 AM (1).png` | `rabbit-lastavica.png` |
| `…11_42_21 AM (2).png` | `rabbit-noge.png` |
| `…11_42_21 AM (3).png` | `rabbit-cucanj.png` |
| `…11_42_21 AM (4).png` | `rabbit-dete.png` |
| `…11_42_22 AM (5).png` | `rabbit-happy.png` |
| `…11_42_22 AM (6).png` | `rabbit-sveca.png` |
| `…11_42_22 AM (7).png` | `rabbit-cuk.png` |
| `…11_42_23 AM (8).png` | `rabbit-extra-sedeci-raskorak.png` |
| `…11_42_23 AM (9).png` | `rabbit-extra-ravnoteza.png` |
| `…11_42_24 AM (10).png` | `rabbit-linija.png` |

### Fox
| Original | Now |
| --- | --- |
| `…12_48_29 PM (1).png` | `fox-zvezdice.png` |
| `…12_48_29 PM (2).png` | `fox-sit.png` |
| `…12_48_29 PM (3).png` | `fox-psic.png` |
| `…12_48_29 PM (4).png` | `fox-prsti.png` |
| `…12_48_29 PM (5).png` | `fox-daska.png` |
| `…12_48_29 PM (6).png` | `fox-lastavica.png` |
| `…12_48_30 PM (10).png` | `fox-spaga.png` |
| `…12_48_30 PM (7).png` | `fox-linija.png` |
| `…12_48_30 PM (8).png` | `fox-macka.png` |
| `…12_48_30 PM (9).png` | `fox-leptiric.png` |
| `…12_53_44 PM (1).png` | `fox-noge.png` |
| `…12_53_44 PM (2).png` | `fox-cucanj.png` |
| `…12_53_44 PM (3).png` | `fox-dete.png` |
| `…12_53_44 PM (4).png` | `fox-kobra.png` |
| `…12_53_44 PM (5).png` | `fox-happy.png` |
| `…12_53_44 PM (6).png` | `fox-sveca.png` |
| `…12_53_44 PM (7).png` | `fox-cuk.png` |
| `…12_53_44 PM (8).png` | `fox-iskorak.png` |
| `…12_53_44 PM (9).png` | `fox-spava.png` |
