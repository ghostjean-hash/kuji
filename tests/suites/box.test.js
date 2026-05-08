import { suite, test, assert, assertEq } from "../core.js";
import { initBox, remaining, isLastDraw } from "../../src/core/box.js";
// M3: LINEUP 단수 폐기 → LINEUP_DRAGONBALL alias로 import.
import { LINEUP_DRAGONBALL as LINEUP } from "../../src/data/numbers.js";
const BOX_SIZE = LINEUP.boxSize;

suite("box", () => {
  test("initBox deck 길이 = BOX_SIZE - 1 (Last One 제외)", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(box.deck.length, BOX_SIZE - 1);
  });
  test("initBox totalSize = BOX_SIZE", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(box.totalSize, BOX_SIZE);
  });
  test("initBox drawnCount = 0", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(box.drawnCount, 0);
  });
  test("initBox id는 8자리 hex", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(box.id.length, 8);
    assert(/^[0-9a-f]{8}$/.test(box.id));
  });
  test("같은 (시드, 회차) → 같은 deck 순서", () => {
    const a = initBox(42, 1, LINEUP);
    const b = initBox(42, 1, LINEUP);
    assertEq(JSON.stringify(a.deck), JSON.stringify(b.deck));
  });
  test("다른 시드 → 다른 deck 순서", () => {
    const a = initBox(1, 1, LINEUP);
    const b = initBox(2, 1, LINEUP);
    assert(JSON.stringify(a.deck) !== JSON.stringify(b.deck));
  });
  test("다른 회차 → 다른 deck 순서", () => {
    const a = initBox(42, 1, LINEUP);
    const b = initBox(42, 2, LINEUP);
    assert(JSON.stringify(a.deck) !== JSON.stringify(b.deck));
  });
  test("remaining = totalSize - drawnCount", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(remaining(box), BOX_SIZE);
    box.drawnCount = 10;
    assertEq(remaining(box), BOX_SIZE - 10);
  });
  test("isLastDraw deck 1매 시점에만 true", () => {
    const box = initBox(42, 1, LINEUP);
    assertEq(isLastDraw(box), false);
    box.deck = box.deck.slice(0, 1);
    assertEq(isLastDraw(box), true);
    box.deck = [];
    assertEq(isLastDraw(box), false);
  });
});
