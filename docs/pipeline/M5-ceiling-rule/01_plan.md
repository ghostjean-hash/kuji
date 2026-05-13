# M5 ceiling-rule + XENOGLOSSIA 라인업 추가 - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M5-ceiling-rule |
| 작성일 | 2026-05-10 |
| 단계 | 1 plan |
| 상태 | 사용자 차기 사이클 결정 = "다음 작업 진행" + 자율 진행 신호 답습 |
| 추정 | 4.0~5.0일 (메이저 사이클, 첫 메커닉 분기 + 라인업 추가) |
| 선행 사이클 | M4.2-tidy (8단계 종료) + M4.1 / M4 / M3 series |

# 1. 한 줄

확장 로드맵 첫 메커닉 분기 진입. **コトブキヤくじ 시스템 = 천장 룰 (30연 S賞 확정) + Last One / Double Chance 미적용**. 라인업 객체에 메커닉 enabled 플래그 신설 + 라인업별 메커닉 다양성 흡수. XENOGLOSSIA 라인업 추가 (research/lineups.json 신뢰도 보존).

# 2. 트리거

2.1. 사용자 차기 사이클 결정 (2026-05-10): "다음 작업 진행".
2.2. 확장 로드맵 슬롯 (CLAUDE.md 1.2): "M5 = コトブキヤくじ XENOGLOSSIA 30연 S賞 확정 (천장 룰)".
2.3. M4.2-tidy 정리 라운드 종료 후 메이저 사이클 진입의 자연스러운 흐름 (PROGRESS 13.4.1).

# 3. 사용자 결정 사항 (선행 합의 - 2026-05-10)

| # | 결정 | 채택 |
|---|---|---|
| 3.1 | 천장 알고리즘 (30연 시 S賞 확정) | **(b) S賞 1매 보장 추출 + 29매 통상** (자비스 추천 채택) |
| 3.2 | last_one / double_chance 라인업별 미적용 정책 | **라인업 객체에 lastOneEnabled / dcEnabled 플래그 신설** (자비스 추천 채택) |

# 4. 자비스 추천 채택 (단계 1 plan 본문 박제 + 단계 1 승인 게이트)

## 4.1. selectable (S/A 종류 선택 UI) = **비목표**

XENOGLOSSIA 등 코토부키야 라인업의 S/A 등급은 사용자가 종류를 선택. 본 사이클 단일 책임 = 천장 룰. selectable UI는 별도 사이클(M5.1 또는 M6) 후보. lineup.tiers.selectable 필드는 데이터 정의에만 잔존.

## 4.2. 30_set 구매 옵션

`BUY_QUICK_OPTIONS = [1, 3, 5, 10, 30]` (M2 = [1,3,5,10] → M5 = 30 추가). render/buy-panel에서 박스 매수 ≥ 30 시만 30 옵션 활성. 다라인업 정합 (드래곤볼 80 / 원피스 80 / XENOGLOSSIA 100 모두 ≥ 30).

## 4.3. lobbyHeroAssetPath 키 개명 = **비목표**

M4.2 백로그(PROGRESS 13.4.2)는 별도 사이클(M5.1 또는 M6) 후보. M5 메이저 부피와 분리.

## 4.4. 배송비 / 가격 산정

배송비(`shipping_jpy_first_only`)는 시뮬레이터 비목표 (실 결제 부재). 30_set 가격(30×850+660 = 26160엔) 표시는 가격 메타 박제만 (구매 패널 표시 무관).

## 4.5. 코토부키야 일반 라인업 (XENOGLOSSIA 외)

본 사이클은 XENOGLOSSIA 단독. 코토부키야쿠지 다른 라인업(메가미데바이스 / 사사이쇼조테이엔 등)은 별도 사이클.

# 5. 스코프 (in scope)

## 5.1. 라인업 객체 메커닉 플래그 신설 (사용자 결정 3.2)

5.1.1. 1.4.0 라인업 구조에 `lastOneEnabled: boolean` / `dcEnabled: boolean` / `ceilingEnabled: boolean` 3종 신설.
5.1.2. 드래곤볼: lastOneEnabled=true / dcEnabled=true / ceilingEnabled=false (M3 답습).
5.1.3. 원피스: 동일 (M3 답습).
5.1.4. XENOGLOSSIA: lastOneEnabled=false / dcEnabled=false / ceilingEnabled=true.
5.1.5. enabled=false 시 lineup 객체에서 dc / Last One 관련 필드 부재 허용 (검증식 갱신).

## 5.2. 천장 룰 메커닉 (사용자 결정 3.1)

5.2.1. **알고리즘 (b)** = 30연 buy 시 박스 deck에서 S 등급 1매 보장 추출 + 29매 통상 splice.
5.2.2. 라인업 객체 신설 필드:
- `ceilingEnabled: boolean` (false / true).
- `ceilingPurchaseSize: number` (= 30).
- `ceilingTier: string` (= "S" - XENOGLOSSIA. 라인업별 가변).
5.2.3. 알고리즘 위치 후보 (단계 2 design 결정):
- 옵션 (i): core/draw.js drawOne 분기 추가 (mode = "ceiling" 인자).
- 옵션 (ii): 신설 core/ceiling.js 별도 모듈.
- 자비스 추천 = (ii) 별도 모듈 (CLAUDE.md 4.1 책임 분리 정합).

## 5.3. 메커닉 분기 (라인업별 enabled 플래그 차지)

5.3.1. core/last_one.js: `lineup.lastOneEnabled === false` 시 lastOnePrize() = null 반환 (또는 throw 미발생). render/last-one-row + last-one-indicator도 미렌더.
5.3.2. core/double_chance.js: `lineup.dcEnabled === false` 시 addTicket / drawDc no-op. render/products-history-tab DC sub-section 미렌더.
5.3.3. core/draw.js 마지막 매 추첨 시 lastOnePrize 자동 지급 = lineup.lastOneEnabled=true 시만.

## 5.4. 구매 옵션 갱신

5.4.1. `BUY_QUICK_OPTIONS = [1, 3, 5, 10, 30]` (M2 = [1,3,5,10] 답습 + 30 추가).
5.4.2. render/buy-panel에서 박스 매수 ≥ 30 시만 30 옵션 활성.
5.4.3. ceilingEnabled=true 라인업의 30연 구매 = 천장 룰 알고리즘 자동 적용.

## 5.5. XENOGLOSSIA 라인업 데이터 추가

5.5.1. 02_data 1.4-XG 절 신설:
- 1.4-XG.1 메타 (id / titleJa/Ko / ip / operator / releaseDate / endDate / outlets / priceJpy / boxSize=100 / boxSizeEstimated=false / homeHeroAssetPath / assetsAvailable=false).
- 1.4-XG.2 등급표 (S/A/B/C/D 5종 + tierClass = hero(S) / main(A) / goods(B/C/D) 추정).
- 1.4-XG.3 천장 룰 메타 (ceilingEnabled=true / ceilingPurchaseSize=30 / ceilingTier=S).
- 1.4-XG.4 출처 (research/lineups.json 5건).
- 1.4-XG.5 LINEUP_XENOGLOSSIA 객체.
5.5.2. LINEUPS 배열에 추가.
5.5.3. 자산 = SVG fallback (assetsAvailable=false). M3.1 답습.
5.5.4. data/assets.js: 라인업별 자산 매핑에 XENOGLOSSIA 추가 (placeholder ID).

## 5.6. tier_class 분류 (M3.1 / M3.5 답습)

5.6.1. XENOGLOSSIA 분류 자비스 추천:
- S = hero (S賞 = 천장 보장 등급)
- A = hero 또는 main (A3 클리어 포스터, 미세)
- B = main (아크릴 스탠드 11종 = 일반 등급 표준)
- C = main 또는 goods (아크릴 참)
- D = goods (캔 배지 50매)
- 단계 2 design에서 사용자 결정 (M3.5 자율 분류 정합).

## 5.7. 검증식 갱신

5.7.1. 1.4.A.3 검증식에 라인업별 enabled 정합 검증 추가:
- ceilingEnabled=true → ceilingPurchaseSize / ceilingTier 필드 존재 의무.
- lastOneEnabled=false → tiers 배열에 "Last One" 항목 부재 허용.
- dcEnabled=false → dc 객체 부재 허용.

5.7.2. 1.4.A.5 호출처 표 갱신 (last_one / dc / ceiling enabled 분기).

## 5.8. 단위 테스트 신설

5.8.1. tests/suites/ceiling.test.js 신설: 30연 천장 룰 (b) 알고리즘 + S 1매 보장 + 결정론.
5.8.2. tests/suites/lineup_xenoglossia.test.js 신설: 라인업 데이터 정합 + 검증식.
5.8.3. tests/suites/mechanic_disable.test.js 신설: lastOneEnabled=false / dcEnabled=false 분기 정합.
5.8.4. 기존 테스트 영향 = 0 (드래곤볼/원피스 enabled=true 보존).

# 6. 비목표 (out of scope)

6.1. selectable (S/A 종류 선택 UI) = 별도 사이클 (4.1 답습).
6.2. lobbyHeroAssetPath → homeHeroAssetPath 키 개명 = M5.1 또는 M6 (4.3 답습).
6.3. 배송비 / 30_set 가격 산정 = 비목표 (4.4 답습).
6.4. 코토부키야 일반 라인업 (XENOGLOSSIA 외) = 별도 사이클 (4.5 답습).
6.5. "Last One" 데이터 정의 / 자산 키 단일화 = M5+ 별도 (M4.2 백로그 13.4.3).
6.6. M3 series + M4 + M4.1 + M4.2 라이브 검수 결과 보정 = 별도 사이클.
6.7. 새 라이센스 자산 (XENOGLOSSIA 라이선스 별도 작업) = 외부 작업 / placeholder 잔존.

# 7. 영향 매트릭스

## 7.1. 문서 영향

| 문서 | 영향 |
|---|---|
| docs/01_spec.md | 5.1 (박스) / 5.4 (Last One enabled 분기) / 5.5 (DC enabled 분기) / 5.9 (구매 30 옵션) / 5.13.A (다중 라인업 추가 절차) / **5.13.X 천장 룰 절 신설** / 6 시나리오 / 7 엣지 / 8 변경이력 |
| docs/02_data.md | 1.1 (SCHEMA_VERSION 잔존 또는 v8 결정 단계 4) / 1.4.0 (enabled 필드 + ceiling 메타 추가) / **1.4-XG 절 신설** / 1.4.A.3 검증식 갱신 / 1.4.A.5 호출처 표 / 1.6 BUY_QUICK_OPTIONS 갱신 / 1.7 자산 매핑 / 4 변경이력 |
| docs/03_architecture.md | 3.4 draw 시그니처 / 3.5 last_one enabled 분기 / 3.6 dc enabled 분기 / **3.X core/ceiling.js 절 신설** / 5.x 게이트 신설 / 6 변경이력 |

## 7.2. 코드 영향

| 파일 | 영향 |
|---|---|
| src/data/numbers.js | LINEUP_XENOGLOSSIA_* 상수 + LINEUP_XENOGLOSSIA 객체 + LINEUPS 배열 / lineup 객체 enabled 필드 / BUY_QUICK_OPTIONS 갱신 |
| src/data/assets.js | XENOGLOSSIA 자산 매핑 (placeholder) |
| src/core/last_one.js | enabled 분기 |
| src/core/double_chance.js | enabled 분기 |
| src/core/draw.js | 라인업 last-1매 추첨 시 enabled 분기 |
| src/core/ceiling.js (신설) | 천장 룰 (b) 알고리즘 |
| src/render/main.js | dispatch.buy 분기 (count=30 + ceilingEnabled) |
| src/render/buy-panel.js | BUY_QUICK_OPTIONS 30 활성 분기 |
| src/render/last-one-row.js | enabled 분기 |
| src/render/last-one-indicator.js | enabled 분기 |
| src/render/products-history-tab.js | DC sub-section enabled 분기 |
| src/render/hero-carousel.js | enabled 분기 (Last One row 미노출 시 minor-row와의 정합) |

## 7.3. 테스트 영향

| 테스트 | 영향 |
|---|---|
| ceiling.test.js | 신설 |
| lineup_xenoglossia.test.js | 신설 |
| mechanic_disable.test.js | 신설 |
| draw.test.js / box.test.js | 영향 0 (enabled=true 잔존 라인업) |
| last_one.test.js | enabled=false 케이스 추가 가능 |
| double_chance.test.js | 동일 |
| storage_v3~v7 | 영향 0 (chain 보존) |
| lineup_isolation / tier_class / lineup_validation | XENOGLOSSIA 케이스 추가 |

## 7.4. CSS / 스타일 영향

7.4.1. last-one 관련 셀렉터 = lineup.lastOneEnabled=false 시 미노출 → CSS 변경 0 (마크업 자체가 미렌더이므로).
7.4.2. 천장 룰 시각 표시 (구매 패널 30 옵션 또는 천장 carousel) = 단계 2 design 결정.

# 8. 추정 분할

| 단계 | 추정 | 비고 |
|---|---|---|
| 1 plan | 0.1일 | 본 문서 |
| 2 design | 0.8일 | spec 5.13.X 신설 + 02_data 1.4-XG / enabled 필드 / 검증식 / arch 3.X / 5.x 게이트 |
| 3 design_review | 0.6일 | round 1~2 (메이저 부피로 폭증 가능) |
| 4 impl_plan | 0.4일 | T1~T12+ 분할 |
| 5 implement | 1.5일 | T1~T12+ (라인업 추가 + 메커닉 분기 + 천장 룰 + 단위 테스트) |
| 6 impl_review | 0.6일 | round 1~2 |
| 7 QA | 0.2일 | 정적 정합 + 라이브 검수 의무 |
| 8 improve | 0.2일 | 학습 박제 + PROGRESS 14절 |

총 = 4.4일 (round 폭증 시 5일).

# 9. 차기 사이클 후보 (M5 종료 후)

9.1. **M5.1 = selectable 종류 선택 UI** (XENOGLOSSIA S/A 등급).
9.2. **M5.2 또는 M6 = lobbyHeroAssetPath → homeHeroAssetPath 키 개명** (storage v8 마이그레이션 동반).
9.3. **M6 = 코토부키야 일반 라인업** (메가미데바이스 / 사사이쇼조테이엔).
9.4. **M5+ = "Last One" 데이터 정의 / 자산 키 단일화**.
9.5. **M3 series ~ M5 라이브 검수 결과 보정** (사용자 액션 의존).

# 10. 학습 후보 (단계 8 흡수 예정)

10.1. **첫 메커닉 분기 사이클 = 라인업별 enabled 플래그 패턴**: 차기 라인업/시스템 추가 시 답습. 새 메커닉 = 라인업 객체 enabled 플래그 + core 모듈 분기 + render 분기 단일화 패턴.

10.2. **확장 로드맵 슬롯 의미 보존**: M5는 원래 코토부키야쿠지 슬롯 (CLAUDE.md 1.2). M3 → M3.5 → M4 → M4.1 → M4.2 → M5로 슬롯 보존 정합.

10.3. **메커닉 분기의 SSOT 단일화**: enabled 플래그를 lineup 객체에 두면 core / render / docs 모두 동일 SSOT 참조. M3.1 tierClass 패턴 답습.

# 11. 사용자 결정 게이트 (단계 1 → 단계 2 진입)

11.1. 본 plan 자율 통과 (사용자 신호 = "다음 작업 진행" + 답습).
11.2. 단계 2 design 결정 영역:
- 5.2.3 천장 알고리즘 위치 (core/draw.js drawOne 분기 vs core/ceiling.js 신설) - 자비스 추천 = 신설.
- 5.6 XENOGLOSSIA tier_class 분류 (S/A/B/C/D) - M3.5 자율 분류 정합.
- 1.4.0 SCHEMA_VERSION v8 신설 vs v7 보존 - enabled 필드는 메모리 only가 아닌 lineup 정의이므로 영속 영향 0 = v7 보존 권고.
11.3. 단계 3/6 subagent 격리 검증 의무 잔존.
