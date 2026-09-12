import { createItem, lootFromKill, compareItems, RARITIES, SLOTS } from "../js/loot.mjs";
import { CLASSES, createHero, equippedBonus, applyLevelUp, heroPower } from "../js/classes.mjs";
import { damageAfterArmor, enemyStats, dist, inRange } from "../js/combat.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok", name);
}

test("tre distinkta klasser", () => {
  assert(Object.keys(CLASSES).length === 3, "förväntade 3 klasser");
  assert(CLASSES.knight.stats.hp > CLASSES.mage.stats.hp, "riddare ska ha mer hp");
  assert(CLASSES.mage.stats.range > CLASSES.knight.stats.range, "magiker ska ha längre räckvidd");
  assert(CLASSES.archer.stats.speed > CLASSES.knight.stats.speed, "skytt ska vara snabbare");
});

test("skapad hjälte har startvärden", () => {
  const h = createHero("mage");
  assert(h.classId === "mage", "klass");
  assert(h.level === 1 && h.gold === 0, "start");
  assert(h.hp === h.maxHp, "full hp");
});

test("loot har giltig slot och rarity", () => {
  const item = createItem({ slot: "weapon", classId: "knight", level: 3, rng: seeded(7) });
  assert(SLOTS.includes(item.slot), "slot");
  assert(RARITIES.some((r) => r.id === item.rarity), "rarity");
  assert(item.power > 0, "power");
});

test("boss loot droppar mer guld", () => {
  const rng = seeded(99);
  const normal = lootFromKill({ classId: "archer", level: 4, rng, isBoss: false });
  const boss = lootFromKill({ classId: "archer", level: 4, rng, isBoss: true });
  assert(boss.gold > normal.gold, "boss-guld");
  assert(boss.drops.length >= 1, "boss droppar alltid minst ett");
});

test("bättre item vinner jämförelse", () => {
  const weak = { power: 4 };
  const strong = { power: 12 };
  assert(compareItems(weak, strong) < 0, "weak < strong");
});

test("utrustning ger bonus", () => {
  const h = createHero("knight");
  h.gear.weapon = { power: 10 };
  h.gear.armor = { power: 8 };
  const b = equippedBonus(h);
  assert(b.damage === 10, "vapenskada");
  assert(b.maxHp === 16, "rustning hp");
  assert(heroPower(h) > heroPower(createHero("knight")), "power upp");
});

test("level up höjer hp och nivå", () => {
  const h = createHero("archer");
  const hp = h.maxHp;
  applyLevelUp(h);
  assert(h.level === 2, "nivå");
  assert(h.maxHp > hp, "hp upp");
  assert(h.hp === h.maxHp, "heal vid level");
});

test("combat math", () => {
  assert(damageAfterArmor(20, 0) === 20, "ingen rustning");
  assert(damageAfterArmor(20, 100) === 10, "50% rustning");
  const e = enemyStats(5, true);
  assert(e.hp > enemyStats(5, false).hp, "boss tankigare");
  assert(dist({ x: 0, y: 0 }, { x: 3, y: 4 }) === 5, "hypot");
  assert(inRange({ x: 0, y: 0 }, { x: 10, y: 0 }, 10), "i range");
  assert(!inRange({ x: 0, y: 0 }, { x: 11, y: 0 }, 10), "utanför");
});

console.log(`\n${passed} tester godkända`);
