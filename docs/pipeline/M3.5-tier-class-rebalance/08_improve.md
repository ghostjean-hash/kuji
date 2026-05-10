# M3.5 단계 8 improve

작성일: 2026-05-10.
M3.5 스프린트 종료 + 차기 사이클 후보 등재.

# 1. M3.5 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | [01_plan.md](01_plan.md) | 사용자 자율 진행 신호 ("한번에 끝까지 진행"). 결정 5건 박제 |
| 2 design | 02_data 1.4.A.3 룰 완화 + 1.4.A.4 자율 분류 + 1.4-OP.2 B-F=hero / spec 5.13.E 신설 / arch 5.14 갱신 + 5.18 신설 | 매직 넘버 0개 통과 |
| 3 design_review | [03_design_review.md](03_design_review.md) round 1 P0=1, round 2 P0=1 (드래곤볼 회귀), round 3 통과 | 자동 재시도 2회 사용 (자율 진행 신호 박제) |
| 4 impl_plan | [04_impl_plan.md](04_impl_plan.md) | T1~T8 분할 + design_review round 1/2/3 이월 답 박제 |
| 5 implement | T1~T7 적용 (T8 PROGRESS는 단계 8 흡수) | 구현 완료 |
| 6 impl_review | [06_impl_review.md](06_impl_review.md) round 1 P0=2 (회귀 테스트 미갱신), round 2 통과 | 자동 재시도 1회 사용 |
| 7 qa | [07_qa.md](07_qa.md) | 자비스 정적 통과 + 사용자 라이브 검수 의무 (M3 series 누적) |
| 8 improve | 본 문서 | 작성 완료 |

## 1.2. 코드 변경 합산

- **data**:
  - numbers.js: TIERS_ONEPIECE B/C/D/E/F tierClass main → hero (5건). _validateLineupTierClass → validateLineupTierClass 개명 + export. REQUIRED_TIER_CLASSES = [HERO, GOODS] export. main 룰 throw 코드 제거.
- **render**:
  - hero-carousel.js: filter 식 `count===1` → `tierClass !== TIER_CLASS_GOODS`. 변수명 HERO_TIERS → CAROUSEL_TIERS (3 호출처). import에 TIER_CLASS_GOODS 추가. docstring 갱신.
  - minor-row.js: filter 식 `count>=2` → `tierClass === TIER_CLASS_GOODS`. import에 TIER_CLASS_GOODS 추가. docstring 갱신.
- **tests**:
  - tier_class.test.js (M3.1 suite): line 38 "각 ≥ 1" → "hero ≥ 1 + goods ≥ 1" + REQUIRED_TIER_CLASSES 사용. line 60 원피스 B-F 기대값 main → hero. (round 2 흡수)
  - tier_class_lookup.test.js (M3.2 suite): 원피스 B-F → hero 5건 갱신 + B-F hero 분기 시뮬레이션 추가.
  - tier_class_counts.test.js (M3.3 suite): 원피스 (A 1 + B 2 + I 5) hero=3/main=0 갱신 + (A 1 + F 6 + Last One 1) hero=8 케이스 추가.
  - lineup_validation.test.js (M3.5 신설): 7 케이스 (드래곤볼/원피스 실 데이터 + 가상 fixture 5건).
  - runner.js: lineup_validation 등록.
- **docs**:
  - 02_data: 1.4.A.3 룰 완화 (main 룰 제거) / 1.4.A.4 라인업별 자율 분류 명문화 / 1.4-OP.2 B-F=hero + M3.5 분류 근거 박제 + M3.1 구 분류 근거 폐기 표시 / 라인업 추가 절차 7번 항목 / 4.16 변경 이력.
  - 01_spec: 5.13.D.2.6 텍스트 갱신 (round 1 P1 흡수) / 5.13.E 신설 (5.13.E.1~5.13.E.4) / 8.17 변경 이력.
  - 03_arch: 5.14 갱신 (M3.5 룰 완화) / 5.18 신설 (분기 식 grep 포함) / 6.11 변경 이력.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 1 / P1 1 / P2 3 | 미통과 |
| 3 | round 2 | P0 1 / P1 1 / P2 1 | 미통과 |
| 3 | round 3 | P0 0 / P1 0 / P2 1 | 통과 |
| 6 | round 1 | P0 2 / P1 1 / P2 0 | 미통과 |
| 6 | round 2 | P0 0 / P1 0 / P2 1 | 통과 |

자동 재시도 한도 초과 (단계 3 round 3 진입). 사용자 "한번에 끝까지 진행" 명시 자율 진행 신호 박제.

## 1.4. 사용자 결정 5건 박제 정합

| # | 결정 | 적용 위치 |
|---|---|---|
| 9.1 | tier_class를 hero로 의미 변경 (B/C/D/E/F 모두) | TIERS_ONEPIECE 5건 + 02_data 1.4-OP.2 |
| 9.2 | F 미니 / E 디오라마 모두 포함 | TIERS_ONEPIECE E/F |
| 9.3 | 원피스만 변경 (DB main 유지) | TIERS_DRAGONBALL 변경 0 |
| 9.4 | 검증식 main = 0 허용 | validateLineupTierClass + REQUIRED_TIER_CLASSES |
| 9.5 | M3.5 완료 후 M3.1/M3.2/M3.3 함께 검수 | 07_qa 3.2 박제 |

# 2. 단계 6 P2 결함 1건 처리

## 2.1. P2-1. spec 5.13.E.3 hero-carousel 비고 표현 미세 부정합

처리: **차기 정리 라운드 백로그**. 원피스 main = 0 사례에서 "hero/main 톤 차이 유지" 표현 부정확. 영향 0이라 본 사이클 비강제. M3.4-tidy 흡수 후보.

# 3. 자비스 사용자 결정 게이트

3.1. **사용자 라이브 검수 의무** (07_qa 3장).
3.2. **결함 0 보고 시** M3.5 정식 종료. 차기 사이클 진입.

# 4. 차기 사이클 후보

## 4.1. 즉시 / 정리

4.1.1. **M3.4-tidy 정리 라운드** (소): tier-grid.js dead 모듈 폐기 (M3.3 P2-1) + LAST_ONE_TIER_NAME 상수화 (M3.1 P2-3) + storage_v5.test.js v3 chain (M3.1 P2-1) + "전체" 라벨 / CSS 인라인 px 정책 통일 (M3.3 P2-2) + spec 5.13.E.3 hero-carousel 비고 표현 (M3.5 P2-1).

4.1.2. **라이브 검수 결과 의존**: M3.1/M3.2/M3.3/M3.5 라이브 검수 결과 보정. 누적 채무 한 사이클(M3.6) 흡수.

## 4.2. 메이저 사이클

4.2.1. **M4 = コトブキヤくじ アイドルマスター XENOGLOSSIA 30연 천장 룰** (확장 로드맵 원래의 M3, 첫 메커닉 분기): core/draw.js 천장 카운터 + 30연 도달 시 S賞 lock + spec 천장 메커닉 절 + storage v6 마이그레이션 (천장 카운터 영속).

## 4.3. 사용자 외부 작업

4.3.1. assetsAvailable=true 전환 (lobby_hero.webp + 등급별 placeholder webp 배치).

# 5. 학습 / 다음 사이클 정합 권고

5.1. **분기 식 SSOT 정합 검증 의무 (M3.5 신규 학습)**: 데이터 분류(tierClass) 변경 시 호출처 분기 식이 데이터 기반인지 count 기반인지 grep 의무. 단계 3 design_review에서 catch 못한 결함 = round 1 P0-1.

5.2. **다중 라인업 영향 매트릭스 의무 (M3.5 round 2 학습)**: 분기 식 변경 시 모든 활성 라인업에 대한 영향 매트릭스 박제 의무. round 2 P0-1 = 드래곤볼 회귀를 단일 라인업 매트릭스로 인지 미달.

5.3. **회귀 테스트 갱신 grep 의무 (M3.5 단계 6 round 1 학습)**: 데이터 분류 변경 시 동일 류 회귀 테스트가 다중 suite에 산포된 경우 grep 의무. tier_class.test.js (M3.1 suite) 갱신 누락이 단계 6 P0-1/P0-2 야기.

5.4. **자동 재시도 한도 초과 사례 박제 (M3.5)**: 자비스 룰 = 자동 재시도 1회 후 사용자 핸드오프. M3.5는 단계 3 round 3 + 단계 6 round 2까지 자율 진행 = 사용자 "한번에 끝까지 진행" 명시 신호로 한도 우회. 차기 동일 신호 시 답습 패턴.

# 6. 변경 이력

6.1. 2026-05-10: 초기 작성. M3.5 8단계 종료. 단계 3 자동 재시도 2회 / 단계 6 자동 재시도 1회. 단계 6 P2 1건 차기 정리 라운드 백로그.
