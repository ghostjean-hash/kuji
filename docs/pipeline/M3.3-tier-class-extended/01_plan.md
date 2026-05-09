# M3.3 tier-class-extended - 01 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M3.3-tier-class-extended |
| 시작일 | 2026-05-09 |
| 단계 | 1 plan |
| 상태 | **사용자 승인 완료 (2026-05-09)**. 단계 2 design 진입 |
| 추정 | 2.0~2.5일 (갤러리 그룹화 0.5 + history 대시보드 0.5 + core/history.js 확장 0.3 + 단계 검증 라운드 0.5 + 단계 검증 여유 0.4) |
| 선행 사이클 | M3.2-tier-class-visual (자비스 8단계 종료, 사용자 라이브 검수 병행) |

# 1. 한 줄

M3.2에서 추첨 탭 + 결과 reveal에 적용한 tier_class를 갤러리 / history 영역으로 확장. 상품 갤러리 펼침 시 hero/main/goods 섹션 헤더 + 카드 나열 + history 탭 상단 클래스 통계 대시보드. 새 데이터 / 결정론 영향 0 (기존 storage / core/draw / state 모델 그대로 + render + core/history 확장만).

# 2. 사용자 결정 사항 (선행 합의)

| 결정 | 선택 | 비고 |
|---|---|---|
| 갤러리 그룹화 방식 | **(A) 섹션 헤더 + 카드 나열** | 명시적 시각 구분. 탭 전환 / 보더 색 차별화 옵션 거부 |
| history 통계 위치 | **(A) 탭 상단 대시보드** | 진입 시 가장 먼저 노출. 수집 완주 감 우선 |
| 통계 계산 위치 | **(A) core/history.js 확장** | tierClassCounts(history, lineup) 신설. CLAUDE.md 4.1 정합 + 단위 테스트 용이 |
| 통계 범위 | **(A) 활성 라인업 전체 이력** | history 자체 라인업별 격리 (M3 storage v4) |

# 3. 스코프 (in scope)

## 3.1. core/history.js 확장 (M3.3 신설)

3.1.1. **tierClassCounts(history, lineup) 신설**:
```js
// 입력: HistoryEntry[] + lineup 객체
// 출력: { hero: number, main: number, goods: number, total: number }
export function tierClassCounts(history, lineup) {
  const counts = { hero: 0, main: 0, goods: 0 };
  for (const entry of history) {
    const tierClass = getTierClassForTier(lineup, entry.tier);
    if (tierClass && counts[tierClass] !== undefined) counts[tierClass]++;
  }
  return { ...counts, total: history.length };
}
```

3.1.2. **DOM 0건 + lineup 인자 결정론적**. CLAUDE.md 4.1 정합 + 4.3 정합.

3.1.3. **단위 테스트 (T 분할)**: 빈 history → 0 / 0 / 0 / 0. 드래곤볼 history 혼합 → hero/main/goods 분포 정합. 원피스 history. 미존재 tier (예: J가 원피스 history에 들어간 케이스) → tierClass=null이라 카운트 미반영.

## 3.2. render/history-tab.js 갱신

3.2.1. **상단 대시보드 영역 신설** (탭 진입 시 가장 먼저 노출):
- 라인업 IP 라벨 + "이력 요약".
- 4개 카운터 카드 가로 정렬: 전체 / hero / main / goods.
- 각 카드: 큰 숫자 + 라벨 + tier_class 색 톤.
- hero 카드: 골드 액센트 (M3.2 hero-bg-tint 토큰 재사용).
- main 카드: 무변형 (bg-card).
- goods 카드: 옅은 회색 (bg-elevated).

3.2.2. **기존 history 리스트는 대시보드 아래 그대로 유지**. 회귀 위험 0.

3.2.3. **빈 history 시**: 대시보드는 표시하되 모든 카운터 0. 빈 상태 안내 문구는 기존 흐름 그대로.

## 3.3. render/tier-grid.js 또는 render/product-gallery.js 갱신

3.3.1. **펼침 시 섹션 헤더 + 카드 나열** (사용자 결정 권장):
- 갤러리 펼침 (`galleryExpanded === true`) 시 lineup.tiers를 hero/main/goods 그룹화.
- 각 그룹 헤더: "메인 등급 / 표준 등급 / 굿즈 / 보너스" (한국어 라벨, 02_data에 박제).
- 헤더 아래 해당 등급 카드 나열 (기존 tier-grid 카드 재사용).

3.3.2. **접힌 상태**(`galleryExpanded === false`)는 기존 흐름 그대로 (회귀 위험 0).

3.3.3. **Last One은 hero에 포함** (tierClass=hero 정합) but 박스 기본 등급(A~J/A~I)과 시각 분리 위해 hero 섹션 마지막에 배치 권장.

## 3.4. 02_data / numbers.js 상수 신설

3.4.1. **TIER_CLASS_LABEL_KO** (M3.3 신설) - 사용자 노출 한국어 라벨:
```js
export const TIER_CLASS_LABEL_KO = {
  hero: "메인 등급",
  main: "표준 등급",
  goods: "굿즈",
};
```

3.4.2. 갤러리 섹션 헤더 + history 대시보드 카운터 라벨에 사용.

3.4.3. **02_data 1.4.A.6 절 신설** (TIER_CLASS_LABEL_KO 정의).

## 3.5. 디자인 토큰 신설 검토

3.5.1. **history 대시보드 카운터 카드 색 톤**: tier_class 토큰(hero-bg-tint / main-bg-tint / goods-bg-tint) 재사용. 신규 토큰 0.

3.5.2. **숫자 강조 폰트 사이즈**: 기존 `--font-size-2xl` 또는 신규 `--font-size-counter` 검토 (단계 2 결정).

# 4. 비목표 (out of scope)

4.1. 라인업별 IP 액센트 색 - M3.1 / M3.2 비목표 유지.
4.2. mid 클래스 도입 - M3.1 동결 정책 유지.
4.3. 박스별 분리 통계 - 활성 라인업 전체 이력만 (사용자 결정).
4.4. 그래프 / 차트 UI - 단순 카운트 표시만. 시각적 부담 회피.
4.5. M4 메이저 (천장 룰) - 별도 사이클.
4.6. lobby_hero.webp 자산 배치 - 사용자 외부 작업.
4.7. 단계 6 P2 modalSlide / hero scale + rotateY / 보더 transition - 라이브 검수 결과 의존.

# 5. 마일스톤 / 추정

| Phase | 작업 | 추정 |
|---|---|---|
| Phase 1 | 단계 2 design (02_data 1.4.A.6 + spec 5.13.D 또는 5.13.C 확장 + 03_arch 갱신) | 0.3일 |
| Phase 2 | 단계 3 design_review (subagent 격리, round 1 통과 목표) | 0.3일 |
| Phase 3 | 단계 4 impl_plan (T 분할 + design_review 이월 답) | 0.2일 |
| Phase 4 | 단계 5 implement Phase A: core/history.tierClassCounts + 단위 테스트 | 0.3일 |
| Phase 5 | 단계 5 Phase B: render/history-tab 대시보드 + render/tier-grid 또는 product-gallery 그룹화 | 0.5일 |
| Phase 6 | 단계 5 Phase C: 02_data + numbers.js TIER_CLASS_LABEL_KO + main.css 대시보드 / 그룹화 CSS | 0.3일 |
| Phase 7 | 단계 6 impl_review + 단계 7 QA + 단계 8 improve | 0.5일 |
| **합산** | | **2.4일** |

# 6. 데이터 흐름 (개념)

## 6.1. history 대시보드 산출

```
사용자 history 탭 진입
  → render/history-tab.renderHistoryTab(state, dispatch)
  → const lineup = getLineupById(state.currentLineupId)
  → const counts = core/history.tierClassCounts(state.history, lineup)
  → 4개 카운터 카드 렌더 (total / hero / main / goods)
  → 기존 history 리스트 렌더 (회귀 0)
```

## 6.2. 갤러리 그룹화 산출

```
사용자 "▼ 자세히 보기" 토글
  → state.galleryExpanded = true → rerender
  → render/tier-grid (또는 product-gallery)
    → const groups = { hero: [...], main: [...], goods: [...] }
    → for tier in lineup.tiers: groups[tier.tierClass].push(tier)
    → 각 그룹 섹션 헤더 (TIER_CLASS_LABEL_KO[tierClass]) + 카드 나열
```

# 7. 검증 / 단위 테스트 추가

7.1. `tests/suites/tier_class_counts.test.js` 신설:
- 빈 history → counts 0/0/0/0.
- 드래곤볼 history (A 1매 + G 3매 + Last One 1매) → hero=2 / main=0 / goods=3 / total=5.
- 원피스 history (A 1매 + B 2매 + I 5매) → hero=1 / main=2 / goods=5 / total=8.
- 미존재 tier (예: 라인업 외 등급) → tierClass=null로 카운트 미반영.
- 결정론 (동일 입력 → 동일 출력).

7.2. 03_architecture 5.17 게이트 grep:
- history-tab.js의 tierClassCounts 호출 정합.
- product-gallery 또는 tier-grid의 그룹화 산출 정합.
- TIER_CLASS_LABEL_KO 호출처에서 인라인 한국어 0.
- 갤러리 접힘 상태에서 그룹화 미적용 정합 (회귀 위험 0).

# 8. 의존성 / 리스크

## 8.1. 의존성

8.1.1. M3.1 + M3.2 종료 상태 정합 (tier_class 메타 + getTierClassForTier 헬퍼 보유).
8.1.2. M3 storage v4 라인업별 격리 (history는 활성 라인업별 자동 격리).

## 8.2. 리스크

| # | 리스크 | 완화 |
|---|---|---|
| 8.2.1 | 갤러리 그룹화로 기존 tier-grid 카드 흐름 회귀 | 접힘 상태는 변경 0. 펼침 상태만 그룹화 분기. 기존 카드 컴포넌트 재사용 |
| 8.2.2 | history 대시보드가 모바일 폭에서 4열 가로 정렬 부담 | 반응형: 모바일 2x2 그리드. 02_data 1.5에 breakpoint 결정 |
| 8.2.3 | tierClassCounts 미존재 tier 처리 (라인업 변경 시 history 잔존) | counts[tierClass] !== undefined 가드. 라인업별 격리라 실제로는 발생 0. 단위 테스트로 가드 |
| 8.2.4 | 한국어 라벨 ("메인 등급" / "표준 등급" / "굿즈") 사용자 인지 | 02_data 1.4.A.6 박제. 차기 라이브 검수 시 라벨 자연스러움 검수 |
| 8.2.5 | 단계 6 round 폭증 | M3.1 / M3.2 학습 답습. spec/data SSOT 정밀화 + design_review 이월 답 박제 |

# 9. 사용자 결정 게이트 (단계 1 → 단계 2) - **확정 (2026-05-09)**

| # | 항목 | 결정 |
|---|---|---|
| 9.1 | TIER_CLASS_LABEL_KO | **"메인 등급 / 표준 등급 / 굿즈"** |
| 9.2 | history 대시보드 모바일 레이아웃 | **2x2 그리드 (반응형)** |
| 9.3 | 갤러리 섹션 정렬 순서 | **hero → main → goods (위상 내림차순)** |
| 9.4 | Last One 시각 위치 | **hero 섹션 마지막** |
| 9.5 | hero 카운터 받은/미받은 분리 | **통합 카운트만** (간결성) |

# 10. 변경 이력

10.1. 2026-05-09: 초기 작성. 사용자 결정 사항 반영 (섹션 헤더 + 카드 / 탭 상단 대시보드 / core 확장 / 활성 라인업 전체 이력). 9.1~9.5 단계 2 진입 전 결정 항목 5건.
10.2. 2026-05-09: 단계 1 사용자 승인. 9.1~9.5 결정 박제 (한국어 라벨 / 2x2 그리드 / hero→main→goods / Last One hero 마지막 / 통합 카운트). 단계 2 design 진입.
