# M4.2-tidy - 04 impl_plan

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.2-tidy |
| 작성일 | 2026-05-10 |
| 단계 | 4 impl_plan |
| 상태 | 자율 진행 ("다음 진행해" + 답습) |
| 선행 단계 | 단계 3 design_review round 1 통과 (P0=0 / P1=2 / P2=3) |
| 추정 | 0.4일 (T1~T10) |

# 1. 단계 4 결정

| # | 결정 | 채택 |
|---|---|---|
| 1.1 | dead 파일 7건 git rm 방식 | **fs 삭제** (자비스 권한 = Bash rm + git status 검증). 사용자 명시 거부 시 dead alias 유지 + 백로그 잔존 |
| 1.2 | LAST_ONE_TIER_NAME 상수 신설 위치 | numbers.js + 02_data 1.4.A.7 (M4.2 round 1 P1-2 정정 흡수 완료) |
| 1.3 | tier-grid.js 폐기 결정 | **폐기** (호출처 0건 + main.css `.tier-grid*` 셀렉터도 함께 폐기) |
| 1.4 | M3 series P2 일괄 vs 분리 | **일괄 흡수** (정리 라운드 의미 정합) |
| 1.5 | M4.1 단계 6 P1-1 정정 방식 | **spec 본문 갱신** (코드 변경 0). round 1 P1-1 재정정 박제 적용 완료 |

# 2. T 분할 (의존성 순서)

| # | 태스크 | 변경 파일 | 의존 |
|---|---|---|---|
| T1 | dead 파일 7건 git rm | render/lobby.js / core/lobby-preview.js / render/history-tab.js / render/dc-tab.js / tests/suites/state_view.test.js / tests/suites/lobby_flow.test.js / tests/suites/storage_v5.test.js | 없음 |
| T2 | numbers.js LAST_ONE_TIER_NAME 신설 | src/data/numbers.js | 없음 |
| T3 | core/box.js + core/last_one.js 모듈 내 LAST_ONE_TIER_LABEL → numbers import | core/box.js + core/last_one.js | T2 |
| T4 | "Last One" 매직 문자열 호출처 일괄 import | core/history.js + core/home-preview.js + render/minor-row.js + render/hero-carousel.js + 추가 grep | T2 |
| T5 | render/tier-grid.js git rm + main.css `.tier-grid*` 셀렉터 폐기 | render/tier-grid.js + styles/main.css | 없음 |
| T6 | products-history-tab "전체" 라벨 / CSS 인라인 px 정정 | render/products-history-tab.js + styles/main.css | 없음 |
| T7 | (단계 2에서 spec 5.13.E.3 정정 완료. 본 단계 변경 0) | (없음) | 없음 |
| T8 | (단계 2에서 spec 4.1 / 5.13.B.3.1 정정 완료. 본 단계 변경 0) | (없음) | 없음 |
| T9 | (단계 2에서 arch 5.20 + M4.1 04_impl_plan stale 정정 완료. 본 단계 변경 0) | (없음) | 없음 |
| T10 | PROGRESS M4.2 절 신설 | PROGRESS.md | T1~T6 |

# 3. T1 dead 파일 7건 git rm

## 3.1. 검증 의무 (rm 전)

3.1.1. `grep -rn "from.*lobby\b\|from.*lobby-preview\b\|from.*history-tab\b\|from.*dc-tab\b" src/` → 호출처 0건.
3.1.2. `grep -n "lobby_flow\|state_view\|storage_v5" tests/runner.js` → import 0건 (이미 폐기 박제).
3.1.3. `cat` 각 파일로 dead alias re-export 정합 확인.

## 3.2. 실행

```
git rm src/render/lobby.js
git rm src/core/lobby-preview.js
git rm src/render/history-tab.js
git rm src/render/dc-tab.js
git rm tests/suites/state_view.test.js
git rm tests/suites/lobby_flow.test.js
git rm tests/suites/storage_v5.test.js
```

7 파일 삭제.

## 3.3. 검증식

- `git status` → deleted 7 파일.
- `grep -rn "from.*lobby\b\|from.*lobby-preview\b\|from.*history-tab\b\|from.*dc-tab\b" src/` → 0건.
- 신규 컴파일 에러 0.

# 4. T2~T4 LAST_ONE_TIER_NAME 일괄 import

## 4.1. T2 numbers.js

```js
// 02_data 1.4.A.7 (M4.2 신설)
export const LAST_ONE_TIER_NAME = "Last One";
```

위치 = TIER_CLASS_LABEL_KO 직후. 02_data 1.4.A.7 정합.

## 4.2. T3 core/box.js / core/last_one.js

```js
// 변경 전
const LAST_ONE_TIER_LABEL = "Last One";

// 변경 후
import { LAST_ONE_TIER_NAME } from "../data/numbers.js";
// 호출처: 기존 LAST_ONE_TIER_LABEL → LAST_ONE_TIER_NAME 일괄 치환.
```

## 4.3. T4 매직 문자열 호출처

| 파일 | 변경 |
|---|---|
| core/history.js line 25 | `("Last One" in counts)` → `(LAST_ONE_TIER_NAME in counts)` (필요 시) + import 추가 |
| core/home-preview.js line 17 | `t.tier !== "Last One"` → `t.tier !== LAST_ONE_TIER_NAME` |
| render/minor-row.js line 14 | `t.tier !== "Last One"` → `t.tier !== LAST_ONE_TIER_NAME` |
| render/hero-carousel.js | 동일 패턴 + `e.tier === "Last One"` 등 grep |
| 기타 grep | `grep -rn "\"Last One\"" src/` 잔존 0건 의무 |

## 4.4. 검증식

- `grep -rn "\"Last One\"" src/` → 0건.
- `grep -n "LAST_ONE_TIER_NAME" src/data/numbers.js` → 1건 정의.
- 호출처 import 정합.

# 5. T5 tier-grid.js + main.css 폐기

## 5.1. 변경

5.1.1. `git rm src/render/tier-grid.js`.
5.1.2. `styles/main.css`의 `.tier-grid` / `.tier-grid-section` / `.tier-grid-section-header` / `.tier-grid-rows` 등 모든 `.tier-grid*` 셀렉터 블록 삭제.

## 5.2. 검증식

- `grep -rn "tier-grid" src/` → 0건.
- `grep -n "tier-grid" styles/main.css` → 0건.

# 6. T6 products-history-tab 정정

## 6.1. 변경

6.1.1. "전체" 라벨 본문 정합 (spec 5.13.D.3 정합 - 단계 2 design 검토 후 결정).
6.1.2. CSS 인라인 px → 토큰 정리 (제한적, products-history-tab 한정).

## 6.2. 검증식

- spec 5.13.D.3 본문과 라벨 일치.
- 인라인 px 잔존 → 토큰 변환 정합.

**[의견]**: T6은 단계 5에서 본문 검토 후 미세 변경 또는 변경 0 결정. 코드 동작 변경 0 원칙 정합.

# 7. T10 PROGRESS M4.2 절 신설

## 7.1. 변경

7.1.1. PROGRESS.md 13절 신설 (M4.2-tidy). M4.1 12절 답습.
7.1.2. 12.1 사이클 메타 / 12.2 단계별 산출물 / 12.3 단계 5 정합 검증 / 12.4 차기 사이클 후보 / 12.5 학습.

# 8. 호출처 grep 매트릭스 (단계 6 게이트 정합)

| 패턴 | 잔존 허용 위치 | 잔존 0건 의무 위치 |
|---|---|---|
| `from.*lobby\b\|from.*history-tab\b\|from.*dc-tab\b` | docs (변경이력) | src/, tests/ |
| `\"Last One\"` (매직 문자열) | docs (자연어) / tests (검증 fixture) | src/ (LAST_ONE_TIER_NAME 경유) |
| `tier-grid` (셀렉터 / 모듈명) | docs (변경이력) | src/, styles/, tests/ |
| `state_view\|lobby_flow\|storage_v5\.test` | docs (변경이력) | tests/runner.js |
| `home_flow_m41` | (잔존 0) | docs (M4.2 정정 적용 완료) |

# 9. 단계 5 implement 진입 신호

본 plan 자율 통과. T1~T6 + T10 순차 진입. T7~T9는 단계 2에서 흡수 완료.

# 10. 단계 4 학습

10.1. **단계 2 design에서 spec 본문 정정 흡수 시 단계 5 T 부피 감소 정합**: 본 사이클은 spec 정정(T6/T7/T8/T9)이 단계 2에서 흡수되어 단계 5 T 부피가 dead 폐기 + 매직 문자열 + tier-grid + products-history 5건으로 축소.

10.2. **dead 폐기 의무 위치 = 자비스 fs rm + 사용자 명시 거부 시 백로그**: M4 사이클은 자비스 권한 부재 시 dead alias 박제 패턴이었으나 본 사이클은 정리 라운드 의미상 fs rm 정합.
