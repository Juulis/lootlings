import { drawHpBar, drawLootIcon, drawPortal, drawSprite } from "./sprites.mjs";
import { poseFrame } from "./pose.mjs";
import { drawHeldWeapon } from "./weapons.mjs";
import { drawWornGear } from "./gear-looks.mjs";
import { drawParticles } from "./fx.mjs";
import { setSkillLabel } from "./hud.mjs";
import { drawMap } from "./map.mjs";

export function worldFromScreen(state, canvas) {
  const viewW = canvas.clientWidth;
  const viewH = canvas.clientHeight;
  return {
    camX: state.pos.x - viewW / 2,
    camY: state.pos.y - viewH / 2,
    viewW,
    viewH,
  };
}

export function draw(ctx, state, canvas) {
  const { camX, camY, viewW, viewH } = worldFromScreen(state, canvas);
  const now = performance.now();
  ctx.clearRect(0, 0, viewW, viewH);
  ctx.save();
  ctx.translate(-camX, -camY);

  drawMap(ctx, state.map, camX, camY, viewW, viewH, now);

  if (state.portal) {
    drawPortal(ctx, state.portal.x, state.portal.y, now);
    ctx.fillStyle = "#fff8e7";
    ctx.font = "bold 13px Trebuchet MS";
    ctx.fillText(state.indoor ? "Ut" : "Nästa", state.portal.x - 16, state.portal.y + 38);
  }

  state.pickups.forEach((p) => {
    const bounce = Math.sin(now / 140 + p.x) * 3;
    if (p.look) drawSprite(ctx, p.look, p.x, p.y + bounce, { scale: 3, shadow: false });
    else if (p.slot) drawLootIcon(ctx, p.slot, p.x, p.y + bounce, p.color);
    else drawSprite(ctx, "gold", p.x, p.y + bounce, { scale: 3, shadow: false });
  });

  state.enemies.forEach((en) => {
    const kind = en.isBoss ? "boss" : en.kind;
    const facing = en.x < state.pos.x;
    const pose = en.swing > 0 ? "attack" : "walk";
    drawSprite(ctx, poseFrame(kind, now + en.id * 90, pose), en.x, en.y, {
      scale: en.isBoss ? 5 : 4,
      bob: Math.sin(now / 180 + en.id) * (en.kind === "bat" ? 5 : 2),
      flip: facing,
    });
    drawHpBar(ctx, en.x, en.y - (en.isBoss ? 48 : 34), en.hp / en.maxHp, en.isBoss ? 52 : 36);
  });

  if (state.hero) {
    const moving = state.keys.w || state.keys.a || state.keys.s || state.keys.d
      || state.keys.arrowup || state.keys.arrowleft || state.keys.arrowdown || state.keys.arrowright
      || Math.hypot(state.stick.x, state.stick.y) > 0.1;
    const pose = state.attackFlash > 0 ? "attack" : moving ? "walk" : "idle";
    const flip = state.facingLeft;
    const bob = moving ? Math.sin(now / 90) * 2 : Math.sin(now / 400) * 1;
    drawHeldWeapon(ctx, state.hero.classId, pose, state.pos.x, state.pos.y, flip, now, bob, state.hero.gear?.weapon);
    drawSprite(ctx, poseFrame(state.hero.classId, now, pose), state.pos.x, state.pos.y, {
      scale: 4,
      bob,
      flip,
    });
    drawWornGear(ctx, state.hero, state.pos.x, state.pos.y, flip, pose, now, bob);
    if (state.attackFlash > 0 && state.hero.classId === "knight") {
      drawSprite(ctx, "slash", state.pos.x + (flip ? -26 : 26), state.pos.y - 4, {
        scale: 4, shadow: false, flip,
      });
    }
  }

  state.projectiles.forEach((p) => {
    if (p.star) {
      ctx.fillStyle = "rgba(192,132,252,0.28)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      drawSprite(ctx, now % 360 < 180 ? "spark1" : "spark0", p.x, p.y, { scale: 3, shadow: false });
    } else {
      const ang = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      drawSprite(ctx, p.splash ? "spark1" : "arrow", 0, 0, { scale: 2, shadow: false });
      ctx.restore();
    }
  });

  drawParticles(ctx, state.particles);
  ctx.restore();
  setSkillLabel(state);
}
