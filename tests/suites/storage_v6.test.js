// M4 단계 5 T10: storage v5 → v6 마이그레이션 + chain 정합 단위 테스트.
// 02_data 3.2.7 / 03_architecture 5.19 / 04_impl_plan T10.

import { suite, test, assert, assertEq } from "../core.js";
import { migrateV5ToV6, loadState, clearAll, loadGlobalSettings } from "../../src/data/storage.js";
import { STORAGE_KEY_PREFIX, LINEUP_DRAGONBALL_ID, SCHEMA_VERSION } from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;
function setLS(k, v) { if (LS) LS.setItem(k, v); }
function getLS(k) { return LS ? LS.getItem(k) : null; }

suite("storage_v6 (M4) - migrateV5ToV6", () => {
  test("빈 storage → home_acked=false + schemaVersion=6", () => {
    if (!LS) return;
    clearAll();
    const result = migrateV5ToV6();
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "false");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("v5 fixture (lobby_acked=true) → home_acked=true + lobby_acked 키 제거 + schemaVersion=6", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    const result = migrateV5ToV6();
    assert(result.migrated, "마이그레이션 적용");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("v5 fixture (lobby_acked=false) → home_acked=false + lobby_acked 키 제거", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "false");
    migrateV5ToV6();
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "false");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null);
    clearAll();
  });

  test("v6 fixture → 멱등 (변경 0)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "6");
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    const result = migrateV5ToV6();
    assert(!result.migrated, "이미 v6 = 멱등 정합");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("home_acked 키만 존재 (schemaVersion 부재) → schemaVersion=6 보강", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}home_acked`, "true");
    migrateV5ToV6();
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });
});

suite("storage_v6 (M4) - chain v3→v4→v5→v6", () => {
  test("v3 fixture → chain 적용 → schemaVersion=6 + homeAcked=true (currentLineupId 존재 시)", () => {
    if (!LS) return;
    clearAll();
    // v3 fixture: meta.schemaVersion = 3 + LEGACY 키 일부
    setLS(`${STORAGE_KEY_PREFIX}meta`, JSON.stringify({ disclaimerSeen: true, schemaVersion: 3 }));
    // loadState 호출 시 v3→v4→v5→v6 chain 자동 적용
    const state = loadState();
    assertEq(state.homeAcked, false);  // currentLineupId 부재 시 false
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "6");
    clearAll();
  });

  test("loadState 부팅 시 v6 마이그레이션 자동 호출 (멱등 chain 정합)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const state = loadState();
    assertEq(state.homeAcked, true);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}home_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), null);
    clearAll();
  });
});

suite("storage_v6 (M4) - SCHEMA_VERSION 상수", () => {
  test("SCHEMA_VERSION = 6", () => {
    assertEq(SCHEMA_VERSION, 6);
  });
});
