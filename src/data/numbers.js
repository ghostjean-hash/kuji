// 02_data 1장 SSOT 변환. 본 파일의 export 키 집합 = 02_data 1장 정의 키 집합.
// 매직 넘버 0개 (CLAUDE.md 4.2). 모든 수치 / 문자열은 본 파일에서만 정의.

// 02_data 1.1 일반
export const STORAGE_KEY_PREFIX = "kuji_";
export const DEFAULT_SEED_FALLBACK_BITS = 32;
export const BOX_ROUND_INITIAL = 1;
export const SCHEMA_VERSION = 3;  // M2.1: kuji_settings_skip_pick + history revealed/pickIndex/gridIndex 필드 (meta.pickHintSeen은 2026-05-08 deprecated)

// 02_data 1.2 PRNG
export const PRNG_NAME = "Mulberry32";
export const PRNG_OUTPUT_BITS = 32;
export const PRNG_OUTPUT_DIVISOR = Math.pow(2, PRNG_OUTPUT_BITS);  // 2^32 = 4294967296
export const BOX_ID_HEX_LENGTH = PRNG_OUTPUT_BITS / 4;  // 32비트 = 8 hex 자릿수

// 02_data 1.3 Double Chance 단순화
export const DC_POOL_SIZE_DEFAULT = 5000;
export const DC_POOL_SIZE_NOTE_KO = "단순화 가정. 실제 응모권 풀은 라인업 인기에 따라 천 ~ 수만 단위 변동";

// 02_data 1.4.1 라인업 메타
export const LINEUP_ID = "ichiban_dragonball_chronicle_2026_05";
export const LINEUP_TITLE_JA = "一番くじ ドラゴンボール THE CHRONICLE OF GOKU";
export const LINEUP_TITLE_KO = "이찌방쿠지 드래곤볼 THE CHRONICLE OF GOKU";
export const LINEUP_IP = "DRAGONBALL";
export const LINEUP_OPERATOR = "BANDAI SPIRITS";
export const LINEUP_RELEASE_DATE_STORE = "2026-05-08";
export const LINEUP_END_DATE = "2026-08-31";
export const LINEUP_OUTLETS = ["Seven_Eleven", "Ito_Yokado", "Yume_Town"];
export const LINEUP_PRICE_JPY = 790;
export const BOX_SIZE = 80;
export const BOX_SIZE_ESTIMATED = true;

// 02_data 1.4.2 등급별 매수 (count_estimated:true)
export const TIERS = [
  { tier: "A", count: 1, typeCount: 1, nameJa: "孫悟空 MASTERLISE", nameKo: "손오공 MASTERLISE", sizeLabel: "11cm" },
  { tier: "B", count: 1, typeCount: 1, nameJa: "ブルマ MASTERLISE", nameKo: "부르마 MASTERLISE", sizeLabel: "21cm" },
  { tier: "C", count: 1, typeCount: 1, nameJa: "超サイヤ人孫悟空 MASTERLISE", nameKo: "초사이어인 손오공 MASTERLISE", sizeLabel: "25cm" },
  { tier: "D", count: 1, typeCount: 1, nameJa: "超サイヤ人2孫悟空 MASTERLISE", nameKo: "초사이어인2 손오공 MASTERLISE", sizeLabel: "25cm" },
  { tier: "E", count: 1, typeCount: 1, nameJa: "魔人ベジータ MASTERLISE", nameKo: "마인 베지타 MASTERLISE", sizeLabel: "24cm" },
  { tier: "F", count: 1, typeCount: 1, nameJa: "孫悟空 身勝手の極意 MASTERLISE", nameKo: "손오공 자림무도 MASTERLISE", sizeLabel: "25cm" },
  { tier: "G", count: 8, typeCount: 8, nameJa: "引っ掛けアクリルスタンド", nameKo: "걸이형 아크릴 스탠드", sizeLabel: "7.5cm" },
  { tier: "H", count: 8, typeCount: 8, nameJa: "ラバーチャーム", nameKo: "러버 참", sizeLabel: "6.5cm" },
  { tier: "I", count: 24, typeCount: 10, nameJa: "クリアポスター (A3)", nameKo: "클리어 포스터 (A3)", sizeLabel: "A3" },
  { tier: "J", count: 33, typeCount: 10, nameJa: "ジャガードミニタオル", nameKo: "자카드 미니 타올", sizeLabel: "25cm" },
  { tier: "Last One", count: 1, typeCount: 1, nameJa: "大猿悟空 SOFVICS", nameKo: "거대 원숭이 손오공 SOFVICS", sizeLabel: "26cm" },
];
export const TIERS_COUNT_ESTIMATED = true;

// 02_data 1.4.3 Double Chance 상품
export const DC_PRIZE_NAME_JA = "大猿悟空 SOFVICS";
export const DC_PRIZE_NAME_KO = "거대 원숭이 손오공 SOFVICS";
export const DC_WINNERS_TOTAL = 50;
export const DC_PRIZE_NOTE_KO = "ラストワン賞과 동일 상품. winners_total은 일본 캠페인 기준";

// 02_data 1.4.4 출처
export const LINEUP_SOURCES = [
  { name: "一番くじ俱楽部 공식", url: "https://1kuji.com/products/db_goku" },
  { name: "電撃 hobby", url: "https://hobby.dengeki.com/news/2977500/" },
  { name: "inside-games", url: "https://www.inside-games.jp/article/2026/04/28/180618.html" },
  { name: "magmix", url: "https://magmix.jp/post/349310" },
];

// 02_data 1.4.5 라인업 객체 (M2~M5 다중 라인업 확장 인터페이스, 04_impl_plan 8.4)
// 03_architecture 3.3~3.5 core 함수가 lineup 인자로 받는 구조체.
export const LINEUP = {
  id: LINEUP_ID,
  titleJa: LINEUP_TITLE_JA,
  titleKo: LINEUP_TITLE_KO,
  ip: LINEUP_IP,
  operator: LINEUP_OPERATOR,
  releaseDateStore: LINEUP_RELEASE_DATE_STORE,
  endDate: LINEUP_END_DATE,
  outlets: LINEUP_OUTLETS,
  priceJpy: LINEUP_PRICE_JPY,
  boxSize: BOX_SIZE,
  boxSizeEstimated: BOX_SIZE_ESTIMATED,
  tiers: TIERS,
  tiersCountEstimated: TIERS_COUNT_ESTIMATED,
  dc: {
    winnersTotal: DC_WINNERS_TOTAL,
    poolSizeDefault: DC_POOL_SIZE_DEFAULT,
    prizeNameJa: DC_PRIZE_NAME_JA,
    prizeNameKo: DC_PRIZE_NAME_KO,
    prizeNoteKo: DC_PRIZE_NOTE_KO,
  },
  sources: LINEUP_SOURCES,
};

// 02_data 1.5 UI 표시 상수
export const HISTORY_RECENT_LIMIT = 50;
export const PERCENT_DISPLAY_DECIMALS = 2;
export const PERCENT_BASE = 100;

// 02_data 1.6 구매 옵션 (M2 + M2.1)
export const BUY_QUICK_OPTIONS = [1, 3, 5, 10];
export const BUY_FREE_INPUT_MIN = 1;
export const BUY_SKIP_PICK_DEFAULT = false;  // M2.1: 통 선택 단계 skip 기본값 (false = 통 선택 ON)

// 02_data 1.7 상품 이미지 자산 매핑 (M2). assets.js 참조용 플래그만 numbers에.
export const PRODUCT_ASSETS_MAIN_PLACEHOLDER = true;  // M2 1차: 종별 자산이 메인을 재사용

// 02_data 1.8 뜯기 애니메이션 상수 (M2)
export const PEEL_DRAG_THRESHOLD_RATIO = 0.30;
export const PEEL_DURATION_MS = 700;
export const PEEL_HAPTIC_HALF_MS = 10;
export const PEEL_HAPTIC_FULL_MS = 20;

// 02_data 1.9 카드 / 모션 토큰 (M2)
export const CARD_ASPECT_RATIO = "5.5 / 4";
export const MODAL_SLIDE_DURATION_MS = 200;
export const GAUGE_TRANSITION_DURATION_MS = 300;
export const RESULT_POP_SCALE_PEAK = 1.1;
export const PEEL_REVEAL_TO_MODAL_MS = 800;  // M2 deprecated (모달 폐기)
export const PEEL_REVEAL_VIEW_MS = 1500;  // M2: reveal 후 카드 표시 시간
export const PEEL_REVEAL_TO_FADE_MS = 1800;  // M2: reveal 후 fade out 시작
export const HERO_CAROUSEL_VISIBLE_PEEK_PX = 24;  // M2: 캐러셀 좌우 미리보기 폭
export const PEEL_HAPTIC_FULL_DELAY_MS = 350;  // 50% 햅틱 후 완료 햅틱까지 (PEEL_DURATION_MS / 2)
export const PEEL_STACK_VISIBLE_LIMIT = 3;  // 뜯기 패널 인벤토리 스택 표시 매수
export const PEEL_STACK_OFFSET_PX = 6;  // 적층 카드 오프셋
export const PEEL_STACK_SCALE_DELTA = 0.03;  // 적층 카드 스케일 감소
export const PRODUCT_OVERLAY_TICKETS_MAX = 12;  // 상품 이미지 위 오버레이 복권 최대 표시 수

// 02_data 1.10 탭 아이콘 ID (M2). assets.js의 ID로 매핑.
export const TAB_ICON_IDS = {
  draw: "icon-draw",
  history: "icon-history",
  dc: "icon-dc",
  settings: "icon-settings",
};

// 02_data 1.11 타이포그래피 (M2)
export const FONT_FAMILY_BODY_KO = '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_FAMILY_BODY_JA = '"Noto Serif JP", "Yu Mincho", serif';
export const FONT_FAMILY_TIER_DISPLAY = '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif';

// 02_data 1.12 통 선택 (Pick from Bin) - M2.1 신설
export const PICK_GRID_COLS_DEFAULT = 10;  // 격자 기본 열 수. rows = ceil(BOX_SIZE / cols)
export const PICK_GRID_COLS_MIN = 4;  // 모바일 좁은 화면 fallback 최소 열 수
export const PICK_SLOT_MIN_TAP_PX = 24;  // 슬롯 최소 터치 타깃
export const PICK_SLOT_GAP_PX = 4;  // 슬롯 간 간격
export const PICK_SLOT_HOVER_LIFT_PX = 4;  // 호버 시 슬롯 부상
export const PICK_SLOT_HOVER_GLOW_PX = 12;  // 호버 글로우 반경
export const PICK_SLOT_CLICK_TO_CARD_MS = 400;  // 슬롯 클릭 → 페이지플립 카드 전환
export const PICK_SLOT_EMPTY_FADE_MS = 200;  // 뽑힌 슬롯 회색화 전환
// **2026-05-08 deprecated (PROGRESS 4.14.1, 단계 6 4.17)** - 사용자 결정으로 toast 폐기. 호환 위해 잔존.
export const PICK_FIRST_HINT_DURATION_MS = 4000;
export const PICK_FIRST_HINT_TEXT_KO = "N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다.";
export const PICK_AUTO_CONFIRM_DELAY_MS = 200;  // N매 선택 완료 → 자동 confirm 시각 확인 딜레이 (4.14.5)
// 02_data 1.12 - slotPosition / slotJitter 시각 튜닝 상수 (4.16 / 4.17 흡수)
export const PICK_SLOT_ROTATE_RANGE_DEG = 72;  // 슬롯 회전 폭 (±36°. 72 = 2 × 36)
export const PICK_GRID_CLAMP_MIN_PCT = 5;  // 격자 좌표 하한 (가장자리 잘림 방지)
export const PICK_GRID_CLAMP_MAX_PCT = 95;  // 격자 좌표 상한
export const PICK_SLOT_JITTER_RATIO = 0.5;  // 셀 내부 jitter 비율 (±50% 셀 폭/높이. 4.16 격자 매핑)
export const PICK_SLOT_SELECTED_Z_BOOST = 30;  // 선택됨 슬롯 z-index 가중 (4.17 단계 6 P1 3.1. 베이스 0~15 위로 + 30 = 30~45 범위)

// 02_data 1.4.2.1 매수 합계 검증식 (01_spec 7.5 부팅 정합 강제)
const TIER_COUNT_SUM = TIERS.reduce((acc, t) => acc + t.count, 0);
if (TIER_COUNT_SUM !== BOX_SIZE) {
  throw new Error(
    `[numbers.js] 등급별 매수 합(${TIER_COUNT_SUM}) ≠ BOX_SIZE(${BOX_SIZE}). 02_data 1.4.2.1 검증식 위반.`
  );
}
