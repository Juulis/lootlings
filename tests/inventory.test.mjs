import { createHero } from "../js/classes.mjs";
import { createItem } from "../js/loot.mjs";
import { statsOf } from "../js/stats.mjs";
import { createState } from "../js/game-state.mjs";
import { toggleInv, equipFromBag, spendMana, regenMana, manaCost } from "../js/inventory.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const rng = () => 0.2;
const hero = createHero("mage");
assert(hero.mana === hero.maxMana && hero.maxMana > 40, "magiker har mana");
assert(statsOf(hero).maxMana >= hero.maxMana, "statsOf mana");

assert(spendMana(hero, manaCost("mage")) === true, "betalar mana");
assert(hero.mana < hero.maxMana, "mana sjönk");
assert(spendMana(hero, 999) === false, "för lite mana");
regenMana(hero, 2, statsOf(hero).maxMana);
assert(hero.mana > 0, "mana fylls på");

const sword = createItem({ slot: "weapon", classId: "mage", level: 3, rng, luck: 20 });
const worse = createItem({ slot: "weapon", classId: "mage", level: 1, rng: () => 0.9, luck: 0 });
hero.gear.weapon = worse;
hero.bag.push(sword);
const worn = equipFromBag(hero, 0);
assert(worn === sword, "tog på från väska");
assert(hero.gear.weapon === sword, "nytt vapen på");
assert(hero.bag[0] === worse, "gamla i väskan");

const state = createState();
assert(toggleInv(state) === false, "ingen hjälte");
state.hero = hero;
state.mode = "play";
assert(toggleInv(state) === true && state.invOpen, "öppna I");
assert(toggleInv(state) === false && !state.invOpen, "stäng I");

console.log("ok inventory");
console.log("\n1 tester godkända");
