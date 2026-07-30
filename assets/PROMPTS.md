# Image prompts for Lili

Three exercises already show a photo of Lili, cropped from the character sheet
you supplied (`assets/source/lili-sheet.png`):

| Exercise | File | From |
| --- | --- | --- |
| Psić | `lili-bridge.png` | downward-dog pose on the sheet |
| Špaga | `lili-split.jpg` | the hero pose |
| Streličar (arabeska) | `lili-scale.png` | standing leg-up pose |

The other **sixteen** exercises still fall back to the drawn figure. Below is a
prompt per exercise to generate the missing ones.

## How to use these

Generate one image per exercise. **Attach `assets/source/lili-sheet.png` as a
reference image every time** — that is what keeps her the same character rather
than sixteen different rabbits. Then paste the results back into the chat and
I'll crop, cut out and wire them in.

### The style block — put this in front of every prompt

> 3D Pixar-style cartoon rabbit character, same character as the reference
> image: light grey-lavender fur, large violet eyes with long lashes, small pink
> nose, long ears, purple glitter bow on the left ear, purple and pink
> gymnastics leotard with a heart on the chest and a rainbow swoosh. Full body
> visible, head to toe, nothing cropped. Soft studio lighting, flat pale pink
> background (#f7ecf7), no text, no logo, no props, no shadows on the
> background. Square image, character centred, generous margin on all sides.

### Then the pose line

| # | Exercise | Pose line to append |
| --- | --- | --- |
| 1 | Zvezdice u mestu | *doing a jumping jack, caught mid-air, arms stretched up in a V above her head, legs apart, happy open-mouth smile, front view* |
| 2 | Mačka–krava | *on all fours on a pink yoga mat, back arched upward like an angry cat, head tucked down, side view* |
| 3 | Leptirić | *sitting on a pink yoga mat, soles of her feet pressed together, knees dropped out to the sides, both paws holding her feet, smiling, front view* |
| 4 | Sedeći pretklon | *sitting on a pink yoga mat with both legs straight out in front, folding forward, paws reaching toward her toes, side view* |
| 5 | Kobra | *lying on her tummy on a pink yoga mat, chest lifted up on straight front paws, head up looking forward, back gently arched, side view* |
| 6 | Mostić | *in a gymnastics backbend bridge on a pink yoga mat, tummy facing up, arched high, all four paws on the floor, head hanging back, side view* |
| 7 | Hodanje po liniji | *walking heel-to-toe along a straight line on the floor, arms stretched out sideways for balance, concentrating happily, front view* |
| 8 | Ravnoteža na prstima | *standing tall on tiptoes, arms stretched out to the sides, balancing, chin up, front view* |
| 9 | Sveća | *shoulder stand on a pink yoga mat, lying on her upper back with both legs pointing straight up, paws supporting her hips, side view* |
| 10 | Daska | *forearm plank on a pink yoga mat, body in one straight line from head to heels, looking forward, side view* |
| 11 | Podigni noge | *lying on her back on a pink yoga mat, both legs raised straight up to ninety degrees, paws flat beside her hips, side view* |
| 12 | Ćuk (držanje) | *balancing on her bottom in a tuck, knees hugged to her chest, paws around her shins, feet lifted off the floor, side view* |
| 13 | Lastavica na podu | *lying on her tummy on a pink yoga mat, arms stretched forward and legs lifted off the floor at the same time, like flying, side view* |
| 14 | Polučučanj + ruke napred | *in a half squat, knees bent, both arms stretched straight forward at shoulder height, front view* |
| 15 | Iskorak | *in a forward lunge, one leg bent in front, back knee lowered toward the floor, paws on her hips, side view* |
| 16 | Dete poza | *child's pose on a pink yoga mat, kneeling and sitting back on her heels, forehead down, arms stretched forward on the floor, side view, peaceful expression* |

## Dropping them in

Save each as `www/img/lili-<id>.png` using the exercise's id, then add one field
to that exercise in `www/app.js`:

```js
{ id: "kobra", …, img: "lili-kobra.png",
```

The ids, in the order of the table above: `zvezdice`, `macka`, `leptiric`,
`pretklon`, `kobra`, `mostic`, `linija`, `prsti`, `sveca`, `daska`, `noge`,
`cuk`, `lastavica`, `cucanj`, `iskorak`, `dete`.

Anything without an `img` keeps drawing the fallback figure, so they can arrive
a few at a time — nothing breaks in between.

Also remember to add the new files to `ASSETS` in `www/sw.js` and bump `CACHE`,
or installed iPads will keep serving the old set.

## If you'd rather generate one sheet

A single image with several poses laid out on a flat background works too — that
is exactly what the original sheet was, and `tools/crop-lili.py` exists to cut
poses out of it. Ask for *"one image, N poses of the same character, evenly
spaced on a flat pale pink background, no overlap, no text"*, and I'll add the
crop boxes to the script.
