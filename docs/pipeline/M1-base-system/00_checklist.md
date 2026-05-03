# M1-base-system 체크리스트

스프린트 ID: M1-base-system
시작일: 2026-05-02

# 1. 8단계 진행

- [x] 1 plan: `docs/pipeline/M1-base-system/01_plan.md` (사용자 승인 완료)
- [x] 2 design: `docs/01_spec.md` + `docs/02_data.md` 갱신 (1차 → 정정 → 2차 정정 완료)
- [x] 3 design_review: 1차 fail → 2차 fail → 사용자 명시 승인 → 3차 통과 (`03_design_review_round3.md`)
- [x] 4 impl_plan: `docs/03_architecture.md` + `docs/pipeline/M1-base-system/04_impl_plan.md` (사용자 승인 완료)
- [x] 5 implement: `src/` + `tests/` + `styles/` + `index.html` (42 파일)
- [x] 6 impl_review: 1차 fail → 2차 fail → 명시 승인 정정 → 3차 결함 1건 → 자체 정정 + 자체 grep 검증 통과
- [x] 7 qa: 정적 정합 통과 (`07_qa.md`). 사용자 브라우저 실행에서 UX 결함 6건 보고.
- [x] 8 improve: M1 종료 + M2-ux-redesign 후보 등재 (`08_improve.md`)

# 2. 통과 게이트 요약

- 1: 사용자 승인
- 2: 매직 넘버 0개, 메커닉 빈 항목 0개
- 3: subagent 격리 검증 통과 (모순 0, 누락 0)
- 4: 사용자 승인, core/render/data 분리 명시, core → DOM import 0개
- 5: 컴파일 / 실행, 모든 모듈 작성 완료
- 6: subagent 격리 검증 통과 + core/ 100% suite pass + 매직 넘버 0개
- 7: 핵심 시나리오 100% pass + 사용자 승인
- 8: 발견 이슈 처리 또는 백로그 등재
