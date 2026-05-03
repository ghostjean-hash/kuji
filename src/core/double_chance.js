// Double Chance 응모권 + 베르누이 단순화 추첨 (01_spec 5.5).

import { DC_PRIZE_NAME_JA, DC_PRIZE_NAME_KO } from "../data/numbers.js";

export function addTicket(tickets, ticket) {
  return [...tickets, ticket];
}

// drawDc: 사용자 1인이 N매 응모 → 1회 시행 당 당첨 확률 = 1 - (1 - p)^N.
// p = winnersTotal / poolSize (단순화 가정).
// 본 함수는 베르누이 1회 시행. 결과는 당첨 / 미당첨.
export function drawDc(tickets, rng, winnersTotal, poolSize) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    throw new Error("[double_chance] no tickets.");
  }
  if (!Number.isFinite(winnersTotal) || winnersTotal <= 0) {
    throw new Error(`[double_chance] invalid winnersTotal: ${winnersTotal}`);
  }
  if (!Number.isFinite(poolSize) || poolSize <= 0) {
    throw new Error(`[double_chance] invalid poolSize: ${poolSize}`);
  }
  const p = winnersTotal / poolSize;
  const probWin = 1 - Math.pow(1 - p, tickets.length);
  const r = rng();
  const isWin = r < probWin;
  return {
    isWin,
    probability: probWin,
    ticketsCount: tickets.length,
    prize: isWin ? { nameJa: DC_PRIZE_NAME_JA, nameKo: DC_PRIZE_NAME_KO } : null,
  };
}
