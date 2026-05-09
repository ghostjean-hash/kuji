// 단일 복권 카드 (M2 신설). 외부 면 → 내부 면 페이지플립.
// 03_architecture 3.15. research/05_kuji_ticket_form.md 폼 모사.
// M3.2 갱신: hero 분기 (5.13.C.3) - lineup 인자 추가, getTierClassForTier 룩업.

import { PEEL_DRAG_THRESHOLD_RATIO, PEEL_HAPTIC_HALF_MS, PEEL_HAPTIC_FULL_MS, PEEL_HAPTIC_FULL_DELAY_MS, getTierClassForTier, TIER_CLASS_HERO } from "../data/numbers.js";
import { attachLeftEdgeDrag } from "../input/drag.js";

export function renderPeelCard({ ticket, onReveal, onConfirm, revealedResult, isConfirmDisabled, lineup }) {
  const card = document.createElement("div");
  card.className = "peel-card";
  card.dataset.ticketId = ticket.id;

  // M3.2: hero 분기 식 (5.13.C.3.1). result.isLastOne || tierClass === HERO. lookup 주체 = 결과 표시 영역.
  function applyHeroClassIfNeeded(result) {
    if (!result || !lineup) return;
    const tierClass = getTierClassForTier(lineup, result.tier);
    const isHero = result.isLastOne === true || tierClass === TIER_CLASS_HERO;
    if (isHero) card.classList.add("is-hero-result");
  }

  const inner = document.createElement("div");
  inner.className = "peel-card-inner";
  card.appendChild(inner);

  // 외부 면
  const outer = document.createElement("div");
  outer.className = "peel-face outer";
  outer.innerHTML = `
    <div class="frame-logo">一番くじ</div>
    <div class="ip-label">DRAGONBALL</div>
    <div class="perforation"></div>
    <div class="peri-guide">
      <div class="peri-guide-arrow"></div>
      <span>ペリペリ</span>
    </div>
  `;
  inner.appendChild(outer);

  // 내부 면 (reveal 시 채워짐)
  const innerFace = document.createElement("div");
  innerFace.className = "peel-face inner";
  innerFace.innerHTML = `<div class="tier-display">?</div>`;
  inner.appendChild(innerFace);

  function vibrate(ms) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  function reveal() {
    if (card.classList.contains("is-revealed")) return;
    vibrate(PEEL_HAPTIC_HALF_MS);
    card.classList.add("is-revealed");
    setTimeout(() => vibrate(PEEL_HAPTIC_FULL_MS), PEEL_HAPTIC_FULL_DELAY_MS);
    if (onReveal) {
      onReveal((result) => {
        applyHeroClassIfNeeded(result);  // M3.2
        renderInnerFace(result);
      });
    }
  }

  function renderInnerFace(result) {
    const tierClass = result.tier === "Last One" ? " is-last-one" : "";
    const sizeLabel = result.sizeLabel ? `<div class="product-size">${result.sizeLabel}</div>` : "";
    const disabledAttr = isConfirmDisabled ? "disabled" : "";
    innerFace.innerHTML = `
      <div class="tier-display${tierClass}">${result.tier}${result.tier === "Last One" ? "" : "賞"}</div>
      <div class="product-label">${result.nameKo}</div>
      <div class="product-label-ja">${result.nameJa}</div>
      ${sizeLabel}
      <button class="peel-confirm-button" type="button" ${disabledAttr}>확인</button>
    `;
    const confirmBtn = innerFace.querySelector(".peel-confirm-button");
    if (confirmBtn && onConfirm && !isConfirmDisabled) {
      confirmBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onConfirm();
      });
    }
  }

  // 좌측 드래그
  attachLeftEdgeDrag(card, {
    threshold: PEEL_DRAG_THRESHOLD_RATIO,
    onProgress: () => {},
    onCommit: reveal,
  });

  // 클릭 보조 (확인 버튼 / 인터랙티브 요소 클릭은 차단)
  card.addEventListener("click", (e) => {
    if (e.target && typeof e.target.closest === "function" &&
        e.target.closest("button, input, a")) return;
    if (card.classList.contains("is-revealed")) return;
    reveal();
  });

  // 이미 reveal된 결과가 있으면 그대로 (확인 버튼 포함)
  if (revealedResult) {
    card.classList.add("is-revealed");
    applyHeroClassIfNeeded(revealedResult);  // M3.2: 새로고침 복원 시에도 hero 클래스 부여
    renderInnerFace(revealedResult);
  }

  return card;
}
