import { parseSprite } from "../js/sprites.mjs";
import { WEAPON_FRAMES, weaponFrame, weaponKeys } from "../js/weapons.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

for (const name of weaponKeys()) {
  const s = parseSprite(name);
  assert(s.width === 16 && s.height === 16, `${name} 16x16`);
}

["knight", "mage", "archer"].forEach((id) => {
  ["idle", "walk", "attack"].forEach((pose) => {
    const f = weaponFrame(id, pose, 0);
    parseSprite(f);
    assert(WEAPON_FRAMES[id][pose].includes(f), `${id} ${pose}`);
  });
});

assert(weaponFrame("knight", "attack", 0) !== weaponFrame("knight", "attack", 150), "svärd svingar");
assert(weaponFrame("archer", "attack", 0) === "bow1", "båge spänd");

console.log("ok vapen-sprites");
console.log("\n1 tester godkända");
