export function createState() {
  return {
    mode: "menu",
    hero: null,
    pos: { x: 400, y: 300 },
    enemies: [],
    projectiles: [],
    pickups: [],
    particles: [],
    map: { w: 900, h: 640 },
    keys: {},
    pointer: { x: 0, y: 0, down: false },
    stick: { x: 0, y: 0, active: false },
    touchAttack: false,
    attackTimer: 0,
    skillTimer: 0,
    invuln: 0,
    attackFlash: 0,
    facingLeft: false,
    pendingLoot: [],
    last: 0,
    portal: null,
  };
}
