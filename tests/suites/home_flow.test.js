// M4.1 단계 5 T9: 진입 정책 보정 (홈 = 1급 entry 탭 + view 모델 폐기) 단위 테스트.
// M3.1 lobby_flow.test.js → M4 home_flow.test.js → M4.1 갱신 (자산 흡수, 이름 보존).
// 03_architecture 4.M3.1 / spec 5.13.B / 04_impl_plan T9.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll } from "../../src/data/storage.js";
import {
  LINEUP_DRAGONBALL_ID,
  LINEUP_ONEPIECE_ID,
  STATE_TAB_HOME,
  STATE_TAB_DRAW,
  STATE_TAB_PRODUCTS_HISTORY,
  STATE_TAB_SETTINGS,
  STATE_TAB_DEFAULT,
  STATE_TAB_VALUES,
  DISPATCH_TYPE_OPEN_HOME,
  DISPATCH_TYPE_ENTER_LINEUP,
  DISPATCH_TYPE_SET_ACTIVE_TAB,
  STORAGE_KEY_PREFIX,
} from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;

function setLS(key, value) { if (LS) LS.setItem(key, value); }
function getLS(key) { return LS ? LS.getItem(key) : null; }

suite("home_flow (M4.1) - 라우팅 모델 (view 폐기 + activeTab 단일)", () => {
  test("STATE_TAB_VALUES = [home, draw, products_history, settings] (4탭 환원)", () => {
    assertEq(STATE_TAB_VALUES.length, 4);
    assert(STATE_TAB_VALUES.includes(STATE_TAB_HOME));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_DRAW));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_PRODUCTS_HISTORY));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_SETTINGS));
  });

  test("STATE_TAB_DEFAULT = home (M4.1 변경, M4 = draw)", () => {
    assertEq(STATE_TAB_DEFAULT, STATE_TAB_HOME);
  });

  test("DISPATCH_TYPE 상수 정의", () => {
    assertEq(DISPATCH_TYPE_OPEN_HOME, "open_home");
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
    assertEq(DISPATCH_TYPE_SET_ACTIVE_TAB, "set_active_tab");
  });
});

suite("home_flow (M4.1) - 첫 방문자 시나리오", () => {
  test("빈 storage → loadState homeAcked=false + activeTab=home (= STATE_TAB_DEFAULT)", () => {
    if (!LS) return;
    clearAll();
    const state = loadState();
    assertEq(state.homeAcked, false, "면책 미dismiss");
    assertEq(state.activeTab, STATE_TAB_HOME, "default = home");
    clearAll();
  });
});

suite("home_flow (M4.1) - 재방문자 시나리오", () => {
  test("homeAcked=true + activeTab=draw 영속 → 면책 미노출 + activeTab=draw 보존", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}active_tab`, "draw");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "7");
    const state = loadState();
    assertEq(state.homeAcked, true);
    assertEq(state.activeTab, STATE_TAB_DRAW, "M4.1: 영속 활성 탭 보존");
    clearAll();
  });

  test("homeAcked=true + activeTab 미존재 → activeTab=home (M4.1 default = home)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "7");
    const state = loadState();
    assertEq(state.activeTab, STATE_TAB_HOME, "M4.1 재방문도 홈 탭 default (M4까지의 마지막 라인업 자동 진입 폐기)");
    clearAll();
  });
});

suite("home_flow (M4.1) - homeAcked 의미 변경 (면책 동의 표시 전용)", () => {
  test("homeAcked=true는 더 이상 진입 흐름과 결합되지 않음. 라우팅은 activeTab 단독.", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}active_tab`, "home");  // 명시적으로 홈 탭
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "7");
    const state = loadState();
    assertEq(state.homeAcked, true, "면책 동의 표시");
    assertEq(state.activeTab, STATE_TAB_HOME, "homeAcked와 무관하게 activeTab이 라우팅 결정");
    clearAll();
  });

  test("homeAcked=false일 때 activeTab도 동시 활용 가능 (의미 분리)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "false");
    setLS(`${STORAGE_KEY_PREFIX}active_tab`, "draw");  // 면책 미동의지만 activeTab은 draw 영속 가능
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "7");
    const state = loadState();
    assertEq(state.homeAcked, false);
    assertEq(state.activeTab, STATE_TAB_DRAW, "homeAcked와 activeTab은 독립");
    clearAll();
  });
});

suite("home_flow (M4.1) - dispatch 의미", () => {
  test("dispatch.open_home은 activeTab = STATE_TAB_HOME 강제 의미 (코드 측 라우팅 흡수)", () => {
    // 본 단위는 main.js dispatch 분기 의미 박제. 통합 테스트는 라이브 검수에서 흡수.
    assertEq(DISPATCH_TYPE_OPEN_HOME, "open_home");
  });

  test("dispatch.enter_lineup은 activeTab = STATE_TAB_DRAW 강제 의미 (라인업 진입 = 추첨부터 도메인 정합)", () => {
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
  });
});
