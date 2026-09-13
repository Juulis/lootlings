import { readFileSync } from "node:fs";
import { HOUSE_KINDS, pickHouse } from "../js/houses.mjs";
import { houseDoors } from "../js/house.mjs";
import { generateFloor } from "../js/map.mjs";
import { createState } from "../js/game-state.mjs";
import { CLASSES } from "../js/classes.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(HOUSE_KINDS.includes("cottage") && HOUSE_KINDS.length >= 4, "hustyper");
assert(pickHouse(() => 0).kind === HOUSE_KINDS[0], "pickHouse");

const src = readFileSync(new URL("../js/houses.mjs", import.meta.url), "utf8");
assert(!src.includes("HOUSE_KINDS, DECOR_SCALE"), "importerar inte HOUSE_KINDS från decor");

const map = generateFloor(1);
assert(houseDoors(map).length >= 1, "dörrar efter boot-import");
assert(createState().mode === "menu", "state bootar");
assert(Object.keys(CLASSES).length === 3, "tre gubbar");

console.log("ok boot-meny");
console.log("\n1 tester godkända");
