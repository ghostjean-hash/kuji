# 05. 파이프라인 (구 8단계 + 신 5단계 매핑 어댑터)

> **DEPRECATION 경고 (2026-05-19, M-jarvis-v6-migrate M2)**: 본 문서의 구 8단계 파이프라인은 신 자비스 v6.0.6 5단계 사이클로 점진 이관 중. 신 사이클 SSOT는 `~/.claude/jarvis-design.md §6.5` + `.claude/CLAUDE.md §2`. M3 시범 사이클(M5+ Last One) 종료 + M4 회고 후 본 문서 archive 예정.

# 0. 8단계 → 5단계 매핑 (M2 어댑터)

| 구 8단계 (kuji v5) | 신 5단계 매핑 (v6.0.6) | 비고 |
|---|---|---|
| 1 plan | Plan | handoff JSON instance 추가 |
| 2 design | Plan 후반 (사양 산출물) | 본체 `docs/01_spec.md` + `docs/02_data.md` 갱신 보존 |
| 3 design_review | Review sub-loop (Evaluator) | §6.5.5 fleet review 답습 |
| 4 impl_plan | Plan (구현 분해) | 통합 |
| 5 implement | Execute | 자동 검증 sub-loop (§6.2.2) |
| 6 impl_review | Review (Evaluator-Optimizer §6.5.6) | rubric.pass_threshold 기준 |
| 7 qa | Review 사용자 sign-off | `/jarvis-contract sign` |
| 8 improve | Ship + Ratchet | Mistake Ledger 자동 적재 |

0.1. **5단계 풀 사이클**: Research → Plan → Execute → Review → Ship. 운영 모드 기본 (M1 sign-off).
0.2. **3단계 압축 모드**: Plan / Execute / Ship. 마이크로 patch 한정 (사양 §6.5.4 카파시 단계 압축).
0.3. **handoff JSON 5종**: `~/.claude/workflows/<stage>-template.md` 템플릿. instance는 작업 디렉토리에 작성, unversioned (§3.5.7).
0.4. **Default-FAIL contract**: `/jarvis-contract new` + `sign`. Review 단계 종료 게이트 (§6.3.1).
0.5. **kuji 평가 rubric**: 사양 §6.4.6 (확률 메커닉 / SSOT / 모듈 / 톤 / 인계 5축 + pass_threshold 75).

---

> **구 8단계 파이프라인 본문** (이하). M-jarvis-v6-migrate 종료 전까지 보존, M4 회고 후 `docs/_archive/pipeline-v5/`로 이관 예정. 신 사이클 운영은 § 0 매핑 표 참조.

본 문서는 모든 작업 사이클이 거치는 8단계 파이프라인의 SSOT다.

# 1. 단계 정의

| # | 단계 | ID | 입력 | 출력 (산출물) | 위치 | 통과 게이트 |
|---|---|---|---|---|---|---|
| 1 | 플랜 | `plan` | 사용자 요구 | 스코프 / 비목표 / 성공 기준 / 우선순위 / 마일스톤 | `docs/pipeline/<sprint>/01_plan.md` | 사용자 승인 |
| 2 | 기획 | `design` | 승인된 플랜 | 게임 사양 + 메커닉 + 데이터 SSOT 갱신 | `docs/01_spec.md` + `docs/02_data.md` 본체 갱신 | 매직 넘버 0개, 메커닉 빈 항목 0개 |
| 3 | 기획 검증 | `design_review` | 갱신된 기획 | 모순 / 누락 / 일관성 보고 | `docs/pipeline/<sprint>/03_design_review.md` | subagent 격리 검증 + 모순 0 + 누락 0 |
| 4 | 구현 플랜 | `impl_plan` | 검증된 기획 | 모듈 분해 + 인터페이스 + 의존성 + 작업 분할 | `docs/03_architecture.md` 갱신 + `docs/pipeline/<sprint>/04_impl_plan.md` | 사용자 승인, core/render/data 분리 명시 |
| 5 | 구현 | `implement` | 구현 플랜 | 코드 + 테스트 코드 | `src/` + `tests/` | 컴파일 / 실행, 모든 모듈 작성 완료 |
| 6 | 구현 검증 | `impl_review` | 구현 | 단위 테스트 통과 + 코드-기획 정합 보고 | 테스트 결과 + `docs/pipeline/<sprint>/06_impl_review.md` | subagent 격리 검증 + core/ 100% suite pass + 매직 넘버 0개 |
| 7 | QA | `qa` | 검증 통과 빌드 | 사용자 시나리오 / 엣지 케이스 / 결과 보고 | `docs/pipeline/<sprint>/07_qa.md` | 핵심 시나리오 100% pass + 사용자 승인 |
| 8 | 개선 | `improve` | QA 보고 | 패치 또는 백로그 등록 + 다음 스프린트 후보 | `PROGRESS.md` + 다음 plan 후보 | 발견 이슈 처리 또는 백로그 등재 |

# 2. 단계별 입력 / 출력 / 통과 게이트 상세

## 2.1. 1 플랜 (`plan`)

| 항목 | 값 |
|---|---|
| 입력 | 사용자 요구, 직전 스프린트의 8단계 개선 결과 |
| 산출물 | 스코프 / 비목표 / 성공 기준 / 우선순위 / 마일스톤 / 리스크 |
| 형식 | 마크다운 1 파일 |
| 통과 | 사용자 승인 |
| 검증 주체 | 사용자 |

## 2.2. 2 기획 (`design`)

| 항목 | 값 |
|---|---|
| 입력 | 승인된 1 플랜 |
| 산출물 | `docs/01_spec.md` (사양) / `docs/02_data.md` (수치) 본체 갱신 |
| 형식 | 본체 docs 갱신 |
| 통과 | 매직 넘버 0개, 메커닉 빈 항목 0개 |
| 검증 주체 | 자비스 셀프 (3단계에서 격리 검증 별도) |

## 2.3. 3 기획 검증 (`design_review`)

| 항목 | 값 |
|---|---|
| 입력 | 갱신된 본체 docs |
| 산출물 | 모순 / 누락 / 일관성 보고서 |
| 형식 | `docs/pipeline/<sprint>/03_design_review.md` |
| 통과 | 모순 0개, 누락 0개 |
| 검증 주체 | **subagent 격리 검증 (general-purpose 또는 Plan, 깨끗한 컨텍스트)** |

## 2.4. 4 구현 플랜 (`impl_plan`)

| 항목 | 값 |
|---|---|
| 입력 | 검증된 기획 |
| 산출물 | 모듈 분해 (core / render / data / input), 인터페이스 시그니처, 의존성 그래프, 작업 분할 |
| 형식 | `docs/03_architecture.md` 본체 갱신 + `docs/pipeline/<sprint>/04_impl_plan.md` |
| 통과 | 사용자 승인, core / render / data 분리 명시, core → DOM import 0개 |
| 검증 주체 | 사용자 + 자비스 셀프 |

## 2.5. 5 구현 (`implement`)

| 항목 | 값 |
|---|---|
| 입력 | 승인된 구현 플랜 |
| 산출물 | `src/` 코드 + `tests/suites/` 테스트 코드 |
| 형식 | ES Modules JavaScript |
| 통과 | 컴파일 / 실행, 모든 모듈 작성 완료 |
| 검증 주체 | 자비스 셀프 (6단계에서 격리 검증 별도) |

## 2.6. 6 구현 검증 (`impl_review`)

| 항목 | 값 |
|---|---|
| 입력 | 구현된 코드 |
| 산출물 | 단위 테스트 통과 결과 + 코드-기획 정합 보고 |
| 형식 | 테스트 결과 텍스트 + `docs/pipeline/<sprint>/06_impl_review.md` |
| 통과 | core/ 100% suite pass, 매직 넘버 0개, core → DOM import 0개 |
| 검증 주체 | **subagent 격리 검증 (Explore 또는 general-purpose, 깨끗한 컨텍스트)** + 자비스 자체 테스트 실행 |

## 2.7. 7 QA (`qa`)

| 항목 | 값 |
|---|---|
| 입력 | 검증 통과 빌드 |
| 산출물 | 사용자 시나리오 결과, 엣지 케이스 결과, 사용성 메모 |
| 형식 | `docs/pipeline/<sprint>/07_qa.md` |
| 통과 | 핵심 시나리오 100% pass, 사용자 승인 |
| 검증 주체 | 사용자 + 자비스 시나리오 자동 실행 |

## 2.8. 8 개선 (`improve`)

| 항목 | 값 |
|---|---|
| 입력 | QA 보고 |
| 산출물 | 패치 적용 또는 백로그 등록, 다음 스프린트 후보 |
| 형식 | `PROGRESS.md` 갱신 + 다음 plan 후보 메모 |
| 통과 | 발견 이슈 처리 또는 백로그 등재, 다음 스프린트 stub 생성 |
| 검증 주체 | 사용자 + 자비스 |

# 3. 작업 단위

3.1. **스프린트** (sprint): 큰 사이클. M1, M2, M3 같은 마일스톤. 8단계 풀 사이클.
3.2. **기능** (feature): 작은 변경. 단일 기능 추가 / 버그 수정. 1 / 4 / 7 단계 일부 스킵 가능 (사유 명시).
3.3. **혼합 운영**: 본 프로젝트는 스프린트 + 기능 단위 혼합. 큰 사이클은 스프린트, 소규모는 기능.

# 4. 산출물 위치 규칙

4.1. 본체 docs (`docs/01-04`)는 SSOT. 매 단계마다 갱신.
4.2. 단계별 메타 산출물 (검증 보고 / QA 보고 등)은 `docs/pipeline/<sprint>/`에 분리.
4.3. 코드 산출물은 `src/` / `tests/`.
4.4. PROGRESS.md는 스프린트 단위 진행 추적 + 단계 스킵 사유 기록.

# 5. 단계 스킵 룰

5.1. 어떤 단계든 스킵 시 `PROGRESS.md`에 스킵 사유 명시 의무.
5.2. 스킵 가능 단계: 1 / 4 / 7 (사용자 승인 단계는 사용자 명시 동의 시 생략 가능).
5.3. 스킵 불가 단계: 2 / 3 / 5 / 6 / 8 (자비스 책임 단계는 도그마로 통과시키지 않음).

# 6. subagent 격리 검증 룰

6.1. 단계 3 / 6은 자비스 자기 검증 사각지대를 막기 위해 subagent를 격리 컨텍스트로 호출.
6.2. subagent에 전달할 입력: 본체 docs + 검증 대상 산출물. 자비스의 작업 컨텍스트 / 의도는 전달하지 않는다.
6.3. subagent의 출력은 보고서 형태. 자비스가 받아 `docs/pipeline/<sprint>/03_design_review.md` 또는 `06_impl_review.md`에 기록.
6.4. 검증 보고에 modification 권고가 있으면 본체 docs / 코드를 수정 후 재검증 (1회 재시도). 재시도에도 fail이면 사용자 핸드오프.

# 7. 8단계 진행 체크리스트 템플릿

새 스프린트 시작 시 `docs/pipeline/<sprint>/00_checklist.md` 생성:

```
- [ ] 1 plan: docs/pipeline/<sprint>/01_plan.md (사용자 승인)
- [ ] 2 design: docs/01_spec.md + docs/02_data.md 갱신
- [ ] 3 design_review: docs/pipeline/<sprint>/03_design_review.md (subagent 격리)
- [ ] 4 impl_plan: docs/03_architecture.md + docs/pipeline/<sprint>/04_impl_plan.md (사용자 승인)
- [ ] 5 implement: src/ + tests/
- [ ] 6 impl_review: docs/pipeline/<sprint>/06_impl_review.md (subagent 격리 + 자체 테스트)
- [ ] 7 qa: docs/pipeline/<sprint>/07_qa.md (사용자 승인)
- [ ] 8 improve: PROGRESS.md + 다음 plan 후보
```

# 8. 변경 이력

8.1. 2026-05-02: 신설. 8단계 SSOT 도입.
