// M4 단계 5 T11: 홈 ↔ main view 전환 흐름 + dispatch 분기 + storage 마이그레이션 정합 단위 테스트.
// M3.1 lobby_flow.test.js 자산 흡수 + lobby → home 일괄 개명.
// 03_architecture 4.M3.1.B + 04_impl_plan T11.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll } from "../../src/data/storage.js";
import {
  LINEUP_DRAGONBALL_ID,
  LINEUP_ONEPIECE_ID,
  STATE_VIEW_HOME,
  STATE_VIEW_MAIN,
  STATE_VIEW_DEFAULT,
  STATE_VIEW_VALUES,
  DISPATCH_TYPE_OPEN_HOME,
  DISPATCH_TYPE_ENTER_LINEUP,
  STORAGE_KEY_PREFIX,
} from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;

function setLS(key, value) {
  if (LS) LS.setItem(key, value);
}
function getLS(key) {
  return LS ? LS.getItem(key) : null;
}

function deriveView(homeAcked) {
  return homeAcked ? STATE_VIEW_MAIN : STATE_VIEW_HOME;
}

suite("home_flow (M4) - view 모델", () => {
  test("STATE_VIEW_VALUES = [home, main]", () => {
    assertEq(STATE_VIEW_VALUES.length, 2);
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_HOME));
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_MAIN));
  });

  test("STATE_VIEW_DEFAULT = main (homeAcked=true 시 부팅 default)", () => {
    assertEq(STATE_VIEW_DEFAULT, STATE_VIEW_MAIN);
  });

  test("deriveView: homeAcked=false → home", () => {
    assertEq(deriveView(false), STATE_VIEW_HOME);
  });

  test("deriveView: homeAcked=true → main", () => {
    assertEq(deriveView(true), STATE_VIEW_MAIN);
  });

  test("DISPATCH_TYPE 상수 정의", () => {
    assertEq(DISPATCH_TYPE_OPEN_HOME, "open_home");
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
  });
});

suite("home_flow (M4) - 첫 방문자 시나리오", () => {
  test("빈 storage → loadState homeAcked=false → view=home", () => {
    if (!LS) return;
    clearAll();
    const state = loadState();
    assertEq(state.homeAcked, false);
    assertEq(deriveView(state.homeAcked), STATE_VIEW_HOME);
    clearAll();
  });

  test("첫 방문 후 enter_lineup 분기 B 시뮬레이션 → homeAcked=true 영속 + currentLineupId 갱신", () => {
    if (!LS) return;
    clearAll();
    let state = loadState();
    assertEq(state.homeAcked, false);
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID, homeAcked: true });
    assertEq(getLS(`${STORAGE_KEY_PREFIX}current_lineup_id`), LINEUP_ONEPIECE_ID);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    state = loadState();
    assertEq(state.homeAcked, true);
    assertEq(state.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(deriveView(state.homeAcked), STATE_VIEW_MAIN);
    clearAll();
  });
});

suite("home_flow (M4) - 재방문자 + 마이그레이션 시나리오", () => {
  test("v4 fixture (currentLineupId 존재) → v4→v5→v6 chain → homeAcked=true → view=main", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const state = loadState();
    assertEq(state.homeAcked, true);
    assertEq(deriveView(state.homeAcked), STATE_VIEW_MAIN);
    // v6 마이그레이션 후 home_acked 키 존재, lobby_acked 키 제거
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("v5 fixture (lobby_acked=true) → v6 마이그레이션 → home_acked=true 이전 + 키 제거", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    const state = loadState();
    assertEq(state.homeAcked, true);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("재방문자 enter_lineup 분기 B (다른 라인업) → currentLineupId 갱신 + 라인업 격리 보존", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_DRAGONBALL_ID}`, JSON.stringify([{ time: 1, tier: "A" }]));
    setLS(`${STORAGE_KEY_PREFIX}box_round_${LINEUP_DRAGONBALL_ID}`, "2");

    saveState({ currentLineupId: LINEUP_ONEPIECE_ID, homeAcked: true });
    assert(getLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_DRAGONBALL_ID}`) !== null, "드래곤볼 history 보존");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_round_${LINEUP_DRAGONBALL_ID}`), "2");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_ONEPIECE_ID}`), null);

    const state = loadState();
    assertEq(state.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(state.homeAcked, true);
    assert(state.history.length === 0, "원피스 history 빈 상태");
    clearAll();
  });
});

suite("home_flow (M4) - 라인업 격리 + 복귀", () => {
  test("드래곤볼 → 원피스 → 드래곤볼 복귀 시 박스/이력 보존", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    saveState({
      currentLineupId: LINEUP_DRAGONBALL_ID,
      history: [{ time: 100, tier: "A" }, { time: 200, tier: "G" }],
      boxRound: 2,
    });
    saveState({
      currentLineupId: LINEUP_ONEPIECE_ID,
      history: [{ time: 300, tier: "B" }],
      boxRound: 1,
    });
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID });
    const state = loadState();
    assertEq(state.currentLineupId, LINEUP_DRAGONBALL_ID);
    assertEq(state.history.length, 2, "드래곤볼 history 2건 보존");
    assertEq(state.boxRound, 2, "드래곤볼 boxRound 2 보존");
    clearAll();
  });
});
