// 02_data 1.7 + 1.10 SVG 자산 매핑. M2 1차는 메인 11종 + 탭 4종.
// SVG 인라인 string. 단순 일러스트 (캐릭터 실루엣 / 색상 / 사이즈 표기).

import { TAB_ICON_IDS } from "./numbers.js";

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

// ===== 상품 메인 11종 (200x200 viewBox, 단순 캐릭터 / 굿즈 실루엣) =====

// A: 손오공 MASTERLISE (오렌지 도복 + 검은 머리)
const PRODUCT_A_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="손오공 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <ellipse cx="100" cy="40" rx="22" ry="18" fill="#1A1A1A"/>
  <path d="M82 40 Q78 22 90 18 M118 40 Q122 22 110 18 M85 28 Q90 12 95 24 M115 28 Q110 12 105 24" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" fill="none"/>
  <circle cx="92" cy="48" r="3" fill="#1A1A1A"/>
  <circle cx="108" cy="48" r="3" fill="#1A1A1A"/>
  <path d="M75 60 L125 60 L130 130 L70 130 Z" fill="#F4862C"/>
  <circle cx="100" cy="95" r="14" fill="#FFFFFF"/>
  <text x="100" y="100" font-family="serif" font-size="18" font-weight="bold" fill="#C8102E" text-anchor="middle">亀</text>
  <rect x="80" y="125" width="40" height="6" fill="#1A1A1A"/>
  <path d="M70 130 L130 130 L130 165 L70 165 Z" fill="#1A4D8C"/>
</svg>`;

// B: 부르마 MASTERLISE (파란 점프수트 + 핑크 머리)
const PRODUCT_B_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="부르마 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <path d="M75 35 Q72 20 100 18 Q128 20 125 35 L130 60 L70 60 Z" fill="#7CB8E8"/>
  <ellipse cx="100" cy="50" rx="20" ry="16" fill="#FFD9CF"/>
  <circle cx="92" cy="50" r="2.5" fill="#1A1A1A"/>
  <circle cx="108" cy="50" r="2.5" fill="#1A1A1A"/>
  <path d="M95 56 Q100 58 105 56" stroke="#1A1A1A" stroke-width="1.5" fill="none"/>
  <path d="M75 65 L125 65 L120 145 L80 145 Z" fill="#F4D03F"/>
  <text x="100" y="110" font-family="sans-serif" font-size="22" font-weight="bold" fill="#1A1A1A" text-anchor="middle">B</text>
</svg>`;

// C: 초사이어인 손오공 (노란 머리 + 오렌지)
const PRODUCT_C_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="초사이어인 손오공 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <path d="M70 50 Q60 15 80 12 Q90 0 100 8 Q110 0 120 12 Q140 15 130 50 Z" fill="#FFD93D"/>
  <ellipse cx="100" cy="55" rx="20" ry="15" fill="#FFE0CF"/>
  <circle cx="92" cy="55" r="2.5" fill="#1A4D8C"/>
  <circle cx="108" cy="55" r="2.5" fill="#1A4D8C"/>
  <path d="M75 70 L125 70 L132 140 L68 140 Z" fill="#F4862C"/>
  <path d="M85 100 L115 100 L113 105 L87 105 Z" fill="#FFD93D"/>
  <circle cx="50" cy="180" r="22" fill="#FFD93D" opacity="0.4"/>
  <circle cx="150" cy="180" r="22" fill="#FFD93D" opacity="0.4"/>
</svg>`;

// D: 초사이어인2 (노란 머리 + 번개)
const PRODUCT_D_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="초사이어인2 손오공 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <path d="M65 55 Q55 8 75 5 Q85 -2 100 5 Q115 -2 125 5 Q145 8 135 55 Z" fill="#FFD93D"/>
  <ellipse cx="100" cy="58" rx="20" ry="15" fill="#FFE0CF"/>
  <circle cx="92" cy="58" r="2.5" fill="#1A4D8C"/>
  <circle cx="108" cy="58" r="2.5" fill="#1A4D8C"/>
  <path d="M75 75 L125 75 L132 145 L68 145 Z" fill="#F4862C"/>
  <path d="M30 80 L40 100 L34 100 L42 130" stroke="#FFD93D" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M170 80 L160 100 L166 100 L158 130" stroke="#FFD93D" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// E: 마인 베지타 (보라 옷 + M 마크)
const PRODUCT_E_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="마인 베지타 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <path d="M78 35 Q75 18 100 15 Q125 18 122 35 L128 60 L72 60 Z" fill="#1A1A1A"/>
  <ellipse cx="100" cy="48" rx="20" ry="16" fill="#FFD9CF"/>
  <circle cx="92" cy="48" r="2.5" fill="#1A1A1A"/>
  <circle cx="108" cy="48" r="2.5" fill="#1A1A1A"/>
  <text x="100" y="46" font-family="serif" font-size="14" font-weight="bold" fill="#C8102E" text-anchor="middle">M</text>
  <path d="M75 65 L125 65 L130 145 L70 145 Z" fill="#7B4B9C"/>
  <path d="M85 75 L115 75 L113 95 L87 95 Z" fill="#FFFFFF"/>
</svg>`;

// F: 자림무도 (흰 머리 + 은빛 광선)
const PRODUCT_F_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="손오공 자림무도 MASTERLISE">
  <rect width="200" height="200" fill="#FAF7F2"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#A8C5DB" stroke-width="2" opacity="0.5"/>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#A8C5DB" stroke-width="1" opacity="0.3"/>
  <path d="M70 50 Q60 20 80 18 Q100 12 120 18 Q140 20 130 50 Z" fill="#E8E8E8"/>
  <ellipse cx="100" cy="55" rx="20" ry="15" fill="#FFE0CF"/>
  <circle cx="92" cy="55" r="2.5" fill="#A8C5DB"/>
  <circle cx="108" cy="55" r="2.5" fill="#A8C5DB"/>
  <path d="M75 70 L125 70 L132 140 L68 140 Z" fill="#F4862C"/>
  <path d="M30 50 Q60 90 100 100 Q140 90 170 50" stroke="#A8C5DB" stroke-width="3" fill="none" opacity="0.6"/>
</svg>`;

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

// Last One: 大猿悟空 SOFVICS (큰 원숭이 + 보름달)
const PRODUCT_LAST_ONE_MAIN = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="거대 원숭이 손오공 SOFVICS">
  <rect width="200" height="200" fill="#1A1A2E"/>
  <circle cx="155" cy="45" r="24" fill="#FFE6A8"/>
  <circle cx="155" cy="45" r="24" fill="#C9A961" opacity="0.3"/>
  <ellipse cx="100" cy="125" rx="55" ry="60" fill="#7B3F1A"/>
  <ellipse cx="100" cy="125" rx="42" ry="48" fill="#A85528"/>
  <ellipse cx="100" cy="100" rx="32" ry="28" fill="#7B3F1A"/>
  <circle cx="88" cy="98" r="5" fill="#FFD93D"/>
  <circle cx="112" cy="98" r="5" fill="#FFD93D"/>
  <circle cx="88" cy="98" r="2.5" fill="#C8102E"/>
  <circle cx="112" cy="98" r="2.5" fill="#C8102E"/>
  <path d="M88 115 Q100 122 112 115" stroke="#1A1A1A" stroke-width="2.5" fill="none"/>
  <path d="M70 80 L75 70 M130 80 L125 70" stroke="#7B3F1A" stroke-width="6" stroke-linecap="round"/>
  <text x="100" y="190" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C9A961" text-anchor="middle" letter-spacing="0.1em">SOFVICS</text>
</svg>`;

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
  "Last One": PRODUCT_LAST_ONE_MAIN,
};

// 02_data 1.7 PRODUCT_ASSETS_MAIN_PLACEHOLDER: M2 1차에서 종별 자산은 메인 재사용.
export function getProductAsset(tier, typeIndex) {
  const main = PRODUCTS_MAIN[tier];
  return main || "";
}

export function getProductMainAsset(tier) {
  return PRODUCTS_MAIN[tier] || "";
}
