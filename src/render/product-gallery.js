// 상품 갤러리 (M2 재설계, 4장 영역 5). 디폴트 접힘 + 펼침 토글. 펼치면 11종 모두 자세히.
// M3.3 갱신 (5.13.D.2): tier_class 그룹화 (hero → main → goods + Last One hero 마지막).

import { getLineupById, TIER_CLASS_LABEL_KO, TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS, getTierClassForTier, LAST_ONE_TIER_NAME } from "../data/numbers.js";  // M4.2 LAST_ONE_TIER_NAME 일괄 단일화
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
    if (e.isLastOne && (LAST_ONE_TIER_NAME in drawnByTier)) drawnByTier[LAST_ONE_TIER_NAME] += 1;
  }

  const isLastDrawAhead = state.boxState.deck.length === 1;

  // M3.3: tier_class 그룹화. 박스 등급 순서 보존 + Last One은 hero 마지막.
  const groups = {
    [TIER_CLASS_HERO]: [],
    [TIER_CLASS_MAIN]: [],
    [TIER_CLASS_GOODS]: [],
  };
  for (const t of lineup.tiers) {
    if (t.tier === LAST_ONE_TIER_NAME) continue;
    const tc = getTierClassForTier(lineup, t.tier);
    if (tc && groups[tc]) groups[tc].push(t);
  }
  const lastOne = lineup.tiers.find((t) => t.tier === LAST_ONE_TIER_NAME);
  if (lastOne) groups[TIER_CLASS_HERO].push(lastOne);

  const orderedClasses = [TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS];
  for (const tc of orderedClasses) {
    const items = groups[tc];
    if (items.length === 0) continue;  // 빈 그룹 헤더 미표시 (5.13.D.2.6)
    const section = document.createElement("div");
    section.className = "product-gallery-section";
    section.dataset.tierClass = tc;
    const sectionHeader = document.createElement("h3");
    sectionHeader.className = "product-gallery-section-header";
    sectionHeader.textContent = TIER_CLASS_LABEL_KO[tc];
    section.appendChild(sectionHeader);
    const list = document.createElement("div");
    list.className = "product-gallery-list";
    for (const t of items) {
      const item = renderProductItem({
        tierMeta: t,
        drawnCount: drawnByTier[t.tier],
        drawnTypeIndices: drawnTypesByTier[t.tier],
        isLastOnePulsing: t.tier === LAST_ONE_TIER_NAME && isLastDrawAhead && drawnByTier[LAST_ONE_TIER_NAME] === 0,
        isJustDrawn: state.lastDrawnTier === t.tier,
        isExpanded: state.expandedTier === t.tier,
        onToggle: (tier) => dispatch({ type: "toggle_tier", tier }),
      });
      list.appendChild(item);
    }
    section.appendChild(list);
    el.appendChild(section);
  }

  return el;
}
