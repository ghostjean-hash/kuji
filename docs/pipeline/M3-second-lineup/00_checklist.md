# M3 second-lineup - 00 체크리스트

작성일: 2026-05-08.
용도: 8단계 진행 시 빠뜨리지 않을 항목.

# 1. 단계별 게이트

| 단계 | ID | 산출물 | 통과 조건 |
|---|---|---|---|
| 1 | plan | `01_plan.md` | 사용자 승인 |
| 2 | design | `01_spec.md` 갱신 + `02_data.md` 갱신 | 매직 넘버 0개 + storage 옵션 결정 |
| 3 | design_review | `03_design_review.md` (round N) | subagent 격리 통과 (P0 0건) |
| 4 | impl_plan | `03_architecture.md` 갱신 + `04_impl_plan.md` | 사용자 승인 + T 분할 + 의존성 그래프 |
| 5 | implement | `src/` + `tests/` | T17 grep 통과 |
| 6 | impl_review | `06_impl_review.md` (round N) | subagent 격리 통과 (P0 0건) |
| 7 | qa | `07_qa.md` | 정적 시나리오 정합 + 단위 테스트 |
| 8 | improve | `08_improve.md` | M4 후보 등재 |

# 2. 단계 2 design 체크

2.1. 02_data 1.4를 LINEUP 단수 → LINEUPS 배열로 확장.
2.2. 원피스 라인업 메타 추가 (1.4.B 또는 LINEUPS[1]).
2.3. 02_data 3.x storage 키 정책 결정 (옵션 A1 vs A2).
2.4. 02_data 3.2.x 마이그레이션 v3 → v4 정의.
2.5. 02_data 1.7 자산 정책 라인업별 분기.
2.6. 01_spec 추가/갱신: 라인업 전환 시나리오 / settings-tab 라인업 섹션 / 라인업별 박스 회차.
2.7. 매직 넘버 0개 검증 (gridIndex 의무 기록 알고리즘 상수, settings dropdown 옵션 등).
2.8. SCHEMA_VERSION = 4 갱신.

# 3. 단계 3 design_review 검증 룰

3.1. CLAUDE.md 4장 (4.1~4.8) 정합.
3.2. SSOT vs 코드 정합 (단계 5 진입 전이라 코드는 미존재, SSOT 자체 정합만).
3.3. M3 신규 검증 항목 (01_plan 3.8.1~3.8.3):
- 라인업 격리 (storage prefix + box.id lineup 포함).
- currentLineupId 분기 매트릭스.
- 등급 수 가변성 (10 vs 9).
3.4. 결정론 회귀 검증 (9.1).
3.5. 마이그레이션 멱등성 검증 (9.2).
3.6. 등급 수 차이 흡수 (9.5).

# 4. 단계 4 impl_plan T 분할 (예시)

T1. data: numbers.js LINEUPS 배열 + 원피스 메타.
T2. data: colors.js (TIER_COLORS 공통 유지 / 라인업 IP 액센트 추가).
T3. data: assets.js 라인업별 PRODUCT_IMAGE_BASE_PATH.
T4. data: storage v3 → v4 마이그레이션.
T5. core: box.initBox lineup_id 포함 box.id.
T6. core: history.tierCounts(history, lineup) 시그니처.
T7. core: double_chance.drawDc 호출처 winnersTotal lineup 정합.
T8. core: pick-grid.js 신설 (M2.1 정리 3.5.1).
T9. render: settings-tab Lineup 섹션 + dropdown.
T10. render: dispatch.set_current_lineup main wire-up.
T11. render: 헤더 라인업 라벨 (3.3.3 결정 후).
T12. render: minor-row / hero-carousel / last-one-row의 등급 수 가변성 정합 (9.5).
T13. render: pick-panel의 LINEUP.gridCols 라인업별 (M2.1 hook 활성).
T14. render: dispatch.pick_hint_seen handler 제거 (M2.1 정리 3.5.2).
T15. render: pick-slot.js LAST_ONE_PENDING/DRAWN dead 제거 (3.5.4).
T16. data: numbers.js PICK_FIRST_HINT_* dead 제거 (3.5.5).
T17. styles: main.css 인라인 hex → tokens.css (CB-2).
T18. core: gridIndex 의무 기록 (3.7).
T19. tests: storage_v4.test.js + lineup_isolation.test.js 신설 + 기존 suite lineup 인자 정합.
T20. T17 grep (CLAUDE.md 4.2 매직 넘버 + core DOM 0).
T21. T19 단위 테스트 모두 pass.

# 5. 단계 5 implement 절대 룰

5.1. 매직 넘버 0개 (raw / 비트 마스크 / 정규화 보정 0.5 / 100 변환 등 수학 상수 예외).
5.2. core/ DOM import 0건.
5.3. import 경로 상대 + .js 확장자 명시.
5.4. 핵심 로직 변경 시 단위 테스트 동시 갱신.
5.5. 라이브 정정 모드 금지 (메모리 룰 `feedback_no_cutting_corners`). 단계 6 정식 진입 의무.

# 6. 단계 6 impl_review 검증 영역

6.1. CLAUDE.md 4장 정합.
6.2. SSOT vs 코드 정합.
6.3. 04_impl_plan T1~T21 산출물 정합.
6.4. PROGRESS 학습 룰 정합 (6.2.X).
6.5. 라인업 격리 grep:
- `kuji_${key}` 형태에 lineup_id가 빠진 곳 0건.
- `LINEUP` 단일 import에서 `LINEUPS[currentLineupId]` lookup 누락 0건.
- box.id 산출 시 lineup.id 포함 정합.

# 7. 단계 7 QA 시나리오

7.1. 첫 진입 (드래곤볼 default).
7.2. 라인업 전환 (드래곤볼 → 원피스, 데이터 격리 검증).
7.3. 원피스 박스 진행 → 드래곤볼 복귀 → 박스 보존 정합.
7.4. v3 사용자 마이그레이션 (단일 라인업 → 격리).
7.5. skip ON 흐름 + 라인업 전환 (skip 토글 전역 정합).
7.6. 등급 수 차이 흡수 (드래곤볼 10 vs 원피스 9 갤러리 정합).
7.7. DC 응모권 라인업 격리 + winnersTotal 차이 정합 (50 vs 100).

# 8. 단계 8 improve 기록 항목

8.1. M3 종료 정합.
8.2. M4 후보 plan (천장 룰 / 13등급 / SEGA 카운터).
8.3. 새 학습 흡수 (있으면 PROGRESS 6.X.Y로 등재).

# 9. 변경 이력

9.1. 2026-05-08: M3 시작 시 작성. 사용자 결정 3건 반영.
