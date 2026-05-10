// M4.1 단계 5 T8: storage v6 → v7 마이그레이션 + chain 정합 단위 테스트.
// 02_data 3.2.8 / 03_architecture 5.20 / 04_impl_plan T8.

import { suite, test, assert, assertEq } from "../core.js";
import { migrateV6ToV7, loadState, clearAll, loadGlobalSettings } from "../../src/data/storage.js";
import { STORAGE_KEY_PREFIX, LINEUP_DRAGONBALL_ID, SCHEMA_VERSION, STATE_TAB_HOME, STATE_TAB_DRAW } from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;
function setLS(k, v) { if (LS) LS.setItem(k, v); }
function getLS(k) { return LS ? LS.getItem(k) : null; }

suite("storage_v7 (M4.1) - migrateV6ToV7", () => {
  test("빈 storage → schemaVersion=7 + (loadGlobalSettings 시 activeTab=home)", () => {
    if (!LS) return;
    clearAll();
    const result = migrateV6ToV7();
    assert(result.migrated, "마이그레이션 적용");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    // 빈 storage에서 active_tab 키 부재 → loadGlobalSettings는 STATE_TAB_DEFAULT (= home)로 fallback.
    const settings = loadGlobalSettings();
    assertEq(settings.activeTab, STATE_TAB_HOME);
    clearAll();
  });

  test("v6 fixture (home_acked=true + active_tab='draw' 영속) → 모두 보존 + schemaVersion=7", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}active_tab`, "draw");
    const result = migrateV6ToV7();
    assert(result.migrated, "마이그레이션 적용");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}active_tab`), "draw");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    clearAll();
  });

  test("v6 fixture (kuji_view='main' 비표준 영속) → kuji_view 키 안전 제거 + schemaVersion=7", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}view`, "main");  // 비표준 영속 시뮬레이션
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    migrateV6ToV7();
    assertEq(getLS(`${STORAGE_KEY_PREFIX}view`), null, "kuji_view 키 안전 제거");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true", "home_acked 값 보존");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    clearAll();
  });

  test("v7 fixture → 멱등 (변경 0)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "7");
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}active_tab`, "products_history");
    const result = migrateV6ToV7();
    assert(!result.migrated, "이미 v7이므로 미적용");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}active_tab`), "products_history");
    clearAll();
  });

  test("v6 → v7: home_acked 의미는 변경되었으나 키/값 동일 (코드 라우팅에서 흡수)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    migrateV6ToV7();
    // v6: "true" = 마지막 라인업 자동 진입. v7: "true" = 면책 동의 표시.
    // 마이그레이션 자체는 키/값 변경 없음. 코드 라우팅(main.js)에서 의미 변경 흡수.
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    clearAll();
  });
});

suite("storage_v7 (M4.1) - chain v3 → v7", () => {
  test("v3 fixture → chain v3→v4→v5→v6→v7 적용 후 schemaVersion=7", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}meta`, JSON.stringify({ schemaVersion: 3, disclaimerSeen: true }));
    setLS(`${STORAGE_KEY_PREFIX}box_round`, "5");  // 단일 라인업 v3 fixture
    setLS(`${STORAGE_KEY_PREFIX}history`, "[]");
    loadState();  // chain 트리거
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    // v3 → v4: box_round → box_round_${LINEUP_DRAGONBALL_ID}
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_round`), null, "v3 단일 키 이전 정합");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_round_${LINEUP_DRAGONBALL_ID}`), "5");
    // v5 → v6: lobby_acked → home_acked 개명
    assert(getLS(`${STORAGE_KEY_PREFIX}home_acked`) !== null, "home_acked 부여");
    clearAll();
  });

  test("v5 fixture → chain v5→v6→v7 적용 후 schemaVersion=7 + active_tab default (= home)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    loadState();  // chain 트리거
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "7");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null, "v5 → v6 키 개명");
    // active_tab 영속 미존재 → loadGlobalSettings에서 STATE_TAB_DEFAULT
    const settings = loadGlobalSettings();
    assertEq(settings.activeTab, STATE_TAB_HOME);
    clearAll();
  });
});
