export const SKILLS = {
  smash: {
    id: "smash",
    name: "Smäll",
    desc: "Knuffar och slår monster nära dig.",
    color: "#ffe08a",
    baseCd: 6,
    type: "melee",
  },
  star: {
    id: "star",
    name: "Stjärna",
    desc: "En stjärna exploderar på närmaste monster.",
    color: "#c084fc",
    baseCd: 7,
    type: "aoe",
  },
  volley: {
    id: "volley",
    name: "Salva",
    desc: "Tre skott mot närmaste monster.",
    color: "#fff1a8",
    baseCd: 6.5,
    type: "volley",
  },
};

export const SKILL_IDS = Object.keys(SKILLS);

export function emptySkill() {
  return { unlocked: false, level: 0, xp: 0 };
}

export function createSkillBook() {
  const skills = {};
  for (const id of SKILL_IDS) skills[id] = emptySkill();
  return skills;
}

export function skillXpToLevel(level) {
  return 20 + Math.max(1, level) * 12;
}

export function skillPower(progress) {
  const level = progress?.unlocked ? Math.max(1, progress.level) : 0;
  return {
    level,
    dmgMult: level ? 1 + (level - 1) * 0.15 : 0,
    cd: level ? SKILLS[progress.id]?.baseCd || 6 : 99,
  };
}

export function skillStats(def, progress) {
  const level = progress?.unlocked ? Math.max(1, progress.level) : 0;
  const cd = level ? +(def.baseCd * (0.92 ** (level - 1))).toFixed(2) : def.baseCd;
  return {
    level,
    dmgMult: level ? 1 + (level - 1) * 0.15 : 0,
    cd,
    radius: 100 + level * 8,
  };
}

export function canUnlock(hero, skillId) {
  const slot = hero.skills?.[skillId];
  return !!(slot && !slot.unlocked && (hero.skillPoints || 0) > 0 && SKILLS[skillId]);
}

export function unlockSkill(hero, skillId) {
  if (!canUnlock(hero, skillId)) return hero;
  hero.skillPoints -= 1;
  hero.skills[skillId].unlocked = true;
  hero.skills[skillId].level = 1;
  hero.skills[skillId].xp = 0;
  hero.activeSkill = skillId;
  return hero;
}

export function setActiveSkill(hero, skillId) {
  if (hero.skills?.[skillId]?.unlocked) hero.activeSkill = skillId;
  return hero;
}

export function gainSkillXp(hero, skillId, amount = 10) {
  const slot = hero.skills?.[skillId];
  if (!slot?.unlocked) return { leveled: false, hero };
  slot.xp += amount;
  let leveled = false;
  while (slot.xp >= skillXpToLevel(slot.level)) {
    slot.xp -= skillXpToLevel(slot.level);
    slot.level += 1;
    leveled = true;
  }
  return { leveled, hero, level: slot.level };
}

export function applyLevelUpRewards(hero) {
  hero.skillPoints = (hero.skillPoints || 0) + 1;
  return hero;
}

export function unlockedSkills(hero) {
  return SKILL_IDS.filter((id) => hero.skills?.[id]?.unlocked);
}
