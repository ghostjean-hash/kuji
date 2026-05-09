# M3.1 lineup-presentation 단계 3 design_review

작성일: 2026-05-08.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 1 (round 1 통과).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | **0** | 1 | 6 | **통과** |

P0 0건 → 단계 4 impl_plan 진입 가능. P1 1건은 단계 4에서 흡수 (round 2 재진입 없음).

# 2. 검증 카테고리

2.1. CLAUDE.md 4장 절대 규칙 정합 (4.1~4.8).
2.2. SSOT 자체 정합 (01_spec ↔ 02_data 교차 + 01_plan ↔ design 결정 박제).
2.3. M3 사양(5.13.A) 보존 + M3.1 사양(5.13.B + 5.13.A 갱신) 충돌 0.
2.4. 사용자 결정 5건 정합 (plan 9.1~9.5).
2.5. M3.1 신규 항목 검증 (tier_class 분류 일관성 / 1.4.A.3 검증식 / state.view 모델 / storage v5 마이그레이션 멱등 / 매직 넘버 0개).

# 3. 통과 항목 (정합 검증 완료)

3.1. **사용자 결정 5건 모두 박제**:
- 9.1 전체 화면 view → spec 5.13.B.2 + 02_data 1.4.B.
- 9.2 드롭다운 quick-switch 유지 → spec 5.13.A.4.1.
- 9.3 토글 미도입 → spec 5.13.B.3.3.
- 9.4 hero 1개 미리보기 → spec 5.13.B.4 + heroTiers[0] 산출식.
- 9.5 헤더 라벨 클릭 활성 → spec 5.13.A.3.2.

3.2. **TIER_CLASS_VALUES 정합 + 검증식 통과**:
- 02_data 1.4.A.2 상수 정의 (TIER_CLASS_HERO/MAIN/GOODS, TIER_CLASS_VALUES).
- 1.4.A.3 검증식: 라인업당 hero/main/goods 각 ≥ 1. 드래곤볼 hero=2(A,LastOne)+main=5(B-F)+goods=4(G-J), 원피스 hero=2(A,LastOne)+main=5(B-F)+goods=3(G-I) 모두 통과.
- DC tierClass="hero" 박제 (DB.3 + OP.3 + DB.5 + OP.5).

3.3. **state.view 모델 정합**: 02_data 1.4.B에 STATE_VIEW_LOBBY/MAIN/VALUES/DEFAULT 정의 + spec 5.13.B.2와 1:1 대응.

3.4. **storage v5 마이그레이션 멱등 정합**: 3.2.6 알고리즘에 멱등 게이트(`schemaVersion ≥ 5 || kuji_lobby_acked !== null → return`) + v3→v4→v5 chain 의존성(loadState schemaVersion 비교 자동 chain).

3.5. **heroTiers 필터식 정합**: spec 5.13.B.4.3 `t.tierClass === "hero" && t.tier !== "Last One"` + heroTiers 빈 배열은 1.4.A.3 검증식 위반(부팅 실패) 선조건 명시.

3.6. **매직 넘버 0개**: 모바일 1열 / 태블릿 2열 / 768px breakpoint → 02_data 1.5 LOBBY_GRID_COLS_MOBILE=1 / LOBBY_GRID_COLS_TABLET=2 / LOBBY_TABLET_BREAKPOINT_PX=768 박제. 신규 dispatch type 2종 → 1.4.B 상수화. 라인업별 lobbyHeroAssetPath → DB/OP 메타에 박제.

3.7. **M3 사양 보존**: 5.13.A 본체 폐기 0건. M3.1은 5.13.A.3.2(헤더 라벨 클릭 활성) / 5.13.A.4(드롭다운 위상 변경) / 5.13.A.4.5(버튼 추가) / 5.13.A.6.4(라인업 추가 절차 항목 추가)만 보강.

3.8. **사행성/도박성 표현 0**: M3.1 변경분에 "확률 향상" / "필승" 등 표현 부재.

# 4. P1 결함 1건

## 4.1. P1-1. enter_lineup 메모리 폐기 정책의 동일 라인업 케이스 모호

위치: spec 5.13.B.6.2 / 5.13.A.4.4 비교.

결함:
- spec 5.13.B.6.2가 enter_lineup 호출 시 **무조건** `pendingPeelResult` / `selectedGridIndices` 폐기.
- 5.13.A.4.4 "라인업 전환 시 폐기" 정책을 그대로 답습.
- **시나리오**: 재방문자가 reveal 진행 중 → 헤더 라벨 클릭 (open_lobby, 메모리 보존) → 같은 라인업 카드 클릭 (enter_lineup) → pendingPeelResult 폐기 → reveal 손실.
- 트레이드오프: 무조건 폐기 = 정합 단순화 / 동일 라인업 보존 = 사용자 데이터 보호.

권고: 단계 4 impl_plan에서 dispatch.enter_lineup 분기를 `lineupId !== state.currentLineupId`인 경우만 메모리 폐기 + 라인업 공간 재로드, 동일 라인업이면 view 전환만 + 메모리 보존으로 결정. spec 5.13.B.6.2 보강도 동시.

[의견] 동일 라인업 보존이 자연스러움. enter_lineup과 set_current_lineup의 의도 분리(5.13.B.6.3) 정합과도 결이 맞음. 단계 4 결정으로 흡수 가능.

# 5. P2 결함 6건 (정보성)

| # | 결함 | 위치 | 처리 |
|---|---|---|---|
| 5.1 | 03_architecture v3 시점 - state.view / lobbyAcked / dispatch.open_lobby / dispatch.enter_lineup / render/lobby.js / migrateV4ToV5 / 4.M3.1 v4→v5 chain 일괄 미반영 | 03_architecture.md 전반 | **단계 4 impl_plan 일괄 갱신 의무** (plan 5장 Phase 3) |
| 5.2 | CTA 색 분기 모호 ("IP 액센트 또는 브랜드 빨강") | spec 5.13.B.4.2 표 6 | 단계 4에서 IP 액센트 토큰 도입 여부 결정 |
| 5.3 | saveState 시그니처 informal 표기 | spec 5.13.B.6.2 | 단계 4에서 `saveState({ currentLineupId, lobbyAcked: true })` 객체 인자 형식 명시 |
| 5.4 | 라인업 추가 절차 항목 분리 차이 (spec 5.13.A.6 = 4단계, 02_data = 8단계) | spec ↔ 02_data | 02_data SSOT 채택 명시 또는 spec 동기화. 단계 4 결정 |
| 5.5 | lobbyAcked 직렬화/역직렬화 정책 미명시 (`=== "true"` vs JSON.parse) | 02_data 3.2.6 | 단계 4 impl_plan에서 명시 |
| 5.6 | 첫 방문자 "현재" 배지 부자연 (currentLineupId default 부여 후 드래곤볼 카드 자동 강조) | spec 5.13.B.4.4 | 단계 4 분기 결정 또는 단계 7 QA 검증 |

# 6. 통과 판단

P0 0건. **단계 3 통과**. 단계 4 impl_plan 진입.

P1-1(enter_lineup 동일 라인업 분기)은 단계 4 impl_plan 작성 시 dispatch.enter_lineup 시그니처 기술에서 흡수. round 2 재검증 없이 단계 4 진입 가능.

# 7. 단계 4 이월 결정 사항 (8건)

7.1. **dispatch.enter_lineup 메모리 폐기 분기**: lineupId === state.currentLineupId 시 view 전환만 + 메모리 보존 vs 무조건 폐기. (P1-1 권고 = 분기 채택)
7.2. **03_architecture M3.1 신설 항목 일괄 작성** (P2-1):
- state 객체 확장 (`view` / `lobbyAcked` 필드).
- dispatch.open_lobby / dispatch.enter_lineup 시그니처.
- render/lobby.js 모듈 책임 / 인터페이스.
- core/lobby_preview.js 또는 동치 모듈 신설 검토 (heroTiers 필터식 = 도메인 로직 → core 분리 후보. CLAUDE.md 4.1 정합).
- data/storage.js migrateV4ToV5 함수 시그니처.
- 4.M3.1 부팅 절차에 v4→v5 chain 추가.
- 5.x 단계 6 게이트 grep 추가 (lobbyAcked 영속 정합 / view 매트릭스 / heroTiers 필터식 정합).
7.3. **CTA 색 라인업 분기 결정** (P2-2).
7.4. **saveState 객체 인자 형식 명시** (P2-3).
7.5. **라인업 추가 절차 SSOT 채택** (P2-4): 02_data 8단계 우선.
7.6. **lobbyAcked 직렬화/역직렬화 정책** (P2-5).
7.7. **첫 방문자 "현재" 배지 분기** (P2-6): lobbyAcked === false 시 미노출 vs 모든 카드 동등.
7.8. **단계 5 단위 테스트 신설** (plan 7장): tier_class.test.js / storage_v5.test.js / lobby_flow.test.js.

# 8. 변경 이력

8.1. 2026-05-08: round 1 검증 완료. P0 0 / P1 1 / P2 6. 통과 판정. 단계 4 진입 권고.
