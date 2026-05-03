// Last One 시각 강조 (M2 신설). 박스 deck 잔여 1매 시점에 표시.

import { TIERS } from "../data/numbers.js";

export function renderLastOneIndicator(state) {
  if (state.boxState.deck.length !== 1) return null;

  const lastOne = TIERS.find((t) => t.tier === "Last One");
  if (!lastOne) return null;

  const el = document.createElement("section");
  el.className = "last-one-indicator";
  el.innerHTML = `
    <span class="badge-text">LAST ONE 임박</span>
    <span class="prize-text">${lastOne.nameKo}</span>
  `;
  return el;
}
