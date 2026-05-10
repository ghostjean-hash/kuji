// 헤더: 라인업 타이틀 + IP 라벨 (M3 신설, spec 4 / 5.13.A.3 정합).
// M3.1 / M4 갱신: IP 라벨 클릭 = 홈 view 복귀.
// M4.1 갱신 (5.13.A.3.2 / 자비스 단계 1 결정 4.1.A): 클릭 affordance 폐기. 라벨 = 표시 전용 <span>.

import { getLineupById } from "../data/numbers.js";

export function renderHeader(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("header");
  el.className = "app-header";
  const title = document.createElement("h1");
  title.className = "app-title";
  title.textContent = lineup.titleKo;
  el.appendChild(title);

  // M4.1: IP 라벨 클릭 affordance 폐기. <button> → <span> 변경 + 이벤트 리스너 제거.
  // 라벨 = 활성 라인업 식별 표시 전용. 진입은 하단 홈 탭이 1차 (5.13.B.5.1).
  const ipLabel = document.createElement("span");
  ipLabel.className = "app-lineup-ip";
  ipLabel.textContent = lineup.ip;
  el.appendChild(ipLabel);
  return el;
}
