# M3 second-lineup 단계 6 impl_review

작성일: 2026-05-08.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 2 (자동 재시도 1회).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | 3 | 4 | 3 | 미통과 |
| round 2 | **0** | 0 | (3 백로그) | **통과** |

# 2. 검증 카테고리 (4개)

2.1. CLAUDE.md 4장 절대 규칙 정합.
2.2. SSOT vs 코드 정합.
2.3. 04_impl_plan T1~T22 + 5 Phase 산출물 정합.
2.4. 03_architecture 5.10 / 5.11 / 5.12 게이트 grep.

# 3. round 1 P0 결함 3건 (자비스 자동 정정)

## 3.1. P0 2.1 - dispatch.set_current_lineup이 라인업을 실제 전환하지 않음
- 위치: `src/render/main.js` set_current_lineup 분기.
- 근거: `persist()` 후 메모리만 newLineupId 갱신 → `loadState()`가 storage의 oldLineupId 그대로 읽어 oldLineupId state 로드 → 결과 currentLineupId 원복. 라인업 전환 동작 0건.
- 정정: `state.currentLineupId = newLineupId` 직후 `saveState({ currentLineupId: newLineupId })` 명시 호출. 이후 `loadState()`가 새 라인업 공간 인식. fallback 차단 (`newLineup.id !== newLineupId`) 추가.

## 3.2. P0 2.2 - draw-tab.js BOX_SIZE 단수 alias 사용
- 위치: `src/render/draw-tab.js` import + "박스 종료" 메시지.
- 근거: `${BOX_SIZE}` 단수 alias 사용 → 활성 라인업이 아닌 드래곤볼 고정값 표시. 03_arch 5.10 라인업 격리 정신 위반. M4+ 라인업 다양성 시 즉각 잘못된 값.
- 정정: `getLineupById(state.currentLineupId)`로 동적 lookup → `${lineup.boxSize}` 동적 사용.

## 3.3. P0 2.3 - main.css 인라인 hex 35건
- 위치: `styles/main.css` 다수.
- 근거: CLAUDE.md 4.2 매직 넘버 / 6.3 인라인 매직 값 위반. T20에서 흡수 의무였으나 미흡수.
- 정정: 9종 신규 토큰 (`--frame-red-deeper` / `--gold-deep` / `--gold-light` / `--text-on-red` / `--border-light-gray` / `--paper-gray` / `--paper-gray-border` / `--night-grad-from` / `--night-grad-to`) 02_data 2.2 + colors.js + tokens.css 동기 등재 + main.css 일괄 var() 치환 (sed). 결과: main.css 인라인 hex 0건.

# 4. round 1 P1 결함 4건

| # | 항목 | 처리 |
|---|---|---|
| 3.1 | bootstrapState 시그니처 ↔ 03_arch 불일치 | P0 2.1 정정 시 자연 흡수 (실제 동작 정합) |
| 3.2 | dropdown 원복 UX | P0 2.1 정정으로 confirmModal 흐름 정합 |
| 3.3 | 03_arch 3.14/3.15 5상태→3상태 docs 갱신 | round 2 정정 OK |
| 3.4 | confirm_pick dead handler 제거 | round 2 정정 OK |

# 5. round 1 P2 결함 3건 (단계 8 백로그)

| # | 항목 | 결정 |
|---|---|---|
| 4.1 | tests에 LINEUP_DRAGONBALL as LINEUP alias 다수 | 단계 8 백로그. M4+ 정리 시 직접 사용. |
| 4.2 | data/assets.js 라인업 미분기 (lineup.assetsAvailable 무시) | **단계 8 백로그**. 04_impl_plan T1~T22가 assets.js 분기 작업을 명시하지 않은 plan 결함. M3.1 또는 M4 별도 plan으로 흡수. |
| 4.3 | M2.1 04_impl_plan strikethrough (T19) 미확인 | 본 보고서에서 점검 - T19 노트 추가 OK. |

# 6. round 2 검증 결과

- 잔존 P0: 0건.
- 신규 sweep: LINEUP 단수 잔존 0 / 격리 키 lineup_id 누락 0 / 등급 수 하드코딩 0 / currentLineupId 분기 정합 OK.
- core/ DOM 의존성 0건 (재확인).

# 7. 통과 판단

- 잔존 P0: 0건.
- **단계 7 QA 진입 가능**.

# 8. 단계 7로 이월된 검증 영역

- 라이브 시각 검증 (사용자): 라인업 전환 흐름 / 헤더 IP 라벨 / settings-tab dropdown / 양 라인업 SVG fallback 표시.
- 단위 테스트 11+2 suite 실행 (storage_v4.test.js / lineup_isolation.test.js 포함).

# 9. 변경 이력

9.1. 2026-05-08: round 1 검증 (P0 3 / P1 4 / P2 3).
9.2. 2026-05-08: round 1 정정 사이클 (자비스 자동 - 5건 P0+P1 정정).
9.3. 2026-05-08: round 2 재검증. **통과 (P0 0건)**.
