import {
  DC_WINNERS_TOTAL,
  DC_POOL_SIZE_DEFAULT,
  DC_POOL_SIZE_NOTE_KO,
  DC_PRIZE_NAME_KO,
  DC_PRIZE_NAME_JA,
  DC_PRIZE_NOTE_KO,
} from "../data/numbers.js";
import { formatPercent } from "./format.js";

export function renderDcTab(state, dispatch) {
  const el = document.createElement("div");
  el.className = "dc-tab";

  const head = document.createElement("section");
  head.className = "dc-head";
  head.innerHTML = `
    <h2>Double Chance</h2>
    <p class="dc-prize">${DC_PRIZE_NAME_KO} <small>(${DC_PRIZE_NAME_JA})</small></p>
    <p class="dc-prob">당첨자 ${DC_WINNERS_TOTAL}명 / 풀 ${DC_POOL_SIZE_DEFAULT}매 (단순화 가정)</p>
    <p class="dc-note">${DC_POOL_SIZE_NOTE_KO}</p>
    <p class="dc-note">${DC_PRIZE_NOTE_KO}</p>
  `;
  el.appendChild(head);

  const ticketCount = state.dcTickets.length;
  const p = DC_WINNERS_TOTAL / DC_POOL_SIZE_DEFAULT;
  const probWin = ticketCount > 0 ? 1 - Math.pow(1 - p, ticketCount) : 0;
  const ticketsSection = document.createElement("section");
  ticketsSection.className = "dc-tickets";
  ticketsSection.innerHTML = `
    <div class="kpi"><div class="kpi-label">응모권</div><div class="kpi-value">${ticketCount}매</div></div>
    <div class="kpi"><div class="kpi-label">시행 시 당첨 확률</div><div class="kpi-value">${formatPercent(probWin)}</div></div>
  `;
  el.appendChild(ticketsSection);

  const btn = document.createElement("button");
  btn.className = "dc-draw-button";
  if (ticketCount === 0) {
    btn.disabled = true;
    btn.textContent = "응모권 없음";
  } else {
    btn.textContent = "Double Chance 추첨";
    btn.addEventListener("click", () => dispatch({ type: "draw_dc" }));
  }
  el.appendChild(btn);

  if (state.dcResults.length > 0) {
    const resultSection = document.createElement("section");
    resultSection.className = "dc-results";
    const resultTitle = document.createElement("h3");
    resultTitle.textContent = "추첨 이력";
    resultSection.appendChild(resultTitle);
    const list = document.createElement("ul");
    for (const r of state.dcResults.slice().reverse()) {
      const li = document.createElement("li");
      li.className = `dc-result-item ${r.isWin ? "is-win" : "is-miss"}`;
      const time = new Date(r.time).toLocaleString("ko-KR");
      li.innerHTML = `
        <span class="dc-result-status">${r.isWin ? "당첨" : "미당첨"}</span>
        <span class="dc-result-prob">${formatPercent(r.probability)} (${r.ticketsCount}매)</span>
        <span class="dc-result-time">${time}</span>
      `;
      list.appendChild(li);
    }
    resultSection.appendChild(list);
    el.appendChild(resultSection);
  }

  return el;
}
