import { createItem, lootFromKill, compareItems, RARITIES, SLOTS } from "../js/loot.mjs";
import { CLASSES, createHero, equippedBonus, applyLevelUp, heroPower } from "../js/classes.mjs";
import { damageAfterArmor, enemyStats, dist, inRange, nearestTarget, readMoveVector, isAttackHeld, shouldSwing, applyMove } from "../js/combat.mjs";
import {
  PALETTE,
  SLOT_SPRITES,
  frameFor,
  parseSprite,
  spriteKeys,
} from "../js/sprites.mjs";
import { POSES, poseFrame } from "../js/pose.mjs";
import { createState } from "../js/game-state.mjs";
import { statsOf } from "../js/stats.mjs";

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

test("alla sprites är 16x16 med giltig palett", () => {
  const keys = spriteKeys();
  assert(keys.length >= 16, "förväntade en hel atlas");
  for (const name of keys) {
    const s = parseSprite(name);
    assert(s.width === 16 && s.height === 16, `${name} ska vara 16x16`);
  }
  assert("k" in PALETTE && PALETTE["."] === null, "kontur + genomskinligt");
});

test("hjältar, monster och loot har frames", () => {
  ["knight", "mage", "archer", "slime", "bat", "shroom", "boss"].forEach((kind) => {
    const frame = frameFor(kind, 0);
    parseSprite(frame);
    ["idle", "walk", "attack"].forEach((pose) => {
      const pf = poseFrame(kind, 0, pose);
      parseSprite(pf);
      assert(POSES[kind][pose].includes(pf), `${kind} ${pose}`);
    });
  });
  SLOTS.forEach((slot) => parseSprite(SLOT_SPRITES[slot]));
  const slimeA = frameFor("slime", 0);
  const slimeB = frameFor("slime", 230);
  assert(slimeA !== slimeB, "slem ska blinka mellan frames");
  parseSprite("slash");
  parseSprite("spark0");
  assert(poseFrame("knight", 0, "walk") !== poseFrame("knight", 200, "walk"), "riddare går");
});

test("modulär state har anim-fält", () => {
  const s = createState();
  assert(s.attackFlash === 0 && s.facingLeft === false, "anim state");
  const h = createHero("knight");
  assert(statsOf(h).damage === h.damage, "statsOf");
});

test("attack medan man går", () => {
  const enemies = [{ x: 10, y: 0 }, { x: 80, y: 0 }];
  const near = nearestTarget({ x: 0, y: 0 }, enemies);
  assert(near.x === 10, "närmaste fiende");
  assert(shouldSwing({ held: true, targetInRange: false, attackTimer: 0 }), "håll slår");
  assert(shouldSwing({ held: false, targetInRange: true, attackTimer: 0 }), "auto i range");
  assert(!shouldSwing({ held: true, targetInRange: true, attackTimer: 0.2 }), "cooldown stoppar");
  assert(!shouldSwing({ held: false, targetInRange: false, attackTimer: 0 }), "ingen input");
  assert(isAttackHeld({ keys: { " ": true } }), "mellanslag hålls");
  assert(isAttackHeld({ pointerDown: true }), "mus hålls");
  assert(isAttackHeld({ touchAttack: true }), "touch hålls");
  const walk = readMoveVector({ w: true, d: true }, { x: 0, y: 0 });
  assert(walk.moving, "går");
  assert(Math.abs(Math.hypot(walk.mx, walk.my) - 1) < 1e-9, "diagonal normaliserad");
  const start = { x: 200, y: 200 };
  const next = applyMove(start, walk, 100, 0.1, { min: 40, maxX: 860, maxY: 600 });
  assert(next.x > start.x && next.y < start.y, "rörelse medan man kan slå");
  const still = applyMove(start, { mx: 0, my: 0 }, 100, 0.1, { min: 40, maxX: 860, maxY: 600 });
  assert(still.x === start.x && still.y === start.y, "står still utan input");
});

console.log(`\n${passed} tester godkända`);
