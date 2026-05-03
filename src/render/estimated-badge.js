import { COLOR_BADGE_ESTIMATED } from "../data/colors.js";
import { LINEUP_SOURCES } from "../data/numbers.js";
import { showModal } from "./modal.js";

export function renderEstimatedBadge() {
  const badge = document.createElement("button");
  badge.className = "estimated-badge";
  badge.style.backgroundColor = COLOR_BADGE_ESTIMATED;
  badge.textContent = "추정";
  badge.addEventListener("click", () => {
    const list = LINEUP_SOURCES.map(
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
