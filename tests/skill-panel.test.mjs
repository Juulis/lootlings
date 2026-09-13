import { createHero } from "../js/classes.mjs";
import { createState } from "../js/game-state.mjs";
import { toggleSkills, openSkills, closeSkills, pickSkill } from "../js/skill-panel.mjs";
import { unlockSkill } from "../js/skills.mjs";
import { gainXp } from "../js/run.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok", name);
}

test("toggle panel", () => {
  const state = createState();
  assert(toggleSkills(state) === false, "ingen hjälte");
  state.hero = createHero("knight");
  state.mode = "play";
  assert(toggleSkills(state) === true && state.skillsOpen, "öppna panel");
  assert(toggleSkills(state) === false && !state.skillsOpen, "stäng panel");
  unlockSkill(state.hero, "smash");
  assert(state.hero.skills.smash.unlocked, "lås upp via panel-flöde");
});

test("level-up öppnar kraftpanel", () => {
  const state = createState();
  state.hero = createHero("knight");
  state.mode = "play";
  pickSkill(state, "smash");
  assert(state.hero.skills.smash.unlocked, "startpoäng spenderad");
  assert(!state.skillsOpen, "stängs när poängen är slut");
  state.hero.xp = state.hero.xpToLevel;
  gainXp(state, 0);
  assert(state.hero.level === 2, "level 2");
  assert(state.hero.skillPoints >= 1, "ny poäng");
  assert(state.skillsOpen, "panelen öppnas efter level");
  assert(pickSkill(state, "star"), "låser upp med 1/2/3");
  assert(state.hero.skills.star.unlocked, "stjärna upplåst");
});

test("openSkills kräver play", () => {
  const state = createState();
  state.hero = createHero("mage");
  assert(!openSkills(state), "inte i play");
  state.mode = "play";
  assert(openSkills(state) && state.skillsOpen, "öppna");
  assert(!closeSkills(state) && !state.skillsOpen, "stäng");
});

console.log(`\n${passed} tester godkända`);
