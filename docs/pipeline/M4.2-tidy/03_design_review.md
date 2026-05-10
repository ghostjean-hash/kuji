# M4.2-tidy - 03 design_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.2-tidy |
| 단계 | 3 design_review |
| 검증자 | 격리 subagent (general-purpose) |
| round | 1 |
| 검토 일자 | 2026-05-10 |

# 1. 결과 요약

| 등급 | 건수 | 결정 |
|---|---|---|
| P0 | 0 | - |
| P1 | 2 | 단계 4 흡수 의무 |
| P2 | 3 | 단계 4 흡수 또는 차기 사이클 백로그 |
| 통과 | 7 | - |

P0 0건. 단계 4 impl_plan 진입 가능. P1 2건은 단계 4 흡수 의무 (scope 본문 정정 + 코드 영향 결정).

# 2. P0 결함

없음.

# 3. P1 결함

## 3.1. P1-1 spec 4.1 본문 "homeAcked = true 동시 갱신" 박제 = 코드와 부정합 (M4.1 P1-1 흡수 미완)

### 3.1.1. 위치

- `/Users/ghostjin/kuji/docs/01_spec.md:93` (4.1 첫 진입)
- `/Users/ghostjin/kuji/docs/01_spec.md:311` (5.13.B.3.1 첫 방문자)

### 3.1.2. 본문 인용

spec 4.1 line 93:
> 면책 안내 dismiss → `state.meta.disclaimerSeen = true` (M2 trigger) + `homeAcked = true` (M4.1 호환 키) **동시 갱신**

spec 5.13.B.3.1 line 311:
> 면책 모달 dismiss → `meta.disclaimerSeen = true` 갱신 + **부수효과로 `home_acked = true` 동시 갱신** (M4 호환 키 보존, 의미 = "면책 동의 표시")

### 3.1.3. 코드 (검증 의무 박제)

`/Users/ghostjin/kuji/src/render/main.js:529-534` dispatch case `dismiss_disclaimer`:
```js
case "dismiss_disclaimer": {
  state.meta = { ...state.meta, disclaimerSeen: true };
  persist();
  rerender();
  break;
}
```

`state.homeAcked = true` 동시 갱신 코드 부재. saveState 시 partial에 homeAcked 미포함 → localStorage `kuji_home_acked` 미갱신. 첫 방문자가 면책 dismiss 후 homeAcked = false 잔존.

### 3.1.4. 결함 의미

본 사이클 plan 3.4.1 = "M4.1 P1-1 spec 본문 갱신으로 흡수" (자비스 추천 = a안, 코드 변경 부피 회피). 그러나 spec 본문이 "homeAcked 동시 갱신"을 박제하면서도 코드 측 동작은 갱신 0 → 새로운 spec/코드 부정합 도입. P1-1을 "흡수"한 것이 아니라 **다른 결함으로 치환**.

### 3.1.5. 자비스 추천 = 두 갈래

- **(a)** spec 본문에서 "homeAcked 동시 갱신" 박제 제거 (코드 정합 = disclaimerSeen 단독 갱신). home_acked 키는 M4 호환 잔존만 + 갱신은 enter_lineup 시점만. 본 사이클 = 코드 변경 0 정합.
- **(b)** 코드 dismiss_disclaimer case에 `state.homeAcked = true` + `saveState({ homeAcked: true })` 추가. 본 사이클 = 코드 동작 변경 (회피 의도 위반).

[의견] 자비스 추천 = (a). 본 사이클 의미("코드 동작 변경 0") + plan 비목표 7.3 정합. 단계 4 impl_plan에 spec 4.1/5.13.B.3.1 재정정 박제 의무.

## 3.2. P1-2 LAST_ONE_TIER_NAME 상수 정의 위치 박제 누락 (단계 2 design 영역)

### 3.2.1. 위치

- spec `/Users/ghostjin/kuji/docs/01_spec.md:524-525` 5.13.E.3 비고에 식별자 `LAST_ONE_TIER_NAME` 본문만 박제.
- 02_data.md / 03_architecture.md에 상수 정의 위치 (numbers.js 1.x 절) 박제 누락.
- src/data/numbers.js에 LAST_ONE_TIER_NAME 상수 미신설 (검색 결과 0건).
- src/core/box.js:7 + src/core/last_one.js:4 = 모듈 내 `LAST_ONE_TIER_LABEL` 잔존 (개명 의무).

### 3.2.2. 본문 인용

spec 5.13.E.3 line 524 (hero-carousel 비고):
> filter 식 (M3.5 round 3 정정 적용 완료) = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== LAST_ONE_TIER_NAME`. ... **M4.2 정정**: 시점 표기 "코드 변경 의무" → "적용 완료". 매직 문자열 `"Last One"` → 상수 `LAST_ONE_TIER_NAME`.

### 3.2.3. 결함 의미

본 사이클 plan 3.3.1 (M3.1 P2-3 LAST_ONE_TIER_NAME 상수화) = "src/data/numbers.js에 `LAST_ONE_TIER_NAME = "Last One"` 상수 신설 + 호출처 일괄 import. core/box.js / last_one.js의 모듈 내 `LAST_ONE_TIER_LABEL` 상수도 numbers.js로 통합." 박제. 그러나 단계 2 design에서 02_data.md 1.x 절에 상수 정의 박제가 누락됨.

본 프로젝트 절대 규칙 4.2 = "매직 넘버 금지. 모든 수치는 docs/02_data.md → src/data/numbers.js 상수." 정합. 02_data.md에 LAST_ONE_TIER_NAME 상수 정의 박제는 단계 2 design의 의무. 그러나 단계 4 impl_plan에서 흡수 가능 영역이라 P0 아닌 P1.

### 3.2.4. 자비스 추천

단계 4 impl_plan T2 본문에 "02_data.md 1.x (numbers.js 상수 표) `LAST_ONE_TIER_NAME = "Last One"` 행 신설" 명시 + numbers.js 신설 + box.js / last_one.js 모듈 내 상수 폐기 일괄. 본 사이클 정리 라운드 의미 + plan 3.3.1 정합.

# 4. P2 결함

## 4.1. P2-1 02_data 3.1.2 GLOBAL_KEYS 표 stale 가설 검증 미수행 박제 (plan 3.6.1)

### 4.1.1. 위치

- `/Users/ghostjin/kuji/docs/02_data.md:736-737` `kuji_home_acked` / `kuji_active_tab` 행.

### 4.1.2. 본문 인용

02_data 3.1.2 line 737:
> `kuji_active_tab` | string | **M4 영속 결정 보류 → M4.1 영속 채택**. 활성 탭 (`STATE_TAB_VALUES` 1.4.B). 부팅 시 미존재면 `STATE_TAB_DEFAULT = "home"` 부여 (M4.1 갱신).

### 4.1.3. 결함 의미

plan 3.6.1 = "PROGRESS 11.4.2 박제 = `02_data GLOBAL_KEYS 표 kuji_active_tab 행 추가`. M4.1에서 GLOBAL_KEYS 객체에 activeTab 신설했으나 02_data 3.1.2 표 본문이 stale 가능." 그러나 실제 검증 결과 = stale 아님. 표 본문 정합. 단계 2 design에서 plan 3.6.1 결정 = "stale 미발견 → T9 변경 0건"이라는 결정 박제가 누락. 본 사이클 단계 4에서 T9를 "검증 후 변경 0건 결정 박제"로 정정 가능.

## 4.2. P2-2 spec 4.2 본문 "마지막 라인업 main view 자동 진입은 폐기" 표현 미세 stale

### 4.2.1. 위치

- `/Users/ghostjin/kuji/docs/01_spec.md:94`

### 4.2.2. 본문 인용

> **이후 진입 (M4.1 / M4.2 갱신)**: 면책 모달 미노출 (`state.meta.disclaimerSeen === true`) → **홈 탭 자동 활성** (M4까지 = "마지막 라인업 main view 자동 진입" 폐기).

### 4.2.3. 결함 의미

`main view` 표현은 M4까지의 view 모델 산물. M4.1에서 view 모델 폐기 (5.13.B.2.1). 본 사이클 plan 비목표는 아니지만 정리 라운드 의미와 정합 + 미세 본문 정정. 단계 4 흡수 또는 차기 사이클 백로그.

[의견] 본 사이클이 정리 라운드라 흡수 추천. 1라인 정정.

## 4.3. P2-3 tier-grid.js 폐기 결정 spec/arch 박제 누락

### 4.3.1. 위치

- spec / arch / 02_data 모두 tier-grid.js 폐기 결정 박제 0건.
- styles/main.css:1632 주석에 "tier-grid는 dead 모듈" 박제만 잔존.

### 4.3.2. 검증 결과

- `grep "from.*tier-grid\|import.*tier-grid"` src/ tests/ = **0건** (dead 확정).
- styles/main.css `.tier-grid-section` / `.tier-grid-section-header` / `.tier-grid-rows` 셀렉터 = tier-grid.js만 사용 + product-gallery.js는 별도 셀렉터 (확인 필요).

### 4.3.3. 결함 의미

plan 6.1.1 자비스 추천 = "폐기" + 6.1.2 단계 2 검증 의무 박제. 단계 2 design에서 폐기 결정을 spec/arch에 박제하지 않음. 02_data 3.1 본문 line 935 + 4.15에 "tier-grid.js M3.3 신설" 박제만 잔존. 단계 4 impl_plan T4 본문에 "폐기 결정 + 02_data 4.15 본문 stale 정정" 흡수 의무.

# 5. 통과 항목

## 5.1. spec 5.13.E.3 hero-carousel / minor-row 비고 시점 표기 정정

| 항목 | 통과 여부 |
|---|---|
| "코드 변경 의무" → "적용 완료" 정정 (line 524-525) | 통과 |
| 매직 문자열 `"Last One"` → `LAST_ONE_TIER_NAME` 본문 박제 | 통과 (단, 상수 정의 위치 박제는 P1-2) |

## 5.2. arch 5.20 게이트 line 854 home_flow_m41 → home_flow 정정

`/Users/ghostjin/kuji/docs/03_architecture.md:854`:
> 단위 테스트 (storage_v7 / home_flow / tab_routing) 통과. **M4.2 정정 (M4.1 P1-2 흡수)**: home_flow_m41 → home_flow (M4 자산 흡수, 이름 보존) 정정.

통과.

## 5.3. M4.1 04_impl_plan home_flow_m41 잔존 0건

`/Users/ghostjin/kuji/docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md` grep 결과 = `home_flow_m41` 0건. 4건 모두 `home_flow`로 정정 적용됨 (line 37 / 291 / 315 / 318).

## 5.4. spec 5.13.B.3.1 / 5.13.B.3.2 면책 trigger 정정

5.13.B.3.1 = `state.meta.disclaimerSeen === false` 첫 방문자 분기 박제 (line 311).
5.13.B.3.2 = `state.meta.disclaimerSeen === true` 재방문자 분기 박제 (line 312).
trigger 키 통일 정합. 통과.

## 5.5. spec 5.13.B.3.3 home_acked 의미 박제 = trigger와 분리 명시

line 313:
> M4까지 = "마지막 라인업 자동 진입 플래그" → M4.1 = "면책 동의 표시 전용". 진입 흐름과 분리.

통과. trigger와 의미를 명확히 분리.

## 5.6. arch 코드 측 disclaimerSeen 분기 정합

`/Users/ghostjin/kuji/src/render/main.js:584` = `if (!state.meta.disclaimerSeen)` → showDisclaimerSheet. spec 정정과 정합. main.js의 boot 시 면책 분기 = state.meta.disclaimerSeen 단독 의존. 코드/spec trigger 일치 (homeAcked 부수 갱신 박제는 P1-1로 별도).

## 5.7. dead alias 4 + dead test 3 호출처 0건 검증

- `src/render/lobby.js` / `core/lobby-preview.js` / `render/history-tab.js` / `render/dc-tab.js` 외부 import = main.js는 `products-history-tab.js`를 직접 import (line 35). dead alias 호출 0건.
- `tests/suites/state_view.test.js` / `lobby_flow.test.js` / `storage_v5.test.js` runner.js 미import.

폐기 결정 안전.

# 6. 단계 4 진입 가능 여부

## 6.1. 결정

**진입 가능**. P0 0건.

## 6.2. 단계 4 흡수 의무 (P1 2건)

- **P1-1 spec 4.1/5.13.B.3.1 본문 재정정**: "homeAcked = true 동시 갱신" 박제 제거 (자비스 추천 a안). 코드 변경 0 정합.
- **P1-2 02_data.md LAST_ONE_TIER_NAME 상수 정의 박제**: 02_data 1.x에 행 신설 + numbers.js 호출처 import 일괄.

## 6.3. 단계 4 흡수 권고 (P2 3건)

- **P2-1 plan 3.6.1 (T9) 결정 박제**: 02_data 3.1.2 stale 미발견 → 변경 0건 결정 박제.
- **P2-2 spec 4.2 "main view 자동 진입" 표현 정정**: 1라인.
- **P2-3 tier-grid.js 폐기 결정 02_data 4.15 stale 정정**.

## 6.4. 차기 사이클 백로그 (택1)

P2 3건은 본 사이클 단계 4 흡수가 자연스러우나 부피 증가 우려 시 M4.3 또는 M5 흡수 가능. 사용자 결정 영역.

# 7. 검토 메모

7.1. 본 사이클 정리 라운드 = "코드 동작 변경 0" 원칙 정합 검증을 가장 중요시함. P1-1 결함은 본 원칙과 충돌하는 spec 박제 = 단계 4 진입 전 정정 의무.

7.2. M4.1 P1-1 흡수 = 자비스 추천 (a) spec 본문 갱신 채택은 정합. 그러나 spec 본문이 코드 미구현 동작을 박제하면 새로운 P1 부정합. 단계 2 design에서 코드 측 dismiss_disclaimer dispatch 본문 검증이 누락된 결과.

7.3. LAST_ONE_TIER_NAME 상수화는 본 사이클 핵심 작업 중 하나 (T2~T3 + plan 7.1). 상수 정의 위치 박제 누락은 단계 4에서 흡수 가능하나 단계 2 design 영역 책임이라 P1로 분류.

7.4. tier-grid.js 폐기 결정은 plan 6.1 결정 영역 = 단계 2 design 의무. spec/arch에 박제 누락은 P2 (코드 grep으로 dead 확정 + plan 6.1.1 자비스 추천 박제 잔존 → 단계 4 impl_plan T4에서 결정 박제 가능).

7.5. PROGRESS 12.1.6 박제 ("M4.1-tidy → M4.2-tidy 개명")는 plan 1절 표 11번 행에 잔존. 본 검토 영역 외.
