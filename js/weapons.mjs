import { SPRITES, drawSprite } from "./sprites.mjs";

export const WEAPON_SPRITES = {
  sword0: [
    "................",
    "..........yy....",
    ".........ywyy...",
    "........ywgwy...",
    ".......ywggwy...",
    "......ywggwy....",
    ".....ywggwy.....",
    "....kyggwy......",
    "...kuukky.......",
    "...kuuuk........",
    "....kkk.........",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  sword1: [
    "................",
    "................",
    "....yyyyy.......",
    "...ywwggyy......",
    "...ywgggwy......",
    "....ygggwy......",
    ".....kyyyy......",
    "....kuuuk.......",
    ".....kkk........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  sword2: [
    "................",
    "................",
    "................",
    "................",
    "kkkuuuyyyyyyyy..",
    ".kkuuuywwgggwy..",
    "..kkk.yyyyyyy...",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  staff0: [
    "................",
    "......chhc......",
    ".....cwhhwc.....",
    "....cwhyyhwc....",
    ".....cwhhwc.....",
    "......chhc......",
    ".......uu.......",
    ".......pu.......",
    ".......uu.......",
    ".......uu.......",
    ".......uu.......",
    "......kuuk......",
    ".....kuuuuk.....",
    "................",
    "................",
    "................",
  ],
  staff1: [
    ".....c..c.......",
    "....cwhhwc......",
    "...cwyyywc......",
    "....cwhhwc......",
    ".....chhcc......",
    ".......uu.......",
    ".......pu.......",
    ".......uu.......",
    ".......uu.......",
    ".......uu.......",
    "......kuuk......",
    ".....kuuuuk.....",
    "................",
    "................",
    "................",
    "................",
  ],
  bow0: [
    "................",
    ".....aad........",
    "....a..dd.......",
    "...aa...d.......",
    "...a....d.y.....",
    "...a....dyyy....",
    "...a....d.y.....",
    "...aa...d.......",
    "....a..dd.......",
    ".....aad........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  bow1: [
    "................",
    "....aaad........",
    "...aa..dd.......",
    "..aa....d.......",
    "..aa....dyyyy...",
    "..aa....dwwyy...",
    "..aa....dyyyy...",
    "..aa....d.......",
    "...aa..dd.......",
    "....aaad........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  arrow: [
    "................",
    "................",
    "................",
    "................",
    "yy...kuuuuuaad..",
    "ywwy.kuuuuaadd..",
    "yy...kuuuuuaad..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
};

Object.assign(SPRITES, WEAPON_SPRITES);

export const WEAPON_FRAMES = {
  knight: { idle: ["sword0"], walk: ["sword0", "sword1"], attack: ["sword1", "sword2"] },
  mage: { idle: ["staff0"], walk: ["staff0", "staff1"], attack: ["staff1"] },
  archer: { idle: ["bow0"], walk: ["bow0"], attack: ["bow1"] },
};

export function weaponFrame(classId, pose = "idle", timeMs = 0) {
  const set = WEAPON_FRAMES[classId] || WEAPON_FRAMES.knight;
  const frames = set[pose] || set.idle;
  return frames[Math.floor(timeMs / 140) % frames.length];
}

export function drawHeldWeapon(ctx, classId, pose, hx, hy, flip, now, bob = 0, item = null) {
  const look = item?.look && SPRITES[item.look] ? item.look : null;
  const frame = look || weaponFrame(classId, pose, now);
  const side = flip ? -1 : 1;
  const ox = classId === "knight" ? 24 : classId === "mage" ? 18 : 22;
  const oy = pose === "attack" ? -10 : 2;
  const swing = pose === "attack" ? Math.sin(now / 50) * 6 : 0;
  drawSprite(ctx, frame, hx + side * ox, hy + oy + bob + swing, {
    scale: 4,
    shadow: false,
    flip,
  });
}

export function weaponKeys() {
  return Object.keys(WEAPON_SPRITES);
}
