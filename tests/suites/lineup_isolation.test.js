// M3 단계 5 T21: 라인업 격리 + 등급 수 가변성 단위 테스트.
// 03_architecture 5.10 / 5.11 / 5.12 정합.

import { suite, test, assert, assertEq } from "../core.js";
import { initBox } from "../../src/core/box.js";
import { boxId } from "../../src/core/hash.js";
import { tierCounts } from "../../src/core/history.js";
import { LINEUP_DRAGONBALL, LINEUP_ONEPIECE, LINEUPS, LINEUP_DEFAULT_ID, getLineupById } from "../../src/data/numbers.js";

suite("lineup_isolation (M3)", () => {
  test("box.id: 동일 시드 + 동일 회차 + 다른 라인업 → 다른 box.id (P0 2.1 정합)", () => {
    const id_db = boxId(42, 1, LINEUP_DRAGONBALL.id);
    const id_op = boxId(42, 1, LINEUP_ONEPIECE.id);
    assert(id_db !== id_op, `다른 라인업 → 다른 box.id (db=${id_db}, op=${id_op})`);
  });

  test("box.id: 동일 시드 + 동일 회차 + 동일 라인업 → 동일 box.id (결정론)", () => {
    const a = boxId(42, 1, LINEUP_DRAGONBALL.id);
    const b = boxId(42, 1, LINEUP_DRAGONBALL.id);
    assertEq(a, b);
  });

  test("initBox: 라인업별 다른 deck (드래곤볼 10등급 vs 원피스 9등급)", () => {
    const db = initBox(42, 1, LINEUP_DRAGONBALL);
    const op = initBox(42, 1, LINEUP_ONEPIECE);
    // deck 길이 = boxSize - 1
    assertEq(db.deck.length, LINEUP_DRAGONBALL.boxSize - 1);
    assertEq(op.deck.length, LINEUP_ONEPIECE.boxSize - 1);
    // box.id 다름
    assert(db.id !== op.id, "box.id가 라인업별 다름");
  });

  test("tierCounts(history, lineup): 라인업별 등급 수 가변성", () => {
    // 드래곤볼은 11등급 (A~J + Last One), 원피스는 10등급 (A~I + Last One)
    const dbCounts = tierCounts([], LINEUP_DRAGONBALL);
    const opCounts = tierCounts([], LINEUP_ONEPIECE);
    assertEq(Object.keys(dbCounts).length, LINEUP_DRAGONBALL.tiers.length);
    assertEq(Object.keys(opCounts).length, LINEUP_ONEPIECE.tiers.length);
    // 드래곤볼에는 J 있음, 원피스에는 J 없음
    assert("J" in dbCounts, "드래곤볼 J 등급 존재");
    assert(!("J" in opCounts), "원피스 J 등급 부재");
  });

  test("tierCounts: history 항목이 lineup 등급에 매핑됨", () => {
    const history = [
      { tier: "A", isLastOne: false, revealed: true },
      { tier: "B", isLastOne: false, revealed: true },
      { tier: "I", isLastOne: false, revealed: true },
      { tier: "J", isLastOne: false, revealed: true },  // 원피스에는 J 없음
    ];
    const dbCounts = tierCounts(history, LINEUP_DRAGONBALL);
    const opCounts = tierCounts(history, LINEUP_ONEPIECE);
    assertEq(dbCounts["J"], 1);  // 드래곤볼 J 카운트
    assertEq(opCounts["I"], 1);  // 원피스 I 카운트
    // 원피스는 J 키가 없으니 "J" 항목 자체 부재
    assert(!("J" in opCounts), "원피스 J 미존재");
  });

  test("tierCounts: revealed === false 안전장치 (B-α)", () => {
    const history = [
      { tier: "A", isLastOne: false, revealed: false },  // 미공개
      { tier: "A", isLastOne: false, revealed: true },
    ];
    const counts = tierCounts(history, LINEUP_DRAGONBALL);
    assertEq(counts["A"], 1);  // revealed: false 항목 제외
  });

  test("tierCounts: lineup.tiers 누락 시 throw", () => {
    let threw = false;
    try {
      tierCounts([], null);
    } catch (e) {
      threw = true;
    }
    assert(threw, "lineup 누락 시 throw");
  });

  test("LINEUPS 배열에 드래곤볼 + 원피스 2개 포함", () => {
    assertEq(LINEUPS.length, 2);
    assert(LINEUPS.some((l) => l.id === LINEUP_DRAGONBALL.id), "드래곤볼 포함");
    assert(LINEUPS.some((l) => l.id === LINEUP_ONEPIECE.id), "원피스 포함");
  });

  test("getLineupById: 정상 ID → 해당 lineup 반환", () => {
    const db = getLineupById(LINEUP_DRAGONBALL.id);
    assertEq(db.id, LINEUP_DRAGONBALL.id);
    const op = getLineupById(LINEUP_ONEPIECE.id);
    assertEq(op.id, LINEUP_ONEPIECE.id);
  });

  test("getLineupById: 미발견 ID → LINEUP_DEFAULT 반환 (spec 7.16.1)", () => {
    const fallback = getLineupById("unknown_lineup_xyz");
    assertEq(fallback.id, LINEUP_DEFAULT_ID);
  });

  test("getLineupById: undefined / null → LINEUP_DEFAULT", () => {
    assertEq(getLineupById(undefined).id, LINEUP_DEFAULT_ID);
    assertEq(getLineupById(null).id, LINEUP_DEFAULT_ID);
  });

  test("DC winnersTotal 라인업별 차이 (드래곤볼 50 vs 원피스 100)", () => {
    assertEq(LINEUP_DRAGONBALL.dc.winnersTotal, 50);
    assertEq(LINEUP_ONEPIECE.dc.winnersTotal, 100);
  });

  test("매수 합계 검증식: 양 라인업 모두 boxSize 정합", () => {
    const dbSum = LINEUP_DRAGONBALL.tiers.reduce((acc, t) => acc + t.count, 0);
    const opSum = LINEUP_ONEPIECE.tiers.reduce((acc, t) => acc + t.count, 0);
    assertEq(dbSum, LINEUP_DRAGONBALL.boxSize);
    assertEq(opSum, LINEUP_ONEPIECE.boxSize);
  });
});
