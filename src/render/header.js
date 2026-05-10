// 헤더: 라인업 타이틀 + IP 라벨 (M3 신설, spec 4 / 5.13.A.3 정합).
// M3.1 / M4 갱신 (5.13.A.3.2): IP 라벨 클릭 = 홈 view 복귀.

import { getLineupById, DISPATCH_TYPE_OPEN_HOME } from "../data/numbers.js";

export function renderHeader(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("header");
  el.className = "app-header";
  const title = document.createElement("h1");
  title.className = "app-title";
  title.textContent = lineup.titleKo;
  el.appendChild(title);

  // M4: IP 라벨 클릭 = 홈 복귀 (사용자 결정 9.5 / 10.7 IP 라벨 클릭만).
  const ipLabel = document.createElement("button");
  ipLabel.type = "button";
  ipLabel.className = "app-lineup-ip";
  ipLabel.textContent = lineup.ip;
  ipLabel.setAttribute("aria-label", "쿠지 홈으로");
  ipLabel.addEventListener("click", () => {
    dispatch({ type: DISPATCH_TYPE_OPEN_HOME });
  });
  el.appendChild(ipLabel);
  return el;
}
