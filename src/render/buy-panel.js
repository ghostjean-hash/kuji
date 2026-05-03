// 구매 패널 (M2 신설, 03_architecture 3.x).
// Quick(1/3/10) + 자유 입력 + 가격 합산 + 구매 버튼.

import { BUY_QUICK_OPTIONS, BUY_FREE_INPUT_MIN, LINEUP_PRICE_JPY } from "../data/numbers.js";
import { remaining } from "../core/box.js";
import { validateBuyCount } from "../core/buy.js";

export function renderBuyPanel(state, dispatch) {
  const el = document.createElement("section");
  el.className = "buy-panel";

  const deckRemaining = state.boxState.deck.length;

  const title = document.createElement("h2");
  title.className = "buy-panel-title";
  title.innerHTML = `복권 구매 <span class="deck-remaining">박스 잔여 ${deckRemaining}매</span>`;
  el.appendChild(title);

  let selectedCount = state.lastBuyCount && state.lastBuyCount <= deckRemaining
    ? state.lastBuyCount
    : Math.min(BUY_QUICK_OPTIONS[0], deckRemaining);

  const quickRow = document.createElement("div");
  quickRow.className = "buy-quick-row";
  for (const n of BUY_QUICK_OPTIONS) {
    const btn = document.createElement("button");
    btn.className = "buy-quick-button" + (selectedCount === n ? " is-selected" : "");
    btn.textContent = `${n}매`;
    if (n > deckRemaining) btn.disabled = true;
    btn.addEventListener("click", () => {
      selectedCount = n;
      freeInput.value = String(n);
      refreshUI();
    });
    quickRow.appendChild(btn);
  }
  el.appendChild(quickRow);

  const freeRow = document.createElement("div");
  freeRow.className = "buy-free-row";
  const freeInput = document.createElement("input");
  freeInput.type = "number";
  freeInput.className = "buy-free-input";
  freeInput.min = String(BUY_FREE_INPUT_MIN);
  freeInput.max = String(deckRemaining);
  freeInput.value = String(selectedCount);
  freeInput.addEventListener("input", () => {
    const v = Number(freeInput.value);
    if (Number.isFinite(v)) {
      selectedCount = v;
      refreshUI();
    }
  });
  const freeLabel = document.createElement("span");
  freeLabel.className = "buy-free-label";
  freeLabel.textContent = "자유 입력 (매)";
  freeRow.appendChild(freeInput);
  freeRow.appendChild(freeLabel);
  el.appendChild(freeRow);

  const summary = document.createElement("div");
  summary.className = "buy-summary";
  el.appendChild(summary);

  const buyBtn = document.createElement("button");
  buyBtn.className = "buy-button";
  buyBtn.addEventListener("click", () => {
    const v = validateBuyCount(selectedCount, deckRemaining);
    if (!v.ok) {
      errorEl.textContent = v.error;
      return;
    }
    dispatch({ type: "buy", count: selectedCount });
  });
  el.appendChild(buyBtn);

  const errorEl = document.createElement("div");
  errorEl.className = "buy-error";
  el.appendChild(errorEl);

  // M2.1: 통에서 선택 건너뛰기 체크박스 (구매 패널 + 설정 탭 양방향 동기화)
  const skipRow = document.createElement("label");
  skipRow.className = "buy-skip-row";
  const skipInput = document.createElement("input");
  skipInput.type = "checkbox";
  skipInput.className = "buy-skip-checkbox";
  skipInput.checked = !!state.settingsSkipPick;
  skipInput.addEventListener("change", () => {
    dispatch({ type: "set_skip_pick", value: skipInput.checked });
  });
  const skipLabel = document.createElement("span");
  skipLabel.className = "buy-skip-label";
  skipLabel.textContent = "통에서 선택 건너뛰기 (바로 뜯기)";
  skipRow.appendChild(skipInput);
  skipRow.appendChild(skipLabel);
  el.appendChild(skipRow);

  function refreshUI() {
    const v = validateBuyCount(selectedCount, deckRemaining);
    summary.innerHTML = `<span class="label">${selectedCount}매 × ${LINEUP_PRICE_JPY}엔</span><span class="price">${(selectedCount * LINEUP_PRICE_JPY).toLocaleString()}엔</span>`;
    buyBtn.textContent = v.ok ? `${selectedCount}매 구매하기` : "구매 불가";
    buyBtn.disabled = !v.ok;
    errorEl.textContent = v.ok ? "" : (v.error || "");
    for (const btn of quickRow.querySelectorAll(".buy-quick-button")) {
      btn.classList.toggle("is-selected", btn.textContent === `${selectedCount}매`);
    }
  }
  refreshUI();

  return el;
}
