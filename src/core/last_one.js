// Last One 보너스 상품 정보 조회 (01_spec 5.4).
// 03_architecture 3.5 시그니처: lastOnePrize(lineup).

import { LAST_ONE_TIER_NAME } from "../data/numbers.js";  // M4.2 일괄 단일화 (M3.1 P2-3 흡수)

export function lastOnePrize(lineup) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[last_one] invalid lineup. expected {tiers}.");
  }
  // M5 신설: lineup.lastOneEnabled === false 시 본 함수 호출 자체가 의미 부재. 호출처(main.js / draw.js) 분기 의무.
  if (lineup.lastOneEnabled === false) {
    throw new Error(`[last_one] lineup "${lineup.id}" lastOneEnabled=false. 호출처에서 lineup.lastOneEnabled 분기 의무 (spec 5.4.6 정합).`);
  }
  const tier = lineup.tiers.find((t) => t.tier === LAST_ONE_TIER_NAME);
  if (!tier) {
    throw new Error(`[last_one] lineup.tiers에 '${LAST_ONE_TIER_NAME}' 항목이 없음.`);
  }
  return {
    tier: LAST_ONE_TIER_NAME,
    typeIndex: 0,
    nameJa: tier.nameJa,
    nameKo: tier.nameKo,
    sizeLabel: tier.sizeLabel,
  };
}
