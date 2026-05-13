// M5 단계 5 T12: 천장 룰 (drawWithCeiling) 단위 테스트.
// spec 5.13.G / 02_data 1.4-XG.4 / arch 3.6.M5 / 04_impl_plan T12.

import { suite, test, assert, assertEq } from "../core.js";
import { initBox } from "../../src/core/box.js";
import { drawWithCeiling, isCeilingApplicable } from "../../src/core/ceiling.js";
import { createRng } from "../../src/core/random.js";
import { fnv1a } from "../../src/core/hash.js";
import {
  LINEUP_XENOGLOSSIA,
  LINEUP_DRAGONBALL,
  LAST_ONE_TIER_NAME,
} from "../../src/data/numbers.js";

const TEST_SEED = 0xC0FFEE;

suite("ceiling (M5) - drawWithCeiling 활성 조건", () => {
  test("XENOGLOSSIA 30연 → S 1매 보장 + 일반 29매", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const drawRng = createRng(fnv1a(`${TEST_SEED}|1|0|ceiling`));
    const results = drawWithCeiling(boxState, drawRng, LINEUP_XENOGLOSSIA, 30);
    assertEq(results.length, 30, "30매 결과");
    assertEq(results[0].tier, "S", "첫 결과 = S賞 보장 (인덱스 0)");
    // 잔여 29매 = 통상 (S일 수도 있음, deck 잔여에 S 존재 시)
    let sCount = 0;
    for (const r of results) if (r.tier === "S") sCount += 1;
    assert(sCount >= 1, "S 최소 1매 (보장)");
  });

  test("XENOGLOSSIA 30연 후 boxState.deck = 100-30 = 70 잔여", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const drawRng = createRng(fnv1a(`${TEST_SEED}|1|0|ceiling`));
    drawWithCeiling(boxState, drawRng, LINEUP_XENOGLOSSIA, 30);
    assertEq(boxState.deck.length, 70, "deck 잔여 70 (100-30)");
    assertEq(boxState.drawnCount, 30, "drawnCount 30");
  });

  test("드래곤볼 30연 (ceilingEnabled=false) → 일반 fallback (S 보장 0)", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_DRAGONBALL);
    const drawRng = createRng(fnv1a(`${TEST_SEED}|1|0|ceiling`));
    const results = drawWithCeiling(boxState, drawRng, LINEUP_DRAGONBALL, 30);
    assertEq(results.length, 30, "30매 결과 (fallback)");
    // 드래곤볼은 S 등급 부재 = 결과 모두 A~J / Last One. S 등장 0.
    let sCount = 0;
    for (const r of results) if (r.tier === "S") sCount += 1;
    assertEq(sCount, 0, "드래곤볼 = S 등급 부재 (보장 0)");
  });

  test("XENOGLOSSIA count !== 30 (예: 10연) → fallback (S 비보장)", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const drawRng = createRng(fnv1a(`${TEST_SEED}|1|0|ten`));
    const results = drawWithCeiling(boxState, drawRng, LINEUP_XENOGLOSSIA, 10);
    assertEq(results.length, 10, "10매 결과 (fallback)");
    // S 보장 X. 우연히 등장 가능.
  });
});

suite("ceiling (M5) - isCeilingApplicable", () => {
  test("XENOGLOSSIA 빈 박스 + count=30 → true", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    assert(isCeilingApplicable(boxState, LINEUP_XENOGLOSSIA, 30), "활성");
  });

  test("XENOGLOSSIA count !== 30 → false", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    assert(!isCeilingApplicable(boxState, LINEUP_XENOGLOSSIA, 10), "비활성");
  });

  test("드래곤볼 (ceilingEnabled=false) → 항상 false", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_DRAGONBALL);
    assert(!isCeilingApplicable(boxState, LINEUP_DRAGONBALL, 30), "비활성");
  });

  test("XENOGLOSSIA deck 잔여 < 30 → false", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    // 박스 deck 71매 소비 → 잔여 29매
    boxState.deck = boxState.deck.slice(71);
    assert(!isCeilingApplicable(boxState, LINEUP_XENOGLOSSIA, 30), "deck 부족");
  });
});

suite("ceiling (M5) - 결정론 + 비복원 모델 정합", () => {
  test("동일 시드 + 동일 라인업 + 동일 count = 동일 결과 (결정론)", () => {
    const box1 = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const rng1 = createRng(fnv1a(`${TEST_SEED}|1|0|ceiling`));
    const r1 = drawWithCeiling(box1, rng1, LINEUP_XENOGLOSSIA, 30);

    const box2 = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const rng2 = createRng(fnv1a(`${TEST_SEED}|1|0|ceiling`));
    const r2 = drawWithCeiling(box2, rng2, LINEUP_XENOGLOSSIA, 30);

    assertEq(r1.length, r2.length);
    for (let i = 0; i < r1.length; i++) {
      assertEq(r1[i].tier, r2[i].tier, `idx ${i} 동일 tier`);
    }
  });
});
