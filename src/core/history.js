// 추첨 이력 (01_spec 5.6).

import { TIERS } from "../data/numbers.js";

export function appendHistory(history, entry) {
  return [...history, entry];
}

// 등급별 누적 카운트. Last One 동시 지급분도 별도 카운트.
export function tierCounts(history) {
  const counts = {};
  for (const t of TIERS) counts[t.tier] = 0;
  for (const e of history) {
    if (e && e.tier && (e.tier in counts)) counts[e.tier] += 1;
    if (e && e.isLastOne) counts["Last One"] += 1;
  }
  return counts;
}
