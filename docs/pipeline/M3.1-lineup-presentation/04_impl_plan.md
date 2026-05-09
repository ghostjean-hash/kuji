# M3.1 lineup-presentation - 04 구현 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.1-lineup-presentation |
| 단계 | 4 impl_plan |
| 상태 | 작성 완료, 사용자 승인 대기 |
| 입력 | 01_plan.md (사용자 승인 + 9.1~9.5 결정 박제) / 02_data.md M3.1 갱신분 / 01_spec.md 5.13.B 신설분 / 03_architecture.md M3.1 갱신분 (3.10.M3.1 / 3.17~3.22 / 4.M3.1 / 4.M3.5 / 4.M3.1.B / 5.13~5.15) / 03_design_review.md (P0 0 / P1 1 / P2 6) |

# 1. 한 줄

T1~T9 작업 분할로 단계 5 implement 진행. 단계 3 design_review 이월 8건(P1-1 + P2-1~6 + 단위 테스트 신설)을 본 plan 안에 답으로 박제. 매직 넘버 0개 + core/ DOM 0개 + 단위 테스트 ALL PASS + 단계 6 grep 통과를 단계 5 종료 게이트로.

# 2. design_review 이월 항목 답 (8건)

## 2.1. P1-1. dispatch.enter_lineup 메모리 폐기 분기 (분기 A/B)

03_architecture 3.20 / 4.M3.1.B 매트릭스 정합으로 결정.

- **분기 A (lineupId === state.currentLineupId)**: view 전환만 + 메모리 보존.
- **분기 B (lineupId !== state.currentLineupId)**: 라인업 전환 + 메모리 폐기 + 새 라인업 공간 로드.
- 시나리오 시퀀스 검증: reveal 진행 중 → open_lobby (메모리 보존) → 같은 라인업 카드 → enter_lineup 분기 A → reveal 그대로 이어짐.
- 단위 테스트 (T8 lobby_flow.test.js): 분기 A/B 둘 다 시나리오 시퀀스 검증 의무.

## 2.2. P2-1. 03_architecture M3.1 일괄 갱신

03_architecture 3.11 / 3.17 / 3.18 / 3.19 / 3.20 / 3.21 / 3.22 / 3.10.M3.1 / 4.M3.1 / 4.M3.5 / 4.M3.1.B / 5.13 / 5.14 / 5.15 / 6.8 모두 작성됨. **본 단계 4에서 흡수 완료**.

## 2.3. P2-2. CTA 색 라인업 분기 결정

- 채택: **공통 브랜드 빨강** (`COLOR_FRAME_RED` = `#C8102E`).
- 이유:
  - IP 액센트 토큰 도입은 라인업당 색 정합 영역 확장 = M3 plan 비목표 4.6 (라인업별 등급 색 분리)과 결이 같음.
  - M3.1 plan 비목표 5.13.B.8.x에 IP 액센트는 명시 안 됐으나, 현재 라인업이 BANDAI SPIRITS 단일 운영사 + 一番くじ 브랜드 빨강 통일이 자연스러움.
  - 차기 사이클(라인업 N≥3) 시 IP 액센트 도입 검토.
- spec 5.13.B.4.2 표 6번 행 "또는 브랜드 빨강" 분기를 `COLOR_FRAME_RED` 단일 채택으로 고정.

## 2.4. P2-3. saveState 객체 인자 형식

- 채택: `saveState({ currentLineupId, lobbyAcked: true })` 객체 인자 형식.
- 03_architecture 3.10.M3.1에 명시.
- spec 5.13.B.6.2의 informal 표기는 단계 5 구현 시 객체 인자로 강제.

## 2.5. P2-4. 라인업 추가 절차 SSOT

- 채택: **02_data 8단계가 SSOT**. spec 5.13.A.6은 한국어 자연어 요약으로 유지.
- 단계 5 implement에서 02_data 8단계가 우선. spec과 충돌 시 02_data가 진실 (CLAUDE.md 4.5).
- 별도 spec 동기화 작업 없음 (M3.1 비목표).

## 2.6. P2-5. lobbyAcked 직렬화/역직렬화 정책

- 채택: **string "true" / "false" 영속 + boolean 역직렬화** (M3 SCHEMA_VERSION 패턴 답습).
- 영속: `localStorage.setItem("kuji_lobby_acked", lobbyAcked ? "true" : "false")`.
- 역직렬화: `localStorage.getItem("kuji_lobby_acked") === "true"` (안전 비교, null/missing/기타 값은 false).
- 03_architecture 3.10.M3.1에 명시. 단계 5 구현자는 본 패턴 강제.

## 2.7. P2-6. 첫 방문자 "현재" 배지 분기

- 채택: **lobbyAcked === false 시 모든 카드 isCurrent: false** (= "현재" 배지 미노출).
- 03_architecture 3.21 renderLobbyCard isCurrent 산출식 명시.
- 시나리오 검증 (단계 7 QA): 첫 방문 로비에서 모든 카드가 동등 노출 → 사용자 선택 → 분기 B로 enter_lineup → 마이그레이션 부재 시나리오에서도 정합.

## 2.8. 단위 테스트 신설 (plan 7장 / design_review 7.8)

- T7 tier_class.test.js
- T8 storage_v5.test.js
- T9 lobby_flow.test.js
- 상세 시나리오는 5장 T 분할 표 참조.

# 3. T 분할

| T# | 영역 | 산출물 | 추정 | 의존 |
|---|---|---|---|---|
| T1 | data | numbers.js: TIER_CLASS_* / STATE_VIEW_* / DISPATCH_TYPE_* / LOBBY_GRID_* / LINEUP_*_DC_TIER_CLASS / LINEUP_*_LOBBY_HERO_ASSET_PATH / SCHEMA_VERSION=5 + LINEUP 객체에 tierClass / lobbyHeroAssetPath 매핑 + 검증식(1.4.A.3) 부팅 호출 | 0.3일 | - |
| T2 | data | storage.js: GLOBAL_KEYS.lobbyAcked + loadGlobalSettings에 lobbyAcked 역직렬화 + saveGlobalSettings에 lobbyAcked 직렬화 + migrateV4ToV5 + loadState에서 v4→v5 chain 호출 | 0.3일 | T1 |
| T3 | core | core/lobby-preview.js 신설 - heroPreview(lineup) 구현. tests/suites/lobby_preview.test.js 신설 (heroTiers 필터 / Last One 제외 / 빈 배열 가드) | 0.2일 | T1 |
| T4 | render | render/lobby.js 신설 - renderLobby + renderLobbyCard. CSS Grid 반응형 + isCurrent 분기 + 카드 6요소 + CTA 클릭 → enter_lineup. styles/main.css에 .lobby / .lobby-card 클래스 추가 (디자인 토큰 사용) | 0.4일 | T1, T3 |
| T5 | render+main | render/main.js 갱신 - state 초기화에 view / lobbyAcked 추가 + view 라우팅 (lobby vs main 분기) + 부팅 흐름 4.M3.1 갱신 (lobbyAcked 추론 후 view 결정) + dispatch.open_lobby 분기 추가 + dispatch.enter_lineup 분기 A/B 추가 | 0.4일 | T2, T4 |
| T6 | render | render/header.js 갱신 - 라인업 라벨 클릭 → dispatch.open_lobby + 꺾쇠 아이콘 보강. render/settings-tab.js 갱신 - 'Lineup' 섹션 하단에 "라인업 선택 화면으로" 버튼 추가 → dispatch.open_lobby | 0.2일 | T5 |
| T7 | tests | tests/suites/tier_class.test.js 신설 - 모든 라인업의 모든 tier에 tierClass 존재 / TIER_CLASS_VALUES 외 값 0 / 라인업당 hero/main/goods 각 ≥ 1 / DC.tierClass === hero | 0.2일 | T1 |
| T8 | tests | tests/suites/storage_v5.test.js 신설 - 빈 storage / v4 fixture / v3 fixture chain / v5 fixture 멱등 / lobbyAcked 직렬화 정합 | 0.3일 | T2 |
| T9 | tests | tests/suites/lobby_flow.test.js 신설 - enter_lineup 분기 A(동일 라인업 메모리 보존) / 분기 B(다른 라인업 메모리 폐기) / open_lobby 메모리 보존 / view 라우팅 정합 / lobbyAcked false→true 전이 | 0.3일 | T5, T6 |
| T10 | doc | PROGRESS.md M3.1 단계 5 종료 한 줄 + 03_architecture 6.x 변경 이력에 단계 5 발견 정정 흡수 (있으면) | 0.1일 | T1~T9 |

**합산: 2.7일** (plan Phase 4~6 추정 1.5일 + Phase 7 단계 5 직접 분량 + 검증 round 여유 0.5일).

# 4. 의존성 그래프 (T 단위)

```
T1 (numbers/data) ─┬─> T2 (storage)
                   ├─> T3 (core/preview)
                   ├─> T4 (render/lobby)
                   └─> T7 (tier_class.test)

T2 (storage) ─┬─> T5 (main.js)
              └─> T8 (storage_v5.test)

T3 (core/preview) ─> T4 (render/lobby)
T4 (render/lobby) ─> T5 (main.js)
T5 (main.js)      ─┬─> T6 (header/settings)
                   └─> T9 (lobby_flow.test)
T6 (header/settings) ─> T9
T1~T9 ─> T10 (doc)
```

# 5. 단계 5 종료 게이트 (단계 6 진입 조건)

5.1. 모든 T 완료. PROGRESS.md M3.1 단계 5 진행 항목 클리어.
5.2. tests/test.html 모든 suite ALL PASS (기존 + T7/T8/T9 신설 3개).
5.3. 매직 넘버 0개 (03_architecture 5.15 grep 통과).
5.4. core/ DOM/Canvas/window/document import 0건 (03_architecture 5.2).
5.5. CLAUDE.md 4.1 (게임 로직 / 렌더 분리) 정합. core/lobby-preview.js는 DOM 0건 + lineup 인자만으로 결정론적.
5.6. spec 5.13.B 사양과 코드 1:1 정합 (수동 grep).
5.7. 시나리오 라이브 검수 (단계 7 QA 사전 자비스 self-check):
- 빈 storage 첫 방문 → 면책 → 로비 노출 (모든 카드 동등) → 카드 클릭 → main view 진입.
- v4 fixture (currentLineupId 존재) → 로비 미노출 → 마지막 라인업 main view 자동 진입.
- 헤더 라벨 클릭 → 로비 복귀 → 같은 라인업 카드 → 분기 A (메모리 보존) → reveal 진행 그대로.
- 헤더 라벨 클릭 → 로비 복귀 → 다른 라인업 카드 → 분기 B (메모리 폐기) → 새 라인업 공간 로드.
- 설정 탭 dropdown으로 라인업 변경 → set_current_lineup → 메모리 폐기 + main 유지 (로비 미진입).
- 설정 탭 "라인업 선택 화면으로" 버튼 → 로비 복귀 → 카드 클릭 흐름 동일.

# 6. 단계 6 게이트 (impl_review subagent 격리 검증)

6.1. 03_architecture 5.13~5.15 grep 통과.
6.2. 모든 단위 테스트 ALL PASS.
6.3. spec 5.13.B / 02_data 1.4.A / 03_architecture 3.19~3.22 ↔ src/ 코드 1:1 정합.
6.4. 결정론 회귀 0 (M3 시드 결정론 + B-α 통 선택 결정론 + lobby 진입 흐름은 결정론 영향 0).
6.5. 라이브 시나리오 6건 (5.7) 모두 정합.
6.6. CLAUDE.md 4장 절대 규칙 정합 (4.1 / 4.2 / 4.3 / 4.4).

# 7. 단계 7 QA 사용자 검수 항목 (단계 6 통과 후)

7.1. 첫 방문 시나리오 (storage 비움 후 새로고침). 로비 화면 카드 그리드 시각 검수.
7.2. 라인업 카드 진입 → main view 정합.
7.3. 헤더 라벨 클릭 → 로비 복귀 정합.
7.4. 동일 라인업 재선택 시 reveal/격자 보존 확인.
7.5. 다른 라인업 선택 시 라인업 공간 격리 확인.
7.6. 설정 탭 dropdown / "라인업 선택 화면으로" 버튼 둘 다 동작 확인.
7.7. 모바일 1열 / 태블릿 2열 반응형 확인.
7.8. assetsAvailable=false 라인업의 placeholder gray + IP 라벨 fallback 확인.

# 8. 비목표 / 차기 사이클 후보

8.1. 라인업별 IP 액센트 색 토큰 도입 (M3.1 P2-2 고정으로 보류).
8.2. 본편 화면(추첨/기록/DC)의 tier_class 시각 적용.
8.3. 로비 카드 풍부한 인터랙션 (swipe / 디테일 시트).
8.4. 라인업 추천 / 정렬 (인기순, 발매일순).
8.5. 로비 다국어.
8.6. assets.js의 lobbyHeroAssetPath 라이브 자산 배치 (사용자 외부 작업).

# 9. 리스크 / 완화

| # | 리스크 | 완화 |
|---|---|---|
| 9.1 | view 라우팅 도입으로 main.js 부팅 흐름 정합 깨짐 | T5에서 부팅 흐름 신중 작성 + T9 lobby_flow.test의 빈 storage / v4 fixture / v3 chain 시나리오 검증 |
| 9.2 | enter_lineup 분기 A/B 매트릭스 누락 | T9 단위 테스트가 분기 A/B 둘 다 시나리오 시퀀스 검증 의무 (메모리 보존 vs 폐기 매트릭스) |
| 9.3 | lobbyAcked 직렬화 형식 호환 깨짐 (boolean vs string) | T2 / T8 단위 테스트가 `=== "true"` 비교 시나리오 강제 |
| 9.4 | 첫 방문자 currentLineupId default 부여로 "현재" 배지 부자연 | renderLobbyCard isCurrent 산출식이 lobbyAcked === true 조건 포함 → 첫 방문은 모두 false |
| 9.5 | M2.1처럼 단계 6 정정 라운드 폭증 | 본 plan + 03_architecture 정밀화로 round 1~2 통과 목표. spec/data SSOT 정합 통과 (단계 3 P0 0건) |

# 10. 변경 이력

10.1. 2026-05-08: 초기 작성. 단계 3 design_review 이월 8건 답 박제 (P1-1 + P2-1~6 + 단위 테스트 신설). T1~T10 분할 + 의존성 그래프 + 단계 5/6/7 게이트.
