// 통(bin) 단일 슬롯 (M2.1 + B-α). 03_architecture 3.15.
// 3상태: normal-available / normal-selected / normal-drawn.
// **M3 단계 5 T17 정합**: LAST_ONE_PENDING / LAST_ONE_DRAWN dead 분기 완전 제거 (M2.1 정리 3.5.4).

const KIND_NORMAL_AVAILABLE = "normal-available";
const KIND_NORMAL_SELECTED = "normal-selected";  // B-α 신설
const KIND_NORMAL_DRAWN = "normal-drawn";

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

  if (isClickable && typeof onClick === "function") {
    el.addEventListener("click", () => onClick(gridIndex));
  }

  return el;
}

export const PICK_SLOT_KINDS = {
  NORMAL_AVAILABLE: KIND_NORMAL_AVAILABLE,
  NORMAL_SELECTED: KIND_NORMAL_SELECTED,
  NORMAL_DRAWN: KIND_NORMAL_DRAWN,
};
