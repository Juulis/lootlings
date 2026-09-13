import { CLASSES } from "./classes.mjs";
import { bakeSprite, SLOT_SPRITES } from "./sprites.mjs";
import { statsOf } from "./stats.mjs";
import { SKILLS } from "./skills.mjs";
import { versionLabel } from "./version.mjs";

export function log(msg) {
  if (typeof document === "undefined") return;
  const el = document.getElementById("log");
  if (!el) return;
  const line = document.createElement("div");
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 5) el.lastChild.remove();
}

let toastTimer = 0;
export function toast(msg) {
  if (typeof document === "undefined") return;
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2200);
}

function n(v, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

export function showVersion() {
  if (typeof document === "undefined") return versionLabel();
  const el = document.getElementById("build-ver");
  if (el) el.textContent = versionLabel();
  return versionLabel();
}

export function refreshHud(state) {
  const h = state.hero;
  if (!h || typeof document === "undefined") return;
  const s = statsOf(h);
  const hp = Math.max(0, n(h.hp));
  const maxHp = Math.max(1, n(s.maxHp, 1));
  const mp = Math.max(0, n(h.mana));
  const maxMp = Math.max(1, n(s.maxMana, 1));
  const hpFill = document.getElementById("hp-fill");
  const mpFill = document.getElementById("mp-fill");
  const hpTxt = document.getElementById("hp-txt");
  const mpTxt = document.getElementById("mp-txt");
  if (hpFill) hpFill.style.height = `${Math.min(100, (hp / maxHp) * 100)}%`;
  if (mpFill) mpFill.style.height = `${Math.min(100, (mp / maxMp) * 100)}%`;
  if (hpTxt) hpTxt.textContent = `${Math.ceil(hp)}/${Math.ceil(maxHp)}`;
  if (mpTxt) mpTxt.textContent = `${Math.ceil(mp)}/${Math.ceil(maxMp)}`;
  const xp = document.getElementById("xp-fill");
  const xpTxt = document.getElementById("xp-txt");
  const xpNeed = Math.max(1, n(h.xpToLevel, 1));
  const xpCur = Math.max(0, n(h.xp));
  if (xp) xp.style.width = `${Math.min(100, (xpCur / xpNeed) * 100)}%`;
  if (xpTxt) xpTxt.textContent = `XP ${Math.floor(xpCur)}/${Math.floor(xpNeed)}`;
  const meta = document.getElementById("meta");
  if (meta) meta.textContent =
    `${h.name} Nv ${h.level} · Våning ${h.floor} · Guld ${h.gold} · Skada ${s.damage} · Fart ${Math.round(s.speed)}`;
  const statsEl = document.getElementById("hero-stats");
  if (statsEl) {
    const book = Object.values(SKILLS).map((def) => {
      const sl = h.skills?.[def.id];
      return sl?.unlocked ? `${def.name} Nv${sl.level}` : `${def.name} låst`;
    }).join(" · ");
    statsEl.textContent = `Tur ${s.luck} · Räckvidd ${Math.round(s.range)} · Poäng ${h.skillPoints || 0} · ${book}`;
  }
  const gear = document.getElementById("gear");
  if (!gear) return;
  gear.innerHTML = "";
  ["weapon", "armor", "boots", "charm"].forEach((slot) => {
    const it = h.gear[slot];
    const d = document.createElement("div");
    d.className = "slot";
    d.style.borderColor = it?.color || "#fff3";
    const icon = bakeSprite(SLOT_SPRITES[slot] || "charm", 2);
    d.innerHTML = `<img alt="" src="${icon}" /><span>${it ? `${it.name} ${it.power}` : slot}</span>`;
    gear.appendChild(d);
  });
}

export function renderMenu(onPick) {
  if (typeof document === "undefined") return;
  showVersion();
  const box = document.getElementById("class-picks");
  if (!box) return;
  box.innerHTML = "";
  Object.values(CLASSES).forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "class-btn";
    const thumb = bakeSprite(c.id, 3);
    btn.innerHTML = `<img class="class-art" alt="" src="${thumb}" /><b>${c.name}</b><small>${c.blurb}</small><br><small>Smäll · Stjärna · Salva</small>`;
    btn.style.borderColor = c.color;
    btn.onclick = () => onPick(c.id);
    box.appendChild(btn);
  });
}

export function renderSkillMenu(state) {
  if (typeof document === "undefined") return;
  const box = document.getElementById("skill-picks");
  const hint = document.getElementById("skill-hint");
  if (!box || !state.hero) return;
  const pts = state.hero.skillPoints || 0;
  if (hint) hint.textContent = pts
    ? `Du har ${pts} skillpoint. Tryck på en låst kraft för att lära den.`
    : "Inga poäng just nu. Levela mer.";
  box.innerHTML = "";
  Object.values(SKILLS).forEach((def, i) => {
    const sl = state.hero.skills?.[def.id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "class-btn";
    btn.dataset.skill = def.id;
    const status = sl?.unlocked ? `Nv ${sl.level}` : "Låst";
    btn.innerHTML = `<b>${i + 1}. ${def.name}</b><small>${def.desc}</small><br><small>${status}</small>`;
    btn.style.borderColor = sl?.unlocked ? def.color : "#fff3";
    btn.style.opacity = sl?.unlocked || pts ? "1" : "0.55";
    box.appendChild(btn);
  });
}

export function setSkillLabel(state) {
  if (!state.hero) return;
  const id = state.hero.activeSkill;
  const def = id && SKILLS[id];
  const cd = (state.skillCds && id && state.skillCds[id]) || 0;
  const btn = document.getElementById("skl-btn");
  if (!btn) return;
  if (!def) btn.textContent = "B";
  else btn.textContent = cd > 0 ? cd.toFixed(1) : def.name;
}
