# M3.3 tier-class-extended 단계 8 improve

작성일: 2026-05-09.
M3.3 스프린트 종료 + 차기 사이클 후보 등재.

# 1. M3.3 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | [01_plan.md](01_plan.md) | 사용자 승인 + 9.1~9.5 결정 5건 박제 |
| 2 design | 02_data 1.4.A.6 + 1.5 + 1.4.A.5 호출처 표 + spec 5.13.D 신설 | 매직 넘버 0개 통과 |
| 3 design_review | [03_design_review.md](03_design_review.md) round 1 | P0 0/P1 1/P2 5 → 통과 |
| 4 impl_plan | [04_impl_plan.md](04_impl_plan.md) + 03_arch 5.17 + 6.10 | T1~T8 분할 + design_review 이월 6건 답 |
| 5 implement | T1~T8 모두 적용 | round 1 P0 1건 미통과 → round 2 정정 |
| 6 impl_review | [06_impl_review.md](06_impl_review.md) round 1 미통과 → round 2 통과 | round 2 P0 0/P1 0/P2 2 |
| 7 qa | [07_qa.md](07_qa.md) | 자비스 정적 정합 통과 + 사용자 라이브 검수 11건 |
| 8 improve | 본 문서 | 작성 완료 |

## 1.2. 코드 변경 합산

- **data**:
  - numbers.js: TIER_CLASS_LABEL_KO + HISTORY_DASHBOARD_COLS_MOBILE/TABLET + HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX export.
- **core**:
  - history.js: tierClassCounts(history, lineup) export. 미존재 tier 가드. lineup 부재 throw.
- **render**:
  - history-tab.js: 상단 대시보드 4개 카운터 카드.
  - product-gallery.js: hero/main/goods 그룹화 + Last One hero 마지막. 박스 등급 순서 보존. 섹션 헤더 한국어 라벨.
  - tier-grid.js: 그룹화 로직 잔존하지만 호출처 0건 dead 모듈.
- **styles**: main.css .history-dashboard 반응형(2x2/4열) + .product-gallery-section / .tier-grid-section 좌측 색 막대.
- **tests**: tier_class_counts.test.js 신설 (6건). runner.js 등록.
- **docs**: 02_data 1.4.A.5 / 1.4.A.6 / 1.5 / 4.15. spec 5.13.D / 8.16. 03_arch 5.17 / 6.10.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 0 / P1 1 / P2 5 | 통과 |
| 6 | round 1 | P0 1 / P1 0 / P2 2 | 미통과 |
| 6 | round 2 | P0 0 / P1 0 / P2 2 | 통과 |

M3.2 패턴(round 2 통과) 답습. 단계 6 round 1 P0 = T4 그룹화 적용 모듈 오결정 (tier-grid dead → product-gallery 정정).

## 1.4. 사용자 결정 5건 박제 정합

| # | 결정 | 적용 위치 |
|---|---|---|
| 9.1 | "메인 등급 / 표준 등급 / 굿즈" | numbers.js TIER_CLASS_LABEL_KO + history-tab + product-gallery |
| 9.2 | 2x2 모바일 그리드 | main.css .history-dashboard @media 768px |
| 9.3 | hero → main → goods 정렬 | product-gallery.js orderedClasses |
| 9.4 | Last One hero 마지막 | product-gallery.js lastOne push |
| 9.5 | 통합 카운트 | history-tab.js (받은/미받은 분리 0) |

## 1.5. design_review 이월 6건 답 정합

| # | 답 |
|---|---|
| P1 3.1 total=5 정정 | plan 7.1 정정 |
| P2 4.1 그룹화 모듈 = product-gallery (단계 6에서 정정) | 본 사이클 round 2에서 흡수 |
| P2 4.2 "전체" 카드 시각 = bg-card + 보더 강화 | main.css .is-total |
| P2 4.3 빈 history 정책 | 대시보드 항상 표시 |
| P2 4.4 좌측 색 막대 토큰 재사용 | main.css var(--tier-class-{class}-border) |
| P2 4.5 03_arch 5.17 게이트 | 단계 4 작성 |

# 2. 단계 6 P2 결함 2건 처리

## 2.1. P2 4.1. tier-grid dead 모듈 정리

처리: **차기 정리 라운드 백로그**. tier-grid.js의 그룹화 로직이 잔존하지만 호출처 0건이라 영향 0. 정리 라운드(M3.4-tidy 또는 M4 직전 라운드)에서 tier-grid.js 자체 폐기 검토.

## 2.2. P2 4.2. "전체" 라벨 인라인 + CSS 인라인 px

처리: **차기 정리 라운드 백로그**. 매직 넘버 정책은 수치 한정이라 신규 위반 아님. CSS px (border-width 2px / border-left 4px)는 기존 main.css 동일 패턴이라 신규 위반 아님. 정리 라운드에서 통일 정책 검토.

# 3. 자비스 사용자 결정 게이트

3.1. **사용자 라이브 검수 결과 보고 의무** (07_qa 3장).
3.2. **결함 0건 보고 시** M3.3 정식 종료 + 차기 사이클 진입.

# 4. 차기 사이클 후보

## 4.1. 즉시 / 정리

4.1.1. **M3.4-tidy 정리 라운드** (소): tier-grid.js dead 모듈 폐기 + LAST_ONE_TIER_NAME 상수화 (M3.1 P2-3) + storage_v5.test.js v3 chain (M3.1 P2-1) + "전체" 라벨 / CSS 인라인 px 정책 통일.

4.1.2. **라이브 검수 결과 의존**: M3.2 P2-1 modalSlide override / P2-2 hero scale + rotateY / P2-3 보더 transition 라이브 검수 결과에 따라 보정.

## 4.2. 메이저 사이클

4.2.1. **M4 = コトブキヤくじ アイドルマスター XENOGLOSSIA 30연 천장 룰** (확장 로드맵 원래의 M3, 첫 메커닉 분기): core/draw.js 천장 카운터 + 30연 도달 시 S賞 lock + spec 천장 메커닉 절 + storage v6 마이그레이션 (천장 카운터 영속).

4.2.2. Happyくじ PIXAR 13등급 확장 검증 (확장 로드맵 M4).

4.2.3. 세가 럭키쿠지 잔여 카운터 UI 모드 (확장 로드맵 M5).

## 4.3. 사용자 외부 작업

4.3.1. assetsAvailable=true 전환 (lobby_hero.webp + 등급별 placeholder webp 배치).

# 5. 학습 / 다음 사이클 정합 권고

5.1. **단계 6 round 1 P0 = "호출처 0건 dead 모듈 오선택"**: design_review 단계에서 호출처 grep을 추가 검증 항목으로 의무화. plan 작성 시 영향 모듈 명시 시 dead 여부 cross-check.

5.2. **차기 사이클 정리 라운드 시점**: M3 series (M3.1/M3.2/M3.3) 누적 dead/잔존 항목 + 라이브 검수 결과를 한꺼번에 흡수. M2.1 정리 라운드(M3-second-lineup에 흡수) 패턴 답습.

# 6. 변경 이력

6.1. 2026-05-09: 초기 작성. M3.3 8단계 종료. 단계 6 P2 2건 차기 정리 라운드 백로그.
