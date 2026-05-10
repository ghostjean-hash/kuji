# M4.2-tidy - 06 impl_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.2-tidy |
| 단계 | 6 impl_review |
| 검증자 | 격리 subagent (general-purpose) |
| round | 1 |
| 검토 일자 | 2026-05-10 |

# 1. 결과 요약 (P0/P1/P2 건수)

| 등급 | 건수 | 결정 |
|---|---|---|
| P0 | 0 | - |
| P1 | 0 | - |
| P2 | 2 | 차기 사이클 백로그 (단계 7 진입 가능) |
| 통과 | 14 | - |

P0 / P1 결함 0건. **단계 7 QA 진입 가능**. P2 2건은 박제 정합성 미세 영역으로 차기 사이클 흡수 또는 PROGRESS 13.4 차기 사이클 후보로 잔존 가능.

# 2. P0 결함

없음.

# 3. P1 결함

없음.

# 4. P2 결함

## 4.1. P2-1 PROGRESS 13.2.5 T4 호출처 11건 + render/home.js 누락 가설 (사실 박제 정합 문제 없음)

### 4.1.1. 위치

- `/Users/ghostjin/kuji/PROGRESS.md:718` 단계 5 T4 본문.

### 4.1.2. 본문 인용

> T4 분기 식 호출처 11건 일괄 단일화: core/home-preview.js / core/history.js / render/minor-row.js / render/hero-carousel.js / render/peel-card.js (2건) / render/product-gallery.js (4건) / render/product-item.js (3건) / render/last-one-row.js / render/last-one-indicator.js / render/product-detail-modal.js.

### 4.1.3. 결함 의미

본문 11건 = "11 module"인지 "11 분기 식"인지 모호. 실제 grep 결과:
- core/home-preview.js (1) + core/history.js (1) + render/minor-row.js (1) + render/hero-carousel.js (1) + render/peel-card.js (2) + render/product-gallery.js (4) + render/product-item.js (3) + render/last-one-row.js (1) + render/last-one-indicator.js (1) + render/product-detail-modal.js (1) = **16 분기 식**, 10 module.

본문 "11건"은 module 카운트(10) + box.js / last_one.js 제외(별도 T3). 또는 분기 식 카운트(16) 미달. 본 사이클 spec 본문 "11건" 표기는 단계 4 impl_plan T4 본문 답습이고 module 단위로 보면 10 module. 미세 카운트 부정합이지만 코드 동작 / 박제 의미 영향 0. P2 박제.

### 4.1.4. 자비스 추천

차기 사이클 PROGRESS 갱신 시 "11 module (실제 10 module + 16 분기 식)" 정정 또는 표기 단일화.

## 4.2. P2-2 styles/main.css 1632 line 주석에 "tier-grid는 dead 모듈" 박제 잔존

### 4.2.1. 위치

- `/Users/ghostjin/kuji/styles/main.css:1632`

### 4.2.2. 본문 인용

> /* 갤러리 그룹화 (5.13.D.2). M4.2-tidy: tier-grid 셀렉터 폐기 (tier-grid.js 모듈 fs 삭제 정합) */

### 4.2.3. 결함 의미

검토 항목 3.2 (styles/main.css `.tier-grid*` 셀렉터 0건)와 본 항목은 "주석 박제 제외"로 명시되어 있어 본 잔존은 **의도된 박제** (셀렉터 폐기 변경 이력). 본 사이클 단계 5 의도와 정합. P2 박제 = 차기 사이클 정리 시점에 주석 단순화 가능 (M5 진입 시 변경이력 본문 분리).

# 5. 통과 항목

## 5.1. fs 삭제 정합 (검토 항목 1)

| 검증 | 결과 |
|---|---|
| 8 파일 fs 부재 (`ls`) | 통과 (8 파일 모두 No such file or directory) |
| `git status` deleted 확인 | 통과 (D 표시 8건: lobby.js / lobby-preview.js / history-tab.js / dc-tab.js / tier-grid.js + state_view / lobby_flow / storage_v5) |
| dead alias / dead module import 호출처 0건 (src/ tests/) | 통과 (`grep -rn "from.*['\"].*lobby\b\|from.*['\"].*lobby-preview\b\|from.*['\"].*history-tab\b\|from.*['\"].*dc-tab\b\|from.*['\"].*tier-grid\b" src/ tests/` = 0건. main.js의 `from "./products-history-tab.js"` / `from "./home.js"` / tier_class.test.js의 `from "../../src/core/home-preview.js"`만 잔존 = 의도된 정합) |
| tests/runner.js dead test import 0건 | 통과 (lobby_flow / state_view / storage_v5 import 0건 + 폐기 박제 주석만 잔존) |

## 5.2. LAST_ONE_TIER_NAME 일괄 단일화 정합 (검토 항목 2)

| 검증 | 결과 |
|---|---|
| `grep "tier === \"Last One\"\|tier !== \"Last One\"\|\"Last One\" in" src/` | 통과 (0건) |
| numbers.js LAST_ONE_TIER_NAME export | 통과 (line 25, ESM import 시뮬 = `"Last One"` 반환) |
| 호출처 11 module import 정합 | 통과 (core/box / core/last_one / core/history / core/home-preview / render/minor-row / render/hero-carousel / render/peel-card / render/product-gallery / render/product-item / render/last-one-row / render/last-one-indicator / render/product-detail-modal 모두 import 정합) |
| 잔존 "Last One" 매직 문자열 = 데이터 정의 / 표시 라벨 / 자산 키 / 주석 한정 | 통과 (numbers.js 1.4-DB.2 / 1.4-OP.2 tier 라벨 / colors.js 키 / assets.js 키 / last-one-modal.js dataset / last-one-row.js dataset / numbers.js 주석 = 전부 PROGRESS 13.4.3 차기 사이클 백로그 박제) |

## 5.3. tier-grid 폐기 정합 (검토 항목 3)

| 검증 | 결과 |
|---|---|
| src/render/tier-grid.js 부재 | 통과 |
| main.css `.tier-grid*` 셀렉터 0건 | 통과 (주석 1건만 잔존, 의도된 박제) |
| `.product-gallery-section*` 셀렉터 잔존 (line 1633 / 1637 / 1641 / 1650 / 1655 / 1659) | 통과 (실제 사용 중인 호출처 = product-gallery.js) |

## 5.4. spec 본문 정정 정합 (검토 항목 4)

| 검증 | 결과 |
|---|---|
| spec 4.1 (line 93) 면책 trigger = `state.meta.disclaimerSeen` + "homeAcked = true 동시 갱신" 박제 제거 (round 1 P1-1 재정정 흡수) | 통과 |
| spec 4.2 (line 94) 이후 진입 = disclaimerSeen=true | 통과 |
| spec 5.13.B.3.1 (line 311) 첫 방문자 trigger 본문 정정 (round 1 P1-1 재정정 흡수) | 통과 |
| spec 5.13.B.3.2 (line 312) 재방문자 trigger 본문 정정 | 통과 |
| spec 5.13.B.3.3 (line 313) home_acked 의미와 trigger 분리 박제 | 통과 |
| spec 5.13.E.3 시점 표기 단순화 + LAST_ONE_TIER_NAME 식별자 박제 (line 524 / 525) | 통과 |

## 5.5. arch / impl_plan 정합 (검토 항목 5)

| 검증 | 결과 |
|---|---|
| arch 5.20 line 854 home_flow_m41 → home_flow 정정 | 통과 |
| M4.1 04_impl_plan home_flow_m41 잔존 0건 | 통과 (line 37 / 291 / 315 / 318 모두 home_flow로 정정) |
| 변경 이력 잔존 (arch line 864 + 02_data line 959 + arch line 870) | 통과 (변경이력 박제는 의도된 잔존) |

## 5.6. PROGRESS 정합 (검토 항목 6)

| 검증 | 결과 |
|---|---|
| PROGRESS 13절 신설 본문 정합 (13.1 사이클 메타 / 13.2 단계별 산출물 / 13.3 단계 5 정합 검증 / 13.4 차기 사이클 후보 / 13.5 학습) | 통과 |
| 13.4 차기 사이클 후보 박제 (M5 / lobbyHero 개명 / Last One 데이터 정의 단일화 / 라이브 검수) | 통과 (4건 모두 박제) |

## 5.7. 사용자 도메인 정합 (검토 항목 7)

| 검증 | 결과 |
|---|---|
| 코드 동작 변경 0 원칙 정합 | 통과 (분기 식 import 치환만 = `"Last One"` → `LAST_ONE_TIER_NAME` 동일 값. dead 폐기는 호출처 0건 검증 정합으로 동작 영향 0) |
| storage 마이그레이션 0건 (v8 미생성 정합) | 통과 (storage.js diff = M4.1 사이클 산출물 잔존만, M4.2 사이클은 storage.js 변경 0) |
| 단위 테스트 변경 0 (M4.2 사이클 한정) | 통과 (M4.2-tidy 단계 5에서 tests/ 변경 = dead test 3 파일 삭제만 + tests/suites 신규 변경 0) |

## 5.8. 02_data 1.4.A.5 호출처 표 정합 (단계 2 design 흡수)

`/Users/ghostjin/kuji/docs/02_data.md:133`:
> render/product-gallery.js: M3.3 신설 - 갤러리 펼침 시 lineup.tiers를 hero/main/goods 그룹화 (5.13.D.2). M4.2 정정 (M3.3 P2-1 흡수): 본 호출은 product-gallery.js 단독 (tier-grid.js는 M4.2-tidy에서 폐기 = 호출처 0건 검증 완료).

통과. tier-grid 폐기 결정의 호출처 박제 정합.

## 5.9. 02_data 1.4.A.7 LAST_ONE_TIER_NAME 절 신설 정합

`/Users/ghostjin/kuji/docs/02_data.md:157-180`. 키 / 값 / 의미 / 호출처 일괄 / 테스트 영향 0 박제 정합. CLAUDE.md 4.2 (매직 넘버 금지 + numbers.js SSOT) 정합.

# 6. 단계 7 QA 진입 가능 여부

## 6.1. 결정

**진입 가능**. P0 / P1 결함 0건.

## 6.2. P2 2건 처리

P2-1 (PROGRESS 13.2.5 T4 카운트 표기 모호) + P2-2 (main.css 1632 주석 박제) 모두 박제 정합 미세 문제. 코드 동작 / 사용자 도메인 영향 0. **차기 사이클 백로그 잔존 권고** (PROGRESS 13.4에 흡수 또는 M5 진입 시 정리).

## 6.3. 단계 7 QA 사전 조건 박제

- 본 사이클은 코드 동작 변경 0 + storage 마이그레이션 0 + 단위 테스트 변경 0 정합 검증 완료. 단계 7 QA의 정적 정합은 본 검토로 충분.
- **라이브 검수 의무 박제**: 본 사이클은 라이브 검수 미수행. M4 / M4.1 / M4.2 누적 라이브 검수가 차기 사용자 액션 영역 (PROGRESS 13.4.4 박제). 단계 7 QA에서 라이브 검수는 사용자 결정 영역.

# 7. 검토 메모

7.1. 본 사이클은 정리 라운드 의미 (코드 동작 변경 0)에 정합. 분기 식 호출처 import 치환 = 동일 값 상수화 + dead 호출처 0건 검증 + spec stale 정정 + docs 박제만. 코드 동작 / storage 영향 0.

7.2. round 1 design_review P1-1 재정정 ("homeAcked = true 동시 갱신" 박제 제거)이 spec 4.1 / 5.13.B.3.1에 정확히 적용됨. 단계 2 design + 단계 4 impl_plan + 단계 5 implement 흐름 정합.

7.3. round 1 P1-2 (LAST_ONE_TIER_NAME 02_data 정의 박제 누락) = 단계 4에서 흡수 의무였고, 본 단계 5에서 02_data 1.4.A.7 절 신설 + numbers.js export + 11 module import 일괄 정합 모두 통과.

7.4. tier-grid.js 폐기 결정은 plan 6.1 자비스 추천 = "폐기" 채택. src/render/tier-grid.js fs 부재 + main.css `.tier-grid*` 셀렉터 0건 + 02_data 1.4.A.5 호출처 표에서 "tier-grid.js는 M4.2-tidy에서 폐기" 박제. round 1 P2-3 (tier-grid 폐기 결정 spec/arch 박제 누락) 흡수도 02_data 1.4.A.5에 적용됨.

7.5. tests/ staged 변경 일부 (home_flow.test.js / runner.js)는 M4 / M4.1 메이저 사이클의 미커밋 산출물. 본 사이클 M4.2-tidy 한정 단위 테스트 변경 0 정합. 차기 git commit 시 M4.1 + M4.2 누적 커밋 부피 박제 의무.

7.6. PROGRESS 13.2.5 T4 본문 "분기 식 호출처 11건"은 module 카운트 (10) + box.js / last_one.js 제외(T3) 또는 분기 식 카운트 미달 (실제 16건). 미세 표기 부정합이나 코드 / docs 의미 영향 0 = P2.
