import { SFX_KEYS, playSfx, setMuted, isMuted, toggleMute } from "../js/audio.mjs";
import { SFX_DATA } from "../js/sfx-data.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const need = ["slash", "swing", "hit", "loot", "click", "portal", "bag", "die", "magic", "level", "kill"];
need.forEach((k) => {
  assert(SFX_KEYS.includes(k), `saknar ${k}`);
  assert(typeof SFX_DATA[k] === "string" && SFX_DATA[k].startsWith("data:audio/ogg"), `${k} data-uri`);
});

assert(!isMuted(), "startar med ljud på");
assert(toggleMute() === true && isMuted(), "mute");
assert(playSfx("slash") === false, "mute spelar inte");
setMuted(false);
assert(playSfx("finns-inte") === false, "okänt namn");

console.log("ok ljudpack");
console.log("\n1 tester godkända");
