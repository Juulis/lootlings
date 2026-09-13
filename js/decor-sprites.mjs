/** Barnvänliga 16x16-föremål: hus, träd, sten, brunn, lykta. */
import { PALETTE, paintPixels, drawSprite } from "./sprites.mjs";

export const DECOR_SPRITES = {
  cottage: [
    "................",
    ".....krrrrk.....",
    "....krrrrrrk....",
    "...krrwwrrrrk...",
    "..krrrrrrrrrrk..",
    ".krrrrrrrrrrrrk.",
    "kkkkkkkkkkkkkkkk",
    ".kuuuuuuuuuuuuk.",
    ".kuwukuuuuuwuuk.",
    ".kuuukuuuuuuuuk.",
    ".kuuuuuuuuuuuuk.",
    ".kuuuuukkkkuuuk.",
    ".kuuuuukyykuuuk.",
    ".kkkkkkkkkkkkkk.",
    "................",
    "................",
  ],
  tree: [
    "................",
    ".....kdddkk.....",
    "...kdaaaaadk....",
    "..kdaawaaadk....",
    ".kdaaaaaaaadk...",
    ".kdaaaaaaaadk...",
    "..kdaaaaaadk....",
    "...kdaaaadk.....",
    "....kkukkk......",
    ".....kuuk.......",
    ".....kuuk.......",
    ".....kuuk.......",
    "....kuuuuk......",
    "................",
    "................",
    "................",
  ],
  bush: [
    "................",
    "................",
    "................",
    "....klllllk.....",
    "...kllallllk....",
    "..kllaaalallk...",
    "..klllllllllk...",
    "...klllllllk....",
    "....kkkkkkk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  rock: [
    "................",
    "................",
    "................",
    ".....kiiiik.....",
    "....kiwwwiiik...",
    "...kiiiiiiiiik..",
    "...kiiiiiixiik..",
    "...kixiiiiiiik..",
    "....kiiiiiiik...",
    ".....kkkkkkk....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  well: [
    "................",
    "....kiiiiiik....",
    "...kiwwcccwik...",
    "...kiccccccik...",
    "...kicvvvvvik...",
    "...kiccccccik...",
    "...kiiiiiiiik...",
    "....kuxxxuk.....",
    "....kuuuuuk.....",
    ".....kkkkk......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  sign: [
    "................",
    "....kuuuuuk.....",
    "...kuyyyyyuk....",
    "...kuywyywyk....",
    "...kuyyyyyuk....",
    "....kuuuuuk.....",
    "......kuuk......",
    "......kuuk......",
    "......kuuk......",
    "......kuuk......",
    ".....kuuuuk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  lantern: [
    "................",
    "......kkk.......",
    "......kik.......",
    ".....kyyyk......",
    "....kygggyk.....",
    "....kygwggyk....",
    "....kygggyk.....",
    ".....kyyyk......",
    "......kuk.......",
    "......kuk.......",
    ".....kuuuk......",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  crate: [
    "................",
    "................",
    "...kuuuuuuuk....",
    "...kuyyyyyuk....",
    "...kuygggyuk....",
    "...kuyyyyyuk....",
    "...kuuuuuuuk....",
    "...kukkkkkuk....",
    "...kuuuuuuuk....",
    "....kkkkkkk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  flower: [
    "................",
    "................",
    "................",
    "......kmk.......",
    ".....kmwmk......",
    "......kmk.......",
    "......kak.......",
    ".....kaak.......",
    "......kak.......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
};

export const DECOR_SCALE = {
  cottage: 5,
  tree: 4,
  bush: 3,
  rock: 3,
  well: 3,
  sign: 3,
  lantern: 3,
  crate: 3,
  chest: 3,
  column: 3,
  flower: 2,
};

export function validateDecor() {
  for (const [name, rows] of Object.entries(DECOR_SPRITES)) {
    const w = rows[0].length;
    if (rows.length !== 16 || w !== 16) throw new Error(`${name} inte 16x16`);
    for (const row of rows) {
      if (row.length !== w) throw new Error(`ojämn rad i ${name}`);
      for (const ch of row) {
        if (!(ch in PALETTE)) throw new Error(`färg ${ch} i ${name}`);
      }
    }
  }
  return Object.keys(DECOR_SPRITES);
}

export function drawDecor(ctx, kind, cx, cy, scale = 3) {
  const rows = DECOR_SPRITES[kind];
  if (!rows) {
    drawSprite(ctx, kind, cx, cy, { scale, shadow: true });
    return;
  }
  const w = 16 * scale;
  const h = 16 * scale;
  const x = Math.round(cx - w / 2);
  const y = Math.round(cy - h / 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.36, w * 0.3, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  paintPixels(ctx, rows, x, y, scale);
}
