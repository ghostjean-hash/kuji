// localStorage 입출력 + 메모리 fallback. core/는 본 모듈을 import 하지 않는다 (03_architecture 2.4).

import { STORAGE_KEY_PREFIX, SCHEMA_VERSION, BOX_ROUND_INITIAL } from "./numbers.js";

const KEYS = {
  seed: `${STORAGE_KEY_PREFIX}seed`,
  boxRound: `${STORAGE_KEY_PREFIX}box_round`,
  boxState: `${STORAGE_KEY_PREFIX}box_state`,
  history: `${STORAGE_KEY_PREFIX}history`,
  dcTickets: `${STORAGE_KEY_PREFIX}dc_tickets`,
  dcResults: `${STORAGE_KEY_PREFIX}dc_results`,
  meta: `${STORAGE_KEY_PREFIX}meta`,
  unopenedTickets: `${STORAGE_KEY_PREFIX}unopened_tickets`,  // M2
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
  const meta = readJson(KEYS.meta, { disclaimerSeen: false, schemaVersion: SCHEMA_VERSION });
  let unopenedTickets = readJson(KEYS.unopenedTickets, []);

  // M2: v1 → v2 마이그레이션. 기존 사용자에게 unopenedTickets = [] 초기화 + schemaVersion 갱신.
  if ((meta.schemaVersion ?? 1) < SCHEMA_VERSION) {
    unopenedTickets = [];
    meta.schemaVersion = SCHEMA_VERSION;
    writeJson(KEYS.meta, meta);
    writeJson(KEYS.unopenedTickets, unopenedTickets);
  }

  return {
    seed, boxRound, boxState, history, dcTickets, dcResults, meta, unopenedTickets,
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
}

export function clearAll() {
  for (const k of Object.values(KEYS)) removeRaw(k);
  _memoryStore = {};
}

export function getStorageMode() {
  return _useMemoryFallback ? "memory" : "persistent";
}
