// 구매 패널 (M2 신설, 03_architecture 3.x).
// Quick(1/3/10) + 자유 입력 + 가격 합산 + 구매 버튼.

import { BUY_QUICK_OPTIONS, BUY_FREE_INPUT_MIN, getLineupById } from "../data/numbers.js";
import { remaining } from "../core/box.js";
import { validateBuyCount } from "../core/buy.js";

export function renderBuyPanel(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const priceJpy = lineup.priceJpy;
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

  // 잔여가 quick 옵션에 정확히 일치하지 않을 때, 첫 번째 ">잔여" 옵션을 잔여 수량 버튼으로 치환.
  // 예: 잔여 8 → [1,3,5,8(was 10)] / 잔여 4 → [1,3,4(was 5),10(disabled)] / 잔여 2 → [1,2(was 3),5(d),10(d)]
  const isInQuickOptions = BUY_QUICK_OPTIONS.includes(deckRemaining);
  let replacedOption = null;
  if (!isInQuickOptions && deckRemaining >= 1 && deckRemaining < BUY_QUICK_OPTIONS[BUY_QUICK_OPTIONS.length - 1]) {
    for (const n of BUY_QUICK_OPTIONS) {
      if (n > deckRemaining) { replacedOption = n; break; }
    }
  }

  const quickRow = document.createElement("div");
  quickRow.className = "buy-quick-row";
  for (const n of BUY_QUICK_OPTIONS) {
    const btn = document.createElement("button");
    const isReplaced = n === replacedOption;
    const value = isReplaced ? deckRemaining : n;
    const disabled = !isReplaced && n > deckRemaining;
    // M5: 천장 활성 라인업 + ceilingPurchaseSize 옵션 = "S賞 확정" 라벨 부착 (spec 5.13.G.5.1).
    const isCeiling = lineup.ceilingEnabled === true
      && !isReplaced
      && n === lineup.ceilingPurchaseSize
      && !disabled;
    btn.className = "buy-quick-button"
      + (selectedCount === value ? " is-selected" : "")
      + (isCeiling ? " is-ceiling" : "");
    btn.textContent = isCeiling
      ? `${value}매 (${lineup.ceilingTier}賞 확정)`
      : `${value}매`;
    if (disabled) btn.disabled = true;
    btn.addEventListener("click", () => {
      selectedCount = value;
      freeInput.value = String(value);
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
    summary.innerHTML = `<span class="label">${selectedCount}매 × ${priceJpy}엔</span><span class="price">${(selectedCount * priceJpy).toLocaleString()}엔</span>`;
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
