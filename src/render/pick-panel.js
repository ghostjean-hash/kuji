// 통(bin) 슬롯 격자 컨테이너 (M2.1 + B-α 재정정). 03_architecture 3.14. 01_spec 5.14.
// 4장 6.b1 분기에서 호출. B-α: 슬롯 토글 + "확인" 버튼 N매 통째 splice.

import {
  BOX_SIZE,
  LINEUP,
  PICK_GRID_COLS_DEFAULT,
  PICK_SLOT_ROTATE_RANGE_DEG,
  PICK_GRID_CLAMP_MIN_PCT,
  PICK_GRID_CLAMP_MAX_PCT,
  PICK_SLOT_JITTER_RATIO,
  PICK_SLOT_SELECTED_Z_BOOST,
} from "../data/numbers.js";
import { fnv1a } from "../core/hash.js";
import { renderPickSlot, PICK_SLOT_KINDS } from "./pick-slot.js";

// Last One 슬롯은 통(bin)에 노출 안 됨 (last-one-row에서 별도 표시. 4.14.14 결정).
// 통에 표시되는 일반 슬롯은 BOX_SIZE - 1매.
const NORMAL_SLOT_COUNT = BOX_SIZE - 1;

// 통 메타포: 격자 배치 순서를 박스별 결정론적으로 셔플 + 슬롯별 미세 회전·오프셋.
// 박스가 바뀌면 자연스럽게 다시 섞이지만, 같은 박스 내에서는 일관된 위치 유지.
function deterministicShuffle(seedKey, n) {
  const order = [];
  for (let i = 0; i < n; i++) order.push(i);
  for (let i = n - 1; i > 0; i--) {
    const j = fnv1a(`${seedKey}|shuf|${i}`) % (i + 1);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return order;
}

// 슬롯별 회전(±RANGE/2°) + z-index 0~15. 시드+gi 해시 기반.
function slotJitter(seedKey, gi) {
  const h = fnv1a(`${seedKey}|jit|${gi}`);
  const angle = (((h & 0xFFFF) / 0xFFFF) - 0.5) * PICK_SLOT_ROTATE_RANGE_DEG;  // -RANGE/2 ~ +RANGE/2
  const z = (h >>> 8) & 0x0F;                                                  // 0 ~ 15 z-index (비트 마스크)
  return { angle, z };
}

// 슬롯 절대 위치 (% 좌표). 격자 셀 + 셀 내부 jitter.
// 무작위 분포는 Poisson clumping으로 군집과 공백이 생기므로,
// 셔플된 순서로 격자 셀에 균등 배정 후 셀 내부에서 PICK_SLOT_JITTER_RATIO 비율 jitter로 자연스러움 부여.
// 셀 경계를 살짝 넘으며 인접 셀과 섞여 격자 흔적 약화.
function slotPosition(seedKey, posInShuffle, cols, rows) {
  const row = Math.floor(posInShuffle / cols);
  const col = posInShuffle % cols;
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const centerX = col * cellW + cellW / 2;
  const centerY = row * cellH + cellH / 2;
  const h = fnv1a(`${seedKey}|pos|${posInShuffle}`);
  // PICK_SLOT_JITTER_RATIO 0.5 = ±50% 셀 폭 jitter. (rand - 0.5) * 2 → -1~+1 → * RATIO * cellW.
  const rx = ((h & 0xFFFF) / 0xFFFF) - 0.5;
  const ry = ((h >>> 16) & 0xFFFF) / 0xFFFF - 0.5;
  const jx = rx * 2 * PICK_SLOT_JITTER_RATIO * cellW;
  const jy = ry * 2 * PICK_SLOT_JITTER_RATIO * cellH;
  const xPct = Math.max(PICK_GRID_CLAMP_MIN_PCT, Math.min(PICK_GRID_CLAMP_MAX_PCT, centerX + jx));
  const yPct = Math.max(PICK_GRID_CLAMP_MIN_PCT, Math.min(PICK_GRID_CLAMP_MAX_PCT, centerY + jy));
  return { xPct, yPct };
}

export function renderPickPanel(state, dispatch) {
  const cols = (LINEUP && LINEUP.gridCols) || PICK_GRID_COLS_DEFAULT;
  const rows = Math.ceil(BOX_SIZE / cols);

  const el = document.createElement("section");
  el.className = "pick-panel";

  // 현재 박스의 history 항목 (reveal 완료) → 뽑힌 격자 위치
  const boxId = state.boxState.id;
  const boxHistory = (state.history || []).filter((e) => e && e.boxId === boxId);

  // 인벤토리 lockedResult 보유 ticket의 격자 위치 (확인 후 reveal 전)
  const lockedTickets = (state.unopenedTickets || []).filter(
    (t) => t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined
  );

  // drawnSet: 추적된 gridIndex(history+locked) + skip 모드 등 미추적 뽑기는 placeholder로 채워
  // deck 잔여와 정합. main.js performPickConfirm와 동일 규칙 (단일 진실원).
  const drawnSet = new Set();
  for (const e of boxHistory) {
    if (e.gridIndex !== null && e.gridIndex !== undefined) drawnSet.add(e.gridIndex);
  }
  for (const t of lockedTickets) {
    drawnSet.add(t.lockedResult.gridIndex);
  }
  const expected = NORMAL_SLOT_COUNT - state.boxState.deck.length;
  if (drawnSet.size < expected) {
    for (let i = 0; i < NORMAL_SLOT_COUNT && drawnSet.size < expected; i++) {
      if (!drawnSet.has(i)) drawnSet.add(i);
    }
  }

  // 사용자 선택 메모리 (B-α)
  const selectedSet = new Set(state.selectedGridIndices || []);

  // 인벤토리 raw 매수 N (확인 버튼 활성 기준)
  const rawCount = (state.unopenedTickets || []).filter((t) => t && (t.lockedResult === null || t.lockedResult === undefined)).length;
  const selectedCount = selectedSet.size;

  // 헤더 (한 줄: 제목 좌 / 진행 우 — 그리드 공간 최대화)
  const header = document.createElement("div");
  header.className = "pick-panel-header";

  const title = document.createElement("h2");
  title.className = "pick-panel-title";
  title.textContent = `통에서 ${rawCount}매 모두 골라주세요`;
  header.appendChild(title);

  const sub = document.createElement("span");
  sub.className = "pick-panel-sub";
  sub.textContent = `${selectedCount} / ${rawCount} · 잔여 ${state.boxState.deck.length}`;
  header.appendChild(sub);

  el.appendChild(header);

  // 격자
  const grid = document.createElement("div");
  grid.className = "pick-grid";
  grid.style.setProperty("--pick-cols", String(cols));
  grid.style.setProperty("--pick-rows", String(rows));
  el.appendChild(grid);

  // 박스별 결정론적 셔플 — 일반 슬롯 0~78의 표시 순서 무작위화.
  // 위치는 셔플된 순서(posInShuffle)로 격자 셀에 균등 배정 + 셀 내부 jitter.
  // 같은 박스 내에서는 슬롯이 일관 위치 유지 (특정 gi의 위치가 박스 내내 동일).
  const seedKey = state.boxState.id || `${state.seed}-${state.boxRound}`;
  const shuffledNormal = deterministicShuffle(seedKey, NORMAL_SLOT_COUNT);
  // 위치 매핑 격자: 일반 슬롯 N개를 cols×ceil(N/cols)에 배정 (라인업 cols 활용).
  const posCols = cols;
  const posRows = Math.ceil(NORMAL_SLOT_COUNT / posCols);
  const giToPos = new Map();
  for (let pos = 0; pos < shuffledNormal.length; pos++) {
    giToPos.set(shuffledNormal[pos], pos);
  }

  function appendSlot(gi) {
    const kind = selectedSet.has(gi) ? PICK_SLOT_KINDS.NORMAL_SELECTED : PICK_SLOT_KINDS.NORMAL_AVAILABLE;
    const slot = renderPickSlot({
      kind,
      gridIndex: gi,
      onClick: (g) => {
        dispatch({ type: "toggle_pick_select", gridIndex: g });
      },
    });
    const { angle, z } = slotJitter(seedKey, gi);
    const { xPct, yPct } = slotPosition(seedKey, giToPos.get(gi), posCols, posRows);
    slot.style.setProperty("--jitter-rotate", `${angle.toFixed(2)}deg`);
    slot.style.setProperty("--slot-x", `${xPct.toFixed(2)}%`);
    slot.style.setProperty("--slot-y", `${yPct.toFixed(2)}%`);
    let zBase = z;
    if (kind === PICK_SLOT_KINDS.NORMAL_SELECTED) zBase += PICK_SLOT_SELECTED_Z_BOOST;
    slot.style.setProperty("--jitter-z", String(zBase));
    grid.appendChild(slot);
  }

  // 일반 슬롯만 산개 배치. 뽑힌 슬롯은 통에서 제거. Last One은 last-one-row에서 별도 표시되므로 통에선 미노출.
  for (const gi of shuffledNormal) {
    if (drawnSet.has(gi)) continue;
    appendSlot(gi);
  }

  // "자동 선택 N매" 버튼 (확인 버튼 제거: 사용자가 N매 선택 시 자동 전이)
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
  el.appendChild(confirmRow);

  return el;
}
