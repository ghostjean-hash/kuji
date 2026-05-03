// 진입 + state + dispatch + 4탭 라우팅 (M2 갱신: 구매 / 뜯기 메커닉 추가).

import { loadState, saveState, clearAll } from "../data/storage.js";
import {
  BOX_ROUND_INITIAL,
  DC_WINNERS_TOTAL,
  DC_POOL_SIZE_DEFAULT,
  DEFAULT_SEED_FALLBACK_BITS,
  LINEUP,
  PEEL_REVEAL_VIEW_MS,
  PEEL_REVEAL_TO_FADE_MS,
  PEEL_DURATION_MS,
} from "../data/numbers.js";
import { initBox } from "../core/box.js";
import { drawOne } from "../core/draw.js";
import { addTicket, drawDc } from "../core/double_chance.js";
import { appendHistory } from "../core/history.js";
import { createRng } from "../core/random.js";
import { fnv1a } from "../core/hash.js";
import { addUnopenedTickets, removeTicket } from "../core/buy.js";

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

function scrollToTier(tier) {
  if (!tier) return;
  const safe = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(tier) : tier.replace(/"/g, '\\"');
  const el = document.querySelector(`[data-tier="${safe}"]`);
  if (el && el.scrollIntoView) {
    try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
  }
}

function generateDefaultSeed() {
  const bits = DEFAULT_SEED_FALLBACK_BITS;
  return (Date.now() % Math.pow(2, bits)) >>> 0;
}

function ensureBoxState(s) {
  if (!s.boxState || !Array.isArray(s.boxState.deck) || s.boxState.totalSize === undefined) {
    if (s.seed === null || s.seed === undefined) s.seed = generateDefaultSeed();
    s.boxState = initBox(s.seed, s.boxRound, LINEUP);
  }
  return s;
}

function persist() {
  saveState({
    seed: state.seed,
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
      // M2: 구매 = 인벤토리 추가 (deck 변경 없음)
      const count = action.count;
      const now = Date.now();
      state.unopenedTickets = addUnopenedTickets(state.unopenedTickets, count, now);
      state.lastBuyCount = count;
      persist();
      rerender();
      break;
    }
    case "auto_pick_select": {
      // M2.1 B-α 보강 (5.14.4.8): 잔여 일반 슬롯 첫 N개를 자동 selected.
      // 메모리 토글만. PRNG / drawOne 호출 0. 결정론 영향 0.
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;
      const rawCount = state.unopenedTickets.filter(
        (t) => t && (t.lockedResult === null || t.lockedResult === undefined)
      ).length;
      if (rawCount === 0) return;
      // drawn 격자 위치 도출 (history reveal + locked ticket)
      const boxId = state.boxState.id;
      const drawnFromHistory = (state.history || [])
        .filter((e) => e && e.boxId === boxId && e.gridIndex !== null && e.gridIndex !== undefined)
        .map((e) => e.gridIndex);
      const drawnFromLocked = state.unopenedTickets
        .filter((t) => t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined)
        .map((t) => t.lockedResult.gridIndex);
      const drawnSet = new Set([...drawnFromHistory, ...drawnFromLocked]);
      // 잔여 일반 슬롯 (Last One 제외, gridIndex 0 ~ BOX_SIZE - 2) 오름차순 첫 N개
      const NORMAL_SLOT_COUNT = LINEUP.boxSize - 1;
      const auto = [];
      for (let i = 0; i < NORMAL_SLOT_COUNT && auto.length < rawCount; i++) {
        if (!drawnSet.has(i)) auto.push(i);
      }
      if (auto.length < rawCount) return;  // 잔여 부족 (정상 흐름 발생 불가)
      state.selectedGridIndices = auto;
      rerender();
      break;
    }
    case "toggle_pick_select": {
      // M2.1 B-α: 통 격자 슬롯 선택 토글 (메모리 전용. drawOne 호출 X. history 미커밋).
      // 01_spec 5.14.4.2 / 03_architecture 4.6.
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;
      const gi = action.gridIndex;
      const sel = Array.isArray(state.selectedGridIndices) ? [...state.selectedGridIndices] : [];
      const idx = sel.indexOf(gi);
      if (idx >= 0) {
        sel.splice(idx, 1);
      } else {
        // raw 매수보다 많이 선택 못함
        const rawCount = state.unopenedTickets.filter((t) => t && (t.lockedResult === null || t.lockedResult === undefined)).length;
        if (sel.length >= rawCount) return;
        sel.push(gi);
      }
      state.selectedGridIndices = sel;
      // selectedGridIndices는 메모리 전용. 영속 X.
      rerender();
      break;
    }
    case "confirm_pick": {
      // M2.1 B-α: 사용자가 N매 선택 후 확인 → drawOne N회 splice + ticket lockedResult 부여.
      // 01_spec 5.14.4.4 / 03_architecture 4.6.
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;
      const sel = state.selectedGridIndices || [];
      const rawTicketIndices = [];
      state.unopenedTickets.forEach((t, i) => {
        if (t && (t.lockedResult === null || t.lockedResult === undefined)) rawTicketIndices.push(i);
      });
      if (sel.length !== rawTicketIndices.length || sel.length === 0) return;

      // 격자 위치 → 잔여 deck 인덱스 변환 (매 호출마다 splice 반영)
      // 현재 박스의 이미 뽑힌 격자 위치 (history reveal 완료 + lockedResult 보유 ticket)
      const boxId = state.boxState.id;
      const drawnFromHistory = (state.history || [])
        .filter((e) => e && e.boxId === boxId && e.gridIndex !== null && e.gridIndex !== undefined)
        .map((e) => e.gridIndex);
      const drawnFromLocked = state.unopenedTickets
        .filter((t) => t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined)
        .map((t) => t.lockedResult.gridIndex);
      const consumedSet = new Set([...drawnFromHistory, ...drawnFromLocked]);

      // selectedGridIndices 순회 (사용자 선택 순서)
      const newTickets = [...state.unopenedTickets];
      for (let k = 0; k < sel.length; k++) {
        const gi = sel[k];
        // 잔여 일반 격자 정렬 (consumedSet에 없는 것 + sel[0..k-1] 제외)
        // 잔여 deck 인덱스 j = gi가 잔여 정렬에서 몇 번째
        let j = 0;
        for (let pos = 0; pos < gi; pos++) {
          if (!consumedSet.has(pos)) j++;
        }
        const drawIndex = state.boxState.drawnCount;
        const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
        const result = drawOne(state.boxState, drawRng, LINEUP, j);
        const ticketIdx = rawTicketIndices[k];
        const enriched = {
          ...result,
          gridIndex: gi,
          drawIndex,
        };
        newTickets[ticketIdx] = { ...newTickets[ticketIdx], lockedResult: enriched };
        consumedSet.add(gi);
        // Last One 동시 지급 시 Last One 슬롯도 consumed로 표시 (시각 회색은 reveal 시점 - 5.14.4.5)
      }
      state.unopenedTickets = newTickets;
      state.selectedGridIndices = [];
      persist();
      rerender();
      break;
    }
    case "peel": {
      // M2 + B-α: 뜯기 = 페이지플립 카드 reveal 트리거.
      //   (a) 첫 ticket.lockedResult 보유 (skip OFF 흐름) = drawOne 재호출 X. lockedResult를 pendingPeelResult로.
      //   (b) skip ON 흐름 = drawOne(splice(0)) 즉시 호출. history append (revealed: true).
      if (state.boxState.deck.length === 0 && !(state.unopenedTickets[0] && state.unopenedTickets[0].lockedResult)) return;
      if (state.unopenedTickets.length === 0) return;
      if (state.pendingPeelResult) return;

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
        const tierMeta = LINEUP.tiers.find((t) => t.tier === result.tier);
        requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;
        if (!requiresReceive) {
          state.history = appendHistory(state.history, entry);
        }
        state.dcTickets = addTicket(state.dcTickets, {
          boxId: state.boxState.id,
          drawIndex,
          time,
        });
        // 첫 ticket 제거
        state.unopenedTickets = state.unopenedTickets.slice(1);
      } else {
        // (b) skip ON: drawOne 즉시 호출
        drawIndex = state.boxState.drawnCount;
        const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
        result = drawOne(state.boxState, drawRng, LINEUP);
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
        const tierMeta = LINEUP.tiers.find((t) => t.tier === result.tier);
        requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;
        if (!requiresReceive) {
          state.history = appendHistory(state.history, entry);
        }
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
        entry,
      };

      const targetTier = state.lastDrawnTier;
      setTimeout(() => {
        rerender();
        scrollToTier(targetTier);
      }, PEEL_DURATION_MS);
      break;
    }
    case "receive_confirm": {
      // 주요 보상 받기 확인 → history 등록 + 복권 "확인" 버튼 활성화
      if (!state.pendingPeelResult) return;
      if (state.pendingPeelResult.receivedConfirmed) return;
      if (state.pendingPeelResult.entry) {
        state.history = appendHistory(state.history, state.pendingPeelResult.entry);
      }
      state.pendingPeelResult.receivedConfirmed = true;
      persist();
      rerender();
      break;
    }
    case "peel_confirm": {
      // 사용자 명시 확인 → 결과 카드 닫고 다음 카드 / 구매 씬 / 통 선택 격자.
      // M2.1 B-α: history는 reveal 시점에 이미 append됨 (peel 분기). 여기서는 pendingPeelResult만 초기화.
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
    case "pick_hint_seen": {
      // M2.1: 통 선택 첫 진입 안내 toast 닫힘 → meta.pickHintSeen 영속.
      if (state.meta && state.meta.pickHintSeen === true) return;
      state.meta = { ...state.meta, pickHintSeen: true };
      persist();
      // 재렌더 생략: toast가 자체 dismiss 모션 중. 다음 렌더 사이클에서 자연 반영.
      break;
    }
    case "set_skip_pick": {
      // M2.1 B-α: 통 선택 skip 토글 (구매 패널 + 설정 탭 양방향 동기화).
      const v = !!action.value;
      if (state.settingsSkipPick === v) return;
      state.settingsSkipPick = v;
      // OFF → ON 전환 + raw 인벤토리 ≥ 1: 격자 표시 폐기 + drawOne N회 = splice(0) 일괄 호출.
      // 01_spec 5.14.6.5.
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
            const result = drawOne(state.boxState, drawRng, LINEUP);  // splice(0)
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
        state.boxState = initBox(state.seed, state.boxRound, LINEUP);
        state.unopenedTickets = [];
        state.selectedGridIndices = [];  // M2.1 B-α
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
        state.boxState = initBox(state.seed, state.boxRound, LINEUP);
        state.unopenedTickets = [];
        state.selectedGridIndices = [];  // M2.1 B-α
        state.pendingPeelResult = null;
        persist();
        rerender();
      };
      if (inProgress || state.unopenedTickets.length > 0) {
        showConfirmModal({
          title: "시드 변경",
          message: "시드를 변경하면 박스 회차가 초기값으로 리셋되고 미개봉 복권이 폐기됩니다.",
          onConfirm: proceed,
        });
      } else {
        proceed();
      }
      break;
    }
    case "draw_dc": {
      if (state.dcTickets.length === 0) return;
      const dcRng = createRng(fnv1a(`dc|${state.seed}|${Date.now()}|${state.dcResults.length}`));
      const result = drawDc(state.dcTickets, dcRng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT);
      state.dcResults = [...state.dcResults, { ...result, time: Date.now() }];
      persist();
      rerender();
      showDcResultModal(result);
      break;
    }
    case "clear_all": {
      showConfirmModal({
        title: "전체 초기화",
        message: "모든 데이터(시드, 박스, 이력, DC, 미개봉 복권)가 삭제됩니다. 되돌릴 수 없습니다.",
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
    pendingPeelResult: null,  // 뜯기 후 확인 대기 결과 (메모리 only)
    selectedGridIndices: [],  // M2.1 B-α: 통 격자 사용자 선택 (메모리 only, 영속 X)
  };
  if (s.seed === null || s.seed === undefined) {
    s.seed = generateDefaultSeed();
  }
  if (!Array.isArray(s.unopenedTickets)) s.unopenedTickets = [];
  if (typeof s.settingsSkipPick !== "boolean") s.settingsSkipPick = false;
  ensureBoxState(s);
  // B-α 새로고침 복원: ticket.lockedResult 보유 시 자동으로 b2 분기 진입 (draw-tab 분기 자동 도출).
  // 별도 처리 불요 (03_architecture 4.7).
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
