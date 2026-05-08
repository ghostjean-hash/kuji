// 추정값 배지. M3: 호출처에서 lineup.sources 전달.
// 현재 호출처 0건 (M2 디자인 변경 후 dead module). 호환 유지를 위해 시그니처만 갱신.

import { COLOR_BADGE_ESTIMATED } from "../data/colors.js";
import { showModal } from "./modal.js";

export function renderEstimatedBadge(lineup) {
  const badge = document.createElement("button");
  badge.className = "estimated-badge";
  badge.style.backgroundColor = COLOR_BADGE_ESTIMATED;
  badge.textContent = "추정";
  badge.addEventListener("click", () => {
    const sources = lineup && Array.isArray(lineup.sources) ? lineup.sources : [];
    const list = sources.map(
      (s) =>
        `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a></li>`
    ).join("");
    showModal({
      title: "추정값 출처",
      body: `<p>박스 매수 / 등급별 매수는 추정값입니다. 1차 출처:</p><ul>${list}</ul>`,
      confirmLabel: "확인",
    });
  });
  return badge;
}
