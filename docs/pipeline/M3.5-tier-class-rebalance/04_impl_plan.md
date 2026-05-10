# M3.5 단계 4 impl_plan

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.5-tier-class-rebalance |
| 단계 | 4 impl_plan |
| 작성일 | 2026-05-10 |
| 선행 | 단계 3 design_review round 3 통과 (P0=0 / P1=0 / P2=1 비블로킹) |
| 03_arch 게이트 | 5.14 갱신 + 5.18 신설 + 6.11 변경 이력 (단계 2/3에서 박제 완료) |
| 자율 진행 | "한번에 끝까지 진행" 신호로 사용자 승인 갈음 |

# 1. design_review 이월 답 박제

| 결함 | 답 |
|---|---|
| round 1 P0-1 (분기 식 count 기반) | T2 hero-carousel.js filter `count===1` → tierClass 기반 + T3 minor-row.js filter `count>=2` → tierClass 기반 |
| round 2 P0-1 (드래곤볼 회귀) | T2 분기 식 = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"` (drago/원피스 양쪽 6 등급 동등) |
| round 3 P2-1 (변수명 의미) | T2에서 (b) `CAROUSEL_TIERS`로 개명 채택. 의미 정확. 코드 미세 변경 |

# 2. T 분할

| T | 작업 | 파일 | 비고 |
|---|---|---|---|
| T1 | numbers.js TIERS_ONEPIECE 5건 갱신 + `_validateLineupTierClass` main 룰 제거 | src/data/numbers.js | 02_data 1.4-OP.2 + 1.4.A.3 1:1 정합 |
| T2 | render/hero-carousel.js filter 식 변경 + 변수명 `HERO_TIERS` → `CAROUSEL_TIERS` | src/render/hero-carousel.js | round 3 채택 분기 식 |
| T3 | render/minor-row.js filter 식 변경 (변수명 `MINOR_TIERS` 그대로 유지 - goods 의미 정합) | src/render/minor-row.js | round 1 P0-1 답 |
| T4 | tests/suites/tier_class_lookup.test.js 원피스 B/C/D/E/F → "hero" 갱신 | tests/suites/tier_class_lookup.test.js | 5건 갱신 |
| T5 | tests/suites/tier_class_counts.test.js 원피스 시나리오 hero 카운트 갱신 | tests/suites/tier_class_counts.test.js | 기존 케이스 산출값 정정 |
| T6 | tests/suites/lineup_validation.test.js 신설 | tests/suites/lineup_validation.test.js | main=0 통과 + hero=0/goods=0 throw 케이스 |
| T7 | tests/runner.js 등록 (lineup_validation) | tests/runner.js | suite 1건 추가 |
| T8 | PROGRESS M3.5 절 신설 + design_review/단계 4/단계 5/단계 6/단계 7 산출물 cross-link | PROGRESS.md | 단계 8 직전 신설 |

# 3. T1 numbers.js 상세

## 3.1. TIERS_ONEPIECE 갱신 (5건)

```js
// 변경 전:
{ tier: "B", ... tierClass: TIER_CLASS_MAIN, ... },
{ tier: "C", ... tierClass: TIER_CLASS_MAIN, ... },
{ tier: "D", ... tierClass: TIER_CLASS_MAIN, ... },
{ tier: "E", ... tierClass: TIER_CLASS_MAIN, ... },
{ tier: "F", ... tierClass: TIER_CLASS_MAIN, ... },

// 변경 후:
{ tier: "B", ... tierClass: TIER_CLASS_HERO, ... },
{ tier: "C", ... tierClass: TIER_CLASS_HERO, ... },
{ tier: "D", ... tierClass: TIER_CLASS_HERO, ... },
{ tier: "E", ... tierClass: TIER_CLASS_HERO, ... },
{ tier: "F", ... tierClass: TIER_CLASS_HERO, ... },
```

A / G / H / I / Last One은 변경 0.

## 3.2. `_validateLineupTierClass` main 룰 제거

```js
// 변경 전:
for (const required of TIER_CLASS_VALUES) {
  const hasOne = lineup.tiers.some((t) => t.tierClass === required);
  if (!hasOne) {
    throw new Error(`... tierClass "${required}" 등급 부재. 02_data 1.4.A.3 위반 (각 클래스 ≥ 1 의무).`);
  }
}

// 변경 후:
const REQUIRED_TIER_CLASSES = [TIER_CLASS_HERO, TIER_CLASS_GOODS];  // M3.5: main 룰 폐기
for (const required of REQUIRED_TIER_CLASSES) {
  const hasOne = lineup.tiers.some((t) => t.tierClass === required);
  if (!hasOne) {
    throw new Error(`... tierClass "${required}" 등급 부재. 02_data 1.4.A.3 위반 (hero ≥ 1 + goods ≥ 1 의무).`);
  }
}
```

# 4. T2 hero-carousel.js 상세

## 4.1. filter 식 변경

```js
// 변경 전 (line 13):
const HERO_TIERS = lineup.tiers.filter((t) => t.count === 1 && t.tier !== "Last One");

// 변경 후 (round 3 채택안):
const CAROUSEL_TIERS = lineup.tiers.filter(
  (t) => t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"
);
```

## 4.2. 변수명 변경 영향

`HERO_TIERS` → `CAROUSEL_TIERS` 호출처 grep:
- line 13 정의.
- line 16 `for (const t of HERO_TIERS) drawnByTier[t.tier] = 0;`.
- line 22 `for (const t of HERO_TIERS) { ... }`.

3건 모두 `CAROUSEL_TIERS`로 변경. 의미: "carousel에 노출되는 등급 = goods 아닌 등급". hero+main 모두 포함.

## 4.3. import 추가

`TIER_CLASS_GOODS` 상수 import 의무. `getTierClassForTier` 헬퍼는 line 38에서 이미 사용 중 (data-tier-class 부착)이라 import 잔존.

# 5. T3 minor-row.js 상세

## 5.1. filter 식 변경

```js
// 변경 전 (line 13):
const MINOR_TIERS = lineup.tiers.filter((t) => t.count >= 2 && t.tier !== "Last One");

// 변경 후:
const MINOR_TIERS = lineup.tiers.filter(
  (t) => t.tierClass === TIER_CLASS_GOODS && t.tier !== "Last One"
);
```

## 5.2. 변수명 유지

`MINOR_TIERS` = "minor-row에 노출되는 등급 = goods". 의미 정합. 개명 불요.

## 5.3. import 추가

`TIER_CLASS_GOODS` 상수 import 의무.

# 6. T4 tier_class_lookup.test.js 상세

## 6.1. 갱신 케이스

| 입력 | 변경 전 기대 | 변경 후 기대 |
|---|---|---|
| getTierClassForTier(LINEUP_ONEPIECE, "B") | "main" | "hero" |
| getTierClassForTier(LINEUP_ONEPIECE, "C") | "main" | "hero" |
| getTierClassForTier(LINEUP_ONEPIECE, "D") | "main" | "hero" |
| getTierClassForTier(LINEUP_ONEPIECE, "E") | "main" | "hero" |
| getTierClassForTier(LINEUP_ONEPIECE, "F") | "main" | "hero" |

A / G / H / I / Last One / 드래곤볼 모든 케이스 잔존.

## 6.2. hero 분기 식 시뮬레이션

기존 시뮬레이션 케이스 = 원피스 B/C/D/E/F의 `result.isLastOne || getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO` → false. 변경 후 → true. 본 시뮬레이션 케이스 5건 모두 갱신.

# 7. T5 tier_class_counts.test.js 상세

## 7.1. 갱신 케이스

| 입력 | 변경 전 기대 | 변경 후 기대 |
|---|---|---|
| 원피스 history (A 1 + B 2 + I 5) | hero=1 / main=2 / goods=5 / total=8 | hero=3 / main=0 / goods=5 / total=8 |
| (다른 케이스 추가 권장) 원피스 history (A 1 + F 6 + Last One 1) | hero=2 / main=6 / goods=0 / total=9 | hero=8 / main=0 / goods=0 / total=9 |

드래곤볼 케이스 모두 잔존 (변경 0).

# 8. T6 lineup_validation.test.js 상세 (신설)

## 8.1. 케이스

| # | 케이스 | 기대 |
|---|---|---|
| 8.1.1 | LINEUP_DRAGONBALL (실 데이터) | throw 0 (변경 전과 동일) |
| 8.1.2 | LINEUP_ONEPIECE (M3.5 분류) | throw 0 (main = 0이지만 룰 완화로 통과) |
| 8.1.3 | 가상 라인업 hero=0 | throw + "tierClass \"hero\" 등급 부재" 메시지 |
| 8.1.4 | 가상 라인업 goods=0 | throw + "tierClass \"goods\" 등급 부재" 메시지 |
| 8.1.5 | 가상 라인업 main=0 + hero=1 + goods=1 | throw 0 (M3.5 룰 완화 정합) |
| 8.1.6 | DC.tierClass 잘못된 값 (예: "invalid") | throw 0 검증 함수가 internal 호출이라 직접 노출 어려움. 본 케이스는 비목표 (이미 부팅 시 실행됨) |

## 8.2. 가상 라인업 fixture

```js
const fixtureNoMain = {
  id: "fixture_no_main",
  tiers: [
    { tier: "A", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, ... },
    { tier: "B", count: 1, typeCount: 1, tierClass: TIER_CLASS_GOODS, ... },
    { tier: "Last One", count: 1, typeCount: 1, tierClass: TIER_CLASS_HERO, ... },
  ],
  dc: { tierClass: TIER_CLASS_HERO, ... },
  ...
};
```

`_validateLineupTierClass`는 module 내부 함수라 export 의무 (또는 LINEUPS 배열에 fixture 임시 push 후 재실행 - 결정론 영향 우려). **권고**: T1에서 `validateLineupTierClass` (밑줄 제거) export 추가. test에서 직접 호출. 부팅 시 실행 흐름과 동일 함수.

# 9. T7 runner.js 등록

```js
// tests/runner.js
import "./suites/lineup_validation.test.js";
```

기존 suite 임포트 위치에 추가.

# 10. T8 PROGRESS 신설

PROGRESS.md에 M3.5 절 (9 → 10) 신설:
- 사이클 메타.
- 단계별 산출물 cross-link.
- 단계 5 implement T1~T8 합산.
- 단계 6 P2 처리 결정.
- 차기 사이클 후보 (M3.6 또는 M4 진입).

# 11. 의존성 / 영향 0 영역

| 영역 | 영향 |
|---|---|
| state | 0 (메모리 only / 영속 모두) |
| dispatch | 0 |
| storage | 0 (schemaVersion bump 없음, 마이그레이션 불요) |
| core/draw / core/box | 0 (분기 식은 render 영역) |
| core/history.tierClassCounts | 0 (시그니처 / 알고리즘 변경 0) |
| 결정론 | 0 (PRNG / drawOne 영향 0) |
| 1장 트리 | 신규 모듈 0 |
| 자산 | 0 (이미지 / 자산 base path 변경 0) |
| color / token | 0 (M3.2 토큰 그대로 재사용) |

# 12. 단계 5 종료 게이트 (단계 6 진입 조건)

12.1. T1~T7 모두 적용.
12.2. tests/test.html 모든 suite ALL PASS.
12.3. arch 5.14 + 5.18 게이트 grep 통과.
12.4. 단계 6 impl_review subagent 격리 검증 통과 의무.

# 13. 변경 이력

13.1. 2026-05-10: 초기 작성. 단계 3 round 3 통과 후 진입. T1~T8 분할. 변수명 (b) `CAROUSEL_TIERS` 채택. design_review round 1/2/3 이월 답 박제.
