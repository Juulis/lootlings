import {
  SKILLS, SKILL_IDS, canUnlock, unlockSkill,
  gainSkillXp, skillXpToLevel, skillStats, applyLevelUpRewards, setActiveSkill,
} from "../js/skills.mjs";
import { createHero, applyLevelUp } from "../js/classes.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok", name);
}

test("tre skills", () => {
  assert(SKILL_IDS.length === 3, "3 skills");
  assert(SKILLS.smash && SKILLS.star && SKILLS.volley, "id");
});

test("låst tills skillpoint", () => {
  const h = createHero("knight");
  assert(h.skillPoints === 1, "startpoäng");
  assert(!h.skills.smash.unlocked, "låst");
  assert(canUnlock(h, "smash"), "kan låsa upp");
  unlockSkill(h, "smash");
  assert(h.skills.smash.unlocked && h.skills.smash.level === 1, "upplåst");
  assert(h.activeSkill === "smash", "aktiv");
  assert(h.skillPoints === 0, "poäng spenderad");
  assert(!canUnlock(h, "star"), "inga poäng kvar");
  assert(!unlockSkill(h, "star").skills.star.unlocked, "fortfarande låst");
});

test("användning levlar skill", () => {
  const h = createHero("mage");
  unlockSkill(h, "star");
  let leveled = false;
  while (!leveled) {
    const res = gainSkillXp(h, "star", 10);
    leveled = res.leveled;
  }
  assert(h.skills.star.level === 2, "skillnivå");
  assert(skillStats(SKILLS.star, h.skills.star).dmgMult > 1, "starkare");
  assert(skillStats(SKILLS.star, h.skills.star).cd < SKILLS.star.baseCd, "snabbare");
});

test("låst skill får ingen xp", () => {
  const h = createHero("archer");
  const res = gainSkillXp(h, "volley", 99);
  assert(!res.leveled && h.skills.volley.level === 0, "ingen xp när låst");
});

test("level-up ger skillpoint", () => {
  const h = createHero("knight");
  unlockSkill(h, "smash");
  assert(h.skillPoints === 0, "tom");
  applyLevelUp(h);
  assert(h.skillPoints === 1, "ny poäng");
  applyLevelUpRewards(h);
  assert(h.skillPoints === 2, "extra poäng");
  setActiveSkill(h, "smash");
  assert(h.activeSkill === "smash", "aktiv kvar");
});

console.log(`\n${passed} tester godkända`);
