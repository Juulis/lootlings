import { readFileSync } from "node:fs";
import { SEMVER, STAMP, versionLabel } from "../js/version.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(/^\d+\.\d+\.\d+$/.test(SEMVER), "semver major.feature.patch");
assert(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(STAMP), "stampel datum + hh:mm");
assert(versionLabel() === `${STAMP} · ${SEMVER}`, "label = stampel · semver");

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert(html.includes(versionLabel()), "version syns i HTML om JS dör");
assert(html.includes(`js/main.js?v=${SEMVER}`), "script cache-bustas");
assert(html.includes('id="class-picks"'), "hjälteval finns");

console.log("ok version", versionLabel());
console.log("\n1 tester godkända");
