const memory = globalThis.__lootlingsScores || (globalThis.__lootlingsScores = []);

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(body));
}

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (req.method === "GET") {
    const top = [...memory].sort((a, b) => b.score - a.score).slice(0, 10);
    json(res, 200, { scores: top });
    return;
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        json(res, 400, { error: "ogiltig json" });
        return;
      }
    }
    body = body || {};
    const name = String(body.name || "Hjälte").slice(0, 16);
    const classId = ["knight", "mage", "archer"].includes(body.classId) ? body.classId : "knight";
    const score = Math.max(0, Math.min(1_000_000, Number(body.score) || 0));
    const floor = Math.max(1, Math.min(99, Number(body.floor) || 1));
    const entry = { name, classId, score, floor, at: Date.now() };
    memory.push(entry);
    if (memory.length > 100) memory.splice(0, memory.length - 100);
    json(res, 201, { ok: true, entry });
    return;
  }

  json(res, 405, { error: "metod ej tillåten" });
}
