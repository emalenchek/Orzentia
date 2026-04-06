#!/usr/bin/env python3
"""
Generate Orzentia player spritesheet — Hero / Adventurer style.

Frame size : 22 × 32 px
Columns    : 0=W  1=S  2=N  3=E   (matches SceneManager rotation values)
Rows       : 0=stand  1=stand(dup)  2=walk_a  3=walk_b
             (matches playerWalkCycleLoop = [2, 0, 3, 0])
"""

from PIL import Image
import os

FW, FH = 22, 32
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'spritesheets',
                   'heroSprites.png')

sheet = Image.new('RGBA', (FW * 4, FH * 4), (0, 0, 0, 0))

# ── Palette — earthy fantasy tones matching the Orzentia overworld ─────────────
T   = (  0,   0,   0,   0)   # transparent
OL  = ( 18,  10,   5, 255)   # near-black outline
SK  = (238, 185, 125, 255)   # skin
SKD = (195, 145,  88, 255)   # skin shadow / nostrils / mouth
HR  = ( 52,  28,  12, 255)   # dark hair
HRL = ( 82,  52,  24, 255)   # hair highlight
EY  = ( 28,  18,   8, 255)   # eyes
TN  = ( 58, 118,  52, 255)   # tunic green
TND = ( 38,  82,  36, 255)   # tunic shadow
TNL = ( 92, 152,  78, 255)   # tunic highlight
PT  = ( 72,  48,  25, 255)   # pants brown
PTD = ( 48,  30,  12, 255)   # pants dark
BT  = ( 38,  20,   8, 255)   # boot dark
BTH = ( 60,  38,  16, 255)   # boot highlight
BL  = (102,  74,  28, 255)   # belt tan
SC  = (158,  42,  42, 255)   # scarf red (small accent)

# ── Drawing helpers ────────────────────────────────────────────────────────────
def px(col, row, x, y, c):
    if 0 <= x < FW and 0 <= y < FH and c[3] > 0:
        sheet.putpixel((col * FW + x, row * FH + y), c)

def hline(col, row, x1, x2, y, c):
    for x in range(x1, x2 + 1):
        px(col, row, x, y, c)

def vline(col, row, x, y1, y2, c):
    for y in range(y1, y2 + 1):
        px(col, row, x, y, c)

def rect(col, row, x1, y1, x2, y2, c):
    for y in range(y1, y2 + 1):
        hline(col, row, x1, x2, y, c)


# ══════════════════════════════════════════════════════════════════════════════
# SOUTH  (col 1) — facing camera
# ══════════════════════════════════════════════════════════════════════════════
#
#  22 wide (x: 0-21)  32 tall (y: 0-31)
#  Character is center-ish; head at y=2..9, body y=10..18, legs y=19..31
#
#         6789012345   (x)
#   y=2:  ..HHHHHH..
#   y=3:  .HSSSSSSH.
#   y=4:  .HSEESSSH.    E=eyes
#   y=5:  .HSSSSSSH.
#   y=6:  .HSSMSSH..    M=mouth hint
#   y=7:  ..HHHHHH..
#   y=8:  ...SSSS...    neck
#   y=9:  ..RRRRRRR.    scarf/collar
#   y=10: .TTTTTTTTT.   tunic
#   ...
#   y=18: .WWWWWWWWW.   belt
#   y=19-25: legs
#   y=26-31: boots

def south_head(col, row):
    # Hair
    hline(col, row,  8, 13,  2, HR)   # top of hair
    hline(col, row,  7, 14,  3, HR)   # hair row 2
    px(col, row,  7,  4, HR)          # left hair side
    px(col, row, 14,  4, HR)          # right hair side
    px(col, row,  7,  5, HR)
    px(col, row, 14,  5, HR)
    px(col, row,  7,  6, HR)
    px(col, row, 14,  6, HR)
    hline(col, row,  7, 14,  7, HR)   # chin / bottom
    # Hair highlight
    px(col, row,  9,  3, HRL)
    px(col, row, 10,  3, HRL)
    # Face skin
    for y in range(4, 7):
        hline(col, row, 8, 13, y, SK)
    # Eyes (row y=4)
    px(col, row,  9,  4, EY)
    px(col, row, 10,  4, EY)
    px(col, row, 12,  4, EY)
    px(col, row, 13,  4, EY)
    # Nose (subtle, y=5)
    px(col, row, 11,  5, SKD)
    # Mouth / chin (y=6)
    hline(col, row,  8, 13,  6, SK)
    px(col, row, 10,  6, SKD)
    px(col, row, 11,  6, SKD)
    px(col, row, 12,  6, SKD)
    # Neck
    hline(col, row, 9, 12,  8, SK)


def south_body(col, row):
    # Scarf/collar accent
    hline(col, row,  8, 13,  9, SC)
    # Tunic
    rect(col, row, 6, 10, 15, 17, TN)
    # Shadow sides
    vline(col, row,  6, 10, 17, TND)
    vline(col, row, 15, 10, 17, TND)
    hline(col, row,  6, 15, 17, TND)  # shadow bottom
    # Highlight centre
    vline(col, row, 10, 10, 14, TNL)
    vline(col, row, 11, 10, 14, TNL)
    # Arms (one pixel wider each side)
    for y in range(11, 17):
        px(col, row,  5, y, TN)
        px(col, row, 16, y, TN)
    # Belt
    hline(col, row,  5, 16, 18, BL)
    px(col, row, 10, 18, BTH)   # buckle
    px(col, row, 11, 18, BTH)


def south_legs(col, row, lx=5, rx=12):
    """Draw legs and boots. lx=left-leg x-start, rx=right-leg x-start."""
    # Pants
    rect(col, row, lx,     19, lx + 4, 25, PT)
    rect(col, row, rx,     19, rx + 4, 25, PT)
    vline(col, row, lx,     19, 25, PTD)   # inner shadow left
    vline(col, row, rx + 4, 19, 25, PTD)   # inner shadow right
    # Boots
    rect(col, row, lx - 1, 26, lx + 5, 31, BT)
    rect(col, row, rx - 1, 26, rx + 5, 31, BT)
    hline(col, row, lx,     lx + 3, 26, BTH)   # toe highlight left
    hline(col, row, rx,     rx + 3, 26, BTH)    # toe highlight right


def draw_south(col, row, lx=5, rx=12):
    south_head(col, row)
    south_body(col, row)
    south_legs(col, row, lx, rx)


# ── South frames ──────────────────────────────────────────────────────────────
draw_south(1, 0)                   # row 0  stand
draw_south(1, 1)                   # row 1  stand (duplicate, keeps things safe)
draw_south(1, 2, lx=4, rx=12)     # row 2  walk_a  — left leg forward
draw_south(1, 3, lx=6, rx=13)     # row 3  walk_b  — right leg forward


# ══════════════════════════════════════════════════════════════════════════════
# NORTH  (col 2) — back to camera, mostly hair + back of tunic
# ══════════════════════════════════════════════════════════════════════════════

def north_head(col, row):
    # Back of hair — fills most of head area
    rect(col, row, 7, 2, 14, 8, HR)
    # Small highlight
    px(col, row,  9, 3, HRL)
    px(col, row, 10, 3, HRL)
    px(col, row, 11, 3, HRL)
    # Neck (darker, back)
    hline(col, row, 9, 12, 8, SKD)


def north_body(col, row):
    # Scarf back
    hline(col, row, 8, 13, 9, SC)
    # Tunic back
    rect(col, row, 6, 10, 15, 17, TN)
    # Shadow
    vline(col, row,  6, 10, 17, TND)
    vline(col, row, 15, 10, 17, TND)
    hline(col, row,  6, 15, 17, TND)
    # Arms
    for y in range(11, 17):
        px(col, row,  5, y, TN)
        px(col, row, 16, y, TN)
    # Belt
    hline(col, row, 5, 16, 18, BL)
    px(col, row, 10, 18, BTH)
    px(col, row, 11, 18, BTH)


def draw_north(col, row, lx=5, rx=12):
    north_head(col, row)
    north_body(col, row)
    south_legs(col, row, lx, rx)   # legs look the same from behind


draw_north(2, 0)
draw_north(2, 1)
draw_north(2, 2, lx=4, rx=12)
draw_north(2, 3, lx=6, rx=13)


# ══════════════════════════════════════════════════════════════════════════════
# EAST  (col 3) — right-side profile
# ══════════════════════════════════════════════════════════════════════════════
#
# Slimmer silhouette; only right side of face visible.
# Body is ~8px wide, centred around x=10-11.

def east_head(col, row):
    # Hair (back + top)
    hline(col, row,  8, 14,  2, HR)
    hline(col, row,  8, 14,  3, HR)
    px(col, row,  8,  4, HR)
    px(col, row,  8,  5, HR)
    px(col, row,  8,  6, HR)
    hline(col, row,  8, 14,  7, HR)
    # Hair highlight
    px(col, row, 10, 3, HRL)
    # Face (right side only, x=9..13)
    for y in range(3, 7):
        hline(col, row, 9, 13, y, SK)
    # Eye (right side, one eye)
    px(col, row, 12, 4, EY)
    px(col, row, 13, 4, EY)
    # Nose tip (front of face)
    px(col, row, 13, 5, SKD)
    # Mouth
    px(col, row, 12, 6, SKD)
    px(col, row, 13, 6, SKD)
    # Neck
    hline(col, row, 10, 13, 8, SK)


def east_body(col, row):
    # Scarf (side view, just one pixel strip on face side)
    hline(col, row, 9, 13, 9, SC)
    # Tunic side (8-9 wide)
    rect(col, row, 8, 10, 14, 17, TN)
    vline(col, row,  8, 10, 17, TND)   # back shadow
    vline(col, row, 14, 10, 17, TND)   # front shadow
    hline(col, row,  8, 14, 17, TND)
    # Highlight (facing right, so right side is lit)
    vline(col, row, 13, 10, 14, TNL)
    # Belt
    hline(col, row, 8, 14, 18, BL)
    px(col, row, 11, 18, BTH)


def east_legs(col, row, leg_offset=0):
    """Profile legs — one behind the other. leg_offset shifts front leg."""
    # Back leg (left in world-space, darker)
    rect(col, row, 8, 19, 12, 25, PTD)
    # Front leg (right in world-space, normal colour)
    front_x = 9 + leg_offset
    rect(col, row, front_x, 19, front_x + 4, 25, PT)
    vline(col, row, front_x + 4, 19, 25, PTD)
    # Back boot
    rect(col, row, 7, 26, 12, 31, BT)
    # Front boot
    rect(col, row, front_x - 1, 26, front_x + 5, 31, BT)
    hline(col, row, front_x, front_x + 3, 26, BTH)


def draw_east(col, row, leg_offset=0):
    east_head(col, row)
    east_body(col, row)
    east_legs(col, row, leg_offset)


draw_east(3, 0)
draw_east(3, 1)
draw_east(3, 2, leg_offset=-2)   # walk_a: front leg forward
draw_east(3, 3, leg_offset= 2)   # walk_b: front leg back


# ══════════════════════════════════════════════════════════════════════════════
# WEST  (col 0) — left-side profile (mirror of East)
# ══════════════════════════════════════════════════════════════════════════════

def mirror_col(col_src, col_dst):
    """Mirror all pixels from col_src into col_dst horizontally."""
    for row in range(4):
        for y in range(FH):
            for x in range(FW):
                c = sheet.getpixel((col_src * FW + x, row * FH + y))
                sheet.putpixel((col_dst * FW + (FW - 1 - x), row * FH + y), c)


mirror_col(col_src=3, col_dst=0)


# ══════════════════════════════════════════════════════════════════════════════
# Save
# ══════════════════════════════════════════════════════════════════════════════
os.makedirs(os.path.dirname(OUT), exist_ok=True)
sheet.save(OUT)
print(f"Saved {FW*4}x{FH*4} spritesheet to {OUT}")
