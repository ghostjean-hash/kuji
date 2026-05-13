# M5 ceiling-rule - 06 impl_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M5-ceiling-rule |
| 단계 | 6 impl_review |
| 검증자 | 격리 subagent |
| round | 1 |
| 검토 일자 | 2026-05-13 |
| 검토 산출물 | 단계 5 implement T1~T16 + 발견 정정 (core/box.js initBox) |

# 1. 결과 요약 (P0/P1/P2 건수)

| 우선도 | 건수 |
|---|---|
| P0 (단계 7 진입 차단) | 0 |
| P1 (단계 7 진입 전 정정 의무) | 0 |
| P2 (단계 7 흡수 가능 / 백로그) | 3 |

**단계 7 QA 진입 = 가능**. round 2 회피.

본 사이클은 메이저 부피("첫 메커닉 분기 + 라인업 추가")로 round 폭증 위험이 plan 8에 박제되었으나, 단계 3 design_review round 2 통과 결과를 단계 5 implement가 정확히 흡수했음. 핵심 SSOT 5축(02_data 1.4.0 / 1.4-XG / 검증식 / 천장 알고리즘 / 분기 흐름) 모두 단계 2 결정대로 적용. 검증 게이트 grep 결과 = 매직 잔존 0건. 단위 테스트 신규 3 suite 등재 + 기존 suite 영향 0.

# 2. P0 결함

**없음**.

# 3. P1 결함

**없음**.

# 4. P2 결함

## 4.1. P2-1. main.js dispatch.buy 천장 분기 시 기존 raw 티켓 잔존 처리 미명세

**위치**:
- `/Users/ghostjin/kuji/src/render/main.js` line 198~231 (dispatch.buy 천장 분기).
- `/Users/ghostjin/kuji/docs/01_spec.md` line 634~640 (5.13.G.6 통 선택 인터랙션).

**증거 (main.js 215)**:
```
state.unopenedTickets = [...state.unopenedTickets, ...newTickets];
```

**결함 본질**:
- 사용자가 통 선택 OFF 상태에서 일반 buy로 raw 티켓(`lockedResult === null`)을 인벤토리에 보유 중인 상황에서 천장 30연을 추가 구매하면, raw 티켓 + lockedResult 부여된 30매 천장 티켓이 혼재.
- spec 5.13.G.6.1은 "ticket.lockedResult 30매 일괄 부여" 박제. 5.13.G.6.3은 selectedGridIndices만 폐기 박제. raw 티켓 폐기 / 흡수 정책 미명세.
- main.js 현 구현은 raw 티켓을 그대로 두고 30매를 뒤에 append. peel 시 raw 티켓이 먼저 reveal 대상 (firstTicket.lockedResult === null 분기) → case (b) skip ON drawOne 호출 가능.
- 영향: raw 티켓이 잔존하면 사용자가 의도한 "통 선택 절차"가 천장 30매 reveal 후 진행되는 형태로 흐름이 깨질 수 있음. 단계 7 QA의 사용자 시각 검수 항목 후보.

**영향**: 미세. 사이클 단계 7 QA 시점에 사용자 시각 점검 후 결정 가능 (raw 티켓 사전 흡수 강제 vs 잔존 허용). 매장 도메인 인식과의 정합성 사용자 결정 영역.

**정정 권고**:
- 단계 7 QA에서 사용자 결정 게이트 1건 추가 권고: "천장 30연 분기 진입 직전 raw 티켓 잔존 시 (1) 강제 흡수(통 선택 자동 진행) (2) 인벤토리 합산 잔존 (3) 진입 차단 + alert" 3안.
- 또는 M5.1 백로그로 등재(M5.1 selectable UI 사이클에서 통합 검토).

**블로킹 여부**: 아님 (P2, 단계 7 흡수 또는 백로그 후보).

## 4.2. P2-2. assets.js에 XENOGLOSSIA 자산 매핑 부재 - 라인업 진입 시 시각 fallback 빈 SVG

**위치**:
- `/Users/ghostjin/kuji/src/data/assets.js` 전체.
- 호출처: `/Users/ghostjin/kuji/src/render/hero-carousel.js` line 44, `/Users/ghostjin/kuji/src/render/minor-row.js` line 43, `/Users/ghostjin/kuji/src/render/product-image.js` line 9, `/Users/ghostjin/kuji/src/render/tier-accordion.js` line 3.

**증거 (assets.js 130~142)**:
```
const PRODUCTS_MAIN = {
  "A": PRODUCT_A_MAIN,
  ...
  "Last One": PRODUCT_LAST_ONE_MAIN,
};
```

**결함 본질**:
- `PRODUCTS_MAIN` 객체에 드래곤볼 등급(A~J + Last One)만 정의됨. 원피스 / XENOGLOSSIA 등급은 미정의. `getProductMainAsset("S")` 호출 시 "" 반환 (line 151).
- XENOGLOSSIA 라인업 진입 시 hero-carousel(S/A) / minor-row(B/C/D) / product-image(S/A/B/C/D) / tier-accordion 모두 빈 SVG 노출.
- impl_plan T3은 "비목표 박제 (XENOGLOSSIA = placeholder + SVG fallback, M5.1 별도)"로 단순 fallback만 명시 (PROGRESS 14.2.5 T3).

**영향**: 본 결함은 M3 (원피스 라인업 추가) 사이클에서 동일 패턴 답습 - 원피스도 assets.js 매핑 0건. XENOGLOSSIA의 회귀가 아니라 답습. 단계 7 QA 라이브 검수에서 시각 빈 SVG 컨펌 시 사용자 인지 가능.

**정정 권고**:
- M5.1 백로그로 명시 등재 (PROGRESS 14.4.1 답습 = "M5.1 = ... + assets.js 라인업 분기 자산 매핑").
- 또는 단계 7 QA에서 사용자 시각 컨펌 후 SVG placeholder 5종 신설 결정 (사용자 결정 영역).

**블로킹 여부**: 아님 (P2, M5.1 백로그 / 단계 7 흡수 후보).

## 4.3. P2-3. arch 5.6 시그니처 grep 누적 의무에 drawWithCeiling / isCeilingApplicable 미박제 - round 1 미정정 P2-1 답습

**위치**:
- `/Users/ghostjin/kuji/docs/03_architecture.md` 5.6 시그니처 grep 절.

**결함 본질**:
- 단계 3 design_review round 1 P2-1 = "arch 5.6 grep에 drawWithCeiling 호출처 grep 의무 미박제" 식별됨.
- round 2 검증자(8.4.1)가 "단계 4 흡수 또는 M5.1 백로그" 명시. 단계 4 impl_plan은 본 항목 흡수 0 (T1~T16 모두 코드/테스트만 다루고 arch 5.6 정정 박제 0).
- 단계 5 implement에서도 arch 5.6 갱신 0건 = 본 결함 잔존.
- arch 5.21 게이트는 별도로 박제됨 (line 928~930) → 단계 6 검증 가능. 5.6 누적 grep만 stale.

**영향**: 미세. 차기 사이클의 라인업/메커닉 grep 누적 SSOT가 5.6에서 누락 = 차기 작업자 grep 시 본 사이클 호출처 검증 누락 위험.

**정정 권고**:
- M5.1 또는 다음 정리 사이클에서 arch 5.6에 1줄 추가: "M5 추가: `drawWithCeiling\(` / `isCeilingApplicable\(` 호출처 모두 `lineup` 인자 정합 여부 grep".

**블로킹 여부**: 아님 (P2, 누적 백로그 후보).

# 5. 통과 항목

## 5.1. SSOT 정합 통과 (검토 항목 1)

5.1.1. **LINEUP_XENOGLOSSIA 18 상수 + 객체 키 1:1 정합**: numbers.js line 226~291 = 02_data 1.4-XG.1~1.4-XG.6 완전 정합. ID / titleJa/Ko / IP / operator / 발매일 / 종료일 / outlets / priceJpy / boxSize=100 / boxSizeEstimated=false / assetsBasePath / assetsAvailable=false / homeHeroAssetPath / ceilingPurchaseSize=30 / ceilingTier="S" / SOURCES 5건 / lastOneEnabled=false / dcEnabled=false / ceilingEnabled=true 모두 박제.

5.1.2. **TIERS_XENOGLOSSIA countPerBox 합 = 100**: S=2 + A=6 + B=18 + C=24 + D=50 = 100 = boxSize. `_validateLineupTierSum` 통과 (LINEUPS.forEach 자동 호출).

5.1.3. **enabled 5종 LINEUPS 3건 모두 정의**: 드래곤볼 (lastOne=true / dc=true / ceiling=false), 원피스 (동일), XENOGLOSSIA (lastOne=false / dc=false / ceiling=true + Purchase=30 + Tier=S). LINEUPS.forEach validateLineupTierClass 자동 호출 통과.

5.1.4. **validateLineupTierClass M5 검증식 5~9 정합**: 검증식 5 (lastOne=true → "Last One" 존재) / 검증식 6 (lastOne=false → 부재) / 검증식 7 (dc=true → dc.tierClass 정합) / 검증식 8 (ceiling=true → ceilingPurchaseSize + ceilingTier ∈ tiers + ≤ boxSize) / 검증식 9 (boolean 정합) 모두 박제 (numbers.js line 446~478).

5.1.5. **BUY_QUICK_OPTIONS = [1,3,5,10,30]**: numbers.js line 343 정합. spec 5.9.2 line 175 + 02_data 1.6 line 590 모두 정합 (round 2 P0-2 정정 답습).

## 5.2. 천장 룰 정합 통과 (검토 항목 2)

5.2.1. **core/ceiling.js drawWithCeiling 활성 조건**: line 19~48 = `ceilingEnabled !== true → drawNormalN` / `count !== ceilingPurchaseSize → drawNormalN` / `sIndex < 0 → drawNormalN` / 정합 = drawOne(sIndex) + drawOne x (count-1). spec 5.13.G.3 의사코드 1:1 정합.

5.2.2. **drawNormalN = drawOne 반복 fallback**: line 8~14. spec / arch 통일된 fallback 모델 (round 2 P0-1 정정 답습).

5.2.3. **isCeilingApplicable 검증식**: line 52~58 = ceilingEnabled + count===ceilingPurchaseSize + deck.length >= count + deck.includes(ceilingTier). spec 5.13.G.2.1~G.2.5 정합.

5.2.4. **main.js dispatch.buy 천장 분기**: line 198~231 = `ceilingEnabled === true && count === ceilingPurchaseSize` → state.selectedGridIndices = [] (통 선택 skip 강제, 사용자 결정 3.3 (a) 정합) + drawWithCeiling 호출 + 30매 ticket lockedResult 일괄 부여 + dcEnabled === true 시만 addTicket 호출 + history는 reveal 시점에 append (B-α 정합). arch 4.M5 흐름 6단계와 1:1 정합.

5.2.5. **dispatch.buy 천장 분기 dcEnabled 가드**: line 218~226 = `if (lineup.dcEnabled === true)` 분기 후만 addTicket. XENOGLOSSIA dcEnabled=false 시 본 분기 자동 비활성.

## 5.3. 메커닉 분기 정합 통과 (검토 항목 3)

5.3.1. **core/last_one.js lastOnePrize**: line 11~13 = `lineup.lastOneEnabled === false → throw`. 호출처 분기 의무 명시.

5.3.2. **core/draw.js 마지막 매 분기**: line 42~55 = `wasLast` 시점에 `lineup.lastOneEnabled === false → isLastOne=false + lastOnePrize 부재 반환 + drawnCount += 1`. lastOneEnabled=true → 기존 답습 (drawnCount += 2 + lastOnePrize 동시 지급).

5.3.3. **core/box.js initBox lastOneEnabled 분기**: line 24 = `expectedDeckSize = lineup.lastOneEnabled === false ? lineup.boxSize : lineup.boxSize - 1`. XENOGLOSSIA deck=100 / 드래곤볼 deck=79. **단계 5 발견 정정 박제 (PROGRESS 14.5.5)**.

5.3.4. **main.js peel case 2건 addTicket dcEnabled 분기**: line 339~346 (case a) + 371~378 (case b) = `if (lineup.dcEnabled === true)` 분기 후만 addTicket.

5.3.5. **main.js dispatch.draw_dc dcEnabled 가드**: line 549~551 = `if (lineup.dcEnabled === false) return`.

5.3.6. **render/last-one-row.js + last-one-indicator.js 미렌더**: 각 line 9~10 = `lineup.lastOneEnabled === false` 시 fragment / null 반환.

5.3.7. **render/products-history-tab.js DC sub-section 미렌더**: line 34~35 = `if (lineup.dcEnabled !== false)` 분기 후만 renderDcSection 호출. dc 직접 접근(line 97 `const dc = lineup.dc;`) = 분기 후이므로 안전.

## 5.4. 시각 표현 정합 통과 (검토 항목 4)

5.4.1. **render/buy-panel.js is-ceiling 라벨**: line 43~52 = `lineup.ceilingEnabled === true && !isReplaced && n === ceilingPurchaseSize && !disabled` → `is-ceiling` class + `${value}매 (${ceilingTier}賞 확정)` 라벨. spec 5.13.G.5.1 정합.

5.4.2. **비활성 라인업 30 옵션 라벨 부착 0**: 드래곤볼/원피스 ceilingEnabled=false → isCeiling=false → 단순 `${value}매` 라벨. 시각 정합.

## 5.5. 호출처 grep 정합 통과 (검토 항목 5)

5.5.1. **drawWithCeiling 호출처 = main.js dispatch.buy 1건만**: `grep "drawWithCeiling("` 결과 src/ = 정의(ceiling.js) 1 + main.js 1 + tests/ceiling.test.js 6. 호출처 본문 1건 정합.

5.5.2. **isCeilingApplicable 호출처 = 0건 (src/) + tests/만**: src/ = 정의 1 / 호출처 0건. tests/ceiling.test.js 4건. 본 사이클 옵셔널 export 정합 (impl_plan 1.3 채택).

5.5.3. **lineup.dc 직접 접근 호출처**: src/core/double_chance.js (모듈 정의), src/render/products-history-tab.js (dcEnabled !== false 분기 후), src/render/main.js dispatch.draw_dc (dcEnabled === false 가드 후), src/data/numbers.js validateLineupTierClass (dcEnabled === true 분기 후). 무방어 직접 접근 0건.

5.5.4. **lastOnePrize 호출처 = src/core/draw.js 1건만**: drawOne 내부 wasLast + lastOneEnabled=true 분기 후만 호출. 외부 호출처 0건.

5.5.5. **BUY_QUICK_OPTIONS 매직 [1,3,5,10] 잔존 0건**: numbers.js 정의 line 343 + buy-panel.js import + tests/buy.test.js 1건. 코드 본문 매직 잔존 0.

## 5.6. 단위 테스트 정합 통과 (검토 항목 6)

5.6.1. **ceiling.test.js**: 3 suite + 8 케이스 정의. 활성 (S 1매 보장 + 결정론 + deck 잔여) + 비활성 fallback (드래곤볼 ceilingEnabled=false + count!==30) + isCeilingApplicable 4 케이스 + 결정론 1 케이스.

5.6.2. **lineup_xenoglossia.test.js**: 5 suite + 15 케이스 정의. 메타 (4) + 메커닉 플래그 (5) + tier_class 분류 (5) + LINEUPS 배열 (2) + 검증식 (1) 모두 박제.

5.6.3. **mechanic_disable.test.js**: 5 suite + 13 케이스. lastOneEnabled=false 분기 (lastOnePrize throw + XENOGLOSSIA 100연 isLastOne=false + 드래곤볼 회귀) + 검증식 5/6/7/8 + 기존 라인업 회귀(드래곤볼/원피스 throw 0).

5.6.4. **runner.js 등재**: line 30~32 = ceiling / lineup_xenoglossia / mechanic_disable 3 suite 추가. 기존 suite 영향 0 (M3.5 / M4 / M4.1 / M4.2 자산 보존).

## 5.7. 회귀 위험 통과 (검토 항목 7)

5.7.1. **드래곤볼 / 원피스 = lastOne=true / dc=true / ceiling=false 정합**: numbers.js line 132~136 (드래곤볼) + line 215~219 (원피스). M3 / M3.1 / M3.5 분류 답습 보존.

5.7.2. **M3 / M3.1 / M3.5 / M4 / M4.1 / M4.2 자산 회귀 0**: tier_class 분류 / 라인업 격리 / homeHeroAssetPath 키 / activeTab 라우팅 / LAST_ONE_TIER_NAME 단일화 모두 보존.

5.7.3. **storage v7 보존**: numbers.js line 8 SCHEMA_VERSION = 7 유지. M5 메커닉 플래그는 lineup 정의 (numbers.js)로 영속 영향 0. 마이그레이션 신설 0 = arch 5.21 게이트 박제 정합.

# 6. 단계 7 QA 진입 가능 여부

**가능**. 단계 7 진입 권고.

## 6.1. 통과 사유

6.1.1. 단계 3 design_review round 2 P0=0 / P1=0 통과 후, 단계 5 implement가 5축 SSOT(데이터 / 검증식 / 알고리즘 / 분기 흐름 / 시각)를 정확히 흡수.
6.1.2. arch 5.21 게이트 9건 + 검증식 5~9 + 호출처 grep 5축 모두 통과.
6.1.3. 회귀 위험 0건 (M3 series + M4 series 자산 보존).
6.1.4. 신규 단위 테스트 3 suite + 36+ 케이스 등재, 기존 suite 영향 0.

## 6.2. 단계 7 QA 게이트 권고 항목 (사용자 검수 대상)

6.2.1. **XENOGLOSSIA 라인업 진입 시 시각 라이브 검수**: hero-carousel / minor-row / product-image 빈 SVG fallback 확인 (P2-2 영향). placeholder 신설 결정 또는 M5.1 백로그.

6.2.2. **천장 30연 흐름 사용자 검수**: 박스 신선 시 30매 구매 → drawWithCeiling 호출 → results[0] = S → 30 ticket 일괄 lockedResult 부여 → reveal 진입. UI 흐름 (b2 페이지플립 카드) 30매 연속 reveal 사용자 인식과 정합 여부.

6.2.3. **buy-panel "S賞 확정" 라벨 사용자 인식 시각 검수**: XENOGLOSSIA 진입 시 30 옵션 강조 마크업 (`is-ceiling` class) 실 렌더 시각.

6.2.4. **raw 티켓 + 천장 30연 혼재 검수 (P2-1 영향)**: 통 선택 OFF + 일반 5매 구매 후 천장 30연 추가 시 혼재 ticket 동작 사용자 검수.

6.2.5. **드래곤볼 / 원피스 라인업 회귀 검수**: M3 / M3.1 / M3.5 / M4 / M4.1 / M4.2 자산 시각 보존 라이브 검수 (CLAUDE.md 4.4 정합).

## 6.3. round 2 회피 평가

6.3.1. 단계 3 round 1~2 과정에서 P0/P1 누적 정정 후 단계 5에서 신규 P0/P1 발현 0건 = round 폭증 회피 패턴 성립 (M5 학습 14.5.2 답습).
6.3.2. [의견] 본 사이클의 메이저 부피(첫 메커닉 분기 + 라인업 추가)에도 불구하고 단계 3 round 2 통과 후 단계 5의 P0/P1 0건 결과는, 단계 3 round 2의 정정 7건(P0 4 + P1 3)이 단계 5 구현 작성자의 의도와 사용자 결정 (3.1/3.2/3.3)을 정확히 박제한 결과. 차기 사이클 답습 권고.

## 6.4. 단계 7 진입 전 사용자 결정 게이트

본 사이클에는 사용자 결정 영역 잔존 없음. plan / design / impl_plan 모든 결정 영역이 이미 단계 1~4에서 사용자 결정 (3.1/3.2/3.3) + 자비스 자율 결정 (5종)으로 박제됨.

# 7. 검증자 의견 (의견 표기)

[의견] 본 사이클은 첫 메커닉 분기 사이클이라는 부피에도 단계 5 implement가 단계 2/3/4 결정을 1:1로 흡수한 결과 P0/P1 결함 0건 도출. 단계 3 round 1 결함 (drawNormal 미정의 / BUY_QUICK_OPTIONS stale / LINEUPS 이중 SSOT / 사용자 결정 미수렴 4건)이 round 2 정정 박제 후 단계 5에서 모두 정합 적용. M4.1 학습 답습("round 1 누적 정정 → round 2 일괄 정정 → 단계 5/6 P0/P1 0건") 패턴 재확인.

[의견] P2-1(raw 티켓 + 천장 30연 혼재) 결함은 단계 2 design / 단계 4 impl_plan에서 결손된 영역. 사용자 도메인 인식 결정 게이트 1건 추가 = M4.1 학습 14.5.3 ("plan 단계 결정 영역 enumerable화 의무") 답습 후보. 차기 메이저 사이클 plan에서 "기존 인벤토리 상태와 새 메커닉의 상호작용" 결정 영역 enumerable화 권고 (단계 8 학습 흡수 후보).

[의견] P2-2(XENOGLOSSIA 자산 fallback)는 M3 (원피스) 답습 패턴이라 본 사이클 회귀가 아닌 누적 백로그. M5.1 selectable UI 사이클에서 동시 흡수 권고 (PROGRESS 14.4.1 정합).

[의견] core/box.js initBox lastOneEnabled 분기는 design / impl_plan에 명시되지 않은 단계 5 발견 정정 (PROGRESS 14.5.5 박제). 메이저 부피 사이클의 "흐름 SSOT 갱신 의무 패턴"이 아직 누적되지 않은 결과(M3.5 학습 답습 잠재). 차기 메커닉 분기 사이클(예: 세가 럭키쿠지 잔여 카운터) plan 7.2 코드 영향 매트릭스에 core/box.js 명시 권고 (단계 8 학습 흡수 후보).
