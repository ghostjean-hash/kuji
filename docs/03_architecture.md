# 03. 아키텍처

본 문서는 Kuji 시뮬레이터의 폴더 / 모듈 구조 / 의존성 규칙 SSOT. M1-base-system 스프린트 단계 4 impl_plan 산출물.

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
        ├── last_one.test.js
        ├── double_chance.test.js
        ├── history.test.js
        └── storage.test.js
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

## 3.4. core/draw.js

```js
// 추첨 (등급 + 종 인덱스)
export function drawOne(boxState, rng, lineup): DrawResult
//   DrawResult = { tier, typeIndex, name, sizeLabel, isLastOne }
// boxState 변경 (deck pop, drawnCount++).
// 마지막 1매 시점이면 isLastOne === true 동시 반환.
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

## 3.7. core/history.js

```js
// 추첨 이력 누적 / 통계
export function appendHistory(history, entry): HistoryEntry[]
export function tierCounts(history): Record<TierLabel, number>
```

## 3.8. data/numbers.js

`docs/02_data.md` 1장의 모든 키를 `export const`로 변환. 자동 검증: numbers.js의 export 키 집합 = 02_data 1장 정의 키 집합 (단계 6 impl_review 검증식).

## 3.9. data/colors.js

`docs/02_data.md` 2장 색상을 `export const`로 변환.

## 3.10. data/storage.js

```js
export function loadState(): { seed, boxRound, boxState, history, dcTickets, dcResults, meta }
export function saveState(partial): void
export function clearAll(): void
export function isStorageAvailable(): boolean  // false면 메모리 fallback 모드
```

## 3.11. render/main.js

진입점. 4탭 라우팅 + 모듈 wire-up. state 객체 보유.

```js
state = {
  currentTab,         // 'draw' | 'history' | 'dc' | 'settings'
  seed,
  boxRound,
  boxState,           // core/box BoxState
  history,            // core/history HistoryEntry[]
  dcTickets,
  dcResults,
  meta,               // { disclaimerSeen, schemaVersion, ... }
  storageMode,        // 'persistent' | 'memory'
}
```

state 변경 시 영속(`data/storage.saveState`) + 본문 재렌더.

## 3.12. render/[tab].js / [modal].js

각 탭은 `function render(state, dispatch): HTMLElement` 시그니처. dispatch는 사용자 입력을 main.js가 처리하도록 위임.

## 3.13. input/keyboard.js

전역 keydown 리스너. Tab은 브라우저 기본 + 포커스 트랩, Enter는 활성 추첨 버튼 호출, Esc는 활성 모달 닫기.

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

# 5. 정적 검사 / 단계 6 게이트 검증식

5.1. **매직 넘버 0개**: `src/` 전수 grep으로 숫자 리터럴 추출. `data/numbers.js` 정의 / 단순 인덱스(0, 1) / 산술 항등(매수 비교) 외 매직 값 0개.
5.2. **core/ DOM import 0개**: `src/core/*.js` 의 `import` 문 + 본문 grep `document` / `window` / `localStorage` / `Canvas` 0건.
5.3. **numbers.js 키 = 02_data 1장 키**: 자동 비교 권장 (단계 6 시 subagent 검증).
5.4. **단위 테스트 100% pass**: tests/test.html 모든 suite의 fail 0건.
5.5. **`tests/` 매직 넘버 0개 (M2 추가, M1 OP-4 반영)**: tests/suites/*.test.js 도 src/ 와 동일 매직 넘버 룰 적용.
5.6. **시그니처 grep (M2 추가, M1 OP-2 반영)**: `initBox\(`, `drawOne\(`, `lastOnePrize\(` 호출처 모두 `lineup` 인자 정합 여부 grep.

# 6. 변경 이력

6.1. 2026-05-02: M1 단계 4 impl_plan 작성. placeholder 교체. 모듈 분해 / 의존성 그래프 / 인터페이스 시그니처 / 데이터 흐름 정의.
6.2. 2026-05-02: **M2 단계 4 impl_plan 작성**. core/buy.js + render/ 9개 신규 모듈 + input/drag.js + data/assets.js + assets/ (icons / products) 추가. 의존성 그래프 + 정적 검사 5.5 / 5.6 보강.
