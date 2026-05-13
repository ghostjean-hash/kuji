// 라인업 천장 룰 (M5 신설). spec 5.13.G + 02_data 1.4-XG.4 + arch 3.6.M5 정합.
// 코토부키야쿠지 = 30연 구매 시 S賞 1매 확정. 사용자 결정 3.1 (b) 알고리즘.
// CLAUDE.md 4.1 정합: DOM 의존성 0건. lineup 인자 결정론적 도출.

import { drawOne } from "./draw.js";

// 일반 N매 추첨 (drawOne 반복). drawWithCeiling fallback 전용.
function drawNormalN(boxState, drawRng, lineup, count) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(drawOne(boxState, drawRng, lineup));
  }
  return results;
}

// 천장 룰 적용 N연 추첨 (사용자 결정 3.1 (b)).
// 활성 조건: lineup.ceilingEnabled === true && count === lineup.ceilingPurchaseSize.
// 비활성 시 일반 drawOne 반복 fallback (호출처 안전성).
export function drawWithCeiling(boxState, drawRng, lineup, count) {
  if (!lineup || !Array.isArray(lineup.tiers) || typeof count !== "number" || count <= 0) {
    throw new Error("[ceiling] invalid args. expected lineup + count > 0.");
  }
  // 비활성 fallback (spec 5.13.G.4 / round 2 P0-1 정합)
  if (lineup.ceilingEnabled !== true) {
    return drawNormalN(boxState, drawRng, lineup, count);
  }
  if (count !== lineup.ceilingPurchaseSize) {
    return drawNormalN(boxState, drawRng, lineup, count);
  }

  // 박스 deck에서 ceilingTier 첫 등장 인덱스 탐색
  const sIndex = boxState.deck.findIndex((t) => t === lineup.ceilingTier);
  if (sIndex < 0) {
    // S 미존재 fallback (deck 잔여에 ceilingTier 부재 = 모두 추첨됨)
    return drawNormalN(boxState, drawRng, lineup, count);
  }

  // S 보장 추출
  const sResult = drawOne(boxState, drawRng, lineup, sIndex);

  // 잔여 count-1 매 일반 추첨 (splice(0) = head pop)
  const others = [];
  for (let i = 0; i < count - 1; i++) {
    others.push(drawOne(boxState, drawRng, lineup));
  }

  return [sResult, ...others];
}

// 천장 룰 활성 조건 검증 (사용자 가시 라벨 / 분기용).
// 활성 = ceilingEnabled=true + count=ceilingPurchaseSize + deck 잔여 ≥ count + deck에 ceilingTier 존재.
export function isCeilingApplicable(boxState, lineup, count) {
  if (!lineup || lineup.ceilingEnabled !== true) return false;
  if (typeof count !== "number" || count !== lineup.ceilingPurchaseSize) return false;
  if (!boxState || !Array.isArray(boxState.deck)) return false;
  if (boxState.deck.length < count) return false;
  return boxState.deck.includes(lineup.ceilingTier);
}
