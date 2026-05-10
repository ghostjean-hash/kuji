# M3.5 단계 3 design_review (round 1 → round 2 → round 3 합본)

검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
검증일: 2026-05-10. 자동 재시도 2회 사용 (사용자 "한번에 끝까지 진행" 명시 자율 진행 신호 박제).

# 1. 사이클 결과 요약

| 라운드 | 판정 | P0 | P1 | P2 | 통과 |
|---|---|---|---|---|---|
| round 1 | 미통과 | 1 | 1 | 3 | 16 |
| round 2 | 미통과 | 1 | 1 | 1 | 13 |
| round 3 | **통과** | 0 | 0 | 1 (비블로킹) | 18 |

# 2. round 1 결함 + 흡수

## 2.1. P0-1. hero-carousel/minor-row 분기 식 count 기반이라 tierClass 변경만으로 시각 자동 정합 미성립

- 위치: `src/render/hero-carousel.js` line 13 (`count === 1`) / `src/render/minor-row.js` line 13 (`count >= 2`).
- 충돌: spec 5.13.E.3 영향 매트릭스 "자동 정합" 박제 vs 코드 분기 식.
- 원피스 tierClass main → hero 변경해도 hero-carousel 분기 식이 count 기반이라 시각상 변경 0.
- **round 1 답 (b 채택)**: 분기 식 변경 = `tierClass === TIER_CLASS_HERO` / `tierClass === TIER_CLASS_GOODS`.
- **round 2 P0-1로 이어짐** (드래곤볼 회귀 야기).

## 2.2. P1-1. 02_data 4.15/4.16 변경 이력 순서 역전

- 4.15(M3.3 2026-05-09)이 4.16(M3.5 2026-05-10) 아래 배치.
- 흡수: 4.15 위치 정정. round 2 통과.

## 2.3. P2 3건 흡수

- P2-1 spec 5.13.E.3 dc-result-modal 행 누락 → 행 추가.
- P2-2 plan 7.3 산식 가독성 → "hero=A+B+C+D+E+F+LastOne=7개 등급" 명료화.
- P2-3 plan 8.3 minor-row "(빈 행)" 부정확 → 라인업별 변경 전/후 표기.

# 3. round 2 결함 + 흡수

## 3.1. P0-1. round 1 답 `tierClass===HERO` 분기 식이 드래곤볼 hero-carousel 6→1 회귀 야기

- 드래곤볼 1.4-DB.2: A=hero, B/C/D/E/F=main, G/H/I/J=goods, LastOne=hero.
- round 1 답 분기 식 적용 시 드래곤볼 hero-carousel = [A] 1 등급. 변경 전 6 등급에서 회귀.
- plan 비목표 4.1 "드래곤볼 라인업 tier_class 변경 = 사용자 결정 (원피스만)" 정면 위반.
- **round 2 답 ((i) 권고 채택)**: hero-carousel filter = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"`. 드래곤볼/원피스 양쪽 6 등급 동등 노출. minor-row는 round 1 답 (`tierClass === GOODS`) 잔존.

## 3.2. P1-1. plan 8.3 hero-carousel "변경 전 = A 1개 등급" 라인업 무관 표기 오류

- 사실: 변경 전 식 `count===1`은 드래곤볼 6 등급 / 원피스 1 등급으로 라인업별 결과 다름.
- 흡수: plan 8.3을 라인업별 변경 전/후 표기로 정정.

## 3.3. P2-1. plan 3.3.1 후보 "7 등급" 잔존

- 단계 2 design 채택안 = 6 등급 (Last One 별도)이라 plan 3.3.1 후보 텍스트와 충돌.
- 흡수: plan 3.3.1을 round 3 채택안(`tierClass !== GOODS` + 6 등급) 박제로 갱신.

# 4. round 3 결함 (통과 - 비블로킹 P2 1건)

## 4.1. P2-1. hero-carousel.js 변수명 `HERO_TIERS` 의미 어긋남 (단계 4에서 결정 가능)

- round 3 채택 분기 식 = `tierClass !== TIER_CLASS_GOODS` (hero + main 모두 포함).
- 드래곤볼 적용 시 변수에 hero(A) + main(B~F) 모두 들어감 → 변수명 부정확.
- 원피스는 round 3 분류로 모두 hero라 변수명 정합.
- **권고**: 단계 4 impl_plan에서 (a) 변수명 유지 + 주석 보강 / (b) `CAROUSEL_TIERS` 또는 `NON_GOODS_TIERS`로 개명 결정. 본 사이클 비블로킹.

# 5. 회귀 / 의도 정합 검증 (round 3)

## 5.1. 드래곤볼 회귀 0

| 영역 | 변경 전 | 변경 후 | 회귀 |
|---|---|---|---|
| hero-carousel | A/B/C/D/E/F (6, count===1) | A/B/C/D/E/F (6, hero+main) | 0 |
| minor-row | G/H/I/J (4, count>=2) | G/H/I/J (4, goods) | 0 |

## 5.2. 원피스 사용자 의도 정합

| 영역 | 변경 전 | 변경 후 | 사용자 의도 |
|---|---|---|---|
| hero-carousel | A (1, count===1) | A/B/C/D/E/F (6, hero) | 정합 (주요 상품 첫줄로) |
| minor-row | B/C/D/E/F + G/H/I (8, count>=2) | G/H/I (3, goods) | 정합 (B~F는 hero-carousel 흡수) |
| product-gallery | A + LastOne / B~F / G/H/I | A/B/C/D/E/F + LastOne / 빈 main / G/H/I | 정합 (M3.3 그룹화 자동) |
| history 대시보드 | hero=A+LastOne / main=B~F / goods=G~I | hero=A+B+C+D+E+F+LastOne / main=0 / goods=G+H+I | 정합 (자동 카운트) |

# 6. round 1/2/3 흡수 정합 표

| 라운드 | 결함 | 흡수 위치 | 결과 |
|---|---|---|---|
| round 1 P0-1 | 분기 식 count → tierClass | spec 5.13.E.3 + arch 5.18 + plan 3.3.1/4.8/8.3 (round 3 답) | 흡수 |
| round 1 P1-1 | 02_data 4.15/4.16 순서 | 02_data line 824/826 정렬 | 흡수 |
| round 1 P2-1 | spec dc-result-modal 누락 | spec 5.13.E.3 행 추가 | 흡수 |
| round 1 P2-2 | plan 7.3 산식 | plan 7.3 명료화 | 흡수 |
| round 1 P2-3 | plan 8.3 minor-row | plan 8.3 라인업별 표기 | 흡수 |
| round 2 P0-1 | `tierClass===HERO` 드래곤볼 회귀 | spec 5.13.E.3 + arch 5.18/6.11 + plan 3.3.1/8.3/10.4 (round 3 답 = `tierClass !== GOODS`) | 흡수 |
| round 2 P1-1 | plan 8.3 변경 전 표기 오류 | plan 8.3 라인업별 변경 전/후 | 흡수 |
| round 2 P2-1 | plan 3.3.1 "7 등급" 잔존 | plan 3.3.1 round 3 채택안 박제 | 흡수 |
| round 3 P2-1 | hero-carousel 변수명 | 단계 4 impl_plan에서 결정 | 비블로킹 |

# 7. 학습 (M3 series 단계 3 패턴)

7.1. **분기 식 SSOT 정합 검증 의무 (M3.5 신규 학습)**: 데이터 분류(tierClass) 변경 시 호출처 분기 식이 데이터 기반인지 count 기반인지 grep 의무. M3.5 round 1 P0-1 = count 기반 분기 식 누락 → 시각 자동 정합 미성립. M3 series 단계 3 검증 항목으로 박제.

7.2. **다중 라인업 영향 매트릭스 의무 (M3.5 round 2 학습)**: 분기 식 변경 시 모든 활성 라인업에 대한 영향 매트릭스 박제 의무. round 2 P0-1 = 드래곤볼 회귀를 단일 라인업(원피스) 매트릭스로 인지 미달. M3 series 단계 3 검증 항목 (검증 항목 1.B "라인업별 컬럼") 박제.

7.3. **자동 재시도 2회 사용 사례 박제**: 사용자 "한번에 끝까지 진행" 명시 자율 진행 신호로 round 1 → round 2 → round 3 진행. 통상 1회 후 사용자 핸드오프 룰의 명시 우회. 차기 사이클에서 동일 신호 시 답습 패턴.

# 8. 변경 이력

8.1. 2026-05-10: round 1 P0/P1/P2 발견. round 2 정정 흡수.
8.2. 2026-05-10: round 2 신규 P0(드래곤볼 회귀) 발견. round 3 정정 흡수.
8.3. 2026-05-10: round 3 통과. P0=0, P1=0, P2=1 (비블로킹). 단계 4 impl_plan 진입.
