# M3 second-lineup 단계 4 impl_plan

작성일: 2026-05-08.
단계 3 round 3 통과 후 작성.
대상: 단계 5 implement.

# 1. 한 줄

01_plan + 03_design_review를 base로, 02_data SSOT + 03_architecture 모듈 시그니처를 코드(`src/`) + 테스트(`tests/`)로 변환. T1~T22 + 5 Phase + 의존성 그래프.

# 2. 단계 3 이월 결정 (단계 4에서 결정)

| # | 결정 | 권장 |
|---|---|---|
| 2.1 | gridIndex 의무 기록 알고리즘 (skip ON 흐름) | **(C) 현 M2.1 흐름 보존 (gridIndex: null + buildConsumedGridSet placeholder 충당)** - M3 스코프 보수. 6.2.12 흡수는 M4+ 후보로 이월. |
| 2.2 | numbers.js의 `BOX_SIZE` 단수 export 정책 | **(B) 호환 alias 유지** - `BOX_SIZE = LINEUP_DRAGONBALL_BOX_SIZE` (deprecated 주석). 단계 5에서 점진 폐기. M2.1 정리 라운드 P2와 함께 M4+ 완전 제거. |
| 2.3 | numbers.js의 `LINEUP` 단수 export 정책 | **(A) 즉시 폐기** - LINEUPS 배열 + currentLineupId lookup으로 일원화. 호환 alias 0건. M3 단계 6 게이트 5.10 grep 통과 의무. |

본 결정은 단계 4 권장이며 단계 5 implement에서 정합 적용. 사용자 명시 결정 요청 사항이 있으면 단계 4 승인 시 변경 가능.

# 3. T 분할 (22 태스크)

## 3.1. Phase A - data 추가 + 마이그레이션 (T1~T5)

### T1. data/numbers.js 라인업 분리 + LINEUPS 배열

- 02_data 1.4-DB 절 정합: `LINEUP_DRAGONBALL_*` 상수 prefix 변환 (`LINEUP_ID` → `LINEUP_DRAGONBALL_ID` 등 12종).
- `TIERS` → `TIERS_DRAGONBALL` + `TIERS_COUNT_ESTIMATED` → `TIERS_DRAGONBALL_COUNT_ESTIMATED`.
- DC 상수 prefix: `LINEUP_DRAGONBALL_DC_*`.
- 출처 배열: `LINEUP_DRAGONBALL_SOURCES`.
- 자산 path: `LINEUP_DRAGONBALL_ASSETS_BASE_PATH = "the_chronicle_of_goku_placeholder"` + `LINEUP_DRAGONBALL_ASSETS_AVAILABLE = false`.
- `LINEUP_DRAGONBALL` 객체 (1.4-DB.5 정합).
- 매수 합 검증식 (1.4-DB.2.1) 부팅 throw 보존.
- `BOX_SIZE` 호환 alias 유지 (T22.M2.1정리에서 deprecated 주석 명시).
- `LINEUP` 단수 폐기 (호환 alias 0건. T17 grep 검증).

### T2. data/numbers.js 원피스 라인업 신설

- 02_data 1.4-OP 절 정합: `LINEUP_ONEPIECE_*` 상수 12종 신설.
- `TIERS_ONEPIECE` (9등급 + Last One): A(1) / B(2) / C(2) / D(3) / E(4) / F(6) / G(12) / H(16) / I(33) + Last One(1).
- 매수 합 검증식 (1.4-OP.2.1) 부팅 throw.
- DC 상수: `LINEUP_ONEPIECE_DC_WINNERS_TOTAL = 100`.
- `LINEUP_ONEPIECE` 객체 + 자산 path `monkey_d_luffy_placeholder` + `assetsAvailable: false`.

### T3. data/numbers.js LINEUPS 배열 + getLineupById

- `LINEUPS = [LINEUP_DRAGONBALL, LINEUP_ONEPIECE]`.
- `LINEUP_DEFAULT_ID = LINEUP_DRAGONBALL.id`.
- `getLineupById(id)`: lookup + 미발견 시 LINEUP_DEFAULT 반환 + console.warn (spec 7.16.1).
- `SCHEMA_VERSION = 4`.

### T4. data/colors.js 라인업 신규 색

- 변경 최소: M3는 등급 색 공통 유지 (TIER_COLORS 그대로). 라인업 IP 액센트 색 신규 추가는 M4+ 이월.
- `COLOR_PICK_SLOT_BG_GRAD` / `COLOR_FRAME_RED_DARK` / `COLOR_GOLD_EDGE_SOFT` 잔존 (M2.1 단계 6 4.17 흡수).

### T5. data/storage.js 마이그레이션 v3 → v4

- `migrateV3ToV4()` 신설. 02_data 3.2.5 알고리즘 정합.
  - DETECTED_LINEUP_ID = `LINEUP_DRAGONBALL_ID`.
  - v3 키 6종 → v4 격리 키 이전 (멱등).
  - `kuji_current_lineup_id` / `kuji_schema_version = 4` 신설.
  - 전역 키 (kuji_seed / kuji_settings_skip_pick / kuji_meta) 보존.
- `loadStateForLineup(lineupId)`: 라인업별 격리 키 6종 lookup.
- `saveStateForLineup(lineupId, partial)`.
- `loadGlobalSettings()` / `saveGlobalSettings(partial)`.
- `loadState()` 진입점은 마이그레이션 점검 + globalSettings + currentLineupId lookup + loadStateForLineup 위임.
- 멱등 정합 검증 + 부분 실패 복구 (spec 7.17).

## 3.2. Phase B - core 정합 (T6~T9)

### T6. core/box.js initBox box.id에 lineup_id 포함

- 03_arch 3.7.M3 정합.
- `initBox(seed, round, lineup)` 시그니처 그대로. 내부 `box.id = fnv1a("${lineup.id}|${seed}|${round}").toString(16).padStart(BOX_ID_HEX_LENGTH, '0')`.
- 이전: `fnv1a("${seed}|${round}")`.
- 단위 테스트 box.test.js 갱신: 동일 시드 + 동일 회차 + 다른 라인업 → 다른 box.id.

### T7. core/history.js tierCounts(history, lineup) 시그니처

- 03_arch 3.7.M3 정합.
- 기존 `tierCounts(history)` → `tierCounts(history, lineup)`.
- lineup.tiers를 순회하며 등급별 카운트 산출.
- 호출처: render/tier-gauge.js / render/product-item.js / render/last-one-row.js / render/hero-carousel.js / render/minor-row.js (등급 수 가변성 흡수, T13).
- 단위 테스트 history.test.js 갱신: lineup 인자 정합.

### T8. core/double_chance.js drawDc 호출처 정합

- `drawDc(tickets, rng, winnersTotal, poolSize)` 시그니처 그대로.
- 호출처 (render/main.js dispatch.draw_dc)에서 `lineup.dc.winnersTotal` 전달 (이전: `DC_WINNERS_TOTAL` 단수).
- 단위 테스트 double_chance.test.js 갱신.

### T9. core/pick-grid.js 신설 (M2.1 정리 3.5.1)

- `buildConsumedGridSet(state, lineup)` 함수를 render/main.js에서 이전.
- DOM 의존성 0건. lineup.boxSize 참조로 등급 수 가변성 흡수.
- 호출처: render/main.js performPickConfirm + render/pick-panel.js (B-α 단일 진실원).
- 기존 import 경로 갱신 (render/main.js export 폐기 + core/pick-grid.js export).
- tests/suites/build_consumed_grid_set.test.js (M2.1 4.15.5) import 경로 갱신.

## 3.3. Phase C - render 다중 라인업 (T10~T15)

### T10. render/main.js state + bootstrapState

- state에 `currentLineupId` 추가.
- bootstrapState 시그니처: `bootstrapState(loadedState, globalSettings, lineup)`.
- mount 진입점:
  - migrateV3ToV4 점검 (T5).
  - migrateV3InPlace 점검 (M2.1 B-α 호환).
  - globalSettings = loadGlobalSettings.
  - currentLineupId 부재 → LINEUP_DEFAULT_ID 부여 + saveGlobalSettings.
  - lineup = getLineupById(currentLineupId).
  - state = bootstrapState(loadStateForLineup(lineup.id), globalSettings, lineup).
- 모든 dispatch 분기에서 `LINEUP` 단수 → `state.lineup` (또는 `getLineupById(state.currentLineupId)`) 변경.

### T11. render/main.js dispatch.set_current_lineup

- 03_arch 3.18 정합.
- 사용자 settings-tab dropdown 액션 트리거.
- confirmModal → 사용자 확인:
  - persistAll(state, oldLineupId) (saveStateForLineup).
  - saveGlobalSettings({ currentLineupId: newLineupId }).
  - state = bootstrapState(loadStateForLineup(newLineupId), globalSettings, newLineup).
  - 메모리 only state 폐기 (pendingPeelResult / selectedGridIndices).
  - rerender.

### T12. render/header.js 라인업 IP 라벨

- spec 4 + 5.13.A.3 정합.
- 헤더에 활성 lineup.ip 라벨 추가 ("DRAGONBALL" / "ONE PIECE").
- 클릭 인터랙션 없음 (사용자 결정 8.3 (A)).

### T13. render 등급 수 가변성 흡수

- minor-row.js / hero-carousel.js / last-one-row.js / product-gallery.js / product-item.js / tier-gauge.js / tier-accordion.js: 하드코딩 정수 (10, 11) 또는 라벨 (A~J) 0건. `lineup.tiers.length` / `lineup.tiers[i]` 동적 처리.
- last-one-row.js Last One row 표시 정합 (라인업별).

### T14. render/settings-tab.js Lineup 섹션

- 03_arch 3.17 정합.
- 'Lineup' 섹션 신설 (상단). 현재 라인업 표시 + dropdown.
- 라인업 N개 옵션 (LINEUPS 배열 lookup).
- 변경 시 confirmModal → dispatch.set_current_lineup.
- skip 토글 섹션 (M2.1) 잔존.

### T15. render/pick-panel.js 등급 수 + lineup 정합

- T9 core/pick-grid.js 사용 (buildConsumedGridSet import 경로 변경).
- `lineup.boxSize - 1` 동적 NORMAL_SLOT_COUNT.
- `lineup.gridCols ?? PICK_GRID_COLS_DEFAULT` 정합.
- 5.13.A.1.0 표기 정책 정합 (lineup 인자 명시).

## 3.4. Phase D - M2.1 정리 라운드 흡수 (T16~T19)

### T16. main.js dispatch.pick_hint_seen handler 제거

- M2.1 정리 3.5.2.
- main.js에서 `case "pick_hint_seen":` 분기 + dispatch type 자체 제거.
- 호출처 0건 (M2.1 4.14.1에서 toast 폐기).
- main.js 라인 -7 ~ -10.

### T17. pick-slot.js LAST_ONE_PENDING/DRAWN dead 제거

- M2.1 정리 3.5.4.
- KIND_LAST_ONE_PENDING / KIND_LAST_ONE_DRAWN 상수 + 분기 제거.
- 5상태 → 3상태 축소.
- export `PICK_SLOT_KINDS`에서 LAST_ONE_* 키 제거.
- pick-slot.js 라인 -10 ~ -15.

### T18. numbers.js PICK_FIRST_HINT_* dead 제거

- M2.1 정리 3.5.5.
- `PICK_FIRST_HINT_DURATION_MS` / `PICK_FIRST_HINT_TEXT_KO` 완전 제거 (deprecated 표기 → 제거).
- 02_data 1.12에서도 행 제거 (deprecated → 완전 제거 갱신).

### T19. 04_impl_plan.md M2.1 pendingPickResult 잔존 정리

- M2.1 정리 3.5.3.
- M2.1 단계 4 산출물 `docs/pipeline/M2.1-pick-from-bin/04_impl_plan.md`의 line 36 / 39 / 40 / 82 / 88 / 140 / 161에 `pendingPickResult` 잔존.
- strikethrough + B-α 흡수 노트 추가 (역사 정합 위해 완전 삭제 X).

## 3.5. Phase E - styles + 단위 테스트 (T20~T22)

### T20. styles/main.css 인라인 hex → tokens.css (CB-2)

- M2.1 백로그 CB-2.
- main.css 잔존 hex grep → tokens.css 변수 치환.
- 라이브 정정 라운드에서 도입된 인라인 값 흡수.

### T21. tests 단위 테스트 신설 + 정합

- `tests/suites/storage_v4.test.js` 신설:
  - v3 fixture (단일 라인업 키 6종 + meta v3) → 마이그레이션 → v4 격리 키 + current_lineup_id + schema_version = 4.
  - v4 fixture → 멱등 (변경 0).
  - 부분 v3 (history만) → 부분 이전 정합.
  - 전역 키 (seed / skip_pick / meta) 보존 검증.
- `tests/suites/lineup_isolation.test.js` 신설:
  - 동일 시드 + 동일 회차 + 다른 라인업 → 다른 box.id.
  - history.tierCounts(history, lineup_db) vs (history, lineup_op) 정합.
  - 9등급 vs 10등급 라인업 history 카운트 정합.
- 기존 suite 갱신:
  - box.test.js: lineup 인자 그대로 + box.id lineup_id 포함 검증.
  - history.test.js: tierCounts(history, lineup) 시그니처 정합.
  - draw.test.js / draw_pick.test.js / last_one.test.js: lineup 인자 (`LINEUP` → `LINEUP_DRAGONBALL`).
  - storage.test.js: v4 호환 + 라인업별 격리 키.
  - storage_v3.test.js: M2.1 호환 (v3 → v4 추가 마이그레이션 후에도 정합).
  - build_consumed_grid_set.test.js: import 경로 변경 (`render/main.js` → `core/pick-grid.js`).

### T22. T17 grep 통과 (단계 6 게이트 5.10/5.11/5.12)

- `LINEUP\\b` 단수 글로벌 잔존 0건 (메타 / 변경이력 / 호환 alias 주석 제외).
- `kuji_history\\b` 등 격리 6종 키가 lineup_id 없이 단독 등장 0건.
- 등급 수 하드코딩 (10, 9, A~J 라벨) 잔존 0건.
- core/ DOM import 0건.
- `BOX_SIZE` 단독 export 정책 (호환 alias로 deprecated 주석 명시).

# 4. 의존성 그래프

```
Phase A (T1~T5)
  T1 (numbers.js 드래곤볼)
   └→ T2 (numbers.js 원피스)
        └→ T3 (LINEUPS 배열 + getLineupById)
             └→ T4 (colors.js)  T5 (storage v4)
                                  └→ Phase B

Phase B (T6~T9, Phase A 의존)
  T6 (box.id lineup) → T7 (history.tierCounts(lineup))
                       → T8 (drawDc 호출처)
                       → T9 (pick-grid.js 신설)
                            └→ Phase C

Phase C (T10~T15, Phase A/B 의존)
  T10 (main.js state + bootstrapState)
   ├→ T11 (dispatch.set_current_lineup)
   ├→ T12 (header IP 라벨)
   ├→ T13 (render 등급 수 가변성)
   ├→ T14 (settings Lineup 섹션)
   └→ T15 (pick-panel.js)

Phase D (T16~T19, Phase A/C 의존)
  T16 (pick_hint_seen 제거)
  T17 (pick-slot LAST_ONE 제거)
  T18 (numbers.js PICK_FIRST_HINT_*)
  T19 (M2.1 04_impl_plan strikethrough)

Phase E (T20~T22, Phase A~D 의존)
  T20 (styles)
  T21 (tests 신설 + 정합)
  T22 (T17 grep) → 단계 6 진입
```

# 5. 추정

| Phase | T | 추정 |
|---|---|---|
| A | T1~T5 | 0.6일 |
| B | T6~T9 | 0.5일 |
| C | T10~T15 | 0.8일 |
| D | T16~T19 | 0.3일 |
| E | T20~T22 | 0.5일 |
| 합산 | 22 | 2.7일 (단계 5 implement) |

단계 6/7/8 추가 0.5~1.0일 (검증 round 수에 따라).

**M3 전체 추정**: 단계 1 (0.5) + 단계 2 (0.5) + 단계 3 (0.3) + 단계 4 (0.3) + 단계 5 (2.7) + 단계 6/7/8 (0.7) = **5.0일**.

01_plan 추정 4.0일 → 0.5~1.0일 추가 (round 3 정정 사이클 포함). 라이브 정정 모드 금지 (메모리 룰 `feedback_no_cutting_corners`) 정합.

# 6. 단계 5 implement 절대 룰 (00_checklist 5장 정합)

6.1. 매직 넘버 0개 (raw / 비트 마스크 / 정규화 보정 / 100 변환 등 수학 상수 예외).
6.2. core/ DOM import 0건.
6.3. import 상대 경로 + .js 확장자 명시.
6.4. 핵심 로직 변경 시 단위 테스트 동시 갱신 (T21).
6.5. **라이브 정정 모드 금지**. 단계 6 정식 subagent 격리 검증 진입 의무.
6.6. T 분할 정합 - 의존성 그래프 위반 시 단계 6 P0.

# 7. 단계 6 검증 룰 (Phase별 grep)

03_arch 5.10 / 5.11 / 5.12 정합. 단계 6 round 1 검증자 프롬프트에 본 룰 명시.

# 8. M2.1 학습 흡수 (PROGRESS 6.2)

본 스프린트는 신규 학습 (6.X.X) 도입 가능성 낮음 (M2.1에서 14건 모두 흡수 완료). 단계 5 도중 신규 학습 발견 시 단계 8에서 PROGRESS에 등재.

# 9. 위험 / 회피 (01_plan 9장 정합)

| # | 위험 | 회피 (단계 5 적용) |
|---|---|---|
| 9.1 | 결정론 회귀 | T6 box.id lineup 포함 + T21 lineup_isolation.test.js |
| 9.2 | 마이그레이션 손실 | T5 멱등 + T21 storage_v4.test.js 부분 실패 시나리오 |
| 9.3 | 자산 부재 | SVG fallback 흡수 (M2.1 G~J 패턴 답습 - 신규 작업 없음) |
| 9.4 | 라인업 전환 중 진행 중 상태 | T11 confirmModal + 메모리 only state 폐기 |
| 9.5 | 등급 수 가변성 | T13 render 동적 처리 + T22 grep 통과 |

# 10. 변경 이력

10.1. 2026-05-08: 단계 4 impl_plan 작성. T1~T22 + 5 Phase + 의존성 그래프 + 추정 2.7일 (단계 5). 단계 3 이월 결정 3건 권장 (gridIndex 보존 / BOX_SIZE 호환 alias / LINEUP 단수 즉시 폐기).
