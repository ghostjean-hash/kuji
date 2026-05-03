# M2.1 pick-from-bin - 03 design_review (round 5, B-α 재정정 + round 4 결함 정정 후)

| 항목 | 값 |
|---|---|
| 단계 | 3 design_review (재검증 4회차, 자동 재시도 1회) |
| 검증자 | subagent (general-purpose, 격리 컨텍스트) |
| 검증일 | 2026-05-03 |
| 검증 대상 | docs/01_spec.md + docs/02_data.md (round 4 정정 후) |
| 누적 결함 | round 1~4: 모두 해결 + round 5 정정: 모두 해결 |
| 결과 | 통과 |

# 1. round 4 결함 정정 결과

## 1.1. C-R4-1 (모순, 높음) - 첫 진입 안내 문구 spec ↔ 02_data 불일치

1.1.1. **정정 대상 검증**:
- spec 5.14.7.2: `"N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다."`
- 02_data 1.12 `PICK_FIRST_HINT_TEXT_KO`: `"N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다."`
- 두 문자열 char-by-char 일치. 사행성 표현 0건 ("확률" / "필승" / "당첨률" 등 없음).
- 02_data 1.12 비고란에 "B-α 정합. 사행성 표현 0건" 명시.
- spec 8.11 변경이력 명시 ("02_data + src/data/numbers.js 동시 갱신").
- 02_data 4.11 변경이력 명시 (`PICK_FIRST_HINT_TEXT_KO` 값을 spec 5.14.7.2 본문과 일치).

1.1.2. **결과: 해결 ✓**.

## 1.2. C-R4-2 (모순, 중) - Last One 슬롯 회색화 시점 격자 닫힘 시점 모순

1.2.1. **정정 대상 검증**:
- spec 5.14.4.4: "확인 클릭 시 ... 격자 패널 닫힘 → peel 패널 자동 진입"
- spec 5.14.4.5 (정정 후): "**격자는 확인 클릭 시점에 닫힘** (5.14.4.4) → 다음 사이클(예: 박스 리셋 후 또는 추가 구매 후)에 다시 격자 진입 시 history의 lastOne 동시 지급 항목이 reveal 완료된 상태(`isLastOne: true`이면서 history append 완료) 기준으로 Last One 슬롯이 `last-one-drawn` 상태로 렌더. 즉 시각 분리(5.14.0.3) 정합 = 갤러리 / 캐러셀과 동일하게 Last One 슬롯도 reveal 후에만 회색."
- 정정 의도가 명확화됨: "다음 사이클 격자 재진입 시" 시각 처리. 격자 닫힘 시점 모순 해소.
- 5.14.0.3 시각 분리 정책과 정합 ("갤러리 / 캐러셀 / 마이너 row / Last One row 갱신은 reveal 시점에만").
- 5.14.3.6 `last-one-drawn` 상태 정의와 정합 (회색).
- 5.14.4.4 격자 닫힘 시점과 정합 (확인 클릭 시점에 닫힘).
- spec 8.11 변경이력 명시 ("Last One 슬롯 회색화 시점 - 격자 닫힘 시점 후 다음 사이클 격자 재진입 시 시각 분리 정합 명확화").

1.2.2. **시나리오 6.5 잔존 표현 점검**: 시나리오 6.5 본문 "격자의 Last One 슬롯도 reveal 시점에 회색화" 표현은 round 4 시점 그대로. 하지만 5.14.4.5의 명확화로 의미는 "reveal 시점 = history append 시점 = 다음 격자 재진입 시 isLastOne true 기준 last-one-drawn 상태로 렌더"로 해석 가능. 6.5는 사용자 시나리오 거시 흐름이고 5.14.4.5가 메커닉 SSOT이므로 정합. **OK** (단 시나리오 6.5 표현 자체는 다소 단축형. 정보성 I-R5-1로 분류, 게이트 미반영).

1.2.3. **결과: 해결 ✓**.

## 1.3. M-R4-1 (누락, 중) - B-α 재정정 in-place backfill 정책 누락

1.3.1. **정정 대상 검증** (02_data 3.2.4 신설):
- 조건 1: `schemaVersion < 3` → 3.2.3 v2→v3 마이그레이션 (lockedResult: null backfill 포함). **부재 케이스 1 커버 ✓**.
- 조건 2: `schemaVersion === 3` AND `unopenedTickets[i].lockedResult === undefined` → 해당 ticket에 `lockedResult: null` 부여 (in-place backfill, schemaVersion 그대로 유지). **부재 케이스 2 (기존 v3 사용자) 커버 ✓**.
- 멱등성: "본 backfill은 멱등 (이미 lockedResult 정의된 ticket에는 미적용)" 명시. **멱등성 명시 ✓**.
- schemaVersion 미bump: "schemaVersion bump 없음" 명시 + 조건 2에서도 "schemaVersion 그대로 유지" 명시. **미bump 명시 ✓**.
- `kuji_history`의 deprecated `revealed` 필드 보존 명시 ✓ (구 데이터 호환).
- spec 8.11 / 02_data 4.11 변경이력 명시 ✓.

1.3.2. **state 매트릭스 정합성 추가 점검**: round 4의 누락 근거 ("undefined !== null이므로 b1 분기 false → b2 분기 false → 분기 미정")가 backfill로 해소. backfill 후 모든 ticket이 lockedResult를 명시적으로 보유 (null 또는 DrawResult) → 4장 6.b1 ("lockedResult === null") / 6.b2 ("lockedResult 보유") 분기가 결정적. **OK**.

1.3.3. **결과: 해결 ✓**.

# 2. 신규 결함 (round 5 정정 과정에서 도입)

## 2.1. 모순

2.1.1. **신규 모순 0건**.

2.1.2. **점검 항목**:
- 1.12 `PICK_FIRST_HINT_TEXT_KO` 값 변경이 다른 spec / data 부분과 충돌하는가 → spec 5.14.7.2 외 참조 없음. 일치만 발생. **OK**.
- 5.14.4.5 정정이 5.14.4.4 (격자 닫힘) / 5.14.0.3 (시각 분리) / 5.14.3.6 (last-one-drawn 상태) 와 정합하는가 → 모두 정합. **OK**.
- 02_data 3.2.4 신설이 3.2.3 v2→v3 마이그레이션과 충돌하는가 → 3.2.4 조건 1이 "schemaVersion < 3 → 3.2.3 위임" 명시이므로 위임 관계 명확. **OK**.
- 02_data 3.2.4 가 `kuji_history.revealed` deprecated 정책 (3.1) 과 정합하는가 → "backfill 보존 (구 데이터 호환)" 명시이므로 deprecated이지만 보존 정책과 정합. **OK**.

## 2.2. 누락

2.2.1. **신규 누락 0건**.

2.2.2. **점검 항목**:
- 02_data 3.2.4 가 다루지 않는 케이스 존재? → (a) v0 또는 v1 사용자: 3.2.1 / 3.2.2 / 3.2.3 체인으로 처리됨 (v1 → v2 → v3). 본 정정 영역 밖. (b) v3 사용자 + lockedResult가 null이 아닌 잘못된 값 (e.g. 빈 객체) 보유: 정상 코드 경로에서 발생 불가 (lockedResult는 null 또는 완전한 DrawResult 객체). storage corruption은 7.12 일반 정책 영역. **OK**.
- 5.14.4.5 정정이 새로 도입한 "다음 사이클 격자 재진입" 표현의 history isLastOne 플래그 set 시점 = reveal 시점이라는 정합 점검 필요 → spec 5.10.4 + 5.14.0.3 + 5.14.5.2 모두 "reveal 시점에 history append" 명시. isLastOne은 history 항목의 필드이므로 history append 시점에 set. 정합. **OK**.

## 2.3. 일관성 / 형식

2.3.1. 신규 일관성 / 형식 결함 0건.

# 3. 이전 사이클 결함 잔존 점검

## 3.1. round 1 결함 (C-1 / C-2 / C-3 / O-1 / O-2 / O-3 / K-1 / I-1)

3.1.1. C-1 (5.14.2 슬롯 80 = 일반 79 + Last One 1): 5.14.2.2 / 5.14.2.5 명시 유지 ✓.
3.1.2. C-2 (4장 6.b1/b2/b3 pendingPeelResult 조건): 4장 6번 분기 모두 pendingPeelResult 조건 명시 유지 ✓.
3.1.3. C-3 (5.9.2 BUY_QUICK_OPTIONS [1,3,5,10]): 02_data 1.6 `[1, 3, 5, 10]` 유지 ✓.
3.1.4. O-1 (history 즉시 커밋 + revealed 필드): round 4 B-α 재정정으로 history는 reveal 시점에만 append + revealed 필드 deprecated. 더 강한 시각 분리 정책으로 자연 해소 ✓.
3.1.5. O-2 (5.14.6.5 OFF→ON 전환 drawOne 호출 시점 명시): 5.14.6.5 본문 "drawOne N회 호출 = `splice(0)` 반복" 명시 유지 ✓.
3.1.6. O-3 (5.14.5.0 "통 선택 완료" 정의): 5.14.5.0 본문 명시 유지 + B-α 재정의로 더 명확화 ✓.
3.1.7. K-1 (5.10.9 결과 모달 → 결과 reveal): 5.10.9 본문 "결과 reveal 시점에 등급 글자에 ... 스케일 POP 애니메이션" + "M2 모달 폐기 정책 5.10.4 / 5.10.6 정합" 명시 유지 ✓.
3.1.8. I-1 (5.9.3 invariant): 5.9.3 본문 "(누적 인벤토리 + 신규 구매 매수) ≤ 박스 deck 잔여" 명시 유지 ✓.

## 3.2. round 2 신규 결함 (C-N1 / C-N2)

3.2.1. C-N1 ("통 선택 완료" 용어 의미 통일): 5.14.5.0 본문 "raw ticket (`lockedResult === null`) 수 == 0 = 통 선택 완료" 정의 (B-α 재정의). round 2의 옵션 A (pendingPickResult 존재 = 완료) 는 B-α에서 pendingPickResult 폐기 + lockedResult 통합으로 더 명확한 정의로 진화. **해결 유지** ✓.
3.2.2. C-N2 (5.14.5.0 b2 ↔ b3 혼동): 5.14.5.0 본문 "5.10.1 / 4장 6.b2 진입 조건 = ... (양쪽 모두 pendingPeelResult 부재 전제). reveal 진행 중 (pendingPeelResult 존재) = 4장 6.b3 분기" 명시 유지 ✓.

## 3.3. round 3 잔존 정보성 (I-N1 ~ I-N4)

3.3.1. I-N1 (M3 비균등 격자) / I-N2 (kuji_history pickIndex nullable 표기): round 4에도 유효. round 5 본 사이클 미정정. 게이트 영향 없음 (정보성).
3.3.2. I-N3 / I-N4: round 4 시점에 "5.14.5.0 본문이 round4에서 재기술되어 자연 해소" 평가. round 5에도 자연 해소 상태 유지 ✓.

## 3.4. round 4 정보성 7건 (I-R4-1 ~ I-R4-7)

3.4.1. I-R4-1 (시드 변경 시 인벤토리 / lockedResult 폐기 정책 미명시): round 5 본 사이클 미정정. 게이트 영향 없음 (정보성).
3.4.2. I-R4-2 (혼재 케이스 흐름 명시 없음): round 5 본 사이클 미정정. 게이트 영향 없음 (정보성).
3.4.3. I-R4-3 (격자→deck 변환 N개 동시 변환 알고리즘 해석 A/B): round 5 본 사이클 미정정. 단계 4 impl_plan 영역. 게이트 영향 없음 (정보성).
3.4.4. I-R4-4 (5.14.6.5 OFF→ON 정책 채택 사유 명시 없음): round 5 본 사이클 미정정. 게이트 영향 없음 (정보성).
3.4.5. I-R4-5 (drawRng lifecycle 명시 없음): round 5 본 사이클 미정정. 03_architecture 영역. 게이트 영향 없음 (정보성).
3.4.6. I-R4-6 (03_architecture 3.11 pendingPickResult 잔존): round 5 본 사이클 미정정. 단계 4 impl_plan 영역. 게이트 영향 없음 (정보성).
3.4.7. I-R4-7 (round 3 잔존 I-N1 / I-N2): round 5 본 사이클 미정정. 게이트 영향 없음 (정보성).

3.4.8. **종합**: round 4 정보성 7건 모두 게이트 미반영 항목. 본 사이클에서 정정 대상 아니므로 잔존 자체는 게이트 영향 없음. 단계 4 impl_plan 진입 시 회수 권고 유지.

# 4. B-α 메커닉 자기-정합 잔존 점검

## 4.1. B-α 흐름 일관성 (5.14.0 ~ 5.14.7)

4.1.1. 5.14.0.1 (선택 단위 N매 통째) → 5.14.0.2 (인벤토리 ticket + lockedResult) → 5.14.0.3 (시각 분리 = reveal 시점에만 갱신) → 5.14.0.4 (drawOne 시점 = 확인 클릭) → 5.14.0.5 (pendingPickResult 폐기) → 5.14.1 진입 조건 (raw ticket) → 5.14.2 격자 → 5.14.3 슬롯 5상태 → 5.14.4 인터랙션 (확인 = drawOne N회 + lockedResult 부여) → 5.14.4.5 Last One 자동 지급 (정정 후 다음 사이클 회색화 명확화) → 5.14.4.6 영속 (slot 메모리 + 확인 시 splice + lockedResult 영속 + history는 reveal 시점) → 5.14.5 사이클 → 5.14.6 skip 토글 → 5.14.7 첫 진입 안내 (정정 후 02_data 일치).

4.1.2. round 5 정정으로 흐름이 깨지지 않음. **OK**.

## 4.2. 시각 분리 정책 정합

4.2.1. 5.14.0.3 (reveal 시점에만 시각 갱신) ↔ 5.14.4.5 정정 (Last One 슬롯 회색화도 reveal 시점에 = 다음 격자 재진입 시 isLastOne true 기준): **정합 강화** ✓.
4.2.2. 5.10.4 / 5.14.4.4 / 5.14.4.6 / 5.14.5.2 / 02_data 3.1 deprecated revealed 모두 일관 유지 ✓.

## 4.3. 결정론

4.3.1. 5.3.7 / 5.3.8 / 5.14.4.7 / 6.6.b 모두 "동일 시드 + 동일 슬롯 선택 순서 → 동일 결과" 정책 유지.
4.3.2. round 5 정정 (PICK_FIRST_HINT_TEXT_KO 값 / 5.14.4.5 회색화 시점 / 02_data 3.2.4 backfill) 모두 결정론 정책에 영향 없음. **OK**.

## 4.4. ticket.lockedResult 라이프사이클

4.4.1. 생성: 5.14.4.4 (확인 클릭) ✓ + 02_data 3.2.4 (in-place null backfill, 신규 케이스 보강) ✓.
4.4.2. 소비: 5.10.4 skip OFF + 5.14.5.2 ✓.
4.4.3. 폐기: 6.9 박스 리셋 ✓.
4.4.4. round 5 정정으로 라이프사이클 누락 케이스 (기존 v3 사용자 unopenedTickets[*].lockedResult undefined) 가 backfill로 보강됨. **OK** (강화).

## 4.5. pendingPickResult 폐기 일관성

4.5.1. spec 본문 grep 결과 5.14.0.5 (폐기 선언) + 8.9 / 8.10 변경이력만 잔존. 5.14 / 5.10 / 4장 / 7장 본문에서 잔존 참조 없음. round 5 정정이 본 정합을 깨지 않음. **OK**.
4.5.2. (참고) 03_architecture 3.11 잔존은 I-R4-6으로 분류된 정보성 (단계 4 impl_plan 영역). 본 검증 대상 (spec + data) 외부.

# 5. 정보성

## 5.1. I-R5-1 (정보성, 낮음). 시나리오 6.5 표현 단축형

5.1.1. 시나리오 6.5: "격자의 Last One 슬롯도 reveal 시점에 회색화" 표현은 단축형. 5.14.4.5 정정으로 의미는 "reveal 시점 = history append 시점 = 다음 격자 재진입 시 last-one-drawn 상태로 렌더" 로 해석 가능. 메커닉 SSOT (5.14.4.5) 와 정합되므로 게이트 영향 없음. 단계 4 또는 단계 6에서 시나리오 6.5 표현을 명확화 권고 ("다음 격자 재진입 시 Last One 슬롯이 last-one-drawn 회색 상태로 렌더").

## 5.2. round 4 정보성 7건 (I-R4-1 ~ I-R4-7) 잔존

5.2.1. 본 사이클 정정 대상 아님. 게이트 미반영. 단계 4 impl_plan 진입 시 회수 권고 유지.

## 5.3. round 3 잔존 정보성 (I-N1 / I-N2)

5.3.1. 본 사이클 정정 대상 아님. 게이트 미반영. 단계 4 또는 단계 6 회수 권고 유지.

# 6. 종합

6.1. **round 4 결함 해결 3/3** + **신규 모순 0** + **신규 누락 0** + **신규 정보성 1건 (I-R5-1, 게이트 미반영)** + **이전 사이클 결함 잔존 0건 (정보성 제외)** + **B-α 자기-정합 잔존 OK**.

6.2. **게이트: 통과**.

6.3. 권고:

6.3.1. **단계 4 impl_plan 진입 가능**. round 5 정정이 round 4 결함 3건을 모두 해소하고 신규 모순 / 누락을 도입하지 않음. B-α 자기-정합 + 시각 분리 + 결정론 + ticket.lockedResult 라이프사이클 + pendingPickResult 폐기 모두 정합 유지 (일부는 backfill로 강화).

6.3.2. **단계 4 impl_plan 진입 시 1차 처리 권고 (잔존 정보성 회수)**:
- I-R4-6: 03_architecture 3.11 / 4.6 / 4.7 / 5.7 / 5.8 / 6.3 에서 `pendingPickResult` 잔존 동기 정정 (spec 5.14.0.5 폐기 정책 정합).
- I-R4-3: 격자→deck 변환 N개 동시 변환 알고리즘 해석 A/B 명시 결정 (impl_plan 영역).
- I-R4-4: 5.14.6.5 OFF→ON 전환 정책 채택 사유 메모.
- I-R4-5: 03_architecture 3.4 또는 spec 5.3 에 drawRng lifecycle 명시.
- I-R5-1: 시나리오 6.5 Last One 슬롯 회색화 표현 명확화.

6.3.3. **선택 권고 (spec 보강)**:
- I-R4-1: spec 5.7 시드 변경 시 인벤토리 / lockedResult 폐기 정책 명시.
- I-R4-2: spec 5.14.5 에 혼재 케이스 흐름 보강 (lockedResult 보유 + raw 혼재 → b2 진행 → 모든 lockedResult 소비 후 b1 격자 진입).
- I-N1 / I-N2 / I-R4-7: 단계 6 또는 M3 진입 시 회수.

6.3.4. round 5는 자동 재시도 1회 한도 내 진행된 라운드. 게이트 통과로 사용자 핸드오프 없이 단계 4 진입 가능.
