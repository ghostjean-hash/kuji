import { showModal } from "./modal.js";

export function showStorageFallbackSheet() {
  const body = `
    <p>현재 브라우저에서 localStorage를 사용할 수 없어 메모리 모드로 동작합니다.</p>
    <p>새로고침하면 추첨 이력 / 시드가 초기화됩니다.</p>
    <p>해결: 브라우저의 쿠키 / 사이트 데이터 차단 해제, 시크릿 모드 해제, 또는 다른 브라우저 사용.</p>
  `;
  showModal({
    title: "스토리지 비활성",
    body,
    confirmLabel: "확인",
  });
}
