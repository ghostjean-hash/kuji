// 메인 캐러셀 (M2 재설계, 4장 영역 2). A~F 1매 등급 6종을 가로 드래그 캐러셀로 표시.

import { TIERS, PERCENT_BASE } from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";
import { getProductMainAsset } from "../data/assets.js";
import { attachHorizontalDragScroll } from "../input/scroll.js";
import { showProductDetailModal } from "./product-detail-modal.js";

export function renderHeroCarousel(state, dispatch) {
  // A~F: count === 1 + tier !== "Last One"
  const HERO_TIERS = TIERS.filter((t) => t.count === 1 && t.tier !== "Last One");
  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const drawnByTier = {};
  for (const t of HERO_TIERS) drawnByTier[t.tier] = 0;
  for (const e of drawnInBox) {
    if (e.tier in drawnByTier) drawnByTier[e.tier] += 1;
  }

  const el = document.createElement("section");
  el.className = "hero-carousel";

  const track = document.createElement("div");
  track.className = "hero-carousel-track";

  for (const t of HERO_TIERS) {
    const drawn = drawnByTier[t.tier];
    const isDrawn = drawn >= 1;
    const isJustDrawn = state.lastDrawnTier === t.tier;
    const card = document.createElement("article");
    card.className = "hero-card" + (isDrawn ? " is-drawn" : "") + (isJustDrawn ? " is-just-drawn" : "");
    card.dataset.tier = t.tier;
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
