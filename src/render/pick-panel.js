// 통(bin) 슬롯 격자 컨테이너 (M2.1 + B-α 재정정). 03_architecture 3.14. 01_spec 5.14.
// 4장 6.b1 분기에서 호출. B-α: 슬롯 토글 + "확인" 버튼 N매 통째 splice.

import {
  BOX_SIZE,
  LINEUP,
  PICK_GRID_COLS_DEFAULT,
} from "../data/numbers.js";
import { renderPickSlot, PICK_SLOT_KINDS } from "./pick-slot.js";
import { renderPickHintToast } from "./pick-hint-toast.js";

const LAST_ONE_GRID_INDEX = BOX_SIZE - 1;
const NORMAL_SLOT_COUNT = BOX_SIZE - 1;

export function renderPickPanel(state, dispatch) {
  const cols = (LINEUP && LINEUP.gridCols) || PICK_GRID_COLS_DEFAULT;
  const rows = Math.ceil(BOX_SIZE / cols);

  const el = document.createElement("section");
  el.className = "pick-panel";

  // 현재 박스의 history 항목 (reveal 완료) → 뽑힌 격자 위치
  const boxId = state.boxState.id;
  const boxHistory = (state.history || []).filter((e) => e && e.boxId === boxId);
  const drawnGridIndices = boxHistory
    .filter((e) => e.gridIndex !== null && e.gridIndex !== undefined)
    .map((e) => e.gridIndex);
  const lastOneFromHistory = boxHistory.some((e) => e.isLastOne);

  // 인벤토리 lockedResult 보유 ticket의 격자 위치 (확인 후 reveal 전)
  const lockedTickets = (state.unopenedTickets || []).filter(
    (t) => t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined
  );
  const lockedGridIndices = lockedTickets.map((t) => t.lockedResult.gridIndex);
  const lastOneFromLocked = lockedTickets.some((t) => t.lockedResult && t.lockedResult.isLastOne);

  const drawnSet = new Set([...drawnGridIndices, ...lockedGridIndices]);
  const lastOneAttached = lastOneFromHistory || lastOneFromLocked;

  // 사용자 선택 메모리 (B-α)
  const selectedSet = new Set(state.selectedGridIndices || []);

  // 인벤토리 raw 매수 N (확인 버튼 활성 기준)
  const rawCount = (state.unopenedTickets || []).filter((t) => t && (t.lockedResult === null || t.lockedResult === undefined)).length;
  const selectedCount = selectedSet.size;

  // 헤더
  const title = document.createElement("h2");
  title.className = "pick-panel-title";
  title.textContent = "통에서 N매 모두 골라주세요";
  el.appendChild(title);

  const sub = document.createElement("p");
  sub.className = "pick-panel-sub";
  sub.textContent = `선택 ${selectedCount} / ${rawCount} · 박스 잔여 ${state.boxState.deck.length}매`;
  el.appendChild(sub);

  // 격자
  const grid = document.createElement("div");
  grid.className = "pick-grid";
  grid.style.setProperty("--pick-cols", String(cols));
  grid.style.setProperty("--pick-rows", String(rows));
  el.appendChild(grid);

  for (let i = 0; i < BOX_SIZE; i++) {
    let kind;
    if (i === LAST_ONE_GRID_INDEX) {
      kind = lastOneAttached ? PICK_SLOT_KINDS.LAST_ONE_DRAWN : PICK_SLOT_KINDS.LAST_ONE_PENDING;
    } else if (drawnSet.has(i)) {
      kind = PICK_SLOT_KINDS.NORMAL_DRAWN;
    } else if (selectedSet.has(i)) {
      kind = PICK_SLOT_KINDS.NORMAL_SELECTED;
    } else {
      kind = PICK_SLOT_KINDS.NORMAL_AVAILABLE;
    }
    const slot = renderPickSlot({
      kind,
      gridIndex: i,
      onClick: (gi) => {
        dispatch({ type: "toggle_pick_select", gridIndex: gi });
      },
    });
    grid.appendChild(slot);
  }

  // "자동 선택 N매" + "확인" 버튼 (B-α 보강 5.14.4.8)
  const confirmRow = document.createElement("div");
  confirmRow.className = "pick-confirm-row";

  // 잔여 일반 슬롯 수 (drawn / Last One 제외) - 자동 선택 가능 여부 검증
  let availableNormalCount = 0;
  for (let i = 0; i < NORMAL_SLOT_COUNT; i++) {
    if (!drawnSet.has(i)) availableNormalCount++;
  }
  const autoBtn = document.createElement("button");
  autoBtn.type = "button";
  autoBtn.className = "pick-auto-button";
  const canAuto = rawCount > 0 && availableNormalCount >= rawCount;
  autoBtn.disabled = !canAuto;
  autoBtn.textContent = `자동 선택 ${rawCount}매`;
  autoBtn.addEventListener("click", () => {
    if (!canAuto) return;
    dispatch({ type: "auto_pick_select" });
  });
  confirmRow.appendChild(autoBtn);

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "pick-confirm-button";
  const canConfirm = selectedCount === rawCount && rawCount > 0;
  confirmBtn.disabled = !canConfirm;
  confirmBtn.textContent = canConfirm
    ? `${rawCount}매 확인 (뜯기 단계로)`
    : `${rawCount}매 모두 골라야 확인 가능`;
  confirmBtn.addEventListener("click", () => {
    if (!canConfirm) return;
    dispatch({ type: "confirm_pick" });
  });
  confirmRow.appendChild(confirmBtn);
  el.appendChild(confirmRow);

  // 첫 진입 안내 toast
  if (state.meta && state.meta.pickHintSeen === false) {
    const toast = renderPickHintToast(dispatch);
    el.appendChild(toast);
  }

  return el;
}
