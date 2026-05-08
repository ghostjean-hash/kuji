# M3 second-lineup - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3-second-lineup |
| 시작일 | 2026-05-08 |
| 단계 | 1 plan |
| 상태 | 작성 완료, 사용자 승인 대기 |
| 추정 | 4.0일 (라인업 1.0 + 인터페이스 1.5 + 정리 0.5 + 자산 0.5 + 검증 0.5) |

# 1. 한 줄

두 번째 라인업 `一番くじ ワンピース MONKEY.D.LUFFY-冒険の記憶と未来への航路-`(2026-05-02 발매, 박스 80매, 791엔, 9등급 + Last One) 추가 + 다중 라인업 인터페이스 보강(라인업별 데이터 격리 + 설정 탭 드롭다운 전환) + M2.1 정리 라운드(P2 6건) 흡수 + 자산 정책 정합. 시드 결정론과 8단계 파이프라인 정합 유지.

# 2. 사용자 결정 사항 (선행 합의)

| 결정 | 선택 | 비고 |
|---|---|---|
| 라인업 전환 UI | **(A) 설정 탭 드롭다운** | settings-tab에 'Lineup' 섹션 + dropdown. 전환 시 확인 모달. |
| 데이터 격리 정책 | **(A) 라인업별 공간 격리** | history / inventory / DC 모두 라인업별 독립. 전환 시 해당 라인업 공간으로 이동. 수집가 경험 보존. |
| M2.1 정리 라운드 | **(A) M3 별도 단계로 포함** | 추정 0.5일. 다중 라인업 인프라 작업과 자연 교차. |
| 자산 정책 (가설) | **placeholder 흐름 답습 (M2.1 4.13.12 정합)** | 라이선스 클린 raster (사용자 외부 도구 생성). M2.1과 동일 구조: numbers.js의 PRODUCT_IMAGE_BASE_PATH를 라인업별로 분기. |
| 진행 중 박스 처리 | **현재 라인업 박스 보존, 전환 시 휴면** | 라인업 A에서 박스 30매 진행 중 → 라인업 B 전환 → 라인업 A로 복귀 시 30매 그대로 이어서. |
| skip_pick 영속 | **전역 1개 (현행 유지)** | 라인업별이 아닌 사용자 선호. 라인업 전환과 무관. |

# 3. 스코프 (in scope)

## 3.1. 두 번째 라인업 데이터 추가

3.1.1. **라인업 SSOT 분리**: `02_data 1.4`를 라인업 1개 정의에서 라인업 N개 정의로 확장. 신규 절: `1.4.A` 드래곤볼 (현행) / `1.4.B` 원피스. 또는 배열 구조로 통합 (3.1.2 결정).

3.1.2. **LINEUP 객체 단수 → LINEUPS 배열 + currentLineupId**:
- `LINEUPS = [LINEUP_DRAGONBALL, LINEUP_ONEPIECE]`.
- `currentLineupId` state (영속) → 활성 라인업 도출.
- 03_architecture core 함수가 받는 `lineup` 인자는 그대로 (lineup 객체 1개씩). 호출처가 `currentLineupId`로 lookup.

3.1.3. **원피스 라인업 메타** (`research/lineups.json` 정합):
- `LINEUP_ONEPIECE_*`: id `ichiban_onepiece_luffy_2026_05`, title_ja "一番くじ ワンピース MONKEY.D.LUFFY-冒険の記憶と未来への航路-", price 790엔, box 80매 (estimated), 9등급 + Last One.
- 등급별 매수: A(1) / B(2) / C(2) / D(3) / E(4) / F(6) / G(12) / H(16) / I(33) + Last One(1) = 79 + 1 = 80. 합 정합.
- DC: winners_total 100명 (드래곤볼 50명 대비 차이).

3.1.4. **등급 색 라인업별 분리**: `colors.js` `TIER_COLORS`를 라인업별 분리 또는 공통 사용. **권장**: 등급(A~J) → 색은 보편 표준 (기존 그대로). 라인업별 IP 색 액센트는 별도 토큰 (예: ONE_PIECE 빨강 톤).

## 3.2. 다중 라인업 인프라 (CB-1)

3.2.1. **core 함수 시그니처 정합**:
- `core/box.initBox(seed, round, lineup)` - 변경 없음 (이미 lineup 인자 받음).
- `core/draw.drawOne(boxState, rng, lineup, pickIndex?)` - 변경 없음.
- `core/history.tierCounts(history, lineup)` - **lineup 인자 추가** (M1 OP-2 / M3 CB-1).
- `core/double_chance.drawDc(tickets, rng, winnersTotal, poolSize)` - winnersTotal을 lineup.dc.winnersTotal로 전달 (호출처 변경).

3.2.2. **box.id에 lineup_id 포함**: `${lineup.id}|${seed}|${round}` → fnv1a → 8 hex. 라인업 전환 + 동일 시드 + 동일 회차의 박스가 별도 식별. history entry의 boxId 계산도 정합.

3.2.3. **storage 라인업 격리**:
- 옵션 A1 (권장): localStorage 키에 라인업 prefix. 예: `kuji_history_${lineup_id}` / `kuji_unopened_tickets_${lineup_id}` / `kuji_box_state_${lineup_id}` / `kuji_box_round_${lineup_id}` / `kuji_dc_tickets_${lineup_id}` / `kuji_dc_results_${lineup_id}`. 전역 키: `kuji_seed`, `kuji_settings_skip_pick`, `kuji_meta`, `kuji_current_lineup_id`.
- 옵션 A2: 단일 JSON 키에 라인업별 객체 중첩. 예: `kuji_state = {lineup_id: {history, inventory, ...}}`. 단일 fetch 효율적이나 마이그레이션 복잡.
- **3.2.3 결정 = 단계 2 design 시 사용자 명시 결정**.

3.2.4. **storage 마이그레이션 v3 → v4**:
- v3 (현재): 단일 라인업 가정. 키들이 평면.
- v4 (M3): 옵션 A1이면 기존 키들을 `${lineup_id}=드래곤볼`로 마이그레이션 + `kuji_current_lineup_id = "ichiban_dragonball_chronicle_2026_05"` 신설.
- 멱등 정합: 이미 v4면 미적용.
- `SCHEMA_VERSION = 4` 갱신.

## 3.3. 라인업 전환 UI (사용자 결정 A)

3.3.1. **설정 탭 'Lineup' 섹션 신설**:
- 라인업 N개 dropdown (`<select>` 또는 커스텀 라디오 리스트).
- 현재 라인업 선택 표시.
- 전환 시 확인 모달: "라인업을 전환합니다. 현재 라인업 데이터(박스 / 인벤토리 / 이력 / DC)는 보존됩니다."

3.3.2. **dispatch.set_current_lineup**:
- `dispatch({type: 'set_current_lineup', lineupId: string})`.
- main.js: `state.currentLineupId = lineupId` + 새 라인업 공간으로 state 리셋 (재로드) → rerender.
- pendingPeelResult / selectedGridIndices 메모리 only state는 폐기.

3.3.3. **헤더 라인업 표시 (정보성)**:
- 헤더에 현재 라인업 짧은 라벨 (예: "DRAGONBALL" / "ONE PIECE"). 클릭 = 설정 탭 점프 (옵션, 단계 2 결정).

## 3.4. 자산 정책 (M2.1 4.13.12 답습)

3.4.1. **placeholder 우선**: 라이선스 위험 회피. 사용자 외부 도구 (Midjourney 등) 생성. 라인업별 폴더.

3.4.2. **폴더 / 키 정책**:
- 드래곤볼: `the_chronicle_of_goku_placeholder/{A,B,C,D,E,F,Z}.webp` (M2.1 4.13.12).
- 원피스: `monkey_d_luffy_placeholder/{A,B,C,D,E,F,G,H,I,Z}.webp` 또는 단순화 (단계 2 결정).
- assets.js의 `PRODUCT_IMAGE_BASE_PATH` → 라인업별 (lineup.assetsBasePath 필드).
- 라인업 객체에 `assetsBasePath` / `assetsAvailable` 필드 추가.

3.4.3. **단계 5 시점에 자산 부재 허용**: M2.1처럼 SVG fallback 또는 placeholder gray. `data_status` 플래그로 자산 미배치 라인업도 시뮬레이터 동작 정합.

## 3.5. M2.1 정리 라운드 (P2 6건 흡수)

| # | 항목 | 작업 |
|---|---|---|
| 3.5.1 | `buildConsumedGridSet` core 분리 | render/main.js → `core/pick-grid.js` 신설. 단위 테스트 import 경로도 갱신. CLAUDE.md 4.1 (게임 로직 / 렌더 분리) 정합. |
| 3.5.2 | `dispatch.pick_hint_seen` handler 제거 | main.js dead 분기 제거. dispatch type 자체도 삭제. |
| 3.5.3 | `04_impl_plan.md` `pendingPickResult` 잔존 정리 | M2.1 단계 4 SSOT의 폐기 식별자 정정 (역사 정합 위해 strikethrough + B-α 흡수 노트 추가). |
| 3.5.4 | `pick-slot.js` `LAST_ONE_PENDING/DRAWN` dead export 제거 | export const + 분기 코드 제거. 5상태 → 3상태 축소. |
| 3.5.5 | `numbers.js` `PICK_FIRST_HINT_*` dead export 제거 | numbers.js + 02_data 1.12 dead 행 제거 (deprecated 표기 → 완전 제거). |
| 3.5.6 | spec 6.5 시나리오 표현 명확화 | round 5 design_review 권고 흡수. |

## 3.6. CB-2 (M3 합산 - 인라인 hex → tokens.css)

3.6.1. styles/main.css 인라인 hex 잔존 grep → tokens.css 변수화. 라이브 정정 라운드 도입분 흡수.

## 3.7. 6.2.12 흡수 (gridIndex 의무 기록)

3.7.1. **모든 draw 경로에 gridIndex 의무 기록**:
- 현행: skip ON 흐름 history entry의 gridIndex = null. placeholder 충당 (4.14.7 buildConsumedGridSet).
- M3: skip ON에서도 head pop 시점에 splice(0)의 gi (= 잔여 격자 첫 번째 위치)를 history에 기록.
- 효과: placeholder 충당 폐기 + buildConsumedGridSet 단순화 (history.gridIndex만으로 정합).
- 단계 2 design 시 정확한 알고리즘 명시 필요.

## 3.8. 단계 6 검증 룰 보강 (M3 흡수)

PROGRESS 6.2.6~6.2.15 학습이 M2.1 단계 6에서 모두 흡수됨. M3는 신규 학습 없으면 동일 룰 유지.

추가 검증 항목 (M3 한정):
- **3.8.1 라인업 격리 검증**: storage 키 lineup prefix 정합 + box.id 라인업 포함 정합.
- **3.8.2 currentLineupId 분기 매트릭스**: `currentLineupId` × 각 storage 키의 존재 여부 매트릭스. 라인업 전환 시 데이터 손실 0건 보장.
- **3.8.3 등급 수 가변성 검증**: 드래곤볼 10등급 vs 원피스 9등급. core 함수 / render 모듈이 등급 수에 의존하지 않는지 grep.

# 4. 비목표 (out of scope)

4.1. **천장 룰** (XENOGLOSSIA 30연 S賞 확정) → M4.
4.2. **13등급 확장 검증** (PIXAR) → M4.
4.3. **온라인 잔여 카운터 UI** (SEGA 럭키쿠지) → M5.
4.4. **3개 이상 라인업** - M3은 2개 라인업 인프라만 검증. N=3 이상은 M4+에서 자연 확장.
4.5. **라인업별 종횡비 통 격자** - M2.1 1.5.5 후보. M3 후반 또는 M4.
4.6. **라인업별 등급 색 분리** - 보편 표준 유지 (3.1.4).
4.7. **헤더 라인업 표시 강한 인터랙션** - 정보성 라벨까지만 (3.3.3). swipe 등은 M4+.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (02_data 1.4 라인업 배열 + 3.x storage v4 + 1.7 자산 정책) | 0.5일 |
| Phase 2 | 단계 3 design_review (subagent 격리, round 1~N) | 0.5일 |
| Phase 3 | 단계 4 impl_plan (03_architecture 갱신 + 04_impl_plan T 분할) | 0.5일 |
| Phase 4 | 단계 5 implement Phase A: data 추가 (LINEUPS 배열 + storage v3→v4) | 0.5일 |
| Phase 5 | 단계 5 Phase B: core 정합 (history.tierCounts(lineup) + box.id lineup 포함 + DC) | 0.5일 |
| Phase 6 | 단계 5 Phase C: render (settings-tab dropdown + dispatch.set_current_lineup + main wire-up) | 0.5일 |
| Phase 7 | 단계 5 Phase D: M2.1 정리 (3.5.1~3.5.6) + CB-2 + gridIndex 의무 기록 (3.7) | 0.5일 |
| Phase 8 | 단계 6 impl_review (subagent 격리, round 1~N) + 단계 7 QA + 단계 8 improve | 0.5일 |
| **합산** | | **4.0일** |

# 6. 데이터 흐름 (개념)

## 6.1. 라인업 전환 흐름

```
사용자 (settings-tab dropdown 변경)
  → dispatch.set_current_lineup(newLineupId)
  → main.js:
    - confirmModal 표시 → 사용자 확인
    - persistAll (현재 라인업 state 저장)
    - state.currentLineupId = newLineupId
    - state = bootstrapState(loadState(currentLineupId)) (새 라인업 공간 로드)
    - rerender
  → 사용자에게 새 라인업 박스 / 인벤토리 / 이력 / DC 표시
```

## 6.2. 영속 매핑

```
currentLineupId  → 라인업 공간 키 prefix
                → kuji_history_${lid} / kuji_unopened_tickets_${lid} / ...

전역 키 (라인업 무관):
  kuji_current_lineup_id (string. 활성 라인업)
  kuji_seed (number. 모든 라인업 공유 또는 라인업별 - 단계 2 결정)
  kuji_settings_skip_pick (boolean)
  kuji_meta (object. disclaimerSeen 등)
  kuji_schema_version (number, v4)
```

## 6.3. 마이그레이션 (v3 → v4)

```
loadState():
  if (kuji_schema_version < 4):
    detected_lineup_id = "ichiban_dragonball_chronicle_2026_05" (M2.1 단일 라인업)
    for key in [history, unopened_tickets, box_state, box_round, dc_tickets, dc_results]:
      old = localStorage.getItem(`kuji_${key}`)
      if (old) localStorage.setItem(`kuji_${key}_${detected_lineup_id}`, old)
      localStorage.removeItem(`kuji_${key}`)
    localStorage.setItem("kuji_current_lineup_id", detected_lineup_id)
    localStorage.setItem("kuji_schema_version", 4)
```

# 7. 검증 / 단위 테스트 추가

7.1. `tests/suites/storage_v4.test.js` 신설: v3 → v4 마이그레이션 + 라인업별 격리 + 멱등성.
7.2. `tests/suites/lineup_isolation.test.js` 신설: box.id가 lineup_id 차이로 다르게 산출되는지 + history.tierCounts(lineup) 정합.
7.3. 기존 suite의 `lineup` 인자 전달 grep 보강 (단계 6 게이트 5.6에 lineup 정합 항목 추가).

# 8. 사용자 결정 게이트 (단계 1 → 단계 2)

본 plan 승인 후 단계 2 design 진입. 단계 2 시점에 결정 필요한 추가 사항:

8.1. **storage 옵션 A1 vs A2** (3.2.3): 라인업 prefix vs 단일 JSON 중첩.
8.2. **kuji_seed 라인업 공유 vs 분리**: 모든 라인업이 같은 seed면 결정론 비교 가능 / 분리면 각 라인업 독립 시드.
8.3. **헤더 라인업 표시 (3.3.3)**: 라벨만 vs 클릭 점프.
8.4. **라인업 X 자산 미배치 시 placeholder 정책** (3.4.3): SVG fallback vs gray + "자산 준비 중" 텍스트.

# 9. 위험 / 회피

9.1. **결정론 회귀**: lineup이 box.id에 포함되지 않으면 시드 동일 + 라인업만 다른 박스가 같은 id로 충돌. **회피**: 3.2.2 정합 + storage_v4 테스트.
9.2. **마이그레이션 손실**: v3 → v4 시 키 이동 실패하면 사용자 데이터 손실. **회피**: 3건 부분 적용 시 롤백 가능하도록 임시 백업 키 + 멱등성 + 단위 테스트.
9.3. **자산 부재 시 깨진 화면**: 원피스 자산 미생성 시 placeholder 부재. **회피**: SVG fallback (M2.1 1차 SVG 자산 그대로 사용 가능).
9.4. **라인업 전환 중 진행 중 상태**: pendingPeelResult / selectedGridIndices 메모리 only가 전환 시 폐기되는 게 정합. confirmModal에서 사용자 명시.
9.5. **등급 수 가변성**: 원피스 9등급 vs 드래곤볼 10등급. UI render 모듈이 `LINEUP.tiers.length`로 동적 처리해야 함. 하드코딩 grep (3.8.3).

# 10. 변경 이력

10.1. 2026-05-08: M3 단계 1 plan 작성. 사용자 결정 3건 선행 합의 (전환 UI A / 격리 정책 A / 정리 라운드 A). 추정 4.0일.
