# M5 ceiling-rule - 03 design_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M5-ceiling-rule |
| 단계 | 3 design_review |
| 검증자 | 격리 subagent |
| round | 1 |
| 검토 일자 | 2026-05-10 |

# 1. 결과 요약 (P0/P1/P2 건수)

| 우선도 | 건수 |
|---|---|
| P0 (단계 4 진입 차단) | 4 |
| P1 (단계 4 진입 전 정정 의무) | 3 |
| P2 (단계 4 흡수 가능 / 백로그) | 3 |

**단계 4 진입 = 불가**. P0 4건 정정 의무. round 2 진입 권장.

본 사이클은 메이저 = "첫 메커닉 분기 + 라인업 추가" 양면 부피로 round 폭증 위험 명시(plan 8). 단계 2 design 산출물의 SSOT 이중화 + 미결정 박제 + 호출 흐름 stale + 시그니처 불일치 = 메이저 부피 정합 미수렴 결함이 누적됨.

# 2. P0 결함

## 2.1. P0-1. spec 5.13.G.3 의사코드의 `drawNormal` 함수 미정의 - 시그니처 불일치 (검토 항목 2.1)

**위치**:
- `/Users/ghostjin/kuji/docs/01_spec.md` line 588~611 (5.13.G.3 알고리즘 의사코드).
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 196~214 (3.6.M5 core/ceiling.js drawWithCeiling 시그니처).

**증거 인용 1 (spec 5.13.G.3)**:
```
function drawWithCeiling(boxState, drawRng, lineup, count) {
  if (!lineup.ceilingEnabled) return drawNormal(boxState, drawRng, lineup, count);
  if (count !== lineup.ceilingPurchaseSize) return drawNormal(boxState, drawRng, lineup, count);
  ...
  if (sIndex < 0) {
    return drawNormal(boxState, drawRng, lineup, count);
  }
  ...
}
```

**증거 인용 2 (arch 3.6.M5)**:
```
//   lineup.ceilingEnabled === false → 일반 drawOne x count fallback.
//   count !== ceilingPurchaseSize → 일반 fallback.
//   boxState.deck.findIndex(t => t === ceilingTier) < 0 → S 부재 fallback (deck 잔여 모두 비-ceiling).
//   else: drawOne(boxState, drawRng, lineup, sIndex) + drawOne x (count-1).
```

**결함 본질**:
- spec 5.13.G.3은 `drawNormal(boxState, drawRng, lineup, count)`을 fallback 함수로 박제.
- arch 3.6.M5는 `drawOne` 반복 호출 방식 박제. `drawNormal` 미언급.
- arch 3.4 core/draw.js는 `drawOne` 단수 호출만 정의. `drawNormal`이라는 다수 호출 함수는 코드/docs/grep 어디에도 없음 (`grep "drawNormal" src/` = 0건, `grep "drawNormal" arch` = 0건).
- 즉 spec의 의사코드는 미정의 함수 호출. 단계 4 impl_plan 진입 시 "drawNormal 신설 vs drawOne 반복으로 통일" 결정 필요 = SSOT 모순.

**영향**: spec과 arch 의사코드가 서로 다른 fallback 모델을 박제 → 단계 5 implement 시 코드 작성자가 어느 쪽을 따를지 모호. CLAUDE.md 4.5 (docs와 코드 충돌 시 docs 진실) 정합 위반 잠재.

**정정 권고**:
- spec 5.13.G.3 의사코드의 `drawNormal(boxState, drawRng, lineup, count)` → `[for i in 0..count: drawOne(boxState, drawRng, lineup)]` 풀어쓰기로 통일 (arch 3.6.M5 정합).
- 또는 arch 3.6.M5에 "drawNormal = drawOne 반복 헬퍼 (별도 export 0)" 명시 + spec 5.13.G.3 의사코드 보존.
- 단계 2 design 결정 영역이므로 본 사이클에서 정정.

## 2.2. P0-2. spec 5.9.2 본문 BUY_QUICK_OPTIONS = [1,3,5,10] stale (검토 항목 5.1)

**위치**:
- `/Users/ghostjin/kuji/docs/01_spec.md` line 175.

**증거 인용**:
```
- Quick 버튼: 02_data 1.6 `BUY_QUICK_OPTIONS` (= [1, 3, 5, 10]).
```

**결함 본질**:
- 02_data 1.6 (line 590)은 갱신됨: `BUY_QUICK_OPTIONS = [1, 3, 5, 10, 30]`.
- spec 5.9.2 본문은 갱신되지 않음. 02_data와 spec의 SSOT 1:1 정합 미성립.
- plan 7.1 영향 매트릭스에 "spec 5.9 (구매 30 옵션)" 명시되었으나 실 적용 0.

**영향**: CLAUDE.md 4.5 (docs 충돌 시 docs가 진실) 위반. 단계 6 게이트 5.21 grep에서 `BUY_QUICK_OPTIONS [1,3,5,10,30]` 정합 위반 검출 가능. 5.21 게이트는 numbers.js만 검사하나 spec 본문 stale은 단계 7 QA 정합 미달.

**정정 권고**:
- spec 5.9.2 line 175 본문을 `(= [1, 3, 5, 10, 30])` + "박스 매수 ≥ 30 시 30 옵션 활성. 천장 활성 라인업(`lineup.ceilingEnabled === true`) + 30매 동시 구매 시 5.13.G 천장 룰 자동 적용" cross-link 추가.
- 또는 spec 5.13.G.2.2 / G.5.1과의 산술 정합 박제.

## 2.3. P0-3. 02_data 1.4.LINEUPS 절 본문 표 stale - LINEUPS 배열 SSOT 이중화 (검토 항목 1.1 / 1.4)

**위치**:
- `/Users/ghostjin/kuji/docs/02_data.md` line 385~391 (1.4.LINEUPS 절).
- `/Users/ghostjin/kuji/docs/02_data.md` line 523~526 (1.4-XG.6 LINEUPS 박제).

**증거 인용 1 (1.4.LINEUPS 절)**:
```
| `LINEUPS` | `[LINEUP_DRAGONBALL, LINEUP_ONEPIECE]` | 활성 라인업 N개 (M3 = 2) |
```

**증거 인용 2 (1.4-XG.6)**:
```
LINEUPS 배열에 추가:
export const LINEUPS = [LINEUP_DRAGONBALL, LINEUP_ONEPIECE, LINEUP_XENOGLOSSIA];
```

**결함 본질**:
- 두 절이 동일 SSOT(`LINEUPS`)를 다른 값으로 박제. 1.4.LINEUPS는 2건, 1.4-XG.6은 3건.
- arch 5.21 게이트 line 893도 "LINEUPS 배열 = [DRAGONBALL, ONEPIECE, XENOGLOSSIA] 3건"으로 박제 → 1.4-XG.6 정합 / 1.4.LINEUPS 모순.
- M3 시점 1.4.LINEUPS 표를 답습한 stale 절 (M4.1 학습 답습 = M4.1 시점 stale 절 패턴, plan 7.1 / 검토 항목 7.1과 동일 패턴).

**영향**: CLAUDE.md 4.2 (매직 넘버 0 = SSOT 단일화 정합) 위반. 단계 4 impl_plan에서 "본 사이클 LINEUPS 배열 갱신"을 누가 어디서 명령하는지 모호. 단계 6 게이트 5.21 grep은 numbers.js만 검사하므로 docs 이중 SSOT는 자동 검출 안됨 = round 폭증 위험.

**정정 권고**:
- 02_data 1.4.LINEUPS line 389를 `[LINEUP_DRAGONBALL, LINEUP_ONEPIECE, LINEUP_XENOGLOSSIA]` + "활성 라인업 N개 (M5 = 3)" 갱신.
- 또는 1.4-XG.6의 LINEUPS 박제를 1.4.LINEUPS로 cross-link (절 단일화).

## 2.4. P0-4. spec 5.13.G 미결정 사항 본문 박제 - 본 사이클이 단계 2임에도 결정 미수렴 (검토 항목 2.2 / 5.3 / 6.1)

**위치**:
- `/Users/ghostjin/kuji/docs/01_spec.md` line 618 (5.13.G.4.3).
- `/Users/ghostjin/kuji/docs/01_spec.md` line 620 (5.13.G.5 절 헤더).
- `/Users/ghostjin/kuji/docs/01_spec.md` line 622 (5.13.G.5.1).
- `/Users/ghostjin/kuji/docs/01_spec.md` line 631 (5.13.G.6.4).

**증거 인용 1 (5.13.G.4.3)**:
```
5.13.G.4.3. UI 표시 = 구매 패널에서 "S 잔여 0이면 천장 미적용 안내" (단계 2 design 결정).
```

**증거 인용 2 (5.13.G.5 절 헤더)**:
```
### 5.13.G.5. 시각 표현 (단계 2 결정)
```

**증거 인용 3 (5.13.G.5.1)**:
```
5.13.G.5.1. **구매 패널 30 옵션 시각 강조**: ... 단계 4 / 5 결정.
```

**증거 인용 4 (5.13.G.6.4)**:
```
5.13.G.6.4. M2.1 통 선택 (Pick from Bin)과 30연 천장 룰의 인터랙션 = 단계 2 design 결정 (자비스 추천 = 30연 구매 시 통 선택 skip = 천장 룰 즉시 적용).
```

**결함 본질**:
- "단계 2 design 결정" 표현 = 본 사이클이 단계 2임에도 결정이 박제되지 않은 상태. 단계 3 design_review가 "단계 2 결정 미수렴 박제"를 검증해야 하나 결정 자체가 안됨.
- 자비스 추천만 박제 + 사용자 결정 미수렴 = plan 4.4 자비스 추천 채택 게이트(plan 본문 박제 + 단계 1 승인 게이트) 정합 위반. plan 4.x는 4.1~4.5만 다루고 5.13.G.4.3 / G.5 / G.6.4는 plan 미언급.
- 특히 G.6.4는 plan 11.2에 "단계 2 design 결정 영역" 명시되지 않음. plan 11.2.1~11.2.3은 (i) 천장 알고리즘 위치 / (ii) tier_class 분류 / (iii) SCHEMA_VERSION만 다룸.
- M2.1 통 선택(skip OFF, b1 분기 = pick-grid 격자)과 30연 천장 룰의 인터랙션은 사용자 핵심 도메인 결정 영역(plan 7.1 spec 영향). 자비스 추천만 박제하고 사용자 승인 부재 = 사용자 결정 영역 침해 (CLAUDE.md 2.5 "자비스는 제안하되 결정하지 않는다. 결정 권한은 사용자" 위반).

**영향**: 단계 4 impl_plan 진입 시 "안내 문구를 박을 것인가" / "통 선택 skip 정책을 어떻게 처리할 것인가" / "30 옵션 라벨 강조 형식" = 모두 사용자 결정 영역. 결정 미수렴 상태로 단계 4 진입 = 단계 5 구현 후 사용자 도메인 인식과 충돌 발생 시 round 회귀 위험. 메모리 룰 `feedback_lottery_red_text`("복권 영역 안내·힌트·경고 문구 금지") 위반 잠재 (5.13.G.4.3 "안내 문구").

**정정 권고**:
- 본 사이클 단계 3 round 1 통과 전 사용자 결정 게이트 추가:
  1. G.4.3 안내 박제 vs 비박제 (메모리 룰 `feedback_lottery_red_text` 적용 검토 = 비박제 권고).
  2. G.5.1 30 옵션 라벨 강조 = 본 사이클 vs 별도 사이클(M5.1) 결정.
  3. G.6.4 통 선택 + 30연 인터랙션 = 자비스 추천(통 선택 skip 강제) vs 격자 진입 후 N매 강제 선택 vs M5.1 별도 결정.
- 사용자 결정 후 본문에서 "단계 2 design 결정" 표현 제거 + 결정 박제로 교체.
- 또는 본 사이클 비목표 박제 + 별도 사이클 백로그 등재.

# 3. P1 결함

## 3.1. P1-1. arch 4.2 추첨 1회 흐름 + 4.5 DC 추첨 흐름 stale - lastOneEnabled / dcEnabled 분기 미박제 (검토 항목 1.2 / 4.4 / 7.1)

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 602~610 (4.2 추첨 1회).
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 624~627 (4.5 DC 추첨).

**증거 인용 (4.2)**:
```
4.2. **추첨 1회**:
- 사용자 추첨 버튼 → `dispatch({type: 'draw'})`.
- main.js: `core/draw.drawOne(state.boxState, rng, lineup)` → DrawResult.
- main.js: `core/double_chance.addTicket(state.dcTickets, ticket)`.
- main.js: `core/history.appendHistory(state.history, entry)`.
- DrawResult.isLastOne === true → `core/last_one.lastOnePrize(lineup)` 합산.
```

**결함 본질**:
- arch 3.5 / 3.6 모듈 시그니처는 갱신됨 (lastOneEnabled / dcEnabled 분기 박제 = "main.js dispatch 분기에서 호출 방어").
- 그러나 main.js의 실제 호출 흐름 SSOT인 arch 4.2 / 4.5는 갱신되지 않음 = 모듈 시그니처와 흐름 SSOT 불일치.
- spec 5.4.6 / 5.5.7은 신설됨 (라인업별 미적용 박제). arch 4.2 / 4.5는 spec 5.4.6 / 5.5.7 정합 미수렴.
- 단계 4 impl_plan에서 "main.js dispatch.draw에 enabled 분기를 어디에 넣을지" 명령 부재.

**영향**: 검토 항목 7.1 "M3.1 시점 stale 절(M4.1 학습 답습)" 정합 = 메이저 부피 round 폭증 위험. 단계 5 구현 시 enabled 분기 위치를 implement가 추정해야 함.

**정정 권고**:
- arch 4.2 본문에 다음 추가:
  ```
  - lineup.lastOneEnabled === false 시 lastOnePrize 호출 스킵 (5.4.6 정합).
  - lineup.dcEnabled === false 시 addTicket 호출 스킵 (5.5.7 정합).
  ```
- arch 4.5 본문에 다음 추가:
  ```
  - lineup.dcEnabled === false 시 dispatch.draw_dc 자체 비활성 + drawDc 호출 스킵.
  ```

## 3.2. P1-2. arch에 dispatch.buy 천장 분기 흐름 절 부재 - 5.21 게이트만 박제 (검토 항목 1.3 / 5.2)

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` 4장 전체 (4.1~4.9 + 4.M3.1~4.M3.5).
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 898 (5.21 게이트의 dispatch.buy 분기 박제).

**증거 인용 (5.21 게이트)**:
```
- render/main.js dispatch.buy: count === ceilingPurchaseSize && lineup.ceilingEnabled 시 drawWithCeiling 호출 분기.
```

**결함 본질**:
- arch 4장 흐름 SSOT 어디에도 dispatch.buy 천장 분기 흐름 절 부재. 4.1~4.9 / 4.M3.1~4.M3.5 모두 천장 룰 무관.
- 5.21 게이트는 검증식이므로 흐름 박제는 4장이 책임. 그러나 4장에 박제 없음 = 게이트와 흐름 SSOT 불일치.
- spec 5.13.G.3 의사코드 + arch 3.6.M5 모듈 시그니처는 정의됨. 그러나 main.js dispatch.buy 위치에서의 호출 흐름은 미박제.
- M5는 "추첨 1회"가 아닌 "30매 동시 추첨 + S 보장"이라는 새 메커닉 = 새 흐름 절(예: 4.M5)이 메이저 부피 정합 의무.

**영향**: 단계 4 impl_plan에서 dispatch.buy의 호출 순서(예: drawWithCeiling 호출 → unopenedTickets에 lockedResult 30매 부여 → state 영속) 추정 필요. P1-1과 같은 흐름 SSOT 결손 패턴.

**정정 권고**:
- arch 4장에 4.M5 절 신설:
  ```
  ### 4.M5. 천장 룰 30연 흐름 (M5 신설, ceilingEnabled=true 라인업)
  - 사용자 buy 30매 → dispatch({type:'buy', count:30}).
  - main.js dispatch.buy:
    - count === lineup.ceilingPurchaseSize && lineup.ceilingEnabled → drawWithCeiling(boxState, drawRng, lineup, count) 호출.
    - 결과 30매를 unopenedTickets에 lockedResult로 부여 (skip OFF/ON 분기 정합 결정 필요 - P0-4와 연동).
    - 영속 + rerender.
  - else → 기존 흐름 (5.14 통 선택 + skip 정책 답습).
  ```
- 또는 4.6 "M2.1 B-α 통 선택 → 뜯기 흐름"에 천장 분기 sub-section 추가.

## 3.3. P1-3. spec 5.13.A.6 라인업 추가 절차에 enabled 5종 정의 의무 미명시 (검토 항목 1.4)

**위치**:
- `/Users/ghostjin/kuji/docs/01_spec.md` line 288~294 (5.13.A.6 절).
- `/Users/ghostjin/kuji/docs/02_data.md` line 395~408 (1.4.LINEUPS 라인업 추가 절차).

**증거 인용 (spec 5.13.A.6)**:
```
5.13.A.6.1. 02_data 1.4-XX 절 신설 (메타 + 등급 + DC + 출처 + LINEUP 객체 + 검증식).
5.13.A.6.2. `LINEUPS` 배열 추가 + 02_data 1.7.1-XX 자산 매핑 추가.
5.13.A.6.3. 단계 6 게이트 검증 (라인업 격리 + 등급 수 가변성 + box.id 충돌 0).
5.13.A.6.4. **M3.1 추가**: 등급별 `tierClass` 부여 ...
5.13.A.6.5. **M4 추가**: 홈 카드 메타 풍부도 정합 ...
```

**결함 본질**:
- 02_data line 402~407에는 "M5 신설: 메커닉 활성 플래그 정의 (lastOneEnabled / dcEnabled / ceilingEnabled / ceilingPurchaseSize / ceilingTier 의무)" 박제됨.
- 그러나 spec 5.13.A.6의 평행 절(라인업 추가 절차의 사용자 시각 SSOT)에는 "M5 추가" 박제 부재. M3.1 / M4까지만 답습 박제.
- plan 7.1 spec 영향 매트릭스 = "5.13.A (다중 라인업 추가 절차)" 명시되었으나 적용 0.
- 02_data 1.4.LINEUPS와 spec 5.13.A.6은 동일 절차 SSOT의 두 시각(데이터 SSOT / 사양 SSOT). 한쪽만 갱신 = 불완전.

**영향**: 다음 라인업(M6 코토부키야 일반 라인업) 추가 사이클 진입 시 spec 5.13.A.6만 본 작업자가 enabled 5종 정의 의무 누락 가능 = M3.1 시점 stale 절 패턴 (검토 항목 7.1).

**정정 권고**:
- spec 5.13.A.6에 5.13.A.6.6 신설:
  ```
  5.13.A.6.6. **M5 추가**: 메커닉 활성 플래그 5종 정의 (`lastOneEnabled` / `dcEnabled` / `ceilingEnabled` / `ceilingPurchaseSize` / `ceilingTier`). ceilingEnabled=true 시 ceilingPurchaseSize / ceilingTier 의무. 1.4.A.3 검증식 5~9 정합. 02_data 1.4.LINEUPS 라인업 추가 절차 7번 항목 정합.
  ```

# 4. P2 결함

## 4.1. P2-1. arch 5.6 시그니처 grep에 drawWithCeiling 호출처 grep 의무 미박제 (검토 항목 7.2)

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 779 (5.6 시그니처 grep).

**증거 인용**:
```
5.6. **시그니처 grep (M2 추가, M1 OP-2 반영)**: `initBox\(`, `drawOne\(`, `lastOnePrize\(` 호출처 모두 `lineup` 인자 정합 여부 grep. **M2.1 추가**: `drawOne\(` 호출처에 `pickIndex` 인자 정합 grep ...
```

**결함 본질**:
- M5에서 신설되는 `drawWithCeiling\(` / `isCeilingApplicable\(` 호출처 grep 의무가 5.6에 미박제.
- arch 5.21 게이트는 신설됐으나 5.6 일반 grep과 별도. 5.6은 모든 사이클 누적 grep SSOT이므로 누적 의무 부재 = 차기 사이클에서 호출처 검증 누락 위험.

**영향**: 단계 6 게이트 grep 시 5.21에서만 검사 = 단계 7 QA 또는 차기 사이클에서 호출처 누락 발생 가능 (검토 항목 7.2 "호출처 grep 매트릭스 누락").

**정정 권고**:
- arch 5.6에 다음 추가: "M5 추가: `drawWithCeiling\(` / `isCeilingApplicable\(` 호출처 모두 `lineup` 인자 정합 여부 grep. 호출처는 main.js dispatch.buy 1건 + buy-panel 0건(상태 표시는 isCeilingApplicable로 옵셔널)."

## 4.2. P2-2. arch 4.M3.1 부팅 흐름에 ceiling 관련 호출 미박제 (검토 항목 4.5)

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 678~711 (4.M3.1 부팅 절차).

**결함 본질**:
- 4.M3.1 부팅 흐름이 storage v7 chain까지 박제되어있으나 lineup 객체에 enabled 5종 + ceilingEnabled 검증식 호출 시점 미명시.
- numbers.js import 시점에 1.4.A.3 검증식 5~9 호출(02_data 1.4.A.3 line 113 "부팅 시 본 검증 미성립 → 부팅 실패")이 02_data에는 박제됐으나 arch 4.M3.1에는 미박제.

**영향**: 부팅 시 검증식 호출 시점 모호. 단계 5 구현 시 numbers.js import side-effect로 throw인지 / main.js mount 단계에서 호출인지 결정 필요.

**정정 권고**:
- arch 4.M3.1 1단계 후 또는 0단계 신설:
  ```
  0. numbers.js import 시점: 모든 LINEUPS의 1.4.A.3 검증식 1~9 자동 호출. 미성립 시 throw + console.error → 부팅 실패.
  ```

## 4.3. P2-3. arch 3.10.M3.1 storage 절에 메커닉 플래그 영속 영향 0 박제 부재 (검토 항목 1.3)

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 309~336 (3.10.M3.1 storage 절).
- `/Users/ghostjin/kuji/docs/03_architecture.md` line 901 (5.21 게이트).

**증거 인용 (5.21)**:
```
- storage v7 보존 (메커닉 플래그는 lineup 정의로 영속 영향 0).
```

**결함 본질**:
- 5.21 게이트에 "storage v7 보존" 박제됐으나 3.10.M3.1 본문 절에 동일 박제 부재. M3.1 / M4 / M4.1 사이클은 모두 schemaVersion bump 했으나 M5는 v7 보존 = 본문 박제 의무.
- plan 11.2.3 "SCHEMA_VERSION v8 신설 vs v7 보존 = v7 보존 권고"가 단계 2 design 결정 영역. 결정은 v7 보존이지만 arch 3.10.M3.1 본문 미반영.

**영향**: 미세 (게이트 박제로 검증 가능). 그러나 단계 6 게이트 grep과 본문 SSOT 정합 의무 미달.

**정정 권고**:
- arch 3.10.M3.1에 다음 1줄 추가:
  ```
  // **M5 (2026-05-10)**: schemaVersion v7 보존. 메커닉 플래그(lastOneEnabled / dcEnabled / ceilingEnabled / ceilingPurchaseSize / ceilingTier)는 lineup 정의(numbers.js)이므로 영속 영향 0. 마이그레이션 신설 0.
  ```

# 5. 통과 항목

## 5.1. SSOT 정합 통과

5.1.1. 02_data 1.4.0 enabled 5종 필드 정의 박제 (line 58~62).
5.1.2. 02_data 1.4.A.3 검증식 5~9 신설 박제 (line 97~107).
5.1.3. 02_data 1.4-XG 절 신설 (메타 + 등급 + 천장 + 출처 + LINEUP 객체 5건 1:1 정합).
5.1.4. spec 5.4.6 / 5.5.7 / 5.13.G 절 신설.
5.1.5. arch 3.5 / 3.6 enabled 분기 박제 + 3.6.M5 core/ceiling.js 절 신설 + 5.21 게이트 신설.
5.1.6. 변경이력 4.19 (02_data) / 8.20 (spec) / 6.14 (arch) 박제.

## 5.2. XENOGLOSSIA 데이터 정합 통과

5.2.1. countPerBox 합 = 2+6+18+24+50 = 100 = boxSize (line 448 검증).
5.2.2. 1.4-XG.1 메타 + .2 등급 + .4 천장 + .6 LINEUP 객체 키 1:1 정합.
5.2.3. tier_class 분류 (S=hero / A=hero / B=main / C=main / D=goods) 검증식 1.4.A.3 통과 (hero ≥ 1 + goods ≥ 1).
5.2.4. lastOneEnabled=false → tiers에 "Last One" 부재 정합 (검증식 6).
5.2.5. dcEnabled=false → lineup.dc 부재 정합 (검증식 7, 1.4-XG.3 박제).
5.2.6. ceilingEnabled=true → ceilingPurchaseSize=30 / ceilingTier="S" / S 등급 존재 / 30 ≤ 100 정합 (검증식 8 모두 통과).

## 5.3. 비목표 박제 정합 통과

5.3.1. plan 4.1~4.5 + 비목표 6.1~6.7 박제.
5.3.2. spec 5.13.G.6.1~6.3 (selectable / 가격 / 일반 라인업) 박제.
5.3.3. lobbyHero 키 개명 / "Last One" 데이터 정의 / Last One 자산 키 단일화 비목표 잔존.

## 5.4. 메이저 부피 정합 부분 통과

5.4.1. plan 7.1~7.4 영향 매트릭스 박제.
5.4.2. plan 8 추정 분할 박제 (round 폭증 가능성 plan 본문 박제).
5.4.3. plan 9 차기 사이클 후보(M5.1 / M5.2 / M6 / M5+) 박제.

# 6. 단계 4 진입 가능 여부

**불가**. P0 4건 모두 정정 의무.

## 6.1. 차단 사유

6.1.1. P0-1 spec 5.13.G.3 `drawNormal` 미정의 = 시그니처 SSOT 불일치 → 단계 5 구현 코드 작성자 결정 모호.
6.1.2. P0-2 spec 5.9.2 stale = docs와 docs SSOT 불일치 → CLAUDE.md 4.5 위반.
6.1.3. P0-3 02_data 1.4.LINEUPS stale = LINEUPS 배열 SSOT 이중화 → 메이저 부피 round 폭증 패턴.
6.1.4. P0-4 spec 5.13.G 미결정 박제 = 본 사이클 단계 2 결정 미수렴 → 사용자 결정 영역 침해 (CLAUDE.md 2.5 위반).

## 6.2. round 2 진입 권고

6.2.1. P0-4 사용자 결정 게이트 (G.4.3 / G.5.1 / G.6.4 3건) 사용자 답변 수렴 → spec 본문 정정.
6.2.2. P0-1 / P0-2 / P0-3 자비스 자율 정정 (사용자 결정 영역 미아님, docs 정합 라운드).
6.2.3. P1 3건도 본 round 2에서 동시 흡수 권고 (단계 4 진입 후 발견 시 round 회귀 위험 = 메이저 부피 정합 의무).
6.2.4. P2 3건은 round 3 또는 단계 4 impl_plan 진입 시 흡수 가능.

## 6.3. round 폭증 위험 평가

6.3.1. 본 사이클은 plan 8 추정대로 round 폭증 위험 명시. round 1에서 P0 4건 + P1 3건 = 7건 정정 부담 = round 2 통과 후 round 3 추가 발생 가능성 30~40%.
6.3.2. P0-4 결정 게이트는 "단계 1 plan에서 흡수했어야 하는 결정"이 단계 2 design 본문에 흘러간 것 = plan 11.2 결정 영역 누락. 차기 사이클 학습 후보 (단계 8 흡수).
6.3.3. CLAUDE.md 2.5 사용자 결정 영역 침해 패턴은 메이저 부피 정합 정책 미흡으로 누적되면 신뢰 큰 손상 (메모리 룰 `feedback_qa_before_reporting` 정합).

# 7. 검증자 의견 (의견 표기)

[의견] 본 사이클은 메이저 부피로 round 폭증을 plan 8에서 이미 예측한 상태. P0-4 (단계 2 결정 미수렴 박제)는 plan 11.2 결정 영역에 G.4.3 / G.5.1 / G.6.4 3건이 누락된 결과 = plan 단계에서 결정 영역 enumerable화 부재 학습 후보. 차기 메이저 사이클 진입 시 plan 11에 "사용자 결정 영역 / 자비스 자율 영역 / 단계 후보 영역" 3축 분리 권고 (단계 8 학습 흡수 후보).

[의견] P0-3 LINEUPS 이중 SSOT는 M3 시점 1.4.LINEUPS 절 형식의 stale 패턴. 차기 라인업(M6) 추가 시 답습 위험. 검토 항목 7.1 "M3.1 시점 stale 절 (M4.1 학습 답습)" 정합 = 본 사이클에서 정정 의무 + 단계 8 학습 흡수 후보.

[의견] P1-1 / P1-2 arch 4장 흐름 SSOT 결손은 M5가 첫 메커닉 분기 사이클이라는 점에서 "흐름 SSOT 갱신 의무 패턴"이 아직 누적되지 않은 결과. 검토 항목 7.1 / 7.2 "메이저 부피 일관성 / 전수 검증 의무" 정합. 단계 8 학습 흡수 후 차기 메커닉 분기 사이클(예: M5 세가 럭키쿠지 잔여 카운터)에서 답습 의무.

# 8. round 2 재검증 (2026-05-13)

| 항목 | 값 |
|---|---|
| round | 2 |
| 검토 일자 | 2026-05-13 |
| 검토 산출물 | round 1 P0/P1 정정 후 spec/data/arch 본문 |
| 결과 | **통과** (단계 4 진입 가능) |

## 8.1. round 1 P0 4건 해소 검증

### 8.1.1. P0-1 (spec 5.13.G.3 drawNormal → drawOne 통일) = 해소

- **검증 위치**: `/Users/ghostjin/kuji/docs/01_spec.md` line 588~620.
- **해소 증거**: 의사코드 line 591~594 / 600~604의 fallback 분기가 `for (i=0..count) drawOne(boxState, drawRng, lineup)` 반복으로 통일됨. `drawNormal` 함수 호출 본문 0건.
- **잔존 grep**: `drawNormal` = spec line 620 정정 박제 텍스트 1건만(메타 설명용, 함수 호출 아님). src/ / arch / 02_data 모두 0건.
- **arch 3.6.M5 정합**: line 196~206 = `drawOne(boxState, drawRng, lineup, sIndex) + drawOne x (count-1)` 박제. spec 의사코드와 1:1 정합.
- **시그니처 SSOT 단일화 통과**.

### 8.1.2. P0-2 (spec 5.9.2 BUY_QUICK_OPTIONS = [1,3,5,10,30]) = 해소

- **검증 위치**: `/Users/ghostjin/kuji/docs/01_spec.md` line 175.
- **해소 증거**: `02_data 1.6 BUY_QUICK_OPTIONS (= [1, 3, 5, 10, 30]). **M5 갱신**: 30 신설. 박스 매수 ≥ 30 시만 30 옵션 활성 (render/buy-panel). 천장 활성 라인업(lineup.ceilingEnabled === true) + 30매 동시 구매 시 5.13.G 천장 룰 자동 적용 (사용자 결정 = 통 선택 skip 강제, 5.13.G.6.4).`
- **02_data 1.6 정합**: line 590 = `[1, 3, 5, 10, 30]` 1:1 정합.
- **천장 룰 cross-link 박제 정합**: 5.13.G.6.4 (= 사용자 결정 통 선택 skip) 참조 명시.

### 8.1.3. P0-3 (02_data 1.4.LINEUPS 본문 표 3건 정합) = 해소

- **검증 위치**: `/Users/ghostjin/kuji/docs/02_data.md` line 389.
- **해소 증거**: `[LINEUP_DRAGONBALL, LINEUP_ONEPIECE, LINEUP_XENOGLOSSIA]` + "활성 라인업 N개 (M5 = 3, 1.4-XG 추가)".
- **1.4-XG.6 정합**: line 525 = `export const LINEUPS = [LINEUP_DRAGONBALL, LINEUP_ONEPIECE, LINEUP_XENOGLOSSIA];` 1:1 정합.
- **arch 5.21 정합**: line 943 (변경이력 6.14) "LINEUPS 배열 추가" 박제 정합.
- **LINEUPS SSOT 단일화 통과**.

### 8.1.4. P0-4 (spec 5.13.G 미결정 → 사용자 결정 박제) = 해소

- **검증 위치 1 (G.4.3)**: spec line 626. "**M5 단계 2 결정 - 자비스 추천 채택**" + "안내 문구 박제 **금지**" + 메모리 룰 `feedback_lottery_red_text` 정합 명시. → 안내 박제 0 + 메모리 룰 정합 통과.
- **검증 위치 2 (G.5 절 헤더)**: spec line 628. "**M5 단계 2 결정 - 자비스 추천 채택**" → 결정 박제 완료.
- **검증 위치 3 (G.5.1)**: spec line 630. "**구매 패널 30 옵션 시각 강조 (본 사이클 흡수)**" + 30 옵션 라벨 "S賞 확정" 박제 정합. 단계 4 마크업 결정만 잔존(허용 = 본문 결정 + 구현 결정 분리).
- **검증 위치 4 (G.6 절 신설)**: spec line 634~640. "M2.1 통 선택과의 인터랙션 (M5 사용자 결정 3.3 - 2026-05-13)" + G.6.1 통 선택 skip 강제 (사용자 결정 (a)) + G.6.2 dispatch.buy 분기 정의 + G.6.3 메모리 only state 보존 정책.
- **검증 위치 5 (G.7 비목표 시프트)**: spec line 642~647. 구 G.6 비목표 절이 G.7로 시프트됨. G.7.1~G.7.4 박제 정합.
- **사용자 결정 영역 침해 해소 (CLAUDE.md 2.5 정합)**: 사용자 결정 (a) 채택 박제 + 메모리 룰 `feedback_lottery_red_text` 정합 (G.4.3) + 자비스 추천 채택 박제 (G.5).

## 8.2. round 1 P1 3건 해소 검증

### 8.2.1. P1-1 (arch 4.2 / 4.5 enabled 분기 박제) = 해소

- **arch 4.2 (line 602~610)**: `lineup.dcEnabled === true 시만 core/double_chance.addTicket 호출` + `DrawResult.isLastOne === true AND lineup.lastOneEnabled === true 시만 core/last_one.lastOnePrize 합산` + `lineup.lastOneEnabled === false 시 last-one-modal 미표시` 박제. spec 5.4.6 / 5.5.7 cross-link 정합.
- **arch 4.5 (line 624~628)**: `lineup.dcEnabled === false 시 본 흐름 전체 비활성` + dispatch.draw_dc 호출 자체 비활성 박제. spec 5.5.7 정합.
- 흐름 SSOT와 spec / 모듈 시그니처 1:1 정합 통과.

### 8.2.2. P1-2 (arch 4.M5 천장 룰 흐름 절 신설) = 해소

- **arch 4.M5 (line 773~802)**: "천장 룰 30연 흐름 (M5 신설, ceilingEnabled=true 라인업)" 절 신설.
  - 1. 사용자 buy-panel 30매 클릭 → dispatch({type:'buy', count:30}).
  - 2. **통 선택 skip 강제** (5.13.G.6.1 = 사용자 결정 (a)) + state.selectedGridIndices = [] 폐기.
  - 3. core/ceiling.drawWithCeiling(state.boxState, drawRng, lineup, 30) 호출 + deck 30매 소비.
  - 4. unopenedTickets 30개 lockedResult 일괄 부여 + gridIndex = null (skip 정합).
  - 5. core/history는 reveal 시점 append (B-α 정합).
  - 6. saveState → b2 분기 (페이지플립 카드) 진입.
- spec 5.13.G.6 dispatch.buy 분기 정의와 1:1 정합 통과.
- "의무" 절 (line 799~802) drawWithCeiling 호출처 = dispatch.buy 1곳 박제 + dcEnabled / lastOneEnabled 동시 활성 분기 미흡수 검증식 박제.

### 8.2.3. P1-3 (spec 5.13.A.6.6 메커닉 플래그 5종 정의 의무) = 해소

- **spec 5.13.A.6.6 (line 295)**: "**M5 추가**: 메커닉 활성 플래그 5종 정의 의무 (`lastOneEnabled` / `dcEnabled` / `ceilingEnabled` / `ceilingPurchaseSize` / `ceilingTier`)" + 02_data 1.4.0 / 1.4.LINEUPS 라인업 추가 절차 7번 정합 + 1.4.A.3 검증식 5~9 통과 의무 + ceilingTier ∈ lineup.tiers + ceilingPurchaseSize ≤ boxSize 박제.
- 02_data 1.4.LINEUPS 라인업 추가 절차 7번 (line 402~406)과 1:1 정합 통과.

## 8.3. round 2 신규 결함

**P0/P1 신규 0건**.

### 8.3.1. P2-NEW-1 (spec 5.13.G.3 박제 라벨 오기) = P2

- **위치**: spec line 620.
- **본문**: `**M4.2 round 2 P0-1 정정 박제**: drawNormal 미정의 함수 호출 제거. fallback = drawOne(boxState, drawRng, lineup) 반복(arch 3.6.M5 정합). spec / arch SSOT 단일화.`
- **결함 본질**: 본 사이클은 **M5-ceiling-rule round 2**이므로 라벨이 "**M5 round 2 P0-1 정정 박제**"여야 한다. "M4.2" 사이클 라벨은 별도 사이클(메뉴 재설계 정리)이므로 사이클 답습 오기.
- **영향**: 미세 (사이클 추적 메타. 본문 정정 자체 정합은 통과). 단계 4 진입 차단 없음.
- **정정 권고**: spec line 620 "M4.2" → "M5" 1자 정정. 단계 4 impl_plan 진입 시 흡수 가능.
- **블로킹 여부**: 아님 (P2, 단계 4 흡수 후보).

## 8.4. round 1 미정정 P2 항목 영향

### 8.4.1. P2-1 (arch 5.6 grep에 drawWithCeiling 미박제) = 단계 4 흡수 가능

- arch 5.21 게이트(line 928 / 930)에 호출처 박제 완료(core/ceiling.js drawWithCeiling 활성 조건 검증 + render/main.js dispatch.buy 호출 분기). 5.6 일반 grep 누적 의무는 미반영이나 5.21에서 검증되므로 단계 6 게이트 통과.
- 단계 4 impl_plan 진입 시 5.6에 1줄 추가 또는 M5.1 백로그.
- 블로킹 없음.

### 8.4.2. P2-2 (arch 4.M3.1 부팅 ceiling 검증 호출 시점 미박제) = 단계 4 흡수 가능

- 02_data 1.4.A.3 line 113 "부팅 시 본 검증 미성립 → 부팅 실패" 박제됨. arch 4.M3.1 본문 stale은 단계 4 impl_plan 절차 박제 시 흡수 가능.
- 블로킹 없음.

### 8.4.3. P2-3 (arch 3.10.M3.1 storage v7 보존 박제 부재) = 단계 4 흡수 가능

- arch 5.21 게이트(line 901에 해당. 6.14 변경이력에 "storage v7 보존 (메커닉 플래그 = lineup 정의이므로 영속 영향 0)" 명시) 박제됨. 본문 3.10.M3.1 stale은 단계 4 impl_plan 절차 박제 시 흡수.
- 블로킹 없음.

## 8.5. round 폭증 위험 평가 (round 1 검증자 의견 답습)

- round 1 검증자 예측 "round 3 추가 발생 가능성 30~40%"에 대해 round 2 정정 후 신규 결함 = P2 1건(라벨 오기). **P0 / P1 신규 0건 → round 3 회피 가능**.
- plan 11.2 결정 영역 누락 학습은 **단계 8 흡수 후보로 잔존**. P0-4가 본 사이클에서 발현됐고 정정 완료로 본 사이클 내 차단은 해소.
- [의견] round 2 정정의 부피가 컸음에도 신규 P0/P1 0건 = 정정자가 round 1 분석 의도를 정확히 흡수한 결과. plan 단계 결정 영역 enumerable화 미흡 학습 후보(단계 8 흡수)는 잔존.

## 8.6. 단계 4 진입 가능 여부

**가능**. 단계 4 impl_plan 진입 권고.

### 8.6.1. 통과 사유

- round 1 P0 4건 = 모두 해소 (8.1.1~8.1.4).
- round 1 P1 3건 = 모두 해소 (8.2.1~8.2.3).
- round 2 신규 P0 / P1 = 0건.
- round 2 신규 P2 = 1건(spec line 620 사이클 라벨 오기. 단계 4 흡수 후보, 블로킹 아님).
- 미정정 P2 3건(P2-1 / P2-2 / P2-3) = 모두 5.21 게이트 박제로 단계 6 검증 가능. 본문 stale 정정은 단계 4 흡수 또는 M5.1 백로그.

### 8.6.2. 단계 4 impl_plan 진입 시 흡수 후보 (4건)

1. P2-NEW-1 spec line 620 라벨 "M4.2" → "M5" 정정.
2. P2-1 arch 5.6 grep에 drawWithCeiling / isCeilingApplicable 호출처 박제 1줄.
3. P2-2 arch 4.M3.1 부팅 흐름 검증식 호출 시점 박제 1줄.
4. P2-3 arch 3.10.M3.1 storage v7 보존 박제 1줄.

위 4건은 단계 4 impl_plan 본문에서 절차로 박제하면 본 사이클 내 자연 흡수.

### 8.6.3. 단계 8 학습 흡수 후보 (단계 4 이후 차기 사이클로)

- plan 단계에서 "사용자 결정 영역 / 자비스 자율 영역 / 단계 후보 영역" 3축 enumerable화 의무 (round 1 의견 답습).
- 라인업 추가 사이클의 LINEUPS 본문 표 / 라인업 추가 절차 갱신 의무 답습 패턴 (M3 / M5 답습 = M6 라인업 추가 시점에 자동 갱신 ChecksList 필요).
- arch 4장 흐름 SSOT 갱신 의무 (메커닉 분기 사이클 진입 시 4.MX 절 신설 의무).

# 9. round 2 의견 (의견 표기)

[의견] round 1 P0 4건 + P1 3건 = 7건 정정 부담 후 round 2 신규 P0/P1 0건 = round 1 검증자의 "round 3 발생 가능성 30~40%" 예측을 회피. 메이저 부피 사이클에서 round 1 결함 분류 + round 2 일괄 정정이 round 폭증 회피의 정합 패턴임을 본 사이클이 확인.

[의견] 사용자 결정 (a) "30연 = 통 선택 skip 강제 채택"은 매장 도메인 인식과 정합 (30연은 대량 자동 추첨이지 통 선택 체험과 분리). 메모리 룰 `feedback_lottery_red_text` 정합 + spec G.6.1~G.6.3 일관 박제. 단계 4 impl_plan에서 dispatch.buy 분기 구현 시 사용자 결정 (a) 답습 정합 의무.

[의견] P2-NEW-1 (사이클 라벨 "M4.2" 오기)는 정정자가 다른 사이클 답습 정정 텍스트를 복사한 결과로 추정. round 1 / round 2 보고서 자체에는 사이클 ID가 명확히 박제되었으므로 본문 추적 가능. 차기 정정 사이클에서 본 박제 텍스트 라벨 표준화 학습 후보(단계 8).
