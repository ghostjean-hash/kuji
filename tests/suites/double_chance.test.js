import { suite, test, assert, assertEq, assertThrows } from "../core.js";
import { addTicket, drawDc } from "../../src/core/double_chance.js";
import { createRng } from "../../src/core/random.js";
import { DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT, BOX_SIZE } from "../../src/data/numbers.js";

suite("double_chance", () => {
  test("addTicket 누적 (불변)", () => {
    let t = [];
    t = addTicket(t, { boxId: "a", drawIndex: 1, time: 1 });
    t = addTicket(t, { boxId: "a", drawIndex: 2, time: 2 });
    assertEq(t.length, 2);
  });
  test("빈 응모권에서 drawDc throw", () => {
    const rng = createRng(1);
    assertThrows(() => drawDc([], rng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT));
  });
  test("응모권 N매 → probability = 1 - (1 - p)^N", () => {
    const rng = createRng(1);
    const tickets = Array.from({ length: BOX_SIZE }, (_, i) => ({ boxId: "x", drawIndex: i, time: i }));
    const res = drawDc(tickets, rng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT);
    const expected = 1 - Math.pow(1 - DC_WINNERS_TOTAL / DC_POOL_SIZE_DEFAULT, BOX_SIZE);
    assert(Math.abs(res.probability - expected) < 1e-9, `probability ${res.probability} != ${expected}`);
    assertEq(res.ticketsCount, BOX_SIZE);
  });
  test("isWin true면 prize 객체 반환, false면 null", () => {
    const SAMPLE_TICKETS = 1000;  // ad-hoc 테스트용 응모권 수 (충분한 당첨 확률 확보)
    const SEED_TRIES = 100;       // ad-hoc 시드 반복 횟수
    const tickets = Array.from({ length: SAMPLE_TICKETS }, (_, i) => ({ boxId: "x", drawIndex: i, time: i }));
    let winSeen = false, missSeen = false;
    for (let s = 1; s <= SEED_TRIES; s++) {
      const rng = createRng(s);
      const res = drawDc(tickets, rng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT);
      if (res.isWin) {
        winSeen = true;
        assert(res.prize && res.prize.nameJa && res.prize.nameKo, "win이지만 prize 부재");
      } else {
        missSeen = true;
        assertEq(res.prize, null);
      }
      if (winSeen && missSeen) break;
    }
    assert(winSeen, `${SEED_TRIES} 시드 시도에서 win 0회 (확률 검증 실패 가능성)`);
    assert(missSeen, `${SEED_TRIES} 시드 시도에서 miss 0회 (확률 검증 실패 가능성)`);
  });
  test("invalid winnersTotal / poolSize → throw", () => {
    const rng = createRng(1);
    const t = [{ boxId: "a", drawIndex: 1, time: 1 }];
    assertThrows(() => drawDc(t, rng, 0, DC_POOL_SIZE_DEFAULT));
    assertThrows(() => drawDc(t, rng, DC_WINNERS_TOTAL, 0));
    assertThrows(() => drawDc(t, rng, -1, DC_POOL_SIZE_DEFAULT));
  });
});
