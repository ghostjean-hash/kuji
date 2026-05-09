# M3.3 tier-class-extended - 04 구현 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.3-tier-class-extended |
| 단계 | 4 impl_plan |
| 상태 | 작성 완료, 사용자 승인 대기 |
| 입력 | 01_plan.md (사용자 승인 + 9.1~9.5 박제) / 02_data.md M3.3 갱신 / 01_spec.md 5.13.D / 03_architecture.md 5.17 / 03_design_review.md (round 1 통과, P0 0 / P1 1 / P2 5) |

# 1. 한 줄

T1~T8 분할로 단계 5 implement 진행. 단계 3 design_review 이월 6건(P1 1 + P2 5) 답을 본 plan에 박제. 결정론 회귀 0 + 매직 넘버 0개 + 단위 테스트 ALL PASS를 단계 5 종료 게이트로.

# 2. design_review 이월 6건 답

## 2.1. P1 3.1. plan 7.1 단위 테스트 케이스 total 산출 오류

위치: `01_plan.md` 7.1 = "드래곤볼 history (A 1매 + G 3매 + Last One 1매) → hero=2 / main=0 / goods=3 / total=6".

결함: A(1) + G(3) + Last One(1) = **5**, 본문 `total=6` 오류.

정정: T7 단위 테스트 작성 시 `total=5` 사용. plan 본문 정정 (단계 4 즉시 실행 - plan 7.1 직접 정정).

## 2.2. P2 4.1. 갤러리 그룹화 호출 모듈 결정

채택: **`render/tier-grid.js` 갱신** (penmer 갤러리 펼침 영역).

이유: tier-grid가 갤러리 펼침 시 등급 카드 나열 영역. product-gallery는 product-detail-modal 호출용 wrapper. 그룹화 적용처는 tier-grid 내부.

## 2.3. P2 4.2. "전체" 카운터 카드 시각

채택: **`var(--bg-card)` (= main과 동일) + 보더 액센트 강화** (예: 보더 두께 2px + `var(--gold-edge-soft)`로 약한 골드).

이유: 전체 카운터는 합계라서 클래스 색 구분 부적절. main(무변형 카드)과 시각 분리는 보더로 구현.

## 2.4. P2 4.3. 빈 history 시 대시보드 + 안내 동시 노출

채택: **대시보드는 항상 표시 (0/0/0/0). 빈 안내 문구는 history 리스트 영역에 한정**. 즉 대시보드는 진행도 기준, 안내는 리스트 비어있음 신호.

## 2.5. P2 4.4. 5.13.D.2.5 "좌측 색 막대" 토큰 재사용

채택: **`var(--tier-class-{class}-bg-tint)` 배경 + `var(--tier-class-{class}-border)` 좌측 4px 보더로 구현**. 신규 토큰 0.

## 2.6. P2 4.5. 03_architecture 5.17 게이트 신설

처리: **단계 4 즉시 적용**. 03_architecture.md 5.17 절 작성 완료 (8개 grep 항목).

# 3. T 분할

| T# | 영역 | 산출물 | 추정 | 의존 |
|---|---|---|---|---|
| T1 | data | numbers.js: TIER_CLASS_LABEL_KO 객체 + HISTORY_DASHBOARD_COLS_MOBILE/TABLET + HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX export | 0.2일 | - |
| T2 | core | core/history.js 확장: tierClassCounts(history, lineup) export + 미존재 tier 가드 | 0.2일 | T1 |
| T3 | render | render/history-tab.js: 상단 대시보드 4개 카운터 카드 추가 + 기존 history 리스트 보존 | 0.4일 | T1, T2 |
| T4 | render | render/tier-grid.js: galleryExpanded 시 그룹화 (hero → main → goods + Last One hero 마지막) + 섹션 헤더 (TIER_CLASS_LABEL_KO 사용) | 0.5일 | T1 |
| T5 | styles | styles/main.css: .history-dashboard / .history-dashboard-card / .tier-grid-section / .tier-grid-section-header CSS 추가 (반응형 @media 768px) | 0.3일 | T3, T4 |
| T6 | tests | tests/suites/tier_class_counts.test.js 신설 - 빈 history / 드래곤볼(hero=2/goods=3/total=5) / 원피스(hero=1/main=2/goods=5/total=8) / 미존재 tier 가드 / 결정론 5건 | 0.3일 | T2 |
| T7 | tests | tests/runner.js에 tier_class_counts 등록 | 0.05일 | T6 |
| T8 | doc | spec 5.13.D 검토 후 정정 (있으면) + PROGRESS.md M3.3 절 신설 + 01_plan 7.1 total=5 정정 | 0.15일 | T1~T7 |

**합산: 2.1일** (plan 추정 2.4 대비 단축).

# 4. 의존성 그래프

```
T1 (data) ──┬─> T2 (core/history.tierClassCounts)
            ├─> T3 (history-tab dashboard)
            ├─> T4 (tier-grid 그룹화)
            └─> T6 (tests)

T2 ──┬─> T3
     └─> T6
T3 ──> T5 (CSS)
T4 ──> T5 (CSS)
T6 ──> T7 (runner 등록)
T1~T7 ──> T8 (doc)
```

# 5. 단계 5 종료 게이트

5.1. 모든 T 완료 (T1~T8).
5.2. tests/test.html 모든 suite ALL PASS (기존 20개 + T6 신설 1개 = 21개).
5.3. 매직 넘버 0개 (03_architecture 5.17 grep).
5.4. styles/main.css 인라인 hex / rgba / 한국어 0건 (T5 CSS는 var() + class 셀렉터만).
5.5. 결정론 회귀 0 (storage / core/draw / state 영향 0).
5.6. 사용자 라이브 검수 사전 self-check:
- history 탭 진입 → 상단 대시보드 4개 카운터 정합 (시드 고정 + 박스 1개 진행 후 검증).
- 모바일 폭 / 태블릿 폭 반응형 (2x2 vs 4열) 시각.
- 갤러리 펼침 → hero → main → goods 그룹화 시각. Last One hero 섹션 마지막.
- 갤러리 접힘 → 기존 흐름 보존 (회귀 0).

# 6. 단계 6 게이트

6.1. 03_architecture 5.17 grep 모두 통과.
6.2. 모든 단위 테스트 ALL PASS.
6.3. spec 5.13.D / 02_data 1.4.A.5 / 1.4.A.6 / 1.5 ↔ src/ 코드 1:1.
6.4. core/history.tierClassCounts DOM 0건.
6.5. tier-grid 접힘 상태 회귀 0.

# 7. 단계 7 QA 사용자 검수 항목 (단계 6 통과 후)

7.1. tests/test.html ALL PASS.
7.2. history 탭 진입 → 대시보드 4개 카운터 (전체 / 메인 등급 / 표준 등급 / 굿즈) 노출.
7.3. 시드 고정 + 박스 1개 진행 → 카운터 값 정합 (예: 드래곤볼 80매 모두 뽑기 → hero 2 / main 5 / goods 73 / total 80).
7.4. 모바일 폭 (768px 미만) → 2x2 그리드.
7.5. 태블릿 이상 (768px 이상) → 4열 가로.
7.6. 갤러리 펼침 → hero 섹션(A상 + Last One) → main 섹션(B~F) → goods 섹션(G~J 또는 G~I).
7.7. 갤러리 접힘 → 기존 카드 그리드 회귀 0.
7.8. 라인업 전환(드래곤볼 ↔ 원피스) → 대시보드 + 갤러리 라인업별 격리 정합.
7.9. 빈 history → 대시보드 0/0/0/0 + 기존 빈 안내 문구.

# 8. 비목표

8.1. 박스별 분리 통계.
8.2. 그래프 / 차트 UI.
8.3. 라인업별 IP 액센트 색.
8.4. mid 클래스 도입.
8.5. M4 천장 룰.
8.6. M3.2 단계 6 P2 (modalSlide / hero scale + rotateY / 보더 transition) 라이브 검수 결과 의존.

# 9. 리스크 / 완화

| # | 리스크 | 완화 |
|---|---|---|
| 9.1 | tier-grid 접힘 흐름 회귀 | T4에서 `galleryExpanded === true` 분기 안에서만 그룹화. 접힘은 기존 코드 그대로 |
| 9.2 | history 대시보드 모바일 폭 답답함 | 2x2 그리드 + 카운터 카드 적정 padding. 단계 7 라이브 검수 |
| 9.3 | 카운터 산출 미존재 tier 누락 | T2에서 `counts[tierClass] !== undefined` 가드 + T6 단위 테스트 |
| 9.4 | 단계 6 round 폭증 | M3.1 round 1 / M3.2 round 2 통과 패턴 답습. 본 plan 정밀화 |

# 10. 변경 이력

10.1. 2026-05-09: 초기 작성. design_review round 1 통과 후 작성. 이월 6건 답 박제 (P1 1 즉시 정정 + P2 5건 단계 4 결정). T1~T8 분할.
