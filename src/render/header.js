// 헤더: 라인업 타이틀 + IP 라벨 (M3 신설, spec 4 / 5.13.A.3 정합).
// M3.1 갱신 (5.13.A.3.2): IP 라벨 클릭 = 로비 view 복귀.

import { getLineupById, DISPATCH_TYPE_OPEN_LOBBY } from "../data/numbers.js";

export function renderHeader(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("header");
  el.className = "app-header";
  const title = document.createElement("h1");
  title.className = "app-title";
  title.textContent = lineup.titleKo;
  el.appendChild(title);

  // M3.1: IP 라벨 클릭 = 로비 복귀 (사용자 결정 9.5).
  const ipLabel = document.createElement("button");
  ipLabel.type = "button";
  ipLabel.className = "app-lineup-ip";
  ipLabel.textContent = lineup.ip;
  ipLabel.setAttribute("aria-label", "라인업 선택 화면으로");
  ipLabel.addEventListener("click", () => {
    dispatch({ type: DISPATCH_TYPE_OPEN_LOBBY });
  });
  el.appendChild(ipLabel);
  return el;
}
