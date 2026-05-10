// 박스 초기화 / 셔플 / 잔여 (01_spec 5.1, 5.3.2).
// 03_architecture 3.3 시그니처: initBox(seed, boxRound, lineup).

import { createRng, nextInt } from "./random.js";
import { boxId, fnv1a } from "./hash.js";
import { LAST_ONE_TIER_NAME } from "../data/numbers.js";  // M4.2 일괄 단일화 (M3.1 P2-3 흡수)

// initBox: lineup.boxSize - 1 매(Last One 제외)의 등급 라벨 배열 시드 기반 셔플.
// Last One은 deck에 포함하지 않음. 마지막 1매 추첨 시 자동 지급 (01_spec 5.4.4).
export function initBox(seed, boxRound, lineup) {
  if (!lineup || !Array.isArray(lineup.tiers) || typeof lineup.boxSize !== "number") {
    throw new Error("[box] invalid lineup. expected {tiers, boxSize}.");
  }
  const id = boxId(seed, boxRound, lineup.id);

  const labels = [];
  for (const t of lineup.tiers) {
    if (t.tier === LAST_ONE_TIER_NAME) continue;
    for (let i = 0; i < t.count; i++) labels.push(t.tier);
  }

  if (labels.length !== lineup.boxSize - 1) {
    throw new Error(
      `[box] deck size ${labels.length} != boxSize - 1 (${lineup.boxSize - 1})`
    );
  }

  // 셔플 시드 = seed XOR fnv1a(id). 박스 회차마다 셔플 순서 다름.
  const shuffleSeed = ((seed >>> 0) ^ fnv1a(id)) >>> 0;
  const rng = createRng(shuffleSeed);
  for (let i = labels.length - 1; i > 0; i--) {
    const j = nextInt(rng, i + 1);
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  return {
    id,
    deck: labels,
    drawnCount: 0,
    totalSize: lineup.boxSize,
  };
}

export function remaining(boxState) {
  return boxState.totalSize - boxState.drawnCount;
}

// 다음 추첨이 박스의 마지막 추첨인지 (deck 잔여 1매 시점).
export function isLastDraw(boxState) {
  return boxState.deck.length === 1;
}
