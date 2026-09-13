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

function carve(walk, tx, ty, radius = 1) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = tx + dx;
      const y = ty + dy;
      if (inBounds(x, y)) walk[y][x] = 1;
    }
  }
}

export function generateFloor(floor = 1) {
  const rng = mulberry(floor * 9973 + 13);
  const walk = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const path = [];
  let x = 3;
  let y = Math.floor(ROWS / 2);
  const goalX = COLS - 4;
  const goalY = 8 + Math.floor(rng() * (ROWS - 16));
  carve(walk, x, y, 2);
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
    carve(walk, x, y, rng() < 0.12 ? 2 : 1);
    if (path.length === 0 || path[path.length - 1].x !== x || path[path.length - 1].y !== y) {
      path.push({ x, y });
    }
    if (rng() < 0.04) {
      const rx = x + Math.floor((rng() - 0.5) * 8);
      const ry = y + Math.floor((rng() - 0.5) * 8);
      carve(walk, rx, ry, 3);
    }
  }
  carve(walk, goalX, goalY, 2);

  return {
    w: COLS * TILE,
    h: ROWS * TILE,
    tile: TILE,
    cols: COLS,
    rows: ROWS,
    walk,
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
      ctx.fillStyle = (tx + ty) % 2 === 0 ? "#3a2a48" : "#322440";
      ctx.fillRect(px, py, t, t);
      ctx.fillStyle = "#4a3860";
      ctx.fillRect(px + 6, py + 6, t - 12, t - 12);
    }
  }

  if (map.path?.length > 1) {
    ctx.strokeStyle = `rgba(255, 215, 106, ${0.35 + Math.sin(timeMs / 280) * 0.12})`;
    ctx.lineWidth = 10;
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
}
