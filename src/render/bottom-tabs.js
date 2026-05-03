// 하단 탭 바 (M2: SVG 아이콘 적용).

import { renderIcon } from "./icon.js";
import { TAB_ICON_IDS } from "../data/numbers.js";

const TABS = [
  { id: "draw", label: "추첨" },
  { id: "history", label: "전적" },
  { id: "dc", label: "Double Chance" },
  { id: "settings", label: "설정" },
];

export function renderBottomTabs(state, dispatch) {
  const el = document.createElement("nav");
  el.className = "bottom-tabs";
  for (const t of TABS) {
    const btn = document.createElement("button");
    btn.className = "tab-button" + (state.currentTab === t.id ? " is-active" : "");
    btn.appendChild(renderIcon(TAB_ICON_IDS[t.id]));
    const labelEl = document.createElement("span");
    labelEl.className = "tab-label";
    labelEl.textContent = t.label;
    btn.appendChild(labelEl);
    btn.addEventListener("click", () => dispatch({ type: "change_tab", tab: t.id }));
    el.appendChild(btn);
  }
  return el;
}
