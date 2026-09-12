import { CLASSES } from "./classes.mjs";
import { dist, moveTowards, nearestTarget } from "./combat.mjs";
import { statsOf } from "./stats.mjs";
import { log } from "./hud.mjs";
import { burst } from "./fx.mjs";
import { killEnemy } from "./run.mjs";

export function nearestEnemy(state) {
  return nearestTarget(state.pos, state.enemies);
}

export function hitEnemy(state, en, dmg) {
  en.hp -= dmg;
  burst(state, en.x, en.y, "#fff");
  if (en.hp <= 0) {
    state.enemies = state.enemies.filter((e) => e !== en);
    killEnemy(state, en);
  }
}

export function spawnShot(state, aim, dmg, r, splash) {
  const ang = Math.atan2(aim.y - state.pos.y, aim.x - state.pos.x);
  const spd = 420;
  state.projectiles.push({
    x: state.pos.x, y: state.pos.y,
    vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
    dmg, r, life: 1.1, splash,
  });
}

export function fireAttack(state) {
  const h = state.hero;
  if (!h || state.mode !== "play" || state.invOpen || state.attackTimer > 0) return;
  const s = statsOf(h);
  state.attackTimer = h.attackCd;
  state.attackFlash = 0.22;
  const target = nearestEnemy(state);
  const canvas = document.getElementById("game");
  const aim = target
    ? { x: target.x, y: target.y }
    : { x: state.pos.x + (state.pointer.x - canvas.clientWidth / 2), y: state.pos.y };
  if (h.classId === "knight") {
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) <= s.range) hitEnemy(state, en, s.damage);
    });
    burst(state, state.pos.x, state.pos.y, CLASSES.knight.accent);
  } else {
    spawnShot(state, aim, s.damage, h.classId === "mage" ? 18 : 10, h.classId === "mage");
  }
}

export function useSkill(state) {
  const h = state.hero;
  if (!h || state.mode !== "play" || state.invOpen || state.skillTimer > 0) return;
  const cost = h.classId === "mage" ? 28 : h.classId === "archer" ? 18 : 16;
  if (h.mana < cost) {
    log("Inte tillräckligt med mana!");
    return;
  }
  h.mana -= cost;
  const s = statsOf(h);
  state.skillTimer = CLASSES[h.classId].skill.cd;
  if (h.classId === "knight") {
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) < 120) {
        hitEnemy(state, en, s.damage * 1.6);
        const away = moveTowards(en, state.pos, -280, 0.2);
        en.x = away.x;
        en.y = away.y;
      }
    });
    log("Sköldsmäll!");
  } else if (h.classId === "mage") {
    const t = nearestEnemy(state) || { x: state.pos.x + 80, y: state.pos.y };
    state.projectiles.push({
      x: t.x, y: t.y, vx: 0, vy: 0, dmg: s.damage * 1.4, r: 70, life: 0.35, splash: true, star: true,
    });
    log("Stjärnregn!");
  } else {
    const t = nearestEnemy(state) || { x: state.pos.x + 80, y: state.pos.y };
    for (let i = -1; i <= 1; i++) {
      spawnShot(state, { x: t.x, y: t.y + i * 18 }, s.damage * 0.85, 10, false);
    }
    log("Pilstorm!");
  }
}

export function tickProjectiles(state, dt) {
  state.projectiles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.star) {
      state.enemies.forEach((en) => {
        if (dist(p, en) < p.r) hitEnemy(state, en, p.dmg * dt * 4);
      });
    } else {
      const hit = state.enemies.find((en) => dist(p, en) < 28 + (p.splash ? 16 : 0));
      if (hit) {
        if (p.splash) {
          state.enemies.forEach((en) => {
            if (dist(hit, en) < 70) hitEnemy(state, en, p.dmg);
          });
        } else hitEnemy(state, hit, p.dmg);
        p.life = 0;
      }
    }
  });
  state.projectiles = state.projectiles.filter((p) => p.life > 0);
}
