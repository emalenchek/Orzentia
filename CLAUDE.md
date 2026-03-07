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
├── engine/                 # Core game systems (one file per system)
│   ├── Game.js             # Input handling, game loop entry, collision map data
│   ├── GameState.js        # All runtime state (player, enemies, attacks, menus)
│   ├── SceneManager.js     # Rendering, animation, camera, viewport
│   └── GUI.js              # Static menu/UI definitions
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
| Package mgr   | None                                |
| Test runner   | None                                |
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
6. **No testing framework** — the project has no tests. Do not generate test files unless explicitly asked to set up testing.
7. **Comment new logic** — the codebase uses JSDoc-style comments; follow this convention for new functions.
8. **Hardcoded config is intentional** — constants like canvas size, FPS, and tile dimensions are hardcoded in `SceneManager.js`. Do not extract them to config files unless asked.
9. **Game state is in-memory only** — there is no database or localStorage persistence. Do not assume persistence exists.
