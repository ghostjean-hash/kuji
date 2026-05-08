// M2.1 + 4.14.7: buildConsumedGridSet 단일 진실원 검증.
// pick-panel 렌더와 main.js performPickConfirm가 같은 결과를 보도록 단일 함수로 통합 후
// 회귀 위험 영역. (history.gridIndex + lockedResult.gridIndex 추적분 + 부족분 lowest gi placeholder).

import { suite, test, assert, assertEq } from "../core.js";
import { buildConsumedGridSet } from "../../src/render/main.js";
import { initBox } from "../../src/core/box.js";
import { LINEUP, BOX_SIZE } from "../../src/data/numbers.js";

const NORMAL_SLOT_COUNT = BOX_SIZE - 1;

function makeState({ history = [], unopenedTickets = [], deckLength }) {
  const box = initBox(42, 1, LINEUP);
  // 임의 deckLength 시뮬레이션. 실제 splice는 안 하고 deck 길이만 조정.
  if (typeof deckLength === "number") {
    box.deck.length = deckLength;
    box.drawnCount = NORMAL_SLOT_COUNT - deckLength;
  }
  return {
    boxState: box,
    history,
    unopenedTickets,
  };
}

suite("buildConsumedGridSet (M2.1 / 4.14.7)", () => {
  test("초기 상태 (history 0 / lockedResult 0 / deck 풀) → 빈 set", () => {
    const s = makeState({});
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 0);
  });

  test("history.gridIndex 추적분 1매 → set에 해당 gi 1개", () => {
    const s = makeState({
      history: [{ boxId: undefined, gridIndex: 5, isLastOne: false }],
      deckLength: NORMAL_SLOT_COUNT - 1,
    });
    s.history[0].boxId = s.boxState.id;
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 1);
    assert(out.has(5), "gi=5 포함");
  });

  test("lockedResult.gridIndex 추적분만 (history 0) → set에 lockedResult gi", () => {
    const s = makeState({
      unopenedTickets: [
        { id: "t1", purchasedAt: 0, lockedResult: { tier: "G", gridIndex: 12, isLastOne: false } },
        { id: "t2", purchasedAt: 0, lockedResult: { tier: "J", gridIndex: 33, isLastOne: false } },
      ],
      deckLength: NORMAL_SLOT_COUNT - 2,
    });
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 2);
    assert(out.has(12), "gi=12 포함");
    assert(out.has(33), "gi=33 포함");
  });

  test("history + lockedResult 병합 (중복 없는 경우)", () => {
    const s = makeState({
      history: [{ gridIndex: 1, isLastOne: false }, { gridIndex: 2, isLastOne: false }],
      unopenedTickets: [
        { id: "t1", purchasedAt: 0, lockedResult: { tier: "I", gridIndex: 50, isLastOne: false } },
      ],
      deckLength: NORMAL_SLOT_COUNT - 3,
    });
    s.history.forEach((e) => (e.boxId = s.boxState.id));
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 3);
  });

  test("skip 모드 placeholder 충당: deck 소진 N개 > 추적 set 크기 → lowest gi로 채움", () => {
    // skip 모드 history 2매 (gridIndex: null) + 일반 history 1매 (gridIndex: 7)
    // → 추적은 1개지만 deck은 3매 소진 상태. placeholder로 lowest gi 2개 추가 (0, 1).
    const s = makeState({
      history: [
        { gridIndex: null, isLastOne: false },
        { gridIndex: null, isLastOne: false },
        { gridIndex: 7, isLastOne: false },
      ],
      deckLength: NORMAL_SLOT_COUNT - 3,
    });
    s.history.forEach((e) => (e.boxId = s.boxState.id));
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 3);
    assert(out.has(7), "추적된 gi=7 유지");
    assert(out.has(0), "placeholder 0");
    assert(out.has(1), "placeholder 1");
  });

  test("placeholder 충당 시 추적 gi와 충돌 회피 (이미 추적된 gi 건너뛰기)", () => {
    // gi=0 이미 추적, deck 2매 소진 → placeholder는 gi=1부터 채워야.
    const s = makeState({
      history: [
        { gridIndex: 0, isLastOne: false },
        { gridIndex: null, isLastOne: false },
      ],
      deckLength: NORMAL_SLOT_COUNT - 2,
    });
    s.history.forEach((e) => (e.boxId = s.boxState.id));
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 2);
    assert(out.has(0), "추적된 gi=0 유지");
    assert(out.has(1), "placeholder는 1로 (0 건너뜀)");
  });

  test("다른 박스(boxId 불일치) history는 무시", () => {
    const s = makeState({
      history: [
        { boxId: "other-box-id", gridIndex: 9, isLastOne: false },
      ],
    });
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 0);
  });

  test("history.gridIndex undefined / null 모두 안전 (TypeError 없음)", () => {
    const s = makeState({
      history: [
        { gridIndex: undefined, isLastOne: false },
        { gridIndex: null, isLastOne: false },
      ],
    });
    s.history.forEach((e) => (e.boxId = s.boxState.id));
    const out = buildConsumedGridSet(s);
    // 둘 다 추적 미가능. deckLength도 풀이라 placeholder 충당 0.
    assertEq(out.size, 0);
  });

  test("unopenedTickets에 lockedResult null/undefined 항목 섞여 있어도 안전", () => {
    const s = makeState({
      unopenedTickets: [
        { id: "raw1", purchasedAt: 0, lockedResult: null },
        { id: "t1", purchasedAt: 0, lockedResult: { tier: "G", gridIndex: 4, isLastOne: false } },
        { id: "raw2", purchasedAt: 0 },  // lockedResult 미부여 (undefined)
      ],
      deckLength: NORMAL_SLOT_COUNT - 1,
    });
    const out = buildConsumedGridSet(s);
    assertEq(out.size, 1);
    assert(out.has(4), "lockedResult.gridIndex만 추적");
  });
});
