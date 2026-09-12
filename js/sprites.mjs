/** Pixel-sprites: Diablo-grotta, men runda, stora ögon och lite trams. */

export const PALETTE = {
  ".": null,
  "k": "#1a1020",
  "w": "#fff8e7",
  "e": "#1a1020",
  "s": "#f6c7a1",
  "b": "#4f7fe8",
  "n": "#2d4fb0",
  "g": "#ffe08a",
  "y": "#ffd76a",
  "p": "#b46af0",
  "q": "#7b3fc0",
  "c": "#9ae6ff",
  "a": "#3dd68c",
  "d": "#1f8a58",
  "r": "#ff6b8a",
  "o": "#ff8a3d",
  "m": "#f48fb1",
  "l": "#7dce7a",
  "t": "#8ab4ff",
  "u": "#6b4a2b",
  "h": "#c084fc",
  "x": "#3a2c68",
  "z": "#2f5a46",
  "f": "#1d3b32",
  "v": "#3d8bfd",
  "i": "#9aa7b5",
};

export const SPRITES = {
  knight: [
    "......kkkk......",
    ".....kggggk.....",
    "....kgwwwwgk....",
    "....kwweewwk....",
    "....kwwkkeewk...",
    ".....ksssssk....",
    "......kssk......",
    "....knnbbnnk....",
    "...knbbbbbbnk...",
    "...kbbggyybbk...",
    "...knbbbbbbnk...",
    "....knb..bnk....",
    "....kk....kk....",
    "....nnk..knn....",
    "....kkk..kkk....",
    "................",
  ],
  mage: [
    ".......kk.......",
    "......kyyk......",
    ".....kyppyk.....",
    "....kyppppyk....",
    "...kqppppppqk...",
    "...kqqpwwpqqk...",
    "....kqwweewqk...",
    "....kwwkkeewk...",
    ".....ksssssk....",
    "......khhk......",
    "....khhhhhhhk...",
    "...khhccchhhk...",
    "...khhhhhhhhk...",
    "....khk..khk....",
    "....kkk..kkk....",
    "................",
  ],
  archer: [
    "......kkkk......",
    ".....kddddk.....",
    "....kdaaaadk....",
    "....kawweewak...",
    "....kwwkkeewk...",
    ".....ksssssk....",
    "......kssk.k....",
    "....kdaaaaduk...",
    "...kdaaaaaaduk..",
    "...kdaaggaaduk..",
    "...kdaaaaaadk...",
    "....kda..adk.u..",
    "....kk....kk.u..",
    "....ddk..kdd.u..",
    "....kkk..kkk....",
    "................",
  ],
  slime0: [
    "................",
    "................",
    "......kkkk......",
    "....kllllllk....",
    "...kllwwwwllk...",
    "..kllweewweelk..",
    "..kllkkeekkellk.",
    ".kllllllllllllk.",
    ".kllrllrllllllk.",
    ".kllllllllllllk.",
    "..kllllllllllk..",
    "...kkllllllkk...",
    ".....kkkkkk.....",
    "................",
    "................",
    "................",
  ],
  slime1: [
    "................",
    "................",
    "................",
    ".....kkkkkk.....",
    "...kllllllllk...",
    "..kllwwwwwwllk..",
    ".kllweewweellk..",
    ".kllkkeekkelllk.",
    "kllllllllllllllk",
    "kllrllrllllllllk",
    ".kllllllllllllk.",
    "..kkllllllllkk..",
    "....kkkkkkkk....",
    "................",
    "................",
    "................",
  ],
  bat0: [
    "................",
    "kk..........kk..",
    ".kxxk....kxxk...",
    "..kxxtkkttxk....",
    "...kttttttrk....",
    "....ktwwttk.....",
    "....ktweewtk....",
    ".....kkeekk.....",
    "....kttttttk....",
    "...kttrrrtttk...",
    "..kttk....kttk..",
    ".kkkk......kkkk.",
    "................",
    "................",
    "................",
    "................",
  ],
  bat1: [
    "................",
    "................",
    "kk..........kk..",
    "kxxkk....kkxxk..",
    ".kxxxtkkttxxxk..",
    "..kttttttttrk...",
    "...ktwwwwttk....",
    "...ktweewwtk....",
    "....kkeekkk.....",
    "...ktttttttk....",
    "..kttrrrttttk...",
    ".kkkk......kkkk.",
    "................",
    "................",
    "................",
    "................",
  ],
  shroom: [
    "................",
    "....kkkkkkkk....",
    "...kmmmmmmmmk...",
    "..kmmwmmmwmmmk..",
    "..kmmmmmmmmmmk..",
    "..kmmwmmmwmmmk..",
    "...kmmmmmmmmk...",
    "....kkkkkkkk....",
    ".....kssssk.....",
    "....kswwsssk....",
    "....ksweeskk....",
    "....ksskkssk....",
    ".....kssssk.....",
    "....kk....kk....",
    "...kmmk..kmmk...",
    "................",
  ],
  boss: [
    "......gyyg......",
    ".....kggggk.....",
    "....koooooook...",
    "...koowoowoook..",
    "..kooeeooeeoook.",
    "..kookkooccoook.",
    "..koooooorooook.",
    "...koooooooook..",
    "....kuxxxxuk....",
    "...kuxxxxxuxk...",
    "..kuxxggxxuxxk..",
    "..kuxxxxxxxuxk..",
    "...kuxx..xxuk...",
    "....kk....kk....",
    "...koo....ook...",
    "..kkkk....kkkk..",
  ],
  portal: [
    "......cccc......",
    "....ccvvvccc....",
    "...cvhhhhhvvc...",
    "..cvhwwwwwhvc...",
    ".cvhwwvvvwwhvc..",
    ".cvhwvhhhvwhvc..",
    "cvhwhhccchhwhvc.",
    "cvhwhccckcchhvc.",
    "cvhwhhccchhwhvc.",
    ".cvhwvhhhvwhvc..",
    ".cvhwwvvvwwhvc..",
    "..cvhwwwwwhvc...",
    "...cvhhhhhvvc...",
    "....ccvvvccc....",
    "......cccc......",
    "................",
  ],
  weapon: [
    ".......gg.......",
    "......gyyg......",
    "......gyyg......",
    "......kggk......",
    "......kwwk......",
    "......kwwk......",
    ".....kuuuk......",
    "....kuuuuuk.....",
    ".....kuuuk......",
    "......kuuk......",
    "......kuuk......",
    "......kuuk......",
    ".....kuuuuk.....",
    "................",
    "................",
    "................",
  ],
  armor: [
    "................",
    "....kk....kk....",
    "...kbbk..kbbk...",
    "...kbbbbbbbbk...",
    "...kbbggggbbk...",
    "...kbbbbbbbbk...",
    "...kbbkkkkbbk...",
    "...kbbbbbbbbk...",
    "....kbbbbbbk....",
    "....kbbkkbbk....",
    "....kbb..bbk....",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  boots: [
    "................",
    "................",
    "...kuuk..kuuk...",
    "...kuuk..kuuk...",
    "...kuuk..kuuk...",
    "...kuuk..kuuk...",
    "..kuuuukkuuuuk..",
    "..kuyyykkyyyuk..",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  charm: [
    "................",
    "......kkk.......",
    "......kyk.......",
    ".....kyyyk......",
    "....kygggyk.....",
    "...kygwwwgyk....",
    "...kygwkwgyk....",
    "...kygwwwgyk....",
    "....kygggyk.....",
    ".....kyyyk......",
    "......kyk.......",
    "......kkk.......",
    "................",
    "................",
    "................",
    "................",
  ],
  gold: [
    "................",
    ".....kyyyyk.....",
    "....kyggggyk....",
    "...kygwwwwgyk...",
    "...kygwggwgyk...",
    "...kygwwwwgyk...",
    "....kyggggyk....",
    ".....kyyyyk.....",
    "......kkk.......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  floorA: [
    "zzzzzzzzzzzzzzzz",
    "zffzffzfffzffzfz",
    "zzzzzzzzzzzzzzzz",
    "zfzzzffzzzzffzzz",
    "zzzzzzzzzzzzzzzz",
    "zzffzzzzfzffzzzz",
    "zzzzzzzzzzzzzzzz",
    "zfffzzzfffzzzffz",
    "zzzzzzzzzzzzzzzz",
    "zzzfzzzzffzzzzfz",
    "zzzzzzzzzzzzzzzz",
    "zffzzzfffzzzffzz",
    "zzzzzzzzzzzzzzzz",
    "zzzffzzzzzffzzzz",
    "zfzfzfzfzfzfzfzz",
    "zzzzzzzzzzzzzzzz",
  ],
  floorB: [
    "ffffffffffffffff",
    "fzfffzffffzfffzf",
    "ffffffffffffffff",
    "ffzzzffffzzzffff",
    "ffffffffffffffff",
    "fzffffffffffzfff",
    "ffffffffffffffff",
    "fffzffffzfffffff",
    "ffffffffffffffff",
    "fzfffzzzfffzffff",
    "ffffffffffffffff",
    "ffffzffffffzffff",
    "ffffffffffffffff",
    "fzffffffffffzfzf",
    "ffffffffffffffff",
    "zfzfzfzfzfzfzfzf",
  ],
  column: [
    "....kiiiiik.....",
    "...kiwwwwwik....",
    "...kiiiiiiik....",
    "....kxxxxk......",
    "....kxxxxk......",
    "....kxggxk......",
    "....kxxxxk......",
    "....kxxxxk......",
    "....kxccxk......",
    "....kxxxxk......",
    "....kxxxxk......",
    "...kkxxxxkk.....",
    "..kiiiiiiiik....",
    ".kiiiiiiiiiik...",
    "kkkkkkkkkkkkkk..",
    "................",
  ],
  chest: [
    "................",
    "....kuuuuuuk....",
    "...kuuyyyyyuk...",
    "...kuyggggyuk...",
    "...kuygyyygyk...",
    "...kuuyyyyyuk...",
    "...kuuuuuuuuk...",
    "...kuukkkkuuk...",
    "...kuuuuuuuuk...",
    "....kkkkkkkk....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
};

export const ACTOR_FRAMES = {
  knight: ["knight"],
  mage: ["mage"],
  archer: ["archer"],
  slime: ["slime0", "slime1"],
  bat: ["bat0", "bat1"],
  shroom: ["shroom"],
  boss: ["boss"],
};

export const SLOT_SPRITES = {
  weapon: "weapon",
  armor: "armor",
  boots: "boots",
  charm: "charm",
};

export function spriteKeys() {
  return Object.keys(SPRITES);
}

export function parseSprite(name) {
  const rows = SPRITES[name];
  if (!rows) throw new Error(`okänd sprite: ${name}`);
  const height = rows.length;
  const width = rows[0].length;
  for (const row of rows) {
    if (row.length !== width) throw new Error(`ojämn rad i ${name}`);
    for (const ch of row) {
      if (!(ch in PALETTE)) throw new Error(`okänd färg '${ch}' i ${name}`);
    }
  }
  return { name, width, height, rows };
}

export function frameFor(kind, timeMs = 0) {
  const frames = ACTOR_FRAMES[kind] || ACTOR_FRAMES.slime;
  const i = Math.floor(timeMs / 220) % frames.length;
  return frames[i];
}

export function paintPixels(ctx, rows, dx, dy, scale) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(dx + x * scale, dy + y * scale, scale, scale);
    }
  }
}

export function drawSprite(ctx, name, cx, cy, opts = {}) {
  const { scale = 3, bob = 0, flip = false, shadow = true } = opts;
  const { width, height, rows } = parseSprite(name);
  const w = width * scale;
  const h = height * scale;
  const x = Math.round(cx - w / 2);
  const y = Math.round(cy - h / 2 + bob);
  if (shadow) {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + h * 0.38, w * 0.32, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  if (flip) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }
  paintPixels(ctx, rows, x, y, scale);
  ctx.restore();
}

export function drawHpBar(ctx, x, y, ratio, width = 36) {
  const r = Math.max(0, Math.min(1, ratio));
  ctx.fillStyle = "#0008";
  ctx.fillRect(x - width / 2, y, width, 5);
  ctx.fillStyle = r > 0.35 ? "#7cf0c2" : "#ff6b8a";
  ctx.fillRect(x - width / 2, y, width * r, 5);
}

export function drawDungeon(ctx, map, timeMs) {
  const tile = 48;
  for (let y = 0; y < map.h; y += tile) {
    for (let x = 0; x < map.w; x += tile) {
      const name = (x + y) % (tile * 2) === 0 ? "floorA" : "floorB";
      paintPixels(ctx, SPRITES[name], x, y, 3);
    }
  }
  ctx.strokeStyle = "#7cffb2";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, map.w - 8, map.h - 8);
  const cols = [
    [90, 70],
    [map.w - 110, 70],
    [90, map.h - 120],
    [map.w - 110, map.h - 120],
    [map.w / 2 - 8, 48],
  ];
  for (const [x, y] of cols) {
    paintPixels(ctx, SPRITES.column, x, y, 3);
  }
  const flicker = 0.55 + Math.sin(timeMs / 180) * 0.2;
  ctx.fillStyle = `rgba(255, 215, 106, ${flicker * 0.12})`;
  ctx.beginPath();
  ctx.arc(110, 90, 46, 0, Math.PI * 2);
  ctx.arc(map.w - 90, 90, 46, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPortal(ctx, x, y, timeMs) {
  const pulse = Math.sin(timeMs / 180) * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(timeMs / 900);
  drawSprite(ctx, "portal", 0, pulse, { scale: 3, bob: 0, shadow: false });
  ctx.restore();
}

export function drawLootIcon(ctx, slot, x, y, color) {
  ctx.save();
  ctx.shadowColor = color || "#ffd76a";
  ctx.shadowBlur = 10;
  drawSprite(ctx, SLOT_SPRITES[slot] || "charm", x, y, { scale: 2, shadow: false });
  ctx.restore();
}

export function bakeSprite(name, scale = 3) {
  if (typeof document === "undefined") return "";
  const { width, height, rows } = parseSprite(name);
  const c = document.createElement("canvas");
  c.width = width * scale;
  c.height = height * scale;
  const cctx = c.getContext("2d");
  paintPixels(cctx, rows, 0, 0, scale);
  return c.toDataURL();
}
