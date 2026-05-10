// 메인 캐러셀 (M2 재설계, 4장 영역 2). goods 아닌 등급(hero + main)을 가로 드래그 캐러셀로 표시.
// M3.5: filter 식이 count 기반 → tierClass 기반으로 변경. 변수명 HERO_TIERS → CAROUSEL_TIERS (hero+main 모두 포함하므로 의미 정확화).

import { PERCENT_BASE, getLineupById, getTierClassForTier, TIER_CLASS_GOODS } from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";
import { getProductMainAsset } from "../data/assets.js";
import { attachHorizontalDragScroll } from "../input/scroll.js";
import { showProductDetailModal } from "./product-detail-modal.js";

export function renderHeroCarousel(state, dispatch) {
  // M3.5: goods 아닌 일반 등급 (Last One 제외) = hero + main. 드래곤볼 A/B/C/D/E/F (6) / 원피스 A/B/C/D/E/F (6).
  const lineup = getLineupById(state.currentLineupId);
  const CAROUSEL_TIERS = lineup.tiers.filter(
    (t) => t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"
  );
  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnByTier = {};
  for (const t of CAROUSEL_TIERS) drawnByTier[t.tier] = 0;
  for (const e of drawnInBox) {
    if (e.tier in drawnByTier) drawnByTier[e.tier] += 1;
  }

  const el = document.createElement("section");
  el.className = "hero-carousel";

  const track = document.createElement("div");
  track.className = "hero-carousel-track";

  for (const t of CAROUSEL_TIERS) {
    const drawn = drawnByTier[t.tier];
    const isDrawn = drawn >= 1;
    const isJustDrawn = state.lastDrawnTier === t.tier;
    // is-just-drawn 활성 동안에는 is-drawn 미부여 (is-drawn::after 어두운 오버레이가 강조 카드 위에 겹쳐 dim되어 보이는 문제 방지).
    // peel_confirm으로 lastDrawnTier=null 된 다음 사이클에서 자연스럽게 is-drawn(작은 회색)으로 전환됨.
    const card = document.createElement("article");
    card.className = "hero-card"
      + (isJustDrawn ? " is-just-drawn" : (isDrawn ? " is-drawn" : ""));
    card.dataset.tier = t.tier;
    // M3.2: tier_class 시각 적용 (5.13.C.2.1). data-tier-class 속성 부착 → CSS 셀렉터 액센트.
    card.dataset.tierClass = getTierClassForTier(lineup, t.tier) || "";
    card.style.setProperty("--tier-color", TIER_COLORS[t.tier]);
    card.innerHTML = `
      <div class="hero-tier-badge">${t.tier}賞</div>
      <div class="hero-image">${getProductMainAsset(t.tier)}</div>
      <div class="hero-info">
        <div class="hero-name">${t.nameKo}</div>
        <div class="hero-meta">${t.sizeLabel} · ${t.count - drawn} / ${t.count}</div>
      </div>
    `;
    // 받기 절차 활성 조건: pendingPeelResult가 이 등급 + 받기 필요 + 미완료
    const isPendingReceive = state.pendingPeelResult
      && state.pendingPeelResult.tier === t.tier
      && state.pendingPeelResult.requiresReceive
      && !state.pendingPeelResult.receivedConfirmed
      && !state.pendingPeelResult.isLastOne;

    if (isPendingReceive) {
      card.classList.add("is-pending-receive");
      const receiveBtn = document.createElement("button");
      receiveBtn.className = "hero-card-receive-button";
      receiveBtn.type = "button";
      receiveBtn.textContent = "받기";
      receiveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showProductDetailModal({
          tierMeta: t,
          drawnCount: 0,
          drawnTypeIndices: [],
          mode: "receive",
          onReceive: () => dispatch({ type: "receive_confirm" }),
        });
      });
      card.appendChild(receiveBtn);
    }

    card.addEventListener("click", (e) => {
      if (e.target && typeof e.target.closest === "function" && e.target.closest("button, input, a")) return;
      showProductDetailModal({ tierMeta: t, drawnCount: drawn, drawnTypeIndices: [] });
    });
    track.appendChild(card);
  }
  el.appendChild(track);
  // PC 마우스 드래그 + 휠 가로 스크롤 부착
  setTimeout(() => attachHorizontalDragScroll(track), 0);
  return el;
}
