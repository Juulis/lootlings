import handler from "../api/scores.js";

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(k, v) {
      this.headers[k] = v;
    },
    end(s) {
      this.body = s || "";
    },
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const post = mockRes();
handler({ method: "POST", body: { name: "Maja", classId: "mage", score: 120, floor: 4 } }, post);
assert(post.statusCode === 201, "post 201");
const created = JSON.parse(post.body);
assert(created.entry.name === "Maja", "namn sparas");

const get = mockRes();
handler({ method: "GET" }, get);
assert(get.statusCode === 200, "get 200");
const list = JSON.parse(get.body);
assert(list.scores.some((s) => s.name === "Maja"), "finns i lista");

const bad = mockRes();
handler({ method: "PUT" }, bad);
assert(bad.statusCode === 405, "put blockeras");

console.log("ok api scores");
console.log("1 tester godkända");
