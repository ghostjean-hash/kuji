// Last One 시각 강조 (M2 신설). 박스 deck 잔여 1매 시점에 표시.

import { getLineupById, LAST_ONE_TIER_NAME } from "../data/numbers.js";  // M4.2 LAST_ONE_TIER_NAME 일괄 단일화

export function renderLastOneIndicator(state) {
  if (state.boxState.deck.length !== 1) return null;

  const lineup = getLineupById(state.currentLineupId);
  // M5: lineup.lastOneEnabled === false 시 미렌더 (spec 5.4.6 정합).
  if (lineup.lastOneEnabled === false) return null;
  const lastOne = lineup.tiers.find((t) => t.tier === LAST_ONE_TIER_NAME);
  if (!lastOne) return null;

  const el = document.createElement("section");
  el.className = "last-one-indicator";
  el.innerHTML = `
    <span class="badge-text">LAST ONE 임박</span>
    <span class="prize-text">${lastOne.nameKo}</span>
  `;
  return el;
}
