import { generateFloor } from "./map.mjs";

export function createState() {
  const map = generateFloor(1);
  return {
    mode: "menu",
    hero: null,
    pos: { ...map.start },
    enemies: [],
    projectiles: [],
    pickups: [],
    particles: [],
    map,
    keys: {},
    pointer: { x: 0, y: 0, down: false },
    stick: { x: 0, y: 0, active: false },
    touchAttack: false,
    attackTimer: 0,
    skillTimer: 0,
    skillCds: { smash: 0, star: 0, volley: 0 },
    invuln: 0,
    attackFlash: 0,
    facingLeft: false,
    pendingLoot: [],
    last: 0,
    portal: null,
    invOpen: false,
    skillsOpen: false,
    indoor: false,
    world: null,
    houseCool: 0,
    clearedHouses: {},
  };
}
