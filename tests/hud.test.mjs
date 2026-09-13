import { toast, renderMenu } from "../js/hud.mjs";
import { CLASSES } from "../js/classes.mjs";
import { startRun } from "../js/run.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(typeof toast === "function", "toast exporteras");
assert(typeof renderMenu === "function", "renderMenu exporteras");
assert(typeof startRun === "function", "startRun kan importeras (toast-export)");
assert(Object.keys(CLASSES).length === 3, "tre klasser att visa");

toast("hej");
renderMenu(() => {});

console.log("ok hud-meny");
console.log("\n1 tester godkända");
