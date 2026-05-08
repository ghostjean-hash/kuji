// 진입 + state + dispatch + 4탭 라우팅.
// M2: 구매 / 뜯기 메커닉. M2.1: 통 선택 (B-α). M3: 다중 라인업.

import { loadState, saveState, clearAll } from "../data/storage.js";
import {
  BOX_ROUND_INITIAL,
  DEFAULT_SEED_FALLBACK_BITS,
  LINEUPS,
  LINEUP_DEFAULT_ID,
  getLineupById,
  PEEL_DURATION_MS,
  PICK_AUTO_CONFIRM_DELAY_MS,
} from "../data/numbers.js";
import { initBox } from "../core/box.js";
import { drawOne } from "../core/draw.js";
import { addTicket, drawDc } from "../core/double_chance.js";
import { appendHistory } from "../core/history.js";
import { createRng } from "../core/random.js";
import { fnv1a } from "../core/hash.js";
import { addUnopenedTickets, removeTicket } from "../core/buy.js";
import { buildConsumedGridSet } from "../core/pick-grid.js";

import { renderHeader } from "./header.js";
import { renderBottomTabs } from "./bottom-tabs.js";
import { renderDrawTab } from "./draw-tab.js";
import { renderHistoryTab } from "./history-tab.js";
import { renderDcTab } from "./dc-tab.js";
import { renderSettingsTab } from "./settings-tab.js";
import { showDcResultModal } from "./dc-result-modal.js";
import { showConfirmModal } from "./confirm-modal.js";
import { showDisclaimerSheet } from "./disclaimer-sheet.js";
import { showStorageFallbackSheet } from "./storage-fallback-sheet.js";
import { attachKeyboard } from "../input/keyboard.js";

const TAB_DRAW = "draw";
const TAB_HISTORY = "history";
const TAB_DC = "dc";
const TAB_SETTINGS = "settings";

let state = null;
let rootEl = null;

// 활성 라인업 객체 동적 lookup. state.currentLineupId 의존.
function activeLineup() {
  return getLineupById(state.currentLineupId);
}

function scrollToTier(tier) {
  if (!tier) return;
  const safe = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(tier) : tier.replace(/"/g, '\\"');
  const el = document.querySelector(
    `.hero-card[data-tier="${safe}"], .minor-row-item[data-tier="${safe}"], .last-one-row[data-tier="${safe}"]`
  );
  if (el && el.scrollIntoView) {
    try {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    } catch (e) {}
  }
}

function generateDefaultSeed() {
  const bits = DEFAULT_SEED_FALLBACK_BITS;
  return (Date.now() % Math.pow(2, bits)) >>> 0;
}

function ensureBoxState(s) {
  if (!s.boxState || !Array.isArray(s.boxState.deck) || s.boxState.totalSize === undefined) {
    if (s.seed === null || s.seed === undefined) s.seed = generateDefaultSeed();
    s.boxState = initBox(s.seed, s.boxRound, getLineupById(s.currentLineupId));
  }
  return s;
}

// state를 currentLineupId 기준으로 영속.
function persist() {
  saveState({
    seed: state.seed,
    currentLineupId: state.currentLineupId,
    boxRound: state.boxRound,
    boxState: state.boxState,
    history: state.history,
    dcTickets: state.dcTickets,
    dcResults: state.dcResults,
    meta: state.meta,
    unopenedTickets: state.unopenedTickets,
    settingsSkipPick: state.settingsSkipPick,
  });
}

// raw 매수 (lockedResult 미부여) 카운트.
function countRawTickets(s) {
  if (!Array.isArray(s.unopenedTickets)) return 0;
  let n = 0;
  for (const t of s.unopenedTickets) {
    if (t && (t.lockedResult === null || t.lockedResult === undefined)) n++;
  }
  return n;
}

// 통 선택 confirm 실행 (mutating state). 성공 시 true 반환.
function performPickConfirm() {
  if (state.boxState.deck.length === 0) return false;
  if (state.pendingPeelResult) return false;
  if (state.settingsSkipPick) return false;

  const sel = Array.isArray(state.selectedGridIndices) ? state.selectedGridIndices : [];
  if (sel.length === 0) return false;

  const rawTicketIndices = [];
  state.unopenedTickets.forEach((t, i) => {
    if (t && (t.lockedResult === null || t.lockedResult === undefined)) rawTicketIndices.push(i);
  });
  if (sel.length !== rawTicketIndices.length) return false;

  const lineup = activeLineup();
  const consumedSet = buildConsumedGridSet(state, lineup);

  const decklenSnapshot = state.boxState.deck.length;
  let availableCount = decklenSnapshot;
  const consumedCopy = new Set(consumedSet);
  const jList = [];
  for (let k = 0; k < sel.length; k++) {
    const gi = sel[k];
    if (consumedCopy.has(gi)) return false;
    let j = 0;
    for (let pos = 0; pos < gi; pos++) {
      if (!consumedCopy.has(pos)) j++;
    }
    if (j < 0 || j >= availableCount) return false;
    jList.push(j);
    consumedCopy.add(gi);
    availableCount--;
  }

  const newTickets = [...state.unopenedTickets];
  for (let k = 0; k < sel.length; k++) {
    const gi = sel[k];
    const j = jList[k];
    const drawIndex = state.boxState.drawnCount;
    const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
    const result = drawOne(state.boxState, drawRng, lineup, j);
    const ticketIdx = rawTicketIndices[k];
    newTickets[ticketIdx] = {
      ...newTickets[ticketIdx],
      lockedResult: { ...result, gridIndex: gi, drawIndex },
    };
  }

  state.unopenedTickets = newTickets;
  state.selectedGridIndices = [];
  return true;
}

function rerender() {
  rootEl.innerHTML = "";
  rootEl.appendChild(renderHeader(state, dispatch));
  const main = document.createElement("main");
  main.className = "tab-content";
  if (state.currentTab === TAB_DRAW) {
    main.appendChild(renderDrawTab(state, dispatch));
  } else if (state.currentTab === TAB_HISTORY) {
    main.appendChild(renderHistoryTab(state, dispatch));
  } else if (state.currentTab === TAB_DC) {
    main.appendChild(renderDcTab(state, dispatch));
  } else if (state.currentTab === TAB_SETTINGS) {
    main.appendChild(renderSettingsTab(state, dispatch));
  }
  rootEl.appendChild(main);
  rootEl.appendChild(renderBottomTabs(state, dispatch));
}

function dispatch(action) {
  switch (action.type) {
    case "change_tab": {
      state.currentTab = action.tab;
      rerender();
      break;
    }
    case "buy": {
      const count = action.count;
      const now = Date.now();
      state.unopenedTickets = addUnopenedTickets(state.unopenedTickets, count, now);
      state.lastBuyCount = count;
      persist();
      rerender();
      break;
    }
    case "auto_pick_select": {
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;

      const rawCount = countRawTickets(state);
      if (rawCount === 0) return;

      const lineup = activeLineup();
      const drawnSet = buildConsumedGridSet(state, lineup);
      const NORMAL_SLOT_COUNT = lineup.boxSize - 1;
      const auto = [];
      for (let i = 0; i < NORMAL_SLOT_COUNT && auto.length < rawCount; i++) {
        if (!drawnSet.has(i)) auto.push(i);
      }
      if (auto.length < rawCount) return;

      state.selectedGridIndices = auto;
      const ok = performPickConfirm();
      if (ok) {
        persist();
      } else {
        state.selectedGridIndices = [];
      }
      rerender();
      break;
    }
    case "toggle_pick_select": {
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;

      const gi = action.gridIndex;
      const rawCount = countRawTickets(state);
      if (rawCount === 0) return;

      const sel = Array.isArray(state.selectedGridIndices) ? [...state.selectedGridIndices] : [];
      const idx = sel.indexOf(gi);
      if (idx >= 0) {
        sel.splice(idx, 1);
      } else {
        if (sel.length >= rawCount) return;
        sel.push(gi);
      }
      state.selectedGridIndices = sel;
      rerender();

      if (sel.length === rawCount) {
        const expectedSnapshot = sel.length;
        setTimeout(() => {
          const cur = Array.isArray(state.selectedGridIndices) ? state.selectedGridIndices : [];
          if (cur.length !== expectedSnapshot) return;
          const ok = performPickConfirm();
          if (ok) {
            persist();
          } else {
            state.selectedGridIndices = [];
          }
          rerender();
        }, PICK_AUTO_CONFIRM_DELAY_MS);
      }
      break;
    }
    case "peel": {
      // M2 + B-α: 뜯기 = 페이지플립 카드 reveal 트리거.
      if (state.boxState.deck.length === 0 && !(state.unopenedTickets[0] && state.unopenedTickets[0].lockedResult)) return;
      if (state.unopenedTickets.length === 0) return;
      if (state.pendingPeelResult) return;

      const lineup = activeLineup();
      const firstTicket = state.unopenedTickets[0];
      let result;
      let entry;
      let requiresReceive;
      let drawIndex;
      let time;

      if (firstTicket && firstTicket.lockedResult) {
        // (a) B-α 흐름: ticket.lockedResult 사용
        result = firstTicket.lockedResult;
        time = Date.now();
        drawIndex = result.drawIndex !== undefined ? result.drawIndex : state.boxState.drawnCount - 1;
        entry = {
          time,
          boxId: state.boxState.id,
          drawIndex,
          tier: result.tier,
          typeIndex: result.typeIndex,
          nameJa: result.nameJa,
          nameKo: result.nameKo,
          sizeLabel: result.sizeLabel,
          isLastOne: result.isLastOne,
          pickIndex: result.pickIndex,
          gridIndex: result.gridIndex,
          revealed: true,
        };
        const tierMeta = lineup.tiers.find((t) => t.tier === result.tier);
        // requiresReceive: UI 플래그 (peel-card "확인" + hero-carousel "받기" 게이트). history append 게이트가 아님.
        requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;
        state.history = appendHistory(state.history, entry);
        state.dcTickets = addTicket(state.dcTickets, {
          boxId: state.boxState.id,
          drawIndex,
          time,
        });
        state.unopenedTickets = state.unopenedTickets.slice(1);
      } else {
        // (b) skip ON: drawOne 즉시 호출
        drawIndex = state.boxState.drawnCount;
        const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
        result = drawOne(state.boxState, drawRng, lineup);
        time = Date.now();
        entry = {
          time,
          boxId: state.boxState.id,
          drawIndex,
          tier: result.tier,
          typeIndex: result.typeIndex,
          nameJa: result.nameJa,
          nameKo: result.nameKo,
          sizeLabel: result.sizeLabel,
          isLastOne: result.isLastOne,
          pickIndex: result.pickIndex,
          gridIndex: null,
          revealed: true,
        };
        const tierMeta = lineup.tiers.find((t) => t.tier === result.tier);
        requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;
        state.history = appendHistory(state.history, entry);
        state.dcTickets = addTicket(state.dcTickets, {
          boxId: state.boxState.id,
          drawIndex,
          time,
        });
        state.unopenedTickets = removeTicket(state.unopenedTickets, action.ticketId);
      }
      persist();

      if (action.applyResult) {
        try { action.applyResult(result); } catch (e) {}
      }

      state.lastDrawnTier = result.tier;
      state.pendingPeelResult = {
        ...result,
        ticketId: action.ticketId,
        requiresReceive,
        receivedConfirmed: !requiresReceive,
      };

      const targetTier = state.lastDrawnTier;
      setTimeout(() => {
        rerender();
        scrollToTier(targetTier);
      }, PEEL_DURATION_MS);
      break;
    }
    case "receive_confirm": {
      if (!state.pendingPeelResult) return;
      if (state.pendingPeelResult.receivedConfirmed) return;
      state.pendingPeelResult.receivedConfirmed = true;
      persist();
      rerender();
      scrollToTier(state.lastDrawnTier);
      break;
    }
    case "peel_confirm": {
      if (state.pendingPeelResult
        && state.pendingPeelResult.requiresReceive
        && !state.pendingPeelResult.receivedConfirmed) {
        return;
      }
      state.pendingPeelResult = null;
      state.lastDrawnTier = null;
      persist();
      rerender();
      break;
    }
    case "set_skip_pick": {
      const v = !!action.value;
      if (state.settingsSkipPick === v) return;
      state.settingsSkipPick = v;
      const lineup = activeLineup();
      // OFF → ON 전환 + raw 인벤토리 ≥ 1: 격자 표시 폐기 + drawOne N회 = splice(0) 일괄 호출.
      if (v) {
        const rawIndices = [];
        state.unopenedTickets.forEach((t, i) => {
          if (t && (t.lockedResult === null || t.lockedResult === undefined)) rawIndices.push(i);
        });
        if (rawIndices.length > 0) {
          const newTickets = [...state.unopenedTickets];
          for (let k = 0; k < rawIndices.length; k++) {
            if (state.boxState.deck.length === 0) break;
            const drawIndex = state.boxState.drawnCount;
            const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
            const result = drawOne(state.boxState, drawRng, lineup);
            const enriched = { ...result, gridIndex: null, drawIndex };
            newTickets[rawIndices[k]] = { ...newTickets[rawIndices[k]], lockedResult: enriched };
          }
          state.unopenedTickets = newTickets;
          state.selectedGridIndices = [];
        }
      }
      persist();
      rerender();
      break;
    }
    case "set_current_lineup": {
      // M3 신설: 라인업 전환 (사용자 결정 8.3 (A) settings-tab dropdown).
      // P0 2.1 정정 (단계 6 round 1): currentLineupId 전환을 storage에 명시 영속해야
      // loadState가 새 라인업 공간을 로드함.
      const newLineupId = action.lineupId;
      if (!newLineupId || newLineupId === state.currentLineupId) return;
      const newLineup = getLineupById(newLineupId);
      if (!newLineup || newLineup.id !== newLineupId) return;  // fallback 발생 시 차단
      const proceed = () => {
        // 1) 현재 라인업 영속 (메모리 state.currentLineupId가 oldLineupId 시점에서 영속).
        persist();
        // 2) 메모리 + storage의 currentLineupId 동시 갱신 (storage 직접 갱신이 핵심 - loadState가 새 ID 인식).
        state.currentLineupId = newLineupId;
        saveState({ currentLineupId: newLineupId });
        // 3) 새 라인업 공간 로드 + bootstrapState 재구성 (메모리 only state(pendingPeelResult / selectedGridIndices) 폐기는 bootstrapState가 명시 처리).
        state = bootstrapState(loadState());
        // 4) 영속 (새 라인업 공간 boxState ensureBoxState 결과 영속 보장).
        persist();
        rerender();
      };
      showConfirmModal({
        title: "라인업 전환",
        message: `라인업을 "${newLineup.titleKo}"로 전환합니다. 현재 라인업의 박스 / 인벤토리 / 이력 / DC는 보존됩니다. 진행 중인 reveal / 격자 선택은 폐기됩니다.`,
        onConfirm: proceed,
      });
      break;
    }
    case "toggle_gallery": {
      state.galleryExpanded = !state.galleryExpanded;
      rerender();
      break;
    }
    case "toggle_tier": {
      state.expandedTier = state.expandedTier === action.tier ? null : action.tier;
      rerender();
      break;
    }
    case "reset_box": {
      const inProgress =
        state.boxState && state.boxState.drawnCount > 0 && state.boxState.deck.length > 0;
      const proceed = () => {
        state.boxRound += 1;
        state.boxState = initBox(state.seed, state.boxRound, activeLineup());
        state.unopenedTickets = [];
        state.selectedGridIndices = [];
        state.pendingPeelResult = null;
        persist();
        rerender();
      };
      if (inProgress || state.unopenedTickets.length > 0) {
        showConfirmModal({
          title: "박스 리셋",
          message: "현재 박스를 리셋합니다. 미개봉 복권도 폐기됩니다. 추첨 이력은 보존됩니다.",
          onConfirm: proceed,
        });
      } else {
        proceed();
      }
      break;
    }
    case "set_seed": {
      const inProgress =
        state.boxState && state.boxState.drawnCount > 0 && state.boxState.deck.length > 0;
      const proceed = () => {
        state.seed = Number(action.seed) >>> 0;
        state.boxRound = BOX_ROUND_INITIAL;
        state.boxState = initBox(state.seed, state.boxRound, activeLineup());
        state.unopenedTickets = [];
        state.selectedGridIndices = [];
        state.pendingPeelResult = null;
        persist();
        rerender();
      };
      if (inProgress || state.unopenedTickets.length > 0) {
        showConfirmModal({
          title: "시드 변경",
          message: "시드를 변경하면 박스 회차가 초기값으로 리셋되고 미개봉 복권이 폐기됩니다. 시드는 모든 라인업이 공유합니다.",
          onConfirm: proceed,
        });
      } else {
        proceed();
      }
      break;
    }
    case "draw_dc": {
      if (state.dcTickets.length === 0) return;
      const lineup = activeLineup();
      const dcRng = createRng(fnv1a(`dc|${state.seed}|${Date.now()}|${state.dcResults.length}`));
      const result = drawDc(state.dcTickets, dcRng, lineup.dc);
      state.dcResults = [...state.dcResults, { ...result, time: Date.now() }];
      persist();
      rerender();
      showDcResultModal(result);
      break;
    }
    case "clear_all": {
      showConfirmModal({
        title: "전체 초기화",
        message: "모든 데이터(시드, 라인업별 박스 / 이력 / DC / 미개봉 복권)가 삭제됩니다. 되돌릴 수 없습니다.",
        onConfirm: () => {
          clearAll();
          state = bootstrapState(loadState());
          persist();
          rerender();
        },
      });
      break;
    }
    case "dismiss_disclaimer": {
      state.meta = { ...state.meta, disclaimerSeen: true };
      persist();
      rerender();
      break;
    }
  }
}

function bootstrapState(loaded) {
  const s = {
    ...loaded,
    currentTab: TAB_DRAW,
    expandedTier: null,
    galleryExpanded: false,
    lastBuyCount: null,
    lastDrawnTier: null,
    pendingPeelResult: null,
    selectedGridIndices: [],
  };
  if (s.currentLineupId === null || s.currentLineupId === undefined) {
    s.currentLineupId = LINEUP_DEFAULT_ID;
  }
  if (s.seed === null || s.seed === undefined) {
    s.seed = generateDefaultSeed();
  }
  if (!Array.isArray(s.unopenedTickets)) s.unopenedTickets = [];
  if (typeof s.settingsSkipPick !== "boolean") s.settingsSkipPick = false;
  ensureBoxState(s);
  return s;
}

export function mount(el) {
  rootEl = el;
  const loaded = loadState();
  state = bootstrapState(loaded);
  persist();
  rerender();
  attachKeyboard({
    onEscape: () => {
      const overlay = document.querySelector(".modal-overlay");
      if (overlay) overlay.remove();
    },
    onEnter: () => {
      if (state.currentTab !== TAB_DRAW) return;
      const drawBtn = document.querySelector(".buy-button:not([disabled]), .peel-card:not(.is-revealed)");
      if (drawBtn) drawBtn.click();
    },
  });
  if (state.storageMode === "memory") {
    showStorageFallbackSheet();
  }
  if (!state.meta.disclaimerSeen) {
    showDisclaimerSheet({
      onDismiss: () => dispatch({ type: "dismiss_disclaimer" }),
    });
  }
}
