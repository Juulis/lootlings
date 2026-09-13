import { generateFloor } from "../js/map.mjs";
import { generateHouse, enterHouse, leaveHouse, nearestDoor, houseDoors } from "../js/house.mjs";
import { createState } from "../js/game-state.mjs";
import { createHero } from "../js/classes.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const over = generateFloor(2);
const doors = houseDoors(over);
assert(doors.length >= 1, "dörrar vid hus");

const a = generateHouse(3, "aaa");
const b = generateHouse(3, "bbb");
assert(a.indoor && b.indoor, "inomhus-flagga");
assert(a.w < 2000 && a.h < 1200, "litet hus");
assert(typeof a.houseBoss === "boolean", "boss- eller svärm-hus");

const state = createState();
state.hero = createHero("knight");
state.mode = "play";
state.map = over;
state.pos = { x: doors[0].x, y: doors[0].y };
assert(nearestDoor(state)?.houseId === doors[0].houseId, "hittar dörr");
assert(enterHouse(state, doors[0]) === true, "går in");
assert(state.indoor && state.enemies.length >= 1, "monster inne");
assert(leaveHouse(state) === true && !state.indoor, "går ut");
assert(state.clearedHouses[doors[0].houseId], "huset markerat");

console.log("ok hus-dungeon");
console.log("\n1 tester godkända");
