// 구매 매수 검증 + 인벤토리 조작 (M2 신설, 03_architecture 3.14).
// core/ 순수 함수. DOM/window/localStorage import 0개.

import { BUY_FREE_INPUT_MIN } from "../data/numbers.js";

// 구매 매수 검증.
export function validateBuyCount(count, deckRemaining) {
  if (!Number.isInteger(count)) {
    return { ok: false, error: "매수는 정수여야 합니다." };
  }
  if (count < BUY_FREE_INPUT_MIN) {
    return { ok: false, error: `최소 ${BUY_FREE_INPUT_MIN}매부터 구매 가능합니다.` };
  }
  if (count > deckRemaining) {
    return { ok: false, error: `박스 잔여(${deckRemaining}매)보다 많이 구매할 수 없습니다.` };
  }
  return { ok: true };
}

// 인벤토리에 미개봉 복권 N매 추가 (불변).
// Ticket = { id, purchasedAt }
export function addUnopenedTickets(unopenedTickets, count, now) {
  const baseId = (now >>> 0).toString(16);
  const newTickets = [];
  for (let i = 0; i < count; i++) {
    newTickets.push({
      id: `${baseId}-${i}`,
      purchasedAt: now,
    });
  }
  return [...unopenedTickets, ...newTickets];
}

// 인벤토리에서 ticketId 제거 (불변).
export function removeTicket(unopenedTickets, ticketId) {
  return unopenedTickets.filter((t) => t.id !== ticketId);
}
