# M4.1 home-entry-fix - 06 impl_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.1-home-entry-fix |
| 단계 | 6 impl_review |
| 검증자 | 격리 subagent (general-purpose) |
| round | 1 |
| 검토 일자 | 2026-05-10 |
| 검토 산출물 | 단계 5 implement (T1~T12) 결과 = src/data/numbers.js / src/data/storage.js / src/render/main.js / src/render/bottom-tabs.js / src/render/home.js / src/render/header.js / src/render/settings-tab.js / tests/suites/storage_v7.test.js / tests/suites/home_flow.test.js / tests/suites/tab_routing.test.js / tests/runner.js / PROGRESS.md 12절 |
| 결과 | **통과** (P0 0건) |

# 1. 결과 요약

| # | 분류 | 건수 |
|---|---|---|
| P0 | 블로킹 | 0 |
| P1 | 보강 권고 | 2 |
| P2 | 선택 | 3 |

P0 0건 → **단계 7 QA 진입 가능**.

# 2. P0 결함

**0건.** arch 5.20 게이트 핵심 항목 (state.view 잔존 0 / 4탭 환원 / dispatch 의미 갱신 / 헤더 클릭 affordance 폐기 / storage v7 마이그레이션 / 단위 테스트 신설) 모두 정합.

# 3. P1 결함 (보강 권고)

## 3.1. P1-1 - 면책 모달 trigger 키 SSOT 충돌 (spec vs 코드)

### 3.1.1. 근거 (사실 인용)

`docs/01_spec.md` 4.1 (line 93):
```
4.1. **첫 진입 (M3.1 신설 / M4 / M4.1 갱신)**: 면책 안내 dismiss → `homeAcked = true` → **홈 탭 자동 활성** (= activeTab = home, 5.13.B). ...
```

`docs/01_spec.md` 5.13.B.3.1 (line 311):
```
5.13.B.3.1. **첫 방문자** (`kuji_home_acked === false`): 면책 모달 dismiss → `home_acked = true` → **홈 탭 자동 활성** (= activeTab = home).
```

vs `src/render/main.js` line 584~588:
```js
if (!state.meta.disclaimerSeen) {
  showDisclaimerSheet({
    onDismiss: () => dispatch({ type: "dismiss_disclaimer" }),
  });
}
```

vs `src/render/main.js` line 529~534 (`dismiss_disclaimer` 분기):
```js
case "dismiss_disclaimer": {
  state.meta = { ...state.meta, disclaimerSeen: true };
  persist();
  rerender();
  break;
}
```

면책 모달 trigger 키가 spec = `homeAcked` / 코드 = `state.meta.disclaimerSeen` 상이. dismiss 후 갱신 키도 spec = `homeAcked = true` / 코드 = `meta.disclaimerSeen = true` 상이. M3 시점 본문에서 disclaimerSeen이 도입되었으나 spec 4.1 / 5.13.B.3.1 본문이 M4.1 design 시점에 stale.

### 3.1.2. 영향

spec과 코드 SSOT 충돌. CLAUDE.md 4.5 "docs와 코드가 충돌하면 docs가 진실"에 따라 코드를 docs에 맞춰야 함이 원칙이지만, M4.1 design_review round 1/2에서 이 결함이 누락(검증 통과 명세) → 코드는 disclaimerSeen 잔존으로 구현됨. 검증 항목 7.3 "homeAcked === false → 모달, 또는 잔존 분기"가 잔존 분기를 허용하므로 단계 6 게이트는 통과.

도메인 정합 = M4.1 결정 4.2.A "home_acked = 면책 동의 표시 전용"의 의도와 disclaimerSeen 분리 잔존이 사실상 정합 (homeAcked는 면책과 분리, meta.disclaimerSeen이 면책 trigger). spec 본문의 표기만 stale.

### 3.1.3. 정정 권고

**옵션 A (권고)**: spec 4.1 / 5.13.B.3.1 본문 정정 = "면책 모달 trigger = `state.meta.disclaimerSeen === false`. dismiss 시 `meta.disclaimerSeen = true` 갱신. `home_acked` 키는 면책과 무관 (M4.1 = 면책 동의 표시는 disclaimerSeen이 1차, home_acked는 M3.1까지의 호환 잔존)" 또는 두 키의 역할 명시 박제.

**옵션 B**: 코드를 docs에 맞춰 면책 trigger를 `state.homeAcked === false`로 변경 + `meta.disclaimerSeen` 키 폐기. M2 시점 disclaimer 모달 동작 회귀 위험 + storage v8 마이그레이션 필요. 단계 7 QA 결함이 아닌 본 사이클 단계 5 재진입.

[의견] 자비스 추천 = **옵션 A**. 사유:
- 코드는 M2 시점부터 disclaimerSeen 분리가 안정 (회귀 위험 0).
- M4.1 결정 4.2.A "home_acked = 면책 동의 표시"는 의미 박제이지 키 통합 의무가 아님 (분리 잔존 정합).
- spec stale 정정만으로 SSOT 정합 회복.

**트레이드오프**: spec 정정 = 본 사이클 단계 7 QA 또는 M4.2-tidy 백로그 흡수 가능. 본 사이클은 코드 기준 통과 (단계 6 게이트 5.20 통과 의무는 면책 trigger 키를 명시하지 않음).

## 3.2. P1-2 - arch 5.20 게이트 단위 테스트 파일명 stale (`home_flow_m41` vs `home_flow`)

### 3.2.1. 근거 (사실 인용)

`docs/03_architecture.md` 5.20 line 854:
```
- 단위 테스트 (storage_v7 / home_flow_m41 / tab_routing) 통과.
```

vs 실제 파일명:
- `tests/suites/home_flow.test.js` (M4 자산 흡수 + M4.1 갱신, 이름 보존)
- `tests/suites/home_flow_m41.test.js` 부재 (impl_plan T9 = 신설 박제 vs PROGRESS 12.2.5 T9 = "home_flow.test.js 갱신")

`docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md` T9 (line 37):
```
| T9 | home_flow_m41.test.js 신설 | `tests/suites/home_flow_m41.test.js` | T2, T3 |
```

vs `tests/runner.js` line 24:
```js
import "./suites/home_flow.test.js";  // M4 (구 lobby_flow) / M4.1 갱신 (view 모델 폐기 + 4탭 환원 자산 흡수)
```

### 3.2.2. 영향

arch / impl_plan 본문 SSOT vs 실제 코드 충돌. arch 5.20 게이트 텍스트 검증식 (`tests/suites/home_flow_m41.test.js` 잔존)을 엄격 적용 시 단계 6 게이트 fail. 단, 검증 항목 8.2 "home_flow.test.js 갱신 (STATE_VIEW_* 잔존 0건 + STATE_TAB_VALUES 4탭 + dispatch 상수)"의 의도는 이름 보존 갱신을 명시하므로 본 게이트는 통과 (실제 검증식 의도 = 진입 흐름 단위 테스트 신설 / 갱신 + 자산 흡수).

[의견] M3.1 lobby_flow.test.js → M4 home_flow.test.js → M4.1 갱신 패턴 답습. 이름 보존이 변경 이력 추적 정합. arch 5.20 / impl_plan T9 본문이 stale.

### 3.2.3. 정정 권고

**옵션 A (권고)**: arch 5.20 line 854 본문 정정 = `home_flow_m41` → `home_flow` (M4 자산 흡수 + M4.1 갱신, 이름 보존). impl_plan T9 본문도 정정 가능 (단계 8 흡수).

**트레이드오프**: 정정 분량 미세. 단점 = 본 사이클 단계 8 흡수 시 arch 본체 갱신 부피 추가.

# 4. P2 결함 (선택)

## 4.1. P2-1 - storage_v7.test.js 케이스 수 SSOT 충돌 (`impl_plan 6 case / PROGRESS 8 case / 실제 7 case`)

### 4.1.1. 근거 (사실 인용)

`docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md` 10.1 (line 282~289): 6 case 명시 (10.1.1~10.1.6).

`PROGRESS.md` 12.2.5 T8 (line 652):
```
- T8 storage_v7.test.js 신설 (8 케이스: 빈 / v6 fixture / kuji_view 비표준 / v7 멱등 / 의미 변경 / chain v3→v7 / chain v5→v7).
```

실제 `tests/suites/storage_v7.test.js` test 함수 = 7개 (suite "migrateV6ToV7" 5 + suite "chain v3→v7" 2 = 7).

### 4.1.2. 영향

P2 (가독성). impl_plan 6 / PROGRESS 8 / 실제 7 모두 자기-충돌. 기능 커버 (빈 storage / v6 fixture 보존 / kuji_view 제거 / v7 멱등 / 의미 변경 박제 / chain v3 / chain v5)는 모두 정합. 검증 항목 8.1 "8 케이스 모두 정의?" 위반은 P2 표면.

### 4.1.3. 정정 권고

**옵션 A (권고)**: PROGRESS 12.2.5 T8 본문 "7 케이스"로 정정 + impl_plan 10.1 보강 가능 (단계 8 흡수). 기능 커버는 정합이므로 본 사이클 단계 7 QA 또는 M4.2-tidy 백로그 흡수.

**트레이드오프**: 정정 분량 미세.

## 4.2. P2-2 - impl_plan 4.2 storage.js 경로 stale (`src/core/storage.js` vs 실제 `src/data/storage.js`)

### 4.2.1. 근거 (사실 인용)

`docs/pipeline/M4.1-home-entry-fix/04_impl_plan.md` 4.2 검증식 (line 146):
```
- `grep "kuji_view" src/core/storage.js` → 1건 (`removeItem`만).
```

vs 실제 storage.js 경로 = `src/data/storage.js` (numbers.js와 동일 디렉토리).

### 4.2.2. 영향

P2 (가독성). 실제 검증식 동작 시 경로 stale로 grep 실패 또는 잘못된 결과. 수동 검증 시 검증자가 정확한 경로(`src/data/`)로 보정 의무.

### 4.2.3. 정정 권고

impl_plan 4.2 line 146 / 147 본문 정정 = `src/core/storage.js` → `src/data/storage.js`. 단계 8 흡수.

**트레이드오프**: 정정 분량 미세.

## 4.3. P2-3 - storage.js의 lobbyAcked 호환 alias 잔존 (saveState line 485 / loadGlobalSettings line 353 등)

### 4.3.1. 근거 (사실 인용)

`src/data/storage.js` line 485:
```js
if ("lobbyAcked" in partial) globalPartial.lobbyAcked = partial.lobbyAcked;  // M3.1 호환 alias (M4.2-tidy 폐기 후보)
```

line 382~385:
```js
// M3.1까지 호환 alias (lobbyAcked → homeAcked redirect, M4.2-tidy에서 폐기)
if ("lobbyAcked" in partial && partial.lobbyAcked !== undefined) {
  setRaw(GLOBAL_KEYS.homeAcked, String(Boolean(partial.lobbyAcked)));
}
```

impl_plan 15절 grep 매트릭스 6번 항목:
```
| `lobbyAcked` | docs (M3.1 변경이력) | src/, tests/ (homeAcked로 통일) |
```

src/, tests/ 잔존 0건 의무. 본 사이클에서 lobbyAcked는 마이그레이션 알고리즘에 필수(`migrateV4ToV5`/`migrateV5ToV6`의 LEGACY_GLOBAL_KEYS_M3_1.lobbyAcked / saveState 호환 alias). 이는 M4.2-tidy 백로그(PROGRESS 12.4.1) 정합.

### 4.3.2. 영향

P2 (검증식 자기-충돌). impl_plan 15절 grep 매트릭스를 엄격 적용 시 src/data/storage.js 잔존이 게이트 위반이지만, 마이그레이션 chain이 v4→v5→v6에 의존하므로 lobbyAcked 알고리즘 잔존이 정합. 단계 6 검증 게이트의 "잔존 0건 의무 위치" 표기가 마이그레이션 영역을 예외로 박제하지 않은 결손.

### 4.3.3. 정정 권고

impl_plan 15절 grep 매트릭스에 "잔존 허용 위치" 컬럼에 "src/data/storage.js (마이그레이션 알고리즘 LEGACY_GLOBAL_KEYS_M3_1.lobbyAcked + saveState 호환 alias)" 명시 추가. 본 사이클 단계 8 흡수 또는 M4.2-tidy 백로그 흡수 (lobbyAcked 호환 alias 폐기 = saveState 시그니처 정리).

**트레이드오프**: 본 사이클 분량 미세. M4.2-tidy 흡수 시 storage 영속 v8 마이그레이션 동반 가능.

# 5. 통과 항목

## 5.1. STATE_VIEW_* 폐기 정합 (검증 항목 1)

- 5.1.1. `grep -rn "STATE_VIEW" src/` → 1건 = `src/data/numbers.js` line 24 폐기 박제 주석만 (검증 항목 1.1 잔존 0건 의무 통과).
- 5.1.2. `grep -rn "state\.view\b" src/` → 2건 = `src/render/main.js` line 162 / 558 폐기 박제 주석만 (검증 항목 1.2 잔존 0건 의무 통과).
- 5.1.3. `src/data/numbers.js`에서 STATE_VIEW_HOME / STATE_VIEW_MAIN / STATE_VIEW_VALUES / STATE_VIEW_DEFAULT 4종 export 모두 폐기 (검증 항목 1.3 정합).
- 5.1.4. `tests/runner.js` line 26에서 state_view.test.js import 폐기 박제 (검증 항목 1.4 정합). 파일 자체는 잔존 (M4.2-tidy 백로그).

## 5.2. STATE_TAB 4탭 환원 정합 (검증 항목 2)

- 5.2.1. `src/data/numbers.js` line 27~32: STATE_TAB_HOME = "home" 신설 / STATE_TAB_VALUES = [HOME, DRAW, PRODUCTS_HISTORY, SETTINGS] 4탭 / STATE_TAB_DEFAULT = STATE_TAB_HOME 정합 (검증 항목 2.1).
- 5.2.2. `src/render/bottom-tabs.js` line 14~19: 4탭 (홈 / 추첨 / 갤러리·기록 / 설정) 렌더 정합 (검증 항목 2.2).
- 5.2.3. `src/render/main.js` line 166~177: rerender에서 STATE_TAB_HOME → renderHome / DRAW → renderDrawTab / PRODUCTS_HISTORY → renderProductsHistoryTab / SETTINGS → renderSettingsTab + default fallback = renderHome 4탭 분기 모두 명시 (검증 항목 2.3).

## 5.3. dispatch 의미 갱신 정합 (검증 항목 3)

- 5.3.1. `src/render/main.js` line 409~416 (DISPATCH_TYPE_OPEN_HOME): state.activeTab === HOME no-op + activeTab = HOME 강제 + saveState({activeTab: HOME}) + rerender. view 키 변경 0건 (검증 항목 3.1 정합).
- 5.3.2. `src/render/main.js` line 426~433 (enter_lineup 분기 A): 동일 라인업 = activeTab = DRAW + homeAcked = true + saveState 정합 (검증 항목 3.2).
- 5.3.3. `src/render/main.js` line 434~444 (enter_lineup 분기 B): 다른 라인업 = persist 현재 라인업 + currentLineupId 갱신 + homeAcked = true + saveState + bootstrapState(loadState) → 메모리 only state 자동 폐기 + activeTab = DRAW 강제 + persist + rerender 정합 (검증 항목 3.3).
- 5.3.4. `src/render/main.js` line 184~192 (DISPATCH_TYPE_SET_ACTIVE_TAB): STATE_TAB_VALUES 검증 + no-op 가드 + activeTab 갱신 + saveState({activeTab}) + rerender 정합 (검증 항목 3.4).

## 5.4. storage v7 마이그레이션 정합 (검증 항목 4)

- 5.4.1. `src/data/storage.js` line 288~300 `migrateV6ToV7` export 정합 + 멱등 게이트 (`schemaVersion ≥ 7 → return`) + kuji_view 안전 제거 (LEGACY_VIEW_KEY_M4 변수 경유) + home_acked 키/값 보존 명시 + active_tab 영속 보존 명시 + schemaVersion bump 정합 (검증 항목 4.1).
- 5.4.2. `src/data/storage.js` line 432~442 `loadState` chain 호출 = migrateV3ToV4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7 순차 정합 (v3 진입은 line 411 v2→v3 호출이 선행) (검증 항목 4.2).
- 5.4.3. `src/data/storage.js` line 358~363 `loadGlobalSettings` activeTab 역직렬화 + STATE_TAB_VALUES 검증 + STATE_TAB_DEFAULT fallback 정합 (검증 항목 4.3).
- 5.4.4. `src/data/storage.js` line 387~392 `saveGlobalSettings` activeTab 직렬화 + STATE_TAB_VALUES 검증 + invalid throw (`new Error("saveGlobalSettings: invalid activeTab value: ...")`) 정합 (검증 항목 4.4).
- 5.4.5. `src/data/storage.js` line 486~487 `saveState` 함수에 homeAcked / activeTab 분기 정합 (검증 항목 4.5).

## 5.5. 헤더 클릭 affordance 폐기 정합 (검증 항목 5)

- 5.5.1. `src/render/header.js` line 18~21: `<button>` → `<span>` 변경 정합 (검증 항목 5.1).
- 5.5.2. `grep "addEventListener\|onclick" src/render/header.js` → 0건 (검증 항목 5.2 정합).
- 5.5.3. `grep "쿠지 홈으로\|aria-label" src/render/header.js` → 0건 (검증 항목 5.3 정합).
- 5.5.4. `grep "DISPATCH_TYPE_OPEN_HOME" src/render/header.js` → 0건. import 잔존 0건 (검증 항목 5.4 정합).

## 5.6. home.js isCurrent 분기 갱신 정합 (검증 항목 6)

- 5.6.1. `src/render/home.js` line 23: `isCurrent = lineup.id === state.currentLineupId` 단독. homeAcked 분기 폐기 정합 (검증 항목 6.1).
- 5.6.2. `renderHome` (line 14~29): 헤더 마크업 부재 ("Kuji 시뮬레이터" 타이틀 + sub 라벨 폐기). main.js가 모든 탭 공통 헤더 렌더 (line 163) 정합 (검증 항목 6.2 / 6.3).

## 5.7. 부팅 흐름 정합 (검증 항목 7)

- 5.7.1. `src/render/main.js` line 538~562 `bootstrapState`에서 state 객체에 view 키 부재 정합 (검증 항목 7.1).
- 5.7.2. `bootstrapState` line 542: `STATE_TAB_VALUES.includes(loaded.activeTab) ? loaded.activeTab : STATE_TAB_DEFAULT` 영속 복원 + valid 검증 + fallback 정합 (검증 항목 7.2).
- 5.7.3. mount() line 584~588: `state.meta.disclaimerSeen` 분기 잔존 (P1-1 표면). 검증 항목 7.3 "homeAcked === false → 모달, 또는 잔존 분기"의 잔존 분기 정합.

## 5.8. 단위 테스트 정합 (검증 항목 8)

- 5.8.1. `tests/suites/storage_v7.test.js`: 7 케이스 (impl_plan 6 / PROGRESS 8 / 실제 7 SSOT 충돌 = P2-1). 기능 커버 = 빈 storage / v6 fixture 보존 / kuji_view 제거 / v7 멱등 / 의미 변경 박제 / chain v3 / chain v5 정합 (검증 항목 8.1 부분 통과).
- 5.8.2. `tests/suites/home_flow.test.js` 갱신: 10 케이스. STATE_TAB_VALUES 4탭 검증 + STATE_TAB_DEFAULT = HOME + DISPATCH_TYPE 상수 + 첫 방문자 / 재방문자 시나리오 + homeAcked 의미 분리 + dispatch 의미 검증 정합 (검증 항목 8.2).
- 5.8.3. `tests/suites/tab_routing.test.js` 신설: 13 케이스. STATE_VIEW_* 4종 export 폐기 검증 (undefined) + 4탭 enum + dispatch 상수 + STATE_TAB_DEFAULT = HOME + invalid_tab 검증 정합 (검증 항목 8.3).
- 5.8.4. `tests/runner.js`: storage_v7 / tab_routing 등재 (line 28~29) + state_view 폐기 박제 (line 26) + lobby_flow 폐기 박제 (line 20) 정합 (검증 항목 8.4).

## 5.9. M4.2-tidy 백로그 박제 정합 (검증 항목 9)

- 5.9.1. PROGRESS 12.4.1 (line 673~678): M4.2-tidy 정리 라운드 + 누적 항목 (M4 dead 4 / M4.1 dead 3 / 02_data 보강 / M3 series P2 / lobbyHeroAssetPath 개명) 박제 정합 (검증 항목 9.1).
- 5.9.2. PROGRESS 12.4.1 line 675: state_view.test.js / lobby_flow.test.js / storage_v5.test.js 파일 삭제 의무 박제 정합 (검증 항목 9.2).

# 6. 단계 7 QA 진입 가능 여부

**단계 7 QA 진입 가능 (P0 0건).**

| 항목 | round 1 |
|---|---|
| P0 결함 | **0건** |
| P1 결함 | 2건 (P1-1 면책 trigger 키 SSOT / P1-2 arch 5.20 게이트 파일명 stale) |
| P2 결함 | 3건 (P2-1 케이스 수 SSOT / P2-2 impl_plan storage.js 경로 stale / P2-3 lobbyAcked 호환 alias 잔존) |
| 신규 결함 | - |

P1 2건은 단계 7 QA 또는 단계 8 improve 흡수 가능 (블로킹 X). P2 3건은 단계 8 improve 또는 M4.2-tidy 백로그 흡수.

## 6.1. round 1 자기-진단

본 검증 round에서 단계 5 implement 결과가 arch 5.20 게이트 + impl_plan 15절 grep 매트릭스 핵심 항목 (state.view 잔존 0 / 4탭 환원 / dispatch 의미 갱신 / 헤더 클릭 affordance 폐기 / storage v7 마이그레이션 / 단위 테스트 신설) 모두 통과. P1/P2 결함은 spec 본문 stale (P1-1 면책 trigger), arch 5.20 / impl_plan 본문 stale (P1-2 / P2-2), SSOT 표기 미세 충돌 (P2-1), 마이그레이션 알고리즘 lobbyAcked 잔존이 grep 매트릭스 명시 외 영역 (P2-3) 등 본 사이클 핵심 정책에 영향 0인 가독성/박제 결손.

[의견] M4까지의 구조 변경 사이클(M3.1 / M4)에서 답습된 패턴 = "spec 본문 stale → 단계 3 design_review에서 누락 → 단계 6에서 발견" + "마이그레이션 알고리즘의 호환 alias 잔존이 grep 매트릭스 예외 영역" 두 가지가 본 사이클에서도 동일 표면. 단계 8 학습 후보.

## 6.2. round 2 진입 여부

P0 0건 + 신규 결함 0건. **round 2 불필요. 단계 7 QA 진입 가능.**

P1-1 / P1-2는 단계 7 QA에서 라이브 검수 항목으로 흡수 또는 단계 8 improve에서 spec / arch / impl_plan 본문 정정 + M4.2-tidy 백로그 등재. P2 3건은 단계 8 improve 흡수.
