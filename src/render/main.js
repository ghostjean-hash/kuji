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
    case "peel": {
      // M2: 뜯기 = drawOne 호출 + 인벤토리에서 제거 + 확인 대기 상태
      if (state.boxState.deck.length === 0) return;
      if (state.unopenedTickets.length === 0) return;
      if (state.pendingPeelResult) return;

      const drawIndex = state.boxState.drawnCount;
      const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
      const result = drawOne(state.boxState, drawRng, LINEUP);
      const time = Date.now();
      const entry = {
        time,
        boxId: state.boxState.id,
        drawIndex,
        tier: result.tier,
        typeIndex: result.typeIndex,
        nameJa: result.nameJa,
        nameKo: result.nameKo,
        sizeLabel: result.sizeLabel,
        isLastOne: result.isLastOne,
      };

      // 주요 보상(A~F: count === 1, tier !== "Last One")은 사용자 "받기" 절차 후 history 등록.
      // 비주요(G~J) / Last One은 즉시 history 등록.
      const tierMeta = LINEUP.tiers.find((t) => t.tier === result.tier);
      const requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;

      if (!requiresReceive) {
        state.history = appendHistory(state.history, entry);
      }
      state.dcTickets = addTicket(state.dcTickets, {
        boxId: state.boxState.id,
        drawIndex,
        time,
      });
      state.unopenedTickets = removeTicket(state.unopenedTickets, action.ticketId);
      persist();

      if (action.applyResult) {
        try { action.applyResult(result); } catch (e) {}
      }

      // 마지막 1매(isLastOne) 시: 일반 등급 + Last One 동시 획득.
      // lastDrawnTier는 항상 실제 마지막 카드 등급. Last One row 글로우는 pendingPeelResult.isLastOne으로 별도 판단.
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
      // 사용자 명시 확인 → 결과 카드 닫고 다음 카드 / 구매 씬
      // 단 받기 미완료 (requiresReceive && !receivedConfirmed)면 동작 안 함 (가드)
      if (state.pendingPeelResult
        && state.pendingPeelResult.requiresReceive
        && !state.pendingPeelResult.receivedConfirmed) {
        return;
      }
      state.pendingPeelResult = null;
      state.lastDrawnTier = null;
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
    pendingPeelResult: null,  // 뜯기 후 확인 대기 결과 (메모리 only, 영속 X)
  };
  if (s.seed === null || s.seed === undefined) {
    s.seed = generateDefaultSeed();
  }
  if (!Array.isArray(s.unopenedTickets)) s.unopenedTickets = [];
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
