# M4 menu-redesign - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M4-menu-redesign |
| 작성일 | 2026-05-10 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 완료 (2026-05-10, "권고 진행" 명시)**. 자율 진행 답습. 단계 2 design 진입 |
| 추정 | 4.0~5.0일 (설계 1.5 + 구현 1.5 + 검증 라운드 1.5) |
| 선행 사이클 | M3.1/M3.2/M3.3/M3.5 (자비스 8단계 종료, 라이브 검수 미수행) |
| 종속 사이클 | M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰 (확장 로드맵 원래의 M3, 본 사이클과 분리) |

# 1. 한 줄

쿠지 홈을 진정한 entry로 격상 + 라인업 진입 후 4탭 → 3탭(추첨 / 갤러리+기록 / 설정) 재구성. 사용자 도메인 인식 = "쿠지 홈에서 라인업(쿠지 시리즈) 고르고 → 그 라인업으로 추첨/수집". M3 series 누적 라이브 결함은 본 사이클에서 자연 흡수.

# 2. 사용자 결정 사항 (선행 합의 - 2026-05-10)

| 결정 | 선택 | 비고 |
|---|---|---|
| '상품' 의미 | **라인업 (쿠지 시리즈)** | 도메인 정합. hero 등급 / 피규어 단위 선택은 비목표 |
| 메뉴 구조 변경 범위 | **홈 강화 + 4탭 재설계 (탭 합치기/분리)** | 단일 페이지 / 4탭 잔존은 거부 |
| 4탭 재설계 후보 | **(a) 3탭: 추첨 / 갤러리+기록 / 설정** | 갤러리에 history 대시보드 + 리스트 흡수. 수집 완주감 단일 탭 |
| 사이클 ID | **M4 = 메뉴 재설계 / M5 = 천장 룰 분리** | 메이저 사이클 도메인 분리 |
| M3 라이브 결함 흡수 | **본 사이클 진입 시 누적 흡수** | M3.1/M3.2/M3.3/M3.5 라이브 검수 결함 함께 처리 |

# 3. 스코프 (in scope)

## 3.1. 홈 강화 (M3.1 lobby → M4 home)

3.1.1. **개념 변경**: lobby (보조 진입) → **home (진정한 entry)**. 라인업 N개 카드 그리드 + IP 액센트 + 라인업 메타.

3.1.2. **카드 구성** (단계 2 design에서 결정):
- 라인업 IP 명 + 한국어 라벨.
- hero 미리보기 이미지 (현 lobby-preview 잔존).
- 메타: 출시일 / 끝일 / 매장 / 박스 가격.
- 진행 상태 (선택, 단계 2 결정): 박스 회차 / 추첨 누적 / DC 응모 누적.
- 진입 버튼 / 카드 전체 클릭.

3.1.3. **라인업 N개 그리드 반응형**: 모바일 1열 / 태블릿 2열. 향후 라인업 N≥3 도달 시 자동 정합.

3.1.4. **state.view 모델 잔존**: STATE_VIEW_HOME (구 LOBBY) / STATE_VIEW_MAIN. 키 명만 home으로 개명 검토 (단계 4 결정).

## 3.2. 라인업 진입 후 = 3탭 재구성

3.2.1. **탭 1 추첨 (Draw)**: 현 추첨 탭 그대로. hero-carousel + minor-row + 구매 패널 + 추첨 결과 reveal + DC 모달.

3.2.2. **탭 2 갤러리+기록 (Products & History)** - 신설 통합 탭:
- **상단**: history 대시보드 (M3.3 자산 흡수). 4 카운터 카드 (전체 / hero / main / goods).
- **중단**: 갤러리 그룹 (M3.3 product-gallery 흡수). hero / main / goods 섹션 + 카드.
- **하단**: history 리스트 (M2 history 탭 자산 흡수). 시간순 추첨 이력.
- 단일 탭 내 sub-section 구성. 스크롤 / fold 정책은 단계 2 결정.

3.2.3. **탭 3 설정 (Settings)**: 현 설정 탭. quick-switch dropdown 폐기 검토 (단계 2 결정 - 사용자 결정 9.3).

## 3.3. 헤더 / 네비게이션 재구성

3.3.1. **헤더**: IP 라벨 + 클릭 = 홈 복귀 (M3.1 잔존). 라인업 미선택 (홈) 상태에서는 헤더 표시 0 또는 "쿠지 홈" 라벨.

3.3.2. **하단 탭 바**: 4 → 3 탭. 탭 아이콘 / 라벨 단계 2 결정.

3.3.3. **홈 진입 버튼**: 헤더 IP 라벨 클릭 잔존 + 별도 햄버거 / 홈 아이콘 검토 (단계 2 결정).

## 3.4. 첫 진입 흐름 (lobby_acked 정책)

3.4.1. **현 정책**: 첫 진입 시 lobby_acked=false → lobby 강제. acked 후 main 자동.

3.4.2. **M4 변경 후보** (단계 2 결정):
- (i) 잔존: 첫 진입 강제 + acked 후 main 자동. 헤더 클릭 / 홈 아이콘으로 홈 재방문.
- (ii) 폐기: lobby_acked 폐기 + 매번 home 진입 (사용자 명시 라인업 선택). 직관적이지만 1탭 더 거침.
- (iii) 토글: lobby_acked는 잔존하되 사용자 선호 토글 (설정 탭).

## 3.5. M3 series 라이브 결함 누적 흡수

3.5.1. **흡수 대상**: M3.1 로비 결함 / M3.2 modalSlide / hero scale + rotateY / 보더 transition / M3.3 갤러리 그룹화 / 대시보드 / M3.5 분기 식 결함.

3.5.2. **본 사이클 시점**: 단계 7 QA 사용자 라이브 검수에서 결함 발견 시 단계 8 보정 라운드 또는 M4 후속 정정 사이클로 흡수.

## 3.6. M3.4-tidy 정리 라운드 항목 흡수 (선택)

3.6.1. tier-grid.js dead 모듈 폐기 / LAST_ONE_TIER_NAME 상수화 / storage_v5 v3 chain 시나리오 / "전체" 라벨 / CSS 인라인 px 정책 / spec 5.13.E.3 표현.

3.6.2. **round 2 채택 = 별도 정리 라운드 (M4.1-tidy)**. 본 사이클 큰 폭 + M3 라이브 누적 흡수만으로 부담. 정리 라운드 항목은 M4 종료 후 M4.1-tidy로 분리.

# 4. 비목표 (out of scope)

4.1. M5 천장 룰 (코토부키야쿠지 XENOGLOSSIA 30연) - 별도 사이클.
4.2. 등급별 상품(피규어) 단위 선택 - 도메인 정합 위반 (CLAUDE.md 4.6 사행성 표현 룰 위반 우려).
4.3. 라인업 추천 / 필터 (출시일 / IP) - 라인업 N≥3 도달 후 검토.
4.4. 라인업별 IP 액센트 색 토큰 - M3.1 잔존 비목표. M5+에서 검토.
4.5. assetsAvailable=true 전환 (lobby_hero.webp + placeholder webp) - 사용자 외부 작업.
4.6. PWA / 오프라인 지원 - 별도 사이클.
4.7. 다국어 지원 (i18n) - 한국어 단일 잔존.
4.8. 사용자 계정 / 백엔드 동기화 - localStorage 단독 잔존.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (spec 4장 view 모델 + 5.13.A/B/D 재구성 + 5.14.X 신규 / 02_data 1.4.B view 상수 갱신 / 03_arch 5.X 게이트) | 0.8일 |
| Phase 2 | 단계 3 design_review (subagent 격리, 다중 round 예상 - 큰 변경) | 0.8일 |
| Phase 3 | 단계 4 impl_plan (T 분할 + design_review 이월 답) | 0.4일 |
| Phase 4 | 단계 5 implement Phase A: state.view + 라우팅 + render/home 갱신 | 0.4일 |
| Phase 5 | 단계 5 Phase B: 3탭 재구성 (추첨 잔존 / 갤러리+기록 신규 통합 / 설정 갱신) | 0.6일 |
| Phase 6 | 단계 5 Phase C: 헤더 / 탭 바 / dispatch 갱신 | 0.3일 |
| Phase 7 | 단계 5 Phase D: 단위 테스트 갱신 / 신설 (lobby_flow / history-tab / product-gallery 회귀) | 0.4일 |
| Phase 8 | 단계 6 impl_review + 단계 7 QA + 단계 8 improve | 0.6일 |
| **합산** | | **4.3일** |

# 6. 영향 매트릭스

| 영역 | 변경 후 | 비고 |
|---|---|---|
| state.view | STATE_VIEW_HOME / STATE_VIEW_MAIN (개명 검토) | 단계 4 결정 |
| state.activeTab | 4 → 3 enum 갱신 | 'draw' / 'products_history' / 'settings' |
| dispatch | open_lobby → open_home (개명) / enter_lineup 잔존 / set_active_tab 값 갱신 | M3.1 dispatch 흡수 |
| storage | schemaVersion bump 결정 (단계 2) | 활성 탭 키 / lobby_acked → home_acked 개명 / 마이그레이션 의무 |
| render/home (구 lobby) | 카드 메타 풍부화 | M3.1 자산 흡수 + 메타 추가 |
| render/home-tab (탭 1) | 잔존 (현 draw-tab) | M3.2 hero-carousel/minor-row 잔존 |
| render/products-history-tab (탭 2 신설) | 통합 탭 | M3.3 dashboard + product-gallery + M2 history 리스트 흡수 |
| render/settings-tab | 탭 3, dropdown 폐기 결정 | 단계 2 결정 |
| render/history-tab | 폐기 (탭 2로 흡수) | 모듈 자체 dead → 단계 4에서 폐기 또는 alias |
| render/header | IP 라벨 클릭 잔존 + 홈 아이콘 검토 | 단계 2 결정 |
| render/tab-bar (또는 nav) | 4 → 3 탭 갱신 | 아이콘 변경 |
| core/lobby-preview | 잔존 (홈 카드 hero 미리보기) | 모듈 명 home-preview 개명 검토 |
| 단위 테스트 | lobby_flow + tier_class_counts + 신규 home_flow / products_history_layout | 회귀 위험 ↑ |

# 7. 데이터 흐름 (개념)

## 7.1. 부팅 흐름

```
부팅
  → loadState (storage v5/v6 마이그레이션)
  → state.homeAcked === false → state.view = STATE_VIEW_HOME (강제)
  → state.homeAcked === true → state.view = STATE_VIEW_MAIN
  → render/app
    - view === HOME: render/home (라인업 N개 카드 그리드)
    - view === MAIN: render/header + render/<tab> + render/tab-bar
```

## 7.2. 라인업 전환 흐름

```
사용자: 헤더 IP 라벨 클릭 / 홈 아이콘 클릭
  → dispatch.open_home → state.view = STATE_VIEW_HOME (메모리 보존)
사용자: 홈에서 다른 라인업 카드 클릭
  → dispatch.enter_lineup(newLineupId)
    - 동일 라인업: state.view = MAIN (메모리 보존)
    - 다른 라인업: storage 키 prefix 전환 + 메모리 only state 폐기 + state.view = MAIN
```

## 7.3. 탭 전환 흐름 (3탭)

```
사용자: 하단 탭 클릭 → dispatch.set_active_tab(tab)
  → state.activeTab = tab
  → rerender: render/header + render/<tab>-tab
```

# 8. 검증 / 단위 테스트 추가

8.1. `tests/suites/home_flow.test.js` 신설 (M3.1 lobby_flow.test.js 자산 흡수 + 갱신).
- 첫 진입 home 강제 / acked 후 main / IP 라벨 클릭 home 복귀 / 다른 라인업 진입 메모리 폐기 / 동일 라인업 메모리 보존.

8.2. `tests/suites/products_history_layout.test.js` 신설.
- 통합 탭 sub-section 정합 (대시보드 / 갤러리 / 리스트).
- 빈 history 시 대시보드 / 리스트 표현.
- M3.3 갤러리 그룹화 + 대시보드 회귀 0.

8.3. `tests/suites/state_view.test.js` 신설 (M3.1 view enum 자산 흡수 + 개명 갱신).

8.4. 03_architecture 5.X 게이트 grep:
- state.view ∈ {HOME, MAIN}.
- state.activeTab ∈ {DRAW, PRODUCTS_HISTORY, SETTINGS}.
- dispatch type 매트릭스.
- storage 키 home_acked / 마이그레이션.
- 4탭 dead grep (history-tab.js / 구 dispatch / 탭 라벨 인라인 한국어).

# 9. 의존성 / 리스크

## 9.1. 의존성

9.1.1. M3.1 lobby + tier_class 메타 자산.
9.1.2. M3.2 추첨 탭 hero-carousel/minor-row 잔존.
9.1.3. M3.3 갤러리 그룹화 + 대시보드 자산.
9.1.4. M3.5 tier_class 라인업별 자율 분류 자산.

## 9.2. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 9.2.1 | M3 series 라이브 미수행 + 본 사이클로 누적 채무 폭증 | 단계 7 QA에서 누적 검수 의무화. 결함 발견 시 단계 8 + M4.1 보정 라운드 |
| 9.2.2 | 단계 3 design_review round 폭증 (큰 변경) | 단계 1 plan에서 결정 게이트 5건 박제. 단계 2에서 ASCII mock 다중 박제. 사용자 결정 명시 박제 |
| 9.2.3 | 단계 6 impl_review round 폭증 (회귀 위험 ↑) | 단계 5 implement 시 phase 분할 + 각 phase 종료 시 단위 테스트 PASS 의무 |
| 9.2.4 | render/history-tab.js 폐기 시 잔존 호출처 / 테스트 회귀 | grep 의무 + alias 또는 dead 명시 |
| 9.2.5 | storage 마이그레이션 (v5 → v6) 멱등성 | 단위 테스트 storage_v6 신설 + v5 → v6 chain 시나리오 |
| 9.2.6 | quick-switch dropdown 폐기 시 사용자 멘탈 모델 변경 | 단계 2 결정 게이트 9.3에 박제. UX 검수 의무 |
| 9.2.7 | 4탭 → 3탭 변경 시 사용자 학습 부담 | 라이브 검수에서 발견 시 단계 8 보정 |

# 10. 사용자 결정 게이트 (단계 1 → 단계 2 진입 전 결정)

| # | 항목 | 권고 | 결정 |
|---|---|---|---|
| 10.1 | 홈 카드 메타 풍부도 | 라인업 IP + hero 미리보기 + 메타 (출시일/끝일/매장/가격) + 진행 상태 (박스 회차 / 추첨 누적) | **round 2 채택 = 권고 그대로** (spec 5.13.B.4.2 표 박제) |
| 10.2 | 갤러리+기록 통합 탭 sub-section 순서 | (상단) 대시보드 / (중단) 갤러리 그룹 / (하단) history 리스트 / (4) DC 응모 | **round 2 채택 = 권고 그대로** (spec 5.13.F.2 표 박제). history 리스트 = 무한 스크롤. DC = 별도 sub-section 4 |
| 10.3 | quick-switch dropdown 폐기 vs 잔존 | **폐기 권고** | **단계 1 채택 = 폐기** (사용자 "권고 진행" 명시) |
| 10.4 | 첫 진입 home_acked 정책 | (i) 잔존 / (ii) 폐기 / (iii) 토글 | **단계 1 채택 = (i) 잔존** (사용자 "권고 진행" 명시) |
| 10.5 | M3.4-tidy 정리 라운드 항목 흡수 | **별도 라운드 권고** (본 사이클 큰 폭 + M3 라이브 누적 흡수만으로 부담 ↑) | **round 2 채택 = 별도 라운드 (M4.1-tidy)**. 본 사이클은 메뉴 재설계 + M3 라이브 결함 누적만 |
| 10.6 | state / dispatch / storage 키 명 개명 (lobby → home) | **개명 권고**. M3.1 잔존 명칭이 도메인과 어긋남 | 단계 4 결정 (개명 채택 박제, alias 잔존 vs 일괄 개명 단계 4) |
| 10.7 | 헤더 홈 아이콘 추가 | (i) IP 라벨 클릭만 / (ii) 홈 아이콘 추가 | **round 2 채택 = (i) IP 라벨 클릭만** (메뉴 단순화 정합. 꺾쇠 아이콘 affordance 잔존) |

# 11. 변경 이력

11.1. 2026-05-10: 초기 작성. 사용자 결정 5건 박제 (사이클 ID = M4 / 4탭 → 3탭 (a) / '상품'=라인업 / 메뉴 재설계 + M5 분리 / M3 라이브 누적 흡수). 단계 1 사용자 승인 대기 + 결정 게이트 7건 (10.3 / 10.4 권고 박제, 나머지 단계 2/4 결정).
11.2. 2026-05-10: 사용자 "권고 진행" 명시. 10.3 = quick-switch dropdown 폐기 채택 + 10.4 = (i) home_acked 잔존 채택. 자율 진행 답습 (M3.5 패턴 답습 = 단계 1/4/7 사용자 승인 게이트 자율 통과 / 단계 3/6 subagent 격리 검증 의무 / 자동 재시도 한도 우회). 단계 2 design 진입.
11.3. 2026-05-10: 단계 3 design_review round 1 P0 3건 + P1 4건. round 2 정정 흡수. P0-1 (currentTab vs activeTab 충돌) = spec 4.3 + arch 3.11 활성 탭 키 통일. P0-2 (arch 3.11 view/탭 enum 4탭 잔존) = home/3탭 갱신. P0-3 (SCHEMA_VERSION + v5→v6 마이그레이션 미박제) = 02_data 1.1 v6 + 3.2.7 절 신설 + 3.1.2 home_acked 키 + active_tab 키 신설. 단계 2 결정 게이트 6건 채택 박제 (10.1/10.2 권고 / 10.5 별도 라운드 / 10.7 IP 라벨 클릭만 / DC = sub-section 4 / history = 무한 스크롤 / "홈으로" 라벨).
