import { lookFor } from "./gear-looks.mjs";

export const RARITIES = [
  { id: "common", name: "Vanlig", color: "#9aa7b5", weight: 54, statMul: 1 },
  { id: "magic", name: "Magisk", color: "#3d8bfd", weight: 28, statMul: 1.25 },
  { id: "rare", name: "Sällsynt", color: "#f4c430", weight: 12, statMul: 1.55 },
  { id: "epic", name: "Episk", color: "#c084fc", weight: 5, statMul: 2 },
  { id: "legend", name: "Legend", color: "#ff8a3d", weight: 1, statMul: 2.6 },
];

export const SLOTS = ["weapon", "armor", "boots", "charm"];

const NAMES = {
  weapon: {
    knight: ["Solsvärd", "Sköldklubba", "Stjärnyxa", "Hjältehammare"],
    mage: ["Glitterscepter", "Månstav", "Stjärnstav", "Drömstav"],
    archer: ["Regnbågsbåge", "Vindpilbåge", "Ljusslunga", "Fjäderbåge"],
  },
  armor: ["Molnkappa", "Stjärnskjorta", "Hjälterustning", "Glimmerskjort"],
  boots: ["Hoppskor", "Vindskor", "Guldskor", "Mjuktassar"],
  charm: ["Lyckosten", "Solmedalj", "Månsten", "Guldnyckel"],
};

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

export function rollRarity(rng, luck = 0) {
  const bump = Math.min(18, luck * 2);
  const bag = RARITIES.map((r, i) => ({
    ...r,
    weight: Math.max(1, r.weight + (i - 1) * bump * 0.15),
  }));
  const total = bag.reduce((s, r) => s + r.weight, 0);
  let n = rng() * total;
  for (const r of bag) {
    n -= r.weight;
    if (n <= 0) return r;
  }
  return bag[0];
}

export function createItem({ slot, classId = "knight", level = 1, rng = Math.random, luck = 0 }) {
  const rarity = rollRarity(rng, luck);
  const base = 4 + level * 2;
  const roll = 0.85 + rng() * 0.3;
  const power = Math.max(1, Math.round(base * rarity.statMul * roll));
  const namePool =
    slot === "weapon" ? NAMES.weapon[classId] || NAMES.weapon.knight : NAMES[slot];
  const item = {
    id: `${slot}-${Date.now()}-${Math.floor(rng() * 1e6)}`,
    slot,
    name: pick(namePool, rng),
    rarity: rarity.id,
    rarityName: rarity.name,
    color: rarity.color,
    power,
    level,
    classId,
  };
  item.look = lookFor(item, classId);
  return item;
}

export function compareItems(a, b) {
  if (!a) return b ? -1 : 0;
  if (!b) return 1;
  return a.power - b.power;
}

export function lootFromKill({ classId, level, rng = Math.random, luck = 0, isBoss = false }) {
  const drops = [];
  const chance = isBoss ? 1 : 0.42 + Math.min(0.25, luck * 0.02);
  if (rng() < chance) {
    drops.push(createItem({ slot: pick(SLOTS, rng), classId, level, rng, luck: luck + (isBoss ? 8 : 0) }));
  }
  if (isBoss && rng() < 0.65) {
    drops.push(createItem({ slot: pick(SLOTS, rng), classId, level, rng, luck: luck + 10 }));
  }
  const gold = Math.round((6 + level * 3) * (isBoss ? 4 : 1) * (0.7 + rng() * 0.6));
  return { drops, gold };
}
