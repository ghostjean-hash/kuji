// 표시 포맷 헬퍼. 매직 넘버 회피.

import { PERCENT_BASE, PERCENT_DISPLAY_DECIMALS } from "../data/numbers.js";

export function formatPercent(p, decimals = PERCENT_DISPLAY_DECIMALS) {
  return `${(p * PERCENT_BASE).toFixed(decimals)}%`;
}
