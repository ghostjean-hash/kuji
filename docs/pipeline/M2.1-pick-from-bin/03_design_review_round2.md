# M2.1 pick-from-bin - 03 design_review (round 2)

| 항목 | 값 |
|---|---|
| 단계 | 3 design_review (재검증 1회차) |
| 검증자 | subagent (general-purpose, 격리 컨텍스트) |
| 검증일 | 2026-05-03 |
| 검증 대상 | docs/01_spec.md + docs/02_data.md (1차 결함 정정 후) |
| 1차 결함 | 모순 4 / 누락 3 / 일관성 3 / 정보성 6 |
| 결과 | 실패 |

# 1. 1차 결함 정정 결과

## 1.1. C-1. 슬롯 수와 셔플 배열 길이의 인덱스 매핑 모순

해결.

근거:
- 01_spec 5.14.2.1: "드래곤볼 80 = 10×8 (일반 슬롯 79 + Last One 슬롯 1)" 명시.
- 01_spec 5.14.2.2: "슬롯 수 = `BOX_SIZE`. 일반 슬롯 = `BOX_SIZE - 1` 개. 셔플 배열 인덱스 0 ~ `BOX_SIZE - 2` 와 1:1 매핑. Last One 슬롯은 셔플 배열에 포함되지 않음 (5.3.2 / 5.4.4 정합)."
- 5.14.3.4 / 5.14.4.5: Last One 슬롯 비활성 + 마지막 일반 슬롯 클릭 시 자동 지급 흐름 명시.
- 권고 옵션 중 "슬롯 80개 유지 + Last One 별도 표시 / 클릭 불가" 옵션을 채택. 1차 권고와 정합.

## 1.2. C-2. 4장 6.b1 분기 조건과 5.14.1 진입 조건 누락

해결.

근거:
- 01_spec 4장 6번 영역에 b1 / b2 / b3 3분기 명시.
- (b1) "인벤토리 ≥ 1 + skip OFF + pendingPickResult 없음 + **pendingPeelResult 없음** → 통 선택 격자".
- (b2) "인벤토리 ≥ 1 + pendingPeelResult 없음 + (skip ON 또는 pendingPickResult 존재) → 뜯기 카드".
- (b3) "인벤토리 ≥ 1 + pendingPeelResult 존재 → reveal 진행 중" 신설.
- state 매트릭스 누락 분기 (1차 5.5.1) 모두 커버.

## 1.3. C-3. `BUY_QUICK_OPTIONS` 값 불일치

해결.

근거: 01_spec 5.9.2 "Quick 버튼: 02_data 1.6 `BUY_QUICK_OPTIONS` (= [1, 3, 5, 10])" 정정. 02_data 1.6과 일치.

## 1.4. C-4. `kuji_meta.schemaVersion` vs `schema_version` 표기 불일치

해결.

근거: 02_data 3.2.1 "`kuji_meta.schemaVersion` 사용 (camelCase, 04_conventions 1.2 정합)" 정정. 3.2.2 / 3.2.3 / 3.1과 일치.

## 1.5. O-1. `pendingPickResult` / `pendingPeelResult` 영속 정책의 데이터 SSOT 누락

해결 (옵션 A 즉시 커밋 정책 채택).

근거:
- 01_spec 5.14.4.2: "동시에 추첨 이력에 즉시 커밋 (영속 정책, 5.14.4.6 + 02_data 3.1 `kuji_history` 항목 `revealed: false` 로 추가). 클릭 후 reveal 시작 전까지 취소 불가."
- 01_spec 5.14.4.6: "`pendingPickResult` 는 메모리 전용 (localStorage 미영속). 추첨 결정 시점(5.14.4.2 슬롯 클릭) = 추첨 이력 즉시 커밋. 새로고침 시 history에서 `revealed: false` 항목 검색 → 미reveal 1매 복원".
- 01_spec 7.11: 새로고침 복원 흐름 갱신.
- 02_data 3.1 `kuji_history` 항목 스키마: `pickIndex (M2.1)`, `revealed (M2.1, boolean)` 필드 추가.
- 02_data 3.2.3 마이그레이션: `kuji_history` 기존 항목 backfill `revealed = true`, `pickIndex = null` 명시.
- 데이터 SSOT 차원에서 메커닉 결정 완료. UI 표시 방식 1단계 (페이지플립 카드 직접 vs 통 선택 격자 + 복원) 만 단계 4로 미룸. 양쪽 옵션 모두 "미reveal 1매 history → 사용자 reveal" 으로 수렴. 단계 2 design 게이트 ("메커닉 빈 항목 0개") 위반 아님 (UI 세부 결정은 단계 4 영역).

## 1.6. O-2. 5.14.6.5 OFF→ON 전환 시 자동 drawOne 호출 흐름 누락

해결.

근거:
- 01_spec 5.14.6.5: "drawOne 호출은 사용자가 뜯기 액션(5.10.2 좌측 드래그 / 클릭)을 시작하는 시점 = 5.3.7 skip ON 분기 그대로 (`splice(0)`). 카드 표시 시점에는 호출되지 않음."
- "단, OFF 상태에서 이미 `pendingPickResult` 가 존재하는 도중에 ON 전환 시 = 결과는 이미 결정됨, 페이지플립 카드는 해당 결과 표시 (재호출 없음)" 보강 명시.
- 1차 권고 두 옵션 중 "사용자 뜯기 액션 대기" 옵션 채택. 합리적.

## 1.7. O-3. "통 선택 완료" 정의 누락

부분 해결 (정의 추가됨, 그러나 신규 일관성 결함 도입).

근거:
- 01_spec 5.14.5.0 신설: "`pendingPickResult` 가 존재하는 상태 = '통 선택 1매 진행 중' (= 통 선택 미완료). reveal 확인 후 `pendingPickResult` 초기화 + history `revealed: true` 갱신 = '통 선택 완료' 상태."
- 정의는 명시되었으나, 본 정의가 5.10.1의 "통 선택 완료" 사용 의미와 충돌함 (신규 결함 K-N1, 2.3 참조).

## 1.8. K-1 / K-2 / I-1 / I-2 (선택 항목)

| ID | 정정 결과 | 근거 |
|---|---|---|
| K-1 | 해결 | 01_spec 5.10.9 "결과 reveal 시점에" 로 정정. M2 모달 폐기 정합. |
| K-2 | 해결 | 02_data 1.9 `PEEL_REVEAL_TO_MODAL_MS` "**DEPRECATED**. 코드 import 금지. M3 사이클에서 키 자체 제거 검토" 강화. |
| I-1 | 해결 | 01_spec 5.9.3 "(누적 인벤토리 + 신규 구매 매수) ≤ 박스 deck 잔여" 명확화. |
| I-2 | 해결 | 02_data 3.2.3 "`kuji_meta.pickHintSeen = false` 초기화" 추가. |

# 2. 신규 결함 (정정 과정에서 도입)

## 2.1. 모순

### 2.1.1. C-N1. "통 선택 완료" 용어의 두 의미 충돌

| 항목 | 값 |
|---|---|
| ID | C-N1 |
| 위치 | 01_spec 5.10.1 vs 5.14.5.0 |
| 등급 | 모순 (높음, O-3 정정의 부작용) |

설명:
- 01_spec 5.10.1: "인벤토리에 미개봉 복권 1매 이상 + (skip ON 또는 통 선택(5.14) **완료**) 시 뜯기 가능. skip OFF 시 통 선택 **미완료** 상태에서는 뜯기 패널 미표시."
  → 여기서 "통 선택 완료" = 슬롯 클릭 완료 = `pendingPickResult` **존재** 상태 의미. 통 선택 미완료 = 슬롯 미클릭 = `pendingPickResult` 부재 = 격자 표시 단계.
- 01_spec 5.14.5.0: "`pendingPickResult` 가 **존재하는 상태** = '통 선택 1매 진행 중' (= 통 선택 **미완료**). reveal 확인 후 `pendingPickResult` 초기화 + history `revealed: true` 갱신 = '통 선택 **완료**' 상태."
  → 여기서 "통 선택 완료" = `pendingPickResult` **부재** + reveal 확인 후 상태.

결과: 동일 용어 "통 선택 완료" / "통 선택 미완료" 가 정반대 의미로 사용. 5.10.1은 슬롯 클릭 시점 기준 (= pendingPickResult 존재 = 5.14.5.0 정의의 미완료), 5.14.5.0은 reveal 확인 시점 기준 (= pendingPickResult 부재 = 5.10.1 정의의 미완료).

영향:
- 4장 6.b2 진입 조건 "(skip ON 또는 pendingPickResult 존재) + pendingPeelResult 없음 → 뜯기 카드" → 본 분기는 5.10.1 의미와 정합 (pendingPickResult 존재 = "통 선택 완료" = 뜯기 가능).
- 5.14.5.0 마지막 줄 "5.10.1 / 4장 6.b2 분기 진입 조건 = 'skip ON 또는 (pendingPickResult 존재 + **reveal 진행 중**)'" → 4장 6.b2 본문 "pendingPeelResult **없음**" 과 충돌. "reveal 진행 중" = pendingPeelResult 존재인데, b2는 pendingPeelResult 없음이 조건. b3 (reveal 진행 중)와 혼동된 표현.

권고:
- 옵션 A: "통 선택 완료" 용어를 슬롯 클릭 완료 (= `pendingPickResult` 존재) 의미로 통일. 5.14.5.0 재정의: "통 선택 완료 = `pendingPickResult` 존재 = 슬롯 클릭 ~ reveal 직전 사이의 1매 단위 상태". 5.14.5.0 마지막 줄 재기술: "5.10.1 / 4장 6.b2 진입 조건 = 'skip ON 또는 pendingPickResult 존재' (양쪽 모두 pendingPeelResult 부재 전제)". 1차 보고서 O-3 권고문 ("`pendingPickResult` 존재 상태. 슬롯 클릭 ~ reveal 확인 사이의 1매 단위 상태") 과 정합.
- 옵션 B: "통 선택 완료" 용어를 reveal 확인 후 의미로 유지. 5.10.1 본문을 "skip ON 또는 통 선택 슬롯 클릭 후 (pendingPickResult 존재) 시 뜯기 가능" 으로 정정. 5.14.5.0 마지막 줄도 b2 / b3 분기 매핑 재정리.

옵션 A가 1차 권고와 정합도가 높고 4장 6.b2 본문과도 일치. 사용자 선호 확인 후 정정 권장.

### 2.1.2. C-N2. 5.14.5.0 진입 조건 표현 vs 4장 6.b2 / b3 본문 불일치

| 항목 | 값 |
|---|---|
| ID | C-N2 |
| 위치 | 01_spec 5.14.5.0 마지막 줄 vs 4장 6.b2 / 6.b3 |
| 등급 | 모순 (중간, C-N1 와 동일 뿌리) |

설명:
- 5.14.5.0: "5.10.1 / 4장 6.b2 분기 진입 조건 = 'skip ON 또는 (pendingPickResult 존재 + reveal 진행 중)'".
- 4장 6.b2: "pendingPeelResult 없음 + (skip ON 또는 pendingPickResult 존재)". → "reveal 진행 중" = pendingPeelResult 존재이므로 5.14.5.0 표현은 b3 (pendingPeelResult 존재) 분기에 가까움.
- 4장 6.b3: "pendingPeelResult 존재 → reveal 진행 중". → "pendingPickResult 존재 + reveal 진행 중" 은 b3 의 일부 케이스.

결과: 5.14.5.0이 b2 진입 조건을 잘못 매핑. b2 ↔ b3 혼동.

권고: 5.14.5.0 마지막 줄을 "5.10.1 / 4장 6.b2 진입 조건 = 'skip ON 또는 pendingPickResult 존재' + 'pendingPeelResult 부재 전제'. reveal 진행 중 (pendingPeelResult 존재) = 4장 6.b3 분기" 로 명확화. C-N1 옵션 A 채택 시 본 항목도 함께 해소.

## 2.2. 누락

### 2.2.1. O-N1. 5.14.2.5 Last One 슬롯 위치 - 비균등 격자 미정의

| 항목 | 값 |
|---|---|
| ID | O-N1 |
| 위치 | 01_spec 5.14.2.5 |
| 등급 | 누락 (낮음~중간, M3 라인업 진입 시 결정 필요) |

설명:
- 5.14.2.5: "Last One 슬롯 위치: 격자 마지막 셀 (`rows - 1` 행 / `cols - 1` 열, 또는 마지막 row의 마지막 슬롯). 일반 슬롯 79개를 인덱스 순으로 배치 후 Last One 슬롯이 마지막 위치."
- 드래곤볼 (BOX_SIZE 80, cols 10): 80 = 10 × 8 균등. `(rows-1, cols-1) = (7, 9)` 와 "마지막 row의 마지막 슬롯" 동일 위치. 두 표현 동치. OK.
- 02_data 1.12 후단: "`BOX_SIZE` 가 `PICK_GRID_COLS_DEFAULT` 로 나누어떨어지지 않는 라인업은 마지막 행 부분 채움 (M3 ワンピース 라인업 도입 시 검증)" → M3 시점 비균등 격자 발생 가능.
- 비균등 격자 (예: BOX_SIZE 75, cols 10 → rows 8, 마지막 row 5칸): `(rows-1, cols-1) = (7, 9)` 위치는 빈 셀. "마지막 row의 마지막 슬롯" = `(7, 4)` 위치. 두 표현이 다른 위치 가리킴.

결과: M2.1 본 사이클 (드래곤볼 80) 에서는 동치라 영향 없음. 그러나 5.14.2.5 표현이 "또는" 으로 두 옵션처럼 읽히고, M3 비균등 격자 시 어느 위치인지 미정의.

영향: M2.1 본 사이클은 OK. M3 시점 결정 필요. 단계 2 design 게이트 차원에서 본 사이클 메커닉 빈 항목 아님.

권고:
- 옵션 A: 5.14.2.5를 "Last One 슬롯 위치: 일반 슬롯 79개 배치 후 다음 빈 셀 (인덱스 = `BOX_SIZE - 1` 위치). 비균등 격자 시 마지막 일반 슬롯 직후 셀 (=부분 채움 행의 다음 칸 또는 새 행 첫 칸)" 으로 명확화.
- 옵션 B: M3 ワンピース 도입 시점에 결정 (현재는 정보성으로 분류, 본 사이클 통과 가능).

본 누락은 M2.1 사이클 통과 게이트 위반은 아님 (드래곤볼 80 균등 격자에서 동치). 게이트 미반영, 정보성으로 분류 (3.1 I-N1).

## 2.3. 일관성

### 2.3.1. K-N1. C-N1과 동일 뿌리, 하위 표현 산재

| 항목 | 값 |
|---|---|
| ID | K-N1 |
| 위치 | 01_spec 5.10.1 / 5.14.5.0 / 4장 6 영역 b1 b2 b3 |
| 등급 | 일관성 (높음, C-N1으로 격상) |

설명: C-N1 / C-N2 와 동일 뿌리. "통 선택 완료" 용어 정의 충돌이 4장 분기 매핑 / 5.10.1 / 5.14.5.0 전반에 영향. C-N1 정정 시 본 항목도 함께 해소.

# 3. 정보성 (게이트 미반영)

3.1. **I-N1**. 5.14.2.5 비균등 격자 시 Last One 슬롯 위치 (O-N1 격하). 본 사이클 (BOX_SIZE 80 = 10×8) 에서는 동치라 영향 없음. M3 ワンピース 도입 시 결정.

3.2. **I-N2**. 02_data 3.2.3 `kuji_history` backfill `pickIndex: null`. 단계 2 design 차원에서 nullable 명시 OK. 단, history 항목 스키마 (3.1 표) 의 `pickIndex (M2.1)` 표기에 nullable 명시 누락. "pickIndex (M2.1, nullable, M2 이전 backfill 항목은 null)" 정도 보강 권장. 누락은 아님.

3.3. **I-3 잔존**. 02_data 1.9 `PEEL_REVEAL_TO_MODAL_MS` deprecated 키. 1차 K-2 정정으로 표기 강화됨 (해결).

3.4. **I-4 잔존**. 5.14.7.2 한국어 문구 SSOT 단일 언어 정책. 본 사이클 범위 외.

3.5. **I-5 잔존**. 시나리오 6.7 "5매" 임의값. SSOT 키화 불필요.

3.6. **I-6 잔존**. 5.14.5에 5.14.5.0 신설 (통 선택 완료 정의 + reveal 흐름). 1차 정보성 항목 일부 해소.

# 4. 종합

4.1. 1차 결함 해결 6 / 7 (C-1 / C-2 / C-3 / C-4 / O-1 / O-2 = 해결, O-3 = 부분 해결 - 정의 추가됐으나 5.10.1과 용어 충돌). K/I 4건 (K-1 / K-2 / I-1 / I-2) 모두 해결.

4.2. 신규 모순 2개 (C-N1 / C-N2) / 신규 누락 0개 (O-N1은 본 사이클 영향 없어 정보성 I-N1로 격하) / 신규 일관성 1개 (K-N1, C-N1과 동일 뿌리).

4.3. 게이트: **실패**.
- 통과 기준 6.1 "1차 모순 + 누락 7건 모두 해결 + 신규 모순 0 + 신규 누락 0" 에서 1차 결함 1건 부분 해결 (O-3 - 정의는 추가되었으나 5.10.1과 용어 의미 충돌) + 신규 모순 2건 발생.

4.4. 권고 (실패 시):

4.4.1. **최우선 (높음)**:
- C-N1 "통 선택 완료" 용어 의미 통일. 옵션 A (`pendingPickResult` 존재 상태 = 통 선택 완료) 채택 권장. 5.14.5.0 재기술 + 5.10.1 / 5.14.5.0 마지막 줄 / 4장 분기 매핑 재정합.
- C-N2 5.14.5.0 마지막 줄을 4장 6.b2 / 6.b3 본문과 일치하도록 정정. C-N1 옵션 A 채택 시 본 항목도 함께 해소.

4.4.2. **권고 (낮음, 본 사이클 게이트 미반영)**:
- I-N1 (구 O-N1) 5.14.2.5 비균등 격자 시 Last One 슬롯 위치 명확화. M3 ワンピース 도입 시점 결정.
- I-N2 02_data 3.1 history 항목 `pickIndex` nullable 명시 보강.

4.4.3. C-N1 / C-N2 처리 후 재검증 (사용자 핸드오프 검토 - 재시도 1회 한도 소진 후 추가 결함 발생).
