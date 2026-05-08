// M2.1: storage v2 → v3 마이그레이션 단위 테스트.
// 02_data 3.2.3 + 03_architecture 3.10 + 04_impl_plan T6.

import { suite, test, assert, assertEq } from "../core.js";
import { loadState, saveState, clearAll, migrateV2ToV3, migrateV3InPlace } from "../../src/data/storage.js";
import { SCHEMA_VERSION, BUY_SKIP_PICK_DEFAULT } from "../../src/data/numbers.js";

suite("storage_v3 (M2.1)", () => {
  test("migrateV2ToV3: settingsSkipPick 부재 → BUY_SKIP_PICK_DEFAULT 초기화", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [], dcTickets: [], dcResults: [],
      meta: { disclaimerSeen: true, schemaVersion: 2 },
      unopenedTickets: [],
      // settingsSkipPick 누락
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.settingsSkipPick, BUY_SKIP_PICK_DEFAULT);
  });

  test("migrateV2ToV3: meta.pickHintSeen 부재 → false 초기화", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [], dcTickets: [], dcResults: [],
      meta: { disclaimerSeen: true, schemaVersion: 2 },
      unopenedTickets: [],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.meta.pickHintSeen, false);
  });

  test("migrateV2ToV3: history 항목 backfill (revealed: true / pickIndex: null / gridIndex: null)", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [
        { time: 100, tier: "A", typeIndex: 0, isLastOne: false },  // revealed / pickIndex / gridIndex 누락
        { time: 200, tier: "G", typeIndex: 3, isLastOne: false },
      ],
      dcTickets: [], dcResults: [],
      meta: { disclaimerSeen: true, schemaVersion: 2 },
      unopenedTickets: [],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.history.length, 2);
    assertEq(v3.history[0].revealed, true);
    assertEq(v3.history[0].pickIndex, null);
    assertEq(v3.history[0].gridIndex, null);
    assertEq(v3.history[1].revealed, true);
    assertEq(v3.history[1].pickIndex, null);
    assertEq(v3.history[1].gridIndex, null);
    // 기존 필드 보존
    assertEq(v3.history[0].tier, "A");
    assertEq(v3.history[1].tier, "G");
  });

  test("migrateV2ToV3: schemaVersion = 3 갱신 (M3에서 v3까지만, v4는 별도 migrateV3ToV4)", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [], dcTickets: [], dcResults: [],
      meta: { schemaVersion: 2 },
      unopenedTickets: [],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.meta.schemaVersion, 3);  // M3: v3까지만 마킹 (v4 마이그레이션은 migrateV3ToV4 별도 호출)
  });

  test("migrateV2ToV3: 박스 / 인벤토리 / DC 보존", () => {
    const ticket = { id: "t1", purchasedAt: 100 };
    const dcT = { boxId: "abc", drawIndex: 0, time: 50 };
    const dcR = { isWin: true, time: 75 };
    const v2 = {
      seed: 1, boxRound: 1,
      boxState: { id: "abc", deck: ["A", "B"], drawnCount: 5, totalSize: 80 },
      history: [], dcTickets: [dcT], dcResults: [dcR],
      meta: { schemaVersion: 2 },
      unopenedTickets: [ticket],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.boxState.id, "abc");
    assertEq(v3.boxState.deck.length, 2);
    assertEq(v3.boxState.drawnCount, 5);
    assertEq(v3.unopenedTickets.length, 1);
    assertEq(v3.unopenedTickets[0].id, "t1");
    assertEq(v3.dcTickets.length, 1);
    assertEq(v3.dcResults.length, 1);
    assertEq(v3.dcResults[0].isWin, true);
  });

  test("migrateV2ToV3: 이미 revealed 있는 항목은 보존 (idempotent)", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [
        { time: 100, tier: "A", typeIndex: 0, isLastOne: false, revealed: true, pickIndex: 5 },
      ],
      dcTickets: [], dcResults: [],
      meta: { schemaVersion: 2 },
      unopenedTickets: [],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.history[0].revealed, true);
    assertEq(v3.history[0].pickIndex, 5);  // 보존
  });

  test("loadState 신규 사용자 → 기본값 (settingsSkipPick = false, pickHintSeen = false, schemaVersion = SCHEMA_VERSION)", () => {
    clearAll();
    const s = loadState();
    assertEq(s.settingsSkipPick, BUY_SKIP_PICK_DEFAULT);
    assertEq(s.meta.pickHintSeen, false);  // deprecated 키 호환
    assertEq(s.meta.schemaVersion, SCHEMA_VERSION);  // M3: 4
    clearAll();
  });

  test("saveState + loadState 라운드트립: settingsSkipPick", () => {
    clearAll();
    saveState({ settingsSkipPick: true });
    const s = loadState();
    assertEq(s.settingsSkipPick, true);
    saveState({ settingsSkipPick: false });
    const s2 = loadState();
    assertEq(s2.settingsSkipPick, false);
    clearAll();
  });

  test("saveState + loadState 라운드트립: meta.pickHintSeen", () => {
    clearAll();
    const s0 = loadState();
    saveState({ meta: { ...s0.meta, pickHintSeen: true } });
    const s = loadState();
    assertEq(s.meta.pickHintSeen, true);
    clearAll();
  });

  // M2.1 B-α: migrateV2ToV3에 unopenedTickets[*].lockedResult: null backfill
  test("migrateV2ToV3: unopenedTickets 항목 backfill (lockedResult: null)", () => {
    const v2 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [], dcTickets: [], dcResults: [],
      meta: { schemaVersion: 2 },
      unopenedTickets: [
        { id: "t1", purchasedAt: 100 },  // lockedResult 누락
        { id: "t2", purchasedAt: 200 },
      ],
    };
    const v3 = migrateV2ToV3(v2);
    assertEq(v3.unopenedTickets.length, 2);
    assertEq(v3.unopenedTickets[0].lockedResult, null);
    assertEq(v3.unopenedTickets[1].lockedResult, null);
    // 기존 필드 보존
    assertEq(v3.unopenedTickets[0].id, "t1");
    assertEq(v3.unopenedTickets[1].id, "t2");
  });

  // M2.1 B-α 재정정: migrateV3InPlace - 기존 v3 사용자의 lockedResult 부재 항목 backfill
  test("migrateV3InPlace: lockedResult 부재 ticket에 null 부여 (멱등)", () => {
    const v3 = {
      seed: 1, boxRound: 1, boxState: null,
      history: [], dcTickets: [], dcResults: [],
      meta: { schemaVersion: 3, pickHintSeen: false },
      unopenedTickets: [
        { id: "t1", purchasedAt: 100 },  // lockedResult 부재 (M2.1 1차 코드 산출물)
        { id: "t2", purchasedAt: 200, lockedResult: null },  // 이미 정의됨
        { id: "t3", purchasedAt: 300, lockedResult: { tier: "A", typeIndex: 0 } },  // 보유
      ],
      settingsSkipPick: false,
    };
    const out = migrateV3InPlace(v3);
    assertEq(out.unopenedTickets[0].lockedResult, null);  // backfill
    assertEq(out.unopenedTickets[1].lockedResult, null);  // 보존
    assertEq(out.unopenedTickets[2].lockedResult.tier, "A");  // 보존
    // schemaVersion 그대로
    assertEq(out.meta.schemaVersion, 3);
  });

  test("migrateV3InPlace: 모든 ticket이 이미 lockedResult 정의 → 변경 없음 (멱등)", () => {
    const v3 = {
      unopenedTickets: [
        { id: "t1", lockedResult: null },
        { id: "t2", lockedResult: { tier: "A" } },
      ],
    };
    const out = migrateV3InPlace(v3);
    assertEq(out.unopenedTickets[0].lockedResult, null);
    assertEq(out.unopenedTickets[1].lockedResult.tier, "A");
  });
});
