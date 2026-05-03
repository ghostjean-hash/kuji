import { TIERS } from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";

// 등급별 잔여 그리드 (`くじ券回収貼付け表` / 쿠지권 회수 첨부표).
export function renderTierGrid(state, dispatch) {
  const el = document.createElement("section");
  el.className = "tier-grid";
  const title = document.createElement("h2");
  title.className = "tier-grid-title";
  title.textContent = "등급별 잔여 (くじ券回収貼付け表 / 쿠지권 회수 첨부표)";
  el.appendChild(title);

  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnCounts = {};
  for (const t of TIERS) drawnCounts[t.tier] = 0;
  for (const e of drawnInBox) {
    if (e.tier in drawnCounts) drawnCounts[e.tier] += 1;
    if (e.isLastOne) drawnCounts["Last One"] += 1;
  }

  const grid = document.createElement("div");
  grid.className = "tier-grid-rows";
  for (const t of TIERS) {
    const row = document.createElement("div");
    row.className = "tier-row";
    row.style.setProperty("--tier-color", TIER_COLORS[t.tier]);
    const drawn = drawnCounts[t.tier];
    const left = t.count - drawn;
    row.innerHTML = `
      <span class="tier-label">${t.tier}</span>
      <span class="tier-name">${t.nameKo}</span>
      <span class="tier-count">${left} / ${t.count}</span>
    `;
    grid.appendChild(row);
  }
  el.appendChild(grid);
  return el;
}
