// 추첨 이력 (01_spec 5.6 + M2.1 5.14.4.6).
// entry 스키마 (호출처 = render/main.js dispatch.peel / dispatch.pick):
//   { time, boxId, drawIndex, tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne,
//     pickIndex (M2.1, number | null), revealed (M2.1, boolean) }

import { TIERS } from "../data/numbers.js";

export function appendHistory(history, entry) {
  return [...history, entry];
}

// 등급별 누적 카운트. Last One 동시 지급분도 별도 카운트.
// M2.1 B-α: history는 reveal 시점에만 append. revealed === false 항목은 안전장치로 제외.
export function tierCounts(history) {
  const counts = {};
  for (const t of TIERS) counts[t.tier] = 0;
  for (const e of history) {
    if (!e || e.revealed === false) continue;
    if (e.tier && (e.tier in counts)) counts[e.tier] += 1;
    if (e.isLastOne) counts["Last One"] += 1;
  }
  return counts;
}

// M2.1 1차 (findUnrevealed / revealHistory)는 B-α 폐기. 호출처 0건 보장 (T17 grep).
// 새로고침 복원은 ticket.lockedResult 기반 (data/storage.js).
