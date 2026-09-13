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

export function toast(msg) {
  log(msg);
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2200);
}

export function refreshHud(state) {
  const h = state.hero;
  if (!h) return;
  const s = statsOf(h);
  const hpFill = document.getElementById("hp-fill");
  const mpFill = document.getElementById("mp-fill");
  const hpTxt = document.getElementById("hp-txt");
  const mpTxt = document.getElementById("mp-txt");
  const hpPct = Math.max(0, Math.min(100, (h.hp / Math.max(1, s.maxHp)) * 100));
  const mpPct = Math.max(0, Math.min(100, (h.mana / Math.max(1, s.maxMana || 1)) * 100));
  if (hpFill) hpFill.style.height = `${hpPct}%`;
  if (mpFill) mpFill.style.height = `${mpPct}%`;
  if (hpTxt) hpTxt.textContent = `${Math.ceil(Math.max(0, h.hp))}/${Math.ceil(s.maxHp)}`;
  if (mpTxt) mpTxt.textContent = `${Math.ceil(Math.max(0, h.mana || 0))}/${Math.ceil(s.maxMana || 0)}`;
  const xp = document.getElementById("xp-fill");
  const xpTxt = document.getElementById("xp-txt");
  const xpPct = Math.max(0, (h.xp / h.xpToLevel) * 100);
  if (xp) xp.style.width = `${xpPct}%`;
  if (xpTxt) xpTxt.textContent = `XP ${h.xp}/${h.xpToLevel}`;
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
