# M-jarvis-v6-migrate - 01 plan

> 본 스프린트는 메타 작업. kuji 도메인의 운영 구조를 구 자비스(8단계 파이프라인 + output style + project CLAUDE.md 90줄)에서 신 자비스 v6.0.5(5단계 사이클 + handoff JSON + Default-FAIL contract + Mistake Ledger)로 옮긴다. 본 plan 자체가 구 8단계 패턴의 마지막 사용 (자기-종료적).

# 1. 한 줄

kuji 환경의 구 자비스 운영을 신 자비스 v6.0.5 사양으로 마이그레이션. gradual 방식, 시범 사이클(M5+ Last One)으로 첫 적용 후 회고 기반 점진 흡수.

# 2. 배경

2.1. 글로벌 자비스 사양은 v6.0.5 동결 (5단계 사이클 + 3단계 압축 + handoff JSON + Default-FAIL contract + 도메인별 rubric + Mistake Ledger).
2.2. kuji 프로젝트는 v5 시절 구축된 8단계 파이프라인을 SSOT로 운영 중. 신 자비스 핵심 자산(`~/.claude/workflows/<stage>-template.md` / `/jarvis-contract` / `/jarvis-init` / Mistake Ledger)을 미사용.
2.3. 출력 톤은 `rpg-designer` output style 사용 중. kuji는 RPG 아닌 추첨 메커닉 시뮬레이터. 정체성 충돌 발생.
2.4. 신 자비스 사양 §4 도메인 테이블에 kuji 미등재 (임시 도메인 상태).

# 3. 스코프

## 3.1. 포함

3.1.1. kuji 도메인 등재 (신 자비스 사양 §4.3 sub-도메인).
3.1.2. project CLAUDE.md 신설 (`D:/claude_code/kuji/.claude/CLAUDE.md`, 80줄 이하).
3.1.3. 8단계 → 5단계 매핑 어댑터 (`docs/05_pipeline.md`).
3.1.4. handoff JSON 5종 (research/plan/execute/review/ship) instance 흐름 검증.
3.1.5. Default-FAIL contract 게이트 연결 (`/jarvis-contract new` + `sign`).
3.1.6. kuji 도메인 rubric 초안 (시뮬레이터, §6.4).
3.1.7. output style 정리 (`rpg-designer` 제거 또는 RPG 도메인 한정).
3.1.8. 구 산출물 archive (`docs/pipeline/_archive/v5/`).
3.1.9. 시범 사이클 1회 운영 (M5+ Last One 단일화, 신 5단계 풀).
3.1.10. 회고 후 잔여 백로그(M5.1 selectable / M6 코토부키야 / 라이브 검수 보정) 점진 흡수.

## 3.2. 비목표

3.2.1. 글로벌 자비스 사양 본문 임의 수정 (`jarvis-design.md` v6.0.5 동결, 변경 제안은 `ledger/notes/v6-candidates.jsonl` 적재만).
3.2.2. kuji 게임 로직 변경 (마이그레이션은 운영 구조 한정).
3.2.3. 라이브 검수 보정 (M3 series + M4 + M4.1 + M4.2 + M5 잔여 백로그) - 시범 사이클 회고 후 별도 처리.
3.2.4. 신 자비스 자산 자체 변경 (`hooks/` / `agents/` / `workflows/`) - 사용 한정.

# 4. 결정 영역

## 4.1. 사용자 결정 영역 (확정)

| ID | 결정 | 값 | 비고 |
|---|---|---|---|
| 4.1.1 | 도메인 등재 위치 | §4.3 웹 게임 프로토타입 sub-도메인 | §4 신설 회피, 정체성 = 추첨 메커닉 시뮬레이터 |
| 4.1.2 | 운영 모드 | 5단계 풀 (Research → Plan → Execute → Review → Ship) | 압축 모드는 마이크로 patch 한정 |
| 4.1.3 | output style | `rpg-designer` 제거 또는 RPG 도메인 한정 사용 | 글로벌 CLAUDE.md §1로 충분 |
| 4.1.4 | 구 산출물 처리 | archive 후 시범 사이클 회고 종료 시점 삭제 | 학습은 Mistake Ledger로 이관 |
| 4.1.5 | 시범 사이클 대상 | M5+ Last One 단일화 | M4.2 백로그 답습 |
| 4.1.6 | 마이그레이션 단위 | gradual (시범 → 회고 → 잔여 흡수) | big bang 회피, 자비스 사상 정합 |

## 4.2. 자비스 자율 영역

4.2.1. handoff JSON template kuji 도메인 어댑터 작성.
4.2.2. `docs/05_pipeline.md` ↔ 신 사양 §6.5 매핑 표 본문 갱신.
4.2.3. project CLAUDE.md 초안 (사용자 검토 후 sign-off).
4.2.4. kuji rubric 초안 (사용자 검토 후 §6.4 적재 요청).

## 4.3. 단계 후보 영역 (시범 사이클 회고 후 결정)

4.3.1. M5.1 selectable / M6 코토부키야 / 라이브 검수 보정의 흡수 순서.
4.3.2. archive 디렉토리 위치 (`docs/pipeline/_archive/v5/` vs `docs/_archive/pipeline-v5/`).
4.3.3. handoff JSON instance 보관 정책 (사이클 종료 후 삭제 vs 누적).

# 5. 단계 매핑 (구 8단계 → 신 5단계)

| 구 단계 | 신 매핑 | 비고 |
|---|---|---|
| 1 plan | Plan | handoff JSON instance 추가 |
| 2 design | Plan 후반 (사양 산출물) | 본체 `docs/01_spec.md` + `docs/02_data.md` 갱신 보존 |
| 3 design_review | Review sub-loop (Evaluator) | §6.5.5 fleet review 답습 |
| 4 impl_plan | Plan (구현 분해) | 통합 |
| 5 implement | Execute | 자동 검증 sub-loop (§6.2.2) |
| 6 impl_review | Review (Evaluator-Optimizer §6.5.6) | rubric.pass_threshold 기준 |
| 7 qa | Review 사용자 sign-off | `/jarvis-contract sign` |
| 8 improve | Ship + Ratchet | Mistake Ledger 자동 적재 |

# 6. 영향 매트릭스

| 영역 | 파일 / 자산 | 변경 |
|---|---|---|
| 글로벌 사양 | `~/.claude/jarvis-design.md §4.3` | kuji sub-도메인 ref 추가 (사용자 명시 승인 필요) |
| 글로벌 output style | `~/.claude/output-styles/rpg-designer.md` | RPG 도메인 한정 또는 제거 (사용자 결정) |
| 글로벌 rubric | `~/.claude/jarvis-design.md §6.4` | kuji rubric 추가 (사용자 명시 승인 필요) |
| project | `D:/claude_code/kuji/.claude/CLAUDE.md` | 신설 (80줄 이하) |
| project | `D:/claude_code/kuji/CLAUDE.md` | 슬림화 + 신 사양 reference (글로벌 ↔ project 책임 분리) |
| project | `docs/05_pipeline.md` | 8→5 매핑 어댑터로 본문 갱신 또는 archive 후 신 사양 reference |
| project | `docs/pipeline/M*/` (구 산출물) | `_archive/v5/`로 이관 |
| project | `PROGRESS.md` | self-critique 패턴을 Mistake Ledger로 이관 후 슬림 |
| project | `NEXT-SESSION.md` | handoff JSON instance와 흐름 정합 |

# 7. 마일스톤

## 7.1. M1 정체성 정합 (1 세션)

7.1.1. project CLAUDE.md (`.claude/CLAUDE.md`) 신설 초안.
7.1.2. `~/.claude/jarvis-design.md §4.3` kuji sub-도메인 ref 추가 (**사용자 명시 승인 필요**).
7.1.3. `~/.claude/output-styles/rpg-designer.md` 처리 결정 (제거 vs RPG 한정).
7.1.4. kuji rubric 초안 작성 (시뮬레이터 도메인).
7.1.5. 통과 게이트: 사용자 sign-off.

## 7.2. M2 파이프라인 매핑 (1 세션)

7.2.1. `docs/05_pipeline.md` 8→5 매핑 어댑터 본문 갱신 또는 archive + reference.
7.2.2. handoff JSON template kuji 어댑터 작성 (필요 시).
7.2.3. `/jarvis-contract new` 흐름 검증 (드라이런).
7.2.4. 통과 게이트: 사용자 sign-off + drycontract sign-off 시뮬레이션 PASS.

## 7.3. M3 시범 사이클 - M5+ Last One (1 사이클)

7.3.1. 신 5단계 풀 1회 운영.
7.3.2. handoff JSON 5종 instance 실 작성.
7.3.3. Default-FAIL contract 실 sign-off.
7.3.4. Mistake Ledger kuji 도메인 cluster 첫 적재.
7.3.5. 통과 게이트: 5단계 정상 종료 + Mistake Ledger 적재 확인 + Last One 단일화 라이브 검수 PASS.

## 7.4. M4 회고 + 점진 흡수 (점진)

7.4.1. 시범 회고 보고서 작성 (격차 / 누락 / 학습).
7.4.2. 구 산출물 archive 삭제 (회고로 학습 추출 종료 시점).
7.4.3. 잔여 백로그(M5.1 selectable / M6 코토부키야 / 라이브 검수 보정) 신 사이클로 차례 흡수.
7.4.4. 통과 게이트: 잔여 백로그 100% 신 사이클 이관 완료.

# 8. 리스크

| ID | 리스크 | 완화책 |
|---|---|---|
| 8.1 | 8단계의 단계 3/6 격리 검증을 5단계 흡수 시 누락 | §6.5.6 Evaluator-Optimizer + §6.5.5 fleet review 답습. M3 시범에서 명시 확인 |
| 8.2 | 구 `docs/pipeline/M*/` 8종 산출물 = 학습 자원. archive 시 self-critique 흐름 단절 | `PROGRESS.md 14.5` 학습 패턴을 Mistake Ledger로 옮긴 후 archive. M4에서 archive 삭제 전 점검 |
| 8.3 | 글로벌 자비스 사양 §4.3 / §6.4 / output-styles 수정 = 글로벌 자산 변경 (rule 4.2 위반 가능) | 모든 글로벌 변경은 사용자 명시 sign-off 큐 경유 (rule 2.3) |
| 8.4 | output style 변경 시 사용자 정체성 톤 충돌 (25년차 RPG 기획자 톤) | RPG 도메인(§4.1 / §4.4) 한정 사용으로 보존, kuji 세션은 글로벌 CLAUDE.md §1로 운영 |
| 8.5 | M5+ Last One 단일화는 데이터 정의 / 자산 키 / 표시 라벨 통합 (M4.2 백로그 답습). 시범 사이클이라 부피 폭증 우려 | 5단계 풀이라 가시성 보장. round 1 P0 발견 시 §6.5.6 Evaluator-Optimizer로 즉시 회귀. 부피 폭증 시 단계 압축 모드 일시 적용 검토 |
| 8.6 | 구/신 공존 기간 산출물 두 종류 관리 부담 | M1~M2 = 1 세션씩. M3 시범 종료까지 최대 3 세션. 공존 기간 최소화 |

# 9. 성공 기준

9.1. 시범 사이클(M5+ Last One)이 신 5단계 풀로 1회 정상 종료.
9.2. handoff JSON 5종 instance가 작업 디렉토리에 실 작성.
9.3. `/jarvis-contract` Default-FAIL 게이트 1회 정상 sign-off.
9.4. Mistake Ledger에 kuji 도메인 cluster 최소 1건 적재.
9.5. kuji가 신 자비스 사양 `§4.3` sub-도메인으로 본문 등재.
9.6. `D:/claude_code/kuji/.claude/CLAUDE.md` 80줄 이하 신설.
9.7. `rpg-designer` output style은 RPG 도메인 한정 또는 제거 결정 박힘.
9.8. 구 산출물(`docs/pipeline/M1` ~ `M5-ceiling-rule/`)이 `_archive/v5/`로 이관.

# 10. 변경 이력

10.1. 2026-05-19: 신설. 마이그레이션 메타 스프린트 시작. 구 8단계 패턴의 마지막 사용.
