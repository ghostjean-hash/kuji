# 06. 구현 검증 보고 (3차 라운드)

본 문서는 Kuji 시뮬레이터 M1-base-system 스프린트 단계 6 impl_review의 3차 라운드 격리 검증 결과 SSOT다. docs(`01_spec`, `02_data`, `03_architecture`, `05_pipeline`, `CLAUDE.md`) + 코드(`src/`, `index.html`, `styles/`, `tests/`)만으로 처음부터 검증.

# 1. 한 줄 결론

3차 라운드 게이트 통과 조건(모순 0 + 결함 0)에 1결함 미달. core/ DOM import 0개, core/ 시그니처-호출 정합, 매직 넘버 0개(src/ 본체), 라인업 SSOT 정합, 결정론, Last One / Double Chance 메커닉, 사행성 표현 전수 통과. 결함은 `tests/suites/double_chance.test.js` 단일 파일이 SSOT(DC_WINNERS_TOTAL=50, DC_POOL_SIZE_DEFAULT=5000)를 import하지 않고 인라인 50 / 5000 / 80을 직접 사용해 매직 넘버 절대 규칙(CLAUDE.md 4.2) 위반.

# 2. 검증 항목 결과 요약

| # | 항목 | 결과 | 모순 / 결함 | 비고 |
|---|---|---|---|---|
| 1 | core/ DOM import 0개 | 통과 | 0 | DOM/window/document/localStorage/Canvas import 0건. 본문 grep도 주석 1건(`random.js:2` 룰 명시) 외 0건. |
| 2 | 매직 넘버 0개 | 결함 1 | 1 | src/ 본체 0건. tests/suites/double_chance.test.js만 SSOT 우회 인라인 50/5000/80 사용. |
| 3 | numbers.js export 키 = 02_data 1장 키 정합 | 통과 | 0 | 1.1~1.5 + 1.4.5 LINEUP 객체까지 전수 정합. 누락/잉여 0. |
| 4 | core/ 함수 시그니처 = 03_architecture 3장 정합 | 통과 | 0 | initBox / drawOne / lastOnePrize 모두 lineup 인자 정합. main.js의 dispatch.reset_box / set_seed / ensureBoxState 모두 LINEUP 인자 전달. |
| 5 | 의존성 규칙 | 통과 | 0 | 03_architecture 2.1~2.6 전수 정합. core → render 역방향 0건, core → storage 0건. |
| 6 | 라인업 SSOT 정합 | 통과 | 0 | 02_data 1.4.1~1.4.4 → numbers.js → core lineup 인자 흐름 일관. UI 라벨 정합. |
| 7 | 결정론 | 통과 | 0 | 박스 셔플 / 추첨 RNG 모두 (seed, boxRound, drawIndex) 결정론. 01_spec 5.7.1 / 5.7.4 / 6.5 보장. |
| 8 | Last One / Double Chance 메커닉 | 통과 | 0 | draw.js의 isLastDraw 분기 + drawnCount += 2 + lastOnePrize 첨부 정합. addTicket 매 추첨 누적, drawDc 베르누이 1 - (1-p)^N 정합. |
| 9 | 사행성 / 절대 규칙 | 통과 | 0 | "확률 향상" / "필승" / "당첨 보장" / "대박" / "잭팟" 등 src/ 0건. disclaimer-sheet / settings-tab 면책 카피 정합. Math.random() src/ 0건. |
| 10 | 테스트 커버리지 | 통과 | 0 | core/ 7개 모듈(random/hash/box/draw/last_one/double_chance/history) + storage 1개 = 8 suite 모두 존재. 결정론 / 비복원 / 등급별 매수 / Last One 단일 / typeIndex 범위 등 핵심 검증 포함. |

총 모순 0건 / 결함 1건.

# 3. 항목별 상세

## 3.1. core/ DOM import 0개

3.1.1. `src/core/*.js` 7개 파일 import 문 전수:
- `random.js`: `PRNG_OUTPUT_DIVISOR` from data/numbers.js
- `hash.js`: `BOX_ID_HEX_LENGTH` from data/numbers.js
- `box.js`: `createRng`, `nextInt` from random.js / `boxId`, `fnv1a` from hash.js
- `draw.js`: `nextInt` from random.js / `isLastDraw` from box.js / `lastOnePrize` from last_one.js
- `last_one.js`: import 0건
- `double_chance.js`: `DC_PRIZE_NAME_JA`, `DC_PRIZE_NAME_KO` from data/numbers.js
- `history.js`: `TIERS` from data/numbers.js

3.1.2. `document` / `window` / `localStorage` / `Canvas` / `HTMLElement` 본문 grep 결과 0건(주석 1건 `random.js:2` 룰 명시 외).

3.1.3. data/storage.js import 0건. 03_architecture 2.4 "core/는 storage 호출 금지" 정합.

3.1.4. 결과: 통과.

## 3.2. 매직 넘버 0개

3.2.1. SSOT 정의 키-값 인라인 사용 검사 (src/ 본체):
- 50 / 100 / 80 / 79 / 790 / 5000 / 4294967296 등 grep → src/ 본체에서는 모두 numbers.js 내부 정의 라인에서만 등장. import 사용처는 인라인 수치 0건.
- src/render/draw-tab.js: BOX_SIZE import 사용. 인라인 80 0건.
- src/render/header.js: LINEUP_PRICE_JPY import 사용. 인라인 790 0건.
- src/render/dc-tab.js / dc-result-modal.js: DC_WINNERS_TOTAL / DC_POOL_SIZE_DEFAULT import 사용. 인라인 50/5000 0건.
- src/render/history-tab.js: HISTORY_RECENT_LIMIT import 사용. 인라인 50 0건.
- src/render/format.js: PERCENT_BASE / PERCENT_DISPLAY_DECIMALS import 사용. 인라인 100 / 2 0건.

3.2.2. 알고리즘 hex 상수 (검증 가이드 통과 항목):
- random.js `0x6D2B79F5` (Mulberry32 정의)
- hash.js `0x811c9dc5` (FNV_OFFSET), `0x01000193` (FNV_PRIME), `16` (HEX_RADIX)
- 위는 알고리즘 정의 일부로 통과. 단 `0x811c9dc5`, `0x01000193`은 모듈 상수로 const 추출됨(권장 패턴 정합). HEX_RADIX=16도 const 추출 정합.

3.2.3. 인덱스 / 산술 항등 / 단순 부울:
- box.js / draw.js의 `i + 1`, `t.count - drawn`, `tier.count - 1` 등 산술 항등은 매직 넘버 게이트 외.

3.2.4. 결함 1건: tests/suites/double_chance.test.js의 인라인 SSOT 우회.
- L14: `drawDc([], rng, 50, 5000)` ← DC_WINNERS_TOTAL=50 / DC_POOL_SIZE_DEFAULT=5000 의 SSOT 키 의미. import 우회.
- L18: `Array.from({ length: 80 }, ...)` ← BOX_SIZE=80 의미 여부 모호하나 시나리오 80매 응모 = 박스 1회 풀 추첨에 해당.
- L19: `drawDc(tickets, rng, 50, 5000)` ← 동일.
- L20: `1 - Math.pow(1 - 50 / 5000, 80)` ← 검증 expected 값에 SSOT 의미 인라인 3개 동시 등장.
- L22: `assertEq(res.ticketsCount, 80)` ← 80은 위 시나리오 사이즈 expected.
- L29: `drawDc(tickets, rng, 50, 5000)` ← 동일.
- L45-47: `drawDc(t, rng, 0, 5000)`, `drawDc(t, rng, 50, 0)`, `drawDc(t, rng, -1, 5000)` ← `0`, `-1`은 invalid 검증 input이라 SSOT 외이지만 `5000` / `50`은 SSOT 의미.
- 비교 대조: tests/suites/box.test.js / draw.test.js / last_one.test.js는 `BOX_SIZE`, `LINEUP`, `TIERS`를 numbers.js에서 정상 import. 일관성 결함.
- CLAUDE.md 4.2: "매직 넘버 금지. 모든 수치는 docs/02_data.md → src/data/numbers.js 상수." → src/뿐 아니라 코드 전반 적용.

3.2.5. 부수 메모(게이트 외, 백로그 후보):
- tests/suites/hash.test.js L13: `0xFFFFFFFF` 32비트 unsigned 최댓값 → 알고리즘 출력 범위 검증식. 게이트 통과(검증 가이드).
- tests/suites/hash.test.js L24,27: `8`, `[0-9a-f]{8}` ← BOX_ID_HEX_LENGTH=8 의미. SSOT 회귀 회로 성격이라 통과 처리하되 일관성 측면 백로그 후보.
- styles/main.css:47 `color: #1f2937;` ← COLOR_RESULT_NORMAL=#1F2937 의미 인라인. 검증 지시문 명시 "CSS 인라인 hex 는 본 게이트 항목이 아니므로 결함 처리 안 함". 백로그 후보.

## 3.3. data/numbers.js export 키 = 02_data 1장 정의 키 정합

3.3.1. 02_data 1장 키 → numbers.js export 정합 매트릭스:

| 02_data 위치 | 키 | numbers.js export | 정합 |
|---|---|---|---|
| 1.1 | STORAGE_KEY_PREFIX | L5 | O |
| 1.1 | DEFAULT_SEED_FALLBACK_BITS | L6 | O |
| 1.1 | BOX_ROUND_INITIAL | L7 | O |
| 1.1 | SCHEMA_VERSION | L8 | O |
| 1.2 | PRNG_NAME | L11 | O |
| 1.2 | PRNG_OUTPUT_BITS | L12 | O |
| 1.2 | PRNG_OUTPUT_DIVISOR | L13 | O (derive: `Math.pow(2, PRNG_OUTPUT_BITS)`) |
| 1.2 | BOX_ID_HEX_LENGTH | L14 | O (derive: `PRNG_OUTPUT_BITS / 4`) |
| 1.3 | DC_POOL_SIZE_DEFAULT | L17 | O |
| 1.3 | DC_POOL_SIZE_NOTE_KO | L18 | O |
| 1.4.1 | LINEUP_ID | L21 | O |
| 1.4.1 | LINEUP_TITLE_JA | L22 | O |
| 1.4.1 | LINEUP_TITLE_KO | L23 | O |
| 1.4.1 | LINEUP_IP | L24 | O |
| 1.4.1 | LINEUP_OPERATOR | L25 | O |
| 1.4.1 | LINEUP_RELEASE_DATE_STORE | L26 | O |
| 1.4.1 | LINEUP_END_DATE | L27 | O |
| 1.4.1 | LINEUP_OUTLETS | L28 | O |
| 1.4.1 | LINEUP_PRICE_JPY | L29 | O |
| 1.4.1 | BOX_SIZE | L30 | O |
| 1.4.1 | BOX_SIZE_ESTIMATED | L31 | O |
| 1.4.2 | TIERS | L34-46 | O (11행 정합, 등급 라벨 / 매수 / 종 수 / nameJa / nameKo / sizeLabel) |
| 1.4.2 | TIERS_COUNT_ESTIMATED | L47 | O |
| 1.4.3 | DC_PRIZE_NAME_JA | L50 | O |
| 1.4.3 | DC_PRIZE_NAME_KO | L51 | O |
| 1.4.3 | DC_WINNERS_TOTAL | L52 | O |
| 1.4.3 | DC_PRIZE_NOTE_KO | L53 | O |
| 1.4.4 | LINEUP_SOURCES | L56-61 | O (4 출처 정합) |
| 1.4.5 | LINEUP | L65-87 | O (id/titleJa/titleKo/ip/operator/releaseDateStore/endDate/outlets/priceJpy/boxSize/boxSizeEstimated/tiers/tiersCountEstimated/dc.{winnersTotal,poolSizeDefault,prizeNameJa,prizeNameKo,prizeNoteKo}/sources) |
| 1.5 | HISTORY_RECENT_LIMIT | L90 | O |
| 1.5 | PERCENT_BASE | L92 | O |
| 1.5 | PERCENT_DISPLAY_DECIMALS | L91 | O |

3.3.2. 잉여 export(02_data 정의 외) 0건. 누락 0건.

3.3.3. 부팅 정합 강제(02_data 1.4.2.1 / 01_spec 7.5): numbers.js L95-100 검증식 존재. TIER_COUNT_SUM(80) === BOX_SIZE(80). 통과.

3.3.4. 결과: 통과.

## 3.4. core/ 함수 시그니처 = 03_architecture 3장 정합

3.4.1. 시그니처 정합 매트릭스:

| 03_architecture | 코드 | 정합 |
|---|---|---|
| 3.1 `createRng(seed)` | random.js L6 `createRng(seed)` | O |
| 3.1 `nextInt(rng, max)` | random.js L17 `nextInt(rng, max)` | O |
| 3.2 `fnv1a(str)` | hash.js L9 `fnv1a(str)` | O |
| 3.2 `boxId(seed, boxRound)` | hash.js L18 `boxId(seed, boxRound)` | O |
| 3.3 `initBox(seed, boxRound, lineup)` | box.js L11 `initBox(seed, boxRound, lineup)` | O |
| 3.3 `remaining(boxState)` | box.js L45 `remaining(boxState)` | O |
| 3.3 `isLastDraw(boxState)` | box.js L50 `isLastDraw(boxState)` | O |
| 3.4 `drawOne(boxState, rng, lineup)` | draw.js L16 `drawOne(boxState, drawRng, lineup)` | O |
| 3.5 `lastOnePrize(lineup)` | last_one.js L6 `lastOnePrize(lineup)` | O |
| 3.6 `addTicket(tickets, ticket)` | double_chance.js L5 `addTicket(tickets, ticket)` | O |
| 3.6 `drawDc(tickets, rng, winnersTotal, poolSize)` | double_chance.js L12 `drawDc(tickets, rng, winnersTotal, poolSize)` | O |
| 3.7 `appendHistory(history, entry)` | history.js L5 `appendHistory(history, entry)` | O |
| 3.7 `tierCounts(history)` | history.js L10 `tierCounts(history)` | O |

3.4.2. main.js의 lineup 인자 전달 검증(2차 라운드 D-R2-3 수정 사항):

| 위치 | 호출 | lineup 인자 |
|---|---|---|
| L48 ensureBoxState | `initBox(s.seed, s.boxRound, LINEUP)` | O |
| L94 dispatch.draw | `drawOne(state.boxState, drawRng, LINEUP)` | O |
| L127 dispatch.reset_box | `initBox(state.seed, state.boxRound, LINEUP)` | O |
| L148 dispatch.set_seed | `initBox(state.seed, state.boxRound, LINEUP)` | O |
| L166 dispatch.draw_dc | `drawDc(state.dcTickets, dcRng, DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT)` | O (lineup 인자 없는 시그니처) |

3.4.3. drawOne 내부의 Last One 호출 (draw.js L42): `lastOnePrize(lineup)` lineup 인자 정합. O.

3.4.4. 결과: 통과.

## 3.5. 의존성 규칙

3.5.1. 03_architecture 2.1~2.6 검사:

| 룰 | 검사 결과 |
|---|---|
| 2.1 core/ → DOM/Canvas/window/document/localStorage import 0개 | 통과 (3.1 항목) |
| 2.2 render/ → core/, data/, input/ import 가능, 역방향 금지 | 통과. core/render/* import 0건. |
| 2.3 data/numbers.js / colors.js → 외부 의존 없음 | 통과. numbers.js는 import 0건. colors.js는 import 0건. |
| 2.4 data/storage.js → localStorage 직접 접근, core/ 호출 금지 | 통과. storage.js는 numbers.js만 import. core/ → storage.js import 0건. render/main.js만 storage 호출. |
| 2.5 input/ → core/ 직접 호출 금지 | 통과. input/keyboard.js는 import 0건, render/main.js가 attachKeyboard 호출 후 core 호출 위임. |
| 2.6 모든 import 상대경로 + .js 확장자 | 통과. src/ 전수 import에서 `from "./..."` / `from "../..."` + `.js` 명시. |

3.5.2. 결과: 통과.

## 3.6. 라인업 SSOT 정합

3.6.1. 02_data 1.4 라인업 데이터의 SSOT 흐름:
- numbers.js LINEUP 객체가 1.4.5 derive 정의 정확히 반영.
- core/box.js initBox는 `lineup.tiers` / `lineup.boxSize` 사용. LINEUP.tiers / LINEUP.boxSize 정합.
- core/draw.js drawOne은 `lineup.tiers` 사용. 정합.
- core/last_one.js lastOnePrize는 `lineup.tiers` 사용 + "Last One" 라벨 검색. 정합.
- main.js의 모든 core 호출이 LINEUP 객체 단일 인자로 전달. M2~M5 다중 라인업 확장 시 LINEUP 교체만으로 코어 재사용 가능 구조. 정합.

3.6.2. UI 라벨:
- header.js: LINEUP_TITLE_KO + LINEUP_PRICE_JPY + BOX_SIZE_ESTIMATED → 추정 배지 트리거. 정합.
- settings-tab.js: LINEUP_TITLE_KO/JA, IP, OPERATOR, PRICE, BOX_SIZE/_ESTIMATED, TIERS_COUNT_ESTIMATED, RELEASE/END_DATE, OUTLETS, SOURCES 모두 import 정합.
- estimated-badge.js: LINEUP_SOURCES 모달 표시. 정합.
- dc-tab.js: DC_WINNERS_TOTAL / DC_POOL_SIZE_DEFAULT / DC_POOL_SIZE_NOTE_KO / DC_PRIZE_NAME_KO/JA / DC_PRIZE_NOTE_KO 모두 import 정합.
- tier-grid.js / history-tab.js: TIERS / TIER_COLORS import 정합.

3.6.3. 결과: 통과.

## 3.7. 결정론

3.7.1. 박스 셔플 결정론:
- box.js L30: `shuffleSeed = ((seed >>> 0) ^ fnv1a(id)) >>> 0`. id는 boxId(seed, boxRound)이므로 (seed, boxRound)에 결정.
- L31: `rng = createRng(shuffleSeed)`. Fisher-Yates 셔플 결정론.
- 검증: tests/suites/box.test.js "같은 (시드, 회차) → 같은 deck 순서" + "다른 시드 → 다른 deck 순서" + "다른 회차 → 다른 deck 순서".

3.7.2. 추첨 종 인덱스 결정론:
- main.js L93: `drawRng = createRng(fnv1a(`${state.seed}|${state.boxRound}|${drawIndex}`))`. (seed, boxRound, drawIndex) 결정.
- 매 추첨마다 신규 RNG → 추첨 순서 무관 결정론. 6.5 시나리오 재현 보장.

3.7.3. 박스 회차 룰 (01_spec 5.7.4):
- 박스 리셋: main.js L126 `state.boxRound += 1`. 정합.
- 시드 변경: main.js L147 `state.boxRound = BOX_ROUND_INITIAL`. 정합. 6.5 시나리오 (시드 재입력 → 첫 박스 재현) 보장.

3.7.4. DC 추첨 RNG (main.js L165):
- `dcRng = createRng(fnv1a(`dc|${state.seed}|${Date.now()}|${state.dcResults.length}`))` ← Date.now() 포함.
- 비결정론. 그러나 DC는 사용자 명시 트리거 + 1회 시행 + 결정론 요구는 박스 추첨에 한정 (01_spec 5.7). 게이트 외. 백로그 후보.

3.7.5. 결과: 통과.

## 3.8. Last One / Double Chance 메커닉

3.8.1. Last One (01_spec 5.4):
- box.js L18-21: `if (t.tier === LAST_ONE_TIER_LABEL) continue` → deck에 Last One 미포함. 5.4.4 79매 셔플 정합.
- box.js L23-27: `labels.length !== lineup.boxSize - 1` 검증식 → boxSize 80 - 1 = 79 강제. 정합.
- draw.js L25 `wasLast = isLastDraw(boxState)` → deck.length === 1 검사.
- draw.js L33-44: wasLast 분기에서 drawnCount += 2 + isLastOne: true + lastOnePrize(lineup) 첨부. 5.4.2 / 5.4.3 정합.
- main.js L115-119: result.isLastOne 분기에서 last-one-modal vs result-modal 표시. 5.4.3 합산 모달 정합.
- last_one.js: lineup.tiers 검색 → "Last One" 행 → { tier, typeIndex: 0, nameJa, nameKo, sizeLabel } 반환. 5.4.2 정합.

3.8.2. Double Chance (01_spec 5.5):
- main.js L108-112: 매 추첨마다 addTicket으로 응모권 누적. 5.5.1 정합. ticket = { boxId, drawIndex, time }. 5.5.2 정합.
- double_chance.js L12-32 drawDc: 빈 응모권 throw, p = winnersTotal / poolSize, probWin = 1 - (1-p)^N, rng() < probWin 베르누이 1회. 5.5.5 / 5.5.6 정합.
- main.js L166: drawDc(dcTickets, dcRng, DC_WINNERS_TOTAL=50, DC_POOL_SIZE_DEFAULT=5000) 호출. 02_data 1.3 / 1.4.3 정합.
- dc-tab.js: 시행 확률 표시(formatPercent), 응모권 0건 시 disabled, 결과 이력 표시. 5.5.3 정합.

3.8.3. 결과: 통과.

## 3.9. 사행성 / 절대 규칙

3.9.1. 금지어 src/ 전수 grep:
- `필승` 0건
- `확률 향상` 0건
- `대박` 0건
- `잭팟` 0건
- `당첨 보장` 0건
- `보장` 0건
- `반드시` 0건
- `행운` 0건 (CLAUDE.md / docs / pipeline 메타 외)
- `도박` 단어는 `disclaimer-sheet.js` / `settings-tab.js`의 면책 카피("도박성 권유가 아닙니다")로만 등장. 부정 표현으로만 사용 → 정합.

3.9.2. 면책 카피 (CLAUDE.md 4.6 정합):
- disclaimer-sheet.js: "수집 / 완주 경험 목적이며 사행성 / 도박성 권유가 아닙니다"
- settings-tab.js: 동일 카피 + "실제 추첨이 아니며 상품이 실물로 지급되지 않습니다" + "추정값일 수 있습니다"

3.9.3. Math.random() src/ 전수: 0건. 모든 난수 createRng(seed) 경유.

3.9.4. 결과: 통과.

## 3.10. 테스트 커버리지

3.10.1. suite 매트릭스 (03_architecture 1장 폴더 구조 정합):

| 03_architecture | tests/suites/ | 존재 | 핵심 검증 |
|---|---|---|---|
| core/random.js | random.test.js | O | 결정론 / [0,1) 범위 / nextInt 범위 / invalid throw |
| core/hash.js | hash.test.js | O | fnv1a 결정론 / 32비트 범위 / boxId 결정론 + 8자리 hex |
| core/box.js | box.test.js | O | initBox deck=BOX_SIZE-1 / 결정론 / remaining / isLastDraw |
| core/draw.js | draw.test.js | O | 79+1 박스 종료 / 등급별 매수 정합 / 결정론 / typeIndex 범위 / Last One 단일 / lastOnePrize 첨부 / 빈 박스 throw |
| core/last_one.js | last_one.test.js | O | TIERS Last One 행 정합 |
| core/double_chance.js | double_chance.test.js | O | addTicket 누적 / 빈 throw / probability 식 정합 / win/miss 분기 / invalid throw |
| core/history.js | history.test.js | O | appendHistory 누적 / tierCounts / Last One 동시 카운트 / 빈 history |
| data/storage.js | storage.test.js | O | isStorageAvailable / loadState 구조 / saveState round-trip / clearAll |

3.10.2. 03_architecture 1장 8개 suite 모두 존재. 누락 0건.

3.10.3. 결과: 통과.

# 4. 발견 결함 / 모순

## 4.1. 결함 목록

### 4.1.1. [P2] tests/suites/double_chance.test.js: SSOT 우회 매직 넘버

| 항목 | 값 |
|---|---|
| 위치 | `tests/suites/double_chance.test.js` L14, L18-22, L29, L45-47 |
| 룰 | CLAUDE.md 4.2 "매직 넘버 금지. 모든 수치는 docs/02_data.md → src/data/numbers.js 상수." |
| 위반 | 50 / 5000 / 80을 인라인 직접 사용. SSOT(`DC_WINNERS_TOTAL`=50, `DC_POOL_SIZE_DEFAULT`=5000, `BOX_SIZE`=80) 우회. |
| 비교 | 같은 디렉토리의 box.test.js / draw.test.js / last_one.test.js는 `BOX_SIZE`, `LINEUP`, `TIERS` 정상 import. 일관성 결함. |
| 영향 | 02_data SSOT 키 값이 변하면 테스트가 자동 갱신되지 않고 사일런트 실패 가능. |
| 수정안 | `import { DC_WINNERS_TOTAL, DC_POOL_SIZE_DEFAULT, BOX_SIZE } from "../../src/data/numbers.js";` 추가 후 인라인을 상수 참조로 치환. invalid 검증의 0/-1은 boundary input이므로 인라인 유지 가능. |

## 4.2. 모순 목록

없음.

## 4.3. 백로그 후보 (게이트 외)

- B-1: `tests/suites/hash.test.js`의 `8` 인라인 → `BOX_ID_HEX_LENGTH` import. 회귀 회로 성격이라 게이트 외이지만 일관성 측면 가치.
- B-2: `styles/main.css:47` `color: #1f2937;` → COLOR_RESULT_NORMAL 동의어. CSS 토큰 또는 CSS 변수로 추출. 검증 지시문 명시 게이트 외.
- B-3: `main.js` DC 추첨 RNG의 Date.now() 포함. 결정론 요구 외이지만 시드 기반 재현이 가능하면 디버그 / QA 시 도움.

# 5. 단계 7 진입 권고

5.1. 결함 1건(4.1.1)은 P2 수준이며 1줄 import + 인라인 치환으로 해결 가능. 자동 재시도 1회 후 단계 7 진입 권고.

5.2. 통과 게이트 (모순 0 + 결함 0) 미달 → 본 라운드는 fail. 사용자에게 정정 후 4차 라운드 또는 핸드오프 결정 위임.

5.3. 정정 후 재검증 항목은 4.1.1 단일 (다른 9개 항목은 통과 확정).

# 6. 변경 이력

6.1. 2026-05-02: M1 단계 6 impl_review 3차 라운드 격리 검증. 결함 1건(double_chance.test.js SSOT 우회) 외 9개 항목 통과.
