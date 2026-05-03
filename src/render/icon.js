// SVG 아이콘 wrapper. data/assets.js 의 SVG 마크업을 span에 감싸 반환 (M2 신설).

import { getIconAsset } from "../data/assets.js";

export function renderIcon(iconId, className = "tab-icon") {
  const wrap = document.createElement("span");
  wrap.className = className;
  wrap.innerHTML = getIconAsset(iconId);
  return wrap;
}
