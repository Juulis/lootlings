import { createHero } from "../js/classes.mjs";
import { createItem } from "../js/loot.mjs";
import { applyDrop } from "../js/run.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const hero = createHero("knight");
const weak = createItem({ slot: "weapon", classId: "knight", level: 1, rng: () => 0.9, luck: 0 });
const strong = createItem({ slot: "weapon", classId: "knight", level: 6, rng: () => 0.1, luck: 20 });

hero.gear.weapon = weak;
assert(applyDrop(hero, strong) === "equip", "bättre loot tas på");
assert(hero.gear.weapon === strong, "nytt vapen på");
assert(hero.bag.includes(weak), "gamla i väskan");

const weak2 = createItem({ slot: "weapon", classId: "knight", level: 1, rng: () => 0.95, luck: 0 });
assert(applyDrop(hero, weak2) === "bag", "sämre loot i väskan");
assert(hero.gear.weapon === strong, "behåller starka");
assert(hero.bag.includes(weak2), "svaga i väskan");

console.log("ok loot-auto");
console.log("\n1 tester godkända");
