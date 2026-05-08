// 통(bin) 단일 슬롯 (M2.1 + B-α). 03_architecture 3.15.
// 활성 3상태: normal-available / normal-selected / normal-drawn.
// **2026-05-08 deprecated (4.14.14, 단계 6 P0 2.3)**: LAST_ONE_PENDING / LAST_ONE_DRAWN 상태는
// 사용처 0. Last One 슬롯이 통에 노출되지 않으므로 본 분기는 호환 export로만 잔존.

const KIND_NORMAL_AVAILABLE = "normal-available";
const KIND_NORMAL_SELECTED = "normal-selected";  // B-α 신설
const KIND_NORMAL_DRAWN = "normal-drawn";
const KIND_LAST_ONE_PENDING = "last-one-pending";  // deprecated 2026-05-08
const KIND_LAST_ONE_DRAWN = "last-one-drawn";  // deprecated 2026-05-08

const LAST_ONE_LABEL = "L1";

export function renderPickSlot(props) {
  const { kind, gridIndex, onClick } = props;
  const el = document.createElement("button");
  el.type = "button";
  el.className = `pick-slot pick-slot-${kind}`;
  el.dataset.gridIndex = String(gridIndex);

  // B-α: normal-available + normal-selected 모두 클릭 가능 (토글).
  const isClickable = kind === KIND_NORMAL_AVAILABLE || kind === KIND_NORMAL_SELECTED;
  if (!isClickable) {
    el.disabled = true;
    el.setAttribute("aria-disabled", "true");
  }

  if (kind === KIND_LAST_ONE_PENDING || kind === KIND_LAST_ONE_DRAWN) {
    const label = document.createElement("span");
    label.className = "pick-slot-label";
    label.textContent = LAST_ONE_LABEL;
    el.appendChild(label);
    el.setAttribute("aria-label", "Last One 슬롯 (마지막 일반 슬롯 뽑힐 때 자동 지급)");
    el.title = "마지막 일반 슬롯 뽑힐 때 자동 지급";
  } else {
    const dot = document.createElement("span");
    dot.className = "pick-slot-dot";
    el.appendChild(dot);
    if (kind === KIND_NORMAL_SELECTED) {
      const check = document.createElement("span");
      check.className = "pick-slot-check";
      check.textContent = "✓";
      el.appendChild(check);
      el.setAttribute("aria-label", `슬롯 ${gridIndex + 1} (선택됨)`);
      el.setAttribute("aria-pressed", "true");
    } else if (kind === KIND_NORMAL_AVAILABLE) {
      el.setAttribute("aria-label", `슬롯 ${gridIndex + 1}`);
      el.setAttribute("aria-pressed", "false");
    } else {
      el.setAttribute("aria-label", `슬롯 ${gridIndex + 1} (이미 뽑힘)`);
    }
  }

  if (isClickable && typeof onClick === "function") {
    el.addEventListener("click", () => onClick(gridIndex));
  }

  return el;
}

export const PICK_SLOT_KINDS = {
  NORMAL_AVAILABLE: KIND_NORMAL_AVAILABLE,
  NORMAL_SELECTED: KIND_NORMAL_SELECTED,
  NORMAL_DRAWN: KIND_NORMAL_DRAWN,
  LAST_ONE_PENDING: KIND_LAST_ONE_PENDING,
  LAST_ONE_DRAWN: KIND_LAST_ONE_DRAWN,
};
