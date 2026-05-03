import { showModal } from "./modal.js";

export function showLastOneModal(result) {
  const body = `
    <div class="result-section">
      <div class="result-section-title">마지막 카드</div>
      <div class="result-tier" data-tier="${result.tier}">${result.tier}</div>
      <div class="result-name">${result.nameKo}</div>
      <div class="result-name-ja"><small>${result.nameJa}</small></div>
      <div class="result-size">${result.sizeLabel}</div>
    </div>
    <div class="result-section is-last-one">
      <div class="result-section-title">+ Last One 보너스</div>
      <div class="result-tier" data-tier="Last One">Last One</div>
      <div class="result-name">${result.lastOnePrize.nameKo}</div>
      <div class="result-name-ja"><small>${result.lastOnePrize.nameJa}</small></div>
      <div class="result-size">${result.lastOnePrize.sizeLabel}</div>
    </div>
  `;
  showModal({
    title: "박스 종료 + Last One!",
    body,
    confirmLabel: "확인",
  });
}
