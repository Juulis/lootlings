import { drawDungeon, drawHpBar, drawLootIcon, drawPortal, drawSprite } from "./sprites.mjs";
import { poseFrame } from "./pose.mjs";
import { drawParticles } from "./fx.mjs";
import { setSkillLabel } from "./hud.mjs";

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

  drawDungeon(ctx, state.map, now);

  if (state.portal) {
    drawPortal(ctx, state.portal.x, state.portal.y, now);
    ctx.fillStyle = "#fff8e7";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText("Nästa", state.portal.x - 16, state.portal.y + 34);
  }

  state.pickups.forEach((p) => {
    const bounce = Math.sin(now / 140 + p.x) * 3;
    if (p.slot) drawLootIcon(ctx, p.slot, p.x, p.y + bounce, p.color);
    else drawSprite(ctx, "gold", p.x, p.y + bounce, { scale: 2, shadow: false });
  });

  state.enemies.forEach((en) => {
    const kind = en.isBoss ? "boss" : en.kind;
    const facing = en.x < state.pos.x;
    const pose = en.swing > 0 ? "attack" : "walk";
    drawSprite(ctx, poseFrame(kind, now + en.id * 90, pose), en.x, en.y, {
      scale: en.isBoss ? 4 : 3,
      bob: Math.sin(now / 180 + en.id) * (en.kind === "bat" ? 4 : 1.5),
      flip: facing,
    });
    drawHpBar(ctx, en.x, en.y - (en.isBoss ? 40 : 28), en.hp / en.maxHp, en.isBoss ? 44 : 32);
  });

  if (state.hero) {
    const moving = state.keys.w || state.keys.a || state.keys.s || state.keys.d
      || state.keys.arrowup || state.keys.arrowleft || state.keys.arrowdown || state.keys.arrowright
      || Math.hypot(state.stick.x, state.stick.y) > 0.1;
    const pose = state.attackFlash > 0 ? "attack" : moving ? "walk" : "idle";
    const flip = state.facingLeft;
    drawSprite(ctx, poseFrame(state.hero.classId, now, pose), state.pos.x, state.pos.y, {
      scale: 3,
      bob: moving ? Math.sin(now / 90) * 2 : Math.sin(now / 400) * 1,
      flip,
    });
    if (state.attackFlash > 0 && state.hero.classId === "knight") {
      drawSprite(ctx, "slash", state.pos.x + (flip ? -22 : 22), state.pos.y, {
        scale: 3, shadow: false, flip,
      });
    }
  }

  state.projectiles.forEach((p) => {
    if (p.star) {
      ctx.fillStyle = "rgba(192,132,252,0.25)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      drawSprite(ctx, now % 360 < 180 ? "spark1" : "spark0", p.x, p.y, { scale: 3, shadow: false });
    } else {
      const ang = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      drawSprite(ctx, p.splash ? "spark1" : "spark0", 0, 0, { scale: 2, shadow: false });
      ctx.restore();
    }
  });

  drawParticles(ctx, state.particles);
  ctx.restore();
  setSkillLabel(state);
}
