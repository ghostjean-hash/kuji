import { suite, test, assert, assertEq } from "../core.js";
import { fnv1a, boxId } from "../../src/core/hash.js";

suite("hash", () => {
  test("fnv1a 결정론", () => {
    assertEq(fnv1a("abc"), fnv1a("abc"));
  });
  test("fnv1a 다른 입력 다른 출력", () => {
    assert(fnv1a("abc") !== fnv1a("abd"));
  });
  test("fnv1a 32비트 unsigned 범위", () => {
    const v = fnv1a("test");
    assert(v >= 0 && v <= 0xFFFFFFFF);
  });
  test("boxId 결정론", () => {
    assertEq(boxId(42, 1), boxId(42, 1));
  });
  test("boxId 시드 다르면 다름", () => {
    assert(boxId(1, 1) !== boxId(2, 1));
  });
  test("boxId 회차 다르면 다름", () => {
    assert(boxId(1, 1) !== boxId(1, 2));
  });
  test("boxId 8자리 16진수 문자열", () => {
    const id = boxId(42, 1);
    assertEq(id.length, 8);
    assert(/^[0-9a-f]{8}$/.test(id), `not hex: ${id}`);
  });
});
