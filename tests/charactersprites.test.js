'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./helpers/setup');

// Load the engine once — CharacterSprites has no mutable state to reset.
let ctx;
before(() => {
    ctx = loadEngine();
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('CharacterSprites constants', () => {
    it('VALID_BASES contains exactly male and female', () => {
        const bases = ctx.CharacterSprites.VALID_BASES;
        assert.ok(Array.isArray(bases));
        assert.strictEqual(bases.length, 2);
        assert.ok(bases.indexOf('male')   !== -1);
        assert.ok(bases.indexOf('female') !== -1);
    });

    it('VALID_HAIR_STYLES contains short, long, bald', () => {
        const styles = ctx.CharacterSprites.VALID_HAIR_STYLES;
        assert.ok(Array.isArray(styles));
        assert.strictEqual(styles.length, 3);
        assert.ok(styles.indexOf('short') !== -1);
        assert.ok(styles.indexOf('long')  !== -1);
        assert.ok(styles.indexOf('bald')  !== -1);
    });

    it('VALID_CLOTHING_STYLES contains tunic, robe, armor', () => {
        const styles = ctx.CharacterSprites.VALID_CLOTHING_STYLES;
        assert.ok(Array.isArray(styles));
        assert.strictEqual(styles.length, 3);
        assert.ok(styles.indexOf('tunic') !== -1);
        assert.ok(styles.indexOf('robe')  !== -1);
        assert.ok(styles.indexOf('armor') !== -1);
    });

    it('CHAR_NATIVE_WIDTH * SCALE equals rendered tile width (40)', () => {
        const rendered = ctx.CharacterSprites.CHAR_NATIVE_WIDTH * ctx.CharacterSprites.SCALE;
        assert.strictEqual(rendered, 40);
    });

    it('CHAR_NATIVE_HEIGHT * SCALE equals 60', () => {
        const rendered = ctx.CharacterSprites.CHAR_NATIVE_HEIGHT * ctx.CharacterSprites.SCALE;
        assert.strictEqual(rendered, 60);
    });
});

// ---------------------------------------------------------------------------
// Frame data integrity
// ---------------------------------------------------------------------------

describe('CharacterSprites frame data', () => {
    function assertFrameSet(name, frames) {
        assert.ok(Array.isArray(frames), `${name} should be an array`);
        assert.strictEqual(frames.length, 4, `${name} should have 4 frames`);
        for (var i = 0; i < frames.length; i++) {
            var frame = frames[i];
            assert.ok(Array.isArray(frame), `${name}[${i}] should be an array`);
            assert.strictEqual(frame.length, 24, `${name}[${i}] should have 24 rows`);
            for (var row = 0; row < frame.length; row++) {
                assert.strictEqual(
                    frame[row].length,
                    16,
                    `${name}[${i}] row ${row} should be 16 chars wide, got "${frame[row]}"`
                );
            }
        }
    }

    it('FRAMES_SOUTH has 4 frames of 24×16', () => {
        assertFrameSet('FRAMES_SOUTH', ctx.CharacterSprites.FRAMES_SOUTH);
    });

    it('FRAMES_NORTH has 4 frames of 24×16', () => {
        assertFrameSet('FRAMES_NORTH', ctx.CharacterSprites.FRAMES_NORTH);
    });

    it('FRAMES_EAST has 4 frames of 24×16', () => {
        assertFrameSet('FRAMES_EAST', ctx.CharacterSprites.FRAMES_EAST);
    });
});

// ---------------------------------------------------------------------------
// isValidAppearance
// ---------------------------------------------------------------------------

describe('CharacterSprites.isValidAppearance', () => {
    const validAppearance = {
        base: 'male',
        hairStyle: 'short',
        hairColor: '#3D2B1F',
        clothing: 'tunic',
        clothingColor: '#5B7A4E',
        pantsColor: '#3A3028',
        skinColor: '#F4C4A1',
        shoeColor: '#2A1A10'
    };

    it('returns true for a fully valid appearance', () => {
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(validAppearance), true);
    });

    it('returns true for female / long / robe combination', () => {
        const a = Object.assign({}, validAppearance, {
            base: 'female',
            hairStyle: 'long',
            clothing: 'robe'
        });
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), true);
    });

    it('returns true for male / bald / armor combination', () => {
        const a = Object.assign({}, validAppearance, {
            base: 'male',
            hairStyle: 'bald',
            clothing: 'armor'
        });
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), true);
    });

    it('returns false for invalid base', () => {
        const a = Object.assign({}, validAppearance, { base: 'goblin' });
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), false);
    });

    it('returns false for invalid hairStyle', () => {
        const a = Object.assign({}, validAppearance, { hairStyle: 'mohawk' });
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), false);
    });

    it('returns false for invalid clothing', () => {
        const a = Object.assign({}, validAppearance, { clothing: 'cloak' });
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), false);
    });

    it('returns false when skinColor is missing', () => {
        const a = Object.assign({}, validAppearance);
        delete a.skinColor;
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(a), false);
    });

    it('returns false when passed null', () => {
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(null), false);
    });

    it('returns false when passed undefined', () => {
        assert.strictEqual(ctx.CharacterSprites.isValidAppearance(undefined), false);
    });
});

// ---------------------------------------------------------------------------
// Player and NPC appearance data
// ---------------------------------------------------------------------------

describe('Player and NPC appearance data', () => {
    it('player newStateTemplate has a valid appearance', () => {
        const appearance = ctx.GameState.newStateTemplate.player.appearance;
        assert.strictEqual(
            ctx.CharacterSprites.isValidAppearance(appearance),
            true,
            'player template appearance should be valid'
        );
    });

    it('player newStateTemplate has updated width of 40', () => {
        assert.strictEqual(ctx.GameState.newStateTemplate.player.width, 40);
    });

    it('player newStateTemplate has updated height of 60', () => {
        assert.strictEqual(ctx.GameState.newStateTemplate.player.height, 60);
    });

    it('all 6 village NPCs have valid appearances', () => {
        const npcs = ctx.GameState.villageNpcDefinitions;
        assert.strictEqual(npcs.length, 6, 'should have 6 village NPC definitions');
        for (var i = 0; i < npcs.length; i++) {
            assert.strictEqual(
                ctx.CharacterSprites.isValidAppearance(npcs[i].appearance),
                true,
                `NPC "${npcs[i].name}" should have a valid appearance`
            );
        }
    });

    it('all 6 village NPCs have width 40 and height 60', () => {
        const npcs = ctx.GameState.villageNpcDefinitions;
        for (var i = 0; i < npcs.length; i++) {
            assert.strictEqual(npcs[i].width,  40, `${npcs[i].name} width`);
            assert.strictEqual(npcs[i].height, 60, `${npcs[i].name} height`);
        }
    });

    it('NPCs have distinct appearances (not all identical)', () => {
        const npcs = ctx.GameState.villageNpcDefinitions;
        const signatures = npcs.map(n => n.appearance.base + '|' + n.appearance.hairStyle + '|' + n.appearance.clothing);
        const unique = new Set(signatures);
        assert.ok(unique.size > 1, 'village NPCs should have varied appearances');
    });
});

// ---------------------------------------------------------------------------
// darken helper
// ---------------------------------------------------------------------------

describe('CharacterSprites.darken', () => {
    it('darkens a hex colour string', () => {
        const result = ctx.CharacterSprites.darken('#ffffff');
        assert.ok(result !== '#ffffff', 'should return a different colour');
        assert.ok(result.startsWith('#'), 'should return a hex string');
        assert.strictEqual(result.length, 7, 'should return a 7-char hex string');
    });

    it('returns #000000 for #000000', () => {
        assert.strictEqual(ctx.CharacterSprites.darken('#000000'), '#000000');
    });
});

// ---------------------------------------------------------------------------
// applyOverlay
// ---------------------------------------------------------------------------

describe('CharacterSprites.applyOverlay', () => {
    it('returns base unchanged when overlay is null', () => {
        const base = ctx.CharacterSprites.FRAMES_SOUTH[0];
        const result = ctx.CharacterSprites.applyOverlay(base, null);
        assert.strictEqual(result, base);
    });

    it('overrides non-dot chars from overlay into base', () => {
        const base    = ['AAAAAAAAAAAAAAAA'];
        const overlay = ['....BBBB........'];
        const result  = ctx.CharacterSprites.applyOverlay(base, overlay);
        assert.strictEqual(result[0], 'AAAABBBBAAAAAAAA');
    });

    it('leaves base chars unchanged where overlay is dot', () => {
        const base    = ['CCCCCCCCCCCCCCCC'];
        const overlay = ['................'];
        const result  = ctx.CharacterSprites.applyOverlay(base, overlay);
        assert.strictEqual(result[0], 'CCCCCCCCCCCCCCCC');
    });
});

// ---------------------------------------------------------------------------
// SceneManager dimension constants
// ---------------------------------------------------------------------------

describe('SceneManager character dimension constants', () => {
    it('PLAYER_WIDTH is 40', () => {
        assert.strictEqual(ctx.SceneManager.PLAYER_WIDTH, 40);
    });

    it('PLAYER_HEIGHT is 60', () => {
        assert.strictEqual(ctx.SceneManager.PLAYER_HEIGHT, 60);
    });

    it('PLAYER_SPRITE_WIDTH is 16', () => {
        assert.strictEqual(ctx.SceneManager.PLAYER_SPRITE_WIDTH, 16);
    });

    it('PLAYER_SPRITE_HEIGHT is 24', () => {
        assert.strictEqual(ctx.SceneManager.PLAYER_SPRITE_HEIGHT, 24);
    });
});
