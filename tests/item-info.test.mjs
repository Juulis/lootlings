import { inspectItem, inspectText, SLOT_SV, HOLD_MS } from "../js/item-info.mjs";
import { createItem } from "../js/loot.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const empty = inspectItem(null);
assert(empty.title === "Tom plats", "tom slot");
assert(HOLD_MS >= 300 && HOLD_MS <= 800, "håll-tid rimlig");

const sword = createItem({ slot: "weapon", classId: "knight", level: 3, rng: () => 0.2, luck: 10 });
const info = inspectItem(sword);
assert(info.title === sword.name, "namn");
assert(info.lines.some((l) => l.includes("skada")), "vapen nämner skada");
assert(inspectText(sword).includes(sword.name), "text innehåller namn");
assert(SLOT_SV.armor.does(5).includes("10"), "rustning ger 2x liv");

console.log("ok item-info");
console.log("\n1 tester godkända");
