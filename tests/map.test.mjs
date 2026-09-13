import { generateFloor, isWalkable, tryMove, pathSpots } from "../js/map.mjs";
import { validateDecor, HOUSE_KINDS } from "../js/decor-sprites.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const keys = validateDecor();
assert(keys.includes("cottage") && keys.includes("hut"), "decorsprites");
assert(HOUSE_KINDS.length >= 4, "flera hustyper");

const map = generateFloor(1);
assert(map.w >= 8000 && map.h >= 5000, "10x större bana");
assert(isWalkable(map, map.start.x, map.start.y), "start gåbar");
assert(isWalkable(map, map.goal.x, map.goal.y), "mål gåbart");
assert(map.path.length > 40, "lång stig");
assert(map.props.length > 20, "föremål på banan");
const houses = map.props.filter((p) => HOUSE_KINDS.includes(p.kind));
assert(houses.length >= 1, "hus finns");
const kinds = new Set(houses.map((p) => p.kind));
const map2 = generateFloor(3);
map2.props.filter((p) => HOUSE_KINDS.includes(p.kind)).forEach((p) => kinds.add(p.kind));
assert(kinds.size >= 2, "olika husformer");
assert(houses.some((p) => (p.scale || 5) !== houses[0].scale) || map2.props.some((p) => HOUSE_KINDS.includes(p.kind) && p.scale !== houses[0].scale), "olika storlek");
assert(map.props.some((p) => p.kind === "tree" || p.kind === "bush"), "växtlighet");
assert(map.ground, "terräng-lager");

const blocked = tryMove(map, { x: 8, y: 8 }, 40, 0);
assert(blocked.x < 40, "vägg stoppar");

const spots = pathSpots(map, 5);
assert(spots.length >= 1, "spawnplatser på stigen");

const far = generateFloor(7);
assert(far.goal.x !== map.goal.x || far.goal.y !== map.goal.y, "olika mål per våning");
assert(far.props.length > 10, "föremål på annan våning");
console.log("ok map+decor");
