export function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function moveTowards(from, to, speed, dt, stopAt = 0) {
  const d = dist(from, to);
  if (d <= stopAt) return { x: from.x, y: from.y };
  const step = Math.min(speed * dt, d - stopAt);
  const k = step / d;
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
}

export function damageAfterArmor(raw, armor = 0) {
  return Math.max(1, Math.round(raw * (100 / (100 + armor))));
}

export function enemyStats(floor, isBoss = false) {
  const f = Math.max(1, floor);
  if (isBoss) {
    return {
      hp: 70 + f * 28,
      damage: 8 + f * 2,
      speed: 70 + f * 2,
      range: 52,
      xp: 28 + f * 8,
    };
  }
  return {
    hp: 18 + f * 8,
    damage: 4 + Math.floor(f * 1.2),
    speed: 55 + f * 3,
    range: 40,
    xp: 8 + f * 2,
  };
}

export function inRange(a, b, range) {
  return dist(a, b) <= range;
}

export function nearestTarget(from, enemies = []) {
  let best = null;
  let bestD = Infinity;
  for (const en of enemies) {
    const d = dist(from, en);
    if (d < bestD) {
      best = en;
      bestD = d;
    }
  }
  return best;
}

export function readMoveVector(keys = {}, stick = { x: 0, y: 0 }) {
  let mx = 0;
  let my = 0;
  if (keys.w || keys.arrowup) my -= 1;
  if (keys.s || keys.arrowdown) my += 1;
  if (keys.a || keys.arrowleft) mx -= 1;
  if (keys.d || keys.arrowright) mx += 1;
  mx += stick.x || 0;
  my += stick.y || 0;
  const mag = Math.hypot(mx, my);
  if (mag > 1) {
    mx /= mag;
    my /= mag;
  }
  return { mx, my, moving: mag > 0.01 };
}

export function isAttackHeld({ keys = {}, pointerDown = false, touchAttack = false } = {}) {
  return !!(keys[" "] || keys.space || pointerDown || touchAttack);
}

/** Attack only when the player holds the attack button. Walking never swings on its own. */
export function shouldSwing({ held = false, attackTimer = 0 } = {}) {
  return attackTimer <= 0 && !!held;
}

export function applyMove(pos, { mx, my }, speed, dt, bounds) {
  return {
    x: Math.max(bounds.min, Math.min(bounds.maxX, pos.x + mx * speed * dt)),
    y: Math.max(bounds.min, Math.min(bounds.maxY, pos.y + my * speed * dt)),
  };
}
