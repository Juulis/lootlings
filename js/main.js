import { CLASSES, createHero, equippedBonus, applyLevelUp } from "./classes.mjs";
import { lootFromKill, compareItems } from "./loot.mjs";
import { dist, moveTowards, enemyStats, inRange } from "./combat.mjs";
import {
  bakeSprite,
  drawDungeon,
  drawHpBar,
  drawLootIcon,
  drawPortal,
  drawSprite,
  frameFor,
  SLOT_SPRITES,
} from "./sprites.mjs";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const lootOverlay = document.getElementById("loot-overlay");
const deadOverlay = document.getElementById("dead-overlay");
const touchLayer = document.getElementById("touch");

const state = {
  mode: "menu",
  hero: null,
  pos: { x: 400, y: 300 },
  enemies: [],
  projectiles: [],
  pickups: [],
  particles: [],
  map: { w: 900, h: 640 },
  keys: {},
  pointer: { x: 0, y: 0, down: false },
  stick: { x: 0, y: 0, active: false },
  attackTimer: 0,
  skillTimer: 0,
  invuln: 0,
  pendingLoot: [],
  last: 0,
  portal: null,
};

function resize() {
  const wrap = document.getElementById("stage-wrap");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(wrap.clientWidth * dpr);
  canvas.height = Math.floor(wrap.clientHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);

function log(msg) {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 5) el.lastChild.remove();
}

function statsOf(hero) {
  const b = equippedBonus(hero);
  return {
    damage: hero.damage + b.damage,
    maxHp: hero.maxHp + b.maxHp,
    speed: hero.speed + b.speed,
    luck: hero.luck + b.luck,
    range: hero.range + (hero.gear.weapon?.power || 0) * 0.4,
  };
}

function renderMenu() {
  const box = document.getElementById("class-picks");
  box.innerHTML = "";
  Object.values(CLASSES).forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "class-btn";
    const thumb = bakeSprite(c.id, 3);
    btn.innerHTML = `<img class="class-art" alt="" src="${thumb}" /><b>${c.name}</b><small>${c.blurb}</small><br><small>${c.skill.name}: ${c.skill.desc}</small>`;
    btn.style.borderColor = c.color;
    btn.onclick = () => startRun(c.id);
    box.appendChild(btn);
  });
}

function startRun(classId) {
  state.hero = createHero(classId);
  state.hero.maxHp = statsOf(state.hero).maxHp;
  state.hero.hp = state.hero.maxHp;
  state.mode = "play";
  overlay.classList.add("hidden");
  deadOverlay.classList.add("hidden");
  spawnFloor();
  log(`${state.hero.name} går in i grottan!`);
  refreshHud();
}

function spawnFloor() {
  const h = state.hero;
  const isBoss = h.floor % 5 === 0;
  state.pos = { x: 120, y: state.map.h / 2 };
  state.enemies = [];
  state.projectiles = [];
  state.pickups = [];
  state.portal = null;
  const n = isBoss ? 1 : 3 + Math.min(6, Math.floor(h.floor * 0.7));
  for (let i = 0; i < n; i++) {
    const kind = isBoss ? "boss" : ["slime", "bat", "shroom"][i % 3];
    const st = enemyStats(h.floor, isBoss);
    state.enemies.push({
      id: i,
      kind,
      isBoss,
      x: 420 + Math.random() * 380,
      y: 80 + Math.random() * (state.map.h - 160),
      hp: st.hp,
      maxHp: st.hp,
      damage: st.damage,
      speed: st.speed,
      range: st.range,
      cd: 0.4 + Math.random(),
    });
  }
  log(isBoss ? `Våning ${h.floor}: en stor väktare!` : `Våning ${h.floor}: ${n} monster`);
}

function refreshHud() {
  const h = state.hero;
  if (!h) return;
  const s = statsOf(h);
  document.getElementById("hp-fill").style.width = `${Math.max(0, (h.hp / s.maxHp) * 100)}%`;
  document.getElementById("xp-fill").style.width = `${Math.max(0, (h.xp / h.xpToLevel) * 100)}%`;
  document.getElementById("meta").textContent =
    `${h.name} Nv ${h.level} · Våning ${h.floor} · Guld ${h.gold} · Monster ${h.kills}`;
  const gear = document.getElementById("gear");
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

function gainXp(amount) {
  const h = state.hero;
  h.xp += amount;
  while (h.xp >= h.xpToLevel) {
    h.xp -= h.xpToLevel;
    applyLevelUp(h);
    if (h.xp < 0) h.xp = 0;
    log(`Nivå ${h.level}! Du blev starkare.`);
  }
  const s = statsOf(h);
  if (h.hp > s.maxHp) h.hp = s.maxHp;
}

function killEnemy(en) {
  const h = state.hero;
  h.kills += 1;
  const loot = lootFromKill({
    classId: h.classId,
    level: h.floor,
    luck: statsOf(h).luck,
    isBoss: en.isBoss,
  });
  h.gold += loot.gold;
  gainXp(en.isBoss ? 28 + h.floor * 8 : 8 + h.floor * 2);
  loot.drops.forEach((d) => state.pickups.push({ ...d, x: en.x, y: en.y, vy: -40 }));
  if (loot.drops.length) {
    state.pendingLoot.push(...loot.drops);
    openLoot();
  } else {
    log(`+${loot.gold} guld`);
  }
  burst(en.x, en.y, en.isBoss ? "#ffd76a" : "#9ae6ff");
  if (state.enemies.length === 0) {
    state.portal = { x: state.map.w - 90, y: state.map.h / 2 };
    log("Portalen lyser. Gå in!");
  }
  refreshHud();
}

function openLoot() {
  if (!state.pendingLoot.length) {
    lootOverlay.classList.add("hidden");
    return;
  }
  const item = state.pendingLoot[0];
  const cur = state.hero.gear[item.slot];
  const better = compareItems(cur, item) < 0;
  document.getElementById("loot-body").innerHTML = `
    <div class="loot-row" style="border-left:6px solid ${item.color}">
      <img class="loot-art" alt="" src="${bakeSprite(SLOT_SPRITES[item.slot] || "charm", 3)}" />
      <div>
        <b style="color:${item.color}">${item.rarityName}</b> ${item.name}<br>
        <small>${item.slot} · styrka ${item.power}${cur ? ` (nu ${cur.power})` : ""}</small>
      </div>
    </div>
    <p>${better ? "Den här är starkare!" : cur ? "Din gamla sak är bättre eller likadan." : "Ny pryl!"}</p>
  `;
  lootOverlay.classList.remove("hidden");
}

document.getElementById("take-loot").onclick = () => {
  const item = state.pendingLoot.shift();
  if (item) {
    const old = state.hero.gear[item.slot];
    state.hero.gear[item.slot] = item;
    if (old) state.hero.bag.push(old);
    log(`Tog på ${item.name}`);
    const s = statsOf(state.hero);
    if (state.hero.hp > s.maxHp) state.hero.hp = s.maxHp;
  }
  refreshHud();
  openLoot();
};
document.getElementById("skip-loot").onclick = () => {
  const item = state.pendingLoot.shift();
  if (item) state.hero.bag.push(item);
  openLoot();
};

function fireAttack() {
  const h = state.hero;
  if (!h || state.mode !== "play" || state.attackTimer > 0) return;
  const s = statsOf(h);
  state.attackTimer = h.attackCd;
  const target = nearestEnemy();
  const aim = target
    ? { x: target.x, y: target.y }
    : { x: state.pos.x + (state.pointer.x - canvas.clientWidth / 2), y: state.pos.y };
  if (h.classId === "knight") {
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) <= s.range) hitEnemy(en, s.damage);
    });
    burst(state.pos.x, state.pos.y, CLASSES.knight.accent);
  } else {
    spawnShot(aim, s.damage, h.classId === "mage" ? 18 : 10, h.classId === "mage");
  }
}

function useSkill() {
  const h = state.hero;
  if (!h || state.skillTimer > 0) return;
  const s = statsOf(h);
  state.skillTimer = CLASSES[h.classId].skill.cd;
  if (h.classId === "knight") {
    state.enemies.forEach((en) => {
      if (dist(state.pos, en) < 120) {
        hitEnemy(en, s.damage * 1.6);
        const away = moveTowards(en, state.pos, -280, 0.2);
        en.x = away.x;
        en.y = away.y;
      }
    });
    log("Sköldsmäll!");
  } else if (h.classId === "mage") {
    const t = nearestEnemy() || { x: state.pos.x + 80, y: state.pos.y };
    state.projectiles.push({
      x: t.x, y: t.y, vx: 0, vy: 0, dmg: s.damage * 1.4, r: 70, life: 0.35, splash: true, star: true,
    });
    log("Stjärnregn!");
  } else {
    const t = nearestEnemy() || { x: state.pos.x + 80, y: state.pos.y };
    for (let i = -1; i <= 1; i++) {
      spawnShot({ x: t.x, y: t.y + i * 18 }, s.damage * 0.85, 10, false);
    }
    log("Pilstorm!");
  }
}

function spawnShot(aim, dmg, r, splash) {
  const ang = Math.atan2(aim.y - state.pos.y, aim.x - state.pos.x);
  const spd = 420;
  state.projectiles.push({
    x: state.pos.x, y: state.pos.y,
    vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
    dmg, r, life: 1.1, splash,
  });
}

function nearestEnemy() {
  let best = null;
  let bestD = 1e9;
  for (const en of state.enemies) {
    const d = dist(state.pos, en);
    if (d < bestD) {
      best = en;
      bestD = d;
    }
  }
  return best;
}

function hitEnemy(en, dmg) {
  en.hp -= dmg;
  burst(en.x, en.y, "#fff");
  if (en.hp <= 0) {
    state.enemies = state.enemies.filter((e) => e !== en);
    killEnemy(en);
  }
}

function burst(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    state.particles.push({
      x, y, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, life: 0.35, color,
    });
  }
}

function nextFloor() {
  state.hero.floor += 1;
  state.hero.hp = Math.min(statsOf(state.hero).maxHp, state.hero.hp + 18);
  spawnFloor();
  refreshHud();
}

function die() {
  state.mode = "dead";
  document.getElementById("dead-text").textContent =
    `${state.hero.name} nådde våning ${state.hero.floor} och besegrade ${state.hero.kills} monster.`;
  deadOverlay.classList.remove("hidden");
  const score = state.hero.kills * 10 + state.hero.floor * 25 + state.hero.gold;
  fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: state.hero.name,
      classId: state.hero.classId,
      score,
      floor: state.hero.floor,
    }),
  }).catch(() => {});
}

document.getElementById("again").onclick = () => {
  overlay.classList.remove("hidden");
  deadOverlay.classList.add("hidden");
  state.mode = "menu";
};

window.addEventListener("keydown", (e) => {
  state.keys[e.key.toLowerCase()] = true;
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    fireAttack();
  }
  if (e.key.toLowerCase() === "e" || e.key === "Shift") useSkill();
});
window.addEventListener("keyup", (e) => {
  state.keys[e.key.toLowerCase()] = false;
});
canvas.addEventListener("pointerdown", (e) => {
  state.pointer.down = true;
  aimFromEvent(e);
  fireAttack();
});
canvas.addEventListener("pointermove", aimFromEvent);
window.addEventListener("pointerup", () => {
  state.pointer.down = false;
});
function aimFromEvent(e) {
  const r = canvas.getBoundingClientRect();
  state.pointer.x = e.clientX - r.left;
  state.pointer.y = e.clientY - r.top;
}

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
document.getElementById("atk-btn").onclick = fireAttack;
document.getElementById("skl-btn").onclick = useSkill;

function worldFromScreen() {
  const viewW = canvas.clientWidth;
  const viewH = canvas.clientHeight;
  const camX = state.pos.x - viewW / 2;
  const camY = state.pos.y - viewH / 2;
  return { camX, camY, viewW, viewH };
}

function update(dt) {
  if (state.mode !== "play" || !state.hero) return;
  const h = state.hero;
  const s = statsOf(h);
  state.attackTimer = Math.max(0, state.attackTimer - dt);
  state.skillTimer = Math.max(0, state.skillTimer - dt);
  state.invuln = Math.max(0, state.invuln - dt);

  let mx = 0;
  let my = 0;
  if (state.keys.w || state.keys.arrowup) my -= 1;
  if (state.keys.s || state.keys.arrowdown) my += 1;
  if (state.keys.a || state.keys.arrowleft) mx -= 1;
  if (state.keys.d || state.keys.arrowright) mx += 1;
  mx += state.stick.x;
  my += state.stick.y;
  const mag = Math.hypot(mx, my);
  if (mag > 1) {
    mx /= mag;
    my /= mag;
  }
  state.pos.x = Math.max(40, Math.min(state.map.w - 40, state.pos.x + mx * s.speed * dt));
  state.pos.y = Math.max(40, Math.min(state.map.h - 40, state.pos.y + my * s.speed * dt));

  if (state.pointer.down) fireAttack();

  state.enemies.forEach((en) => {
    const hold = en.isBoss ? 70 : 36;
    const next = moveTowards(en, state.pos, en.speed, dt, hold);
    en.x = next.x;
    en.y = next.y;
    en.cd -= dt;
    if (en.cd <= 0 && inRange(en, state.pos, en.range + 8) && state.invuln <= 0) {
      h.hp -= en.damage;
      state.invuln = 0.55;
      en.cd = en.isBoss ? 1.1 : 1.35;
      burst(state.pos.x, state.pos.y, "#ff6b8a");
      if (h.hp <= 0) die();
      refreshHud();
    }
  });

  state.projectiles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.star) {
      state.enemies.forEach((en) => {
        if (dist(p, en) < p.r) hitEnemy(en, p.dmg * dt * 4);
      });
    } else {
      const hit = state.enemies.find((en) => dist(p, en) < 28 + (p.splash ? 16 : 0));
      if (hit) {
        if (p.splash) {
          state.enemies.forEach((en) => {
            if (dist(hit, en) < 70) hitEnemy(en, p.dmg);
          });
        } else hitEnemy(hit, p.dmg);
        p.life = 0;
      }
    }
  });
  state.projectiles = state.projectiles.filter((p) => p.life > 0);

  if (state.portal && dist(state.pos, state.portal) < 46) nextFloor();

  state.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  });
  state.particles = state.particles.filter((p) => p.life > 0);
}

function draw() {
  const { camX, camY, viewW, viewH } = worldFromScreen();
  const now = performance.now();
  ctx.clearRect(0, 0, viewW, viewH);
  ctx.save();
  ctx.translate(-camX, -camY);

  drawDungeon(ctx, state.map, now);

  if (state.portal) {
    drawPortal(ctx, state.portal.x, state.portal.y, now);
    ctx.fillStyle = "#fff8e7";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText("Nästa", state.portal.x - 16, state.portal.y + 34);
  }

  state.pickups.forEach((p) => {
    const bounce = Math.sin(now / 140 + p.x) * 3;
    if (p.slot) drawLootIcon(ctx, p.slot, p.x, p.y + bounce, p.color);
    else drawSprite(ctx, "gold", p.x, p.y + bounce, { scale: 2, shadow: false });
  });

  state.enemies.forEach((en) => {
    const kind = en.isBoss ? "boss" : en.kind;
    const facing = en.x < state.pos.x;
    drawSprite(ctx, frameFor(kind, now + en.id * 90), en.x, en.y, {
      scale: en.isBoss ? 4 : 3,
      bob: Math.sin(now / 180 + en.id) * (en.kind === "bat" ? 4 : 1.5),
      flip: facing,
    });
    drawHpBar(ctx, en.x, en.y - (en.isBoss ? 40 : 28), en.hp / en.maxHp, en.isBoss ? 44 : 32);
  });

  if (state.hero) {
    const moving = state.keys.w || state.keys.a || state.keys.s || state.keys.d
      || state.keys.arrowup || state.keys.arrowleft || state.keys.arrowdown || state.keys.arrowright
      || Math.hypot(state.stick.x, state.stick.y) > 0.1;
    drawSprite(ctx, state.hero.classId, state.pos.x, state.pos.y, {
      scale: 3,
      bob: moving ? Math.sin(now / 90) * 2 : Math.sin(now / 400) * 1,
      flip: state.pointer.x < canvas.clientWidth / 2,
    });
  }

  state.projectiles.forEach((p) => {
    ctx.fillStyle = p.star || p.splash ? "#c084fc" : "#fff1a8";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.star ? p.r : 6, 0, Math.PI * 2);
    ctx.fill();
    if (!p.star) {
      ctx.fillStyle = p.splash ? "#9ae6ff" : "#ff8a3d";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  state.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life * 3);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 4, 4);
    ctx.globalAlpha = 1;
  });

  ctx.restore();

  if (state.hero) {
    const ready = state.skillTimer <= 0;
    document.getElementById("skl-btn").textContent = ready
      ? CLASSES[state.hero.classId].skill.name
      : state.skillTimer.toFixed(1);
  }
}

function loop(ts) {
  const dt = Math.min(0.05, (ts - state.last) / 1000 || 0.016);
  state.last = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

renderMenu();
resize();
requestAnimationFrame(loop);

if (window.matchMedia("(pointer: coarse)").matches) {
  touchLayer.classList.remove("hidden");
} else {
  touchLayer.classList.add("hidden");
}
window.addEventListener("pointerdown", () => {
  if (window.matchMedia("(pointer: coarse)").matches) touchLayer.classList.remove("hidden");
}, { once: true });
