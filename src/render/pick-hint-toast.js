// 통 선택 첫 진입 안내 toast (M2.1 신설). 03_architecture 3.16. 01_spec 5.14.7.
// PICK_FIRST_HINT_DURATION_MS 후 자동 dismiss. 사용자 탭 시 즉시 dismiss.
// dismiss 시 dispatch.pick_hint_seen → state.meta.pickHintSeen = true 영속.

import {
  PICK_FIRST_HINT_DURATION_MS,
  PICK_FIRST_HINT_TEXT_KO,
} from "../data/numbers.js";

export function renderPickHintToast(dispatch) {
  const el = document.createElement("div");
  el.className = "pick-hint-toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  const text = document.createElement("p");
  text.className = "pick-hint-text";
  text.textContent = PICK_FIRST_HINT_TEXT_KO;
  el.appendChild(text);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "pick-hint-close";
  close.textContent = "닫기";
  close.setAttribute("aria-label", "안내 닫기");
  el.appendChild(close);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    el.classList.add("is-dismissing");
    dispatch({ type: "pick_hint_seen" });
  };

  close.addEventListener("click", dismiss);
  el.addEventListener("click", (e) => {
    if (e.target === el || e.target === text) dismiss();
  });

  setTimeout(dismiss, PICK_FIRST_HINT_DURATION_MS);

  return el;
}
