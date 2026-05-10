// M4 단계 5 T13: state.view / state.activeTab enum + dispatch type 상수 정합 단위 테스트.
// 02_data 1.4.B / 03_architecture 5.19 / 04_impl_plan T13.

import { suite, test, assert, assertEq } from "../core.js";
import {
  STATE_VIEW_HOME,
  STATE_VIEW_MAIN,
  STATE_VIEW_VALUES,
  STATE_VIEW_DEFAULT,
  STATE_TAB_DRAW,
  STATE_TAB_PRODUCTS_HISTORY,
  STATE_TAB_SETTINGS,
  STATE_TAB_VALUES,
  STATE_TAB_DEFAULT,
  DISPATCH_TYPE_OPEN_HOME,
  DISPATCH_TYPE_ENTER_LINEUP,
  DISPATCH_TYPE_SET_ACTIVE_TAB,
} from "../../src/data/numbers.js";

suite("state_view (M4) - view enum", () => {
  test("STATE_VIEW_HOME = 'home' / STATE_VIEW_MAIN = 'main'", () => {
    assertEq(STATE_VIEW_HOME, "home");
    assertEq(STATE_VIEW_MAIN, "main");
  });
  test("STATE_VIEW_VALUES 2종", () => {
    assertEq(STATE_VIEW_VALUES.length, 2);
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_HOME));
    assert(STATE_VIEW_VALUES.includes(STATE_VIEW_MAIN));
  });
  test("STATE_VIEW_DEFAULT = main", () => {
    assertEq(STATE_VIEW_DEFAULT, STATE_VIEW_MAIN);
  });
});

suite("state_view (M4) - 탭 enum", () => {
  test("STATE_TAB_* 3종 정의", () => {
    assertEq(STATE_TAB_DRAW, "draw");
    assertEq(STATE_TAB_PRODUCTS_HISTORY, "products_history");
    assertEq(STATE_TAB_SETTINGS, "settings");
  });
  test("STATE_TAB_VALUES 3종 (M3.5까지 4탭에서 갱신)", () => {
    assertEq(STATE_TAB_VALUES.length, 3);
    assert(STATE_TAB_VALUES.includes(STATE_TAB_DRAW));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_PRODUCTS_HISTORY));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_SETTINGS));
  });
  test("M3.5까지 'history' / 'dc' 4탭 폐기 - STATE_TAB_VALUES 미포함", () => {
    assert(!STATE_TAB_VALUES.includes("history"));
    assert(!STATE_TAB_VALUES.includes("dc"));
  });
  test("STATE_TAB_DEFAULT = draw", () => {
    assertEq(STATE_TAB_DEFAULT, STATE_TAB_DRAW);
  });
});

suite("state_view (M4) - dispatch type 상수", () => {
  test("DISPATCH_TYPE_OPEN_HOME = 'open_home' (M3.1 OPEN_LOBBY 개명)", () => {
    assertEq(DISPATCH_TYPE_OPEN_HOME, "open_home");
  });
  test("DISPATCH_TYPE_ENTER_LINEUP = 'enter_lineup' (M3.1 잔존)", () => {
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
  });
  test("DISPATCH_TYPE_SET_ACTIVE_TAB = 'set_active_tab' (M4 신설)", () => {
    assertEq(DISPATCH_TYPE_SET_ACTIVE_TAB, "set_active_tab");
  });
});
