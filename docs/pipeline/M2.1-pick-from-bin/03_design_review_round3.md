# M2.1 pick-from-bin - 03 design_review (round 3)

| 항목 | 값 |
|---|---|
| 단계 | 3 design_review (재검증 2회차, 사용자 한도 초과 명시 승인) |
| 검증자 | subagent (general-purpose, 격리 컨텍스트) |
| 검증일 | 2026-05-03 |
| 검증 대상 | docs/01_spec.md (2차 정정 후) + docs/02_data.md |
| 누적 결함 | 1차 모순 4 / 누락 3 + 2차 신규 모순 2 |
| 결과 | 통과 |

# 1. 2차 결함 정정 결과

## 1.1. C-N1. "통 선택 완료" 용어의 두 의미 충돌

해결.

근거:
- 01_spec 5.14.5.0 재기술 확인 (256줄): "`pendingPickResult` 가 존재하는 상태 = **'통 선택 완료'** (슬롯 클릭으로 splice 발생 + history 즉시 커밋된 직후 ~ 사용자 reveal 직전 사이의 1매 단위 상태). 슬롯 미클릭 + `pendingPickResult` 부재 = '통 선택 미완료' (격자 표시 단계). reveal 확인 후 `pendingPickResult` 초기화 + history `revealed: true` 갱신 = '1매 사이클 종료' 상태."
- 1차 보고서 O-3 권고 옵션 A ("`pendingPickResult` 존재 상태 = 통 선택 완료") 채택. 2차 보고서 C-N1 권고 옵션 A와 동일.
- 5.10.1 (152줄): "skip ON 또는 통 선택(5.14) 완료 시 뜯기 가능. skip OFF 시 통 선택 미완료 상태에서는 뜯기 패널 미표시" → "통 선택 완료" = pendingPickResult 존재 = 뜯기 가능. 5.14.5.0 정의와 정합.
- 5.10.1 / 5.14.5.0 / 4장 6.b2 진입 조건이 "skip ON 또는 pendingPickResult 존재"로 일관 정합.

## 1.2. C-N2. 5.14.5.0 진입 조건 표현 vs 4장 6.b2 / b3 본문 불일치

해결 (C-N1 옵션 A 정정으로 동시 해소).

근거:
- 01_spec 5.14.5.0 마지막 줄 (256줄): "5.10.1 / 4장 6.b2 진입 조건 = 'skip ON 또는 pendingPickResult 존재' (양쪽 모두 pendingPeelResult 부재 전제). reveal 진행 중 (pendingPeelResult 존재) = 4장 6.b3 분기."
- 4장 6.b2 (50줄): "인벤토리 ≥ 1 + pendingPeelResult 없음 + (skip ON 또는 pendingPickResult 존재) → 뜯기 카드" → 5.14.5.0과 정합.
- 4장 6.b3 (51줄): "인벤토리 ≥ 1 + pendingPeelResult 존재 → reveal 진행 중" → 5.14.5.0과 정합.
- b2 ↔ b3 혼동 표현 제거. 본문과 매핑 일치.

# 2. 1차 결함 잔존 점검

| ID | 잔존 점검 결과 | 근거 |
|---|---|---|
| C-1 | 해결 유지 | 5.14.2.1 / 5.14.2.2 (230~233줄) "슬롯 80 = 일반 79 + Last One 1, 셔플 배열 인덱스 0~`BOX_SIZE - 2`와 1:1 매핑" 명시 유지. 5.14.3.4 / 5.14.4.5 Last One 슬롯 비활성 + 자동 지급 흐름 유지. |
| C-2 | 해결 유지 | 4장 6.b1 (49줄) "pendingPeelResult 없음" 조건 유지. b2/b3 분기 명시 유지. |
| C-3 | 해결 유지 | 5.9.2 (142줄) "`BUY_QUICK_OPTIONS` (= [1, 3, 5, 10])" 유지. 02_data 1.6과 일치. |
| C-4 | 해결 유지 | 02_data 3.2.1 (292줄) "`kuji_meta.schemaVersion` 사용 (camelCase, 04_conventions 1.2 정합)" 유지. |
| O-1 | 해결 유지 | 5.14.4.2 / 5.14.4.6 (248 / 252줄) 즉시 history 커밋 정책 유지. 02_data 3.1 `kuji_history` 항목에 `pickIndex` / `revealed` 필드 유지. 02_data 3.2.3 마이그레이션 backfill 명시 유지. |
| O-2 | 해결 유지 | 5.14.6.5 (266줄) "drawOne 호출은 사용자가 뜯기 액션 시작 시점 = 5.3.7 skip ON 분기 그대로 (`splice(0)`). 카드 표시 시점에는 호출되지 않음" 명시 유지. |
| O-3 | 해결 유지 (C-N1 정정으로 보강) | 5.14.5.0 정의 명시 + 5.10.1 용어 사용 의미와 정합. 부분 해결 → 완전 해결로 격상. |

# 3. 신규 결함 (2차 정정 과정에서 도입)

## 3.1. 모순

없음.

5.14.5.0 재기술 후 5.10.1 / 4장 6.b2 / 6.b3 / 5.14.4.4 / 5.14.6.5 / 5.14.4.6 / 7.11 모두 정합 검증 완료. 충돌 없음.

## 3.2. 누락

없음.

2차 정정은 5.14.5.0 본문 재기술 단일 변경. 새 메커니즘 / 새 키 / 새 분기 도입 없음. 누락 가능성 없음.

## 3.3. 일관성

없음 (정보성으로 격하 가능 항목 1건 → 4장 참조).

# 4. 정보성 (게이트 미반영)

4.1. **I-N1 잔존**. 5.14.2.5 비균등 격자 시 Last One 슬롯 위치. M3 ワンピース 도입 시점 결정. 본 사이클 (BOX_SIZE 80 = 10×8 균등) 영향 없음.

4.2. **I-N2 잔존**. 02_data 3.1 `kuji_history` 항목 스키마의 `pickIndex (M2.1)` 표기에 nullable 명시 누락. 마이그레이션 3.2.3 본문에는 `pickIndex = null` backfill 명시. 스키마 표 (283줄) 자체 nullable 표기 보강 권장. 본 사이클 동작 영향 0, 정보성.

4.3. **I-N3 신규 (정보성)**. 5.14.4.4 (250줄) "`pendingPickResult` 초기화 = '통 선택 완료' 상태 해제" 표현 vs 5.14.5.0 "1매 사이클 종료" 용어. 동일 상태 전이를 두 표현으로 기술. 의미 정합 (둘 다 pendingPickResult 부재 + history `revealed: true` 갱신 후 상태). 5.14.4.4를 "= '1매 사이클 종료' 상태 진입 (5.14.5.0)" 으로 표현 통일 권장. 게이트 미반영.

4.4. **I-N4 신규 (정보성)**. 5.14.5.0 "통 선택 완료" 시간 경계가 "슬롯 클릭 직후 ~ 사용자 reveal 직전"으로 정의됨. 그러나 reveal 진행 중 (pendingPeelResult 존재)인 4장 6.b3 시점에도 pendingPickResult 는 존재 (5.10.4 "drawOne 재호출 없음, pendingPickResult 사용"). 정의상 b3 시점도 "통 선택 완료" 범위 (pendingPickResult 존재 = 정의 충족) vs 본문 시간 경계 ("reveal 직전까지")의 미묘한 불일치. 4장 분기 매핑에는 영향 없음 (b2/b3 모두 pendingPickResult 존재 가능, 분기 키는 pendingPeelResult). 게이트 미반영. 5.14.5.0 본문에 "(reveal 진행 중에도 pendingPickResult 존재 = 통 선택 완료 상태 유지, reveal 확인 후 1매 사이클 종료)" 보강 시 완전 정합.

# 5. 종합

5.1. 1차 결함 해결 7/7 (C-1 / C-2 / C-3 / C-4 / O-1 / O-2 / O-3 모두 해결 유지) + 2차 결함 해결 2/2 (C-N1 / C-N2 모두 해결) + 신규 모순 0 / 누락 0.

5.2. 게이트: **통과**.
- 통과 기준 6.1 ("1차 + 2차 결함 모두 해결 + 신규 모순 0 + 신규 누락 0") 충족.
- 정보성 4건 (I-N1 / I-N2 / I-N3 / I-N4)은 게이트 미반영. 단계 4 impl_plan에서 선택적 반영 가능.

5.3. 권고:

5.3.1. **단계 4 impl_plan 진입 권고**.
- 통 선택 격자 컴포넌트 / drawOne `pickIndex` 시그니처 확장 / `pendingPickResult` 메모리 전용 + history 즉시 커밋 정책 / `revealed: false` 새로고침 복원 흐름 / skip 토글 양방향 동기화 / Last One 슬롯 비활성 + 자동 지급 5개 영역이 핵심 구현 단위.

5.3.2. **단계 4 impl_plan에서 선택적 반영 권고 (정보성)**:
- I-N1: M3 ワンピース 라인업 도입 시 5.14.2.5 비균등 격자 Last One 위치 명확화.
- I-N2: 02_data 3.1 `kuji_history` 스키마 표에 `pickIndex` nullable 표기 보강.
- I-N3: 5.14.4.4 "통 선택 완료 상태 해제" → "1매 사이클 종료 상태 진입" 표현 통일.
- I-N4: 5.14.5.0 시간 경계 표현에 "reveal 진행 중에도 pendingPickResult 존재 = 통 선택 완료 상태 유지" 명시 보강.

5.3.3. 본 정보성 4건은 단계 4에서 일괄 반영 또는 단계 6 impl_review 시점 회수. 게이트 차원 미반영.

5.3.4. 사용자 한도 초과 명시 승인 하 진행된 3차 재검증 통과. 단계 4 impl_plan 진입 가능.
