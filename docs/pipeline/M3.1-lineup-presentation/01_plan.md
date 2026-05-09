# M3.1 lineup-presentation - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.1-lineup-presentation |
| 시작일 | 2026-05-08 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 완료 (2026-05-08)**. 단계 2 design 진입 |
| 추정 | 3.0일 (로비 1.0 + tier_class 0.5 + 검증/테스트 0.5 + 단계 검증 라운드 1.0) |
| 선행 사이클 | M3-second-lineup (정식 종료, 2026-05-08) |

# 1. 한 줄

라인업 발견성과 메인 상품 가치 표현을 보강하는 후속 사이클. (1) 진입 시 라인업 선택 메인 화면("로비") 신설로 설정 탭 드롭다운에 묻혀있던 라인업 전환을 메인 흐름으로 승격. (2) tier_class(hero/main/goods) 3단계 분류 메타를 데이터 SSOT에 추가해 등급의 위상 차이를 코드 차원에서 인지. UI 변경은 로비 한정, 본편 화면(설정/뽑기/기록/DC)의 tier_class 활용은 차기 사이클로 분리.

# 2. 사용자 결정 사항 (선행 합의)

| 결정 | 선택 | 비고 |
|---|---|---|
| 두 변경 묶음 | **(A) 한 사이클로 통합** | 로비가 tier_class 활용 시점이라 동시 진행 정합 |
| tier_class 분류 단계 | **(A) 3단계 hero / main / goods** | 4단계는 mid 경계가 주관적, 2단계는 hero 강조 불가 |
| 이번 사이클 스코프 | **(A) 데이터 + 검증식까지** | 본편 UI의 tier_class 시각 적용은 차기 사이클 |
| 진입 흐름 변경 | **메인 로비 도입** (M3 plan 3.3.1 결정 정정) | 설정 탭 드롭다운은 보조 경로로 유지 |
| 스프린트 ID | **M3.1-lineup-presentation** (자비스 권장) | plan 검토 시 정정 가능 |

# 3. 스코프 (in scope)

## 3.1. 라인업 선택 로비 (메인 진입 화면)

3.1.1. **신규 진입 흐름**:
- 첫 방문(currentLineupId 미설정 또는 신설 플래그 `lobbyAcked` false): 로비 화면 우선 노출.
- 재방문(lobbyAcked true + currentLineupId 존재): 마지막 라인업으로 자동 진입 (현행 보존).
- 로비에서 "다음부터 이 라인업으로 시작" 토글 옵션 제공 (단계 2 결정).

3.1.2. **로비 화면 구성** (단계 2 design 정밀화):
- 라인업 N개 카드 그리드 (현재 N=2, 향후 N=3+ 자연 확장).
- 각 카드: 라인업 메인 이미지(assetsBasePath의 hero 카드) + 한국어 제목 + IP 라벨 + 발매일 + 박스 가격/매수 + "메인 상품 미리보기" 슬롯(tier_class=hero 등급 1~2개 썸네일).
- 카드 탭/클릭 → 해당 라인업 본편 진입.

3.1.3. **로비 진입 경로**:
- A) 첫 방문 자동.
- B) 헤더의 라인업 라벨 클릭 (M3 plan 3.3.3 옵션 활성화).
- C) 설정 탭 'Lineup' 섹션 → "라인업 선택 화면으로" 버튼 (드롭다운은 빠른 전환용으로 유지 또는 폐기, 단계 2 결정).

3.1.4. **dispatch 신규**:
- `dispatch({type: 'open_lobby'})` → state.view = 'lobby'.
- `dispatch({type: 'enter_lineup', lineupId})` → 라인업 전환 + state.view = 'main' + lobbyAcked=true.
- 기존 `set_current_lineup`은 quick-switch용으로 유지 또는 enter_lineup으로 통합 (단계 2 결정).

3.1.5. **모달 vs 전체 화면**:
- 옵션 X1: 전체 화면 view (state.view = 'lobby' | 'main'). 본편과 동등한 화면 전환.
- 옵션 X2: 시트/모달 (본편 위 오버레이). 첫 방문 시 dismiss 후 본편 노출.
- **단계 2 design 시 사용자 명시 결정**.

## 3.2. tier_class 분류 메타 (데이터 SSOT)

3.2.1. **TIER_CLASS_VALUES 상수 신설**: `["hero", "main", "goods"]`. numbers.js. 02_data.md 1.4-XX.5에 정의.

3.2.2. **각 tier 객체에 `tierClass` 필드 추가**:
```
{ tier: "A", count: 1, typeCount: 1, nameJa: "...", nameKo: "...", sizeLabel: "...", tierClass: "hero" }
```

3.2.3. **드래곤볼 분류**:
- hero: A, Last One, DC 보너스
- main: B, C, D, E, F
- goods: G, H, I, J

3.2.4. **원피스 분류**:
- hero: A, Last One, DC 보너스
- main: B, C, D, E, F
- goods: G, H, I

3.2.5. **DC 분류 별도**: tier 배열은 박스 등급만 담음. DC는 lineup.dc 객체에 `tierClass: "hero"` 필드 추가.

3.2.6. **검증식 추가** (numbers.js):
- 각 라인업에 hero ≥ 1 + main ≥ 1 + goods ≥ 1 존재 정합 (단일 클래스 라인업 거부).
- tierClass 미정 등급 거부 (모든 tier 객체에 tierClass 필수).
- TIER_CLASS_VALUES에 없는 값 거부.

## 3.3. 자산 정책 보강

3.3.1. **로비 카드 hero 이미지 슬롯**:
- 라인업별 `lobbyHeroAssetPath` 필드 (예: `${assetsBasePath}/hero.webp`).
- 미배치(`assetsAvailable=false`)면 placeholder gray + 등급 라벨 텍스트 표시.

3.3.2. **메인 상품 미리보기 슬롯**:
- tier_class=hero 등급의 첫 typeCount 1개 썸네일 표시.
- 자산 부재 시 등급 색 + "A상" 텍스트 fallback.

## 3.4. storage 마이그레이션 v4 → v5

3.4.1. **신규 전역 키**: `kuji_lobby_acked` (boolean. 기본 false).

3.4.2. **마이그레이션**: v4 → v5 진입 시 currentLineupId가 이미 존재하면 lobbyAcked=true 부여 (기존 사용자는 로비 재노출 안 함). 첫 방문자만 로비 노출.

3.4.3. **SCHEMA_VERSION = 5** 갱신.

# 4. 비목표 (out of scope)

4.1. **본편 화면(뽑기/기록/DC)의 tier_class 시각 적용** - hero/main/goods 별 카드 강조, 결과 모달 차별화 등. 차기 사이클(M3.2 또는 M4 전).
4.2. **로비 카드 풍부한 인터랙션** - 카드 swipe / 디테일 시트 / 영상 미리보기 등. 차기.
4.3. **라인업 추천 / 정렬 로직** - 인기순 / 발매일순 등. N=2 시점은 의미 약함.
4.4. **천장 룰** (XENOGLOSSIA 30연 S賞 확정) - 메이저 사이클(M4 또는 그 이후).
4.5. **3개 이상 라인업** - M3.1은 N=2 검증. N≥3 자연 확장 정합만 유지.
4.6. **로비 다국어** - 한국어/일본어만 (현행 정책).
4.7. **assetsAvailable=true 전환** - 자산 배치는 사용자 외부 작업. M3.1은 placeholder 흐름만.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (02_data 1.4 tier_class + 1.7 lobby UX 사양 + storage v5) | 0.5일 |
| Phase 2 | 단계 3 design_review (subagent 격리, round 1~N) | 0.5일 |
| Phase 3 | 단계 4 impl_plan (03_architecture 갱신 + lobby 모듈 분할 + T 분할) | 0.5일 |
| Phase 4 | 단계 5 implement Phase A: tier_class 데이터 추가 + 검증식 + 단위 테스트 | 0.5일 |
| Phase 5 | 단계 5 Phase B: storage v4→v5 + lobby state/view + dispatch | 0.5일 |
| Phase 6 | 단계 5 Phase C: render/lobby.js + 진입 경로 정합 + 헤더 라벨 클릭 | 0.5일 |
| Phase 7 | 단계 6 impl_review (subagent 격리, round 1~N) + 단계 7 QA + 단계 8 improve | 1.0일 |
| **합산** | | **3.0일** |

추정 보수: 라인업 로비는 신규 view라 단계 6 정정 라운드 가능성 존재. M2.1처럼 round 5까지 가는 케이스 방지 위해 단계 2/3에서 스코프 동결 강조.

# 6. 데이터 흐름 (개념)

## 6.1. 진입 흐름

```
앱 부트 (mount)
  → loadState()
    → schema_version < 5: v4 → v5 마이그레이션 (lobbyAcked 추론)
  → state.lobbyAcked === false:
      state.view = 'lobby'
      render lobby
  → else:
      state.view = 'main'
      render main (현행)
```

## 6.2. 로비 → 본편 전환

```
사용자 (로비 카드 클릭)
  → dispatch({type: 'enter_lineup', lineupId})
  → main.js:
    - state.currentLineupId = lineupId (변경 시 라인업 공간 로드)
    - state.lobbyAcked = true
    - state.view = 'main'
    - saveState({currentLineupId, lobbyAcked: true})
    - rerender (lobby → main)
```

## 6.3. 본편 → 로비 복귀

```
사용자 (헤더 라벨 클릭 또는 설정 탭 버튼)
  → dispatch({type: 'open_lobby'})
  → state.view = 'lobby'
  → rerender (main → lobby)
  ※ currentLineupId 유지 (재진입 시 현재 라인업 카드 강조)
```

## 6.4. 영속 매핑 (v5)

```
전역 키 (라인업 무관):
  kuji_current_lineup_id (string)
  kuji_lobby_acked       (boolean, 신규)
  kuji_seed              (number)
  kuji_settings_skip_pick (boolean)
  kuji_meta              (object)
  kuji_schema_version    (number, v5)

라인업별 키 (M3 그대로):
  kuji_history_${lid} / kuji_unopened_tickets_${lid} / kuji_box_state_${lid} /
  kuji_box_round_${lid} / kuji_dc_tickets_${lid} / kuji_dc_results_${lid}
```

# 7. 검증 / 단위 테스트 추가

7.1. `tests/suites/tier_class.test.js` 신설:
- 모든 라인업의 모든 tier에 tierClass 존재.
- TIER_CLASS_VALUES 외 값 없음.
- 라인업당 hero/main/goods 각 ≥ 1.
- DC.tierClass = "hero" 정합.

7.2. `tests/suites/storage_v5.test.js` 신설:
- v4 → v5 마이그레이션 멱등성.
- currentLineupId 존재 시 lobbyAcked=true 추론 정합.
- 첫 방문(빈 storage)은 lobbyAcked=false.

7.3. `tests/suites/lobby_flow.test.js` 신설:
- enter_lineup dispatch가 currentLineupId + lobbyAcked + view 동시 갱신.
- open_lobby dispatch가 view만 갱신, currentLineupId 보존.
- 라인업 전환 시 박스/이력 격리 정합 (M3 회귀 방지).

7.4. 단계 6 게이트 보강:
- **lobby ↔ main view 전환 시점에 메모리 only state(pendingPeelResult, selectedGridIndices) 폐기 정합** (M3 plan 3.3.2와 동일 룰을 lobby 복귀 시에도 적용).
- **tier_class grep**: 코드 어디에도 tierClass 미설정 등급 의존 없음.

# 8. 의존성 / 리스크

## 8.1. 의존성

8.1.1. M3 종료 상태 정합. M3 단계 7/8 통과 후 진행 (확인됨).
8.1.2. 자산 부재 정합 (M2.1 4.13.12 + M3 placeholder 흐름) 활용.

## 8.2. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 8.2.1 | 로비 view 도입으로 본편 mount 흐름 정합 깨짐 | 단계 2 design 시 view 라우팅 명시. main.js bootstrap 분기 단순화 |
| 8.2.2 | 첫 방문자/재방문자 분기 오판 (lobbyAcked 추론 오류) | 단계 5 마이그레이션 단위 테스트 + 단계 6 시나리오 검증 |
| 8.2.3 | tier_class 분류 경계 분쟁 (E/F의 main 분류 - mid 도입 압력) | plan 3단계 결정 동결. mid 도입 시 별도 사이클 |
| 8.2.4 | 로비 → 본편 전환 시 비-결정론 발생 (state 파편) | 단계 5 dispatch 통합 + 단계 6 회귀 suite |
| 8.2.5 | 헤더 라벨 클릭 affordance 약함 | 단계 2 design 시 시각 보강(꺾쇠 아이콘 등) 또는 명시 버튼 |
| 8.2.6 | M2.1처럼 단계 6 정정 라운드 폭증 | 단계 2/3에서 스코프 동결 + 단계 4 impl_plan 정밀화 |

# 9. 사용자 결정 게이트 (단계 1 → 단계 2) - **확정 (2026-05-08)**

| # | 항목 | 결정 |
|---|---|---|
| 9.1 | 로비 view 형태 | **(X1) 전체 화면** (state.view = 'lobby' \| 'main') |
| 9.2 | 설정 탭 드롭다운 quick-switch | **유지** (재방문자 빠른 전환 경로 보존) |
| 9.3 | "다음부터 이 라인업으로 시작" 토글 | **미도입** (lobbyAcked 1회 ack 흐름으로 충분) |
| 9.4 | 로비 카드 메인 상품 미리보기 깊이 | **hero 1개만** (라인업 식별성과 시각 부담 균형) |
| 9.5 | 헤더 라벨 클릭 활성화 | **M3.1에서 활성** (로비 복귀 경로 필수) |

위 5개 결정은 단계 2 design 작성의 입력 파라미터. design 산출물은 이 결정과 충돌하지 않게 작성.

# 10. 변경 이력

10.1. 2026-05-08: 초기 작성. 사용자 결정 사항 반영 (사이클 통합 / 3단계 분류 / 데이터+검증 스코프 / 메인 로비 도입).
10.2. 2026-05-08: 단계 1 사용자 승인. 9.1~9.5 결정 박제 (전체 화면 / 드롭다운 유지 / 토글 미도입 / hero 1개 / 헤더 라벨 활성). 단계 2 design 진입.
