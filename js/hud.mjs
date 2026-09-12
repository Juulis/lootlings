import { CLASSES } from "./classes.mjs";
import { bakeSprite, SLOT_SPRITES } from "./sprites.mjs";
import { statsOf } from "./stats.mjs";

export function log(msg) {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 5) el.lastChild.remove();
}

function setOrb(fillId, txtId, cur, max) {
  const fill = document.getElementById(fillId);
  const txt = document.getElementById(txtId);
  const pct = Math.max(0, Math.min(100, (cur / Math.max(1, max)) * 100));
  if (fill) fill.style.height = `${pct}%`;
  if (txt) txt.textContent = `${Math.max(0, Math.ceil(cur))}/${Math.ceil(max)}`;
}

export function refreshHud(state) {
  const h = state.hero;
  if (!h) return;
  const s = statsOf(h);
  setOrb("hp-fill", "hp-txt", h.hp, s.maxHp);
  setOrb("mp-fill", "mp-txt", h.mana, s.maxMana);
  const xp = document.getElementById("xp-fill");
  const xpTxt = document.getElementById("xp-txt");
  const xpPct = Math.max(0, (h.xp / h.xpToLevel) * 100);
  if (xp) xp.style.width = `${xpPct}%`;
  if (xpTxt) xpTxt.textContent = `XP ${h.xp}/${h.xpToLevel}`;
  const meta = document.getElementById("meta");
  if (meta) meta.textContent = `${h.name} Nv ${h.level} · Våning ${h.floor} · Guld ${h.gold}`;
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
    btn.innerHTML = `<img class="class-art" alt="" src="${thumb}" /><b>${c.name}</b><small>${c.blurb}</small><br><small>${c.skill.name}: ${c.skill.desc}</small>`;
    btn.style.borderColor = c.color;
    btn.onclick = () => onPick(c.id);
    box.appendChild(btn);
  });
}

export function setSkillLabel(state) {
  if (!state.hero) return;
  const ready = state.skillTimer <= 0;
  const btn = document.getElementById("skl-btn");
  if (!btn) return;
  btn.textContent = ready ? CLASSES[state.hero.classId].skill.name : state.skillTimer.toFixed(1);
}
