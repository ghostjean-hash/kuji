// 하단 탭 바 (M2 SVG 아이콘 + M4 4탭 → 3탭 재구성).

import { renderIcon } from "./icon.js";
import {
  TAB_ICON_IDS,
  STATE_TAB_DRAW,
  STATE_TAB_PRODUCTS_HISTORY,
  STATE_TAB_SETTINGS,
  DISPATCH_TYPE_SET_ACTIVE_TAB,
} from "../data/numbers.js";

const TABS = [
  { id: STATE_TAB_DRAW, label: "추첨" },
  { id: STATE_TAB_PRODUCTS_HISTORY, label: "갤러리·기록" },  // M4: 통합 탭
  { id: STATE_TAB_SETTINGS, label: "설정" },
];

export function renderBottomTabs(state, dispatch) {
  const el = document.createElement("nav");
  el.className = "bottom-tabs";
  for (const t of TABS) {
    const btn = document.createElement("button");
    btn.className = "tab-button" + (state.activeTab === t.id ? " is-active" : "");
    btn.appendChild(renderIcon(TAB_ICON_IDS[t.id]));
    const labelEl = document.createElement("span");
    labelEl.className = "tab-label";
    labelEl.textContent = t.label;
    btn.appendChild(labelEl);
    btn.addEventListener("click", () => dispatch({ type: DISPATCH_TYPE_SET_ACTIVE_TAB, tab: t.id }));
    el.appendChild(btn);
  }
  return el;
}
