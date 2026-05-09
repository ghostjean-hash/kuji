// 라인업 메인 상품 미리보기 도메인 로직 (M3.1 신설).
// 03_architecture 3.22 / spec 5.13.B.4.3 정합.
// CLAUDE.md 4.1 정합 (게임 로직 / 렌더 분리). DOM 의존성 0건.
// lineup 인자만으로 결정론적 도출.

import { TIER_CLASS_HERO } from "../data/numbers.js";

// 라인업 대표 hero 등급 첫 항목 반환.
// Last One은 hero이지만 미리보기 슬롯에서는 박스 등급 첫 hero를 라인업 대표로 채택.
//
// 입력: lineup 객체 (tiers 배열 보유).
// 출력: { tier, count, typeCount, tierClass, nameJa, nameKo, sizeLabel, typeIndex } | null
//   typeIndex = 0 (종별 자산 ID 산출용. typeCount ≥ 2여도 첫 종 채택).
//   null = 1.4.A.3 검증식 위반 (numbers.js 부팅 검증식이 throw하므로 런타임 도달 불가).
export function heroPreview(lineup) {
  const heroTiers = lineup.tiers.filter(
    (t) => t.tierClass === TIER_CLASS_HERO && t.tier !== "Last One",
  );
  if (heroTiers.length === 0) return null;
  return { ...heroTiers[0], typeIndex: 0 };
}
