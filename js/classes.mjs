export const CLASSES = {
  knight: {
    id: "knight",
    name: "Riddare",
    blurb: "Stark och trygg. Slåss nära och skyddar sig.",
    color: "#5b8def",
    accent: "#ffe08a",
    stats: { hp: 140, mana: 45, speed: 145, range: 58, damage: 14, attackCd: 0.42, luck: 1 },
    skill: { name: "Sköldsmäll", cd: 6, desc: "Knuffar och skadar alla nära monster." },
  },
  mage: {
    id: "mage",
    name: "Magiker",
    blurb: "Kastar gnistrar långt bort. Lite skör, stor smäll.",
    color: "#c084fc",
    accent: "#9ae6ff",
    stats: { hp: 90, mana: 95, speed: 150, range: 195, damage: 18, attackCd: 0.55, luck: 3 },
    skill: { name: "Stjärnregn", cd: 7, desc: "En stjärna exploderar och träffar flera." },
  },
  archer: {
    id: "archer",
    name: "Skytt",
    blurb: "Snabb och precis. Skjuter från avstånd.",
    color: "#3dd68c",
    accent: "#fff1a8",
    stats: { hp: 105, mana: 60, speed: 175, range: 170, damage: 12, attackCd: 0.32, luck: 2 },
    skill: { name: "Pilstorm", cd: 6.5, desc: "Tre pilar mot närmaste monster." },
  },
};

export function createHero(classId) {
  const cls = CLASSES[classId] || CLASSES.knight;
  const s = cls.stats;
  return {
    classId: cls.id,
    name: cls.name,
    level: 1,
    xp: 0,
    xpToLevel: 40,
    hp: s.hp,
    maxHp: s.hp,
    mana: s.mana,
    maxMana: s.mana,
    speed: s.speed,
    range: s.range,
    damage: s.damage,
    attackCd: s.attackCd,
    luck: s.luck,
    gold: 0,
    floor: 1,
    kills: 0,
    gear: { weapon: null, armor: null, boots: null, charm: null },
    bag: [],
  };
}

export function equippedBonus(hero) {
  const g = hero.gear;
  const weapon = g.weapon?.power || 0;
  const armor = g.armor?.power || 0;
  const boots = g.boots?.power || 0;
  const charm = g.charm?.power || 0;
  return {
    damage: weapon,
    maxHp: armor * 2,
    maxMana: Math.floor(charm * 1.4),
    speed: boots * 1.6,
    luck: Math.floor(charm / 4),
  };
}

export function heroPower(hero) {
  const b = equippedBonus(hero);
  return hero.damage + b.damage + Math.floor((hero.maxHp + b.maxHp) / 12) + hero.level * 2;
}

export function xpForKill(level, isBoss) {
  return isBoss ? 28 + level * 8 : 8 + level * 2;
}

export function applyLevelUp(hero) {
  hero.level += 1;
  hero.xpToLevel = Math.round(36 + hero.level * 18);
  const hpGain = hero.classId === "knight" ? 18 : hero.classId === "mage" ? 10 : 13;
  const mpGain = hero.classId === "mage" ? 12 : hero.classId === "archer" ? 8 : 6;
  hero.maxHp += hpGain;
  hero.maxMana += mpGain;
  hero.hp = hero.maxHp;
  hero.mana = hero.maxMana;
  hero.damage += hero.classId === "mage" ? 3 : 2;
  if (hero.level % 3 === 0) hero.luck += 1;
  return hero;
}
