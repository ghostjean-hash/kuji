# M3.2 tier-class-visual 단계 6 impl_review

작성일: 2026-05-09.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
라운드: 1 (round 1 통과).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | **0** | 2 | 3 | **통과** |

P0 0건 → 단계 7 QA 진입 가능. P1 2건은 표현 차이 / 도메인 모델 차이 trade-off. P2 3건은 단계 7 라이브 검수 의무 항목.

# 2. 검증 카테고리

2.1. CLAUDE.md 4장 절대 규칙 (4.1~4.8).
2.2. 03_architecture 5.16 게이트 grep.
2.3. spec ↔ 코드 1:1.
2.4. 결정론 / 회귀.
2.5. 04_impl_plan T1~T7 산출 정합.

# 3. 통과 항목

3.1. **CLAUDE.md 4.1**: getTierClassForTier numbers.js 정의 (data 영역). core/ 신설 0.
3.2. **CLAUDE.md 4.2 매직 넘버 0개**: 1.18 / 1200 / 12 / 0.25 모두 02_data 1.5 + tokens.css 변수 경유. "hero" / "main" / "goods" 모두 TIER_CLASS_* 상수 경유. CSS attribute selector value `[data-tier-class="hero"]`는 식별자 영역 (불가피).
3.3. **CLAUDE.md 4.3**: src/core/ 변경 0.
3.4. **CLAUDE.md 4.4**: tier_class_lookup.test.js 16건 + runner 등록.
3.5. **CLAUDE.md 4.5 docs ↔ code**: 02_data 1.4.A.5 / 1.5 / 2.2 / 2.3 ↔ 코드 1:1.
3.6. **CLAUDE.md 4.6 / 4.7 / 4.8**: 사행성 표현 0 / 8단계 정합 / 데이터 신뢰도 보존.
3.7. **5.16 게이트**: data-tier-class 부착 / CSS 변수 8종 + 모션 3종 / 인라인 hex 0건 / hero 분기 식 (peel-card 정합).
3.8. **spec 5.13.C ↔ 코드**: 매트릭스 / 분기 식 / DC 모달 / minor-row 보더 정책 / 5.13.C.4.4 cross-link 모두 1:1.
3.9. **결정론 / 회귀**: M3.1 / M2.1 / M3 / M2 / M1 흐름 영향 0. 기존 19개 suite 회귀 위험 0.
3.10. **04_impl_plan T1~T7 모두 산출**.

# 4. P0 결함

없음.

# 5. P1 결함 2건 (표현 차이 / 도메인 모델 차이 trade-off)

## 5.1. P1-1. dc-result-modal.js의 헬퍼 호출처 표현 정합

위치: `src/render/dc-result-modal.js:24` + `docs/03_architecture.md` 5.16.

내용:
- 03_arch 5.16 = "헬퍼 호출처 4종 (hero-carousel / minor-row / peel-card / dc-result-modal)".
- 코드는 `result.isWin` 플래그만 분기 (헬퍼 미호출).
- spec 5.13.C.3.4 = "DC.tierClass=hero이므로 항상 hero 모션" 사실 박제 → 헬퍼 호출 결과를 사실로 대체. 의미 정합 OK.

조치: P1로 등재. 단계 8 결정 옵션:
- (a) dc-result-modal에 헬퍼 호출 추가 (lineup 인자 전달) → 코드 4종 정합 강제.
- (b) 03_arch 5.16 / 02_data 1.4.A.5 표현을 "호출처 3종 + DC는 사실 박제 정합"으로 정정 → 표현 정합 강제.

[의견] (b) 채택 권장. DC 결과 객체는 `tier` 필드 부재(`{isWin, prize, probability, ticketsCount}`)이므로 `getTierClassForTier(lineup, result.tier)` 호출 자체가 부적절. 사실 박제가 자연 정합.

## 5.2. P1-2. peel-card vs dc-result-modal hero 분기 패턴 비대칭

위치: peel-card.js (분기식) vs dc-result-modal.js (isWin만).

내용: 03_arch 5.16 hero 분기 식 패턴이 두 모듈에 동일 정합 표현이지만 DC는 도메인 모델이 달라 분기 식 동일 적용 불가.

조치: P1-1과 함께 처리 (b) 채택 시 자연 해소.

# 6. P2 결함 3건 (단계 7 라이브 검수 의무)

## 6.1. P2-1. modalSlide override

위치: styles/main.css `.modal` 기본 modalSlide vs `.modal.is-hero-result` hero-result-pop.

내용: DC 당첨 시 modalSlide(translateY 12px fade-in) 효과 사라지고 hero-result-pop(scale)으로 치환됨.

조치: 단계 7 라이브 검수에서 DC 당첨 모달 등장 자연스러움 검수. 시각 노이즈 시 차기 사이클에서 hero-result-pop keyframe에 fade-in 보정 (`0% { opacity: 0; transform: scale(0.96); }`).

## 6.2. P2-2. peel-card hero scale + rotateY 동시 적용

위치: peel-card .peel-card-inner rotateY (페이지플립 700ms) + .peel-card hero scale (1200ms).

내용: 페이지플립 진행 중 카드 전체가 부풀었다 줄어드는 효과. timing 분리.

조치: 단계 7 라이브 검수. 부자연 시 차기 사이클에서 hero scale을 페이지플립 완료(700ms) 시점으로 delay 옵션.

## 6.3. P2-3. hero-card 보더 transition

위치: .hero-card 기본 `transition: border-color 200ms` + hero 보더 `--gold-edge`.

내용: 라인업 전환 시 hero 카드 보더 색이 200ms 전이.

조치: 단계 7 라이브 검수에서 자연스러움 확인.

# 7. 통과 판단

**판정: 통과 (P0 0건)**.

P1 2건은 표현/도메인 차이 trade-off. 단계 8 결정 옵션 (a) / (b) 중 (b) 권장.
P2 3건은 단계 7 라이브 검수 의무 항목.

# 8. 단계 7 QA 사용자 검수 권고

8.1. tests/test.html 모든 suite ALL PASS (19 + T6 신설 1 = 20개).
8.2. 04_impl_plan 7장 시나리오 7.1~7.8 모두 수행.
8.3. P2-1 / P2-2 / P2-3 시각 노이즈 검수.

# 9. 변경 이력

9.1. 2026-05-09: round 1 검증 (P0 0 / P1 2 / P2 3). 통과 판정. 단계 7 QA 진입.
