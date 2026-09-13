export const HOLD_MS = 420;

export const SLOT_SV = {
  weapon: { label: "Vapen", does: (p) => `+${p} skada och lite extra räckvidd` },
  armor: { label: "Rustning", does: (p) => `+${p * 2} liv` },
  boots: { label: "Skor", does: (p) => `+${Math.round(p * 1.6)} fart` },
  charm: { label: "Charm", does: (p) => `+${Math.floor(p * 1.4)} mana och +${Math.floor(p / 4)} tur` },
};

export function inspectItem(item) {
  if (!item) {
    return {
      title: "Tom plats",
      color: "#c9a227",
      lines: ["Inget på den här platsen än.", "Plocka skatter i grottan."],
    };
  }
  const slot = SLOT_SV[item.slot] || { label: item.slot, does: (p) => `+${p}` };
  return {
    title: item.name,
    color: item.color || "#ffe566",
    lines: [
      `${item.rarityName || "Vanlig"} ${slot.label.toLowerCase()}`,
      slot.does(item.power || 0),
      `Kraft ${item.power} · hittad på våning ${item.level || 1}`,
    ],
  };
}

export function inspectText(item) {
  const i = inspectItem(item);
  return [i.title, ...i.lines].join(" · ");
}

export function bindHold(el, { onHold, onTap }) {
  if (!el) return;
  let timer = 0;
  let held = false;
  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = 0;
  };
  el.addEventListener("pointerdown", (e) => {
    held = false;
    clear();
    timer = setTimeout(() => {
      held = true;
      onHold?.(e);
    }, HOLD_MS);
  });
  const up = (e) => {
    const was = held;
    clear();
    if (!was) onTap?.(e);
    held = false;
  };
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", clear);
  el.addEventListener("pointerleave", clear);
}
