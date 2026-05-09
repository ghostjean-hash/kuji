// DC 결과 모달.
// M3.2 갱신 (5.13.C.3.4): DC.tierClass=hero이므로 당첨 시 hero 모션 적용.

import { showModal } from "./modal.js";
import { formatPercent } from "./format.js";

export function showDcResultModal(result) {
  const body = result.isWin
    ? `
      <div class="dc-result is-win">
        <div class="dc-status">당첨</div>
        <div class="dc-prize">${result.prize.nameKo}</div>
        <div class="dc-prize-ja"><small>${result.prize.nameJa}</small></div>
        <div class="dc-prob">시행 확률 ${formatPercent(result.probability)} / 응모권 ${result.ticketsCount}매</div>
      </div>
    `
    : `
      <div class="dc-result is-miss">
        <div class="dc-status">미당첨</div>
        <div class="dc-prob">시행 확률 ${formatPercent(result.probability)} / 응모권 ${result.ticketsCount}매</div>
      </div>
    `;
  // M3.2: 당첨 시 hero 모션 (DC.tierClass=hero, 1.4-DB.3 / 1.4-OP.3 정합).
  const modalClassName = result.isWin ? "is-hero-result" : "";
  showModal({
    title: "Double Chance 결과",
    body,
    confirmLabel: "확인",
    modalClassName,
  });
}
