# M4 단계 3 design_review (round 1 → round 2 합본)

검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트).
검증일: 2026-05-10. 자동 재시도 1회 사용 (사용자 "권고 진행" 자율 진행 신호 답습).

# 1. 사이클 결과 요약

| 라운드 | 판정 | P0 | P1 | P2 | 통과 |
|---|---|---|---|---|---|
| round 1 | 미통과 | 3 | 4 | 3 | 부분 |
| round 2 | **통과** | 0 | 0 | 1 (비블로킹, 단계 4 결정 영역) | 12 |

# 2. round 1 결함 + round 2 흡수

## 2.1. P0 3건

- P0-1: spec 4.3 `state.currentTab` vs 02_data/plan/arch `activeTab` 충돌 → 통일.
- P0-2: arch 3.11 state 객체 view/탭 4탭 enum 잔존 → home/3탭 갱신.
- P0-3: 02_data SCHEMA_VERSION = 5 + v5→v6 마이그레이션 절 미신설 → SCHEMA_VERSION = 6 + 3.2.7 신설 + 3.1.2 home_acked + active_tab 키 박제.

## 2.2. P1 4건

- P1-1: spec 5.13.B.4 sub-section 번호 중복 → 4.1~4.6 시프트.
- P1-2: 단계 2 결정 게이트 6건 미결 → round 2 채택 박제.
- P1-3: 진행 상태 산출식 미박제 → spec 5.13.B.4.3 산출식 박제.
- P1-4: arch 3.11 본체 미갱신 → P0-2 흡수.

## 2.3. P2 3건 (round 1, round 2에서 자연 해소)

- P2-1: spec 5.13.A.4.5 "라벨 갱신 검토" → "홈으로" 채택 박제.
- P2-2: spec 4장 [추첨 탭] "로비 복귀" → "홈 복귀" 표현 갱신.
- P2-3: arch 6.12 변경 이력 박제 vs 본체 일관성 → P0-2 흡수.

# 3. round 2 잔여 P2 1건 (비블로킹)

## 3.1. P2-1. arch 3.17~3.22 lobby 식별자 잔존 (단계 4 결정 영역)

- 위치: arch 3.18~3.22 (M3.1 잔존 절).
- 현상: `lobby` / `lobbyAcked` / `LOBBY` / `DISPATCH_TYPE_OPEN_LOBBY` / `STATE_VIEW_LOBBY` 식별자가 본문에 잔존.
- 처리: 단계 4 impl_plan에서 일괄 개명 또는 alias 정책 결정. 단계 5에서 코드 적용.

# 4. round 2 채택 결정 6건 (단계 1 결정 게이트 흡수)

| # | 항목 | 채택 |
|---|---|---|
| 10.1 | 홈 카드 메타 풍부도 | 권고 그대로 (IP + hero + 출시일/끝일/가격/매장 + 진행 상태) |
| 10.2 | 갤러리+기록 sub-section 순서 | 권고 그대로 (대시보드 / 갤러리 / 리스트 / DC) |
| 10.5 | M3.4-tidy 흡수 | 별도 라운드 (M4.1-tidy) - 본 사이클 부담 ↑ |
| 10.7 | 헤더 홈 아이콘 | (i) IP 라벨 클릭만 (꺾쇠 아이콘 affordance) |
| - | DC 처리 | sub-section 4 통합 (별도 탭 폐기) |
| - | history 페이징 | 무한 스크롤 |

# 5. SSOT 정합 검증 통과

| 영역 | 정합 |
|---|---|
| spec 4장 ↔ 02_data 1.4.B ↔ arch 3.11 (view/탭/dispatch) | OK |
| spec 5.13.B.4 메타 ↔ 5.13.A.6.5 ↔ plan 10.1 | OK |
| spec 5.13.F.2 sub-section ↔ plan 10.2 | OK |
| 02_data 3.1.2 home_acked ↔ 3.2.7 마이그레이션 ↔ arch 5.19 게이트 | OK |
| 사용자 결정 5 + 단계 1 채택 2 + round 2 채택 6 박제 | OK (plan 10/11.X + spec 5.13 + 02_data 4.17 + arch 6.12) |

# 6. 학습

6.1. **메이저 사이클 round 1 P0 폭증 패턴**: 큰 폭 변경 시 단계 2 design 본체 갱신과 단계 4 사전 정합 박제가 동시에 의무. arch 3.11 같은 본체 SSOT가 누락되면 단계 4 / 5에서 게이트 위반. M5+ 메이저 사이클에서 답습.

6.2. **마이그레이션 절 동시 박제 의무**: storage 마이그레이션은 SCHEMA_VERSION + 키 변경 + 알고리즘 + 멱등 + 테스트 의무 5종이 동시에 박제되어야 함. 단계 2에서 부분 박제(SCHEMA_VERSION만 / 알고리즘만 등)는 P0 위험.

6.3. **단계 2 결정 게이트 종결 의무**: 단계 1 plan에서 단계 2 결정으로 이월한 항목은 단계 2 통과 전 모두 채택 박제 의무. round 1 P1-2가 6건 미결로 전체 단계 2 통과 게이트 위반.

# 7. 변경 이력

7.1. 2026-05-10: round 1 P0 3건 + P1 4건 발견. round 2 정정 흡수.
7.2. 2026-05-10: round 2 통과. P0=0, P1=0, P2=1 (단계 4 결정 영역). 단계 4 impl_plan 진입.
