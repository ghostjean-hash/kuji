// Last One row (M2 재설계, 4장 영역 4). 1줄 골드 강조 + 도달까지 잔여 카운터.

import { TIERS } from "../data/numbers.js";
import { getProductMainAsset } from "../data/assets.js";
import { showProductDetailModal } from "./product-detail-modal.js";

export function renderLastOneRow(state, dispatch) {
  const lastOne = TIERS.find((t) => t.tier === "Last One");
  if (!lastOne) return document.createDocumentFragment();
  const drawnInBox = state.history.filter((e) => e.boxId === state.boxState.id);
  const isLastOneDrawn = drawnInBox.some((e) => e.isLastOne);
  const remaining = isLastOneDrawn ? 0 : 1;
  const deckRemaining = state.boxState.deck.length;
  const unopenedCount = state.unopenedTickets.length;
  // 구매 기준: 사용자가 인벤토리 다 뜯고 Last One 도달까지 추가로 구매해야 할 매수
  const buyNeeded = Math.max(0, deckRemaining - unopenedCount);
  const isAhead = deckRemaining === 1 && !isLastOneDrawn;
  // Last One 동시 획득 = pendingPeelResult.isLastOne (마지막 1매 뽑힘 시점)
  const isJustDrawn = !!(state.pendingPeelResult && state.pendingPeelResult.isLastOne);

  // 카운터 라벨 분기 (구매 기준)
  let counterLabel;
  if (isLastOneDrawn) {
    counterLabel = `<span class="last-one-counter is-acquired">획득 ✓</span>`;
  } else if (deckRemaining === 1) {
    counterLabel = `<span class="last-one-counter is-imminent">다음이 Last One!</span>`;
  } else if (deckRemaining === 0) {
    counterLabel = `<span class="last-one-counter">박스 종료</span>`;
  } else if (buyNeeded === 0) {
    counterLabel = `<span class="last-one-counter is-imminent">보유 매수로 도달 가능</span>`;
  } else {
    counterLabel = `<span class="last-one-counter">Last One까지 <strong>${buyNeeded}</strong>매 더 구매</span>`;
  }

  const el = document.createElement("section");
  el.className = "last-one-row"
    + (isAhead ? " is-pulsing" : "")
    + (isJustDrawn ? " is-just-drawn" : "")
    + (isLastOneDrawn ? " is-drawn" : "");
  el.dataset.tier = "Last One";
  el.innerHTML = `
    <div class="last-one-image">${getProductMainAsset("Last One")}</div>
    <div class="last-one-info">
      <span class="last-one-badge">LAST ONE 賞</span>
      <span class="last-one-name">${lastOne.nameKo}</span>
      ${counterLabel}
    </div>
    <span class="last-one-count">${remaining} / ${lastOne.count}</span>
  `;
  el.addEventListener("click", (e) => {
    if (e.target && typeof e.target.closest === "function" && e.target.closest("button, input, a")) return;
    showProductDetailModal({
      tierMeta: lastOne,
      drawnCount: isLastOneDrawn ? 1 : 0,
      drawnTypeIndices: [],
    });
  });
  return el;
}
