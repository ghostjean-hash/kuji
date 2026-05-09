# M3.2 tier-class-visual 단계 8 improve

작성일: 2026-05-09.
M3.2 스프린트 종료 + 차기 사이클 후보 등재.

# 1. M3.2 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | [01_plan.md](01_plan.md) | 사용자 승인 + 9.1~9.4 결정 박제 |
| 2 design | 02_data 1.4.A.5 / 1.5 / 2.2 / 2.3 + spec 5.13.C 신설 + 03_arch 5.16 게이트 | 매직 넘버 0개 통과 |
| 3 design_review | [03_design_review.md](03_design_review.md) round 1 미통과 → round 2 통과 | round 2 P0 0 / P1 1 / P2 1. 단계 4 이월 4건 |
| 4 impl_plan | [04_impl_plan.md](04_impl_plan.md) | T1~T7 분할 + design_review 이월 답 박제 |
| 5 implement | T1~T7 모두 적용 | 매직 넘버 0개 + CSS 변수 ↔ JS 상수 1:1 |
| 6 impl_review | [06_impl_review.md](06_impl_review.md) round 1 | P0 0 / P1 2 / P2 3 → 통과 |
| 7 qa | [07_qa.md](07_qa.md) | 자비스 정적 정합 통과 + 사용자 라이브 검수 14건 의무 분리 |
| 8 improve | 본 문서 | 작성 완료 |

## 1.2. 코드 변경 합산

- **data**:
  - numbers.js: HERO_POP_SCALE_PEAK / HERO_GLOW_DURATION_MS / HERO_STATIC_GLOW_BLUR_PX / HERO_STATIC_GLOW_ALPHA + getTierClassForTier 헬퍼 export.
  - colors.js: COLOR_TIER_CLASS_HERO_BG_TINT / HERO_GLOW_RGBA / MAIN_BG_TINT / GOODS_BG_TINT 4종.
- **render**:
  - hero-carousel.js + minor-row.js: data-tier-class 속성 부착.
  - peel-card.js: hero 분기 식 applyHeroClassIfNeeded + lineup 인자.
  - peel-panel.js: lineup 전달.
  - dc-result-modal.js: 당첨 시 modalClassName="is-hero-result".
  - modal.js: modalClassName 옵션 추가.
- **styles**: tokens.css 8종 CSS 변수 + 3종 모션. main.css [data-tier-class] 셀렉터 + hero-result-pop 키프레임.
- **tests**: tier_class_lookup.test.js 신설 (16건). runner.js 등록.
- **docs**: 02_data 1.4.A.5 / 1.5 / 2.2 / 2.3 / 4.14. spec 5.13.C / 8.15. 03_arch 5.16 / 6.9.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 1 / P1 3 / P2 4 | 미통과 |
| 3 | round 2 | P0 0 / P1 1 / P2 1 | 통과 |
| 6 | round 1 | P0 0 / P1 2 / P2 3 | 통과 |

M3.1 (round 1 통과) 대비 M3.2는 단계 3 round 2까지 갔으나 그래도 단계 6 round 1 통과로 마무리.

## 1.4. 사용자 결정 4건 박제 정합

| # | 결정 | 적용 위치 |
|---|---|---|
| 9.1 | DC 결과 모달도 hero 모션 적용 | dc-result-modal.js + main.css .modal.is-hero-result |
| 9.2 | minor-row 시각 차이 강도 = 속성 부착만 | minor-row.js data-tier-class + main.css 보더 미지정 |
| 9.3 | hero 카드 약한 골드 정적 글로우 | tokens.css --tier-class-hero-glow-rgba (알파 0.25) |
| 9.4 | tierClass lookup 헬퍼 신설 | numbers.js getTierClassForTier + 호출처 정합 |

## 1.5. design_review 이월 4건 답 정합

| # | 항목 | 답 적용 |
|---|---|---|
| P1 2.4 | PEEL 글로우 + hero 정적 글로우 동시 노출 정책 | box-shadow 자연 합산 (CSS 합성). hero 약 강도(알파 0.25)로 PEEL 우세 |
| P2 2.7 | minor-row 보더 정책 | 등급 색 보더 유지. 배경만 토큰 적용 |
| P2 2.8 | spec 5.13.C.4.4 cross-link | "(02_data 1.4.A.4 정합)" 추가 |
| 03_arch | 모듈 docstring 갱신 | peel-card.js / dc-result-modal.js M3.2 표기 |

# 2. 단계 6 P1 결함 2건 처리 결정

## 2.1. P1-1. dc-result-modal 헬퍼 호출처 표현 정합

옵션 (a) 헬퍼 호출 추가 vs (b) 03_arch 5.16 표현 정정 → **(b) 채택**.

이유:
- DC 결과 객체는 `tier` 필드 부재 (`{isWin, prize, probability, ticketsCount}`)이므로 `getTierClassForTier(lineup, result.tier)` 호출 자체가 형식적으로 부적절.
- spec 5.13.C.3.4 = "DC.tierClass=hero이므로 항상 hero 모션" 사실 박제가 자연 정합.
- 단계 8 정정 (즉시):
  - 03_arch 5.16 마지막 줄 정정: "헬퍼 호출처 = hero-carousel / minor-row / peel-card 3종 + dc-result-modal은 사실 박제 정합 (DC.tierClass=hero, 1.4.A 검증식 정합)".
  - 02_data 1.4.A.5 호출처 4번째 항목 명시 보강: "dc-result-modal.js: hero 모션 적용 시 (DC.tierClass=hero 사실 박제. 헬퍼 호출 불필요)".

## 2.2. P1-2. peel-card vs dc-result-modal hero 분기 비대칭

P1-1 (b) 채택 시 자연 해소.

# 3. 단계 6 P2 결함 3건 처리 결정

## 3.1. P2-1. modalSlide override

처리: **차기 사이클 백로그 등재** (단계 7 라이브 검수 결과에 따라).
- 시각 노이즈 보고 시 → hero-result-pop keyframe에 fade-in 보정 (`0% { opacity: 0; transform: scale(0.96); }`).
- 자연스러움 보고 시 → 정정 불요.

## 3.2. P2-2. peel-card hero scale + rotateY 동시

처리: **차기 사이클 백로그**. 부자연 보고 시 hero scale을 페이지플립 완료(700ms)로 delay.

## 3.3. P2-3. hero-card 보더 transition

처리: **차기 사이클 백로그**. 자연스러움 우선 검수.

# 4. 단계 8 즉시 정정 항목

P1-1 / P1-2 (b) 채택에 따른 03_arch 5.16 + 02_data 1.4.A.5 표현 정정. 본 단계 8 마무리 단계에서 즉시 적용.

# 5. 자비스 사용자 결정 게이트

5.1. **사용자 라이브 검수 결과 보고 의무** (07_qa 3장):
- tests/test.html ALL PASS.
- 시각 시나리오 14건.
- P2 3건 (modalSlide / hero scale + rotateY / 보더 transition) 자연스러움 검수.

5.2. **결함 0건 보고 시** M3.2 정식 종료 + 차기 사이클 진입.

# 6. 차기 사이클 후보

## 6.1. M3.2 비목표 + 단계 6 P2

6.1.1. 상품 갤러리 클래스 그룹화 (M3.1 / M3.2 비목표).
6.1.2. history 탭 클래스별 통계.
6.1.3. 라인업별 IP 액센트 색 (라인업 N≥3 시).
6.1.4. modalSlide + hero-result-pop 자연 합성 (P2-1 라이브 검수 결과에 따라).
6.1.5. peel-card hero scale delay (P2-2).
6.1.6. LAST_ONE_TIER_NAME 상수화 (M3.1 P2-3 잔존).
6.1.7. storage_v5.test.js v3 chain 통합 시나리오 (M3.1 P2-1 잔존).

## 6.2. 메이저 사이클 후보

6.2.1. **M4 = コトブキヤくじ アイドルマスター XENOGLOSSIA 30연 천장 룰** (확장 로드맵 원래의 M3, 첫 메커닉 분기). core/draw.js 천장 카운터 + 30연 도달 시 S賞 lock + spec 천장 메커닉 절 + storage v6 마이그레이션 (천장 카운터 영속).
6.2.2. Happyくじ PIXAR 13등급 확장 검증 (확장 로드맵 M4).
6.2.3. 세가 럭키쿠지 잔여 카운터 UI 모드 (확장 로드맵 M5).

## 6.3. 사용자 외부 작업

6.3.1. assetsAvailable=true 전환 (lobby_hero.webp / 등급별 placeholder webp 배치).

# 7. M3.2 학습 / 다음 사이클 정합 권고

7.1. **단계 3 round 2 통과 학습**: round 1 P0 = "M2 폐기 모듈 표현 부활" 결함은 plan 6.2 의사 코드를 단계 2 design이 그대로 받아쓰며 발생. 다음 사이클은 plan 의사 코드의 모듈명 ↔ spec 폐기 정책 cross-check를 단계 2에서 의무화.

7.2. **CSS 변수 ↔ JS 상수 매핑 박제 패턴 정착**: M3.2 round 1 P1 3.1 학습으로 02_data 2.3 절 신설. 차기 사이클부터 본 패턴 답습 (M3 단계 6 P0 2.4/2.5 학습 + M3.2 단계 3 P1 3.1 학습 통합).

7.3. **DC 도메인 모델 차이 인지**: DC 결과 객체 ≠ 추첨 결과 객체. 헬퍼 호출처 정합 = 사실 박제 정합도 인정. 차기 사이클 시 도메인별 분기 식 다양성 명시.

# 8. PROGRESS 갱신 권고

8.1. PROGRESS.md `# 1. 현재 상태`: M3.2 자비스 8단계 종료 (단계 8 통과) + 사용자 라이브 검수 대기.
8.2. `# 8. M3.2` 절 단계 6/7/8 산출물 추가.
8.3. `# 6. 백로그`에 6.1.4~6.1.7 등재.

# 9. 변경 이력

9.1. 2026-05-09: 초기 작성. M3.2 8단계 종료. 단계 6 P1 2건 (b) 채택. P2 3건 차기 사이클 백로그. 단계 8 즉시 정정 (03_arch + 02_data 표현) 진행.
