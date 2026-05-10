// M3.3 단계 5 T6: core/history.tierClassCounts 단위 테스트.
// 02_data 1.4.A.5 / 5.13.D.3 / 04_impl_plan T6.

import { suite, test, assert, assertEq } from "../core.js";
import { tierClassCounts } from "../../src/core/history.js";
import {
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
} from "../../src/data/numbers.js";

suite("tier_class_counts (M3.3)", () => {
  test("빈 history → 0/0/0/0", () => {
    const counts = tierClassCounts([], LINEUP_DRAGONBALL);
    assertEq(counts[TIER_CLASS_HERO], 0);
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 0);
    assertEq(counts.total, 0);
  });

  test("드래곤볼 (A 1매 + G 3매 + Last One 1매) → hero=2 / main=0 / goods=3 / total=5", () => {
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "G", isLastOne: false },
      { tier: "G", isLastOne: false },
      { tier: "G", isLastOne: false },
      { tier: "Last One", isLastOne: true },
    ];
    const counts = tierClassCounts(history, LINEUP_DRAGONBALL);
    assertEq(counts[TIER_CLASS_HERO], 2);  // A + Last One
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 3);  // G x 3
    assertEq(counts.total, 5);
  });

  test("원피스 (A 1매 + B 2매 + I 5매) → hero=3 / main=0 / goods=5 / total=8 (M3.5 갱신)", () => {
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "B", isLastOne: false },
      { tier: "B", isLastOne: false },
      { tier: "I", isLastOne: false },
      { tier: "I", isLastOne: false },
      { tier: "I", isLastOne: false },
      { tier: "I", isLastOne: false },
      { tier: "I", isLastOne: false },
    ];
    const counts = tierClassCounts(history, LINEUP_ONEPIECE);
    assertEq(counts[TIER_CLASS_HERO], 3);  // M3.5: A + B 2매 = 3
    assertEq(counts[TIER_CLASS_MAIN], 0);  // M3.5: main = 0 (B는 hero로 변경)
    assertEq(counts[TIER_CLASS_GOODS], 5);  // I x 5
    assertEq(counts.total, 8);
  });

  test("원피스 (A 1매 + F 6매 + Last One 1매) → hero=8 / main=0 / goods=0 / total=8 (M3.5 갱신)", () => {
    // F가 hero로 변경되므로 모든 entry가 hero. main = 0.
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "F", isLastOne: false },
      { tier: "Last One", isLastOne: true },
    ];
    const counts = tierClassCounts(history, LINEUP_ONEPIECE);
    assertEq(counts[TIER_CLASS_HERO], 8);  // M3.5: A + F 6매 + Last One = 8
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 0);
    assertEq(counts.total, 8);
  });

  test("미존재 tier (라인업 변경 잔존 entry) → tierClass=null로 카운트 미반영, total은 카운트", () => {
    // 원피스에 J 등급 없음 → tierClass=null
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "J", isLastOne: false },  // 원피스에 J 없음
    ];
    const counts = tierClassCounts(history, LINEUP_ONEPIECE);
    assertEq(counts[TIER_CLASS_HERO], 1);
    assertEq(counts[TIER_CLASS_MAIN], 0);
    assertEq(counts[TIER_CLASS_GOODS], 0);
    assertEq(counts.total, 2);  // total은 모든 entry 합산
  });

  test("결정론 (동일 입력 → 동일 출력)", () => {
    const history = [
      { tier: "A", isLastOne: false },
      { tier: "G", isLastOne: false },
    ];
    const c1 = tierClassCounts(history, LINEUP_DRAGONBALL);
    const c2 = tierClassCounts(history, LINEUP_DRAGONBALL);
    assertEq(c1[TIER_CLASS_HERO], c2[TIER_CLASS_HERO]);
    assertEq(c1.total, c2.total);
  });

  test("lineup 부재 시 throw", () => {
    let thrown = false;
    try {
      tierClassCounts([], null);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "lineup null이면 throw");
  });
});
