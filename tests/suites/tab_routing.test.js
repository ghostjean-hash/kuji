// M4.1 단계 5 T10: 4탭 라우팅 + dispatch type 상수 정합 단위 테스트.
// M4 state_view.test.js 자산 흡수 + STATE_VIEW_* 폐기 (M4.1 = activeTab 단일 라우팅).
// 02_data 1.4.B / 03_architecture 5.20 / 04_impl_plan T10.

import { suite, test, assert, assertEq } from "../core.js";
import * as numbers from "../../src/data/numbers.js";
import {
  STATE_TAB_HOME,
  STATE_TAB_DRAW,
  STATE_TAB_PRODUCTS_HISTORY,
  STATE_TAB_SETTINGS,
  STATE_TAB_VALUES,
  STATE_TAB_DEFAULT,
  DISPATCH_TYPE_OPEN_HOME,
  DISPATCH_TYPE_ENTER_LINEUP,
  DISPATCH_TYPE_SET_ACTIVE_TAB,
} from "../../src/data/numbers.js";

suite("tab_routing (M4.1) - STATE_VIEW_* 폐기 정합", () => {
  test("STATE_VIEW_HOME export 폐기 (자비스 단계 1 결정 4.3.A 채택)", () => {
    assertEq(numbers.STATE_VIEW_HOME, undefined);
  });
  test("STATE_VIEW_MAIN export 폐기", () => {
    assertEq(numbers.STATE_VIEW_MAIN, undefined);
  });
  test("STATE_VIEW_VALUES export 폐기", () => {
    assertEq(numbers.STATE_VIEW_VALUES, undefined);
  });
  test("STATE_VIEW_DEFAULT export 폐기", () => {
    assertEq(numbers.STATE_VIEW_DEFAULT, undefined);
  });
});

suite("tab_routing (M4.1) - 4탭 enum", () => {
  test("STATE_TAB_HOME = 'home' (M4.1 신설)", () => {
    assertEq(STATE_TAB_HOME, "home");
  });
  test("STATE_TAB_DRAW = 'draw' / STATE_TAB_PRODUCTS_HISTORY = 'products_history' / STATE_TAB_SETTINGS = 'settings'", () => {
    assertEq(STATE_TAB_DRAW, "draw");
    assertEq(STATE_TAB_PRODUCTS_HISTORY, "products_history");
    assertEq(STATE_TAB_SETTINGS, "settings");
  });
  test("STATE_TAB_VALUES 4종 (M4 3탭 → M4.1 4탭 환원)", () => {
    assertEq(STATE_TAB_VALUES.length, 4);
    assert(STATE_TAB_VALUES.includes(STATE_TAB_HOME));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_DRAW));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_PRODUCTS_HISTORY));
    assert(STATE_TAB_VALUES.includes(STATE_TAB_SETTINGS));
  });
  test("M3.5까지 'history' / 'dc' 4탭 폐기 잔존 (M4 폐기 답습)", () => {
    assert(!STATE_TAB_VALUES.includes("history"));
    assert(!STATE_TAB_VALUES.includes("dc"));
  });
  test("STATE_TAB_DEFAULT = home (M4.1 변경, M4 = draw)", () => {
    assertEq(STATE_TAB_DEFAULT, STATE_TAB_HOME);
  });
});

suite("tab_routing (M4.1) - dispatch type 상수", () => {
  test("DISPATCH_TYPE_OPEN_HOME = 'open_home' (M4.1 의미 = activeTab = HOME)", () => {
    assertEq(DISPATCH_TYPE_OPEN_HOME, "open_home");
  });
  test("DISPATCH_TYPE_ENTER_LINEUP = 'enter_lineup' (M4.1 의미 = activeTab = DRAW + currentLineupId + homeAcked = true)", () => {
    assertEq(DISPATCH_TYPE_ENTER_LINEUP, "enter_lineup");
  });
  test("DISPATCH_TYPE_SET_ACTIVE_TAB = 'set_active_tab' (M4 신설 / M4.1 4탭 정합)", () => {
    assertEq(DISPATCH_TYPE_SET_ACTIVE_TAB, "set_active_tab");
  });
});

suite("tab_routing (M4.1) - dispatch.set_active_tab 검증", () => {
  test("STATE_TAB_VALUES 미포함 값은 throw 또는 fallback (main.js 분기 정합)", () => {
    // dispatch 자체는 main.js 모듈 책임. 본 단위는 검증식 박제.
    assert(!STATE_TAB_VALUES.includes("invalid_tab"));
    assert(!STATE_TAB_VALUES.includes(""));
    assert(!STATE_TAB_VALUES.includes(null));
  });
});
