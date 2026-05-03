// 키보드 입력 핸들러 (03_architecture 3.13).
// Tab은 브라우저 기본, Enter는 활성 추첨 버튼, Esc는 활성 모달 닫기.

export function attachKeyboard({ onEscape, onEnter }) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (onEscape) onEscape();
      return;
    }
    if (e.key === "Enter") {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      if (onEnter) onEnter();
    }
  });
}
