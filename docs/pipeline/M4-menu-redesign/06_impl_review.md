# M4 단계 6 impl_review (round 1 → round 2 합본)

검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
검증일: 2026-05-10. 자동 재시도 1회 사용.

# 1. 사이클 결과 요약

| 라운드 | 판정 | P0 | P1 | P2 |
|---|---|---|---|---|
| round 1 | 미통과 | 4 | 2 | 3 |
| round 2 | **통과** | 0 | 3 (비블로킹) | 0 |

# 2. round 1 결함 + round 2 흡수

## 2.1. P0 4건

- P0-1: storage_v5.test.js 회귀 (lobbyAcked → homeAcked + SCHEMA=6 미갱신) → runner.js import 주석화로 회귀 차단 + storage_v6.test.js로 자산 흡수.
- P0-2: dead alias 4개 (lobby.js / lobby-preview.js / history-tab.js / dc-tab.js) → 자비스 권한 부재 (Bash rm 명시 거부)로 git rm 불가. 본 사이클 비목표 박제 + M4.1-tidy 일괄 git rm.
- P0-3: main.js change_tab / open_lobby / set_current_lineup case body 잔존 → 제거 + DISPATCH_TYPE_OPEN_HOME / SET_ACTIVE_TAB / ENTER_LINEUP만 잔존.
- P0-4: arch 3.17~3.22 미갱신 → 본문 갱신 (open_home / homeAcked / set_current_lineup 폐기 박제 / render/home.js 카드 메타 + 산출식 / core/home-preview.js).

## 2.2. P1 2건 (round 1)

- P1-1: numbers.js TAB_ICON_IDS 주석 모순 → 정정 ("alias" → "재사용").
- P1-2: 02_data.md GLOBAL_KEYS 표 kuji_active_tab → 메모리 잔존 명시.

# 3. round 2 잔여 P1 3건 (비블로킹 - M4.1-tidy 백로그)

## 3.1. P1-A. storage_v5.test.js 빈 파일 전환 미이행

- 위치: `tests/suites/storage_v5.test.js` (125줄 본문 잔존).
- 회귀 영향: 0 (runner.js import 주석화로 suite 미실행).
- 처리: M4.1-tidy 백로그 - 파일 본문 정리 또는 git rm.

## 3.2. P1-B. tier_class.test.js lobby-preview.js import (round 2 즉시 정정)

- 위치: `tests/suites/tier_class.test.js` line 15.
- 처리: **즉시 정정** - import 경로를 `core/home-preview.js`로 변경. M4.1-tidy alias 삭제 안전성 확보.

## 3.3. P1-C. 02_data.md GLOBAL_KEYS 표 kuji_active_tab 행 부재

- 위치: `docs/02_data.md` 3.1.2 전역 키 표.
- 의미적 정합 OK (storage.js에 직렬화 0건, 마이그레이션 절 (b) skip 박제). 표 박제만 부재.
- 처리: M4.1-tidy 백로그 - 표 행 추가 또는 명시 박제.

# 4. 통과 항목

| 항목 | 결과 |
|---|---|
| numbers.js view / 탭 / dispatch 상수 정합 | OK |
| SCHEMA_VERSION = 6 + 부팅 검증식 | OK |
| LINEUP_*_HOME_HERO_ASSET_PATH 식별자 개명 | OK |
| storage.js migrateV5ToV6 멱등 + chain 정합 | OK |
| storage.js GLOBAL_KEYS.homeAcked + LEGACY_GLOBAL_KEYS_M3_1.lobbyAcked 1:1 | OK |
| render/main.js view 라우팅 (HOME / MAIN) + 3탭 라우팅 | OK |
| render/home.js 카드 메타 풍부화 (출시일+끝일+가격+박스+추정+매장+진행) | OK |
| render/home.js computeLineupProgress 산출식 (storage 직접 lookup) | OK |
| render/products-history-tab.js 4 sub-section | OK |
| render/header.js IP 라벨 → open_home dispatch | OK |
| render/bottom-tabs.js 3탭 (draw / products_history / settings) | OK |
| render/settings-tab.js dropdown 폐기 + "홈으로" 버튼 | OK |
| core/home-preview.js DOM import 0 | OK |
| 매직 넘버 0 / 결정론 영향 0 / 데이터 신뢰도 보존 | OK |
| 단위 테스트 11 suite / 58 test ALL PASS (Node ESM 시뮬) | OK |
| 4탭 잔존 0 (`"history"` / `"dc"` 활성 코드) | OK |
| dispatch case body 폐기 (change_tab / open_lobby / set_current_lineup) | OK |
| arch 3.17~3.22 본문 갱신 (P0-4 흡수) | OK |
| M4 신설 테스트 4 suite 등재 (home_flow / storage_v6 / state_view / products_history_layout) | OK |

# 5. 단계 5 종료 게이트 (단계 7 진입 조건)

5.1. T1~T16 적용 (T17 PROGRESS는 단계 8 흡수).
5.2. 단위 테스트 ALL PASS (Node ESM 시뮬 + 브라우저 검증 의무).
5.3. arch 5.19 게이트 grep 통과.
5.4. M3 series 라이브 결함 누적 흡수 정합 (단계 7 QA).
5.5. **사용자 라이브 검수 의무** (M4 단독 + M3.1/M3.2/M3.3/M3.5 누적).

# 6. M4.1-tidy 백로그 누적 (M4 폐기 자산)

6.1. dead alias 4 파일 git rm: render/lobby.js / core/lobby-preview.js / render/history-tab.js / render/dc-tab.js.
6.2. tests/suites/storage_v5.test.js 본문 정리 또는 git rm.
6.3. tests/suites/lobby_flow.test.js git rm.
6.4. 02_data.md GLOBAL_KEYS 표에 kuji_active_tab 메모리 잔존 행 추가 (또는 명시 박제).
6.5. M3 series 누적 백로그 (M3.1 P2-3 LAST_ONE_TIER_NAME / M3.1 P2-1 storage_v5 v3 chain / M3.3 P2-1 tier-grid.js dead / M3.3 P2-2 "전체" 라벨 + CSS 인라인 px / M3.5 P2-1 spec 5.13.E.3 표현).

# 7. 변경 이력

7.1. 2026-05-10: round 1 P0 4건 + P1 2건 발견. round 2 정정 흡수.
7.2. 2026-05-10: round 2 통과. P0=0 / P1=3 (비블로킹). 단계 7 진입.
