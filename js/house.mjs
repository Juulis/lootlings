import { enemyStats, dist } from "./combat.mjs";
import { log, toast } from "./hud.mjs";
import { HOUSE_KINDS } from "./houses.mjs";

const TILE = 64;

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}
