'use strict';

/**
 * End-to-end tests for Orzentia.
 *
 * These tests run against a real Chromium browser served by http-server.
 * They exercise the game from the player's perspective: keyboard input,
 * canvas presence, and game state changes verified via page.evaluate()
 * (which has direct access to the GameState, Game, and SceneManager globals).
 *
 * Timing notes:
 *   - The game loop runs at 30 FPS (~33 ms/frame).
 *   - Arrow keys and 'c' are removed from activeKeys on keyup, so tests use
 *     keyboard.down() + waitForTimeout(150) + keyboard.up() to guarantee the
 *     game loop has at least one frame to process the key while it is held.
 *   - 'Enter' is NOT removed by the keyup handler (a known game quirk), so
 *     keyboard.press('Enter') + waitForTimeout(100) is sufficient.
 */

const { test, expect } = require('playwright/test');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Navigate to the game and wait for the game loop to start. */
async function loadGame(page) {
    await page.goto('/');
    // Wait long enough for formatCollisionArray + first rAF frame to run
    await page.waitForTimeout(300);
}

/** Hold a key for `ms` milliseconds, then release it. */
async function holdKey(page, key, ms = 150) {
    await page.keyboard.down(key);
    await page.waitForTimeout(ms);
    await page.keyboard.up(key);
}

/** Read GameState.currentState from the live browser context. */
function getState(page) {
    return page.evaluate(() => ({
        isActive:  GameState.currentState.isActive,
        isPaused:  GameState.currentState.isPaused,
        isGameOver: GameState.currentState.isGameOver,
        activeMenu: GameState.currentState.activeMenu,
        health:    GameState.currentState.player.health,
        x:         GameState.currentState.player.location.x,
        y:         GameState.currentState.player.location.y,
        orientation: GameState.currentState.player.orientation,
        attackCount: GameState.currentState.activeAttacks.length,
        firstAttack: GameState.currentState.activeAttacks[0] || null,
    }));
}

// ── Canvas & page load ────────────────────────────────────────────────────────

test.describe('Page load', () => {
    test('canvas element is visible', async ({ page }) => {
        await loadGame(page);
        await expect(page.locator('#game-canvas')).toBeVisible();
    });

    test('canvas has correct dimensions (500×500)', async ({ page }) => {
        await loadGame(page);
        const canvas = page.locator('#game-canvas');
        await expect(canvas).toHaveAttribute('width', '500');
        await expect(canvas).toHaveAttribute('height', '500');
    });

    test('page title is Orzentia', async ({ page }) => {
        await loadGame(page);
        await expect(page).toHaveTitle('Orzentia');
    });
});

// ── Initial game state ────────────────────────────────────────────────────────

test.describe('Initial game state', () => {
    test('game is active on load', async ({ page }) => {
        await loadGame(page);
        const state = await getState(page);
        expect(state.isActive).toBe(true);
    });

    test('game is not paused on load', async ({ page }) => {
        await loadGame(page);
        const state = await getState(page);
        expect(state.isPaused).toBe(false);
    });

    test('player starts with full health (5)', async ({ page }) => {
        await loadGame(page);
        const state = await getState(page);
        expect(state.health).toBe(5);
    });

    test('player starts at origin (x=0, y=0)', async ({ page }) => {
        await loadGame(page);
        const state = await getState(page);
        expect(state.x).toBe(0);
        expect(state.y).toBe(0);
    });

    test('no active attacks on load', async ({ page }) => {
        await loadGame(page);
        const state = await getState(page);
        expect(state.attackCount).toBe(0);
    });

    test('GameState global is accessible', async ({ page }) => {
        await loadGame(page);
        const exists = await page.evaluate(() => typeof GameState !== 'undefined');
        expect(exists).toBe(true);
    });
});

// ── Player movement ───────────────────────────────────────────────────────────

test.describe('Player movement', () => {
    test.beforeEach(async ({ page }) => {
        await loadGame(page);
    });

    test('ArrowRight moves player rightward (x increases)', async ({ page }) => {
        const before = await getState(page);
        await holdKey(page, 'ArrowRight');
        const after = await getState(page);
        expect(after.x).toBeGreaterThan(before.x);
    });

    test('ArrowLeft moves player leftward (x decreases)', async ({ page }) => {
        const before = await getState(page);
        await holdKey(page, 'ArrowLeft');
        const after = await getState(page);
        expect(after.x).toBeLessThan(before.x);
    });

    test('ArrowUp moves player upward (y increases)', async ({ page }) => {
        const before = await getState(page);
        await holdKey(page, 'ArrowUp');
        const after = await getState(page);
        expect(after.y).toBeGreaterThan(before.y);
    });

    test('ArrowDown moves player downward (y decreases)', async ({ page }) => {
        // Move up first to avoid collision at origin
        await holdKey(page, 'ArrowUp', 200);
        const before = await getState(page);
        await holdKey(page, 'ArrowDown');
        const after = await getState(page);
        expect(after.y).toBeLessThan(before.y);
    });

    test('holding a key longer moves the player further', async ({ page }) => {
        await holdKey(page, 'ArrowRight', 60);
        const near = await getState(page);
        await holdKey(page, 'ArrowRight', 200);
        const far = await getState(page);
        expect(far.x).toBeGreaterThan(near.x);
    });

    test('player does not move while paused', async ({ page }) => {
        // Pause the game
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);

        const before = await getState(page);
        await holdKey(page, 'ArrowRight');
        const after = await getState(page);

        // x must not have changed
        expect(after.x).toBe(before.x);
    });
});

// ── Player orientation ────────────────────────────────────────────────────────

test.describe('Player orientation', () => {
    test.beforeEach(async ({ page }) => {
        await loadGame(page);
    });

    test('holding ArrowRight sets orientation to E', async ({ page }) => {
        await page.keyboard.down('ArrowRight');
        await page.waitForTimeout(150);
        const state = await getState(page);
        await page.keyboard.up('ArrowRight');
        expect(state.orientation).toBe('E');
    });

    test('holding ArrowLeft sets orientation to W', async ({ page }) => {
        await page.keyboard.down('ArrowLeft');
        await page.waitForTimeout(150);
        const state = await getState(page);
        await page.keyboard.up('ArrowLeft');
        expect(state.orientation).toBe('W');
    });

    test('holding ArrowUp sets orientation to N', async ({ page }) => {
        await page.keyboard.down('ArrowUp');
        await page.waitForTimeout(150);
        const state = await getState(page);
        await page.keyboard.up('ArrowUp');
        expect(state.orientation).toBe('N');
    });

    test('holding ArrowDown sets orientation to S', async ({ page }) => {
        // First move away from origin so we can move down
        await holdKey(page, 'ArrowUp', 200);
        await page.keyboard.down('ArrowDown');
        await page.waitForTimeout(150);
        const state = await getState(page);
        await page.keyboard.up('ArrowDown');
        expect(state.orientation).toBe('S');
    });
});

// ── Pause & unpause ───────────────────────────────────────────────────────────

test.describe('Pause / unpause', () => {
    test.beforeEach(async ({ page }) => {
        await loadGame(page);
    });

    test('Enter pauses an active game', async ({ page }) => {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const state = await getState(page);
        expect(state.isPaused).toBe(true);
        expect(state.isActive).toBe(false);
    });

    test('pressing Enter again unpauses the game', async ({ page }) => {
        // Pause
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        // Unpause
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const state = await getState(page);
        expect(state.isPaused).toBe(false);
        expect(state.isActive).toBe(true);
    });

    test('activeMenu is set to "pause" when paused', async ({ page }) => {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const state = await getState(page);
        expect(state.activeMenu).toBe('pause');
    });

    test('activeMenu is cleared when unpaused', async ({ page }) => {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const state = await getState(page);
        expect(state.activeMenu).toBeNull();
    });
});

// ── Magic (C key) ─────────────────────────────────────────────────────────────

test.describe('Magic projectile (C key)', () => {
    test.beforeEach(async ({ page }) => {
        await loadGame(page);
    });

    test('pressing C creates a projectile', async ({ page }) => {
        await holdKey(page, 'c');
        const state = await getState(page);
        expect(state.attackCount).toBeGreaterThan(0);
    });

    test('projectile type is "projectile"', async ({ page }) => {
        await holdKey(page, 'c');
        const state = await getState(page);
        expect(state.firstAttack).not.toBeNull();
        expect(state.firstAttack.type).toBe('projectile');
    });

    test('projectile damage matches player incarnate damage (5)', async ({ page }) => {
        await holdKey(page, 'c');
        const state = await getState(page);
        expect(state.firstAttack.damage).toBe(5);
    });

    test('projectile fires in the player\'s current orientation', async ({ page }) => {
        // Face east, then cast
        await page.keyboard.down('ArrowRight');
        await page.waitForTimeout(100);
        await page.keyboard.up('ArrowRight');

        await holdKey(page, 'c');
        const state = await getState(page);
        expect(state.firstAttack.orientation).toBe('E');
    });

    test('pressing C does not fire while paused', async ({ page }) => {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);

        await holdKey(page, 'c');
        const state = await getState(page);
        expect(state.attackCount).toBe(0);
    });

    test('uppercase C also fires a projectile', async ({ page }) => {
        await holdKey(page, 'C');
        const state = await getState(page);
        expect(state.attackCount).toBeGreaterThan(0);
    });
});

// ── Game over ─────────────────────────────────────────────────────────────────

test.describe('Game over', () => {
    test('health reaching 0 triggers game over state', async ({ page }) => {
        await loadGame(page);
        // Set player health to 0 directly and trigger the check
        await page.evaluate(() => {
            GameState.currentState.player.health = 0;
            GameState.checkPlayerStatus();
        });
        const state = await getState(page);
        expect(state.isGameOver).toBe(true);
        expect(state.isActive).toBe(false);
    });

    test('game over prevents pause toggle', async ({ page }) => {
        await loadGame(page);
        await page.evaluate(() => {
            GameState.currentState.player.health = 0;
            GameState.checkPlayerStatus();
        });
        // Try to pause — should be ignored (togglePaused no-ops when isGameOver)
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        const state = await getState(page);
        expect(state.isPaused).toBe(false);
        expect(state.isGameOver).toBe(true);
    });
});
