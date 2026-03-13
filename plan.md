# Plan: Programmatic Character Sprites + Configurable NPC Appearances

## Goal
Replace the image-based player sprite and placeholder NPC coloured rectangles with a
programmatic pixel-art rendering system. Characters are drawn at **16 × 24 native pixels**
scaled 2.5× to **40 × 60 rendered pixels** — matching the tileset's 16 px native grid
(40 px per rendered tile). Each NPC gets a data-driven appearance configuration that mixes
and matches body type, hair style, clothing style, and colours.

---

## Configurable Appearance Properties

```js
appearance: {
    base:           "male" | "female",          // 2 body variants
    hairStyle:      "short" | "long" | "bald",  // 3 hair styles
    clothing:       "tunic" | "robe" | "armor", // 3 clothing styles
    skinColor:      "#RRGGBB",
    hairColor:      "#RRGGBB",
    clothingColor:  "#RRGGBB",
    pantsColor:     "#RRGGBB",
    shoeColor:      "#RRGGBB"
}
```

---

## File Changes

### 1. New file — `engine/CharacterSprites.js`

Inserted in `index.html` between `GUI.js` and `SceneManager.js`.

**Constants**
- `CharacterSprites.VALID_BASES = ["male", "female"]`
- `CharacterSprites.VALID_HAIR_STYLES = ["short", "long", "bald"]`
- `CharacterSprites.VALID_CLOTHING_STYLES = ["tunic", "robe", "armor"]`
- `CharacterSprites.CHAR_NATIVE_WIDTH = 16`
- `CharacterSprites.CHAR_NATIVE_HEIGHT = 24`
- `CharacterSprites.SCALE = 2.5`  → rendered 40 × 60 px

**Pixel-art frame data**
16 × 24 string arrays (one char = one native pixel) for four directions:
- `FRAMES_SOUTH` — 4 walk frames (front view, most detailed)
- `FRAMES_NORTH` — 4 walk frames (back view, hair/no-face)
- `FRAMES_EAST`  — 4 walk frames (side profile)
- West is rendered by mirroring East horizontally at draw time

Colour-slot characters used in the strings:
| Char | Slot          |
|------|---------------|
| `.`  | transparent   |
| `S`  | skin          |
| `s`  | skin shadow   |
| `H`  | hair          |
| `h`  | hair dark     |
| `E`  | eye           |
| `C`  | clothing      |
| `c`  | clothing dark |
| `L`  | pants         |
| `l`  | pants dark    |
| `F`  | shoe          |
| `B`  | belt          |

**Hair-style overlays** — `HAIR_SOUTH_SHORT/LONG/BALD`, same for N/E
- Each is a 16 × 24 boolean/char mask that replaces `H`/`h` pixels
- Short: 2-row cap on top of head
- Long: extends 3 rows below the shoulders
- Bald: removes all hair pixels (skin coloured instead)

**Clothing overlays** — `CLOTHING_SOUTH_TUNIC/ROBE/ARMOR`, same for N/E
- Tunic: standard torso rectangle
- Robe: extends hem down to row 20 (overlaps leg area), removes pants
- Armor: adds 2-pixel pauldrons extending beyond shoulder width, belt detail

**Female body variant** — slight differences from male base:
- Rows 8–11 (torso): 1 px narrower at shoulders, 1 px wider at hips (rows 12–13)
- Applied by selecting the appropriate base frames from `FRAMES_SOUTH_FEMALE` etc.

**`CharacterSprites.renderCharacter(ctx, x, y, appearance, direction, walkFrame)`**
1. Choose the correct direction frame set (SOUTH/NORTH/EAST/WEST)
2. Select the walk frame (0–3)
3. Apply hair-style overlay (replace H/h slots with style geometry)
4. Apply clothing overlay (replace C/c/L/l/F slots with clothing geometry)
5. Map each non-`.` character to its colour from `appearance`
6. Draw each pixel as `fillRect(x + col*2.5, y + row*2.5, 2.5, 2.5)`
7. For West: iterate columns right-to-left to mirror East data

**`CharacterSprites.isValidAppearance(appearance)`**
Returns `true` when all required keys are present and enum values are valid.

---

### 2. `engine/GameState.js`

**Player template** — add `appearance` to `newStateTemplate.player`:
```js
"appearance": {
    "base": "male",
    "hairStyle": "short",
    "hairColor": "#3D2B1F",
    "clothing": "tunic",
    "clothingColor": "#5B7A4E",
    "pantsColor": "#3A3028",
    "skinColor": "#F4C4A1",
    "shoeColor": "#2A1A10"
}
```
Also update `"width": 40, "height": 60` (was 22, 32) in the player template.

**NPC `exampleNpc`** — add `"appearance"` field with defaults.

**Village NPC definitions** — add unique `appearance` to each, using the existing
`spriteColor` as a guide for `clothingColor`:

| NPC       | base   | hair  | clothing | hairColor | clothingColor |
|-----------|--------|-------|----------|-----------|---------------|
| Edren     | male   | short | armor    | #5C3A1E   | #7A5C3A       |
| Sela      | female | long  | robe     | #1A1A2E   | #7a9fc4       |
| Old Brenn | male   | bald  | tunic    | —         | #9e8b6f       |
| Maret     | female | long  | tunic    | #2E5C1A   | #7dbb8a       |
| Kael      | male   | short | armor    | #2A1A3E   | #b07ab0       |
| Squink    | male   | bald  | robe     | —         | #4da89e       |

Also update each NPC's `"width": 40, "height": 60`.

---

### 3. `engine/SceneManager.js`

**Constants** (lines 37–40):
```js
SceneManager.PLAYER_WIDTH        = 40;   // was 22  (= 16 * 2.5)
SceneManager.PLAYER_HEIGHT       = 60;   // was 32  (= 24 * 2.5)
SceneManager.PLAYER_SPRITE_WIDTH = 16;   // native pixels
SceneManager.PLAYER_SPRITE_HEIGHT = 24;  // native pixels
```

**`loadPlayer()`** — replace `drawImage` call with:
```js
var dir = SceneManager.determinePlayerDirection();
CharacterSprites.renderCharacter(
    this.canvasCtx,
    x + xOffset,
    y - yOffset,
    GameState.currentState.player.appearance,
    dir,
    walkFrame   // derived from cycleLoop[cycleLoopIndex]
);
```
Add new helper `SceneManager.determinePlayerDirection()` (extracts direction string
from `activeKeys`/`player.orientation`; extracted from existing
`determineActivePlayerSprite` logic).

**`renderNpcs()`** — replace `fillRect` placeholder with:
```js
CharacterSprites.renderCharacter(
    this.canvasCtx,
    npc.location.x,
    npc.location.y,
    npc.appearance,
    "S",   // NPCs face south (front) while idle
    0      // idle frame
);
```
Keep the name label and `[F]` prompt drawing unchanged.

Remove `SceneManager.playerSpritesheet` reference (line 33) since rendering is now
programmatic. Keep the `<img id="player-sprites">` in `index.html` for now (no-op).

---

### 4. `index.html`

Add script tag in the correct load order:
```html
<script src="./engine/GUI.js"></script>
<script src="./engine/CharacterSprites.js"></script>   <!-- NEW -->
<script src="./engine/SceneManager.js"></script>
```

---

### 5. `tests/charactersprites.test.js` (new)

Using `node:test` + the existing VM sandbox helper.

Tests:
- `VALID_BASES`, `VALID_HAIR_STYLES`, `VALID_CLOTHING_STYLES` arrays have correct values
- `isValidAppearance()` returns `true` for a fully valid appearance object
- `isValidAppearance()` returns `false` when `base`/`hairStyle`/`clothing` are invalid strings
- `isValidAppearance()` returns `false` when required keys are missing
- Player template's `appearance` passes `isValidAppearance()`
- All 6 village NPC definitions have appearances that pass `isValidAppearance()`
- `CHAR_NATIVE_WIDTH * SCALE === 40` and `CHAR_NATIVE_HEIGHT * SCALE === 60`

Add the new file to `package.json`'s `test:unit` script list.

---

## Sprite Art Design Reference

Each frame is 16 chars wide × 24 chars tall. Example front-facing idle frame
(base layout, before hair/clothing overlay):

```
Row  0: "....HHHHHHHH...."   hair top (cols 4–11)
Row  1: "...hHHHHHHHHh..."   hair with dark edge
Row  2: "....SSSSSSSS...."   forehead
Row  3: "....SEESSEES...."   eyes
Row  4: "....SSSSSSSS...."   nose
Row  5: "....SSSsSSSS...."   mouth (s = skin dark)
Row  6: ".....SSSSSS....."   chin
Row  7: "....CCCSSCCC...."   collar with neck gap
Row  8: "...CCCCCCCCCC..."   upper chest (10 px wide)
Row  9: "...CCCCCCCCCC..."   chest
Row 10: "...CCCCCCCCCC..."   torso
Row 11: "...CCCCCCCCCC..."   lower torso
Row 12: "....CCCCCCCC...."   waist
Row 13: "....BBBBBBBB...."   belt
Row 14: "....LLLL.LLL...."   legs (gap at col 8)
Row 15: "....LLLL.LLL...."
Row 16: "....LLLL.LLL...."
Row 17: "....LLLL.LLL...."
Row 18: "....llll.lll...."   leg shadow
Row 19: "....FFFF.FFF...."   shoes
Row 20: "....FFFF.FFF...."
Row 21: "................"
Row 22: "................"
Row 23: "................"
```

Walk animation frames vary rows 14–20 (leg swing) and arm position in rows 8–11.
North-facing frames: no face, hair fills more of head, clothing back detail.
East/West frames: side profile — one eye visible, body 8 px wide instead of 10.

---

## Testing Checklist

- [ ] `npm run test:unit` passes with `# fail 0`
- [ ] Player appears centered, roughly 1 tile wide and 1.5 tiles tall
- [ ] Walk animation plays in all 4 directions
- [ ] NPCs visible as pixel-art characters with distinct looks
- [ ] NPC name labels and `[F]` prompts still appear correctly
- [ ] Interaction range still functional
- [ ] Dialogue box still renders correctly
- [ ] Pause menu / game-over screen unaffected
