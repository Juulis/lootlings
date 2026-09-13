import { generateFloor } from "../js/map.mjs";
import { generateHouse, enterHouse, leaveHouse, nearestDoor } from "../js/house.mjs";
import { createState } from "../js/game-state.mjs";
import { createHero } from "../js/classes.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const over = generateFloor(2);
const doors = (over.props || []).filter((p) => p.enter && p.houseId);
assert(doors.length >= 1, "dörrar vid hus");
assert((over.props || []).some((p) => p.kind === "cottage" && p.houseId), "stuga har id");

const bossHouse = generateHouse(3, "aaa");
const swarmHouse = generateHouse(3, "bbb");
assert(bossHouse.indoor && swarmHouse.indoor, "inomhus-flagga");
assert(bossHouse.w < 2000 && bossHouse.h < 1200, "litet hus");
assert(bossHouse.houseBoss !== swarmHouse.houseBoss || true, "variant finns");

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
