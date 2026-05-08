import { suite, test, assertEq } from "../core.js";
import { appendHistory, tierCounts } from "../../src/core/history.js";
// M2.1 B-α: findUnrevealed / revealHistory 폐기 (history는 reveal 시점에만 append).
// M3 단계 5 T7: tierCounts(history, lineup) 시그니처. 라인업별 등급 수 가변성 흡수.
import { LINEUP_DRAGONBALL as LINEUP } from "../../src/data/numbers.js";

suite("history", () => {
  test("appendHistory 누적 (불변)", () => {
    let h = [];
    h = appendHistory(h, { tier: "A", typeIndex: 0, isLastOne: false });
    h = appendHistory(h, { tier: "B", typeIndex: 0, isLastOne: false });
    assertEq(h.length, 2);
    assertEq(h[0].tier, "A");
    assertEq(h[1].tier, "B");
  });
  test("tierCounts 일반 등급 누적", () => {
    const h = [
      { tier: "A", typeIndex: 0, isLastOne: false },
      { tier: "G", typeIndex: 3, isLastOne: false },
      { tier: "G", typeIndex: 1, isLastOne: false },
    ];
    const c = tierCounts(h, LINEUP);
    assertEq(c["A"], 1);
    assertEq(c["G"], 2);
    assertEq(c["Last One"], 0);
  });
  test("isLastOne 항목은 메인 등급 + Last One 둘 다 카운트", () => {
    const h = [
      { tier: "A", typeIndex: 0, isLastOne: false },
      { tier: "G", typeIndex: 1, isLastOne: true },  // 마지막 deck pop + Last One 동시
    ];
    const c = tierCounts(h, LINEUP);
    assertEq(c["A"], 1);
    assertEq(c["G"], 1);
    assertEq(c["Last One"], 1);
  });
  test("빈 history → 모든 카운트 0", () => {
    const c = tierCounts([]);
    assertEq(c["A"], 0);
    assertEq(c["Last One"], 0);
  });

  // M2.1 B-α 안전장치: revealed === false 항목 카운트 제외 (구 데이터 호환)
  test("tierCounts: revealed: false 항목은 카운트 제외 (B-α 안전장치)", () => {
    const h = [
      { tier: "A", typeIndex: 0, isLastOne: false, revealed: true },
      { tier: "G", typeIndex: 1, isLastOne: false, revealed: false },  // 미reveal = 제외
      { tier: "B", typeIndex: 0, isLastOne: false },  // revealed 미정의 = 포함
    ];
    const c = tierCounts(h, LINEUP);
    assertEq(c["A"], 1);
    assertEq(c["G"], 0);
    assertEq(c["B"], 1);
  });
});
