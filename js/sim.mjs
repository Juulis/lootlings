import { moveTowards, inRange, readMoveVector, isAttackHeld, shouldSwing, applyMove, dist } from "./combat.mjs";
import { statsOf } from "./stats.mjs";
import { refreshHud } from "./hud.mjs";
import { burst, tickParticles } from "./fx.mjs";
import { die, nextFloor } from "./run.mjs";
import { fireAttack, nearestEnemy, tickProjectiles } from "./actions.mjs";

export function update(state, dt) {
  if (state.mode !== "play" || !state.hero) return;
  const h = state.hero;
  const s = statsOf(h);
  state.attackTimer = Math.max(0, state.attackTimer - dt);
  state.skillTimer = Math.max(0, state.skillTimer - dt);
  state.skillCds = state.skillCds || {};
  for (const id of Object.keys(state.skillCds)) {
    state.skillCds[id] = Math.max(0, state.skillCds[id] - dt);
  }
  state.invuln = Math.max(0, state.invuln - dt);
  state.attackFlash = Math.max(0, state.attackFlash - dt);

  const move = readMoveVector(state.keys, state.stick);
  state.pos = applyMove(state.pos, move, s.speed, dt, {
    min: 40,
    maxX: state.map.w - 40,
    maxY: state.map.h - 40,
  });
  if (move.mx < -0.15) state.facingLeft = true;
  else if (move.mx > 0.15) state.facingLeft = false;

  const target = nearestEnemy(state);
  const held = isAttackHeld({
    keys: state.keys,
    pointerDown: state.pointer.down,
    touchAttack: state.touchAttack,
  });
  if (shouldSwing({
    held,
    targetInRange: inRange(state.pos, target || { x: 1e9, y: 1e9 }, s.range),
    attackTimer: state.attackTimer,
  })) {
    fireAttack(state);
  }

  state.enemies.forEach((en) => {
    const hold = en.isBoss ? 70 : 36;
    const next = moveTowards(en, state.pos, en.speed, dt, hold);
    en.x = next.x;
    en.y = next.y;
    en.cd -= dt;
    en.swing = Math.max(0, (en.swing || 0) - dt);
    if (en.cd <= 0 && inRange(en, state.pos, en.range + 8) && state.invuln <= 0) {
      h.hp -= en.damage;
      state.invuln = 0.55;
      en.swing = 0.25;
      en.cd = en.isBoss ? 1.1 : 1.35;
      burst(state, state.pos.x, state.pos.y, "#ff6b8a");
      if (h.hp <= 0) die(state);
      refreshHud(state);
    }
  });

  tickProjectiles(state, dt);
  if (state.portal && dist(state.pos, state.portal) < 46) nextFloor(state);
  tickParticles(state, dt);
}
