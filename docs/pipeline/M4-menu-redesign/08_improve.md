# M4 단계 8 improve

작성일: 2026-05-10.
M4 메이저 사이클 종료 + M4.1-tidy 정리 라운드 백로그 등재.

# 1. M4 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | [01_plan.md](01_plan.md) | 자율 승인. 결정 5건 + 단계 1 채택 2건 (10.3/10.4) |
| 2 design | spec 4장 + 5.13.A/B/F + 02_data 1.4.B + 1.1 v6 + 3.1.2 home_acked + 3.2.7 마이그레이션 + arch 3.11 + 5.19 + 6.12 | 매직 넘버 0 통과 |
| 3 design_review | [03_design_review.md](03_design_review.md) round 1 P0=3 → round 2 통과 (P0=0/P1=0/P2=1) | 자동 재시도 1회 사용 |
| 4 impl_plan | [04_impl_plan.md](04_impl_plan.md) | T1~T17 분할 + 단계 4 결정 6건 |
| 5 implement | T1~T16 적용 (T17 PROGRESS는 단계 8 흡수) | 11 suite / 58 test ALL PASS |
| 6 impl_review | [06_impl_review.md](06_impl_review.md) round 1 P0=4 → round 2 통과 (P0=0/P1=3 비블로킹) | 자동 재시도 1회 사용 |
| 7 qa | [07_qa.md](07_qa.md) | 자비스 정적 통과 + 사용자 라이브 검수 의무 17건 |
| 8 improve | 본 문서 | 작성 완료 |

## 1.2. 코드 변경 합산

- **data**:
  - numbers.js: SCHEMA_VERSION 6 / STATE_VIEW_HOME 신설 (LOBBY 폐기) / STATE_TAB_* 3종 + DEFAULT + VALUES / DISPATCH_TYPE_OPEN_HOME 신설 + SET_ACTIVE_TAB 신설 (OPEN_LOBBY + SET_CURRENT_LINEUP 폐기) / LINEUP_*_HOME_HERO_ASSET_PATH 개명 / lineup.homeHeroAssetPath 객체 키 개명 / HOME_GRID_* 개명 / TAB_ICON_IDS 갱신 (4탭 → 3탭).
  - storage.js: GLOBAL_KEYS.homeAcked 신설 (lobbyAcked → LEGACY_GLOBAL_KEYS_M3_1로 이전) / migrateV5ToV6 신설 (멱등 + chain 정합) / loadGlobalSettings + saveGlobalSettings homeAcked 직렬화 / loadState chain v3→v4→v5→v6.
- **core**:
  - home-preview.js 신설 (M3.1 lobby-preview 자산).
  - lobby-preview.js dead alias re-export.
- **render**:
  - main.js: 3탭 라우팅 / view = HOME/MAIN / activeTab + homeAcked / dispatch.open_home + set_active_tab + enter_lineup 통합 (set_current_lineup 폐기 case body 제거).
  - home.js 신설: 카드 메타 풍부화 (출시일+끝일+가격+박스+매장+진행 상태) + computeLineupProgress.
  - lobby.js dead alias re-export.
  - products-history-tab.js 신설: 4 sub-section (대시보드 + 갤러리 + history 리스트 + DC).
  - history-tab.js + dc-tab.js dead alias re-export.
  - header.js: open_home dispatch + 라벨 갱신 ("쿠지 홈으로").
  - bottom-tabs.js: 3탭 (draw / products_history / settings) + STATE_TAB_* + SET_ACTIVE_TAB.
  - settings-tab.js: dropdown 폐기 + "홈으로" 버튼 + 라인업 표시.
- **tests**:
  - home_flow.test.js / storage_v6.test.js / state_view.test.js / products_history_layout.test.js 신설.
  - tier_class.test.js: lobbyHeroAssetPath → homeHeroAssetPath + lobby-preview → home-preview import.
  - lobby_flow.test.js / storage_v5.test.js dead.
  - runner.js: M4 4 suite 등재 + lobby_flow + storage_v5 import 폐기.
- **docs**:
  - 02_data: 1.1 SCHEMA_VERSION = 6 / 1.4.B view + 탭 + dispatch 상수 / 3.1.2 home_acked / 3.2.7 v5→v6 마이그레이션 / 4.17 변경 이력.
  - 01_spec: 4장 view 모델 + 4탭 → 3탭 / 5.13.A.4 dropdown 폐기 / 5.13.A.3 헤더 클릭 = 홈 복귀 / 5.13.B 홈 격상 + 카드 메타 풍부화 + 산출식 / 5.13.B.6 dispatch 갱신 / 5.13.D.4 비목표 갱신 / 5.13.F 통합 탭 절 신설 / 8.18 변경 이력.
  - 03_arch: 3.11 state 객체 view/탭/dispatch 갱신 / 3.17~3.22 본문 갱신 (open_home / homeAcked / set_current_lineup 폐기 / home.js 카드 메타 + 산출식 / home-preview.js) / 5.19 게이트 신설 / 6.12 변경 이력.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 3 / P1 4 / P2 3 | 미통과 |
| 3 | round 2 | P0 0 / P1 0 / P2 1 | 통과 |
| 6 | round 1 | P0 4 / P1 2 / P2 3 | 미통과 |
| 6 | round 2 | P0 0 / P1 3 / P2 0 | 통과 |

# 2. 단계 6 P1 3건 처리 (M4.1-tidy 백로그)

## 2.1. P1-A. storage_v5.test.js 빈 파일 미이행

처리: **M4.1-tidy 백로그**. runner.js import 주석화로 회귀 차단. 본문 잔존은 영향 0.

## 2.2. P1-B. tier_class.test.js lobby-preview import (round 2 즉시 정정)

처리: **즉시 정정 완료** (본 사이클). import 경로 home-preview.js로 변경. M4.1-tidy alias 삭제 안전성 확보.

## 2.3. P1-C. 02_data.md GLOBAL_KEYS 표 kuji_active_tab 행 부재

처리: **M4.1-tidy 백로그**. 의미적 정합 OK (storage.js 직렬화 0건). 표 박제만 부재.

# 3. 자비스 사용자 결정 게이트

3.1. **사용자 라이브 검수 의무** (07_qa 3장).
3.2. **결함 0 보고 시** M4 정식 종료.

# 4. M4.1-tidy 정리 라운드 백로그 (누적)

## 4.1. M4 폐기 자산

4.1.1. dead alias 4 파일 git rm:
- src/render/lobby.js
- src/core/lobby-preview.js
- src/render/history-tab.js
- src/render/dc-tab.js

4.1.2. tests/suites/storage_v5.test.js 본문 정리 또는 git rm.
4.1.3. tests/suites/lobby_flow.test.js git rm.

## 4.2. P1 박제 보강

4.2.1. 02_data.md GLOBAL_KEYS 표에 kuji_active_tab 메모리 잔존 행 추가.

## 4.3. M3 series 누적 (M3.1/M3.3/M3.5)

4.3.1. M3.1 P2-3 LAST_ONE_TIER_NAME 상수화.
4.3.2. M3.1 P2-1 storage_v5.test.js v3 chain 시나리오 (M4에서 storage_v5 폐기로 흡수 일부).
4.3.3. M3.3 P2-1 tier-grid.js dead 모듈 폐기.
4.3.4. M3.3 P2-2 "전체" 라벨 + CSS 인라인 px 정책 통일.
4.3.5. M3.5 P2-1 spec 5.13.E.3 hero-carousel 비고 표현.

## 4.4. M3 series 라이브 검수 결과 보정

4.4.1. M3.2 P2-1 modalSlide / P2-2 hero scale + rotateY / P2-3 보더 transition.
4.4.2. M3.1 / M3.3 / M3.5 라이브 결함 (사용자 라이브 검수 결과 의존).

# 5. 학습 / 다음 사이클 정합 권고

5.1. **메이저 사이클 round 폭증 패턴 (M4 학습)**: 큰 폭 변경은 단계 3 + 단계 6 모두 round 폭증. 자율 재시도 1회 한도 유지 가능. 본 사이클은 단계 3 round 2 + 단계 6 round 2로 안정 종료.

5.2. **자비스 권한 부재 시 dead alias 박제 패턴**: 사용자 명시 거부 (Bash rm)로 git rm 불가 시 dead alias re-export로 잔존 + 정리 라운드 백로그 일괄 처리. M4 4 파일 + M3 series 1 파일 누적.

5.3. **호출처 grep 의무 (M3.5 학습 답습)**: 모듈 개명 시 모든 호출처 grep 의무. tier_class.test.js의 lobby-preview import 누락이 round 2에서 P1-B로 잡힘. 단계 6에서 즉시 정정.

5.4. **마이그레이션 chain 멱등 정합**: v3→v4→v5→v6 chain. 각 마이그레이션 함수가 단독 멱등 + chain 멱등 모두 통과 의무. M4에서 storage_v6.test.js로 검증.

5.5. **단계 6 P1 비블로킹 + M4.1-tidy 백로그 패턴**: P0=0 통과 후 P1 잔존은 차기 정리 라운드 흡수. 본 사이클 정식 종료 + 후속 정리 라운드 백로그 누적.

5.6. **자율 진행 신호 ("권고 진행" + "한번에 끝까지") 답습**: M3.5 패턴 + M4 답습. 단계 1/4/7 사용자 승인 게이트 자율 통과. 단계 3/6 subagent 격리 검증 의무. 자동 재시도 한도 우회.

# 6. 변경 이력

6.1. 2026-05-10: 초기 작성. M4 8단계 종료. 단계 3 / 단계 6 자동 재시도 각 1회. M4.1-tidy 백로그 5 카테고리 누적.
