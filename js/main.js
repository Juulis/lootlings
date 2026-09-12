import { CLASSES, createHero, equippedBonus, applyLevelUp } from "./classes.mjs";
import { lootFromKill, compareItems } from "./loot.mjs";
import { dist, moveTowards, enemyStats, inRange } from "./combat.mjs";
import {
  bakeSprite,
  drawDungeon,
  drawHpBar,
  drawLootIcon,
  drawPortal,
  drawSprite,
  frameFor,
  SLOT_SPRITES,
} from "./sprites.mjs";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const lootOverlay = document.getElementById("loot-overlay");
const deadOverlay = document.getElementById("dead-overlay");
const touchLayer = document.getElementById("touch");

const state = {
  mode: "menu",
  hero: null,
  pos: { x: 400, y: 300 },
  enemies: [],
  projectiles: [],
  pickups: [],
  particles: [],
  map: { w: 900, h: 640 },
  keys: {},
  pointer: { x: 0, y: 0, down: false },
  stick: { x: 0, y: 0, active: false },
  attackTimer: 0,
  skillTimer: 0,
  invuln: 0,
  pendingLoot: [],
  last: 0,
  portal: null,
  attackFlash: 0,
  facingLeft: false,
};
