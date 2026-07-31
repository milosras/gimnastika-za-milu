# What still needs generating

Round three. What arrived last time and what it fixed:

- **Fox `hero` and `portret`** — clean cutouts now. Fixed. ✅
- **Fox `kobra`, bear `kobra`, bear `daska`** — right pose, clean cutout. ✅
- Everything else in that batch came back as a pose the model already knew
  rather than the one asked for, so eleven of eighteen files were discarded.
  They are parked in `Mascots/<Species>/odbaceno/` if you want to look.

`sumnjive.jpg` next to this file shows the current state of the six poses that
have been trouble, one row per mascot.

## The one thing to change this time

Four poses have now failed twice from a text description: the **bridge**, the
**arabesque**, **walking a line** and **tiptoes**. The model substitutes a pose
it knows — usually a downward-dog or a one-leg balance.

**The rabbit has the bridge and the arabesque right.** So stop describing them
and show them instead: attach the rabbit's picture as a *pose* reference
alongside the character references, and say which is which. That is the whole
trick, and it is why the blocks below are one pose at a time rather than a
batch.

---

## 1. FOX — bridge

Attach **two** things: `Mascots/Rabbit/rabbit-mostic.png` (the pose) and
`Mascots/Fox/fox-sit.png` + `fox-zvezdice.png` (the character).

```
Two kinds of reference are attached. The FIRST image shows the POSE I want, on a different character. The OTHER images show the CHARACTER I want.

Draw the fox from the character references in exactly the pose of the first image: a gymnastics backbend bridge — lying face up, tummy pointing at the ceiling, body arched high off the floor, all four paws flat on the floor, head tilted back, seen from the side. Not a downward dog, not face down.

Keep her exact face, orange fur with the white muzzle and white-tipped tail, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge — no leftover patches, no halo, nothing behind her.
```

Save as `fox-mostic.png` (overwrite).

## 2. FOX — arabesque

Attach `Mascots/Rabbit/rabbit-arabeska.png` (pose) + `fox-sit.png`,
`fox-zvezdice.png` (character). Same wording, with the pose line:

```
Two kinds of reference are attached. The FIRST image shows the POSE I want, on a different character. The OTHER images show the CHARACTER I want.

Draw the fox from the character references in exactly the pose of the first image: an arabesque — balancing on one straight leg with the other leg stretched straight out BEHIND her at hip height, body tipped forward almost horizontal, both arms out to the sides. Not a leg lifted to the side, not standing upright.

Keep her exact face, orange fur with the white muzzle and white-tipped tail, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge — no leftover patches, no halo, nothing behind her.
```

Save as `fox-arabeska.png` (overwrite).

## 3. FOX — seated forward fold

No good reference exists for this one; the current file is her curled up asleep
and has the ragged cutout. Attach `fox-sit.png` and `fox-spaga.png`.

```
Using the attached reference images, draw the same fox cub character sitting upright on the floor with BOTH LEGS STRAIGHT OUT IN FRONT of her, eyes open and awake, folding forward from the hips with both paws reaching toward her toes, seen from the side. She is sitting up and bending forward — not lying down, not curled up, not asleep.

Keep her exact face, orange fur with the white muzzle and white-tipped tail, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge — no leftover patches, no halo, nothing behind her.
```

Save as `fox-pretklon.png` (overwrite).

---

## 4. BEAR — bridge

Attach `Mascots/Rabbit/rabbit-mostic.png` (pose) + `bear-sit.png`,
`bear-zvezdice.png` (character).

```
Two kinds of reference are attached. The FIRST image shows the POSE I want, on a different character. The OTHER images show the CHARACTER I want.

Draw the bear cub from the character references in exactly the pose of the first image: a gymnastics backbend bridge — lying face up, tummy pointing at the ceiling, body arched high off the floor, all four paws flat on the floor, head tilted back, seen from the side. Not a downward dog, not face down.

Keep her exact face, cream and beige fur, pink inner ears and paw pads, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge.
```

Save as `bear-mostic.png` (new).

## 5. BEAR — arabesque

Attach `Mascots/Rabbit/rabbit-arabeska.png` (pose) + `bear-sit.png`,
`bear-zvezdice.png` (character).

```
Two kinds of reference are attached. The FIRST image shows the POSE I want, on a different character. The OTHER images show the CHARACTER I want.

Draw the bear cub from the character references in exactly the pose of the first image: an arabesque — balancing on one straight leg with the other leg stretched straight out BEHIND her at hip height, body tipped forward almost horizontal, both arms out to the sides. Not a leg lifted to the side, not standing upright.

Keep her exact face, cream and beige fur, pink inner ears and paw pads, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge.
```

Save as `bear-arabeska.png` (overwrite).

## 6. BEAR — half squat

Attach `bear-sit.png`, `bear-zvezdice.png`.

```
Using the attached reference images, draw the same bear cub character standing in a HALF SQUAT: feet apart, knees clearly bent as if sitting on an invisible chair, back straight, and BOTH ARMS STRETCHED STRAIGHT FORWARD toward the camera at shoulder height, parallel to the floor. Arms forward, not up, not out to the sides.

Keep her exact face, cream and beige fur, pink inner ears and paw pads, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge.
```

Save as `bear-cucanj.png` (new).

---

## 7. Walking the line, and tiptoes — all three

These two have failed twice for every mascot, and there is no correct picture
anywhere to use as a pose reference. Right now `linija` and `prsti` are the same
one-leg balance in all three sets, which is the real problem — not that they are
imprecise, but that the two exercises look identical.

**My suggestion: fix only `linija`, and leave `prsti` alone.** A one-leg
balance is a perfectly reasonable picture for "balance on tiptoes" to a
seven-year-old; two identical pictures for two different exercises is what
looks wrong.

One prompt per mascot, swapping in that mascot's own description:

```
Using the attached reference images, draw the same character walking along a straight line marked on the floor, seen from the FRONT. Both feet are flat on the ground, one placed directly in front of the other, heel touching toe, both standing on the same straight line. Both arms are stretched out sideways at shoulder height for balance. She is looking down at the line, concentrating, with a small smile.

Both feet on the floor — this is walking, not balancing on one leg.

Keep her exact face, fur, purple bow and purple-and-pink sparkly leotard, same 3D Pixar style. Full body in frame, nothing cropped, generous margin. Fully transparent background with a clean edge.
```

Save as `rabbit-linija.png` / `fox-linija.png` / `bear-linija.png` (overwrite).

---

## Where everything stands

| | Poses | States | What is left |
| --- | --- | --- | --- |
| Rabbit | 19/19 | 5/5 | `linija` only, and only for the reason above |
| Fox | 19/19 | 5/5 | `mostic`, `arabeska`, `pretklon` — right pose in two of them, but ragged cutouts; plus `linija` |
| Bear | 17/19 | 5/5 | `mostic`, `cucanj` missing; `arabeska` wrong pose; plus `linija` |

Nothing here blocks anything: the app runs on all three mascots today, and the
bear's two missing poses fall back to the drawn figure.

## If a result still comes back wrong

- **Wrong pose again:** *"Look at the first reference image. Copy that exact
  body position. Only the character changes."*
- **A patch of background stuck to her:** *"Fully transparent background, clean
  edge around the fur, nothing behind the character."*
- **Cut off:** *"Zoom out — the whole body inside the frame with a margin."*

## When they arrive

Drop each into its mascot's folder under the name above, overwriting what is
there, and tell me. One command rebuilds what the app ships:

```bash
python3 tools/build-mascots.py
```
