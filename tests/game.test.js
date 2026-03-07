'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./helpers/setup');

// Game.getDistanceBetweenPoints is a pure Euclidean distance function.
// It has no side effects and no dependencies on game state.
describe('Game.getDistanceBetweenPoints', () => {
    let Game;

    before(() => {
        const ctx = loadEngine();
        Game = ctx.Game;
    });

    it('returns 0 for the same point', () => {
        assert.strictEqual(Game.getDistanceBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 0 }), 0);
    });

    it('calculates horizontal distance correctly', () => {
        assert.strictEqual(Game.getDistanceBetweenPoints({ x: 0, y: 0 }, { x: 5, y: 0 }), 5);
    });

    it('calculates vertical distance correctly', () => {
        assert.strictEqual(Game.getDistanceBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 7 }), 7);
    });

    it('calculates diagonal distance correctly (3-4-5 triangle)', () => {
        assert.strictEqual(Game.getDistanceBetweenPoints({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
    });

    it('handles negative coordinates', () => {
        // (-3, 0) to (0, 4) → sqrt(9 + 16) = 5
        assert.strictEqual(Game.getDistanceBetweenPoints({ x: -3, y: 0 }, { x: 0, y: 4 }), 5);
    });

    it('is symmetric — distance(A, B) === distance(B, A)', () => {
        const a = { x: 10, y: 20 };
        const b = { x: 30, y: 50 };
        assert.strictEqual(
            Game.getDistanceBetweenPoints(a, b),
            Game.getDistanceBetweenPoints(b, a)
        );
    });

    it('returns a non-negative value for any pair of points', () => {
        const dist = Game.getDistanceBetweenPoints({ x: -100, y: -200 }, { x: 50, y: 80 });
        assert.ok(dist >= 0);
    });
});
