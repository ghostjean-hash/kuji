// M3: drawDc 시그니처 (tickets, rng, dcConfig). dcConfig = lineup.dc.
import { suite, test, assert, assertEq, assertThrows } from "../core.js";
import { addTicket, drawDc } from "../../src/core/double_chance.js";
import { createRng } from "../../src/core/random.js";
import { LINEUP_DRAGONBALL, DC_POOL_SIZE_DEFAULT } from "../../src/data/numbers.js";

const DC_CONFIG = LINEUP_DRAGONBALL.dc;
const BOX_SIZE = LINEUP_DRAGONBALL.boxSize;
const DC_WINNERS_TOTAL = DC_CONFIG.winnersTotal;

// 잘못된 dcConfig 생성 헬퍼
function badDcConfig(overrides) {
  return { ...DC_CONFIG, ...overrides };
}

suite("double_chance", () => {
  test("addTicket 누적 (불변)", () => {
    let t = [];
    t = addTicket(t, { boxId: "a", drawIndex: 1, time: 1 });
    t = addTicket(t, { boxId: "a", drawIndex: 2, time: 2 });
    assertEq(t.length, 2);
  });
  test("빈 응모권에서 drawDc throw", () => {
    const rng = createRng(1);
    assertThrows(() => drawDc([], rng, DC_CONFIG));
  });
  test("응모권 N매 → probability = 1 - (1 - p)^N", () => {
    const rng = createRng(1);
    const tickets = Array.from({ length: BOX_SIZE }, (_, i) => ({ boxId: "x", drawIndex: i, time: i }));
    const res = drawDc(tickets, rng, DC_CONFIG);
    const expected = 1 - Math.pow(1 - DC_WINNERS_TOTAL / DC_POOL_SIZE_DEFAULT, BOX_SIZE);
    assert(Math.abs(res.probability - expected) < 1e-9, `probability ${res.probability} != ${expected}`);
    assertEq(res.ticketsCount, BOX_SIZE);
  });
  test("isWin true면 prize 객체 반환 (dcConfig prizeName 정합), false면 null", () => {
    const SAMPLE_TICKETS = 1000;
    const SEED_TRIES = 100;
    const tickets = Array.from({ length: SAMPLE_TICKETS }, (_, i) => ({ boxId: "x", drawIndex: i, time: i }));
    let winSeen = false, missSeen = false;
    for (let s = 1; s <= SEED_TRIES; s++) {
      const rng = createRng(s);
      const res = drawDc(tickets, rng, DC_CONFIG);
      if (res.isWin) {
        winSeen = true;
        assertEq(res.prize.nameJa, DC_CONFIG.prizeNameJa);
        assertEq(res.prize.nameKo, DC_CONFIG.prizeNameKo);
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
    assertThrows(() => drawDc(t, rng, badDcConfig({ winnersTotal: 0 })));
    assertThrows(() => drawDc(t, rng, badDcConfig({ poolSizeDefault: 0 })));
    assertThrows(() => drawDc(t, rng, badDcConfig({ winnersTotal: -1 })));
  });
  test("dcConfig 부재 → throw", () => {
    const rng = createRng(1);
    const t = [{ boxId: "a", drawIndex: 1, time: 1 }];
    assertThrows(() => drawDc(t, rng, null));
    assertThrows(() => drawDc(t, rng, undefined));
  });
});
