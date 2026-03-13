/**
 * CharacterSprites.js
 *
 * Programmatic pixel-art character renderer for the player and NPCs.
 * Each character is drawn at 16 × 24 native pixels, scaled 2.5× to
 * 40 × 60 rendered pixels — matching the tileset's 16 px native grid.
 *
 * Appearance is fully data-driven: body type, hair style, clothing style,
 * and individual colours can be mixed and matched per character.
 */

var CharacterSprites = {};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

CharacterSprites.VALID_BASES          = ["male", "female"];
CharacterSprites.VALID_HAIR_STYLES    = ["short", "long", "bald"];
CharacterSprites.VALID_CLOTHING_STYLES = ["tunic", "robe", "armor"];

CharacterSprites.CHAR_NATIVE_WIDTH  = 16;
CharacterSprites.CHAR_NATIVE_HEIGHT = 24;
CharacterSprites.SCALE              = 2.5;

// ---------------------------------------------------------------------------
// Pixel-art frame data
//
// Each frame is a 24-element array of 16-character strings.
// One character = one native pixel.
//
// Colour-slot key:
//   .  transparent
//   S  skin
//   s  skin shadow / dark
//   H  hair primary
//   h  hair dark
//   E  eye
//   C  clothing primary
//   c  clothing dark / shadow
//   L  pants primary
//   l  pants dark / shadow
//   F  shoe
//   B  belt
//   O  outline / generic dark
//
// Walk frames 0–3 correspond to walk cycle [2, 0, 3, 0] (indexes into
// cycleLoop array in SceneManager).  Frame 0 is the idle/standing pose.
// ---------------------------------------------------------------------------

// -- South (front-facing) frames -------------------------------------------

/** @type {Array.<Array.<string>>} Four south-facing walk frames. */
CharacterSprites.FRAMES_SOUTH = [
    // Frame 0 — idle / standing
    [
        "....HHHHHHHH....",
        "...hHHHHHHHHh...",
        "....SSSSSSSS....",
        "....SEESSEES....",
        "....SSSSSSSS....",
        "....SSSsSSSS....",
        ".....SSSSSS.....",
        "....CCCSSCCC....",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....llll.lll....",
        "....FFFF.FFF....",
        "....FFFF.FFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 1 — walk left foot forward
    [
        "....HHHHHHHH....",
        "...hHHHHHHHHh...",
        "....SSSSSSSS....",
        "....SEESSEES....",
        "....SSSSSSSS....",
        "....SSSsSSSS....",
        ".....SSSSSS.....",
        "....CCCSSCCC....",
        "...CCCCCCCCCC...",
        "..cCCCCCCCCCCc..",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "...LLLLL.LLL....",
        "...LLLLL.LLL....",
        "....LLLL.LLL....",
        ".....LLL.LLL....",
        "....llll.lll....",
        "...FFFFF.FFF....",
        "...FFFFF.FFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 2 — mid-stride
    [
        "....HHHHHHHH....",
        "...hHHHHHHHHh...",
        "....SSSSSSSS....",
        "....SEESSEES....",
        "....SSSSSSSS....",
        "....SSSsSSSS....",
        ".....SSSSSS.....",
        "....CCCSSCCC....",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLLLLLL....",
        "....LLLLLLLL....",
        "....LLLLLLLL....",
        "....llllllll....",
        "....llllllll....",
        "....FFFFFFFF....",
        "....FFFFFFFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 3 — walk right foot forward
    [
        "....HHHHHHHH....",
        "...hHHHHHHHHh...",
        "....SSSSSSSS....",
        "....SEESSEES....",
        "....SSSSSSSS....",
        "....SSSsSSSS....",
        ".....SSSSSS.....",
        "....CCCSSCCC....",
        "...CCCCCCCCCC...",
        "..cCCCCCCCCCCc..",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLL.LLLL...",
        "....LLLL.LLLL...",
        "....LLLL.LLL....",
        "....LLLL..LL....",
        "....llll.lll....",
        "....FFF..FFFF...",
        "....FFF..FFFF...",
        "................",
        "................",
        "................"
    ]
];

// -- North (back-facing) frames --------------------------------------------

/** @type {Array.<Array.<string>>} Four north-facing walk frames. */
CharacterSprites.FRAMES_NORTH = [
    // Frame 0 — idle
    [
        "....hHHHHHHHh...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHHH..",
        "...HHHHHHHHHHH..",
        "....HHHHHHHH....",
        ".....HHHHHH.....",
        "....CCCSSCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....LLLL.LLL....",
        "....llll.lll....",
        "....FFFF.FFF....",
        "....FFFF.FFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 1 — walk left foot forward
    [
        "....hHHHHHHHh...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHHH..",
        "...HHHHHHHHHHH..",
        "....HHHHHHHH....",
        ".....HHHHHH.....",
        "....CCCSSCCCC...",
        "...CCCCCCCCCC...",
        "..cCCCCCCCCCCc..",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "...LLLLL.LLL....",
        "...LLLLL.LLL....",
        "....LLLL.LLL....",
        ".....LLL.LLL....",
        "....llll.lll....",
        "...FFFFF.FFF....",
        "...FFFFF.FFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 2 — mid-stride
    [
        "....hHHHHHHHh...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHHH..",
        "...HHHHHHHHHHH..",
        "....HHHHHHHH....",
        ".....HHHHHH.....",
        "....CCCSSCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLLLLLL....",
        "....LLLLLLLL....",
        "....LLLLLLLL....",
        "....llllllll....",
        "....llllllll....",
        "....FFFFFFFF....",
        "....FFFFFFFF....",
        "................",
        "................",
        "................"
    ],
    // Frame 3 — walk right foot forward
    [
        "....hHHHHHHHh...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHH...",
        "...HHHHHHHHHHH..",
        "...HHHHHHHHHHH..",
        "....HHHHHHHH....",
        ".....HHHHHH.....",
        "....CCCSSCCCC...",
        "...CCCCCCCCCC...",
        "..cCCCCCCCCCCc..",
        "...CCCCCCCCCC...",
        "...CCCCCCCCCC...",
        "....CCCCCCCC....",
        "....BBBBBBBB....",
        "....LLLL.LLLL...",
        "....LLLL.LLLL...",
        "....LLLL.LLL....",
        "....LLLL..LL....",
        "....llll.lll....",
        "....FFF..FFFF...",
        "....FFF..FFFF...",
        "................",
        "................",
        "................"
    ]
];

// -- East (right-facing, side profile) frames ------------------------------

/** @type {Array.<Array.<string>>} Four east-facing walk frames. */
CharacterSprites.FRAMES_EAST = [
    // Frame 0 — idle
    [
        "......HHHHH.....",
        ".....hHHHHHH....",
        ".....SSSSSSS....",
        ".....SSSESSS....",
        ".....SSSSSSS....",
        ".....SSsSSS.....",
        "......SSSSS.....",
        ".....CCCCC......",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        ".....CCCCC......",
        ".....BBBBB......",
        ".....LLLL.......",
        ".....LLLL.......",
        ".....LLLL.......",
        ".....LLLL.......",
        ".....llll.......",
        ".....FFFF.......",
        ".....FFFF.......",
        "................",
        "................",
        "................"
    ],
    // Frame 1 — walk (back leg forward)
    [
        "......HHHHH.....",
        ".....hHHHHHH....",
        ".....SSSSSSS....",
        ".....SSSESSS....",
        ".....SSSSSSS....",
        ".....SSsSSS.....",
        "......SSSSS.....",
        ".....CCCCC......",
        "....CCCCCCC.....",
        "....cCCCCCCc....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        ".....CCCCC......",
        ".....BBBBB......",
        "....LLLL.LL.....",
        "....LLLL.LL.....",
        ".....LLLL.L.....",
        ".....LLLLL......",
        "......llll......",
        "....FFFFF.......",
        "....FFFFF.......",
        "................",
        "................",
        "................"
    ],
    // Frame 2 — mid-stride
    [
        "......HHHHH.....",
        ".....hHHHHHH....",
        ".....SSSSSSS....",
        ".....SSSESSS....",
        ".....SSSSSSS....",
        ".....SSsSSS.....",
        "......SSSSS.....",
        ".....CCCCC......",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        ".....CCCCC......",
        ".....BBBBB......",
        ".....LLLLLL.....",
        ".....LLLLLL.....",
        ".....LLLLLL.....",
        ".....llllll.....",
        ".....llllll.....",
        ".....FFFFFF.....",
        ".....FFFFFF.....",
        "................",
        "................",
        "................"
    ],
    // Frame 3 — walk (front leg forward)
    [
        "......HHHHH.....",
        ".....hHHHHHH....",
        ".....SSSSSSS....",
        ".....SSSESSS....",
        ".....SSSSSSS....",
        ".....SSsSSS.....",
        "......SSSSS.....",
        ".....CCCCC......",
        "....CCCCCCC.....",
        "....cCCCCCCc....",
        "....CCCCCCC.....",
        "....CCCCCCC.....",
        ".....CCCCC......",
        ".....BBBBB......",
        "......LL.LLLL...",
        "......LL.LLLL...",
        ".....LL..LLL....",
        ".....L....LL....",
        "......l..lll....",
        ".......FFFFF....",
        ".......FFFFF....",
        "................",
        "................",
        "................"
    ]
];

// ---------------------------------------------------------------------------
// Hair-style overlay masks
//
// Each is a 24-element array of 16-char strings. A non-'.' character
// overrides the corresponding pixel in the base frame.
// Hair-slot chars from the base frame (H, h) are replaced by the overlay.
// ---------------------------------------------------------------------------

/**
 * Short hair — compact cap across top 2 rows of hair only.
 * Rows that have no override are '.' (leave base as-is).
 */
CharacterSprites.HAIR_SOUTH_SHORT = [
    "....HHHHHHHH....",  // row 0: same as base
    "...hHHHHHHHHh...",  // row 1: same as base
    "................",  // rows 2–23: no change
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

/**
 * Long hair — extends down the sides past the shoulders (rows 0–11).
 */
CharacterSprites.HAIR_SOUTH_LONG = [
    "....HHHHHHHH....",  // row 0
    "...hHHHHHHHHh...",  // row 1
    "..hHSSSSSSSSHh..",  // row 2: hair flanking face
    "..hHSSSSSSSSHh..",  // row 3
    "..hHSSSSSSSSHh..",  // row 4
    "..hHSSSSSSSSHh..",  // row 5
    "..hHSSSSSSSHh...",  // row 6: chin level
    "..hHCCCSSCCCHh.",  // row 7: hair beside collar
    "..hHCCCCCCCCHh.",  // row 8: hair beside chest
    "..hHCCCCCCCCHh.",  // row 9
    "...hHCCCCCCHh...",  // row 10: hair ends at mid-torso
    "...hHCCCCCCHh...",  // row 11
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

/**
 * Bald — no hair; skull top is skin coloured.
 * Override rows 0–1 with skin to erase hair.
 */
CharacterSprites.HAIR_SOUTH_BALD = [
    "....SSSSSSSS....",  // row 0: skin instead of hair
    "....SSSSSSSS....",  // row 1: skin instead of hair
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

// North hair overlays
CharacterSprites.HAIR_NORTH_SHORT = CharacterSprites.HAIR_SOUTH_SHORT;

CharacterSprites.HAIR_NORTH_LONG = [
    "....hHHHHHHHh...",
    "...HHHHHHHHHH...",
    "..hHHHHHHHHHHh.",
    "..hHHHHHHHHHHh.",
    "..hHHHHHHHHHHh.",
    "....HHHHHHHH....",
    ".....HHHHHH.....",
    "..hHCCCSSCCCCh.",
    "..hHCCCCCCCCCh.",
    "..hHCCCCCCCCCh.",
    "...hHCCCCCCCHh..",
    "...hHCCCCCCCHh..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

CharacterSprites.HAIR_NORTH_BALD = [
    "....SSSSSSSS....",
    "...SSSSSSSSSS...",
    "...SSSSSSSSSS...",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

// East hair overlays
CharacterSprites.HAIR_EAST_SHORT = [
    "......HHHHH.....",
    ".....hHHHHHH....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

CharacterSprites.HAIR_EAST_LONG = [
    "......HHHHH.....",
    ".....hHHHHHH....",
    "....hHSSSSSSH...",
    "....hHSSSSSSH...",
    "....hHSSSSSSH...",
    "....hHSSSSSSH...",
    ".....hHSSSSSH...",
    ".....hHCCCCC....",
    "....hHCCCCCCC...",
    "....hHCCCCCCC...",
    "....hHCCCCCCC...",
    "....hHCCCCCCC...",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

CharacterSprites.HAIR_EAST_BALD = [
    "......SSSSS.....",
    ".....SSSSSS.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
];

// ---------------------------------------------------------------------------
// Clothing-style overlays
//
// Override pixels in the torso/leg region for each clothing style.
// Tunic uses the base frame unchanged (no override rows).
// ---------------------------------------------------------------------------

/** Tunic — no modifications needed; base frame already is a tunic shape. */
CharacterSprites.CLOTHING_SOUTH_TUNIC = null;

/**
 * Robe — extends hem down, covering legs fully; no pants showing.
 */
CharacterSprites.CLOTHING_SOUTH_ROBE = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "....CCCCCCCC....",
    "....cccccccc....",  // row 13: robe hem shadow replaces belt
    "....CCCCCCCC....",  // row 14: robe covers upper legs
    "....CCCCCCCC....",
    "....CCCCCCCC....",
    "....CCCCCCCC....",
    "....cccccccc....",  // row 18: robe hem at bottom
    "....FFFFFFFF....",  // row 19: shoes still visible
    "....FFFFFFFF....",
    "................",
    "................",
    "................"
];

/**
 * Armor — adds pauldrons (wider shoulders), belt detail, greaves on legs.
 */
CharacterSprites.CLOTHING_SOUTH_ARMOR = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "..CCCCCCCCCCCC..",  // row 8: wide pauldrons (12px)
    "..cCCCCCCCCCCc..",  // row 9: pauldron shadow detail
    "...CCCCCCCCCC...",  // row 10: normal chest
    "...CCCCCCCCCC...",  // row 11
    "....cCCCCCCc....",  // row 12: belt plate detail
    "....BBBBBBBB....",  // row 13: belt
    "....LLLL.LLL....",
    "...cLLLL.LLLc...",  // row 15: greave sides
    "...cLLLL.LLLc...",  // row 16: greave
    "....LLLL.LLL....",
    "....llll.lll....",
    "....FFFF.FFF....",
    "....FFFF.FFF....",
    "................",
    "................",
    "................"
];

// Tunic for north and east are also null (base frames used as-is)
CharacterSprites.CLOTHING_NORTH_TUNIC = null;
CharacterSprites.CLOTHING_EAST_TUNIC  = null;

CharacterSprites.CLOTHING_NORTH_ROBE = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "....CCCCCCCC....",
    "....cccccccc....",
    "....CCCCCCCC....",
    "....CCCCCCCC....",
    "....CCCCCCCC....",
    "....CCCCCCCC....",
    "....cccccccc....",
    "....FFFFFFFF....",
    "....FFFFFFFF....",
    "................",
    "................",
    "................"
];

CharacterSprites.CLOTHING_NORTH_ARMOR = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "..CCCCCCCCCCCC..",
    "..cCCCCCCCCCCc..",
    "...CCCCCCCCCC...",
    "...CCCCCCCCCC...",
    "....cCCCCCCc....",
    "....BBBBBBBB....",
    "....LLLL.LLL....",
    "...cLLLL.LLLc...",
    "...cLLLL.LLLc...",
    "....LLLL.LLL....",
    "....llll.lll....",
    "....FFFF.FFF....",
    "....FFFF.FFF....",
    "................",
    "................",
    "................"
];

CharacterSprites.CLOTHING_EAST_ROBE = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "....CCCCCCC.....",
    "....CCCCCCC.....",
    "....CCCCCCC.....",
    "....CCCCCCC.....",
    ".....CCCCC......",
    ".....ccccc......",
    ".....CCCCC......",
    ".....CCCCC......",
    ".....CCCCC......",
    ".....CCCCC......",
    ".....ccccc......",
    ".....FFFFF......",
    ".....FFFFF......",
    "................",
    "................",
    "................"
];

CharacterSprites.CLOTHING_EAST_ARMOR = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "...CCCCCCC......",
    "...cCCCCCCc.....",
    "....CCCCCCC.....",
    "....CCCCCCC.....",
    ".....cCCCCc.....",
    ".....BBBBB......",
    ".....LLLL.......",
    "....cLLLLc......",
    "....cLLLLc......",
    ".....LLLL.......",
    ".....llll.......",
    ".....FFFF.......",
    ".....FFFF.......",
    "................",
    "................",
    "................"
];

// ---------------------------------------------------------------------------
// Female body variant overrides
//
// The female base differs from male only in shoulder / hip proportions.
// We patch the relevant rows after assembling the final frame.
// ---------------------------------------------------------------------------

/** Row indices where female body differs from male (torso row 8 = narrower shoulders). */
CharacterSprites.FEMALE_BODY_OVERRIDES_SOUTH = {
    8:  "....CCCCCCCC....",   // narrower shoulders
    9:  "....CCCCCCCC....",
    12: "...CCCCCCCCCC...",   // slightly wider hips
    13: "...BBBBBBBBBB..."    // belt follows hips
};

CharacterSprites.FEMALE_BODY_OVERRIDES_NORTH = {
    8:  "....CCCCCCCC....",
    9:  "....CCCCCCCC....",
    12: "...CCCCCCCCCC...",
    13: "...BBBBBBBBBB..."
};

CharacterSprites.FEMALE_BODY_OVERRIDES_EAST = {};  // east profile looks the same

// ---------------------------------------------------------------------------
// Colour resolution helpers
// ---------------------------------------------------------------------------

/**
 * Returns a slightly darkened version of a hex colour string.
 * Used for shadow/dark slots (s, h, c, l) derived from the primary colour.
 * @param {string} hex - Hex colour string e.g. "#RRGGBB"
 * @returns {string} Darkened hex colour
 */
CharacterSprites.darken = function(hex){
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, Math.floor(r * 0.65));
    g = Math.max(0, Math.floor(g * 0.65));
    b = Math.max(0, Math.floor(b * 0.65));
    return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
};

/**
 * Builds the colour map used when rendering a character frame.
 * @param {Object} appearance - Appearance config object
 * @returns {Object} Map from colour-slot char to CSS colour string
 */
CharacterSprites.buildColourMap = function(appearance){
    return {
        "S": appearance.skinColor    || "#F4C4A1",
        "s": CharacterSprites.darken(appearance.skinColor    || "#F4C4A1"),
        "H": appearance.hairColor    || "#3D2B1F",
        "h": CharacterSprites.darken(appearance.hairColor    || "#3D2B1F"),
        "E": "#1A1A1A",
        "C": appearance.clothingColor  || "#5B7A4E",
        "c": CharacterSprites.darken(appearance.clothingColor  || "#5B7A4E"),
        "L": appearance.pantsColor   || "#3A3028",
        "l": CharacterSprites.darken(appearance.pantsColor   || "#3A3028"),
        "F": appearance.shoeColor    || "#2A1A10",
        "B": "#3A2A18"
    };
};

// ---------------------------------------------------------------------------
// Frame assembly
// ---------------------------------------------------------------------------

/**
 * Applies an overlay mask to a base frame.
 * Where the overlay row contains a non-'.' character, it replaces the
 * corresponding character in the base row.
 * @param {Array.<string>} base    - 24-element frame string array
 * @param {Array.<string>} overlay - 24-element overlay string array (or null)
 * @returns {Array.<string>} New assembled frame
 */
CharacterSprites.applyOverlay = function(base, overlay){
    if (!overlay){ return base; }
    var result = [];
    for (var row = 0; row < base.length; row++){
        var baseRow    = base[row];
        var overlayRow = overlay[row];
        if (!overlayRow){
            result.push(baseRow);
            continue;
        }
        var newRow = "";
        for (var col = 0; col < baseRow.length; col++){
            var oc = overlayRow[col];
            newRow += (oc && oc !== ".") ? oc : baseRow[col];
        }
        result.push(newRow);
    }
    return result;
};

/**
 * Applies female body row overrides to an assembled frame.
 * @param {Array.<string>} frame    - Assembled frame string array
 * @param {Object}         overrides - Row-index to replacement-string map
 * @returns {Array.<string>} Frame with female proportions
 */
CharacterSprites.applyFemaleOverrides = function(frame, overrides){
    if (!overrides || !Object.keys(overrides).length){ return frame; }
    var result = frame.slice();
    for (var row in overrides){
        result[Number(row)] = overrides[row];
    }
    return result;
};

/**
 * Selects the base frame set for the given direction.
 * @param {string} direction - "N" | "S" | "E" | "W"
 * @returns {Array.<Array.<string>>}
 */
CharacterSprites.getBaseFrames = function(direction){
    if (direction === "N")               { return CharacterSprites.FRAMES_NORTH; }
    if (direction === "E" || direction === "W") { return CharacterSprites.FRAMES_EAST; }
    return CharacterSprites.FRAMES_SOUTH;
};

/**
 * Selects the hair overlay for the given style and direction.
 * @param {string} hairStyle - "short" | "long" | "bald"
 * @param {string} direction
 * @returns {Array.<string>|null}
 */
CharacterSprites.getHairOverlay = function(hairStyle, direction){
    var dir = (direction === "W") ? "E" : direction;
    if (dir === "N"){
        if (hairStyle === "short") { return CharacterSprites.HAIR_NORTH_SHORT; }
        if (hairStyle === "long")  { return CharacterSprites.HAIR_NORTH_LONG;  }
        if (hairStyle === "bald")  { return CharacterSprites.HAIR_NORTH_BALD;  }
    }
    if (dir === "E"){
        if (hairStyle === "short") { return CharacterSprites.HAIR_EAST_SHORT; }
        if (hairStyle === "long")  { return CharacterSprites.HAIR_EAST_LONG;  }
        if (hairStyle === "bald")  { return CharacterSprites.HAIR_EAST_BALD;  }
    }
    // South (default)
    if (hairStyle === "short") { return CharacterSprites.HAIR_SOUTH_SHORT; }
    if (hairStyle === "long")  { return CharacterSprites.HAIR_SOUTH_LONG;  }
    if (hairStyle === "bald")  { return CharacterSprites.HAIR_SOUTH_BALD;  }
    return null;
};

/**
 * Selects the clothing overlay for the given style and direction.
 * @param {string} clothingStyle - "tunic" | "robe" | "armor"
 * @param {string} direction
 * @returns {Array.<string>|null}
 */
CharacterSprites.getClothingOverlay = function(clothingStyle, direction){
    var dir = (direction === "W") ? "E" : direction;
    if (dir === "N"){
        if (clothingStyle === "robe")  { return CharacterSprites.CLOTHING_NORTH_ROBE;  }
        if (clothingStyle === "armor") { return CharacterSprites.CLOTHING_NORTH_ARMOR; }
        return null;  // tunic
    }
    if (dir === "E"){
        if (clothingStyle === "robe")  { return CharacterSprites.CLOTHING_EAST_ROBE;  }
        if (clothingStyle === "armor") { return CharacterSprites.CLOTHING_EAST_ARMOR; }
        return null;  // tunic
    }
    // South
    if (clothingStyle === "robe")  { return CharacterSprites.CLOTHING_SOUTH_ROBE;  }
    if (clothingStyle === "armor") { return CharacterSprites.CLOTHING_SOUTH_ARMOR; }
    return null;  // tunic
};

/**
 * Selects the female body override map for the given direction.
 * @param {string} direction
 * @returns {Object}
 */
CharacterSprites.getFemaleOverrides = function(direction){
    if (direction === "N")               { return CharacterSprites.FEMALE_BODY_OVERRIDES_NORTH; }
    if (direction === "E" || direction === "W") { return CharacterSprites.FEMALE_BODY_OVERRIDES_EAST; }
    return CharacterSprites.FEMALE_BODY_OVERRIDES_SOUTH;
};

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Draws a pixel-art character at (x, y) on the given canvas context.
 * Each native pixel is rendered as a (SCALE × SCALE) filled rectangle.
 *
 * @param {CanvasRenderingContext2D} ctx       - Canvas 2D context
 * @param {number}                  x         - Left edge in canvas pixels
 * @param {number}                  y         - Top edge in canvas pixels
 * @param {Object}                  appearance - Appearance config (see module header)
 * @param {string}                  direction  - "N" | "S" | "E" | "W"
 * @param {number}                  walkFrame  - 0–3 walk cycle frame index
 */
CharacterSprites.renderCharacter = function(ctx, x, y, appearance, direction, walkFrame){
    var scale       = CharacterSprites.SCALE;
    var frameIndex  = (walkFrame || 0) % 4;
    var baseFrames  = CharacterSprites.getBaseFrames(direction);
    var frame       = baseFrames[frameIndex].slice();  // copy

    // Apply hair overlay
    var hairOverlay = CharacterSprites.getHairOverlay(
        (appearance && appearance.hairStyle) || "short",
        direction
    );
    frame = CharacterSprites.applyOverlay(frame, hairOverlay);

    // Apply clothing overlay
    var clothingOverlay = CharacterSprites.getClothingOverlay(
        (appearance && appearance.clothing) || "tunic",
        direction
    );
    frame = CharacterSprites.applyOverlay(frame, clothingOverlay);

    // Apply female body proportions if requested
    if (appearance && appearance.base === "female"){
        frame = CharacterSprites.applyFemaleOverrides(
            frame,
            CharacterSprites.getFemaleOverrides(direction)
        );
    }

    var colourMap = CharacterSprites.buildColourMap(appearance || {});
    var mirrorX   = (direction === "W");

    for (var row = 0; row < frame.length; row++){
        var rowStr = frame[row];
        for (var col = 0; col < rowStr.length; col++){
            var ch = rowStr[col];
            if (ch === "."){ continue; }
            var colour = colourMap[ch];
            if (!colour){ continue; }

            // Mirror horizontally for west-facing
            var drawCol = mirrorX ? (rowStr.length - 1 - col) : col;

            ctx.fillStyle = colour;
            ctx.fillRect(
                x + drawCol * scale,
                y + row    * scale,
                scale,
                scale
            );
        }
    }
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Returns true when the appearance object contains all required fields
 * with valid enumerated values.
 * @param {Object} appearance
 * @returns {boolean}
 */
CharacterSprites.isValidAppearance = function(appearance){
    if (!appearance){ return false; }
    if (CharacterSprites.VALID_BASES.indexOf(appearance.base) === -1)                  { return false; }
    if (CharacterSprites.VALID_HAIR_STYLES.indexOf(appearance.hairStyle) === -1)       { return false; }
    if (CharacterSprites.VALID_CLOTHING_STYLES.indexOf(appearance.clothing) === -1)    { return false; }
    if (typeof appearance.skinColor    !== "string"){ return false; }
    if (typeof appearance.hairColor    !== "string"){ return false; }
    if (typeof appearance.clothingColor !== "string"){ return false; }
    if (typeof appearance.pantsColor   !== "string"){ return false; }
    if (typeof appearance.shoeColor    !== "string"){ return false; }
    return true;
};
