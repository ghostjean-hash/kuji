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
  PICK_AUTO_CONFIRM_DELAY_MS,
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
  // 모달 내부 data-tier(result-modal 등) 매칭 회피 — 추첨 탭 내 카드/행만 타겟.
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

// raw 매수 (lockedResult 미부여) 카운트.
function countRawTickets(s) {
  if (!Array.isArray(s.unopenedTickets)) return 0;
  let n = 0;
  for (const t of s.unopenedTickets) {
    if (t && (t.lockedResult === null || t.lockedResult === undefined)) n++;
  }
  return n;
}

// 현재 박스에서 "이미 뽑힌" 일반 격자 위치 집합 (Last One 제외).
// history(gridIndex 기록 있음) + lockedResult(gridIndex 있음) 외에도,
// skip 모드 뽑기처럼 gridIndex가 null인 미추적 뽑기는 deck 소진은 됐지만 집합에 없음.
// 그래서 deck 소진 수와 추적 집합 크기가 어긋나면, 낮은 번호부터 placeholder로 채워 정합성 맞춤.
// 이 함수는 렌더(pick-panel)와 confirm(performPickConfirm)이 같은 결과를 보도록 단일 진실원으로 사용.
export function buildConsumedGridSet(s) {
  const boxId = s.boxState.id;
  const tracked = new Set();
  for (const e of (s.history || [])) {
    if (e && e.boxId === boxId && e.gridIndex !== null && e.gridIndex !== undefined) {
      tracked.add(e.gridIndex);
    }
  }
  for (const t of (s.unopenedTickets || [])) {
    if (t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined) {
      tracked.add(t.lockedResult.gridIndex);
    }
  }
  const NORMAL_SLOT_COUNT = LINEUP.boxSize - 1;
  const expected = NORMAL_SLOT_COUNT - s.boxState.deck.length;
  if (tracked.size < expected) {
    for (let i = 0; i < NORMAL_SLOT_COUNT && tracked.size < expected; i++) {
      if (!tracked.has(i)) tracked.add(i);
    }
  }
  return tracked;
}

// 통 선택 confirm 실행 (mutating state). 성공 시 true 반환.
// drawOne throw 가능 (consumedSet 정합성 틀어졌을 때) — try/catch로 잡아 사용자에게 reset 보여줌.
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

  const consumedSet = buildConsumedGridSet(state);

  // 트랜잭션처럼 처리: 도중에 throw나면 boxState 변경분 롤백 어려우므로,
  // 미리 j값을 모두 검증한 뒤 실행. j는 deck 소진을 반영해 단계별 갱신.
  const decklenSnapshot = state.boxState.deck.length;
  let availableCount = decklenSnapshot;
  const consumedCopy = new Set(consumedSet);
  const jList = [];
  for (let k = 0; k < sel.length; k++) {
    const gi = sel[k];
    if (consumedCopy.has(gi)) return false;  // 이미 소진된 슬롯 — 비정상
    let j = 0;
    for (let pos = 0; pos < gi; pos++) {
      if (!consumedCopy.has(pos)) j++;
    }
    if (j < 0 || j >= availableCount) return false;  // pickIndex 범위 위반
    jList.push(j);
    consumedCopy.add(gi);
    availableCount--;
  }

  // 검증 통과 — 실제 mutation 수행
  const newTickets = [...state.unopenedTickets];
  for (let k = 0; k < sel.length; k++) {
    const gi = sel[k];
    const j = jList[k];
    const drawIndex = state.boxState.drawnCount;
    const drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`));
    const result = drawOne(state.boxState, drawRng, LINEUP, j);
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
      // 잔여 일반 슬롯 첫 N개를 자동 selected → 즉시 인라인 confirm 실행.
      if (state.boxState.deck.length === 0) return;
      if (state.pendingPeelResult) return;
      if (state.settingsSkipPick) return;

      const rawCount = countRawTickets(state);
      if (rawCount === 0) return;

      const drawnSet = buildConsumedGridSet(state);
      const NORMAL_SLOT_COUNT = LINEUP.boxSize - 1;
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
      // 통 격자 슬롯 선택 토글. N매 채워지면 짧은 딜레이 후 자동 confirm (사용자가 N번째 선택을 시각 확인 가능하도록).
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
    case "confirm_pick": {
      // 외부에서 명시적으로 호출되는 경로 (현재는 auto_pick_select에서만 사용).
      const ok = performPickConfirm();
      if (ok) {
        persist();
      } else {
        state.selectedGridIndices = [];
      }
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
        // requiresReceive: 주요 보상(count=1, Last One 제외) 받기 모달 노출 여부 결정용 UI 플래그.
        //   2026-05-08 이후로 history append 게이트 역할은 종료 (peel 시점 무조건 append).
        //   peel-card "확인" 버튼 활성화 게이트 + hero-carousel "받기" 버튼 노출 여부에만 사용.
        requiresReceive = !result.isLastOne && tierMeta && tierMeta.count === 1;
        state.history = appendHistory(state.history, entry);
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
        // requiresReceive: UI 플래그 (위 (a) 분기 주석 참조). skip 모드도 동일 규칙.
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
      // 주요 보상 받기 확인 → 복권 "확인" 버튼 활성화 (UI 게이트 전용).
      // history는 peel 시점에 이미 append됨 — 여기서 중복 추가 금지.
      if (!state.pendingPeelResult) return;
      if (state.pendingPeelResult.receivedConfirmed) return;
      state.pendingPeelResult.receivedConfirmed = true;
      persist();
      rerender();
      scrollToTier(state.lastDrawnTier);
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
