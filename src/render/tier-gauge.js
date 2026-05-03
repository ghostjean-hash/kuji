// 잔여 게이지 바 (M2 신설). drawn / total 비율 시각화.

import { PERCENT_BASE } from "../data/numbers.js";

export function renderTierGauge({ drawn, total }) {
  const wrap = document.createElement("div");
  wrap.className = "tier-gauge";
  const fill = document.createElement("div");
  fill.className = "tier-gauge-fill";
  const ratio = total > 0 ? Math.min(1, drawn / total) : 0;
  fill.style.width = `${ratio * PERCENT_BASE}%`;
  wrap.appendChild(fill);
  return wrap;
}
