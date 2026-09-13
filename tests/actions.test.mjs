import { createHero } from "../js/classes.mjs";
import { createState } from "../js/game-state.mjs";
import { useSkill } from "../js/actions.mjs";
import { unlockSkill } from "../js/skills.mjs";
import { skillHotkey } from "../js/input.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok", name);
}

test("B-tangenten är den blåa kraften", () => {
  assert(skillHotkey("b") === "active", "b");
  assert(skillHotkey("B") === "active", "B");
  assert(skillHotkey("e") === "active", "e");
  assert(skillHotkey("2") === "star", "2 = stjärna");
  assert(skillHotkey("w") === null, "gå-tangent är inte kraft");
});

test("stjärna går att kasta medan man går", () => {
  const state = createState();
  state.hero = createHero("mage");
  state.mode = "play";
  state.keys = { w: true, d: true };
  state.stick = { x: 0.6, y: -0.2, active: true };
  unlockSkill(state.hero, "star");
  state.hero.mana = 99;
  const ok = useSkill(state, "star");
  assert(ok, "kastade under rörelse");
  assert(state.projectiles.some((p) => p.star), "stjärna spawnade");
  assert(state.hero.mana < 99, "mana drogs");
});

test("aktiv kraft (B) funkar under rörelse", () => {
  const state = createState();
  state.hero = createHero("knight");
  state.mode = "play";
  state.keys = { w: true };
  unlockSkill(state.hero, "smash");
  state.hero.mana = 40;
  assert(useSkill(state), "B/E kastar aktiv medan man går");
  assert(!useSkill(state), "cd blockerar dubbelkast");
});

console.log(`\n${passed} tester godkända`);
