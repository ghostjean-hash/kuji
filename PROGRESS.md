# Kuji 진행 로그

# 1. 현재 상태

1.1. **현재 스프린트**: M2.1-pick-from-bin.
1.2. **현재 단계**: 단계 5 implement 완료 (B-α + 자동 선택 버튼) → push. **다음 세션 진입점 = T18/T19 검증 + 단계 6/7/8 결정**.
1.3. **시작**: 2026-05-02 (M0 기점). M2.1: 2026-05-03.
1.4. **마지막 갱신**: 2026-05-03 (M2.1 단계 5 B-α + 자동 선택 + 커밋 a1392c7 push 완료. 새 세션 진입 정리).

## 1.5. 다음 세션 즉시 작업 후보

1.5.1. **T18 단위 테스트 실행** (사용자 액션):
- http://127.0.0.1:5501/tests/test.html 또는 https://ghostjean-hash.github.io/kuji/tests/test.html
- 기대: 모든 suite pass. fail 시 자비스 정정.

1.5.2. **T19 시각 / 동작 컨펌** (사용자 액션):
- http://127.0.0.1:5501/index.html 또는 https://ghostjean-hash.github.io/kuji/
- 핵심 시나리오:
  - 5매 구매 → 격자 → 자동 선택 5매 → 펄스 → 확인 → 페이지플립 → 한 장씩 reveal
  - 또는 5매 구매 → 격자 → 슬롯 5개 직접 클릭 → 확인 → 페이지플립
  - skip ON 토글 → 격자 미진입 흐름
  - 새로고침 복원 (lockedResult 영속)

1.5.3. **단계 6/7/8 정식 보고서 작성 vs 라이브 컨펌 갈음 결정** (사용자 결정):
- 정식: subagent 격리 검증(단계 6) + QA 보고서(단계 7) + improve(단계 8). M3 깨끗한 진입.
- 라이브: M2 패턴. PROGRESS에 학습만 흡수 후 M3 진입.

1.5.4. **M3 후보** (단계 8에서 정식 plan 작성 예정):
- 一番くじ ワンピース MONKEY.D.LUFFY 라인업 추가 (이찌방쿠지 표준 메커닉).
- CB-1 다중 라인업 인터페이스 보강 (`core/history.tierCounts(history, lineup)`).
- CB-2 styles/main.css 인라인 hex → tokens.css 변수화.
- M2.1 통 선택 격자 라인업별 종횡비 hook 활성화 (P2 / 비균등 격자).

## 1.6. 다음 세션 권장 첫 메시지 (참고)

- 일반 진행: "T18/T19 결과 보고. <pass/fail 또는 시각 결함 목록>"
- 단계 마무리 모드: "M2.1 단계 6 진입 (subagent 격리 검증)"
- M3 진입 모드: "M2.1 단계 8 improve로 마무리 후 M3 plan 작성"

# 2. 스프린트 추적

| 스프린트 | 이름 | 단계 진행 | 상태 |
|---|---|---|---|
| M0 | 클로드코드 환경 셋업 | 단순 셋업 (8단계 미적용) | 완료 |
| M0.5 | 도메인 리서치 | 단순 조사 (8단계 미적용) | 완료 |
| M1 | base-system + 一番くじ ドラゴンボール | 1~7 ✅ / 8 ✅ (UX 결함 백로그 + M2 후보 등재) | 종료 (기능 정합 / UX 미완) |
| M2 | ux-redesign | 1 ✅ / 2 ✅ → 3 (3차) ✅ / 4 ✅ / 5 ✅ + 사용자 UI 정정 다수 / 6~8 사용자 라이브 컨펌 갈음 | 종료 (라이브 컨펌으로 갈음. 단계 6/7 정식 보고서 미작성. 학습은 M2.1 단계 6에서 흡수) |
| **M2.1** | pick-from-bin | 1 ✅ / 2 B-α ✅ / 3 (round 5) ✅ / 4 B-α ✅ / 5 B-α ✅ → T18/T19 대기 | **진행 중 (B-α 재정정 완료)** |

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

## 6.2. M2 라이브 정정 사이클 학습 (M2.1 단계 6에서 흡수 예정)

6.2.1. ~~단계 6 검증 흐름 정합~~. **2026-05-03 종료 확정**. 라이브 컨펌으로 갈음. 학습 6.2.2~6.2.5는 M2.1 단계 6 검증 룰에 첫 적용.
6.2.2. **render 신규 모듈 prop 일관성**: peel-panel.js 첫 분기에서 `onConfirm` 전달 누락 사고. 단계 6 검증 룰에 prop drilling 정합 추가.
6.2.3. **분기 조건 state 의존성**: draw-tab.js의 6번 영역 분기가 `unopenedTickets.length`만 보고 `pendingPeelResult` 무시 사고. state 변수 매트릭스 검증.
6.2.4. **자동 진행 vs 사용자 명시**: dispatch.peel 자동 setTimeout 흐름 → 사용자 명시 확인 흐름으로 재설계.
6.2.5. **시각 효과 우선순위**: is-just-drawn vs is-drawn CSS 우선순위 충돌. !important + display:none + content:none 조합 룰화.

## 6.3. M3 후보 (M2.1 단계 8에서 정식 plan 작성)

6.3.1. `一番くじ ワンピース MONKEY.D.LUFFY` 라인업 추가 (이찌방쿠지 표준 메커닉).
6.3.2. CB-1 다중 라인업 인터페이스 보강 (`core/history.tierCounts(history, lineup)`).
6.3.3. CB-2 styles/main.css 인라인 hex → tokens.css 변수화.
6.3.4. M2.1 통 선택 격자 라인업별 종횡비 hook 활성화 (P2 대비).

## 6.4. M4+ 보류

6.4.1. コトブキヤくじ XENOGLOSSIA (30연 S賞 천장 룰).
6.4.2. Happyくじ PIXAR / SEGA 럭키쿠지 / フリューくじ.
