// 02_data 2장 SSOT 변환. M2 Light 테마 + 종이 / 카드 톤.

// 02_data 2.1 등급 색 (M2: Last One 一番くじ 브랜드 빨강 통일)
export const TIER_COLORS = {
  "A": "#D4AF37",
  "B": "#C0C0C0",
  "C": "#CD7F32",
  "D": "#E8B4D8",
  "E": "#A78BFA",
  "F": "#60A5FA",
  "G": "#34D399",
  "H": "#FDE047",
  "I": "#F97316",
  "J": "#94A3B8",
  "Last One": "#C8102E",
};

// 02_data 2.2 UI 색 (M2 Light 테마)
export const COLOR_BG_PAPER = "#FAF7F2";
export const COLOR_BG_CARD = "#FFFFFF";
export const COLOR_BG_ELEVATED = "#F3EDE0";
export const COLOR_INK_PRIMARY = "#1F1A14";
export const COLOR_INK_SECONDARY = "#4A3F30";
export const COLOR_INK_MUTED = "#9C8B78";
export const COLOR_BORDER_SUBTLE = "#E8DECF";
export const COLOR_FRAME_RED = "#C8102E";
export const COLOR_GOLD_EDGE = "#C9A961";

// 결과 / 상태 색
export const COLOR_RESULT_NORMAL = "#1F1A14";
export const COLOR_RESULT_LAST_ONE = "#C8102E";
export const COLOR_RESULT_DC_WIN = "#2A8C5F";
export const COLOR_RESULT_DC_MISS = "#9C8B78";
export const COLOR_BADGE_ESTIMATED = "#C9A961";
export const COLOR_TIER_FALLBACK = "#9C8B78";

// 복권 / 게이지
export const COLOR_TICKET_OUTER_BG = "#C8102E";
export const COLOR_TICKET_INNER_BG = "#FAF7F2";
export const COLOR_TICKET_DIM_RGBA = "rgba(0, 0, 0, 0.5)";
export const COLOR_GAUGE_BG = "#E8DECF";
export const COLOR_GAUGE_FILL = "#C9A961";

// 02_data 2.2 통 선택 슬롯 (M2.1 + B-α 재정정)
export const COLOR_PICK_SLOT_BG = "#F3EDE0";  // 잔여 미선택 슬롯 배경 (보조 패널 톤)
export const COLOR_PICK_SLOT_BORDER = "#C9A961";  // 잔여 미선택 슬롯 테두리 (골드)
export const COLOR_PICK_SLOT_HOVER_GLOW = "rgba(201, 169, 97, 0.6)";  // 호버 글로우 (골드 알파)
export const COLOR_PICK_SLOT_EMPTY_BG = "#E8DECF";  // 뽑힌 슬롯 배경 (옅은 종이)
export const COLOR_PICK_SLOT_EMPTY_BORDER = "#9C8B78";  // 뽑힌 슬롯 테두리 (약한 잉크)
export const COLOR_PICK_SLOT_SELECTED_BG = "#FFE9C7";  // M2.1 B-α: 선택됨 슬롯 배경 (밝은 골드 톤)
export const COLOR_PICK_SLOT_SELECTED_BORDER = "#C8102E";  // M2.1 B-α: 선택됨 슬롯 테두리 (브랜드 빨강 강조)
