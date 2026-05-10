# M3.5 tier-class-rebalance - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.5-tier-class-rebalance |
| 시작일 | 2026-05-10 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 완료 (2026-05-10, "한번에 끝까지 진행" 명시 자율 진행 신호)**. 단계 2 design 진입 |
| 추정 | 1.5~2.0일 (data SSOT 0.3 + 검증식 완화 0.3 + 시각 영향 검토 0.4 + 검증 라운드 0.5) |
| 선행 사이클 | M3.1 / M3.2 / M3.3 (자비스 8단계 종료, 사용자 라이브 검수 미수행 - M3.5와 함께 검수) |

# 1. 한 줄

원피스 라인업의 B/C/D/E/F 등급 tier_class를 main → hero로 의미 재조정. 사용자가 도메인 인식상 "주요 상품"으로 보는 범위를 hero 그룹에 포함. 검증식 1.4.A.3 "각 클래스 ≥ 1" 룰을 "hero ≥ 1 + goods ≥ 1"로 완화 (main = 0 허용). 드래곤볼은 main 유지 (라인업별 자율 분류 정책).

# 2. 사용자 결정 사항 (선행 합의 - 2026-05-10)

| 결정 | 선택 | 비고 |
|---|---|---|
| 변경 의미 | **(A) tier_class를 hero로 의미 변경** | 갤러리/추첨/모션/대시보드 모두 hero 처리 |
| 포함 범위 | **(A) B/C/D/E/F 모두** | F 미니 피규어 / E 디오라마 박스 포함 |
| 드래곤볼 정합 | **(A) 원피스만 변경** | 라인업별 분류 패턴 자율, 일관성 강제 없음 |
| 검증식 1.4.A.3 | **(A) main = 0 허용** | hero ≥ 1 + goods ≥ 1만 의무 |
| 라이브 검수 | **(A) M3.5 완료 후 M3.1/M3.2/M3.3 함께 검수** | M3.5가 재검토 근거 |

# 3. 스코프 (in scope)

## 3.1. 데이터 SSOT 변경

3.1.1. **02_data 1.4-OP.2** (라인업: 一番くじ ワンピース MONKEY.D.LUFFY 등급별 매수): B/C/D/E/F tierClass main → hero. 변경 5건.

3.1.2. **research/lineups.json** ONE PIECE 항목 tier_class 정합 갱신.

3.1.3. **src/data/numbers.js TIERS_ONEPIECE**: 02_data 1.4-OP.2와 1:1 정합.

3.1.4. **02_data 1.4-OP 변경 이력**: M3.5에서 재조정 사실 + 사유 박제.

## 3.2. 검증식 1.4.A.3 완화

3.2.1. **02_data 1.4.A.3 검증식 룰 변경**: "hero/main/goods 각 ≥ 1 의무" → **"hero ≥ 1 + goods ≥ 1 의무, main 등급 부재 허용"**.

3.2.2. **src/data/numbers.js validateLineup 함수 갱신**: TIER_CLASS_VALUES 순회 부분에서 main 등급 부재 throw 제거.

3.2.3. **검증 단위 테스트** (`tests/suites/lineup_validation.test.js` 또는 기존 suite 확장):
- main 등급 0개 + hero ≥ 1 + goods ≥ 1 라인업 → 통과.
- hero 0개 라인업 → throw (룰 잔존).
- goods 0개 라인업 → throw (룰 잔존).

## 3.3. 시각 / 시스템 영향 검토 (단계 2 design에서 결정)

3.3.1. **추첨 hero-carousel / minor-row** (M3.2) - **round 3 채택안 박제**:
- hero-carousel filter = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"`. 드래곤볼 A/B/C/D/E/F (6 등급) / 원피스 A/B/C/D/E/F (6 등급). 양쪽 라인업 동등 6 등급 노출.
- minor-row filter = `t.tierClass === TIER_CLASS_GOODS && t.tier !== "Last One"`. 드래곤볼 G/H/I/J (4 등급) / 원피스 G/H/I (3 등급).
- data-tier-class 속성으로 hero/main 톤 차이 유지 (M3.2 시각 토큰 자동 정합).
- carousel max-width / scroll / 카드 크기 정책 변경 0 (비목표 4.8).

3.3.2. **결과 reveal hero 모션** (M3.2): B~F 당첨 시 페이지플립 + 골드 글로우 hero 모션 적용.
- (a) 그대로 적용 (사용자 의도 = 주요 상품 강조).
- (b) F (미니 피규어)만 모션 약화 (sub-hero 토큰)?
- **단계 2에서 결정 박제 의무**.

3.3.3. **history 대시보드** (M3.3): 원피스 카운트 시 hero 카드에 A/B/C/D/E/F/LastOne 합산 → 큰 숫자. main 카드 0 표시.
- 현 구현 그대로 자동 정합 (tierClassCounts 알고리즘 영향 0).
- main 카드를 0일 때 숨길지 / 0 표시할지: 현 구현 = 항상 표시 (M3.3 결정). M3.5에서도 유지.

3.3.4. **상품 갤러리 그룹화** (M3.3): 원피스 hero 섹션에 A/B/C/D/E/F + LastOne 모두 카드 나열. main 섹션 부재.
- 현 구현 정합. main 섹션 빈 경우 헤더 자체 미렌더 (단계 2 design에서 명시 박제).

## 3.4. 테스트 갱신

3.4.1. **tests/suites/tier_class_lookup.test.js**: 원피스 B/C/D/E/F lookup 결과 hero로 갱신.

3.4.2. **tests/suites/tier_class_counts.test.js**: 원피스 history 시나리오 hero 카운트 갱신.

3.4.3. **tests/suites/lineup_validation.test.js** (신설 또는 확장): 완화된 검증식 케이스 추가.

# 4. 비목표 (out of scope)

4.1. 드래곤볼 라인업 tier_class 변경 (사용자 결정 - 원피스만).
4.2. 신규 클래스 도입 (예: hero/major/main/goods 4단계) - M3.1 동결 정책 유지.
4.3. 라인업별 IP 액센트 색 - M3.1 / M3.2 비목표 잔존.
4.4. M3.4-tidy 정리 라운드 항목 (tier-grid.js dead 폐기 / LAST_ONE_TIER_NAME 상수화 / storage_v5 v3 chain / CSS 인라인 정책) - 별도 사이클.
4.5. M4 메이저 (코토부키야쿠지 30연 천장 룰) - 별도 사이클.
4.6. M3.2 라이브 검수 결과 보정 (modalSlide / hero scale + rotateY / 보더 transition) - 라이브 검수 결과 의존.
4.7. lobby_hero.webp 자산 배치 - 사용자 외부 작업.
4.8. 추첨 hero-carousel UI 자체 재설계 - 본 사이클은 데이터 분류 변경 + 분기 식 미세 변경(`count` → `tierClass`) 흡수. **단, carousel 토큰 / scroll 동작 / 카드 크기 정책 재설계는 비목표** (라이브 검수 결함 보고 시 별도 사이클). round 1 design_review P0-1 정정으로 명문화.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (02_data 1.4-OP.2 + 1.4.A.3 + 시각 영향 표 + spec 5.13.X 갱신) | 0.3일 |
| Phase 2 | 단계 3 design_review (subagent 격리, round 1 통과 목표 / 호출처 grep 의무) | 0.3일 |
| Phase 3 | 단계 4 impl_plan (T 분할 + design_review 이월 답) | 0.2일 |
| Phase 4 | 단계 5 implement Phase A: numbers.js TIERS_ONEPIECE + validateLineup 완화 + lineups.json | 0.2일 |
| Phase 5 | 단계 5 Phase B: 테스트 갱신 (tier_class_lookup / tier_class_counts / lineup_validation) | 0.3일 |
| Phase 6 | 단계 5 Phase C: spec 5.13.X 갱신 + PROGRESS M3.5 절 | 0.2일 |
| Phase 7 | 단계 6 impl_review + 단계 7 QA + 단계 8 improve | 0.4일 |
| **합산** | | **1.9일** |

# 6. 데이터 흐름 (개념)

## 6.1. 변경 흐름

```
SSOT (02_data 1.4-OP.2)
  → numbers.js TIERS_ONEPIECE (B/C/D/E/F tierClass: main → hero)
  → research/lineups.json 정합
  → 자동 영향:
    - getTierClassForTier(LINEUP_ONEPIECE, "B"~"F") = "hero"
    - tierClassCounts(history, LINEUP_ONEPIECE).hero = A+B+C+D+E+F+LastOne 합산
    - product-gallery hero 섹션 = A/B/C/D/E/F/LastOne 카드
    - hero-carousel = A/B/C/D/E/F/LastOne data-tier-class="hero" 카드
    - 결과 reveal: B/C/D/E/F 당첨 시 hero 페이지플립 + 골드 글로우
```

## 6.2. 검증식 완화

```
validateLineup(lineup):
  - 모든 tier에 tierClass ∈ TIER_CLASS_VALUES (잔존)
  - dc.tierClass ∈ TIER_CLASS_VALUES (잔존)
  - hero ≥ 1 (잔존, throw)
  - main ≥ 1 (제거, throw 0)
  - goods ≥ 1 (잔존, throw)
```

# 7. 검증 / 단위 테스트 추가

7.1. `tests/suites/tier_class_lookup.test.js` 갱신:
- 원피스 B/C/D/E/F lookup → "hero" (기존 "main" → "hero" 변경).
- 원피스 A / Last One → "hero" (잔존).
- 원피스 G/H/I → "goods" (잔존).
- 드래곤볼 lookup 케이스 모두 잔존 (변경 0).

7.2. `tests/suites/tier_class_counts.test.js` 갱신:
- 원피스 history (A 1 + B 2 + I 5) → hero=3 / main=0 / goods=5 / total=8 (기존 hero=1 / main=2).

7.3. `tests/suites/lineup_validation.test.js` 신설 또는 확장:
- 원피스 라인업 (M3.5 완화 후) → 통과 (main=0개 등급, hero=A+B+C+D+E+F+LastOne=7개 등급, goods=G+H+I=3개 등급).
- hero=0 가상 라인업 → throw.
- goods=0 가상 라인업 → throw.

7.4. 03_architecture 5.18 게이트 grep (M3.5 신설):
- TIERS_ONEPIECE의 tierClass 분포 (hero ≥ 1 + goods ≥ 1).
- validateLineup 함수의 main ≥ 1 throw 제거.
- 02_data 1.4-OP.2와 numbers.js 1:1 정합.
- 02_data 1.4.A.3 룰 표현과 validateLineup 코드 1:1 정합.

# 8. 의존성 / 리스크

## 8.1. 의존성

8.1.1. M3.1 / M3.2 / M3.3 종료 상태 정합 (tier_class 메타 + getTierClassForTier 헬퍼 + 시각 + 카운트 모두 보유).
8.1.2. 라이브 검수 미수행 상태에서 진입 - M3.5 완료 후 함께 검수 (사용자 결정).

## 8.2. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 8.2.1 | hero-carousel에 7개 등급 노출 시 가독성 저하 | 단계 2 design에서 결정 박제. 라이브 검수에서 결함 보고 시 M3.5 후속 보정 |
| 8.2.2 | F (미니 피규어) hero 모션 적용 시 사용자 인식 위화감 | 단계 2 design에서 (a)/(b) 결정. 사용자 의도(주요 상품) 우선 |
| 8.2.3 | minor-row 빈 상태 시각 부담 | 단계 2 design에서 빈 minor-row 처리 (숨김 vs 빈 영역 vs 라벨 텍스트만) 결정 |
| 8.2.4 | 검증식 완화로 향후 라인업 데이터 정합성 약화 | "hero ≥ 1 + goods ≥ 1" 잔존이라 핵심 룰 유지. main = 0은 라인업 자유도 |
| 8.2.5 | 드래곤볼 라인업과 분류 패턴 불일치 시 사용자 인지 부담 | 사용자 결정 (라인업별 자율) 박제. 02_data 1.4-OP / 1.4-DB 차이 명시 |
| 8.2.6 | M3.1/M3.2/M3.3 라이브 검수 미수행 상태에서 M3.5 진입으로 결함 발견 시 재작업 | 라이브 검수 시점에 누적 결함 일괄 보정. M3.5 + M3.1/M3.2/M3.3 결함을 M3.5 종료 후 한 사이클(M3.6 또는 정리 라운드)에서 흡수 |

## 8.3. 영향 매트릭스 (시스템 / 시각 / 데이터 별 점검)

| 영역 | 변경 전 | 변경 후 | 비고 |
|---|---|---|---|
| getTierClassForTier(LINEUP_ONEPIECE, "B") | "main" | "hero" | 자동 정합 |
| product-gallery hero 섹션 | A + LastOne | A/B/C/D/E/F + LastOne | 카드 7개 |
| product-gallery main 섹션 | B/C/D/E/F | (빈 섹션) | 헤더 미렌더 결정 의무 |
| hero-carousel (드래곤볼 / 원피스) | DB: A/B/C/D/E/F (6, filter `count===1`) / OP: A (1, filter `count===1`) | DB: A/B/C/D/E/F (6, filter `tierClass !== GOODS && tier !== "Last One"`) / OP: A/B/C/D/E/F (6, 동일 filter) | **filter 식 변경 의무** (round 3 정정). 양쪽 라인업 동등 6 등급 노출 |
| minor-row (드래곤볼 / 원피스) | DB: G/H/I/J (4, filter `count>=2`) / OP: B/C/D/E/F + G/H/I (8, filter `count>=2`) | DB: G/H/I/J (4, filter `tierClass===GOODS && tier !== "Last One"`) / OP: G/H/I (3, 동일 filter) | **filter 식 변경 의무** (round 1 P0-1 정정). main 부재 자연 흡수 |
| 결과 reveal hero 모션 | A / LastOne 당첨 시 | A/B/C/D/E/F/LastOne 당첨 시 | 모션 발동 빈도 ↑ |
| history 대시보드 hero 카운트 | A+LastOne 매수 | A+B+C+D+E+F+LastOne 매수 | 자동 정합 |
| history 대시보드 main 카운트 | B+C+D+E+F 매수 | 0 | 자동 정합 |
| validateLineup(LINEUP_ONEPIECE) | throw 미발생 | throw 미발생 (룰 완화) | main = 0 허용 |
| validateLineup(LINEUP_DRAGONBALL) | 통과 | 통과 | 변경 0 |
| DC.tierClass 검증식 | TIER_CLASS_VALUES 안 | 잔존 | 변경 0 |

# 9. 사용자 결정 게이트 (단계 1 → 단계 2) - **승인 대기**

| # | 항목 | 권고 | 결정 |
|---|---|---|---|
| 9.1 | 원피스 B/C/D/E/F tierClass | main → hero (확정) | 단계 1 승인 시 박제 |
| 9.2 | 검증식 1.4.A.3 룰 | "hero ≥ 1 + goods ≥ 1 의무, main = 0 허용" (확정) | 단계 1 승인 시 박제 |
| 9.3 | 드래곤볼 정합 | 원피스만 변경 (확정) | 단계 1 승인 시 박제 |
| 9.4 | hero-carousel 7개 노출 처리 | 단계 2 design에서 시각 검토 후 결정 | 단계 2 결정 |
| 9.5 | minor-row 빈 상태 처리 | 단계 2 design에서 결정 (숨김 / 빈 영역 / 라벨만) | 단계 2 결정 |
| 9.6 | F 미니 피규어 hero 모션 적용 | 그대로 (사용자 의도) | 단계 2 design 박제 |
| 9.7 | product-gallery main 섹션 빈 경우 | 헤더 자체 미렌더 (현 구현 정합) | 단계 2 design 박제 |
| 9.8 | 라이브 검수 시점 | M3.5 완료 후 M3.1/M3.2/M3.3 함께 검수 (확정) | 단계 1 승인 시 박제 |

# 10. 변경 이력

10.1. 2026-05-10: 초기 작성. 사용자 결정 5건 박제 (변경 의미 / 포함 범위 / DB 정합 / 검증식 / 라이브 검수). 단계 1 사용자 승인 대기.
10.2. 2026-05-10: 사용자 "한번에 끝까지 진행" 명시 자율 진행 신호. 단계 1 승인 갈음. 단계 2~8 자율 사이클. 단계 4 사용자 승인 게이트도 자율 통과. 단계 3/6 subagent 격리 검증 의무 잔존.
10.3. 2026-05-10: 단계 3 design_review round 1 P0-1 정정. hero-carousel/minor-row 분기 식이 count 기반(`count===1` / `count>=2`)이라 tierClass 변경만으로 시각 자동 정합 미성립. (b) 분기 식 변경 채택 (round 1 답 = `tierClass===TIER_CLASS_HERO` / `tierClass===TIER_CLASS_GOODS`). 4.8 비목표 표현 정정 + 7.3 산식 표현 명료화 + 8.3 영향 매트릭스 갱신. P1-1 (02_data 4.15/4.16 순서 정정) + P2-1 (dc-result-modal 행 추가) + P2-2/P2-3 (plan 표현) 모두 흡수.
10.4. 2026-05-10: 단계 3 design_review round 2 P0-1 재정정. round 2 채택 분기 식 `tierClass===HERO`가 드래곤볼 hero-carousel 6→1 회귀 야기 (비목표 4.1 위반). round 3 정정 = `tierClass !== TIER_CLASS_GOODS` 채택. 드래곤볼/원피스 양쪽 6 등급 동등 노출 정합. spec 5.13.E.3 라인업별 컬럼 (드래곤볼/원피스) 명시 + plan 3.3.1 채택안 박제 + plan 8.3 라인업별 변경 전/후 표기. round 2 P1-1 (plan 8.3 hero-carousel "변경 전" 표기 오류) + P2-1 (plan 3.3.1 후보 "7 등급" 잔존) 모두 round 3에서 흡수.
