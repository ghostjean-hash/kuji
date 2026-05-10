// M3.2 단계 5 T6: getTierClassForTier(lineup, tier) 헬퍼 + hero 분기 식 단위 테스트.
// 02_data 1.4.A.5 + 03_architecture 5.16 + 04_impl_plan T6.

import { suite, test, assert, assertEq } from "../core.js";
import {
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
  getTierClassForTier,
} from "../../src/data/numbers.js";

suite("tier_class_lookup (M3.2)", () => {
  test("getTierClassForTier(드래곤볼, A) = hero", () => {
    assertEq(getTierClassForTier(LINEUP_DRAGONBALL, "A"), TIER_CLASS_HERO);
  });

  test("getTierClassForTier(드래곤볼, Last One) = hero", () => {
    assertEq(getTierClassForTier(LINEUP_DRAGONBALL, "Last One"), TIER_CLASS_HERO);
  });

  test("getTierClassForTier(드래곤볼, B-F) = main 5건", () => {
    for (const t of ["B", "C", "D", "E", "F"]) {
      assertEq(getTierClassForTier(LINEUP_DRAGONBALL, t), TIER_CLASS_MAIN, `DB ${t}`);
    }
  });

  test("getTierClassForTier(드래곤볼, G-J) = goods 4건", () => {
    for (const t of ["G", "H", "I", "J"]) {
      assertEq(getTierClassForTier(LINEUP_DRAGONBALL, t), TIER_CLASS_GOODS, `DB ${t}`);
    }
  });

  test("getTierClassForTier(원피스, A) = hero", () => {
    assertEq(getTierClassForTier(LINEUP_ONEPIECE, "A"), TIER_CLASS_HERO);
  });

  test("getTierClassForTier(원피스, Last One) = hero", () => {
    assertEq(getTierClassForTier(LINEUP_ONEPIECE, "Last One"), TIER_CLASS_HERO);
  });

  test("getTierClassForTier(원피스, B-F) = hero 5건 (M3.5 갱신)", () => {
    for (const t of ["B", "C", "D", "E", "F"]) {
      assertEq(getTierClassForTier(LINEUP_ONEPIECE, t), TIER_CLASS_HERO, `OP ${t}`);
    }
  });

  test("getTierClassForTier(원피스, G-I) = goods 3건", () => {
    for (const t of ["G", "H", "I"]) {
      assertEq(getTierClassForTier(LINEUP_ONEPIECE, t), TIER_CLASS_GOODS, `OP ${t}`);
    }
  });

  test("getTierClassForTier 미존재 tier → null", () => {
    assertEq(getTierClassForTier(LINEUP_DRAGONBALL, "Z"), null);
    assertEq(getTierClassForTier(LINEUP_ONEPIECE, "J"), null);  // 원피스에 J 등급 없음
  });

  test("getTierClassForTier 결정론 (동일 입력 → 동일 출력)", () => {
    const a1 = getTierClassForTier(LINEUP_DRAGONBALL, "A");
    const a2 = getTierClassForTier(LINEUP_DRAGONBALL, "A");
    assertEq(a1, a2);
  });
});

// hero 분기 식 시뮬레이션 (spec 5.13.C.3.1)
function isHeroResult(lineup, result) {
  if (result.isLastOne === true) return true;
  return getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO;
}

suite("tier_class_lookup hero 분기 식 (M3.2 spec 5.13.C.3.1)", () => {
  test("isLastOne=true → hero (Last One redundant)", () => {
    const result = { tier: "G", isLastOne: true };  // tier가 G여도 isLastOne true면 hero
    assert(isHeroResult(LINEUP_DRAGONBALL, result));
  });

  test("tier=A + isLastOne=false → hero (tierClass)", () => {
    const result = { tier: "A", isLastOne: false };
    assert(isHeroResult(LINEUP_DRAGONBALL, result));
  });

  test("tier=Last One + isLastOne=true → hero (둘 다 만족)", () => {
    const result = { tier: "Last One", isLastOne: true };
    assert(isHeroResult(LINEUP_DRAGONBALL, result));
  });

  test("tier=B + isLastOne=false → main (hero 아님)", () => {
    const result = { tier: "B", isLastOne: false };
    assert(!isHeroResult(LINEUP_DRAGONBALL, result));
  });

  test("tier=G + isLastOne=false → goods (hero 아님)", () => {
    const result = { tier: "G", isLastOne: false };
    assert(!isHeroResult(LINEUP_DRAGONBALL, result));
  });

  test("원피스 tier=A → hero (魂豪示像)", () => {
    const result = { tier: "A", isLastOne: false };
    assert(isHeroResult(LINEUP_ONEPIECE, result));
  });

  test("원피스 tier=B-F → hero 5건 (M3.5 갱신)", () => {
    for (const t of ["B", "C", "D", "E", "F"]) {
      const result = { tier: t, isLastOne: false };
      assert(isHeroResult(LINEUP_ONEPIECE, result), `OP ${t} hero 분기`);
    }
  });

  test("원피스 tier=H → goods (아크릴 마그넷)", () => {
    const result = { tier: "H", isLastOne: false };
    assert(!isHeroResult(LINEUP_ONEPIECE, result));
  });
});
