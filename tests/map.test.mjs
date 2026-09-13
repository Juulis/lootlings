import { generateFloor, isWalkable, tryMove, pathSpots } from "../js/map.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const map = generateFloor(1);
assert(map.w >= 8000 && map.h >= 5000, "10x större bana");
assert(isWalkable(map, map.start.x, map.start.y), "start gåbar");
assert(isWalkable(map, map.goal.x, map.goal.y), "mål gåbart");
assert(map.path.length > 40, "lång stig");

const blocked = tryMove(map, { x: 8, y: 8 }, 40, 0);
assert(blocked.x < 40, "vägg stoppar");

const spots = pathSpots(map, 5);
assert(spots.length >= 1, "spawnplatser på stigen");

const far = generateFloor(7);
assert(far.goal.x !== map.goal.x || far.goal.y !== map.goal.y, "olika mål per våning");
console.log("ok map 5/5");
