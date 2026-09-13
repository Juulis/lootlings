import { generateFloor, isWalkable, tryMove, pathSpots } from "../js/map.mjs";
import { parseSprite, spriteKeys } from "../js/sprites.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const map = generateFloor(1);
assert(map.w >= 8000 && map.h >= 5000, "10x större bana");
assert(isWalkable(map, map.start.x, map.start.y), "start gåbar");
assert(isWalkable(map, map.goal.x, map.goal.y), "mål gåbart");
assert(map.path.length > 40, "lång stig");
assert(map.props.length > 20, "föremål på banan");
assert(map.props.some((p) => p.kind === "cottage"), "hus finns");
assert(map.props.some((p) => p.kind === "tree"), "träd finns");
assert(map.ground, "terräng-lager");

const blocked = tryMove(map, { x: 8, y: 8 }, 40, 0);
assert(blocked.x < 40, "vägg stoppar");

const spots = pathSpots(map, 5);
assert(spots.length >= 1, "spawnplatser på stigen");

const far = generateFloor(7);
assert(far.goal.x !== map.goal.x || far.goal.y !== map.goal.y, "olika mål per våning");
assert(far.props.length > 10, "föremål på annan våning");

for (const name of ["cottage", "tree", "bush", "rock", "well", "sign", "lantern", "crate", "flower"]) {
  const s = parseSprite(name);
  assert(s.width === 16 && s.height === 16, `${name} 16x16`);
}
assert(spriteKeys().includes("cottage"), "cottage i katalog");
console.log("ok map+decor");
