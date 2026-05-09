# M3.3 tier-class-extended 단계 6 impl_review

작성일: 2026-05-09.
검증 방식: subagent 격리 검증.
입력 산출물: 단계 5 implement T1~T8 (numbers.js / core/history.js / render/history-tab.js / render/tier-grid.js / render/product-gallery.js / styles/main.css / tests/suites/tier_class_counts.test.js / tests/runner.js / docs+plan+PROGRESS).

# 0. 라운드 표

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | 1 | 0 | 2 | 미통과 |
| round 2 | 0 | 0 | 2 | **통과** |

# 1. round 1 결과 요약 (보존)

| 분류 | 건수 | 비고 |
|---|---|---|
| P0 | 1 | 단계 7 차단. tier-grid.js dead 모듈 적용 결함. |
| P1 | 0 | - |
| P2 | 2 | 정보성. 차기 사이클 후보. |
| **판정** | **미통과 (round 1)** | P0 1건. 자동 재시도 1회 후 통과 시 단계 7 진입. |

## 1.1. P0 결함 (round 1) - T4 그룹화 적용 모듈 오결정

위치: `src/render/tier-grid.js` 전체 + `04_impl_plan.md` 2.2 + spec 5.13.D.2 정합.

증상:
- 본 사이클은 `renderTierGrid`를 갱신해 hero → main → goods 그룹화 + 섹션 헤더 + Last One hero 마지막을 적용.
- 그러나 `renderTierGrid` 호출처를 grep으로 전수 조사한 결과 **호출처 0건** (tests / src / index.html 모두 0). 갤러리 펼침 시 사용자 화면에 실제 렌더되는 모듈은 `src/render/product-gallery.js`이며, draw-tab.js 79~80에서 `state.galleryExpanded`일 때 `renderProductGallery`만 호출됨.
- `src/render/product-gallery.js`는 그룹화 미적용 (단일 평면 list, lineup.tiers를 그대로 순회). 따라서 spec 5.13.D.2 "펼침 상태에서만 그룹화 적용"이 사용자 화면에서 발현 불가능.

영향:
- 단계 7 QA 항목 7.6 라이브 검수 통과 불가.
- spec 5.13.D.2.1~5.13.D.2.5 전 항목이 갤러리 영역에서 시각화되지 않음.
- M3.3 사이클의 두 번째 핵심 산출물 미발현 (대시보드만 단독 발현 = 사이클 가치 50% 손실).

정정 방향: 옵션 A 권장 - 그룹화를 product-gallery.js에 이전. tier-grid.js는 dead 모듈 유지 (호출처 0건이라 영향 0). styles/main.css 셀렉터 양쪽 묶어서 동일 적용.

## 1.2. P2 결함 (round 1)

- 4.1. "전체" 라벨 인라인 한국어 (history-tab.js 15) - 정보성. 차기 사이클 후보.
- 4.2. styles/main.css 인라인 px 값 (border-width 2px / border-left 4px / border 1px) - 신규 위반 아님 + 03_architecture 5.17 게이트 grep 항목 미포함.

# 2. round 1 정정 적용 검증

## 2.1. product-gallery.js에 그룹화 로직 이전 - PASS

위치: `src/render/product-gallery.js` 1~75행.

검증 항목:

| 항목 | 결과 | 근거 |
|---|---|---|
| import 정합 (TIER_CLASS_LABEL_KO / TIER_CLASS_HERO/MAIN/GOODS / getTierClassForTier) | PASS | line 4 5종 import 정합. |
| 헤더 주석 갱신 | PASS | line 2 "M3.3 갱신 (5.13.D.2): tier_class 그룹화 (hero → main → goods + Last One hero 마지막)". |
| groups 객체 초기화 (TIER_CLASS_HERO/MAIN/GOODS 키) | PASS | line 31~35. |
| lineup.tiers 순회 + Last One 별도 처리 | PASS | line 36~40. `if (t.tier === "Last One") continue` + getTierClassForTier 호출 + groups 분기. |
| Last One push (hero 그룹 마지막) | PASS | line 41~42. `groups[TIER_CLASS_HERO].push(lastOne)` (사용자 결정 9.4 정합). |
| orderedClasses (hero → main → goods) | PASS | line 44 (사용자 결정 9.3 정합). |
| 빈 그룹 헤더 미표시 가드 | PASS | line 47 `if (items.length === 0) continue` (5.13.D.2.6 정합). |
| section.dataset.tierClass 부착 | PASS | line 50 `section.dataset.tierClass = tc` (CSS 셀렉터 정합). |
| 섹션 헤더 한국어 라벨 (TIER_CLASS_LABEL_KO) | PASS | line 53 `sectionHeader.textContent = TIER_CLASS_LABEL_KO[tc]` (5.13.D.2.4 정합). |
| product-item 카드 산출 보존 (renderProductItem 호출) | PASS | line 58~66. drawnByTier / drawnTypesByTier / isLastOnePulsing / isJustDrawn / isExpanded / onToggle 모두 보존. |
| product-gallery DOM 트리 (section > h3 + list > items) | PASS | line 48~70. section 단위로 헤더 + list 묶음 + el에 append. |
| draw-tab.js 호출 정합 | PASS | draw-tab.js line 79~80 `state.galleryExpanded` 시 renderProductGallery 호출 그대로. |

판정: spec 5.13.D.2.1~5.13.D.2.6 전 항목이 product-gallery.js에서 사용자 화면 발현 가능.

## 2.2. tier-grid.js의 그룹화 로직 (dead 모듈 잔존) - PASS (영향 0)

위치: `src/render/tier-grid.js` 1~70행.

검증 항목:

| 항목 | 결과 | 근거 |
|---|---|---|
| 호출처 0건 정합 | PASS | grep `renderTierGrid` 전수 조사: `tier-grid.js:6 export function`만 정합. tests/src/index.html에 호출 0건. |
| 그룹화 로직 잔존 (P0 정정 흔적) | OK | line 23~36에 product-gallery.js와 동일한 그룹화 로직 잔존. dead 모듈이므로 사용자 화면 영향 0. |
| 회귀 위험 0 | PASS | dead 모듈이라 변경 시 어떤 호출처도 영향 없음. |

판정: 사용자 결정 (옵션 A) 정합. tier-grid.js dead 모듈 정리는 차기 사이클 후보 (P2 신규 4.1 참조).

## 2.3. styles/main.css 셀렉터 양쪽 묶기 - PASS

위치: `styles/main.css` 1632~1668행.

검증 항목:

| 항목 | 결과 | 근거 |
|---|---|---|
| 코멘트 정합 ("product-gallery는 실제 렌더 모듈, tier-grid는 dead 모듈") | PASS | line 1632. |
| `.product-gallery-section, .tier-grid-section` 양쪽 셀렉터 묶음 | PASS | line 1633~1634 (margin-top), 1638~1639 (first-of-type), 1643~1644 (header), 1653~1654 (hero), 1659~1660 (main), 1664~1665 (goods). |
| tier_class 색 토큰 재사용 (5.13.D.2.5 정합) | PASS | line 1655 `var(--tier-class-hero-border)`, 1661 `var(--tier-class-main-border)`, 1666 `var(--tier-class-goods-border)`. |
| 좌측 색 막대 (border-left) | PASS | line 1650 `border-left: 4px solid var(--border-subtle)` 기본 + 클래스별 border-left-color 오버라이드. |

판정: product-gallery 셀렉터가 dead tier-grid 셀렉터와 함께 양쪽 정합. CSS 발현 정상.

## 2.4. 02_data 1.4.A.5 호출처 표 - PASS

위치: `docs/02_data.md` 125행.

증상: line 125 `render/tier-grid.js 또는 render/product-gallery.js: M3.3 신설 - 갤러리 펼침 시 lineup.tiers를 hero/main/goods 그룹화 (5.13.D.2)`.

검증:
- "또는" 표기로 둘 중 하나 호출처 정합. 실제 활성 모듈 product-gallery.js 명시됨.
- round 1 정정에서 둘 다 코드 잔존 (tier-grid는 dead, product-gallery는 활성)이므로 표 그대로 정합.

판정: PASS. 정정 후 docs ↔ code 정합.

# 3. round 2 신규 결함 sweep

## 3.1. P0 신규 - 0건

전수 sweep 결과 P0 0건. spec 5.13.D.2 / 5.13.D.3 전 항목이 사용자 화면 발현 가능.

## 3.2. P1 신규 - 0건

해당 없음.

## 3.3. P2 신규 - 2건

### 3.3.1. P2 신규 4.1. tier-grid.js dead 모듈 정리 보류

위치: `src/render/tier-grid.js` 전체.

증상:
- round 1 P0 정정으로 product-gallery.js에 그룹화 이전 후 tier-grid.js는 호출처 0건 + 그룹화 로직 중복 잔존 상태.
- 본 사이클 종료 시점 dead 모듈 정리 미수행. 03_architecture 1장 트리에서 tier-grid.js가 폐기 표기 없이 잔존.
- 사용자 화면 영향 0이지만 "코드 ↔ docs 정합" 측면에서 명시 정리 후보.

영향: 0 (dead 모듈). 단 차기 사이클 회귀 검증 시 grep 노이즈 + 모듈명 혼동 가능성.

정정 방향:
- 옵션 A (권장): 차기 사이클 (M4 또는 M3.4)에서 tier-grid.js 삭제 + 03_architecture 1장 트리 + docs/02_data 1.4.A.5 호출처 표 갱신 ("또는" 제거 + product-gallery만 명시).
- 옵션 B: 본 사이클 단계 8 improve에서 즉시 정리.

차기 처리 권장. P0 0건이므로 단계 7 진입 가능.

### 3.3.2. P2 신규 4.2. round 1 P2 4.1 / 4.2 잔존

round 1 P2 4.1 ("전체" 라벨 인라인 한국어) + P2 4.2 (CSS 인라인 px 값) 그대로 잔존. 본 사이클에서 정정되지 않음. 차기 사이클 후보.

# 4. CLAUDE.md 4장 절대 규칙 (round 2 재확인)

| 항목 | 결과 | 근거 |
|---|---|---|
| 4.1 게임 로직 / 렌더 분리 | PASS | core/history.tierClassCounts에 DOM/document/window 0건. lineup 인자만 의존 → 결정론. |
| 4.2 매직 넘버 0개 (수치) | PASS | TIER_CLASS_LABEL_KO + HISTORY_DASHBOARD_COLS_MOBILE/TABLET + HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX 모두 numbers.js export. |
| 4.3 src/core/ DOM 0건 | PASS | core/history.js import 검사: numbers.js 상수만 import. document/window/Element 0건. |
| 4.4 핵심 로직 변경 시 테스트 | PASS | tests/suites/tier_class_counts.test.js 6건 + runner.js 등록. |
| 4.5 docs ↔ code 정합 | **PASS (round 2 정정)** | 02_data 1.4.A.5 / 1.5 / 1.4.A.6 ↔ numbers.js export ↔ product-gallery.js / tier-grid.js / history-tab.js / core/history.js 시그니처 모두 정합. **spec 5.13.D.2 갤러리 그룹화가 product-gallery.js에서 사용자 화면 발현 가능 (round 1 P0 해소)**. |
| 4.6 사행성 표현 0 | PASS | grep 0건. |
| 4.7 8단계 파이프라인 | PASS | 단계 1~5 정식 산출물 + 본 단계 6 round 1 + round 2. |
| 4.8 데이터 신뢰도 | PASS | numbers.js의 estimated 플래그 / lineups.json 데이터 변경 0. |

# 5. 03_architecture 5.17 게이트 (round 2 재확인)

| 게이트 | 결과 | 근거 |
|---|---|---|
| tierClassCounts(history, lineup) 시그니처 정합 | PASS | core/history.js 35~52. |
| DOM 0건 + lineup 인자 결정론 | PASS | core/history.js DOM 0. lineup 부재 throw 가드. |
| 미존재 tier 가드 | PASS | core/history.js 48~49 + 단위 테스트 4번째 케이스. |
| 대시보드 4개 카운터 카드 | PASS | history-tab.js 14~28 dashboardCards 배열. |
| 모바일 2x2 / 태블릿 4열 반응형 CSS | PASS | main.css 1574~1585. |
| **갤러리 펼침 시 그룹화 (hero → main → goods + Last One hero 마지막)** | **PASS (round 2)** | product-gallery.js 31~71 정합. draw-tab.js 79~80 호출 정합. tier-grid.js dead 모듈 잔존 (영향 0). |
| 섹션 헤더 한국어 라벨 (TIER_CLASS_LABEL_KO 호출) | **PASS (round 2)** | product-gallery.js 53 `TIER_CLASS_LABEL_KO[tc]` + 인라인 한국어 0. |
| 단위 테스트 통과 | PASS (정적) | tests/suites/tier_class_counts.test.js 6건 + runner 등록. ALL PASS는 사용자 라이브 실행 의무. |

# 6. spec ↔ 코드 1:1 (round 2 재확인)

| spec 절 | 코드 위치 | 결과 |
|---|---|---|
| 5.13.D.2.1 펼침 상태에서만 그룹화 | draw-tab.js 79 `if (state.galleryExpanded)` 분기 → product-gallery.js 호출 | **PASS (round 2)** |
| 5.13.D.2.2 hero → main → goods 정렬 | product-gallery.js 44 orderedClasses | **PASS (round 2)** |
| 5.13.D.2.3 Last One hero 그룹 마지막 | product-gallery.js 41~42 lastOne push | **PASS (round 2)** |
| 5.13.D.2.4 섹션 헤더 한국어 (TIER_CLASS_LABEL_KO) | product-gallery.js 53 | **PASS (round 2)** |
| 5.13.D.2.5 좌측 색 막대 (tier_class 색 토큰) | main.css 1650 + 1655/1661/1666 | **PASS (round 2)** |
| 5.13.D.2.6 빈 그룹 헤더 미표시 | product-gallery.js 47 `if (items.length === 0) continue` | **PASS (round 2)** |
| 5.13.D.3.2 카운터 카드 4개 | history-tab.js 14~28 | PASS |
| 5.13.D.3.3 모바일 2x2 / 태블릿 4열 | main.css 1574~1585 | PASS |
| 5.13.D.3.4 tierClassCounts 호출 | history-tab.js 11 + core/history.js 35~52 | PASS |
| 5.13.D.3.5 카드 시각 매트릭스 | history-tab.js 16~18 + main.css 1599~1616 | PASS |
| 5.13.D.3.6 빈 history 시 0/0/0/0 | history-tab.js 11 + 82~87 | PASS |
| 5.13.D.3.7 받은/미받은 분리 미도입 | history-tab.js 통합 카운트 | PASS |

# 7. 결정론 / 회귀 (round 2 재확인)

| 항목 | 결과 | 근거 |
|---|---|---|
| storage / core/draw / state 변경 0 | PASS | round 1 정정에서 product-gallery.js 변경만 추가. SCHEMA_VERSION 5 유지. |
| history-tab summary / tier-counts / history-list 보존 | PASS | history-tab.js 31~89 기존 흐름 그대로. |
| product-item 카드 흐름 보존 | PASS | product-gallery.js 58~66에 renderProductItem 호출 + 모든 props (drawnCount / drawnTypeIndices / isLastOnePulsing / isJustDrawn / isExpanded / onToggle) 보존. |
| draw-tab.js의 galleryExpanded 분기 | PASS | draw-tab.js 79~80 변경 0. |
| 기존 21개 suite (20 + T6) 정적 정합 | PASS | runner.js import 22행. |
| tier-grid.js dead 모듈 잔존 | PASS (영향 0) | 호출처 0건 grep 정합. |

# 8. 통과 판단

**통과 (round 2)**. P0 0건 + P1 0건. P2 2건은 정보성 차기 사이클 후보.

근거:
- round 1 P0 정정 (product-gallery.js에 그룹화 이전)이 spec 5.13.D.2 전 항목 발현 가능 상태로 전환.
- CSS 셀렉터 양쪽 (.product-gallery-section + .tier-grid-section) 묶음으로 정합.
- 02_data 1.4.A.5 호출처 표가 "또는" 표기로 정정 후 정합.
- 단계 5 종료 게이트 5.6 self-check ("갤러리 펼침 → hero → main → goods 그룹화 시각") 충족 (정적 정합).
- 모든 4장 절대 규칙 + 03_architecture 5.17 게이트 PASS.
- M3.3 두 핵심 산출물 (대시보드 + 갤러리 그룹화) 모두 발현 가능.

# 9. 단계 7 QA 권고

P0 0건 → 단계 7 진입 가능. 정식 plan 7.1~7.9 라이브 검수 진행.

라이브 검수 시 특히 확인:
- 9.1. 갤러리 펼침 (자세히 ▼ 토글) → product-gallery 영역에서 hero / main / goods 3개 섹션 헤더 한국어 라벨 발현.
- 9.2. 드래곤볼: hero 섹션 = A상 + Last One (2개), main 섹션 = B/C/D/E/F (5개), goods 섹션 = G/H/I/J (4개). 박스 등급 순서 보존 + Last One은 hero 마지막.
- 9.3. 원피스: hero 섹션 = A상 + Last One (2개), main 섹션 = B/C (2개), goods 섹션 = D/E/F/G/H/I (6개) 또는 02_data 분류 정합.
- 9.4. 좌측 색 막대 (hero 황금 / main 청동 / goods 회색 - tier_class 토큰 재사용).
- 9.5. product-item 카드 동작 (썸네일 / 종 펼침 / Last One pulsing / lastDrawn flash) 보존.
- 9.6. 접힘 상태 (자세히 ▼ 미클릭) → 그룹화 미적용 (회귀 위험 0 정합).
- 9.7. history 탭 상단 대시보드 4개 카드 (전체 / 메인 등급 / 표준 등급 / 굿즈) + 모바일 2x2 / 태블릿 4열.
- 9.8. tests/test.html ALL PASS (21 suite).

# 10. 차기 사이클 후보

10.1. tier-grid.js dead 모듈 정리 (P2 신규 4.1) - 03_architecture 1장 트리 + docs/02_data 1.4.A.5 호출처 표 갱신.
10.2. "전체" 라벨 상수화 (round 1 P2 4.1) - 02_data 1.5 또는 1.4.A.6 합산 키.
10.3. CSS 인라인 px 토큰화 (round 1 P2 4.2) - styles/tokens.css `--border-thin/medium/accent`.

# 변경 이력

11.1. 2026-05-09: round 1. P0 1 / P1 0 / P2 2. 미통과. T4 그룹화 적용 모듈 오결정 (tier-grid.js dead 모듈 → product-gallery.js 이전 권장).
11.2. 2026-05-09: round 2. P0 0 / P1 0 / P2 2 (신규 4.1 dead 모듈 정리 보류 + 4.2 round 1 P2 잔존). **통과**. round 1 P0 정정 (product-gallery.js에 그룹화 이전 + CSS 양쪽 셀렉터 묶음 + tier-grid.js dead 잔존) 정합 검증 완료. 단계 7 진입 가능.
