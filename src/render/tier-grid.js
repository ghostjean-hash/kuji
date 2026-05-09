import { getLineupById, TIER_CLASS_LABEL_KO, TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS, getTierClassForTier } from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";

// 등급별 잔여 그리드 (`くじ券回収貼付け表` / 쿠지권 회수 첨부표).
// M3.3 갱신 (5.13.D.2): tier_class 그룹화 (hero → main → goods, Last One은 hero 마지막).
export function renderTierGrid(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("section");
  el.className = "tier-grid";
  const title = document.createElement("h2");
  title.className = "tier-grid-title";
  title.textContent = "등급별 잔여 (くじ券回収貼付け表 / 쿠지권 회수 첨부표)";
  el.appendChild(title);

  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnCounts = {};
  for (const t of lineup.tiers) drawnCounts[t.tier] = 0;
  for (const e of drawnInBox) {
    if (e.tier in drawnCounts) drawnCounts[e.tier] += 1;
    if (e.isLastOne && ("Last One" in drawnCounts)) drawnCounts["Last One"] += 1;
  }

  // M3.3: tier_class 그룹화. 박스 등급 순서 보존 + Last One은 hero 마지막.
  const groups = {
    [TIER_CLASS_HERO]: [],
    [TIER_CLASS_MAIN]: [],
    [TIER_CLASS_GOODS]: [],
  };
  for (const t of lineup.tiers) {
    if (t.tier === "Last One") continue;  // Last One은 별도 처리
    const tc = getTierClassForTier(lineup, t.tier);
    if (tc && groups[tc]) groups[tc].push(t);
  }
  // Last One을 hero 그룹 마지막 (사용자 결정 9.4)
  const lastOne = lineup.tiers.find((t) => t.tier === "Last One");
  if (lastOne) groups[TIER_CLASS_HERO].push(lastOne);

  // 정렬 순서 (사용자 결정 9.3): hero → main → goods
  const orderedClasses = [TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS];
  for (const tc of orderedClasses) {
    const items = groups[tc];
    if (items.length === 0) continue;  // 빈 그룹 헤더 미표시 (5.13.D.2.6)
    const section = document.createElement("div");
    section.className = "tier-grid-section";
    section.dataset.tierClass = tc;
    const sectionHeader = document.createElement("h3");
    sectionHeader.className = "tier-grid-section-header";
    sectionHeader.textContent = TIER_CLASS_LABEL_KO[tc];
    section.appendChild(sectionHeader);
    const rows = document.createElement("div");
    rows.className = "tier-grid-rows";
    for (const t of items) {
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
      rows.appendChild(row);
    }
    section.appendChild(rows);
    el.appendChild(section);
  }
  return el;
}
