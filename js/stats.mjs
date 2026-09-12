import { equippedBonus } from "./classes.mjs";

export function statsOf(hero) {
  const b = equippedBonus(hero);
  return {
    damage: hero.damage + b.damage,
    maxHp: hero.maxHp + b.maxHp,
    maxMana: hero.maxMana + (b.maxMana || 0),
    speed: hero.speed + b.speed,
    luck: hero.luck + b.luck,
    range: hero.range + (hero.gear.weapon?.power || 0) * 0.4,
  };
}
