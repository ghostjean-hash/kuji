# 03. 아키텍처

본 문서는 Kuji 시뮬레이터의 폴더 / 모듈 구조 / 의존성 규칙 SSOT. M1-base-system + M2-ux-redesign + M2.1-pick-from-bin 스프린트 단계 4 impl_plan 산출물.

# 1. 폴더 구조

```
kuji/
├── CLAUDE.md            # 작업 컨텍스트 / 절대 규칙
├── PROGRESS.md          # 진행 로그
├── README.md            # 사람용 안내
├── index.html           # 진입 HTML
├── docs/                # SSOT 문서
│   ├── 01_spec.md
│   ├── 02_data.md
│   ├── 03_architecture.md   ← 본 문서
│   ├── 04_conventions.md
│   ├── 05_pipeline.md
│   └── pipeline/<sprint>/   # 스프린트별 단계 메타
├── research/            # 도메인 리서치
├── src/
│   ├── main.js          # 진입점, 모든 모듈 wire-up
│   ├── core/            # 순수 로직 (DOM 금지)
│   │   ├── random.js          # Mulberry32 PRNG
│   │   ├── hash.js            # FNV-1a 해시 (박스 ID)
│   │   ├── box.js             # 박스 초기화 / 셔플 / 잔여
│   │   ├── draw.js            # 추첨 (등급 + 종 결정)
│   │   ├── last_one.js        # Last One 트리거 판정
│   │   ├── double_chance.js   # DC 응모권 + 베르누이 추첨
│   │   ├── history.js         # 추첨 이력 관리
│   │   └── buy.js             # M2: 구매 매수 검증 + 인벤토리 조작
│   ├── render/          # DOM 렌더
│   │   ├── main.js               # 4탭 라우팅 + wire-up
│   │   ├── bottom-tabs.js        # 하단 탭 바 (M2: SVG 아이콘)
│   │   ├── header.js             # 헤더 (타이틀 / 가격 / 추정 배지)
│   │   ├── draw-tab.js           # 추첨 탭 (M2: 구매 / 뜯기 sub-screen)
│   │   ├── history-tab.js        # 전적 탭
│   │   ├── dc-tab.js             # Double Chance 탭
│   │   ├── settings-tab.js       # 설정 탭
│   │   ├── modal.js              # 모달 / 시트 공통
│   │   ├── result-modal.js       # 추첨 결과 모달 (M2: POP 모션)
│   │   ├── last-one-modal.js     # Last One 합산 모달 (M2: POP 모션)
│   │   ├── dc-result-modal.js    # DC 결과 모달
│   │   ├── confirm-modal.js      # 박스 리셋 / 시드 변경 확인
│   │   ├── disclaimer-sheet.js   # 첫 진입 면책
│   │   ├── storage-fallback-sheet.js  # localStorage 비활성 안내
│   │   ├── estimated-badge.js    # 추정 배지 + 출처 모달
│   │   ├── format.js             # 포맷 헬퍼 (formatPercent)
│   │   ├── icon.js               # M2: 탭 SVG 아이콘 wrapper
│   │   ├── buy-panel.js          # M2: 구매 패널 (Quick + 자유 입력)
│   │   ├── peel-panel.js         # M2: 미개봉 복권 인벤토리 패널
│   │   ├── peel-card.js          # M2: 단일 복권 카드 + 페이지플립 애니
│   │   ├── pick-panel.js         # M2.1: 통(bin) 슬롯 격자 + 슬롯 클릭 → splice(pickIndex)
│   │   ├── pick-slot.js          # M2.1: 단일 슬롯 (잔여 / 뽑힘 / Last One) + 호버 / 클릭
│   │   │                            # (pick-hint-toast.js 폐기 - 2026-05-08, PROGRESS 4.14.1)
│   │   ├── product-gallery.js    # M2: 상품 갤러리 컨테이너
│   │   ├── product-item.js       # M2: 등급 1개 항목 (이미지 + 카운트 + 게이지)
│   │   ├── product-image.js      # M2: SVG 이미지 wrapper + 딤드 + 오버레이
│   │   ├── tier-gauge.js         # M2: 잔여 게이지 바
│   │   ├── tier-accordion.js     # M2: 종별 펼침
│   │   └── last-one-indicator.js # M2: Last One 시각 강조 (펄스 / 발광)
│   ├── input/           # 키보드 / 터치
│   │   ├── keyboard.js  # Tab / Enter / Esc 핸들러
│   │   └── drag.js      # M2: 좌측 가장자리 드래그 핸들러
│   ├── assets/          # M2: 정적 자산
│   │   ├── icons/       # 탭 4종 SVG (draw / history / dc / settings)
│   │   └── products/    # 상품 SVG 11종 메인 + (P2) 종별 다수
│   └── data/
│       ├── numbers.js   # 02_data 1장 → 상수 (단일 SSOT 변환)
│       ├── colors.js    # 02_data 2장 → 상수
│       ├── storage.js   # localStorage 입출력 + 메모리 fallback
│       └── assets.js    # M2: SVG 자산 ID 매핑 + getter (02_data 1.7, 1.10)
├── styles/
│   ├── tokens.css       # UI 디자인 토큰
│   └── main.css         # 레이아웃
└── tests/
    ├── test.html        # 테스트 진입
    ├── runner.js        # entrypoint (suite 등록 + done() 호출)
    ├── core.js          # 러너 코어 (suite/test/assert)
    └── suites/          # core/ + storage 테스트
        ├── random.test.js
        ├── hash.test.js
        ├── box.test.js
        ├── draw.test.js
        ├── draw_pick.test.js     # M2.1: drawOne(boxState, drawRng, lineup, pickIndex) 분기 테스트
        ├── last_one.test.js
        ├── double_chance.test.js
        ├── history.test.js
        ├── storage.test.js
        ├── storage_v3.test.js    # M2.1: v2→v3 마이그레이션 (skip_pick / history backfill. pickHintSeen은 deprecated 호환만)
        └── build_consumed_grid_set.test.js # M2.1 4.15.5: drawnSet 단일 진실원 검증
```

# 2. 의존성 규칙

2.1. **`src/core/` → DOM/Canvas/window/document/localStorage import 0개**. 순수 함수만. 입출력은 인자 / 반환값으로만.
2.2. **`src/render/` → `core/`, `data/`, `input/` import 가능**. 역방향 금지.
2.3. **`src/data/numbers.js` / `colors.js`** → 외부 의존 없음. 어디서든 import 가능 (상수 SSOT).
2.4. **`src/data/storage.js`** → `localStorage` 직접 접근. `core/`는 호출 금지. `render/`만 호출. `core/`는 storage 결과를 명시 인자로 받는다.
2.5. **`src/input/`** → `core/` 직접 호출 금지. `render/main.js`가 입력을 받아 `core/` 호출.
2.6. **모든 import는 상대경로 + `.js` 확장자 명시** (`CLAUDE.md` 5.2).

## 2.7. 의존성 그래프

```
data/numbers.js  ────────────┐
data/colors.js   ────────────┤
                             ▼
core/random.js  ──┐    render/header.js
core/hash.js    ──┤    render/draw-tab.js
core/box.js     ──┼──► render/main.js ◄── input/keyboard.js
core/draw.js    ──┤    render/...
core/last_one.js──┤
core/double_chance.js┤
core/history.js ──┘    render/main.js ──► data/storage.js
                                          (영속 / fallback)
src/main.js ──► render/main.js (wire-up)
```

# 3. 모듈 책임 / 인터페이스

## 3.1. core/random.js

```js
// Mulberry32 PRNG (02_data 1.2)
export function createRng(seed: number): () => number  // [0, 1)
export function nextInt(rng, max: number): number      // [0, max)
```

## 3.2. core/hash.js

```js
// FNV-1a 32비트 해시 (lotto 패턴)
export function fnv1a(str: string): number
export function boxId(seed: number, boxRound: number): string  // 16진수 문자열
```

## 3.3. core/box.js

```js
// 박스 초기화 / 셔플 / 잔여
export function initBox(seed, boxRound, lineup): BoxState
//   BoxState = { id, deck: TierLabel[], drawnCount, totalSize }
//   deck은 79매(BOX_SIZE - Last One)의 셔플된 등급 라벨 배열

export function remaining(boxState): number
export function isLastDraw(boxState): boolean  // remaining === 1
```

## 3.4. core/draw.js (M2.1 시그니처 갱신)

```js
// 추첨 (등급 + 종 인덱스). M2.1: pickIndex 옵셔널.
export function drawOne(boxState, rng, lineup, pickIndex): DrawResult
//   pickIndex: 정수 [0, deck.length - 1] | undefined. 미전달 시 0 (= 현행 head pop = splice(0)).
//   DrawResult = { tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne, pickIndex, lastOnePrize? }
// boxState 변경 (deck splice(pickIndex), drawnCount++).
// 마지막 1매(deck.length === 1) 시점이면 isLastOne === true 동시 반환 (drawnCount += 2).
//
// 호출 정책:
// - skip ON (01_spec 5.3.7): pickIndex 미전달. splice(0) = head pop = 현행 M2 동등.
// - skip OFF + 통 선택 (01_spec 5.14.4.2): pickIndex = 슬롯 인덱스 (격자 인덱스 = 셔플 배열 인덱스).
// - 호출처: render/main.js dispatch.draw / dispatch.pick. core/ 외부에서만 호출.
```

## 3.5. core/last_one.js

```js
// Last One 트리거 판정 + 보너스 상품 정보
export function lastOnePrize(lineup): { tier: 'Last One', name, sizeLabel }
```

## 3.6. core/double_chance.js

```js
// DC 응모권 + 베르누이 추첨
export function addTicket(tickets, ticket): Ticket[]
//   ticket = { boxId, drawIndex, time }

export function drawDc(tickets, rng, winnersTotal, poolSize): DcResult
//   DcResult = { isWin: bool, prize?: { name } }
//   p = winnersTotal / poolSize. 사용자 N매에 대해 1 - (1 - p)^N 시행.
```

## 3.7. core/history.js (M2.1 B-α 갱신 / **M3 lineup 인자 추가 - CB-1**)

```js
// 추첨 이력 누적 / 통계. M2.1 B-α: history는 reveal 시점에만 append.
export function appendHistory(history, entry): HistoryEntry[]
//   entry = { time, boxId, drawIndex, tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne,
//             pickIndex (number | null), gridIndex (number | null), revealed (deprecated, 항상 true) }
//   B-α: 슬롯 선택 / 확인 시점에는 history 미커밋. reveal 시점에만 append (시각 분리, 5.14.0.3).
//     pickIndex: drawOne 호출 시점의 deck 잔여 인덱스 (참조 / 디버그용).
//     gridIndex: 사용자가 클릭한 격자 슬롯 위치. skip ON 시 null. skip OFF B-α 시 0 ~ BOX_SIZE - 2.
//     revealed: deprecated. B-α: history 항목은 항상 reveal 후이므로 항상 true. 구 데이터 호환 유지.
export function tierCounts(history): Record<TierLabel, number>
//   B-α: history가 reveal 후에만 append되므로 등급 카운트 = revealed 항목 카운트와 동등.
//   안전 장치: revealed === false 항목은 카운트 제외 (구 데이터 또는 비동기 race 방지).
//   CB-1 (M3): lineup 인자 추가 예정. 본 사이클 미반영.
// findUnrevealed / revealHistory (M2.1 1차)는 B-α 폐기. 새로고침 복원은 ticket.lockedResult 기반 (3.10).
```

### 3.7.M3. M3 시그니처 갱신

```js
// CB-1 흡수 (M2.1 단계 8 백로그 6.3.2): lineup 인자 추가.
// 기존 tierCounts(history) → tierCounts(history, lineup).
// lineup.tiers를 순회하며 각 등급별 history 카운트 산출.
// 라인업별 등급 수 가변성 (드래곤볼 10 vs 원피스 9) 흡수.
export function tierCounts(history, lineup): Record<string, number>

// boxId 산출에 lineup.id 포함 (M3 단계 3 P0 2.1 정합):
// 호출처: core/box.initBox(seed, round, lineup) 내부.
//   const id = fnv1a(`${lineup.id}|${seed}|${round}`).toString(16).padStart(BOX_ID_HEX_LENGTH, '0');
// → 동일 시드 + 동일 회차 + 다른 라인업 = 다른 box.id.
```

## 3.8. data/numbers.js

`docs/02_data.md` 1장의 모든 키를 `export const`로 변환. 자동 검증: numbers.js의 export 키 집합 = 02_data 1장 정의 키 집합 (단계 6 impl_review 검증식).

## 3.9. data/colors.js

`docs/02_data.md` 2장 색상을 `export const`로 변환.

## 3.10. data/storage.js (M2.1 v3 마이그레이션 + B-α in-place backfill / **M3 v4 다중 라인업 격리**)

```js
export function loadState(): {
  seed, boxRound, boxState, history, dcTickets, dcResults, meta,
  unopenedTickets,        // M2 + B-α: 항목 = { id, purchasedAt, lockedResult }
  settingsSkipPick,       // M2.1: kuji_settings_skip_pick (boolean)
}
//   meta = { disclaimerSeen, schemaVersion, pickHintSeen (M2.1, boolean. 2026-05-08 deprecated - 호환 키만 유지) }
//   unopenedTickets[i].lockedResult = null (raw) | DrawResult (B-α 확인 후, reveal 전).
export function saveState(partial): void
export function clearAll(): void
export function isStorageAvailable(): boolean

// M2.1 마이그레이션 (loadState 내부 호출, 02_data 3.2.3)
export function migrateV2ToV3(state): state
//   (a) settingsSkipPick = BUY_SKIP_PICK_DEFAULT (= false) 초기화.
//   (b) meta.pickHintSeen = false 초기화. **2026-05-08 deprecated** - 키는 유지하나 읽지 않음 (toast 폐기).
//   (c) history 항목 backfill: { revealed: true, pickIndex: null, gridIndex: null } 누락 필드 추가.
//   (d) unopenedTickets 항목 backfill: { lockedResult: null } 누락 필드 추가 (B-α).
//   (e) meta.schemaVersion = 3 갱신.
//   (f) 박스 / DC 응모권 / DC 결과 보존.

// B-α 재정정 in-place backfill (02_data 3.2.4, schemaVersion bump 없음, 멱등)
export function migrateV3InPlace(state): state
//   기존 v3 사용자 (M2.1 1차 코드로 마이그레이션 완료) → B-α 재정정 후 코드 호환:
//   (a) unopenedTickets[i].lockedResult === undefined → null 부여.
//   (b) 다른 필드는 변경 없음. schemaVersion 그대로 3.
//   (c) 멱등: 이미 lockedResult 정의된 ticket에는 미적용.
//   loadState에서 v2→v3 마이그레이션 후 또는 v3 즉시 호출.
```

### 3.10.M3. M3 v4 다중 라인업 격리

```js
// 02_data 3.2.5 마이그레이션 v3 → v4.
// v3 (단일 라인업) 키 6종을 v4 격리 키로 이전. 멱등 보장.
// 전역 키 (kuji_seed / kuji_settings_skip_pick / kuji_meta) 보존.
export function migrateV3ToV4(): void

// 라인업별 격리 키 lookup:
//   loadStateForLineup(lineupId) → { history, unopenedTickets, boxState, boxRound, dcTickets, dcResults }
//   saveStateForLineup(lineupId, partial)
// 또는 단일 loadState/saveState가 currentLineupId 의존:
//   loadState() → state (currentLineupId 자동 도출 + 라인업별 키 lookup).
// 단계 5 implement에서 결정.

// 전역 키 lookup:
//   loadGlobalSettings() → { seed, settingsSkipPick, meta, currentLineupId, schemaVersion }
//   saveGlobalSettings(partial)
```

### 3.10.M3.1. M3.1 v5 라인업 로비 (M4 v6 / **M4.1 v7 갱신**)

```js
// 02_data 3.2.6 마이그레이션 v4 → v5.
// 멱등 게이트: schemaVersion ≥ 5 || kuji_lobby_acked !== null → return.
// existingLineupId !== null → lobbyAcked = "true" / else "false".
// schemaVersion = 5.
export function migrateV4ToV5(): void

// **M4 v6 신설 (02_data 3.2.7)**:
//   migrateV5ToV6: kuji_lobby_acked → kuji_home_acked 키 개명 + 4탭 → 3탭 매핑 + schemaVersion = 6.
export function migrateV5ToV6(): void

// **M4.1 v7 신설 (02_data 3.2.8)**:
//   migrateV6ToV7: kuji_view 키 안전 제거 + home_acked 키/값 보존 (의미 변경 = 면책 동의 표시) + activeTab 4탭 환원 valid 보존 + schemaVersion = 7.
export function migrateV6ToV7(): void

// 전역 키 lookup 갱신 (M4 / M4.1 갱신):
//   loadGlobalSettings() → { seed, settingsSkipPick, meta, currentLineupId, homeAcked, activeTab, schemaVersion }
//     **M4 갱신**: lobbyAcked → homeAcked (키명).
//     **M4.1 갱신**: homeAcked 의미 = 면책 동의 표시 전용 (진입 흐름 분리). activeTab 영속 채택 (M4 미영속 → M4.1 영속).
//     homeAcked / activeTab는 string → boolean / STATE_TAB_VALUES 역직렬화 후 반환.
//   saveGlobalSettings(partial): partial.homeAcked가 boolean이면 String() 직렬화 후 setItem. partial.activeTab은 STATE_TAB_VALUES 검증 후 setItem.

// **saveState 시그니처 객체 인자 명시** (P2-3 흡수 / **M4.1 갱신**):
//   saveState({ currentLineupId?, homeAcked?, activeTab?, ...라인업별 키들 })
//   currentLineupId / homeAcked / activeTab는 saveGlobalSettings 경유, 라인업별 키는 saveStateForLineup 경유.
```

## 3.11. render/main.js

진입점. **4탭 라우팅 (M4.1 갱신)** + 모듈 wire-up. state 객체 보유.

```js
state = {
  // **M4.1 view 키 폐기**: M4까지의 STATE_VIEW_HOME / STATE_VIEW_MAIN 모델은 폐기. activeTab 단일 라우팅.
  activeTab,          // **M4.1 갱신**: STATE_TAB_HOME | STATE_TAB_DRAW | STATE_TAB_PRODUCTS_HISTORY | STATE_TAB_SETTINGS. 4탭 (M4의 3탭에서 home 추가, 02_data 1.4.B). 영속 (kuji_active_tab).
  currentLineupId,    // M3 신설. 활성 라인업 ID. 영속.
  homeAcked,          // **M3.1 신설 / M4 / M4.1 의미 변경**: boolean. **M4.1**: 면책 동의 표시 전용 (false = 첫 방문, true = 면책 dismiss 완료). 진입 흐름과 분리. 영속.
  seed,
  boxRound,
  boxState,           // core/box BoxState
  history,            // core/history HistoryEntry[]. B-α: reveal 시점에만 append.
  dcTickets,
  dcResults,
  meta,               // { disclaimerSeen, schemaVersion, pickHintSeen (deprecated 2026-05-08) }
  storageMode,        // 'persistent' | 'memory'
  unopenedTickets,    // M2 + B-α: Ticket[] = [{ id, purchasedAt, lockedResult }]
                      //   lockedResult: null = raw, DrawResult 객체 = 통 선택 확인 후 미reveal.
  selectedGridIndices,// B-α 신설: 통 격자에서 사용자가 선택한 슬롯 gridIndex 배열 (메모리 전용, 영속 X).
                      //   사용자 선택 순서 보존. "확인" 클릭 시 비워짐.
  pendingPeelResult,  // M2: DrawResult | null. reveal 진행 중 표시 데이터.
  settingsSkipPick,   // M2.1: boolean. 통 선택 단계 skip 토글 (영속).
  galleryExpanded,    // M2
}
```

state 변경 시 영속(`data/storage.saveState`) + 본문 재렌더.

**M4.1 메모리 vs 영속**:
- 메모리 전용: `selectedGridIndices`, `pendingPeelResult`, `expandedTier`, `galleryExpanded`, `lastBuyCount`, `lastDrawnTier`. **view 키 폐기 (M4.1)**.
- 영속: `seed` / `boxRound` / `boxState` / `history` / `dcTickets` / `dcResults` / `meta` / `unopenedTickets` (lockedResult 포함) / `settingsSkipPick` / `currentLineupId` (M3) / `homeAcked` (M4.1 의미 변경 = 면책 동의 표시) / `activeTab` (M4.1 영속 채택, kuji_active_tab).

**M4.1 라우팅**: render/main.js 본문 렌더 함수는 `state.activeTab` 단일 분기:
- `STATE_TAB_HOME` → `render/home.renderHome(state, dispatch)`.
- `STATE_TAB_DRAW` → 추첨 탭 컨텐츠.
- `STATE_TAB_PRODUCTS_HISTORY` → `render/products-history-tab.renderProductsHistoryTab(state, dispatch)`.
- `STATE_TAB_SETTINGS` → `render/settings-tab.renderSettingsTab(state, dispatch)`.

헤더 / 하단 탭 바는 **모든 탭에서 공통 노출** (M4의 "home view 시 미노출" 정책 폐기). 헤더 = 활성 라인업 IP 라벨 (표시 전용, 클릭 affordance 폐기 - spec 5.13.A.3.2).

**M4.1 부팅 흐름**:
1. loadState → activeTab / homeAcked / currentLineupId 복원.
2. activeTab 미존재(첫 진입) → STATE_TAB_DEFAULT = STATE_TAB_HOME.
3. homeAcked === false → 면책 모달 노출 → dismiss 시 homeAcked = true.
4. 라우팅 시작 (activeTab 분기).

**B-α 새로고침 복원**: `findUnrevealed` / `revealHistory` (M2.1 1차) 폐기. `unopenedTickets[i].lockedResult !== null` 인 항목이 존재하면 b2 분기 (페이지플립 카드 표시). 없고 raw가 있으면 b1 분기 (격자). 없으면 a (구매). 본 분기는 activeTab === STATE_TAB_DRAW 시에만 적용.

## 3.12. render/[tab].js / [modal].js

각 탭은 `function render(state, dispatch): HTMLElement` 시그니처. dispatch는 사용자 입력을 main.js가 처리하도록 위임.

## 3.13. input/keyboard.js

전역 keydown 리스너. Tab은 브라우저 기본 + 포커스 트랩, Enter는 활성 추첨 버튼 호출, Esc는 활성 모달 닫기.

## 3.14. render/pick-panel.js (M2.1 B-α 갱신)

```js
// 통(bin) 슬롯 격자 컨테이너 (B-α). 4장 6.b1 분기에서 호출. 01_spec 5.14.
export function renderPickPanel(state, dispatch): HTMLElement
//   격자 cols × rows 계산: cols = LINEUP.gridCols ?? PICK_GRID_COLS_DEFAULT.
//                          rows = Math.ceil(BOX_SIZE / cols).
//   슬롯 N개 (= BOX_SIZE) 배치:
//     - 일반 슬롯 (BOX_SIZE - 1)개: gridIndex 0 ~ BOX_SIZE - 2.
//     - Last One 슬롯 1개: gridIndex = BOX_SIZE - 1.
//
//   상태 도출 (B-α):
//     - drawnGridIndices = history filter(e => e.boxId === boxState.id && e.gridIndex !== null).map(e => e.gridIndex)
//       (reveal 완료 항목만. B-α: history는 reveal 후에만 append.)
//     - lockedGridIndices = unopenedTickets filter(t => t.lockedResult !== null && t.lockedResult.gridIndex !== null).map(t => t.lockedResult.gridIndex)
//       (확인 후 reveal 전 ticket의 격자 위치. 회색으로 표시 = 이미 통에서 빠진 자리.)
//     - drawnSet = new Set([...drawnGridIndices, ...lockedGridIndices])
//     - selectedSet = new Set(state.selectedGridIndices)
//     - **2026-05-08 (4.14.14 / M3 단계 6 P1 3.3 정합)**: Last One 슬롯은 통(bin)에 노출하지 않음 (last-one-row에서 별도 표시).
//
//   슬롯 상태 매핑 (M3: 3상태로 축소):
//     - i in drawnSet: 'normal-drawn'
//     - i in selectedSet: 'normal-selected'
//     - else: 'normal-available'
//     - i === lineup.boxSize - 1 (Last One): 통 격자 미렌더 (continue).
//
//   클릭 핸들러 (잔여 일반 슬롯 = available 또는 selected):
//     - dispatch({ type: 'toggle_pick_select', gridIndex: i })
//
//   확인 버튼 (헤더 또는 패널 하단):
//     - K = state.selectedGridIndices.length
//     - N = state.unopenedTickets.filter(t => t.lockedResult == null).length  (raw 매수)
//     - "선택 K / N" 표시. K === N 시 활성. 클릭 → dispatch({ type: 'confirm_pick' }).
//
//   자동 선택 버튼 (5.14.4.8, 확인 버튼 옆):
//     - "자동 선택 N매" 라벨. N === 0 또는 잔여 일반 슬롯 < N 시 비활성.
//     - 클릭 → dispatch({ type: 'auto_pick_select' }).
//     - main.js: state.selectedGridIndices = (잔여 일반 격자 오름차순 첫 N개).
//
//   격자 위치 → deck 잔여 인덱스 변환 (확인 시점에 main.js에서 N회 연속 변환):
//     - 매 호출마다 splice로 잔여 deck이 줄어드는 것을 반영.
//     - 정확한 알고리즘: 사용자 선택 순서 [g1, g2, ..., gN].
//       각 gi에 대해 j_i = (잔여 격자 위치 정렬 후 gi의 인덱스). drawOne(boxState, drawRng, LINEUP, j_i) 호출 후 다음 gi로.
//       잔여 격자 = 0 ~ BOX_SIZE - 2 중 drawnSet ∪ {g1...g_{i-1}} 에 없는 것.
//   (~~첫 진입 시 (state.meta.pickHintSeen === false) 안내 toast~~ - 2026-05-08 폐기, 4.14.1)
```

## 3.15. render/pick-slot.js (M2.1 B-α / **M3 단계 5 T17 - 3상태로 축소**)

```js
// 단일 슬롯. 3상태 (M3 P1 3.3 docs 정합):
// - normal-available: 잔여 미선택. 클릭 = 선택 토글.
// - normal-selected: 선택됨 (B-α 신설). 브랜드 빨강 테두리 + 체크 마크 + 펄스. 클릭 = 해제 토글.
// - normal-drawn: 이미 뽑힘 (history 또는 lockedTicket). 회색. 클릭 무시.
// (~~last-one-pending~~ / ~~last-one-drawn~~ 2상태는 4.14.14 + M3 T17 폐기 - Last One 통 비노출).
export function renderPickSlot(props): HTMLElement
//   props = { kind, gridIndex, onClick? }
//   onClick: normal-available / normal-selected에서만 호출 (선택 토글).
```

## 3.15.M3. core/pick-grid.js (**M3 신설 - M2.1 정리 3.5.1**)

```js
// M2.1 4.14.7 / 4.15.5의 buildConsumedGridSet을 render/main.js에서 core로 이전.
// CLAUDE.md 4.1 (게임 로직 / 렌더 분리) 정합.
// DOM 의존성 0건. lineup 인자로 등급 수 가변성 흡수.
export function buildConsumedGridSet(state, lineup): Set<number>
```

## 3.16. render/pick-hint-toast.js (**2026-05-08 폐기**)

~~첫 진입 안내 toast~~ 모듈은 사용자 결정으로 폐기됨 (PROGRESS 4.14.1, 메모리 룰 `feedback_lottery_red_text`). `src/render/pick-hint-toast.js` 파일 삭제 + `dispatch.pick_hint_seen` 호출처 0건. `PICK_FIRST_HINT_TEXT_KO` / `PICK_FIRST_HINT_DURATION_MS` 상수는 numbers.js에 잔존(deprecated, 다음 정리 라운드 제거 후보).

## 3.17. render/settings-tab.js (**M3 Lineup 섹션 + M3.1 로비 진입 버튼 / M4 dropdown 폐기 / M4.1 의미 갱신**)

```js
// 사용자 결정 8.3 (A) - 헤더 라벨 정보성 (M3) → M4 갱신 → M4.1 갱신.
// **M4 폐기 (5.13.A.4)**: 'Lineup' 섹션 dropdown quick-switch 폐기. 라인업 전환은 홈에서만.
// **M4.1 갱신 (5.13.A.4.5 / 5.13.B.5.2)**: settings-tab은 라인업 표시 + "홈으로" 버튼 잔존. 클릭 → dispatch({ type: DISPATCH_TYPE_OPEN_HOME }) = activeTab = STATE_TAB_HOME 강제 (view 변경 폐기, M4.1 의미 갱신).
```

## 3.18. ~~dispatch.set_current_lineup~~ (**M4 폐기** - enter_lineup 통합, 5.13.A.4.3)

```js
// M3 신설 (quick-switch 전용) → M4 폐기.
// 사유: 사용자 결정 10.3 = settings 탭 dropdown 폐기 → set_current_lineup의 호출처(dropdown)도 폐기.
// 라인업 전환은 dispatch.enter_lineup 분기 B로 단일화 (3.20 정합).
// 호출처 grep 0건 의무 (단계 6 게이트).
```

## 3.19. dispatch.open_home (**M3.1 open_lobby → M4 개명 → M4.1 의미 갱신 (activeTab 라우팅)**)

```js
// main.js dispatch 분기. spec 5.13.B.6.1 정합. M4.1: view 라우팅 폐기 → activeTab 라우팅.
// payload: { type: DISPATCH_TYPE_OPEN_HOME }
// 동작:
//   1. state.activeTab === STATE_TAB_HOME 이면 no-op.
//   2. state.activeTab = STATE_TAB_HOME.
//   3. **메모리 only state 보존** (pendingPeelResult / selectedGridIndices 그대로).
//      → 사용자가 같은 라인업 카드 클릭 (enter_lineup, 동일 lineupId)으로 복귀하면 reveal 진행 그대로.
//   4. 영속: saveGlobalSettings({ activeTab: STATE_TAB_HOME }).
//   5. rerender (홈 카드 그리드 + 4탭 바 + 헤더 모두 노출 = M4까지의 "탭바 미노출" 폐기).
```

## 3.20. dispatch.enter_lineup (**M3.1 신설 / M4 갱신 - homeAcked / M4.1 의미 갱신 (activeTab 라우팅)**)

```js
// main.js dispatch 분기. spec 5.13.B.6.2 정합. M4.1: state.view 폐기 → activeTab 갱신.
// payload: { type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: string }
// 동작:
//   분기 A: lineupId === state.currentLineupId (= 동일 라인업, 탭 전환만)
//     1. state.activeTab = STATE_TAB_DRAW (M4.1: 라인업 진입 = 추첨 탭 도메인 정합).
//     2. state.homeAcked가 false였으면 true로 갱신 + saveState({ homeAcked: true }).
//        (M4.1 의미: 면책 동의 표시. 진입 흐름 분리.)
//     3. **메모리 only state 보존**.
//     4. 영속: saveGlobalSettings({ activeTab: STATE_TAB_DRAW, homeAcked: true }).
//     5. rerender.
//
//   분기 B: lineupId !== state.currentLineupId (= 라인업 전환 + 탭 전환). M4: set_current_lineup 통합.
//     1. persistAll (현재 라인업 state 영속).
//     2. saveGlobalSettings({ currentLineupId: lineupId, homeAcked: true, activeTab: STATE_TAB_DRAW }).
//     3. lineup = getLineupById(lineupId).
//     4. state = bootstrapState(loadStateForLineup(lineupId), globalSettings, lineup).
//     5. state.homeAcked = true / state.activeTab = STATE_TAB_DRAW (M4.1: view 키 부재).
//     6. state.pendingPeelResult = null / state.selectedGridIndices = []
//        (메모리 only 폐기 = 라인업 전환 정합).
//     7. rerender.
```

## 3.20.M4.1. dispatch.set_active_tab (**M4 신설 / M4.1 4탭 정합**)

```js
// main.js dispatch 분기. spec 5.13.B.6.3 정합.
// payload: { type: DISPATCH_TYPE_SET_ACTIVE_TAB, tab: string }
// 동작:
//   1. tab 검증: STATE_TAB_VALUES (4탭) 미포함 시 throw 또는 default.
//   2. state.activeTab === tab 이면 no-op.
//   3. state.activeTab = tab.
//   4. **메모리 only state 보존**.
//   5. 영속: saveGlobalSettings({ activeTab: tab }).
//   6. rerender.
//
// **M4.1**: tab === STATE_TAB_HOME 호출 시 dispatch.open_home과 의미 동등 (단계 4 결정 = 호출처에서 단일화 권고. dispatch는 양쪽 모두 잔존).
```

## 3.21. render/home.js (**M3.1 lobby 신설 / M4 home 격상 / M4.1 = 탭 1 콘텐츠**)

```js
// 쿠지 홈 (라인업 선택 화면). spec 5.13.B 정합.
// **M4.1**: state.activeTab === STATE_TAB_HOME 인 경우 render/main.js가 호출 (M4까지의 state.view === STATE_VIEW_HOME 분기 폐기).
// DOM 의존성 OK (render 모듈).

export function renderHome(state, dispatch): HTMLElement
//   레이아웃: **라인업 카드 그리드 + 푸터** (헤더 / 하단 탭 바는 render/main.js가 모든 탭 공통 렌더 - spec 5.13.A.3.3 / 5.13.B.2.3 / arch 3.11 정합. 본 함수 시그니처 외부).
//   카드 그리드: CSS Grid. cols = HOME_GRID_COLS_MOBILE (1) ~ HOME_GRID_COLS_TABLET (2)
//                @media (min-width: HOME_TABLET_BREAKPOINT_PX) 에서 cols 2.
//   각 카드: renderHomeCard(lineup, isCurrent, dispatch).
//
export function renderHomeCard(lineup, isCurrent, dispatch): HTMLElement
//   props:
//     - lineup: 라인업 객체 (1.4.0 구조).
//     - isCurrent: boolean. **M4.1**: lineup.id === state.currentLineupId 단독 (homeAcked 분리). M4까지의 homeAcked 분기 폐기.
//                  (M4.1: homeAcked 의미 = 면책 동의 표시이므로 isCurrent와 무관.)
//
//   카드 구성 (spec 5.13.B.4.2 표, M4 풍부화):
//     1. home hero 이미지: lineup.homeHeroAssetPath.
//     2. 한국어 제목.
//     3. IP 라벨.
//     4. 메타 (M4): 발매일 + 끝일 + 가격 + 박스 매수 + 추정 배지 + 매장 (3개 이상이면 "N곳").
//     5. 메인 상품 미리보기: core/home-preview.heroPreview(lineup) 호출.
//     6. **진행 상태 (M4 신설, spec 5.13.B.4.3 산출식)**:
//        boxRound = loadStateForLineup(lineup.id).boxRound (영속).
//        drawCount = .history.length (영속).
//        dcCount = .dcTickets.length (영속).
//        untouched = boxRound <= 1 && drawCount === 0 && dcCount === 0 → "아직 시작 안 함".
//     7. CTA 버튼: "이 라인업으로 진입".
//
//   클릭 핸들러: card 또는 CTA 버튼 → dispatch({ type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: lineup.id }).
```

## 3.22. core/home-preview.js (**M3.1 lobby-preview 신설 / M4 home-preview 개명**)

```js
// 라인업 메인 상품 미리보기 도메인 로직. CLAUDE.md 4.1 정합 (게임 로직 / 렌더 분리).
// DOM 의존성 0건. lineup 인자만으로 결정론적 도출.

export function heroPreview(lineup):
//   { tier, nameKo, sizeLabel, tierClass, typeIndex } | null
//
//   알고리즘 (spec 5.13.B.4.3 정합):
//     heroTiers = lineup.tiers.filter(t => t.tierClass === TIER_CLASS_HERO && t.tier !== "Last One")
//     if heroTiers.length === 0: return null  (1.4.A.3 검증식 위반 = 부팅 실패 선조건이라 실제 런타임 도달 불가)
//     return { ...heroTiers[0], typeIndex: 0 }  // 통상 A상
//
//   정책: Last One은 hero이지만 미리보기 슬롯에서는 박스 등급 첫 hero를 라인업 대표로 채택.
//   향후 사이클에서 라인업별 "대표 등급" 메타 도입 시 본 함수가 그 메타 우선 사용으로 갱신.
```

# 4. 상태 / 데이터 흐름

4.1. **부팅**:
- `data/storage.loadState()` → state 복원 또는 초기값.
- `data/storage.isStorageAvailable()` false → 메모리 모드 + 시트 표시.
- `core/box.initBox(seed, boxRound, lineup)` (boxState가 없거나 무효한 경우).
- `render/main.js` 첫 렌더.

4.2. **추첨 1회**:
- 사용자 추첨 버튼 → `dispatch({type: 'draw'})`.
- main.js: `core/draw.drawOne(state.boxState, rng, lineup)` → DrawResult.
- main.js: `core/double_chance.addTicket(state.dcTickets, ticket)`.
- main.js: `core/history.appendHistory(state.history, entry)`.
- DrawResult.isLastOne === true → `core/last_one.lastOnePrize(lineup)` 합산.
- `data/storage.saveState({...})` 영속.
- result-modal 또는 last-one-modal 표시.
- 본문 재렌더.

4.3. **박스 리셋**:
- 사용자 설정 탭 → confirm-modal → `dispatch({type: 'reset_box'})`.
- main.js: `state.boxRound += 1`. (`01_spec` 5.7.4)
- main.js: `core/box.initBox(state.seed, state.boxRound, lineup)`.
- 영속 + 재렌더. 이력은 보존.

4.4. **시드 변경**:
- 사용자 설정 탭 시드 입력 → `dispatch({type: 'set_seed', seed})`.
- 박스 진행 중이면 confirm-modal.
- main.js: `state.seed = seed`, `state.boxRound = BOX_ROUND_INITIAL` (`01_spec` 5.7.4).
- `core/box.initBox(...)` + 영속 + 재렌더.

4.5. **DC 추첨**:
- 사용자 DC 탭 → `dispatch({type: 'draw_dc'})`.
- main.js: `core/double_chance.drawDc(state.dcTickets, rng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT)`.
- 결과 영속 + dc-result-modal.

4.6. **M2.1 B-α 통 선택 → 뜯기 흐름** (skip OFF):
- draw-tab.js 분기 (a/b1/b2/b3/c, 4장 6번 영역, 5.14.5.0 정의 정합):
  - b1 진입: `pendingPeelResult` 없음 + skip OFF + 첫 ticket의 `lockedResult === null` (= raw 존재) → `renderPickPanel(state, dispatch)` 표시.
- 사용자 슬롯 클릭 → `dispatch({type: 'toggle_pick_select', gridIndex: i})`.
  - main.js: `state.selectedGridIndices`에 i 추가 또는 제거 (메모리 토글). 영속 X. drawOne 호출 X.
- 사용자 N개 선택 완료 → 확인 버튼 클릭 → `dispatch({type: 'confirm_pick'})`.
- main.js dispatch.confirm_pick:
  - N = state.unopenedTickets.filter(t => t.lockedResult === null).length.
  - state.selectedGridIndices.length === N 검증. 미충족 시 return.
  - selectedGridIndices 순회 (사용자 선택 순서 그대로):
    - 각 gi에 대해 격자 위치 → 잔여 deck 인덱스 변환 (drawnGridIndices ∪ 이미 처리된 g_prev 제외).
    - drawIndex = state.boxState.drawnCount.
    - drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`)).
    - result = core/draw.drawOne(state.boxState, drawRng, LINEUP, j).
    - 결과를 unopenedTickets[idx]에 lockedResult로 부여 (idx = raw ticket의 i번째).
  - state.selectedGridIndices = [].
  - persist (boxState, unopenedTickets) + rerender.
- draw-tab.js 분기 b2 진입: 첫 ticket.lockedResult 보유 → renderPeelPanel.
- 사용자 페리페리 / 클릭 → `dispatch({type: 'peel'})`.
- main.js dispatch.peel:
  - 첫 ticket.lockedResult가 있으면 (B-α 흐름): result = ticket.lockedResult. drawOne 호출 X.
  - 없으면 (skip ON 흐름): drawOne(boxState, drawRng, LINEUP) 호출.
  - **history.appendHistory** (entry 생성, revealed: true) + DC ticket + 인벤토리 1매 제거. **2026-05-08 흐름 정정 (PROGRESS 4.14.8)**: history append는 reveal 시점에 무조건 수행. 이전 흐름은 주요 보상(`requiresReceive`)인 경우 receive_confirm까지 미루어 새로고침/팝업 dismiss 시 entry 손실 가능했음.
  - **`requiresReceive` UI 플래그 산출**: `!result.isLastOne && tierMeta && tierMeta.count === 1` (= A~F 주요 보상 1매 한정). 의미는 "받기 모달 노출 + peel-card 확인 버튼 활성화 게이트". history append 게이트가 아님 (4.14.8 이전 의미와 구분). 게이트 효과:
    - hero-carousel: `requiresReceive && !receivedConfirmed` 조건일 때 "받기" 버튼 노출 (해당 tier 카드).
    - peel-panel/peel-card: `requiresReceive && !receivedConfirmed` 조건일 때 "확인" 버튼 disabled.
  - persist + pendingPeelResult 설정 (`requiresReceive`, `receivedConfirmed: !requiresReceive` 포함) + reveal 모션.
- 사용자 받기 클릭 (requiresReceive 흐름) → `dispatch({type: 'receive_confirm'})`:
  - `pendingPeelResult.receivedConfirmed = true`로 마킹 (UI 게이트 해제). history는 손대지 않음 (이미 peel에서 append됨).
- 사용자 확인 → `dispatch({type: 'peel_confirm'})`:
  - 게이트: `requiresReceive && !receivedConfirmed`이면 차단.
  - 통과 시 state.pendingPeelResult = null. lastDrawnTier = null. rerender.
- 다음 ticket: 또 lockedResult 있으면 b2 유지. 인벤토리 0 도달 → 구매 씬.

4.7. **M2.1 B-α 새로고침 복원**:
- 부팅: `data/storage.loadState()` → state 복원 (unopenedTickets[i].lockedResult 영속).
- bootstrapState: state.selectedGridIndices = [] 초기화 (메모리 전용, 영속 X = 격자 표시 중 새로고침 시 사용자 선택 폐기, 7.11).
- 4장 분기 자동 도출:
  - 첫 ticket.lockedResult !== null → b2 (페이지플립 카드 표시).
  - 첫 ticket.lockedResult === null + skip OFF → b1 (격자 표시. 사용자 처음부터 다시 선택).
  - 인벤토리 0 → a (구매).

4.8. **M2.1 skip 토글**:
- 구매 패널 또는 설정 탭 토글 → `dispatch({type: 'set_skip_pick', value: bool})`.
- main.js: `state.settingsSkipPick = value`. 영속 (`kuji_settings_skip_pick`).
- 본문 재렌더. 진행 중인 reveal 영향 없음 (4장 6.b3 그대로 유지). 다음 1매부터 b1/b2 분기 적용.

4.9. ~~**M2.1 첫 진입 안내**~~ **2026-05-08 폐기 (PROGRESS 4.14.1)**. 메모리 룰 `feedback_lottery_red_text`("복권 영역 안내·힌트·경고 문구 금지") 우선 적용. pick-hint-toast.js 파일 삭제. dispatch.pick_hint_seen 호출처 0건. `state.meta.pickHintSeen` 영속 키는 호환 유지하되 읽지 않음.

## 4.M3. M3 다중 라인업 흐름

### 4.M3.1. 부팅 (M3 v4 / **M3.1 v5 갱신**)

```
mount(rootEl):
  1. 마이그레이션 점검 (chain, 02_data 3.2 정합):
     - kuji_schema_version 미존재 또는 < 7 (M4.1 갱신 - 본 사이클 chain 범위):
       - schemaVersion < 3 → migrateV2ToV3 → migrateV3ToV4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7 순차 호출.
       - schemaVersion === 3 → migrateV3InPlace + migrateV3ToV4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7.
       - schemaVersion === 4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7.
       - schemaVersion === 5 → migrateV5ToV6 → migrateV6ToV7 (M4 신설 + M4.1 신설).
       - schemaVersion === 6 → migrateV6ToV7 (**M4.1 신설, 02_data 3.2.8**).
       - **migrateV6ToV7 (M4.1 신설)**:
         - 멱등 게이트: schemaVersion ≥ 7 → return.
         - localStorage.removeItem("kuji_view") (M4.1 view 키 안전 제거).
         - kuji_home_acked 키/값 보존 (의미만 변경 = 면책 동의 표시 전용).
         - kuji_active_tab 영속 값 보존 (4탭 환원이 v6 3탭 superset, valid).
         - localStorage.setItem("kuji_schema_version", "7").
  2. globalSettings = loadGlobalSettings()
     - currentLineupId 미존재 → LINEUP_DEFAULT_ID 부여 + saveGlobalSettings.
     - **homeAcked 역직렬화 (M4 개명 / M4.1 의미 변경)**: localStorage 값 "true" === "true"로 boolean 변환. homeAcked 키 부재면 false (안전 default = 첫 방문자).
     - **activeTab 역직렬화 (M4 영속 보류 → M4.1 영속 채택)**: localStorage `kuji_active_tab` 값 → STATE_TAB_VALUES 검증 → 미포함이면 STATE_TAB_DEFAULT (= STATE_TAB_HOME). 키 부재면 STATE_TAB_HOME.
  3. lineup = getLineupById(globalSettings.currentLineupId)
     - 미발견 → console.warn + LINEUP_DEFAULT 사용 (spec 7.16.1).
  4. state = bootstrapState(loadStateForLineup(lineup.id), globalSettings, lineup)
     - state.activeTab = globalSettings.activeTab (영속 복원).
     - state.homeAcked = globalSettings.homeAcked.
  5. **면책 모달 분기 (M4.1 갱신, 진입 흐름과 분리)**:
     - state.homeAcked === false → 면책 모달 노출 → 사용자 dismiss 시 state.homeAcked = true + saveGlobalSettings({ homeAcked: true }).
     - 면책 dismiss 후 라우팅 진입.
     - **M4까지의 "lobbyAcked === true → STATE_VIEW_MAIN 자동 진입" 분기 폐기 (M4.1, 4.3.A 채택)**.
  6. rerender (activeTab 분기. STATE_TAB_HOME → renderHome / STATE_TAB_DRAW → 추첨 / STATE_TAB_PRODUCTS_HISTORY / STATE_TAB_SETTINGS).
```

### 4.M3.2. 라인업 전환 (사용자 액션)

```
사용자 settings-tab dropdown 변경 → dispatch.set_current_lineup(newLineupId)
  → main.js (3.18 정합):
    confirmModal "라인업을 전환합니다. ..."
    사용자 확인:
      persistAll(state, oldLineupId)       (현재 라인업 영속)
      saveGlobalSettings({ currentLineupId: newLineupId })
      newState = bootstrapState(loadStateForLineup(newLineupId), globalSettings, newLineup)
      state = newState                      (메모리 only state 폐기)
      rerender
  → 사용자에게 새 라인업 박스 + 인벤토리 + 이력 + DC 표시.
```

### 4.M3.3. 영속 매핑 (02_data 3.1.1 / 3.1.2 정합)

| 카테고리 | 키 | 의존 |
|---|---|---|
| 라인업별 격리 | `kuji_history_${lineup_id}` 등 6종 | currentLineupId |
| 전역 | `kuji_seed` / `kuji_settings_skip_pick` / `kuji_meta` / `kuji_current_lineup_id` / `kuji_schema_version` | 라인업 무관 |

### 4.M3.4. 마이그레이션 v3 → v4 (02_data 3.2.5 알고리즘)

`migrateV3ToV4()`:
- DETECTED_LINEUP_ID = LINEUP_DRAGONBALL_ID (M2.1 단일 라인업 가정).
- v3 키 6종 → v4 격리 키 이전 (멱등).
- 전역 키 신설 + 보존.
- schemaVersion = 4.

### 4.M3.5. 마이그레이션 v4 → v5 (M3.1 신설, 02_data 3.2.6 알고리즘)

`migrateV4ToV5()`:
- 멱등 게이트: schemaVersion ≥ 5 || kuji_lobby_acked !== null → return.
- existingLineupId = localStorage.getItem("kuji_current_lineup_id").
- lobbyAcked 추론:
  - existingLineupId !== null (기존 사용자) → "true" (로비 재노출 안 함).
  - else (첫 방문자 또는 v4 미진입 사용자) → "false" (로비 노출).
- localStorage.setItem("kuji_lobby_acked", lobbyAcked).
- localStorage.setItem("kuji_schema_version", "5").

### 4.M3.1.B. ~~로비 ↔ main view 전환 흐름~~ (**M4.1 폐기**, view 모델 폐기 정합)

**M4.1 폐기 박제**: state.view 모델 폐기 (자비스 단계 1 결정 4.3.A 채택) + open_lobby → open_home 개명(M4) → activeTab 라우팅 의미 갱신(M4.1, arch 3.19) → 본 절의 매트릭스 무의미.

**M4.1 라우팅 흐름 SSOT**:
- 부팅 흐름 = arch 4.M3.1 (M4.1 갱신, 6단계).
- dispatch 명세 = arch 3.19 (open_home) / 3.20 (enter_lineup) / 3.20.M4.1 (set_active_tab).
- 진입 경로 = spec 5.13.B.5 (하단 탭 1차 + 설정 보조 + 헤더 클릭 폐기).

**M3.1 시점 매트릭스 (변경이력 박제 - 단계 8 흡수 예정)**:

| dispatch type | M3.1 시점 의미 | M4.1 시점 의미 |
|---|---|---|
| ~~`open_lobby`~~ | 헤더 라벨 / 설정 버튼 → state.view = LOBBY | M4 = open_home 개명. M4.1 = state.activeTab = STATE_TAB_HOME. 헤더 클릭 폐기 (4.1.A) |
| `enter_lineup` (분기 A 동일) | lobby → main view 전환 | state.activeTab = STATE_TAB_DRAW (view 키 폐기) |
| `enter_lineup` (분기 B 전환) | lobby → main + 라인업 전환 | state.activeTab = STATE_TAB_DRAW + 라인업 전환 (view 키 폐기) |
| ~~`set_current_lineup`~~ | settings dropdown | M4 폐기 |

# 5. 정적 검사 / 단계 6 게이트 검증식

5.1. **매직 넘버 0개**: `src/` 전수 grep으로 숫자 리터럴 추출. `data/numbers.js` 정의 / 단순 인덱스(0, 1) / 산술 항등(매수 비교) 외 매직 값 0개.
5.2. **core/ DOM import 0개**: `src/core/*.js` 의 `import` 문 + 본문 grep `document` / `window` / `localStorage` / `Canvas` 0건.
5.3. **numbers.js 키 = 02_data 1장 키**: 자동 비교 권장 (단계 6 시 subagent 검증).
5.4. **단위 테스트 100% pass**: tests/test.html 모든 suite의 fail 0건.
5.5. **`tests/` 매직 넘버 0개 (M2 추가, M1 OP-4 반영)**: tests/suites/*.test.js 도 src/ 와 동일 매직 넘버 룰 적용.
5.6. **시그니처 grep (M2 추가, M1 OP-2 반영)**: `initBox\(`, `drawOne\(`, `lastOnePrize\(` 호출처 모두 `lineup` 인자 정합 여부 grep. **M2.1 추가**: `drawOne\(` 호출처에 `pickIndex` 인자 정합 grep (skip ON 흐름은 미전달, skip OFF 흐름은 정수 전달).
5.7. **마이그레이션 단위 테스트 (M2.1 신설)**: `tests/suites/storage_v3.test.js`. v2 fixture (skip_pick 부재 + history `revealed` / `pickIndex` / `gridIndex` 필드 부재) → `migrateV2ToV3` 호출 → backfill 결과 검증. (`meta.pickHintSeen` 검증은 2026-05-08 toast 폐기 후 호환 검증으로만 유지).
5.8. **state 매트릭스 분기 정합 (M2.1 신설, M2 PROGRESS 6.2.3 학습 흡수, B-α 갱신)**: `render/draw-tab.js` 의 6번 영역 분기가 `unopenedTickets.length` × `settingsSkipPick` × `first ticket.lockedResult` × `pendingPeelResult` × `boxState.deck.length` 매트릭스의 5분기 (a/b1/b2/b3/c) 모두 정합한지 grep + 시각 검증. (B-α 재정정: `pendingPickResult` 폐기, `ticket.lockedResult`로 통합).
5.9. **prop drilling 정합 (M2.1 신설, M2 PROGRESS 6.2.2 학습 흡수)**: 신규 모듈 (pick-panel, pick-slot) 의 prop 시그니처가 호출처에서 누락 없이 전달되는지 grep. (~~pick-hint-toast~~ 2026-05-08 폐기).

5.10. **M3 라인업 격리 grep (단계 6 신설)**: 다음 패턴 grep 통과 의무.
- `kuji_${KEY}` 형태에 lineup_id 빠진 곳 0건 (격리 6종 키): `kuji_history\\b` / `kuji_unopened_tickets\\b` / `kuji_box_state\\b` / `kuji_box_round\\b` / `kuji_dc_tickets\\b` / `kuji_dc_results\\b` 단독 등장 0건 (모두 `_${lineup_id}` 또는 변수 보간 형태).
- `LINEUP\\b` (대문자 단수 글로벌) 잔존 0건 (메타 / 변경이력 텍스트 제외).
- `BOX_SIZE\\b` 단수 글로벌 잔존 0건 (또는 단계 4 결정에 따라 호환 alias 유지 시 `LINEUP_DRAGONBALL.boxSize`로 alias 명시).
- box.id 산출에 `lineup.id` 포함 검증.

5.11. **M3 등급 수 가변성 grep (단계 6 신설)**: render 모듈이 등급 수에 의존하지 않는지 grep.
- 하드코딩 정수 `10` (드래곤볼 등급 수) 또는 `9` (원피스) 잔존 0건.
- `lineup.tiers.length` 또는 `tiers.length` 동적 처리 정합.
- A~J 하드코딩 (10개 등급 라벨) 잔존 0건. 라벨은 `lineup.tiers[i].tier`로 lookup.

5.12. **M3 currentLineupId 분기 매트릭스 (단계 6 신설)**: state.currentLineupId × 영속 키 격리 정합.
- 부팅 시 currentLineupId 부재 → LINEUP_DEFAULT_ID 부여 정합.
- 라인업 미발견 (getLineupById fallback) 정합.
- 라인업 전환 시 메모리 only state (pendingPeelResult / selectedGridIndices) 폐기 정합.

5.13. **~~M3.1 lobbyAcked + view 매트릭스~~ (M4 부분 갱신 / M4.1 폐기, view 모델 폐기 정합 - 5.20 흡수)**:
- ~~부팅 시 schemaVersion < 5 → migrateV4ToV5 호출 정합~~ (M4.1: chain v3→v7, 5.20 흡수).
- ~~state.lobbyAcked === false 시 state.view = STATE_VIEW_LOBBY 강제~~ (M4.1 폐기).
- ~~state.lobbyAcked === true 시 state.view = STATE_VIEW_MAIN default~~ (M4.1 폐기).
- ~~view === STATE_VIEW_LOBBY 시 4탭 / 헤더 / 본편 컴포넌트 미렌더 정합~~ (M4.1 폐기, 모든 탭 공통 노출).
- dispatch.open_home (M4 개명) 호출 시 state.activeTab = STATE_TAB_HOME 강제 (5.20 흡수).
- dispatch.enter_lineup 분기 A (동일 라인업) vs 분기 B (다른 라인업) 의도 정합 (M4.1: activeTab = STATE_TAB_DRAW 강제).
- localStorage `kuji_home_acked` (M4 개명 / M4.1 의미 변경 = 면책 동의 표시) 영속 형식 string ("true"/"false"). 역직렬화 정합.

5.14. **M3.1 tier_class 검증식 grep (단계 6 신설 / M3.5 갱신)**:
- 모든 라인업의 모든 tier에 tierClass 존재 (`lineup.tiers.every(t => t.tierClass)`).
- TIER_CLASS_VALUES 외 값 0건.
- **M3.5 갱신**: 라인업당 hero ≥ 1 + goods ≥ 1만 의무 (main = 0 허용). 1.4.A.3 룰 완화 정합.
- DC.tierClass === TIER_CLASS_HERO 정합.
- core/lobby-preview.heroPreview 반환 형식 정합 (Last One 제외).

5.15. **M3.1 매직 넘버 grep (단계 6 신설 / M4 부분 갱신 / M4.1 부분 폐기, 5.20 흡수)**:
- ~~"lobby" / "main" 문자열 리터럴은 STATE_VIEW_LOBBY / STATE_VIEW_MAIN 상수 경유~~ (M4.1 폐기, STATE_VIEW_* 4종 폐기. 5.20에서 잔존 0건 grep으로 통합).
- "open_home" / "enter_lineup" / "set_active_tab" 문자열 리터럴은 DISPATCH_TYPE_OPEN_HOME / DISPATCH_TYPE_ENTER_LINEUP / DISPATCH_TYPE_SET_ACTIVE_TAB 경유 (M4 개명 / M4.1 잔존).
- "hero" / "main" / "goods" 문자열 리터럴은 TIER_CLASS_HERO / TIER_CLASS_MAIN / TIER_CLASS_GOODS 경유 (M4.1 잔존).
- "kuji_home_acked" 키는 storage.js 1곳에서만 정의 + 다른 호출처는 GLOBAL_KEYS.homeAcked 경유 (M4 개명 / M4.1 의미 변경).
- "kuji_active_tab" 키 (M4.1 영속 채택) storage.js 1곳에서만 정의 + 호출처는 GLOBAL_KEYS.activeTab 경유.
- 768 / 1 / 2 (LOBBY_GRID_COLS_*, LOBBY_TABLET_BREAKPOINT_PX 또는 M4 신설 HOME_GRID_COLS_*)는 02_data 1.5 상수 경유 (M4.2-tidy 정리 라운드 후보 - 키명 lobby → home 미정정).

5.16. **M3.2 tier_class 시각 적용 검증 (단계 6 신설)**:
- hero-carousel.js / minor-row.js의 카드에 `data-tier-class` 속성 부착 정합 (lineup.tiers의 모든 tier에 대해).
- styles/main.css의 `[data-tier-class="..."]` 셀렉터 사용. CSS 변수 `var(--tier-class-{hero,main,goods}-{bg-tint,border})` 8종 + `var(--motion-hero-{pop-peak,glow-ms})` + `var(--hero-static-glow-blur-px)` 사용.
- styles/tokens.css 신규 변수 8종 + 모션 3종이 02_data 2.3 매핑 표와 1:1 정합 (CSS 변수명 ↔ JS 상수명 ↔ hex/값).
- styles/main.css 인라인 hex / rgba / 수치 0건 (M3 단계 6 P0 2.4/2.5 학습 답습).
- hero 분기 식 = `result.isLastOne || getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO` 패턴이 peel-card.js + dc-result-modal.js에 동일 정합.
- numbers.js `getTierClassForTier(lineup, tier)` 헬퍼 시그니처 정합 + 호출처 = hero-carousel / minor-row / peel-card 3종 + dc-result-modal은 사실 박제 정합 (DC.tierClass=hero, 1.4.A 검증식 정합 → DC 결과 객체에 tier 필드 부재로 헬퍼 호출 부적절).

5.17. **M3.3 tier_class 갤러리 / history 확장 검증 (단계 6 신설)**:
- core/history.tierClassCounts(history, lineup) 시그니처 정합. DOM 0건 + lineup 인자 결정론 (CLAUDE.md 4.1 / 4.3 정합).
- history 항목별 `getTierClassForTier(lineup, entry.tier)` 호출 + null/undefined 가드 정합 (라인업 미존재 tier 케이스).
- render/history-tab.js 상단 대시보드 4개 카운터 카드 (전체 / hero / main / goods).
- 모바일 2x2 (`HISTORY_DASHBOARD_COLS_MOBILE`) / 태블릿 4열 (`HISTORY_DASHBOARD_COLS_TABLET`) 반응형. CSS @media `HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX` (= 768px) 사용.
- 갤러리 펼침 시 그룹화 = hero → main → goods 정렬. Last One은 hero 마지막 자리.
- 갤러리 섹션 헤더 한국어 라벨 = `TIER_CLASS_LABEL_KO[tierClass]` 호출 (인라인 한국어 0).
- 갤러리 접힘 상태(`galleryExpanded === false`)는 그룹화 미적용 (회귀 위험 0).
- 단위 테스트 (tests/suites/tier_class_counts.test.js) 통과: 빈 history / 드래곤볼 / 원피스 / 미존재 tier 가드 / 결정론.

5.18. **M3.5 tier_class 라인업별 자율 분류 검증 (단계 6 신설 / round 2 정정)**:
- 02_data 1.4-OP.2 등급표 ↔ numbers.js TIERS_ONEPIECE 1:1 정합 (B/C/D/E/F tierClass = "hero" + A/LastOne = "hero" + G/H/I = "goods" + main 0건).
- numbers.js `_validateLineupTierClass` 함수에서 main ≥ 1 throw 코드 제거 정합.
- 02_data 1.4.A.3 룰 표현 ↔ numbers.js 검증 코드 1:1 정합 (hero ≥ 1 + goods ≥ 1만 의무).
- 원피스 라인업 부팅 시 throw 0 (validateLineup 통과).
- 드래곤볼 라인업 부팅 시 throw 0 (변경 0).
- hero=0 가상 라인업 → throw 정합 (룰 잔존).
- goods=0 가상 라인업 → throw 정합 (룰 잔존).
- **render/hero-carousel.js filter 분기 식 = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"`** (round 3 정정 - 기존 `count === 1` 폐기. round 2의 `tierClass === HERO`는 드래곤볼 회귀(6→1) 야기로 폐기). 드래곤볼: A/B/C/D/E/F (6) / 원피스: A/B/C/D/E/F (6). 양쪽 등동 노출.
- **render/minor-row.js filter 분기 식 = `t.tierClass === TIER_CLASS_GOODS && t.tier !== "Last One"`** (round 1 P0-1 정정 - 기존 `count >= 2` 폐기). 드래곤볼: G/H/I/J / 원피스: G/H/I.
- 단위 테스트 (tests/suites/tier_class_lookup.test.js): 원피스 B/C/D/E/F lookup → "hero" 갱신.
- 단위 테스트 (tests/suites/tier_class_counts.test.js): 원피스 history 시나리오 hero 카운트에 B~F 합산 갱신.
- 단위 테스트 (tests/suites/lineup_validation.test.js 신설 또는 기존 suite 확장): 완화된 검증식 + main=0 통과 + hero=0/goods=0 throw 케이스 커버.

5.19. **M4 메뉴 재설계 검증 (단계 6 신설)**:
- spec 4장 view 모델 (HOME / MAIN) ↔ 02_data 1.4.B view 상수 ↔ src/data/numbers.js export 1:1.
- spec 4장 탭 모델 (3탭) ↔ 02_data 1.4.B 탭 상수 ↔ src/data/numbers.js export 1:1.
- M3.5까지 4탭 ("history" / "dc") 코드 잔존 0건 grep.
- M3.1 set_current_lineup dispatch 호출처 0건 grep (enter_lineup 통합).
- M3.1 dispatch.open_lobby 호출처 0건 (open_home 개명, 단계 4 결정 시 alias 잔존 가능).
- render/header.js: 헤더 IP 라벨 클릭 = open_home dispatch 정합. home view 시 IP 라벨 미렌더 정합.
- render/home.js (구 render/lobby.js): 라인업 카드 그리드 + 메타 풍부도 (출시일 + 끝일 + 가격 + 매장 + 진행 상태) 정합.
- render/products-history-tab.js (M4 신설): sub-section 3개 (대시보드 + 갤러리 + 리스트) 정합.
- render/history-tab.js / render/dc-tab.js 폐기 또는 sub-section 자산 이전 정합 (단계 4 결정).
- render/settings-tab.js: dropdown quick-switch 폐기 정합 + "홈으로" 버튼 라벨 갱신 정합.
- render/tab-bar.js: 4 → 3 탭 + 아이콘 + 라벨 정합.
- storage v5 → v6 마이그레이션 (lobby_acked → home_acked 키 개명 + activeTab 4탭 → 3탭 매핑) 멱등성 정합.
- 단위 테스트 (home_flow / products_history_layout / state_view) 통과.
- M3 series 라이브 결함 누적 흡수 정합 (단계 7 QA).

5.20. **M4.1 진입 정책 보정 검증 (단계 6 신설)**:
- spec 4장 라우팅 모델 (activeTab 단일) ↔ 02_data 1.4.B 탭 상수 ↔ src/data/numbers.js export 1:1.
- M4까지 STATE_VIEW_* 4종 (HOME/MAIN/VALUES/DEFAULT) 코드 잔존 0건 grep (자비스 단계 1 결정 4.3.A 채택).
- spec 4장 탭 모델 (4탭) ↔ STATE_TAB_VALUES = [HOME, DRAW, PRODUCTS_HISTORY, SETTINGS] ↔ STATE_TAB_DEFAULT = HOME 1:1.
- M4 3탭 STATE_TAB_DEFAULT = STATE_TAB_DRAW 잔존 0건 grep (M4.1 = STATE_TAB_HOME).
- render/main.js: state.view 키 / view 라우팅 분기 잔존 0건. state.activeTab 단일 라우팅. STATE_TAB_HOME 분기 = renderHome 호출.
- render/header.js: 헤더 IP 라벨 클릭 핸들러 / 꺾쇠 아이콘 / "홈" 텍스트 잔존 0건 grep (자비스 단계 1 결정 4.1.A 채택). 모든 탭에서 헤더 IP 라벨 노출 (M4의 home view 미렌더 정책 폐기).
- render/home.js: state.activeTab === STATE_TAB_HOME 분기에서 호출. isCurrent 분기 = lineup.id === currentLineupId 단독 (homeAcked 분기 제거).
- render/bottom-tabs.js: 4탭 (홈/추첨/갤러리+기록/설정) 노출 + 모든 탭에서 노출 (M4의 home view 미노출 정책 폐기).
- render/settings-tab.js: "홈으로" 버튼 잔존 + dispatch open_home 호출 (의미 = activeTab = HOME).
- dispatch.open_home: state.activeTab = STATE_TAB_HOME (state.view 변경 잔존 0건).
- dispatch.enter_lineup: state.activeTab = STATE_TAB_DRAW + state.homeAcked = true (state.view 변경 잔존 0건).
- storage v6 → v7 마이그레이션 (kuji_view 키 안전 제거 + home_acked 의미 변경 + activeTab 4탭 환원 valid + schemaVersion bump) 멱등성 정합.
- 단위 테스트 (storage_v7 / home_flow / tab_routing) 통과. **M4.2 정정 (M4.1 P1-2 흡수)**: home_flow_m41 → home_flow (M4 자산 흡수, 이름 보존) 정정.
- M3 series + M4 라이브 결함 누적 흡수 정합 (단계 7 QA).

# 6. 변경 이력

6.1. 2026-05-02: M1 단계 4 impl_plan 작성. placeholder 교체. 모듈 분해 / 의존성 그래프 / 인터페이스 시그니처 / 데이터 흐름 정의.
6.2. 2026-05-02: **M2 단계 4 impl_plan 작성**. core/buy.js + render/ 9개 신규 모듈 + input/drag.js + data/assets.js + assets/ (icons / products) 추가. 의존성 그래프 + 정적 검사 5.5 / 5.6 보강.
6.3. 2026-05-03: **M2.1 단계 4 impl_plan 작성**. render/pick-panel.js + render/pick-slot.js + render/pick-hint-toast.js 신설 / tests/suites/draw_pick.test.js + storage_v3.test.js 신설 / 3.4 drawOne 시그니처 갱신 (pickIndex 옵셔널) / 3.7 history.js findUnrevealed / revealHistory 신설 / 3.10 storage.js migrateV2ToV3 신설 + state 객체에 pendingPickResult / settingsSkipPick / meta.pickHintSeen 추가 / 4.6~4.9 통 선택 흐름 / 새로고침 복원 / skip 토글 / 첫 진입 안내 흐름 추가 / 5.6 drawOne pickIndex grep 보강 / 5.7~5.9 마이그레이션 / state 매트릭스 / prop drilling 정합 검사 신설. **(이후 6.5에서 findUnrevealed/revealHistory 폐기 + pendingPickResult → ticket.lockedResult 통합. 6.6에서 pick-hint-toast 폐기)**.

6.7. 2026-05-08: **M3 단계 4 impl_plan 사전 정합 (단계 3 통과 후)**. (1) 3.7.M3 신설 - history.tierCounts(history, lineup) 시그니처 + box.id lineup_id 포함. (2) 3.10.M3 신설 - storage v4 다중 라인업 격리 (migrateV3ToV4 / loadStateForLineup / saveGlobalSettings). (3) 3.15.M3 신설 - core/pick-grid.js (M2.1 정리 3.5.1 흡수, render→core 이전). (4) 3.17 settings-tab Lineup 섹션 + 3.18 dispatch.set_current_lineup. (5) 4.M3 흐름 신설 (부팅 / 전환 / 영속 매핑 / 마이그레이션 알고리즘). (6) 5.10/5.11/5.12 단계 6 게이트 grep 신설 (라인업 격리 / 등급 수 가변성 / currentLineupId 매트릭스).
6.13. 2026-05-10: **M4.1 단계 2 design + 단계 4 impl_plan 사전 정합 (단계 3 design_review 진입 전 박제)**. (1) **5.20 게이트 신설** - 진입 정책 보정 검증 (state.view 키 잔존 0 / 4탭 환원 / dispatch 의미 갱신 / 헤더 클릭 폐기 / storage v7 마이그레이션). (2) 3.11 state 객체 view 키 폐기 + activeTab 4탭 enum + homeAcked 의미 변경 (면책 동의 표시). (3) 3.11 라우팅 단일화 (activeTab 단일). (4) 3.17 settings-tab 의미 갱신 ("홈으로" 버튼 = activeTab 라우팅). (5) 3.19 dispatch.open_home 의미 갱신 (activeTab = HOME, view 폐기). (6) 3.20 dispatch.enter_lineup 의미 갱신 (activeTab = DRAW). (7) 3.20.M4.1 dispatch.set_active_tab 4탭 정합. (8) 3.21 render/home.js = 탭 1 콘텐츠 (activeTab 분기). (9) 단계 4 본 plan 흡수 예정: numbers.js STATE_VIEW 폐기 + STATE_TAB_HOME 신설 + STATE_TAB_DEFAULT = HOME / main.js 라우팅 단일화 / bottom-tabs 4탭 환원 / home.js / header 클릭 폐기 / settings 의미 갱신 / storage migrateV6ToV7 신설 + chain / 단위 테스트 storage_v7 + home_flow_m41 + tab_routing 신설. M3 series + M4 라이브 결함 누적 흡수 정합 (단계 7 QA). 1장 트리 신규 모듈 0 (구조 변경, 모듈 수 동일). 자비스 단계 1 결정 4.1.A/4.2.A/4.3.A 채택. 사용자 결정 3.1/3.2/3.3.

6.12. 2026-05-10: **M4 단계 2 design + 단계 4 impl_plan 사전 정합 (round 2 정정 흡수)**. (1) **5.19 게이트 신설** - 메뉴 재설계 검증. (2) 단계 4 본 plan에서 흡수: state.view 개명 (lobby → home) / state.activeTab 4탭 → 3탭 / dispatch open_home 개명 + set_current_lineup 폐기 + set_active_tab 신설 / render/lobby → home + 카드 메타 풍부화 / render/products-history-tab 신설 (M3.3 자산 흡수 + M2 history 리스트 흡수 + DC sub-section 4 통합) / render/history-tab + dc-tab 폐기 / settings-tab dropdown 폐기 + "홈으로" 버튼 / tab-bar 4 → 3 / storage v5 → v6 마이그레이션 / 단위 테스트 home_flow + products_history_layout + state_view + storage_v6 신설. M3 series 라이브 결함 누적 흡수 정합 (단계 7 QA). 1장 트리: render/home.js (개명) + render/products-history-tab.js (신설). 폐기: render/history-tab.js + render/dc-tab.js. **round 1 P0 정정 (round 2 박제)**: P0-1 currentTab → activeTab 통일 (3.11 + spec 4.3) / P0-2 3.11 state 객체 view/탭 4탭 enum → 3탭 home 갱신 / P0-3 SCHEMA_VERSION v6 bump + 02_data 3.2.7 마이그레이션 절 신설. P1 4건 (sub-section 번호 / 결정 게이트 6건 / 산출식 / 본체 박제) 흡수.

6.11. 2026-05-10: **M3.5 단계 2 design + 단계 4 impl_plan 사전 정합 (round 3 정정 흡수)**. (1) 5.14 M3.1 검증식 grep 갱신 - main ≥ 1 룰 폐기 (M3.5 완화). (2) **5.18 게이트 신설** - tier_class 라인업별 자율 분류 검증 (1.4-OP.2 ↔ numbers.js 1:1 / validateLineup main 코드 제거 / 원피스 throw 0 / hero=0 goods=0 throw 잔존 / **hero-carousel + minor-row 분기 식 tierClass 기반 grep** / 단위 테스트 3종). (3) 단계 4 본 plan에서 흡수: numbers.js TIERS_ONEPIECE B/C/D/E/F tierClass main → hero / `_validateLineupTierClass` 함수 main 룰 제거 / **render/hero-carousel.js filter `count===1` → `tierClass !== TIER_CLASS_GOODS`** / **render/minor-row.js filter `count>=2` → `tierClass===TIER_CLASS_GOODS`** / lineup_validation.test.js 신설 또는 확장 / tier_class_lookup.test.js + tier_class_counts.test.js 갱신. state / dispatch / storage / core/draw / 결정론 영향 0 (데이터 분류 + 검증식 + render 분기 식 미세 변경). 1장 트리 신규 모듈 0. **round 1 P0 정정 + round 2 P0 재정정**: round 1은 분기 식이 count 기반이라 tierClass 변경만으로 시각 자동 정합 미성립 - 분기 식 변경 채택. round 2는 `tierClass===HERO` 채택이 드래곤볼 hero-carousel 6→1 회귀 야기 - `tierClass !== GOODS`로 재변경 (양쪽 라인업 6 등급 동등 노출, 비목표 4.1 정합). plan 4.8 비목표 "hero-carousel UI 자체 재설계"는 토큰/scroll/카드 크기 정책 재설계만 의미하며 filter 식 미세 변경은 본 사이클 흡수 가능으로 명문화.

6.10. 2026-05-09: **M3.3 단계 4 impl_plan 사전 정합 (단계 3 round 1 통과 후, P0 0건)**. (1) 5.17 게이트 신설 - tier_class 갤러리 / history 확장 grep (tierClassCounts 시그니처 / 미존재 tier 가드 / 대시보드 반응형 / 그룹화 정렬 / 한국어 라벨 호출). (2) core/history.js 확장 (tierClassCounts 신설, M3.1 history.tierCounts와 의도 분리). (3) render/history-tab.js 상단 대시보드 + render/tier-grid (또는 product-gallery) 그룹화. (4) 단위 테스트 tier_class_counts.test.js 신설. state / dispatch / storage / core/draw / 결정론 영향 0.

6.9. 2026-05-09: **M3.2 단계 4 impl_plan 사전 정합 (단계 3 round 2 통과 후)**. (1) 5.16 게이트 신설 - tier_class 시각 적용 grep (data-tier-class 부착 / CSS 변수 8종 + 모션 3종 매핑 / styles/main.css 인라인 0 / hero 분기 식 정합 / getTierClassForTier 헬퍼 호출처 4종). (2) 단계 4 본 plan에서 흡수: PEEL 글로우 + hero 정적 글로우 동시 노출 정책 / minor-row 보더 정책 / 5.13.C.4.4 cross-link / 모듈 docstring 갱신 (hero-carousel / minor-row / peel-card / dc-result-modal에 tierClass 분기 추가). state / dispatch / storage / core 영향 0 (시각 영역 단독). 1장 트리 신규 모듈 0.

6.8. 2026-05-08: **M3.1 단계 4 impl_plan 사전 정합 (단계 3 통과 후, P0 0건)**. (1) 3.11 state 객체에 `view` (메모리) + `lobbyAcked` (영속) 필드 추가 + view 라우팅 분기 (lobby vs main) 추가. (2) 3.17 settings-tab "라인업 선택 화면으로" 버튼 추가 (5.13.A.4.5). (3) 3.18 set_current_lineup quick-switch 보조 경로로 위상 변경 + lobbyAcked 영향 0 명시. (4) **3.19 dispatch.open_lobby 신설** (메모리 보존, view만 전환). (5) **3.20 dispatch.enter_lineup 신설** - 분기 A(동일 라인업, view 전환만 + 메모리 보존) / 분기 B(다른 라인업, 라인업 전환 + 메모리 폐기). design_review P1-1 흡수. (6) **3.21 render/lobby.js 신설** - renderLobby + renderLobbyCard. CSS Grid 반응형. (7) **3.22 core/lobby-preview.js 신설** - heroPreview 함수 (Last One 제외 hero 첫 항목). CLAUDE.md 4.1 정합. (8) 3.10.M3.1 신설 - storage v5 (migrateV4ToV5 + loadGlobalSettings에 lobbyAcked 추가 + 직렬화 정책 명시 P2-5 흡수). saveState 객체 인자 형식 명시 P2-3 흡수. (9) 4.M3.1 부팅 절차 v4→v5 chain 추가 + view 결정 단계 추가. (10) **4.M3.5 v4→v5 마이그레이션 신설**. (11) **4.M3.1.B 로비 ↔ main view 전환 흐름 신설** + dispatch 사용 매트릭스 (open_lobby / enter_lineup A/B / set_current_lineup). (12) 5.13/5.14/5.15 단계 6 게이트 grep 신설 (lobbyAcked + view 매트릭스 / tier_class 검증식 / 매직 넘버 grep).

6.6. 2026-05-08: **M2.1 라이브 정정 + 단계 6 docs 정합 흡수**. (1) **toast 폐기** (PROGRESS 4.14.1, 메모리 룰 `feedback_lottery_red_text`): pick-hint-toast.js 파일 삭제 / dispatch.pick_hint_seen 호출처 0건 / 03_arch 1장 트리 / 3.16 / 4.9 / 5.7 / 5.9 폐기 표기. PICK_FIRST_HINT_* + meta.pickHintSeen은 호환 잔존 deprecated. (2) **dispatch.peel 흐름 정정** (4.14.8): history append를 reveal 시점에 무조건 수행 (이전: requiresReceive면 receive_confirm까지 미룸 → 새로고침 시 entry 손실 가능). `requiresReceive`는 UI 게이트 플래그로만 사용 (4.6 명시). (3) **buildConsumedGridSet 단일 진실원** (4.14.7 / 4.15.5): pick-panel 렌더와 main.js performPickConfirm가 동일 함수 사용. tests/suites/build_consumed_grid_set.test.js 9 케이스. (4) **통 슬롯 산개** (4.16): 무작위 좌표 → 격자 셀 + ±50% jitter (Poisson clumping 해소). slotPosition 시그니처 변경 (seedKey, posInShuffle, cols, rows). (5) **Last One 슬롯 통 비노출** (4.14.14): pick-panel.js NORMAL_SLOT_COUNT = BOX_SIZE - 1로 일반 슬롯만 렌더. spec 5.14.2.5 / 5.14.3.5/3.6 폐기 표기. pick-slot.js LAST_ONE_PENDING/DRAWN deprecated. (6) **5.8 매트릭스 갱신**: pendingPickResult → ticket.lockedResult로 통합 (B-α 정합). (7) **시각 튜닝 매직 넘버 4종 흡수** (4.17, 단계 6 P1 3.1): PICK_SLOT_ROTATE_RANGE_DEG / PICK_GRID_CLAMP_MIN_PCT / PICK_GRID_CLAMP_MAX_PCT / PICK_SLOT_JITTER_RATIO + PICK_SLOT_SELECTED_Z_BOOST(=30) numbers.js + 02_data 1.12 등재. (8) **02_data 2.2 색 SSOT 정합**: pick-slot 3개 색을 라이브 정정 의도(현재 코드값)로 갱신 + `COLOR_FRAME_RED_DARK` / `COLOR_GOLD_EDGE_SOFT` / `COLOR_PICK_SLOT_BG_GRAD` 3건 신규 등재 (단계 6 P0 2.4 / 2.5). (9) **PICK_AUTO_CONFIRM_DELAY_MS** (4.14.5 / 4.15.2): 200ms 매직 넘버 → 명명 상수.
6.4. 2026-05-03: **M2.1 단계 5 implement 발견 정정**. history entry 스키마에 `gridIndex (number \| null)` 필드 추가 (격자 위치 영구 기록 = 새로고침 격자 회색 복원의 SSOT). 3.7 / 4.6 갱신. 3.14 pick-panel.js 격자 위치 → 잔여 deck 인덱스 j 변환 알고리즘 명시 (drawnGridIndices 기반). 02_data 3.1 / 3.2.3 동시 갱신 (4.9).
6.5. 2026-05-03: **M2.1 단계 5 T19 결함 정정 → B-α 재정정 (단계 4 갱신)**. 3.7 history.js (B-α: revealed deprecated, findUnrevealed/revealHistory 폐기). 3.10 storage.js (migrateV3InPlace 신설 = lockedResult 부재 항목에 null 부여). 3.11 state (pendingPickResult 폐기, selectedGridIndices 신설). 3.14 pick-panel.js (lockedGridIndices ∪ drawnGridIndices 기반 회색 도출, selectedGridIndices 표시, 확인 버튼). 3.15 pick-slot.js (5상태). 4.6 흐름 갱신 (toggle_pick_select / confirm_pick / peel skip OFF는 ticket.lockedResult 사용). 4.7 새로고침 복원 (lockedResult 기반).
