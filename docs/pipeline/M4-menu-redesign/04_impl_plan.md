# M4 단계 4 impl_plan

| 항목 | 값 |
|---|---|
| 스프린트 ID | M4-menu-redesign |
| 단계 | 4 impl_plan |
| 작성일 | 2026-05-10 |
| 선행 | 단계 3 design_review round 2 통과 (P0=0/P1=0/P2=1 단계 4 결정 영역) |
| 자율 진행 | "권고 진행" 신호 답습. 사용자 승인 게이트 자율 통과 |

# 1. design_review 이월 답 박제

| 결함 | 답 |
|---|---|
| round 1 P0-1 (currentTab vs activeTab) | T1 numbers.js + T3 main.js + T6 호출처 grep |
| round 1 P0-2 (arch 3.11 view/탭 4탭) | T1 numbers.js view/탭 상수 + T3 state 객체 갱신 |
| round 1 P0-3 (SCHEMA_VERSION + 마이그레이션) | T7 storage.js v5→v6 + T8 storage_v6.test.js |
| round 1 P1-2 (결정 게이트 6건) | round 2 박제 흡수, T2/T4/T5에서 구현 |
| round 2 P2-1 (arch 3.17~3.22 lobby 식별자) | 단계 4 결정 = 일괄 개명 채택 (alias 거부) - dead code 잔존 거부 |

# 2. 단계 4 결정 (자비스 권고 채택)

| # | 항목 | 채택 | 사유 |
|---|---|---|---|
| 4.1 | lobby → home 코드 식별자 일괄 개명 vs alias | **일괄 개명** | dead code / alias 잔존 거부. 단계 5에서 grep + 일괄 변경. M3.5 학습 (회귀 테스트 grep 의무) |
| 4.2 | state.activeTab 영속 채택 vs 메모리 잔존 | **메모리 잔존** (M3.5까지 패턴 답습) | 활성 탭 영속 가치 작음 (재방문 시 default = draw 적합). 마이그레이션 부담 ↓. storage v6 (b) 단계 skip |
| 4.3 | render/history-tab.js + render/dc-tab.js 폐기 vs alias | **일괄 폐기** | sub-section으로 자산 이전 후 모듈 자체 dead. M3.5 학습 답습 |
| 4.4 | render/lobby.js → render/home.js 개명 | **개명** | 의미 정합. 단계 5에서 git mv 또는 신규 생성 + 구 폐기 |
| 4.5 | core/lobby-preview.js → core/home-preview.js | **개명** | 의미 정합 |
| 4.6 | dispatch.set_current_lineup 폐기 | **폐기** | enter_lineup으로 통합. 호출처 0건 의무 grep |

# 3. T 분할

| T | 작업 | 파일 | 비고 |
|---|---|---|---|
| T1 | numbers.js view/탭/dispatch 상수 갱신 | src/data/numbers.js | STATE_VIEW_HOME 신설 + STATE_VIEW_LOBBY 폐기 / STATE_TAB_* 3종 신설 / DISPATCH_TYPE_OPEN_HOME / SET_ACTIVE_TAB / SET_CURRENT_LINEUP 폐기. SCHEMA_VERSION 5 → 6 |
| T2 | core/home-preview.js 개명 (lobby-preview.js 폐기) | src/core/home-preview.js | git mv 또는 신규 + 구 폐기. 함수 시그니처 잔존 (heroPreview) |
| T3 | render/main.js state 객체 + 라우팅 + dispatch 핸들러 갱신 | src/render/main.js | view: lobby → home / activeTab 신설 / homeAcked 신설 / dispatch.open_home + set_active_tab + enter_lineup 통합 |
| T4 | render/home.js (구 lobby.js) 갱신 | src/render/home.js | 카드 메타 풍부화 (출시일 + 끝일 + 가격 + 매장 + 진행 상태) + import 갱신 |
| T5 | render/products-history-tab.js 신설 | src/render/products-history-tab.js | sub-section 4 = 대시보드 + 갤러리 + history 리스트 + DC 응모. M3.3 history-tab + product-gallery + M1 dc-tab 자산 흡수 |
| T6 | render/history-tab.js + render/dc-tab.js 폐기 | src/render/history-tab.js (삭제) / src/render/dc-tab.js (삭제) | 자산은 T5로 이전 후 모듈 자체 폐기. main.js import 갱신 |
| T7 | render/header.js + render/tab-bar.js 갱신 | src/render/header.js / tab-bar.js | 헤더 IP 라벨 클릭 = open_home + home view 시 IP 라벨 미렌더 / 4탭 → 3탭 |
| T8 | render/settings-tab.js 갱신 | src/render/settings-tab.js | dropdown quick-switch 폐기 + "홈으로" 버튼 라벨 갱신 |
| T9 | core/storage.js v5 → v6 마이그레이션 | src/core/storage.js | migrateV5ToV6 신설 (lobby_acked → home_acked 키 개명 + schemaVersion bump) + chain 정합 |
| T10 | tests/suites/storage_v6.test.js 신설 | tests/suites/storage_v6.test.js | 02_data 3.2.7 시나리오 모두 검증 |
| T11 | tests/suites/home_flow.test.js 신설 (lobby_flow 자산 흡수) | tests/suites/home_flow.test.js | 첫 진입 home 강제 / acked 후 main / IP 라벨 클릭 home 복귀 / enter_lineup 분기 A/B |
| T12 | tests/suites/products_history_layout.test.js 신설 | tests/suites/products_history_layout.test.js | sub-section 4종 정합 + 빈 history 처리 + DC 응모 통합 |
| T13 | tests/suites/state_view.test.js 신설 (view enum) | tests/suites/state_view.test.js | STATE_VIEW_VALUES / STATE_TAB_VALUES enum 정합 |
| T14 | tests/runner.js 등록 + 폐기 suite 정리 | tests/runner.js | 신설 suite 4종 추가 (storage_v6 / home_flow / products_history_layout / state_view) + lobby_flow.test.js 폐기 (또는 home_flow로 이전) |
| T15 | 호출처 grep + 회귀 정정 | 전체 src/ + tests/ | "lobby" / "currentTab" / "history-tab" / "dc-tab" / "set_current_lineup" / "open_lobby" 잔존 0 의무 |
| T16 | 03_arch 3.17~3.22 절번호 갱신 | docs/03_architecture.md | 단계 4 결정 P2-1 흡수 |
| T17 | PROGRESS M4 절 신설 | PROGRESS.md | 단계 8 직전 신설 |

# 4. 의존성 / 영향 0 영역

| 영역 | 영향 |
|---|---|
| core/draw / core/box | 0 (메뉴 재설계는 render 영역) |
| core/random / hash | 0 |
| 결정론 | 0 (PRNG / drawOne 미변경) |
| storage 데이터 (history / inventory / DC) | 0 (라인업별 격리 잔존) |
| 라인업 데이터 (TIERS_DRAGONBALL / TIERS_ONEPIECE) | 0 (M3.5 분류 잔존) |
| tier_class 시각 (M3.2 / M3.3 / M3.5) | 0 (자산 그대로 활용) |
| 자산 (placeholder webp) | 0 (homeHeroAssetPath 키만 개명, 자산 경로 동일) |

# 5. 단계 5 종료 게이트

5.1. T1~T16 모두 적용 (T17 PROGRESS는 단계 8 흡수).
5.2. tests/test.html 모든 suite ALL PASS.
5.3. arch 5.19 게이트 grep 통과.
5.4. M3 series 라이브 결함 누적 흡수 정합 (단계 7 QA).
5.5. **사용자 라이브 검수 의무** (M4 단독 + M3.1/M3.2/M3.3/M3.5 누적).

# 6. 리스크 / 완화

| # | 리스크 | 완화 |
|---|---|---|
| 6.1 | T15 호출처 grep 누락으로 회귀 (M3.5 학습) | 단계 6 round 1에서 grep 결과 확인 의무 |
| 6.2 | render/products-history-tab.js 신설 시 대시보드 + 갤러리 + 리스트 + DC 통합 시 모듈 비대 | 모듈 내부 sub-render 분리 (renderDashboard / renderGallery / renderList / renderDC) |
| 6.3 | storage 마이그레이션 v3→v4→v5→v6 chain 정합 | T9에서 chain 단위 테스트 의무 |
| 6.4 | M3 series 라이브 결함과 본 사이클 변경 충돌 | 단계 7 QA에서 분리 검수 + M4.1-tidy 또는 M4 후속 보정 |
| 6.5 | 자율 재시도 한도 초과 위험 (단계 6 round 폭증) | M3.5 답습 = 큰 폭 사이클은 round 다중 사용 |

# 7. 변경 이력

7.1. 2026-05-10: 초기 작성. 단계 3 round 2 통과 후 진입. T1~T17 분할 + design_review 이월 답 박제 + 단계 4 결정 6건 (lobby → home 일괄 개명 / activeTab 메모리 잔존 / history+dc 탭 폐기 / 모듈 개명 / set_current_lineup 폐기).
