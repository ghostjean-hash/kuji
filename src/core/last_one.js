// Last One 보너스 상품 정보 조회 (01_spec 5.4).
// 03_architecture 3.5 시그니처: lastOnePrize(lineup).

const LAST_ONE_TIER_LABEL = "Last One";

export function lastOnePrize(lineup) {
  if (!lineup || !Array.isArray(lineup.tiers)) {
    throw new Error("[last_one] invalid lineup. expected {tiers}.");
  }
  const tier = lineup.tiers.find((t) => t.tier === LAST_ONE_TIER_LABEL);
  if (!tier) {
    throw new Error(`[last_one] lineup.tiers에 '${LAST_ONE_TIER_LABEL}' 항목이 없음.`);
  }
  return {
    tier: LAST_ONE_TIER_LABEL,
    typeIndex: 0,
    nameJa: tier.nameJa,
    nameKo: tier.nameKo,
    sizeLabel: tier.sizeLabel,
  };
}
