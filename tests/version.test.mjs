import { SEMVER, STAMP, versionLabel } from "../js/version.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(/^\d+\.\d+\.\d+$/.test(SEMVER), "semver major.feature.patch");
assert(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(STAMP), "stampel datum + hh:mm");
assert(versionLabel() === `${STAMP} · ${SEMVER}`, "label = stampel · semver");
assert(SEMVER === "1.1.0", "denna släpp är feature 1.1.0");

console.log("ok version", versionLabel());
console.log("\n1 tester godkända");
