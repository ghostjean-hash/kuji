# M2.1-pick-from-bin 단계 6 impl_review

작성일: 2026-05-08.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 3 (자동 재시도 1회 + 사용자 명시 승인 1회).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | 5 | 4 | 4 | 미통과 |
| round 2 | 1 | 0 | 2 | 미통과 (round 1 정정 누락) |
| round 3 | **0** | 0 | 2 | **통과** |

# 2. 검증 카테고리

2.1. CLAUDE.md 4장 절대 규칙 정합 (4.1~4.8).
2.2. SSOT vs 코드 정합 (`docs/01_spec.md` / `docs/02_data.md` / `docs/03_architecture.md` ↔ `src/`).
2.3. 04_impl_plan T1~T17 + B-α Phase A~G 산출물 정합.
2.4. M2.1 학습 룰 6.2.2~6.2.15 위반.

# 3. round 1 P0 결함 5건 (자비스 자동 정정)

## 3.1. P0 2.1 - pick-hint-toast 폐기 docs 정정 누락
- 파일 0개 (`pick-hint-toast.js`) + dispatch 호출처 0건이지만 spec / 02_data / 03_architecture / numbers.js 다수에 jewel reference 잔존.
- 정정: 9개 파일 위치 deprecated 표기 또는 폐기 명시.
- 메모리 룰 `feedback_lottery_red_text` 정합.

## 3.2. P0 2.2 - 03_architecture 5.7 / 5.8 매트릭스 폐기 식별자 잔존
- `pendingPickResult` (B-α 폐기) / `meta.pickHintSeen` (toast 폐기) 검증식에 잔존.
- 정정: `first ticket.lockedResult`로 통합 + pickHintSeen 호환 검증으로 의미 축소.

## 3.3. P0 2.3 - Last One 슬롯 격자 노출 spec 정의 vs 코드 비노출
- spec 5.14.2.5 / 5.14.3.5/3.6 / 5.14.4.1에 "격자 마지막 셀" 정의 잔존이지만 4.14.14 라이브 결정으로 통 비노출.
- 사용자 결정: (A) 통 비노출 유지 - spec 갱신.
- 정정: spec 5.14.2.5 / 5.14.3.5/3.6 폐기 표기 + pick-slot.js LAST_ONE_PENDING/DRAWN deprecated 주석.

## 3.4. P0 2.4 - tokens.css 색 ↔ 02_data 2.2 SSOT 불일치 3건
- `COLOR_PICK_SLOT_BG / BORDER / EMPTY_BG`의 라이브 정정값(코드)이 02_data 2.2와 불일치.
- 사용자 결정: (A) 라이브 정정 유지 - 02_data 갱신.
- 정정: 02_data 2.2 3건 값 정정 + colors.js (round 2 잔존, round 3 정정).

## 3.5. P0 2.5 - tokens.css 미등재 토큰 3건 (SSOT 누락)
- `--frame-red-dark`, `--gold-edge-soft`, `--pick-slot-bg-grad` 02_data 2.2 미등재.
- 정정: 02_data 2.2 + colors.js export 3건 추가.

# 4. round 2 잔존 P0 1건 (round 1 정정 누락)

## 4.1. colors.js 미동기화
- round 1 P0 2.4/2.5의 "코드 측" 정정 누락. tokens.css + 02_data는 갱신했으나 colors.js export 값이 이전 값 잔존 + 신규 토큰 export 부재.
- CLAUDE.md 4.5 (docs ↔ 코드 충돌) 위반.
- round 3에서 `src/data/colors.js` 6건 동기화로 정정.

# 5. P1 결함 4건 (자비스 자동 정정)

## 5.1. P1 3.1 - 매직 넘버 30 (z-index boost)
- pick-panel.js의 `zBase += 30` 매직 넘버.
- 정정: `PICK_SLOT_SELECTED_Z_BOOST = 30` numbers.js + 02_data 1.12 등재.

## 5.2. P1 3.2 - 03_arch 6.3 변경이력의 폐기 식별자 잔존 (정보성)
- 6.3에 "findUnrevealed/revealHistory 신설" 진술이 폐기 후에도 잔존.
- 정정: "(이후 6.5에서 폐기)" 보강.

## 5.3. P1 3.3 - 03_arch 변경이력 6.6 라이브 정정 4.14~4.16 미반영
- 정정: 6.6 절 신설 (9개 항목 흡수: toast 폐기 / dispatch.peel 흐름 / buildConsumedGridSet / 통 슬롯 산개 / Last One 통 비노출 / 5.8 매트릭스 / 시각 튜닝 매직 4종 / 02_data 색 SSOT / PICK_AUTO_CONFIRM_DELAY_MS).

## 5.4. P1 3.4 - requiresReceive UI 게이트 docs 미명시
- 4.14.8 흐름 정정 후 의미 변경(history 게이트 → UI 플래그)이 03_arch에 미반영.
- 정정: 03_arch 4.6에 게이트 효과 명시 (hero-carousel "받기" 버튼 / peel-card disabled / history 게이트 아님 명시).

# 6. P2 결함 4건 (다음 사이클 후보)

| # | 항목 | 결정 |
|---|---|---|
| 6.1 | buildConsumedGridSet의 render 위치 (4.1 회색지대) | M3 후보. core/pick-grid.js 분리 검토. |
| 6.2 | settings-tab pickHelp 도움말 텍스트 | 사용자 결정: 설정 탭은 메모리 룰 범위 외 - 유지. |
| 6.3 | spec "안내 toast" 표현 잔존 | P0 2.1과 함께 처리됨. |
| 6.4 | round 5 시나리오 6.5 표현 단축형 | 다음 사이클 후보. |

round 2 신규 P2 2건:
- pick_hint_seen handler dead (main.js 호출처 0건). 무해, M3 후보.
- 04_impl_plan.md pendingPickResult 잔존. 단계 4 SSOT, M3 후보.

# 7. 통과 판단

- 잔존 P0: 0건. 단계 6 게이트 통과.
- 잔존 P1: 0건.
- 잔존 P2: 6건 (M3 후보 등재).

# 8. 단계 7 진입 권고

P0 0건 + 모든 정정 사이클 완료. 단계 7 QA 보고서 작성으로 진입 가능.

# 9. 변경 이력

9.1. 2026-05-08: round 1 검증 (P0 5 / P1 4 / P2 4).
9.2. 2026-05-08: round 1 정정 사이클 (자비스 자동 + 사용자 결정 P0 2.3 (A) / P0 2.4 (A) / P2 4.2 유지).
9.3. 2026-05-08: round 2 재검증 (잔존 P0 1건 - colors.js 미동기화).
9.4. 2026-05-08: round 3 정정 + 재검증 (사용자 명시 승인 자동 재시도 1회 초과). **통과**.
