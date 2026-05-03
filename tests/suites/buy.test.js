import { suite, test, assert, assertEq } from "../core.js";
import { validateBuyCount, addUnopenedTickets, removeTicket } from "../../src/core/buy.js";
import { BUY_FREE_INPUT_MIN, BUY_QUICK_OPTIONS, BOX_SIZE } from "../../src/data/numbers.js";

suite("buy", () => {
  test("validateBuyCount BUY_FREE_INPUT_MIN 미만 → 실패", () => {
    const r = validateBuyCount(BUY_FREE_INPUT_MIN - 1, BOX_SIZE);
    assertEq(r.ok, false);
    assert(typeof r.error === "string");
  });

  test("validateBuyCount 비정수 → 실패", () => {
    const r = validateBuyCount(2.5, BOX_SIZE);
    assertEq(r.ok, false);
  });

  test("validateBuyCount Quick 옵션 모두 BOX_SIZE 이내 → 통과", () => {
    for (const n of BUY_QUICK_OPTIONS) {
      const r = validateBuyCount(n, BOX_SIZE);
      assertEq(r.ok, true, `BUY_QUICK_OPTIONS ${n} 검증 실패`);
    }
  });

  test("validateBuyCount deck 잔여 초과 → 실패", () => {
    const r = validateBuyCount(BOX_SIZE + 1, BOX_SIZE);
    assertEq(r.ok, false);
  });

  test("addUnopenedTickets count 만큼 추가 (불변)", () => {
    const before = [];
    const after = addUnopenedTickets(before, 3, Date.now());
    assertEq(after.length, 3);
    assertEq(before.length, 0);
    for (const t of after) {
      assert(typeof t.id === "string" && t.id.length > 0);
      assert(typeof t.purchasedAt === "number");
    }
  });

  test("addUnopenedTickets ID 충돌 없음 (같은 시각, 인덱스 다르면)", () => {
    const now = Date.now();
    const tickets = addUnopenedTickets([], 5, now);
    const ids = new Set(tickets.map((t) => t.id));
    assertEq(ids.size, 5);
  });

  test("removeTicket id 일치 항목 제거", () => {
    const now = Date.now();
    const tickets = addUnopenedTickets([], 3, now);
    const removed = removeTicket(tickets, tickets[1].id);
    assertEq(removed.length, 2);
    assertEq(removed.find((t) => t.id === tickets[1].id), undefined);
  });

  test("removeTicket 존재 않는 id → 변경 없음", () => {
    const now = Date.now();
    const tickets = addUnopenedTickets([], 3, now);
    const removed = removeTicket(tickets, "nonexistent");
    assertEq(removed.length, 3);
  });
});
