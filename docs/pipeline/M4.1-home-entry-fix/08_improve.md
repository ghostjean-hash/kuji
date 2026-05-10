# M4.1 home-entry-fix - 08 improve

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.1-home-entry-fix |
| 단계 | 8 improve |
| 작성일 | 2026-05-10 |
| 사이클 종료 | 자비스 정적 정합 통과 + 사용자 라이브 검수 미수행 (07_qa.md 2절 의무) |

# 1. 사이클 종료 자기-진단

1.1. **사용자 발화 트리거**: "기본적으로 진입하면 쿠지 홈이 있어야 하고, 내가 원하는 쿠지를 선택해서 게임을 진행하는 방식이어야 해. 근데 쿠지 종류를 선택하는게 너무 어려워."

1.2. **본 사이클 결손 해소**:
- 결손 1 (재방문 시 홈 미노출) → 해소 (활성 탭 default = HOME, M4 "마지막 라인업 자동" 정책 폐기).
- 결손 2 (홈 복귀 발견성 낮음) → 해소 (하단 탭 4탭 환원 + 홈 = 탭 1, 1차 진입점).

1.3. **자비스 단독 결정 영역 박제 (CLAUDE.md 7.2 정합)**: 단계 1 결정 4.1.A / 4.2.A / 4.3.A를 자비스 추천으로 박제 + 사용자 단계 1 plan 승인 게이트로 통과. 단계 4 결정 1.1~1.8도 plan 본문 박제 + 자율 진행 신호("정석대로 진행")로 통과.

1.4. **단계 3/6 subagent 격리 검증 의무 잔존**: 자율 진행 신호로도 우회 불가. round 1 P0 4건 → round 2 통과(자동 재시도 1회 한도 내).

# 2. M4.1 학습 (PROGRESS 12.5 흡수 완료)

2.1. **사용자 도메인 인식 정합 검증 의무 (M4 → M4.1 재발)**: M4 단계 2 design에서 home view를 "전체 화면 격리 view"로 결정한 게 사용자 도메인 인식 정합 미달. 차기 메이저 사이클 단계 2에서 view / 탭 모델 변경 시 사용자 도메인 인식 명시 확인 의무.

2.2. **1회 ack 흐름과 entry view 의미 충돌 답습**: 1회 ack 정책은 면책 / 약관에는 적합하나 entry view 진입에는 부적합. 차기 entry 동선 변경 시 ack 정책 분리 의무.

2.3. **M3.1 시점 잔존 절 stale 정정 의무 (M4.1 단계 3 학습)**: round 1 P0 4건 모두 동일 패턴 = arch 시점별 절의 본 사이클 갱신 누락. 차기 사이클 plan 6.1 영향 매트릭스에서 시점 절 명시 의무.

2.4. **자율 진행 신호 답습 (M3.5 → M4 → M4.1)**: 단계 1/4/7 자율 통과 + 단계 3/6 subagent 격리 검증 의무 잔존.

2.5. **자비스 진행 보고 직관성 결손 박제**: 사용자 발화 "왜 이리 파악하기 어렵게 안내하지???" → 메모리 `feedback_progress_visibility.md` 신설 + 진행도 표 의무.

2.6. **차기 응답 분할 결정의 효율 사고 회귀 박제**: 자비스가 단계 4 종료 후 "차기 응답 분할" 결정으로 끊은 사건 → 사용자 추궁 ("작업 완료한거야?") 으로 정정. `feedback_no_efficiency_shortcuts.md` 답습.

# 3. 단계별 결손 박제 (M4.2-tidy 백로그 흡수 후보)

## 3.1. 단계 6 P1 흡수

3.1.1. **P1-1 면책 모달 trigger 키 SSOT 충돌**: spec 4.1 / 5.13.B.3.1 = `homeAcked === false → 면책 모달` 표기 vs 코드 = `state.meta.disclaimerSeen` 분기. dismiss 갱신 키도 spec/코드 상이. **결손 본질** = M3.1 시점 면책 모달과 lobbyAcked 1회 ack 흐름이 결합되어 있었으나 본 사이클에서 homeAcked 의미를 분리하면서 면책 모달 trigger 키도 함께 정정 의무였음. 코드는 M2부터 `meta.disclaimerSeen`으로 면책 표시. 본 사이클은 spec 본문에 home_acked 의미 = 면책 동의로 박제했지만 실제 코드는 별도 키 사용. 정정 권고 = (a) spec 본문 갱신: 면책 모달 trigger = `state.meta.disclaimerSeen`로 일관 박제 + home_acked는 라우팅 호환 키로만 잔존 (의미 변경 없이 lobby_acked 개명 그대로) 또는 (b) 코드 정정: 면책 모달 trigger를 `state.homeAcked`로 통일. **자비스 추천 = (a)**: 코드 측 변경 부피 작게 + 마이그레이션 비용 0. **M4.2-tidy 흡수**.

3.1.2. **P1-2 arch 5.20 + impl_plan T9 단위 테스트 파일명 stale**: 본문 = home_flow_m41 / tab_routing 명시 vs 실제 = home_flow.test.js 갱신 + tab_routing.test.js 신설. 본문 stale. M4.2-tidy 또는 단계 8 본 흡수.

## 3.2. 단계 6 P2 흡수

3.2.1. P2-1 ~ P2-3 = M4.2-tidy 백로그 (07_qa 1.4 정합).

# 4. 본 사이클 박제 산출물

| # | 산출물 | 파일 |
|---|---|---|
| 1 | plan | docs/pipeline/M4.1-home-entry-fix/01_plan.md |
| 2 | design | spec/data/arch 본체 갱신 |
| 3 | design_review | docs/pipeline/M4.1-home-entry-fix/03_design_review.md |
| 4 | impl_plan | docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md |
| 5 | implement | T1~T12 (numbers / storage / main / bottom-tabs / home / header / settings-tab + storage_v7 / home_flow / tab_routing 테스트 + runner + PROGRESS) |
| 6 | impl_review | docs/pipeline/M4.1-home-entry-fix/06_impl_review.md |
| 7 | QA | docs/pipeline/M4.1-home-entry-fix/07_qa.md |
| 8 | improve (본 문서) | docs/pipeline/M4.1-home-entry-fix/08_improve.md |

# 5. 차기 사이클 후보 (PROGRESS 12.4 흡수 완료)

5.1. **M4.2-tidy 정리 라운드** (소, 누적 = 구 M4.1-tidy 개명).
5.2. **M3 series + M4 + M4.1 라이브 검수 결과 보정** (사용자 검수 결과 의존).
5.3. **M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰** (확장 로드맵 슬롯 보존).

# 6. 사용자 액션 의무

6.1. 07_qa.md 2절 라이브 검수 6 항목 (첫 방문 / 재방문 / 홈 복귀 / 라인업 전환 / storage 마이그레이션 / M3 series 누적).
6.2. 검수 결함 발견 시 자비스에 신호 → 보정 사이클 진입 또는 M4.2-tidy 흡수 결정.

# 7. 사이클 종료 박제

7.1. 본 사이클(M4.1-home-entry-fix) 8단계 파이프라인 종료.
7.2. 자비스 정적 정합 = 통과. 라이브 검수 = 사용자 액션 의무.
7.3. 차기 사이클 결정은 사용자 신호 후 진입.
