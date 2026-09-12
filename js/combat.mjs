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
