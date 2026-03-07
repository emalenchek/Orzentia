'use strict';

/**
 * Test environment setup for Orzentia engine modules.
 *
 * The engine files were written for the browser (global namespace, DOM APIs).
 * This helper loads them into an isolated Node.js VM context with browser
 * globals mocked out, so the pure game logic can be unit-tested without a browser.
 *
 * Load order matches index.html: GameState → GUI → SceneManager → Game
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ENGINE_DIR = path.join(__dirname, '..', '..', 'engine');

function makeBrowserMocks() {
    const canvasCtxMock = {
        drawImage() {},
        fillRect() {},
        clearRect() {},
        fillText() {},
        measureText() { return { width: 0 }; },
        save() {},
        restore() {},
        translate() {},
        rotate() {},
        setTransform() {},
        getTransform() { return { e: 0, f: 0 }; },
        font: '',
        fillStyle: ''
    };

    // Canvas element mock — width/height must be 500 to match SceneManager constants
    const canvasElMock = {
        width: 500,
        height: 500,
        getContext() { return canvasCtxMock; }
    };

    return {
        document: {
            getElementById() { return canvasElMock; }
        },
        window: {
            addEventListener() {},
            removeEventListener() {}
        },
        // Image constructor used by renderEnemies / renderAttackAnimations
        Image: function Image() { this.src = ''; },
        requestAnimationFrame() {},
        // Standard globals the engine files rely on implicitly
        console,
        JSON,
        Math,
        Date,
        parseInt,
        parseFloat,
        isNaN,
        Array,
        Object,
        Number,
        String,
        Boolean
    };
}

/**
 * Loads all engine files into a fresh, isolated VM context.
 * Returns the context object whose properties are the engine globals:
 *   ctx.Game, ctx.GameState, ctx.SceneManager, ctx.GUI
 *
 * Call this once per test or describe block. Each call produces a completely
 * independent engine instance with reset mutable state.
 */
function loadEngine() {
    const ctx = vm.createContext(makeBrowserMocks());

    const files = ['GameState.js', 'GUI.js', 'SceneManager.js', 'Game.js'];
    for (const file of files) {
        const code = fs.readFileSync(path.join(ENGINE_DIR, file), 'utf8');
        vm.runInContext(code, ctx);
    }

    // Reset mutable state so every call starts clean
    ctx.GameState.currentState = null;
    ctx.GameState.activeKeys = [];
    ctx.GameState.collisionsLookup = {};

    return ctx;
}

/**
 * Returns a minimal, valid game state object for use in tests.
 * Mirrors the shape of GameState.newStateTemplate.
 */
function makeGameState(overrides) {
    const base = {
        isActive: true,
        isPaused: false,
        isGameOver: false,
        activeMenu: null,
        activeAttacks: [],
        spawnedEnemies: [],
        player: {
            health: 5,
            width: 22,
            height: 32,
            speed: 5,
            location: { x: 0, y: 0 },
            orientation: 'S',
            rotation: 0,
            invulnerabilityFrames: 40,
            remainingInvulnerabilityFrames: 0,
            incarnate: {
                school: 'fire',
                type: 'projectile',
                damage: 5,
                speed: 5,
                width: 40,
                height: 40,
                spriteWidth: 16,
                spriteHeight: 16,
                sprites: ['./assets/spells/fireball/Fireball1.png']
            }
        }
    };

    if (overrides) {
        Object.assign(base, overrides);
    }
    return base;
}

/**
 * Returns a minimal enemy object for use in tests.
 * Mirrors the shape of GameState.exampleEnemy.
 */
function makeEnemy(overrides) {
    const base = {
        name: 'Test Enemy',
        type: 'monster',
        health: 5,
        experienceYield: 10,
        spritesheet: './assets/spritesheets/slime_monster_spritesheet.png',
        spriteIndex: 0,
        spriteIndexArrayLength: 8,
        movementType: 'aggressive',
        detectsPlayer: false,
        speed: 2,
        detectionRange: 250,
        location: { x: 300, y: 300 },
        spriteWidth: 24,
        spriteHeight: 24,
        width: 40,
        height: 40,
        strength: 1
    };

    if (overrides) {
        Object.assign(base, overrides);
    }
    return base;
}

module.exports = { loadEngine, makeGameState, makeEnemy };
