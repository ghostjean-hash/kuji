// 미개봉 복권 인벤토리 패널 (M2 신설).
// pendingPeelResult가 있으면 확인 대기 카드 (revealed + 확인 버튼).
// 없으면 일반 인벤토리 카드 스택 (좌측 드래그/클릭으로 뜯기).

import { renderPeelCard } from "./peel-card.js";
import { PEEL_STACK_VISIBLE_LIMIT, PEEL_STACK_OFFSET_PX, PEEL_STACK_SCALE_DELTA, getLineupById } from "../data/numbers.js";

export function renderPeelPanel(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);  // M3.2: hero 분기용
  const el = document.createElement("section");
  el.className = "peel-panel";

  const title = document.createElement("h2");
  title.className = "peel-panel-title";
  title.textContent = state.pendingPeelResult ? "결과 확인" : "복권을 뜯어주세요";
  el.appendChild(title);

  const count = document.createElement("div");
  count.className = "peel-panel-count";
  if (state.pendingPeelResult) {
    count.textContent = `남은 복권 ${state.unopenedTickets.length}매`;
  } else {
    count.textContent = `남은 복권 ${state.unopenedTickets.length}매`;
  }
  el.appendChild(count);

  const stack = document.createElement("div");
  stack.className = "peel-stack";
  el.appendChild(stack);

  if (state.pendingPeelResult) {
    // Last One 보너스 동시 획득 시 카드 외부에 별도 골드 배너 (마지막 1매 뽑힘 시점)
    if (state.pendingPeelResult.isLastOne && state.pendingPeelResult.lastOnePrize) {
      const banner = document.createElement("div");
      banner.className = "last-one-bonus-banner";
      banner.innerHTML = `
        <div class="banner-icon">★</div>
        <div class="banner-content">
          <div class="banner-label">+ Last One 보너스 동시 획득</div>
          <div class="banner-name">${state.pendingPeelResult.lastOnePrize.nameKo}</div>
          <div class="banner-name-ja">${state.pendingPeelResult.lastOnePrize.nameJa}</div>
        </div>
      `;
      // peel-stack 위에 배너 삽입 (제목 / 카운트 다음)
      el.insertBefore(banner, stack);
    }
    // 확인 대기 카드 (revealed)
    // 받기 미완료(requiresReceive && !receivedConfirmed) 시 확인 버튼 disabled.
    const isReceivePending = state.pendingPeelResult.requiresReceive
      && !state.pendingPeelResult.receivedConfirmed;
    const card = renderPeelCard({
      ticket: { id: state.pendingPeelResult.ticketId, purchasedAt: 0 },
      revealedResult: state.pendingPeelResult,
      onConfirm: () => dispatch({ type: "peel_confirm" }),
      isConfirmDisabled: isReceivePending,
      lineup,  // M3.2
    });
    stack.appendChild(card);
    return el;
  }

  // 일반 인벤토리 스택
  const visible = state.unopenedTickets.slice(0, PEEL_STACK_VISIBLE_LIMIT);
  visible.forEach((ticket, i) => {
    const card = renderPeelCard({
      ticket,
      onReveal: (applyResult) => {
        dispatch({ type: "peel", ticketId: ticket.id, applyResult });
      },
      onConfirm: () => dispatch({ type: "peel_confirm" }),
      lineup,  // M3.2
    });
    card.style.zIndex = String(visible.length - i);
    card.style.transform = `translateY(${i * PEEL_STACK_OFFSET_PX}px) scale(${1 - i * PEEL_STACK_SCALE_DELTA})`;
    if (i > 0) card.style.pointerEvents = "none";
    stack.appendChild(card);
  });

  return el;
}
