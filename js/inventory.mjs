import { bakeSprite, SLOT_SPRITES } from "./sprites.mjs";
import { statsOf } from "./stats.mjs";
import { log, refreshHud } from "./hud.mjs";
import { inspectItem, bindHold } from "./item-info.mjs";
import { iconFor } from "./gear-looks.mjs";

export const MANA_COST = { knight: 16, mage: 28, archer: 18 };

export function manaCost(classId) {
  return MANA_COST[classId] || 16;
}

export function spendMana(hero, amount) {
  if (!hero || hero.mana < amount) return false;
  hero.mana -= amount;
  return true;
}

export function regenMana(hero, dt, maxMana) {
  if (!hero) return;
  hero.mana = Math.min(maxMana, hero.mana + dt * 8);
}

export function toggleInv(state) {
  if (!state.hero || (state.mode !== "play" && !state.invOpen)) return false;
  state.invOpen = !state.invOpen;
  return state.invOpen;
}

export function equipFromBag(hero, bagIndex) {
  if (!hero || bagIndex < 0 || bagIndex >= hero.bag.length) return null;
  const item = hero.bag[bagIndex];
  hero.bag.splice(bagIndex, 1);
  const old = hero.gear[item.slot];
  hero.gear[item.slot] = item;
  if (old) hero.bag.push(old);
  const s = statsOf(hero);
  if (hero.hp > s.maxHp) hero.hp = s.maxHp;
  if (hero.mana > s.maxMana) hero.mana = s.maxMana;
  return item;
}

export function showItemTip(item) {
  const tip = document.getElementById("item-tip");
  if (!tip) return inspectItem(item);
  const info = inspectItem(item);
  tip.innerHTML = `<b style="color:${info.color}">${info.title}</b>${info.lines.map((l) => `<div>${l}</div>`).join("")}`;
  tip.classList.remove("hidden");
  return info;
}

export function hideItemTip() {
  document.getElementById("item-tip")?.classList.add("hidden");
}

function itemIcon(it, classId, slot) {
  return bakeSprite(iconFor(it, classId, SLOT_SPRITES[slot || it?.slot] || "charm"), 3);
}

export function renderInv(state) {
  const overlay = document.getElementById("inv-overlay");
  if (!overlay || !state.hero) return;
  overlay.classList.toggle("hidden", !state.invOpen);
  if (!state.invOpen) {
    hideItemTip();
    return;
  }
  const h = state.hero;
  const equip = document.getElementById("inv-equip");
  const bag = document.getElementById("inv-bag");
  equip.innerHTML = "";
  ["weapon", "armor", "boots", "charm"].forEach((slot) => {
    const it = h.gear[slot];
    const d = document.createElement("div");
    d.className = "inv-slot";
    d.style.borderColor = it?.color || "#c9a227";
    d.innerHTML = `<img alt="" src="${itemIcon(it, h.classId, slot)}" /><b>${slot}</b><small>${it ? `${it.name} +${it.power}` : "tom"}</small>`;
    bindHold(d, { onHold: () => showItemTip(it) });
    equip.appendChild(d);
  });
  bag.innerHTML = "";
  if (!h.bag.length) {
    bag.innerHTML = "<p class='inv-empty'>Väskan är tom. Plocka skatter i grottan!</p>";
    return;
  }
  h.bag.forEach((it, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "inv-item";
    btn.style.borderColor = it.color;
    btn.innerHTML = `<img alt="" src="${itemIcon(it, h.classId)}" /><b style="color:${it.color}">${it.rarityName}</b><span>${it.name}</span><small>${it.slot} +${it.power}</small>`;
    bindHold(btn, {
      onHold: () => showItemTip(it),
      onTap: () => {
        hideItemTip();
        const worn = equipFromBag(h, i);
        if (worn) log(`Tog på ${worn.name}`);
        refreshHud(state);
        renderInv(state);
      },
    });
    bag.appendChild(btn);
  });
}

export function bindInventory(state) {
  const open = () => {
    if (!state.hero || state.mode !== "play") return;
    toggleInv(state);
    renderInv(state);
  };
  document.getElementById("inv-btn")?.addEventListener("click", open);
  document.getElementById("inv-close")?.addEventListener("click", () => {
    state.invOpen = false;
    hideItemTip();
    renderInv(state);
  });
  document.getElementById("inv-touch")?.addEventListener("click", open);
  document.getElementById("inv-overlay")?.addEventListener("click", (e) => {
    if (e.target?.id === "inv-overlay") hideItemTip();
  });
}
