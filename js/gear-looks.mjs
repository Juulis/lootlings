import { SPRITES, paintPixels, drawSprite } from "./sprites.mjs";
import { WEAPON_SPRITES } from "./weapons.mjs";

function recolor(rows, map) {
  return rows.map((row) => row.replace(/./g, (ch) => map[ch] || ch));
}

const sword = WEAPON_SPRITES.sword0;
const staff = WEAPON_SPRITES.staff0;
const bow = WEAPON_SPRITES.bow0;

export const GEAR_SPRITES = {
  sword_iron: recolor(sword, { y: "i", g: "i" }),
  sword_blue: recolor(sword, { y: "t", g: "v", w: "c" }),
  sword_gold: sword,
  sword_star: recolor(sword, { y: "h", g: "p", w: "w" }),
  sword_flame: recolor(sword, { y: "o", g: "r", w: "y" }),
  staff_wood: recolor(staff, { c: "u", h: "a", w: "y" }),
  staff_moon: staff,
  staff_star: recolor(staff, { c: "y", h: "g", w: "w", p: "y" }),
  staff_dream: recolor(staff, { c: "p", h: "q", w: "h", p: "h" }),
  staff_sun: recolor(staff, { c: "o", h: "y", w: "w", p: "o" }),
  bow_wood: bow,
  bow_wind: recolor(bow, { a: "c", d: "t", y: "w" }),
  bow_light: recolor(bow, { a: "y", d: "g", y: "w" }),
  bow_feather: recolor(bow, { a: "m", d: "p", y: "h" }),
  bow_rainbow: recolor(bow, { a: "r", d: "v", y: "y" }),
  armor_cloth: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "....kwwwwwwk....",
    "...kwbbbbbwk....",
    "...kwbbbbbwk....",
    "...kwbbggbwk....",
    "....kwbbbbk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  armor_mage: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "....kt....tk....",
    "...ktccccctk....",
    "...ktcchcctk....",
    "...ktccccctk....",
    "....ktccctk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  armor_gold: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "....ky....yk....",
    "...kyyyyyyyk....",
    "...kyygggyyk....",
    "...kyyyyyyyk....",
    "....kyyyyyk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  armor_star: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "....kh....hk....",
    "...khhhhhhhk....",
    "...khhppphhk....",
    "...khhhhhhhk....",
    "....khhhhhk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  armor_hero: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "....ko....ok....",
    "...koooooook....",
    "...kooyyyook....",
    "...koooooook....",
    "....koooook.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  boots_hop: [
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
    "...kaak..kaak...",
    "...kaak..kaak...",
    "..kaaak.kaaak...",
    "..kkkkk.kkkkk...",
    "................",
  ],
  boots_wind: [
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
    "...kcck..kcck...",
    "...kcck..kcck...",
    "..kccck.kccck...",
    "..kkkkk.kkkkk...",
    "................",
  ],
  boots_gold: [
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
    "...kyyk..kyyk...",
    "...kyyk..kyyk...",
    "..kyyyk.kyyyk...",
    "..kkkkk.kkkkk...",
    "................",
  ],
  boots_star: [
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
    "...khhk..khhk...",
    "...khhk..khhk...",
    "..khhhk.khhhk...",
    "..kkkkk.kkkkk...",
    "................",
  ],
  boots_paw: [
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
    "...kmmk..kmmk...",
    "...kmmk..kmmk...",
    "..kmmmk.kmmmk...",
    "..kkkkk.kkkkk...",
    "................",
  ],
  charm_luck: [
    "................",
    "......kak.......",
    ".....kaak.......",
    "....kaaaak......",
    ".....kaak.......",
    "......kak.......",
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
  ],
  charm_moon: [
    "................",
    ".....kccck......",
    "....kcwwcck.....",
    "....kccccck.....",
    ".....kccck......",
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
  ],
  charm_sun: [
    "................",
    ".....kyyyk......",
    "....kywwgyk.....",
    "....kygggyk.....",
    ".....kyyyk......",
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
  ],
  charm_star: [
    "................",
    "......khk.......",
    ".....khhhk......",
    "....khhphhk.....",
    ".....khhhk......",
    "......khk.......",
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
  ],
  charm_key: [
    "................",
    ".....kyyyk......",
    ".....kywyk......",
    ".....kyyyk......",
    "......kyk.......",
    "......kyk.......",
    "......kyyk......",
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

Object.assign(SPRITES, GEAR_SPRITES);

export const WEAPON_LOOKS = {
  knight: { common: "sword_iron", magic: "sword_blue", rare: "sword_gold", epic: "sword_star", legend: "sword_flame" },
  mage: { common: "staff_wood", magic: "staff_moon", rare: "staff_star", epic: "staff_dream", legend: "staff_sun" },
  archer: { common: "bow_wood", magic: "bow_wind", rare: "bow_light", epic: "bow_feather", legend: "bow_rainbow" },
};

export const SLOT_LOOKS = {
  armor: { common: "armor_cloth", magic: "armor_mage", rare: "armor_gold", epic: "armor_star", legend: "armor_hero" },
  boots: { common: "boots_hop", magic: "boots_wind", rare: "boots_gold", epic: "boots_star", legend: "boots_paw" },
  charm: { common: "charm_luck", magic: "charm_moon", rare: "charm_sun", epic: "charm_star", legend: "charm_key" },
};

export function lookFor(item, classId = "knight") {
  if (!item) return null;
  if (item.look && SPRITES[item.look]) return item.look;
  if (item.slot === "weapon") {
    return WEAPON_LOOKS[classId]?.[item.rarity] || WEAPON_LOOKS.knight.common;
  }
  return SLOT_LOOKS[item.slot]?.[item.rarity] || null;
}

export function iconFor(item, classId, fallback) {
  return lookFor(item, classId) || fallback;
}

export function drawWornGear(ctx, hero, x, y, flip, pose, now, bob) {
  if (!hero?.gear) return;
  const side = flip ? -1 : 1;
  const armor = lookFor(hero.gear.armor, hero.classId);
  if (armor) {
    drawSprite(ctx, armor, x, y + bob - 2, { scale: 4, shadow: false, flip });
  }
  const boots = lookFor(hero.gear.boots, hero.classId);
  if (boots) {
    drawSprite(ctx, boots, x, y + bob + 4, { scale: 4, shadow: false, flip });
  }
  const charm = lookFor(hero.gear.charm, hero.classId);
  if (charm) {
    const hover = Math.sin(now / 220) * 4;
    drawSprite(ctx, charm, x + side * 22, y - 28 + hover, { scale: 3, shadow: false });
  }
}

export function gearKeys() {
  return Object.keys(GEAR_SPRITES);
}
