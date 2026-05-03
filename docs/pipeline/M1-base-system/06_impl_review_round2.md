# M1 base-system - 06 구현 검증 (Round 2)

| 항목 | 값 |
|---|---|
| 스프린트 ID | M1-base-system |
| 단계 | 6 impl_review (2차 라운드) |
| 작성일 | 2026-05-02 |
| 검증 모드 | docs / 코드 격리 검증 (1차 보고서 미참조) |
| 게이트 | 모순 0 + 결함 0 |
| 결과 | **FAIL** (결함 2건, 모순 1건) |

# 1. 요약

1.1. core/ DOM import 0개, numbers.js export 키 = 02_data 1장 정의 키, lineup SSOT 정합, 결정론, Last One / Double Chance 메커닉, 사행성 절대 규칙은 모두 통과.
1.2. **render/main.js의 reset_box / set_seed 분기에서 `initBox`에 `LINEUP` 인자가 누락**되어 박스 리셋 / 시드 변경 시 즉시 throw. 03_architecture 3.3 시그니처 위반 + 런타임 결함. 1순위 차단 항목.
1.3. **render/history-tab.js:50의 인라인 fallback hex `"#94a3b8"`**가 매직 값 0개 게이트 위반 + CLAUDE.md 6.3 위반.
1.4. core/random.js의 Mulberry32 분모 `4294967296` 매직 넘버 (PRNG 알고리즘 상수, 02_data 1.2 미정의). 경계선 사례지만 02_data 1.2가 `PRNG_OUTPUT_BITS`만 명시하고 `2^N` 분모 상수를 따로 두지 않은 점에서 일관성 결손.
1.5. 게이트 통과 = 본 검증에서 차단. 사용자 핸드오프 또는 단계 5 정정 후 3차 재검증 권고.

# 2. 검증 항목별 상세

## 2.1. 항목 1 - core/ DOM import 0개 (CLAUDE.md 4.3) - PASS

2.1.1. `src/core/*.js` 7개 (random / hash / box / draw / last_one / double_chance / history) 전수 grep:
- `document` / `window` / `localStorage` / `Canvas` 코드 사용: 0건.
- `random.js:2` 의 주석 1건만 매칭 (코드 영향 없음).

2.1.2. import 분석:
- `core/random.js`: 외부 import 0.
- `core/hash.js`: 외부 import 0.
- `core/box.js`: `./random.js`, `./hash.js` (core 내부).
- `core/draw.js`: `./random.js`, `./box.js`, `./last_one.js` (core 내부).
- `core/last_one.js`: 외부 import 0.
- `core/double_chance.js`: `../data/numbers.js` (03_architecture 2.3 허용).
- `core/history.js`: `../data/numbers.js` (03_architecture 2.3 허용).

2.1.3. 03_architecture 2.4 "core/는 storage 호출 금지" 위반 0건. data/storage.js 호출 0건.

## 2.2. 항목 2 - 매직 넘버 0개 (CLAUDE.md 4.2) - FAIL

2.2.1. **결함 D-R2-1**: `src/core/random.js:11` Mulberry32 출력 정규화 분모 `4294967296` (= 2^32).
- 인용:
  ```js
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  ```
- 02_data 1.2에는 `PRNG_OUTPUT_BITS = 32`만 정의되며 `2^32` 분모는 별도 키로 명시되지 않음. 코드는 `PRNG_OUTPUT_BITS`를 import 안 함.
- CLAUDE.md 4.2 "매직 넘버 금지. 모든 수치는 docs/02_data.md → src/data/numbers.js 상수" 위반.
- 03_architecture 5.1 "단순 인덱스(0, 1) / 산술 항등(매수 비교) 외 매직 값 0개" 룰 적용 시, `4294967296`은 단순 인덱스도 산술 항등도 아닌 알고리즘 정규화 상수. 의견: PRNG 표준 알고리즘 상수는 일반 룰의 예외로 인정될 여지가 있으나, 02_data 1.2가 이미 `PRNG_OUTPUT_BITS` 키를 정의한 이상 정합 비용은 1줄 수정 (`Math.pow(2, PRNG_OUTPUT_BITS)`)이므로 정정이 합리적.
- 권고 수정안:
  ```js
  // src/core/random.js
  import { PRNG_OUTPUT_BITS } from "../data/numbers.js";
  const PRNG_DIVISOR = Math.pow(2, PRNG_OUTPUT_BITS);
  // ...
  return ((t ^ (t >>> 14)) >>> 0) / PRNG_DIVISOR;
  ```

2.2.2. core/random.js:9-10 의 `15`, `7`, `61`, `14`, `1`은 Mulberry32 알고리즘 정의 상수 (Tommy Ettinger 표준). 02_data에 정의 없으나 알고리즘 자체의 식 일부로 해석 가능. **알고리즘 상수 예외**로 간주, 결함 처리 안 함.

2.2.3. core/hash.js:3-4 `0x811c9dc5`, `0x01000193` (FNV-1a 32비트 표준 상수). 알고리즘 상수 예외. 결함 처리 안 함.

2.2.4. **결함 D-R2-2**: `src/core/hash.js:17` `padStart(8, "0")` 의 `8`.
- 인용:
  ```js
  return fnv1a(key).toString(16).padStart(8, "0");
  ```
- 의미: 32비트 hex = 8 자리. `8`은 `PRNG_OUTPUT_BITS / 4` 산술 항등. 02_data 1.2에 정의된 `PRNG_OUTPUT_BITS = 32`로 derive 가능하나 코드는 직접 import 안 하고 인라인 8 사용.
- 의견: 03_architecture 5.1의 "산술 항등(매수 비교) 외 매직 값 0개" 룰의 "산술 항등"이 box.js 매수 검증식만 의미하는지, 일반 산술 derive을 포함하는지 모호. 보수적으로 보면 `8`은 02_data에 정의된 `PRNG_OUTPUT_BITS`에서 derive 되어야 일관됨. 본 round 보고서에선 **모순 1건**으로 격하 (게이트 PASS 시 다음 라운드 권고).
- 권고 수정안:
  ```js
  import { PRNG_OUTPUT_BITS } from "../data/numbers.js";
  const HEX_DIGITS_PER_32BIT = PRNG_OUTPUT_BITS / 4;
  // ...
  return fnv1a(key).toString(16).padStart(HEX_DIGITS_PER_32BIT, "0");
  ```

2.2.5. `src/core/draw.js:34` `boxState.drawnCount += 2;`. 의미: deck pop 1 + Last One 자동 지급 1 = 2매. 01_spec 5.4.4 "박스 매수는 79 + Last One 1 = 80" 메커닉 항등식의 직접 표현. 인접 주석 "deck pop 1 + Last One 자동 지급 1" 명시. 산술 항등으로 인정. 결함 처리 안 함.

2.2.6. `src/render/main.js:42` `Math.pow(2, bits)` 에서 `bits`는 `DEFAULT_SEED_FALLBACK_BITS` import. 매직 0건.

2.2.7. **02_data 1.5 키 사용 정합**: `HISTORY_RECENT_LIMIT` (history-tab.js:46), `PERCENT_BASE` / `PERCENT_DISPLAY_DECIMALS` (render/format.js:5-6) 모두 import 사용 확인. PASS.

## 2.3. 항목 3 - data/numbers.js export 키 = 02_data 1장 정의 키 - PASS

2.3.1. numbers.js export const 30개 + LINEUP 1개 = 31. 02_data 1장 정의 키 전수 매칭:
- 1.1: `STORAGE_KEY_PREFIX`, `DEFAULT_SEED_FALLBACK_BITS`, `BOX_ROUND_INITIAL`, `SCHEMA_VERSION` ✅ (4/4)
- 1.2: `PRNG_NAME`, `PRNG_OUTPUT_BITS` ✅ (2/2)
- 1.3: `DC_POOL_SIZE_DEFAULT`, `DC_POOL_SIZE_NOTE_KO` ✅ (2/2)
- 1.4.1: `LINEUP_ID`, `LINEUP_TITLE_JA/KO`, `LINEUP_IP`, `LINEUP_OPERATOR`, `LINEUP_RELEASE_DATE_STORE`, `LINEUP_END_DATE`, `LINEUP_OUTLETS`, `LINEUP_PRICE_JPY`, `BOX_SIZE`, `BOX_SIZE_ESTIMATED` ✅ (11/11)
- 1.4.2: `TIERS`, `TIERS_COUNT_ESTIMATED` ✅ (2/2)
- 1.4.3: `DC_PRIZE_NAME_JA/KO`, `DC_WINNERS_TOTAL`, `DC_PRIZE_NOTE_KO` ✅ (4/4)
- 1.4.4: `LINEUP_SOURCES` ✅ (1/1)
- 1.4.5: `LINEUP` 객체 ✅ (1/1, 02_data 1.4.5 derive 표 정합)
- 1.5: `HISTORY_RECENT_LIMIT`, `PERCENT_BASE`, `PERCENT_DISPLAY_DECIMALS` ✅ (3/3)

2.3.2. 02_data 1.4.2.1 매수 합계 검증식 (01_spec 7.5) 부팅 강제: numbers.js:92-98 정합. PASS.

2.3.3. LINEUP 객체 키 = 02_data 1.4.5 표 1:1 - 13 키 전수 매칭. PASS.

## 2.4. 항목 4 - core/ 함수 시그니처 = 03_architecture 3장 정합 - PASS

2.4.1. `core/random.js`:
- `createRng(seed) → () => number`: ✅ (정의 random.js:4).
- `nextInt(rng, max) → number`: ✅ (정의 random.js:15). `[0, max)` 보장 확인.

2.4.2. `core/hash.js`:
- `fnv1a(str) → number`: ✅ (정의 hash.js:6).
- `boxId(seed, boxRound) → string`: ✅ (정의 hash.js:15, 8자리 hex 반환).

2.4.3. `core/box.js`:
- `initBox(seed, boxRound, lineup) → BoxState`: ✅ (정의 box.js:11).
- `BoxState = { id, deck: TierLabel[], drawnCount, totalSize }`: ✅ (정의 box.js:37-42).
- `remaining(boxState) → number`: ✅ (정의 box.js:45).
- `isLastDraw(boxState) → boolean`: ✅ (정의 box.js:50, deck.length === 1).

2.4.4. `core/draw.js`:
- `drawOne(boxState, rng, lineup) → DrawResult`: ✅ (정의 draw.js:16).
- DrawResult 키: `tier, typeIndex, name?(nameJa/nameKo), sizeLabel, isLastOne` ✅. 03_architecture는 `name` 단일이지만 코드는 `nameJa` / `nameKo` 분리. 사양 표현 차이지만 lineup의 일/한 동시 노출 패턴과 정합. 모순 처리 안 함.

2.4.5. `core/last_one.js`:
- `lastOnePrize(lineup) → { tier: 'Last One', name, sizeLabel }`: ✅ (정의 last_one.js:6). `name` → `nameJa` / `nameKo` 분리 + `typeIndex: 0` 추가. drawResult와 키 모양 일치 (모달 합산 시 통일된 인터페이스).

2.4.6. `core/double_chance.js`:
- `addTicket(tickets, ticket) → Ticket[]`: ✅ (불변 push, double_chance.js:5).
- `drawDc(tickets, rng, winnersTotal, poolSize) → DcResult`: ✅ (double_chance.js:12). `p = winnersTotal / poolSize`, `1 - (1 - p)^N` 정합.

2.4.7. `core/history.js`:
- `appendHistory(history, entry) → HistoryEntry[]`: ✅ (history.js:5).
- `tierCounts(history) → Record<TierLabel, number>`: ✅ (history.js:10). lineup 인자 없이 `TIERS` 직접 import. 03_architecture 3.7은 lineup 인자를 명시 안 함. 정합. 의견: M2~M5 다중 라인업 확장 시 lineup 인자 추가 후보 (현재 단계엔 영향 없음).

## 2.5. 항목 5 - 의존성 규칙 (03_architecture 2장) - PARTIAL FAIL

2.5.1. 2.1 `core/` DOM import 0개: ✅ (항목 1 참조).

2.5.2. 2.2 `render/` → `core/`, `data/`, `input/` import 가능, 역방향 금지: ✅. core/, data/는 render/를 import 안 함.

2.5.3. 2.3 `data/numbers.js` / `colors.js` 외부 의존 없음: ✅ (`storage.js`만 numbers.js 내부 import).

2.5.4. 2.4 `data/storage.js` localStorage 직접 접근, `core/` 호출 금지: ✅. core/*.js의 storage.js import 0건 검증 완료.

2.5.5. 2.5 `input/` core/ 직접 호출 금지: ✅. keyboard.js 외부 import 0건.

2.5.6. 2.6 import 상대경로 + `.js` 확장자: ✅ 전수 확인.

2.5.7. **결함 D-R2-3 (CRITICAL)**: render/main.js의 `reset_box` / `set_seed` 분기에서 `initBox` 호출 시 `LINEUP` 인자 누락.
- 인용 (`src/render/main.js:127`):
  ```js
  case "reset_box": {
    const inProgress = ...;
    const proceed = () => {
      state.boxRound += 1;
      state.boxState = initBox(state.seed, state.boxRound);  // ← LINEUP 누락
      persist();
      rerender();
    };
    ...
  }
  ```
- 인용 (`src/render/main.js:148`):
  ```js
  case "set_seed": {
    ...
    const proceed = () => {
      state.seed = Number(action.seed) >>> 0;
      state.boxRound = BOX_ROUND_INITIAL;
      state.boxState = initBox(state.seed, state.boxRound);  // ← LINEUP 누락
      ...
    };
    ...
  }
  ```
- core/box.js:12 가드:
  ```js
  if (!lineup || !Array.isArray(lineup.tiers) || typeof lineup.boxSize !== "number") {
    throw new Error("[box] invalid lineup. expected {tiers, boxSize}.");
  }
  ```
- 결과: 박스 리셋 / 시드 변경 사용자 동작이 즉시 throw. 01_spec 5.7.4 (박스 리셋 시 box_round += 1), 6.4 (박스 리셋 시나리오), 6.5 (결정론 검증 시나리오) 모두 동작 불가능.
- ensureBoxState (line 48)는 `LINEUP` 정상 전달 → 부팅은 통과 → 사용자가 설정 탭에서 박스 리셋 또는 시드 변경 누르는 순간 폭발. 1차 부팅 검증만 통과한 잠재 결함.
- 권고 수정안:
  ```js
  // line 127
  state.boxState = initBox(state.seed, state.boxRound, LINEUP);
  // line 148
  state.boxState = initBox(state.seed, state.boxRound, LINEUP);
  ```

## 2.6. 항목 6 - 라인업 SSOT 정합 - PASS

2.6.1. `numbers.js TIERS` (33-44행) vs 02_data 1.4.2 표 11 행 1:1 매칭:
- A~F: 매수 1, typeCount 1 ✅
- G: 매수 8, typeCount 8 ✅
- H: 매수 8, typeCount 8 ✅
- I: 매수 24, typeCount 10, `クリアポスター (A3)` / `클리어 포스터 (A3)` 괄호 보존 ✅ (line 41).
- J: 매수 33, typeCount 10 ✅
- Last One: 매수 1, typeCount 1 ✅
- 일본어 / 한국어 / 사이즈 전수 일치. PASS.

2.6.2. `LINEUP` 객체 키 (numbers.js:63-85) vs 02_data 1.4.5 derive 표:
- 13 키 전수 매칭 (id, titleJa/Ko, ip, operator, releaseDateStore, endDate, outlets, priceJpy, boxSize, boxSizeEstimated, tiers, tiersCountEstimated, dc, sources). PASS.
- `dc` 하위 (winnersTotal, poolSizeDefault, prizeNameJa/Ko, prizeNoteKo) 정합.

## 2.7. 항목 7 - 결정론 (01_spec 5.7.4) - PASS

2.7.1. `boxId(seed, boxRound)` 결정론: hash.js:15, FNV-1a 기반. 같은 (seed, boxRound) → 같은 id. 테스트 hash.test.js 검증 완료.

2.7.2. 셔플 시드 = `seed XOR fnv1a(id)` (box.js:30). 같은 (seed, boxRound) → 같은 셔플 순서. 테스트 box.test.js의 "같은 (시드, 회차) → 같은 deck 순서" 검증.

2.7.3. drawRng = `createRng(fnv1a(\`${seed}|${boxRound}|${drawIndex}\`))` (render/main.js:93). drawIndex별 결정론 보장. 다만 시뮬레이터 테스트는 `createRng(42)`로 단일 RNG 호출 (draw.test.js) - 두 패턴 모두 결정론.

2.7.4. 박스 리셋 → `box_round += 1` (render/main.js:126). 시드 변경 → `box_round = BOX_ROUND_INITIAL` (line 147). 01_spec 5.7.4 정합.

2.7.5. 다만 이 정합은 항목 5의 결함 D-R2-3 (LINEUP 누락 throw)으로 실제 사용자 시나리오에선 작동 불가능. 결정론은 코드 위에선 정합, 런타임에선 차단.

## 2.8. 항목 8 - Last One / Double Chance 메커닉 - PASS

2.8.1. Last One (01_spec 5.4):
- 5.4.4 "79매 셔플 + 마지막 1매 추첨 시 Last One 자동 지급. 박스 매수는 79 + Last One 1 = 80": box.js:17-21에서 deck 빌드 시 `Last One` 라벨 제외, 길이 79 검증 (line 23-27). draw.js:25 `wasLast = isLastDraw(boxState)` (deck.length === 1 시점), wasLast=true이면 `drawnCount += 2` + `lastOnePrize(lineup)` 첨부. 정합.

2.8.2. Last One의 `typeIndex: 0` (단일 종) 처리: last_one.js:18 `typeIndex: 0` 명시. lineup의 `Last One` typeCount === 1 정합.

2.8.3. Double Chance (01_spec 5.5):
- 5.5.6 `1 - (1 - p)^N` 식: double_chance.js:22-23 정합.
- 5.5.5 베르누이 1회 시행: rng() < probWin 비교 (line 24-25). 정합.
- 5.5.1 추첨 1회마다 응모권 1매 자동 누적: render/main.js:108-112 dispatch "draw" 분기에서 `addTicket` 호출. 정합.
- 5.5.4 풀 = 누적 응모권: 사용자 1인 단순화로 N매 가정 정합 (5.5.5).

2.8.4. DC 빈 응모권 throw (`tickets.length === 0`) 정합 (double_chance.js:14).

## 2.9. 항목 9 - 사행성 / 절대 규칙 (CLAUDE.md 4.6) - PASS

2.9.1. src/, styles/, index.html 전수 grep:
- `필승`, `확률 향상`, `대박`, `보장`, `당첨률`, `반드시` → 0건 매칭.
- `확정`은 1건 매칭 (settings-tab.js:62 `${TIERS_COUNT_ESTIMATED ? "추정값" : "확정"}`). 의미는 데이터 추정값 vs 확정값의 데이터 신뢰도 표현. 사행성 권유 아님. PASS.

2.9.2. 면책 안내 (disclaimer-sheet.js): "수집 / 완주 경험 목적", "사행성 / 도박성 권유가 아닙니다" 명시. 정합.

2.9.3. settings-tab의 면책 섹션 (line 85): 동일 표현 정합.

## 2.10. 항목 10 - 테스트 커버리지 - PASS

2.10.1. core 모듈 7개 + storage 1개 = 8개 모두 tests/suites/ 1:1 대응:
- random.test.js ✅
- hash.test.js ✅
- box.test.js ✅
- draw.test.js ✅
- last_one.test.js ✅
- double_chance.test.js ✅
- history.test.js ✅
- storage.test.js ✅

2.10.2. LINEUP 인자 정합:
- box.test.js: `initBox(42, 1, LINEUP)` 9건 모두 LINEUP 전달 ✅
- draw.test.js: `initBox(seed, round, LINEUP)`, `drawOne(box, rng, LINEUP)` 전건 정합 ✅
- last_one.test.js: `lastOnePrize(LINEUP)` 정합 ✅

2.10.3. 03_architecture 5.4 단위 테스트 100% pass 게이트는 본 round에서 코드 정적 분석만 수행. 자체 테스트 실행은 자비스 책임 (subagent 외 영역). 다만 2.5의 결함 D-R2-3은 render/main.js이므로 core 단위 테스트엔 영향 없음. tests/suites/* 자체는 pass 가능.

# 3. 모순 일람

| ID | 분류 | 위치 | 요약 | 우선 |
|---|---|---|---|---|
| C-R2-1 | 매직 넘버 일관성 | `src/core/hash.js:17` | `padStart(8, "0")` 의 `8`이 02_data 1.2 `PRNG_OUTPUT_BITS = 32` 에서 derive 되지 않음. 03_architecture 5.1의 "산술 항등" 룰의 적용 모호 | P2 |

# 4. 결함 일람

| ID | 분류 | 위치 | 요약 | 우선 |
|---|---|---|---|---|
| D-R2-1 | 매직 넘버 (PRNG 분모) | `src/core/random.js:11` | Mulberry32 출력 정규화 분모 `4294967296` 인라인. `PRNG_OUTPUT_BITS` 미사용 | P1 |
| D-R2-2 | 인라인 매직 hex | `src/render/history-tab.js:50` | TIER_COLORS fallback `"#94a3b8"` 인라인. CLAUDE.md 6.3 "인라인 매직 값 금지" + 02_data 색상 SSOT 우회 | P2 |
| D-R2-3 (CRITICAL) | 시그니처 위반 (런타임 차단) | `src/render/main.js:127, 148` | `initBox(state.seed, state.boxRound)` 의 `LINEUP` 인자 누락. 박스 리셋 / 시드 변경 시 즉시 throw. 01_spec 5.7.4 / 6.4 / 6.5 시나리오 동작 불가 | **P0** |

# 5. 게이트 판정

5.1. **통과 게이트**: 모순 0개 + 결함 0개.
5.2. **본 라운드 결과**: 모순 1건 + 결함 3건.
5.3. **판정**: **FAIL**.
5.4. 1차 검증에서 시그니처 정정 후 다시 발생한 결함 D-R2-3은 정정 작업의 부분 누락 (호출지 한 곳만 갱신, 다른 두 곳 미갱신) 패턴. 단계 5 정정 시 grep `initBox(` 전수 확인이 누락된 것으로 추정.

# 6. 권고

6.1. **즉시 정정 (P0)**: D-R2-3 - render/main.js:127, 148 두 줄에 `LINEUP` 인자 추가. 1줄 패치. 정정 후 단계 6 3차 라운드 재검증.

6.2. **정정 권장 (P1)**: D-R2-1 - core/random.js:11 분모를 `Math.pow(2, PRNG_OUTPUT_BITS)` 또는 모듈 상단 `const PRNG_DIVISOR = Math.pow(2, PRNG_OUTPUT_BITS)` 변환. PRNG 결정론 / 출력 검증 영향 0 (값 동일).

6.3. **정정 권장 (P2)**: D-R2-2 - render/history-tab.js:50 fallback hex를 colors.js의 토큰 또는 styles/tokens.css의 `--fg-muted` 변수 참조로 치환. 또는 fallback 자체 제거 (e.tier가 항상 TIERS 키이므로 도달 불가).

6.4. **모순 정리 (P2)**: C-R2-1 - core/hash.js:17 `padStart(8, "0")` 의 `8`을 `PRNG_OUTPUT_BITS / 4` derive로 변환. 또는 03_architecture 5.1의 "산술 항등" 룰의 정의를 강화 (보조 산술 derive 포함 여부 명시).

6.5. **추가 권장 (P3, 선택)**:
- 6.5.1. core/history.js 의 `tierCounts(history)` 가 `TIERS` 직접 import 패턴은 M2~M5 다중 라인업 확장 시 라인업별 카운트 키 집합이 달라지는 문제 발생 가능. lineup 인자 추가 후보 (M1엔 영향 없음, 백로그).
- 6.5.2. styles/main.css 의 인라인 hex (`#1f2937`, `rgba(0, 0, 0, 0.7)`)는 CLAUDE.md 6.3 strict 해석 시 위반. tokens.css 변수화 권장. 본 게이트 항목엔 미포함이라 본 round 결함 처리 안 함. (백로그 후보)

6.6. **3차 라운드 진입 권고**: D-R2-3 P0 정정 + D-R2-1 P1 정정 후 단계 6 3차 라운드. D-R2-2 / C-R2-1은 정정 권장이지만 단독 차단 사유로 보지 않음 (1차에서 1차로 격하 가능). 자비스 자동 재시도 1회 룰 (`CLAUDE.md` 2.4) 적용 시 본 라운드가 2차 시도이므로, 추가 정정에는 사용자 명시 승인 필요.

# 7. 검증 메서드 메모

7.1. 1차 보고서 미참조 (지시 준수). docs / 코드 격리.
7.2. 검증 전수 grep + 시그니처 매칭 + 03_architecture 5장 게이트 검증식 직접 적용.
7.3. 의견 항목은 `[의견]` 표시 없이 본문에 "의견:" 명시 (CLAUDE.md 3.3 정합).
7.4. 자비스 자체 테스트 실행 (브라우저 tests/test.html 실행 결과)은 본 보고서 범위 밖. 단계 6 게이트의 "자비스 자체 테스트 실행" 부분은 자비스 책임으로 분리.
