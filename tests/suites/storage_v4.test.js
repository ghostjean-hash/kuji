// M3 단계 5 T21: storage v3 → v4 다중 라인업 마이그레이션 단위 테스트.
// 02_data 3.2.5 + 03_architecture 3.10.M3.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll, migrateV3ToV4 } from "../../src/data/storage.js";
import { SCHEMA_VERSION, LINEUP_DEFAULT_ID, LINEUP_DRAGONBALL_ID, LINEUP_ONEPIECE_ID, STORAGE_KEY_PREFIX } from "../../src/data/numbers.js";

const LS = (typeof window !== "undefined" && window.localStorage) ? window.localStorage : null;

function setLS(key, value) {
  if (LS) LS.setItem(key, value);
}
function getLS(key) {
  return LS ? LS.getItem(key) : null;
}

suite("storage_v4 (M3)", () => {
  test("migrateV3ToV4: LEGACY 단일 라인업 키 6종 → DEFAULT 라인업 격리 키로 이전", () => {
    if (!LS) return;
    clearAll();
    // v3 fixture: 단일 라인업 키 6종 + meta v3 + 전역 seed/skip
    setLS(`${STORAGE_KEY_PREFIX}history`, JSON.stringify([{ time: 1, tier: "A" }]));
    setLS(`${STORAGE_KEY_PREFIX}unopened_tickets`, JSON.stringify([{ id: "t1", purchasedAt: 100, lockedResult: null }]));
    setLS(`${STORAGE_KEY_PREFIX}box_state`, JSON.stringify({ id: "abc", deck: ["A"], drawnCount: 0, totalSize: 80 }));
    setLS(`${STORAGE_KEY_PREFIX}box_round`, "3");
    setLS(`${STORAGE_KEY_PREFIX}dc_tickets`, JSON.stringify([{ boxId: "abc", drawIndex: 0, time: 50 }]));
    setLS(`${STORAGE_KEY_PREFIX}dc_results`, JSON.stringify([]));
    setLS(`${STORAGE_KEY_PREFIX}seed`, "12345");
    setLS(`${STORAGE_KEY_PREFIX}meta`, JSON.stringify({ disclaimerSeen: true, schemaVersion: 3, pickHintSeen: true }));

    const result = migrateV3ToV4();
    assertEq(result.migrated, true);

    // LEGACY 키 제거 검증
    assertEq(getLS(`${STORAGE_KEY_PREFIX}history`), null);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}unopened_tickets`), null);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_state`), null);

    // DEFAULT 라인업 격리 키로 이전 검증
    const lid = LINEUP_DEFAULT_ID;
    assert(getLS(`${STORAGE_KEY_PREFIX}history_${lid}`) !== null, "history 격리 키");
    assert(getLS(`${STORAGE_KEY_PREFIX}unopened_tickets_${lid}`) !== null, "unopened_tickets 격리 키");
    assert(getLS(`${STORAGE_KEY_PREFIX}box_state_${lid}`) !== null, "box_state 격리 키");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}box_round_${lid}`), "3");

    // 전역 키 신설
    assertEq(getLS(`${STORAGE_KEY_PREFIX}current_lineup_id`), LINEUP_DEFAULT_ID);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "4");

    // 전역 키 보존
    assertEq(getLS(`${STORAGE_KEY_PREFIX}seed`), "12345");
    clearAll();
  });

  test("migrateV3ToV4: 멱등 (이미 v4면 변경 0)", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}schema_version`, "4");
    setLS(`${STORAGE_KEY_PREFIX}current_lineup_id`, LINEUP_DRAGONBALL_ID);
    const result = migrateV3ToV4();
    assertEq(result.migrated, false);
    assertEq(result.reason, "already_v4");
    clearAll();
  });

  test("migrateV3ToV4: LEGACY 키 부재 (신규 사용자) → 마이그레이션 작업 0건 + schema_version 4 + current_lineup_id default", () => {
    if (!LS) return;
    clearAll();
    const result = migrateV3ToV4();
    assertEq(result.migrated, false);  // 이전할 source 키 0건
    assertEq(getLS(`${STORAGE_KEY_PREFIX}schema_version`), "4");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}current_lineup_id`), LINEUP_DEFAULT_ID);
    clearAll();
  });

  test("migrateV3ToV4: 부분 LEGACY 키 (history만) → 부분 이전 정합", () => {
    if (!LS) return;
    clearAll();
    setLS(`${STORAGE_KEY_PREFIX}history`, JSON.stringify([{ time: 1, tier: "G" }]));
    const result = migrateV3ToV4();
    assertEq(result.migrated, true);
    assertEq(getLS(`${STORAGE_KEY_PREFIX}history`), null);
    const lid = LINEUP_DEFAULT_ID;
    assert(getLS(`${STORAGE_KEY_PREFIX}history_${lid}`) !== null, "history 이전됨");
    assertEq(getLS(`${STORAGE_KEY_PREFIX}unopened_tickets_${lid}`), null);  // source 부재라 미생성
    clearAll();
  });

  test("loadState (신규 사용자): currentLineupId = LINEUP_DEFAULT_ID + schemaVersion = SCHEMA_VERSION", () => {
    clearAll();
    const s = loadState();
    assertEq(s.currentLineupId, LINEUP_DEFAULT_ID);
    assertEq(s.meta.schemaVersion, SCHEMA_VERSION);
    clearAll();
  });

  test("라인업 격리: 드래곤볼 history saveState → 원피스 loadState 시 history 0", () => {
    clearAll();
    // 드래곤볼 라인업에서 history append 후 영속.
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID, history: [{ time: 1, tier: "A" }] });
    // currentLineupId 전환.
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID });
    const s = loadState();
    assertEq(s.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(s.history.length, 0);  // 원피스 공간은 비어있음
    // 드래곤볼 데이터 복귀 확인
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID });
    const s2 = loadState();
    assertEq(s2.currentLineupId, LINEUP_DRAGONBALL_ID);
    assertEq(s2.history.length, 1);
    assertEq(s2.history[0].tier, "A");
    clearAll();
  });

  test("전역 키 (seed) 라인업 무관 공유", () => {
    clearAll();
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID, seed: 9999 });
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID });
    const s = loadState();
    assertEq(s.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(s.seed, 9999);  // 라인업 전환에도 seed 유지
    clearAll();
  });

  test("전역 키 (settingsSkipPick) 라인업 무관 공유", () => {
    clearAll();
    saveState({ currentLineupId: LINEUP_DRAGONBALL_ID, settingsSkipPick: true });
    saveState({ currentLineupId: LINEUP_ONEPIECE_ID });
    const s = loadState();
    assertEq(s.currentLineupId, LINEUP_ONEPIECE_ID);
    assertEq(s.settingsSkipPick, true);  // skip 토글 전역 유지
    clearAll();
  });
});
