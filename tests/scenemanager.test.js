'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./helpers/setup');

// ─── SceneManager.getTrueLocation ────────────────────────────────────────────
// Converts player offset coordinates to canvas coordinates.
//
// Formula (derived from the source):
//   trueX = (canvasEl.width  / 2) - (PLAYER_WIDTH  / 2) + x
//         = (500 / 2) - (22 / 2) + x = 239 + x
//   trueY = (canvasEl.height / 2) - (PLAYER_HEIGHT / 2) - y
//         = (500 / 2) - (32 / 2) - y = 234 - y
//
// Note: the function guards against falsy x/y by treating them as 0.
//
// Note on assertions: getTrueLocation returns an object constructed inside the
// VM sandbox, which has a different Object prototype than the outer test context.
// deepStrictEqual therefore fails (prototype mismatch) even when values are equal.
// We assert each property with strictEqual to avoid this.
describe('SceneManager.getTrueLocation', () => {
    let SceneManager;

    before(() => {
        const ctx = loadEngine();
        SceneManager = ctx.SceneManager;
    });

    it('returns the canvas centre offset when x=0, y=0', () => {
        const result = SceneManager.getTrueLocation(0, 0);
        // x and y are falsy (0), so the guard resets them to 0 — same result
        assert.strictEqual(result.x, 239);
        assert.strictEqual(result.y, 234);
    });

    it('shifts x rightward when x is positive', () => {
        const result = SceneManager.getTrueLocation(100, 0);
        assert.strictEqual(result.x, 339);
        assert.strictEqual(result.y, 234);
    });

    it('shifts x leftward when x is negative', () => {
        const result = SceneManager.getTrueLocation(-50, 0);
        assert.strictEqual(result.x, 189);
        assert.strictEqual(result.y, 234);
    });

    it('shifts y upward (smaller value) when y is positive', () => {
        // Positive y in game coords = player moved up the map = lower canvas y
        const result = SceneManager.getTrueLocation(0, 50);
        assert.strictEqual(result.x, 239);
        assert.strictEqual(result.y, 184);
    });

    it('shifts y downward (larger value) when y is negative', () => {
        const result = SceneManager.getTrueLocation(0, -50);
        assert.strictEqual(result.x, 239);
        assert.strictEqual(result.y, 284);
    });

    it('handles both x and y offsets simultaneously', () => {
        const result = SceneManager.getTrueLocation(10, 20);
        assert.strictEqual(result.x, 249);
        assert.strictEqual(result.y, 214);
    });

    it('returns an object with x and y properties', () => {
        const result = SceneManager.getTrueLocation(5, 5);
        assert.ok(Object.prototype.hasOwnProperty.call(result, 'x'));
        assert.ok(Object.prototype.hasOwnProperty.call(result, 'y'));
    });

    it('x result is always a finite number', () => {
        const result = SceneManager.getTrueLocation(100, 200);
        assert.ok(Number.isFinite(result.x));
    });

    it('y result is always a finite number', () => {
        const result = SceneManager.getTrueLocation(100, 200);
        assert.ok(Number.isFinite(result.y));
    });
});
