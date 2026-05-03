# M2-ux-redesign 체크리스트

스프린트 ID: M2-ux-redesign
시작일: 2026-05-02

# 1. 8단계 진행

- [x] 1 plan: `docs/pipeline/M2-ux-redesign/01_plan.md` (사용자 승인 2026-05-02)
- [x] 2 design: `research/05_kuji_ticket_form.md` + `docs/01_spec.md` + `docs/02_data.md` (M2 갱신)
- [x] 3 design_review: 1차 fail (3건) → 정정 → 2차 fail (3건) → 자체 정정 + grep (M1 OP-3)
- [x] 4 impl_plan: `docs/03_architecture.md` (M2 모듈 추가) + `04_impl_plan.md` (23 태스크) - 사용자 승인 (2026-05-02)
- [x] 5 implement: T1~T23 완료 (numbers/colors/storage/assets/buy + 신규 render 11 + tokens/main.css + buy.test.js). 자체 grep 사전 검증 통과.
- [ ] 6 impl_review: `docs/pipeline/M2-ux-redesign/06_impl_review.md` (subagent 격리 + 자체 grep + 사용자 브라우저 테스트)
- [ ] 7 qa: `docs/pipeline/M2-ux-redesign/07_qa.md` (사용자 승인)
- [ ] 8 improve: `PROGRESS.md` 갱신 + 다음 plan 후보 (M3 ワンピース)

# 2. M2 통과 게이트 요약

- 1: 사용자 승인
- 2: 매직 넘버 0개 + 메커닉 빈 항목 0개
- 3: subagent 격리 검증 통과 (모순 0, 누락 0)
- 4: 사용자 승인
- 5: 컴파일 / 실행
- 6: subagent + core/ 100% suite pass + 매직 넘버 0개 + tests/ 매직 넘버 0개 (M1 OP-4 반영)
- 7: 핵심 시나리오 + UX 결함 0건 + 사용자 승인 (브라우저 실행)
- 8: 발견 이슈 처리 또는 백로그 등재

# 3. M1 → M2 인계

- M1 단계 6 / 8 에서 발견된 운영 학습 (OP-1~4) 반영.
- M1 단계 8 백로그 (UX-1~6, OP-1~4, CB-1~2) 입력으로 사용.
