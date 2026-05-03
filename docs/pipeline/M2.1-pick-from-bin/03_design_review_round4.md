# M2.1 pick-from-bin - 03 design_review (round 4, B-α 재정정 후)

| 항목 | 값 |
|---|---|
| 단계 | 3 design_review (재검증 3회차, 사용자 한도 초과 명시 승인, B-α 재정정) |
| 검증자 | subagent (general-purpose, 격리 컨텍스트) |
| 검증일 | 2026-05-03 |
| 검증 대상 | docs/01_spec.md + docs/02_data.md (B-α 재정정 후) |
| 결과 | 실패 |

# 1. B-α 메커닉 자기-정합 (3.1)

1.1. **5.14.0 ~ 5.14.7 흐름 일관성**: 5.14.0.1 (선택 단위 N매 통째) → 5.14.0.2 (인벤토리 ticket 모델 + lockedResult) → 5.14.0.3 (시각 분리) → 5.14.0.4 (drawOne 시점) → 5.14.0.5 (pendingPickResult 폐기) → 5.14.1 진입 조건 (raw ticket) → 5.14.2 격자 → 5.14.3 슬롯 5상태 (잔여 미선택 / 선택됨 / 뽑힘 / Last One 대기 / Last One 지급 완료) → 5.14.4 인터랙션 (확인 버튼 = drawOne N회 + lockedResult 부여) → 5.14.5 사이클 (peel 1매 reveal 후 b2 유지 또는 raw 0 시 구매 복귀) → 5.14.6 skip 토글 → 5.14.7 첫 진입 안내. **자기 정합 OK**.

1.2. **ticket.lockedResult 라이프사이클 커버리지**:
- 생성: 5.14.4.4 (확인 클릭 시 N매 lockedResult 순차 부여) ✓
- 소비: 5.10.4 skip OFF (lockedResult 사용, drawOne 재호출 없음) + 5.14.5.2 (reveal 후 인벤토리 1매 제거) ✓
- 폐기: 6.9 (박스 리셋 시 인벤토리 / lockedResult 폐기) ✓ + 5.7.4 (시드 변경 시 box_round 리셋 → 인벤토리 폐기 함의이나 명시 없음)
- **잠재 누락 1건**: 5.7.4 시드 변경 시 인벤토리 / lockedResult 폐기 정책이 명시되지 않음. 6.9 박스 리셋만 명시. 시드 변경은 박스 셔플이 변하므로 lockedResult가 무효화되지만, 본문이 "박스 진행 중이면 확인 모달" 후 어떻게 처리되는지 불명. **정보성 (I-R4-1)** (M2 시점부터 동일 미명시 상태이므로 본 사이클 신규 결함 아님).

1.3. **pendingPickResult 폐기 일관성**: 본문 grep 결과 5.14.0.5 (폐기 선언) + 8.9 변경이력 (이전 사이클 기록)만 잔존. 5.14 / 5.10 / 4장 / 7장 본문에서 잔존 참조 없음. **OK**.

1.4. **5.14.5.0 "통 선택 완료" 정의 vs 5.10.1 / 4장 6.b2 진입 조건 일관성**:
- 5.14.5.0: "raw ticket (lockedResult === null) 수 == 0 = 통 선택 완료. 5.10.1 / 4장 6.b2 진입 조건 = skip ON 또는 첫 ticket의 lockedResult 보유"
- 5.10.1: "첫 ticket의 lockedResult 보유 (또는 skip ON) 시 뜯기 가능"
- 4장 6.b2: "skip ON 또는 첫 ticket.lockedResult 보유"
- 세 곳 모두 일관. **OK**.

1.5. **혼재 케이스 (lockedResult 보유 + raw 혼재)**:
- 5.9.3 invariant는 누적 인벤토리 + 신규 구매를 허용하므로 발생 가능 (예: 확인 후 1매 reveal → 추가 구매).
- 4장 6.b1/b2/b3 분기는 "첫 ticket"의 lockedResult로 도출하므로 동작 자체는 정의됨.
- 5.14.4.3 "N = 인벤토리 raw ticket 수"로 격자 헤더는 정의됨.
- 그러나 5.14.5.x 본문이 "혼재 상태에서 b2 진행 → 모든 lockedResult 소비 후 b1 격자 진입" 흐름을 명시하지 않음. 5.14.5.4는 "다시 N매 구매 → b1 진입"으로 인벤토리 0 후 흐름만 명시. **정보성 (I-R4-2)**.

# 2. 시각 분리 정책 정합 (3.2)

2.1. **history append 시점 일관성**:
- 5.14.0.3: "history는 reveal 시점에만 append. revealed 필드는 deprecated" ✓
- 5.10.4 skip OFF: "페이지플립 reveal 시점에 history append + 갤러리 갱신" ✓
- 5.14.4.4: "history 미커밋. 결과는 ticket.lockedResult에만 저장. history는 reveal 시점에만 append" ✓
- 5.14.4.6 영속 정책: "history는 reveal 시점에 append" ✓
- 5.14.5.2: "peel 1매 reveal 확인 완료 → history append (revealed 필드 미사용)" ✓
- **OK**.

2.2. **갤러리 / 캐러셀 / 마이너 row / Last One row 갱신 시점**:
- 5.14.0.3: 모든 시각 영역이 reveal 시점에만 갱신 명시 ✓
- 5.10.4: "동시에 4장 영역 2/3/4 (메인 캐러셀 / 마이너 row / Last One row) 중 해당 등급 위치에 인플레이스 시각 반영. 갱신 트리거 = reveal 시점 history append (T19 결함 2 정정. 슬롯 선택 / 확인 시점에는 갱신 X)" ✓
- 2.5: "갤러리 / 캐러셀 갱신 = reveal 시점에만 (T19 결함 2 정정)" ✓
- **OK**.

2.3. **02_data 3.1 `kuji_history.revealed` deprecated 처리**:
- 02_data 3.1: "`revealed (M2.1, deprecated B-α)` ... `revealed` 필드는 항상 true이므로 deprecated" ✓
- 02_data 3.2.3 마이그레이션: "`revealed = true` (이미 화면에 노출된 이력으로 간주)" backfill 명시 ✓
- spec 5.14.5.2: "history append (revealed 필드 미사용)" ✓
- deprecated이지만 backfill을 위해 필드 자체는 유지. spec과 정합. **OK**.

# 3. 격자→deck 인덱스 변환 (3.3)

3.1. **5.14.4.4 알고리즘 명시 수준**: 본문은 "각 호출마다 splice로 잔여 deck이 줄어드는 것을 반영하여 변환 (5.14.2.2 매핑 + 03_architecture 3.14 알고리즘)"으로 명시. 03_architecture 3.14는 단일 호출 시점의 격자 → 잔여 deck 인덱스 변환만 정의 (drawnGridIndices 기반).

3.2. **N개 동시 변환 시 알고리즘 미정의**: 03_architecture 3.14의 단일 변환을 N회 반복할 때 두 가지 해석 가능:
- 해석 A (사용자 의도 보존): 사용자 격자 선택 시점의 표시 상태 기준 변환 후, 매 호출마다 누적 splice 효과를 반영하여 최종 deckIndex 보정.
- 해석 B (각 호출 독립): 각 호출 직전에 잔여 deck 상태 + 잔여 격자 상태를 기준으로 단일 변환을 새로 계산.

3.3. **5.14.4.4 본문은 "각 호출마다 splice로 잔여 deck이 줄어드는 것을 반영"이라고만 명시**. 어느 해석이 채택되는지 단계 4 impl_plan으로 위임 가능. **결정론 자체는 어떤 해석이든 입력이 같으면 출력이 같으므로 안전**. 다만 단계 4 impl_plan에서 명시 결정 필요. **정보성 (I-R4-3)**.

3.4. **시나리오 6.3 (gridIndex 17, 3, 50, 22, 8 클릭)**: 5매 격자 선택 → 확인 → drawOne 5회. 각 호출의 deckIndex가 어떻게 결정되는지는 단계 4 알고리즘에 의존. 본 사이클의 결정론 (6.6.b)은 "동일 시드 + 동일 격자 선택 순서 → 동일 결과"이므로 알고리즘만 결정적이면 충족.

# 4. OFF→ON 전환 폐기 정책 합리성 (3.4)

4.1. **5.14.6.5 본문**: "사용자가 일부 슬롯 선택 중이라도 격자 즉시 닫힘. drawOne N회 호출 = `splice(0)` 반복 (= skip ON 흐름. 사용자 선택 폐기) → 인벤토리 raw N매에 lockedResult 일괄 부여 → peel 단계 자동 진입" 명시.

4.2. **합리성 평가**:
- 정책이 명시되어 있으므로 결함 아님.
- 합리성 측면: 사용자가 "skip ON으로 즉시 뜯기" 의도를 표현했으므로 "즉시 = 사용자 선택 무시 + 무작위(splice(0))로 채움"은 일관된 해석.
- 대안 (사용자 선택 보존 + 부족분만 splice(0))도 합리적이지만, "즉시"의 의미를 더 약화시킴.
- 본 정책 채택 사유는 명시되지 않음. 단계 4 impl_plan에 사유 메모 권장. **정보성 (I-R4-4)**.

# 5. 결정론 시나리오 정합 (3.5)

5.1. **시나리오 6.6.b "skip OFF B-α"**: "동일 시드 + 동일 슬롯 선택 순서 (전체 80매에 걸친 누적 순서) → 동일 결과 100% 재현" 명시 ✓.

5.2. **사용자 슬롯 선택 순서 누적 + 추가 구매**: 시나리오 6.5 "사용자가 5매씩 16회 또는 1매 80회 등 자유" 명시. 추가 구매 + 추가 선택 시 drawIndex (drawnCount)는 box.drawnCount += 1 누적 (5.3 추첨 정의에서 boxState.drawnCount 갱신 명시). drawOne 매 호출의 typeIndex 결정에 사용되는 drawRng의 lifecycle은 spec/architecture에 미명시 (현재 박스 셔플 PRNG와 별개로 drawRng가 호출 누적인지 매회 createRng인지 명시 없음).

5.3. **잠재 누락 - drawRng lifecycle**:
- 03_architecture 3.4 drawOne 시그니처: `drawOne(boxState, rng, lineup, pickIndex)` ← rng 인자만. 호출처가 rng를 어떻게 생성/누적하는지 불명.
- 03_architecture 4.2 추첨 1회: `core/draw.drawOne(state.boxState, rng, lineup)` ← 동일.
- spec 5.3.8: "createRng(fnv1a(seed|round|drawIndex))" 식 명시 없음. "박스 셔플 자체는 불변" 명시.
- typeIndex 결정의 결정론은 drawRng가 (a) 박스 초기화 시 1회 createRng 후 누적이라면 호출 순서에 의존, (b) 매회 (seed, round, drawIndex) 기반 createRng라면 drawIndex만으로 결정.
- **본 사이클 신규 결함 아님** (M2 시점부터 동일 미명시). 그러나 6.6.b 결정론 보장을 정확히 평가하려면 drawRng lifecycle이 명시되어야 함. **정보성 (I-R4-5)**.

5.4. **결론**: 결정론 보장은 5.3.8 + 6.6.b에 명시되어 있고, B-α 재정정으로 슬롯 선택 순서가 deckIndex 변환을 통해 drawOne 호출 순서를 결정하므로, drawRng lifecycle이 무엇이든 동일 시드 + 동일 슬롯 순서면 동일 결과 재현 가능 (전제: drawRng가 결정적). **OK** (단 정보성 I-R4-5 권고).

# 6. 마이그레이션 / state 매트릭스 / 사행성 / 단계 5 발견 정정 반영 (3.6~3.9)

## 6.1. 마이그레이션 안전성 (3.6)

6.1.1. 02_data 3.2.3 v2→v3 마이그레이션이 `kuji_unopened_tickets` 기존 항목 backfill `lockedResult = null` 명시 ✓.

6.1.2. SchemaVersion bump 필요 여부: 02_data 4.10 변경이력 "schemaVersion 그대로 v3" 명시 ✓. M2.1 1차 사이클 (T1~T17)은 이미 v3 마이그레이션 완료. B-α 재정정에서는 v3 내 추가 필드 (lockedResult)만 도입하므로 v3 유지 + backfill로 처리 가능. **OK**.

6.1.3. **잠재 정합 점검**: M2.1 1차 사이클 코드는 이미 v3로 마이그레이션 완료 + `lockedResult` 필드 부재. B-α 정정 후 코드 재실행 시 기존 v3 사용자의 `kuji_unopened_tickets`에 lockedResult 없음 → migrateV2ToV3는 이미 schemaVersion=3로 분기 미실행. 별도 fixUpV3 (lockedResult 누락 backfill) 또는 v3→v3.1 migration이 필요할 수 있음. 02_data 3.2.3은 v2→v3만 명시. 단계 5 코드 정정 영역이지만 spec/data 차원의 누락. **잠재 누락 1건 (M-R4-1)**.

## 6.2. state 매트릭스 정합 (3.7)

6.2.1. 4장 6번 영역 5분기 (a/b1/b2/b3/c) 분기 조건:
- (a) 인벤토리 0 + deck ≥ 1 → 구매 패널
- (b1) 인벤토리 ≥ 1 + 첫 ticket.lockedResult === null + skip OFF + pendingPeelResult 없음 → 통 선택 격자
- (b2) 인벤토리 ≥ 1 + pendingPeelResult 없음 + (skip ON 또는 첫 ticket.lockedResult 보유) → 뜯기 카드
- (b3) 인벤토리 ≥ 1 + pendingPeelResult 존재 → reveal 진행 중
- (c) deck 0 → 박스 종료

6.2.2. 모든 분기가 ticket.lockedResult 또는 pendingPeelResult로 결정. 변수 매트릭스에 ticket.lockedResult가 신규 차원으로 추가됨. **OK**.

6.2.3. **잠재 누락 - 03_architecture 3.11 state 객체에 pendingPickResult 잔존**: 03_architecture 3.11 state 객체에 여전히 `pendingPickResult` 필드 정의됨 (검증 대상이 spec + data만이므로 게이트 영향 없음). spec 5.14.0.5는 "state 객체에서도 제거" 명시 → 단계 4 impl_plan 갱신 시 03_architecture 3.11 / 4.6 / 4.7 / 5.7 / 5.8 동기 정정 필요. **정보성 (I-R4-6)** (단계 4 impl_plan 영역).

## 6.3. 사행성 / 등급 표기 / 매직 넘버 (3.8)

6.3.1. **사행성 표현**:
- spec 5.14.7.2: "N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다." (사행성 0건) ✓
- 02_data 1.12 PICK_FIRST_HINT_TEXT_KO: "슬롯을 골라 직접 뽑아보세요. 결과는 시드와 슬롯 위치로 결정됩니다." (사행성 0건) ✓
- 다른 신규 표현 없음.

6.3.2. **등급 표기**: 5.14.3.5 "L1" (영문 단독) 유지 ✓. 신규 위반 없음.

6.3.3. **매직 넘버**: B-α 재정정에서 신규 도입된 상수 = `COLOR_PICK_SLOT_SELECTED_BG` / `COLOR_PICK_SLOT_SELECTED_BORDER` (02_data 2.2). 02_data 1.12 / 2.2에 모두 정의 ✓. spec에 인라인 매직 값 없음. **OK**.

## 6.4. 단계 5 발견 정정 반영 (3.9)

6.4.1. **결함 1 (메커닉 단위 B-α)**: spec 5.14.0.1 명시 ✓. 1장 한 줄 + 2장 코어 루프 + 5.3.7 + 5.10.1 + 5.10.4 + 5.14 절 전체 + 6장 시나리오 + 7장 엣지 모두 B-α 정정 반영 ✓. 8.10 변경이력 명시 ✓.

6.4.2. **결함 2 (시각 노출 분리)**: spec 5.14.0.3 + 5.10.4 + 5.14.4.4 + 5.14.4.6 모두 "history는 reveal 시점에만 append" 정책 일관 명시 ✓. 02_data 3.1 revealed deprecated + 4.10 변경이력 ✓. 2.5 "갤러리 / 캐러셀 갱신 = reveal 시점에만" ✓.

6.4.3. **OK**.

# 7. 모순 / 누락 / 일관성 / 정보성

## 7.1. 모순 (게이트 반영, 필수 정정)

7.1.1. **C-R4-1 (모순, 높음)**. **첫 진입 안내 문구 spec ↔ 02_data 불일치**.
- spec 5.14.7.2: "N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다."
- 02_data 1.12 PICK_FIRST_HINT_TEXT_KO: "슬롯을 골라 직접 뽑아보세요. 결과는 시드와 슬롯 위치로 결정됩니다."
- spec 5.14.7.2는 동일 키 PICK_FIRST_HINT_TEXT_KO를 참조하므로 두 곳 값이 일치해야 함. spec은 "B-α 재정정으로 문구 갱신"이라고 명시했지만 02_data 1.12 본문 갱신 누락. CLAUDE.md 4.5 "docs와 코드가 충돌하면 docs가 진실"의 docs 자체 모순.
- **필수 정정**. 02_data 1.12 PICK_FIRST_HINT_TEXT_KO 값을 spec 5.14.7.2 본문 ("N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다.") 으로 갱신 필요. 또는 spec 5.14.7.2가 02_data 1.12 값을 참조하는 형태로 변경.

7.1.2. **C-R4-2 (모순, 중)**. **5.14.4.5 Last One 슬롯 회색화 시점 vs 5.14.4.4 격자 패널 닫힘 시점 모순**.
- 5.14.4.4: "확인 클릭 시 ... 격자 패널 닫힘 → peel 패널 자동 진입"
- 5.14.4.5: "격자의 Last One 슬롯도 회색화 (`PICK_SLOT_EMPTY_FADE_MS`)는 reveal 시점에"
- reveal 시점에는 5.14.4.4에 의해 격자 패널이 이미 닫혀있으므로, "격자의 Last One 슬롯 회색화"라는 시각 효과를 reveal 시점에 일으킬 수 없음. 시나리오 6.5도 동일 표현 ("격자의 Last One 슬롯도 reveal 시점에 회색화") 사용.
- 의도 추정: "다음 사이클에서 격자가 재진입할 때 Last One 슬롯이 회색화 상태로 표시됨" (= history entry의 isLastOne 플래그가 reveal 시점에 set되므로 격자 재진입 시 5.14.3.6 last-one-drawn 상태로 도출). 그러나 본문이 이를 명시하지 않음.
- **필수 정정**. 5.14.4.5 / 6.5 본문을 "다음 격자 재진입 시 Last One 슬롯이 회색화 상태로 표시 (history isLastOne 플래그 set 후)" 또는 "격자 패널 닫힘 트랜지션 도중 회색화 페이드 (PICK_SLOT_EMPTY_FADE_MS)" 등으로 명확화 필요.

## 7.2. 누락 (게이트 반영, 필수 정정)

7.2.1. **M-R4-1 (누락, 중)**. **B-α 재정정 후 기존 v3 사용자의 `kuji_unopened_tickets` 항목에 lockedResult 필드 backfill 정책 누락**.
- 02_data 3.2.3 v2→v3 마이그레이션은 v2에서 v3로 처음 진입 시점만 다룸. M2.1 1차 사이클 (T1~T17)은 이미 v3로 마이그레이션 완료된 상태. 그 시점의 `kuji_unopened_tickets` 항목은 lockedResult 필드 부재.
- B-α 재정정 후 코드 실행 시 기존 v3 사용자의 unopenedTickets[i].lockedResult === undefined 상태 → 4장 6.b1/b2 분기 ("첫 ticket.lockedResult === null") 평가 시 undefined !== null이므로 b1 분기 false → b2 분기 false → 분기 미정 (state 매트릭스 누락 케이스).
- 02_data 4.10 변경이력은 "schemaVersion 그대로 v3" 명시했지만, 기존 v3 사용자의 backfill 흐름 명시 없음.
- **필수 정정**. 02_data 3.2.3 마이그레이션에 "기존 v3 사용자의 unopenedTickets 항목에 lockedResult 필드 부재 시 null로 backfill (loadState 시점 또는 별도 fixUpV3 함수)" 명시 또는 schemaVersion v3 → v3.1 (또는 v4) bump.

## 7.3. 일관성 / 정보성 (게이트 미반영)

7.3.1. **I-R4-1 (정보성)**. 시드 변경 시 인벤토리 / lockedResult 폐기 정책 명시 없음. 5.7.4는 "박스 진행 중이면 확인 모달" + "box_round 리셋"만 명시. 박스가 새로 셔플되므로 lockedResult가 무효화되지만 본문 미명시. 6.9 박스 리셋만 폐기 명시. 단계 4 impl_plan 또는 spec 5.7 보강 권고.

7.3.2. **I-R4-2 (정보성)**. 혼재 케이스 (lockedResult 보유 ticket + raw ticket) 흐름 명시 없음. 5.14.5.x 본문이 "혼재 상태에서 b2 진행 → 모든 lockedResult 소비 후 b1 격자 진입" 흐름을 명시하지 않음. 5.9.3 invariant는 추가 구매 허용하므로 발생 가능. 분기 자체는 4장 6.b1/b2 정의되므로 동작 OK. spec 5.14.5.5 (또는 5.14.5.0 보강) 권고.

7.3.3. **I-R4-3 (정보성)**. 5.14.4.4 격자→deck 인덱스 변환 알고리즘이 N개 동시 변환 시 두 가지 해석 가능 (해석 A: 사용자 의도 보존 + 누적 splice 보정, 해석 B: 각 호출 독립 재계산). 단계 4 impl_plan에서 명시 결정 권고.

7.3.4. **I-R4-4 (정보성)**. 5.14.6.5 OFF→ON 전환 시 사용자 선택 폐기 정책의 채택 사유 명시 없음. 단계 4 impl_plan에 사유 메모 권장.

7.3.5. **I-R4-5 (정보성)**. drawRng lifecycle (박스 초기화 시 1회 createRng + 누적 vs 매회 createRng) 명시 없음. M2 시점부터 동일 미명시 (본 사이클 신규 결함 아님). 6.6.b 결정론 평가 정확화를 위해 03_architecture 3.4 또는 spec 5.3 보강 권고.

7.3.6. **I-R4-6 (정보성)**. 03_architecture 3.11 state 객체에 `pendingPickResult` 필드 잔존 (검증 대상이 spec + data만이므로 게이트 영향 없음). spec 5.14.0.5는 "state 객체에서도 제거" 명시 → 단계 4 impl_plan 영역에서 03_architecture 3.11 / 4.6 / 4.7 / 5.7 / 5.8 / 6.3 동기 정정 필요. 단계 4 진입 시 1차 처리 항목.

7.3.7. **I-R4-7 (정보성)**. round3 잔존 정보성 4건 (I-N1 ~ I-N4) 중 I-N3 / I-N4는 5.14.5.0 본문이 round4에서 재기술되어 자연 해소. I-N1 (M3 비균등 격자) / I-N2 (kuji_history pickIndex nullable 표기)는 round4에도 유효. 단계 4 또는 단계 6에서 회수.

# 8. 종합

8.1. 모순 2건 (C-R4-1 / C-R4-2) / 누락 1건 (M-R4-1) / 일관성 0건 / 정보성 7건 (I-R4-1 ~ I-R4-7).

8.2. **게이트: 실패** (모순 ≥ 1 또는 누락 ≥ 1).

8.3. 권고:

8.3.1. **사용자 핸드오프 필요**. 자동 재시도 1회 한도는 round 2 → round 3 시점에 이미 소진됨. round 4는 사용자 한도 초과 명시 승인 하 진행된 본 라운드. 추가 정정 진행 여부는 사용자 결정.

8.3.2. **필수 정정 항목 (사용자 승인 시)**:
- C-R4-1: 02_data 1.12 PICK_FIRST_HINT_TEXT_KO 값을 spec 5.14.7.2 본문 ("N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다.") 으로 갱신.
- C-R4-2: spec 5.14.4.5 / 6.5 본문에서 "Last One 슬롯 회색화" 시점 표현을 (a) "다음 격자 재진입 시 회색화 상태 표시 (history isLastOne 플래그 set 후 도출)" 또는 (b) "격자 패널 닫힘 트랜지션 도중 페이드 (PICK_SLOT_EMPTY_FADE_MS)" 중 하나로 명확화.
- M-R4-1: 02_data 3.2.3에 "기존 v3 사용자 unopenedTickets 항목 lockedResult 필드 부재 시 null backfill" 정책 추가 (또는 schemaVersion bump).

8.3.3. **선택 권고 (정보성)**:
- I-R4-1: spec 5.7 시드 변경 시 인벤토리 / lockedResult 폐기 정책 명시.
- I-R4-2: spec 5.14.5에 혼재 케이스 흐름 보강.
- I-R4-3 / I-R4-4: 단계 4 impl_plan에서 명시 결정.
- I-R4-5: 03_architecture 3.4 또는 spec 5.3에 drawRng lifecycle 명시.
- I-R4-6: 단계 4 impl_plan 갱신 시 03_architecture 3.11 동기 정정 (pendingPickResult 제거).
- I-R4-7: round3 잔존 정보성 회수.

8.3.4. round 4는 사용자 한도 초과 명시 승인 하 진행된 본 라운드. 게이트 실패로 단계 4 진입 불가. 사용자 핸드오프.
