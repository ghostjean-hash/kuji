# M3.5 단계 6 impl_review (round 1 → round 2 합본)

검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
검증일: 2026-05-10. 자동 재시도 1회 사용.

# 1. 사이클 결과 요약

| 라운드 | 판정 | P0 | P1 | P2 | 통과 |
|---|---|---|---|---|---|
| round 1 | 미통과 | 2 | 1 | 0 | 12 |
| round 2 | **통과** | 0 | 0 | 1 (비블로커) | 14 |

# 2. round 1 결함 + 흡수

## 2.1. P0-1. tests/suites/tier_class.test.js "라인업당 hero/main/goods 각 ≥ 1" 잔존 회귀 테스트

- 위치: line 38-45.
- 결함: M3.5 룰 완화 (main = 0 허용)와 충돌. 원피스 main = 0이라 본 테스트 fail.
- 흡수: round 2에서 `TIER_CLASS_VALUES` → `REQUIRED_TIER_CLASSES` 변경 + import 추가 + 테스트 이름 갱신.

## 2.2. P0-2. tests/suites/tier_class.test.js "원피스 B-F=main" 잔존 회귀 테스트

- 위치: line 60-71.
- 결함: T1에서 TIERS_ONEPIECE B/C/D/E/F = hero 변경했지만 본 회귀 테스트가 main 기대값 잔존 → 5건 fail.
- 흡수: round 2에서 기대값 main → hero 갱신 + 테스트 이름 "M3.5 갱신" 명시.

## 2.3. P1-1. spec 5.13.D.2.6 "현재 모든 라인업이 hero/main/goods 각 ≥ 1" SSOT 위반

- 위치: docs/01_spec.md line 419.
- 결함: M3.5 룰 완화 후 본 텍스트 사실 아님. spec 5.13.E.3 "원피스 main = 빈 헤더 미렌더"와 모순.
- 흡수: round 2에서 텍스트 갱신 (M3.5 룰 완화 + 원피스 사례 명시).

# 3. round 2 결함 (통과 - 비블로커 P2 1건)

## 3.1. P2-1. spec 5.13.E.3 hero-carousel 행 비고 표현 미세 부정합

- 위치: 01_spec.md line 473.
- 증상: "data-tier-class 속성으로 hero/main 톤 차이 유지" 표현이 원피스 main = 0 사례에서는 tone 차이 미발동. "라인업별 차이"가 더 정확.
- 영향: 사용자 동작 / 시각 / 코드 0.
- 처리: M3.4-tidy 정리 라운드 흡수 후보. 본 사이클 비강제.

# 4. 게이트 통과 표 (round 2)

| 게이트 | 검증 | 결과 |
|---|---|---|
| arch 5.18 | 02_data 1.4-OP.2 ↔ TIERS_ONEPIECE B-F=hero 1:1 | OK |
| arch 5.18 | validateLineupTierClass main throw 코드 0건 | OK |
| arch 5.18 | REQUIRED_TIER_CLASSES = [HERO, GOODS] | OK |
| arch 5.18 | hero-carousel.js filter `!== GOODS && !== "Last One"` | OK |
| arch 5.18 | minor-row.js filter `=== GOODS && !== "Last One"` | OK |
| arch 5.18 | 부팅 LINEUPS.forEach throw 0 | OK (룰 완화 정합) |
| arch 5.18 | lineup_validation 7 케이스 등재 | OK |
| arch 5.14 | hero ≥ 1 + goods ≥ 1만 의무 표현 정합 | OK (M3.5 갱신) |
| arch 5.14 | DC.tierClass throw 잔존 | OK |
| spec 5.13.E.3 | 영향 매트릭스 ↔ render 분기 식 1:1 | OK |
| spec 5.13.D.2.6 | 빈 그룹 처리 표현 갱신 (round 1 P1 흡수) | OK |
| CLAUDE.md 4.1 | 게임 로직 ↔ 렌더링 분리 | OK |
| CLAUDE.md 4.2 | 매직 넘버 0 (TIER_CLASS_GOODS 경유) | OK |
| CLAUDE.md 4.3 | core/ DOM import 0 | OK |
| CLAUDE.md 4.4 | 결정론 영향 0 | OK |
| 회귀 grep | HERO_TIERS / `count===1` / `count>=2` 잔존 | 0 |
| 회귀 grep | 단위 테스트 원피스 B-F=main 잔존 | 0 (round 2 흡수) |
| runner.js | lineup_validation 등록 + 기존 19 suite 파괴 0 | OK |

# 5. 단계 5 종료 게이트 (단계 7 진입 조건)

5.1. T1~T7 모두 적용 (T8 PROGRESS는 단계 8에서 흡수).
5.2. 정적 grep 기준 모든 단위 테스트 PASS 가능 상태.
5.3. arch 5.14 + 5.18 게이트 grep 모두 OK.
5.4. **사용자 라이브 검수 의무** (단계 7).

# 6. 변경 이력

6.1. 2026-05-10: round 1 P0 2건 + P1 1건 발견. round 2 정정 흡수.
6.2. 2026-05-10: round 2 통과. P0=0/P1=0/P2=1 비블로커. 단계 7 진입.
