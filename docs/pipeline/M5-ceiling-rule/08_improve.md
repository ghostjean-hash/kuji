# M5 ceiling-rule + XENOGLOSSIA - 08 improve

| 항목 | 값 |
|---|---|
| 사이클 ID | M5-ceiling-rule |
| 단계 | 8 improve |
| 작성일 | 2026-05-13 |
| 사이클 종료 | 자비스 정적 정합 통과 + 사용자 라이브 검수 의무 (07_qa 2절) |

# 1. 사이클 종료 자기-진단

1.1. **트리거**: 사용자 차기 사이클 결정 "다음 작업 진행" (2026-05-13). 확장 로드맵 첫 메커닉 분기 슬롯 (CLAUDE.md 1.2 - 코토부키야쿠지 XENOGLOSSIA).

1.2. **본 사이클 결손 해소**:
- 라인업별 메커닉 다양성 (Last One / DC / 천장 룰) 흡수 = enabled 플래그 5종 패턴.
- XENOGLOSSIA 라인업 추가 (3 라인업).
- 코토부키야쿠지 시스템 특이 메커닉 (30연 S賞 확정) 구현.
- BUY_QUICK_OPTIONS 확장 (30 추가).

1.3. **CLAUDE.md 7.2 정합**: 단계 1 결정 영역(3.1 / 3.2 / 3.3) 사용자 명시 결정 + 자비스 추천 (selectable / 30_set / lobbyHero / 배송비 비목표) plan 본문 박제.

1.4. **단계 3/6 subagent 격리 검증 의무 잔존**: 자율 진행 신호로도 우회 불가. round 1 P0=4 → round 2 통과 (자동 재시도 1회 한도 내).

# 2. M5 학습 (PROGRESS 14.5 흡수 완료)

2.1. **첫 메커닉 분기 사이클의 enabled 플래그 패턴**: 라인업 객체 boolean 플래그 + core 모듈 throw 가드 + render 미렌더 + 검증식 정합 + dispatch 호출처 가드 = 일관 패턴. 차기 메커닉 분기 사이클 답습.

2.2. **메이저 부피 round 폭증 회피**: round 1 P0=4 + P1=3 → round 2 통과. 자동 재시도 1회 한도 내 정합.

2.3. **plan 단계 결정 영역 enumerable화 의무**: round 1 P0-4 = plan 11.2 결정 영역 누락이 단계 2 design "단계 2 결정" 박제로 흘러간 결과. 차기 메이저 사이클 plan 11에 "사용자 결정 영역 / 자비스 자율 영역 / 단계 후보 영역" 3축 분리 권고.

2.4. **흐름 SSOT 갱신 의무**: 모듈 시그니처(arch 3.x)와 흐름 SSOT(arch 4.x)의 일관성 의무. 첫 메커닉 분기라 답습 없었으나 차기 메커닉 분기에서 의무 박제.

2.5. **단계 5 implement 발견 정정 (core/box.js initBox)**: design / impl_plan에 명시되지 않은 box.js의 deck size 검증식이 lastOneEnabled 분기 의무 발견. 즉시 정정 + plan 6.1 영향 매트릭스에 core/box.js 추가 박제 의무 (차기 사이클 plan 영향 매트릭스 enumerable화 강화).

2.6. **자율 진행 신호 답습 (M3.5 → M4 → M4.1 → M4.2 → M5)**: 단계 1/4/7 자율 통과 + 단계 3/6 subagent 격리 검증 의무 잔존.

# 3. 단계 6 P2 흡수 (M5.1 백로그)

| 결함 | 처리 |
|---|---|
| P2-1 천장 30연 + raw 티켓 혼재 정책 미명세 | M5.1 + 단계 7 사용자 라이브 검수 결과 의존 |
| P2-2 assets.js XENOGLOSSIA 자산 미매핑 (M3 원피스 답습) | M5.1 (lobbyHero 개명 + 자산 분기 동반) |
| P2-3 arch 5.6 grep 누적 stale | M5.1 또는 정리 사이클 |

# 4. 본 사이클 산출물

| # | 산출물 | 파일 |
|---|---|---|
| 1 | plan | docs/pipeline/M5-ceiling-rule/01_plan.md |
| 2 | design | spec/data/arch + research/lineups.json 참조 |
| 3 | design_review | docs/pipeline/M5-ceiling-rule/03_design_review.md (round 1 P0=4 → round 2 통과) |
| 4 | impl_plan | docs/pipeline/M5-ceiling-rule/04_impl_plan.md |
| 5 | implement | T1~T16 (numbers / ceiling 신설 / last_one / draw / box / main / buy-panel / last-one-row / last-one-indicator / products-history-tab + 3 신설 테스트 + runner + PROGRESS) |
| 6 | impl_review | docs/pipeline/M5-ceiling-rule/06_impl_review.md (round 1 P0=0/P1=0/P2=3) |
| 7 | QA | docs/pipeline/M5-ceiling-rule/07_qa.md |
| 8 | improve (본 문서) | docs/pipeline/M5-ceiling-rule/08_improve.md |

# 5. 차기 사이클 후보 (M5 종료 후)

5.1. **M5.1 = 누적 정리 + 자산 매핑** (소~중): P2-1 raw 티켓 정책 + P2-2 assets.js 라인업 분기 + lobbyHeroAssetPath → homeHeroAssetPath 키 개명 (storage v8 마이그레이션 동반) + P2-3 arch 5.6 grep 누적.
5.2. **M5.2 = selectable 종류 선택 UI** (XENOGLOSSIA S/A 등급) - 메이저 또는 중.
5.3. **M6 = 코토부키야 일반 라인업** (메가미데바이스 / 사사이쇼조테이엔) - 메이저.
5.4. **M5+ = "Last One" 데이터 정의 / 자산 키 / 표시 라벨 단일화** (M4.2 답습) - 정리 라운드.
5.5. **M3 series + M4 + M4.1 + M4.2 + M5 라이브 검수 결과 보정** (사용자 액션 의존).

# 6. 사용자 액션 의무

6.1. 07_qa.md 2절 라이브 검수: XENOGLOSSIA 진입 / 천장 룰 30연 / Last One DC 미적용 / 기존 라인업 회귀 / raw 혼재 / 마이그레이션.
6.2. 검수 결함 발견 시 자비스에 신호 → 보정 사이클 진입 또는 차기 사이클 흡수.

# 7. 사이클 종료 박제

7.1. 본 사이클(M5-ceiling-rule) 8단계 파이프라인 종료.
7.2. 자비스 정적 정합 = 통과. 라이브 검수 = 사용자 액션.
7.3. 차기 사이클 결정은 사용자 신호 후 진입.
