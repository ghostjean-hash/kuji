import { showModal } from "./modal.js";

export function showDisclaimerSheet({ onDismiss }) {
  const body = `
    <p>본 시뮬레이터는 일본 쿠지(추첨식 상품) 메커닉의 학습 / 체험 목적입니다.</p>
    <p>실제 추첨이 아니며 상품이 실물로 지급되지 않습니다. 등급별 매수 / 박스 매수는 추정값일 수 있습니다.</p>
    <p>"수집 / 완주 경험" 목적이며 사행성 / 도박성 권유가 아닙니다.</p>
  `;
  showModal({
    title: "면책 안내",
    body,
    confirmLabel: "동의",
    onConfirm: onDismiss,
  });
}
