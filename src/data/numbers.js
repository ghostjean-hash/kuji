// 02_data 1장 SSOT 변환. 본 파일의 export 키 집합 = 02_data 1장 정의 키 집합.
// 매직 넘버 0개 (CLAUDE.md 4.2). 모든 수치 / 문자열은 본 파일에서만 정의.

// 02_data 1.1 일반
export const STORAGE_KEY_PREFIX = "kuji_";
export const DEFAULT_SEED_FALLBACK_BITS = 32;
export const BOX_ROUND_INITIAL = 1;
export const SCHEMA_VERSION = 5;  // M3.1: 라인업 로비 도입 (kuji_lobby_acked 신설). M3 v4 = 다중 라인업 격리.

// 02_data 1.4.A 등급 클래스 (M3.1 신설) - hero/main/goods 3단계 분류
export const TIER_CLASS_HERO = "hero";
export const TIER_CLASS_MAIN = "main";
export const TIER_CLASS_GOODS = "goods";
export const TIER_CLASS_VALUES = [TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS];

// 02_data 1.4.A.6 tier_class 한국어 라벨 (M3.3 신설) - 갤러리 섹션 헤더 + history 대시보드 카운터
export const TIER_CLASS_LABEL_KO = {
  hero: "메인 등급",
  main: "표준 등급",
  goods: "굿즈",
};

// 02_data 1.4.B view 상수 (M3.1 신설) - state.view 모델
export const STATE_VIEW_LOBBY = "lobby";
export const STATE_VIEW_MAIN = "main";
export const STATE_VIEW_VALUES = [STATE_VIEW_LOBBY, STATE_VIEW_MAIN];
export const STATE_VIEW_DEFAULT = STATE_VIEW_MAIN;

// 02_data 1.4.B dispatch type 상수 (M3.1 신설)
export const DISPATCH_TYPE_OPEN_LOBBY = "open_lobby";
export const DISPATCH_TYPE_ENTER_LINEUP = "enter_lineup";

// 02_data 1.2 PRNG
export const PRNG_NAME = "Mulberry32";
export const PRNG_OUTPUT_BITS = 32;
export const PRNG_OUTPUT_DIVISOR = Math.pow(2, PRNG_OUTPUT_BITS);  // 2^32 = 4294967296
export const BOX_ID_HEX_LENGTH = PRNG_OUTPUT_BITS / 4;  // 32비트 = 8 hex 자릿수

// 02_data 1.3 Double Chance 단순화 (라인업 공유)
export const DC_POOL_SIZE_DEFAULT = 5000;
export const DC_POOL_SIZE_NOTE_KO = "단순화 가정. 실제 응모권 풀은 라인업 인기에 따라 천 ~ 수만 단위 변동";

// =====================================================================
// 02_data 1.4-DB. 라인업: 一番くじ ドラゴンボール THE CHRONICLE OF GOKU
// =====================================================================

// 02_data 1.4-DB.1 메타
export const LINEUP_DRAGONBALL_ID = "ichiban_dragonball_chronicle_2026_05";
export const LINEUP_DRAGONBALL_TITLE_JA = "一番くじ ドラゴンボール THE CHRONICLE OF GOKU";
export const LINEUP_DRAGONBALL_TITLE_KO = "이찌방쿠지 드래곤볼 THE CHRONICLE OF GOKU";
export const LINEUP_DRAGONBALL_IP = "DRAGONBALL";
export const LINEUP_DRAGONBALL_OPERATOR = "BANDAI SPIRITS";
export const LINEUP_DRAGONBALL_RELEASE_DATE_STORE = "2026-05-08";
export const LINEUP_DRAGONBALL_END_DATE = "2026-08-31";
export const LINEUP_DRAGONBALL_OUTLETS = ["Seven_Eleven", "Ito_Yokado", "Yume_Town"];
export const LINEUP_DRAGONBALL_PRICE_JPY = 790;
export const LINEUP_DRAGONBALL_BOX_SIZE = 80;
export const LINEUP_DRAGONBALL_BOX_SIZE_ESTIMATED = true;
export const LINEUP_DRAGONBALL_ASSETS_BASE_PATH = "the_chronicle_of_goku_placeholder";
export const LINEUP_DRAGONBALL_ASSETS_AVAILABLE = false;  // M3: placeholder 미배치 (사용자 외부 작업 대기)

// 02_data 1.4-DB.2 등급별 매수 (count_estimated:true) + tierClass (M3.1)
export const TIERS_DRAGONBALL = [
  { tier: "A", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "孫悟空 MASTERLISE", nameKo: "손오공 MASTERLISE", sizeLabel: "11cm" },
  { tier: "B", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "ブルマ MASTERLISE", nameKo: "부르마 MASTERLISE", sizeLabel: "21cm" },
  { tier: "C", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "超サイヤ人孫悟空 MASTERLISE", nameKo: "초사이어인 손오공 MASTERLISE", sizeLabel: "25cm" },
  { tier: "D", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "超サイヤ人2孫悟空 MASTERLISE", nameKo: "초사이어인2 손오공 MASTERLISE", sizeLabel: "25cm" },
  { tier: "E", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "魔人ベジータ MASTERLISE", nameKo: "마인 베지타 MASTERLISE", sizeLabel: "24cm" },
  { tier: "F", count: 1, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "孫悟空 身勝手の極意 MASTERLISE", nameKo: "손오공 자림무도 MASTERLISE", sizeLabel: "25cm" },
  { tier: "G", count: 8, typeCount: 8, tierClass: TIER_CLASS_GOODS, nameJa: "引っ掛けアクリルスタンド", nameKo: "걸이형 아크릴 스탠드", sizeLabel: "7.5cm" },
  { tier: "H", count: 8, typeCount: 8, tierClass: TIER_CLASS_GOODS, nameJa: "ラバーチャーム", nameKo: "러버 참", sizeLabel: "6.5cm" },
  { tier: "I", count: 24, typeCount: 10, tierClass: TIER_CLASS_GOODS, nameJa: "クリアポスター (A3)", nameKo: "클리어 포스터 (A3)", sizeLabel: "A3" },
  { tier: "J", count: 33, typeCount: 10, tierClass: TIER_CLASS_GOODS, nameJa: "ジャガードミニタオル", nameKo: "자카드 미니 타올", sizeLabel: "25cm" },
  { tier: "Last One", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "大猿悟空 SOFVICS", nameKo: "거대 원숭이 손오공 SOFVICS", sizeLabel: "26cm" },
];
export const TIERS_DRAGONBALL_COUNT_ESTIMATED = true;

// 02_data 1.4-DB.3 Double Chance 상품
export const LINEUP_DRAGONBALL_DC_PRIZE_NAME_JA = "大猿悟空 SOFVICS";
export const LINEUP_DRAGONBALL_DC_PRIZE_NAME_KO = "거대 원숭이 손오공 SOFVICS";
export const LINEUP_DRAGONBALL_DC_WINNERS_TOTAL = 50;
export const LINEUP_DRAGONBALL_DC_PRIZE_NOTE_KO = "ラストワン賞과 동일 상품. winners_total은 일본 캠페인 기준";
export const LINEUP_DRAGONBALL_DC_TIER_CLASS = TIER_CLASS_HERO;  // M3.1: 1.4.A.3 검증식 정합
export const LINEUP_DRAGONBALL_LOBBY_HERO_ASSET_PATH = "the_chronicle_of_goku_placeholder/lobby_hero.webp";  // M3.1: 로비 카드 메인 이미지 (assetsAvailable=false면 placeholder gray fallback)

// 02_data 1.4-DB.4 출처
export const LINEUP_DRAGONBALL_SOURCES = [
  { name: "一番くじ俱楽部 공식", url: "https://1kuji.com/products/db_goku" },
  { name: "電撃 hobby", url: "https://hobby.dengeki.com/news/2977500/" },
  { name: "inside-games", url: "https://www.inside-games.jp/article/2026/04/28/180618.html" },
  { name: "magmix", url: "https://magmix.jp/post/349310" },
];

// 02_data 1.4-DB.5 LINEUP_DRAGONBALL 객체
export const LINEUP_DRAGONBALL = {
  id: LINEUP_DRAGONBALL_ID,
  titleJa: LINEUP_DRAGONBALL_TITLE_JA,
  titleKo: LINEUP_DRAGONBALL_TITLE_KO,
  ip: LINEUP_DRAGONBALL_IP,
  operator: LINEUP_DRAGONBALL_OPERATOR,
  releaseDateStore: LINEUP_DRAGONBALL_RELEASE_DATE_STORE,
  endDate: LINEUP_DRAGONBALL_END_DATE,
  outlets: LINEUP_DRAGONBALL_OUTLETS,
  priceJpy: LINEUP_DRAGONBALL_PRICE_JPY,
  boxSize: LINEUP_DRAGONBALL_BOX_SIZE,
  boxSizeEstimated: LINEUP_DRAGONBALL_BOX_SIZE_ESTIMATED,
  tiers: TIERS_DRAGONBALL,
  tiersCountEstimated: TIERS_DRAGONBALL_COUNT_ESTIMATED,
  dc: {
    winnersTotal: LINEUP_DRAGONBALL_DC_WINNERS_TOTAL,
    poolSizeDefault: DC_POOL_SIZE_DEFAULT,
    prizeNameJa: LINEUP_DRAGONBALL_DC_PRIZE_NAME_JA,
    prizeNameKo: LINEUP_DRAGONBALL_DC_PRIZE_NAME_KO,
    prizeNoteKo: LINEUP_DRAGONBALL_DC_PRIZE_NOTE_KO,
    tierClass: LINEUP_DRAGONBALL_DC_TIER_CLASS,  // M3.1
  },
  sources: LINEUP_DRAGONBALL_SOURCES,
  assetsBasePath: LINEUP_DRAGONBALL_ASSETS_BASE_PATH,
  assetsAvailable: LINEUP_DRAGONBALL_ASSETS_AVAILABLE,
  lobbyHeroAssetPath: LINEUP_DRAGONBALL_LOBBY_HERO_ASSET_PATH,  // M3.1
};

// =====================================================================
// 02_data 1.4-OP. 라인업: 一番くじ ワンピース MONKEY.D.LUFFY (M3 신설)
// =====================================================================

// 02_data 1.4-OP.1 메타
export const LINEUP_ONEPIECE_ID = "ichiban_onepiece_luffy_2026_05";
export const LINEUP_ONEPIECE_TITLE_JA = "一番くじ ワンピース MONKEY.D.LUFFY-冒険の記憶と未来への航路-";
export const LINEUP_ONEPIECE_TITLE_KO = "이찌방쿠지 원피스 MONKEY.D.LUFFY - 모험의 기억과 미래로의 항로";
export const LINEUP_ONEPIECE_IP = "ONE PIECE";
export const LINEUP_ONEPIECE_OPERATOR = "BANDAI SPIRITS";
export const LINEUP_ONEPIECE_RELEASE_DATE_STORE = "2026-05-02";
export const LINEUP_ONEPIECE_END_DATE = "2026-08-31";
export const LINEUP_ONEPIECE_OUTLETS = ["Lawson", "bookstore", "hobby_shop", "Mugiwara_Store", "ONE_PIECE_official_shop", "ichibankuji_online"];
export const LINEUP_ONEPIECE_PRICE_JPY = 790;
export const LINEUP_ONEPIECE_BOX_SIZE = 80;
export const LINEUP_ONEPIECE_BOX_SIZE_ESTIMATED = true;
export const LINEUP_ONEPIECE_ASSETS_BASE_PATH = "monkey_d_luffy_placeholder";
export const LINEUP_ONEPIECE_ASSETS_AVAILABLE = false;  // M3: placeholder 미배치

// 02_data 1.4-OP.2 등급별 매수 (count_estimated:true) + tierClass (M3.1)
export const TIERS_ONEPIECE = [
  { tier: "A", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "モンキー・D・ルフィ 魂豪示像", nameKo: "몽키 D 루피 영혼호시상", sizeLabel: "" },
  { tier: "B", count: 2, typeCount: 2, tierClass: TIER_CLASS_MAIN, nameJa: "モンキー・D・ルフィ MASTERLISE", nameKo: "몽키 D 루피 MASTERLISE", sizeLabel: "" },
  { tier: "C", count: 2, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "モンキー・D・ルフィ 海賊王におれはなる!!!! Revible Moment", nameKo: "몽키 D 루피 해적왕에 내가 되겠다!!!! Revible Moment", sizeLabel: "" },
  { tier: "D", count: 3, typeCount: 1, tierClass: TIER_CLASS_MAIN, nameJa: "モンキー・D・ルフィ ギア5 ONDIMENSION", nameKo: "몽키 D 루피 기어5 ONDIMENSION", sizeLabel: "" },
  { tier: "E", count: 4, typeCount: 2, tierClass: TIER_CLASS_MAIN, nameJa: "はこにわーるど", nameKo: "하코니와루도 (디오라마 박스)", sizeLabel: "" },
  { tier: "F", count: 6, typeCount: 3, tierClass: TIER_CLASS_MAIN, nameJa: "モンキー・D・ルフィ ミニフィギュア", nameKo: "몽키 D 루피 미니 피규어", sizeLabel: "" },
  { tier: "G", count: 12, typeCount: 8, tierClass: TIER_CLASS_GOODS, nameJa: "タオル", nameKo: "타올", sizeLabel: "" },
  { tier: "H", count: 16, typeCount: 14, tierClass: TIER_CLASS_GOODS, nameJa: "アクリルマグネット", nameKo: "아크릴 마그넷", sizeLabel: "" },
  { tier: "I", count: 33, typeCount: 10, tierClass: TIER_CLASS_GOODS, nameJa: "デスクアソート", nameKo: "데스크 아소트", sizeLabel: "" },
  { tier: "Last One", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, nameJa: "モンキー・D・ルフィ MASTERLISE PLUS", nameKo: "몽키 D 루피 MASTERLISE PLUS", sizeLabel: "" },
];
export const TIERS_ONEPIECE_COUNT_ESTIMATED = true;

// 02_data 1.4-OP.3 Double Chance 상품
export const LINEUP_ONEPIECE_DC_PRIZE_NAME_JA = "TO BE CONTINUED THE GIGANT NAME";
export const LINEUP_ONEPIECE_DC_PRIZE_NAME_KO = "TO BE CONTINUED 거대 네임 피규어";
export const LINEUP_ONEPIECE_DC_WINNERS_TOTAL = 100;  // 드래곤볼 50과 차이
export const LINEUP_ONEPIECE_DC_PRIZE_NOTE_KO = "35cm 대형 피규어. winners_total은 일본 캠페인 기준";
export const LINEUP_ONEPIECE_DC_TIER_CLASS = TIER_CLASS_HERO;  // M3.1: 1.4.A.3 검증식 정합
export const LINEUP_ONEPIECE_LOBBY_HERO_ASSET_PATH = "monkey_d_luffy_placeholder/lobby_hero.webp";  // M3.1: 로비 카드 메인 이미지

// 02_data 1.4-OP.4 출처
export const LINEUP_ONEPIECE_SOURCES = [
  { name: "一番くじ俱楽部 공식", url: "https://1kuji.com/products/onep101" },
  { name: "ONE PIECE 공식", url: "https://one-piece.com/news/77238/index.html" },
  { name: "電撃 hobby", url: "https://hobby.dengeki.com/news/2980302/" },
  { name: "inside-games", url: "https://www.inside-games.jp/article/2026/05/02/180800.html" },
];

// 02_data 1.4-OP.5 LINEUP_ONEPIECE 객체
export const LINEUP_ONEPIECE = {
  id: LINEUP_ONEPIECE_ID,
  titleJa: LINEUP_ONEPIECE_TITLE_JA,
  titleKo: LINEUP_ONEPIECE_TITLE_KO,
  ip: LINEUP_ONEPIECE_IP,
  operator: LINEUP_ONEPIECE_OPERATOR,
  releaseDateStore: LINEUP_ONEPIECE_RELEASE_DATE_STORE,
  endDate: LINEUP_ONEPIECE_END_DATE,
  outlets: LINEUP_ONEPIECE_OUTLETS,
  priceJpy: LINEUP_ONEPIECE_PRICE_JPY,
  boxSize: LINEUP_ONEPIECE_BOX_SIZE,
  boxSizeEstimated: LINEUP_ONEPIECE_BOX_SIZE_ESTIMATED,
  tiers: TIERS_ONEPIECE,
  tiersCountEstimated: TIERS_ONEPIECE_COUNT_ESTIMATED,
  dc: {
    winnersTotal: LINEUP_ONEPIECE_DC_WINNERS_TOTAL,
    poolSizeDefault: DC_POOL_SIZE_DEFAULT,
    prizeNameJa: LINEUP_ONEPIECE_DC_PRIZE_NAME_JA,
    prizeNameKo: LINEUP_ONEPIECE_DC_PRIZE_NAME_KO,
    prizeNoteKo: LINEUP_ONEPIECE_DC_PRIZE_NOTE_KO,
    tierClass: LINEUP_ONEPIECE_DC_TIER_CLASS,  // M3.1
  },
  sources: LINEUP_ONEPIECE_SOURCES,
  assetsBasePath: LINEUP_ONEPIECE_ASSETS_BASE_PATH,
  assetsAvailable: LINEUP_ONEPIECE_ASSETS_AVAILABLE,
  lobbyHeroAssetPath: LINEUP_ONEPIECE_LOBBY_HERO_ASSET_PATH,  // M3.1
};

// =====================================================================
// 02_data 1.4.LINEUPS. 라인업 배열 + currentLineupId
// =====================================================================

export const LINEUPS = [LINEUP_DRAGONBALL, LINEUP_ONEPIECE];
export const LINEUP_DEFAULT_ID = LINEUP_DRAGONBALL_ID;

// 라인업 ID로 lookup. 미발견 시 LINEUP_DEFAULT 반환 + console.warn (spec 7.16.1).
export function getLineupById(id) {
  const found = LINEUPS.find((l) => l.id === id);
  if (found) return found;
  if (id !== undefined && id !== null) {
    console.warn(`[numbers.js] getLineupById: lineup_id "${id}" not found in LINEUPS. Falling back to LINEUP_DEFAULT (${LINEUP_DEFAULT_ID}).`);
  }
  return LINEUP_DRAGONBALL;
}

// M3.2 신설: tierClass lookup 헬퍼 (02_data 1.4.A.5).
// 입력: lineup 객체 + tier 라벨 (예: "A", "Last One").
// 출력: tierClass 문자열 (TIER_CLASS_VALUES 중 하나) | null (해당 tier 없을 시).
export function getTierClassForTier(lineup, tier) {
  const found = lineup.tiers.find((t) => t.tier === tier);
  return found ? found.tierClass : null;
}

// =====================================================================
// 02_data 1.5 UI 표시 상수
// =====================================================================

export const HISTORY_RECENT_LIMIT = 50;
export const PERCENT_DISPLAY_DECIMALS = 2;
export const PERCENT_BASE = 100;

// 02_data 1.5 라인업 로비 (M3.1 신설)
export const LOBBY_GRID_COLS_MOBILE = 1;
export const LOBBY_GRID_COLS_TABLET = 2;
export const LOBBY_TABLET_BREAKPOINT_PX = 768;

// 02_data 1.5 tier_class 시각 (M3.2 신설) - 5.13.C 정합
export const HERO_POP_SCALE_PEAK = 1.18;
export const HERO_GLOW_DURATION_MS = 1200;
export const HERO_STATIC_GLOW_BLUR_PX = 12;
export const HERO_STATIC_GLOW_ALPHA = 0.25;

// 02_data 1.5 history 대시보드 (M3.3 신설) - 5.13.D.3 정합
export const HISTORY_DASHBOARD_COLS_MOBILE = 2;
export const HISTORY_DASHBOARD_COLS_TABLET = 4;
export const HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX = 768;

// 02_data 1.6 구매 옵션 (M2 + M2.1)
export const BUY_QUICK_OPTIONS = [1, 3, 5, 10];
export const BUY_FREE_INPUT_MIN = 1;
export const BUY_SKIP_PICK_DEFAULT = false;  // M2.1: 통 선택 단계 skip 기본값 (false = 통 선택 ON)

// 02_data 1.7 상품 이미지 자산 매핑 (M2 / M3 라인업별)
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
export const PEEL_REVEAL_VIEW_MS = 1500;
export const PEEL_REVEAL_TO_FADE_MS = 1800;
export const HERO_CAROUSEL_VISIBLE_PEEK_PX = 24;
export const PEEL_HAPTIC_FULL_DELAY_MS = 350;
export const PEEL_STACK_VISIBLE_LIMIT = 3;
export const PEEL_STACK_OFFSET_PX = 6;
export const PEEL_STACK_SCALE_DELTA = 0.03;
export const PRODUCT_OVERLAY_TICKETS_MAX = 12;

// 02_data 1.10 탭 아이콘 ID (M2)
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

// 02_data 1.12 통 선택 (Pick from Bin) - M2.1 신설 / M3 정리 (T18 PICK_FIRST_HINT_* dead 제거)
export const PICK_GRID_COLS_DEFAULT = 10;  // 격자 기본 열 수. rows = ceil((lineup.boxSize - 1) / cols)
export const PICK_GRID_COLS_MIN = 4;
export const PICK_SLOT_MIN_TAP_PX = 24;
export const PICK_SLOT_GAP_PX = 4;
export const PICK_SLOT_HOVER_LIFT_PX = 4;
export const PICK_SLOT_HOVER_GLOW_PX = 12;
export const PICK_SLOT_CLICK_TO_CARD_MS = 400;
export const PICK_SLOT_EMPTY_FADE_MS = 200;
export const PICK_AUTO_CONFIRM_DELAY_MS = 200;
export const PICK_SLOT_ROTATE_RANGE_DEG = 72;
export const PICK_GRID_CLAMP_MIN_PCT = 5;
export const PICK_GRID_CLAMP_MAX_PCT = 95;
export const PICK_SLOT_JITTER_RATIO = 0.5;
export const PICK_SLOT_SELECTED_Z_BOOST = 30;

// =====================================================================
// 02_data 1.4.2.1 매수 합계 검증식 (라인업별, 부팅 정합 강제)
// =====================================================================

function _validateLineupTierSum(lineup) {
  const sum = lineup.tiers.reduce((acc, t) => acc + t.count, 0);
  if (sum !== lineup.boxSize) {
    throw new Error(
      `[numbers.js] 라인업 "${lineup.id}" 등급별 매수 합(${sum}) ≠ boxSize(${lineup.boxSize}). 02_data 1.4-XX.2.1 검증식 위반.`
    );
  }
}
LINEUPS.forEach(_validateLineupTierSum);

// 02_data 1.4.A.3 tierClass 검증식 (M3.1 신설). 라인업당 hero/main/goods 각 ≥ 1 + 모든 tierClass ∈ TIER_CLASS_VALUES + DC.tierClass ∈ TIER_CLASS_VALUES.
function _validateLineupTierClass(lineup) {
  // 1) 모든 tier에 tierClass 존재 + TIER_CLASS_VALUES 안에 있음
  for (const t of lineup.tiers) {
    if (!TIER_CLASS_VALUES.includes(t.tierClass)) {
      throw new Error(
        `[numbers.js] 라인업 "${lineup.id}" tier "${t.tier}" tierClass "${t.tierClass}" ∉ TIER_CLASS_VALUES. 02_data 1.4.A.3 위반.`
      );
    }
  }
  // 2) DC.tierClass 정합
  if (!TIER_CLASS_VALUES.includes(lineup.dc.tierClass)) {
    throw new Error(
      `[numbers.js] 라인업 "${lineup.id}" dc.tierClass "${lineup.dc.tierClass}" ∉ TIER_CLASS_VALUES. 02_data 1.4.A.3 위반.`
    );
  }
  // 3) hero / main / goods 각 ≥ 1
  for (const required of TIER_CLASS_VALUES) {
    const hasOne = lineup.tiers.some((t) => t.tierClass === required);
    if (!hasOne) {
      throw new Error(
        `[numbers.js] 라인업 "${lineup.id}" tierClass "${required}" 등급 부재. 02_data 1.4.A.3 위반 (각 클래스 ≥ 1 의무).`
      );
    }
  }
}
LINEUPS.forEach(_validateLineupTierClass);

// =====================================================================
// 호환 alias (M2.1 코드 점진 마이그레이션용. M4+에서 완전 제거 후보)
// =====================================================================

// **deprecated 2026-05-08 (M3 단계 4 이월 결정 2.2)** - BOX_SIZE 단수 글로벌은 호환 alias로만 잔존.
// 활성 라인업 동적 lookup 권장: `getLineupById(state.currentLineupId).boxSize`.
export const BOX_SIZE = LINEUP_DRAGONBALL_BOX_SIZE;
