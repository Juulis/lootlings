import { drawDecor, DECOR_SCALE } from "./decor-sprites.mjs";
import { diversifyHouses } from "./houses.mjs";

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
    if (take(start.x, start.y + 2)) props.push({ kind: "sign", ...pix(start.x, start.y + 2), solid: false });
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
    if (take(hx - 1, hy + 1)) props.push({ kind: rng() < 0.5 ? "bush2" : "crate", ...pix(hx - 1, hy + 1), solid: rng() < 0.4 });
    if (take(hx + 2, hy)) props.push({ kind: "lantern", ...pix(hx + 2, hy), solid: false });
  }

  for (let i = 10; i < path.length; i += 14) {
    const p = path[i];
    const wx = p.x + (rng() < 0.5 ? -2 : 2);
    const wy = p.y + (rng() < 0.5 ? -2 : 2);
    if (take(wx, wy) && inBounds(wx, wy)) {
      const kind = rng() < 0.35 ? "well" : rng() < 0.5 ? "chest" : "crate";
      if (kind === "well") {
        carve(walk, ground, wx, wy, 1, 1);
        block(walk, wx, wy);
      }
      props.push({ kind, ...pix(wx, wy), solid: kind === "well" || kind === "crate" });
    }
  }

  const plants = ["bush", "bush2", "fern", "tallgrass", "flower", "tree"];
  for (let i = 2; i < path.length; i += 3) {
    const p = path[i];
    for (let n = 0; n < 5; n++) {
      const tx = p.x + Math.floor((rng() - 0.5) * 8);
      const ty = p.y + Math.floor((rng() - 0.5) * 8);
      if (!take(tx, ty) || !inBounds(tx, ty)) continue;
      const onPath = walk[ty][tx] === 1;
      const roll = rng();
      let kind;
      if (roll < 0.22) kind = plants[Math.floor(rng() * plants.length)];
      else if (roll < 0.34) kind = "rock";
      else if (roll < 0.4) kind = "column";
      else if (roll < 0.46) kind = "lantern";
      else kind = onPath ? (rng() < 0.5 ? "tallgrass" : "flower") : plants[Math.floor(rng() * 4)];
      const solid = kind === "tree" || kind === "rock" || kind === "column";
      if (solid && onPath) continue;
      if (solid) block(walk, tx, ty);
      props.push({ kind, ...pix(tx, ty), solid });
    }
  }

  const goal = path[path.length - 1];
  if (goal && take(goal.x, goal.y - 2)) {
    props.push({ kind: "lantern", ...pix(goal.x, goal.y - 2), solid: false });
    if (take(goal.x - 2, goal.y)) {
      props.push({ kind: "column", ...pix(goal.x - 2, goal.y), solid: true });
      block(walk, goal.x - 2, goal.y);
    }
    if (take(goal.x + 2, goal.y)) {
      props.push({ kind: "column", ...pix(goal.x + 2, goal.y), solid: true });
      block(walk, goal.x + 2, goal.y);
    }
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
  const props = diversifyHouses(scatterProps(walk, ground, path, rng), rng);

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

function h32(x, y) {
  return ((x * 73856093) ^ (y * 19349663) ^ (x * y * 83492791)) >>> 0;
}

function drawWallTile(ctx, px, py, t, tx, ty, map) {
  const brick = (tx + ty) % 2 === 0;
  ctx.fillStyle = brick ? "#1c102c" : "#150c24";
  ctx.fillRect(px, py, t, t);
  ctx.fillStyle = "#2a1844";
  const row = 10;
  for (let yy = 4; yy < t - 4; yy += row) {
    const shift = ((yy / row) | 0) % 2 === 0 ? 0 : 12;
    for (let xx = shift; xx < t; xx += 24) {
      ctx.fillRect(px + xx + 1, py + yy, 20, 7);
    }
  }
  const nearPath =
    map.walk?.[ty]?.[tx - 1] || map.walk?.[ty]?.[tx + 1] ||
    map.walk?.[ty - 1]?.[tx] || map.walk?.[ty + 1]?.[tx];
  if (nearPath) {
    ctx.fillStyle = "#2d5a32";
    const n = 4 + (h32(tx, ty) % 5);
    for (let i = 0; i < n; i++) {
      const hx = h32(tx + i, ty + 3);
      ctx.fillRect(px + (hx % (t - 8)), py + ((hx >> 8) % (t - 8)), 3 + (hx % 4), 2);
    }
  }
}

function drawFloorTile(ctx, px, py, t, tx, ty, g) {
  const rnd = h32(tx, ty);
  if (g === 2) {
    ctx.fillStyle = (tx + ty) % 2 === 0 ? "#2b5a2c" : "#337034";
    ctx.fillRect(px, py, t, t);
    ctx.fillStyle = "#3f8a3c";
    ctx.fillRect(px + 2, py + 2, t - 4, t - 4);
    ctx.fillStyle = "#4c9a45";
    for (let i = 0; i < 10; i++) {
      const v = h32(tx * 9 + i, ty * 7);
      ctx.fillRect(px + (v % (t - 4)), py + ((v >> 6) % (t - 6)), 2, 5);
    }
    if (rnd % 7 === 0) {
      ctx.fillStyle = rnd % 2 ? "#ff8ab8" : "#ffe566";
      ctx.fillRect(px + (rnd % (t - 6)) + 2, py + ((rnd >> 4) % (t - 6)) + 2, 3, 3);
    }
    return;
  }
  if (g === 3) {
    ctx.fillStyle = "#5a3a18";
    ctx.fillRect(px, py, t, t);
    ctx.fillStyle = "#7a5224";
    ctx.beginPath();
    ctx.ellipse(px + t / 2, py + t / 2, t * 0.42, t * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c9a066";
    ctx.beginPath();
    ctx.ellipse(px + t / 2, py + t / 2, t * 0.28, t * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a6230";
    for (let i = 0; i < 6; i++) {
      const v = h32(tx + i * 3, ty + 11);
      ctx.fillRect(px + 8 + (v % (t - 16)), py + 10 + ((v >> 5) % (t - 20)), 3, 2);
    }
    return;
  }
  ctx.fillStyle = (tx + ty) % 2 === 0 ? "#3a2c50" : "#322448";
  ctx.fillRect(px, py, t, t);
  ctx.fillStyle = "#4a3860";
  ctx.fillRect(px + 3, py + 3, t - 6, t - 6);
  ctx.fillStyle = "#2a1c3c";
  ctx.fillRect(px + 8, py + t / 2, t - 16, 2);
  ctx.fillRect(px + t / 2, py + 8, 2, t - 16);
  if (rnd % 5 === 0) {
    ctx.fillStyle = "#3d6a32";
    ctx.fillRect(px + 6, py + t - 10, 8, 4);
  }
}

export function drawMap(ctx, map, camX, camY, viewW, viewH, timeMs) {
  const t = map.tile || TILE;
  const x0 = Math.max(0, Math.floor(camX / t) - 1);
  const y0 = Math.max(0, Math.floor(camY / t) - 1);
  const x1 = Math.min(map.cols || Math.ceil(map.w / t), Math.ceil((camX + viewW) / t) + 1);
  const y1 = Math.min(map.rows || Math.ceil(map.h / t), Math.ceil((camY + viewH) / t) + 1);

  ctx.fillStyle = "#0c0614";
  ctx.fillRect(camX, camY, viewW, viewH);

  for (let ty = y0; ty < y1; ty++) {
    for (let tx = x0; tx < x1; tx++) {
      const px = tx * t;
      const py = ty * t;
      const open = map.walk ? map.walk[ty]?.[tx] === 1 : true;
      if (!open) drawWallTile(ctx, px, py, t, tx, ty, map);
      else drawFloorTile(ctx, px, py, t, tx, ty, map.ground?.[ty]?.[tx] || 1);
    }
  }

  if (map.path?.length > 1) {
    ctx.strokeStyle = `rgba(255, 220, 130, ${0.22 + Math.sin(timeMs / 320) * 0.08})`;
    ctx.lineWidth = 6;
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

  const pad = 100;
  for (const p of map.props || []) {
    if (p.x < camX - pad || p.y < camY - pad || p.x > camX + viewW + pad || p.y > camY + viewH + pad) continue;
    const scale = p.scale || DECOR_SCALE[p.kind] || 3;
    if (p.kind === "lantern") {
      const glow = 0.2 + Math.sin(timeMs / 220 + p.x) * 0.07;
      ctx.fillStyle = `rgba(255, 215, 106, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    drawDecor(ctx, p.kind, p.x, p.y, scale, timeMs);
  }

  for (let i = 0; i < 14; i++) {
    const seed = h32((camX / 40) | 0, i + ((camY / 40) | 0));
    const fx = camX + (seed % viewW);
    const fy = camY + ((seed >> 8) % viewH);
    const tw = 0.35 + Math.sin(timeMs / 260 + i) * 0.35;
    if (tw < 0.15) continue;
    ctx.fillStyle = `rgba(255, 240, 160, ${tw})`;
    ctx.fillRect(fx, fy + Math.sin(timeMs / 400 + i) * 8, 2, 2);
  }
}
