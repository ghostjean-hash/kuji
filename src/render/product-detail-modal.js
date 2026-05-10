// 상품 상세 팝업 (M2 신설). 영역 2/3/4 항목 클릭 시 호출. 갤러리 펼침 형태와 동일.

import { showModal } from "./modal.js";
import { TIER_COLORS } from "../data/colors.js";
import { LAST_ONE_TIER_NAME } from "../data/numbers.js";  // M4.2 LAST_ONE_TIER_NAME 일괄 단일화
import { renderProductImage } from "./product-image.js";
import { renderTierGauge } from "./tier-gauge.js";
import { renderTierAccordion } from "./tier-accordion.js";

export function showProductDetailModal({ tierMeta, drawnCount, drawnTypeIndices, mode, onReceive }) {
  const body = document.createElement("div");
  body.className = "product-detail-body";

  const remaining = tierMeta.count - drawnCount;
  const tierLabel = tierMeta.tier === LAST_ONE_TIER_NAME ? LAST_ONE_TIER_NAME : `${tierMeta.tier}賞`;

  const header = document.createElement("div");
  header.className = "detail-header";
  header.innerHTML = `
    <span class="detail-tier-badge" style="background: ${TIER_COLORS[tierMeta.tier] || "#9C8B78"}">${tierLabel}</span>
    <div class="detail-info">
      <div class="detail-name">${tierMeta.nameKo}</div>
      <div class="detail-name-ja">${tierMeta.nameJa}</div>
      <div class="detail-meta">${tierMeta.sizeLabel} · 잔여 ${remaining} / ${tierMeta.count}매</div>
    </div>
  `;
  body.appendChild(header);

  // 상품 상세 모달은 딤드 / drawn 표시 없이 깔끔한 상품 이미지 / 정보만 표시.
  // 잔여 카운트는 detail-meta 텍스트로 이미 노출.
  if (tierMeta.typeCount >= 2) {
    body.appendChild(renderTierGauge({ drawn: drawnCount, total: tierMeta.count }));
    body.appendChild(renderTierAccordion({
      tier: tierMeta.tier,
      typeCount: tierMeta.typeCount,
      drawnTypeIndices: [],
    }));
  } else {
    body.appendChild(renderProductImage({
      tier: tierMeta.tier,
      isDimmed: false,
      drawnCount: 0,
    }));
  }

  if (mode === "receive") {
    showModal({
      title: "상품 받기",
      body,
      confirmLabel: "확인",
      onConfirm: onReceive,
    });
  } else {
    showModal({ title: "상품 상세", body, confirmLabel: "닫기" });
  }
}
