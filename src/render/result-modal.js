import { showModal } from "./modal.js";
import { TIERS } from "../data/numbers.js";

export function showResultModal(result) {
  const tierMeta = TIERS.find((t) => t.tier === result.tier);
  const typeLabel =
    tierMeta && tierMeta.typeCount > 1
      ? ` (${result.typeIndex + 1} / ${tierMeta.typeCount})`
      : "";
  const body = `
    <div class="result-tier" data-tier="${result.tier}">${result.tier}</div>
    <div class="result-name">${result.nameKo}${typeLabel}</div>
    <div class="result-name-ja"><small>${result.nameJa}</small></div>
    <div class="result-size">${result.sizeLabel}</div>
  `;
  showModal({
    title: "추첨 결과",
    body,
    confirmLabel: "확인",
  });
}
