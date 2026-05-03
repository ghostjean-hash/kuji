import { TIERS, HISTORY_RECENT_LIMIT } from "../data/numbers.js";
import { tierCounts } from "../core/history.js";
import { TIER_COLORS, COLOR_TIER_FALLBACK } from "../data/colors.js";

export function renderHistoryTab(state, dispatch) {
  const el = document.createElement("div");
  el.className = "history-tab";

  const summary = document.createElement("section");
  summary.className = "history-summary";
  const totalDraws = state.history.length;
  const lastOneCount = state.history.filter((e) => e.isLastOne).length;
  const dcWins = state.dcResults.filter((r) => r.isWin).length;
  summary.innerHTML = `
    <div class="kpi"><div class="kpi-label">누적 추첨</div><div class="kpi-value">${totalDraws}</div></div>
    <div class="kpi"><div class="kpi-label">박스 종료</div><div class="kpi-value">${lastOneCount}</div></div>
    <div class="kpi"><div class="kpi-label">DC 응모</div><div class="kpi-value">${state.dcTickets.length}</div></div>
    <div class="kpi"><div class="kpi-label">DC 당첨</div><div class="kpi-value">${dcWins}</div></div>
  `;
  el.appendChild(summary);

  const counts = tierCounts(state.history);
  const countSection = document.createElement("section");
  countSection.className = "tier-counts";
  const countTitle = document.createElement("h2");
  countTitle.textContent = "등급별 누적";
  countSection.appendChild(countTitle);
  const countGrid = document.createElement("div");
  countGrid.className = "tier-counts-grid";
  for (const t of TIERS) {
    const item = document.createElement("div");
    item.className = "tier-count-item";
    item.style.setProperty("--tier-color", TIER_COLORS[t.tier]);
    item.innerHTML = `<span class="tier-label">${t.tier}</span><span class="tier-count">${counts[t.tier]}</span>`;
    countGrid.appendChild(item);
  }
  countSection.appendChild(countGrid);
  el.appendChild(countSection);

  const listSection = document.createElement("section");
  listSection.className = "history-list";
  const listTitle = document.createElement("h2");
  listTitle.textContent = "최근 추첨";
  listSection.appendChild(listTitle);
  const list = document.createElement("ul");
  const recent = state.history.slice(-HISTORY_RECENT_LIMIT).reverse();
  for (const e of recent) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.style.setProperty("--tier-color", TIER_COLORS[e.tier] || COLOR_TIER_FALLBACK);
    const time = new Date(e.time);
    const timeLabel = time.toLocaleString("ko-KR");
    li.innerHTML = `
      <span class="tier-label">${e.tier}</span>
      <span class="item-name">${e.nameKo}${e.isLastOne ? " + Last One" : ""}</span>
      <span class="item-time">${timeLabel}</span>
    `;
    list.appendChild(li);
  }
  if (recent.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "추첨 이력 없음";
    list.appendChild(empty);
  }
  listSection.appendChild(list);
  el.appendChild(listSection);

  return el;
}
