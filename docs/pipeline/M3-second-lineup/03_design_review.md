# M3 second-lineup 단계 3 design_review

작성일: 2026-05-08.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 3 (자동 재시도 1회 + 사용자 명시 승인 1회).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | 4 | 5 | 3 | 미통과 |
| round 2 | 1 | 0 | 0 | 미통과 (round 1 P0 2.4 9건 중 1건 누락) |
| round 3 | **0** | 0 | 0 | **통과** |

# 2. 검증 카테고리

2.1. CLAUDE.md 4장 절대 규칙 정합 (4.1~4.8).
2.2. SSOT 자체 정합 (단계 5 진입 전이라 코드 미존재. 01_spec ↔ 02_data 정합 + 라인업 메타 ↔ research/lineups.json 정합).
2.3. M3 신규 검증 항목 (01_plan 3.8.1~3.8.3): 라인업 격리 / currentLineupId 매트릭스 / 등급 수 가변성 / 마이그레이션 멱등 / 결정론 회귀.

# 3. round 1 P0 결함 4건 (자비스 자동 정정)

## 3.1. P0 2.1 - 박스 ID 공식 lineup_id 미포함 (결정론 회귀 직접 위험)
- 위치: 01_spec 5.1.3 / 5.7.1
- 정정: 박스 ID = `fnv1a("${lineup.id}|${seed}|${box_round}")` → 8 hex. 5.5.2 DC 응모권도 lineup 포함 명시.

## 3.2. P0 2.2 - 02_data 1.7.2 절번호 중복
- 정정: "github 호환 placeholder 자산 사양" 절을 1.7.2 → 1.7.4로 시프트. 1.7.1 → 1.7.1-DB로 명명 일관성 정합.

## 3.3. P0 2.3 - LINEUP 단수 글로벌 표기 잔존
- 정정: 5.13.A.1.0 표기 정책 신설 ("소문자 lineup = 활성 라인업 객체"). 본문 5종 줄 (5.10.4 / 5.14.0.4 / 5.14.4.4 / 5.14.2.1 / 7.18) `LINEUP` → `lineup` 정정.

## 3.4. P0 2.4 - 옛 절번호 + 단수 상수 9건
- 정정: 9개 줄 모두 `BOX_SIZE → lineup.boxSize` / `DC_WINNERS_TOTAL → lineup.dc.winnersTotal` / `LINEUP_PRICE_JPY → lineup.priceJpy` / `1.4.X → 1.4-DB.X / 1.4-OP.X`.
- round 1에서 8건 정정 + 7.9 누락 → round 2 1건 잔존 → round 3 정정.

# 4. round 1 P1 결함 5건

| # | 항목 | 처리 |
|---|---|---|
| 3.1 | 1.4.0 표 옛 절번호 | round 2 정정 OK |
| 3.2 | SOURCES 상수 정의 누락 | round 2 정정 OK (1.4-DB.4 / 1.4-OP.4 끝에 명시) |
| 3.3 | gridIndex 의무 기록 알고리즘 | **단계 4 impl_plan 이월** (검증자 권고) |
| 3.4 | drawRng 격리 명시 | round 2 정정 OK (5.7.5 신설) |
| 3.5 | 라인업 미발견 fallback | round 2 정정 OK (7.16.1 신설) |

# 5. round 1 P2 결함 3건 (정보성, 단계 4 또는 다음 사이클)

5.1. 1.7.1 / 1.7.1-OP 절번호 명명 비일관 → round 2에서 1.7.1-DB로 정정.
5.2. 원피스 type_count 합 검증식 부재 (M4+ 흡수 후보).
5.3. M2.1 정리 라운드 (3.5.5) numbers.js dead 상수 제거 vs 02_data 1.12 deprecated 표기 정합 → 단계 4에서 결정.

# 6. round 1 → round 2 정정 적용 결과 (검증자 보고)

- P0 2.1 / 2.2 / 2.3: 적용 OK.
- P0 2.4: 부분 적용 (8/9건). round 2 잔존 P0 1건 = 7.9 줄 미정정.
- P1 3.1 / 3.2 / 3.5: 적용 OK.

# 7. round 2 → round 3 정정 (사용자 명시 승인 자동 재시도 1회 초과)

- 7.9 줄 정정: `BOX_SIZE` → `lineup.boxSize` + `1.4.2.1` → `1.4-DB.2.1 / 1.4-OP.2.1`.

# 8. round 3 검증 결과

- 잔존 P0: 0건.
- 추가 sweep: 잔존 0건. `LINEUP` / `BOX_SIZE` / `DC_WINNERS_TOTAL` 등 단수 식별자 잔존은 모두 (a) 표기 정책 명시 (b) 02_data 1.12 단계 4 결정 보류 (c) 변경이력 메타 언급. 옛 절번호 (1.4.X) 잔존 0건.

# 9. 통과 판단

- 잔존 P0: 0건.
- **단계 4 impl_plan 진입 가능**.

# 10. 단계 4로 이월된 결정 사항

10.1. **gridIndex 의무 기록 알고리즘 (M3 단계 1 plan 3.7)**: skip ON 흐름에서 history entry의 gridIndex를 어떻게 채울지. 옵션 A (잔여 격자 첫 번째 위치) / B (deck 인덱스 = pickIndex) / C (null 유지 + buildConsumedGridSet placeholder 충당, 현 M2.1 흐름 보존).
10.2. **02_data 1.12 BOX_SIZE 단수 글로벌 export**: M3 코드에서 `BOX_SIZE` 단수를 폐기할지, 호환 alias로 유지할지. 단계 4 impl_plan에서 정합 결정.
10.3. **02_data 1.12 LINEUP 단수 export**: M3에서 `LINEUP` → `LINEUPS`로 변환하면서 호환 alias 유지 여부.

# 11. 변경 이력

11.1. 2026-05-08: round 1 검증 (P0 4 / P1 5 / P2 3).
11.2. 2026-05-08: round 1 → round 2 정정 (자비스 자동, 8/9건 + P1 3건).
11.3. 2026-05-08: round 2 검증 (잔존 P0 1건 - 7.9 줄 누락).
11.4. 2026-05-08: round 2 → round 3 정정 (사용자 명시 승인 자동 재시도 1회 초과, 7.9 줄 1건).
11.5. 2026-05-08: round 3 검증 통과 (P0 0건). **단계 4 impl_plan 진입 가능**.
