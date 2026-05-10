# M4.2-tidy - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M4.2-tidy |
| 작성일 | 2026-05-10 |
| 단계 | 1 plan |
| 상태 | **사용자 차기 사이클 결정 완료** ("M4.2-tidy 정리 라운드 = 자비스 추천") + 자율 진행 신호 답습 ("다음 진행해" + 전 사이클 답습) |
| 추정 | 1.0~1.5일 (소 사이클, T1~T9 분할) |
| 선행 사이클 | M4.1-home-entry-fix (8단계 종료) + M4-menu-redesign + M3 series 누적 백로그 |
| 명명 정합 | 구 M4.1-tidy 백로그 → M4.1 슬롯 점유 후 M4.2-tidy로 개명 (PROGRESS 12.1.6 박제) |

# 1. 한 줄

M4 / M4.1 사이클로 누적된 dead alias / dead test / spec stale / 매직 문자열 / docs 박제 부정합을 일괄 정리. 코드 동작 변경 0 + storage 마이그레이션 0. M5 메이저 (코토부키야쿠지 30연 천장 룰) 진입 전 결손 누적 회피.

# 2. 트리거

2.1. **사용자 차기 사이클 결정 (2026-05-10)**: 자비스 추천 = M4.2-tidy 정리 라운드 채택.
2.2. **누적 백로그 SSOT** = PROGRESS 11.4 (M4.1-tidy 백로그) + PROGRESS 12.4.1 (M4.1 누적 추가) + 06_impl_review (M4.1 단계 6 P1 2건 + P2 3건).

# 3. 스코프 (in scope)

## 3.1. M4 dead alias 4 파일 폐기

3.1.1. `src/render/lobby.js` - render/home.js re-export → 파일 삭제.
3.1.2. `src/render/lobby-preview.js` - 본 파일은 이미 fs 부재 (확인 완료). 잔존 0건 정합.
3.1.3. `src/core/lobby-preview.js` - core/home-preview.js re-export → 파일 삭제.
3.1.4. `src/render/history-tab.js` - render/products-history-tab.js re-export → 파일 삭제.
3.1.5. `src/render/dc-tab.js` - render/products-history-tab.js re-export → 파일 삭제.

## 3.2. M4.1 dead test 3 파일 폐기

3.2.1. `tests/suites/state_view.test.js` (runner.js 미import, M4.1 = tab_routing.test.js로 자산 흡수) → 파일 삭제.
3.2.2. `tests/suites/lobby_flow.test.js` (runner.js 미import, M4 = home_flow.test.js로 자산 흡수) → 파일 삭제.
3.2.3. `tests/suites/storage_v5.test.js` (runner.js 미import, M4 = storage_v6.test.js로 자산 흡수) → 파일 삭제.

## 3.3. M3 series P2 누적 정리

3.3.1. **M3.1 P2-3 LAST_ONE_TIER_NAME 상수화**: src/core/history.js / home-preview.js / minor-row.js / hero-carousel.js 등에서 `"Last One"` 매직 문자열 잔존. src/data/numbers.js에 `LAST_ONE_TIER_NAME = "Last One"` 상수 신설 + 호출처 일괄 import. core/box.js / last_one.js의 모듈 내 `LAST_ONE_TIER_LABEL` 상수도 numbers.js로 통합.
3.3.2. **M3.3 P2-1 tier-grid.js 처리**: src/render/tier-grid.js + styles/main.css `.tier-grid` 호출처 grep + 사용 중이면 잔존 / 미사용이면 폐기. 단계 2 design에서 결정.
3.3.3. **M3.3 P2-2 "전체" 라벨 / CSS 인라인 px**: render/products-history-tab.js dashboard 카운터 카드의 "전체" 라벨 본문 / CSS 인라인 px 정합. spec 5.13.D.3 정합 박제.
3.3.4. **M3.5 P2-1 spec 5.13.E.3 hero-carousel 비고 표현 미세 부정합**: spec 본문 정정.

## 3.4. M4.1 단계 6 P1 흡수

3.4.1. **P1-1 면책 모달 trigger 키 SSOT 충돌** (08_improve 3.1.1 정합): spec 4.1 / 5.13.B.3.1 = `homeAcked === false → 면책 모달` 표기 vs 코드 = `state.meta.disclaimerSeen` 분기. **자비스 추천 = (a) spec 본문 갱신** (코드 측 변경 부피 작게 + 마이그레이션 비용 0). 정정 = spec 본문에 면책 모달 trigger = `state.meta.disclaimerSeen`로 일관 박제 + home_acked는 라우팅 호환 키 (M3.1 lobbyAcked 개명) + 의미 = 면책 동의 표시는 사용자 발화 직역으로 잔존하지만 trigger는 disclaimerSeen.
3.4.2. **P1-2 arch 5.20 + impl_plan T9 단위 테스트 파일명 stale**: arch 5.20 line 854 `home_flow_m41 / tab_routing` 명시 vs 실제 = `home_flow.test.js` 갱신 + `tab_routing.test.js` 신설. 본문 stale 정정.

## 3.5. M4.1 단계 6 P2 흡수

3.5.1. M4.1 06_impl_review 본문 P2-1 ~ P2-3 (구체는 단계 2 design에서 검토 후 흡수 또는 차기 사이클로 미루기 결정).

## 3.6. 02_data GLOBAL_KEYS 표 보강

3.6.1. PROGRESS 11.4.2 박제 = `02_data GLOBAL_KEYS 표 kuji_active_tab 행 추가`. M4.1에서 GLOBAL_KEYS 객체에 activeTab 신설했으나 02_data 3.1.2 표 본문이 stale 가능. 02_data 3.1.2 + 3.1 본문 정합 검증.

# 4. 비목표 (out of scope) - 별도 사이클

4.1. **lobbyHeroAssetPath → homeHeroAssetPath 키 개명**: storage 영속 v8 마이그레이션 + 02_data 1.4.0 / 1.4-DB.5 / 1.4-OP.5 + spec 5.13.A.6.4 / 5.13.B.4.2 / 5.13.B.7.1 + render/home.js 호출처 grep = 메이저급 부피. 본 사이클 정리 라운드 의미와 충돌. **별도 사이클** (M4.3 또는 M5 흡수)로 미루기.

4.2. **M3 series + M4 + M4.1 라이브 검수 결과 보정**: 사용자 액션 의존. 검수 결함 발견 시 별도 사이클.

4.3. **M5 = 코토부키야쿠지 30연 천장 룰**: 메이저 사이클. 본 사이클 종료 후 진입.

4.4. **CSS 인라인 px → 토큰 일괄 정리**: 본 사이클 3.3.3은 products-history-tab 한정. 전체 src/styles 인라인 px 정리는 별도 사이클.

# 5. T 분할 (의존성 순서)

| # | 태스크 | 변경 파일 | 의존 |
|---|---|---|---|
| T1 | dead 파일 7건 삭제 (lobby.js / core/lobby-preview.js / history-tab.js / dc-tab.js + state_view.test.js / lobby_flow.test.js / storage_v5.test.js) | git rm 7 파일 | 없음 |
| T2 | numbers.js LAST_ONE_TIER_NAME 상수 신설 + box.js / last_one.js 모듈 내 상수 → numbers.js import 일괄 | numbers.js + box.js + last_one.js | T1 |
| T3 | "Last One" 매직 문자열 호출처 일괄 import (history.js / home-preview.js / minor-row.js / hero-carousel.js 등) | core/render 다수 | T2 |
| T4 | tier-grid.js 사용 여부 결정 (단계 2 design) → 폐기 또는 잔존. CSS도 동시 처리 | render/tier-grid.js + styles/main.css | T1 |
| T5 | products-history-tab "전체" 라벨 / CSS 인라인 px 정정 | render/products-history-tab.js + styles | 없음 |
| T6 | spec 5.13.E.3 hero-carousel 비고 표현 정정 | docs/01_spec.md | 없음 |
| T7 | spec 4.1 / 5.13.B.3.1 면책 모달 trigger 키 정정 (M4.1 P1-1 흡수) | docs/01_spec.md | 없음 |
| T8 | arch 5.20 / M4.1 04_impl_plan T9 단위 테스트 파일명 stale 정정 | docs/03_architecture.md + 04_impl_plan.md | 없음 |
| T9 | 02_data 3.1.2 GLOBAL_KEYS 표 kuji_active_tab 행 보강 | docs/02_data.md | 없음 |
| T10 | PROGRESS M4.2 절 신설 | PROGRESS.md | T1~T9 |

# 6. 단계 2 design 결정 영역

## 6.1. tier-grid.js 처리 (T4)

6.1.1. **자비스 추천 = 폐기**. 근거: PROGRESS 11.4.3 / 12.4.1 모두 dead 박제. styles/main.css `.tier-grid` 셀렉터도 함께 폐기.
6.1.2. **단계 2 검증 의무**: src 호출처 grep + main.css 셀렉터 사용처 grep으로 사용 중 여부 검증. 사용 중이면 잔존 + 본 사이클 비목표 박제.

## 6.2. M4.1 P2 3건 흡수 vs 차기 사이클

6.2.1. M4.1 06_impl_review.md 본문 P2-1 ~ P2-3 구체 영향 미파악. 단계 2 design에서 검토 후 결정.

# 7. 영향 매트릭스

## 7.1. 코드 영향

| 파일 | 영향 |
|---|---|
| src/render/lobby.js | 삭제 (T1) |
| src/render/history-tab.js | 삭제 (T1) |
| src/render/dc-tab.js | 삭제 (T1) |
| src/core/lobby-preview.js | 삭제 (T1) |
| src/data/numbers.js | LAST_ONE_TIER_NAME 신설 (T2) |
| src/core/box.js | 모듈 내 상수 → numbers import (T2) |
| src/core/last_one.js | 모듈 내 상수 → numbers import (T2) |
| src/core/history.js | "Last One" → LAST_ONE_TIER_NAME (T3) |
| src/core/home-preview.js | "Last One" → LAST_ONE_TIER_NAME (T3) |
| src/render/minor-row.js | "Last One" → LAST_ONE_TIER_NAME (T3) |
| src/render/hero-carousel.js | "Last One" → LAST_ONE_TIER_NAME (T3) |
| src/render/tier-grid.js | 폐기 또는 잔존 (T4, 단계 2 결정) |
| src/render/products-history-tab.js | "전체" 라벨 / CSS 인라인 px 정정 (T5) |
| styles/main.css | tier-grid 셀렉터 폐기 또는 잔존 (T4) + 인라인 px 토큰 정리 (T5) |
| tests/suites/state_view.test.js | 삭제 (T1) |
| tests/suites/lobby_flow.test.js | 삭제 (T1) |
| tests/suites/storage_v5.test.js | 삭제 (T1) |

## 7.2. 문서 영향

| 문서 | 영향 |
|---|---|
| docs/01_spec.md | 5.13.E.3 표현 (T6) + 4.1 / 5.13.B.3.1 면책 trigger (T7) |
| docs/02_data.md | 3.1.2 GLOBAL_KEYS 표 active_tab 행 (T9) |
| docs/03_architecture.md | 5.20 단위 테스트 파일명 정정 (T8) |
| docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md | T9 명명 stale 정정 (T8) |
| PROGRESS.md | 13절 신설 (T10) |

## 7.3. 테스트 영향

| 테스트 | 영향 |
|---|---|
| storage_v3 ~ v7 | 변경 0 (chain 보존) |
| home_flow / tab_routing / products_history_layout | 변경 0 |
| 신규 단위 테스트 | 0 (정리 라운드 = 코드 동작 변경 0) |

# 8. 추정 분할

| 단계 | 추정 | 비고 |
|---|---|---|
| 1 plan | 0.05일 | 본 문서 |
| 2 design | 0.2일 | tier-grid 결정 + spec 본문 정합 |
| 3 design_review | 0.2일 | round 1 통과 가능 (소 부피) |
| 4 impl_plan | 0.1일 | T 분할 명세 보강 |
| 5 implement | 0.4일 | T1~T9 (dead rm + 매직 문자열 + spec/arch 정정) |
| 6 impl_review | 0.2일 | round 1 통과 가능 |
| 7 QA | 0.1일 | 정적 정합 + 라이브 검수 의무 박제 (M4.1과 동일) |
| 8 improve | 0.1일 | 학습 박제 + PROGRESS 갱신 |

총 = 1.35일 (round 폭증 시 1.7일).

# 9. 차기 사이클 후보

9.1. **M4.3 또는 M5 흡수** = lobbyHeroAssetPath → homeHeroAssetPath 키 개명 (storage v8 마이그레이션 동반).
9.2. **M3 series + M4 + M4.1 + M4.2 라이브 검수 결과 보정** (사용자 액션 의존).
9.3. **M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰** (확장 로드맵 슬롯 보존).

# 10. M4.2 학습 (단계 8 흡수 예정)

10.1. **정리 라운드 사이클의 의미 한정**: "정리 라운드" = 단순 정리 (dead 폐기 + spec stale + 매직 문자열). storage 마이그레이션 / 모듈 책임 변경 / 메이저 부피는 별도 사이클 명시 의무.
10.2. **누적 백로그 일괄 처리 vs 분리**: 본 사이클은 일괄 처리 (M4 / M4.1 / M3 series P2 누적). 사용자 결정 = 추천 채택. 차기 사이클 답습 패턴.

# 11. 사용자 결정 게이트 (단계 1 → 단계 2 진입)

11.1. **단계 2 design 진입 신호** = 본 plan 자율 통과 (사용자 신호 = "다음 진행해" + 답습). 단계 2 design 진입.
11.2. 단계 2 design 결정 영역 (6.1 tier-grid 처리 + 6.2 M4.1 P2 흡수)은 단계 2에서 자비스 추천 박제 + 단계 3 design_review로 검증.
11.3. 단계 3/6 subagent 격리 검증 의무 잔존.
