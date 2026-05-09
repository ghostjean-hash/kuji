// M3.1 단계 5 T8: storage v4 → v5 라인업 로비 마이그레이션 단위 테스트.
// 02_data 3.2.6 + 03_architecture 3.10.M3.1 + 04_impl_plan T8.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll, migrateV4ToV5, loadGlobalSettings } from "../../src/data/storage.js";
import { SCHEMA_VERSION, LINEUP_DEFAULT_ID, LINEUP_DRAGONBALL_ID, STORAGE_KEY_PREFIX } from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;

function setLS(key, value) {
  if (LS) LS.setItem(key, value);
}
function getLS(key) {
  return LS ? LS.getItem(key) : null;
}

suite("storage_v5 (M3.1)", () => {
  test("migrateV4ToV5: 빈 storage (첫 방문) → lobbyAcked=false + schemaVersion=5", () => {
    if (!LS) return;
    clearAll();
    const result = migrateV4ToV5();
    assertEq(result.migrated, true);
    assertEq(result.reason, "v4_to_v5");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), "false");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "5");
    clearAll();
  });

  test("migrateV4ToV5: v4 fixture (currentLineupId 존재) → lobbyAcked=true + schemaVersion=5", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const result = migrateV4ToV5();
    assertEq(result.migrated, true);
    assertEq(result.lobbyAcked, "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), "true");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "5");
    // currentLineupId 보존
    assertEq(getLS(`${STORAGE_KEY_PREFIX}current_lineup_id`), LINEUP_DRAGONBALL_ID);
    clearAll();
  });

  test("migrateV4ToV5: 멱등 (이미 v5면 변경 0)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "5");
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    const result = migrateV4ToV5();
    assertEq(result.migrated, false);
    assertEq(result.reason, "already_v5");
    clearAll();
  });

  test("migrateV4ToV5: lobby_acked 이미 존재 → schemaVersion만 갱신 + migrated=false", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");  // version은 v4지만 lobby_acked 키 이미 있음
    const result = migrateV4ToV5();
    assertEq(result.migrated, false);
    assertEq(result.reason, "lobby_acked_already_set");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "5");
    clearAll();
  });

  test("loadGlobalSettings: lobbyAcked 역직렬화 (string \"true\" → boolean true)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "true");
    const settings = loadGlobalSettings();
    assertEq(settings.lobbyAcked, true);
    clearAll();
  });

  test("loadGlobalSettings: lobbyAcked 역직렬화 (string \"false\" → boolean false)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}lobby_acked`, "false");
    const settings = loadGlobalSettings();
    assertEq(settings.lobbyAcked, false);
    clearAll();
  });

  test("loadGlobalSettings: lobbyAcked 키 부재 → boolean false (안전 default)", () => {
    if (!LS) return;
    clearAll();
    const settings = loadGlobalSettings();
    assertEq(settings.lobbyAcked, false);
    clearAll();
  });

  test("loadState: 빈 storage 첫 방문 → lobbyAcked=false 자동 부여", () => {
    if (!LS) return;
    clearAll();
    const state = loadState();
    assertEq(state.lobbyAcked, false);
    clearAll();
  });

  test("loadState: v4 fixture (currentLineupId 존재) → lobbyAcked=true 추론", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const state = loadState();
    assertEq(state.lobbyAcked, true);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "5");
    clearAll();
  });

  test("saveState: lobbyAcked 직렬화 (boolean true → string \"true\")", () => {
    if (!LS) return;
    clearAll();
    saveState({ lobbyAcked: true });
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), "true");
    saveState({ lobbyAcked: false });
    assertEq(getLS(`${STORAGE_KEY_PREFIX}lobby_acked`), "false");
    clearAll();
  });

  test("SCHEMA_VERSION 상수 = 5", () => {
    assertEq(SCHEMA_VERSION, 5);
  });
});
