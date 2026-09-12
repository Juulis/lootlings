import { openSkillPick } from "./run.mjs";

export function bindInput(state, { canvas, fireAttack, useSkill }) {
  window.addEventListener("keydown", (e) => {
    state.keys[e.key.toLowerCase()] = true;
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      fireAttack(state);
    }
    if (e.key.toLowerCase() === "e" || e.key === "Shift") useSkill(state);
    if (e.key === "1") useSkill(state, "smash");
    if (e.key === "2") useSkill(state, "star");
    if (e.key === "3") useSkill(state, "volley");
    if (e.key.toLowerCase() === "k") {
      openSkillPick(state);
    }
  });
  window.addEventListener("keyup", (e) => {
    state.keys[e.key.toLowerCase()] = false;
  });
  canvas.addEventListener("pointerdown", (e) => {
    state.pointer.down = true;
    aimFromEvent(state, canvas, e);
    fireAttack(state);
  });
  canvas.addEventListener("pointermove", (e) => aimFromEvent(state, canvas, e));
  window.addEventListener("pointerup", () => {
    state.pointer.down = false;
  });

  const stickEl = document.getElementById("stick");
  const knob = document.getElementById("knob");
  function stickFrom(e) {
    const r = stickEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = 36;
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, max / len);
    dx *= k;
    dy *= k;
    state.stick.x = dx / max;
    state.stick.y = dy / max;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  }
  stickEl.addEventListener("pointerdown", (e) => {
    stickEl.setPointerCapture(e.pointerId);
    state.stick.active = true;
    stickFrom(e);
  });
  stickEl.addEventListener("pointermove", (e) => {
    if (state.stick.active) stickFrom(e);
  });
  stickEl.addEventListener("pointerup", () => {
    state.stick.active = false;
    state.stick.x = 0;
    state.stick.y = 0;
    knob.style.transform = "";
  });

  const atkBtn = document.getElementById("atk-btn");
  atkBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    atkBtn.setPointerCapture(e.pointerId);
    state.touchAttack = true;
    fireAttack(state);
  });
  atkBtn.addEventListener("pointerup", () => {
    state.touchAttack = false;
  });
  atkBtn.addEventListener("pointercancel", () => {
    state.touchAttack = false;
  });
  document.getElementById("skl-btn").onclick = () => useSkill(state);
}

function aimFromEvent(state, canvas, e) {
  const r = canvas.getBoundingClientRect();
  state.pointer.x = e.clientX - r.left;
  state.pointer.y = e.clientY - r.top;
}
