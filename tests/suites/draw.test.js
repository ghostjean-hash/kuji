import { suite, test, assert, assertEq, assertThrows } from "../core.js";
import { initBox } from "../../src/core/box.js";
import { drawOne } from "../../src/core/draw.js";
import { createRng } from "../../src/core/random.js";
// M3: LINEUP / TIERS 단수 폐기 → LINEUP_DRAGONBALL alias.
import { LINEUP_DRAGONBALL as LINEUP, TIERS_DRAGONBALL as TIERS } from "../../src/data/numbers.js";
const BOX_SIZE = LINEUP.boxSize;

suite("draw", () => {
  test("79회 클릭으로 박스 종료 (deck pop 79 + Last One 동시 1)", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    let count = 0;
    let lastOneSeen = false;
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);
      count++;
      if (r.isLastOne) lastOneSeen = true;
    }
    assertEq(count, BOX_SIZE - 1);  // 79회 클릭
    assertEq(lastOneSeen, true);
    assertEq(box.drawnCount, BOX_SIZE);  // 79 deck + Last One 1 = 80
  });

  test("등급별 매수 정합 (박스 종료 후 카운트 = TIERS 정의)", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    const counts = {};
    for (const t of TIERS) counts[t.tier] = 0;
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);
      counts[r.tier] += 1;
      if (r.isLastOne) counts["Last One"] += 1;
    }
    for (const t of TIERS) {
      assertEq(counts[t.tier], t.count, `tier ${t.tier} count mismatch`);
    }
  });

  test("빈 박스에서 추첨 → throw", () => {
    const box = initBox(42, 1, LINEUP);
    box.deck = [];
    const rng = createRng(42);
    assertThrows(() => drawOne(box, rng, LINEUP));
  });

  test("같은 (시드, 회차) → 같은 추첨 순서 (결정론)", () => {
    const box1 = initBox(42, 1, LINEUP);
    const rng1 = createRng(42);
    const box2 = initBox(42, 1, LINEUP);
    const rng2 = createRng(42);
    while (box1.deck.length > 0) {
      const r1 = drawOne(box1, rng1, LINEUP);
      const r2 = drawOne(box2, rng2, LINEUP);
      assertEq(r1.tier, r2.tier);
      assertEq(r1.typeIndex, r2.typeIndex);
      assertEq(r1.isLastOne, r2.isLastOne);
    }
  });

  test("종 수 ≥ 2 등급 → typeIndex [0, typeCount)", () => {
    const box = initBox(99, 1, LINEUP);
    const rng = createRng(99);
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);
      const t = TIERS.find((x) => x.tier === r.tier);
      assert(r.typeIndex >= 0 && r.typeIndex < t.typeCount, `tier ${r.tier} typeIndex ${r.typeIndex} out of [0, ${t.typeCount})`);
    }
  });

  test("Last One 결과는 마지막 deck pop 시점에만 1회", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    let lastOneCount = 0;
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);
      if (r.isLastOne) lastOneCount++;
    }
    assertEq(lastOneCount, 1);
  });

  test("Last One 결과에 lastOnePrize 객체 첨부", () => {
    const box = initBox(42, 1, LINEUP);
    const rng = createRng(42);
    let lastResult = null;
    while (box.deck.length > 0) {
      const r = drawOne(box, rng, LINEUP);
      if (r.isLastOne) lastResult = r;
    }
    assert(lastResult, "Last One 결과 미발견");
    assertEq(lastResult.lastOnePrize.tier, "Last One");
  });
});
