# Orzentia — RPG Mechanics Research & Implementation Plan

*Research date: 2026-03-08*

---

## 1. Current State Snapshot

| System | Status | Notes |
|---|---|---|
| Player movement | ✅ Working | Arrow keys, 4-direction |
| Terrain collision | ✅ Working | 48×48 tile map |
| Fireball spell | ✅ Working | Projectile, 5 damage |
| Enemy (Red Slime) | ✅ Working | Aggressive AI, AABB collision |
| Pause/GameOver menus | ✅ Working | Cursor navigation |
| Light attack (Z) | ❌ Stubbed | No implementation |
| Heavy attack (X) | ❌ Stubbed | No implementation |
| Interact (F) | ❌ Stubbed | No implementation |
| Equipment | ❌ Stubbed | Slots exist, no logic |
| Inventory | ❌ Stubbed | Array exists, no UI |
| Experience / Leveling | ❌ Stubbed | Field exists, no formula |
| Enemy spawning | ⚠️ Partial | Must be called manually |
| Line of sight | ⚠️ Partial | Always-detect placeholder |
| Main menu display | ❌ Empty | Render function is blank |

---

## 2. Core RPG Mechanic Pillars

Classic action-RPG design breaks into five interconnected pillars. All five apply directly to Orzentia:

```
Combat ──► Progression ──► Exploration ──► Economy ──► Narrative
  ▲              │              │              │
  └──────────────┴──────────────┴──────────────┘
                 (feeds back into Combat)
```

Each pillar is described below with Orzentia-specific context and a prioritised implementation order.

---

## 3. Pillar 1 — Combat

### 3a. Melee Attacks (Z = Light, X = Heavy)

**How classic action-RPGs handle this:**
- Light attack: fast, low damage, short range, short cooldown (~10–15 frames at 30 FPS)
- Heavy attack: slow, high damage, wider hitbox, longer cooldown (~40–60 frames)
- Both attacks create a *hitbox* — a temporary rectangular area that deals damage to any enemy overlapping it during the active frames
- Hitboxes are separate from the projectile system; they appear for 5–10 frames and disappear

**Orzentia implementation plan:**

```
Attack Object (in activeAttacks):
{
    type: "melee",
    subtype: "light" | "heavy",
    damage: Number,
    location: { x, y },      // world coords relative to player
    width: Number,            // wider for heavy
    height: Number,
    orientation: "N"|"S"|"E"|"W",
    activeFrames: Number,     // countdown: attack exists until 0
    alreadyHit: []            // enemy indices already struck (prevents multi-hit)
}
```

Steps:
1. Add `playerCooldownFrames` to `GameState.newStateTemplate.player` (countdown timer)
2. In `GameState.js`, add `playerActions.lightAttack()` and `playerActions.heavyAttack()`
   - Check cooldown is 0 before allowing attack
   - Push a melee attack object to `activeAttacks`
   - Set cooldown (e.g. 20 frames light, 50 frames heavy)
3. In `GameState.updateActiveAttack()`, add handling for `type === "melee"`:
   - Decrement `activeFrames`; despawn when 0
   - Check collision against all enemies (reuse `checkAttackEnemyCollision`)
   - Skip enemies already in `alreadyHit`
4. In `Game.js`, wire Z/X keydown to call the appropriate action
5. In `SceneManager.js`, render the attack arc:
   - Draw a semi-transparent rectangle/arc in front of the player
   - Only visible while `activeFrames > 0`

**Stat relationships:**
- `player.strength` (add this) multiplies damage: `damage = weapon.baseDamage * player.strength`
- Heavy attack = 2–3× light damage, 2.5× wider hitbox

### 3b. Invulnerability / Hit Stun

Already implemented (40 iframes). No changes needed for core loop; can tune later.

### 3c. Enemy Combat Improvements

Current enemies only contact-damage the player. Missing:
- **Enemy attacks**: enemies should have their own attack animations/hitboxes at range
- **Enemy cooldowns**: prevent enemies from dealing continuous damage more than once per second

Near-term: add `enemy.attackCooldownFrames` (count down each frame; deal damage only when 0, then reset).
This prevents rapid-fire damage from a single overlapping enemy — currently `strength` damage is applied every frame the enemy touches the player.

---

## 4. Pillar 2 — Progression

### 4a. Experience & Leveling

**Classic formula (simple exponential curve):**
```
experienceToNextLevel(level) = 100 * (level ^ 1.5)
```

| Level | XP Required | Total XP |
|---|---|---|
| 1→2 | 100 | 100 |
| 2→3 | 283 | 383 |
| 3→4 | 520 | 903 |
| 4→5 | 800 | 1703 |
| 5→6 | 1118 | 2821 |

**Orzentia implementation plan:**
1. Add `GameState.getExperienceToNextLevel(level)` utility:
   ```js
   GameState.getExperienceToNextLevel = function(level) {
       return Math.floor(100 * Math.pow(level, 1.5));
   };
   ```
2. In `GameState.calculateEnemyDamage()` (after enemy despawn), add:
   ```js
   player.experience += enemy.experienceYield;
   GameState.checkLevelUp();
   ```
3. Add `GameState.checkLevelUp()`:
   - Compare `player.experience` to `getExperienceToNextLevel(player.level)`
   - If ≥ threshold: increment `player.level`, subtract threshold from `experience`, boost stats
4. Level-up stat boosts (example values):
   - `player.health += 2` (max health, requires adding `maxHealth` field)
   - `player.strength += 1`
   - Future: magic power, speed, defense

### 4b. Max Health vs Current Health

Currently `health: 5` is both max and current. Needs splitting:
```js
player: {
    maxHealth: 5,
    health: 5,   // current
    ...
}
```
On level-up: `maxHealth += 2`, `health = Math.min(health + 2, maxHealth)`.
HUD rendering in `SceneManager.js` should show `health / maxHealth`.

### 4c. Stats to Add

| Stat | Purpose | Initial Value |
|---|---|---|
| `strength` | Melee damage multiplier | 1 |
| `defense` | Reduce incoming damage | 0 |
| `magicPower` | Spell damage multiplier | 1 |
| `maxHealth` | HP ceiling | 5 |
| `playerCooldownFrames` | Attack cooldown timer | 0 |

These all live on `GameState.newStateTemplate.player`. Defense would modify `calculatePlayerDamage`:
```js
var damage = Math.max(0, enemy.strength - player.defense);
```

---

## 5. Pillar 3 — Exploration

### 5a. Enemy Spawning System

Currently enemies must be manually pushed into `spawnedEnemies`. A spawn system is needed for exploration to feel alive.

**Design options:**
1. **Zone-based spawning**: define spawn zones as tile regions; spawn N enemies of type T when player enters the zone
2. **Timer-based respawn**: enemies respawn 30 seconds after death if player is far enough away
3. **Encounter triggers**: walking over specific tile coordinates spawns a scripted encounter

**Recommended approach (simplest, fits the architecture):**
- Add `GameState.spawnZones` array to `newStateTemplate`
- Each zone: `{ x, y, width, height, enemyType, maxCount, respawnFrames }`
- Each game loop frame, check if player is in a zone and zone is under `maxCount`
- Spawn if conditions met

### 5b. Line of Sight (LOS)

`checkEnemyDetectsPlayer` currently always returns `true`. Real LOS would:
1. Cast a ray from enemy center to player center
2. Sample tile IDs along the ray (Bresenham's line algorithm)
3. Return `false` if any collision tile (ID 1053) is encountered

This makes the world feel more genuine — enemies around corners shouldn't see you.

**Bresenham's line implementation is ~20 lines** and fits neatly in `GameState.js`.

### 5c. Multiple Map Rooms / Transitions

Currently there is one 48×48 world. Classic action-RPGs have multiple rooms/areas.
This is more complex to add — requires:
- Multiple `.tmj` files
- Transition trigger tiles
- `SceneManager` scene-loading logic
- State persistence between rooms

**Defer this to a later phase.** Focus on enriching the existing map first.

---

## 6. Pillar 4 — Economy

### 6a. Currency

`player.currency` exists but has no way to earn or spend it.
**Earn**: enemies drop currency on death (`enemy.currencyYield`)
**Spend**: requires a shop NPC and Interact system (F key)

### 6b. Equipment & Items

Equipment slots exist (`weapon, head, chest, legs, feet`) but no items do.
Each item should be a plain object:
```js
{
    name: "Iron Sword",
    type: "weapon",
    baseDamage: 3,
    sprite: "iron_sword.png"
}
```

Items would be placed in `player.inventory[]` when picked up, equipped via menus.
This requires:
1. Inventory menu rendering in `SceneManager.js`
2. Item pickup (collision with world objects)
3. Equipment logic (stat recalculation on equip/unequip)

---

## 7. Pillar 5 — Narrative

### 7a. Interact System (F key)

NPCs, chests, doors, and signs all use the Interact key. Current stub in `Game.js` does nothing.

**Implementation plan:**
1. Define NPC/interactable objects (same pattern as enemies):
   ```js
   { name, location, width, height, dialogueLines: [] }
   ```
2. On F keydown: find any interactable within N pixels of player
3. If found: push a dialogue scene onto the scene stack
4. Dialogue renders one line at a time; F or Enter advances to next line

### 7b. Dialogue System

A minimal dialogue system:
- Array of strings per NPC
- `DialogueState.currentLine` index
- Rendered as a text box at bottom of screen (similar to pause menu rendering)
- Advance with Enter; close on last line

---

## 8. Recommended Implementation Order

### Phase 1 — Core Combat (Highest Value, Self-Contained)
*Estimated scope: medium*

| Priority | Feature | File(s) |
|---|---|---|
| 1 | Split `health` → `maxHealth + health` | `GameState.js` |
| 2 | Add `strength`, `defense`, `magicPower` to player template | `GameState.js` |
| 3 | Add enemy attack cooldown (prevent per-frame damage) | `GameState.js` |
| 4 | Light melee attack (Z key) with hitbox | `GameState.js`, `Game.js`, `SceneManager.js` |
| 5 | Heavy melee attack (X key) with wider hitbox | `GameState.js`, `Game.js`, `SceneManager.js` |
| 6 | Attack cooldown for player | `GameState.js` |
| 7 | Unit tests for melee attack system | `tests/gamestate.test.js` |

### Phase 2 — Progression
*Depends on Phase 1 stats*

| Priority | Feature | File(s) |
|---|---|---|
| 1 | `getExperienceToNextLevel()` formula | `GameState.js` |
| 2 | `checkLevelUp()` with stat boosts | `GameState.js` |
| 3 | HUD: health bar + XP bar + level display | `SceneManager.js` |
| 4 | Level-up visual feedback (brief flash/text) | `SceneManager.js` |
| 5 | Unit tests for leveling formula | `tests/gamestate.test.js` |

### Phase 3 — Exploration
*Depends on Phase 2*

| Priority | Feature | File(s) |
|---|---|---|
| 1 | Enemy attack cooldown frames | `GameState.js` |
| 2 | Zone-based enemy spawn system | `GameState.js` |
| 3 | Bresenham LOS for enemy detection | `GameState.js` |
| 4 | Enemy variety (add 1–2 new enemy types) | `GameState.js`, `index.html`, assets |
| 5 | Currency drop on enemy death | `GameState.js` |

### Phase 4 — Economy & UI
*Depends on Phases 1–3*

| Priority | Feature | File(s) |
|---|---|---|
| 1 | Inventory data model + rendering | `GameState.js`, `SceneManager.js`, `GUI.js` |
| 2 | Character/stats screen | `SceneManager.js`, `GUI.js` |
| 3 | Main menu display (currently empty) | `SceneManager.js` |
| 4 | Interact (F key) + interactable objects | `GameState.js`, `Game.js` |
| 5 | Basic NPC + dialogue system | `GameState.js`, `SceneManager.js` |
| 6 | Equipment equip/unequip with stat recalc | `GameState.js` |

### Phase 5 — Polish
*After core systems are solid*

- Sound effects (Web Audio API)
- Additional spell types (ice, lightning)
- Save system (localStorage)
- Multiple map zones / transitions
- Enemy special abilities
- Boss encounter

---

## 9. Key Design Decisions

### Decision 1: Melee Hitbox Shape
- **Option A**: Rectangular hitbox directly in front of player (simple, fast)
- **Option B**: Arc/cone shape (more realistic, slightly more complex math)
- **Recommendation**: Start with Option A (rectangle), upgrade to arc if it feels bad

### Decision 2: Experience Curve
- Exponential (`100 * level^1.5`) is classic and works well for 10–20 levels
- Can tune exponent (1.2 = shallower, 2.0 = steeper) based on play-testing

### Decision 3: Damage Model
- **Simple**: `damage = attack.damage - player.defense`
- **Percentage**: `damage = attack.damage * (1 - player.defense / 100)`
- **Recommendation**: Simple subtraction is more predictable; use integer stats

### Decision 4: Enemy Attack Range
- Currently enemies only damage by overlap
- Adding ranged attacks (enemy projectiles) would increase challenge but adds complexity
- **Recommendation**: Phase 1 adds attack cooldown (fixes damage frequency); Phase 3 adds ranged enemies

---

## 10. Architecture Notes for New Features

All new code must follow existing patterns:

```js
// Adding a new function to GameState:
GameState.newFunction = function(arg) {
    var state = GameState.currentState;
    // logic here
};

// Adding new player state:
// 1. Add to newStateTemplate.player in GameState.js
// 2. Access via GameState.currentState.player.newField

// Adding new rendering:
// 1. Add render function to SceneManager (e.g. SceneManager.renderMeleeAttack)
// 2. Call it from SceneManager.renderScene() or the appropriate render loop
// 3. Never use ES6 classes, modules, or import/require
```

Tests use `vm` sandbox — any new `GameState` function is accessible as `ctx.GameState.newFunction()` in tests.

---

## 11. Immediate Next Steps

The three highest-value, lowest-risk changes to start:

1. **Fix per-frame enemy damage** — add `attackCooldownFrames` to enemy; deal damage at most once per second. This immediately improves game feel with ~10 lines of code.

2. **Implement Light Attack (Z)** — creates a melee hitbox, the core combat missing piece. About 50 lines across 3 files plus tests.

3. **Implement Experience → Level Up** — adds the core progression loop. About 30 lines in `GameState.js`.

These three can be done independently and each adds clear, demonstrable value.
