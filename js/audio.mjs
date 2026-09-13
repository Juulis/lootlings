/** CC0-referenser: Kenney RPG Audio + artisticdude (sfx/LICENSE.txt). Syntade SFX. */
export const SFX_KEYS = ["slash","swing","hit","loot","click","portal","bag","die","magic","level","kill"];
let muted = false, unlocked = false, actx = null;
function ctx() {
  if (!globalThis.AudioContext && !globalThis.webkitAudioContext) return null;
  if (!actx) actx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
  return actx;
}
export function unlockAudio() {
  unlocked = true;
  const a = ctx();
  if (a && a.state === "suspended") a.resume().catch(() => {});
}
export function isMuted() { return muted; }
export function setMuted(v) { muted = !!v; return muted; }
export function toggleMute() { muted = !muted; return muted; }
function env(g, t0, a = 0.01, d = 0.12, peak = 0.2) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
}
function beep(a, { freq = 440, type = "square", dur = 0.12, vol = 0.18, slide = 0 } = {}) {
  const t0 = a.currentTime, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  env(g, t0, 0.008, dur, vol); o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
function noise(a, { dur = 0.08, vol = 0.12, filter = 1800 } = {}) {
  const t0 = a.currentTime, n = a.sampleRate * dur, buf = a.createBuffer(1, n, a.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = filter;
  const g = a.createGain(); env(g, t0, 0.005, dur, vol);
  src.connect(f); f.connect(g); g.connect(a.destination); src.start(t0);
}
const PATCH = {
  slash: (a) => { noise(a, { dur: 0.07, vol: 0.16, filter: 2400 }); beep(a, { freq: 520, type: "sawtooth", dur: 0.09, vol: 0.1, slide: -280 }); },
  swing: (a) => beep(a, { freq: 220, type: "sawtooth", dur: 0.1, vol: 0.1, slide: -80 }),
  hit: (a) => { beep(a, { freq: 140, type: "square", dur: 0.08, vol: 0.16, slide: -60 }); noise(a, { dur: 0.05, vol: 0.1, filter: 900 }); },
  loot: (a) => { beep(a, { freq: 880, type: "sine", dur: 0.08, vol: 0.12 }); beep(a, { freq: 1320, type: "sine", dur: 0.1, vol: 0.1 }); },
  click: (a) => beep(a, { freq: 980, type: "square", dur: 0.04, vol: 0.08 }),
  portal: (a) => { beep(a, { freq: 240, type: "sine", dur: 0.28, vol: 0.12, slide: 360 }); beep(a, { freq: 480, type: "sine", dur: 0.3, vol: 0.08, slide: 200 }); },
  bag: (a) => noise(a, { dur: 0.09, vol: 0.1, filter: 600 }),
  die: (a) => beep(a, { freq: 180, type: "triangle", dur: 0.4, vol: 0.16, slide: -140 }),
  magic: (a) => { beep(a, { freq: 420, type: "sine", dur: 0.16, vol: 0.12, slide: 220 }); beep(a, { freq: 640, type: "triangle", dur: 0.18, vol: 0.08 }); },
  level: (a) => { beep(a, { freq: 523, type: "sine", dur: 0.1, vol: 0.12 }); beep(a, { freq: 784, type: "sine", dur: 0.16, vol: 0.12 }); },
  kill: (a) => { beep(a, { freq: 160, type: "square", dur: 0.12, vol: 0.14, slide: -90 }); noise(a, { dur: 0.08, vol: 0.08, filter: 700 }); },
};
export function playSfx(name) {
  if (muted || !unlocked) return false;
  if (!PATCH[name]) return false;
  const a = ctx(); if (!a) return false;
  try { PATCH[name](a); return true; } catch { return false; }
}
export function bindAudio() {
  const kick = () => unlockAudio();
  window.addEventListener("pointerdown", kick);
  window.addEventListener("keydown", kick);
  const btn = document.getElementById("sfx-btn");
  if (btn) btn.onclick = () => { unlockAudio(); btn.textContent = toggleMute() ? "Ljud av" : "Ljud på"; };
}
