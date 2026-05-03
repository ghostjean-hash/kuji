# M2.1 pick-from-bin - 00 진행 체크리스트

| 항목 | 값 |
|---|---|
| 스프린트 ID | M2.1-pick-from-bin |
| 시작일 | 2026-05-03 |

# 1. 8단계 체크리스트

- [x] 1 plan: docs/pipeline/M2.1-pick-from-bin/01_plan.md (사용자 승인 완료)
- [x] 2 design: docs/01_spec.md + docs/02_data.md 갱신 (5.14 통 선택 신설 / 02_data 1.12 / 3.1 / 3.2.3)
- [x] 3 design_review: docs/pipeline/M2.1-pick-from-bin/03_design_review.md + round2 + round3 (round 3에서 통과)
- [x] 4 impl_plan: docs/03_architecture.md (3.4/3.7/3.10/3.11/3.14~3.16/4.6~4.9/5.6~5.9 갱신) + docs/pipeline/M2.1-pick-from-bin/04_impl_plan.md (19 태스크) - 사용자 승인 완료
- [x] 5 implement (T1~T17, B-α 재정정 Phase A~G): src/ + tests/ + styles 작성. T17 grep 통과 (core DOM 0 / pendingPickResult 잔존 0 / B-α 식별자 정합). **T18 테스트 실행 + T19 사용자 시각 컨펌 대기 (B-α 재시도)**
- [ ] 6 impl_review: docs/pipeline/M2.1-pick-from-bin/06_impl_review.md (subagent 격리 + M2 학습 룰 첫 적용)
- [ ] 7 qa: docs/pipeline/M2.1-pick-from-bin/07_qa.md (사용자 승인)
- [ ] 8 improve: PROGRESS.md + M3 plan 후보

# 2. 주요 마일스톤

2.1. 단계 2 진입 = plan 승인.
2.2. 단계 5 초기 = 격자 시각 컨펌 (9.1 모바일 터치 사용성).
2.3. 단계 6 = M2 라이브 학습(PROGRESS 6.2.2~6.2.5) 검증 룰 첫 적용.
2.4. 단계 8 = M3 ワンピース 라인업 plan 후보 작성.
