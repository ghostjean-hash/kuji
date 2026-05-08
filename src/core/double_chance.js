// Double Chance 응모권 + 베르누이 단순화 추첨 (01_spec 5.5).
// M3: drawDc 시그니처 변경 - DC 상수가 라인업별로 분리되었으므로 dcConfig 객체로 통합.
//   dcConfig = lineup.dc = { winnersTotal, poolSizeDefault, prizeNameJa, prizeNameKo, prizeNoteKo }.

export function addTicket(tickets, ticket) {
  return [...tickets, ticket];
}

// drawDc: 사용자 1인이 N매 응모 → 1회 시행 당 당첨 확률 = 1 - (1 - p)^N.
// p = winnersTotal / poolSize (단순화 가정).
// 본 함수는 베르누이 1회 시행. 결과는 당첨 / 미당첨.
// M3: 시그니처 (tickets, rng, dcConfig). dcConfig = lineup.dc.
export function drawDc(tickets, rng, dcConfig) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    throw new Error("[double_chance] no tickets.");
  }
  if (!dcConfig || typeof dcConfig !== "object") {
    throw new Error("[double_chance] dcConfig required.");
  }
  const { winnersTotal, poolSizeDefault, prizeNameJa, prizeNameKo } = dcConfig;
  const poolSize = poolSizeDefault;
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
    prize: isWin ? { nameJa: prizeNameJa, nameKo: prizeNameKo } : null,
  };
}
