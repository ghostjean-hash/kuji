import { LINEUP_TITLE_KO } from "../data/numbers.js";

export function renderHeader(state, dispatch) {
  const el = document.createElement("header");
  el.className = "app-header";
  const title = document.createElement("h1");
  title.className = "app-title";
  title.textContent = LINEUP_TITLE_KO;
  el.appendChild(title);
  return el;
}
