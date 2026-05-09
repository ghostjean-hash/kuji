// 추첨 이력 (01_spec 5.6 + M2.1 5.14.4.6 + M3 lineup 인자).
// entry 스키마 (호출처 = render/main.js dispatch.peel / dispatch.pick):
//   { time, boxId, drawIndex, tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne,
//     pickIndex (M2.1, number | null), gridIndex (M2.1, number | null), revealed (M2.1, deprecated 호환) }
// M3.3 신설: tierClassCounts. 02_data 1.4.A.5 호출처 + 5.13.D.3 정합.

import { getTierClassForTier, TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS } from "../data/numbers.js";

export function appendHistory(history, entry) {
  return [...history, entry];
}

// 등급별 누적 카운트. Last One 동시 지급분도 별도 카운트.
// M2.1 B-α: history는 reveal 시점에만 append. revealed === false 항목은 안전장치로 제외.
// M3 (CB-1, 단계 4 T7): lineup 인자 추가. 라인업별 등급 수 가변성 흡수 (드래곤볼 10 vs 원피스 9).
export function tierCounts(history, lineup) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[history] tierCounts: lineup.tiers required (M3 CB-1).");
  }
  const counts = {};
  for (const t of lineup.tiers) counts[t.tier] = 0;
  for (const e of history) {
    if (!e || e.revealed === false) continue;
    if (e.tier && (e.tier in counts)) counts[e.tier] += 1;
    if (e.isLastOne && ("Last One" in counts)) counts["Last One"] += 1;
  }
  return counts;
}

// M3.3 신설: tier_class별 누적 카운트 + 전체 합계.
// 입력: HistoryEntry[] + lineup 객체.
// 출력: { hero: number, main: number, goods: number, total: number }.
// 미존재 tier (라인업 변경 시 잔존 entry 등) → tierClass=null이라 카운트 미반영 (가드).
// DOM 0건 + lineup 인자 결정론적 (CLAUDE.md 4.1 / 4.3 정합).
export function tierClassCounts(history, lineup) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[history] tierClassCounts: lineup.tiers required (M3.3).");
  }
  const counts = {
    [TIER_CLASS_HERO]: 0,
    [TIER_CLASS_MAIN]: 0,
    [TIER_CLASS_GOODS]: 0,
  };
  let total = 0;
  for (const e of history) {
    if (!e) continue;
    total += 1;
    const tierClass = getTierClassForTier(lineup, e.tier);
    if (tierClass && counts[tierClass] !== undefined) counts[tierClass] += 1;
  }
  return { ...counts, total };
}

// M2.1 1차 (findUnrevealed / revealHistory)는 B-α 폐기. 호출처 0건 보장.
// 새로고침 복원은 ticket.lockedResult 기반 (data/storage.js).
