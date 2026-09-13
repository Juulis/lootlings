import { SFX_DATA } from "./sfx-data.mjs";

export const SFX_KEYS = Object.keys(SFX_DATA);

let muted = false;
let unlocked = false;

function ctx() {
  if (!globalThis.AudioContext && !globalThis.webkitAudioContext) return null;
  if (!ctx._a) {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    ctx._a = new AC();
  }
  return ctx._a;
}

export function unlockAudio() {
  unlocked = true;
  const a = ctx();
  if (a && a.state === "suspended") a.resume().catch(() => {});
}

export function isMuted() {
  return muted;
}

export function setMuted(v) {
  muted = !!v;
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function playSfx(name, { volume = 0.55 } = {}) {
  if (muted || !unlocked) return false;
  const src = SFX_DATA[name];
  if (!src) return false;
  try {
    const a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, volume));
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function bindAudio() {
  const kick = () => unlockAudio();
  window.addEventListener("pointerdown", kick);
  window.addEventListener("keydown", kick);
  const btn = document.getElementById("sfx-btn");
  if (btn) {
    btn.onclick = () => {
      unlockAudio();
      btn.textContent = toggleMute() ? "Ljud av" : "Ljud på";
    };
  }
}
