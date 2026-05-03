# M1 base-system - 04 구현 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M1-base-system |
| 단계 | 4 impl_plan |
| 작성일 | 2026-05-02 |
| 상태 | 작성 완료, 사용자 승인 대기 |

# 1. 한 줄

`docs/03_architecture.md` 본체 갱신과 함께 단계 5 구현 작업을 17개 태스크로 분할. 데이터 SSOT 우선 → core 순수 로직 → 테스트 → 렌더 → 스타일 → wire-up 순서.

# 2. 본 단계 산출물

2.1. `docs/03_architecture.md` 본체 갱신 (placeholder 교체). 모듈 분해 / 의존성 그래프 / 인터페이스 시그니처 / 데이터 흐름 / 정적 검사식.
2.2. 본 파일 (`docs/pipeline/M1-base-system/04_impl_plan.md`). 작업 분할 / 의존성 / 추정.

# 3. 작업 분할 (17개 태스크)

## 3.1. T1 ~ T6: 데이터 + 코어 (백엔드 격)

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T1 | 데이터 SSOT 변환 | `src/data/numbers.js`, `colors.js`, `storage.js` | P0 | 0.2일 |
| T2 | PRNG + 해시 | `src/core/random.js`, `hash.js` | P0 | 0.2일 |
| T3 | 박스 초기화 / 셔플 / 잔여 | `src/core/box.js` | P0 | 0.2일 |
| T4 | 추첨 + Last One | `src/core/draw.js`, `last_one.js` | P0 | 0.3일 |
| T5 | Double Chance | `src/core/double_chance.js` | P1 | 0.3일 |
| T6 | 이력 | `src/core/history.js` | P1 | 0.1일 |

## 3.2. T7: 테스트 (T1~T6과 병행)

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T7 | 단위 테스트 | `tests/test.html`, `runner.js`, `core.js`, `suites/*.test.js` (8개 모듈) | P0 | 0.5일 |

## 3.3. T8 ~ T15: 렌더 + 입력

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T8 | 렌더 베이스 | `src/render/main.js`, `modal.js`, `bottom-tabs.js`, `header.js` | P0 | 0.3일 |
| T9 | 추첨 탭 + 결과 모달 | `src/render/draw-tab.js`, `result-modal.js`, `last-one-modal.js` | P0 | 0.3일 |
| T10 | 등급별 잔여 그리드 | `src/render/tier-grid.js` | P1 | 0.2일 |
| T11 | 전적 탭 | `src/render/history-tab.js` | P1 | 0.2일 |
| T12 | DC 탭 + 결과 모달 | `src/render/dc-tab.js`, `dc-result-modal.js` | P1 | 0.2일 |
| T13 | 설정 탭 + 확인 모달 + 면책 | `src/render/settings-tab.js`, `confirm-modal.js`, `disclaimer-sheet.js` | P0~P1 | 0.3일 |
| T14 | 추정 배지 + 출처 모달 | `src/render/estimated-badge.js` | P2 | 0.2일 |
| T15 | localStorage fallback | `src/render/storage-fallback-sheet.js` + `data/storage.js`의 fallback 보강 | P0 | 0.2일 |

## 3.4. T16 ~ T17: 스타일 + 진입

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T16 | 입력 핸들러 | `src/input/keyboard.js` | P1 | 0.1일 |
| T17 | 스타일 + 진입 | `index.html`, `styles/tokens.css`, `main.css`, `src/main.js` wire-up | P0 | 0.5일 |

**합계 추정: 약 4.1일** (자비스 작업 시간 단순 합. 단계 6 검증 / 단계 7 QA 별도).

# 4. 의존성 그래프 (작업 순서)

```
T1 (데이터 SSOT)
  ├──► T2 (PRNG)
  ├──► T7 (테스트, 병행)
  └──► T15 (storage fallback, T1.storage.js 보강)

T2 ──► T3 (박스, 셔플 시 PRNG 필요)
        └──► T4 (추첨)
              └──► T5 (DC, 추첨 후 응모권 누적)
              └──► T6 (이력, 추첨 결과 적재)

T1, T2~T6 완료 ──► T7 (모든 core 단위 테스트)

T1 + (T7 일부 통과) ──► T8 (렌더 베이스)
T8 ──► T9, T10, T11, T12, T13, T14, T15
                                    └──► T16 (키보드)
T8~T16 ──► T17 (wire-up + 스타일)
```

# 5. 작업 순서 권고

5.1. **Day 1 (4시간)**: T1 → T2 → T3 → T4 → T7 (T1~T4 부분).
5.2. **Day 2 (4시간)**: T5 → T6 → T7 (잔여) → T15 storage fallback 보강.
5.3. **Day 3 (4시간)**: T8 → T9 → T10 → T11.
5.4. **Day 4 (4시간)**: T12 → T13 → T14 → T16 → T17.

(단일 작업자 기준 단순 시퀀스. 병렬 가능 항목은 T1↔T7 / T9↔T10 / T11↔T12 등.)

# 6. 절대 규칙 정합 (CLAUDE.md 4장)

| 규칙 | 본 플랜에서의 강제 |
|---|---|
| 4.1 로직 / 렌더 분리 | core / render 폴더 분리 (T2~T6 vs T8~T15) |
| 4.2 매직 넘버 금지 | T1 numbers.js / colors.js로 SSOT. T2~T17은 import만 |
| 4.3 core DOM 금지 | T2~T6 모두 DOM/window/document/localStorage 미참조 강제 |
| 4.4 핵심 로직 변경 시 테스트 갱신 | T7로 단위 테스트 동시 작성 |
| 4.5 docs / 코드 충돌 시 docs 우선 | T1~T17 작성 시 docs/01_spec, 02_data, 03_architecture를 1차 출처로 |
| 4.6 사행성 금지 | UI 카피에 "확률 향상" / "필승" 등 금지어 0건 |
| 4.7 8단계 파이프라인 준수 | 본 단계가 4 impl_plan |
| 4.8 추정 플래그 보존 | numbers.js에 `BOX_SIZE_ESTIMATED` / 등급별 매수 추정 플래그 export |

# 7. 단계 6 통과 게이트 (사전 알림)

`docs/05_pipeline.md` 2.6 단계 6 게이트 = subagent 격리 검증 + core/ 100% suite pass + 매직 넘버 0개. 본 플랜의 정적 검사식(03_architecture 5장)이 직접 게이트 검증식이 됨.

# 8. 리스크

8.1. **storage.js 메모리 fallback 분기 누락**: `localStorage` 호출이 모든 곳에서 try-catch로 감싸지지 않으면 사용자 안내가 동작 안 함. 단계 6 검증식 5.1에 fallback 분기 grep 추가 권장.
8.2. **Mulberry32 32비트 시드 한계**: 사용자가 32비트 초과 시드 입력 시 자동 마스킹 정책. T2 random.js에서 `seed >>> 0` 처리.
8.3. **DC 풀 추정 가정의 사용자 혼선**: `DC_POOL_SIZE_DEFAULT` 5000 가정이 화면에 노출되는 위치를 단계 5 T12에서 명시 (예: DC 탭 헤더 또는 추정 배지).
8.4. **확장 인터페이스 부재**: M2~M5 확장 시 `lineup` 객체 스키마가 호환되도록 `core/box.initBox(seed, boxRound, lineup)` 시그니처가 다중 라인업 대응 가능해야 함. T1 / T3에서 lineup 입력 인터페이스를 lineups.json 스키마와 1:1 매칭하도록 설계.

# 9. 사용자 승인 항목

9.1. 17개 태스크 분할 / 우선순위에 동의?
9.2. 4.1일 추정 / Day 1~4 시퀀스에 동의?
9.3. `docs/03_architecture.md` 본체 갱신 내용에 동의?
9.4. 단계 5 implement 진입 승인?

승인 받으면 단계 5 implement (T1부터 시작)로 진입.
