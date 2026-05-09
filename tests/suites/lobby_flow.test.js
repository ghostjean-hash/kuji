// M3.1 단계 5 T9: 로비 ↔ main view 전환 흐름 + dispatch 분기 정합 단위 테스트.
// 03_architecture 4.M3.1.B + 04_impl_plan T9.
// dispatch는 main.js DOM 의존이므로 본 suite는 storage + 상태 결정 로직 단위 검증.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll } from "../../src/data/storage.js";
import {
  LINEUP_DRAGONBALL_ID,
  LINEUP_ONEPIECE_ID,
  STATE_VIEW_LOBBY,
  STATE_VIEW_MAIN,
  STATE_VIEW_DEFAULT,
  STATE_VIEW_VALUES,
  DISPATCH_TYPE_OPEN_LOBBY,
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

// view 결정 함수 (03_architecture 4.M3.1 부팅 절차 5단계)
function deriveView(lobbyAcked) {
  return lobbyAcked ? STATE_VIEW_MAIN : STATE_VIEW_LOBBY;
}

suite("lobby_flow (M3.1) - view 모델", () => {
  test("STATE_VIEW_VALUES = [lobby, main]", () => {
    assertEq(STATE_VIEW_VALUES.length, 2);
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_LOBBY));
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_MAIN));
  });

  test("STATE_VIEW_DEFAULT = main (lobbyAcked=true 시 부팅 default)", () => {
    assertEq(STATE_VIEW_DEFAULT, STATE_VIEW_MAIN);
  });

  test("deriveView: lobbyAcked=false → lobby", () => {
    assertEq(deriveView(false), STATE_VIEW_LOBBY);
  });

  test("deriveView: lobbyAcked=true → main", () => {
    assertEq(deriveView(true), STATE_VIEW_MAIN);
  });

  test("DISPATCH_TYPE 상수 정의", () => {
    assertEq(DISPATCH_TYPE_OPEN_LOBBY, "open_lobby");
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
  });
});

suite("lobby_flow (M3.1) - 첫 방문자 시나리오", () => {
  test("빈 storage → loadState lobbyAcked=false → view=lobby", () => {
    if (!LS) return;
    clearAll();
    const state = loadState();
    assertEq(state.lobbyAcked, false);
    assertEq(deriveView(state.lobbyAcked), STATE_VIEW_LOBBY);
    clearAll();
  });

  test("첫 방문 후 enter_lineup 분기 B 시뮬레이션 → lobbyAcked=true 영속 + currentLineupId 갱신", () => {
    if (!LS) return;
    clearAll();
    // 첫 방문
    let state = loadState();
    assertEq(state.lobbyAcked, false);
    // 사용자 카드 클릭 → enter_lineup 분기 B 시뮬레이션 (다른 라인업 또는 default)
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID, lobbyAcked: true });
    // 영속 검증
    assertEq(getLS(`${STORAGE_KEY_PREFIX}current_lineup_id`), LINEUP_ONEPIECE_ID);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), "true");
    // 다음 부팅 시뮬레이션
    state = loadState();
    assertEq(state.lobbyAcked, true);
    assertEq(state.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(deriveView(state.lobbyAcked), STATE_VIEW_MAIN);
    clearAll();
  });
});

suite("lobby_flow (M3.1) - 재방문자 시나리오", () => {
  test("v4 fixture (currentLineupId 존재) → 마이그레이션 후 lobbyAcked=true → view=main 자동 진입", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const state = loadState();
    assertEq(state.lobbyAcked, true);
    assertEq(deriveView(state.lobbyAcked), STATE_VIEW_MAIN);
    clearAll();
  });

  test("재방문자 enter_lineup 분기 A 시뮬레이션 (동일 라인업) → currentLineupId 변경 0 + lobbyAcked 유지", () => {
    if (!LS) return;
    clearAll();
    // v5 fixture (lobbyAcked=true + 드래곤볼)
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    let state = loadState();
    assertEq(state.currentLineupId, LINEUP_DRAGONBALL_ID);
    // 분기 A: lineupId === state.currentLineupId 시 currentLineupId 변경 안 함
    // (자비스 시뮬레이션: dispatch.enter_lineup 분기 A는 saveState 호출 없거나 lobbyAcked만 갱신)
    // 본 시나리오는 이미 lobbyAcked=true이므로 saveState 호출 없음 정합.
    state = loadState();
    assertEq(state.currentLineupId, LINEUP_DRAGONBALL_ID);
    assertEq(state.lobbyAcked, true);
    clearAll();
  });

  test("재방문자 enter_lineup 분기 B 시뮬레이션 (다른 라인업) → currentLineupId 갱신 + 라인업 공간 격리", () => {
    if (!LS) return;
    clearAll();
    // v5 fixture (lobbyAcked=true + 드래곤볼) + 드래곤볼 박스 데이터
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_DRAGONBALL_ID}`, JSON.stringify([{ time: 1, tier: "A" }]));
    setLS(`${STORAGE_KEY_PREFIX}box_round_${LINEUP_DRAGONBALL_ID}`, "2");

    // 분기 B 시뮬레이션: 원피스 라인업으로 전환
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID, lobbyAcked: true });
    // 드래곤볼 라인업 데이터 보존 검증 (격리 정합)
    assert(getLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_DRAGONBALL_ID}`) !== null, "드래곤볼 history 보존");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_round_${LINEUP_DRAGONBALL_ID}`), "2");
    // 새 라인업 공간 (원피스)은 빈 상태
    assertEq(getLS(`${STORAGE_KEY_PREFIX}history_${LINEUP_ONEPIECE_ID}`), null);

    // 다시 부팅 시뮬레이션
    const state = loadState();
    assertEq(state.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(state.lobbyAcked, true);
    assert(state.history.length === 0, "원피스 history 빈 상태");
    clearAll();
  });
});

suite("lobby_flow (M3.1) - 라인업 격리 + 복귀 시나리오", () => {
  test("드래곤볼 → 원피스 → 드래곤볼 복귀 시 박스/이력 보존", () => {
    if (!LS) return;
    clearAll();
    // 드래곤볼 진행 시뮬레이션
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    saveState({
      currentLineupId: LINEUP_DRAGONBALL_ID,
      history: [{ time: 100, tier: "A" }, { time: 200, tier: "G" }],
      boxRound: 2,
    });
    // 원피스로 전환
    saveState({
      currentLineupId: LINEUP_ONEPIECE_ID,
      history: [{ time: 300, tier: "B" }],
      boxRound: 1,
    });
    // 드래곤볼 복귀
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID });
    const state = loadState();
    assertEq(state.currentLineupId, LINEUP_DRAGONBALL_ID);
    assertEq(state.history.length, 2, "드래곤볼 history 2건 보존");
    assertEq(state.boxRound, 2, "드래곤볼 boxRound 2 보존");
    clearAll();
  });
});
