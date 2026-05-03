# Kuji 진행 로그

# 1. 현재 상태

1.1. **현재 스프린트**: M1-base-system.
1.1. **현재 스프린트**: M2-ux-redesign.
1.2. **현재 단계**: 5 implement 재구현 (사용자 정보 구조 재설계 요구 반영). **라이브 서버 시각 컨펌 대기**.
1.3. **시작**: 2026-05-02.
1.4. **마지막 갱신**: 2026-05-02 (M1 종료, M2 1 plan 작성).

# 2. 스프린트 추적

| 스프린트 | 이름 | 단계 진행 | 상태 |
|---|---|---|---|
| M0 | 클로드코드 환경 셋업 | 단순 셋업 (8단계 미적용) | 완료 |
| M0.5 | 도메인 리서치 | 단순 조사 (8단계 미적용) | 완료 |
| M1 | base-system + 一番くじ ドラゴンボール | 1~7 ✅ / 8 ✅ (UX 결함 백로그 + M2 후보 등재) | **종료 (기능 정합 / UX 미완)** |
| **M2** | ux-redesign | 1 ✅ / 2 ✅ → 3 (3차) ✅ / 4 ✅ / **5 ✅ (23 태스크 / 약 25 신규 파일)** / 6 / 7 / 8 | **진행 중** |

# 3. 단계 스킵 사유

3.1. **M0 / M0.5**: 파이프라인 도입 이전 작업. 8단계 미적용. 단순 환경 셋업 + 리서치라 전 단계 게이트 의미 없음.

# 4. 변경 이력

## 4.1. 2026-05-02 - M0 셋업

4.1.1. `.claude/settings.local.json`, `CLAUDE.md`, `PROGRESS.md`, `README.md`, `docs/01-04` placeholder 생성. lotto 패턴 차용.

## 4.2. 2026-05-02 - M0.5 도메인 리서치

4.2.1. `research/01_systems.md` - 시스템 카테고리 분류 + 인기 순위.
4.2.2. `research/02_top_systems.md` - 상위 5종 메커닉 상세.
4.2.3. `research/03_lineups.md` - 시스템별 핫 라인업.
4.2.4. `research/lineups.json` - 라인업 SSOT JSON.
4.2.5. `research/04_korea_availability.md` - 한국 입수 가능성 6종.

## 4.3. 2026-05-02 - 8단계 파이프라인 도입 + M1 시작

4.3.1. `docs/05_pipeline.md` 신설.
4.3.2. `CLAUDE.md` 갱신 - 시뮬레이터 복귀 + M1 + 파이프라인 절대 규칙.
4.3.3. `PROGRESS.md` 갱신 - 스프린트 추적 형식.
4.3.4. `docs/pipeline/M1-base-system/00_checklist.md`, `01_plan.md` 생성.

## 4.4. 2026-05-02 - M1 단계 1 plan 사용자 승인

4.4.1. 사용자 "승인" 응답 (2026-05-02). 단계 2 진입.

## 4.5. 2026-05-02 - M1 단계 2 design 작성 (1차)

4.5.1. `docs/01_spec.md` 본체 갱신 (placeholder 교체). 4탭 모델 / 메커닉 5.1~5.8 / 시나리오 / 엣지 케이스.
4.5.2. `docs/02_data.md` 본체 갱신 (placeholder 교체). 라인업 SSOT (一番くじ ドラゴンボール) / 등급별 매수 검증식 / 색상 / 스토리지 키.
4.5.3. 매직 넘버 SSOT 변환: BOX_SIZE=80 / LINEUP_PRICE_JPY=790 / DC_WINNERS_TOTAL=50 / DC_POOL_SIZE_DEFAULT=5000 / 등급별 매수 표.

## 4.6. 2026-05-02 - M1 단계 3 1차 검증 실패 + 단계 2 재작업

4.6.1. subagent 격리 검증 (general-purpose) 결과 실패. 모순 2건 + 누락 4건. 보고서 `docs/pipeline/M1-base-system/03_design_review.md` 작성.
4.6.2. 발견 사항 6건 본체 docs 반영:
   - **C1**: `02_data 1.4.2` I상 표기 괄호 복원 `クリアポスター (A3)` / `클리어 포스터 (A3)`.
   - **C2**: `01_spec 5.2.4` 등급 표기 정책 명문화 + 5.2.3 "G상" → "G등급".
   - **M1**: `01_spec 5.7.4` 박스 리셋 시 `box_round` += 1 + 시드 변경 시 `BOX_ROUND_INITIAL` 리셋 룰 추가. 6.4 / 6.5 시나리오 본문 정합 갱신.
   - **M2**: `01_spec 4장 시트/모달` `localStorage 비활성 안내` 추가 + 7.4 보강.
   - **M3**: `01_spec 4장 추첨 탭` `くじ券回収貼付け表` 한국어 의미 병기.
   - **M4**: `01_spec 4장 설정 탭` 라인업 정보에 가격 / 캠페인 종료일 추가.
4.6.3. 단계 3 2차 재검증 진행.

## 4.7. 2026-05-02 - M1 단계 3 2차 검증 실패 + 사용자 명시 승인 + 3차 라운드

4.7.1. subagent 2차 격리 검증 결과 실패. 모순 2건 (C2-R2-1, C2-R2-2). 보고서 `docs/pipeline/M1-base-system/03_design_review_round2.md` 작성.
4.7.2. 자동 재시도 1회 룰(`CLAUDE.md` 2.4 / `docs/05_pipeline.md` 6.4) 소진. 사용자 핸드오프.
4.7.3. 사용자 (2026-05-02): "권고대로 진행" → 옵션 (a) 명시 승인. 자동 재시도 룰 초과 1회 명시 승인 + 3차 라운드 진행.
4.7.4. 발견 사항 2건 본체 docs 반영:
   - **C2-R2-1**: `02_data 2.1` 본문 "A상" / "J상" → "A등급" / "J등급" + 등급 표기 정책 출처 명시.
   - **C2-R2-2**: `01_spec 4장` `くじ券回収貼付け表` 한국어 직역 `쿠지권 회수 첨부표` 추가. 8.2 변경 이력 표현 "한국어 의미 병기" → "한국어 직역 + 1줄 의미 설명" 정정.
4.7.5. 8장 변경 이력 시간순 정합 (8.2 → 8.3) 보강.
4.7.6. 단계 8 improve 학습 후보: subagent 격리 검증의 강박 / 정확성 캘리브레이션.

## 4.8. 2026-05-02 - M1 단계 3 3차 통과 + 단계 4 작성

4.8.1. subagent 3차 격리 검증 결과 **통과**. 모순 0개 + 누락 0개. 보고서 `docs/pipeline/M1-base-system/03_design_review_round3.md` 작성.
4.8.2. 단계 3 게이트 클리어. 단계 4 impl_plan 진입.
4.8.3. `docs/03_architecture.md` 본체 갱신 (placeholder 교체).
4.8.4. `docs/pipeline/M1-base-system/04_impl_plan.md` 작성. 17개 태스크 분할.
4.8.5. 단계 4 사용자 승인 (2026-05-02 "승인").

## 4.9. 2026-05-02 - M1 단계 5 implement 완료

4.9.1. T1~T7 (코어 + 데이터 + 테스트) 21 파일 작성:
   - `src/data/numbers.js`, `colors.js`, `storage.js`
   - `src/core/random.js`, `hash.js`, `box.js`, `draw.js`, `last_one.js`, `double_chance.js`, `history.js`
   - `tests/test.html`, `runner.js`, `core.js` + `tests/suites/` 8개 (random / hash / box / draw / last_one / double_chance / history / storage)
4.9.2. T8~T17 (렌더 + 입력 + 진입 + 스타일) 21 파일 작성:
   - `src/render/main.js`, `header.js`, `bottom-tabs.js`, `draw-tab.js`, `tier-grid.js`, `history-tab.js`, `dc-tab.js`, `settings-tab.js`
   - `src/render/modal.js`, `result-modal.js`, `last-one-modal.js`, `dc-result-modal.js`, `confirm-modal.js`, `disclaimer-sheet.js`, `storage-fallback-sheet.js`, `estimated-badge.js`
   - `src/input/keyboard.js`, `src/main.js`, `index.html`, `styles/tokens.css`, `styles/main.css`
4.9.3. 자비스 자체 정적 검증: `src/core/` 의 `document` / `window` / `localStorage` / `Canvas` 사용 0건 (주석 1건 제외) 확인.
4.9.4. 단계 6 impl_review 진입.

## 4.10. 2026-05-02 - M1 단계 6 1차 검증 실패 + 자동 정정 + 2차 재검증

4.10.1. subagent 1차 격리 검증 결과 실패. 결함 5건 (D-1~D-5). 보고서 `docs/pipeline/M1-base-system/06_impl_review.md` 작성.
4.10.2. CLAUDE.md 4.5 "docs와 코드 충돌 시 docs 우선" 적용. 코드를 docs(03_architecture 3.3~3.5)에 맞춤:
   - **D-1/D-2/D-3**: `core/box.initBox(seed, boxRound, lineup)`, `core/draw.drawOne(boxState, rng, lineup)`, `core/last_one.lastOnePrize(lineup)` 시그니처 정정. `numbers.js` 에 `LINEUP` 객체 derive 추가. 02_data 1.4.5 신설.
   - **D-4**: `numbers.js` 에 `HISTORY_RECENT_LIMIT = 50` 추가. `history-tab.js:46` 정정. 02_data 1.5 신설.
   - **D-5**: `numbers.js` 에 `PERCENT_BASE = 100`, `PERCENT_DISPLAY_DECIMALS = 2` 추가. `src/render/format.js` 헬퍼 신설(`formatPercent`). `dc-tab.js`, `dc-result-modal.js` 호출 변경.
4.10.3. 테스트 동기화: `box.test.js`, `draw.test.js`, `last_one.test.js` 가 `LINEUP` 인자 전달하도록 갱신.
4.10.4. 단계 6 2차 재검증 진행.

## 4.11. 2026-05-02 - M1 단계 6 2차 검증 실패 + 사용자 명시 승인 + 3차 라운드

4.11.1. subagent 2차 격리 검증 결과 실패. 모순 1건 (C-R2-1) + 결함 3건 (D-R2-1 P1 / D-R2-2 P2 / D-R2-3 P0). 보고서 `docs/pipeline/M1-base-system/06_impl_review_round2.md`.
4.11.2. 자동 재시도 1회 룰 소진. 사용자 핸드오프.
4.11.3. 사용자 (2026-05-02): "권고대로 진행" → 옵션 (a) 명시 승인. 3차 라운드.
4.11.4. 발견 사항 4건 본체 정정:
   - **D-R2-3 (P0)**: `src/render/main.js` dispatch.reset_box / set_seed 의 `initBox(state.seed, state.boxRound)` → `initBox(state.seed, state.boxRound, LINEUP)` 정정. 1차 정정 시 ensureBoxState replace_all 패턴이 좁아 누락된 2곳.
   - **D-R2-1 (P1)**: `src/data/numbers.js` 1.2 에 `PRNG_OUTPUT_DIVISOR = Math.pow(2, PRNG_OUTPUT_BITS)` 추가. `src/core/random.js` 가 import. 02_data 1.2 갱신.
   - **D-R2-2 (P2)**: `src/data/colors.js` 에 `COLOR_TIER_FALLBACK = "#94A3B8"` 추가. `src/render/history-tab.js` 가 import. 02_data 2.2 갱신.
   - **C-R2-1 (P2 모순)**: `src/data/numbers.js` 1.2 에 `BOX_ID_HEX_LENGTH = PRNG_OUTPUT_BITS / 4` 추가. `src/core/hash.js` 가 import. `HEX_RADIX = 16` 지역 const 추가. 02_data 1.2 갱신.
4.11.5. 단계 8 improve 학습 후보 (4.11.5):
   - 시그니처 변경 시 `replace_all: true` + 사후 grep 검증 의무화.
   - 자비스 자체 grep으로 명백한 매직 넘버를 subagent 호출 전에 셀프 정정.
   - 6.5 백로그: core/history.tierCounts 의 lineup 인자 추가 검토 (M2~M5 다중 라인업), styles/main.css 의 인라인 hex tokens.css 변수화.
4.11.6. 단계 6 3차 재검증 진행.

## 4.12. 2026-05-02 - M1 단계 6 3차 검증 + 자체 검증 통과 + 단계 7 진입

4.12.1. subagent 3차 격리 검증 결과 결함 1건 (D-R3-1, P2). 보고서 `docs/pipeline/M1-base-system/06_impl_review_round3.md` 작성. 9/10 항목 통과.
4.12.2. 사용자 (2026-05-02): "권고대로 진행" → 옵션 (c). D-R3-1 자비스 자체 정정 + 자체 grep 검증 후 단계 7 명시 진입.
4.12.3. 정정: `tests/suites/double_chance.test.js` 에 `DC_WINNERS_TOTAL` / `DC_POOL_SIZE_DEFAULT` / `BOX_SIZE` import 추가 + 인라인 50/5000/80 → 상수 치환. 자체 grep `\b(50|5000|80)\b` 검색 결과 0건 확인.
4.12.4. 단계 6 통과 (자비스 자체 grep + 3차 라운드 9/10 통과 + 1건 자체 정정).
4.12.5. 단계 8 improve 학습 후보 (4.12.5):
   - 4.11.5 항목 외 추가: 단계 6 검증 범위에 `tests/` 매직 넘버 검사 명시 강화.
4.12.6. 단계 7 QA 진입.

## 4.13. 2026-05-02 - M1 단계 7 QA 정적 통과 + 사용자 UX 결함 보고 + M1 종료

4.13.1. `docs/pipeline/M1-base-system/07_qa.md` 작성. 시나리오 6.1~6.5 + 엣지 7.1~7.5 코드 정합 모두 O. 자비스 정적 검증 게이트 10/10 통과.
4.13.2. 사용자 브라우저 실행 (2026-05-02). UX 결함 6건 보고:
   - UX-1: 다크 테마 클로드코드 풍 → Light 테마.
   - UX-2: 전체 UI 톤 변경.
   - UX-3: 하단 탭 SVG 아이콘.
   - UX-4: 추첨 버튼 단일 → 복권 구매 + 한 장씩 뜯기.
   - UX-5: 등급별 표시 → 상품 이미지 + 뜯은 복권 오버레이 + 게이지 + 아코디언.
   - UX-6: Last One ↔ 잔여 쿠폰 효과적 시각화.
4.13.3. 단계 8 improve로 백로그 등재 후 M1 종료 판정 (기능 정합 / UX 미완).

## 4.14. 2026-05-02 - M1 단계 8 improve 종료 + M2-ux-redesign 시작

4.14.1. `docs/pipeline/M1-base-system/08_improve.md` 작성. UX 결함 6건 + 운영 학습 4건 + 코드 백로그 2건 등재.
4.14.2. M2 스프린트 후보 결정 (사용자 승인): 작업 단위 (b) M2 스프린트 신설, 상품 이미지 (i) 자비스 SVG 자체 제작, 구매 단위 (iii) 1/3/10 quick + 자유 입력.
4.14.3. M2-ux-redesign 디렉토리 생성 + 00_checklist + 01_plan 작성.

## 4.6. 결정 default

4.6.1. 작업 단위: 혼합 (스프린트 + 기능 단위).
4.6.2. 산출물 위치: 본체 docs는 SSOT 유지, 단계별 메타는 `docs/pipeline/<sprint>/` 분리.
4.6.3. 단계 스킵: 사유 PROGRESS.md 명시 의무.
4.6.4. subagent 격리 검증: 단계 3 / 6 모두 적용.

# 5. 백로그

(M1 종료 시 채움. 현재 비어 있음.)
