// 상품 갤러리 (M2 재설계, 4장 영역 5). 디폴트 접힘 + 펼침 토글. 펼치면 11종 모두 자세히.

import { TIERS } from "../data/numbers.js";
import { renderProductItem } from "./product-item.js";

export function renderProductGallery(state, dispatch) {
  // 접힌 상태 갤러리는 draw-tab의 minor-meta-row 토글에서 처리. 펼친 상태에서만 본 컴포넌트 호출.
  const el = document.createElement("section");
  el.className = "product-gallery is-expanded";

  // 박스 ID 필터 등급별 카운트 + 종 인덱스
  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnByTier = {};
  const drawnTypesByTier = {};
  for (const t of TIERS) {
    drawnByTier[t.tier] = 0;
    drawnTypesByTier[t.tier] = [];
  }
  for (const e of drawnInBox) {
    if (e.tier in drawnByTier) {
      drawnByTier[e.tier] += 1;
      drawnTypesByTier[e.tier].push(e.typeIndex);
    }
    if (e.isLastOne) drawnByTier["Last One"] += 1;
  }

  const isLastDrawAhead = state.boxState.deck.length === 1;

  const list = document.createElement("div");
  list.className = "product-gallery-list";
  for (const t of TIERS) {
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
