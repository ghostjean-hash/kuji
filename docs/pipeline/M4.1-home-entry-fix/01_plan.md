# M4.1 home-entry-fix - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M4.1-home-entry-fix |
| 작성일 | 2026-05-10 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 대기** (자율 진행 신호 = "권장안대로 정석대로 진행" 명시) |
| 추정 | 2.5~3.5일 (설계 0.7 + 검증 0.5 + 구현 1.0 + 검증 0.5 + 정리 0.3) |
| 선행 사이클 | M4-menu-redesign (8단계 종료, 라이브 검수 미수행) |
| 종속 사이클 | M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰 (확장 로드맵 슬롯 보존) |
| 명명 충돌 정리 | M4.1-tidy 백로그 (PROGRESS 11.4) → **M4.2-tidy** 개명 (단계 8 흡수) |

# 1. 한 줄

쿠지 홈을 "재방문 시도 항상 노출되는 1급 entry"로 격상. M4의 `home_acked` 1회 ack 진입 흐름 폐기 + `home view` "전체 화면 탭바 미노출" 모델 폐기. 4탭 환원(홈/추첨/갤러리+기록/설정) + 홈을 첫 탭으로 흡수. M4가 한 사이클만에 보정되는 이유는 "사용자 도메인 인식 정합" 단일 결손.

# 2. 트리거

2.1. **사용자 발화** (2026-05-10): "기본적으로 진입하면 쿠지 홈이 있어야 하고, 내가 원하는 쿠지를 선택해서 게임을 진행하는 방식이어야 해. 근데 쿠지 종류를 선택하는게 너무 어려워."

2.2. **결손 진단**:
- 결손 1 = 재방문 시 홈 미노출. M4 `home_acked === true` 시 마지막 라인업 main view 자동 진입.
- 결손 2 = main view에서 홈 복귀 발견성 낮음. 헤더 IP 라벨 클릭(5.13.B.5.2) + 설정 탭 "홈으로" 버튼만.

2.3. **M4 학습 답습** (PROGRESS 11.5에 미박제, 본 사이클이 트리거): M4 단계 2 design에서 home view를 "전체 화면 탭바 미노출"로 격리한 결정이 사용자 도메인 인식("쿠지 매장에서 시리즈 고르고 들어가기 = 매번 매장에서 시작")과 정합 미달. 자비스 단독 view 모델 결정 사건.

# 3. 사용자 결정 사항 (선행 합의 - 2026-05-10)

| # | 결정 | 선택 | 비고 |
|---|---|---|---|
| 3.1 | 진입 정책 | **재방문 시도 홈 entry** (사용자 발화 명시) | `home_acked` 1회 ack 진입 흐름 폐기 |
| 3.2 | 홈 복귀 경로 강화 (Q1) | **A안 = 하단 탭에 "홈" 탭 신설 (3탭 → 4탭 환원)** | 발견성 최고. M4 view 모델 의미 변경 |
| 3.3 | 사이클 ID (Q2) | **M4.1-home-entry-fix** | M4 진입 정책 보정 사이클. 코토부키야 M5 보존 |
| 3.4 | M4.1-tidy 백로그 명명 충돌 | **M4.2-tidy 개명** | 단계 8에서 PROGRESS 11.4 갱신 |
| 3.5 | 자율 진행 신호 | "권장안대로 정석대로 진행" | 단계 1/4/7 자율 통과. 단계 3/6 subagent 격리 검증 의무 |

# 4. 단계 1 결정 영역 (사용자 승인 게이트 항목)

본 plan 승인 시 자비스 추천을 단계 2 design 진입 시 채택. 사용자가 다른 선택을 명시하면 추천 부정 + 단계 2 진입.

## 4.1. 헤더 IP 라벨 홈 진입 경로 (5.13.B.5.2)

| # | 안 | 트레이드오프 |
|---|---|---|
| 4.1.A | 폐기 (자비스 추천) | 진입점 단일화. 인지 부담 감소. 헤더 = 라벨/보조 정보만 |
| 4.1.B | 잔존 (보조 진입점) | M4 결정 11.4 답습. 진입점 분산 (Q1 C안 단점 재현 위험) |

**[의견] 자비스 추천 = 4.1.A 폐기.** 근거: 하단 탭 홈이 1차 진입점이면 헤더 보조 진입점은 발견성 분산만 일으킴. 헤더 IP 라벨은 "현재 진행 중인 라인업 식별 표시"로만 잔존(클릭 affordance 폐기).

## 4.2. 면책 모달 ack 정책

| # | 안 | 트레이드오프 |
|---|---|---|
| 4.2.A | 1회만 (자비스 추천) | `home_acked` 의미 분리: "면책 동의 표시"로만 잔존, 진입 흐름과 무관. UX 부담 0 |
| 4.2.B | 매 홈 진입 시 | UX 무거움. "쿠지 매장 입장 = 면책" 도메인 정합은 약간 ↑이나 사용자 짜증 위험 |

**[의견] 자비스 추천 = 4.2.A.** 근거: home_acked 키 잔존 + 의미 분리가 storage 마이그레이션 부피 최소(키 보존, 흐름만 분리).

## 4.3. STATE_VIEW 모델 처리

| # | 안 | 트레이드오프 |
|---|---|---|
| 4.3.A | 폐기 (자비스 추천) | view 개념 무의미. activeTab만으로 라우팅. 코드/spec 단순화 |
| 4.3.B | 의미 변경 보존 | `home / main` 의미 보존. 향후 "라인업 미선택 빈 화면" 같은 view가 필요할 때 재활용 가능. 그러나 현재 미사용 |

**[의견] 자비스 추천 = 4.3.A 폐기.** 근거: 본 사이클에서 home = 탭 1로 흡수되면 view 개념이 라우팅 의미를 잃음. STATE_VIEW_* 상수 / 검증 / 마이그레이션 모두 폐기 가능. 미래 빈 화면 view 필요 시 재도입 비용 작음(YAGNI).

# 5. 스코프 (in scope)

## 5.1. 진입 정책 보정

5.1.1. **첫 방문 (`home_acked === false`)**: 면책 모달 dismiss → `home_acked = true` → **홈 탭 자동 활성** (= activeTab = home).
5.1.2. **재방문 (`home_acked === true`)**: 면책 모달 미노출 → **홈 탭 자동 활성** (M4까지는 main view 자동 진입). 마지막 currentLineupId 보존.
5.1.3. `home_acked` 키 의미 변경 = "면책 동의 표시"로만 잔존. 진입 흐름과 분리.
5.1.4. M4 dispatch `open_home` / `enter_lineup` 의미 갱신:
- `enter_lineup`: activeTab = draw로 강제 + currentLineupId 갱신.
- `open_home`: activeTab = home으로 강제 (단순 탭 전환과 동일 의미. 별도 dispatch 잔존 여부 = 단계 4 결정).

## 5.2. 하단 탭 4탭 환원

5.2.1. 탭 구성: **홈 / 추첨 / 갤러리+기록 / 설정**.
5.2.2. 각 탭 식별자:
- `STATE_TAB_HOME = "home"` 신설.
- `STATE_TAB_DRAW = "draw"` 잔존.
- `STATE_TAB_PRODUCTS_HISTORY = "products_history"` 잔존.
- `STATE_TAB_SETTINGS = "settings"` 잔존.
- `STATE_TAB_DEFAULT = STATE_TAB_HOME` (M4 = draw → home으로 변경).
5.2.3. 탭 아이콘 / 라벨 = 단계 2 design 결정. 자비스 후보 = `home_2_filled` / `casino` / `gallery_thumbnail` / `settings`.

## 5.3. view 모델 처리

5.3.1. **STATE_VIEW 폐기 (4.3.A 채택 시)**: STATE_VIEW_HOME / STATE_VIEW_MAIN / STATE_VIEW_VALUES / STATE_VIEW_DEFAULT 모두 폐기. main.js 라우팅 = activeTab만 사용.
5.3.2. **home view 격리 모델 폐기 (5.13.B.2.3)**: "홈 view 시 탭바 미노출 + 본편 컴포넌트 미렌더" 정책 폐기. 홈 = 탭 1 = 탭바 항상 노출 + 헤더 잔존.
5.3.3. **헤더 정책 변경**: 홈 탭에서도 헤더 노출. 헤더 라벨 = (a) 홈 탭 = "쿠지 시뮬레이터" 또는 라인업 라벨(현재 라인업 표시) (b) 다른 탭 = 라인업 라벨. 단계 2 결정.

## 5.4. storage v7 마이그레이션

5.4.1. SCHEMA_VERSION 6 → 7 승격.
5.4.2. `migrateV6ToV7` 신설:
- v6 state.view = "home" / "main" 모두 폐기 (4.3.A 채택 시).
- v6 state.activeTab = "draw" / "products_history" / "settings" → v7 state.activeTab = (기존 값 보존). v7 신 default = "home"이지만 기존 activeTab 값 보존이 정합.
- v6 state.homeAcked 보존 (의미 변경: 면책 동의 표시).
5.4.3. chain v3 → v4 → v5 → v6 → v7 멱등 정합. 각 단독 + chain 모두 통과 의무 (M4 학습 11.5.4 답습).

## 5.5. 헤더 IP 라벨 클릭 처리 (4.1.A 채택 시)

5.5.1. spec 5.13.A.3.2 / 5.13.B.5.2 갱신: 헤더 IP 라벨 = 라벨 표시 전용. 클릭 affordance(꺾쇠 아이콘) 폐기.
5.5.2. dispatch `open_home` 호출처 = (a) 하단 탭 홈 클릭 (b) 설정 탭 "홈으로" 버튼.

## 5.6. 설정 탭 "홈으로" 버튼 처리

5.6.1. **잔존**. 하단 탭이 1차 진입점이지만 설정 탭에 명시 버튼이 있으면 설정 후 즉시 홈 복귀가 자연스러움. UI 중복 부담은 작음.
5.6.2. 단계 2 design 결정으로 폐기 검토 가능.

# 6. 영향 매트릭스

## 6.1. 문서 영향

| 문서 | 영향 |
|---|---|
| `docs/01_spec.md` 4장 view 모델 | view 개념 폐기 또는 의미 변경. 본문 갱신 |
| 5.13.A.3 헤더 IP 라벨 | 클릭 affordance 폐기 (4.1.A 채택 시) |
| 5.13.B 쿠지 홈 | B.2 view 모델 폐기. B.3 진입 흐름 갱신. B.5 진입 경로 갱신. B.6 dispatch 갱신 |
| 5.13.F 통합 탭 (M4 신설) | 4탭 환원으로 sub-section 구성은 보존. 탭 라벨/위치만 갱신 |
| `docs/02_data.md` 1.1 SCHEMA_VERSION | 6 → 7 |
| 1.4.B view/탭/dispatch 상수 | STATE_VIEW 폐기 / STATE_TAB 4탭 / DEFAULT 갱신 |
| 3.1.2 home_acked | 의미 변경 (진입 흐름 무관 → 면책 동의 표시) |
| 3.2.7 마이그레이션 chain | v6 → v7 추가 |
| 4.x 변경 이력 | M4.1 항목 신설 |
| `docs/03_architecture.md` 3.11 state | view 키 폐기. activeTab 4 enum |
| 3.17~3.22 본문 | view 라우팅 폐기. activeTab 라우팅 단순화 |
| 5.x / 6.x 변경 이력 | M4.1 항목 신설 |

## 6.2. 코드 영향

| 파일 | 영향 |
|---|---|
| `src/data/numbers.js` | STATE_VIEW_* 폐기. STATE_TAB_HOME 신설 + DEFAULT 갱신. SCHEMA_VERSION 7. dispatch 의미 갱신 |
| `src/render/main.js` | view 라우팅 폐기. activeTab 라우팅으로 단일화. dispatch case 정리 |
| `src/render/bottom-tabs.js` | 3탭 → 4탭. 탭 아이콘/라벨 추가 |
| `src/render/home.js` | 탭 1 콘텐츠로 흡수. 컨테이너 / 라우팅 정합 갱신 |
| `src/render/header.js` | open_home dispatch 폐기 또는 라벨 전용. 클릭 affordance 폐기 |
| `src/render/settings-tab.js` | "홈으로" 버튼 dispatch 의미 갱신(activeTab 전환) |
| `src/core/storage.js` | migrateV6ToV7 신설. chain 갱신 |
| `src/core/home-preview.js` | 변경 없음 |

## 6.3. 테스트 영향

| 테스트 | 영향 |
|---|---|
| `tests/storage_v6.test.js` | 잔존 (v6 chain 보존) |
| `tests/storage_v7.test.js` 신설 | v6 → v7 멱등 + chain v3 → v7 멱등 |
| `tests/state_view.test.js` | 폐기 또는 갱신 (4.3.A 채택 시 폐기) |
| `tests/home_flow.test.js` | 진입 흐름 케이스 갱신 (재방문 시 홈 탭 자동) |
| `tests/products_history_layout.test.js` | 4탭 환원 영향 (탭 인덱스 갱신) |
| `tests/tab_routing.test.js` 신설 | 4탭 라우팅 시나리오 |
| `tests/runner.js` | 신/구 suite 등재 갱신 |

# 7. 비목표 (out of scope)

7.1. **코토부키야쿠지 30연 천장 룰** = M5 별도 사이클. 첫 메커닉 분기. 본 사이클은 진입 흐름만.
7.2. **라인업 추천 / 정렬** (5.13.B.8.2 답습): N≥3 시점에 검토. 본 사이클은 추가 라인업 신설 없음.
7.3. **M3 series 라이브 검수 결과 보정** = 별도 사이클. 본 사이클 단계 7 QA에서 M4.1 단독 결함 + 누적 라이브 검수 항목만 박제, 보정 작업은 차기 사이클로.
7.4. **카드 swipe / 디테일 시트 / 영상 미리보기**: 5.13.B.8.1 답습.
7.5. **헤더 IP 라벨 외 진입 경로 추가** (햄버거 메뉴 등): 4.1.A 채택 시 하단 탭이 1차, 추가 진입점 신설 없음.

# 8. 추정 분할

| 단계 | 추정 | 비고 |
|---|---|---|
| 1 plan | 0.1일 | 본 문서 |
| 2 design | 0.7일 | spec 4장 / 5.13.A / 5.13.B / 5.13.F 갱신 + 02_data 1.1/1.4.B/3.1.2/3.2.7/4 + arch 3.11/3.17~3.22 |
| 3 design_review | 0.5일 | round 1~2 (M4 답습 = round 폭증 가능) |
| 4 impl_plan | 0.3일 | T1~T12 분할 |
| 5 implement | 1.0일 | T1 numbers / T2 main / T3 bottom-tabs / T4 home / T5 header / T6 settings / T7 storage v7 / T8~T11 테스트 / T12 PROGRESS |
| 6 impl_review | 0.5일 | round 1~2 |
| 7 QA | 0.2일 | 정적 정합 + 라이브 검수 의무 박제 |
| 8 improve | 0.2일 | 학습 박제 + 차기 후보 + M4.1-tidy → M4.2-tidy 개명 |

총 = 3.5일 (round 폭증 시 4.0일).

# 9. 차기 사이클 후보 (단계 8 흡수 시 PROGRESS 갱신)

9.1. **M4.2-tidy** (M4.1-tidy 개명, 누적 백로그):
- M4.1 dead alias 4 파일 git rm (lobby.js / lobby-preview.js / history-tab.js / dc-tab.js).
- storage_v5.test.js / lobby_flow.test.js git rm.
- 02_data GLOBAL_KEYS 표 kuji_active_tab 행 추가.
- M3.1 P2-3 LAST_ONE_TIER_NAME / M3.3 P2-1 tier-grid.js dead / M3.3 P2-2 "전체" 라벨 / CSS 인라인 px / M3.5 P2-1 spec 5.13.E.3 표현.
- 본 사이클 추가 dead 잠재 (state_view.test.js 폐기 시).

9.2. **M3 series 라이브 검수 결과 보정**: M3.1/M3.2/M3.3/M3.5/M4/M4.1 누적 라이브 검수 결과 의존 (사용자 액션 후).

9.3. **M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰**: 첫 메커닉 분기. 확장 로드맵 슬롯 보존.

# 10. 학습 (단계 8 흡수 예정 항목)

10.1. **사용자 도메인 인식 정합 검증 의무**: M4 단계 2 design에서 home view를 "전체 화면 탭바 미노출"로 격리한 결정이 단독 결정. 사용자 도메인 인식("매번 쿠지 매장에서 시작 = 진입 시 홈")을 명시 확인하지 않음. 차기 메이저 사이클 단계 2에서 view / 탭 모델 변경 시 사용자 도메인 인식 명시 확인 의무.

10.2. **1회 ack 흐름 = 진입점 entry 의미와 충돌 답습**: M3.1 결정 9.3 + M4 결정 10.4 = (i) 잔존이 본 사이클에서 폐기됨. 1회 ack 정책은 "면책 / 약관"에는 적합하나 "entry view 진입"에는 부적합. 차기 entry 동선 변경 시 ack 정책 분리 의무.

10.3. **자율 진행 신호 답습 (M3.5 → M4 → M4.1)**: "권장안대로 정석대로" 신호 답습. 단계 1/4/7 자율 통과 + 단계 3/6 subagent 격리 검증 의무 박제. 자비스 단독 결정 금지(CLAUDE.md 7.2)는 본 사이클에서도 단계 1 결정 영역(4.1/4.2/4.3)을 별도 박제 + 사용자 명시 결정 받기 패턴으로 답습.

# 11. 사용자 결정 게이트 (단계 1 → 단계 2 진입)

본 plan 승인 시 자비스 추천(4.1.A / 4.2.A / 4.3.A) 채택 + 단계 2 design 정식 진입. 사용자가 다른 선택을 명시하면 선택 박제 후 단계 2 진입.

11.1. **단계 2 design 진입 신호** = 본 plan 승인 + (선택) 4.1/4.2/4.3 결정 변경 명시.
11.2. 단계 2 산출물 = `docs/01_spec.md` (4장 view / 5.13.A.3 / 5.13.B / 5.13.F) + `docs/02_data.md` (1.1 / 1.4.B / 3.1.2 / 3.2.7 / 4) + `docs/03_architecture.md` (3.11 / 3.17~3.22 / 변경 이력) 본체 갱신. 매직 넘버 0개 정합.
