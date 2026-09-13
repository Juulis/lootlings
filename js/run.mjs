import { createHero, applyLevelUp } from "./classes.mjs";
import { lootFromKill, compareItems } from "./loot.mjs";
import { enemyStats } from "./combat.mjs";
import { statsOf } from "./stats.mjs";
import { log, toast, refreshHud } from "./hud.mjs";
import { burst } from "./fx.mjs";
import { generateFloor, pathSpots } from "./map.mjs";
import { openSkills } from "./skill-panel.mjs";

export function startRun(state, classId) {
  state.hero = createHero(classId);
  const st0 = statsOf(state.hero);
  state.hero.maxHp = st0.maxHp;
  state.hero.hp = st0.maxHp;
  state.hero.mana = st0.maxMana;
  state.invOpen = false;
  state.skillsOpen = false;
  state.mode = "play";
  document.getElementById("overlay")?.classList.add("hidden");
  document.getElementById("dead-overlay")?.classList.add("hidden");
  spawnFloor(state);
  log(`${state.hero.name} går in i grottan!`);
  refreshHud(state);
  if (state.hero.skillPoints > 0) openSkills(state);
}

export function spawnFloor(state) {
  const h = state.hero;
  const isBoss = h.floor % 5 === 0;
  state.map = generateFloor(h.floor);
  state.pos = { ...state.map.start };
  state.enemies = [];
  state.projectiles = [];
  state.pickups = [];
  state.portal = null;
  const n = isBoss ? 1 : 4 + Math.min(8, Math.floor(h.floor * 0.8));
  const spots = pathSpots(state.map, n, 500);
  for (let i = 0; i < n; i++) {
    const kind = isBoss ? "boss" : ["slime", "bat", "shroom"][i % 3];
    const st = enemyStats(h.floor, isBoss);
    const spot = spots[i] || state.map.goal;
    state.enemies.push({
      id: i, kind, isBoss,
      x: spot.x + (Math.random() - 0.5) * 20,
      y: spot.y + (Math.random() - 0.5) * 20,
      hp: st.hp, maxHp: st.hp, damage: st.damage,
      speed: st.speed, range: st.range,
      cd: 0.4 + Math.random(), swing: 0,
    });
  }
  log(isBoss ? `Våning ${h.floor}: en stor väktare längs stigen!` : `Våning ${h.floor}: följ stigen · ${n} monster`);
}

export function gainXp(state, amount) {
  const h = state.hero;
  h.xp += amount;
  while (h.xp >= h.xpToLevel) {
    h.xp -= h.xpToLevel;
    applyLevelUp(h);
    if (h.xp < 0) h.xp = 0;
    toast(`Nivå ${h.level}! +1 skillpoint.`);
    openSkills(state);
  }
  const s = statsOf(h);
  if (h.hp > s.maxHp) h.hp = s.maxHp;
}

export function killEnemy(state, en) {
  const h = state.hero;
  h.kills += 1;
  const loot = lootFromKill({
    classId: h.classId, level: h.floor, luck: statsOf(h).luck, isBoss: en.isBoss,
  });
  h.gold += loot.gold;
  gainXp(state, en.isBoss ? 28 + h.floor * 8 : 8 + h.floor * 2);
  loot.drops.forEach((d) => state.pickups.push({ ...d, x: en.x, y: en.y, vy: -40 }));
  if (loot.drops.length) {
    loot.drops.forEach((item) => {
      const how = applyDrop(h, item);
      toast(how === "equip" ? `På: ${item.name}` : `Väska: ${item.name}`);
    });
  } else toast(`+${loot.gold} guld`);
  burst(state, en.x, en.y, en.isBoss ? "#ffd76a" : "#9ae6ff");
  if (state.enemies.length === 0) {
    state.portal = { x: state.map.goal.x, y: state.map.goal.y };
    log("Portalen lyser längst bort på stigen. Följ guldet!");
  }
  refreshHud(state);
}

export function applyDrop(hero, item) {
  const cur = hero.gear[item.slot];
  if (!cur || compareItems(cur, item) < 0) {
    if (cur) hero.bag.push(cur);
    hero.gear[item.slot] = item;
  const s = statsOf(hero);
    if (hero.hp > s.maxHp) hero.hp = s.maxHp;
    return "equip";
  }
  hero.bag.push(item);
  return "bag";
}

export function bindLoot() {}

export function nextFloor(state) {
  state.hero.floor += 1;
  state.hero.hp = Math.min(statsOf(state.hero).maxHp, state.hero.hp + 18);
  spawnFloor(state);
  refreshHud(state);
}

export function die(state) {
  state.mode = "dead";
  document.getElementById("dead-text").textContent =
    `${state.hero.name} nådde våning ${state.hero.floor} och besegrade ${state.hero.kills} monster.`;
  document.getElementById("dead-overlay").classList.remove("hidden");
  const score = state.hero.kills * 10 + state.hero.floor * 25 + state.hero.gold;
  fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: state.hero.name, classId: state.hero.classId, score, floor: state.hero.floor,
    }),
  }).catch(() => {});
}

export function bindAgain(state) {
  document.getElementById("again").onclick = () => {
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("dead-overlay").classList.add("hidden");
    state.mode = "menu";
  };
}

export function bindSkills() {}
