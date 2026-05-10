// 마이너 row (M2 재설계, 4장 영역 3). 굿즈 등급(goods)을 가로 스크롤 1줄로 표시.
// M3.5: filter 식이 count 기반 → tierClass 기반으로 변경. 드래곤볼 G/H/I/J / 원피스 G/H/I.

import { PERCENT_BASE, getLineupById, getTierClassForTier, TIER_CLASS_GOODS } from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";
import { getProductMainAsset } from "../data/assets.js";
import { attachHorizontalDragScroll } from "../input/scroll.js";
import { showProductDetailModal } from "./product-detail-modal.js";

export function renderMinorRow(state, dispatch) {
  // M3.5: goods 등급 (Last One 제외). 드래곤볼 G/H/I/J / 원피스 G/H/I.
  const lineup = getLineupById(state.currentLineupId);
  const MINOR_TIERS = lineup.tiers.filter(
    (t) => t.tierClass === TIER_CLASS_GOODS && t.tier !== "Last One"
  );
  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnByTier = {};
  for (const t of MINOR_TIERS) drawnByTier[t.tier] = 0;
  for (const e of drawnInBox) {
    if (e.tier in drawnByTier) drawnByTier[e.tier] += 1;
  }

  const el = document.createElement("section");
  el.className = "minor-row";

  for (const t of MINOR_TIERS) {
    const drawn = drawnByTier[t.tier];
    const remaining = t.count - drawn;
    const ratio = t.count > 0 ? drawn / t.count : 0;
    const isJustDrawn = state.lastDrawnTier === t.tier;
    const isExhausted = remaining === 0;
    const item = document.createElement("div");
    item.className = "minor-row-item"
      + (isJustDrawn ? " is-just-drawn" : "")
      + (isExhausted ? " is-exhausted" : "");
    item.dataset.tier = t.tier;
    // M3.2: tier_class 시각 적용 (5.13.C.2.1). 현재 minor-row 등급은 모두 goods 클래스. 차기 사이클 hook.
    item.dataset.tierClass = getTierClassForTier(lineup, t.tier) || "";
    item.style.setProperty("--tier-color", TIER_COLORS[t.tier]);
    item.innerHTML = `
      <div class="minor-image">
        <span class="minor-tier-badge">${t.tier}</span>
        ${getProductMainAsset(t.tier)}
      </div>
      <div class="minor-meta">
        <span class="minor-count">${remaining}<span class="minor-count-total">/${t.count}</span></span>
      </div>
      <div class="minor-gauge">
        <div class="minor-gauge-fill" style="width: ${ratio * PERCENT_BASE}%"></div>
      </div>
    `;
    item.addEventListener("click", (e) => {
      if (e.target && typeof e.target.closest === "function" && e.target.closest("button, input, a")) return;
      const drawnTypeIndices = drawnInBox.filter((x) => x.tier === t.tier).map((x) => x.typeIndex);
      showProductDetailModal({ tierMeta: t, drawnCount: drawn, drawnTypeIndices });
    });
    el.appendChild(item);
  }

  setTimeout(() => attachHorizontalDragScroll(el), 0);
  return el;
}
