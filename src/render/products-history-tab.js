// 갤러리+기록 통합 탭 (M4 신설, 5.13.F).
// 4 sub-section = 상단 대시보드 / 중단 갤러리 / 하단 history 리스트 / DC 응모.
// M3.3 history-tab + product-gallery + M2 history 리스트 + M1 dc-tab 자산 통합.

import {
  HISTORY_RECENT_LIMIT,
  DC_POOL_SIZE_NOTE_KO,
  getLineupById,
  TIER_CLASS_LABEL_KO,
  TIER_CLASS_HERO,
  TIER_CLASS_MAIN,
  TIER_CLASS_GOODS,
} from "../data/numbers.js";
import { tierCounts, tierClassCounts } from "../core/history.js";
import { TIER_COLORS, COLOR_TIER_FALLBACK } from "../data/colors.js";
import { renderProductGallery } from "./product-gallery.js";
import { formatPercent } from "./format.js";

export function renderProductsHistoryTab(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const root = document.createElement("div");
  root.className = "products-history-tab";

  // sub-section 1: 상단 대시보드 (M3.3 자산)
  root.appendChild(renderDashboard(state, lineup));

  // sub-section 2: 중단 갤러리 그룹 (M3.3 자산)
  root.appendChild(renderProductGallery(state, dispatch));

  // sub-section 3: 하단 history 리스트 (M2 자산, 무한 스크롤은 M4.1+ 검토 - 현재 HISTORY_RECENT_LIMIT)
  root.appendChild(renderHistoryList(state, lineup));

  // sub-section 4: DC 응모 (M1 dc-tab 자산 통합)
  // M5: lineup.dcEnabled === false 시 미렌더 (spec 5.5.7 / arch 4.5 정합).
  if (lineup.dcEnabled !== false) {
    root.appendChild(renderDcSection(state, lineup, dispatch));
  }

  return root;
}

function renderDashboard(state, lineup) {
  const classCounts = tierClassCounts(state.history, lineup);
  const dashboard = document.createElement("section");
  dashboard.className = "history-dashboard";
  const cards = [
    { key: "total", label: "전체", value: classCounts.total, modifier: "is-total" },
    { key: TIER_CLASS_HERO, label: TIER_CLASS_LABEL_KO[TIER_CLASS_HERO], value: classCounts[TIER_CLASS_HERO], modifier: "is-hero" },
    { key: TIER_CLASS_MAIN, label: TIER_CLASS_LABEL_KO[TIER_CLASS_MAIN], value: classCounts[TIER_CLASS_MAIN], modifier: "is-main" },
    { key: TIER_CLASS_GOODS, label: TIER_CLASS_LABEL_KO[TIER_CLASS_GOODS], value: classCounts[TIER_CLASS_GOODS], modifier: "is-goods" },
  ];
  for (const c of cards) {
    const card = document.createElement("div");
    card.className = `history-dashboard-card ${c.modifier}`;
    card.innerHTML = `
      <div class="history-dashboard-card-value">${c.value}</div>
      <div class="history-dashboard-card-label">${c.label}</div>
    `;
    dashboard.appendChild(card);
  }
  return dashboard;
}

function renderHistoryList(state, lineup) {
  const section = document.createElement("section");
  section.className = "history-list";
  const title = document.createElement("h2");
  title.textContent = "최근 추첨";
  section.appendChild(title);
  const list = document.createElement("ul");
  // M4 round 2 채택 = 무한 스크롤 의도 - HISTORY_RECENT_LIMIT 그대로 활용 (M4.1-tidy 또는 별도 사이클에서 진정한 무한 스크롤 도입).
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
  section.appendChild(list);
  return section;
}

function renderDcSection(state, lineup, dispatch) {
  const dc = lineup.dc;
  const section = document.createElement("section");
  section.className = "dc-section";

  const head = document.createElement("div");
  head.className = "dc-head";
  head.innerHTML = `
    <h2>Double Chance</h2>
    <p class="dc-prize">${dc.prizeNameKo} <small>(${dc.prizeNameJa})</small></p>
    <p class="dc-prob">당첨자 ${dc.winnersTotal}명 / 풀 ${dc.poolSizeDefault}매 (단순화 가정)</p>
    <p class="dc-note">${DC_POOL_SIZE_NOTE_KO}</p>
    <p class="dc-note">${dc.prizeNoteKo}</p>
  `;
  section.appendChild(head);

  const ticketCount = state.dcTickets.length;
  const p = dc.winnersTotal / dc.poolSizeDefault;
  const probWin = ticketCount > 0 ? 1 - Math.pow(1 - p, ticketCount) : 0;
  const ticketsSection = document.createElement("div");
  ticketsSection.className = "dc-tickets";
  ticketsSection.innerHTML = `
    <div class="kpi"><div class="kpi-label">응모권</div><div class="kpi-value">${ticketCount}매</div></div>
    <div class="kpi"><div class="kpi-label">시행 시 당첨 확률</div><div class="kpi-value">${formatPercent(probWin)}</div></div>
  `;
  section.appendChild(ticketsSection);

  const btn = document.createElement("button");
  btn.className = "dc-draw-button";
  if (ticketCount === 0) {
    btn.disabled = true;
    btn.textContent = "응모권 없음";
  } else {
    btn.textContent = "Double Chance 추첨";
    btn.addEventListener("click", () => dispatch({ type: "draw_dc" }));
  }
  section.appendChild(btn);

  if (state.dcResults.length > 0) {
    const resultSection = document.createElement("div");
    resultSection.className = "dc-results";
    const resultTitle = document.createElement("h3");
    resultTitle.textContent = "DC 추첨 이력";
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
    section.appendChild(resultSection);
  }
  return section;
}
