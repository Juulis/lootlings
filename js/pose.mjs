/** Pose-tabell. Extra frames ligger i anim-frames.mjs och slås ihop här. */
import { SPRITES, ACTOR_FRAMES as BASE } from "./sprites.mjs";
import { EXTRA_SPRITES } from "./anim-frames.mjs";

Object.assign(SPRITES, EXTRA_SPRITES);

export const POSES = {
  knight: { idle: ["knight"], walk: ["knight", "knight_w"], attack: ["knight_a"] },
  mage: { idle: ["mage"], walk: ["mage", "mage_w"], attack: ["mage_a"] },
  archer: { idle: ["archer"], walk: ["archer", "archer_w"], attack: ["archer_a"] },
  slime: { idle: ["slime0", "slime1"], walk: ["slime0", "slime1"], attack: ["slime1"] },
  bat: { idle: ["bat0", "bat1"], walk: ["bat0", "bat1"], attack: ["bat1"] },
  shroom: { idle: ["shroom", "shroom1"], walk: ["shroom", "shroom1"], attack: ["shroom1"] },
  boss: { idle: ["boss", "boss1"], walk: ["boss", "boss1"], attack: ["boss1"] },
};

for (const [k, v] of Object.entries(POSES)) {
  BASE[k] = v;
}

export function framesFor(kind, pose = "idle") {
  const set = POSES[kind] || POSES.slime;
  return set[pose] || set.idle;
}

export function poseFrame(kind, timeMs = 0, pose = "idle") {
  const frames = framesFor(kind, pose);
  return frames[Math.floor(timeMs / 180) % frames.length];
}
