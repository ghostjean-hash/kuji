import { suite, test, assertEq } from "../core.js";
import { loadState, saveState, clearAll, isStorageAvailable } from "../../src/data/storage.js";

suite("storage", () => {
  test("isStorageAvailable bool 반환", () => {
    const v = isStorageAvailable();
    assertEq(typeof v, "boolean");
  });
  test("loadState 기본 구조 반환", () => {
    clearAll();
    const s = loadState();
    assertEq(typeof s.boxRound, "number");
    assertEq(Array.isArray(s.history), true);
    assertEq(Array.isArray(s.dcTickets), true);
    assertEq(Array.isArray(s.dcResults), true);
    assertEq(typeof s.meta, "object");
    assertEq(typeof s.storageMode, "string");
  });
  test("saveState + loadState 라운드트립 (seed/boxRound)", () => {
    clearAll();
    saveState({ seed: 12345, boxRound: 3 });
    const s = loadState();
    assertEq(s.seed, 12345);
    assertEq(s.boxRound, 3);
    clearAll();
  });
  test("saveState + loadState 라운드트립 (history)", () => {
    clearAll();
    const h = [{ tier: "A", typeIndex: 0, isLastOne: false, time: 1 }];
    saveState({ history: h });
    const s = loadState();
    assertEq(s.history.length, 1);
    assertEq(s.history[0].tier, "A");
    clearAll();
  });
  test("clearAll 후 빈 상태", () => {
    saveState({ history: [{ a: 1 }] });
    clearAll();
    const s = loadState();
    assertEq(s.history.length, 0);
  });
});
