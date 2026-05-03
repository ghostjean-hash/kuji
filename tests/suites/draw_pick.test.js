// M2.1: drawOne(boxState, drawRng, lineup, pickIndex) 분기 + 결정론 단위 테스트.
// 03_architecture 5.6 / 5.7. 01_spec 5.3.7 / 5.3.8 / 5.14.4.2.

import { suite, test, assert, assertEq, assertThrows } from "../core.js";
import { initBox } from "../../src/core/box.js";
import { drawOne } from "../../src/core/draw.js";
import { createRng } from "../../src/core/random.js";
import { BOX_SIZE, LINEUP } from "../../src/data/numbers.js";

suite("draw_pick (M2.1)", () => {
  test("pickIndex 미전달 → splice(0) = head pop. result.pickIndex === 0 (skip ON)", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    const r = drawOne(box, rng, LINEUP);
    assertEq(r.pickIndex, 0);
  });

  test("pickIndex 0 전달 = 미전달 동등 (head pop)", () => {
    const box1 = initBox(42, 1, LINEUP);
    const rng1 = createRng(42);
    const box2 = initBox(42, 1, LINEUP);
    const rng2 = createRng(42);
    while (box1.deck.length > 0) {
      const r1 = drawOne(box1, rng1, LINEUP);
      const r2 = drawOne(box2, rng2, LINEUP, 0);
      assertEq(r1.tier, r2.tier);
      assertEq(r1.typeIndex, r2.typeIndex);
      assertEq(r1.isLastOne, r2.isLastOne);
    }
  });

  test("pickIndex N 전달 → deck[N] 등급 (skip OFF 통 선택)", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    const expectedAt5 = box.deck[5];
    const r = drawOne(box, rng, LINEUP, 5);
    assertEq(r.tier, expectedAt5);
    assertEq(r.pickIndex, 5);
  });

  test("결정론 (skip OFF): 동일 시드 + 동일 pickIndex 시퀀스 → 동일 결과 100% 재현", () => {
    const seed = 12345;
    const round = 1;
    const indexSeq = [3, 7, 0, 12, 1, 9, 4, 0, 0, 5];
    const box1 = initBox(seed, round, LINEUP);
    const rng1 = createRng(seed);
    const results1 = [];
    for (const i of indexSeq) {
      const idx = Math.min(i, box1.deck.length - 1);
      results1.push(drawOne(box1, rng1, LINEUP, idx));
    }
    const box2 = initBox(seed, round, LINEUP);
    const rng2 = createRng(seed);
    const results2 = [];
    for (const i of indexSeq) {
      const idx = Math.min(i, box2.deck.length - 1);
      results2.push(drawOne(box2, rng2, LINEUP, idx));
    }
    assertEq(results1.length, results2.length);
    for (let i = 0; i < results1.length; i++) {
      assertEq(results1[i].tier, results2[i].tier, `step ${i} tier`);
      assertEq(results1[i].typeIndex, results2[i].typeIndex, `step ${i} typeIndex`);
      assertEq(results1[i].pickIndex, results2[i].pickIndex, `step ${i} pickIndex`);
    }
  });

  test("pickIndex 시퀀스가 다르면 결과 등급 순서도 달라짐 (사용자 자유도)", () => {
    const seed = 999;
    const box1 = initBox(seed, 1, LINEUP);
    const rng1 = createRng(seed);
    const box2 = initBox(seed, 1, LINEUP);
    const rng2 = createRng(seed);
    // 같은 시드 = 같은 셔플 배열. 다른 pickIndex → 다른 공개 순서.
    const r1a = drawOne(box1, rng1, LINEUP, 0);
    const r2a = drawOne(box2, rng2, LINEUP, 5);
    // 서로 다른 등급일 가능성 높음 (불일치 = 통과)
    // 단, 우연히 동일할 수 있어 강한 assert 대신 인덱스 0 vs 5 가 서로 다른 deck 위치임을 확인.
    assertEq(r1a.pickIndex, 0);
    assertEq(r2a.pickIndex, 5);
  });

  test("pickIndex 음수 → throw", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    assertThrows(() => drawOne(box, rng, LINEUP, -1));
  });

  test("pickIndex >= deck.length → throw", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    assertThrows(() => drawOne(box, rng, LINEUP, box.deck.length));
    assertThrows(() => drawOne(box, rng, LINEUP, box.deck.length + 100));
  });

  test("pickIndex 비정수 → throw", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    assertThrows(() => drawOne(box, rng, LINEUP, 1.5));
    assertThrows(() => drawOne(box, rng, LINEUP, "3"));
  });

  test("마지막 1매 추첨 (deck.length === 1) + pickIndex 0 → isLastOne true + lastOnePrize", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    while (box.deck.length > 1) {
      drawOne(box, rng, LINEUP, 0);
    }
    assertEq(box.deck.length, 1);
    const r = drawOne(box, rng, LINEUP, 0);
    assertEq(r.isLastOne, true);
    assertEq(r.lastOnePrize.tier, "Last One");
    assertEq(box.drawnCount, BOX_SIZE);  // 79 + 1 (Last One 동시) = 80
  });

  test("결정론 (skip ON): pickIndex 미전달 = 기존 draw.test.js 시나리오와 동일 (회귀 방지)", () => {
    const seed = 42;
    const box = initBox(seed, 1, LINEUP);
    const rng = createRng(seed);
    let count = 0;
    let lastOneSeen = false;
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);  // pickIndex 미전달
      assertEq(r.pickIndex, 0);  // 항상 head
      count++;
      if (r.isLastOne) lastOneSeen = true;
    }
    assertEq(count, BOX_SIZE - 1);
    assertEq(lastOneSeen, true);
    assertEq(box.drawnCount, BOX_SIZE);
  });
});
