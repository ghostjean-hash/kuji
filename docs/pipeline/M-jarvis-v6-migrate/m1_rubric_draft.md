# M1 rubric 초안 - kuji 시뮬레이터 도메인 (§6.4.6 후보)

본 문서는 신 자비스 v6.0.5 사양 `~/.claude/jarvis-design.md §6.4` 도메인별 평가 Rubric에 추가할 §6.4.6 kuji 시뮬레이터 도메인 초안. **사용자 명시 sign-off 후 글로벌 사양 본문에 적재.**

# 1. 등재 위치

1.1. 사양 §4.3 본문에 kuji 추가 (sub-도메인).
1.2. 사양 §6.4 본문에 §6.4.6 신설.
1.3. 사양 §5.2 스택 (해당 시) - 시뮬레이터 스택 미정의이므로 본 cycle 비목표.

# 2. 사양 §4.3 본문 갱신 (제안)

## 2.1. 기존

```
### 4.3. 웹 게임 프로토타입
- 테트리스, 로또, 스도쿠, 슈팅 등
- 특성: verifiable correctness
- 권장 워크플로우 패턴: Sequential + Headless (6.5.2)
```

## 2.2. 제안

```
### 4.3. 웹 게임 프로토타입
- 테트리스, 로또, 스도쿠, 슈팅, kuji(쿠지 추첨 메커닉 시뮬레이터) 등
- 특성: verifiable correctness
- 권장 워크플로우 패턴: Sequential + Headless (6.5.2)
- kuji 도메인 평가 rubric: §6.4.6 (시뮬레이터 sub)
- §4.2 스타비긴즈 "쿠지"(디지털 굿즈 시스템)와 본질 구분 - 메커닉 시뮬레이터 vs 사용자 관계 시스템
```

# 3. 사양 §6.4.6 신설 (제안)

## 3.1. 본문 형식 (사양 §6.4 패턴 답습)

```
#### 6.4.6. kuji 시뮬레이터 도메인 (§4.3 sub)
- 확률 메커닉 정확성, 라인업 데이터 SSOT 정합, 모듈 분리(core/render/data), 톤 정합(학습/체험), 인계 가능성
- §4.3 웹 게임 프로토타입 sub-도메인. verifiable correctness 특성.
- 권장 워크플로우 패턴: Sequential + Headless (6.5.2)
- pass_threshold: 75 (subjective 적은 도메인, 데이터 검증 가능)
```

## 3.2. 채점 기준 상세 (운영 자산)

| 항목 | 가중치 | 측정 기준 |
|---|---|---|
| 확률 메커닉 정확성 | 30 | 박스 비복원 / 등급 분포 / Last One / Double Chance / 천장 룰 데이터가 라인업 SSOT와 일치. 매직 넘버 0개. |
| 라인업 데이터 SSOT 정합 | 25 | `research/lineups.json` → `docs/02_data.md` → `src/data/numbers.js` 단방향 흐름 위반 0건. `estimated` 필드 보존. |
| 모듈 분리 | 20 | `src/core/` → DOM / Canvas import 0건. core / render / data 의존성 그래프 위반 0건. |
| 톤 정합 | 15 | "확률 향상" / "필승" / 사행성 표현 0건. 학습 / 체험 표현 유지. |
| 인계 가능성 | 10 | handoff JSON 5종 instance 완결성 + 다음 사이클이 본 산출물만으로 진입 가능. |

총점 100. pass_threshold 75. Evaluator-Optimizer 루프(§6.5.6) 진입 조건: 가중 평균 < 75. max_iterations 기본 3.

## 3.3. 도메인 특성

- 산출물: 시뮬레이터 코드 (`src/`) + 사양 docs + 라인업 데이터 + handoff JSON
- 특성: verifiable correctness (확률 검증 가능, 데이터 SSOT 검증 가능)
- 권장 패턴: Sequential + Headless (§6.5.2)
- 인계 대상: 다음 사이클 자비스 (handoff JSON 5종)
- 보더라인 escalation: 70~74 점수 시 opus_4_7_high 재채점 1회 (§6.4 escalation 정합)

# 4. 사용자 sign-off 요청

4.1. 본 초안의 사양 §4.3 본문 갱신 (2.2) 적용 승인 여부.
4.2. 본 초안의 사양 §6.4.6 신설 (3.1) 적용 승인 여부.
4.3. 채점 기준 상세 (3.2) 가중치 / pass_threshold 조정 의견.
4.4. 글로벌 사양은 v6.0.5 동결 상태. 변경 적용 시 v6.0.6 patch 1건 발생 의무 (jarvis-design.md §13.2 룰).

# 5. 변경 이력

5.1. 2026-05-19: 신설. M-jarvis-v6-migrate M1 산출물 (7.1.4).
