// 02_data 1.7 + 1.10 자산 매핑.
// 메인: A~F + Last One은 the_chronicle_of_goku_img/*.webp 사진 자산. G~J는 SVG 임시 자산.
// 탭: SVG 인라인 4종.

import { TAB_ICON_IDS, LAST_ONE_TIER_NAME } from "./numbers.js";

// ===== 메인 사진 자산 경로 / 키 매핑 (M2.1 보강 / M5+ LAST_ONE_TIER_NAME 단일화) =====
const PRODUCT_IMAGE_BASE_PATH = "the_chronicle_of_goku_img";
const PRODUCT_IMAGE_FILE_KEYS = {
  "A": "A",
  "B": "B",
  "C": "C",
  "D": "D",
  "E": "E",
  "F": "F",
  [LAST_ONE_TIER_NAME]: "Z",
};
const PRODUCT_IMAGE_ALT = {
  "A": "손오공 MASTERLISE",
  "B": "부르마 MASTERLISE",
  "C": "초사이어인 손오공 MASTERLISE",
  "D": "초사이어인2 손오공 MASTERLISE",
  "E": "마인 베지타 MASTERLISE",
  "F": "손오공 자림무도 MASTERLISE",
  [LAST_ONE_TIER_NAME]: "거대 원숭이 손오공 SOFVICS",
};

function buildProductPhoto(tier) {
  const key = PRODUCT_IMAGE_FILE_KEYS[tier];
  if (!key) return "";
  const alt = PRODUCT_IMAGE_ALT[tier] || "";
  return `<img src="${PRODUCT_IMAGE_BASE_PATH}/${key}.webp" alt="${alt}" class="product-photo" loading="lazy" decoding="async">`;
}

// ===== 탭 아이콘 (24x24 viewBox, currentColor 기반) =====

const ICON_DRAW = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="4" y="3" width="13" height="17" rx="2" transform="rotate(-6 10 12)" fill="currentColor" opacity="0.4"/>
  <rect x="6" y="4" width="13" height="17" rx="2" transform="rotate(4 12 12)" fill="currentColor"/>
  <path d="M11.5 9 L15.5 12.5 L11.5 16 Z" fill="#FFFFFF" transform="rotate(4 12 12)"/>
</svg>`;

const ICON_HISTORY = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M12 7 L12 12 L15.5 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const ICON_DC = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 3 L14.5 9 L21 9.5 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9.5 L9.5 9 Z" fill="currentColor"/>
</svg>`;

const ICON_SETTINGS = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 8.5 a3.5 3.5 0 1 0 0 7 a3.5 3.5 0 1 0 0 -7 z M12 1 L13.5 4 L17 3.5 L17.5 7 L20.5 9 L19 12 L20.5 15 L17.5 17 L17 20.5 L13.5 20 L12 23 L10.5 20 L7 20.5 L6.5 17 L3.5 15 L5 12 L3.5 9 L6.5 7 L7 3.5 L10.5 4 Z" fill="currentColor" fill-rule="evenodd"/>
</svg>`;

const ICONS = {
  "icon-draw": ICON_DRAW,
  "icon-history": ICON_HISTORY,
  "icon-dc": ICON_DC,
  "icon-settings": ICON_SETTINGS,
};

export function getIconAsset(iconId) {
  return ICONS[iconId] || "";
}

export function getTabIcon(tabId) {
  return getIconAsset(TAB_ICON_IDS[tabId]);
}

// ===== 상품 메인 11종 (M2.1 A~F + Last One은 webp 사진 / G~J는 SVG 임시) =====

// A~F: webp 사진 자산 (the_chronicle_of_goku_img/A.webp ~ F.webp).
const PRODUCT_A_MAIN = buildProductPhoto("A");
const PRODUCT_B_MAIN = buildProductPhoto("B");
const PRODUCT_C_MAIN = buildProductPhoto("C");
const PRODUCT_D_MAIN = buildProductPhoto("D");
const PRODUCT_E_MAIN = buildProductPhoto("E");
const PRODUCT_F_MAIN = buildProductPhoto("F");

// G: 걸이형 아크릴 스탠드 (사각 카드 + 미니 캐릭터 8종 표기)
const PRODUCT_G_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="걸이형 아크릴 스탠드">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <rect x="60" y="40" width="80" height="120" rx="6" fill="#FFFFFF" stroke="#9C8B78" stroke-width="2"/>
  <circle cx="100" cy="50" r="5" fill="none" stroke="#9C8B78" stroke-width="2"/>
  <ellipse cx="100" cy="100" rx="22" ry="22" fill="#F4862C"/>
  <text x="100" y="105" font-family="serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">悟</text>
  <text x="100" y="145" font-family="sans-serif" font-size="9" fill="#9C8B78" text-anchor="middle">ACRYLIC STAND</text>
</svg>`;

// H: 러버 참 (키체인)
const PRODUCT_H_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="러버 참">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <circle cx="100" cy="50" r="8" fill="none" stroke="#9C8B78" stroke-width="2"/>
  <line x1="100" y1="58" x2="100" y2="80" stroke="#9C8B78" stroke-width="2"/>
  <circle cx="100" cy="120" r="55" fill="#FFD93D" stroke="#1A1A1A" stroke-width="3"/>
  <text x="100" y="115" font-family="serif" font-size="32" font-weight="bold" fill="#1A1A1A" text-anchor="middle">悟</text>
  <text x="100" y="145" font-family="sans-serif" font-size="11" fill="#1A1A1A" text-anchor="middle">RUBBER</text>
</svg>`;

// I: 클리어 포스터 (A3 직사각형)
const PRODUCT_I_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="클리어 포스터 (A3)">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <rect x="50" y="30" width="100" height="140" rx="2" fill="#FFFFFF" stroke="#9C8B78" stroke-width="1.5" stroke-dasharray="3 2"/>
  <ellipse cx="100" cy="90" rx="30" ry="35" fill="#F4862C" opacity="0.85"/>
  <text x="100" y="95" font-family="serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">DB</text>
  <line x1="60" y1="135" x2="140" y2="135" stroke="#1A1A1A" stroke-width="1"/>
  <line x1="60" y1="143" x2="140" y2="143" stroke="#9C8B78" stroke-width="0.7"/>
  <line x1="60" y1="150" x2="120" y2="150" stroke="#9C8B78" stroke-width="0.7"/>
  <text x="155" y="173" font-family="sans-serif" font-size="9" fill="#9C8B78">A3</text>
</svg>`;

// J: 자카드 미니 타올
const PRODUCT_J_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="자카드 미니 타올">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <rect x="40" y="55" width="120" height="90" rx="3" fill="#7CB8E8" stroke="#1A4D8C" stroke-width="2"/>
  <pattern id="towel-stripe" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
    <line x1="0" y1="3" x2="6" y2="3" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3"/>
  </pattern>
  <rect x="40" y="55" width="120" height="90" fill="url(#towel-stripe)"/>
  <circle cx="100" cy="100" r="22" fill="#FFFFFF" opacity="0.85"/>
  <text x="100" y="105" font-family="serif" font-size="18" font-weight="bold" fill="#1A4D8C" text-anchor="middle">悟</text>
  <line x1="40" y1="60" x2="160" y2="60" stroke="#1A4D8C" stroke-width="1" stroke-dasharray="2 2"/>
  <line x1="40" y1="140" x2="160" y2="140" stroke="#1A4D8C" stroke-width="1" stroke-dasharray="2 2"/>
</svg>`;

// Last One: 大猿悟空 SOFVICS - webp 사진 자산 (the_chronicle_of_goku_img/Z.webp).
const PRODUCT_LAST_ONE_MAIN = buildProductPhoto(LAST_ONE_TIER_NAME);

const PRODUCTS_MAIN = {
  "A": PRODUCT_A_MAIN,
  "B": PRODUCT_B_MAIN,
  "C": PRODUCT_C_MAIN,
  "D": PRODUCT_D_MAIN,
  "E": PRODUCT_E_MAIN,
  "F": PRODUCT_F_MAIN,
  "G": PRODUCT_G_MAIN,
  "H": PRODUCT_H_MAIN,
  "I": PRODUCT_I_MAIN,
  "J": PRODUCT_J_MAIN,
  [LAST_ONE_TIER_NAME]: PRODUCT_LAST_ONE_MAIN,
};

// 02_data 1.7 PRODUCT_ASSETS_MAIN_PLACEHOLDER: M2 1차에서 종별 자산은 메인 재사용.
export function getProductAsset(tier, typeIndex) {
  const main = PRODUCTS_MAIN[tier];
  return main || "";
}

export function getProductMainAsset(tier) {
  return PRODUCTS_MAIN[tier] || "";
}
