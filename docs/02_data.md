# 02. 데이터 SSOT

본 문서는 Kuji 시뮬레이터의 모든 수치 / 색상 / 스토리지 키의 SSOT. 본 문서를 기준으로 `src/data/numbers.js` / `src/data/colors.js` / `src/data/storage.js` / `src/data/assets.js` 가 생성된다.

매직 넘버는 본 문서에 정의되지 않으면 코드(`src/`, `tests/`)에 둘 수 없다.

# 1. 수치 상수 (`src/data/numbers.js`)

## 1.1. 일반

| 키 | 값 | 의미 |
|---|---|---|
| `STORAGE_KEY_PREFIX` | `"kuji_"` | localStorage 키 prefix |
| `DEFAULT_SEED_FALLBACK_BITS` | 32 | 시드 기본값 (`Date.now()`) 변환 비트 |
| `BOX_ROUND_INITIAL` | 1 | 박스 회차 초기값 |
| `SCHEMA_VERSION` | 6 | localStorage 스키마 버전. **M4 갱신 (2026-05-10)**: 메뉴 재설계로 v6 증가 (전역 키 `kuji_lobby_acked` → `kuji_home_acked` 개명 + 4탭 → 3탭 활성 탭 매핑, 영속 시). M3.1 v5 = 라인업 로비 도입 (전역 키 `kuji_lobby_acked` 신설). M3 v4 = 다중 라인업 격리. |

## 1.2. PRNG

| 키 | 값 | 의미 |
|---|---|---|
| `PRNG_NAME` | `"Mulberry32"` | 채택 PRNG |
| `PRNG_OUTPUT_BITS` | 32 | 출력 비트 |
| `PRNG_OUTPUT_DIVISOR` | `Math.pow(2, PRNG_OUTPUT_BITS)` (= 4294967296) | 출력 정규화 분모 |
| `BOX_ID_HEX_LENGTH` | `PRNG_OUTPUT_BITS / 4` (= 8) | 박스 ID hex 자릿수 |

## 1.3. Double Chance 단순화

| 키 | 값 | 의미 |
|---|---|---|
| `DC_POOL_SIZE_DEFAULT` | 5000 | DC 응모권 풀 추정 크기 |
| `DC_POOL_SIZE_NOTE_KO` | `"단순화 가정. 실제 응모권 풀은 라인업 인기에 따라 천 ~ 수만 단위 변동"` | UI 안내 |

## 1.4. 라인업 (다중 라인업 - **M3 갱신 2026-05-08 / M3.1 tier_class 갱신 2026-05-08**)

### 1.4.0. 라인업 구조 명세

M3부터 라인업 N개 지원. 본 절은 **라인업 객체 공통 구조**를 정의. 개별 라인업은 1.4-DB (드래곤볼) / 1.4-OP (원피스) 절에 데이터 정의.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | 고유 식별자 (research/lineups.json `lineup_id` 정합) |
| `titleJa` / `titleKo` | string | 표기명 (일본어 / 한국어) |
| `ip` | string | IP 라벨 (헤더 표시용 짧은 라벨, 예: `"DRAGONBALL"` / `"ONE PIECE"`) |
| `operator` | string | 운영사 (예: `"BANDAI SPIRITS"`) |
| `releaseDateStore` / `endDate` | string (YYYY-MM-DD) | 매장 발매일 / 캠페인 종료일 |
| `outlets` | string[] | 판매처 ID 배열 |
| `priceJpy` | number | 1회 가격 (엔) |
| `boxSize` / `boxSizeEstimated` | number / boolean | 박스 매수 + 추정 플래그 |
| `gridCols` | number? | 통 격자 열 수 (옵셔널, 미정의 시 `PICK_GRID_COLS_DEFAULT = 10`. M2.1 hook) |
| `tiers` | TierDef[] | 등급별 정의 배열 (1.4-DB.2 / 1.4-OP.2 / 1.4-XX.2 형식). **M3.1 신설**: 각 TierDef에 `tierClass` 필드 필수 (1.4.A 정의) |
| `tiersCountEstimated` | boolean | 등급별 매수 추정 플래그 |
| `dc` | DCDef | Double Chance 정의 (`winnersTotal` / `poolSizeDefault` / `prizeNameJa` / `prizeNameKo` / `prizeNoteKo` / **M3.1 신설** `tierClass`) |
| `sources` | SourceDef[] | 출처 배열 (`name` / `url`) |
| `assetsBasePath` | string | **M3 신설** - 자산 폴더 base path (예: `"the_chronicle_of_goku_placeholder"`) |
| `assetsAvailable` | boolean | **M3 신설** - 자산 배치 완료 여부. false면 SVG fallback (1.7.3) |
| `lobbyHeroAssetPath` | string | **M3.1 신설** - 라인업 로비 카드 메인 이미지 경로 (assetsAvailable=false면 placeholder gray fallback) |

### 1.4.A. 등급 클래스 (TIER_CLASS_VALUES) - **M3.1 신설**

#### 1.4.A.1. 정의

등급의 위상을 코드 차원에서 인지하기 위한 3단계 분류.

| 클래스 | 의미 | 자산 표현 우선순위 |
|---|---|---|
| `"hero"` | 라인업 대표 / 최상급 메인 피규어 / Last One / DC 보너스. 로비 카드 미리보기 슬롯 / 본편 강조 후보 | 최상 |
| `"main"` | 표준 메인 피규어 / 디오라마 / 미니 피규어 등 조형물 | 중 |
| `"goods"` | 굿즈 / 잡화 (타올 / 마그넷 / 포스터 / 데스크 아소트 등) | 하 |

#### 1.4.A.2. 상수

```
TIER_CLASS_HERO  = "hero"
TIER_CLASS_MAIN  = "main"
TIER_CLASS_GOODS = "goods"
TIER_CLASS_VALUES = [TIER_CLASS_HERO, TIER_CLASS_MAIN, TIER_CLASS_GOODS]
```

`src/data/numbers.js` 정의. 02_data 1.4-XX.2 (각 라인업 등급 표) + 1.4-XX.3 (DC) + 검증식이 본 상수 참조.

#### 1.4.A.3. 검증식 (라인업 단위)

각 라인업 LINEUP에 대해 다음 모두 성립.

```
1) 모든 t in LINEUP.tiers: t.tierClass ∈ TIER_CLASS_VALUES
2) LINEUP.dc.tierClass ∈ TIER_CLASS_VALUES
3) ∃ t1 in LINEUP.tiers: t1.tierClass === "hero"
4) ∃ t3 in LINEUP.tiers: t3.tierClass === "goods"
```

**M3.5 (2026-05-10) 룰 완화**: 기존 룰 `∃ t2: t2.tierClass === "main"` 제거. 즉 **main 등급 부재 라인업 허용**. 라인업별 도메인 분류 자율성 확보 (1.4.A.4 정합). hero / goods 룰은 잔존.

부팅 시(numbers.js import 시점) 본 검증 미성립 → 시뮬레이터 부팅 실패 (throw + console.error). 1.4.B.2의 등급 매수 합 검증과 동일 게이트.

#### 1.4.A.4. 분류 정책 (M3.1 합의 / **M3.5 갱신**)

본 정책은 **라인업별 자율 분류** (M3.5 사용자 결정). 휴리스틱은 권고. 라인업 도메인 특성상 다른 분류가 적합하면 라인업 단위로 자율 채택.

기본 휴리스틱 (드래곤볼 정합):

- **hero**: 라인업 첫 등급(A) + Last One + DC 보너스. 또는 라인업 메타에 명시된 "최상급" 상품(예: 魂豪示像 시리즈, MASTERLISE PLUS).
- **main**: A 외 피규어 시리즈(MASTERLISE / Revible Moment / ONDIMENSION 등) + 디오라마 / 미니 피규어.
- **goods**: 타올 / 마그넷 / 클리어 포스터 / 데스크 아소트 / 러버 참 등 굿즈.

**라인업별 변형 (M3.5)**:

- **원피스 (1.4-OP)**: B/C/D/E/F 모두 hero. 사용자 도메인 인식 = "주요 상품" 범위 확장 (대형 + 디오라마 + 미니 피규어 모두 hero 그룹). main = 0.
- **드래곤볼 (1.4-DB)**: 기본 휴리스틱 그대로 (A + Last One = hero, B~F = main, G~J = goods).

**경계 분쟁 발생 시**: 본 사이클은 main/goods 경계의 mid 도입을 거부 (M3.1 plan 8.2.3 리스크 동결). 새 사이클로 분리. **M3.5 룰 완화**: main = 0 허용으로 라인업 자율성 확장. main 등급 사용 여부는 라인업 정의 시 자율.

#### 1.4.A.5. tierClass lookup 헬퍼 (M3.2 신설)

본 사이클에서 본편 화면(추첨/결과)이 tier 라벨을 받아 tierClass를 동적 lookup. 호출처 단순화 위해 numbers.js에 헬퍼 함수 신설.

```js
// numbers.js
// 입력: lineup 객체 + tier 라벨 (예: "A", "Last One").
// 출력: tierClass 문자열 (TIER_CLASS_VALUES 중 하나) | null (해당 tier 없을 시).
export function getTierClassForTier(lineup, tier) {
  const found = lineup.tiers.find((t) => t.tier === tier);
  return found ? found.tierClass : null;
}
```

호출처:
- `render/hero-carousel.js`: `data-tier-class` 속성 부착 시.
- `render/minor-row.js`: `data-tier-class` 속성 부착 시 (현재 G/H/I/J 모두 goods).
- `render/peel-card.js`: 추첨 결과 reveal 시 `isHero` 분기 (M2 K-1 정합 - 결과 모달 폐기, 페이지플립 인플레이스).
- `render/dc-result-modal.js`: hero 모션 적용 시 사실 박제 (DC.tierClass=hero 1.4.A 검증식 정합. DC 결과 객체에 `tier` 필드 부재이므로 헬퍼 호출 부적절. `result.isWin`만 분기). M3.2 단계 6 P1-1 (b) 결정.
- `render/tier-grid.js` 또는 `render/product-gallery.js`: **M3.3 신설** - 갤러리 펼침 시 lineup.tiers를 hero/main/goods 그룹화 (5.13.D.2).
- `core/history.js` `tierClassCounts(history, lineup)`: **M3.3 신설** - history 항목별 tier → tierClass lookup → 통계 산출 (5.13.D.3).

#### 1.4.A.6. tier_class 한국어 라벨 (M3.3 신설)

본 클래스의 사용자 노출 한국어 라벨. 갤러리 섹션 헤더 + history 대시보드 카운터 라벨에 사용. 02_data 1.4.A.4 분류 정책 정합.

| 키 | 값 |
|---|---|
| `TIER_CLASS_LABEL_KO[TIER_CLASS_HERO]` | `"메인 등급"` |
| `TIER_CLASS_LABEL_KO[TIER_CLASS_MAIN]` | `"표준 등급"` |
| `TIER_CLASS_LABEL_KO[TIER_CLASS_GOODS]` | `"굿즈"` |

상수 명세:
```js
export const TIER_CLASS_LABEL_KO = {
  [TIER_CLASS_HERO]: "메인 등급",
  [TIER_CLASS_MAIN]: "표준 등급",
  [TIER_CLASS_GOODS]: "굿즈",
};
```

호출처는 5.13.D.2 (갤러리 섹션 헤더) + 5.13.D.3 (history 대시보드 카운터 라벨).

**라인업별 차이를 흡수해야 하는 영역**:
- 등급 수 (드래곤볼 10등급 A~J vs 원피스 9등급 A~I).
- 등급별 매수 분포 (드래곤볼 1/1/1/1/1/1/8/8/24/33+1 vs 원피스 1/2/2/3/4/6/12/16/33+1).
- 등급별 type_count (드래곤볼 8/8/10/10 vs 원피스 2/1/1/2/3/8/14/10).
- DC `winnersTotal` (드래곤볼 50 vs 원피스 100).
- 자산 base path / available 플래그.

### 1.4-DB. 라인업: 一番くじ ドラゴンボール THE CHRONICLE OF GOKU

#### 1.4-DB.1. 메타

| 키 | 값 | 비고 |
|---|---|---|
| `LINEUP_DRAGONBALL_ID` | `"ichiban_dragonball_chronicle_2026_05"` | research/lineups.json |
| `LINEUP_DRAGONBALL_TITLE_JA` | `"一番くじ ドラゴンボール THE CHRONICLE OF GOKU"` | |
| `LINEUP_DRAGONBALL_TITLE_KO` | `"이찌방쿠지 드래곤볼 THE CHRONICLE OF GOKU"` | |
| `LINEUP_DRAGONBALL_IP` | `"DRAGONBALL"` | |
| `LINEUP_DRAGONBALL_OPERATOR` | `"BANDAI SPIRITS"` | |
| `LINEUP_DRAGONBALL_RELEASE_DATE_STORE` | `"2026-05-08"` | |
| `LINEUP_DRAGONBALL_END_DATE` | `"2026-08-31"` | |
| `LINEUP_DRAGONBALL_OUTLETS` | `["Seven_Eleven", "Ito_Yokado", "Yume_Town"]` | |
| `LINEUP_DRAGONBALL_PRICE_JPY` | 790 | 1회 가격 |
| `LINEUP_DRAGONBALL_BOX_SIZE` | 80 | 박스 매수 (estimated) |
| `LINEUP_DRAGONBALL_BOX_SIZE_ESTIMATED` | true | "추정" 배지 |
| `LINEUP_DRAGONBALL_ASSETS_BASE_PATH` | `"the_chronicle_of_goku_placeholder"` | **M3 신설** - 자산 폴더 |
| `LINEUP_DRAGONBALL_ASSETS_AVAILABLE` | false | **M3 신설** - placeholder 배치 전 (사용자 외부 작업 대기) |

**구 호환**: `LINEUP_ID` / `LINEUP_TITLE_JA` 등 구 명칭은 deprecated. 단계 4 impl_plan에서 `LINEUP_DRAGONBALL_*`로 리네임 + 호환 alias export 검토.
**구 BOX_SIZE = 80**: M3에서도 `BOX_SIZE` 단일 export 잔존 가능 여부 단계 4에서 결정 (test/render 모듈이 `LINEUP.boxSize` 동적 참조로 전환되면 폐기). 자세한 정합은 03_architecture.

#### 1.4-DB.2. 등급별 매수 (count_estimated:true)

| 등급 | 매수 | 종 수 | tierClass | 일본어 | 한국어 | 사이즈 |
|---|---|---|---|---|---|---|
| A | 1 | 1 | `hero` | `孫悟空 MASTERLISE` | `손오공 MASTERLISE` | `11cm` |
| B | 1 | 1 | `main` | `ブルマ MASTERLISE` | `부르마 MASTERLISE` | `21cm` |
| C | 1 | 1 | `main` | `超サイヤ人孫悟空 MASTERLISE` | `초사이어인 손오공 MASTERLISE` | `25cm` |
| D | 1 | 1 | `main` | `超サイヤ人2孫悟空 MASTERLISE` | `초사이어인2 손오공 MASTERLISE` | `25cm` |
| E | 1 | 1 | `main` | `魔人ベジータ MASTERLISE` | `마인 베지타 MASTERLISE` | `24cm` |
| F | 1 | 1 | `main` | `孫悟空 身勝手の極意 MASTERLISE` | `손오공 자림무도 MASTERLISE` | `25cm` |
| G | 8 | 8 | `goods` | `引っ掛けアクリルスタンド` | `걸이형 아크릴 스탠드` | `7.5cm` |
| H | 8 | 8 | `goods` | `ラバーチャーム` | `러버 참` | `6.5cm` |
| I | 24 | 10 | `goods` | `クリアポスター (A3)` | `클리어 포스터 (A3)` | `A3` |
| J | 33 | 10 | `goods` | `ジャガードミニタオル` | `자카드 미니 타올` | `25cm` |
| Last One | 1 | 1 | `hero` | `大猿悟空 SOFVICS` | `거대 원숭이 손오공 SOFVICS` | `26cm` |

**M3.1 분류 근거**: A상은 라인업 대표 MASTERLISE. B~F는 표준 MASTERLISE 시리즈(피규어). G~J는 굿즈/잡화. Last One = hero (DC와 동일 상품 구조).

##### 1.4-DB.2.1. 매수 합계 검증식

```
일반 카드 합 = 1+1+1+1+1+1+8+8+24+33 = 79
박스 매수 = 79 + Last One 1 = 80 = LINEUP_DRAGONBALL_BOX_SIZE
```

부팅 시 본 등식 미성립 → 시뮬레이터 부팅 실패.

#### 1.4-DB.3. Double Chance 상품

| 키 | 값 | 비고 |
|---|---|---|
| `LINEUP_DRAGONBALL_DC_PRIZE_NAME_JA` | `"大猿悟空 SOFVICS"` | ラストワン賞 동일 상품 |
| `LINEUP_DRAGONBALL_DC_PRIZE_NAME_KO` | `"거대 원숭이 손오공 SOFVICS"` | |
| `LINEUP_DRAGONBALL_DC_WINNERS_TOTAL` | 50 | 일본 캠페인 당첨자 수 |
| `LINEUP_DRAGONBALL_DC_PRIZE_NOTE_KO` | `"ラストワン賞과 동일 상품. winners_total은 일본 캠페인 기준"` | UI 안내 |
| `LINEUP_DRAGONBALL_DC_TIER_CLASS` | `"hero"` | **M3.1 신설** - 1.4.A.3 검증식 정합 |

#### 1.4-DB.4. 출처

| 출처 | URL |
|---|---|
| 一番くじ俱楽部 공식 | https://1kuji.com/products/db_goku |
| 電撃 hobby | https://hobby.dengeki.com/news/2977500/ |
| inside-games | https://www.inside-games.jp/article/2026/04/28/180618.html |
| magmix | https://magmix.jp/post/349310 |

상수명: `LINEUP_DRAGONBALL_SOURCES = [{ name, url }, ...]` (위 표 4건). LINEUP_DRAGONBALL.sources에 그대로 매핑.

#### 1.4-DB.5. LINEUP_DRAGONBALL 객체

`03_architecture` 3.3~3.5 의 `core/` 함수가 `lineup` 인자로 받는 구조체. 1.4-DB 항목들 묶음으로 derive.

| 키 | 값 | 출처 |
|---|---|---|
| `id` | `LINEUP_DRAGONBALL_ID` | 1.4-DB.1 |
| `titleJa` / `titleKo` | `LINEUP_DRAGONBALL_TITLE_JA` / `_TITLE_KO` | 1.4-DB.1 |
| `ip` | `LINEUP_DRAGONBALL_IP` | 1.4-DB.1 |
| `operator` | `LINEUP_DRAGONBALL_OPERATOR` | 1.4-DB.1 |
| `releaseDateStore` | `LINEUP_DRAGONBALL_RELEASE_DATE_STORE` | 1.4-DB.1 |
| `endDate` | `LINEUP_DRAGONBALL_END_DATE` | 1.4-DB.1 |
| `outlets` | `LINEUP_DRAGONBALL_OUTLETS` | 1.4-DB.1 |
| `priceJpy` | `LINEUP_DRAGONBALL_PRICE_JPY` | 1.4-DB.1 |
| `boxSize` | `LINEUP_DRAGONBALL_BOX_SIZE` | 1.4-DB.1 |
| `boxSizeEstimated` | `LINEUP_DRAGONBALL_BOX_SIZE_ESTIMATED` | 1.4-DB.1 |
| `gridCols` | (옵셔널, 미정의 시 `PICK_GRID_COLS_DEFAULT`) | 1.12 hook |
| `tiers` | `TIERS_DRAGONBALL` | 1.4-DB.2 |
| `tiersCountEstimated` | `TIERS_DRAGONBALL_COUNT_ESTIMATED` | 1.4-DB.2 |
| `dc.winnersTotal` | `LINEUP_DRAGONBALL_DC_WINNERS_TOTAL` | 1.4-DB.3 |
| `dc.poolSizeDefault` | `DC_POOL_SIZE_DEFAULT` | 1.3 (라인업 공유) |
| `dc.prizeNameJa` / `prizeNameKo` / `prizeNoteKo` | 1.4-DB.3 | 1.4-DB.3 |
| `dc.tierClass` | `LINEUP_DRAGONBALL_DC_TIER_CLASS` (= `"hero"`) | **M3.1 신설** 1.4-DB.3 |
| `sources` | `LINEUP_DRAGONBALL_SOURCES` | 1.4-DB.4 |
| `assetsBasePath` | `LINEUP_DRAGONBALL_ASSETS_BASE_PATH` | 1.4-DB.1 |
| `assetsAvailable` | `LINEUP_DRAGONBALL_ASSETS_AVAILABLE` | 1.4-DB.1 |
| `lobbyHeroAssetPath` | `LINEUP_DRAGONBALL_LOBBY_HERO_ASSET_PATH` (= `"the_chronicle_of_goku_placeholder/lobby_hero.webp"`) | **M3.1 신설** 1.4-DB.1 + 1.7 |

### 1.4-OP. 라인업: 一番くじ ワンピース MONKEY.D.LUFFY-冒険の記憶と未来への航路- (**M3 신설**)

#### 1.4-OP.1. 메타

| 키 | 값 | 비고 |
|---|---|---|
| `LINEUP_ONEPIECE_ID` | `"ichiban_onepiece_luffy_2026_05"` | research/lineups.json |
| `LINEUP_ONEPIECE_TITLE_JA` | `"一番くじ ワンピース MONKEY.D.LUFFY-冒険の記憶と未来への航路-"` | |
| `LINEUP_ONEPIECE_TITLE_KO` | `"이찌방쿠지 원피스 MONKEY.D.LUFFY - 모험의 기억과 미래로의 항로"` | |
| `LINEUP_ONEPIECE_IP` | `"ONE PIECE"` | 헤더 라벨 |
| `LINEUP_ONEPIECE_OPERATOR` | `"BANDAI SPIRITS"` | |
| `LINEUP_ONEPIECE_RELEASE_DATE_STORE` | `"2026-05-02"` | |
| `LINEUP_ONEPIECE_RELEASE_DATE_ONLINE` | `"2026-05-07T17:00:00+09:00"` | (참고) |
| `LINEUP_ONEPIECE_END_DATE` | `"2026-08-31"` | |
| `LINEUP_ONEPIECE_OUTLETS` | `["Lawson", "bookstore", "hobby_shop", "Mugiwara_Store", "ONE_PIECE_official_shop", "ichibankuji_online"]` | |
| `LINEUP_ONEPIECE_PRICE_JPY` | 790 | 1회 가격 |
| `LINEUP_ONEPIECE_BOX_SIZE` | 80 | 박스 매수 (estimated) |
| `LINEUP_ONEPIECE_BOX_SIZE_ESTIMATED` | true | "추정" 배지 |
| `LINEUP_ONEPIECE_ASSETS_BASE_PATH` | `"monkey_d_luffy_placeholder"` | 자산 폴더 (사용자 외부 작업 대기) |
| `LINEUP_ONEPIECE_ASSETS_AVAILABLE` | false | placeholder 미배치 (1.7.3 SVG fallback) |
| `LINEUP_ONEPIECE_LOBBY_HERO_ASSET_PATH` | `"monkey_d_luffy_placeholder/lobby_hero.webp"` | **M3.1 신설** - 로비 카드 메인 이미지 (assetsAvailable=false면 placeholder gray fallback) |

#### 1.4-OP.2. 등급별 매수 (count_estimated:true)

| 등급 | 매수 | 종 수 | tierClass | 일본어 | 한국어 |
|---|---|---|---|---|---|
| A | 1 | 1 | `hero` | `モンキー・D・ルフィ 魂豪示像` | `몽키 D 루피 영혼호시상` |
| B | 2 | 2 | `hero` | `モンキー・D・ルフィ MASTERLISE` | `몽키 D 루피 MASTERLISE` |
| C | 2 | 1 | `hero` | `モンキー・D・ルフィ 海賊王におれはなる!!!! Revible Moment` | `몽키 D 루피 해적왕에 내가 되겠다!!!! Revible Moment` |
| D | 3 | 1 | `hero` | `モンキー・D・ルフィ ギア5 ONDIMENSION` | `몽키 D 루피 기어5 ONDIMENSION` |
| E | 4 | 2 | `hero` | `はこにわーるど` | `하코니와루도 (디오라마 박스)` |
| F | 6 | 3 | `hero` | `モンキー・D・ルフィ ミニフィギュア` | `몽키 D 루피 미니 피규어` |
| G | 12 | 8 | `goods` | `タオル` | `타올` |
| H | 16 | 14 | `goods` | `アクリルマグネット` | `아크릴 마그넷` |
| I | 33 | 10 | `goods` | `デスクアソート` | `데스크 아소트` |
| Last One | 1 | 1 | `hero` | `モンキー・D・ルフィ MASTERLISE PLUS` | `몽키 D 루피 MASTERLISE PLUS` |

**M3.5 분류 근거 (2026-05-10 사용자 결정)**: 사용자 도메인 인식상 원피스는 A~F가 모두 "주요 상품"이라는 인식. A 영혼호시상 + B/C/D 대형 피규어 + E 디오라마 + F 미니 피규어 모두 hero 그룹. G/H/I 굿즈만 분리. main 등급 부재 (1.4.A.3 검증식 M3.5 완화로 허용). 드래곤볼 1.4-DB.2와 분류 패턴 차이 (라인업별 자율 분류 정책 1.4.A.4).

**M3.1 구 분류 근거 (2026-05-08, M3.5에서 폐기)**: A상 魂豪示像은 BANDAI SPIRITS 최상급 도색 라인. B~D는 MASTERLISE/Revible Moment/ONDIMENSION 시리즈. E(디오라마 박스), F(미니 피규어)도 조형물이라 main. G~I 굿즈. Last One = MASTERLISE PLUS 강화판으로 hero.

##### 1.4-OP.2.1. 매수 합계 검증식

```
일반 카드 합 = 1+2+2+3+4+6+12+16+33 = 79
박스 매수 = 79 + Last One 1 = 80 = LINEUP_ONEPIECE_BOX_SIZE
```

부팅 시 본 등식 미성립 → 시뮬레이터 부팅 실패. **드래곤볼 합계 검증식과 독립**. 라인업 추가 시마다 검증식 추가 의무.

#### 1.4-OP.3. Double Chance 상품

| 키 | 값 | 비고 |
|---|---|---|
| `LINEUP_ONEPIECE_DC_PRIZE_NAME_JA` | `"TO BE CONTINUED THE GIGANT NAME"` | 35cm 거대 피규어 |
| `LINEUP_ONEPIECE_DC_PRIZE_NAME_KO` | `"TO BE CONTINUED 거대 네임 피규어"` | |
| `LINEUP_ONEPIECE_DC_WINNERS_TOTAL` | 100 | **드래곤볼 50과 차이** (라인업별 가변) |
| `LINEUP_ONEPIECE_DC_PRIZE_NOTE_KO` | `"35cm 대형 피규어. winners_total은 일본 캠페인 기준"` | UI 안내 |
| `LINEUP_ONEPIECE_DC_TIER_CLASS` | `"hero"` | **M3.1 신설** - 1.4.A.3 검증식 정합 |

#### 1.4-OP.4. 출처

| 출처 | URL |
|---|---|
| 一番くじ俱楽部 공식 | https://1kuji.com/products/onep101 |
| ONE PIECE 공식 | https://one-piece.com/news/77238/index.html |
| 電撃 hobby | https://hobby.dengeki.com/news/2980302/ |
| inside-games | https://www.inside-games.jp/article/2026/05/02/180800.html |

상수명: `LINEUP_ONEPIECE_SOURCES = [{ name, url }, ...]` (위 표 4건). LINEUP_ONEPIECE.sources에 그대로 매핑.

#### 1.4-OP.5. LINEUP_ONEPIECE 객체

1.4-DB.5와 동일 구조 (1.4.0 명세 정합). 출처 = 1.4-OP.1~4. **M3.1 추가 매핑**:

| 키 | 값 | 출처 |
|---|---|---|
| `dc.tierClass` | `LINEUP_ONEPIECE_DC_TIER_CLASS` (= `"hero"`) | 1.4-OP.3 |
| `lobbyHeroAssetPath` | `LINEUP_ONEPIECE_LOBBY_HERO_ASSET_PATH` | 1.4-OP.1 + 1.7 |

### 1.4.LINEUPS. 라인업 배열 + currentLineupId

| 키 | 값 | 의미 |
|---|---|---|
| `LINEUPS` | `[LINEUP_DRAGONBALL, LINEUP_ONEPIECE]` | 활성 라인업 N개 (M3 = 2) |
| `LINEUP_DEFAULT_ID` | `LINEUP_DRAGONBALL_ID` | 신규 사용자 / v3 마이그레이션 시 default |
| `getLineupById(id)` | derive | `LINEUPS.find(l => l.id === id)`. 미발견 시 LINEUP_DEFAULT 반환 + console.warn (안전 fallback) |

**`currentLineupId`**: state 영속 키 (`kuji_current_lineup_id`, 3.1 storage 명세 정합).

**라인업 추가 절차** (M4+ 새 라인업 시):
1. 1.4-XX 절 신설 (메타 + 등급 + DC + 출처 + LINEUP 객체).
2. `LINEUPS` 배열에 추가.
3. 매수 합계 검증식 추가 (1.4-XX.2.1).
4. **M3.1 추가**: 등급별 `tierClass` 부여 (1.4.A.4 분류 정책 정합) + DC `tierClass` 부여.
5. **M3.1 추가**: `lobbyHeroAssetPath` 정의 (assets.js 매핑 + 1.7 자산 정책 정합).
6. assets.js에 `LINEUP_XX_ASSETS_BASE_PATH` 추가.
7. 1.4.A.3 검증식 통과 (hero ≥ 1 + goods ≥ 1 + 모든 tierClass ∈ TIER_CLASS_VALUES). **M3.5 갱신**: main ≥ 1 룰 폐기. main 등급 부재 라인업 허용.
8. 단계 6 게이트 검증 룰 통과.

## 1.4.B. View 상수 (M3.1 신설 / **M4 갱신 - lobby → home 격상**)

view 모델 + 탭 모델 정의. spec 4장 / 5.13.B 정합.

**view 상수** (M3.1 신설 / M4 갱신):

| 키 | 값 | 의미 |
|---|---|---|
| `STATE_VIEW_HOME` | `"home"` (M3.1 `STATE_VIEW_LOBBY = "lobby"` 개명, **단계 4 결정**) | 라인업 선택 화면 = 쿠지 홈 (5.13.B) |
| `STATE_VIEW_MAIN` | `"main"` | 본편 3탭 모델 (5.13.A 외) |
| `STATE_VIEW_VALUES` | `[STATE_VIEW_HOME, STATE_VIEW_MAIN]` | 검증식용 enum |
| `STATE_VIEW_DEFAULT` | `STATE_VIEW_MAIN` | homeAcked=true 시 부팅 default. homeAcked=false 시 HOME 강제 |

**M3.1 잔존 호환 alias (단계 4 결정)**: `STATE_VIEW_LOBBY` / `STATE_VIEW_VALUES` 구 명칭 호환 alias 유지 vs 일괄 개명 + 호출처 갱신. 영속 storage 값(`"lobby"`/`"home"`)은 마이그레이션 의무.

**탭 상수 (M4 신설)**: 4탭 → 3탭 재구성. spec 4장 정합.

| 키 | 값 | 의미 |
|---|---|---|
| `STATE_TAB_DRAW` | `"draw"` | 추첨 탭 (탭 1, 잔존) |
| `STATE_TAB_PRODUCTS_HISTORY` | `"products_history"` | 갤러리+기록 통합 탭 (탭 2, M4 신설) |
| `STATE_TAB_SETTINGS` | `"settings"` | 설정 탭 (탭 3, 잔존) |
| `STATE_TAB_VALUES` | `[STATE_TAB_DRAW, STATE_TAB_PRODUCTS_HISTORY, STATE_TAB_SETTINGS]` | 검증식 enum |
| `STATE_TAB_DEFAULT` | `STATE_TAB_DRAW` | 라인업 진입 default |

**M3.5까지 4탭 (`"draw"` / `"history"` / `"dc"` / `"settings"`) 폐기**: 단계 4 마이그레이션 + 호출처 grep + `"history"` / `"dc"` 잔존 0 의무.

**dispatch type 상수** (M3.1 신설 / M4 갱신):

| 키 | 값 | 의미 |
|---|---|---|
| `DISPATCH_TYPE_OPEN_HOME` | `"open_home"` (M3.1 `OPEN_LOBBY = "open_lobby"` 개명, **단계 4 결정**) | 5.13.B.6.1 |
| `DISPATCH_TYPE_ENTER_LINEUP` | `"enter_lineup"` | 5.13.B.6.2 |
| `DISPATCH_TYPE_SET_ACTIVE_TAB` | `"set_active_tab"` (M4 신설) | 3탭 전환 |

**M4 폐기**: `DISPATCH_TYPE_SET_CURRENT_LINEUP` (= `"set_current_lineup"`)는 enter_lineup으로 통합. 단계 4 호출처 grep + 단계 5 dead 제거.

## 1.5. UI 표시 상수

| 키 | 값 | 의미 |
|---|---|---|
| `HISTORY_RECENT_LIMIT` | 50 | 전적 탭 최근 추첨 표시 한도 |
| `PERCENT_BASE` | 100 | 분수→백분율 환산 |
| `PERCENT_DISPLAY_DECIMALS` | 2 | 백분율 소숫점 자릿수 |
| `LOBBY_GRID_COLS_MOBILE` | 1 | **M3.1 신설** - 로비 카드 그리드 열 수 (모바일, 5.13.B.4.1) |
| `LOBBY_GRID_COLS_TABLET` | 2 | **M3.1 신설** - 로비 카드 그리드 열 수 (태블릿 이상, 5.13.B.4.1) |
| `LOBBY_TABLET_BREAKPOINT_PX` | 768 | **M3.1 신설** - 태블릿 breakpoint (CSS media query, 5.13.B.4.1) |
| `HERO_POP_SCALE_PEAK` | 1.18 | **M3.2 신설** - 결과 reveal hero 등급 등장 시 transform scale 피크 (페이지플립 카드 + DC 모달 공통). `RESULT_POP_SCALE_PEAK = 1.1` 대비 강화 (5.13.C.3) |
| `HERO_GLOW_DURATION_MS` | 1200 | **M3.2 신설** - 결과 reveal hero 골드 글로우 펄스 1회 사이클 ms (페이지플립 카드 + DC 모달 공통) |
| `HERO_STATIC_GLOW_BLUR_PX` | 12 | **M3.2 신설** - 추첨 탭 hero 카드 정적 글로우 박스 그림자 blur (5.13.C.2) |
| `HERO_STATIC_GLOW_ALPHA` | 0.25 | **M3.2 신설** - 추첨 탭 hero 카드 정적 글로우 골드 알파 (PEEL_REVEAL_VIEW_MS 글로우 충돌 회피용 약한 강도) |
| `HISTORY_DASHBOARD_COLS_MOBILE` | 2 | **M3.3 신설** - history 대시보드 모바일 그리드 열 수 (2x2). 사용자 결정 9.2 |
| `HISTORY_DASHBOARD_COLS_TABLET` | 4 | **M3.3 신설** - history 대시보드 태블릿 이상 그리드 열 수 (전체+hero+main+goods 가로 정렬) |
| `HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX` | 768 | **M3.3 신설** - 대시보드 breakpoint (LOBBY와 동일. 통일성 위해 동일 값 유지하나 별도 상수 - 변경 시 영향 격리) |

## 1.6. 구매 옵션 (M2 신설 + M2.1 보강)

| 키 | 값 | 의미 |
|---|---|---|
| `BUY_QUICK_OPTIONS` | `[1, 3, 5, 10]` | Quick 구매 매수 (1매 / 3매 / 5매 / 10매) |
| `BUY_FREE_INPUT_MIN` | 1 | 자유 입력 최소 매수 |
| `BUY_SKIP_PICK_DEFAULT` | false | **M2.1 신설** - 통 선택 단계 skip 기본값 (false = 통 선택 ON, 첫 진입 시 격자 표시) |

`BUY_FREE_INPUT_MAX` 는 박스 deck 잔여 매수로 동적 결정 (정의 키 아님).

## 1.7. 상품 이미지 자산 ID 매핑 (M2 신설 / **M3 다중 라인업 갱신**)

`src/data/assets.js` 의 export 매핑. M3부터 라인업별 자산 폴더 분기.

### 1.7.0. 라인업별 자산 정책 (M3 신설)

| 정책 | 적용 |
|---|---|
| 자산 base path | `lineup.assetsBasePath` 동적 조회 (1.4.0 명세). 라인업별 폴더 분리. |
| `assetsAvailable` | `lineup.assetsAvailable` boolean. false면 1.7.3 SVG fallback 적용. |
| 자산 미배치 라인업 | SVG fallback 우선 (사용자 결정 8.4 (A)). gray + "준비 중" 텍스트 미사용. |
| 등급별 자산 ID | 라인업별 등급 수에 따라 동적 (드래곤볼 11 = A~J + Last One / 원피스 10 = A~I + Last One). |

**라인업별 등급 매핑**: 라인업 객체의 `tiers` 배열을 순회하며 `tier.tier` 키 + `"-main"` suffix로 메인 자산 ID 도출. 종별 자산은 `${tier.tier}-${index}` (typeCount ≥ 2).

### 1.7.1-DB. 라인업: 드래곤볼 (1.4-DB)

| 등급 | 메인 자산 ID | 종별 자산 ID (typeCount ≥ 2) |
|---|---|---|
| A | `"A-main"` | (1종, 메인만) |
| B | `"B-main"` | (1종) |
| C | `"C-main"` | (1종) |
| D | `"D-main"` | (1종) |
| E | `"E-main"` | (1종) |
| F | `"F-main"` | (1종) |
| G | `"G-main"` | `"G-0"` ~ `"G-7"` (8종) |
| H | `"H-main"` | `"H-0"` ~ `"H-7"` (8종) |
| I | `"I-main"` | `"I-0"` ~ `"I-9"` (10종) |
| J | `"J-main"` | `"J-0"` ~ `"J-9"` (10종) |
| Last One | `"LastOne-main"` | (1종) |

`LINEUP_DRAGONBALL_ASSETS_BASE_PATH = "the_chronicle_of_goku_placeholder"` / `LINEUP_DRAGONBALL_ASSETS_AVAILABLE = false` (사용자 외부 작업 대기).

### 1.7.1-OP. 라인업: 원피스 (1.4-OP) **M3 신설**

| 등급 | 메인 자산 ID | 종별 자산 ID (typeCount ≥ 2) |
|---|---|---|
| A | `"A-main"` | (1종) |
| B | `"B-main"` | `"B-0"` ~ `"B-1"` (2종) |
| C | `"C-main"` | (1종) |
| D | `"D-main"` | (1종) |
| E | `"E-main"` | `"E-0"` ~ `"E-1"` (2종) |
| F | `"F-main"` | `"F-0"` ~ `"F-2"` (3종) |
| G | `"G-main"` | `"G-0"` ~ `"G-7"` (8종) |
| H | `"H-main"` | `"H-0"` ~ `"H-13"` (14종) |
| I | `"I-main"` | `"I-0"` ~ `"I-9"` (10종) |
| Last One | `"LastOne-main"` | (1종) |

`LINEUP_ONEPIECE_ASSETS_BASE_PATH = "monkey_d_luffy_placeholder"` / `LINEUP_ONEPIECE_ASSETS_AVAILABLE = false` (placeholder 미배치).

`PRODUCT_ASSETS_MAIN_PLACEHOLDER` (= true) 플래그 = M2 1차부터 종별 자산이 메인을 재사용함 (라인업 무관 적용).

### 1.7.2. 자산 형식 (M2.1 보강 / **M3 다중 라인업 정합**)

라인업별 base path + Last One의 파일 키 = `Z` (공통 정책. `PRODUCT_IMAGE_FILE_KEYS["Last One"] = "Z"`). assets.js는 `<img class="product-photo" loading="lazy" decoding="async">` 문자열을 반환. `lineup.assetsAvailable === false` 또는 미생성 등급의 경우 SVG fallback (1.7.3). CSS는 `.last-one-image / .product-image-wrap / .hero-image`에서 `svg, img` 동치 셀렉터로 처리.

### 1.7.3. SVG fallback 정책 (**M3 신설, 사용자 결정 8.4 (A)**)

`lineup.assetsAvailable === false`인 라인업 또는 자산 부재 등급은 SVG fallback 사용. M2.1에서 G~J에 사용된 SVG (`assets/svg/grade_card.svg` 등) 패턴 답습. 등급 라벨(A~J)을 골드 텍스트로 표시. 라인업 IP 표기 없음 (라이선스 안전).

| 정책 | 값 |
|---|---|
| 폴백 SVG ID | `"grade-fallback"` (등급 라벨 + 골드 톤) |
| 폴백 적용 조건 | `lineup.assetsAvailable === false` OR 자산 파일 404 (런타임 detection X. 빌드 타임 정합) |
| placeholder 텍스트 | 등급 라벨만 (예: "A", "B", ..., "Last One"). 라인업 IP / 캐릭터명 표기 0건 (라이선스 회피) |
| Last One SVG | 별도 SVG (M2.1 1차 SVG 답습 또는 단일 fallback) |

### 1.7.4. github 호환 placeholder 자산 사양 (M2.1 4.13.12 신설 / **M3 다중 라인업 정합**)

본 절은 드래곤볼 placeholder 사양 (M2.1 시점)을 기록. **M3에서는 라인업별 폴더로 확장** (1.7.0 / 1.4-DB.1 / 1.4-OP.1 정합). 원피스 폴더는 `monkey_d_luffy_placeholder/{A~I,Z}.webp` (10장).

`the_chronicle_of_goku_img/`는 BANDAI SPIRITS 공식 자산 폴더로 `.gitignore` 유지 (라이선스 0 정책). github에서 이미지가 broken되는 문제를 해결하기 위해 별도 라이선스 클린 placeholder 폴더 `the_chronicle_of_goku_placeholder/`를 도입한다.

**폴더 정책**

- `the_chronicle_of_goku_img/` - 로컬 전용. 사용자 BANDAI 공식 자산 보관. `.gitignore` 유지.
- `the_chronicle_of_goku_placeholder/` - git 추적. 라이선스 클린 추상화 raster 7장 배치. 사용자 외부 AI 도구 (Midjourney / DALL-E / Stable Diffusion / Firefly 등) 생성 후 배치.

**파일 스펙**

| 항목 | 값 |
|---|---|
| 포맷 | webp |
| 사이즈 | 512x512 (1:1) |
| 파일명 | `A.webp` ~ `F.webp` + `Z.webp` (Last One은 Z) |
| 스타일 | 단순 anime 일러스트, clean lineart, flat shading, 1:1 정사각 |
| 회피 | 텍스트/한자/영문자, 시그니처 IP 마크 (M 이마 / 거북이 한자 등), 캐릭터 고유명 |
| 일관성 | 7장 동일 모델/시드/스타일 권장 |

**프롬프트 (영문, AI 도구 호환성)**

| 키 | 등급 | 프롬프트 |
|---|---|---|
| A | A상 | `simple anime-style portrait of a martial artist in orange gi uniform with white belt, short black spiky hair, calm pose, plain warm beige background, clean lineart, flat shading, 1:1 square` |
| B | B상 | `simple anime-style portrait of a young woman scientist with short blue bob hair and yellow headband, light blue jumpsuit, smiling, plain pastel background, clean lineart, flat shading, 1:1 square` |
| C | C상 | `simple anime-style portrait of a martial artist in orange gi with golden spiky hair, faint yellow energy aura, plain warm background, clean lineart, flat shading, 1:1 square` |
| D | D상 | `simple anime-style portrait of a martial artist in orange gi with golden spiky hair, blue lightning sparks around figure, intense expression, plain dark background, clean lineart, flat shading, 1:1 square` |
| E | E상 | `simple anime-style portrait of a stern warrior in dark navy battle armor with white gloves and boots, short black spiky hair (no forehead mark), plain purple background, clean lineart, flat shading, 1:1 square` |
| F | F상 | `simple anime-style portrait of a calm martial artist in orange gi with silver-white spiky hair, soft blue meditation aura, eyes closed, plain pale blue background, clean lineart, flat shading, 1:1 square` |
| Z | Last One | `simple anime-style illustration of a giant brown ape figure under a full moon, night sky background, stylized non-realistic, clean lineart, flat shading, 1:1 square` |

**적용 단계**

1. 사용자가 7장 외부 생성 후 `the_chronicle_of_goku_placeholder/{A~F,Z}.webp`에 배치.
2. assets.js의 `PRODUCT_IMAGE_BASE_PATH`를 `"the_chronicle_of_goku_placeholder"`로 수정.
3. 시각 검증 + commit + push.

## 1.8. 뜯기 애니메이션 상수 (M2 신설)

| 키 | 값 | 의미 |
|---|---|---|
| `PEEL_DRAG_THRESHOLD_RATIO` | 0.30 | 카드 폭 대비 좌측 드래그 임계값 (30%) |
| `PEEL_DURATION_MS` | 700 | 뜯기 애니메이션 지속 |
| `PEEL_HAPTIC_HALF_MS` | 10 | 50% 시점 햅틱 |
| `PEEL_HAPTIC_FULL_MS` | 20 | 완료 시점 햅틱 |

## 1.9. 카드 / 모션 토큰 (M2 신설)

| 키 | 값 | 의미 |
|---|---|---|
| `CARD_ASPECT_RATIO` | `"5.5 / 4"` | 복권 카드 비율 (가로 / 세로) |
| `MODAL_SLIDE_DURATION_MS` | 200 | 모달 슬라이드 인 |
| `GAUGE_TRANSITION_DURATION_MS` | 300 | 게이지 갱신 |
| `RESULT_POP_SCALE_PEAK` | 1.1 | 결과 등장 0.5 → 1.1 → 1.0 |
| `PEEL_REVEAL_VIEW_MS` | 1500 | reveal 후 카드 표시 시간 (M2 모달 폐기 흐름) |
| `PEEL_REVEAL_TO_FADE_MS` | 1800 | reveal 후 fade out 시작 |
| `HERO_CAROUSEL_VISIBLE_PEEK_PX` | 24 | 메인 캐러셀 좌우 미리보기 폭 (px) |
| `PEEL_HAPTIC_FULL_DELAY_MS` | 350 | 50% 햅틱 후 완료 햅틱까지 (PEEL_DURATION_MS / 2) |
| `PEEL_STACK_VISIBLE_LIMIT` | 3 | 뜯기 인벤토리 스택 표시 매수 |
| `PEEL_STACK_OFFSET_PX` | 6 | 적층 카드 오프셋 |
| `PEEL_STACK_SCALE_DELTA` | 0.03 | 적층 카드 스케일 감소 |
| `PRODUCT_OVERLAY_TICKETS_MAX` | 12 | 상품 이미지 위 오버레이 복권 최대 표시 수 |
| `PEEL_REVEAL_TO_MODAL_MS` | 800 | **DEPRECATED** (M2 모달 폐기 5.10.4 / 5.10.6 / 5.10.9). 코드 import 금지. M3 사이클에서 키 자체 제거 검토 |

## 1.10. 탭 아이콘 ID (M2 신설)

| 탭 ID | 자산 ID |
|---|---|
| `draw` | `"icon-draw"` |
| `history` | `"icon-history"` |
| `dc` | `"icon-dc"` |
| `settings` | `"icon-settings"` |

## 1.11. 타이포그래피 (M2 신설)

| 키 | 값 | 의미 |
|---|---|---|
| `FONT_FAMILY_BODY_KO` | `"Noto Sans KR, sans-serif"` | 한국어 본문 |
| `FONT_FAMILY_BODY_JA` | `"Noto Serif JP, serif"` | 일본어 라벨 |
| `FONT_FAMILY_TIER_DISPLAY` | `"system-ui, -apple-system, BlinkMacSystemFont, sans-serif"` | 등급 글자 (굵은체) |

## 1.12. 통 선택 (Pick from Bin) - M2.1 신설

격자 레이아웃, 슬롯 모션, 첫 진입 안내 상수.

| 키 | 값 | 의미 |
|---|---|---|
| `PICK_GRID_COLS_DEFAULT` | 10 | 격자 기본 열 수. 행 수는 `BOX_SIZE / PICK_GRID_COLS_DEFAULT` 도출 (드래곤볼 80 = 10×8) |
| `PICK_GRID_COLS_MIN` | 4 | 격자 최소 열 수 (모바일 좁은 화면 fallback) |
| `PICK_SLOT_MIN_TAP_PX` | 24 | 슬롯 최소 터치 타깃 (px). 미달 시 격자 cols 자동 축소 |
| `PICK_SLOT_GAP_PX` | 4 | 슬롯 간 간격 |
| `PICK_SLOT_HOVER_LIFT_PX` | 4 | 호버 시 슬롯 부상 |
| `PICK_SLOT_HOVER_GLOW_PX` | 12 | 호버 글로우 반경 |
| `PICK_SLOT_CLICK_TO_CARD_MS` | 400 | 슬롯 클릭 → 페이지플립 카드 전환 시간 |
| `PICK_SLOT_EMPTY_FADE_MS` | 200 | 뽑힌 슬롯 회색화 전환 시간 |
| ~~`PICK_FIRST_HINT_DURATION_MS`~~ | ~~4000~~ | **2026-05-08 deprecated (4.17 단계 6)** - toast 폐기로 사용처 0. 호환 위해 numbers.js 잔존, 다음 정리 라운드 제거 후보. |
| ~~`PICK_FIRST_HINT_TEXT_KO`~~ | ~~"N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다."~~ | **2026-05-08 deprecated (4.17 단계 6)** - 동일. |
| `PICK_AUTO_CONFIRM_DELAY_MS` | 200 | **2026-05-08 신설** - 사용자가 N매 선택 완료 후 자동 confirm까지 시각 확인 딜레이 (4.14.5). 너무 짧으면 마지막 선택 슬롯 강조를 놓치고, 너무 길면 답답함. |
| `PICK_SLOT_ROTATE_RANGE_DEG` | 72 | **2026-05-08 신설 (4.17)** - 슬롯 회전 폭. ±36° = 72° 범위. 산개 메타포의 "흩뿌려진 종이" 느낌. |
| `PICK_GRID_CLAMP_MIN_PCT` | 5 | **2026-05-08 신설 (4.17)** - 슬롯 위치 % 하한. 가장자리 잘림 방지. |
| `PICK_GRID_CLAMP_MAX_PCT` | 95 | **2026-05-08 신설 (4.17)** - 슬롯 위치 % 상한. |
| `PICK_SLOT_JITTER_RATIO` | 0.5 | **2026-05-08 신설 (4.17)** - 셀 내부 jitter 비율 (±50% 셀 폭/높이). 격자 흔적 약화 (4.16 격자 매핑). 0.3 미만 → 격자 보임 / 0.7 이상 → 인접 셀 충돌 빈번. |
| `PICK_SLOT_SELECTED_Z_BOOST` | 30 | **2026-05-08 신설 (4.17 단계 6 P1 3.1)** - 선택됨 슬롯 z-index 가중. 베이스 jitter z(0~15) + 30 = 30~45 범위. 미선택과의 z 충돌 회피. |

`PICK_GRID_ROWS_DEFAULT` 는 정의 키가 아니라 `Math.ceil(BOX_SIZE / PICK_GRID_COLS_DEFAULT)` 도출. `BOX_SIZE` 가 `PICK_GRID_COLS_DEFAULT` 로 나누어떨어지지 않는 라인업은 마지막 행 부분 채움 (M3 ワンピース 라인업 도입 시 검증).

라인업별 격자 종횡비 override hook (P2 / M3 대비): LINEUP 객체에 `gridCols` 옵셔널 필드 추가. 미정의 시 `PICK_GRID_COLS_DEFAULT` 사용. M2.1 1차에서는 hook만 정의, 활용은 M3.

# 2. 색상 (`src/data/colors.js`)

## 2.1. 등급 색

이찌방쿠지 표준 등급 그라데이션. A등급이 가장 화려, J등급이 가장 차분, Last One은 별도 강조 (등급 표기 정책: `01_spec` 5.2.4).

| 등급 | hex | 의미 |
|---|---|---|
| A | `#D4AF37` | 골드 |
| B | `#C0C0C0` | 실버 |
| C | `#CD7F32` | 브론즈 |
| D | `#E8B4D8` | 핑크 |
| E | `#A78BFA` | 라일락 |
| F | `#60A5FA` | 블루 |
| G | `#34D399` | 민트 |
| H | `#FDE047` | 옐로우 |
| I | `#F97316` | 오렌지 |
| J | `#94A3B8` | 슬레이트 |
| Last One | `#C8102E` | 一番くじ 빨강 (M2 갱신: 브랜드 컬러로 통일) |

## 2.2. UI 색 (M2 Light 테마 재정의)

| 키 | hex | 의미 |
|---|---|---|
| `COLOR_BG_PAPER` | `#FAF7F2` | 종이 배경 (베이지) |
| `COLOR_BG_CARD` | `#FFFFFF` | 카드 배경 |
| `COLOR_BG_ELEVATED` | `#F3EDE0` | 보조 패널 배경 |
| `COLOR_INK_PRIMARY` | `#1F1A14` | 진한 잉크 (제목 / 등급) |
| `COLOR_INK_SECONDARY` | `#4A3F30` | 본문 잉크 |
| `COLOR_INK_MUTED` | `#9C8B78` | 약한 잉크 (보조 텍스트) |
| `COLOR_BORDER_SUBTLE` | `#E8DECF` | 옅은 종이 테두리 |
| `COLOR_FRAME_RED` | `#C8102E` | 一番くじ 브랜드 빨강 |
| `COLOR_FRAME_RED_DARK` | `#A30D24` | **2026-05-08 신설 (4.14.13 단계 6)** - 빨강 보조 (그림자 / 깊이) |
| `COLOR_GOLD_EDGE` | `#C9A961` | 골드 액센트 (Last One / 추정 강조) |
| `COLOR_GOLD_EDGE_SOFT` | `#E5D5A8` | **2026-05-08 신설 (4.14.13 단계 6)** - Last One 행 옅은 골드 틴트 (보더 강조 → 배경 틴트로 표현 변경) |
| `COLOR_RESULT_NORMAL` | `#1F1A14` | 결과 텍스트 (Light) |
| `COLOR_RESULT_LAST_ONE` | `#C8102E` | Last One 강조 |
| `COLOR_RESULT_DC_WIN` | `#2A8C5F` | 채도 낮춘 그린 |
| `COLOR_RESULT_DC_MISS` | `#9C8B78` | 약한 잉크 |
| `COLOR_BADGE_ESTIMATED` | `#C9A961` | 골드 |
| `COLOR_TIER_FALLBACK` | `#9C8B78` | TIER_COLORS fallback |
| `COLOR_TICKET_OUTER_BG` | `#C8102E` | 복권 외부 면 (브랜드 빨강) |
| `COLOR_TICKET_INNER_BG` | `#FAF7F2` | 복권 내부 면 (종이) |
| `COLOR_TICKET_DIM_RGBA` | `"rgba(0, 0, 0, 0.5)"` | 뽑힌 등급 갤러리 딤드 오버레이 |
| `COLOR_GAUGE_BG` | `#E8DECF` | 게이지 배경 |
| `COLOR_GAUGE_FILL` | `#C9A961` | 게이지 채움 (골드) |
| `COLOR_PICK_SLOT_BG` | `#FFFFFF` | **M2.1 (2026-05-08 라이브 정정)** - 잔여 미선택 슬롯 배경 (순백, 종이 모티프). 이전 `#F3EDE0`에서 4.14.14 산개 메타포 강화 시 변경. |
| `COLOR_PICK_SLOT_BG_GRAD` | `"linear-gradient(135deg, #FFFFFF 0%, #FBF6EC 100%)"` | **2026-05-08 신설 (4.14.14 단계 6)** - 슬롯 배경 그라디언트 (종이 깊이감) |
| `COLOR_PICK_SLOT_BORDER` | `#B89B5A` | **M2.1 (2026-05-08 라이브 정정)** - 잔여 미선택 슬롯 테두리 (골드, 약간 어둡게). 이전 `#C9A961`에서 4.14.13 보더 두께 1px 통일 시 변경. |
| `COLOR_PICK_SLOT_HOVER_GLOW` | `"rgba(201, 169, 97, 0.6)"` | **M2.1** - 호버 글로우 (골드 알파) |
| `COLOR_PICK_SLOT_EMPTY_BG` | `#DCD3C2` | **M2.1 (2026-05-08 라이브 정정)** - 뽑힌 슬롯 배경. 이전 `#E8DECF`에서 4.14.14 시 변경 (회색 강도 증가). |
| `COLOR_PICK_SLOT_EMPTY_BORDER` | `#9C8B78` | **M2.1** - 뽑힌 슬롯 테두리 (약한 잉크) |
| `COLOR_PICK_SLOT_SELECTED_BG` | `#FFE9C7` | **M2.1 B-α 신설** - 선택됨 슬롯 배경 (밝은 골드 톤) |
| `COLOR_PICK_SLOT_SELECTED_BORDER` | `#C8102E` | **M2.1 B-α 신설** - 선택됨 슬롯 테두리 (브랜드 빨강 = 강조) |
| `COLOR_TEXT_ON_RED` | `#FFFFFF` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 빨강 배경 위 텍스트 (순백). 다수 호출처 (modal confirm / buy buttons / hero / receive 등) |
| `COLOR_BORDER_LIGHT_GRAY` | `#E5E7EB` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 밝은 회색 보더 (메모리 저장소 안내 등) |
| `COLOR_PAPER_GRAY` | `#D6CFC2` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 종이 회색 (뜯기 카드 외부 / 비활성 상태) |
| `COLOR_PAPER_GRAY_BORDER` | `#B8AE9E` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 종이 회색 테두리 |
| `COLOR_FRAME_RED_DEEPER` | `#8B0820` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 빨강 그라디언트 끝 (frame-red 보다 더 깊은 빨강) |
| `COLOR_GOLD_LIGHT` | `#FFD966` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 호버/강조 노란 골드 |
| `COLOR_NIGHT_GRAD_FROM` | `#1A1A2E` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - DC 패널 어두운 야간 그라디언트 시작 |
| `COLOR_NIGHT_GRAD_TO` | `#2D2A4E` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - DC 패널 어두운 야간 그라디언트 끝 |
| `COLOR_GOLD_DEEP` | `#B89651` | **2026-05-08 신설 (M3 단계 6 P0 2.3)** - 골드 그라디언트 중간 |
| `COLOR_TIER_CLASS_HERO_BG_TINT` | `#FFF8E7` | **M3.2 신설** - hero 카드 배경 옅은 골드 틴트 (5.13.C.2) |
| `COLOR_TIER_CLASS_HERO_GLOW_RGBA` | `"rgba(201, 169, 97, 0.25)"` | **M3.2 신설** - hero 카드 정적 글로우 골드 (HERO_STATIC_GLOW_ALPHA 정합) |
| `COLOR_TIER_CLASS_MAIN_BG_TINT` | `#FFFFFF` | **M3.2 신설** - main 카드 배경 (= bg-card 동일, 시각 무변형) |
| `COLOR_TIER_CLASS_GOODS_BG_TINT` | `#F3EDE0` | **M3.2 신설** - goods 카드 배경 옅은 회색 톤 (= bg-elevated 동일) |

## 2.3. CSS 변수 ↔ JS 상수 매핑 (M3.2 신설, M3 단계 6 P0 2.4 / 2.5 학습 답습)

styles/tokens.css의 CSS 변수와 numbers.js / colors.js 상수의 1:1 매핑. 단계 6 게이트 grep 의무.

### 2.3.1. tier_class 색 토큰 (M3.2 신설)

| CSS 변수 | 매핑 상수 (또는 hex) | 의미 |
|---|---|---|
| `--tier-class-hero-bg-tint` | `COLOR_TIER_CLASS_HERO_BG_TINT` (= `#FFF8E7`) | hero 카드 배경 |
| `--tier-class-hero-glow-rgba` | `COLOR_TIER_CLASS_HERO_GLOW_RGBA` (= `rgba(201, 169, 97, 0.25)`) | hero 카드 정적 글로우 |
| `--tier-class-hero-border` | `COLOR_GOLD_EDGE` (= `#C9A961`, 기존 재사용) | hero 카드 보더 |
| `--tier-class-main-bg-tint` | `COLOR_TIER_CLASS_MAIN_BG_TINT` (= `#FFFFFF`, = `--bg-card`) | main 카드 배경 (무변형) |
| `--tier-class-main-border` | `COLOR_BORDER_SUBTLE` (= `#E8DECF`, 기존 재사용) | main 카드 보더 (= `--border-subtle`) |
| `--tier-class-goods-bg-tint` | `COLOR_TIER_CLASS_GOODS_BG_TINT` (= `#F3EDE0`, = `--bg-elevated`) | goods 카드 배경 |
| `--tier-class-goods-border` | `COLOR_BORDER_SUBTLE` (기존 재사용) | goods 카드 보더 |

### 2.3.2. hero 모션 토큰 (M3.2 신설)

| CSS 변수 | 매핑 상수 | 의미 |
|---|---|---|
| `--motion-hero-pop-peak` | `HERO_POP_SCALE_PEAK` (= `1.18`) | hero reveal transform scale 피크 (1.5) |
| `--motion-hero-glow-ms` | `HERO_GLOW_DURATION_MS` (= `1200ms`) | hero 글로우 펄스 사이클 (1.5) |
| `--hero-static-glow-blur-px` | `HERO_STATIC_GLOW_BLUR_PX` (= `12px`) | hero 카드 정적 글로우 box-shadow blur (1.5) |

### 2.3.3. 단계 6 게이트 grep (03_architecture 5.16, M3.2 신설)

- styles/tokens.css 신규 변수 8종이 모두 본 표에 박제됨.
- src/render/* CSS 셀렉터에서 `var(--tier-class-*)` / `var(--motion-hero-*)` / `var(--hero-static-glow-*)` 사용.
- styles/main.css 인라인 hex / rgba / 수치 0건 (본 토큰 8종 + 기존 토큰 var() 경유 의무).

# 3. 스토리지 (`src/data/storage.js`)

## 3.1. localStorage 키 (M3 다중 라인업 갱신)

`STORAGE_KEY_PREFIX` (1.1 `"kuji_"`) prefix.

**M3 격리 정책 (사용자 결정 8.1 (A1) - 라인업별 prefix 분리)**:
- 라인업별 격리 키 6종은 `kuji_${name}_${lineup_id}` 형식. lineup_id는 1.4 정의값 (예: `ichiban_dragonball_chronicle_2026_05`).
- 전역 키 5종은 라인업과 무관하게 단일 키.

### 3.1.1. 라인업별 격리 키 (M3 신설)

| 키 패턴 | 값 형식 | 의미 |
|---|---|---|
| `kuji_box_round_${lineup_id}` | number | 라인업별 박스 회차 |
| `kuji_box_state_${lineup_id}` | JSON | 라인업별 현재 박스 상태 |
| `kuji_history_${lineup_id}` | JSON array | 라인업별 추첨 이력. 항목 = `{ time, boxId, drawIndex, tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne, pickIndex (M2.1, number \| null), gridIndex (M2.1, number \| null), revealed (M2.1, deprecated B-α) }`. M2.1 B-α: history 항목은 **reveal 시점에만 append** (`revealed` 필드는 항상 true이므로 deprecated). 새로고침 복원은 `kuji_unopened_tickets_${lineup_id}[*].lockedResult` 로 처리. **`pickIndex`** = drawOne 호출 시점의 deck 잔여 인덱스. **`gridIndex`** = 사용자 격자 슬롯 위치. skip ON 시 pickIndex 0 / gridIndex null (M3 6.2.12 흡수 후 0 부여 권고). |
| `kuji_dc_tickets_${lineup_id}` | JSON array | 라인업별 DC 응모권 |
| `kuji_dc_results_${lineup_id}` | JSON array | 라인업별 DC 추첨 결과 |
| `kuji_unopened_tickets_${lineup_id}` | JSON array | 라인업별 미개봉 복권 인벤토리. 항목 = `Ticket = { id, purchasedAt, lockedResult }`. **`lockedResult`** = null (= raw, 등급 미결정) 또는 DrawResult 객체 `{ tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne, lastOnePrize?, pickIndex, gridIndex }`. skip ON 흐름에서는 lockedResult 미사용. |

### 3.1.2. 전역 키 (라인업 무관)

| 키 | 값 형식 | 의미 |
|---|---|---|
| `kuji_seed` | string (32비트) | 현재 시드. **사용자 결정 8.2 (A) = 라인업 공유**. 모든 라인업에서 동일 seed 사용. settings-tab seed 입력 1건. |
| `kuji_settings_skip_pick` | boolean | **M2.1 신설** - 통 선택 단계 skip 토글. 라인업 무관. 기본 `BUY_SKIP_PICK_DEFAULT` (= false) |
| `kuji_meta` | JSON | 메타 (`disclaimerSeen` / `schemaVersion` / `pickHintSeen` (M2.1 신설, boolean. **2026-05-08 deprecated**)) |
| `kuji_current_lineup_id` | string | **M3 신설** - 활성 라인업 ID (1.4.LINEUPS 정합). 부팅 시 미존재면 `LINEUP_DEFAULT_ID` 부여. |
| `kuji_home_acked` | boolean | **M3.1 신설 (`kuji_lobby_acked`) → M4 개명**. 쿠지 홈 진입 완료 플래그. false = 첫 방문 (홈 노출). true = 마지막 라인업 자동 진입. spec 5.13.B (쿠지 홈) 정합. M4 마이그레이션 (3.2.7)에서 구 키 → 신 키 이전. |
| `kuji_schema_version` | number | **M3 신설** - 스키마 버전. v3 이전엔 `kuji_meta.schemaVersion`만 사용. v4부터 별도 키로 분리 (마이그레이션 일관성). M3.1 v5. |

## 3.2. 마이그레이션 정책

3.2.1. `kuji_meta.schemaVersion` 사용 (camelCase, 04_conventions 1.2 정합).
3.2.2. M1(v1) → M2(v2) 마이그레이션: 기존 사용자에게 `kuji_unopened_tickets = []` 초기화 + `schemaVersion = 2` 갱신. 기존 박스 / 이력 보존.
3.2.3. **M2(v2) → M2.1(v3) 마이그레이션**:
- `kuji_settings_skip_pick = BUY_SKIP_PICK_DEFAULT` (= false) 초기화.
- ~~`kuji_meta.pickHintSeen = false` 초기화~~ **2026-05-08 deprecated** - toast 폐기로 키만 보존, 읽지 않음.
- `kuji_history` 기존 항목 backfill: `revealed = true` (이미 화면에 노출된 이력으로 간주), `pickIndex = null` / `gridIndex = null` (M2 시점에는 head pop = `splice(0)` + 통 선택 미사용이므로 인덱스 의미 없음).
- `kuji_unopened_tickets` 기존 항목 backfill: `lockedResult = null` (M2.1 B-α 신설 필드. M2 시점 raw ticket을 raw 그대로 유지 → 새 격자 흐름으로 진입).
- `schemaVersion = 3` 갱신.
- 기존 박스 / DC 응모권 / DC 결과 보존.

3.2.4. **B-α 재정정 in-place 마이그레이션 (M-R4-1 정정, schemaVersion bump 없음)**: M2.1 1차 사이클 (T1~T17) 코드로 이미 v3로 마이그레이션 완료된 사용자의 데이터에서, B-α 재정정 후 `kuji_unopened_tickets[*].lockedResult` 필드가 부재할 수 있음 (이전 코드는 lockedResult 미사용). loadState 시 다음 조건 점검:
- `schemaVersion < 3` → 3.2.3 v2→v3 마이그레이션 (lockedResult: null backfill 포함).
- `schemaVersion === 3` AND `unopenedTickets[i].lockedResult === undefined` → 해당 ticket에 `lockedResult: null` 부여 (in-place backfill, schemaVersion 그대로 유지).
- 본 backfill은 멱등 (이미 lockedResult 정의된 ticket에는 미적용).
- `kuji_history`의 `revealed` 필드는 deprecated되었으나 backfill 보존 (구 데이터 호환).

3.2.5. **M2.1(v3) → M3(v4) 마이그레이션 - 다중 라인업 격리 (M3 신설)**:

기존 v3 사용자는 단일 라인업 (드래곤볼)을 사용했음을 가정. 본 마이그레이션은 단일 라인업 키를 라인업별 격리 키로 이전.

**알고리즘**:
```
DETECTED_LINEUP_ID = LINEUP_DRAGONBALL_ID  // = "ichiban_dragonball_chronicle_2026_05"
// v3 키 6종을 v4 격리 키로 이전. 멱등성 위해 source 키 존재 시에만 실행.
KEYS_TO_MIGRATE = [
  "kuji_history",
  "kuji_unopened_tickets",
  "kuji_box_state",
  "kuji_box_round",
  "kuji_dc_tickets",
  "kuji_dc_results",
]
for key in KEYS_TO_MIGRATE:
  source_value = localStorage.getItem(key)
  if (source_value !== null):
    target_key = `${key}_${DETECTED_LINEUP_ID}`
    localStorage.setItem(target_key, source_value)
    localStorage.removeItem(key)
// 전역 신규 키
localStorage.setItem("kuji_current_lineup_id", DETECTED_LINEUP_ID)
localStorage.setItem("kuji_schema_version", "4")
// 전역 잔존 키 (kuji_seed, kuji_settings_skip_pick, kuji_meta) 보존.
```

**멱등 정합**: `schemaVersion ≥ 4` 또는 `kuji_current_lineup_id` 존재 시 본 마이그레이션 미적용.

**롤백 안전**: 키 이전 도중 실패 시 source 키 일부 잔존 가능. 다음 부팅 시 다시 v3로 인식하여 재시도. **임시 백업 키 미사용** (localStorage 용량 제약 + 마이그레이션 실패 시 사용자 데이터 영구 손실 위험은 키 이전 한 건 단위라 낮음).

**테스트 의무**: `tests/suites/storage_v4.test.js` 신설 (단계 5 T19). 다음 시나리오 검증:
- v3 fixture (단일 라인업 키 6종 + meta v3) → 마이그레이션 후 격리 키 6종 + current_lineup_id + schema_version = 4.
- v4 fixture → 멱등 (변경 0).
- v3 부분 키만 (예: history만 존재) → 부분 이전 정합.
- 전역 키 (seed, skip_pick, meta) 보존 검증.

3.2.6. **M3(v4) → M3.1(v5) 마이그레이션 - 라인업 로비 (M3.1 신설)**:

기존 v4 사용자(이미 라인업을 사용 중)는 로비 재노출 없이 마지막 라인업으로 자동 진입. 첫 방문(빈 storage)만 로비 노출.

**알고리즘**:
```
// 멱등 게이트: schemaVersion ≥ 5 또는 kuji_lobby_acked 키 존재 시 skip
if (schemaVersion >= 5 || localStorage.getItem("kuji_lobby_acked") !== null):
  return  // already migrated

// v4 사용자 추론: kuji_current_lineup_id 존재 = 이미 라인업 사용 중
existingLineupId = localStorage.getItem("kuji_current_lineup_id")
if (existingLineupId !== null):
  // 기존 사용자 → 로비 재노출 안 함
  localStorage.setItem("kuji_lobby_acked", "true")
else:
  // 첫 방문자 또는 v4 미진입 사용자 → 로비 노출
  localStorage.setItem("kuji_lobby_acked", "false")

// schemaVersion bump
localStorage.setItem("kuji_schema_version", "5")
```

**멱등 정합**: `schemaVersion ≥ 5` 또는 `kuji_lobby_acked` 키 존재 시 skip.

**의존성**: 3.2.5 (v3→v4)가 선행. v3 사용자는 v3→v4→v5 순차 적용. loadState() 안에서 schemaVersion 비교로 자동 chain.

**테스트 의무**: `tests/suites/storage_v5.test.js` 신설. 다음 시나리오 검증:
- 빈 storage (첫 방문) → schemaVersion=5 + lobbyAcked=false.
- v4 fixture (currentLineupId 존재) → schemaVersion=5 + lobbyAcked=true (재노출 안 함).
- v3 fixture → v3→v4→v5 chain 적용 후 lobbyAcked=true.
- v5 fixture → 멱등 (변경 0).

3.2.7. **M3.1(v5) → M4(v6) 마이그레이션 - 메뉴 재설계 (M4 신설)**:

```
// 멱등 게이트: schemaVersion ≥ 6 또는 kuji_home_acked 키 존재 시 skip
if (schemaVersion >= 6 || localStorage.getItem("kuji_home_acked") !== null):
  return  // 멱등

// (a) lobby_acked → home_acked 키 개명
const oldAcked = localStorage.getItem("kuji_lobby_acked")
if oldAcked !== null:
  localStorage.setItem("kuji_home_acked", oldAcked)  // 값 그대로 ("true" | "false")
  localStorage.removeItem("kuji_lobby_acked")
else:
  localStorage.setItem("kuji_home_acked", "false")  // 신규 사용자 처리 (첫 진입 강제)

// (b) activeTab 4탭 → 3탭 매핑 (영속 시점 결정 = 단계 4. 미영속이면 본 단계 skip)
const oldActiveTab = localStorage.getItem("kuji_active_tab")
if oldActiveTab !== null:
  // M3.5까지 4탭: "draw" / "history" / "dc" / "settings"
  // M4 3탭: "draw" / "products_history" / "settings"
  const TAB_MAP_M3_TO_M4 = {
    "draw": "draw",
    "history": "products_history",  // history 탭 → 통합 탭
    "dc": "products_history",       // DC 탭 → 통합 탭 sub-section 4
    "settings": "settings"
  }
  const newTab = TAB_MAP_M3_TO_M4[oldActiveTab] || "draw"  // unknown → default
  localStorage.setItem("kuji_active_tab", newTab)

// (c) schemaVersion bump
const meta = JSON.parse(localStorage.getItem("kuji_meta") || "{}")
meta.schemaVersion = 6
localStorage.setItem("kuji_meta", JSON.stringify(meta))
localStorage.setItem("kuji_schema_version", "6")
```

**의존성**: 3.2.6 (v4→v5)가 선행. v4 사용자는 v4→v5→v6 순차 적용. loadState() 안에서 schemaVersion 비교로 자동 chain.

**멱등 정합**: `schemaVersion ≥ 6` 또는 `kuji_home_acked` 키 존재 시 skip.

**테스트 의무**: `tests/suites/storage_v6.test.js` 신설. 다음 시나리오 검증:
- 빈 storage (첫 방문) → schemaVersion=6 + homeAcked=false + (영속 활성 탭 결정 시) activeTab=draw.
- v5 fixture (lobbyAcked=true 존재) → schemaVersion=6 + homeAcked=true + lobby_acked 키 제거.
- v4/v3 fixture → v3→v4→v5→v6 chain 적용 후 homeAcked=true.
- (영속 활성 탭 시) 4탭 fixture (activeTab="history") → 3탭 매핑 ("products_history").
- v6 fixture → 멱등 (변경 0).

# 4. 변경 이력

4.1. 2026-05-02: M1 단계 2 design. placeholder 교체 + 一番くじ ドラゴンボール SSOT.
4.2. 2026-05-02: M1 단계 3 1차 검증 결과 (C1, I상 괄호 복원).
4.3. 2026-05-02: M1 단계 3 2차 검증 결과 (C2-R2-1, "A상" → "A등급").
4.4. 2026-05-02: M1 단계 6 1차 검증 결과 (LINEUP 1.4.5 신설, 1.5 UI 표시 상수).
4.5. 2026-05-02: M1 단계 6 2차 검증 결과 (1.2 PRNG_OUTPUT_DIVISOR / BOX_ID_HEX_LENGTH, 2.2 COLOR_TIER_FALLBACK).
4.6. 2026-05-02: **M2 단계 2 design**. 1.6 구매 옵션 / 1.7 상품 이미지 자산 / 1.8 뜯기 애니메이션 / 1.9 카드 모션 토큰 / 1.10 탭 아이콘 / 1.11 타이포그래피 / 2.2 Light 테마 UI 색 재정의 / Last One 등급 색 빨강 통일 / 3.1 `kuji_unopened_tickets` 추가 / `SCHEMA_VERSION` v2 증가.
4.7. 2026-05-03: **M2.1 단계 2 design**. 1.6 `BUY_SKIP_PICK_DEFAULT` 추가 / 1.4.5 LINEUP `gridCols` hook 추가 (M3 활용) / 1.12 통 선택 상수 신설 (격자 / 호버 / 첫 진입 안내) / 2.2 통 선택 슬롯 색 5종 추가 / 3.1 `kuji_settings_skip_pick` 추가 / 3.2.3 v2→v3 마이그레이션 / `SCHEMA_VERSION` v3 증가.
4.8. 2026-05-03: **M2.1 단계 3 design_review 정정 사이클**. C-4 (3.2.1 `schema_version` → `schemaVersion` 표기 통일) / O-1 (3.1 `kuji_history` 항목 스키마에 `pickIndex` / `revealed` 필드 추가 + 3.2.3 마이그레이션에 history backfill `revealed: true` / `pickIndex: null` 명시) / K-2 (1.9 `PEEL_REVEAL_TO_MODAL_MS` deprecated 표기 강화 + 코드 import 금지 + M3 제거 검토) / I-2 (3.2.3 마이그레이션에 `kuji_meta.pickHintSeen = false` 초기화 추가).
4.9. 2026-05-03: **M2.1 단계 5 implement 발견 정정**. `kuji_history` 항목 스키마에 `gridIndex (number \| null)` 필드 추가 (격자 슬롯 위치 영구 기록 = 새로고침 격자 회색 복원의 SSOT). 단계 4 plan 8.1 정책 ("격자 위치 시각 고정") 구현에 필수. 마이그레이션 3.2.3에 `gridIndex: null` backfill 추가. 단계 3 재검증 생략 (사용자 승인 후 진행).
4.10. 2026-05-03: **M2.1 단계 5 T19 결함 정정 → 단계 2 design B-α 재정정**. (1) 3.1 `kuji_unopened_tickets` 항목 스키마에 `lockedResult` 필드 추가 (null = raw, DrawResult 객체 = 통 선택 확인 시점 결정 + reveal 전 미공개). (2) 2.2 슬롯 색에 `COLOR_PICK_SLOT_SELECTED_BG` / `COLOR_PICK_SLOT_SELECTED_BORDER` 2종 추가 (B-α normal-selected 상태). (3) 3.1 `kuji_history` 항목의 `revealed` 필드 deprecated 표기 (B-α: history는 reveal 시점에만 append → 항상 true). (4) 3.2.3 마이그레이션에 `kuji_unopened_tickets[*].lockedResult = null` backfill 추가. schemaVersion 그대로 v3.
4.11. 2026-05-03: **M2.1 단계 3 round 4 검증 결함 정정**. C-R4-1 (1.12 `PICK_FIRST_HINT_TEXT_KO` 값을 spec 5.14.7.2 본문과 일치 = "N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다."). M-R4-1 (3.2.4 신설 = B-α 재정정 in-place 마이그레이션. 기존 v3 사용자의 unopenedTickets[*].lockedResult 부재 항목에 null 부여, schemaVersion bump 없음, 멱등).
4.12. 2026-05-08: **M3 단계 2 design - 다중 라인업**. (1) 1.1 `SCHEMA_VERSION` v3 → v4 갱신. (2) 1.4 절 전면 재구성: 1.4.0 라인업 구조 명세 신설 / 1.4-DB (드래곤볼) 절번호 시프트 (1.4.1~1.4.5 → 1.4-DB.1~5) + 상수명 prefix `LINEUP_DRAGONBALL_*` 변경 + `assetsBasePath`/`assetsAvailable` 필드 추가 / 1.4-OP (원피스) 신설 (메타 + 9등급 분포 + DC winners 100 + 출처) / 1.4.LINEUPS 배열 + `LINEUP_DEFAULT_ID` + `getLineupById`. (3) 1.7 자산 정책 라인업별 분기: 1.7.0 정책 / 1.7.1-OP 신설 / 1.7.2 자산 형식 정합 / 1.7.3 SVG fallback 신설. (4) 3.1 storage 키 라인업별 격리 (3.1.1) + 전역 (3.1.2) 분리 + `kuji_current_lineup_id` / `kuji_schema_version` 신설. (5) 3.2.5 v3→v4 마이그레이션 알고리즘 + 멱등 + 테스트 의무 (storage_v4.test.js). 사용자 결정 4건 정합 (storage A1 / seed 공유 A / 헤더 라벨 A / SVG fallback A).
4.13. 2026-05-08: **M3.1 단계 2 design - 라인업 로비 + tier_class**. (1) 1.1 `SCHEMA_VERSION` v4 → v5 갱신. (2) 1.4.0 라인업 구조에 `lobbyHeroAssetPath` 필드 + `dc.tierClass` 필수 + `tiers[*].tierClass` 필수 추가. (3) 1.4.A 절 신설 = `TIER_CLASS_VALUES` 3단계 (hero/main/goods) + 검증식 (라인업당 hero/main/goods 각 ≥ 1) + 분류 정책. (4) 1.4-DB.2 / 1.4-OP.2 등급표에 `tierClass` 컬럼 추가 + DB.3 / OP.3 DC에 `_DC_TIER_CLASS = "hero"` 상수 추가 + DB.5 / OP.5 LINEUP 객체에 `dc.tierClass` / `lobbyHeroAssetPath` 매핑. (5) 라인업 추가 절차 8단계로 확장 (4 / 5 = M3.1 신규 항목). (6) 3.1.2 전역 키에 `kuji_lobby_acked` 추가. (7) 3.2.6 v4→v5 마이그레이션 알고리즘 + 멱등 + 테스트 의무 (storage_v5.test.js). 사용자 결정 5건 정합 (전체 화면 view / 드롭다운 quick-switch 유지 / 토글 미도입 / hero 1개 미리보기 / 헤더 라벨 클릭 활성).
4.14. 2026-05-09: **M3.2 단계 2 design - tier_class 시각 적용 (round 1 정정 흡수)**.
4.15. 2026-05-09: **M3.3 단계 2 design - tier_class 갤러리 그룹화 + history 대시보드**. (1) 1.4.A.5 호출처 표 확장 (tier-grid 또는 product-gallery + core/history.tierClassCounts 추가). (2) **1.4.A.6 절 신설** - TIER_CLASS_LABEL_KO 한국어 라벨 ("메인 등급" / "표준 등급" / "굿즈"). (3) 1.5에 HISTORY_DASHBOARD_COLS_MOBILE=2 / HISTORY_DASHBOARD_COLS_TABLET=4 / HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX=768 3종 신설. 사용자 결정 5건 정합 (한국어 라벨 / 2x2 그리드 / hero→main→goods / Last One hero 마지막 / 통합 카운트). (1) 1.4.A.5 절 신설 - `getTierClassForTier(lineup, tier)` 헬퍼 함수 명세 (사용자 결정 9.4). (2) 1.5에 HERO_POP_SCALE_PEAK=1.18 / HERO_GLOW_DURATION_MS=1200 / HERO_STATIC_GLOW_BLUR_PX=12 / HERO_STATIC_GLOW_ALPHA=0.25 4종 신설. (3) 2.2에 COLOR_TIER_CLASS_HERO_BG_TINT / HERO_GLOW_RGBA / MAIN_BG_TINT / GOODS_BG_TINT 4종 신설. (4) **2.3 절 신설** - CSS 변수 ↔ JS 상수 매핑 표 (round 1 P1 3.1 흡수, M3 단계 6 P0 2.4 / 2.5 학습 답습). (5) **round 1 P0 2.1 정정** - "결과 모달" 표현을 "결과 reveal" / 페이지플립 인플레이스 (`peel-card.js`)로 교체 (M2 K-1 정합). 1.4.A.5 호출처 4번째 항목 result-modal.js → peel-card.js. 1.5 HERO_POP/GLOW 의미문 정정. (6) **round 1 P1 3.2 흡수** - spec 5.13.C.3.1에 lookup 주체 = 결과 표시 영역 명기. (7) **round 1 P2 4.1 흡수** - OR 중복 의도 박제 (Last One redundant + lookup 실패 fallback). 사용자 결정 4건 정합 (DC 모달도 hero / minor-row 속성만 / 약한 골드 글로우 / 헬퍼 신설).

4.16. 2026-05-10: **M3.5 단계 2 design - tier_class 라인업별 자율 분류 (원피스 B~F hero)**. (1) 1.4.A.3 검증식 룰 완화: `∃ t2: t2.tierClass === "main"` 룰 제거. main 등급 부재 라인업 허용 ("hero ≥ 1 + goods ≥ 1만 의무"). (2) 1.4.A.4 분류 정책 갱신: 기본 휴리스틱 권고 + 라인업별 자율 분류 명문화 + 원피스/드래곤볼 분류 차이 박제. (3) 1.4-OP.2 등급표 B/C/D/E/F tierClass main → hero 변경 (5건). M3.5 분류 근거 박제 + M3.1 구 분류 근거 폐기 표시. (4) 라인업 추가 절차 7번 항목 갱신 (main ≥ 1 룰 제거). 사용자 결정 5건 정합 (변경 의미 / 포함 범위 / DB 정합 / 검증식 / 라이브 검수 시점). 9등급 → hero 7 (A+B+C+D+E+F+LastOne) + main 0 + goods 3 (G+H+I) 분포. **round 1 P0 정정 (2026-05-10 round 2)**: hero-carousel/minor-row 분기 식이 count 기반이라 시각 자동 정합 미성립 - (b) 분기 식 변경 채택 (round 1 답 = HERO/GOODS). spec 5.13.E.3 영향 매트릭스 + arch 5.18 게이트 + plan 4.8/8.3 정합 갱신. **round 2 P0 재정정 (2026-05-10 round 3)**: round 2 채택 `tierClass===HERO` 분기가 드래곤볼 hero-carousel 6→1 회귀 야기 (비목표 4.1 위반) → `tierClass !== TIER_CLASS_GOODS` 재채택. 드래곤볼/원피스 양쪽 6 등급 동등 노출. spec 5.13.E.3 라인업별 컬럼 명시.

4.17. 2026-05-10: **M4 단계 2 design - 메뉴 재설계 (홈 격상 + 4탭 → 3탭)**. (1) 1.4.B view/탭/dispatch 상수 갱신 + STATE_TAB_VALUES 신설. (2) 1.1 SCHEMA_VERSION 5 → 6. (3) 3.1.2 전역 키 갱신: kuji_lobby_acked → kuji_home_acked 개명 + kuji_active_tab 키 (영속 결정 단계 4) 신설. (4) **3.2.7 v5 → v6 마이그레이션 절 신설** (lobby_acked 키 이전 + 4탭 → 3탭 매핑 + schemaVersion bump). 멱등 게이트 + 의존성 v3→v4→v5→v6 chain + 테스트 의무 (storage_v6.test.js). 사용자 결정 5건 + 단계 1 채택 2건 (10.3/10.4) + **round 2 채택 6건** (10.1/10.2/10.5/10.7 + DC sub-section 4 + history 무한 스크롤 + "홈으로" 라벨). **round 1 P0 3건 정정 (round 2 박제)**: P0-1 currentTab → activeTab 통일 / P0-2 arch 3.11 view/탭 4탭 enum → 3탭 home 갱신 / P0-3 SCHEMA_VERSION + 3.2.7 마이그레이션 절 신설.
