import { createState } from "./game-state.mjs";
import { renderMenu } from "./hud.mjs";
import { startRun, bindLoot, bindAgain } from "./run.mjs";
import { fireAttack, useSkill } from "./actions.mjs";
import { bindInput } from "./input.mjs";
import { update } from "./sim.mjs";
import { draw } from "./view.mjs";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const touchLayer = document.getElementById("touch");
const state = createState();

function resize() {
  const wrap = document.getElementById("stage-wrap");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(wrap.clientWidth * dpr);
  canvas.height = Math.floor(wrap.clientHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 120));

async function lockLandscape() {
  try {
    const o = screen.orientation;
    if (o && o.lock) await o.lock("landscape");
  } catch (_) {}
}

bindLoot(state);
bindAgain(state);
bindInput(state, { canvas, fireAttack, useSkill });
renderMenu((id) => startRun(state, id));
resize();

function loop(ts) {
  const dt = Math.min(0.05, (ts - state.last) / 1000 || 0.016);
  state.last = ts;
  update(state, dt);
  draw(ctx, state, canvas);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

if (window.matchMedia("(pointer: coarse)").matches) {
  touchLayer.classList.remove("hidden");
} else {
  touchLayer.classList.add("hidden");
}
window.addEventListener("pointerdown", () => {
  if (window.matchMedia("(pointer: coarse)").matches) touchLayer.classList.remove("hidden");
  lockLandscape();
});
