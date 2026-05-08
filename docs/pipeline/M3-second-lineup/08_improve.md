# M3 second-lineup 단계 8 improve

작성일: 2026-05-08.
M3 스프린트 종료 + M4 후보 등재.

# 1. M3 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | `01_plan.md` + `00_checklist.md` | 사용자 (A) 승인 |
| 2 design | `01_spec.md` 5.13.A 신설 + `02_data.md` 1.4 / 1.7 / 3.x / 4.12 | OK |
| 3 design_review | `03_design_review.md` round 1~3 | round 3 통과 (P0 0건, 사용자 명시 승인 round 3 진입) |
| 4 impl_plan | `03_architecture.md` 갱신 + `04_impl_plan.md` T1~T22 / 5 Phase | 사용자 (A) 승인 |
| 5 implement | `src/` 22 태스크 + `tests/` 신규 2 suite | T22 grep 통과 |
| 6 impl_review | `06_impl_review.md` round 1~2 | round 2 통과 (P0 0건) |
| 7 qa | `07_qa.md` | 정적 정합 통과 |
| 8 improve | 본 문서 | 작성 중 |

## 1.2. 코드 변경 합산

- **data**:
  - `numbers.js` 전면 재작성 (LINEUP_DRAGONBALL_* + LINEUP_ONEPIECE_* + LINEUPS / getLineupById / SCHEMA_VERSION 4 / BOX_SIZE alias / PICK_FIRST_HINT_* dead 제거).
  - `colors.js` 9종 토큰 추가.
  - `storage.js` 전면 재작성 (라인업별 격리 키 + 전역 키 + migrateV3ToV4 + loadStateForLineup / saveStateForLineup / loadGlobalSettings / saveGlobalSettings).
- **core**:
  - `box.js` initBox box.id에 lineup_id 포함.
  - `hash.js` boxId 시그니처 갱신.
  - `history.js` tierCounts(history, lineup) 시그니처.
  - `double_chance.js` drawDc(tickets, rng, dcConfig) 시그니처.
  - `pick-grid.js` 신설 (M2.1 정리 3.5.1 흡수).
- **render**:
  - `main.js` state.currentLineupId / activeLineup() / dispatch.set_current_lineup / pick_hint_seen + confirm_pick dead 제거 / buildConsumedGridSet → core 이전.
  - `header.js` IP 라벨.
  - `settings-tab.js` Lineup 섹션 + dropdown.
  - `pick-slot.js` 5상태 → 3상태 (LAST_ONE 제거).
  - `pick-panel.js` lineup 동적 lookup.
  - 12개 render 모듈 등급 수 가변성 흡수 (minor-row / hero-carousel / last-one-row / product-gallery / tier-grid / history-tab / dc-tab / buy-panel / draw-tab / estimated-badge / last-one-indicator / result-modal).
- **input**: 변경 없음.
- **styles**: tokens.css 9종 토큰 추가 + main.css 인라인 hex 35건 → var() 치환 + .app-lineup-ip + .lineup-select 신설.
- **tests**: storage_v4.test.js + lineup_isolation.test.js 신설 + 11 기존 suite 정합 (alias 또는 시그니처 변경).
- **docs**: 01_spec / 02_data / 03_architecture 다중 라인업 정합 + pipeline/M3-second-lineup/00~08 산출물.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 4 / P1 5 / P2 3 | 미통과 |
| 3 | round 2 | P0 1 (round 1 누락 1건) | 미통과 |
| 3 | round 3 (사용자 명시 승인) | P0 0 | 통과 |
| 6 | round 1 | P0 3 / P1 4 / P2 3 | 미통과 |
| 6 | round 2 | P0 0 / P1 0 | **통과** |

## 1.4. 사용자 명시 룰 적용 (메모리 `feedback_no_cutting_corners`)

- 라이브 정정 갈음 모드 금지. M3 모든 단계 정식 보고서 작성.
- 단계 3/6 subagent 격리 검증 정식 진행 (M2.1 라이브 컨펌 갈음 패턴 X).
- 단계 6 round 2 통과 후에만 단계 7/8 진입.

# 2. 학습 흡수 (PROGRESS 6.2)

본 스프린트는 신규 학습 도입 가능성 적음 (M2.1에서 6.2.2~6.2.15 14건 모두 흡수). 다만 M3 단계 6에서 도출된 학습:

## 2.1. M3 신규 학습 후보

- **L-M3-1: 단계 6 round 1 P0 2.1 (set_current_lineup 동작 0건)**: bootstrapState가 storage 의존 시점 / 메모리 의존 시점이 어긋나면 액션이 noop이 됨. 새 dispatch가 storage 영속을 명시 호출하지 않으면 loadState가 옛 상태를 다시 읽음. → **검증 룰: dispatch가 영속 키를 변경하면 saveState 명시 호출 후 loadState (또는 직접 lookup) 의무**.
- **L-M3-2: 단계 6 round 1 P0 2.3 (인라인 hex 35건)**: 단계 4 impl_plan T20 "main.css 인라인 hex 토큰화"가 단계 5 implement에서 흡수되지 못한 사례. T20 단순 권고로는 부족. **검증 룰: 인라인 hex grep 0건은 단계 6 게이트 정식 항목**.
- **L-M3-3: 라이브 정정 갈음 vs 정식 8단계의 차이**: 사용자 명시 룰 (feedback_no_cutting_corners)이 적용된 첫 스프린트. 단계 3/6 round 사이클이 검증 비용 큼 (round 1 P0 4+3 vs M2.1 라이브 정정 즉시 정정). 다만 결과적으로 **결정론 회귀 위험 (P0 2.1 / 5.7.1) 사전 차단**. 단계 6 round 1이 set_current_lineup 동작 0건 catch 안 했으면 사용자 라이브 발견까지 결함 잠복. 룰 정신 정당화.

# 3. M4 후보 plan (정식 단계 1 plan은 M4 시작 시 작성)

## 3.1. M4 스코프 (가설)

**M4 = `コトブキヤくじ XENOGLOSSIA` 라인업 + 30연 천장 룰 메커닉 + assets.js 라인업 분기 + tests alias 정리**.

### 3.1.1. 천장 룰 메커닉 (XENOGLOSSIA)

- 30연 추첨 시 S賞 확정 지급 메커닉. M3까지 이찌방쿠지 표준 메커닉만 지원.
- 새로운 lineup.mechanics 필드 도입 (`mechanicType: "ichiban_basic" | "kotobukiya_pity30"`).
- core/draw.js에 천장 카운터 / 30연 시점 자동 S賞 분기 추가.

### 3.1.2. 라인업 추가 (XENOGLOSSIA)

- 100매 박스 + S/A/B/C/D 5등급 + 30연 천장. research/lineups.json 정합.
- assets 폴더 신설 (라이선스 클린).

### 3.1.3. assets.js 라인업 분기 (M3 단계 8 백로그)

- `lineup.assetsBasePath` 동적 lookup.
- `lineup.assetsAvailable === false` → SVG fallback (M2.1 G~J SVG 패턴 답습).
- assets.js 시그니처: `getProductMainAsset(tier, lineup)`.

### 3.1.4. tests alias 정리

- `LINEUP_DRAGONBALL as LINEUP` alias 6건 → 직접 사용으로 정정 (M3 단계 6 P2 4.1).

### 3.1.5. M3 단계 6 학습 흡수 (검증 룰 보강)

- L-M3-1: dispatch 영속 변경 시 saveState 명시 호출 의무 검증.
- L-M3-2: 인라인 hex grep 0건은 단계 6 게이트 정식 항목.
- L-M3-3: 라이브 정정 갈음 모드 금지 (메모리 룰 유지).

## 3.2. M4 추정

| 부분 | 추정 |
|---|---|
| 천장 룰 메커닉 | 1.5일 |
| XENOGLOSSIA 라인업 | 1.0일 |
| assets.js 분기 | 0.5일 |
| tests alias 정리 + 학습 흡수 | 0.5일 |
| 단계 1~8 합산 추정 | 4.0~5.0일 |

## 3.3. 비목표 (M4 범위 외)

- M5: SEGA 럭키쿠지 온라인 잔여 카운터 UI 모드.
- M6+: PIXAR 13등급 확장 / フリューくじ.

# 4. 백로그 통합

## 4.1. M1 인계 (운영 학습)

- OP-3 (gridIndex 의무 기록): M3 이월 결정 2.1로 (C) 보존 채택. M4+ 후보 등재.

## 4.2. M2 / M2.1 인계

- 모두 M2.1 단계 6 / M3 단계 6에서 흡수 완료.

## 4.3. M3 단계 8 백로그

- 4.3.1. **assets.js 라인업 분기** (M3 단계 6 P2 4.2): M4 정식 plan에 흡수.
- 4.3.2. **사용자 외부 작업 - placeholder 자산 17장** (드래곤볼 7 + 원피스 10): 사용자 외부 도구 생성. assetsAvailable=true 갱신은 자비스가 코드 경로 정정 시 처리.
- 4.3.3. **tests/suites alias 정리** (P2 4.1): M4에서 흡수.

## 4.4. 사용자 외부 작업 대기

| # | 항목 | 차단 사유 |
|---|---|---|
| 4.4.1 | placeholder 자산 17장 (드래곤볼 7 + 원피스 10) | 사용자 외부 AI 도구 생성 + 폴더 배치 |

# 5. M3 종료 결정

5.1. 8단계 파이프라인 모든 단계 통과 (단계 6 round 2 통과).
5.2. 사용자 명시 룰 (feedback_no_cutting_corners) 정합 - 라이브 정정 갈음 0건. 정식 보고서 6/7/8 모두 작성.
5.3. M4 후보 plan 등재 (천장 룰 + XENOGLOSSIA + assets 분기).
5.4. 사용자 외부 작업 1건 (placeholder 자산) 대기.
5.5. 단계 7 라이브 시각 검증 사용자 핸드오프 (M3 종료 직후 사용자 시각 컨펌).

**M3 정식 종료**. 다음 사이클 진입 결정 사용자.

# 6. 변경 이력

6.1. 2026-05-08: M3 단계 8 improve 작성. 라이브 정정 갈음 금지 룰 첫 정합 스프린트. 단계 1~8 모두 정식 통과 + 학습 3건 신규 (L-M3-1/2/3) + M4 후보 plan 등재.
