// 추첨 탭 (M2 재설계 + M2.1 B-α 통 선택 분기). 7단 정보 우선순위.
// 6번 영역 분기 a/b1/b2/b3/c (01_spec 4장 화면 흐름, M2.1 B-α 갱신).
// state 매트릭스 (03_architecture 5.8): unopenedTickets.length × settingsSkipPick × first ticket.lockedResult × pendingPeelResult × deck.length

import { renderHeroCarousel } from "./hero-carousel.js";
import { renderMinorRow } from "./minor-row.js";
import { renderLastOneRow } from "./last-one-row.js";
import { renderProductGallery } from "./product-gallery.js";
import { renderBuyPanel } from "./buy-panel.js";
import { renderPeelPanel } from "./peel-panel.js";
import { renderPickPanel } from "./pick-panel.js";
import { getLineupById } from "../data/numbers.js";

export function renderDrawTab(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("div");
  el.className = "draw-tab";

  // 2. 메인 캐러셀 (A~F)
  el.appendChild(renderHeroCarousel(state, dispatch));

  // 3. 마이너 row (G~J)
  el.appendChild(renderMinorRow(state, dispatch));

  // 4. Last One row
  el.appendChild(renderLastOneRow(state, dispatch));

  // 6. 구매 / 통 선택 / 뜯기 / 박스 종료 분기 (B-α: a/b1/b2/b3/c)
  // 분기 우선순위: c (deck 0 + 인벤토리 0) > b3 (reveal 진행 중) > b2 (skip ON 또는 첫 ticket lockedResult 보유) > b1 (skip OFF + raw) > a (구매)
  const hasInventory = state.unopenedTickets.length > 0;
  const deckEmpty = state.boxState.deck.length === 0;
  const hasPeelResult = !!state.pendingPeelResult;
  const skipPick = !!state.settingsSkipPick;
  const firstTicket = hasInventory ? state.unopenedTickets[0] : null;
  const firstHasLocked = !!(firstTicket && firstTicket.lockedResult);  // null / undefined 모두 raw로 처리

  if (hasPeelResult) {
    // (b3) reveal 진행 중.
    el.appendChild(renderPeelPanel(state, dispatch));
  } else if (hasInventory && (skipPick || firstHasLocked)) {
    // (b2) 뜯기 카드. skip ON이거나 첫 ticket lockedResult 보유 (B-α 확인 후).
    el.appendChild(renderPeelPanel(state, dispatch));
  } else if (hasInventory && !skipPick && !firstHasLocked) {
    // (b1) 통 선택 격자. skip OFF + 첫 ticket raw (lockedResult === null).
    el.appendChild(renderPickPanel(state, dispatch));
  } else if (deckEmpty && !hasInventory) {
    // (c) 박스 종료.
    const done = document.createElement("section");
    done.className = "buy-panel";
    done.innerHTML = `
      <h2 class="buy-panel-title">박스 종료</h2>
      <p style="color: var(--ink-muted); font-size: var(--font-size-sm);">박스 ${lineup.boxSize}매를 모두 뽑았습니다. 설정 탭에서 박스 리셋 가능.</p>
    `;
    el.appendChild(done);
  } else {
    // (a) 구매 패널.
    el.appendChild(renderBuyPanel(state, dispatch));
  }

  // 7. 기타 정보 + 자세히 보기 토글 (M2.1: skip 상태 추가)
  const meta = document.createElement("section");
  meta.className = "minor-meta-row";
  meta.innerHTML = `
    <span><span class="meta-k">박스</span> #${state.boxState.id}</span>
    <span><span class="meta-k">회차</span> ${state.boxRound}</span>
    <span><span class="meta-k">잔여</span> ${state.boxState.totalSize - state.boxState.drawnCount}/${state.boxState.totalSize}</span>
    <span><span class="meta-k">미개봉</span> ${state.unopenedTickets.length}</span>
    <span><span class="meta-k">시드</span> ${state.seed}</span>
    <span><span class="meta-k">통 선택</span> ${skipPick ? "건너뛰기" : "사용"}</span>
    <button class="gallery-toggle-inline" type="button">${state.galleryExpanded ? "접기 ▲" : "자세히 ▼"}</button>
  `;
  const galleryToggle = meta.querySelector(".gallery-toggle-inline");
  if (galleryToggle) {
    galleryToggle.addEventListener("click", () => dispatch({ type: "toggle_gallery" }));
  }
  el.appendChild(meta);

  // 8. 상품 갤러리 (자세히 펼침 시 minor-meta-row 아래에 노출)
  if (state.galleryExpanded) {
    el.appendChild(renderProductGallery(state, dispatch));
  }

  return el;
}
