import { SKILLS, SKILL_IDS, unlockSkill, setActiveSkill, skillStats, skillXpToLevel } from "./skills.mjs";
import { log, refreshHud } from "./hud.mjs";

export function toggleSkills(state) {
  if (!state.hero || (state.mode !== "play" && !state.skillsOpen)) return false;
  state.skillsOpen = !state.skillsOpen;
  if (state.skillsOpen) state.invOpen = false;
  return state.skillsOpen;
}

export function renderSkills(state) {
  const overlay = document.getElementById("skill-overlay");
  if (!overlay || !state.hero) return;
  overlay.classList.toggle("hidden", !state.skillsOpen);
  if (!state.skillsOpen) return;
  const h = state.hero;
  const pts = document.getElementById("skill-pts");
  if (pts) pts.textContent = h.skillPoints
    ? `${h.skillPoints} skillpoint. Lås upp en kraft.`
    : "Inga skillpoints. Levela mer, eller välj en upplåst kraft.";
  const list = document.getElementById("skill-list");
  if (!list) return;
  list.innerHTML = "";
  SKILL_IDS.forEach((id) => {
    const def = SKILLS[id];
    const slot = h.skills[id];
    const st = skillStats(def, slot);
    const row = document.createElement("div");
    row.className = "skill-row" + (h.activeSkill === id ? " active" : "");
    row.style.borderColor = def.color;
    const status = slot.unlocked
      ? `Nv ${slot.level} · XP ${slot.xp}/${skillXpToLevel(slot.level)} · CD ${st.cd}s`
      : "Låst";
    row.innerHTML = `<div><b style="color:${def.color}">${def.name}</b><small>${def.desc}</small><small>${status}</small></div>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = slot.unlocked ? "ghost" : "primary";
    if (!slot.unlocked) {
      btn.textContent = h.skillPoints ? "Lås upp" : "Behöver poäng";
      btn.disabled = !h.skillPoints;
      btn.onclick = () => {
        if (!unlockSkill(h, id).skills[id].unlocked) return;
        log(`Låste upp ${def.name}!`);
        refreshHud(state);
        renderSkills(state);
      };
    } else {
      btn.textContent = h.activeSkill === id ? "Vald" : "Välj";
      btn.onclick = () => {
        setActiveSkill(h, id);
        log(`${def.name} redo (E / B)`);
        refreshHud(state);
        renderSkills(state);
      };
    }
    row.appendChild(btn);
    list.appendChild(row);
  });
}

export function bindSkillPanel(state) {
  const open = () => {
    if (!state.hero || state.mode !== "play") return;
    toggleSkills(state);
    renderSkills(state);
  };
  document.getElementById("skill-btn")?.addEventListener("click", open);
  document.getElementById("skill-touch")?.addEventListener("click", open);
  document.getElementById("skill-close")?.addEventListener("click", () => {
    state.skillsOpen = false;
    renderSkills(state);
  });
  window.addEventListener("lootlings-skills", open);
}
