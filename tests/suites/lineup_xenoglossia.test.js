// M5 단계 5 T13: XENOGLOSSIA 라인업 데이터 정합 + 검증식 단위 테스트.
// 02_data 1.4-XG / 1.4.A.3 검증식 5~9 / 04_impl_plan T13.

import { suite, test, assert, assertEq } from "../core.js";
import {
  LINEUP_XENOGLOSSIA,
  LINEUP_XENOGLOSSIA_ID,
  LINEUPS,
  TIERS_XENOGLOSSIA,
  validateLineupTierClass,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
} from "../../src/data/numbers.js";

suite("lineup_xenoglossia (M5) - 메타 정합", () => {
  test("LINEUP_XENOGLOSSIA_ID = 'kotobukiya_xenoglossia_2026_04'", () => {
    assertEq(LINEUP_XENOGLOSSIA_ID, "kotobukiya_xenoglossia_2026_04");
  });

  test("boxSize = 100 + tier sum 일치", () => {
    assertEq(LINEUP_XENOGLOSSIA.boxSize, 100);
    const sum = TIERS_XENOGLOSSIA.reduce((a, t) => a + t.count, 0);
    assertEq(sum, 100, "tier count 합 = boxSize");
  });

  test("등급 5종 (S/A/B/C/D) 모두 존재", () => {
    const labels = TIERS_XENOGLOSSIA.map((t) => t.tier);
    for (const label of ["S", "A", "B", "C", "D"]) {
      assert(labels.includes(label), `${label} 존재`);
    }
  });

  test("Last One 항목 부재 (lastOneEnabled=false 정합)", () => {
    const hasLastOne = TIERS_XENOGLOSSIA.some((t) => t.tier === "Last One");
    assert(!hasLastOne, "Last One 부재");
  });
});

suite("lineup_xenoglossia (M5) - 메커닉 플래그", () => {
  test("lastOneEnabled = false", () => {
    assertEq(LINEUP_XENOGLOSSIA.lastOneEnabled, false);
  });
  test("dcEnabled = false", () => {
    assertEq(LINEUP_XENOGLOSSIA.dcEnabled, false);
  });
  test("ceilingEnabled = true", () => {
    assertEq(LINEUP_XENOGLOSSIA.ceilingEnabled, true);
  });
  test("ceilingPurchaseSize = 30 / ceilingTier = 'S'", () => {
    assertEq(LINEUP_XENOGLOSSIA.ceilingPurchaseSize, 30);
    assertEq(LINEUP_XENOGLOSSIA.ceilingTier, "S");
  });
  test("dc 필드 부재 (dcEnabled=false 정합, 검증식 7)", () => {
    assertEq(LINEUP_XENOGLOSSIA.dc, undefined);
  });
});

suite("lineup_xenoglossia (M5) - tier_class 분류", () => {
  test("S = hero", () => {
    const s = TIERS_XENOGLOSSIA.find((t) => t.tier === "S");
    assertEq(s.tierClass, TIER_CLASS_HERO);
  });
  test("A = hero (대형 클리어 포스터)", () => {
    const a = TIERS_XENOGLOSSIA.find((t) => t.tier === "A");
    assertEq(a.tierClass, TIER_CLASS_HERO);
  });
  test("B = main", () => {
    const b = TIERS_XENOGLOSSIA.find((t) => t.tier === "B");
    assertEq(b.tierClass, TIER_CLASS_MAIN);
  });
  test("C = main", () => {
    const c = TIERS_XENOGLOSSIA.find((t) => t.tier === "C");
    assertEq(c.tierClass, TIER_CLASS_MAIN);
  });
  test("D = goods", () => {
    const d = TIERS_XENOGLOSSIA.find((t) => t.tier === "D");
    assertEq(d.tierClass, TIER_CLASS_GOODS);
  });
});

suite("lineup_xenoglossia (M5) - LINEUPS 배열 정합", () => {
  test("LINEUPS.length = 3 (M5 = 3건)", () => {
    assertEq(LINEUPS.length, 3);
  });
  test("LINEUPS에 XENOGLOSSIA 포함", () => {
    const found = LINEUPS.find((l) => l.id === LINEUP_XENOGLOSSIA_ID);
    assert(found, "포함");
  });
});

suite("lineup_xenoglossia (M5) - 검증식 통과", () => {
  test("validateLineupTierClass 통과 (throw 0건)", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_XENOGLOSSIA);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown, "throw 없음");
  });
});
