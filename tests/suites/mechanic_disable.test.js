// M5 단계 5 T14: 라인업별 메커닉 enabled 분기 단위 테스트.
// spec 5.4.6 / 5.5.7 / 1.4.A.3 검증식 5~9 / 04_impl_plan T14.

import { suite, test, assert, assertEq } from "../core.js";
import { initBox } from "../../src/core/box.js";
import { drawOne } from "../../src/core/draw.js";
import { lastOnePrize } from "../../src/core/last_one.js";
import { createRng } from "../../src/core/random.js";
import { fnv1a } from "../../src/core/hash.js";
import {
  LINEUP_XENOGLOSSIA,
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  validateLineupTierClass,
  TIER_CLASS_HERO,
  TIER_CLASS_GOODS,
} from "../../src/data/numbers.js";

const TEST_SEED = 0xABC123;

suite("mechanic_disable (M5) - lastOneEnabled=false 분기", () => {
  test("XENOGLOSSIA lastOnePrize 호출 시 throw", () => {
    let thrown = false;
    try {
      lastOnePrize(LINEUP_XENOGLOSSIA);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "lastOneEnabled=false 시 throw");
  });

  test("XENOGLOSSIA 박스 마지막 매 추첨 시 isLastOne = false (Last One 미적용)", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_XENOGLOSSIA);
    const totalDraws = LINEUP_XENOGLOSSIA.boxSize;  // 100
    let lastResult;
    for (let i = 0; i < totalDraws; i++) {
      const rng = createRng(fnv1a(`${TEST_SEED}|1|${i}`));
      lastResult = drawOne(boxState, rng, LINEUP_XENOGLOSSIA);
    }
    assertEq(lastResult.isLastOne, false, "XENOGLOSSIA = Last One 미적용");
    assertEq(lastResult.lastOnePrize, undefined, "lastOnePrize 필드 부재");
  });

  test("드래곤볼 박스 마지막 매 추첨 시 isLastOne = true (M3 답습)", () => {
    const boxState = initBox(TEST_SEED, 1, LINEUP_DRAGONBALL);
    const totalDraws = LINEUP_DRAGONBALL.boxSize - 1;  // 79 (Last One 1매 제외)
    let lastResult;
    for (let i = 0; i < totalDraws; i++) {
      const rng = createRng(fnv1a(`${TEST_SEED}|1|${i}`));
      lastResult = drawOne(boxState, rng, LINEUP_DRAGONBALL);
    }
    assertEq(lastResult.isLastOne, true, "드래곤볼 = Last One 활성");
    assert(lastResult.lastOnePrize, "lastOnePrize 객체 존재");
  });
});

suite("mechanic_disable (M5) - 검증식 5/6 (lastOneEnabled ↔ tiers)", () => {
  test("lastOneEnabled=true + Last One 항목 부재 → throw", () => {
    const fake = {
      ...LINEUP_DRAGONBALL,
      tiers: LINEUP_DRAGONBALL.tiers.filter((t) => t.tier !== "Last One"),
    };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 5 위반 throw");
  });

  test("lastOneEnabled=false + Last One 항목 존재 → throw", () => {
    const fake = {
      ...LINEUP_XENOGLOSSIA,
      tiers: [
        ...LINEUP_XENOGLOSSIA.tiers,
        { tier: "Last One", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "x", nameKo: "x", sizeLabel: "" },
      ],
    };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 6 위반 throw");
  });
});

suite("mechanic_disable (M5) - 검증식 7 (dcEnabled=false 시 dc 부재 허용)", () => {
  test("XENOGLOSSIA (dcEnabled=false + dc 부재) 검증식 통과", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_XENOGLOSSIA);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown, "throw 없음");
  });

  test("dcEnabled=true + dc 객체 부재 → throw", () => {
    const fake = { ...LINEUP_DRAGONBALL, dc: undefined };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 2 위반 throw");
  });
});

suite("mechanic_disable (M5) - 검증식 8 (ceilingEnabled=true 정합)", () => {
  test("ceilingEnabled=true + ceilingPurchaseSize 미정의 → throw", () => {
    const fake = { ...LINEUP_XENOGLOSSIA, ceilingPurchaseSize: undefined };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 8 위반 throw");
  });

  test("ceilingEnabled=true + ceilingTier 미존재 in tiers → throw", () => {
    const fake = { ...LINEUP_XENOGLOSSIA, ceilingTier: "X" };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 8 위반 throw");
  });

  test("ceilingPurchaseSize > boxSize → throw", () => {
    const fake = { ...LINEUP_XENOGLOSSIA, ceilingPurchaseSize: 999 };
    let thrown = false;
    try {
      validateLineupTierClass(fake);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "검증식 8 위반 throw");
  });
});

suite("mechanic_disable (M5) - 기존 라인업 회귀", () => {
  test("드래곤볼 validateLineupTierClass 통과 (변경 0)", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_DRAGONBALL);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown);
  });

  test("원피스 validateLineupTierClass 통과 (변경 0)", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_ONEPIECE);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown);
  });
});
