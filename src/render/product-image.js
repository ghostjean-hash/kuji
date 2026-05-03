// 상품 SVG + 딤드 + 뽑힌 복권 오버레이 (M2 신설).

import { getProductMainAsset } from "../data/assets.js";
import { PRODUCT_OVERLAY_TICKETS_MAX } from "../data/numbers.js";

export function renderProductImage({ tier, isDimmed, drawnCount }) {
  const wrap = document.createElement("div");
  wrap.className = "product-image-wrap" + (isDimmed ? " is-dimmed" : "");
  wrap.innerHTML = getProductMainAsset(tier);

  if (drawnCount > 0) {
    const overlay = document.createElement("div");
    overlay.className = "product-image-overlay";
    const cap = Math.min(drawnCount, PRODUCT_OVERLAY_TICKETS_MAX);
    for (let i = 0; i < cap; i++) {
      const t = document.createElement("div");
      t.className = "peeled-ticket-mini";
      overlay.appendChild(t);
    }
    wrap.appendChild(overlay);
  }
  return wrap;
}
