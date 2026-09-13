import { parseSprite } from "../js/sprites.mjs";
import { gearKeys, lookFor, WEAPON_LOOKS } from "../js/gear-looks.mjs";
import { createItem } from "../js/loot.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

for (const name of gearKeys()) {
  const s = parseSprite(name);
  assert(s.width === 16 && s.height === 16, `${name} 16x16`);
}

const sword = createItem({ slot: "weapon", classId: "knight", level: 8, rng: () => 0.01, luck: 40 });
assert(sword.look, "vapen har look");
assert(lookFor(sword, "knight") === sword.look, "lookFor matchar");

const bow = createItem({ slot: "weapon", classId: "archer", level: 2, rng: () => 0.5, luck: 0 });
assert(Object.values(WEAPON_LOOKS.archer).includes(bow.look), "båge-look");

const hat = createItem({ slot: "armor", classId: "mage", level: 3, rng: () => 0.2, luck: 10 });
assert(hat.look.startsWith("armor_"), "rustning-look");

const common = { slot: "weapon", rarity: "common" };
assert(lookFor(common, "knight") === "sword_iron", "vanligt svärd");
assert(lookFor({ slot: "weapon", rarity: "legend" }, "mage") === "staff_sun", "legend stav");

console.log("ok gear-looks");
