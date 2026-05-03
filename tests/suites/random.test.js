import { suite, test, assert, assertEq, assertThrows } from "../core.js";
import { createRng, nextInt } from "../../src/core/random.js";

suite("random", () => {
  test("createRng는 함수 반환", () => {
    const rng = createRng(42);
    assertEq(typeof rng, "function");
  });
  test("rng 출력은 [0,1) 범위", () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      assert(v >= 0 && v < 1, `out of range: ${v}`);
    }
  });
  test("같은 시드 → 같은 시퀀스 (결정론)", () => {
    const r1 = createRng(123);
    const r2 = createRng(123);
    for (let i = 0; i < 20; i++) {
      assertEq(r1(), r2());
    }
  });
  test("다른 시드 → 다른 시퀀스 (대부분)", () => {
    const r1 = createRng(1);
    const r2 = createRng(2);
    let same = true;
    for (let i = 0; i < 20; i++) {
      if (r1() !== r2()) { same = false; break; }
    }
    assert(!same, "두 시드 시퀀스가 동일");
  });
  test("nextInt [0, max) 정수", () => {
    const rng = createRng(99);
    for (let i = 0; i < 1000; i++) {
      const v = nextInt(rng, 10);
      assert(Number.isInteger(v) && v >= 0 && v < 10, `out of range: ${v}`);
    }
  });
  test("nextInt max ≤ 0 → throw", () => {
    const rng = createRng(99);
    assertThrows(() => nextInt(rng, 0));
    assertThrows(() => nextInt(rng, -1));
  });
});
