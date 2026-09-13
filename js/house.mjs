import { enemyStats } from "./combat.mjs";
import { dist } from "./combat.mjs";
import { log, toast } from "./hud.mjs";

const TILE = 64;

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function nearestDoor(state) {
  if (!state.map?.props || state.indoor) return null;
  let best = null;
  let bestD = 48;
  for (const p of state.map.props) {
    if (!p.enter || !p.houseId) continue;
    if (state.clearedHouses?.[p.houseId]) continue;
    const d = dist(state.pos, p);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

export function generateHouse(floor, houseId) {
  const seed = hash(`${houseId}:${floor}`);
  const boss = seed % 3 === 0;
  const cols = 18;
  const rows = 12;
  const walk = Array.from({ length: rows }, () => Array(cols).fill(0));
  const ground = Array.from({ length: rows }, () => Array(cols).fill(1));
  for (let y = 2; y < rows - 2; y++) {
    for (let x = 2; x < cols - 2; x++) {
      walk[y][x] = 1;
      ground[y][x] = 1;
    }
  }
  const sx = Math.floor(cols / 2);
  const sy = rows - 3;
  walk[sy][sx] = 1;
  const start = { x: sx * TILE + TILE / 2, y: sy * TILE + TILE / 2 };
  const props = [
    { kind: "lantern", x: 3 * TILE, y: 3 * TILE, solid: false },
    { kind: "lantern", x: (cols - 4) * TILE, y: 3 * TILE, solid: false },
    { kind: "crate", x: 4 * TILE, y: 4 * TILE, solid: true },
    { kind: "crate", x: (cols - 5) * TILE, y: 4 * TILE, solid: true },
  ];
  if (props[2]) walk[4][4] = 0;
  if (props[3]) walk[4][cols - 5] = 0;
  return {
    w: cols * TILE,
    h: rows * TILE,
    tile: TILE,
    cols,
    rows,
    walk,
    ground,
    props,
    path: [],
    start,
    goal: start,
    floor,
    indoor: true,
    houseId,
    houseBoss: boss,
  };
}

export function spawnHouseCrew(state) {
  const map = state.map;
  const floor = state.hero.floor;
  const boss = !!map.houseBoss;
  state.enemies = [];
  state.projectiles = [];
  state.pickups = [];
  state.portal = null;
  const n = boss ? 1 : 6 + Math.min(6, Math.floor(floor * 0.6));
  for (let i = 0; i < n; i++) {
    const isBoss = boss && i === 0;
    const st = enemyStats(floor + (isBoss ? 1 : 0), isBoss);
    const tx = 4 + (i % 8);
    const ty = 3 + Math.floor(i / 8);
    state.enemies.push({
      id: 800 + i,
      kind: isBoss ? "boss" : ["slime", "bat", "shroom"][i % 3],
      isBoss,
      x: tx * TILE + TILE / 2,
      y: ty * TILE + TILE / 2,
      hp: st.hp, maxHp: st.hp, damage: st.damage,
      speed: st.speed, range: st.range,
      cd: 0.3 + Math.random() * 0.4, swing: 0,
    });
  }
}

export function enterHouse(state, door) {
  if (!state.hero || state.indoor || !door?.houseId) return false;
  if (state.clearedHouses?.[door.houseId]) return false;
  if ((state.houseCool || 0) > 0) return false;
  state.world = {
    map: state.map,
    pos: { ...state.pos },
    enemies: state.enemies,
    portal: state.portal,
    pickups: state.pickups,
  };
  state.indoor = true;
  state.map = generateHouse(state.hero.floor, door.houseId);
  state.pos = { ...state.map.start };
  spawnHouseCrew(state);
  const kind = state.map.houseBoss ? "en husboss" : `${state.enemies.length} monster`;
  log(`In i huset: ${kind}!`);
  toast(state.map.houseBoss ? "Ett stort monster i huset!" : "Huset vimlar av monster!");
  return true;
}

export function leaveHouse(state) {
  if (!state.indoor || !state.world) return false;
  const id = state.map.houseId;
  const world = state.world;
  state.indoor = false;
  state.world = null;
  state.map = world.map;
  state.enemies = world.enemies;
  state.portal = world.portal;
  state.pickups = world.pickups;
  state.pos = { x: world.pos.x, y: world.pos.y + 56 };
  state.houseCool = 1.4;
  state.clearedHouses = state.clearedHouses || {};
  if (id) state.clearedHouses[id] = true;
  log("Ut ur huset.");
  toast("Tillbaka på stigen.");
  return true;
}
