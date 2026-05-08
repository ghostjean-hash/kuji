// 상품 갤러리 (M2 재설계, 4장 영역 5). 디폴트 접힘 + 펼침 토글. 펼치면 11종 모두 자세히.

import { getLineupById } from "../data/numbers.js";
import { renderProductItem } from "./product-item.js";

export function renderProductGallery(state, dispatch) {
  // M3: 활성 라인업 tiers 동적 lookup.
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("section");
  el.className = "product-gallery is-expanded";

  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnByTier = {};
  const drawnTypesByTier = {};
  for (const t of lineup.tiers) {
    drawnByTier[t.tier] = 0;
    drawnTypesByTier[t.tier] = [];
  }
  for (const e of drawnInBox) {
    if (e.tier in drawnByTier) {
      drawnByTier[e.tier] += 1;
      drawnTypesByTier[e.tier].push(e.typeIndex);
    }
    if (e.isLastOne && ("Last One" in drawnByTier)) drawnByTier["Last One"] += 1;
  }

  const isLastDrawAhead = state.boxState.deck.length === 1;

  const list = document.createElement("div");
  list.className = "product-gallery-list";
  for (const t of lineup.tiers) {
    const item = renderProductItem({
      tierMeta: t,
      drawnCount: drawnByTier[t.tier],
      drawnTypeIndices: drawnTypesByTier[t.tier],
      isLastOnePulsing: t.tier === "Last One" && isLastDrawAhead && drawnByTier["Last One"] === 0,
      isJustDrawn: state.lastDrawnTier === t.tier,
      isExpanded: state.expandedTier === t.tier,
      onToggle: (tier) => dispatch({ type: "toggle_tier", tier }),
    });
    list.appendChild(item);
  }
  el.appendChild(list);

  return el;
}
