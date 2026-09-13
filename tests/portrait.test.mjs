import { readFileSync } from "node:fs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const main = readFileSync(new URL("../js/main.js", import.meta.url), "utf8");

assert(!html.includes('id="tilt"'), "ingen tilt-skärm");
assert(!html.includes("screen-orientation"), "ingen landscape-meta");
assert(!css.includes("#app { display: none; }"), "appen göms inte i portrait");
assert(css.includes("orientation: portrait"), "portrait-layout finns");
assert(!main.includes("lockLandscape"), "ingen orientation.lock");
assert(css.includes("z-index: 30"), "meny ligger över orbs");
assert(css.includes("#stage-wrap:has(> .overlay:not(.hidden)) #d2hud"), "orbs göms när meny är öppen");
assert(/<\/div>\s*<button type="button" id="inv-btn"/.test(html), "väska sitter i header-raden");

console.log("ok stående läge");
console.log("\n1 tester godkända");
