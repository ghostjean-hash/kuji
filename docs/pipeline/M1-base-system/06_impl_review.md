# 06 impl_review - M1 base-system

| 항목 | 값 |
|---|---|
| 스프린트 | M1-base-system |
| 단계 | 6 impl_review |
| 검증일 | 2026-05-02 |
| 검증 주체 | subagent (격리 컨텍스트, general-purpose) |
| 판정 | 실패 |

# 1. 검증 결과 요약

1.1. 통과 게이트 (`docs/05_pipeline.md` 2.6): subagent 격리 검증 + core/ 100% suite pass + 매직 넘버 0개. 본 보고서는 정적 검증(코드 ↔ docs 정합)만 수행. 단위 테스트 실행은 사용자 브라우저 실행 후 별도 보고.

1.2. 정적 검증 결과: **실패**. 시그니처 불일치(검증 항목 4) 1건과 매직 넘버 후보(검증 항목 2) 1건이 발견됨. 특히 `core/box.initBox` / `core/draw.drawOne` / `core/last_one.lastOnePrize`의 `lineup` 매개변수 누락이 03_architecture 3장 SSOT와 정면 충돌.

1.3. 항목별 결과 표

| # | 항목 | 결과 | 비고 |
|---|---|---|---|
| 1 | core/ DOM import 0개 | O | 주석 외 실제 코드 0건 |
| 2 | 매직 넘버 0개 | X | `history-tab.js:46` `slice(-50)` 등 인라인 숫자 발견 |
| 3 | numbers.js export 키 = 02_data 1장 키 | O | 모든 키 정합. typeCount 등 보강 키 1건 추가(데이터 무결성에 필요) |
| 4 | core/ 함수 시그니처 = 03_architecture 3장 | X | `initBox` / `drawOne` / `lastOnePrize`의 `lineup` 인자 누락 |
| 5 | 의존성 규칙 | O | core ⇄ render / data/storage / input 분리 정상 |
| 6 | 라인업 SSOT 정합 | O | TIERS 표 1:1 정합, I상 괄호 보존, 합계 80 검증식 존재 |
| 7 | 결정론 (`box_round`) | O | reset_box: `+= 1`, set_seed: `BOX_ROUND_INITIAL` |
| 8 | Last One / Double Chance 메커닉 | O | deck 79매, 마지막 1매 시점 동시 트리거, DC 베르누이 식 정합 |
| 9 | 사행성 / 절대 규칙 | O | "확률 향상" / "필승" / "당첨 보장" src/ 0건 |
| 10 | 테스트 커버리지 | O | core 7개 + storage 1개 = 8개 suite, 핵심 동작 커버 |

# 2. 검증 항목별 상세 결과

## 2.1. core/ DOM import 0개

2.1.1. 검증 대상: `src/core/random.js` / `hash.js` / `box.js` / `draw.js` / `last_one.js` / `double_chance.js` / `history.js` 7파일.

2.1.2. grep 결과 (`document` / `window` / `localStorage` / `Canvas`):
- `src/core/random.js:2`: `// core/는 DOM/window/document/localStorage import 0개 (CLAUDE.md 4.3).` (주석. 코드 0건.)

2.1.3. core/ 7파일의 모든 import 문 (실제 코드):
- `core/box.js:3-5`: `./random.js`, `./hash.js`, `../data/numbers.js`
- `core/double_chance.js:3`: `../data/numbers.js`
- `core/draw.js:3-6`: `./random.js`, `../data/numbers.js`, `./box.js`, `./last_one.js`
- `core/last_one.js:3`: `../data/numbers.js`
- `core/history.js:3`: `../data/numbers.js`

2.1.4. 결론: **통과**. core/ 7파일 어디에도 DOM/Canvas/window/document/localStorage 본문 사용 0건. 03_architecture 5.2 정합.

## 2.2. 매직 넘버 0개

2.2.1. CLAUDE.md 4.2 / 03_architecture 5.1 기준: data/numbers.js 정의된 키 / 단순 인덱스(0, 1) / 산술 항등 외의 인라인 숫자 0개.

2.2.2. 발견된 인라인 숫자 (위반 후보):

| 위치 | 인용 | 분류 | 판정 |
|---|---|---|---|
| `src/render/history-tab.js:46` | `const recent = state.history.slice(-50).reverse();` | UI 표시 한도(최근 50개) | 위반. 02_data에 `HISTORY_RECENT_LIMIT` 미정의 |
| `src/render/dc-tab.js:32` | `${(probWin * 100).toFixed(2)}%` | 백분율 환산 + 자릿수 | 보더라인. `100`은 분수→백분율 산술 항등으로 통과 가능, `2`(자릿수)는 표시 컨벤션이나 02_data 미정의 |
| `src/render/dc-tab.js:60` | `${(r.probability * 100).toFixed(2)}% (${r.ticketsCount}매)` | 동일 | 동일 |
| `src/render/dc-result-modal.js:10, 16` | `${(result.probability * 100).toFixed(2)}%` | 동일 | 동일 |
| `src/core/random.js:7-11` | `0x6D2B79F5`, `15`, `1`, `7`, `61`, `14`, `4294967296` | Mulberry32 알고리즘 정의 상수 | 통과(허용). 02_data 1.2 `PRNG_NAME = "Mulberry32"` 알고리즘 자체의 매개변수. 코드에서 분리하면 의미가 사라짐 |
| `src/core/hash.js:3-4` | `FNV_OFFSET = 0x811c9dc5`, `FNV_PRIME = 0x01000193` | FNV-1a 정의 상수 (지역 const로 추출) | 통과 |
| `src/core/hash.js:17` | `.toString(16).padStart(8, "0")` | hex base / hex 길이 | 통과(알고리즘 정의 일부) |
| `src/core/draw.js:30` | `boxState.drawnCount += 2;  // deck pop 1 + Last One 자동 지급 1` | 산술 항등(1+1) | 통과(인라인 주석으로 의미 명시. 1+1으로 표현 가능한 누적) |
| `src/render/main.js:41` | `(Date.now() % Math.pow(2, bits)) >>> 0` | 진법 base 2 | 통과(2는 이진법 base 산술 항등) |

2.2.3. 결론: **실패**. 최소 1건의 명백한 위반(`history-tab.js:46`의 `slice(-50)`)이 있고, 보더라인 위반 4건(`dc-tab.js`, `dc-result-modal.js`의 `* 100` + `.toFixed(2)`)이 있음.

2.2.4. 권고 수정안:
- `src/data/numbers.js`에 `HISTORY_RECENT_LIMIT = 50` 추가, `02_data.md` 1.5(신설) 또는 1.1에 정의 추가.
- `PERCENT_DISPLAY_DECIMALS = 2` 추가 또는 1줄 헬퍼 함수(`formatPercent(p)`)로 추상화.

## 2.3. numbers.js export 키 = 02_data 1장 정의 키 정합

2.3.1. 02_data 1장 정의 키 vs numbers.js export 비교

| 02_data 키 | numbers.js | 타입 | 정합 |
|---|---|---|---|
| 1.1 `STORAGE_KEY_PREFIX` | export const | string | O |
| 1.1 `DEFAULT_SEED_FALLBACK_BITS` | export const | number | O |
| 1.1 `BOX_ROUND_INITIAL` | export const | number | O |
| 1.1 `SCHEMA_VERSION` | export const | number | O |
| 1.2 `PRNG_NAME` | export const | string | O |
| 1.2 `PRNG_OUTPUT_BITS` | export const | number | O |
| 1.3 `DC_POOL_SIZE_DEFAULT` | export const | number | O |
| 1.3 `DC_POOL_SIZE_NOTE_KO` | export const | string | O |
| 1.4.1 `LINEUP_ID` ~ `BOX_SIZE_ESTIMATED` (12개) | 모두 export const | string/number/array/boolean | O |
| 1.4.2 등급별 매수 표 | `TIERS` 배열 + `TIERS_COUNT_ESTIMATED` boolean | array of object | O (보강 1건) |
| 1.4.3 `DC_PRIZE_NAME_JA`, `_KO`, `DC_WINNERS_TOTAL`, `DC_PRIZE_NOTE_KO` | export const | string/number | O |
| 1.4.4 출처 | `LINEUP_SOURCES` 배열 | array of object | O |

2.3.2. 보강 키:
- `TIERS_COUNT_ESTIMATED = true`: 02_data 1.4.2 표 헤더에 "(count_estimated:true)"로 표기되어 있고, 본문 키로는 없음. 코드에 boolean 플래그로 노출. CLAUDE.md 4.8 "추정 플래그 보존" 정합. 보강이 필요하므로 통과.
- `TIERS` 배열의 각 항목 키 (`tier`, `count`, `typeCount`, `nameJa`, `nameKo`, `sizeLabel`)는 02_data 1.4.2 표의 컬럼 1:1 매핑.

2.3.3. 결론: **통과**. 모든 키 정합. 보강 키는 docs 명시(추정 플래그)와 정합.

## 2.4. core/ 함수 시그니처 = 03_architecture 3장 정합

2.4.1. 03_architecture 3.1 (random.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `createRng(seed): () => number` | `createRng(seed)` returns `function rng()` | O |
| `nextInt(rng, max): number` | `nextInt(rng, max)` returns `Math.floor(rng() * max)` | O |

2.4.2. 03_architecture 3.2 (hash.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `fnv1a(str): number` | `fnv1a(str)` | O |
| `boxId(seed, boxRound): string` (16진수) | `boxId(seed, boxRound)` returns `.toString(16).padStart(8, "0")` | O |

2.4.3. 03_architecture 3.3 (box.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `initBox(seed, boxRound, lineup): BoxState` | `initBox(seed, boxRound)` (`src/core/box.js:9`) | **X** |
| `BoxState = { id, deck, drawnCount, totalSize }` | 동일 (`src/core/box.js:32-37`) | O |
| `remaining(boxState): number` | 동일 | O |
| `isLastDraw(boxState): boolean` (`remaining === 1`) | `boxState.deck.length === 1` (`src/core/box.js:47`) | O (의미 동일. deck 79매 시작이므로 deck.length===1 ⇔ remaining===1) |

2.4.4. 03_architecture 3.4 (draw.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `drawOne(boxState, rng, lineup): DrawResult` | `drawOne(boxState, drawRng)` (`src/core/draw.js:16`) | **X** |
| `DrawResult = { tier, typeIndex, name, sizeLabel, isLastOne }` | `{ tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne, lastOnePrize? }` (`src/core/draw.js:31-50`) | 부분 X (정의의 `name` 단일 필드를 `nameJa` / `nameKo` 분리. `lastOnePrize?` 추가) |

2.4.5. 03_architecture 3.5 (last_one.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `lastOnePrize(lineup): { tier:'Last One', name, sizeLabel }` | `lastOnePrize()` returns `{ tier, typeIndex, nameJa, nameKo, sizeLabel }` (`src/core/last_one.js:10-18`) | **X** (인자 부재 + name → nameJa/nameKo 분리 + typeIndex 보강) |

2.4.6. 03_architecture 3.6 (double_chance.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `addTicket(tickets, ticket): Ticket[]` | 동일 | O |
| `drawDc(tickets, rng, winnersTotal, poolSize): DcResult` | 동일 | O |
| `DcResult = { isWin, prize?: { name } }` | `{ isWin, probability, ticketsCount, prize?: { nameJa, nameKo } }` | 부분 X (`probability` / `ticketsCount` 보강은 UI 노출 정당. `name` → `nameJa` / `nameKo` 분리는 일관성 있음) |

2.4.7. 03_architecture 3.7 (history.js)

| 정의 | 실제 | 정합 |
|---|---|---|
| `appendHistory(history, entry): HistoryEntry[]` | 동일 | O |
| `tierCounts(history): Record<TierLabel, number>` | 동일 | O |

2.4.8. 결론: **실패**. 핵심 결함 3건.
- (D-1) `initBox(seed, boxRound)`에 `lineup` 인자 누락. 실제로는 `data/numbers.js`의 `TIERS`를 직접 import하여 사용. 04_impl_plan 8.4 "M2~M5 확장 시 lineup 객체 스키마 호환" 리스크가 시그니처에 반영되지 않음.
- (D-2) `drawOne(boxState, drawRng)`에 `lineup` 인자 누락. 동일 이유.
- (D-3) `lastOnePrize()`에 `lineup` 인자 누락. 동일 이유.

이 3건은 **현재 M1 단일 라인업에서는 동작하지만, M2 확장 시점에 시그니처 변경이 강제되어 호출부 전체 수정이 필요해진다**. 03_architecture가 docs SSOT(CLAUDE.md 4.5)이므로 코드를 docs에 맞춰 수정해야 함. 또는 03_architecture를 코드 현실에 맞춰 수정 + M2 진입 시 리팩토링 백로그 등록.

2.4.9. 권고 수정안 (택 1):
- (안 A: 코드 → docs) `core/box.initBox(seed, boxRound, lineup)` 시그니처로 lineup 인자 추가, 내부에서 `lineup.tiers` 참조. `data/numbers.js`의 `TIERS`를 `LINEUP` 객체로 묶어 export. M2 확장 즉시 대응.
- (안 B: docs → 코드) 03_architecture 3.3 / 3.4 / 3.5의 `lineup` 인자를 제거. M2 진입 시 시그니처 확장(필수 리팩토링) 백로그 항목 PROGRESS.md 등재.
- (`name` vs `nameJa/nameKo` 분리는 코드 쪽이 docs보다 정밀하므로 03_architecture를 코드에 맞춰 갱신 권고. 보고서 자체 의견.)

## 2.5. 의존성 규칙 (03_architecture 2장)

2.5.1. 2.1 core/ → DOM/Canvas/window/document/localStorage 0건: **통과** (2.1.x 참조).

2.5.2. 2.2 render/ → core/ / data/ / input/ 가능, 역방향 금지: **통과**.
- `render/main.js`: `core/box`, `core/draw`, `core/double_chance`, `core/history`, `core/random`, `core/hash`, `data/storage`, `data/numbers`, `input/keyboard` import. 정합.
- `render/draw-tab.js`: `core/box`, `data/numbers` import. 정합.
- `render/tier-grid.js`, `history-tab.js`, `dc-tab.js`, `settings-tab.js` 등: `data/numbers`, `data/colors`, `core/history` 등만 import. 정합.

2.5.3. 2.3 data/numbers.js / colors.js → 외부 의존 없음:
- `data/numbers.js`: import 0건. **통과**.
- `data/colors.js`: import 0건. **통과**.

2.5.4. 2.4 data/storage.js → core 호출 금지:
- `data/storage.js:4`: `import { STORAGE_KEY_PREFIX, SCHEMA_VERSION, BOX_ROUND_INITIAL } from "./numbers.js";` (data/numbers만 import). core/ 호출 0건. **통과**.

2.5.5. 2.5 input/ → core/ 직접 호출 금지:
- `input/keyboard.js`: import 0건. **통과**.

2.5.6. 2.6 모든 import 상대경로 + `.js` 확장자: 전수 grep 결과 모든 import 문이 `./` 또는 `../`로 시작 + `.js` 명시. **통과**.

2.5.7. 결론: **통과**.

## 2.6. 라인업 SSOT 정합

2.6.1. TIERS 배열 (numbers.js:32-44) vs 02_data 1.4.2 표

| 등급 | 02_data 매수 / 종 | numbers.js | 일본어 | 한국어 | 사이즈 | 정합 |
|---|---|---|---|---|---|---|
| A | 1 / 1 | 1 / 1 | `孫悟空 MASTERLISE` | `손오공 MASTERLISE` | `11cm` | O |
| B | 1 / 1 | 1 / 1 | `ブルマ MASTERLISE` | `부르마 MASTERLISE` | `21cm` | O |
| C | 1 / 1 | 1 / 1 | `超サイヤ人孫悟空 MASTERLISE` | `초사이어인 손오공 MASTERLISE` | `25cm` | O |
| D | 1 / 1 | 1 / 1 | `超サイヤ人2孫悟空 MASTERLISE` | `초사이어인2 손오공 MASTERLISE` | `25cm` | O |
| E | 1 / 1 | 1 / 1 | `魔人ベジータ MASTERLISE` | `마인 베지타 MASTERLISE` | `24cm` | O |
| F | 1 / 1 | 1 / 1 | `孫悟空 身勝手の極意 MASTERLISE` | `손오공 자림무도 MASTERLISE` | `25cm` | O |
| G | 8 / 8 | 8 / 8 | `引っ掛けアクリルスタンド` | `걸이형 아크릴 스탠드` | `7.5cm` | O |
| H | 8 / 8 | 8 / 8 | `ラバーチャーム` | `러버 참` | `6.5cm` | O |
| I | 24 / 10 | 24 / 10 | `クリアポスター (A3)` | `클리어 포스터 (A3)` | `A3` | O (괄호 보존, C1 정정 반영) |
| J | 33 / 10 | 33 / 10 | `ジャガードミニタオル` | `자카드 미니 타올` | `25cm` | O |
| Last One | 1 / 1 | 1 / 1 | `大猿悟空 SOFVICS` | `거대 원숭이 손오공 SOFVICS` | `26cm` | O |

2.6.2. 부팅 시 합계 검증식 (`src/data/numbers.js:62-67`):
```js
const TIER_COUNT_SUM = TIERS.reduce((acc, t) => acc + t.count, 0);
if (TIER_COUNT_SUM !== BOX_SIZE) { throw new Error(...) }
```
- TIER_COUNT_SUM = 1+1+1+1+1+1+8+8+24+33+1 = 80 = BOX_SIZE. **통과**.
- 검증식 import 시점에 throw로 부팅 실패 강제. 01_spec 7.5 / 02_data 1.4.2.1 정합.

2.6.3. 결론: **통과**.

## 2.7. 결정론 (`box_round`)

2.7.1. 박스 리셋 시 `box_round` += 1 (`src/render/main.js:121-140`):
```js
case "reset_box": {
  ...
  const proceed = () => {
    state.boxRound += 1;
    state.boxState = initBox(state.seed, state.boxRound);
    ...
  };
}
```
01_spec 5.7.4 정합. **통과**.

2.7.2. 시드 변경 시 `box_round` = `BOX_ROUND_INITIAL` (`src/render/main.js:141-161`):
```js
case "set_seed": {
  ...
  const proceed = () => {
    state.seed = Number(action.seed) >>> 0;
    state.boxRound = BOX_ROUND_INITIAL;
    state.boxState = initBox(state.seed, state.boxRound);
    ...
  };
}
```
01_spec 5.7.4 정합. **통과**.

2.7.3. 결론: **통과**.

## 2.8. Last One / Double Chance 메커닉

2.8.1. box.js deck 79매:
- `src/core/box.js:9-22`: TIERS 순회 시 `if (t.tier === "Last One") continue;`로 Last One 제외 + count만큼 `labels.push`. 합 = 79.
- `if (labels.length !== BOX_SIZE - 1)` throw 검증식 존재. **통과**.

2.8.2. draw.js 마지막 1매 시점에 wasLast 트리거:
- `src/core/draw.js:21`: `const wasLast = isLastDraw(boxState);` (deck.length === 1 시점).
- `src/core/draw.js:22`: `boxState.deck.shift()` (deck 1매 → 0매).
- `src/core/draw.js:29-39`: `if (wasLast) { boxState.drawnCount += 2; ... return { ..., isLastOne: true, lastOnePrize: lastOnePrize() }; }`. **통과**.
- 01_spec 5.4.4 "79매 셔플 + 마지막 1매 추첨 시 Last One 자동 지급. 박스 매수는 79 + Last One 1 = 80" 정합.

2.8.3. DC addTicket 추첨 1회당 1매 누적 (`src/render/main.js:107-111`):
```js
state.dcTickets = addTicket(state.dcTickets, {
  boxId: state.boxState.id,
  drawIndex,
  time,
});
```
01_spec 5.5.1 정합. **통과**.

2.8.4. DC drawDc 베르누이 단순화 = 1 - (1 - p)^N (`src/core/double_chance.js:22-25`):
```js
const p = winnersTotal / poolSize;
const probWin = 1 - Math.pow(1 - p, tickets.length);
const r = rng();
const isWin = r < probWin;
```
01_spec 5.5.5, 5.5.6 정합. **통과**.

2.8.5. 결론: **통과**.

## 2.9. 사행성 / 절대 규칙 (CLAUDE.md 4.6)

2.9.1. src/ 전수 grep `확률\s*향상|필승|당첨\s*보장|대박|돈\s*복사|잭팟`: **0건**.

2.9.2. 사용자 카피 (모달 / 면책) 검사:
- `src/render/disclaimer-sheet.js`: "본 시뮬레이터는 일본 쿠지(추첨식 상품) 메커닉의 학습 / 체험 목적입니다. ... 사행성 / 도박성 권유가 아닙니다." 정합.
- `src/render/settings-tab.js`: 면책 섹션에 "수집 / 완주 경험" 명시. CLAUDE.md 4.6 정합.
- `src/render/dc-tab.js`: "단순화 가정", "당첨자 50명 / 풀 5000매" 객관 표시. 사행성 권유 없음.
- 추첨 / 결과 / DC 모달: 단순 결과 표시, "추첨 결과", "박스 종료 + Last One!", "당첨" / "미당첨" 같은 메커닉 정의 용어만 사용.

2.9.3. 결론: **통과**.

## 2.10. 테스트 커버리지

2.10.1. 03_architecture 1장 폴더 구조 + 04_impl_plan T7 vs 실제 tests/suites/ 1:1 대응

| 모듈 | suite 파일 | 존재 |
|---|---|---|
| `core/random` | `tests/suites/random.test.js` | O |
| `core/hash` | `tests/suites/hash.test.js` | O |
| `core/box` | `tests/suites/box.test.js` | O |
| `core/draw` | `tests/suites/draw.test.js` | O |
| `core/last_one` | `tests/suites/last_one.test.js` | O |
| `core/double_chance` | `tests/suites/double_chance.test.js` | O |
| `core/history` | `tests/suites/history.test.js` | O |
| `data/storage` | `tests/suites/storage.test.js` | O |

2.10.2. 핵심 동작 커버 점검:

| 동작 | 커버 위치 |
|---|---|
| PRNG 결정론 (같은 시드 → 같은 시퀀스) | `random.test.js:16-22` |
| nextInt 범위 | `random.test.js:32-38` |
| boxId 결정론 + 8자리 hex | `hash.test.js:15-28` |
| initBox deck 79매 | `box.test.js:6-9` |
| 시드/회차 결정론 | `box.test.js:23-37` |
| isLastDraw 판정 | `box.test.js:44-51` |
| 79회 클릭으로 박스 종료 + Last One 1회 트리거 | `draw.test.js:8-21, 69-78` |
| 등급별 매수 정합 | `draw.test.js:23-36` |
| 빈 박스 throw | `draw.test.js:38-43` |
| 추첨 결정론 | `draw.test.js:45-57` |
| typeIndex 범위 | `draw.test.js:59-67` |
| Last One prize 첨부 | `draw.test.js:80-90` |
| lastOnePrize TIERS 정합 | `last_one.test.js:6-13` |
| addTicket 누적 | `double_chance.test.js:6-11` |
| 베르누이 식 1 - (1 - p)^N 검증 | `double_chance.test.js:16-23` |
| isWin / prize 일관성 | `double_chance.test.js:24-41` |
| invalid 인자 throw | `double_chance.test.js:42-48` |
| appendHistory 누적 + 불변 | `history.test.js:5-12` |
| tierCounts 누적 (일반 + Last One) | `history.test.js:13-33` |
| storage round-trip | `storage.test.js:19-35` |
| clearAll | `storage.test.js:36-41` |

2.10.3. 결론: **통과**. 03_architecture 5.4 정의된 모든 core 모듈 + storage가 1:1 suite를 가지고 있으며, 결정론 / 비복원 / Last One 트리거 / 등급 합 정합 / 베르누이 식 모두 커버됨.

# 3. 발견된 모순 / 결함 일람

| # | 위치 | 모순 / 결함 | 원문 인용 | 권고 수정안 |
|---|---|---|---|---|
| D-1 | `src/core/box.js:9` | `initBox`가 `lineup` 인자를 받지 않음. 03_architecture 3.3과 시그니처 불일치 | `export function initBox(seed, boxRound) { ... import ... TIERS from "../data/numbers.js" ... for (const t of TIERS) { ... } }` | (A) 03_architecture에 맞춰 `initBox(seed, boxRound, lineup)`로 변경하고 `lineup.tiers` 참조. data/numbers.js에 `LINEUP = { tiers: TIERS, ... }` 객체 추가. 또는 (B) 03_architecture 3.3의 `lineup` 인자를 제거하고 M2 확장 시 리팩토링 백로그 등재. |
| D-2 | `src/core/draw.js:16` | `drawOne`이 `lineup` 인자를 받지 않음. 03_architecture 3.4과 시그니처 불일치 | `export function drawOne(boxState, drawRng) { ... import { TIERS } from "../data/numbers.js" ... }` | D-1과 동일 노선 적용. |
| D-3 | `src/core/last_one.js:10` | `lastOnePrize`가 `lineup` 인자를 받지 않음. 03_architecture 3.5와 시그니처 불일치 | `export function lastOnePrize() { return { tier: "Last One", typeIndex: 0, nameJa: ..., nameKo: ..., sizeLabel: ... }; }` | D-1과 동일 노선 적용. |
| D-4 | `src/render/history-tab.js:46` | 매직 넘버 `50` 인라인 (최근 추첨 표시 한도). 02_data 미정의 | `const recent = state.history.slice(-50).reverse();` | `02_data.md` 1.5 신설(또는 1.1)에 `HISTORY_RECENT_LIMIT = 50` 정의 + `data/numbers.js`에 export 추가. |
| D-5 | `src/render/dc-tab.js:32, 60` / `src/render/dc-result-modal.js:10, 16` | 매직 넘버 `100` (백분율 환산) + `2` (소수점 자릿수) 반복 인라인 | `${(probWin * 100).toFixed(2)}%` | (A) 보더라인. `* 100`은 분수→백분율의 산술 항등으로 통과 가능 / `.toFixed(2)`는 표시 컨벤션. 명시적 정합 원하면 `formatPercent(p)` 헬퍼 함수 1개 정의(예: `src/data/numbers.js`에 `PERCENT_DISPLAY_DECIMALS = 2`). (B) 표시 자릿수만 정의해도 검증식 통과. |
| 보강 (정보) | `src/core/draw.js` 의 `DrawResult` 객체 | 03_architecture 3.4 정의 `{ tier, typeIndex, name, sizeLabel, isLastOne }`와 비교 시 `name` → `nameJa` / `nameKo` 분리, `lastOnePrize?` 추가 | `return { tier, typeIndex, nameJa, nameKo, sizeLabel, isLastOne, lastOnePrize: lastOnePrize() }` | 코드가 docs보다 정밀(일본어 / 한국어 구분이 UI에 필요). 03_architecture 3.4를 코드에 맞춰 갱신 권고. 결함이 아닌 docs ↔ 코드 동기화 필요 항목으로 분류. |
| 보강 (정보) | `src/core/double_chance.js` 의 `DcResult` | 03_architecture 3.6 정의 `{ isWin, prize?: { name } }`와 비교 시 `probability`, `ticketsCount` 추가 | `return { isWin, probability, ticketsCount, prize: ... }` | UI 표시(dc-tab의 시행 확률 / 응모권 수)에 필요. 03_architecture 3.6을 코드에 맞춰 갱신 권고. |

# 4. 통과 게이트 판정 (정적 검증 부분)

| 게이트 | 결과 |
|---|---|
| core/ DOM 0건 | O |
| 매직 넘버 0개 | X (D-4 명백 위반 + D-5 보더라인) |
| 코드 ↔ docs 정합 | X (D-1, D-2, D-3 시그니처 불일치) |
| 의존성 규칙 | O |
| 테스트 1:1 대응 | O |
| 사행성 표현 0건 | O |
| **종합** | **실패** |

# 5. 권고

5.1. 본 정적 검증은 **실패**. 단계 7 QA 진입 전 단계 5 implement 또는 단계 4 impl_plan으로 부분 재진입 권고.

5.2. 우선 수정 항목 (실패 사유, 우선순위 P0):

| 순 | 항목 | 처리 노선 |
|---|---|---|
| 1 | D-1, D-2, D-3 시그니처 불일치 | 03_architecture를 SSOT로 본다면 코드 수정 (안 A). 코드를 SSOT로 인정한다면 03_architecture를 갱신 (안 B). 권고: **현재 M1 단일 라인업 + 04_impl_plan 8.4의 M2 확장 리스크를 고려할 때 안 A(코드 수정으로 lineup 인자 추가)가 미래 비용 최소화**. |
| 2 | D-4 `slice(-50)` 매직 넘버 | `HISTORY_RECENT_LIMIT = 50`을 02_data + numbers.js에 추가. 1줄 수정. |
| 3 | D-5 백분율 표시 매직 넘버 | (선택) `PERCENT_DISPLAY_DECIMALS = 2` 추가 또는 `formatPercent()` 유틸. 보더라인이라 강제 아님. |
| 4 | DrawResult / DcResult docs 동기화 | 03_architecture 3.4 / 3.6의 타입 정의를 코드 현실(`nameJa` / `nameKo`, `probability`, `ticketsCount`)에 맞춰 갱신. CLAUDE.md 4.5는 "충돌 시 docs가 진실"이지만 본 항목은 코드가 정밀하므로 docs 갱신 권고. |

5.3. 단계 7 진입 조건:
- D-1 ~ D-4 처리 완료.
- D-5는 보더라인이므로 사용자 결정에 위임.
- 사용자 브라우저에서 `tests/test.html` 실행 결과 모든 suite pass 확인.

5.4. 본 보고서는 자비스(메인 Claude)의 의도 / 컨텍스트 일체 미수신 상태에서 docs와 코드만으로 정적 검증한 결과다. 사용자가 본 발견을 단계 5 재작업으로 흡수할지(권고) 또는 docs를 갱신할지(D-1~D-3에 한해 가능) 결정 필요.

# 6. 변경 이력

6.1. 2026-05-02: subagent 격리 검증 1차. 시그니처 불일치 3건 + 매직 넘버 1~5건 발견. 판정 실패.
