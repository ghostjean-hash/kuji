// 좌측 가장자리 드래그 핸들러 (M2 신설). pointer events 사용.
// 03_architecture 3.17.

export function attachLeftEdgeDrag(el, { onProgress, onCommit, threshold }) {
  let startX = 0;
  let dragging = false;
  let elWidth = 0;

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    // 자식 인터랙티브 요소(button/input/a/textarea/select)는 드래그 무시 (클릭 우선)
    if (e.target && typeof e.target.closest === "function" &&
        e.target.closest("button, input, a, textarea, select")) {
      return;
    }
    dragging = true;
    elWidth = el.getBoundingClientRect().width;
    startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    if (el.setPointerCapture && e.pointerId !== undefined) {
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    el.classList.add("is-dragging");
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const dx = x - startX;
    const progress = Math.max(0, Math.min(1, dx / elWidth));
    if (onProgress) onProgress(progress);
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    const x = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX) ?? startX;
    const dx = x - startX;
    const progress = Math.max(0, Math.min(1, dx / elWidth));
    el.classList.remove("is-dragging");
    el.releasePointerCapture && e.pointerId !== undefined && el.releasePointerCapture(e.pointerId);
    if (progress >= threshold) {
      if (onCommit) onCommit();
    } else {
      if (onProgress) onProgress(0);
    }
  }

  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);

  return function detach() {
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
  };
}
