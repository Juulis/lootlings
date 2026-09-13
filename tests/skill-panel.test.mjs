import { createHero } from "../js/classes.mjs";
import { createState } from "../js/game-state.mjs";
import { toggleSkills } from "../js/skill-panel.mjs";
import { unlockSkill } from "../js/skills.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const state = createState();
assert(toggleSkills(state) === false, "ingen hjälte");
state.hero = createHero("knight");
state.mode = "play";
assert(toggleSkills(state) === true && state.skillsOpen, "öppna panel");
assert(toggleSkills(state) === false && !state.skillsOpen, "stäng panel");
unlockSkill(state.hero, "smash");
assert(state.hero.skills.smash.unlocked, "lås upp via panel-flöde");

console.log("ok skill-panel");
console.log("\n1 tester godkända");
