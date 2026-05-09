# M3.2 tier-class-visual - 04 구현 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.2-tier-class-visual |
| 단계 | 4 impl_plan |
| 상태 | 작성 완료, 사용자 승인 대기 |
| 입력 | 01_plan.md (사용자 승인 + 9.1~9.4 결정 박제) / 02_data.md (1.4.A.5 / 1.5 / 2.2 / 2.3) / 01_spec.md (5.13.C) / 03_architecture.md (5.16 게이트 + 6.9 변경 이력) / 03_design_review.md (round 2 통과, 단계 4 이월 4건) |

# 1. 한 줄

T1~T7 분할로 단계 5 implement 진행. 단계 3 design_review 이월 4건(P1 2.4 / P2 2.7 / P2 2.8 / 03_architecture 모듈 docstring 갱신) 답을 본 plan에 박제. 매직 넘버 0개 + CSS 변수 ↔ JS 상수 1:1 + 결정론 회귀 0 + 단위 테스트 ALL PASS를 단계 5 종료 게이트로.

# 2. design_review 이월 4건 답

## 2.1. P1 2.4. PEEL 글로우 + hero 정적 글로우 동시 노출 정책

채택: **box-shadow 합산** (CSS의 자연 합성). hero 정적 글로우 강도 약(알파 0.25 + blur 12px)이라 PEEL 글로우(M2 강 강도 + PEEL_REVEAL_VIEW_MS 동안 펄스) 재생 중에는 PEEL이 시각 우세. PEEL 페이드 후 hero 정적 글로우만 잔존. 일시 hide 미사용(시각 깜빡임 회피).

CSS 키프레임 시퀀스:
```
.hero-card[data-tier-class="hero"] {
  box-shadow: 0 0 var(--hero-static-glow-blur-px) var(--tier-class-hero-glow-rgba);  /* 정적 */
}
.hero-card.is-just-revealed {
  box-shadow: var(--shadow-gold-glow);  /* M2 PEEL 글로우 (기존 토큰) */
  animation: hero-peel-glow-fade var(--motion-peel-ms) ease-out forwards;
}
@keyframes hero-peel-glow-fade {
  0%   { box-shadow: var(--shadow-gold-glow); }
  100% { box-shadow: 0 0 var(--hero-static-glow-blur-px) var(--tier-class-hero-glow-rgba); }
}
```

PEEL 클래스 `is-just-revealed`는 PEEL_REVEAL_VIEW_MS 후 제거 (기존 흐름 그대로).

## 2.2. P2 2.7. minor-row 보더 정책

채택: **기존 등급 색 보더 유지**. minor-row의 기존 `--tier-color`(또는 등급별 인라인) 보더가 사용자 시각 식별의 핵심이라 변경 시 회귀. data-tier-class 속성만 부착하여 차기 사이클 hook 제공. CSS 셀렉터는 minor-row에 적용 안 함(또는 적용 시 보더는 `inherit`로 등급 색 보존).

```css
.minor-row-item[data-tier-class="goods"] {
  /* M3.2: 보더는 기존 등급 색 유지. 배경 토큰만 옅게. */
  background: var(--tier-class-goods-bg-tint);
}
```

## 2.3. P2 2.8. spec 5.13.C.4.4 cross-link

채택: **단계 5 implement 시 spec 5.13.C.4.4 본문에 "(02_data 1.4.A.4 분류 정책 정합)" 추가**. 작은 정정. T6 doc 정리에 흡수.

## 2.4. 03_architecture 모듈 docstring 갱신

채택: **단계 5 T 분할에 hero-carousel / minor-row / peel-card / dc-result-modal 4개 모듈의 docstring에 "M3.2: tierClass 분기 추가" 1줄 추가**. result-modal.js는 dead 처리 검토 보류(M3.1 P2-2 결정 = "M2 폐기" 표기 잔존 OK).

# 3. T 분할

| T# | 영역 | 산출물 | 추정 | 의존 |
|---|---|---|---|---|
| T1 | data | numbers.js: TIER_CLASS / STATE_VIEW / DISPATCH_TYPE는 M3.1 그대로. **신규**: HERO_POP_SCALE_PEAK / HERO_GLOW_DURATION_MS / HERO_STATIC_GLOW_BLUR_PX / HERO_STATIC_GLOW_ALPHA + COLOR_TIER_CLASS_HERO_BG_TINT / HERO_GLOW_RGBA / MAIN_BG_TINT / GOODS_BG_TINT (colors.js) + getTierClassForTier(lineup, tier) 헬퍼 export | 0.3일 | - |
| T2 | styles | tokens.css: 8종 CSS 변수 (`--tier-class-{hero,main,goods}-{bg-tint,border}`) + 3종 모션 (`--motion-hero-pop-peak` / `--motion-hero-glow-ms` / `--hero-static-glow-blur-px`) 추가 | 0.2일 | T1 |
| T3 | render | hero-carousel.js + minor-row.js: 카드에 `data-tier-class` 속성 부착. getTierClassForTier 호출. styles/main.css에 `[data-tier-class]` 셀렉터 추가 (hero 정적 글로우 + 배경 틴트 / main 무변형 / goods 배경 틴트). minor-row는 보더 등급 색 유지 + 배경만 토큰 적용 | 0.5일 | T2 |
| T4 | render | peel-card.js: hero 분기 식 적용 (`result.isLastOne || getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO`). hero일 때 transform scale 피크 = HERO_POP_SCALE_PEAK + 골드 글로우 펄스 HERO_GLOW_DURATION_MS. main / goods는 기존 모션 유지. CSS 키프레임 `hero-peel-glow-fade` 추가 | 0.4일 | T1 |
| T5 | render | dc-result-modal.js: hero 분기 동일 적용. DC.tierClass=hero이므로 항상 hero 모션. peel-card.js와 동일 CSS 클래스/키프레임 재사용 | 0.3일 | T1, T4 |
| T6 | tests | tests/suites/tier_class_lookup.test.js 신설 - getTierClassForTier(드래곤볼/원피스 모든 등급) lookup 정합. 기존 tier_class.test.js 보존 + 보강(hero 분기 식 검증 추가) | 0.3일 | T1 |
| T7 | doc | spec 5.13.C.4.4 cross-link 1줄 추가. 4개 모듈 docstring 갱신. PROGRESS.md M3.2 절 신설 + runner.js에 신규 suite 등록 | 0.2일 | T1~T6 |

**합산: 2.2일** (plan 추정 3.0 대비 단축. round 검증 round 1~2 통과 + 본 plan 정밀화로 단계 6 round 1 통과 목표 가능).

# 4. 의존성 그래프

```
T1 (data) ──┬─> T2 (tokens.css)
            ├─> T3 (hero-carousel + minor-row)
            ├─> T4 (peel-card)
            ├─> T5 (dc-result-modal)
            └─> T6 (tests)
T2 ──> T3 (CSS 셀렉터에 토큰 사용)
T4 ──> T5 (CSS 키프레임 재사용)
T1~T6 ─> T7 (doc)
```

# 5. 단계 5 종료 게이트

5.1. 모든 T 완료. PROGRESS.md M3.2 진행 클리어.
5.2. tests/test.html 모든 suite ALL PASS (기존 + T6 신설 1개).
5.3. 매직 넘버 0개 (03_architecture 5.16 grep).
5.4. styles/main.css 인라인 hex / rgba / 수치 0건 (M3 단계 6 P0 2.4/2.5 학습 답습).
5.5. 결정론 회귀 0 (M3.1 + M2.1 + M3 + M2 + M1 모든 흐름 보존).
5.6. 사용자 라이브 검수 사전 self-check:
- 첫 방문 / 재방문 흐름 보존.
- hero 카드 정적 글로우 + PEEL 글로우 자연 합산.
- 결과 reveal hero 모션 (페이지플립 + DC 모달) 강조.
- minor-row 등급 색 보존 + 배경 옅은 회색 톤.

# 6. 단계 6 게이트

6.1. 03_architecture 5.16 grep 모두 통과.
6.2. 모든 단위 테스트 ALL PASS.
6.3. spec 5.13.C / 02_data 1.4.A.5 / 1.5 / 2.2 / 2.3 ↔ src/ 코드 1:1 정합.
6.4. CSS 변수 ↔ JS 상수 1:1 정합 (02_data 2.3 표).
6.5. 결정론 / 회귀 0.

# 7. 단계 7 QA 사용자 검수 항목 (단계 6 통과 후)

7.1. 빈 storage 첫 방문 → 로비 → 라인업 카드 클릭 → main view (M3.1 회귀 0).
7.2. 추첨 1매 뽑기 → A상 등장 → hero 모션 강조 (페이지플립 카드 scale 1.18 + 골드 글로우 1.2초 펄스).
7.3. 추첨 1매 뽑기 → G상 등장 → 기존 모션 유지 (main/goods 회귀 0).
7.4. Last One 등장 → hero 모션 적용 (Last One.tierClass=hero 정합).
7.5. DC 추첨 당첨 → DC 결과 모달에서 hero 모션.
7.6. hero 카드 정적 골드 글로우 + PEEL 글로우 자연 합산 시각 검수.
7.7. minor-row G/H/I/J 카드 등급 색 보존 + 배경 옅은 회색 (boss 클래스 시각).
7.8. tests/test.html ALL PASS.

# 8. 비목표 / 차기 사이클

8.1. 상품 갤러리 클래스 그룹화 (M3.1 5.13.B.8.3 잔존 후보).
8.2. history 탭 클래스별 통계.
8.3. 라인업별 IP 액센트 색.
8.4. M4 메이저 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰.
8.5. lobby_hero.webp 사용자 외부 자산 배치.

# 9. 리스크 / 완화

| # | 리스크 | 완화 |
|---|---|---|
| 9.1 | hero 정적 글로우 + PEEL 글로우 합산 시각 노이즈 | 강도 약(알파 0.25)로 자연 합산. 단계 7 라이브 검수 |
| 9.2 | minor-row 보더 정책 채택(등급 색 유지)이 데이터 정합 신호 약화 | 차기 사이클에서 IP 액센트 도입 시 강화 |
| 9.3 | hero 분기 식 OR 중복(Last One redundant) 의도 누락 시 코드 단순화 유혹 | spec 5.13.C.3.1 박제로 차단 + tier_class_lookup 단위 테스트가 두 분기 검증 |
| 9.4 | 단계 6 round 폭증 | M3.1 패턴(round 1 통과) 재현. spec/data SSOT 정밀화 + design_review 이월 답 박제 |

# 10. 변경 이력

10.1. 2026-05-09: 초기 작성. design_review round 2 통과 후 작성. 단계 4 이월 4건 답 박제. T1~T7 분할.
