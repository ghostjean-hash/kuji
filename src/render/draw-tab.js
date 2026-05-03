// 추첨 탭 (M2 재설계). 7단 정보 우선순위.

import { renderHeroCarousel } from "./hero-carousel.js";
import { renderMinorRow } from "./minor-row.js";
import { renderLastOneRow } from "./last-one-row.js";
import { renderProductGallery } from "./product-gallery.js";
import { renderBuyPanel } from "./buy-panel.js";
import { renderPeelPanel } from "./peel-panel.js";
import { BOX_SIZE } from "../data/numbers.js";

export function renderDrawTab(state, dispatch) {
  const el = document.createElement("div");
  el.className = "draw-tab";

  // 2. 메인 캐러셀 (A~F)
  el.appendChild(renderHeroCarousel(state, dispatch));

  // 3. 마이너 row (G~J)
  el.appendChild(renderMinorRow(state, dispatch));

  // 4. Last One row
  el.appendChild(renderLastOneRow(state, dispatch));

  // 5. 상품 갤러리 (펼침 시에만 그림. 접힘 토글은 7번 minor-meta-row에 통합)
  if (state.galleryExpanded) {
    el.appendChild(renderProductGallery(state, dispatch));
  }

  // 6. 구매 / 뜯기
  // pendingPeelResult가 있으면(확인 대기) peel-panel 유지. 사용자 확인 누르기 전엔 구매 씬 전환 금지.
  if (state.pendingPeelResult || state.unopenedTickets.length > 0) {
    el.appendChild(renderPeelPanel(state, dispatch));
  } else if (state.boxState.deck.length === 0) {
    const done = document.createElement("section");
    done.className = "buy-panel";
    done.innerHTML = `
      <h2 class="buy-panel-title">박스 종료</h2>
      <p style="color: var(--ink-muted); font-size: var(--font-size-sm);">박스 ${BOX_SIZE}매를 모두 뽑았습니다. 설정 탭에서 박스 리셋 가능.</p>
    `;
    el.appendChild(done);
  } else {
    el.appendChild(renderBuyPanel(state, dispatch));
  }

  // 7. 기타 정보 + 자세히 보기 토글
  const meta = document.createElement("section");
  meta.className = "minor-meta-row";
  meta.innerHTML = `
    <span><span class="meta-k">박스</span> #${state.boxState.id}</span>
    <span><span class="meta-k">회차</span> ${state.boxRound}</span>
    <span><span class="meta-k">잔여</span> ${state.boxState.totalSize - state.boxState.drawnCount}/${state.boxState.totalSize}</span>
    <span><span class="meta-k">미개봉</span> ${state.unopenedTickets.length}</span>
    <span><span class="meta-k">시드</span> ${state.seed}</span>
    <button class="gallery-toggle-inline" type="button">${state.galleryExpanded ? "접기 ▲" : "자세히 ▼"}</button>
  `;
  const galleryToggle = meta.querySelector(".gallery-toggle-inline");
  if (galleryToggle) {
    galleryToggle.addEventListener("click", () => dispatch({ type: "toggle_gallery" }));
  }
  el.appendChild(meta);

  return el;
}
