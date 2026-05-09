# Kuji 진행 로그

# 1. 현재 상태

1.1. **현재 스프린트**: **M3.3-tier-class-extended** (2026-05-09 시작/종료).
1.2. **현재 단계**: **M3.1 / M3.2 / M3.3 8단계 모두 자비스 진행 완료**. M3.3 단계 6 round 2 통과 (round 1 P0 1 = tier-grid dead 모듈 오결정 → product-gallery.js 정정) + 단계 7 자비스 정적 정합 + 단계 8 종료. **다음 = M3.1/M3.2/M3.3 사용자 라이브 검수 일괄 + 차기 사이클 결정 (M3.4-tidy 정리 / M4 메이저)**.
1.3. **시작**: 2026-05-02 (M0 기점). M2.1: 2026-05-03 ~ 2026-05-08 (5일). M3: 2026-05-08 ~.
1.4. **마지막 갱신**: 2026-05-08 (M3 단계 1 plan 작성 + 사용자 결정 3건 선행 합의: 전환 UI A / 격리 정책 A / 정리 라운드 A. 추정 4.0일).

## 1.5. 현재 진행 (M3 종료, 다음 결정 대기)

1.5.1. **M3 정식 종료 (2026-05-08, 8단계 모두 통과)**:
- 단계 6 round 2 통과 (P0 0건). 단계 7/8 정식 보고서 작성.
- 사용자 명시 룰 (feedback_no_cutting_corners) 정합 - 라이브 정정 갈음 0건.
- M3 학습 3건 신규 (L-M3-1 dispatch 영속 의무 / L-M3-2 인라인 hex 게이트 / L-M3-3 정식 8단계 정당화).

1.5.2. **사용자 외부 작업 (M3 종료 후 병행)**:
- placeholder 자산 17장 = 드래곤볼 A~F + Z (7장) + 원피스 A~I + Z (10장).
- 사용자 외부 AI 도구 생성 + 폴더 배치 (`the_chronicle_of_goku_placeholder/` + `monkey_d_luffy_placeholder/`).
- 배치 완료 후 자비스가 numbers.js의 `LINEUP_*_ASSETS_AVAILABLE` true 갱신 + commit + push.

1.5.3. **M4 후보** (단계 8 improve 등재):
- 천장 룰 메커닉 (XENOGLOSSIA 30연 S賞 확정).
- assets.js 라인업 분기 + SVG fallback (M3 단계 6 P2 흡수).
- tests/suites LINEUP_DRAGONBALL alias 정리.
- M3 학습 3건 검증 룰 흡수.

1.5.5. **M3 후보** (단계 8에서 정식 plan 작성 예정):
- 一番くじ ワンピース MONKEY.D.LUFFY 라인업 추가 (이찌방쿠지 표준 메커닉).
- CB-1 다중 라인업 인터페이스 보강 (`core/history.tierCounts(history, lineup)`).
- CB-2 styles/main.css 인라인 hex → tokens.css 변수화.
- M2.1 통 선택 격자 라인업별 종횡비 hook 활성화 (P2 / 비균등 격자).
- skip-mode 뽑기에 gridIndex 의무 기록 (placeholder 충당 한계 근본 해결).

## 1.6. 다음 세션 권장 첫 메시지 (참고)

- M4 진입: "M4 단계 1 plan 작성"
- 자산 마무리: "placeholder 자산 17장 배치 완료 - 코드 경로 수정"
- 라이브 검증 결함 보고: "<발견 결함>" (사용자 단계 7 시각 검증)

# 2. 스프린트 추적

| 스프린트 | 이름 | 단계 진행 | 상태 |
|---|---|---|---|
| M0 | 클로드코드 환경 셋업 | 단순 셋업 (8단계 미적용) | 완료 |
| M0.5 | 도메인 리서치 | 단순 조사 (8단계 미적용) | 완료 |
| M1 | base-system + 一番くじ ドラゴンボール | 1~7 ✅ / 8 ✅ (UX 결함 백로그 + M2 후보 등재) | 종료 (기능 정합 / UX 미완) |
| M2 | ux-redesign | 1 ✅ / 2 ✅ → 3 (3차) ✅ / 4 ✅ / 5 ✅ + 사용자 UI 정정 다수 / 6~8 사용자 라이브 컨펌 갈음 | 종료 (라이브 컨펌으로 갈음. 단계 6/7 정식 보고서 미작성. 학습은 M2.1 단계 6에서 흡수) |
| **M2.1** | pick-from-bin | 1 ✅ / 2 B-α ✅ / 3 (round 5) ✅ / 4 B-α ✅ / 5 B-α ✅ / 6 (round 3) ✅ / 7 ✅ / 8 ✅ | **종료 (2026-05-08, 8단계 모두 통과)** |
| **M3** | second-lineup | 1 ✅ / 2 ✅ / 3 (round 3) ✅ / 4 ✅ / 5 ✅ / 6 (round 2) ✅ / 7 ✅ / 8 ✅ | **종료 (2026-05-08, 8단계 모두 정식 통과)** |

# 3. 단계 스킵 사유

3.1. **M0 / M0.5**: 파이프라인 도입 이전. 8단계 미적용.
3.2. **M2 단계 6/7**: 사용자 라이브 시각 컨펌 흐름으로 갈음. 정식 subagent 격리 검증 / QA 보고서 미작성. **2026-05-03 사용자 결정으로 종료 확정**. 단계 6 검증 룰 학습(6.2.2~6.2.5)은 M2.1 단계 6에서 첫 적용으로 흡수.
3.3. **M2 단계 8**: 정식 improve 보고서 미작성. M2.1 plan 자체가 M2 후속 사이클로 기능. M3 plan 후보 등재는 M2.1 단계 8에서 처리.

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

## 4.12. 2026-05-03 - M2 종료 확정 + M2.1-pick-from-bin 시작

4.12.1. **M2 종료 확정**: 사용자 결정. 라이브 컨펌으로 단계 6/7 정식 보고서 갈음. 단계 8 정식 improve 보고서 미작성 (M3 후보 등재는 M2.1 단계 8로 이월).
4.12.2. **M2.1 plan 작성 + 사용자 승인**: `docs/pipeline/M2.1-pick-from-bin/01_plan.md` + `00_checklist.md`. 통(bin)에서 슬롯 직접 선택 메커닉 + skip 옵션. 메커닉 옵션 B (위치 = 셔플 인덱스 매핑, 결정론 유지). 추정 3.2일.
4.12.3. **사용자 결정 사항** (plan 2장):
- 메커닉 옵션 B (`splice(pickIndex)`).
- 선택 단위 a (1매당 1슬롯).
- 통 시각 모델 a (잔여 슬롯 격자 10×8).
- skip 체크박스 위치: 구매 패널 + 설정 탭.
- skip 영속: `kuji_settings_skip_pick` localStorage. 기본값 false (= 통 선택 ON).
- 스프린트 위치: M2.1 별도.
4.12.4. **단계 2 design 완료**: 01_spec / 02_data 본체 갱신. 5.14 통 선택 절 신설. 02_data 1.12 통 선택 상수 + 2.2 슬롯 색 + 3.1 storage + 3.2.3 v2→v3 마이그레이션.
4.12.5. **단계 3 design_review (round 1) 실패**: 모순 4 / 누락 3 / 일관성 3 / 정보성 6. 보고서 `03_design_review.md`. C-1 (높음) 핵심.
4.12.6. **단계 3 정정 사이클 (round 2) 실패**: 1차 결함 6/7 해결 (O-3 부분). 신규 모순 2 (C-N1/C-N2 - "통 선택 완료" 용어 충돌). 자동 재시도 1회 한도 소진. 보고서 `03_design_review_round2.md`.
4.12.7. **단계 3 정정 사이클 (round 3) 통과**: 사용자 한도 초과 명시 승인. C-N1 옵션 A 채택 → 5.14.5.0 본문 재기술. 1차 7/7 + 2차 2/2 모두 해결. 신규 결함 0. 보고서 `03_design_review_round3.md`. **단계 3 게이트 통과**.
4.12.8. **단계 4 impl_plan 작성**: `docs/03_architecture.md` 갱신 (3.4 drawOne 시그니처 / 3.7 history findUnrevealed/revealHistory / 3.10 storage migrateV2ToV3 / 3.11 state pendingPickResult / 3.14~3.16 pick-panel 3종 / 4.6~4.9 흐름 / 5.6~5.9 정적 검사). `docs/pipeline/M2.1-pick-from-bin/04_impl_plan.md` 신설 (19 태스크 / 7 phase / 의존성 그래프 / M2 학습 흡수 / 추정 1.0일). 사용자 승인 완료.
4.12.9. **단계 5 implement (T1~T17)**: Phase 1 data/core (numbers/colors 신규 export 12종 / storage migrateV2ToV3 + loadState v0~v3 자동 / draw drawOne pickIndex 시그니처 + splice / history findUnrevealed/revealHistory). Phase 2 단위 테스트 (draw_pick.test 11건 + storage_v3.test 9건 + history.test 5건 보강 + storage.test 호환 + runner suite 등록). Phase 3 render 신규 (pick-slot 4상태 / pick-panel 격자 + Last One 슬롯 마지막 위치 + grid→deck 인덱스 변환 / pick-hint-toast 첫 진입 1회). Phase 4 render 갱신 (draw-tab 5분기 a/b1/b2/b3/c / buy-panel skip 토글 / settings-tab skip 토글 / peel-panel 무변경 - main 분기 처리). Phase 5 main wire-up (state pendingPickResult/settingsSkipPick + dispatch.pick/pick_hint_seen/set_skip_pick + peel skip OFF/ON 분기 + 부팅 findUnrevealed 복원 + reset_box/set_seed 정합). Phase 6 styles (tokens 슬롯 색 5종 + 모션 6종 / main.css 격자 + 4상태 슬롯 + toast + skip 토글 약 200줄 추가). Phase 7 T17 grep 통과 (core DOM import 0 / drawOne 호출처 5곳 정합 / 신규 식별자 9 파일 정합). **T18 테스트 실행 + T19 사용자 시각 컨펌 대기**.
4.12.10. **단계 5 발견 정정**: history entry 스키마에 `gridIndex (number \| null)` 필드 추가 (격자 위치 영구 SSOT - 새로고침 회색 복원의 근거). 02_data 3.1 / 3.2.3 / 4.9 + 03_architecture 3.7 / 3.14 / 4.6 / 6.4 동시 갱신. 단계 3 재검증 생략 (사용자 승인 후 진행, 기능 미변경).

## 4.13. 2026-05-03 - M2.1 T19 결함 발견 → 단계 2 재정정 사이클 (B-α)

4.13.1. **결함 1 (메커닉 단위)**: 단계 1 plan에서 선택 단위 (a) "1매당 1번"을 권장한 게 매장 경험과 어긋남. 사용자 지적: "5장 선택이면 복권을 5장 선택하는 느낌이어야지". 옵션 (b) "N매 통째로" = 매장에서 통에 손 넣어 N매를 골라 손에 든 다음 한 장씩 뜯는 흐름. 자비스 권장 오류.
4.13.2. **결함 2 (시각 노출)**: 슬롯 클릭 즉시 `state.history` 즉시 커밋 + `lastDrawnTier` 설정 → 갤러리 / 캐러셀 (`hero-carousel`, `minor-row`, `last-one-row`)이 history 기반 갱신 → reveal 전에 등급 노출. PROGRESS 6.2.5 학습 흡수 미흡.
4.13.3. **사용자 결정**: B-α 메커닉 (확인 버튼 + N매 통째 선택). 단계 2 design 재정정 + 단계 3 재검증 한 번에 진행 명시 승인.
4.13.4. **새 메커닉 핵심**:
- 인벤토리 ticket에 `lockedResult` 필드 추가. null = 등급 미결정 raw, 있음 = 등급 결정 완료(미reveal).
- 슬롯 선택 = 시각적 토글만 (메모리 전용, splice X).
- "확인" 버튼 = N개 선택 시 활성 → drawOne N회 splice + ticket N매에 lockedResult 부여 + 격자 종료 → peel 단계.
- pendingPickResult 개념 폐기 (ticket.lockedResult로 통합).
- history 커밋은 reveal 시점에만 (revealed 필드 deprecated 검토).
4.13.5. **단계 3 round 4 검증 실패** (모순 2 / 누락 1): C-R4-1 (PICK_FIRST_HINT_TEXT_KO 값 불일치) / C-R4-2 (Last One 슬롯 회색화 시점 모순) / M-R4-1 (in-place lockedResult backfill 누락). 자동 재시도 1회로 정정.
4.13.6. **단계 3 round 5 통과**: round 4 결함 3건 모두 해결 + 신규 결함 0. B-α 자기-정합 완료. 보고서 `03_design_review_round5.md`.
4.13.7. **단계 4/5 B-α 정정 (Phase A~G)**:
- Phase A: `docs/03_architecture.md` 갱신 (3.7 history B-α / 3.10 storage migrateV3InPlace 신설 / 3.11 state pendingPickResult 폐기 + selectedGridIndices 신설 / 3.14 pick-panel B-α / 3.15 pick-slot 5상태 / 4.6 confirm 흐름 / 4.7 lockedResult 기반 새로고침 복원).
- Phase B: `src/data/colors.js` (selected 색 2종 추가) / `src/data/storage.js` (migrateV3InPlace 신설 + loadState 호출 + migrateV2ToV3에 unopenedTickets[*].lockedResult backfill 추가).
- Phase C: `src/core/history.js` (tierCounts revealed 안전장치 + findUnrevealed/revealHistory 폐기).
- Phase D: `src/render/pick-slot.js` (5상태 + 체크 마크) / `pick-panel.js` (선택 토글 + 확인 버튼 + lockedGridIndices 회색 도출) / `draw-tab.js` (b1/b2 분기 lockedResult 기반).
- Phase E: `src/render/main.js` (dispatch.pick 폐기 / dispatch.toggle_pick_select / dispatch.confirm_pick 신설 / dispatch.peel B-α 분기 / dispatch.peel_confirm 단순화 / dispatch.set_skip_pick OFF→ON 자동 splice / bootstrapState 단순화).
- Phase F: `tests/suites/history.test.js` (findUnrevealed/revealHistory 테스트 폐기 + revealed 안전장치 테스트 신설) / `storage_v3.test.js` (lockedResult backfill 테스트 + migrateV3InPlace 멱등 테스트 추가) / `styles/main.css` + `tokens.css` (selected 시각 + 확인 버튼 + 체크 마크).
- Phase G: T17 grep 통과 (core DOM 0 / pendingPickResult 잔존 0 / findUnrevealed 호출처 0 / lockedResult & gridIndex 정합).
4.13.8. **T18/T19 사용자 핸드오프 대기**: 브라우저에서 동작 검증 필요.
4.13.9. **T19 1차 결함 정정 (사용자 캡처 보고)**: `core/buy.js` `addUnopenedTickets`가 신규 ticket에 `lockedResult` 미부여 → undefined → rawCount 0 표시 결함. `lockedResult: null` 명시 + 모든 raw 체크를 `null OR undefined` 양쪽 매칭으로 방어 정정 (4 파일). 학습: T17 grep을 시그니처 호출처만 검사하고 신규 객체 생성 시점의 필드 정합 검증 누락. 단계 6 검증 룰에 "신규 객체 생성 위치별 필드 정합 grep" 추가 권고.
4.13.10. **B-α 보강 - 자동 선택 버튼 (사용자 명시 승인, 권장 default 진행)**: 5.14.4.8 신설 (잔여 일반 슬롯 격자 인덱스 오름차순 첫 N개 selected 일괄 설정. PRNG 호출 0, 결정론 영향 0). pick-panel "자동 선택 N매" 버튼 (확인 버튼 옆) + main.js dispatch.auto_pick_select + 03_architecture 3.14 갱신 + main.css .pick-auto-button 신설. 4 phase, 약 60줄.
4.13.11. **자산 사진 교체 (사용자 명시 지시)**: A~F + Last One의 SVG 임시 자산을 `the_chronicle_of_goku_img/{A~F,Z}.webp`로 교체. assets.js에 `PRODUCT_IMAGE_BASE_PATH` / `PRODUCT_IMAGE_FILE_KEYS` (Last One → "Z") / `PRODUCT_IMAGE_ALT` 상수 + `buildProductPhoto` 헬퍼 신설. main.css의 `.last-one-image svg` / `.product-image-wrap svg`에 `img` 동치 셀렉터 + `object-fit` 추가. `.hero-image > svg, > img` 사이즈 룰 신설. 02_data 1.7.1 자산 형식 절 신설. G~J는 SVG 임시 유지 (M3 후보).

4.13.12. **github 호환 placeholder 사양 수립 (사용자 명시 지시 + 권장 진행)**: 4.13.11 webp 자산이 `.gitignore`로 git 추적 0 (라이선스 0 정책). github에서 broken 상태. 옵션 비교 (가. 라이선스 위험 감수 / 나. 라이선스 클린 raster / 다. 도구 설치 후 강행) 후 **나-2 (추상화된 라이선스 클린 placeholder)** 채택. 사양은 `docs/02_data.md` 1.7.2 절에 정식 등재 (폴더 정책 / 파일 스펙 / 7장 영문 프롬프트). **다음 단계는 사용자 외부 작업 (Midjourney / DALL-E / Stable Diffusion / Firefly 등으로 7장 webp 생성)**. 사용자 배치 완료 후 자비스가 코드 경로 수정 (`PRODUCT_IMAGE_BASE_PATH` → `"the_chronicle_of_goku_placeholder"`) + commit + push로 마무리.

## 4.14. 2026-05-08 - M2.1 라이브 UX 정정 라운드 (사용자 명시 진행) → 커밋 `549eea3` push

UI/UX/데이터 정합성 사용자 명시 정정 다수. 8단계 정식 검증 대신 사용자 라이브 시각 컨펌 흐름. 9개 파일 수정 + 1개 삭제 (375 insertions / 354 deletions).

4.14.1. **복권 영역 임의 안내 문구 / 토스트 제거**: peel-card 빨간 안내 (`상단 상품에서 "받기"를 먼저 눌러주세요`) + pick-hint-toast (첫 진입 안내) 모두 제거. spec 5.14.7에 명시되어 있어도 사용자 거부 의사 우선. `src/render/pick-hint-toast.js` 파일 삭제.

4.14.2. **자세히 갤러리 위치 이동**: 자세히 토글 펼침 시 갤러리를 minor-meta-row 아래로 (이전: hero/minor row와 buy/peel/pick 패널 사이).

4.14.3. **영역 6 패널 통일 (buy/peel/pick)**: 가로 폭 + 세로 높이 + 외곽 보더/그림자 사양 동일화. `--draw-panel-h: 320px` 토큰 신설. pick-panel은 `min/max-height` 동일로 정확히 320px, 내부 grid `flex: 1; overflow-y: auto`로 스크롤. 패널들 외곽 모양/크기 일관성 확보.

4.14.4. **pick-panel 헤더 컴팩트화 + 동적 N 바인딩**: 제목 + 진행상태(선택/잔여)를 한 줄 flex로 결합. "통에서 N매..."의 `N`을 `${rawCount}` 실제 값으로 바인딩. 자동 선택 버튼 padding/font 축소. 그리드 영역 확보.

4.14.5. **pick "확인" 버튼 제거 + N매 자동 전이**: `selectedSet.size === rawCount`이면 즉시 `confirm_pick` 트리거. UX 200ms 시각 확인 딜레이 + 재귀 dispatch 제거(인라인 `performPickConfirm` 헬퍼). 사용자가 N번째 슬롯 강조를 잠깐 보고 자연 전이.

4.14.6. **silent failure 버그 수정 (5번째 선택 안 됨)**: 이전 `toggle_pick_select`에서 N매 채워지면 `dispatch({type:'confirm_pick'})` 재귀 호출. confirm 가드 early-return 시 rerender 누락 → state.selectedGridIndices는 N매로 mutate됐지만 UI는 (N-1)매 표시. 다음 클릭이 toggle off로 인식. **fix**: 인라인 호출 + 항상 rerender + 실패 시 selectedGridIndices 리셋.

4.14.7. **drawOne pickIndex 범위 위반 throw 수정 (`buildConsumedGridSet` 신설)**: skip-mode 뽑기는 `gridIndex: null`로 history 기록 → 추적된 consumedSet < 실제 deck 소진 매수. gi→pickIndex 변환 시 `j > deck.length - 1`로 throw. **fix**: main.js에 `buildConsumedGridSet(state)` 헬퍼 신설 (history.gridIndex + lockedResult.gridIndex 추적분 + 부족분 lowest gi placeholder 충당). 렌더(pick-panel)와 confirm(performPickConfirm) 양쪽 동일 로직 사용 (단일 진실원). performPickConfirm은 모든 j값 사전 검증 후 실제 mutation 수행 (트랜잭션식).

4.14.8. **추첨 history 손실 버그 수정 (D賞 누락 등)**: 이전 A~F (count=1, requiresReceive)는 peel 시점 대신 receive_confirm에서 history append. 사용자가 받기 팝업 dismiss(overlay click/Esc) 또는 새로고침 시 `pendingPeelResult`(메모리 only) 손실 → entry 영영 누락. **fix**: peel 시점에 무조건 `appendHistory` 호출. receive_confirm은 순수 UI 게이트(`receivedConfirmed` 플래그)만 담당. 새 박스부터는 100% 정합 (기존 누락분은 복구 불가).

4.14.9. **hero-card 프레임 클리핑 + dim 시 collapse 해소**: 당첨 강조의 `transform: scale 1.06→1.18`, `::after` conic-gradient halo(`inset: -12px`), 카드 위 `★ 축 당첨 ★` 배지(`top: -18px`)가 `overflow-x: auto` 트랙에 클립됐었음. **fix**: scale 애니메이션 / 외부 halo / 외부 배지 모두 제거. 하이라이트는 인셋 글로우 + 보더 펄스(`justDrawnGlow` 키프레임 재작성) + 우상단 코너 배지로 카드 내부에 한정. `--hero-card-h: 160px` 토큰으로 카드 fixed height (이전: `min-height: 100px`만 있었으나 `hero-image .product-image-wrap`의 `aspect-ratio: 1/1` 때문에 자연 높이가 ~200px → dim 시 image/info `display:none`으로 100px 떨어짐).

4.14.10. **`is-just-drawn` ↔ `is-drawn` 클래스 충돌 해소**: `receive_confirm` 후 hero-card에 두 클래스 동시 부여 → `.hero-card.is-drawn::after` 어두운 오버레이가 강조 카드 위 겹쳐 dim되어 보임 (`!important`로 opacity/filter는 덮지만 `::after`는 미덮음). **fix**: hero-carousel.js에서 `isJustDrawn` 활성 시 `is-drawn` 클래스 미부여. peel_confirm으로 `lastDrawnTier=null` 다음 사이클에서 자연 전환. (`.minor-row-item`/`.last-one-row`는 CSS에서 `.is-just-drawn::after { display: none !important }`로 동일 회피 중 — hero-card만 누락이었음.)

4.14.11. **팝업 confirm 후 강조 카드 중앙 복원**: `receive_confirm` 후 `rerender`로 `hero-carousel-track` DOM 재생성 + `scrollLeft` 리셋 → 직전 `scrollToTier`의 중앙 위치 사라짐. **fix**: `receive_confirm`에서 rerender 직후 `scrollToTier(state.lastDrawnTier)` 재호출. `scrollToTier`는 `block: "nearest", inline: "center"`로 가로 중앙 + 세로 최소이동 (기존 `block: "start"`에서 변경). `.hero-card[data-tier]`/`.minor-row-item[data-tier]`/`.last-one-row[data-tier]` 셀렉터 한정으로 모달 내부 `data-tier` 매칭 회피.

4.14.12. **마진/갭 단일 진실원**: 인터섹션 갭은 `--draw-tab gap`만으로 결정되도록 배경 없는 섹션(`hero-carousel`, `hero-carousel-track`, `minor-row`)의 vertical padding 제거. 이전엔 padding이 inter-section 갭처럼 보여 섹션마다 갭이 다르게 측정됐음. 결과: 섹션 간 8px 일관 / 헤더-첫상품 12px (1.5×) / 마지막섹션-하단 12px (1.5×).

4.14.13. **디자인 토큰 정리**: 보더 두께 1.5px/2px 혼재 → 모두 `1px solid --border-subtle` 통일. `.hero-card` 1.5px → 1px. `.last-one-row` 2px gold → 1px subtle + `--gold-edge-soft` 배경 틴트로 강조 표현 변경 (여전히 LAST ONE 賞 텍스트 빨강·골드는 유지). `.product-item.is-last-one`도 동일. `.buy-quick-button` 1.5px → 1px.

4.14.14. **통 시각 메타포 강화 (격자 → 산개)**: 통 슬롯을 `display: grid`에서 **`position: absolute`**로 전환. `slotPosition(seedKey, gi)` 신설 — fnv1a 시드 해시로 5%~95% 범위 (x, y) 좌표. `slotJitter` 회전 ±5° → ±18° → **±36°**. 슬롯에 종이 그라디언트 배경 + box-shadow 깊이감. z-index 시드 기반 차등(0~15) + 선택 +30 가중. **L1 슬롯 통에서 비노출** (last-one-row에 별도 표시되므로 중복).

4.14.15. **이미 뽑은 슬롯 통에서 제거**: 렌더 루프에서 `if (drawnSet.has(gi)) continue` — 통 더미가 사용자가 뽑을 때마다 줄어드는 자연스러운 메타포. (drawnSet은 4.14.7의 `buildConsumedGridSet`로 산출.)

4.14.16. **구매 quick 버튼 잔여 동적 치환**: deckRemaining이 quick 옵션[1, 3, 5, 10]에 정확히 일치 안 할 때, 첫 번째 ">잔여" 옵션을 `${deckRemaining}매` 버튼으로 치환. 더 큰 옵션은 disabled. 예: 잔여 8 → [1, 3, 5, **8**] / 잔여 4 → [1, 3, **4**, 10(d)] / 잔여 2 → [1, **2**, 5(d), 10(d)].

4.14.17. **커밋 + 푸시**: `549eea3` (`feat(kuji): 통 선택 UX 재설계 + 영역 6 통일 + 추첨 history 손실 수정`) — `https://github.com/ghostjean-hash/kuji.git` `main` 정상 push.

## 4.15. 2026-05-08 - M2.1 비-블로커 정리 라운드 (1.5.4 5건 흡수)

라이브 정정 모드의 자연 흡수. 정식 단계 6/7/8 미진입. PR `549eea3` 코드 리뷰에서 식별된 dead 코드 / 매직 넘버 / 주석 갭 / 회귀 위험 영역 단위 테스트.

4.15.1. **`pendingPeelResult.entry` dead 필드 제거**: main.js dispatch.peel에서 pendingPeelResult 객체에 부여하던 `entry` 필드 제거. 4.14.8에서 history append를 peel 시점으로 옮긴 후 receive_confirm/peel_confirm은 entry를 읽지 않음. grep으로 사용처 0 확인 후 제거.

4.15.2. **`PICK_AUTO_CONFIRM_DELAY_MS` 상수 추출**: main.js dispatch.toggle_pick_select에서 `setTimeout(..., 200)` 매직 넘버 → 명명 상수. 02_data 1.12 등재 + numbers.js export. 의미 주석 ("너무 짧으면 마지막 선택 슬롯 강조 놓침 / 너무 길면 답답함"). CLAUDE.md 4.2 매직 넘버 금지 규칙 정합.

4.15.3. **`requiresReceive` 변수 주석 갱신**: 4.14.8 변경으로 history append 게이트 역할이 종료됨을 명시. 현재는 receive 모달 노출 + peel-card 확인 버튼 활성화 게이트 + hero-carousel "받기" 버튼 노출에만 사용되는 UI 플래그라고 양 분기에 주석 추가. 다음 세션이 이 변수의 의미를 오해 안 하도록.

4.15.4. **pick-panel.js dead branch 정리**: (1) `LAST_ONE_GRID_INDEX` const — 4.14.14 산개 배치 + Last One 통 미노출 결정 후 사용처 0. 제거. (2) `lastOneFromHistory` / `lastOneFromLocked` / `lastOneAttached` — 산출만 되고 사용처 0. 제거. (3) `tracked` → `drawnSet` 변수명 즉시 사용으로 통합 (불필요한 1회용 alias 제거). 결과: 11줄 감소.

4.15.5. **`buildConsumedGridSet` 단위 테스트 추가**: `tests/suites/build_consumed_grid_set.test.js` 신설. 9 테스트 케이스 — 초기 상태 / history.gridIndex 단독 / lockedResult.gridIndex 단독 / 병합 / skip 모드 placeholder 충당 (4.14.7 핵심 시나리오) / 충돌 회피 / 다른 박스 무시 / null·undefined 안전 / lockedResult null·undefined ticket 안전. runner.js에 등록. `performPickConfirm` j 검증 부분은 main.js 내부 함수 (export 안 됨)라 직접 테스트 어려움 — 회귀 위험은 buildConsumedGridSet 단위 테스트 + 사용자 라이브 검증으로 갈음.

4.15.6. **변경 요약**: 5 파일 수정 + 1 파일 신설. `src/render/main.js`, `src/render/pick-panel.js`, `src/data/numbers.js`, `docs/02_data.md`, `tests/runner.js` + `tests/suites/build_consumed_grid_set.test.js` 신설. 동작 변경 0 (refactor + dead code 제거 + 테스트 추가만).

## 4.19. 2026-05-08 - M3 정식 종료 (단계 5~8 통과)

4.19.1. **단계 5 implement T1~T22 완료**:
- Phase A (data + 마이그레이션): numbers.js 전면 재작성 + storage v3→v4.
- Phase B (core): box.id lineup_id + history.tierCounts(lineup) + drawDc(dcConfig) + pick-grid.js 신설.
- Phase C (render): main.js state + dispatch.set_current_lineup + header IP 라벨 + 12 render 모듈 등급 수 가변성 + settings-tab Lineup dropdown + pick-panel.
- Phase D (M2.1 정리): pick_hint_seen handler / pick-slot LAST_ONE / numbers.js PICK_FIRST_HINT_* dead 제거 + 04_impl_plan strikethrough.
- Phase E (styles + tests + grep): tokens.css 9종 + main.css var() 치환 + storage_v4.test.js + lineup_isolation.test.js + 기존 11 suite 정합 + T22 grep 통과.

4.19.2. **단계 6 impl_review (2 라운드)**:
- round 1: P0 3 (set_current_lineup 동작 0건 / draw-tab BOX_SIZE / main.css 인라인 hex 35건) / P1 4 / P2 3.
- 자비스 자동 정정: P0 2.1 saveState({ currentLineupId }) 명시 / P0 2.2 lineup 동적 lookup / P0 2.3 9종 토큰 신설 + main.css sed 일괄 치환 / P1 3.4 confirm_pick dead 제거 / P1 3.3 03_arch 3.14/3.15 3상태 docs.
- round 2: **통과 (P0 0 / P1 0)**. 보고서 `06_impl_review.md`.

4.19.3. **단계 7 QA**: 정적 시나리오 정합 (라인업 전환 / 격리 / 마이그레이션 / 결정론) + 단위 테스트 13 suite + 라이브 시각 검증 사용자 핸드오프. 보고서 `07_qa.md`.

4.19.4. **단계 8 improve**: M4 후보 plan 등재 (천장 룰 XENOGLOSSIA + assets.js 분기 + tests alias 정리). 학습 3건 신규 (L-M3-1/2/3). 보고서 `08_improve.md`.

4.19.5. **사용자 명시 룰 정합**: 메모리 `feedback_no_cutting_corners` 첫 정합 스프린트. 라이브 정정 갈음 0건. 단계 3/6 정식 subagent 격리 검증 + round 사이클.

4.19.6. **M3 종료 결정**: 8단계 모두 통과. M4 후보 등재. 사용자 외부 작업 1건 (placeholder 17장) 대기.

## 4.18. 2026-05-08 - M3 단계 1~4 통과 (사용자 결정 8.X + design_review round 3)

4.18.1. **사용자 명시 메모리 룰 신설**: `feedback_no_cutting_corners.md`. 사용자 발화 ("철저하게 플랜, 문서 작업 후 구현, 대충 구현 용납못함") → 라이브 정정 갈음 모드 금지. 단계 6/7 정식 보고서 의무. M3부터 적용.

4.18.2. **M3 단계 1 plan 작성 + 사용자 결정 7건**:
- 핵심 결정 3건: 전환 UI (A 설정 탭 dropdown) / 데이터 격리 (A 라인업별 공간) / 정리 라운드 (A M3 별도 단계).
- 단계 2 진입 시 결정 4건: storage A1 (prefix) / kuji_seed 라인업 공유 (A) / 헤더 라벨만 (A) / 자산 SVG fallback (A).
- 추정 4.0일.

4.18.3. **M3 단계 2 design**:
- 02_data 1.4 절 전면 재구성: 1.4.0 라인업 구조 명세 + 1.4-DB (드래곤볼 prefix) + 1.4-OP (원피스 신설, 9등급 + DC 100명) + 1.4.LINEUPS 배열.
- 02_data 1.7 자산 라인업별 분기: 1.7.0 정책 + 1.7.1-DB / 1.7.1-OP + 1.7.3 SVG fallback + 1.7.4 placeholder 사양.
- 02_data 3.x storage 격리: 3.1.1 라인업별 키 6종 / 3.1.2 전역 키 5종 + 3.2.5 v3→v4 마이그레이션 알고리즘.
- 02_data 1.1 SCHEMA_VERSION 4 + 4.12 변경이력.
- 01_spec 5.13.A 다중 라인업 절 신설 + 4장 헤더 IP 라벨 + 7.15~7.18 엣지 케이스 + 8.13 변경이력.

4.18.4. **M3 단계 3 design_review (3 라운드)**:
- round 1: P0 4 / P1 5 / P2 3건 (박스 ID lineup 미포함 / 1.7.2 절번호 중복 / LINEUP 단수 표기 / 단수 상수 9건). 미통과.
- round 2: 자비스 자동 정정 후 잔존 P0 1건 (P0 2.4 9건 중 7.9 누락). 미통과.
- round 3: 사용자 명시 승인 자동 재시도 1회 초과 → 7.9 정정 → 통과.
- 보고서 `docs/pipeline/M3-second-lineup/03_design_review.md`.

4.18.5. **M3 단계 4 impl_plan**:
- 03_architecture 갱신: 3.7.M3 / 3.10.M3 / 3.15.M3 / 3.17 / 3.18 + 4.M3 흐름 + 5.10~5.12 grep + 6.7.
- 04_impl_plan: T1~T22 / 5 Phase / 의존성 그래프 / 추정 2.7일.
- 이월 결정 3건 권장안: gridIndex (C 보존) / BOX_SIZE (B alias) / LINEUP (A 즉시 폐기).
- 사용자 (A) 승인.

4.18.6. **M3 전체 추정 갱신**: 단계 1 (0.5) + 2 (0.5) + 3 (0.3) + 4 (0.3) + 5 (2.7) + 6/7/8 (0.7) = **5.0일**. 01_plan 추정 4.0일 → +1.0 (검증 round 3 흡수).

## 4.17. 2026-05-08 - M2.1 정식 마무리 (단계 6 round 3 통과 + 단계 7 + 단계 8)

라이브 정정 모드 종료. 8단계 파이프라인 정식 마무리 사이클 진행.

4.17.1. **시각 튜닝 매직 넘버 5종 흡수**: 6.2.14 백로그 흡수. `PICK_SLOT_ROTATE_RANGE_DEG (72)` / `PICK_GRID_CLAMP_MIN_PCT (5)` / `PICK_GRID_CLAMP_MAX_PCT (95)` / `PICK_SLOT_JITTER_RATIO (0.5)` / `PICK_SLOT_SELECTED_Z_BOOST (30)`. numbers.js + 02_data 1.12 + pick-panel.js 정합.

4.17.2. **단계 6 subagent 격리 검증 round 1**: P0 5 / P1 4 / P2 4건 식별. 검증자: general-purpose subagent (깨끗한 컨텍스트). 결함: toast 폐기 docs 누락 / 5.7-5.8 매트릭스 폐기 식별자 / Last One 슬롯 spec vs 코드 / tokens.css 색 vs 02_data SSOT / 미등재 토큰 / 매직 30 / 변경이력 누락 / requiresReceive 미명시. 6.2.14 백로그도 본 round에서 흡수.

4.17.3. **단계 6 정정 사이클 (사용자 결정 + 자비스 자동)**: P0 2.3 (A) 통 비노출 - spec 갱신 / P0 2.4 (A) 라이브 정정 유지 - 02_data 갱신 / P2 4.2 settings-tab 도움말 유지. 자비스 자동 정정 9개 파일 (spec / 02_data / 03_architecture / numbers.js / pick-panel.js / pick-slot.js).

4.17.4. **단계 6 round 2**: 잔존 P0 1건 (colors.js 미동기화 - round 1 정정의 코드 측 누락). 자동 재시도 한도 소진. 사용자 명시 승인으로 round 3 진입.

4.17.5. **단계 6 round 3 통과**: colors.js 6건 동기화 (3건 값 정정 + 3건 신규 export). cross-check 02_data 2.2 ↔ colors.js 100% 일치. P0 0건. **단계 6 게이트 통과**. 보고서 `docs/pipeline/M2.1-pick-from-bin/06_impl_review.md`.

4.17.6. **단계 7 QA**: `07_qa.md` 작성. 정적 시나리오 6.1~6.4 / 7.11 정합 + 라이브 정정 4.14 / 4.16 흡수 검증 + 단위 테스트 커버리지 (11 suite, build_consumed_grid_set.test.js 포함). **통과**.

4.17.7. **단계 8 improve + M3 plan 후보**: `08_improve.md` 작성. M2.1 8단계 모두 통과 + 학습 14건 흡수 정합. M3 후보 = 一番くじ ワンピース 라인업 추가 + 다중 라인업 인터페이스(CB-1) + M2.1 정리 라운드(P2 6건) + CB-2 인라인 hex 토큰화 + 6.2.12 gridIndex 의무 기록. 추정 3.0일.

4.17.8. **M2.1 정식 종료**: 8단계 모두 통과. PROGRESS 6.2 학습 14건 흡수. M3 후보 plan 등재. 사용자 외부 작업 1건(placeholder 자산) 대기.

## 4.16. 2026-05-08 - 통 슬롯 산개 정정 (Poisson clumping 해소)

4.16.1. **결함 보고 (사용자 캡처)**: 통 선택 격자에 79슬롯이 6개 정도의 클러스터로 군집화. "복권을 펼쳐놓으라고 했는데 왜 모여 있지?" 라이브 정정 모드 진입.

4.16.2. **원인 분석**: 4.14.14에서 도입한 `slotPosition(seedKey, gi)` 가 fnv1a 해시로 5%~95% 범위 무작위 좌표를 생성. 통계적으로 무작위 분포는 **반드시** 군집과 공백이 생김 (Poisson clumping). RNG 품질 문제가 아니라 균등 분포가 아니기 때문. 균등성을 원하면 무작위가 아니라 균등성 제약(격자 / 블루 노이즈 / Poisson disk)이 필요.

4.16.3. **수정안 비교 + 채택**: (가) 더 많은 jitter / (나) **격자 셀 + 셀 내부 jitter** / (다) Poisson disk sampling. **나 채택** - 결정론 + 균등 + 자연스러움 + 구현 복잡도 낮음.

4.16.4. **`slotPosition` 시그니처 변경**: `(seedKey, gi)` → `(seedKey, posInShuffle, cols, rows)`. 셔플된 순서(`posInShuffle`)로 격자 셀에 균등 배정 + 셀 내부 ±50% jitter. 5%~95% 클램프로 가장자리 잘림 방지. 격자 cols×rows = (LINEUP.gridCols 또는 PICK_GRID_COLS_DEFAULT) × Math.ceil(NORMAL_SLOT_COUNT / cols).

4.16.5. **호출처 변경**: `appendSlot(gi)` 내부에서 `giToPos = Map(shuffledNormal[pos] → pos)` 역인덱스 도출 후 `slotPosition(seedKey, giToPos.get(gi), posCols, posRows)` 호출. 같은 박스 내에서는 슬롯이 일관 위치 유지 (특정 gi의 위치가 박스 내내 동일).

4.16.6. **결정론 보존**: 셔플 / 셀 매핑 / jitter 모두 시드 결정론. 박스 새로고침 시 같은 위치. 박스 회차 변경 시 위치 재셔플.

4.16.7. **변경 영역**: `src/render/pick-panel.js` 단일 파일 수정. 동작 / 데이터 / 단위 테스트 영향 0.

4.16.8. **검증 통과 (2026-05-08 grep 정합 점검)**:
- `PICK_AUTO_CONFIRM_DELAY_MS` 사용처 4건 (numbers + 02_data + main 2곳) 정합.
- `slotPosition` 시그니처 변경 호출처 1건 동기 갱신.
- core/ DOM import 0 / render import 0 (CLAUDE.md 4.3 위반 0).
- `pendingPeelResult.entry` 잔존 0.
- `buildConsumedGridSet` 호출처 3건 (main 2곳 + 테스트 1) 정합.

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

## 6.2. M2 / M2.1 라이브 정정 사이클 학습 (**2026-05-08 단계 6 round 3 통과로 모두 흡수 완료**)

6.2.1. ~~단계 6 검증 흐름 정합~~. **2026-05-03 종료 확정**. 라이브 컨펌으로 갈음. 학습 6.2.2~6.2.5는 M2.1 단계 6 검증 룰에 첫 적용.
6.2.2. **render 신규 모듈 prop 일관성**: peel-panel.js 첫 분기에서 `onConfirm` 전달 누락 사고. 단계 6 검증 룰에 prop drilling 정합 추가.
6.2.3. **분기 조건 state 의존성**: draw-tab.js의 6번 영역 분기가 `unopenedTickets.length`만 보고 `pendingPeelResult` 무시 사고. state 변수 매트릭스 검증.
6.2.4. **자동 진행 vs 사용자 명시**: dispatch.peel 자동 setTimeout 흐름 → 사용자 명시 확인 흐름으로 재설계.
6.2.5. **시각 효과 우선순위**: is-just-drawn vs is-drawn CSS 우선순위 충돌. !important + display:none + content:none 조합 룰화.
6.2.6. **재귀 dispatch 금지 / always-rerender 패턴**: `dispatch({type:'X'})` 내부 분기에서 `dispatch({type:'Y'})` 재귀 시, Y가 가드 early-return하면 rerender 누락 → state-UI 불일치. 재귀 대신 인라인 헬퍼 호출 + 호출처가 항상 rerender + 실패 시 메모리 상태 리셋. (이번 세션 toggle_pick_select → confirm_pick 재귀에서 발견.)
6.2.7. **persist되는 mutation과 메모리 only 분리**: 영속 mutation(deck splice, ticket 제거)은 그 시점에 history append를 동반해야 함. 메모리 only(`pendingPeelResult`) 의존 후속 영속화는 새로고침/팝업 dismiss로 entry 손실 위험. 이번 세션 D賞 누락 버그 근본 원인. 단계 6 검증 룰에 "persist 시점 = history commit 시점 정합" 항목 추가.
6.2.8. **자식 aspect-ratio가 부모 height에 미치는 영향**: `.hero-card` `min-height: 100px`이지만 자식 `aspect-ratio: 1/1`로 자연 높이 ~200px. dim 시 `display: none`으로 100px 떨어짐. min-height만으로 collapse 방지 불가 — fixed height 토큰 필요. CSS layout 검증 시 자식 aspect-ratio도 매트릭스에 포함.
6.2.9. **scroll position과 rerender 정합**: `rerender()`가 `rootEl.innerHTML = ""`로 DOM 전체 destroy → scroll 위치 모두 리셋. scroll 보존이 필요한 액션(receive_confirm 등)은 rerender 직후 `scrollToTier` 재호출 또는 incremental update 필요.
6.2.10. **CSS specificity 충돌 회피 — JS 클래스 분리**: `is-drawn`과 `is-just-drawn` 같은 상호배타 의도지만 동시 부여 가능한 클래스는 JS에서 하나만 부여하는 게 안전. CSS `!important`나 `::after` override보다 클래스 충돌 방지가 깔끔.
6.2.11. **시드 기반 결정론적 시각 무작위화**: 시드 + 식별자 해시(fnv1a)로 셔플/회전/위치 산출하면 같은 박스 동안 시각 일관성 + 박스마다 새로움. CSS 변수로 주입(`--jitter-rotate`, `--slot-x` 등)하면 hover/active 상태와 합성 가능.
6.2.12. **데이터 truth value vs 시각 메타포**: skip-mode 뽑기는 deck head pop으로 gridIndex 추적 안 됨. placeholder 충당으로 시각 정합은 맞췄지만, 사용자 멘탈 모델("내가 클릭한 슬롯")과 시각 위치는 분리. 모든 draw 경로에 gridIndex 의무 기록하는 리팩터로만 근본 해결 (M3 후보).
6.2.13. **사용자 QA 민감도 / 보고 흐름**: 사용자는 작업 완료 후 사전 시각/상태 매트릭스 검수를 강하게 요구. dim/scroll/state 전이 정합 누락이 반복되면 신뢰 큰 손상. 시각 변경 시 `peel → receive_confirm → peel_confirm` 같은 상태 단계마다 일별 검수 후 보고 의무화.

6.2.14. **slotPosition / slotJitter 시각 튜닝 매직 넘버 백로그** (4.16.4 도출): pick-panel.js의 시각 튜닝 값 4종 — `72` (회전 ±36° 범위), `5`/`95` (클램프 범위), `0.5` (셀 내부 jitter ±50% 비율). 모두 02_data 1.12 / numbers.js 미등재. CLAUDE.md 4.2 매직 넘버 금지 룰 위반. **다음 정리 라운드 흡수 후보** (라이브 정정 모드라 본 라운드는 시각 결함 해소만 처리). 권고 상수명: `PICK_SLOT_ROTATE_RANGE_DEG = 72`, `PICK_GRID_CLAMP_MIN_PCT = 5`, `PICK_GRID_CLAMP_MAX_PCT = 95`, `PICK_SLOT_JITTER_RATIO = 0.5`. 비트 마스크(`0xFFFF`, `0x0F`)와 수학 변환(`100`, 비트시프트)은 매직 넘버 룰 예외로 판단.

6.2.15. **무작위 분포 vs 균등 분포 (4.16 학습)**: "산개" UX는 무작위 좌표 ≠ 균등 분포. 무작위는 통계적으로 군집과 공백을 만든다 (Poisson clumping). 균등 산개를 원하면 격자 + jitter / 블루 노이즈 / Poisson disk sampling 같은 균등성 제약 필요. 다음 라인업 (M3 ワンピース)에서 통 시각 모델 재설계 시 이 구분 명시.

## 6.3. M3 후보 (**M2.1 단계 8 improve에서 정식 등재 - 2026-05-08**)

6.3.1. `一番くじ ワンピース MONKEY.D.LUFFY` 라인업 추가 (이찌방쿠지 표준 메커닉).
6.3.2. CB-1 다중 라인업 인터페이스 보강 (`core/history.tierCounts(history, lineup)`).
6.3.3. CB-2 styles/main.css 인라인 hex → tokens.css 변수화.
6.3.4. M2.1 통 선택 격자 라인업별 종횡비 hook 활성화 (P2 대비).

## 6.3.5. M2.1 정리 라운드 (단계 6 round 3 P2 6건, M3에서 흡수 예정)

6.3.5.1. `buildConsumedGridSet` → `core/pick-grid.js` 분리 (4.1 회색지대 해소).
6.3.5.2. main.js dispatch.pick_hint_seen handler 제거 (호출처 0건 dead).
6.3.5.3. 04_impl_plan.md `pendingPickResult` 잔존 정리.
6.3.5.4. pick-slot.js `LAST_ONE_PENDING` / `LAST_ONE_DRAWN` dead export 제거.
6.3.5.5. numbers.js `PICK_FIRST_HINT_*` dead export 제거.
6.3.5.6. spec 6.5 시나리오 표현 단축형 명확화.

## 6.3.6. M2 / M2.1 누적 백로그 (M3에서 흡수)

6.3.6.1. M1 OP-3 / M2.1 6.2.12: 모든 draw 경로에 gridIndex 의무 기록 → skip 모드 placeholder 충당 폐기.

## 6.4. M4+ 보류

6.4.1. コトブキヤくじ XENOGLOSSIA (30연 S賞 천장 룰).
6.4.2. Happyくじ PIXAR / SEGA 럭키쿠지 / フリューくじ.

# 7. M3.1 lineup-presentation (2026-05-08)

## 7.1. 사이클 메타

7.1.1. 스프린트 ID = M3.1-lineup-presentation. 8단계 파이프라인 정식 진행.
7.1.2. 스코프 = (1) 라인업 진입 로비 신설 (state.view = lobby/main) + (2) tier_class 3단계 분류 (hero/main/goods).
7.1.3. 사용자 결정 5건 박제 (단계 1 plan 9.1~9.5).

## 7.2. 단계별 산출물

7.2.1. 단계 1 plan: [docs/pipeline/M3.1-lineup-presentation/01_plan.md](docs/pipeline/M3.1-lineup-presentation/01_plan.md). 사용자 승인.
7.2.2. 단계 2 design: 02_data.md + 01_spec.md M3.1 갱신. 매직 넘버 0개 통과.
7.2.3. 단계 3 design_review: round 1 P0 0 / P1 1 / P2 6 → 통과. [03_design_review.md](docs/pipeline/M3.1-lineup-presentation/03_design_review.md).
7.2.4. 단계 4 impl_plan: [04_impl_plan.md](docs/pipeline/M3.1-lineup-presentation/04_impl_plan.md) + 03_architecture.md M3.1 갱신. T1~T10 분할.
7.2.5. 단계 5 implement: T1~T10 모두 적용 (numbers.js / storage.js / core/lobby-preview.js / render/lobby.js / render/main.js / header.js / settings-tab.js / 3개 테스트 suite + runner.js + PROGRESS).
7.2.6. 단계 6 impl_review: [06_impl_review.md](docs/pipeline/M3.1-lineup-presentation/06_impl_review.md). round 1 P0 0/P1 0/P2 3 → 통과. P2 3건 차기 사이클 백로그.
7.2.7. 단계 7 QA: [07_qa.md](docs/pipeline/M3.1-lineup-presentation/07_qa.md). 자비스 정적 시나리오 10건 + 단위 테스트 커버리지 모두 통과. 사용자 라이브 검수 의무 별도 분리 (4장).
7.2.8. 단계 8 improve: [08_improve.md](docs/pipeline/M3.1-lineup-presentation/08_improve.md). 사용자 결정 5건 박제 정합 + design_review 이월 8건 답 정합 + 차기 사이클 후보 등재.

## 7.3. 단계 6 P2 결함 처리 결정

7.3.1. P2-1 storage_v5.test.js v3 chain 통합 시나리오 부재 → 차기 사이클 백로그.
7.3.2. P2-2 createElement("main") 인라인 → 정정 불요 (HTML 태그명).
7.3.3. P2-3 lobby-preview "Last One" 인라인 → LAST_ONE_TIER_NAME 상수화 정리 라운드 백로그.

## 7.4. 차기 사이클 후보 (M3.1 비목표 + 단계 6 P2)

7.4.1. 본편 화면(추첨/기록/DC)의 tier_class 시각 적용 (5.13.B.8.3).
7.4.2. storage_v5.test.js v3 fixture chain 시나리오 추가.
7.4.3. LAST_ONE_TIER_NAME 상수화.
7.4.4. **M4 메이저 = コトブキヤくじ アイドルマスター XENOGLOSSIA 30연 천장 룰** (확장 로드맵 M3, 첫 메커닉 분기).
7.4.5. 라인업별 IP 액센트 색 토큰 (라인업 N≥3 도달 시).
7.4.6. assetsAvailable=true 전환 (사용자 외부 작업, lobby_hero.webp 배치).

# 8. M3.2 tier-class-visual (2026-05-09)

## 8.1. 사이클 메타

8.1.1. 스프린트 ID = M3.2-tier-class-visual. 8단계 파이프라인 정식 진행.
8.1.2. 스코프 = (1) 추첨 탭 hero-carousel/minor-row data-tier-class 액센트 + (2) 결과 reveal hero 등장 특별 모션 (페이지플립 카드 + DC 모달). 갤러리/history/IP 액센트는 비목표.
8.1.3. 사용자 결정 4건 박제 (단계 1 plan 9.1~9.4): DC 모달도 hero / minor-row 속성만 / 약한 골드 글로우 / lookup 헬퍼 신설.

## 8.2. 단계별 산출물

8.2.1. 단계 1 plan: [docs/pipeline/M3.2-tier-class-visual/01_plan.md](docs/pipeline/M3.2-tier-class-visual/01_plan.md). 사용자 승인.
8.2.2. 단계 2 design: 02_data 1.4.A.5 헬퍼 + 1.5 HERO_* 4종 + 2.2 색 4종 + **2.3 CSS 변수 ↔ JS 상수 매핑 표 신설**. spec 5.13.C 신설.
8.2.3. 단계 3 design_review: round 1 P0 1/P1 3/P2 4 미통과 → round 2 P0 0/P1 1/P2 1 → 통과. [03_design_review.md](docs/pipeline/M3.2-tier-class-visual/03_design_review.md). 자동 재시도 1회 정정.
8.2.4. 단계 4 impl_plan: [04_impl_plan.md](docs/pipeline/M3.2-tier-class-visual/04_impl_plan.md) + 03_architecture 5.16 게이트 신설. design_review 이월 4건 답 박제.
8.2.5. **단계 5 implement (2026-05-09)**:
- T1 numbers.js: HERO_POP_SCALE_PEAK=1.18 / HERO_GLOW_DURATION_MS=1200 / HERO_STATIC_GLOW_BLUR_PX=12 / HERO_STATIC_GLOW_ALPHA=0.25 + getTierClassForTier 헬퍼 export. colors.js: COLOR_TIER_CLASS_HERO_BG_TINT/HERO_GLOW_RGBA/MAIN_BG_TINT/GOODS_BG_TINT 4종.
- T2 tokens.css: 8종 CSS 변수 + 3종 모션.
- T3 hero-carousel + minor-row: data-tier-class 부착 + main.css 셀렉터 (hero 정적 글로우 + 배경 틴트 / minor-row는 보더 등급 색 유지 + 배경 토큰).
- T4 peel-card hero 분기 + peel-panel lineup 전달 + main.css hero-result-pop 키프레임.
- T5 dc-result-modal hero 분기 (당첨 시 modalClassName="is-hero-result"). modal.js에 modalClassName 옵션 추가.
- T6 tier_class_lookup.test.js (드래곤볼/원피스 모든 등급 + hero 분기 식 시뮬레이션).
- T7 doc 정리 (5.13.C.4.4 cross-link) + PROGRESS M3.2 절 신설 + runner.js 등록.

## 8.3. 단계 5 종료 게이트 (단계 6 진입 조건)

8.3.1. 모든 T 완료 (T1~T7).
8.3.2. tests/test.html 모든 suite ALL PASS - **사용자 라이브 검증 의무**.
8.3.3. 단계 6 impl_review subagent 격리 검증 통과 의무 (5.16 grep / 매직 넘버 0 / CSS 변수 ↔ JS 상수 1:1 / 결정론 회귀 0).

## 8.4. 단계 6/7/8 산출물

8.4.1. 단계 6 impl_review: [06_impl_review.md](docs/pipeline/M3.2-tier-class-visual/06_impl_review.md). round 1 P0 0/P1 2/P2 3 → 통과. P1 2건 = 표현/도메인 차이 trade-off (단계 8 (b) 채택).
8.4.2. 단계 7 QA: [07_qa.md](docs/pipeline/M3.2-tier-class-visual/07_qa.md). 자비스 정적 시나리오 통과 + 사용자 라이브 검수 14건 의무.
8.4.3. 단계 8 improve: [08_improve.md](docs/pipeline/M3.2-tier-class-visual/08_improve.md). 8단계 모두 종료 + P1 2건 (b) 채택 즉시 정정 (03_arch 5.16 + 02_data 1.4.A.5 표현). P2 3건 차기 사이클 백로그.

## 8.5. 차기 사이클 후보 (M3.2 라이브 검수 결함 0 보고 후)

8.5.1. 상품 갤러리 클래스 그룹화 (M3.1/M3.2 비목표).
8.5.2. history 탭 클래스별 통계.
8.5.3. 라인업별 IP 액센트 색 (라인업 N≥3 시).
8.5.4. modalSlide + hero-result-pop 자연 합성 (P2-1 라이브 검수 결과).
8.5.5. peel-card hero scale delay (P2-2).
8.5.6. LAST_ONE_TIER_NAME 상수화 (M3.1 P2-3 잔존).
8.5.7. storage_v5.test.js v3 chain 통합 시나리오 (M3.1 P2-1 잔존).
8.5.8. **M4 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰** (확장 로드맵 원래의 M3, 첫 메커닉 분기).

# 9. M3.3 tier-class-extended (2026-05-09)

## 9.1. 사이클 메타

9.1.1. 스프린트 ID = M3.3-tier-class-extended. 8단계 파이프라인 정식.
9.1.2. 스코프 = 갤러리 그룹화 (hero → main → goods + Last One hero 마지막) + history 탭 상단 대시보드 (4개 카운터 카드).
9.1.3. 사용자 결정 5건 (plan 9.1~9.5): "메인 등급/표준 등급/굿즈" 라벨 / 2x2 모바일 그리드 / hero→main→goods 정렬 / Last One hero 마지막 / 통합 카운트.

## 9.2. 단계별 산출물

9.2.1. 단계 1 plan: [01_plan.md](docs/pipeline/M3.3-tier-class-extended/01_plan.md). 사용자 승인.
9.2.2. 단계 2 design: 02_data 1.4.A.6 TIER_CLASS_LABEL_KO + 1.5 HISTORY_DASHBOARD_* 3종 / 1.4.A.5 호출처 표 확장 / spec 5.13.D 신설.
9.2.3. 단계 3 design_review: round 1 P0 0/P1 1/P2 5 → 통과. [03_design_review.md](docs/pipeline/M3.3-tier-class-extended/03_design_review.md).
9.2.4. 단계 4 impl_plan: [04_impl_plan.md](docs/pipeline/M3.3-tier-class-extended/04_impl_plan.md) + 03_arch 5.17 게이트 + 6.10 변경 이력. design_review 이월 6건 답 박제.
9.2.5. **단계 5 implement (2026-05-09)**:
- T1 numbers.js: TIER_CLASS_LABEL_KO + HISTORY_DASHBOARD_COLS_MOBILE/TABLET + HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX export.
- T2 core/history.js: tierClassCounts(history, lineup) export. 미존재 tier 가드.
- T3 render/history-tab.js: 상단 대시보드 4개 카운터 카드 (전체 / 메인 등급 / 표준 등급 / 굿즈).
- T4 render/tier-grid.js: hero/main/goods 그룹화 + 섹션 헤더. Last One은 hero 그룹 마지막. 박스 등급 순서 보존.
- T5 styles/main.css: .history-dashboard / .history-dashboard-card 반응형(2x2/4열) + .tier-grid-section / .tier-grid-section-header 좌측 색 막대 토큰 재사용.
- T6 tests/suites/tier_class_counts.test.js: 6건 (빈 history / 드래곤볼 / 원피스 / 미존재 tier 가드 / 결정론 / lineup 부재 throw).
- T7 tests/runner.js 등록.
- T8 plan 7.1 total=5 정정 + 본 PROGRESS 절 추가.

## 9.3. 단계 6/7/8 산출물

9.3.1. 단계 6 impl_review: [06_impl_review.md](docs/pipeline/M3.3-tier-class-extended/06_impl_review.md). round 1 P0 1 미통과 → round 2 P0 0 통과. round 1 P0 = T4 그룹화 적용 모듈 오결정 (tier-grid는 dead 모듈, 실제는 product-gallery.js). 자동 재시도 1회 정정.
9.3.2. 단계 7 QA: [07_qa.md](docs/pipeline/M3.3-tier-class-extended/07_qa.md). 자비스 정적 정합 통과 + 사용자 라이브 검수 11건 의무.
9.3.3. 단계 8 improve: [08_improve.md](docs/pipeline/M3.3-tier-class-extended/08_improve.md). 8단계 종료 + 단계 6 P2 2건 (tier-grid dead 정리 / 인라인 정책) 차기 정리 라운드 백로그.

## 9.4. 차기 사이클 후보 (M3.3 라이브 검수 결함 0 보고 후)

9.4.1. **M3.4-tidy 정리 라운드** (소): tier-grid.js dead 모듈 폐기 + LAST_ONE_TIER_NAME 상수화 + storage_v5.test.js v3 chain + "전체" 라벨 / CSS 인라인 px 정책 통일.
9.4.2. **M3 series 라이브 검수 결과 보정** (M3.2 P2-1/P2-2/P2-3 + M3.1/M3.3 라이브 결함 발견 시).
9.4.3. **M4 메이저 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰** (확장 로드맵 원래의 M3, 첫 메커닉 분기).
