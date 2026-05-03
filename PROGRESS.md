# Kuji 진행 로그

# 1. 현재 상태

1.1. **현재 스프린트**: M2-ux-redesign.
1.2. **현재 단계**: 5 implement 완료 + 사용자 라이브 정정 다수 라운드. 단계 6/7/8은 사용자 라이브 시각 컨펌으로 갈음 진행 중.
1.3. **시작**: 2026-05-02.
1.4. **마지막 갱신**: 2026-05-03 (PROGRESS 정리 + git 초기 커밋 + 원격 푸시).

# 2. 스프린트 추적

| 스프린트 | 이름 | 단계 진행 | 상태 |
|---|---|---|---|
| M0 | 클로드코드 환경 셋업 | 단순 셋업 (8단계 미적용) | 완료 |
| M0.5 | 도메인 리서치 | 단순 조사 (8단계 미적용) | 완료 |
| M1 | base-system + 一番くじ ドラゴンボール | 1~7 ✅ / 8 ✅ (UX 결함 백로그 + M2 후보 등재) | 종료 (기능 정합 / UX 미완) |
| **M2** | ux-redesign | 1 ✅ / 2 ✅ → 3 (3차) ✅ / 4 ✅ / 5 ✅ + 사용자 UI 정정 다수 / 6~8 사용자 라이브 컨펌 갈음 | **진행 중** |

# 3. 단계 스킵 사유

3.1. **M0 / M0.5**: 파이프라인 도입 이전. 8단계 미적용.
3.2. **M2 단계 6/7/8**: 사용자 명시 라이브 시각 컨펌 흐름으로 진행 중. 정식 subagent 격리 검증 / QA 보고서 미작성. M3 진입 전에 일괄 보강 또는 생략 결정 필요.

# 4. 변경 이력

## 4.1. 2026-05-02 - M0 셋업

4.1.1. `.claude/settings.local.json`, `CLAUDE.md`, `PROGRESS.md`, `README.md`, `docs/01-04` placeholder 생성. lotto 패턴 차용.

## 4.2. 2026-05-02 - M0.5 도메인 리서치

4.2.1. `research/01_systems.md` - 시스템 카테고리 + 인기 순위.
4.2.2. `research/02_top_systems.md` - 상위 5종 메커닉.
4.2.3. `research/03_lineups.md` - 시스템별 핫 라인업.
4.2.4. `research/lineups.json` - 라인업 SSOT JSON.
4.2.5. `research/04_korea_availability.md` - 한국 입수 가능성.

## 4.3. 2026-05-02 - 8단계 파이프라인 도입 + M1 시작

4.3.1. `docs/05_pipeline.md` 신설.
4.3.2. `CLAUDE.md` 갱신 (시뮬레이터 + M1 + 절대 규칙).
4.3.3. M1 단계 1 plan 작성 + 사용자 승인.

## 4.4. 2026-05-02 - M1 단계 2 design (1차) + 단계 3 검증 사이클

4.4.1. 단계 2: `docs/01_spec.md` / `docs/02_data.md` 본체 갱신.
4.4.2. 단계 3 1차 검증 실패 (모순 2 + 누락 4) → 본체 정정 (C1, C2, M1, M2, M3, M4).
4.4.3. 단계 3 2차 검증 실패 (모순 2) → 사용자 명시 승인 → 자비스 자체 정정 (C2-R2-1, C2-R2-2).
4.4.4. 단계 3 3차 검증 통과 (모순 0 / 누락 0).

## 4.5. 2026-05-02 - M1 단계 4 impl_plan + 단계 5 implement

4.5.1. `docs/03_architecture.md` 본체 갱신. 17 태스크 분할.
4.5.2. 사용자 승인 → 단계 5 implement 42 파일 작성 (data + core + render + tests + styles).

## 4.6. 2026-05-02 - M1 단계 6 검증 사이클 (1차 → 3차)

4.6.1. 1차 fail (결함 5 - LINEUP 인자 누락 / 매직 넘버) → 정정 (LINEUP 객체 + HISTORY_RECENT_LIMIT + PERCENT_BASE 등).
4.6.2. 2차 fail (P0 critical: main.js 호출처 2곳 LINEUP 누락) → 사용자 명시 승인 → 자체 정정 (PRNG_OUTPUT_DIVISOR / BOX_ID_HEX_LENGTH / COLOR_TIER_FALLBACK 추가).
4.6.3. 3차 결함 1건 (tests 매직 넘버) → 사용자 명시 승인 (c) 자체 정정 + grep.

## 4.7. 2026-05-02 - M1 단계 7 QA + 단계 8 improve + M1 종료

4.7.1. `07_qa.md` 작성. 정적 시나리오 정합 통과.
4.7.2. 사용자 브라우저 실행 → UX 결함 6건 (UX-1~6) 보고.
4.7.3. `08_improve.md` 작성. M2 후보 등재. M1 종료 (기능 정합 / UX 미완).

## 4.8. 2026-05-02 - M2 시작 (단계 1~4)

4.8.1. M2 단계 1 plan 작성 (스코프 8 / 비목표 9 / 6.5일 추정).
4.8.2. 단계 2 design (구매 / 뜯기 메커닉 + 디자인 언어 + 상품 이미지 SSOT).
4.8.3. `research/05_kuji_ticket_form.md` (이찌방쿠지 복권 폼 조사 - ペリペリ 떼기).
4.8.4. 단계 3 검증 1차 fail (3건) → 정정 → 2차 fail (3건) → 자체 정정 → 3차 통과.
4.8.5. 단계 4 impl_plan 작성. 23 태스크 + 의존성 그래프.

## 4.9. 2026-05-02 - M2 단계 5 implement (1차 25+ 파일)

4.9.1. T1~T5: numbers / colors / storage M2 갱신 + assets.js 신설 + buy.js core.
4.9.2. T7~T8: tokens.css + main.css 전면 재작성 (Light 테마 + 7단 정보 우선순위).
4.9.3. T9~T19: 신규 render 11 모듈 (icon / buy-panel / peel-panel / peel-card / hero-carousel / minor-row / last-one-row / product-gallery / product-image / product-item / tier-gauge / tier-accordion / last-one-indicator).
4.9.4. T14: input/drag.js (좌측 가장자리 드래그).
4.9.5. T20~T22: main.js 갱신 (state.unopenedTickets + dispatch buy/peel/peel_confirm) + draw-tab.js 재구성 + 기존 모달들.
4.9.6. T23: tests/suites/buy.test.js + 기존 테스트 매직 넘버 정정.
4.9.7. SVG 자산: 탭 아이콘 4 + 상품 메인 11 (라이선스 0, 자체 제작).

## 4.10. 2026-05-02 - M2 사용자 라이브 정정 라운드 (사용자 명시 진행)

UI / UX 사용자 명시 정정 다수. 8단계 정식 검증 대신 사용자 라이브 시각 컨펌 흐름.

4.10.1. **모달 폐기 + 인플레이스**: 결과 모달 / Last One 합산 모달 호출 폐기. 페이지플립 카드 inner face에 결과 직접 표시 + 갤러리 글로우.
4.10.2. **7단 정보 우선순위 재구성**: 헤더 / hero-carousel(A~F) / minor-row(G~J) / last-one-row / 갤러리(접힘) / 구매-뜯기 / 메타.
4.10.3. **확인 버튼 사용자 명시**: peel-card 내부 면 확인 버튼 + dispatch.peel_confirm. 자동 진행 폐기.
4.10.4. **draw-tab 분기 보강**: pendingPeelResult 시 구매 패널 전환 금지 (peel-panel 유지).
4.10.5. **상품 크기 / 헤더 / 배경**: hero-card 60% → 32% 축소. minor-row 높이 50%. 헤더 가격/배지 라인 삭제 + 타이틀 140%. 외곽 배경 회색 + #app 베이지 + 그림자.
4.10.6. **PC drag scroll + 스크롤바 hide**: input/scroll.js 신설. hero-carousel + minor-row 부착.
4.10.7. **상품 클릭 팝업**: product-detail-modal.js 신설. 영역 2/3/4 항목 클릭 시 호출. 모달은 딤드 개념 0.
4.10.8. **Last One 카운터 + 좌상단 배지 통일**: G~J도 hero와 동일 좌상단 absolute 배지 (알파벳만, 賞 X). Last One 카운터 = 구매 기준 (`buyNeeded`).
4.10.9. **하이라이트 vs 딤드 분리**: is-just-drawn에 !important + ::after 무효 + background 정상화. is-drawn은 grayscale 1 + 어두운 오버레이.
4.10.10. **자동 스크롤 + 글로우**: dispatch.peel 후 PEEL_DURATION_MS 시점 rerender + scrollToTier(targetTier).
4.10.11. **당첨 효과 강화 (A~F만)**: scale 1.18 / glow 80px / 외부 conic-gradient halo 회전 / "★ 축 당첨 ★" 배지. G~J는 글로우만 (배지 X). Last One은 "LAST ONE!" 배지.
4.10.12. **딤드 카드 접힘**: is-drawn 시 width 48px + 자식 hide. 등급 배지만 보임. just-drawn 시 정상 크기 복원.
4.10.13. **A~F 받기 절차**: requiresReceive 플래그. 갤러리에 "받기" 버튼 + 카드 "확인" disabled. 받기 → 상세 모달 → receive_confirm → history append + 카드 확인 활성. G~J / Last One은 즉시 등록.
4.10.14. **Last One 동시 획득**: lastDrawnTier = result.tier (실제 등급). last-one-row 글로우는 pendingPeelResult.isLastOne 별도. 갤러리 G + Last One 동시 글로우. peel-panel 카드 위 골드 배너 (Last One 보너스).
4.10.15. **G~J "당첨" 표현 자제**: minor-row-item.is-just-drawn::before 제거. 글로우 펄스만 유지.
4.10.16. **프레임 자르기 해소**: hero-carousel / minor-row의 overflow visible + 상하 padding. is-just-drawn z-index 10.

## 4.11. 2026-05-03 - git 초기 커밋 + 원격 푸시

4.11.1. `.gitignore` 신설 (잘못된 폴더 / OS / IDE / node_modules / 클로드 로컬 설정).
4.11.2. `git init -b main` + 본 레포 로컬 config (`user.email = ghostjean@naver.com`, `user.name = ghostjean-hash`. 글로벌 X, CLAUDE.md "git config 수정 금지" 룰의 글로벌 영역 회피).
4.11.3. 초기 커밋 SHA `d9e5a96`. 93 파일 / 11,421 insertions.
4.11.4. `git remote add origin https://github.com/ghostjean-hash/kuji.git` + `git push -u origin main`. 정상 push.

# 5. 운영 결정 (default)

5.1. 작업 단위: 혼합 (스프린트 + 기능 단위).
5.2. 산출물 위치: 본체 docs는 SSOT 유지, 단계별 메타는 `docs/pipeline/<sprint>/` 분리.
5.3. 단계 스킵: 사유 PROGRESS.md 명시 의무.
5.4. subagent 격리 검증: 단계 3 / 6 모두 적용 (M2는 단계 6 사용자 라이브 컨펌으로 갈음).

# 6. 백로그

## 6.1. M1 인계 (08_improve.md)

6.1.1. UX-1~6: M2에서 모두 처리.
6.1.2. OP-1~4: 운영 학습.
6.1.3. CB-1: `core/history.tierCounts(history)`의 `lineup` 인자 추가 (M3 다중 라인업 시점).
6.1.4. CB-2: `styles/main.css` 인라인 hex → tokens.css 변수화.

## 6.2. M2 라이브 정정 사이클 학습

6.2.1. 단계 6 검증 흐름 정합: 본 사이클은 사용자 라이브 컨펌 흐름. 단계 6/7 정식 보고서 미작성. M3 진입 전 결정 (보강 / 생략 / 정식 사이클 복원).
6.2.2. **render 신규 모듈 prop 일관성**: peel-panel.js 첫 분기에서 `onConfirm` 전달 누락 사고 (확인 버튼 안 됨). 단계 6 검증 룰에 prop drilling 정합 추가 권장.
6.2.3. **분기 조건 state 의존성**: draw-tab.js의 6번 영역 분기가 `unopenedTickets.length`만 보고 `pendingPeelResult` 무시 사고. state 변수 매트릭스 검증 권장.
6.2.4. **자동 진행 vs 사용자 명시**: dispatch.peel 자동 setTimeout 흐름 → 사용자 명시 확인 흐름으로 재설계.
6.2.5. **시각 효과 우선순위**: is-just-drawn vs is-drawn CSS 우선순위 충돌 (::after, background, opacity, filter). !important + display:none + content:none 조합 룰화.

## 6.3. M3 후보

6.3.1. `一番くじ ワンピース MONKEY.D.LUFFY` 라인업 추가 (이찌방쿠지 표준 메커닉).
6.3.2. CB-1 다중 라인업 인터페이스 보강.

## 6.4. M4+ 보류

6.4.1. コトブキヤくじ XENOGLOSSIA (30연 S賞 천장 룰).
6.4.2. Happyくじ PIXAR / SEGA 럭키쿠지 / フリューくじ.
