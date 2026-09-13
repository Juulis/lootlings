import { drawSprite } from "./sprites.mjs";
import { DECOR_SCALE } from "./decor-sprites.mjs";

const TILE = 64;
const COLS = 140;
const ROWS = 100;

function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function inBounds(tx, ty) {
  return tx >= 1 && ty >= 1 && tx < COLS - 1 && ty < ROWS - 1;
}

function carve(walk, ground, tx, ty, radius = 1, g = 1) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = tx + dx;
      const y = ty + dy;
      if (inBounds(x, y)) {
        walk[y][x] = 1;
        ground[y][x] = g;
      }
    }
  }
}

function block(walk, tx, ty) {
  if (inBounds(tx, ty)) walk[ty][tx] = 0;
}

function pix(tx, ty) {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

function scatterProps(walk, ground, path, rng) {
  const props = [];
  const used = new Set();
  const take = (tx, ty) => {
    const key = `${tx},${ty}`;
    if (used.has(key) || !inBounds(tx, ty)) return false;
    used.add(key);
    return true;
  };

  const start = path[0];
  if (start) {
    const s = pix(start.x, start.y + 2);
    if (take(start.x, start.y + 2)) props.push({ kind: "sign", ...s, solid: false });
    if (take(start.x, start.y - 2)) props.push({ kind: "lantern", ...pix(start.x, start.y - 2), solid: false });
  }

  for (let i = 18; i < path.length - 12; i += 22) {
    const p = path[i];
    const side = rng() < 0.5 ? -3 : 3;
    const hx = p.x + (rng() < 0.5 ? side : 0);
    const hy = p.y + (rng() < 0.5 ? 0 : side);
    if (!inBounds(hx, hy)) continue;
    carve(walk, ground, hx, hy, 2, 2);
    if (take(hx, hy)) {
      props.push({ kind: "cottage", ...pix(hx, hy), solid: true });
      block(walk, hx, hy);
    }
    if (take(hx + 1, hy + 1)) props.push({ kind: "flower", ...pix(hx + 1, hy + 1), solid: false });
    if (take(hx - 1, hy + 1)) props.push({ kind: rng() < 0.5 ? "bush" : "crate", ...pix(hx - 1, hy + 1), solid: rng() < 0.4 });
    if (take(hx + 2, hy)) props.push({ kind: "lantern", ...pix(hx + 2, hy), solid: false });
  }

  for (let i = 10; i < path.length; i += 14) {
    const p = path[i];
    const wx = p.x + (rng() < 0.5 ? -2 : 2);
    const wy = p.y + (rng() < 0.5 ? -2 : 2);
    if (take(wx, wy) && inBounds(wx, wy)) {
      const kind = rng() < 0.35 ? "well" : rng() < 0.5 ? "chest" : "crate";
      const solid = kind !== "chest";
      if (kind === "well") {
        carve(walk, ground, wx, wy, 1, 1);
        block(walk, wx, wy);
      }
      props.push({ kind, ...pix(wx, wy), solid });
    }
  }

  for (let i = 4; i < path.length; i += 5) {
    const p = path[i];
    for (let n = 0; n < 3; n++) {
      const tx = p.x + Math.floor((rng() - 0.5) * 7);
      const ty = p.y + Math.floor((rng() - 0.5) * 7);
      if (!take(tx, ty) || !inBounds(tx, ty)) continue;
      const onPath = walk[ty][tx] === 1;
      const roll = rng();
      let kind = "rock";
      if (roll < 0.28) kind = "tree";
      else if (roll < 0.5) kind = "bush";
      else if (roll < 0.62) kind = "flower";
      else if (roll < 0.72) kind = "column";
      else if (roll < 0.8) kind = "lantern";
      const solid = kind === "tree" || kind === "rock" || kind === "column";
      if (solid && onPath) continue;
      if (solid) block(walk, tx, ty);
      if (!onPath && (kind === "flower" || kind === "lantern")) continue;
      props.push({ kind, ...pix(tx, ty), solid });
    }
  }

  const goal = path[path.length - 1];
  if (goal && take(goal.x, goal.y - 2)) {
    props.push({ kind: "lantern", ...pix(goal.x, goal.y - 2), solid: false });
    props.push({ kind: "column", ...pix(goal.x - 2, goal.y), solid: true });
    block(walk, goal.x - 2, goal.y);
    props.push({ kind: "column", ...pix(goal.x + 2, goal.y), solid: true });
    block(walk, goal.x + 2, goal.y);
  }

  return props;
}

export function generateFloor(floor = 1) {
  const rng = mulberry(floor * 9973 + 13);
  const walk = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const ground = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const path = [];
  let x = 3;
  let y = Math.floor(ROWS / 2);
  const goalX = COLS - 4;
  const goalY = 8 + Math.floor(rng() * (ROWS - 16));
  carve(walk, ground, x, y, 2, 3);
  path.push({ x, y });

  let guard = 0;
  while ((x !== goalX || y !== goalY) && guard < 8000) {
    guard += 1;
    const dx = Math.sign(goalX - x);
    const dy = Math.sign(goalY - y);
    const roll = rng();
    if (roll < 0.55 && dx) x += dx;
    else if (roll < 0.75 && dy) y += dy;
    else if (roll < 0.88) x += rng() < 0.5 ? -1 : 1;
    else y += rng() < 0.5 ? -1 : 1;
    x = Math.max(2, Math.min(COLS - 3, x));
    y = Math.max(2, Math.min(ROWS - 3, y));
    carve(walk, ground, x, y, rng() < 0.12 ? 2 : 1, 3);
    if (path.length === 0 || path[path.length - 1].x !== x || path[path.length - 1].y !== y) {
      path.push({ x, y });
    }
    if (rng() < 0.04) {
      const rx = x + Math.floor((rng() - 0.5) * 8);
      const ry = y + Math.floor((rng() - 0.5) * 8);
      carve(walk, ground, rx, ry, 3, rng() < 0.6 ? 2 : 1);
    }
  }
  carve(walk, ground, goalX, goalY, 2, 3);

  const props = scatterProps(walk, ground, path, rng);

  return {
    w: COLS * TILE,
    h: ROWS * TILE,
    tile: TILE,
    cols: COLS,
    rows: ROWS,
    walk,
    ground,
    props,
    path,
    start: { x: 3 * TILE + TILE / 2, y: Math.floor(ROWS / 2) * TILE + TILE / 2 },
    goal: { x: goalX * TILE + TILE / 2, y: goalY * TILE + TILE / 2 },
    floor,
  };
}

export function tileAt(map, px, py) {
  return {
    tx: Math.floor(px / map.tile),
    ty: Math.floor(py / map.tile),
  };
}

export function isWalkable(map, px, py) {
  if (!map?.walk) return px > 40 && py > 40 && px < map.w - 40 && py < map.h - 40;
  const { tx, ty } = tileAt(map, px, py);
  if (ty < 0 || tx < 0 || ty >= map.rows || tx >= map.cols) return false;
  return map.walk[ty][tx] === 1;
}

export function tryMove(map, pos, dx, dy, radius = 16) {
  const nx = pos.x + dx;
  const ny = pos.y + dy;
  if (isWalkable(map, nx, pos.y) && isWalkable(map, nx, pos.y - radius) && isWalkable(map, nx, pos.y + radius)) {
    pos = { x: nx, y: pos.y };
  }
  if (isWalkable(map, pos.x, ny) && isWalkable(map, pos.x - radius, ny) && isWalkable(map, pos.x + radius, ny)) {
    pos = { x: pos.x, y: ny };
  }
  return pos;
}

export function pathSpots(map, count, minDistFromStart = 400) {
  const spots = [];
  const pool = map.path || [];
  for (let i = 0; i < pool.length; i += Math.max(1, Math.floor(pool.length / (count * 3)))) {
    const p = pool[i];
    const x = p.x * map.tile + map.tile / 2;
    const y = p.y * map.tile + map.tile / 2;
    if (Math.hypot(x - map.start.x, y - map.start.y) < minDistFromStart) continue;
    spots.push({ x, y });
    if (spots.length >= count) break;
  }
  return spots;
}

const GROUND_COL = {
  1: ["#3a2a48", "#4a3860"],
  2: ["#2a4a28", "#3d6a32"],
  3: ["#6b4a24", "#8a6230"],
};

export function drawMap(ctx, map, camX, camY, viewW, viewH, timeMs) {
  const t = map.tile || TILE;
  const x0 = Math.max(0, Math.floor(camX / t) - 1);
  const y0 = Math.max(0, Math.floor(camY / t) - 1);
  const x1 = Math.min(map.cols || Math.ceil(map.w / t), Math.ceil((camX + viewW) / t) + 1);
  const y1 = Math.min(map.rows || Math.ceil(map.h / t), Math.ceil((camY + viewH) / t) + 1);

  for (let ty = y0; ty < y1; ty++) {
    for (let tx = x0; tx < x1; tx++) {
      const px = tx * t;
      const py = ty * t;
      const open = map.walk ? map.walk[ty]?.[tx] === 1 : true;
      if (!open) {
        ctx.fillStyle = (tx + ty) % 2 === 0 ? "#1a0c28" : "#140820";
        ctx.fillRect(px, py, t, t);
        if ((tx * 13 + ty * 7) % 11 === 0) {
          ctx.fillStyle = "#2a1840";
          ctx.fillRect(px + 18, py + 10, 12, t - 16);
        }
        continue;
      }
      const g = map.ground?.[ty]?.[tx] || 1;
      const pair = GROUND_COL[g] || GROUND_COL[1];
      ctx.fillStyle = (tx + ty) % 2 === 0 ? pair[0] : pair[1];
      ctx.fillRect(px, py, t, t);
    }
  }

  if (map.path?.length > 1) {
    ctx.strokeStyle = `rgba(255, 215, 106, ${0.28 + Math.sin(timeMs / 280) * 0.1})`;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    let started = false;
    for (const p of map.path) {
      const px = p.x * t + t / 2;
      const py = p.y * t + t / 2;
      if (px < camX - 80 || py < camY - 80 || px > camX + viewW + 80 || py > camY + viewH + 80) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  const pad = 90;
  const list = map.props || [];
  for (const p of list) {
    if (p.x < camX - pad || p.y < camY - pad || p.x > camX + viewW + pad || p.y > camY + viewH + pad) continue;
    const scale = DECOR_SCALE[p.kind] || 3;
    if (p.kind === "lantern") {
      const glow = 0.18 + Math.sin(timeMs / 220 + p.x) * 0.06;
      ctx.fillStyle = `rgba(255, 215, 106, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    drawSprite(ctx, p.kind, p.x, p.y, { scale, shadow: p.kind !== "flower" });
  }
}
