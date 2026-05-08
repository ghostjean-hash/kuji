// 헤더: 라인업 타이틀 + IP 라벨 (M3 신설, spec 4 / 5.13.A.3 정합).

import { getLineupById } from "../data/numbers.js";

export function renderHeader(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("header");
  el.className = "app-header";
  const title = document.createElement("h1");
  title.className = "app-title";
  title.textContent = lineup.titleKo;
  el.appendChild(title);

  // M3: IP 라벨 (정보성, 클릭 인터랙션 없음. 사용자 결정 8.3 (A))
  const ipLabel = document.createElement("span");
  ipLabel.className = "app-lineup-ip";
  ipLabel.textContent = lineup.ip;
  el.appendChild(ipLabel);
  return el;
}
