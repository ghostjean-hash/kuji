// localStorage 입출력 + 메모리 fallback. core/는 본 모듈을 import 하지 않는다 (03_architecture 2.4).
// M3: 다중 라인업 격리 (라인업별 prefix 키 + 전역 키 분리). 02_data 3.1 / 3.2.5.
// M3.1: 라인업 로비 (kuji_lobby_acked 신설). 02_data 3.1.2 / 3.2.6.

import { STORAGE_KEY_PREFIX, SCHEMA_VERSION, BOX_ROUND_INITIAL, BUY_SKIP_PICK_DEFAULT, LINEUP_DEFAULT_ID } from "./numbers.js";

// 전역 키 (라인업 무관)
const GLOBAL_KEYS = {
  seed: `${STORAGE_KEY_PREFIX}seed`,
  meta: `${STORAGE_KEY_PREFIX}meta`,
  settingsSkipPick: `${STORAGE_KEY_PREFIX}settings_skip_pick`,  // M2.1
  currentLineupId: `${STORAGE_KEY_PREFIX}current_lineup_id`,  // M3
  lobbyAcked: `${STORAGE_KEY_PREFIX}lobby_acked`,  // M3.1
  schemaVersion: `${STORAGE_KEY_PREFIX}schema_version`,  // M3
};

// 라인업별 격리 키 (lineup_id suffix 부여)
const LINEUP_KEY_NAMES = ["box_round", "box_state", "history", "dc_tickets", "dc_results", "unopened_tickets"];

function lineupKey(name, lineupId) {
  return `${STORAGE_KEY_PREFIX}${name}_${lineupId}`;
}

// 구 (v3 이전) 단일 라인업 키 - 마이그레이션에서만 사용
const LEGACY_KEYS = {
  boxRound: `${STORAGE_KEY_PREFIX}box_round`,
  boxState: `${STORAGE_KEY_PREFIX}box_state`,
  history: `${STORAGE_KEY_PREFIX}history`,
  dcTickets: `${STORAGE_KEY_PREFIX}dc_tickets`,
  dcResults: `${STORAGE_KEY_PREFIX}dc_results`,
  unopenedTickets: `${STORAGE_KEY_PREFIX}unopened_tickets`,
};

let _memoryStore = {};
let _useMemoryFallback = false;

function _ls() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

export function isStorageAvailable() {
  if (_useMemoryFallback) return false;
  const ls = _ls();
  if (!ls) {
    _useMemoryFallback = true;
    return false;
  }
  try {
    const k = `${STORAGE_KEY_PREFIX}__test__`;
    ls.setItem(k, "1");
    ls.removeItem(k);
    return true;
  } catch (e) {
    _useMemoryFallback = true;
    return false;
  }
}

function getRaw(key) {
  if (_useMemoryFallback) return _memoryStore[key] ?? null;
  const ls = _ls();
  if (!ls) {
    _useMemoryFallback = true;
    return _memoryStore[key] ?? null;
  }
  try {
    return ls.getItem(key);
  } catch (e) {
    _useMemoryFallback = true;
    return _memoryStore[key] ?? null;
  }
}

function setRaw(key, value) {
  if (_useMemoryFallback) { _memoryStore[key] = value; return; }
  const ls = _ls();
  if (!ls) {
    _useMemoryFallback = true;
    _memoryStore[key] = value;
    return;
  }
  try {
    ls.setItem(key, value);
  } catch (e) {
    _useMemoryFallback = true;
    _memoryStore[key] = value;
  }
}

function removeRaw(key) {
  if (_useMemoryFallback) { delete _memoryStore[key]; return; }
  const ls = _ls();
  if (!ls) {
    _useMemoryFallback = true;
    delete _memoryStore[key];
    return;
  }
  try {
    ls.removeItem(key);
  } catch (e) {
    _useMemoryFallback = true;
    delete _memoryStore[key];
  }
}

function readJson(key, fallback) {
  const raw = getRaw(key);
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeJson(key, value) {
  setRaw(key, JSON.stringify(value));
}

// =====================================================================
// 마이그레이션
// =====================================================================

// M2.1: v2 → v3 마이그레이션 (02_data 3.2.3, 03_architecture 3.10).
// 외부 노출 (단위 테스트 storage_v3.test.js).
export function migrateV2ToV3(input) {
  const next = { ...input };
  if (next.settingsSkipPick === undefined || next.settingsSkipPick === null) {
    next.settingsSkipPick = BUY_SKIP_PICK_DEFAULT;
  }
  next.meta = { ...next.meta };
  if (next.meta.pickHintSeen === undefined || next.meta.pickHintSeen === null) {
    next.meta.pickHintSeen = false;  // M3 deprecated 호환만
  }
  if (Array.isArray(next.history)) {
    next.history = next.history.map((entry) => {
      if (!entry) return entry;
      const patched = { ...entry };
      if (patched.revealed === undefined || patched.revealed === null) {
        patched.revealed = true;
      }
      if (patched.pickIndex === undefined) patched.pickIndex = null;
      if (patched.gridIndex === undefined) patched.gridIndex = null;
      return patched;
    });
  }
  if (Array.isArray(next.unopenedTickets)) {
    next.unopenedTickets = next.unopenedTickets.map((ticket) => {
      if (!ticket) return ticket;
      if (ticket.lockedResult === undefined) {
        return { ...ticket, lockedResult: null };
      }
      return ticket;
    });
  }
  next.meta.schemaVersion = 3;  // v3로 마킹 (이후 v3→v4가 별도 진행)
  return next;
}

// M2.1 B-α 재정정 in-place backfill (02_data 3.2.4, schemaVersion bump 없음, 멱등).
export function migrateV3InPlace(input) {
  const next = { ...input };
  if (Array.isArray(next.unopenedTickets)) {
    let mutated = false;
    const patched = next.unopenedTickets.map((ticket) => {
      if (!ticket) return ticket;
      if (ticket.lockedResult === undefined) {
        mutated = true;
        return { ...ticket, lockedResult: null };
      }
      return ticket;
    });
    if (mutated) next.unopenedTickets = patched;
  }
  return next;
}

// M3: v3 → v4 마이그레이션 (02_data 3.2.5).
// LEGACY 단일 라인업 키 (v3 이전) → 라인업별 격리 키 이전. 멱등 보장.
// LEGACY 키 부재 시 신규 사용자로 간주 (마이그레이션 작업 없음, current_lineup_id + schema_version만 신설).
// 외부 노출 (단위 테스트 storage_v4.test.js).
export function migrateV3ToV4() {
  const detectedLineupId = LINEUP_DEFAULT_ID;
  // 멱등 점검: 이미 v4면 skip.
  const versionRaw = getRaw(GLOBAL_KEYS.schemaVersion);
  if (versionRaw !== null && Number(versionRaw) >= 4) {
    return { migrated: false, reason: "already_v4" };
  }
  let migratedAny = false;
  for (const name of LINEUP_KEY_NAMES) {
    const legacyKey = `${STORAGE_KEY_PREFIX}${name}`;
    const value = getRaw(legacyKey);
    if (value !== null && value !== undefined) {
      const targetKey = lineupKey(name, detectedLineupId);
      // target에 이미 값이 있으면 source 우선 (사용자 데이터 보존). 단 source 잔존 시 정상 v3 마이그레이션.
      const targetExisting = getRaw(targetKey);
      if (targetExisting === null || targetExisting === undefined) {
        setRaw(targetKey, value);
      }
      removeRaw(legacyKey);
      migratedAny = true;
    }
  }
  // current_lineup_id 신설 (이미 있으면 보존)
  if (getRaw(GLOBAL_KEYS.currentLineupId) === null) {
    setRaw(GLOBAL_KEYS.currentLineupId, detectedLineupId);
  }
  // schema_version = 4 갱신
  setRaw(GLOBAL_KEYS.schemaVersion, "4");
  return { migrated: migratedAny, reason: "v3_to_v4" };
}

// M3.1: v4 → v5 마이그레이션 (02_data 3.2.6).
// 멱등 게이트: schemaVersion ≥ 5 || kuji_lobby_acked !== null → return.
// existingLineupId !== null → 기존 사용자 (lobbyAcked=true, 로비 재노출 안 함).
// else → 첫 방문자 (lobbyAcked=false, 로비 노출).
// 외부 노출 (단위 테스트 storage_v5.test.js).
export function migrateV4ToV5() {
  const versionRaw = getRaw(GLOBAL_KEYS.schemaVersion);
  if (versionRaw !== null && Number(versionRaw) >= 5) {
    return { migrated: false, reason: "already_v5" };
  }
  if (getRaw(GLOBAL_KEYS.lobbyAcked) !== null) {
    // 이미 lobby_acked 키가 존재 = 본 마이그레이션 적용 후 또는 v5 사용자. schemaVersion만 갱신.
    if (versionRaw === null || Number(versionRaw) < 5) {
      setRaw(GLOBAL_KEYS.schemaVersion, "5");
    }
    return { migrated: false, reason: "lobby_acked_already_set" };
  }
  const existingLineupId = getRaw(GLOBAL_KEYS.currentLineupId);
  const lobbyAcked = existingLineupId !== null ? "true" : "false";
  setRaw(GLOBAL_KEYS.lobbyAcked, lobbyAcked);
  setRaw(GLOBAL_KEYS.schemaVersion, "5");
  return { migrated: true, reason: "v4_to_v5", lobbyAcked };
}

// =====================================================================
// 라인업별 state load / save
// =====================================================================

export function loadStateForLineup(lineupId) {
  isStorageAvailable();
  const boxRoundRaw = getRaw(lineupKey("box_round", lineupId));
  const boxRound = boxRoundRaw === null ? BOX_ROUND_INITIAL : Number(boxRoundRaw);
  const boxState = readJson(lineupKey("box_state", lineupId), null);
  const history = readJson(lineupKey("history", lineupId), []);
  const dcTickets = readJson(lineupKey("dc_tickets", lineupId), []);
  const dcResults = readJson(lineupKey("dc_results", lineupId), []);
  let unopenedTickets = readJson(lineupKey("unopened_tickets", lineupId), []);

  let lineupState = { boxRound, boxState, history, dcTickets, dcResults, unopenedTickets };

  // M2.1 B-α 재정정 in-place backfill 적용 (라인업별 멱등).
  const before = lineupState.unopenedTickets;
  lineupState = migrateV3InPlace(lineupState);
  if (lineupState.unopenedTickets !== before) {
    writeJson(lineupKey("unopened_tickets", lineupId), lineupState.unopenedTickets);
  }

  return lineupState;
}

export function saveStateForLineup(lineupId, partial) {
  if ("boxRound" in partial && partial.boxRound !== undefined) {
    setRaw(lineupKey("box_round", lineupId), String(partial.boxRound));
  }
  if ("boxState" in partial) writeJson(lineupKey("box_state", lineupId), partial.boxState);
  if ("history" in partial) writeJson(lineupKey("history", lineupId), partial.history);
  if ("dcTickets" in partial) writeJson(lineupKey("dc_tickets", lineupId), partial.dcTickets);
  if ("dcResults" in partial) writeJson(lineupKey("dc_results", lineupId), partial.dcResults);
  if ("unopenedTickets" in partial) writeJson(lineupKey("unopened_tickets", lineupId), partial.unopenedTickets);
}

// =====================================================================
// 전역 settings load / save
// =====================================================================

export function loadGlobalSettings() {
  isStorageAvailable();
  const seedRaw = getRaw(GLOBAL_KEYS.seed);
  const seed = seedRaw === null ? null : Number(seedRaw);
  const meta = readJson(GLOBAL_KEYS.meta, { disclaimerSeen: false, schemaVersion: SCHEMA_VERSION, pickHintSeen: false });
  const skipPickRaw = getRaw(GLOBAL_KEYS.settingsSkipPick);
  let settingsSkipPick = skipPickRaw === null ? null : skipPickRaw === "true";
  if (settingsSkipPick === null) settingsSkipPick = BUY_SKIP_PICK_DEFAULT;
  const currentLineupIdRaw = getRaw(GLOBAL_KEYS.currentLineupId);
  const currentLineupId = currentLineupIdRaw ?? LINEUP_DEFAULT_ID;
  // M3.1: lobbyAcked 역직렬화 (string "true" / "false" / null → boolean)
  const lobbyAckedRaw = getRaw(GLOBAL_KEYS.lobbyAcked);
  const lobbyAcked = lobbyAckedRaw === "true";

  return { seed, meta, settingsSkipPick, currentLineupId, lobbyAcked };
}

export function saveGlobalSettings(partial) {
  if ("seed" in partial && partial.seed !== null && partial.seed !== undefined) {
    setRaw(GLOBAL_KEYS.seed, String(partial.seed));
  }
  if ("meta" in partial) writeJson(GLOBAL_KEYS.meta, partial.meta);
  if ("settingsSkipPick" in partial && partial.settingsSkipPick !== undefined) {
    setRaw(GLOBAL_KEYS.settingsSkipPick, String(Boolean(partial.settingsSkipPick)));
  }
  if ("currentLineupId" in partial && partial.currentLineupId) {
    setRaw(GLOBAL_KEYS.currentLineupId, partial.currentLineupId);
  }
  // M3.1: lobbyAcked 직렬화 (boolean → "true" / "false")
  if ("lobbyAcked" in partial && partial.lobbyAcked !== undefined) {
    setRaw(GLOBAL_KEYS.lobbyAcked, String(Boolean(partial.lobbyAcked)));
  }
}

// =====================================================================
// 통합 진입점 (M2.1 호환 + M3 라인업 격리)
// =====================================================================

// M3 진입점: 마이그레이션 점검 → globalSettings + 활성 라인업 state 통합 반환.
// 호출처는 main.js mount(). 결과 = { seed, boxRound, boxState, history, dcTickets, dcResults, meta, unopenedTickets, settingsSkipPick, currentLineupId, storageMode }.
export function loadState() {
  isStorageAvailable();

  // 1) v2(이전) → v3 마이그레이션 (LEGACY 키 보유 + meta.schemaVersion < 3 시).
  const legacyMeta = readJson(GLOBAL_KEYS.meta, null);
  const legacyVersion = legacyMeta && legacyMeta.schemaVersion ? legacyMeta.schemaVersion : 1;
  const hasLegacyData = LEGACY_KEYS.unopenedTickets && getRaw(LEGACY_KEYS.unopenedTickets) !== null
    || getRaw(LEGACY_KEYS.history) !== null
    || getRaw(LEGACY_KEYS.boxState) !== null;

  if (legacyVersion < 3 && hasLegacyData) {
    // v2 → v3 마이그레이션 (LEGACY 키 기반)
    const v2State = {
      seed: null,
      boxRound: null,
      boxState: readJson(LEGACY_KEYS.boxState, null),
      history: readJson(LEGACY_KEYS.history, []),
      dcTickets: readJson(LEGACY_KEYS.dcTickets, []),
      dcResults: readJson(LEGACY_KEYS.dcResults, []),
      meta: legacyMeta || { disclaimerSeen: false, schemaVersion: 1 },
      unopenedTickets: readJson(LEGACY_KEYS.unopenedTickets, []),
      settingsSkipPick: getRaw(GLOBAL_KEYS.settingsSkipPick) === "true",
    };
    const v3State = migrateV2ToV3(v2State);
    // v3 결과를 LEGACY 키에 영속 (v3→v4가 다음에 LEGACY → 라인업별로 이전)
    writeJson(LEGACY_KEYS.unopenedTickets, v3State.unopenedTickets);
    writeJson(LEGACY_KEYS.history, v3State.history);
    writeJson(GLOBAL_KEYS.meta, v3State.meta);
    setRaw(GLOBAL_KEYS.settingsSkipPick, String(v3State.settingsSkipPick));
  }

  // 2) v3 → v4 마이그레이션 (LEGACY 키를 LINEUP_DEFAULT_ID 격리 키로 이전)
  migrateV3ToV4();

  // 2-M3.1) v4 → v5 마이그레이션 (lobbyAcked 추론 + 신설)
  migrateV4ToV5();

  // 3) global + 활성 라인업 state 로드
  const globalSettings = loadGlobalSettings();
  // currentLineupId 미존재 시 LINEUP_DEFAULT_ID 부여 + 영속
  if (getRaw(GLOBAL_KEYS.currentLineupId) === null) {
    saveGlobalSettings({ currentLineupId: LINEUP_DEFAULT_ID });
    globalSettings.currentLineupId = LINEUP_DEFAULT_ID;
  }
  const lineupState = loadStateForLineup(globalSettings.currentLineupId);

  // 4) 통합
  const state = {
    seed: globalSettings.seed,
    meta: globalSettings.meta,
    settingsSkipPick: globalSettings.settingsSkipPick,
    currentLineupId: globalSettings.currentLineupId,
    lobbyAcked: globalSettings.lobbyAcked,  // M3.1
    ...lineupState,
  };

  // pickHintSeen 호환 유지 (deprecated)
  if (state.meta.pickHintSeen === undefined || state.meta.pickHintSeen === null) {
    state.meta.pickHintSeen = false;
  }

  return {
    ...state,
    storageMode: _useMemoryFallback ? "memory" : "persistent",
  };
}

// 통합 saveState (M2.1 호환). currentLineupId 인자로 라인업별/전역 키 자동 분기.
export function saveState(partial) {
  const lineupId = partial.currentLineupId || readGlobalCurrentLineupId() || LINEUP_DEFAULT_ID;

  // 전역 분리
  const globalPartial = {};
  if ("seed" in partial) globalPartial.seed = partial.seed;
  if ("meta" in partial) globalPartial.meta = partial.meta;
  if ("settingsSkipPick" in partial) globalPartial.settingsSkipPick = partial.settingsSkipPick;
  if ("currentLineupId" in partial) globalPartial.currentLineupId = partial.currentLineupId;
  if ("lobbyAcked" in partial) globalPartial.lobbyAcked = partial.lobbyAcked;  // M3.1
  if (Object.keys(globalPartial).length > 0) saveGlobalSettings(globalPartial);

  // 라인업별 분리
  const lineupPartial = {};
  if ("boxRound" in partial) lineupPartial.boxRound = partial.boxRound;
  if ("boxState" in partial) lineupPartial.boxState = partial.boxState;
  if ("history" in partial) lineupPartial.history = partial.history;
  if ("dcTickets" in partial) lineupPartial.dcTickets = partial.dcTickets;
  if ("dcResults" in partial) lineupPartial.dcResults = partial.dcResults;
  if ("unopenedTickets" in partial) lineupPartial.unopenedTickets = partial.unopenedTickets;
  if (Object.keys(lineupPartial).length > 0) saveStateForLineup(lineupId, lineupPartial);
}

function readGlobalCurrentLineupId() {
  const raw = getRaw(GLOBAL_KEYS.currentLineupId);
  return raw || null;
}

// =====================================================================
// clearAll / 모드
// =====================================================================

export function clearAll() {
  // 전역 키
  for (const k of Object.values(GLOBAL_KEYS)) removeRaw(k);
  // 라인업별 키 (현재 LINEUPS의 모든 lineup_id에 대해)
  // 단, LINEUPS를 import하면 numbers.js 의존이 깊어짐. 대신 모든 prefix 키 grep으로 제거.
  if (!_useMemoryFallback) {
    const ls = _ls();
    if (ls) {
      try {
        const keysToRemove = [];
        for (let i = 0; i < ls.length; i++) {
          const k = ls.key(i);
          if (k && k.startsWith(STORAGE_KEY_PREFIX)) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => removeRaw(k));
      } catch (e) {}
    }
  }
  // memory store도 prefix 기반 제거
  for (const k of Object.keys(_memoryStore)) {
    if (k.startsWith(STORAGE_KEY_PREFIX)) delete _memoryStore[k];
  }
  _memoryStore = {};
}

export function getStorageMode() {
  return _useMemoryFallback ? "memory" : "persistent";
}
