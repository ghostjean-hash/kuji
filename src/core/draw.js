// 추첨 (01_spec 5.3). deck pop + 종 인덱스 결정. 마지막 1매 시점에 Last One 동시 지급.
// 03_architecture 3.4 시그니처: drawOne(boxState, drawRng, lineup).

import { nextInt } from "./random.js";
import { isLastDraw } from "./box.js";
import { lastOnePrize } from "./last_one.js";

function buildTierIndex(tiers) {
  const map = {};
  for (const t of tiers) map[t.tier] = t;
  return map;
}

// drawOne: boxState 변경 (deck shift, drawnCount 증가).
// 마지막 1매(deck.length === 1) 시점이면 Last One 동시 지급, drawnCount += 2 (deck pop 1 + Last One 1).
export function drawOne(boxState, drawRng, lineup) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[draw] invalid lineup. expected {tiers}.");
  }
  if (boxState.deck.length === 0) {
    throw new Error(`[draw] box empty. drawnCount=${boxState.drawnCount}, totalSize=${boxState.totalSize}`);
  }

  const tierIndex = buildTierIndex(lineup.tiers);
  const wasLast = isLastDraw(boxState);
  const label = boxState.deck.shift();
  const tierMeta = tierIndex[label];
  if (!tierMeta) {
    throw new Error(`[draw] unknown tier label: ${label}`);
  }
  const typeIndex = tierMeta.typeCount > 1 ? nextInt(drawRng, tierMeta.typeCount) : 0;

  if (wasLast) {
    boxState.drawnCount += 2;  // deck pop 1 + Last One 자동 지급 1
    return {
      tier: label,
      typeIndex,
      nameJa: tierMeta.nameJa,
      nameKo: tierMeta.nameKo,
      sizeLabel: tierMeta.sizeLabel,
      isLastOne: true,
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
  };
}
