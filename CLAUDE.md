# CLAUDE.md — Orzentia Codebase Guide

This file provides context for AI assistants working in this repository.

---

## Project Overview

**Orzentia** is a browser-based 2D RPG built with vanilla JavaScript, HTML5 Canvas, and CSS3. There are no external runtime dependencies, no build tools, and no package manager. Open `index.html` directly in a browser to run the game.

---

## Repository Structure

```
Orzentia/
├── index.html              # Entry point — loads all scripts and hidden sprite images
├── index.js                # Bootstrap — calls Game.start()
├── styles.css              # Global styles (canvas centering, custom font)
├── package.json            # npm scripts for unit and e2e tests (no runtime deps)
├── playwright.config.js    # Playwright e2e configuration
├── engine/                 # Core game systems (one file per system)
│   ├── Game.js             # Input handling, game loop entry, collision map data
│   ├── GameState.js        # All runtime state (player, enemies, attacks, menus)
│   ├── SceneManager.js     # Rendering, animation, camera, viewport
│   └── GUI.js              # Static menu/UI definitions
├── tests/
│   ├── helpers/
│   │   └── setup.js        # VM sandbox + browser mock loader (unit tests)
│   ├── game.test.js        # Unit tests — Game module
│   ├── gamestate.test.js   # Unit tests — GameState module
│   ├── scenemanager.test.js # Unit tests — SceneManager module
│   └── e2e/
│       └── gameplay.test.js # End-to-end tests (Playwright, real browser)
└── assets/
    ├── OrzentiaOverworld.png         # Tileset image
    ├── OrzentiaOverworldData.tmj     # Tiled map file (48×48 grid)
    ├── spells/fireball/              # Fireball sprite frames
    ├── spritesheets/                 # Player, enemy, and tile sprites
    └── typography/jgs-main/         # JGS pixel font (TTF/WOFF variants)
```

---

## Technology Stack

| Concern       | Technology                          |
|---------------|-------------------------------------|
| Language      | Vanilla JavaScript (ES5 style)      |
| Rendering     | HTML5 Canvas 2D API                 |
| Markup        | HTML5                               |
| Styling       | CSS3                                |
| Maps          | Tiled Map Editor (.tmj JSON format) |
| Fonts         | JGS pixel font (custom bitmap)      |
| Build tools   | None                                |
| Package mgr   | npm (test scripts only, no runtime deps) |
| Unit tests    | Node.js built-in (`node:test`)      |
| E2E tests     | Playwright 1.56 (global install)    |
| CI/CD         | None                                |

---

## Architecture

The codebase uses a **namespace/module-object pattern** — each file exposes a single global object containing all related functions and data. There are no ES modules, classes, or `import`/`require` statements.

### Script Load Order (defined in `index.html`)
1. `engine/GameState.js`
2. `engine/GUI.js`
3. `engine/SceneManager.js`
4. `engine/Game.js`
5. `index.js`

Later scripts depend on earlier ones, so this order must be maintained.

### Module Responsibilities

#### `Game` (`engine/Game.js`)
- `Game.start()` — initializes a new game from the state template and starts the loop
- Registers `keydown`/`keyup` event listeners and routes input to `GameState`
- Holds the **collision map** — a 48×48 flat array of tile IDs used for terrain collision
- Provides `Game.distanceBetweenPoints(a, b)` utility

#### `GameState` (`engine/GameState.js`)
- `GameState.currentState` — the live game instance (cloned from `newStateTemplate` on start)
- `GameState.newStateTemplate` — template object for fresh game state
- `GameState.exampleEnemy` — template for spawning enemies
- Handles: player movement, enemy AI, projectile/attack lifecycle, collision detection, menu transitions, invulnerability frames

#### `SceneManager` (`engine/SceneManager.js`)
- Manages the `<canvas>` (500×500 px) and the `requestAnimationFrame` loop at ~30 FPS
- Constants: `CANVAS_WIDTH/HEIGHT = 500`, `MAP_WIDTH/HEIGHT = 48`, `TILE_WIDTH/HEIGHT = 40`, `FPS = 30`
- Renders: tilemap, player sprite, enemies, projectiles, UI menus
- Maintains a **scene stack** — push/pop scenes to layer rendering
- Camera offset: `canvasStartXOffset = -440`, `canvasStartYOffset = -1120`

#### `GUI` (`engine/GUI.js`)
- Pure data — defines menu configs (pause, main, game-over) with labels and styling
- References the JGS-7 pixel font and black/white color scheme

---

## Key Data Models

### Player (inside `GameState.currentState.player`)
```js
{
  health: Number,
  level: Number,
  experience: Number,
  currency: Number,
  inventory: [],
  equipment: { weapon, head, chest, legs, feet },
  location: { x, y },
  orientation: "N" | "S" | "E" | "W",
  rotation: Number,         // numeric equivalent for rendering
  speed: 5,
  invulnerabilityFrames: Number,
  incarnate: { fire: { ... } }  // spell object
}
```

### Enemy (based on `GameState.exampleEnemy`)
```js
{
  name: String,
  type: String,
  health: Number,
  experienceYield: Number,
  spritesheet: String,      // path to asset
  spriteIndex: Number,
  movementType: "aggressive" | "idle" | "erratic" | "custom",
  detectsPlayer: Boolean,
  speed: Number,
  detectionRange: Number,
  location: { x, y },
  dimensions: { width, height },
  strength: Number
}
```

### Active Attack
```js
{
  type: String,
  damage: Number,
  location: { x, y },
  direction: String,
  sprite: { ... },          // animation frame tracking
}
```

### Game State Flags (on `GameState.currentState`)
```js
{
  isActive: Boolean,
  isPaused: Boolean,
  isGameOver: Boolean,
  activeMenu: Object | null,
  spawnedEnemies: [],
  activeAttacks: [],
  activeKeys: []            // input buffer
}
```

---

## Input System

Input is tracked via an `activeKeys` array on the game state (acts as an input buffer). Keyboard bindings:

| Key           | Action                  | Status        |
|---------------|-------------------------|---------------|
| Arrow keys    | Move player             | Implemented   |
| C             | Cast magic (fireball)   | Implemented   |
| Enter         | Pause / unpause         | Implemented   |
| Z             | Light attack            | Not yet impl. |
| X             | Heavy attack            | Not yet impl. |
| F             | Interact                | Not yet impl. |

---

## Tilemap System

- Map: 48×48 tiles, each 40×40 px (16 px native × 2.5 scale)
- Source file: `assets/OrzentiaOverworldData.tmj` (Tiled JSON format)
- Collision data is a flat 2304-element array in `Game.js`
- Tile IDs: `1` = walkable, `406` = terrain, `1053` = collision tile

---

## Sprite & Animation System

- Player: 4-frame walk cycle, directional (N/S/E/W), spritesheet rows per direction
- Enemies: slime, Darwin, WalrusKnight variants with their own spritesheets
- Projectiles: fireball frames in `assets/spells/fireball/`
- All sprite image elements are preloaded as hidden `<img>` tags in `index.html`

---

## Naming Conventions

| Element              | Convention        | Example                          |
|----------------------|-------------------|----------------------------------|
| Variables/functions  | camelCase         | `currentState`, `distanceBetweenPoints` |
| Namespace objects    | PascalCase        | `Game`, `GameState`, `SceneManager` |
| Constants            | UPPER_SNAKE_CASE  | `CANVAS_WIDTH`, `TILE_WIDTH`     |
| Asset files          | kebab-case / descriptive | `slime_monster_spritesheet.png` |

---

## Development Workflow

### Running the Game
1. Open `index.html` in a modern browser (Chrome/Firefox recommended)
2. No server required for basic play, but a local HTTP server avoids CORS issues with assets:
   ```
   python3 -m http.server 8080
   # then open http://localhost:8080
   ```

### Running the Tests

**All tests (unit + e2e):**
```bash
npm test
```

**Unit tests only** (fast, no browser needed):
```bash
npm run test:unit
```

**E2E tests only** (requires Chromium, spins up `http-server`):
```bash
npm run test:e2e
```

#### Unit test details
Requires Node.js 18+. Uses the built-in `node:test` module — no `npm install` needed.
```
tests/game.test.js          — Game.getDistanceBetweenPoints (7 tests)
tests/gamestate.test.js     — collision, damage, spawn/despawn, pause, AI (38 tests)
tests/scenemanager.test.js  — SceneManager.getTrueLocation (9 tests)
```
Output is TAP format. A passing run ends with `# fail 0`.

#### E2E test details
Uses Playwright 1.56 (globally installed at `/opt/node22/lib/node_modules/playwright`) with the Chromium browser at `~/.cache/ms-playwright/`. Tests run headless. `http-server` serves the game on port 8181 automatically.
```
tests/e2e/gameplay.test.js  — canvas, initial state, movement, orientation,
                               pause/unpause, magic cast, game over (31 tests)
```
Config lives in `playwright.config.js`. The npm script sets `NODE_PATH=/opt/node22/lib/node_modules` so Playwright can be resolved without a local install.

### How the Unit Test Suite Works

The engine files were written for the browser (global namespace, DOM APIs). To test them in Node.js, `tests/helpers/setup.js` uses the `vm` module to:
1. Mock browser globals (`document`, `window`, `Image`, `requestAnimationFrame`) in an isolated context
2. Load the engine files in dependency order so their `var` declarations become sandbox properties
3. Reset all mutable state after loading

Each test file calls `loadEngine()` in `beforeEach` to get a fresh, isolated engine instance. Use `makeGameState()` and `makeEnemy()` helpers from `setup.js` to construct test fixtures.

**Important:** Objects returned from functions that run inside the VM sandbox have a different `Object` prototype than the outer test context. Use `assert.strictEqual(result.x, value)` (per-property) instead of `assert.deepStrictEqual(result, { x: value })` for objects returned by engine functions.

### How the E2E Test Suite Works

E2E tests load the real game in a headless Chromium browser and interact with it via Playwright. Game state is inspected with `page.evaluate(() => GameState.currentState.*)` — the globals are accessible because the engine files run in the browser's global scope.

**Key timing rules for e2e tests:**
- The game loop runs at 30 FPS (~33 ms/frame). After any input, wait at least 100 ms for the loop to process it.
- Arrow keys and `c` are removed from `activeKeys` on `keyup`, so they must be held with `keyboard.down()` + `waitForTimeout(150)` + `keyboard.up()` — a plain `keyboard.press()` releases the key before the loop can process it.
- `Enter` is NOT removed on `keyup` (a quirk of the current keyup handler), so `keyboard.press('Enter')` + `waitForTimeout(100)` is sufficient.

The `loadGame(page)` and `holdKey(page, key, ms)` helpers in `gameplay.test.js` encapsulate this timing correctly — reuse them in new e2e tests.

### Writing New Unit Tests

1. Add a new `describe` block to the appropriate test file, or create `tests/<module>.test.js`
2. Import helpers at the top:
   ```js
   const { describe, it, beforeEach } = require('node:test');
   const assert = require('node:assert/strict');
   const { loadEngine, makeGameState, makeEnemy } = require('./helpers/setup');
   ```
3. Call `loadEngine()` in `beforeEach` for tests that mutate state; use `before` for read-only tests
4. Set `ctx.GameState.currentState` to a `makeGameState()` object before exercising logic that reads from current state
5. Add the new file to the space-separated list in `package.json`'s `test:unit` script

### Writing New E2E Tests

1. Add a new `test.describe` block to `tests/e2e/gameplay.test.js` or create a new file in `tests/e2e/`
2. Use the `loadGame(page)` helper at the start of each test or in `test.beforeEach`
3. Use `holdKey(page, key, ms)` for keys that get removed on keyup (Arrow keys, `c`)
4. Use `keyboard.press('Enter')` + `waitForTimeout(100)` for Enter
5. Use `page.evaluate()` to read `GameState.currentState.*` for state assertions
6. New e2e test files are discovered automatically (no config changes needed)

### Adding a New Enemy Type
1. Add a spritesheet to `assets/spritesheets/`
2. Add a hidden `<img>` element in `index.html` with an `id`
3. Create an enemy object based on `GameState.exampleEnemy` in `GameState.js`
4. Add rendering logic in `SceneManager.js` if the enemy needs custom sprite handling
5. Spawn via `GameState.spawnedEnemies.push(...)` in game logic

### Adding a New Menu
1. Define the menu config object in `GUI.js` (labels, options, styling)
2. Set `GameState.currentState.activeMenu` to reference it when activating
3. Add rendering in `SceneManager.js` (follow the existing pause/game-over patterns)
4. Handle key input for the menu in `GameState.js`

### Modifying the Tilemap
1. Edit `assets/OrzentiaOverworldData.tmj` using **Tiled Map Editor**
2. Update the collision array in `Game.js` if collision tiles change
3. Update `SceneManager.js` constants if the map size changes

### Adding a New Spell/Attack
1. Add sprite frames to `assets/spells/<spell-name>/`
2. Add to the player `incarnate` object in `GameState.newStateTemplate`
3. Add input handling in `Game.js` (map a key)
4. Add projectile creation logic in `GameState.js`
5. Add rendering in `SceneManager.js`

---

## What Is Not Yet Implemented

These features are scaffolded or partially stubbed:

- Light attack (Z key) and Heavy attack (X key)
- Interact (F key)
- Main menu rendering (`displayMainMenu` is empty)
- Settings, Inventory, Character, Save menus
- Line-of-sight (LOS) check for enemy detection
- Level progression / experience-to-level logic
- NPC dialogue system
- Sound effects and music
- Terrain variety (multiple tile types beyond basic grass)
- Persistent save data

---

## Constraints & Guidelines for AI Assistants

1. **No build tools** — do not introduce npm, webpack, TypeScript, or any bundler unless explicitly requested. All code must run directly in the browser.
2. **No external libraries** — do not add CDN dependencies. Keep the project dependency-free.
3. **Maintain script load order** — scripts in `index.html` must remain in the correct order: `GameState` → `GUI` → `SceneManager` → `Game` → `index`.
4. **Global namespace pattern** — new systems should follow the existing pattern (a single global object with methods). Do not introduce ES modules or class syntax without discussion.
5. **Preload assets in `index.html`** — any new image/sprite must have a hidden `<img>` element added to `index.html` so it is available at runtime.
6. **Test new game logic** — a `tests/` suite exists using `node:test`. When adding non-trivial logic to the engine, add corresponding tests. Follow the patterns in the existing test files (see "Writing New Tests" above).
7. **Comment new logic** — the codebase uses JSDoc-style comments; follow this convention for new functions.
8. **Hardcoded config is intentional** — constants like canvas size, FPS, and tile dimensions are hardcoded in `SceneManager.js`. Do not extract them to config files unless asked.
9. **Game state is in-memory only** — there is no database or localStorage persistence. Do not assume persistence exists.
