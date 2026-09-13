import { CLASSES } from "./classes.mjs";
import { bakeSprite, SLOT_SPRITES } from "./sprites.mjs";
import { statsOf } from "./stats.mjs";
import { SKILLS } from "./skills.mjs";

export function log(msg) {
  const el = document.getElementById("log");
  if (!el) return;
  const line = document.createElement("div");
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 5) el.lastChild.remove();
}

function n(v, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

export function refreshHud(state) {
  const h = state.hero;
  if (!h) return;
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
  const box = document.getElementById("class-picks");
  box.innerHTML = "";
  Object.values(CLASSES).forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "class-btn";
    const thumb = bakeSprite(c.id, 3);
    btn.innerHTML = `<img class="class-art" alt="" src="${thumb}" /><b>${c.name}</b><small>${c.blurb}</small><br><small>Smäll · Stjärna · Salva</small>`;
    btn.style.borderColor = c.color;
    btn.onclick = () => onPick(c.id);
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
