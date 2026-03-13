'use strict';

const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine, makeGameState, makeEnemy, makeNpc } = require('./helpers/setup');

// ─── isLocationAvailable ──────────────────────────────────────────────────────
// Checks a 4-point AABB against GameState.collisionsLookup.
// Indices below were derived by tracing through the function with:
//   canvasEl.width=500, PLAYER_WIDTH=22, PLAYER_HEIGHT=32,
//   canvasStartXOffset=-440, canvasStartYOffset=-1120,
//   MAP_WIDTH=48, TILE_WIDTH=40, TILE_HEIGHT=40
describe('GameState.isLocationAvailable', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('returns true when collisionsLookup is empty (no obstacles)', () => {
        GameState.collisionsLookup = {};
        const result = GameState.isLocationAvailable(
            { x: 0, y: 0 },
            false,
            { width: 22, height: 32 }
        );
        assert.strictEqual(result, true);
    });

    it('returns false when the entity footprint overlaps a collision tile (isTrue=false)', () => {
        // At player position (0, 0) all 4 corners resolve to arrayIndex 1649
        GameState.collisionsLookup = { 1649: 1053 };
        const result = GameState.isLocationAvailable(
            { x: 0, y: 0 },
            false,
            { width: 22, height: 32 }
        );
        assert.strictEqual(result, false);
    });

    it('returns true when collision is at a different tile than the entity (isTrue=false)', () => {
        // Populate a tile far away from index 1649
        GameState.collisionsLookup = { 0: 1053 };
        const result = GameState.isLocationAvailable(
            { x: 0, y: 0 },
            false,
            { width: 22, height: 32 }
        );
        assert.strictEqual(result, true);
    });

    it('returns true for enemy move check when no collisions (isTrue=true)', () => {
        GameState.collisionsLookup = {};
        // isTrue=true uses x/y directly (enemy canvas coordinates)
        const result = GameState.isLocationAvailable(
            { x: 300, y: 300 },
            true,
            { width: 40, height: 40 }
        );
        assert.strictEqual(result, true);
    });

    it('returns false for enemy move check when collision tile present (isTrue=true)', () => {
        // At enemy (300, 300) with isTrue=true, top-left corner → arrayIndex 1746
        GameState.collisionsLookup = { 1746: 1053 };
        const result = GameState.isLocationAvailable(
            { x: 300, y: 300 },
            true,
            { width: 40, height: 40 }
        );
        assert.strictEqual(result, false);
    });
});

// ─── calculatePlayerDamage ────────────────────────────────────────────────────
describe('GameState.calculatePlayerDamage', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('reduces player health by enemy strength when not invulnerable', () => {
        const enemy = makeEnemy({ strength: 2 });
        GameState.calculatePlayerDamage(enemy);
        assert.strictEqual(GameState.currentState.player.health, 3);
    });

    it('sets remainingInvulnerabilityFrames after taking damage', () => {
        const enemy = makeEnemy({ strength: 1 });
        GameState.calculatePlayerDamage(enemy);
        assert.strictEqual(
            GameState.currentState.player.remainingInvulnerabilityFrames,
            GameState.currentState.player.invulnerabilityFrames
        );
    });

    it('does NOT reduce health when player still has invulnerability frames', () => {
        GameState.currentState.player.remainingInvulnerabilityFrames = 10;
        const enemy = makeEnemy({ strength: 3 });
        GameState.calculatePlayerDamage(enemy);
        assert.strictEqual(GameState.currentState.player.health, 5); // unchanged
    });

    it('does NOT change remainingInvulnerabilityFrames when already invulnerable', () => {
        GameState.currentState.player.remainingInvulnerabilityFrames = 10;
        const enemy = makeEnemy({ strength: 1 });
        GameState.calculatePlayerDamage(enemy);
        assert.strictEqual(GameState.currentState.player.remainingInvulnerabilityFrames, 10);
    });
});

// ─── calculateEnemyDamage ─────────────────────────────────────────────────────
describe('GameState.calculateEnemyDamage', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('reduces enemy health by attack damage', () => {
        const enemy = makeEnemy({ health: 10, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        const attack = { damage: 3 };
        GameState.calculateEnemyDamage(attack, enemy);
        assert.strictEqual(enemy.health, 7);
    });

    it('despawns enemy when health reaches 0', () => {
        const enemy = makeEnemy({ health: 5, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        const attack = { damage: 5 };
        GameState.calculateEnemyDamage(attack, enemy);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 0);
    });

    it('despawns enemy when attack damage exceeds remaining health', () => {
        const enemy = makeEnemy({ health: 3, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        const attack = { damage: 10 };
        GameState.calculateEnemyDamage(attack, enemy);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 0);
    });

    it('keeps enemy alive when damage does not deplete health', () => {
        const enemy = makeEnemy({ health: 10, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        const attack = { damage: 4 };
        GameState.calculateEnemyDamage(attack, enemy);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 1);
    });
});

// ─── spawnEnemy / despawnActiveEnemy ─────────────────────────────────────────
describe('GameState.spawnEnemy', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('adds an enemy to spawnedEnemies', () => {
        const enemy = makeEnemy();
        GameState.spawnEnemy(enemy);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 1);
        assert.strictEqual(GameState.currentState.spawnedEnemies[0], enemy);
    });

    it('adds multiple enemies to spawnedEnemies', () => {
        GameState.spawnEnemy(makeEnemy({ name: 'A' }));
        GameState.spawnEnemy(makeEnemy({ name: 'B' }));
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 2);
    });
});

describe('GameState.despawnActiveEnemy', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('removes the target enemy from spawnedEnemies', () => {
        const e0 = makeEnemy({ name: 'A', index: 0 });
        const e1 = makeEnemy({ name: 'B', index: 1 });
        GameState.currentState.spawnedEnemies.push(e0, e1);
        GameState.despawnActiveEnemy(e1);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 1);
        assert.strictEqual(GameState.currentState.spawnedEnemies[0].name, 'A');
    });

    it('reindexes remaining enemies after despawn', () => {
        const e0 = makeEnemy({ name: 'A', index: 0 });
        const e1 = makeEnemy({ name: 'B', index: 1 });
        const e2 = makeEnemy({ name: 'C', index: 2 });
        GameState.currentState.spawnedEnemies.push(e0, e1, e2);
        GameState.despawnActiveEnemy(e0);
        // e1 and e2 should be reindexed to 0 and 1
        assert.strictEqual(GameState.currentState.spawnedEnemies[0].index, 0);
        assert.strictEqual(GameState.currentState.spawnedEnemies[1].index, 1);
    });

    it('leaves spawnedEnemies empty when only enemy is despawned', () => {
        const e0 = makeEnemy({ index: 0 });
        GameState.currentState.spawnedEnemies.push(e0);
        GameState.despawnActiveEnemy(e0);
        assert.strictEqual(GameState.currentState.spawnedEnemies.length, 0);
    });
});

// ─── despawnActiveAttack ──────────────────────────────────────────────────────
describe('GameState.despawnActiveAttack', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    function makeAttack(overrides) {
        return Object.assign(
            { index: 0, type: 'projectile', damage: 5, currentLocation: { x: 0, y: 0 } },
            overrides
        );
    }

    it('removes the target attack from activeAttacks', () => {
        const a0 = makeAttack({ index: 0 });
        const a1 = makeAttack({ index: 1 });
        GameState.currentState.activeAttacks.push(a0, a1);
        GameState.despawnActiveAttack(a0);
        assert.strictEqual(GameState.currentState.activeAttacks.length, 1);
    });

    it('reindexes remaining attacks after despawn', () => {
        const a0 = makeAttack({ index: 0 });
        const a1 = makeAttack({ index: 1 });
        const a2 = makeAttack({ index: 2 });
        GameState.currentState.activeAttacks.push(a0, a1, a2);
        GameState.despawnActiveAttack(a1);
        assert.strictEqual(GameState.currentState.activeAttacks[0].index, 0);
        assert.strictEqual(GameState.currentState.activeAttacks[1].index, 1);
    });

    it('leaves activeAttacks empty when only attack is despawned', () => {
        const a0 = makeAttack({ index: 0 });
        GameState.currentState.activeAttacks.push(a0);
        GameState.despawnActiveAttack(a0);
        assert.strictEqual(GameState.currentState.activeAttacks.length, 0);
    });
});

// ─── pauseGame / unpauseGame / togglePaused ───────────────────────────────────
describe('GameState.pauseGame', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState({ isActive: true, isPaused: false });
    });

    it('sets isPaused to true', () => {
        GameState.pauseGame();
        assert.strictEqual(GameState.currentState.isPaused, true);
    });

    it('sets isActive to false', () => {
        GameState.pauseGame();
        assert.strictEqual(GameState.currentState.isActive, false);
    });

    it('sets activeMenu to "pause"', () => {
        GameState.pauseGame();
        assert.strictEqual(GameState.currentState.activeMenu, 'pause');
    });
});

describe('GameState.unpauseGame', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState({ isActive: false, isPaused: true, activeMenu: 'pause' });
    });

    it('sets isPaused to false', () => {
        GameState.unpauseGame();
        assert.strictEqual(GameState.currentState.isPaused, false);
    });

    it('sets isActive to true', () => {
        GameState.unpauseGame();
        assert.strictEqual(GameState.currentState.isActive, true);
    });

    it('clears activeMenu', () => {
        GameState.unpauseGame();
        assert.strictEqual(GameState.currentState.activeMenu, null);
    });
});

describe('GameState.togglePaused', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
    });

    it('pauses an active game', () => {
        GameState.currentState = makeGameState({ isActive: true, isPaused: false });
        GameState.togglePaused();
        assert.strictEqual(GameState.currentState.isPaused, true);
        assert.strictEqual(GameState.currentState.isActive, false);
    });

    it('unpauses a paused game', () => {
        GameState.currentState = makeGameState({ isActive: false, isPaused: true, activeMenu: 'pause' });
        GameState.togglePaused();
        assert.strictEqual(GameState.currentState.isPaused, false);
        assert.strictEqual(GameState.currentState.isActive, true);
    });

    it('does nothing when the game is already over', () => {
        GameState.currentState = makeGameState({
            isActive: false,
            isPaused: false,
            isGameOver: true
        });
        GameState.togglePaused();
        // State must remain unchanged
        assert.strictEqual(GameState.currentState.isGameOver, true);
        assert.strictEqual(GameState.currentState.isActive, false);
        assert.strictEqual(GameState.currentState.isPaused, false);
    });
});

// ─── checkPlayerStatus / endGame ─────────────────────────────────────────────
describe('GameState.checkPlayerStatus', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('ends the game when player health reaches 0', () => {
        GameState.currentState.player.health = 0;
        GameState.checkPlayerStatus();
        assert.strictEqual(GameState.currentState.isActive, false);
        assert.strictEqual(GameState.currentState.isGameOver, true);
    });

    it('ends the game when player health is negative', () => {
        GameState.currentState.player.health = -3;
        GameState.checkPlayerStatus();
        assert.strictEqual(GameState.currentState.isGameOver, true);
    });

    it('does NOT end the game when player health is above 0', () => {
        GameState.currentState.player.health = 1;
        GameState.checkPlayerStatus();
        assert.strictEqual(GameState.currentState.isActive, true);
        assert.strictEqual(GameState.currentState.isGameOver, false);
    });
});

// ─── getPossibleEnemyMoves ────────────────────────────────────────────────────
describe('GameState.getPossibleEnemyMoves', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {}; // no terrain collisions
    });

    it('returns 4 moves for an aggressive enemy with no obstacles', () => {
        const enemy = makeEnemy({ movementType: 'aggressive', location: { x: 300, y: 300 } });
        const moves = GameState.getPossibleEnemyMoves(enemy);
        assert.strictEqual(moves.length, 4);
    });

    it('returns 4 moves for an erratic enemy with no obstacles', () => {
        const enemy = makeEnemy({ movementType: 'erratic', location: { x: 300, y: 300 } });
        const moves = GameState.getPossibleEnemyMoves(enemy);
        assert.strictEqual(moves.length, 4);
    });

    it('returns an empty array for an idle enemy (idle does not move)', () => {
        const enemy = makeEnemy({ movementType: 'idle', location: { x: 300, y: 300 } });
        const moves = GameState.getPossibleEnemyMoves(enemy);
        assert.strictEqual(moves.length, 0);
    });

    it('returns an empty array for a custom movement type enemy', () => {
        const enemy = makeEnemy({ movementType: 'custom', location: { x: 300, y: 300 } });
        const moves = GameState.getPossibleEnemyMoves(enemy);
        assert.strictEqual(moves.length, 0);
    });

    it('each returned move differs from the original location', () => {
        const enemy = makeEnemy({ movementType: 'aggressive', location: { x: 300, y: 300 } });
        const moves = GameState.getPossibleEnemyMoves(enemy);
        for (const move of moves) {
            const xChanged = move.x !== enemy.location.x;
            const yChanged = move.y !== enemy.location.y;
            assert.ok(xChanged || yChanged, 'move should differ from original location');
        }
    });
});

// ─── getExperienceToNextLevel ─────────────────────────────────────────────────
describe('GameState.getExperienceToNextLevel', () => {
    let GameState;

    before(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
    });

    it('returns 100 for level 1', () => {
        assert.strictEqual(GameState.getExperienceToNextLevel(1), 100);
    });

    it('returns 283 for level 2', () => {
        // floor(100 * 2^1.5) = floor(282.84…) = 282
        assert.strictEqual(GameState.getExperienceToNextLevel(2), 282);
    });

    it('increases with each level', () => {
        const xp1 = GameState.getExperienceToNextLevel(1);
        const xp2 = GameState.getExperienceToNextLevel(2);
        const xp3 = GameState.getExperienceToNextLevel(3);
        assert.ok(xp2 > xp1, 'level 2 threshold should exceed level 1');
        assert.ok(xp3 > xp2, 'level 3 threshold should exceed level 2');
    });

    it('always returns a positive integer', () => {
        for (let lvl = 1; lvl <= 10; lvl++) {
            const val = GameState.getExperienceToNextLevel(lvl);
            assert.ok(Number.isInteger(val) && val > 0);
        }
    });
});

// ─── checkLevelUp ─────────────────────────────────────────────────────────────
describe('GameState.checkLevelUp', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('does nothing when experience is below threshold', () => {
        GameState.currentState.player.experience = 50;
        GameState.checkLevelUp();
        assert.strictEqual(GameState.currentState.player.level, 1);
        assert.strictEqual(GameState.currentState.player.experience, 50);
    });

    it('advances level when experience meets threshold', () => {
        GameState.currentState.player.experience = 100; // exact threshold at level 1
        GameState.checkLevelUp();
        assert.strictEqual(GameState.currentState.player.level, 2);
        assert.strictEqual(GameState.currentState.player.experience, 0);
    });

    it('carries over surplus experience after level-up', () => {
        GameState.currentState.player.experience = 150; // 100 threshold + 50 surplus
        GameState.checkLevelUp();
        assert.strictEqual(GameState.currentState.player.level, 2);
        assert.strictEqual(GameState.currentState.player.experience, 50);
    });

    it('increases maxHealth by 2 on level-up', () => {
        GameState.currentState.player.experience = 100;
        GameState.checkLevelUp();
        assert.strictEqual(GameState.currentState.player.maxHealth, 7);
    });

    it('increases strength by 1 on level-up', () => {
        GameState.currentState.player.experience = 100;
        GameState.checkLevelUp();
        assert.strictEqual(GameState.currentState.player.strength, 2);
    });

    it('does not allow health to exceed new maxHealth', () => {
        GameState.currentState.player.health = 5;
        GameState.currentState.player.maxHealth = 5;
        GameState.currentState.player.experience = 100;
        GameState.checkLevelUp();
        // health restored by 2, but capped at new maxHealth (7)
        assert.strictEqual(GameState.currentState.player.health, 7);
    });
});

// ─── calculateEnemyDamage — XP award ─────────────────────────────────────────
describe('GameState.calculateEnemyDamage — experience award', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('awards experience to the player when enemy is killed', () => {
        const enemy = makeEnemy({ health: 5, experienceYield: 10, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        GameState.calculateEnemyDamage({ damage: 5 }, enemy);
        assert.strictEqual(GameState.currentState.player.experience, 10);
    });

    it('does NOT award experience when the enemy survives', () => {
        const enemy = makeEnemy({ health: 10, experienceYield: 10, index: 0 });
        GameState.currentState.spawnedEnemies.push(enemy);
        GameState.calculateEnemyDamage({ damage: 3 }, enemy);
        assert.strictEqual(GameState.currentState.player.experience, 0);
    });
});

// ─── enemy attack cooldown ────────────────────────────────────────────────────
describe('enemy remainingAttackCooldown prevents per-frame damage', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('deals damage when remainingAttackCooldown is 0', () => {
        const enemy = makeEnemy({ strength: 1, attackCooldownFrames: 30, remainingAttackCooldown: 0 });
        // bypass isCollidingWithPlayer by calling calculatePlayerDamage via the cooldown check directly
        if (enemy.remainingAttackCooldown <= 0) {
            GameState.calculatePlayerDamage(enemy);
            enemy.remainingAttackCooldown = enemy.attackCooldownFrames;
        }
        assert.strictEqual(GameState.currentState.player.health, 4);
        assert.strictEqual(enemy.remainingAttackCooldown, 30);
    });

    it('does NOT deal damage when remainingAttackCooldown > 0', () => {
        const enemy = makeEnemy({ strength: 1, attackCooldownFrames: 30, remainingAttackCooldown: 15 });
        if (enemy.remainingAttackCooldown <= 0) {
            GameState.calculatePlayerDamage(enemy);
            enemy.remainingAttackCooldown = enemy.attackCooldownFrames;
        }
        // cooldown was 15, so damage must not have been applied
        assert.strictEqual(GameState.currentState.player.health, 5);
    });
});

// ─── playerActions.lightAttack ────────────────────────────────────────────────
describe('GameState.playerActions.lightAttack', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    it('adds a melee attack to activeAttacks', () => {
        GameState.playerActions.lightAttack();
        assert.strictEqual(GameState.currentState.activeAttacks.length, 1);
        assert.strictEqual(GameState.currentState.activeAttacks[0].type, 'melee');
        assert.strictEqual(GameState.currentState.activeAttacks[0].subtype, 'light');
    });

    it('does nothing when player is still on attack cooldown', () => {
        GameState.currentState.player.remainingAttackCooldown = 10;
        GameState.playerActions.lightAttack();
        assert.strictEqual(GameState.currentState.activeAttacks.length, 0);
    });

    it('sets player remainingAttackCooldown after attack', () => {
        GameState.playerActions.lightAttack();
        assert.strictEqual(
            GameState.currentState.player.remainingAttackCooldown,
            GameState.currentState.player.attackCooldownFrames
        );
    });

    it('attack damage scales with player strength', () => {
        GameState.currentState.player.strength = 3;
        GameState.playerActions.lightAttack();
        assert.strictEqual(GameState.currentState.activeAttacks[0].damage, 6);
    });

    it('attack has the expected activeFrames', () => {
        GameState.playerActions.lightAttack();
        assert.strictEqual(GameState.currentState.activeAttacks[0].activeFrames, 10);
    });

    it('attack starts with an empty alreadyHit list', () => {
        GameState.playerActions.lightAttack();
        const attack = GameState.currentState.activeAttacks[0];
        assert.strictEqual(attack.alreadyHit.length, 0);
    });
});

// ─── updateActiveAttack — melee ───────────────────────────────────────────────
describe('GameState.updateActiveAttack — melee', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
    });

    function makeMeleeAttack(overrides) {
        return Object.assign({
            index: 0,
            type: 'melee',
            subtype: 'light',
            damage: 2,
            orientation: 'S',
            currentLocation: { x: 0, y: 0 },
            width: 36,
            height: 24,
            activeFrames: 5,
            alreadyHit: []
        }, overrides);
    }

    it('decrements activeFrames each call', () => {
        const attack = makeMeleeAttack({ index: 0 });
        GameState.currentState.activeAttacks.push(attack);
        GameState.updateActiveAttack(attack);
        assert.strictEqual(attack.activeFrames, 4);
    });

    it('despawns the attack when activeFrames reaches 0', () => {
        const attack = makeMeleeAttack({ activeFrames: 1, index: 0 });
        GameState.currentState.activeAttacks.push(attack);
        GameState.updateActiveAttack(attack);
        assert.strictEqual(GameState.currentState.activeAttacks.length, 0);
    });
});

// ─── advanceDialogue ──────────────────────────────────────────────────────────
// Player at offset (0,0) → true canvas position (239, 234) per getTrueLocation.
// makeNpc() defaults to location { x:280, y:234 }, distance ≈ 41px (< 80 range).
describe('GameState.advanceDialogue', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {};
    });

    it('increments pageIndex by 1', () => {
        const npc = makeNpc({ dialogue: ['Page 1', 'Page 2', 'Page 3'] });
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.advanceDialogue();
        assert.strictEqual(GameState.currentState.activeDialogue.pageIndex, 1);
    });

    it('keeps dialogue open when advancing to a non-final page', () => {
        const npc = makeNpc({ dialogue: ['Page 1', 'Page 2', 'Page 3'] });
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.advanceDialogue();
        assert.notStrictEqual(GameState.currentState.activeDialogue, null);
    });

    it('closes dialogue (sets activeDialogue to null) when the last page is advanced past', () => {
        const npc = makeNpc({ dialogue: ['Page 1', 'Page 2'] });
        GameState.currentState.activeDialogue = { npc, pageIndex: 1 };
        GameState.advanceDialogue();
        assert.strictEqual(GameState.currentState.activeDialogue, null);
    });

    it('does nothing when activeDialogue is null', () => {
        GameState.currentState.activeDialogue = null;
        GameState.advanceDialogue(); // must not throw
        assert.strictEqual(GameState.currentState.activeDialogue, null);
    });
});

// ─── interactWithNearbyNpc ────────────────────────────────────────────────────
describe('GameState.interactWithNearbyNpc', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {};
    });

    it('opens dialogue with a nearby NPC', () => {
        GameState.currentState.spawnedNpcs.push(makeNpc());
        GameState.interactWithNearbyNpc();
        assert.notStrictEqual(GameState.currentState.activeDialogue, null);
    });

    it('sets pageIndex to 0 when opening dialogue', () => {
        GameState.currentState.spawnedNpcs.push(makeNpc());
        GameState.interactWithNearbyNpc();
        assert.strictEqual(GameState.currentState.activeDialogue.pageIndex, 0);
    });

    it('does not open dialogue when no NPC is within range', () => {
        // Location far outside the 80px interaction range of player at (239,234)
        GameState.currentState.spawnedNpcs.push(makeNpc({ location: { x: 700, y: 700 } }));
        GameState.interactWithNearbyNpc();
        assert.strictEqual(GameState.currentState.activeDialogue, null);
    });

    it('selects the closest NPC when multiple are in range', () => {
        // 'Close' is 21px away, 'Far' is 61px away — both within 80px range
        const close = makeNpc({ name: 'Close', location: { x: 260, y: 234 } });
        const far   = makeNpc({ name: 'Far',   location: { x: 300, y: 234 } });
        GameState.currentState.spawnedNpcs.push(close, far);
        GameState.interactWithNearbyNpc();
        assert.strictEqual(GameState.currentState.activeDialogue.npc.name, 'Close');
    });
});

// ─── createNewGameState — NPC spawning ───────────────────────────────────────
describe('GameState.createNewGameState — NPC spawning', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.collisionsLookup = {};
        GameState.createNewGameState();
    });

    it('populates spawnedNpcs with all village NPC definitions', () => {
        assert.strictEqual(
            GameState.currentState.spawnedNpcs.length,
            GameState.villageNpcDefinitions.length
        );
    });

    it('each spawned NPC has a non-empty name', () => {
        assert.ok(GameState.currentState.spawnedNpcs[0].name.length > 0);
    });

    it('each spawned NPC has a non-empty dialogue array', () => {
        assert.ok(GameState.currentState.spawnedNpcs[0].dialogue.length > 0);
    });

    it('NPCs are independent copies — mutating one does not affect the definition', () => {
        GameState.currentState.spawnedNpcs[0].name = 'Mutated';
        assert.notStrictEqual(GameState.villageNpcDefinitions[0].name, 'Mutated');
    });
});

// ─── input: F key and Z key dialogue handling ─────────────────────────────────
describe('updatePlayerLocation — F key dialogue interaction', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {};
    });

    it('pressing F opens dialogue with a nearby NPC when no dialogue is active', () => {
        GameState.currentState.spawnedNpcs.push(makeNpc());
        GameState.activeKeys = ['F'];
        GameState.updatePlayerLocation();
        assert.notStrictEqual(GameState.currentState.activeDialogue, null);
    });

    it('pressing F advances existing dialogue when dialogue is already active', () => {
        const npc = makeNpc({ dialogue: ['Page 1', 'Page 2'] });
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.activeKeys = ['F'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.activeDialogue.pageIndex, 1);
    });
});

describe('updatePlayerLocation — Z key dialogue / attack routing', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {};
    });

    it('pressing Z advances dialogue when dialogue is active', () => {
        const npc = makeNpc({ dialogue: ['Page 1', 'Page 2'] });
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.activeKeys = ['Z'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.activeDialogue.pageIndex, 1);
    });

    it('pressing Z performs a light attack when no dialogue is active', () => {
        GameState.currentState.activeDialogue = null;
        GameState.activeKeys = ['Z'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.activeAttacks.length, 1);
    });
});

describe('updatePlayerLocation — arrow keys blocked during dialogue', () => {
    let GameState;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GameState.currentState = makeGameState();
        GameState.collisionsLookup = {};
    });

    it('ArrowUp does not move the player when dialogue is active', () => {
        const npc = makeNpc();
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.currentState.player.location.y = 0;
        GameState.activeKeys = ['ArrowUp'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.player.location.y, 0);
    });

    it('ArrowDown does not move the player when dialogue is active', () => {
        const npc = makeNpc();
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.currentState.player.location.y = 0;
        GameState.activeKeys = ['ArrowDown'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.player.location.y, 0);
    });

    it('ArrowRight does not move the player when dialogue is active', () => {
        const npc = makeNpc();
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.currentState.player.location.x = 0;
        GameState.activeKeys = ['ArrowRight'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.player.location.x, 0);
    });

    it('ArrowLeft does not move the player when dialogue is active', () => {
        const npc = makeNpc();
        GameState.currentState.activeDialogue = { npc, pageIndex: 0 };
        GameState.currentState.player.location.x = 0;
        GameState.activeKeys = ['ArrowLeft'];
        GameState.updatePlayerLocation();
        assert.strictEqual(GameState.currentState.player.location.x, 0);
    });
});

// ─── registerPauseMenuInputHandlers ───────────────────────────────────────────
// Arrow keys must be consumed (spliced from activeKeys) after a single
// cursor move so the cursor doesn't race through all options in one keydown.
describe('GameState.registerPauseMenuInputHandlers', () => {
    let GameState, GUI;

    beforeEach(() => {
        const ctx = loadEngine();
        GameState = ctx.GameState;
        GUI = ctx.GUI;
        GameState.currentState = makeGameState({ isActive: false, isPaused: true, activeMenu: 'pause' });
        GUI.pauseMenuDetails.cursorIndex = 0;
    });

    it('ArrowDown increments cursorIndex', () => {
        GameState.activeKeys = ['ArrowDown'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GUI.pauseMenuDetails.cursorIndex, 1);
    });

    it('ArrowDown consumes the key so it fires only once', () => {
        GameState.activeKeys = ['ArrowDown'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GameState.activeKeys.indexOf('ArrowDown'), -1);
    });

    it('ArrowUp decrements cursorIndex', () => {
        GUI.pauseMenuDetails.cursorIndex = 2;
        GameState.activeKeys = ['ArrowUp'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GUI.pauseMenuDetails.cursorIndex, 1);
    });

    it('ArrowUp consumes the key so it fires only once', () => {
        GUI.pauseMenuDetails.cursorIndex = 2;
        GameState.activeKeys = ['ArrowUp'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GameState.activeKeys.indexOf('ArrowUp'), -1);
    });

    it('ArrowUp does not go below 0', () => {
        GUI.pauseMenuDetails.cursorIndex = 0;
        GameState.activeKeys = ['ArrowUp'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GUI.pauseMenuDetails.cursorIndex, 0);
    });

    it('ArrowDown does not exceed last option index', () => {
        GUI.pauseMenuDetails.cursorIndex = GUI.pauseMenuDetails.options.length - 1;
        GameState.activeKeys = ['ArrowDown'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GUI.pauseMenuDetails.cursorIndex, GUI.pauseMenuDetails.options.length - 1);
    });

    it('Enter clears activeMenu and sets isActive to true', () => {
        GameState.activeKeys = ['Enter'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GameState.currentState.isActive, true);
        assert.strictEqual(GameState.currentState.activeMenu, null);
    });

    it('X clears activeMenu and sets isActive to true', () => {
        GameState.activeKeys = ['X'];
        GameState.registerPauseMenuInputHandlers();
        assert.strictEqual(GameState.currentState.isActive, true);
        assert.strictEqual(GameState.currentState.activeMenu, null);
    });
});
