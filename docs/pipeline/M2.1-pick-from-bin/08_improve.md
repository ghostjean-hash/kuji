# M2.1-pick-from-bin 단계 8 improve

작성일: 2026-05-08.
M2.1 스프린트 종료 + M3 후보 등재.

# 1. M2.1 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 상태 |
|---|---|---|
| 1 | `01_plan.md` + `00_checklist.md` | OK |
| 2 | `01_spec.md` 5.14 신설 + `02_data.md` 1.12 / 2.2 / 3.x 갱신 | OK (B-α 재정정 흡수) |
| 3 | `03_design_review_round1~5.md` | round 5 통과 |
| 4 | `03_architecture.md` 갱신 + `04_impl_plan.md` | OK |
| 5 | `src/` + `tests/` (T1~T17 + B-α Phase A~G) | OK |
| 6 | `06_impl_review.md` (round 1~3) | **통과** (round 3 final) |
| 7 | `07_qa.md` | 통과 (라이브 컨펌 흡수) |
| 8 | 본 문서 | 작성 중 |

## 1.2. 코드 산출물 합산

- `src/data/`: numbers.js / colors.js / storage.js / assets.js (M2.1 갱신).
- `src/core/`: box / draw / random / hash / history / buy / double_chance (B-α 정합).
- `src/render/`: 신규 pick-panel + pick-slot + buildConsumedGridSet 헬퍼 / 갱신 hero-carousel + minor-row + last-one-row + product-* + draw-tab + main + buy-panel + peel-panel + peel-card + settings-tab + 모달 일체.
- `src/input/`: drag / scroll / keyboard.
- `tests/suites/`: 11 suite (신규 draw_pick / storage_v3 / build_consumed_grid_set + 갱신 history).
- `styles/`: tokens.css + main.css.
- `docs/`: 01~04 갱신 + pipeline/M2.1-pick-from-bin 산출물 8개.

## 1.3. 라이브 정정 라운드 (4.10~4.17)

8단계 파이프라인 정식 단계 6/7 검증 갈음 라운드. 사용자 시각 컨펌으로 다수 정정 흡수. PROGRESS 4.10~4.17 32+ 항목.

## 1.4. 학습 흡수 (PROGRESS 6.2)

| # | 학습 | 단계 6 룰 흡수 | 비고 |
|---|---|---|---|
| 6.2.2 | render 모듈 prop drilling 정합 | 03_arch 5.9 grep | OK |
| 6.2.3 | 분기 조건 state 매트릭스 | 03_arch 5.8 (B-α 갱신) | OK |
| 6.2.4 | 자동 진행 vs 사용자 명시 | dispatch.peel 분기 | OK |
| 6.2.5 | is-just-drawn vs is-drawn CSS 우선순위 | 4.14.10 흡수 | OK |
| 6.2.6 | 재귀 dispatch 금지 | 4.14.6 인라인 헬퍼 | OK |
| 6.2.7 | persist 시점 = history commit 시점 | 4.14.8 흡수 | OK |
| 6.2.8 | 자식 aspect-ratio가 부모 height에 영향 | 4.14.9 토큰 fixed | OK |
| 6.2.9 | scroll position과 rerender 정합 | 4.14.11 흡수 | OK |
| 6.2.10 | CSS specificity 충돌 - JS 클래스 분리 | 4.14.10 | OK |
| 6.2.11 | 시드 기반 결정론적 시각 무작위화 | slotPosition / slotJitter | OK |
| 6.2.12 | 데이터 truth value vs 시각 메타포 | skip 모드 placeholder 충당 | M3 후보 (gridIndex 의무 기록 리팩터) |
| 6.2.13 | 사용자 QA 민감도 | 단계 6 검증 룰 | OK |
| 6.2.14 | 시각 튜닝 매직 넘버 | 4.17 흡수 | OK (4종 + Z_BOOST = 5종) |
| 6.2.15 | 무작위 vs 균등 분포 | 4.16 격자 매핑 | OK |

# 2. M3 후보 plan (정식 단계 1 plan은 M3 시작 시 작성)

## 2.1. M3 스코프 (가설)

**M3 = `一番くじ ワンピース MONKEY.D.LUFFY` 라인업 추가** + 다중 라인업 인터페이스 보강 + M2.1 학습 정리.

### 2.1.1. 라인업 추가

| 항목 | 작업 |
|---|---|
| 라인업 메타 | research/lineups.json 보강 (estimated 정책 유지) |
| 02_data 1.4 | 두 번째 LINEUP 객체 + LINEUPS 배열 |
| 02_data 2.1 등급 색 | 라인업별 등급 색 매핑 hook |
| numbers.js | LINEUP_ID_LIST + LINEUP_BY_ID + currentLineup state |
| settings 탭 | 라인업 선택 토글 |
| 자산 | placeholder 또는 라이선스 클린 raster |

### 2.1.2. 다중 라인업 인터페이스 보강 (CB-1 흡수)

- `core/history.tierCounts(history, lineup)` lineup 인자 추가.
- box.id에 lineup_id 포함 → 박스 식별자 충돌 회피.
- storage v4 마이그레이션 검토 (currentLineup 영속).

### 2.1.3. M2.1 정리 라운드 흡수 (단계 6 P2 6건)

- buildConsumedGridSet → core/pick-grid.js 분리 (4.1 회색지대 해소).
- pick_hint_seen handler 제거 (main.js dispatch).
- 04_impl_plan.md pendingPickResult 잔존 정리.
- pick-slot.js LAST_ONE_PENDING/DRAWN dead export 제거.
- numbers.js PICK_FIRST_HINT_* dead export 제거.
- spec 6.5 시나리오 표현 명확화.

### 2.1.4. CB-2 흡수 - styles/main.css 인라인 hex → tokens.css

- 라이브 정정 라운드에서 도입된 인라인 hex를 tokens.css 변수로 흡수.

### 2.1.5. 6.2.12 흡수 (M2 OP-3 / M2.1 학습)

- 모든 draw 경로에 gridIndex 의무 기록 → skip 모드 placeholder 충당 폐기.

## 2.2. M3 추정

| 부분 | 추정 |
|---|---|
| 라인업 추가 (자산 클린) | 1.5일 |
| 다중 라인업 인터페이스 | 1.0일 |
| M2.1 정리 라운드 | 0.5일 |
| 합산 | 3.0일 |

## 2.3. 비목표 (M3 범위 외)

| # | 항목 | 이월 |
|---|---|---|
| BO-1 | 30연 천장 룰 (XENOGLOSSIA 메커닉) | M4 |
| BO-2 | 13등급 확장 검증 (PIXAR) | M4 |
| BO-3 | 온라인 잔여 카운터 UI 모드 (SEGA 럭키쿠지) | M5 |
| BO-4 | 통 격자 라인업별 종횡비 hook 활성화 | M3 후반 또는 M4 |

# 3. 백로그 통합

## 3.1. M1 인계 (운영 학습)

- OP-1 (P0 결함 매트릭스): M2.1 단계 6 룰로 흡수됨.
- OP-2 (시그니처 grep): 03_arch 5.6 정합 OK.
- OP-3 (gridIndex 의무 기록): M3 흡수 후보.
- OP-4 (tests 매직 넘버 검증): 03_arch 5.5 OK.

## 3.2. M2 인계 (라이브 학습)

- 6.2.2~6.2.5: M2.1 단계 6에서 흡수.
- 6.2.6~6.2.15: 본 라운드(라이브 정정 4.14~4.17)에서 흡수.

## 3.3. M3 후보 (단계 8 본 문서)

- 2.1.1 라인업 추가 (一番くじ ワンピース).
- 2.1.2 다중 라인업 인터페이스 (CB-1 흡수).
- 2.1.3 M2.1 정리 (단계 6 P2 6건).
- 2.1.4 CB-2 (인라인 hex 토큰화).
- 2.1.5 gridIndex 의무 기록 (6.2.12).

# 4. 사용자 외부 작업 대기

## 4.1. placeholder 자산 7장 (PROGRESS 4.13.12)

- `the_chronicle_of_goku_placeholder/` 폴더에 webp 7장 (A~F + Z) 생성.
- 사양: 02_data 1.7.2 (라이선스 클린 raster + 영문 프롬프트).
- 사용자 외부 도구 (Midjourney / DALL-E / Stable Diffusion 등) 결과물 배치 후 자비스가 코드 경로 수정 (assets.js의 `PRODUCT_IMAGE_BASE_PATH` 갱신) + commit + push로 마무리.
- M2.1 종료와 무관 (단계 외 사용자 작업).

# 5. M2.1 종료 결정

5.1. 8단계 파이프라인 모든 단계 통과 (단계 6 round 3 통과).
5.2. PROGRESS 6.2 학습 14건 모두 흡수 (단계 6 룰 또는 라이브 정정 라운드).
5.3. M3 후보 plan 등재 (본 문서 2장).
5.4. 사용자 외부 작업 1건 대기 (4.1).

**M2.1 정식 종료**. 다음 사이클 진입 결정 사용자.

# 6. 변경 이력

6.1. 2026-05-08: M2.1 단계 8 improve 작성. 라이브 정정 4.14~4.17 흡수 + 단계 6 통과 + M3 후보 plan 등재.
