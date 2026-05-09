# M3.3 tier-class-extended 단계 3 design_review - round 1

검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
검증일: 2026-05-09.
검증 대상: CLAUDE.md / docs/05_pipeline.md / docs/pipeline/M3.3-tier-class-extended/01_plan.md / docs/01_spec.md (5.13.D + 8.16) / docs/02_data.md (1.4.A.5 호출처 + 1.4.A.6 + 1.5 + 4.15) / docs/03_architecture.md (참고).
선행 학습: M3.1 round 1 / M3.2 round 2 통과 패턴.

# 1. 결과 요약

| 분류 | 건수 | 항목 |
|---|---|---|
| P0 (단계 4 결정 불가능 / 사용자 결정 위반 / 절대 규칙 위반) | 0 | - |
| P1 (단계 4 흡수 가능, 단계 5 전 정정) | 1 | 3.1 plan 7.1 드래곤볼 케이스 total=6 산출 오류 |
| P2 (정보성, 차기 사이클 / 단계 4 결정 가능) | 5 | 4.1 / 4.2 / 4.3 / 4.4 / 4.5 |
| 통과 항목 | 12 | 5장 |

**판정: round 1 통과**. P0 0건. P1 1건 (테스트 케이스 산출 오류, 단계 4 impl_plan에서 정정 후 단계 5 진입 가능). P2 5건 모두 단계 4 결정 가능 또는 정보성. M3.1 / M3.2 학습 답습 정합.

# 2. P0 결함

P0 결함 없음. 단계 1 plan의 사용자 결정 9.1~9.5가 spec 5.13.D / 02_data 1.4.A.6 / 1.5에 정합 박제. CLAUDE.md 4장 절대 규칙 위반 0건. 매직 넘버 / DOM 위반 / 사행성 표현 / 데이터 신뢰도 모두 정합.

# 3. P1 결함

## 3.1. plan 7.1 드래곤볼 단위 테스트 케이스 total 산출 오류

**위치**: `docs/pipeline/M3.3-tier-class-extended/01_plan.md` 7.1.

**현 표기**:
> 드래곤볼 history (A 1매 + G 3매 + Last One 1매) → hero=2 / main=0 / goods=3 / total=6.

**산출 검증**:
- A: 1매 (tierClass=hero, 02_data 1.4-DB.2)
- G: 3매 (tierClass=goods)
- Last One: 1매 (tierClass=hero)
- 합산: hero=2 / main=0 / goods=3 / **total=5** (= 1+3+1).

plan 표기 total=6은 5의 산출 오류. tierClassCounts 시그니처(`{ ...counts, total: history.length }`)에 따라 total은 history 항목 수의 합과 동등해야 함. 원피스 케이스(A 1 + B 2 + I 5 = 8 / total=8)는 정합.

**영향**: 단위 테스트(`tests/suites/tier_class_counts.test.js`) 작성 시 total=6 기대값으로 코딩하면 fail. 단계 5 implement 진입 전 정정 의무.

**권고 정정**: plan 7.1 드래곤볼 줄에 `total=6` → `total=5` 정정. 또는 케이스 매수를 `A 1 + G 3 + Last One 2 = 6` 등 정합 매수로 변경 (단, Last One 2매는 boxRound 2회 시점이라 사이클 모순 가능 → total=5 정정 권장).

**자동 재시도 정정 가능**: 단계 4 impl_plan 작성 시점에 동시 정정 (M3.1 / M3.2 round 1 P1 흡수 패턴 답습).

# 4. P2 결함 (정보성 / 단계 4 결정 가능)

## 4.1. 갤러리 그룹화 호출처 모듈 미정 (`tier-grid` vs `product-gallery`)

**위치**: plan 3.3 / plan 6.2 / 02_data 1.4.A.5 / spec 5.13.D.2 모두 `render/tier-grid.js 또는 render/product-gallery.js` 양분.

**영향**: 단계 4 impl_plan에서 모듈 책임 분해 시 결정 가능 (모듈 1개로 통합 또는 갤러리 펼침 영역만 product-gallery로 분리). spec / data SSOT는 호출처가 어느 모듈이든 정합 가능 (헬퍼 호출 + TIER_CLASS_LABEL_KO 사용 표기 그대로).

**권고**: 단계 4에서 결정 후 02_data 1.4.A.5 + spec 5.13.D.2 본문 양분 표현을 단일 모듈로 정정.

## 4.2. spec 5.13.D.3.5 "전체" 카운터 카드 색 톤 단일성

**위치**: spec 5.13.D.3.5 카드 시각 매트릭스.

**현 박제**: "전체" = `var(--bg-card)` (= 무변형) / "main" = `var(--tier-class-main-bg-tint)` (= bg-card 동일).

**우려**: 02_data 2.3.1에 따르면 `--tier-class-main-bg-tint`는 `--bg-card`와 동일 색상. 즉 "전체" 카드와 "main" 카드의 배경이 동일하여 시각 분리 모호. 단 사용자 결정 9.5("통합 카운트만") 정신은 카운트 자체 분리만 요구하고 색 강조 정도는 단계 4 / 단계 5 구현 자율.

**영향**: 단계 4 impl_plan / 단계 5 implement에서 "전체" 카드에 보더 강조 또는 수치 폰트 강조로 main과 시각 분리 추가 결정 가능. P0/P1 결함은 아님 (사용자 결정 위반 0).

**권고**: 단계 4에서 "전체" 카드 보더 또는 강조 처리 정책 명시. 단계 5 진입 전 결정 가능.

## 4.3. spec 5.13.D.3.6 빈 history 시 안내 문구 충돌 가능성

**위치**: spec 5.13.D.3.6 "빈 history 시 대시보드는 표시(0/0/0/0) + 빈 상태 안내 문구는 기존 흐름 그대로".

**우려**: 빈 history 시 대시보드와 기존 history 리스트 영역의 빈 상태 안내가 동시 노출 → 모바일에서 시각 중첩 가능 (대시보드 0/0/0/0이 이미 빈 상태 신호 + "추첨 이력이 없습니다" 텍스트).

**영향**: 메모리 룰 `feedback_lottery_red_text`("복권 영역 안내·힌트·경고 문구 금지")는 buy/peel/pick 패널 한정 룰이므로 history 탭은 영향 외. 단 사용성 측면에서 단계 4 / 단계 5에서 결정 가능 (대시보드 표시 + 리스트 안내 둘 중 하나만 또는 둘 다).

**권고**: 단계 4에서 빈 history 시 안내 문구 정책 결정 (현 흐름 유지 또는 대시보드만 노출). 본 사이클 비결정 시 단계 5에서 자비스 자율 결정 가능.

## 4.4. spec 5.13.D.2.5 섹션 헤더 "좌측 색 막대" 시각 - styles 토큰 정합

**위치**: spec 5.13.D.2.5 "tier_class 색 톤 액센트(예: 좌측 색 막대)".

**검증**: styles/tokens.css에 `--tier-class-{hero,main,goods}-{bg-tint,border}` 8종 + `--tier-class-hero-glow-rgba` 9종이 M3.2에서 이미 신설됨. 좌측 색 막대 구현은 `border-left` + `--tier-class-{hero,main,goods}-border` 재사용으로 토큰 추가 0건 가능.

**영향**: 신규 CSS 변수 추가 없이 단계 5에서 구현 가능. 단계 4 impl_plan에서 styles/main.css 추가 셀렉터 매핑(예: `.product-gallery-section[data-tier-class="hero"] { border-left: 4px solid var(--tier-class-hero-border); }`) 명시 권장.

**권고**: 단계 4에서 styles 셀렉터 추가 + 좌측 막대 두께 (예: 4px = 토큰 신설 또는 기존 spacing 토큰 재사용) 결정.

## 4.5. 03_architecture 5.17 게이트 grep 식 부재 (단계 4 신설 예정)

**위치**: plan 7.2가 5.17 게이트 grep을 명시하지만 03_architecture.md는 5.16(M3.2)까지만 정의. 5.17 절 부재.

**영향**: 단계 4 impl_plan에서 03_architecture 5.17 신설 예정으로 명시(plan 5 Phase 1 "03_arch 갱신"). 본 단계 3 검증 대상에서 제외. M3.1 / M3.2도 동일 흐름 (단계 4에서 게이트 grep 신설).

**권고 grep 식 제안** (단계 4 참고용):
- `tierClassCounts\(` 호출처 = `render/history-tab.js` 1곳.
- `TIER_CLASS_LABEL_KO\[` 호출처 = `render/tier-grid.js` 또는 `product-gallery.js` + `render/history-tab.js` 2곳. 인라인 한국어("메인 등급" / "표준 등급" / "굿즈") 하드코딩 0건.
- 갤러리 접힘 상태(`galleryExpanded === false`)에서 그룹화 분기 미적용.
- `HISTORY_DASHBOARD_COLS_MOBILE` / `_TABLET` / `_TABLET_BREAKPOINT_PX` 값 2 / 4 / 768 인라인 0건.

# 5. 통과 항목

## 5.1. CLAUDE.md 4장 절대 규칙 정합

| # | 규칙 | 검증 결과 |
|---|---|---|
| 5.1.1 | 4.1 게임 로직 / 렌더 분리 | tierClassCounts가 `core/history.js`에 정의 (DOM 0건 + lineup 인자 결정론). 02_data 1.4.A.5 호출처 표 정합. plan 3.1.2 명시. **통과** |
| 5.1.2 | 4.2 매직 넘버 0개 | TIER_CLASS_LABEL_KO 3종 / HISTORY_DASHBOARD_COLS_MOBILE=2 / _TABLET=4 / _TABLET_BREAKPOINT_PX=768 모두 02_data 1.4.A.6 + 1.5에 박제. spec 5.13.D 본문에 인라인 매직 값 0건. **통과** |
| 5.1.3 | 4.3 core/ DOM 0건 | tierClassCounts는 lineup 인자만 받는 순수 함수. 신규 core 모듈 0건 (기존 core/history.js 확장만). **통과** |
| 5.1.4 | 4.4 핵심 로직 변경 시 테스트 | plan 7.1 `tests/suites/tier_class_counts.test.js` 신설 명시 (5케이스). 결함 3.1은 케이스 산출 오류 P1로 단계 4 정정 가능. **통과 (P1 정정 의무 부속)** |
| 5.1.5 | 4.5 docs ↔ code 정합 | 단계 5 진입 전 docs 단독 검증. spec 5.13.D ↔ 02_data 1.4.A.6 / 1.5 / 1.4.A.5 ↔ plan 9.1~9.5 3중 정합. **통과** |
| 5.1.6 | 4.6 사행성 표현 0 | spec 5.13.D / plan 본문 / 02_data 본문 모두 "수집/완주 경험" 표현 정합. "확률 향상" / "필승" 0건. **통과** |
| 5.1.7 | 4.7 8단계 파이프라인 | plan 5 Phase 1~7이 8단계 SSOT 정합. plan 상태 = 단계 1 사용자 승인 + 단계 2 design 진입. **통과** |
| 5.1.8 | 4.8 데이터 신뢰도 | M3.3은 신규 라인업 데이터 추가 0건. 기존 estimated:true 필드 그대로 보존. **통과** |

## 5.2. SSOT 자체 정합

5.2.1. **spec 5.13.D ↔ 02_data 1.4.A.6 cross-link**: spec 5.13.D.2.4 / 5.13.D.3.5에 `TIER_CLASS_LABEL_KO`(02_data 1.4.A.6) 명시 + 1.4.A.6 호출처 줄에 5.13.D.2 / 5.13.D.3 역참조. **양방향 정합**.

5.2.2. **spec 5.13.D ↔ 02_data 1.5 cross-link**: spec 5.13.D.3.3에 `HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX` / `_COLS_MOBILE` / `_COLS_TABLET` 명시 + 02_data 1.5에 3종 박제. **정합**.

5.2.3. **plan 9.1~9.5 ↔ spec 5.13.D 매핑**:
- 9.1 "메인 등급/표준 등급/굿즈" → spec 5.13.D.2.4 + 02_data 1.4.A.6 박제. **정합**.
- 9.2 "2x2 모바일 그리드" → spec 5.13.D.3.3 + 02_data 1.5 (HISTORY_DASHBOARD_COLS_MOBILE=2). **정합**.
- 9.3 "hero→main→goods" → spec 5.13.D.2.2 박제. **정합**.
- 9.4 "Last One hero 마지막" → spec 5.13.D.2.3 박제. **정합**.
- 9.5 "통합 카운트" → spec 5.13.D.3.7 박제. **정합**.

5.2.4. **M3.1 5.13.A / 5.13.B + M3.2 5.13.C + M3.3 5.13.D 충돌 0**: 5.13.D는 "M3.2에서 추첨 탭 + 결과 reveal에 적용한 tier_class를 갤러리 / history 영역으로 확장" 박제 (5.13.D.1). 5.13.C.4.1 / 5.13.C.4.2 비목표 ("갤러리 그룹화 / history 통계 차기 사이클")가 5.13.D에서 흡수. **정합**.

## 5.3. M3.3 신규 항목

| # | 항목 | 검증 결과 |
|---|---|---|
| 5.3.1 | TIER_CLASS_LABEL_KO 한국어 라벨 정합 | 9.1 "메인 등급/표준 등급/굿즈" ↔ 02_data 1.4.A.6 ↔ spec 5.13.D.2.4. **3중 정합** |
| 5.3.2 | HISTORY_DASHBOARD_COLS_MOBILE / _TABLET / _BREAKPOINT_PX | 02_data 1.5 = 2 / 4 / 768. spec 5.13.D.3.3 모두 상수 경유. **정합** |
| 5.3.3 | 갤러리 그룹화 정렬 hero → main → goods | spec 5.13.D.2.2 + 5.13.D.2.3 (Last One hero 마지막) 박제. plan 9.3/9.4 정합 |
| 5.3.4 | hero 카운터 통합 (받은/미받은 분리 0) | spec 5.13.D.3.7 박제. plan 9.5 정합 |
| 5.3.5 | core/history.tierClassCounts 시그니처 | plan 3.1.1 의사 코드 명시 (`(history, lineup) => { hero, main, goods, total }`). 02_data 1.4.A.5 호출처 표에 박제. lineup 인자 결정론. **정합** |

## 5.4. 검증 카테고리 D (누락 / 모호 항목) 처리

5.4.1. **5.13.D.2.5 "좌측 색 막대" 시각**: P2 4.4 = styles 토큰 재사용 가능 (신규 토큰 0). 단계 4 결정 가능.

5.4.2. **5.13.D.3.5 "전체" 카운터 카드 색 톤**: P2 4.2 = main과 시각 분리 모호 가능. 단계 4 / 단계 5 결정 가능.

5.4.3. **5.13.D.3.6 빈 history 안내 문구 충돌**: P2 4.3 = 단계 4 / 단계 5 결정 가능. 사용자 메모리 룰 `feedback_lottery_red_text`는 buy/peel/pick 한정이라 영향 외.

5.4.4. **6.2 갤러리 그룹화 의사 코드 모듈 분기 미정**: P2 4.1 = 단계 4 결정 가능.

5.4.5. **03_arch 5.17 게이트 grep 부재**: P2 4.5 = 단계 4 신설 예정. plan 7.2 grep 항목 4종이 단계 4 게이트 식 박제 후보.

# 6. 통과 판단

**round 1 통과** = P0 0건 + P1 1건(단계 4 정정 가능) + P2 5건(단계 4 결정 가능 또는 정보성).

근거:
- 사용자 결정 9.1~9.5 5건 모두 spec/data SSOT에 정합 박제.
- CLAUDE.md 4장 절대 규칙 위반 0.
- spec 5.13.D / 02_data 1.4.A.6 / 1.5 / 1.4.A.5 cross-link 양방향 정합.
- M3.1 / M3.2 학습 답습 (round 1 통과 패턴): 사용자 결정 박제 → spec/data SSOT 갱신 → 헬퍼 호출처 + 매직 넘버 상수화 동시 박제.
- 절대 규칙 4.1~4.8 모두 정합 (특히 4.1 core/render 분리, 4.2 매직 넘버 0, 4.3 core DOM 0).

**자동 재시도 미수행**: P0 0건이라 재시도 불필요. P1 1건은 단계 4 impl_plan 작성 시점 정정 의무 박제로 충족.

# 7. 단계 4 이월 항목

## 7.1. 단계 4 impl_plan 진입 시 정정 의무 (P1)

7.1.1. **plan 7.1 드래곤볼 케이스 total 정정**: `total=6` → `total=5`. 또는 케이스 매수 변경. 단계 5 implement 진입 전 plan 본문 정정 + 4 impl_plan에서 테스트 케이스 박제 시 정합 산출 표기.

## 7.2. 단계 4 impl_plan 결정 권장 항목 (P2)

7.2.1. **갤러리 그룹화 호출 모듈 결정**: `tier-grid` 단일 통합 또는 `product-gallery` 분리. 결정 후 02_data 1.4.A.5 + spec 5.13.D.2 본문 양분 표현 정정.

7.2.2. **"전체" 카운터 카드 시각 차별화 정책**: main과 동일 배경(`--bg-card`)이라 시각 분리 모호. 보더 강조 또는 수치 폰트 강조 결정.

7.2.3. **빈 history 시 안내 문구 정책**: 대시보드 0/0/0/0 + 기존 리스트 안내 동시 노출 또는 단일 노출 결정.

7.2.4. **5.13.D.2.5 좌측 색 막대 styles 정합**: `border-left` + `--tier-class-{hero,main,goods}-border` 토큰 재사용 셀렉터 명시. 막대 두께 토큰 결정.

7.2.5. **03_arch 5.17 게이트 grep 신설**: tierClassCounts 호출처 / TIER_CLASS_LABEL_KO 호출처 / 갤러리 접힘 분기 / HISTORY_DASHBOARD_* 매직 값 4종 grep 식 박제.

## 7.3. 단계 4 → 단계 5 진입 게이트

7.3.1. P1 3.1 정정 박제 후 단계 4 impl_plan 사용자 승인.

7.3.2. P2 5건 중 4건은 단계 4에서 결정 + impl_plan 본문 박제. 1건(7.2.5)은 03_arch 5.17 게이트 신설로 단계 6 검증 게이트 박제.

7.3.3. 단계 5 implement 진입 시 tier_class_counts.test.js 5 케이스 + render/history-tab.js 갱신 + render 갤러리 모듈 그룹화 + numbers.js TIER_CLASS_LABEL_KO 신설 + main.css / tokens.css 셀렉터 추가 + 02_data 1.4.A.5 호출처 표 단일 모듈 확정 정정.

# 8. 변경 이력

8.1. 2026-05-09: round 1 작성 + 통과 판정. P0 0건 / P1 1건 / P2 5건 / 통과 12건.
