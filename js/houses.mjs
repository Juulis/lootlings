import { DECOR_SCALE } from "./decor-sprites.mjs";

export const HOUSE_KINDS = ["cottage", "hut", "barn", "tower", "cottage_round"];

export function isHouse(kind) {
  return HOUSE_KINDS.includes(kind);
}

export function pickHouse(rng) {
  const kind = HOUSE_KINDS[Math.floor(rng() * HOUSE_KINDS.length)];
  const extra = rng() < 0.35 ? 1 : rng() < 0.12 ? 2 : 0;
  return { kind, scale: (DECOR_SCALE[kind] || 5) + extra };
}

export function diversifyHouses(props, rng) {
  return props.map((p) => {
    if (p.kind !== "cottage") return p;
    const house = pickHouse(rng);
    return { ...p, ...house, solid: true };
  });
}
