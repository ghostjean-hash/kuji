// M4 단계 5 T12: 갤러리+기록 통합 탭 sub-section 4종 정합 단위 테스트.
// spec 5.13.F / 03_architecture 5.19 / 04_impl_plan T12.
// DOM 의존이라 정적 grep 단위 (헬퍼 import + 시그니처 / sub-section 클래스명 정합 검증).

import { suite, test, assert, assertEq } from "../core.js";
import { tierClassCounts } from "../../src/core/history.js";
import {
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
  TIER_CLASS_LABEL_KO,
} from "../../src/data/numbers.js";

suite("products_history_layout (M4) - sub-section 1 dashboard", () => {
  test("빈 history → 4 카운터 모두 0", () => {
    const counts = tierClassCounts([], LINEUP_DRAGONBALL);
    assertEq(counts.total, 0);
    assertEq(counts[TIER_CLASS_HERO], 0);
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 0);
  });

  test("드래곤볼 history (A 1 + G 2) → hero=1 / main=0 / goods=2 / total=3", () => {
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "G", isLastOne: false },
      { tier: "G", isLastOne: false },
    ];
    const counts = tierClassCounts(history, LINEUP_DRAGONBALL);
    assertEq(counts[TIER_CLASS_HERO], 1);
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 2);
    assertEq(counts.total, 3);
  });

  test("원피스 history (A 1 + B 1 + I 1) → M3.5 분류 (B=hero) → hero=2 / goods=1", () => {
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "B", isLastOne: false },
      { tier: "I", isLastOne: false },
    ];
    const counts = tierClassCounts(history, LINEUP_ONEPIECE);
    assertEq(counts[TIER_CLASS_HERO], 2);  // M3.5: A+B 모두 hero
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 1);
    assertEq(counts.total, 3);
  });
});

suite("products_history_layout (M4) - 라벨 정합", () => {
  test("TIER_CLASS_LABEL_KO 한국어 라벨 (대시보드 카운터 라벨)", () => {
    assertEq(TIER_CLASS_LABEL_KO[TIER_CLASS_HERO], "메인 등급");
    assertEq(TIER_CLASS_LABEL_KO[TIER_CLASS_MAIN], "표준 등급");
    assertEq(TIER_CLASS_LABEL_KO[TIER_CLASS_GOODS], "굿즈");
  });
});
