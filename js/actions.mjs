import { CLASSES } from "./classes.mjs";
import { dist, moveTowards, nearestTarget } from "./combat.mjs";
import { statsOf } from "./stats.mjs";
import { log } from "./hud.mjs";
import { burst } from "./fx.mjs";
import { killEnemy } from "./run.mjs";
import { SKILLS, skillStats, gainSkillXp, setActiveSkill, unlockSkill } from "./skills.mjs";
import { playSfx } from "./audio.mjs";

export function nearestEnemy(state) {
  return nearestTarget(state.pos, state.enemies);
}

export function hitEnemy(state, en, dmg) {
  en.hp -= dmg;
  burst(state, en.x, en.y, "#fff");
  const now = performance.now?.() || Date.now();
  if (!state._lastHitSfx || now - state._lastHitSfx > 90) {
    playSfx("hit", { volume: 0.35 });
    state._lastHitSfx = now;
  }
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
    playSfx("slash");
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) <= s.range) hitEnemy(state, en, s.damage);
    });
    burst(state, state.pos.x, state.pos.y, CLASSES.knight.accent);
  } else {
    playSfx(h.classId === "mage" ? "magic" : "swing");
    spawnShot(state, aim, s.damage, h.classId === "mage" ? 18 : 10, h.classId === "mage");
  }
}

export function useSkill(state, skillId) {
  const h = state.hero;
  if (!h || state.invOpen) return;
  const id = skillId || h.activeSkill;
  const slot = id && h.skills?.[id];
  if (!slot) return;
  if (!slot.unlocked) {
    if ((h.skillPoints || 0) > 0) {
      unlockSkill(h, id);
      log(`Låste upp ${SKILLS[id].name}!`);
    } else {
      log("Ingen poäng. Levela för att låsa upp.");
      return;
    }
  }
  const cdLeft = (state.skillCds && state.skillCds[id]) || 0;
  if (cdLeft > 0) return;
  setActiveSkill(h, id);
  const def = SKILLS[id];
  const st = skillStats(def, slot);
  const s = statsOf(h);
  const cost = 12 + slot.level * 4;
  if ((h.mana || 0) < cost) {
    log("Inte tillräckligt med mana!");
    return;
  }
  h.mana -= cost;
  playSfx("magic", { volume: 0.7 });
  state.skillCds = state.skillCds || {};
  state.skillCds[id] = st.cd;
  state.skillTimer = st.cd;
  const dmg = s.damage * 1.35 * st.dmgMult;
  if (def.type === "melee") {
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) < st.radius) {
        hitEnemy(state, en, dmg);
        const away = moveTowards(en, state.pos, -280, 0.2);
        en.x = away.x;
        en.y = away.y;
      }
    });
  } else if (def.type === "aoe") {
    const t = nearestEnemy(state) || { x: state.pos.x + 80, y: state.pos.y };
    state.projectiles.push({
      x: t.x, y: t.y, vx: 0, vy: 0, dmg, r: 62 + slot.level * 4, life: 0.35, splash: true, star: true,
    });
  } else {
    const t = nearestEnemy(state) || { x: state.pos.x + 80, y: state.pos.y };
    for (let i = -1; i <= 1; i++) {
      spawnShot(state, { x: t.x, y: t.y + i * 18 }, dmg * 0.8, 10, false);
    }
  }
  const res = gainSkillXp(h, id, 10);
  log(res.leveled ? `${def.name} Nv ${res.level}!` : `${def.name}!`);
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
