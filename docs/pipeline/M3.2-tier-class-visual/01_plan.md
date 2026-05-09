# M3.2 tier-class-visual - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.2-tier-class-visual |
| 시작일 | 2026-05-08 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 완료 (2026-05-08)**. 단계 2 design 진입 |
| 추정 | 2.5~3.0일 (디자인 토큰 0.3 + 추첨 hero/main/goods 액센트 0.7 + 결과 모달 hero 특별 모션 0.5 + 검증 0.5 + 단계 검증 round 여유 0.5) |
| 선행 사이클 | M3.1-lineup-presentation (자비스 8단계 종료, 사용자 라이브 검수 병행 진행) |

# 1. 한 줄

M3.1에서 데이터 메타로만 도입한 tier_class(hero/main/goods)를 본편 화면 시각으로 흘려보내는 후속 사이클. 추첨 탭 hero-carousel / minor-row에 클래스별 액센트(보더/배경 틴트) + 결과 모달 hero 등급 등장 시 특별 모션(팝/글로우 강화). 갤러리 클래스 그룹화 / history 통계 / IP 액센트는 비목표 (차기 사이클).

# 2. 사용자 결정 사항 (선행 합의)

| 결정 | 선택 | 비고 |
|---|---|---|
| 시각 적용 범위 | **추첨 탭 hero-carousel / minor-row + 결과 모달 hero 모션** (2영역) | 사용자 multiSelect 2건. 갤러리/history는 비목표 |
| IP 액센트 색 도입 | **도입 안 함** | M3.1 P2-2 결정 유지. 라인업 N≥3 도달 시 재검토 |
| 추정 분량 | **중 (2.5~3일)** | 단계 검증 round 여유 포함 |

# 3. 스코프 (in scope)

## 3.1. 디자인 토큰 신설 (styles/tokens.css)

3.1.1. **tier_class 액센트 토큰** (M3.2 신설):
- `--tier-class-hero-bg-tint` = `#FFF8E7` (옅은 골드 틴트, 카드 배경)
- `--tier-class-hero-border` = `var(--gold-edge)` (= `#C9A961`, 기존 토큰 재사용)
- `--tier-class-main-bg-tint` = `var(--bg-card)` (= `#FFFFFF`, 무변형)
- `--tier-class-main-border` = `var(--border-subtle)` (기존 재사용)
- `--tier-class-goods-bg-tint` = `var(--bg-elevated)` (= `#F3EDE0`, 살짝 회색 톤)
- `--tier-class-goods-border` = `var(--border-subtle)`

3.1.2. **결과 모달 hero 모션 토큰** (M3.2 신설):
- `--motion-hero-pop-peak` = `1.18` (`var(--result-pop-peak)`= 1.1 대비 강화)
- `--motion-hero-glow-ms` = `1200ms` (글로우 페이드 인/아웃 사이클)

3.1.3. **02_data 2.x에 색 SSOT 박제**: tier_class 토큰을 02_data 2.2에 등재. M3 단계 6 P0 2.4 / 2.5 학습 답습.

## 3.2. 02_data / numbers.js 상수 신설

3.2.1. **HERO_POP_SCALE_PEAK** = `1.18` (numbers.js)
3.2.2. **HERO_GLOW_DURATION_MS** = `1200`
3.2.3. **TIER_CLASS_BG_TINT_KEY** / **TIER_CLASS_BORDER_KEY** 매핑 함수 도입 검토 (단계 2 결정).

## 3.3. core/ 영역 (DOM 0건 정합)

3.3.1. **신규 모듈 없음**. tier_class 자체는 이미 numbers.js에 박제. heroPreview는 lobby 한정으로 유지. 본편 시각 적용은 render 영역 단독.

3.3.2. **호출처에서 lookup**: render 모듈이 tier로부터 tierClass를 lookup 시 `lineup.tiers.find(t => t.tier === currentTier)?.tierClass`. 또는 `tierClass` 헬퍼 함수 신설 (numbers.js, 단계 2 결정).

## 3.4. render/hero-carousel.js (M3.2 갱신)

3.4.1. 카드별 `data-tier-class` 속성 추가. `lineup.tiers[i].tierClass` 동적 lookup.

3.4.2. CSS 셀렉터 `.hero-card[data-tier-class="hero"]` / `[data-tier-class="main"]` / `[data-tier-class="goods"]`로 보더/배경 틴트 차별화.

3.4.3. **hero 카드만 글로우 보강** (옅은 골드 박스 그림자) - 정적 강조. PEEL_REVEAL_VIEW_MS 글로우와 충돌하지 않게 약한 강도.

## 3.5. render/minor-row.js (M3.2 갱신)

3.5.1. 카드별 `data-tier-class` 속성 추가.

3.5.2. CSS 셀렉터로 보더 강도 차별화. main vs goods 시각 구분 약하게(데이터 정합만 표현). 강한 시각은 hero 한정 정책.

3.5.3. **현재 minor-row 등급(G/H/I/J)은 모두 goods 클래스이므로 본 사이클에서 minor-row의 시각 차이는 미세** (등급 색은 그대로, tier_class는 `data-tier-class` 속성만 추가하여 차기 사이클 hook 제공).

## 3.6. render/result-modal.js (M3.2 갱신)

3.6.1. **hero 등급 결과 등장 시 특별 모션**:
- 모달 카드 transform scale 피크 = `var(--motion-hero-pop-peak)` (= 1.18) (기존 `--result-pop-peak` 1.1 대비 강화).
- 결과 텍스트 골드 글로우 (`--motion-hero-glow-ms` 동안 1회 펄스).
- main / goods 등급은 기존 모션 유지 (회귀 위험 0).

3.6.2. **분기 조건**: `result.isLastOne === true` 또는 `tierMeta.tierClass === TIER_CLASS_HERO` 시 hero 모션 적용. 그 외 main/goods 모션 미적용.

3.6.3. **DC 결과 모달 (dc-result-modal.js)**: DC tierClass = hero이므로 동일 hero 모션 적용 (선택). 단계 2 결정.

## 3.7. 정합 / 단계 6 게이트 보강

3.7.1. **신규 게이트 grep (03_architecture 5.16, M3.2 신설)**:
- `data-tier-class` 속성이 hero-carousel + minor-row 모두 부착 정합.
- CSS 셀렉터 `[data-tier-class]` 의존이 numbers.js TIER_CLASS_VALUES와 1:1 정합 (셀렉터 외 인라인 0).
- result-modal 분기 조건이 tierMeta.tierClass === TIER_CLASS_HERO 또는 result.isLastOne 사용 (인라인 "hero" 0).

3.7.2. **단위 테스트**:
- `tests/suites/tier_class_lookup.test.js` 신설 - lineup.tiers + tier 입력 → tierClass lookup 정합.
- 기존 tier_class.test.js의 분류 검증은 그대로 유지.

# 4. 비목표 (out of scope)

4.1. **상품 갤러리 클래스 그룹화** - 차기 사이클 (M3.3 또는 다음 라인업 사이클 직전).
4.2. **history 탭 클래스별 통계** - 차기 사이클.
4.3. **라인업별 IP 액센트 색 토큰** - 라인업 N≥3 도달 시 재검토.
4.4. **천장 룰** (XENOGLOSSIA 30연 S賞) - M4 메이저 사이클.
4.5. **3등급 분류 → 4등급 (mid 도입)** - M3.1 plan 8.2.3 동결 정책 유지.
4.6. **lobby_hero.webp 자산 배치** - 사용자 외부 작업.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (02_data 2.2 토큰 + 1.x HERO_* 상수 + spec 5.13.x M3.2 절 + tierClass lookup 정책) | 0.3일 |
| Phase 2 | 단계 3 design_review (subagent 격리, round 1~N) | 0.3일 |
| Phase 3 | 단계 4 impl_plan (03_architecture 갱신 + T 분할) | 0.3일 |
| Phase 4 | 단계 5 implement Phase A: tokens.css + numbers.js + tierClass lookup 헬퍼 | 0.3일 |
| Phase 5 | 단계 5 Phase B: hero-carousel + minor-row data-tier-class 부착 + CSS 셀렉터 액센트 | 0.4일 |
| Phase 6 | 단계 5 Phase C: result-modal hero 모션 분기 + dc-result-modal 정합 | 0.4일 |
| Phase 7 | 단계 5 Phase D: 단위 테스트 신설 + 기존 suite 회귀 0 확인 | 0.3일 |
| Phase 8 | 단계 6 impl_review (subagent, round 1~N) + 단계 7 QA + 단계 8 improve | 0.7일 |
| **합산** | | **3.0일** |

# 6. 데이터 흐름 (개념)

## 6.1. tier_class lookup (render 영역)

```
hero-carousel.renderHeroCard(tierMeta, ...):
  card.setAttribute("data-tier-class", tierMeta.tierClass)
  // CSS:
  // .hero-card[data-tier-class="hero"] { background: var(--tier-class-hero-bg-tint); border-color: var(--tier-class-hero-border); }
  // .hero-card[data-tier-class="main"] { ... }
  // .hero-card[data-tier-class="goods"] { ... }
```

## 6.2. result-modal hero 분기

```
showResultModal(result, lineup):
  tierMeta = lineup.tiers.find(t => t.tier === result.tier)
  isHero = result.isLastOne || tierMeta?.tierClass === TIER_CLASS_HERO
  if isHero:
    modal.classList.add("is-hero-result")
    // CSS: .modal.is-hero-result .result-card { animation: hero-pop var(--motion-hero-glow-ms) ease; transform-peak: var(--motion-hero-pop-peak); }
  else:
    // 기존 RESULT_POP_SCALE_PEAK = 1.1 모션 유지
```

# 7. 검증 / 단위 테스트 추가

7.1. `tests/suites/tier_class_lookup.test.js` 신설 (드래곤볼 / 원피스 모든 등급의 tierClass lookup 정합).
7.2. 기존 `tests/suites/tier_class.test.js` 보존 + 보강 (hero 분기 식 검증 추가).
7.3. 단계 6 게이트:
- 03_architecture 5.16 grep 통과.
- 매직 넘버 0개 (tier_class 문자열은 모두 TIER_CLASS_* 상수 경유).
- 결정론 회귀 0 (시각만 변경, 추첨/통선택/storage 영향 0).

# 8. 의존성 / 리스크

## 8.1. 의존성

8.1.1. M3.1 종료 상태 정합. tier_class 데이터 메타가 numbers.js에 박제됨 (확인됨).
8.1.2. M3.1 P2-1 / P2-3 결함 처리는 본 사이클과 독립. 차기 정리 라운드.

## 8.2. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 8.2.1 | hero 카드 글로우가 PEEL_REVEAL_VIEW_MS 글로우와 충돌 | 정적 강조 강도를 약하게. 두 글로우 동시 노출 시각 검수 단계 7 |
| 8.2.2 | result-modal 분기 조건(`isHero`)이 Last One 동시 hero인 경우 중복 적용 | result.isLastOne || tierClass === hero 단일 조건. 결과는 동일 hero 모션 (의도) |
| 8.2.3 | minor-row의 등급 색과 tier_class 보더 색 충돌 (시각 노이즈) | minor-row 변경은 data-tier-class 속성 부착만 (CSS 액센트 미세). 차기 사이클에서 정밀화 |
| 8.2.4 | 디자인 토큰 추가가 styles/tokens.css 분량 증가 | 기존 토큰 재사용 우선. 신규 4건 한정 |
| 8.2.5 | M3.1처럼 round 1 통과 못할 위험 | spec/data SSOT 정밀화 + design_review 이월 답을 단계 4에서 박제하는 패턴 유지 |

# 9. 사용자 결정 게이트 (단계 1 → 단계 2) - **확정 (2026-05-08)**

| # | 항목 | 결정 |
|---|---|---|
| 9.1 | DC 결과 모달도 hero 모션 적용 | **적용** (DC.tierClass=hero 자연 정합) |
| 9.2 | minor-row 시각 차이 강도 | **속성 부착만** (현재 G/H/I/J 모두 goods. 차기 사이클 hook) |
| 9.3 | hero 카드 정적 글로우 강도 | **약한 골드 박스 그림자** (PEEL 글로우와 분리) |
| 9.4 | tierClass lookup 헬퍼 함수 numbers.js 신설 | **신설** (`getTierClassForTier(lineup, tierName)`. 호출처 단순화) |

위 4개 결정은 단계 2 design 작성의 입력 파라미터.

# 10. 변경 이력

10.1. 2026-05-08: 초기 작성. 사용자 결정 사항 반영 (스코프 2영역 / IP 액센트 미도입 / 분량 중).
10.2. 2026-05-08: 단계 1 사용자 승인. 9.1~9.4 결정 박제 (DC 모달도 hero / minor-row 속성만 / 약한 골드 글로우 / lookup 헬퍼 신설). 단계 2 design 진입.
