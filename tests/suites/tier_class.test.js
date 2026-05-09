// M3.1: tier_class 분류 + 검증식 + lobby-preview 단위 테스트.
// 02_data 1.4.A / 03_architecture 5.14 / 3.22 / 04_impl_plan T7.

import { suite, test, assert, assertEq } from "../core.js";
import {
  LINEUPS,
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
  TIER_CLASS_VALUES,
} from "../../src/data/numbers.js";
import { heroPreview } from "../../src/core/lobby-preview.js";

suite("tier_class (M3.1)", () => {
  test("TIER_CLASS_VALUES = [hero, main, goods] 3종", () => {
    assertEq(TIER_CLASS_VALUES.length, 3);
    assert(TIER_CLASS_VALUES.includes(TIER_CLASS_HERO));
    assert(TIER_CLASS_VALUES.includes(TIER_CLASS_MAIN));
    assert(TIER_CLASS_VALUES.includes(TIER_CLASS_GOODS));
  });

  test("모든 라인업의 모든 tier에 tierClass 존재 + TIER_CLASS_VALUES 안에 있음", () => {
    for (const lineup of LINEUPS) {
      for (const t of lineup.tiers) {
        assert(TIER_CLASS_VALUES.includes(t.tierClass), `lineup ${lineup.id} tier ${t.tier} tierClass invalid: ${t.tierClass}`);
      }
    }
  });

  test("DC.tierClass = hero (모든 라인업)", () => {
    for (const lineup of LINEUPS) {
      assertEq(lineup.dc.tierClass, TIER_CLASS_HERO, `lineup ${lineup.id} dc.tierClass`);
    }
  });

  test("라인업당 hero / main / goods 각 ≥ 1 정합 (1.4.A.3)", () => {
    for (const lineup of LINEUPS) {
      for (const required of TIER_CLASS_VALUES) {
        const hasOne = lineup.tiers.some((t) => t.tierClass === required);
        assert(hasOne, `lineup ${lineup.id} tierClass ${required} 부재`);
      }
    }
  });

  test("드래곤볼 분류: A,LastOne=hero / B-F=main / G-J=goods", () => {
    const tiers = LINEUP_DRAGONBALL.tiers;
    const find = (t) => tiers.find((x) => x.tier === t);
    assertEq(find("A").tierClass, TIER_CLASS_HERO);
    assertEq(find("Last One").tierClass, TIER_CLASS_HERO);
    for (const t of ["B", "C", "D", "E", "F"]) {
      assertEq(find(t).tierClass, TIER_CLASS_MAIN, `DB ${t}`);
    }
    for (const t of ["G", "H", "I", "J"]) {
      assertEq(find(t).tierClass, TIER_CLASS_GOODS, `DB ${t}`);
    }
  });

  test("원피스 분류: A,LastOne=hero / B-F=main / G-I=goods", () => {
    const tiers = LINEUP_ONEPIECE.tiers;
    const find = (t) => tiers.find((x) => x.tier === t);
    assertEq(find("A").tierClass, TIER_CLASS_HERO);
    assertEq(find("Last One").tierClass, TIER_CLASS_HERO);
    for (const t of ["B", "C", "D", "E", "F"]) {
      assertEq(find(t).tierClass, TIER_CLASS_MAIN, `OP ${t}`);
    }
    for (const t of ["G", "H", "I"]) {
      assertEq(find(t).tierClass, TIER_CLASS_GOODS, `OP ${t}`);
    }
  });

  test("lobbyHeroAssetPath 정의됨 (모든 라인업)", () => {
    for (const lineup of LINEUPS) {
      assert(typeof lineup.lobbyHeroAssetPath === "string" && lineup.lobbyHeroAssetPath.length > 0,
        `lineup ${lineup.id} lobbyHeroAssetPath 부재`);
    }
  });
});

suite("lobby-preview (M3.1)", () => {
  test("heroPreview(드래곤볼) = A상", () => {
    const p = heroPreview(LINEUP_DRAGONBALL);
    assert(p !== null);
    assertEq(p.tier, "A");
    assertEq(p.tierClass, TIER_CLASS_HERO);
    assertEq(p.typeIndex, 0);
    assertEq(p.nameKo, "손오공 MASTERLISE");
  });

  test("heroPreview(원피스) = A상 (魂豪示像)", () => {
    const p = heroPreview(LINEUP_ONEPIECE);
    assert(p !== null);
    assertEq(p.tier, "A");
    assertEq(p.tierClass, TIER_CLASS_HERO);
    assertEq(p.typeIndex, 0);
    assertEq(p.nameKo, "몽키 D 루피 영혼호시상");
  });

  test("heroPreview는 Last One 제외 (박스 등급 첫 hero 채택)", () => {
    const p = heroPreview(LINEUP_DRAGONBALL);
    assert(p.tier !== "Last One", "Last One은 미리보기에서 제외");
  });

  test("heroPreview 결정론 (동일 입력 → 동일 출력)", () => {
    const p1 = heroPreview(LINEUP_DRAGONBALL);
    const p2 = heroPreview(LINEUP_DRAGONBALL);
    assertEq(p1.tier, p2.tier);
    assertEq(p1.nameKo, p2.nameKo);
  });

  test("heroPreview 빈 hero 배열 (가설) → null 반환", () => {
    // 1.4.A.3 검증식 위반은 numbers.js 부팅 시 throw하므로 실제 런타임 도달 불가.
    // 본 테스트는 함수 자체의 가드 정합 확인.
    const fakeLineup = { tiers: [] };
    const p = heroPreview(fakeLineup);
    assertEq(p, null);
  });
});
