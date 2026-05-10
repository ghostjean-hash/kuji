// M3.5 단계 5 T6: validateLineupTierClass 검증식 룰 완화 (main = 0 허용) 단위 테스트.
// 02_data 1.4.A.3 / 03_architecture 5.18 / 04_impl_plan T6.

import { suite, test, assert, assertEq } from "../core.js";
import {
  LINEUP_DRAGONBALL,
  LINEUP_ONEPIECE,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
  validateLineupTierClass,
} from "../../src/data/numbers.js";

// gas-light fixture builder (DC 포함). 1.4.0 명세 정합 최소 형태.
function makeFixture(id, tiers) {
  return {
    id,
    tiers,
    dc: { tierClass: TIER_CLASS_HERO, prizeNameJa: "fx", prizeNameKo: "fx", winnersTotal: 1, prizeNoteKo: "" },
  };
}

const TIER_HERO = { tier: "A", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "h", nameKo: "h", sizeLabel: "" };
const TIER_MAIN = { tier: "B", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "m", nameKo: "m", sizeLabel: "" };
const TIER_GOODS = { tier: "C", count: 1, typeCount: 1, tierClass: TIER_CLASS_GOODS, nameJa: "g", nameKo: "g", sizeLabel: "" };
const TIER_LAST_ONE_HERO = { tier: "Last One", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "lh", nameKo: "lh", sizeLabel: "" };

suite("lineup_validation 룰 완화 (M3.5)", () => {
  test("드래곤볼 실 데이터 → throw 0 (변경 전과 동일)", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_DRAGONBALL);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown, "드래곤볼 라인업은 통과");
  });

  test("원피스 실 데이터 → throw 0 (M3.5 룰 완화 후 main = 0이지만 통과)", () => {
    let thrown = false;
    try {
      validateLineupTierClass(LINEUP_ONEPIECE);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown, "원피스 라인업 (M3.5 분류) 통과");
  });

  test("가상 라인업 main = 0 + hero ≥ 1 + goods ≥ 1 → throw 0 (룰 완화 정합)", () => {
    const fx = makeFixture("fx_no_main", [TIER_HERO, TIER_GOODS, TIER_LAST_ONE_HERO]);
    let thrown = false;
    try {
      validateLineupTierClass(fx);
    } catch (e) {
      thrown = true;
    }
    assert(!thrown, "main = 0 통과");
  });

  test("가상 라인업 hero = 0 → throw + 메시지 정합", () => {
    const TIER_LAST_ONE_GOODS = { ...TIER_LAST_ONE_HERO, tierClass: TIER_CLASS_GOODS };
    const fx = {
      id: "fx_no_hero",
      tiers: [TIER_MAIN, TIER_GOODS, TIER_LAST_ONE_GOODS],
      dc: { tierClass: TIER_CLASS_HERO, prizeNameJa: "fx", prizeNameKo: "fx", winnersTotal: 1, prizeNoteKo: "" },
    };
    let thrown = false;
    let message = "";
    try {
      validateLineupTierClass(fx);
    } catch (e) {
      thrown = true;
      message = e.message;
    }
    assert(thrown, "hero = 0이면 throw");
    assert(message.includes("hero"), `메시지에 hero 포함: ${message}`);
  });

  test("가상 라인업 goods = 0 → throw + 메시지 정합", () => {
    const fx = makeFixture("fx_no_goods", [TIER_HERO, TIER_MAIN, TIER_LAST_ONE_HERO]);
    let thrown = false;
    let message = "";
    try {
      validateLineupTierClass(fx);
    } catch (e) {
      thrown = true;
      message = e.message;
    }
    assert(thrown, "goods = 0이면 throw");
    assert(message.includes("goods"), `메시지에 goods 포함: ${message}`);
  });

  test("tierClass ∉ TIER_CLASS_VALUES → throw", () => {
    const TIER_INVALID = { ...TIER_HERO, tierClass: "invalid" };
    const fx = makeFixture("fx_invalid", [TIER_INVALID, TIER_GOODS, TIER_LAST_ONE_HERO]);
    let thrown = false;
    try {
      validateLineupTierClass(fx);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "tierClass invalid이면 throw");
  });

  test("DC.tierClass ∉ TIER_CLASS_VALUES → throw", () => {
    const fx = {
      id: "fx_dc_invalid",
      tiers: [TIER_HERO, TIER_GOODS, TIER_LAST_ONE_HERO],
      dc: { tierClass: "invalid", prizeNameJa: "fx", prizeNameKo: "fx", winnersTotal: 1, prizeNoteKo: "" },
    };
    let thrown = false;
    try {
      validateLineupTierClass(fx);
    } catch (e) {
      thrown = true;
    }
    assert(thrown, "DC.tierClass invalid이면 throw");
  });
});
