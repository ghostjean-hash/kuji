// 가로 스크롤 컨테이너에 PC 마우스 드래그 + 휠 가로 변환 핸들러 부착 (M2 신설).
// 모바일 터치는 브라우저 기본 동작 그대로 사용.

const DRAG_SPEED_MULTIPLIER = 1.5;
const DRAG_INTENT_THRESHOLD_PX = 4;

export function attachHorizontalDragScroll(el) {
  let isDown = false;
  let dragMoved = false;
  let startX = 0;
  let scrollLeft = 0;

  function onMouseDown(e) {
    if (e.button !== 0) return;
    isDown = true;
    dragMoved = false;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    el.classList.add("is-dragging-scroll");
  }
  function onMouseUp() {
    isDown = false;
    el.classList.remove("is-dragging-scroll");
  }
  function onMouseLeave() {
    isDown = false;
    el.classList.remove("is-dragging-scroll");
  }
  function onMouseMove(e) {
    if (!isDown) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * DRAG_SPEED_MULTIPLIER;
    if (Math.abs(walk) > DRAG_INTENT_THRESHOLD_PX) {
      dragMoved = true;
      e.preventDefault();
    }
    el.scrollLeft = scrollLeft - walk;
  }
  function onClickCapture(e) {
    // 드래그 직후 발생하는 click은 차단 (자식 카드의 click과 충돌 방지)
    if (dragMoved) {
      e.stopPropagation();
      e.preventDefault();
      dragMoved = false;
    }
  }
  function onWheel(e) {
    // 세로 휠 → 가로 스크롤 변환 (가로 휠은 브라우저 기본)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }

  el.addEventListener("mousedown", onMouseDown);
  el.addEventListener("mouseup", onMouseUp);
  el.addEventListener("mouseleave", onMouseLeave);
  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("click", onClickCapture, true);
  el.addEventListener("wheel", onWheel, { passive: false });

  return function detach() {
    el.removeEventListener("mousedown", onMouseDown);
    el.removeEventListener("mouseup", onMouseUp);
    el.removeEventListener("mouseleave", onMouseLeave);
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("click", onClickCapture, true);
    el.removeEventListener("wheel", onWheel);
  };
}
