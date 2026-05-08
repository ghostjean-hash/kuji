import { DC_POOL_SIZE_NOTE_KO, getLineupById } from "../data/numbers.js";
import { formatPercent } from "./format.js";

export function renderDcTab(state, dispatch) {
  // M3: 활성 라인업의 dc 객체 동적 lookup.
  const lineup = getLineupById(state.currentLineupId);
  const dc = lineup.dc;
  const el = document.createElement("div");
  el.className = "dc-tab";

  const head = document.createElement("section");
  head.className = "dc-head";
  head.innerHTML = `
    <h2>Double Chance</h2>
    <p class="dc-prize">${dc.prizeNameKo} <small>(${dc.prizeNameJa})</small></p>
    <p class="dc-prob">당첨자 ${dc.winnersTotal}명 / 풀 ${dc.poolSizeDefault}매 (단순화 가정)</p>
    <p class="dc-note">${DC_POOL_SIZE_NOTE_KO}</p>
    <p class="dc-note">${dc.prizeNoteKo}</p>
  `;
  el.appendChild(head);

  const ticketCount = state.dcTickets.length;
  const p = dc.winnersTotal / dc.poolSizeDefault;
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
