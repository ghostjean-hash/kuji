// 등급 1개 항목 (M2 신설). 1매 등급 vs 다수 등급 분기.

import { TIER_COLORS } from "../data/colors.js";
import { renderProductImage } from "./product-image.js";
import { renderTierGauge } from "./tier-gauge.js";
import { renderTierAccordion } from "./tier-accordion.js";

export function renderProductItem({ tierMeta, drawnCount, drawnTypeIndices, isLastOnePulsing, isJustDrawn, isExpanded, onToggle }) {
  const item = document.createElement("div");
  item.className = "product-item"
    + (tierMeta.tier === "Last One" ? " is-last-one" : "")
    + (isExpanded ? " is-expanded" : "")
    + (isLastOnePulsing ? " is-pulsing" : "")
    + (isJustDrawn ? " is-just-drawn" : "");
  item.style.setProperty("--tier-color", TIER_COLORS[tierMeta.tier] || "#9C8B78");

  const header = document.createElement("div");
  header.className = "product-item-header";
  header.addEventListener("click", () => onToggle && onToggle(tierMeta.tier));

  const badge = document.createElement("span");
  badge.className = "product-tier-badge" + (tierMeta.tier === "Last One" ? " is-last-one" : "");
  badge.style.background = TIER_COLORS[tierMeta.tier] || "#9C8B78";
  badge.textContent = tierMeta.tier === "Last One" ? "Last One" : tierMeta.tier;
  header.appendChild(badge);

  const info = document.createElement("div");
  info.className = "product-info";
  info.innerHTML = `
    <span class="product-name">${tierMeta.nameKo}</span>
    <span class="product-name-ja">${tierMeta.nameJa}</span>
  `;
  header.appendChild(info);

  const remaining = tierMeta.count - drawnCount;
  const count = document.createElement("span");
  count.className = "product-count";
  count.innerHTML = `${remaining}<span class="count-total"> / ${tierMeta.count}</span>`;
  header.appendChild(count);

  const arrow = document.createElement("span");
  arrow.className = "accordion-arrow";
  arrow.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  header.appendChild(arrow);

  item.appendChild(header);

  // 다수 등급(typeCount >= 2): 게이지 표시
  if (tierMeta.typeCount >= 2) {
    item.appendChild(renderTierGauge({ drawn: drawnCount, total: tierMeta.count }));
  }

  // 본문 (펼침 시)
  const body = document.createElement("div");
  body.className = "product-item-body";

  if (tierMeta.typeCount >= 2) {
    body.appendChild(renderTierAccordion({
      tier: tierMeta.tier,
      typeCount: tierMeta.typeCount,
      drawnTypeIndices,
    }));
  } else {
    // 1매 등급: 이미지 + 딤드 + 오버레이
    const imageWrap = renderProductImage({
      tier: tierMeta.tier,
      isDimmed: drawnCount >= tierMeta.count,
      drawnCount,
    });
    body.appendChild(imageWrap);
  }
  item.appendChild(body);

  return item;
}
