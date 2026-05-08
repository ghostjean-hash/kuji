// **2026-05-08 deprecated** - M2 (4.10.1)에서 페이지플립 인플레이스 흐름으로 폐기됨.
// 호출처 0건. M3 단계 5에서 lineup 인자 호환을 위해 시그니처만 갱신.
import { showModal } from "./modal.js";

export function showResultModal(result, lineup) {
  const tierMeta = lineup && Array.isArray(lineup.tiers)
    ? lineup.tiers.find((t) => t.tier === result.tier)
    : null;
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
