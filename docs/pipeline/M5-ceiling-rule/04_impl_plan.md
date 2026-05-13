# M5 ceiling-rule + XENOGLOSSIA - 04 impl_plan

| 항목 | 값 |
|---|---|
| 사이클 ID | M5-ceiling-rule |
| 작성일 | 2026-05-13 |
| 단계 | 4 impl_plan |
| 상태 | 자율 진행 ("다음 작업 진행" 답습) |
| 선행 단계 | 단계 3 design_review round 2 통과 (P0=0 / P1=0 / 신규 P2=1 정정 완료) |
| 추정 | 1.5일 (T1~T16) |

# 1. 단계 4 결정

| # | 결정 | 채택 |
|---|---|---|
| 1.1 | 천장 알고리즘 위치 (drawOne 분기 vs core/ceiling.js 신설) | **core/ceiling.js 신설** (CLAUDE.md 4.1 책임 분리 정합) |
| 1.2 | drawWithCeiling fallback = drawOne 반복 | round 2 P0-1 정합 채택 |
| 1.3 | isCeilingApplicable export | 본 사이클 export (render/buy-panel 라벨 시각 분기 용) |
| 1.4 | LINEUPS 배열 순서 | [DRAGONBALL, ONEPIECE, XENOGLOSSIA] (M5 = 3건 추가 순서 답습) |
| 1.5 | SCHEMA_VERSION | **v7 보존** (메커닉 플래그는 lineup 정의로 영속 영향 0) |
| 1.6 | XENOGLOSSIA 자산 = SVG fallback (assetsAvailable=false) | M3.1 답습 |
| 1.7 | 단위 테스트 3 suite 신설 (ceiling / lineup_xenoglossia / mechanic_disable) | 본 사이클 |
| 1.8 | dispatch.buy 천장 분기 위치 = main.js dispatch case | M2 답습 (dispatch.buy 잔존 + 분기만 추가) |

# 2. T 분할 (의존성 순서)

| # | 태스크 | 변경 파일 | 의존 |
|---|---|---|---|
| T1 | numbers.js: LINEUP_XENOGLOSSIA_* 상수 + TIERS_XENOGLOSSIA + LINEUP_XENOGLOSSIA + LINEUPS 갱신 + 라인업별 enabled 플래그 + BUY_QUICK_OPTIONS [1,3,5,10,30] | src/data/numbers.js | 없음 |
| T2 | numbers.js: validateLineup 함수 갱신 (검증식 5~9 신설) | src/data/numbers.js | T1 |
| T3 | data/assets.js: XENOGLOSSIA 자산 매핑 (placeholder SVG fallback) | src/data/assets.js | T1 |
| T4 | core/ceiling.js 신설: drawWithCeiling + isCeilingApplicable | src/core/ceiling.js | T1, T2 |
| T5 | core/last_one.js: lastOnePrize에 lastOneEnabled 분기 가드 | src/core/last_one.js | T1 |
| T6 | core/double_chance.js: addTicket / drawDc에 dcEnabled 분기 가드 (또는 main.js 호출처 가드) | src/core/double_chance.js | T1 |
| T7 | core/draw.js: 마지막 매 추첨 시 lastOneEnabled 분기 | src/core/draw.js | T1 |
| T8 | render/main.js: dispatch.buy에 천장 분기 추가 (count===30 && ceilingEnabled → drawWithCeiling + skip 강제) + addTicket 호출 dcEnabled 분기 + lastOnePrize 호출 lastOneEnabled 분기 | src/render/main.js | T4, T5, T6 |
| T9 | render/buy-panel.js: BUY_QUICK_OPTIONS 30 활성 분기 (박스 매수 ≥ 30) + 천장 활성 라인업 30 라벨 "S賞 확정" 부착 | src/render/buy-panel.js | T1, T4 |
| T10 | render/last-one-row.js + last-one-indicator.js: lineup.lastOneEnabled 분기 (false 시 미렌더) | src/render/last-one-row.js + last-one-indicator.js | T1 |
| T11 | render/products-history-tab.js: DC sub-section dcEnabled 분기 | src/render/products-history-tab.js | T1 |
| T12 | tests/suites/ceiling.test.js 신설 | tests/suites/ceiling.test.js | T4 |
| T13 | tests/suites/lineup_xenoglossia.test.js 신설 | tests/suites/lineup_xenoglossia.test.js | T1, T2 |
| T14 | tests/suites/mechanic_disable.test.js 신설 | tests/suites/mechanic_disable.test.js | T5, T6, T10, T11 |
| T15 | tests/runner.js 신규 suite 등재 | tests/runner.js | T12, T13, T14 |
| T16 | PROGRESS M5 절 신설 | PROGRESS.md | T1~T15 |

# 3. 호출처 grep 매트릭스 (단계 6 게이트 5.21 정합)

| 패턴 | 잔존 허용 위치 | 잔존 0건 의무 위치 |
|---|---|---|
| `lineup\.dc\b` 직접 접근 | dcEnabled === true 분기 후 | 무방어 직접 접근 (src/) 0건 |
| `lineup\.tiers\.find\(.*Last One` | lastOneEnabled === true 분기 후 또는 LAST_ONE_TIER_NAME 경유 | 무방어 0건 |
| `drawWithCeiling\(` | main.js dispatch.buy 1건 | 그 외 0건 |
| `isCeilingApplicable\(` | buy-panel 1건 (옵셔널) | 그 외 0건 |
| `BUY_QUICK_OPTIONS` | numbers.js 정의 + buy-panel 호출 + 테스트 | 매직 [1,3,5,10] 잔존 0건 |
| `LINEUP_XENOGLOSSIA` | numbers.js 정의 + LINEUPS 배열 | 호출처 (data/assets / 테스트) |

# 4. 단계 5 implement 진입 신호

본 plan 자율 통과. T1~T16 순차 진입.

# 5. 단계 4 학습

5.1. **plan 단계에서 결정 영역 enumerable화 의무**: round 1 P0-4 = plan 11.2 결정 영역 누락이 단계 2 design "단계 2 결정" 박제로 흘러간 결과. 차기 메이저 사이클 plan 11에 "사용자 결정 영역 / 자비스 자율 영역 / 단계 후보 영역" 3축 분리 권고 (단계 8 흡수).

5.2. **메이저 부피 흐름 SSOT 갱신 의무**: round 1 P1-1 / P1-2 = arch 4장 흐름 SSOT 결손. 첫 메커닉 분기 사이클이라 답습 없었으나 차기 메커닉 분기(예: 세가 럭키쿠지 잔여 카운터 UI) 진입 시 의무 박제.
