# M4.1 home-entry-fix - 04 impl_plan

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.1-home-entry-fix |
| 작성일 | 2026-05-10 |
| 단계 | 4 impl_plan |
| 상태 | **사용자 자율 통과** ("정석대로 진행" 신호 답습) |
| 선행 단계 | 단계 3 design_review round 2 통과 (P0 0건 / 신규 결함 0건) |
| 추정 | 1.0일 (T1~T12 분할) |

# 1. 단계 4 결정 (단계 1 plan 결정 영역 답습)

| # | 결정 | 채택 |
|---|---|---|
| 1.1 | STATE_VIEW 폐기 vs 호환 alias | **폐기 (4.3.A)**. 호환 alias 미생성. v7 마이그레이션에서 영속 키 제거. |
| 1.2 | STATE_TAB_DEFAULT 변경 | **STATE_TAB_DRAW → STATE_TAB_HOME** (4탭 환원, 부팅 default = 홈). |
| 1.3 | dispatch.open_home + set_active_tab(tab=HOME) 호출처 단일화 | **호출처에서 `dispatch({type: 'open_home'})` 단일 사용 권고**. dispatch 양쪽 잔존(arch 3.20.M4.1). |
| 1.4 | kuji_active_tab 영속 채택 | **채택**. M4 미영속 → M4.1 영속. spec 4.3 / 02_data 3.1.2 정합. |
| 1.5 | 헤더 IP 라벨 클릭 핸들러 폐기 방식 | **이벤트 리스너 + 꺾쇠 아이콘 + 클릭 affordance 시각 모두 폐기**. 라벨 = `<span>` 표시 전용. |
| 1.6 | 설정 탭 "홈으로" 버튼 dispatch | **`dispatch({type: 'open_home'})` 잔존**. 의미 = activeTab = home (M4.1 의미 갱신). |
| 1.7 | M4 dead alias (lobby.js / lobby-preview.js / history-tab.js / dc-tab.js) 처리 | **M4.2-tidy 백로그 잔존** (PROGRESS 11.4). M4.1 본 사이클은 dead 추가 정리 영향 0. |
| 1.8 | M4의 home view 탭바 미노출 CSS / 마크업 처리 | **모든 탭에서 탭바 노출**. main.js 라우팅이 view 분기 없이 탭바 항상 렌더. |

# 2. T 분할 (의존성 순서)

| # | 태스크 | 변경 파일 | 의존 |
|---|---|---|---|
| T1 | numbers.js 상수 갱신 | `src/data/numbers.js` | 없음 (선행) |
| T2 | storage.js 마이그레이션 + GLOBAL_KEYS | `src/core/storage.js` | T1 |
| T3 | main.js 라우팅 단일화 + 부팅 흐름 | `src/render/main.js` | T1, T2 |
| T4 | bottom-tabs.js 4탭 환원 | `src/render/bottom-tabs.js` | T1 |
| T5 | home.js isCurrent 분기 갱신 | `src/render/home.js` | T1 |
| T6 | header.js 클릭 affordance 폐기 | `src/render/header.js` | T1 |
| T7 | settings-tab.js "홈으로" 버튼 의미 갱신 | `src/render/settings-tab.js` | T1 |
| T8 | storage_v7.test.js 신설 | `tests/suites/storage_v7.test.js` | T2 |
| T9 | home_flow.test.js 신설 | `tests/suites/home_flow.test.js` | T2, T3 |
| T10 | tab_routing.test.js 신설 | `tests/suites/tab_routing.test.js` | T1, T3 |
| T11 | runner.js 신규 suite 등재 | `tests/runner.js` | T8, T9, T10 |
| T12 | PROGRESS M4.1 절 신설 | `PROGRESS.md` | T1~T11 |

# 3. T1 numbers.js 상수 갱신

## 3.1. 변경 사항

3.1.1. **STATE_VIEW_* 4종 폐기 (export 제거)**:
- `STATE_VIEW_HOME` / `STATE_VIEW_MAIN` / `STATE_VIEW_VALUES` / `STATE_VIEW_DEFAULT` 모두 export 제거.
- 호환 alias 미생성 (단계 4 결정 1.1).

3.1.2. **STATE_TAB_HOME 신설 + 4탭 환원**:
```js
export const STATE_TAB_HOME = "home";
export const STATE_TAB_DRAW = "draw";
export const STATE_TAB_PRODUCTS_HISTORY = "products_history";
export const STATE_TAB_SETTINGS = "settings";
export const STATE_TAB_VALUES = [
  STATE_TAB_HOME,
  STATE_TAB_DRAW,
  STATE_TAB_PRODUCTS_HISTORY,
  STATE_TAB_SETTINGS,
];
export const STATE_TAB_DEFAULT = STATE_TAB_HOME;
```

3.1.3. **SCHEMA_VERSION 6 → 7**.

3.1.4. **DISPATCH_TYPE_* 잔존**: open_home / enter_lineup / set_active_tab 식별자 변경 0. 의미만 코드 측에서 갱신(T2/T3에서).

3.1.5. **TAB_ICON_IDS 갱신**: home 탭 아이콘 ID 신설. 4탭 매핑.

## 3.2. 검증식

- `grep "STATE_VIEW" src/` → 0건.
- `grep "STATE_TAB_HOME\|STATE_TAB_DRAW\|STATE_TAB_PRODUCTS_HISTORY\|STATE_TAB_SETTINGS\|STATE_TAB_VALUES\|STATE_TAB_DEFAULT" src/data/numbers.js` → 6건 정의.
- `SCHEMA_VERSION === 7`.

# 4. T2 storage.js 마이그레이션 + GLOBAL_KEYS

## 4.1. 변경 사항

4.1.1. **migrateV6ToV7 신설** (02_data 3.2.8 알고리즘):
```js
function migrateV6ToV7() {
  const schemaVersion = readSchemaVersion();
  if (schemaVersion >= 7) return;
  // (a) kuji_view 안전 제거
  localStorage.removeItem("kuji_view");
  // (b) kuji_home_acked 키/값 보존 (의미만 변경)
  // (c) kuji_active_tab 영속 값 보존 (4탭 valid superset)
  // (d) schemaVersion bump
  const meta = readMeta();
  meta.schemaVersion = 7;
  writeMeta(meta);
  localStorage.setItem(STORAGE_KEY_SCHEMA_VERSION, "7");
}
```

4.1.2. **chain v3→v7**: loadState 진입 시 schemaVersion 비교 → migrateV2ToV3 → migrateV3ToV4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7 순차 호출.

4.1.3. **GLOBAL_KEYS.activeTab 영속 정합**:
```js
// loadGlobalSettings 반환 객체에 activeTab 추가 (M4.1 영속 채택)
function loadGlobalSettings() {
  return {
    seed: readSeed(),
    settingsSkipPick: readSkipPick(),
    meta: readMeta(),
    currentLineupId: readCurrentLineupId(),
    homeAcked: readHomeAcked(),
    activeTab: readActiveTab(),  // M4.1 신설
    schemaVersion: readSchemaVersion(),
  };
}

function readActiveTab() {
  const raw = localStorage.getItem(GLOBAL_KEYS.activeTab);
  if (raw === null || !STATE_TAB_VALUES.includes(raw)) return STATE_TAB_DEFAULT;
  return raw;
}

// saveGlobalSettings(partial)에 activeTab 분기 추가
function saveGlobalSettings(partial) {
  // ...
  if ("activeTab" in partial) {
    if (!STATE_TAB_VALUES.includes(partial.activeTab)) throw new Error(...);
    localStorage.setItem(GLOBAL_KEYS.activeTab, partial.activeTab);
  }
}
```

4.1.4. **GLOBAL_KEYS 객체 갱신**:
```js
const GLOBAL_KEYS = {
  seed: "kuji_seed",
  settingsSkipPick: "kuji_settings_skip_pick",
  meta: "kuji_meta",
  currentLineupId: "kuji_current_lineup_id",
  homeAcked: "kuji_home_acked",  // M4 잔존
  activeTab: "kuji_active_tab",  // M4.1 신설
  schemaVersion: "kuji_schema_version",
};
```

## 4.2. 검증식

- `grep "kuji_view" src/core/storage.js` → 1건 (`removeItem`만).
- `grep "kuji_active_tab" src/core/storage.js` → GLOBAL_KEYS + read/save 함수 정합.
- migrateV6ToV7 멱등 (재호출 시 변경 0).

# 5. T3 main.js 라우팅 단일화 + 부팅 흐름

## 5.1. 변경 사항

5.1.1. **state 객체에서 view 키 폐기** (arch 3.11 정합).
5.1.2. **부팅 흐름 6단계** (arch 4.M3.1 정합):
```js
async function mount(rootEl) {
  // 1. 마이그레이션 chain (v3→v7)
  runMigrations();
  // 2. globalSettings = loadGlobalSettings();
  const globalSettings = loadGlobalSettings();
  ensureCurrentLineupId(globalSettings);
  // 3. lineup = getLineupById(globalSettings.currentLineupId)
  const lineup = getLineupById(globalSettings.currentLineupId);
  // 4. state = bootstrapState(loadStateForLineup(lineup.id), globalSettings, lineup)
  state = bootstrapState(...);
  state.activeTab = globalSettings.activeTab;
  state.homeAcked = globalSettings.homeAcked;
  // 5. 면책 모달 분기 (M4.1 갱신)
  if (state.homeAcked === false) {
    showDisclaimerModal({
      onDismiss: () => {
        state.homeAcked = true;
        saveGlobalSettings({ homeAcked: true });
        rerender();
      },
    });
  } else {
    rerender();
  }
}
```

5.1.3. **rerender 라우팅 분기** (4탭):
```js
function rerender() {
  rootEl.innerHTML = "";
  rootEl.appendChild(renderHeader(state, dispatch));  // 모든 탭 공통
  let body;
  switch (state.activeTab) {
    case STATE_TAB_HOME: body = renderHome(state, dispatch); break;
    case STATE_TAB_DRAW: body = renderDrawTab(state, dispatch); break;
    case STATE_TAB_PRODUCTS_HISTORY: body = renderProductsHistoryTab(state, dispatch); break;
    case STATE_TAB_SETTINGS: body = renderSettingsTab(state, dispatch); break;
    default: body = renderHome(state, dispatch);
  }
  rootEl.appendChild(body);
  rootEl.appendChild(renderBottomTabs(state, dispatch));  // 모든 탭 공통
}
```

5.1.4. **dispatch 분기 갱신** (arch 3.19 / 3.20 / 3.20.M4.1 정합):
- `open_home`: state.activeTab = STATE_TAB_HOME + saveGlobal({activeTab: HOME}) + rerender. activeTab === HOME 시 no-op.
- `enter_lineup`: 분기 A(동일 lineupId) / 분기 B(전환). 모두 state.activeTab = STATE_TAB_DRAW + state.homeAcked = true.
- `set_active_tab`: tab 검증 + state.activeTab = tab + saveGlobal + rerender.

5.1.5. **B-α 새로고침 복원 분기**: activeTab === STATE_TAB_DRAW 시에만 적용 (arch 3.11 정합).

## 5.2. 검증식

- `grep "state\.view" src/render/main.js` → 0건.
- `grep "STATE_VIEW" src/render/main.js` → 0건.
- 4 case 분기 모두 grep 통과.

# 6. T4 bottom-tabs.js 4탭 환원

## 6.1. 변경 사항

6.1.1. **탭 4종 렌더**:
```js
const TABS = [
  { id: STATE_TAB_HOME, labelKo: "홈", iconId: TAB_ICON_IDS.home },
  { id: STATE_TAB_DRAW, labelKo: "추첨", iconId: TAB_ICON_IDS.draw },
  { id: STATE_TAB_PRODUCTS_HISTORY, labelKo: "갤러리·기록", iconId: TAB_ICON_IDS.products_history },
  { id: STATE_TAB_SETTINGS, labelKo: "설정", iconId: TAB_ICON_IDS.settings },
];
```

6.1.2. 각 탭 클릭 → `dispatch({type: 'set_active_tab', tab: tab.id})`.
6.1.3. 활성 탭 시각: `state.activeTab === tab.id`로 active class 부여.
6.1.4. 모든 탭에서 노출 (M4의 home view 미노출 정책 폐기).

## 6.2. 검증식

- 4 탭 렌더 시각 확인.
- 탭 클릭 시 activeTab 갱신 정합.

# 7. T5 home.js isCurrent 분기 갱신

## 7.1. 변경 사항

7.1.1. **isCurrent 분기**:
```js
// M4까지: state.homeAcked === true && lineup.id === state.currentLineupId
// M4.1: lineup.id === state.currentLineupId 단독
const isCurrent = lineup.id === state.currentLineupId;
```

7.1.2. **renderHome 헤더 표기 폐기**: M4의 "Kuji 시뮬레이터" 타이틀 + sub 라벨은 폐기. 라인업 카드 그리드만 본문(arch 3.21 갱신 정합). 헤더는 main.js가 공통 렌더.

## 7.2. 검증식

- `grep "homeAcked" src/render/home.js` → 0건 (분기 폐기).
- 첫 방문자 (currentLineupId default) 시 활성 카드 = drawonball 라인업 카드 정합.

# 8. T6 header.js 클릭 affordance 폐기

## 8.1. 변경 사항

8.1.1. **이벤트 리스너 폐기**: 헤더 IP 라벨 `<span>` 또는 `<button>` 클릭 핸들러 제거.
8.1.2. **꺾쇠 아이콘 / "홈" 텍스트 폐기**: M4의 시각 affordance 모두 제거.
8.1.3. 헤더 = `<header>` + 라인업 IP 라벨 `<span>` 표시 전용.

## 8.2. 검증식

- `grep "open_home\|dispatch" src/render/header.js` → 0건.
- `grep "addEventListener\|onclick" src/render/header.js` → 0건 (또는 라벨 외 영역).

# 9. T7 settings-tab.js "홈으로" 버튼 의미 갱신

## 9.1. 변경 사항

9.1.1. "홈으로" 버튼 클릭 → `dispatch({type: 'open_home'})` (의미 = activeTab = HOME, M4.1 갱신).
9.1.2. 라벨 변경 0 ("홈으로" 잔존).

## 9.2. 검증식

- `grep "open_home" src/render/settings-tab.js` → 1건 (버튼 핸들러).

# 10. T8 storage_v7.test.js 신설

## 10.1. 케이스

10.1.1. 빈 storage (첫 방문) → migrateV6ToV7 호출 후 schemaVersion=7 + homeAcked=false + activeTab="home".
10.1.2. v6 fixture (homeAcked=true + activeTab="draw" 영속) → schemaVersion=7 + 값 모두 보존.
10.1.3. v6 fixture (kuji_view="main" 영속 - 비표준) → schemaVersion=7 + kuji_view 키 제거.
10.1.4. v5 fixture → chain v5→v6→v7 적용 후 homeAcked=true (lobby_acked → home_acked 개명 + 의미 변경).
10.1.5. v3 fixture → chain v3→v4→v5→v6→v7 적용 후 schemaVersion=7.
10.1.6. v7 fixture → 멱등 (변경 0).

# 11. T9 home_flow.test.js 신설

## 11.1. 케이스

11.1.1. 첫 방문 (homeAcked=false) → 면책 모달 노출. dismiss 시 homeAcked=true + activeTab=HOME.
11.1.2. 재방문 (homeAcked=true) → 면책 미노출 + activeTab=HOME 자동 (M4까지 = activeTab=DRAW 폐기).
11.1.3. 라인업 카드 클릭 (분기 A 동일) → activeTab=DRAW + currentLineupId 보존.
11.1.4. 라인업 카드 클릭 (분기 B 전환) → activeTab=DRAW + currentLineupId 갱신 + 메모리 only state 폐기.
11.1.5. 본편 탭에서 dispatch.open_home → activeTab=HOME.
11.1.6. dispatch.set_active_tab(tab=HOME) → dispatch.open_home과 의미 동등 (단계 4 결정 1.3).

# 12. T10 tab_routing.test.js 신설

## 12.1. 케이스

12.1.1. STATE_TAB_VALUES === [HOME, DRAW, PRODUCTS_HISTORY, SETTINGS] (4탭).
12.1.2. STATE_TAB_DEFAULT === STATE_TAB_HOME.
12.1.3. dispatch.set_active_tab(invalid) → throw 또는 default fallback (arch 3.20.M4.1 정합).
12.1.4. STATE_VIEW_* 4종 import 시도 → undefined (export 폐기 정합).

# 13. T11 runner.js 신규 suite 등재

## 13.1. 변경 사항

13.1.1. 신규 등재: `storage_v7` / `home_flow` / `tab_routing`.
13.1.2. 기존 등재 처리:
- `storage_v6.test.js` 잔존 (v5→v6 chain 보존).
- `home_flow.test.js` (M4 시점) 잔존 또는 `home_flow`로 이전. 본 사이클은 추가 폐기 0 (M4.2-tidy 백로그).
- `state_view.test.js` 잔존 시 폐기 (4.3.A 채택). M4.2-tidy 후보.
- `lobby_flow.test.js` 잔존 (M4 dead alias 폐기 = M4.2-tidy 백로그).

## 13.2. 검증식

- `tests/test.html` 브라우저 실행 → 모든 suite pass (Node ESM 시뮬도 확인).
- pass count 본 사이클 신설 3 suite + 기존 잔존 정합.

# 14. T12 PROGRESS M4.1 절 신설

## 14.1. 변경 사항

14.1.1. PROGRESS.md 12절 신설 (M4.1-home-entry-fix). M4 11절 답습.
14.1.2. 12.1 사이클 메타 / 12.2 단계별 산출물 / 12.3 단계 6/7/8 산출물 (단계 6/7/8에서 누적 갱신) / 12.4 차기 사이클 후보 / 12.5 학습.

# 15. 호출처 grep 매트릭스

호출처 grep 의무 항목 (단계 5 완료 후 단계 6 게이트 5.20 정합):

| 패턴 | 잔존 허용 위치 | 잔존 0건 의무 위치 |
|---|---|---|
| `STATE_VIEW_HOME\|STATE_VIEW_MAIN\|STATE_VIEW_VALUES\|STATE_VIEW_DEFAULT` | docs (변경이력) | src/, tests/ |
| `state\.view` | docs | src/, tests/ |
| `STATE_VIEW_LOBBY` | docs (M3.1 변경이력) | src/, tests/ |
| `kuji_view` | src/core/storage.js (removeItem 1건) | 그 외 src/, tests/ |
| `STATE_TAB_HOME` | src/data/numbers.js (정의) + 호출처 | docs 박제 1건 이상 |
| `lobbyAcked` | docs (M3.1 변경이력) | src/, tests/ (homeAcked로 통일) |
| `headerLabel.addEventListener\|headerLabel.onclick` | - | src/render/header.js (잔존 0건 - 4.1.A 채택) |

# 16. 단계 5 implement 진입 신호

본 plan 자율 통과 ("정석대로 진행" 답습). T1~T12 순차 진입. 각 T 완료 시 단위 검증식 통과 의무. 단계 6 impl_review subagent 격리 검증 의무 (5.20 게이트 + 본 plan 15절 grep 매트릭스).

# 17. 단계 4 학습

17.1. **단계 1 결정 영역(4.1.A/4.2.A/4.3.A)이 단계 4 결정으로 답습됨**: "STATE_VIEW 폐기 vs alias / STATE_TAB_DEFAULT 변경 / dispatch 단일화" 등이 단계 4의 1~8 결정으로 자연 흡수. M4 답습 패턴.

17.2. **호출처 grep 매트릭스 의무**: M3.5 학습 11.5.1 / M4 학습 11.5.3 답습. 본 plan 15절에 잔존 허용 위치 / 잔존 0건 의무 위치 매트릭스 박제.

17.3. **dead alias 폐기 분리**: M4 dead alias 4 파일 + M4.1 잠재 dead (state_view.test.js 등)는 M4.2-tidy 백로그 흡수. 본 사이클은 라우팅 단일화 + 진입 정책 보정 단일 책임.
