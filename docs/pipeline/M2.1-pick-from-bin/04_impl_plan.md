# M2.1 pick-from-bin - 04 impl_plan

| 항목 | 값 |
|---|---|
| 스프린트 ID | M2.1-pick-from-bin |
| 단계 | 4 impl_plan |
| 작성일 | 2026-05-03 |
| 상태 | 작성 완료, 사용자 승인 대기 |
| 추정 | 약 1.0일 (M2.1 plan 7장 단계 5 마일스톤) |

# 1. 한 줄

01_spec 5.14 통 선택 메커닉을 src/ 코드로 구현. core/draw 시그니처 + history 신규 함수 + render 3개 신규 모듈 + storage v3 마이그레이션 + 기존 4개 모듈 갱신 + 단위 테스트 2개 신설. **OP-2 / 6.2.2 / 6.2.3 학습 흡수**.

# 2. 모듈 분해 (03_architecture 갱신 반영)

## 2.1. 신규 모듈 (5개)

| 파일 | 책임 |
|---|---|
| `src/render/pick-panel.js` | 통(bin) 슬롯 격자 컨테이너. 4장 6.b1 분기에서 호출. 03_architecture 3.14 |
| `src/render/pick-slot.js` | 단일 슬롯 (4가지 상태). 03_architecture 3.15 |
| `src/render/pick-hint-toast.js` | 첫 진입 안내 toast (1회 표시). 03_architecture 3.16 |
| `tests/suites/draw_pick.test.js` | drawOne(boxState, drawRng, lineup, pickIndex) 분기 + 결정론 단위 테스트 |
| `tests/suites/storage_v3.test.js` | v2 → v3 마이그레이션 단위 테스트 |

## 2.2. 갱신 모듈 (8개)

| 파일 | 갱신 내용 |
|---|---|
| `src/data/numbers.js` | 02_data 1.6 / 1.12 신규 키 export |
| `src/data/colors.js` | 02_data 2.2 신규 슬롯 색 5종 export |
| `src/data/storage.js` | loadState 갱신 + saveState 갱신 + migrateV2ToV3 신설 (03_architecture 3.10) |
| `src/core/draw.js` | drawOne 시그니처: pickIndex 옵셔널 추가. deck.shift() → splice(pickIndex \|\| 0). result에 pickIndex 추가 |
| `src/core/history.js` | appendHistory entry 스키마 갱신 + findUnrevealed / revealHistory 신설 |
| `src/render/draw-tab.js` | 6번 영역 분기 a/b1/b2/b3/c 5분기. pendingPickResult / pendingPeelResult / settingsSkipPick 매트릭스 |
| `src/render/buy-panel.js` | "통에서 선택 건너뛰기" 체크박스 추가. dispatch.set_skip_pick |
| `src/render/settings-tab.js` | 동일 체크박스 추가 (양방향 동기화) |
| `src/render/peel-panel.js` | pendingPickResult 우선 사용 (drawOne 재호출 방지). skip ON 시 페이지플립 시작 = drawOne(splice(0)) 호출 |
| `src/render/main.js` (또는 src/main.js) | state 객체에 pendingPickResult / settingsSkipPick / meta.pickHintSeen 추가. dispatch.pick / pick_hint_seen / set_skip_pick / peel_confirm history reveal 처리. 부팅 시 findUnrevealed 복원 |
| `tests/suites/draw.test.js` | drawOne 시그니처 변경 호환. 기존 테스트는 pickIndex 미전달 = splice(0) 동등 가정 검증 |
| `tests/suites/history.test.js` | entry 스키마 변경 호환. revealed / pickIndex 필드 검증 |
| `tests/suites/storage.test.js` | loadState v3 호환. settingsSkipPick / pickHintSeen 반환 검증 |
| `styles/main.css` + `styles/tokens.css` | 격자 레이아웃 + 슬롯 4가지 상태 + 호버 글로우 + Last One 슬롯 + toast 위치 |

# 3. 작업 분할 (태스크 그래프)

총 19 태스크. Phase 1~7 의존성 순.

## 3.1. Phase 1: data / core 기반 (T1~T4)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T1 | 02_data 신규 키 → numbers.js / colors.js export 추가 | - | `src/data/numbers.js` (BUY_SKIP_PICK_DEFAULT, PICK_GRID_COLS_DEFAULT 외 11개) + `src/data/colors.js` (COLOR_PICK_SLOT_BG 외 5개) |
| T2 | storage.js 갱신 + migrateV2ToV3 신설 | T1 | loadState v3 + saveState 신규 키 + migrateV2ToV3 (03_architecture 3.10) |
| T3 | core/draw.js 시그니처 갱신 | T1 | drawOne(boxState, drawRng, lineup, pickIndex) + splice(pickIndex \|\| 0) + result에 pickIndex |
| T4 | core/history.js 갱신 | T1 | appendHistory entry 스키마 + findUnrevealed + revealHistory |

## 3.2. Phase 2: 단위 테스트 (T5~T7)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T5 | tests/suites/draw_pick.test.js 신설 | T3 | drawOne pickIndex 분기 (skip OFF/ON) + splice 동작 + 결정론 시나리오 (skip OFF: 동일 시드 + 동일 슬롯 순서 → 동일 결과) |
| T6 | tests/suites/storage_v3.test.js 신설 | T2 | v2 fixture → migrateV2ToV3 → backfill 결과 검증 (`revealed: true` / `pickIndex: null` / `pickHintSeen: false` / `settingsSkipPick: false` / `schemaVersion: 3`) |
| T7 | 기존 테스트 호환 갱신 | T3, T4, T2 | draw.test.js (pickIndex 미전달 = splice(0)) + history.test.js (entry 스키마) + storage.test.js (loadState v3) |

## 3.3. Phase 3: render 신규 (T8~T10)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T8 | render/pick-slot.js 신설 | T1 | 4상태 (normal-available / normal-drawn / last-one-pending / last-one-drawn) renderPickSlot |
| T9 | render/pick-panel.js 신설 | T1, T8 | 격자 레이아웃 + 슬롯 N개 배치 + Last One 슬롯 마지막 위치 + 첫 진입 시 toast 호출 |
| T10 | render/pick-hint-toast.js 신설 | T1 | toast 표시 + PICK_FIRST_HINT_DURATION_MS 후 자동 닫힘 + dispatch.pick_hint_seen |

## 3.4. Phase 4: render 갱신 (T11~T14)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T11 | render/draw-tab.js 분기 갱신 | T9 | 6번 영역 a/b1/b2/b3/c 5분기. **state 매트릭스 grep 5.8 적용** |
| T12 | render/buy-panel.js skip 체크박스 추가 | T1 | "통에서 선택 건너뛰기" 토글 + dispatch.set_skip_pick |
| T13 | render/settings-tab.js skip 체크박스 추가 | T1 | 동일 토글 (양방향 동기화는 state.settingsSkipPick 단일 SSOT로 자동) |
| T14 | render/peel-panel.js pendingPickResult 사용 | T3 | skip OFF: pendingPickResult 우선 사용 (drawOne 재호출 X). skip ON: 페이지플립 시작 = drawOne(splice(0)) 호출 |

## 3.5. Phase 5: main wire-up (T15)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T15 | src/main.js + render/main.js 갱신 | T2, T3, T4, T11, T12, T13, T14 | state 객체 (pendingPickResult / settingsSkipPick / meta.pickHintSeen) + dispatch 5종 (pick / pick_hint_seen / set_skip_pick + 기존 peel_confirm 갱신 + 부팅 findUnrevealed 복원). 4.6~4.9 흐름 |

## 3.6. Phase 6: styles (T16)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T16 | styles 갱신 | T8, T9, T10 | tokens.css에 색 5종 변수 + main.css에 .pick-panel / .pick-slot.* / .pick-hint-toast 레이아웃 + Last One 슬롯 골드 강조 + 호버 lift / glow |

## 3.7. Phase 7: 통합 검증 (T17~T19)

| ID | 태스크 | 의존 | 산출물 |
|---|---|---|---|
| T17 | 시그니처 / state / prop grep | T15, T16 | drawOne pickIndex 호출처 grep (5.6) + state 매트릭스 분기 grep (5.8) + 신규 prop 시그니처 grep (5.9) |
| T18 | tests/test.html 전체 suite 실행 | T17 | 모든 suite pass. fail 0건 |
| T19 | 사용자 실기기 시각 컨펌 | T18 | 모바일 격자 터치 사용성 9.1 (셀 ≥ 24px) + 4상태 슬롯 시각 분리 + 첫 진입 toast |

# 4. 의존성 그래프

```
T1 ─┬─► T2 ─┬─► T6
    ├─► T3 ─┬─► T5
    ├─► T4 ─┴─► T7
    ├─► T8 ──► T9 ─┐
    ├─► T10 ───────┤
    ├─► T12 ───────┤
    └─► T13 ───────┤
              T3 ─►T14
                   │
T9 / T12 / T13 / T14 ─► T11 ─┐
T2/T3/T4/T11/T12/T13/T14 ────► T15 ─► T17 ─► T18 ─► T19
T8/T9/T10 ─► T16 ────────────► T17
```

# 5. 학습 흡수 (M2 PROGRESS 6.2)

| 학습 | 본 사이클 적용 |
|---|---|
| 6.2.2 prop drilling 정합 | T8/T9/T10 prop 시그니처 명시 + T17 grep 검증 (03_architecture 5.9) |
| 6.2.3 분기 조건 state 매트릭스 | T11 5분기 + 03_architecture 4.6/4.7/4.8/4.9 흐름 명시 + T17 grep 검증 (5.8) |
| 6.2.4 자동 진행 vs 사용자 명시 | T9 슬롯 클릭 = 즉시 확정 (취소 불가). T15 dispatch.peel_confirm = 사용자 액션 |
| 6.2.5 시각 효과 우선순위 | T16 에서 호버 / drawn / Last One 강조의 z-index + !important 충돌 사전 점검 |
| OP-2 시그니처 변경 시 grep | T3 drawOne 시그니처 변경 → T7에서 호출처 정합 + T17 grep |
| OP-3 자체 grep 사전 검증 | T17이 단계 6 진입 전 자비스 셀프 grep (drawOne pickIndex 호출처 / state 매트릭스 / prop) |
| OP-4 tests/ 매직 넘버 검증 | T5/T6 신규 테스트 작성 시 매직 넘버 0 (numbers.js 키 참조) |

# 6. 정보성 항목 처리 (round3 보고서 I-N1~I-N4)

| ID | 결정 |
|---|---|
| I-N1 (M3 비균등 격자 Last One 위치) | M2.1 미반영. M3 ワンピース 진입 시 결정 |
| I-N2 (history `pickIndex` nullable 명시) | T1 / T7 에서 02_data 3.1 표 보강 + 테스트 fixture 명시 |
| I-N3 ("통 선택 완료 상태 해제" vs "1매 사이클 종료" 표현) | T15 dispatch.peel_confirm 주석에 5.14.5.0 정의 인용 |
| I-N4 (reveal 진행 중 pendingPickResult 존재 시간 경계) | T15 dispatch.peel_confirm 시점에 pendingPickResult / pendingPeelResult 동시 초기화 명시 |

# 7. 추정

| Phase | 추정 |
|---|---|
| 1 (T1~T4) | 0.15일 |
| 2 (T5~T7) | 0.15일 |
| 3 (T8~T10) | 0.20일 |
| 4 (T11~T14) | 0.20일 |
| 5 (T15) | 0.10일 |
| 6 (T16) | 0.10일 |
| 7 (T17~T19) | 0.10일 |
| **합계** | **약 1.0일** |

M2.1 plan 7장 단계 5 마일스톤(1.0일) 일치.

# 8. 리스크

8.1. **slot deck 인덱스 매핑 (5.14.2.2)**: 격자 위치 = 시각 고정 (뽑힌 슬롯도 자리 유지) vs 슬롯 클릭 시 deck 잔여 i번째 항목 매핑. 격자 i번째 슬롯 클릭 시 deck.splice(i) 가 아니라 splice(deck 잔여에서 i번째 위치). 단계 5 T9 / T15 구현 시 명확화. 03_architecture 3.14 주석 강화.

8.2. **새로고침 복원 UI 결정** (03_architecture 4.7 대안): "페이지플립 카드 직접 표시" vs "통 선택 격자 + pendingPickResult 복원". T15 시 시각 컨펌 후 결정. 양쪽 모두 결정론 안전. 1차 구현은 b2 분기 (페이지플립 카드 직접) 권장 - reveal 1단계 절감.

8.3. **모바일 격자 터치 사용성**: 80슬롯 / 셀 24~28px. T19 사용자 시각 컨펌 시점 핵심 점검. 부족 시 격자 확대 + 스크롤 / cols 8로 축소 fallback.

8.4. **마이그레이션 회귀**: v2 사용자 → 첫 진입 = migrateV2ToV3. T6 단위 테스트 + 사용자 실 데이터 fixture 1건 (M2 시점 ghostjean@naver.com 사용자) 검증.

# 9. 사용자 승인 항목

9.1. 본 impl_plan 의 19 태스크 / 의존성 / 추정 1.0일에 동의?
9.2. **8.1 슬롯 인덱스 매핑** (격자 위치 시각 고정 + 클릭 시 deck 잔여 i번째) 정책에 동의?
9.3. **8.2 새로고침 복원 UI** 1차 구현 = "페이지플립 카드 직접 표시" (b2 분기) 가정에 동의?
9.4. 03_architecture.md 갱신 (3.14~3.16 + 3.4 / 3.7 / 3.10 / 3.11 + 4.6~4.9 + 5.6~5.9) 동의?
9.5. 단계 5 implement 진입 승인?

승인 받으면 단계 5 implement 진입 (T1부터 순차 진행).
