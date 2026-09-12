import { createHero } from "../js/classes.mjs";
import { applyDrop } from "../js/run.mjs";

function assert(cond, msg) { if (!cond) throw new Error(msg); }

const h = createHero("knight");
const weak = { slot: "weapon", name: "pinne", power: 2 };
const strong = { slot: "weapon", name: "svärd", power: 9 };
assert(applyDrop(h, weak) === "equip", "första på");
assert(h.gear.weapon.name === "pinne", "utrustad");
assert(applyDrop(h, strong) === "equip", "bättre på");
assert(h.gear.weapon.name === "svärd", "bytt");
assert(h.bag.some((i) => i.name === "pinne"), "gamla i väska");
const meh = { slot: "weapon", name: "kvist", power: 1 };
assert(applyDrop(h, meh) === "bag", "sämre i väska");
assert(h.gear.weapon.name === "svärd", "behåller stark");
console.log("ok auto-loot");
console.log("\n1 tester godkända");
