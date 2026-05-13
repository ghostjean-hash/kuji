// 추첨 (01_spec 5.3). deck splice(pickIndex) + 종 인덱스 결정. 마지막 1매 시점에 Last One 동시 지급.
// 03_architecture 3.4 시그니처: drawOne(boxState, drawRng, lineup, pickIndex?).
// M2.1: pickIndex 옵셔널. 미전달 또는 0 → splice(0) = head pop = 현행 M2 동등.

import { nextInt } from "./random.js";
import { isLastDraw } from "./box.js";
import { lastOnePrize } from "./last_one.js";

function buildTierIndex(tiers) {
  const map = {};
  for (const t of tiers) map[t.tier] = t;
  return map;
}

// drawOne: boxState 변경 (deck splice, drawnCount 증가).
// 마지막 1매(deck.length === 1) 시점이면 Last One 동시 지급, drawnCount += 2 (deck pop 1 + Last One 1).
// pickIndex (M2.1):
//   - undefined / 0: splice(0) = head pop (skip ON 또는 skip OFF에서 첫 슬롯).
//   - 정수 [1, deck.length - 1]: splice(pickIndex) = 사용자 슬롯 선택 (skip OFF 통 선택).
export function drawOne(boxState, drawRng, lineup, pickIndex) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[draw] invalid lineup. expected {tiers}.");
  }
  if (boxState.deck.length === 0) {
    throw new Error(`[draw] box empty. drawnCount=${boxState.drawnCount}, totalSize=${boxState.totalSize}`);
  }

  const idx = pickIndex === undefined || pickIndex === null ? 0 : pickIndex;
  if (!Number.isInteger(idx) || idx < 0 || idx >= boxState.deck.length) {
    throw new Error(`[draw] invalid pickIndex: ${pickIndex}. expected integer in [0, ${boxState.deck.length - 1}].`);
  }

  const tierIndex = buildTierIndex(lineup.tiers);
  const wasLast = isLastDraw(boxState);
  const label = boxState.deck.splice(idx, 1)[0];
  const tierMeta = tierIndex[label];
  if (!tierMeta) {
    throw new Error(`[draw] unknown tier label: ${label}`);
  }
  const typeIndex = tierMeta.typeCount > 1 ? nextInt(drawRng, tierMeta.typeCount) : 0;

  if (wasLast) {
    // M5 갱신: lineup.lastOneEnabled === false 시 Last One 자동 지급 미적용 (spec 5.4.6 정합).
    if (lineup.lastOneEnabled === false) {
      boxState.drawnCount += 1;
      return {
        tier: label,
        typeIndex,
        nameJa: tierMeta.nameJa,
        nameKo: tierMeta.nameKo,
        sizeLabel: tierMeta.sizeLabel,
        isLastOne: false,
        pickIndex: idx,
      };
    }
    boxState.drawnCount += 2;  // deck pop 1 + Last One 자동 지급 1
    return {
      tier: label,
      typeIndex,
      nameJa: tierMeta.nameJa,
      nameKo: tierMeta.nameKo,
      sizeLabel: tierMeta.sizeLabel,
      isLastOne: true,
      pickIndex: idx,
      lastOnePrize: lastOnePrize(lineup),
    };
  }

  boxState.drawnCount += 1;
  return {
    tier: label,
    typeIndex,
    nameJa: tierMeta.nameJa,
    nameKo: tierMeta.nameKo,
    sizeLabel: tierMeta.sizeLabel,
    isLastOne: false,
    pickIndex: idx,
  };
}
