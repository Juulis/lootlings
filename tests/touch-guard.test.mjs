import { readFileSync } from "node:fs";
import { guardBrowserChrome } from "../js/touch-guard.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(guardBrowserChrome({}) === true, "guard returnerar true");

const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
assert(css.includes("-webkit-user-select: none"), "webkit user-select");
assert(css.includes("touch-action: manipulation"), "manipulation på knappar");
assert(css.includes("-webkit-touch-callout: none"), "ingen callout");
assert(css.includes("-webkit-tap-highlight-color"), "ingen tap-highlight");

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert(html.includes("user-scalable=no"), "viewport låser zoom");

console.log("ok ingen zoom/markering");
console.log("\n1 tester godkända");
