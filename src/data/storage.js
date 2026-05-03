// localStorage 입출력 + 메모리 fallback. core/는 본 모듈을 import 하지 않는다 (03_architecture 2.4).

import { STORAGE_KEY_PREFIX, SCHEMA_VERSION, BOX_ROUND_INITIAL, BUY_SKIP_PICK_DEFAULT } from "./numbers.js";

const KEYS = {
  seed: `${STORAGE_KEY_PREFIX}seed`,
  boxRound: `${STORAGE_KEY_PREFIX}box_round`,
  boxState: `${STORAGE_KEY_PREFIX}box_state`,
  history: `${STORAGE_KEY_PREFIX}history`,
  dcTickets: `${STORAGE_KEY_PREFIX}dc_tickets`,
  dcResults: `${STORAGE_KEY_PREFIX}dc_results`,
  meta: `${STORAGE_KEY_PREFIX}meta`,
  unopenedTickets: `${STORAGE_KEY_PREFIX}unopened_tickets`,  // M2
  settingsSkipPick: `${STORAGE_KEY_PREFIX}settings_skip_pick`,  // M2.1
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

// M2.1: v2 → v3 마이그레이션 (02_data 3.2.3, 03_architecture 3.10).
// 외부 노출 (단위 테스트 storage_v3.test.js).
export function migrateV2ToV3(input) {
  const next = { ...input };
  // (a) settingsSkipPick 초기화
  if (next.settingsSkipPick === undefined || next.settingsSkipPick === null) {
    next.settingsSkipPick = BUY_SKIP_PICK_DEFAULT;
  }
  // (b) meta.pickHintSeen 초기화
  next.meta = { ...next.meta };
  if (next.meta.pickHintSeen === undefined || next.meta.pickHintSeen === null) {
    next.meta.pickHintSeen = false;
  }
  // (c) history 항목 backfill
  if (Array.isArray(next.history)) {
    next.history = next.history.map((entry) => {
      if (!entry) return entry;
      const patched = { ...entry };
      if (patched.revealed === undefined || patched.revealed === null) {
        patched.revealed = true;  // 기존 항목은 이미 노출 완료로 간주 (B-α: deprecated 필드, 호환만)
      }
      if (patched.pickIndex === undefined) {
        patched.pickIndex = null;
      }
      if (patched.gridIndex === undefined) {
        patched.gridIndex = null;
      }
      return patched;
    });
  }
  // (d) unopenedTickets 항목 backfill (B-α 신설 lockedResult 필드)
  if (Array.isArray(next.unopenedTickets)) {
    next.unopenedTickets = next.unopenedTickets.map((ticket) => {
      if (!ticket) return ticket;
      if (ticket.lockedResult === undefined) {
        return { ...ticket, lockedResult: null };
      }
      return ticket;
    });
  }
  // (e) schemaVersion 갱신
  next.meta.schemaVersion = SCHEMA_VERSION;
  return next;
}

// M2.1 B-α 재정정 in-place backfill (02_data 3.2.4, schemaVersion bump 없음, 멱등).
// M2.1 1차 코드(T1~T17)로 v3까지 마이그레이션 완료된 사용자 → B-α 재정정 후 lockedResult 부재 항목 보강.
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

export function loadState() {
  isStorageAvailable();
  const seedRaw = getRaw(KEYS.seed);
  const seed = seedRaw === null ? null : Number(seedRaw);
  const boxRoundRaw = getRaw(KEYS.boxRound);
  const boxRound = boxRoundRaw === null ? BOX_ROUND_INITIAL : Number(boxRoundRaw);
  const boxState = readJson(KEYS.boxState, null);
  const history = readJson(KEYS.history, []);
  const dcTickets = readJson(KEYS.dcTickets, []);
  const dcResults = readJson(KEYS.dcResults, []);
  const meta = readJson(KEYS.meta, { disclaimerSeen: false, schemaVersion: SCHEMA_VERSION, pickHintSeen: false });
  let unopenedTickets = readJson(KEYS.unopenedTickets, []);
  const skipPickRaw = getRaw(KEYS.settingsSkipPick);
  let settingsSkipPick = skipPickRaw === null ? null : skipPickRaw === "true";

  let state = { seed, boxRound, boxState, history, dcTickets, dcResults, meta, unopenedTickets, settingsSkipPick };

  // 마이그레이션: v0/v1 → v2 (M2 신규 키 unopenedTickets) → v3 (M2.1 신규 키 + history backfill + lockedResult).
  const currentVersion = state.meta.schemaVersion ?? 1;
  if (currentVersion < SCHEMA_VERSION) {
    // v1 → v2: unopenedTickets 초기화
    if (currentVersion < 2) {
      state.unopenedTickets = [];
    }
    // v2 → v3: M2.1 신규 키 + history / unopenedTickets backfill
    state = migrateV2ToV3(state);
    // 영속
    writeJson(KEYS.meta, state.meta);
    writeJson(KEYS.unopenedTickets, state.unopenedTickets);
    writeJson(KEYS.history, state.history);
    setRaw(KEYS.settingsSkipPick, String(state.settingsSkipPick));
  } else {
    // 이미 v3 사용자 → B-α 재정정 in-place backfill (멱등)
    const before = state.unopenedTickets;
    state = migrateV3InPlace(state);
    if (state.unopenedTickets !== before) {
      writeJson(KEYS.unopenedTickets, state.unopenedTickets);
    }
    if (state.settingsSkipPick === null) {
      state.settingsSkipPick = BUY_SKIP_PICK_DEFAULT;
      setRaw(KEYS.settingsSkipPick, String(state.settingsSkipPick));
    }
  }
  if (state.meta.pickHintSeen === undefined || state.meta.pickHintSeen === null) {
    state.meta.pickHintSeen = false;
    writeJson(KEYS.meta, state.meta);
  }

  return {
    ...state,
    storageMode: _useMemoryFallback ? "memory" : "persistent",
  };
}

export function saveState(partial) {
  if ("seed" in partial && partial.seed !== null && partial.seed !== undefined) {
    setRaw(KEYS.seed, String(partial.seed));
  }
  if ("boxRound" in partial && partial.boxRound !== undefined) {
    setRaw(KEYS.boxRound, String(partial.boxRound));
  }
  if ("boxState" in partial) writeJson(KEYS.boxState, partial.boxState);
  if ("history" in partial) writeJson(KEYS.history, partial.history);
  if ("dcTickets" in partial) writeJson(KEYS.dcTickets, partial.dcTickets);
  if ("dcResults" in partial) writeJson(KEYS.dcResults, partial.dcResults);
  if ("meta" in partial) writeJson(KEYS.meta, partial.meta);
  if ("unopenedTickets" in partial) writeJson(KEYS.unopenedTickets, partial.unopenedTickets);
  if ("settingsSkipPick" in partial && partial.settingsSkipPick !== undefined) {
    setRaw(KEYS.settingsSkipPick, String(Boolean(partial.settingsSkipPick)));
  }
}

export function clearAll() {
  for (const k of Object.values(KEYS)) removeRaw(k);
  _memoryStore = {};
}

export function getStorageMode() {
  return _useMemoryFallback ? "memory" : "persistent";
}
