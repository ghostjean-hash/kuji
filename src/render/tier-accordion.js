// 종별 펼침 그리드 (M2 신설). typeCount ≥ 2 등급의 종 인덱스별 placeholder + 뽑힘 표시.

import { getProductMainAsset } from "../data/assets.js";

export function renderTierAccordion({ tier, typeCount, drawnTypeIndices }) {
  const grid = document.createElement("div");
  grid.className = "tier-types-grid";
  const drawnSet = new Set(drawnTypeIndices);
  for (let i = 0; i < typeCount; i++) {
    const cell = document.createElement("div");
    cell.className = "tier-type-cell" + (drawnSet.has(i) ? " is-drawn" : "");
    // M2 1차: 종별 자산은 메인 재사용 (PRODUCT_ASSETS_MAIN_PLACEHOLDER)
    const numLabel = document.createElement("span");
    numLabel.textContent = String(i + 1);
    cell.appendChild(numLabel);
    grid.appendChild(cell);
  }
  return grid;
}
