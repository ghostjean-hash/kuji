# M2 ux-redesign - 04 구현 플랜

| 항목 | 값 |
|---|---|
| 스프린트 ID | M2-ux-redesign |
| 단계 | 4 impl_plan |
| 작성일 | 2026-05-02 |
| 상태 | 작성 완료, 사용자 승인 대기 |

# 1. 한 줄

`docs/03_architecture.md` 본체 갱신과 함께 단계 5 작업을 23개 태스크로 분할. 데이터 + 자산 → core 신규 → 스타일 → 새 render 모듈 → 통합 → 테스트 순서.

# 2. 본 단계 산출물

2.1. `docs/03_architecture.md` 본체 갱신 (M2 폴더 / 모듈 + 의존성 + 검증식 보강).
2.2. 본 파일 (`04_impl_plan.md`).

# 3. 작업 분할 (23개 태스크)

## 3.1. T1 ~ T4: 데이터 + 자산

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T1 | numbers.js M2 갱신 (1.6~1.11 + SCHEMA_VERSION v2) | `src/data/numbers.js` | P0 | 0.1일 |
| T2 | colors.js M2 갱신 (Light 테마 UI 색 + Last One 빨강 통일) | `src/data/colors.js` | P0 | 0.1일 |
| T3 | storage.js M2 갱신 (`kuji_unopened_tickets` + v1→v2 마이그레이션) | `src/data/storage.js` | P0 | 0.2일 |
| T4 | assets.js 신설 + SVG 자산 (탭 4 + 상품 메인 11) | `src/data/assets.js`, `src/assets/icons/*.svg`, `src/assets/products/*-main.svg` | P0 | 1.0일 |

## 3.2. T5 ~ T6: core (신규)

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T5 | core/buy.js 신설 (validateBuyCount + addUnopenedTickets) | `src/core/buy.js` | P0 | 0.2일 |
| T6 | core/* 그대로 (draw / box / last_one 등 변경 없음) | n/a | n/a | 0일 |

## 3.3. T7 ~ T8: 스타일 (Light 테마)

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T7 | tokens.css 전면 재작성 (Light + 종이 톤) | `styles/tokens.css` | P0 | 0.3일 |
| T8 | main.css 전면 재작성 (새 디자인 언어 + 카드 / 게이지 / 아코디언 / 모달) | `styles/main.css` | P0 | 0.7일 |

## 3.4. T9 ~ T19: 신규 render 모듈

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T9 | render/icon.js (탭 SVG wrapper) | `src/render/icon.js` | P1 | 0.1일 |
| T10 | render/bottom-tabs.js 갱신 (SVG 아이콘 적용) | `src/render/bottom-tabs.js` | P1 | 0.1일 |
| T11 | render/buy-panel.js 신설 (Quick + 자유 입력 + 가격 합산) | `src/render/buy-panel.js` | P0 | 0.3일 |
| T12 | render/peel-panel.js 신설 (인벤토리 스택) | `src/render/peel-panel.js` | P0 | 0.2일 |
| T13 | render/peel-card.js 신설 (페이지플립 + 좌측 드래그 + 햅틱) | `src/render/peel-card.js` | P0 | 0.6일 |
| T14 | input/drag.js 신설 (좌측 가장자리 드래그) | `src/input/drag.js` | P0 | 0.2일 |
| T15 | render/product-image.js 신설 (SVG + 딤드 + 오버레이) | `src/render/product-image.js` | P0 | 0.2일 |
| T16 | render/tier-gauge.js + tier-accordion.js 신설 | `src/render/tier-gauge.js`, `src/render/tier-accordion.js` | P1 | 0.3일 |
| T17 | render/product-item.js 신설 (1매 등급 vs 다수 등급 분기) | `src/render/product-item.js` | P0 | 0.3일 |
| T18 | render/product-gallery.js 신설 (11종 컨테이너) | `src/render/product-gallery.js` | P0 | 0.2일 |
| T19 | render/last-one-indicator.js 신설 (펄스 + 발광) | `src/render/last-one-indicator.js` | P1 | 0.2일 |

## 3.5. T20 ~ T22: 기존 render 갱신

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T20 | render/main.js 갱신 (state.unopenedTickets + dispatch buy / peel + sub-screen 분기) | `src/render/main.js` | P0 | 0.5일 |
| T21 | render/draw-tab.js 갱신 (구매 / 뜯기 sub-screen 라우팅) + tier-grid.js 폐기 | `src/render/draw-tab.js` | P0 | 0.3일 |
| T22 | render/result-modal.js + last-one-modal.js + history-tab.js + dc-tab.js + settings-tab.js + header.js 디자인 언어 갱신 (POP 모션 포함) | 다수 | P1 | 0.5일 |

## 3.6. T23: 테스트

| ID | 태스크 | 산출물 | 우선 | 추정 |
|---|---|---|---|---|
| T23 | tests/suites/buy.test.js 신설 + 기존 테스트 매직 넘버 grep 검증 | `tests/suites/buy.test.js` | P0 | 0.4일 |

**합계 추정: 약 6.5일** (M1 4.1일 대비 1.6배. M2 plan 6장 추정과 일치).

# 4. 의존성 그래프 (작업 순서)

```
T1 (numbers) ──► T2 (colors) ──► T3 (storage)
                                 ──► T4 (assets) ──► T9 (icon)
                                                 ──► T15 (product-image)
T1, T3 ──► T5 (buy)
T7 (tokens) ──► T8 (main.css)

T5 + T8 ──► T11 (buy-panel)
T8 ──► T12 (peel-panel)
T8 + T14 (drag) ──► T13 (peel-card)
T15 + T16 (gauge / accordion) ──► T17 (product-item)
T17 ──► T18 (product-gallery)
T8 ──► T19 (last-one-indicator)

T11 ~ T19 ──► T21 (draw-tab)
T11 ~ T19 + T21 ──► T20 (main.js)
T20 ──► T22 (기존 render 갱신)

T5 ──► T23 (buy.test.js)
모든 코드 완료 ──► T23 (tests grep 검증)
```

# 5. 작업 순서 권고

5.1. **Day 1 (8h)**: T1 → T2 → T3 → T7 → T8 (데이터 + 스타일 베이스).
5.2. **Day 2 (8h)**: T4 (자산 SVG, 가장 시간 부담) → T5.
5.3. **Day 3 (8h)**: T9 → T10 → T14 → T15 → T16 → T11 (구매 패널 우선).
5.4. **Day 4 (8h)**: T12 → T13 (뜯기 + 페이지플립) → T17 → T18 (갤러리).
5.5. **Day 5 (8h)**: T19 → T20 → T21 → T22 (통합 + 기존 갱신).
5.6. **Day 6 (3h)**: T23 (테스트) + 자체 grep 사전 검증.

# 6. 절대 규칙 정합 (CLAUDE.md 4장 + M1 OP-1~4)

| 규칙 / 학습 | 본 플랜 강제 |
|---|---|
| 4.1 로직 / 렌더 분리 | core/buy.js만 신규. 나머지 신규는 모두 render/ |
| 4.2 매직 넘버 금지 | T1에서 02_data 1.6~1.11 모두 numbers.js로. T13/T14의 임계값 / duration / 햅틱은 numbers.js import만 |
| 4.3 core DOM 금지 | T5 buy.js는 순수 함수 |
| 4.4 핵심 로직 변경 시 테스트 갱신 | T23 buy.test.js |
| 4.5 docs / 코드 충돌 시 docs 우선 | T1~T22는 docs 1차 출처 (M2 갱신본) |
| 4.6 사행성 금지 | UI 카피 검사 |
| 4.7 8단계 파이프라인 준수 | 본 단계가 4 |
| 4.8 추정 플래그 보존 | T1 BOX_SIZE_ESTIMATED / TIERS_COUNT_ESTIMATED 그대로 |
| OP-1 강박 캘리브레이션 | 단계 6 검증 프롬프트에 명시 (M2 plan 2.8.4) |
| OP-2 replace_all + grep | T20 / T22 시그니처 변경 시 적용 |
| OP-3 자체 grep 사전 | 단계 6 진입 전 매직 넘버 / 시그니처 자체 grep |
| OP-4 tests 매직 넘버 | T23 grep 검증 명시 |

# 7. 단계 6 게이트 (사전 알림)

`docs/03_architecture.md` 5장 검증식 5개:
- 5.1 매직 넘버 (src + tests)
- 5.2 core DOM
- 5.3 numbers.js 키 = 02_data 1장
- 5.4 단위 테스트 pass + 신규 buy.test.js
- 5.5 시그니처 grep

# 8. 리스크

8.1. **SVG 자체 제작 시간** (T4): 11+4=15개 SVG. 단순 일러스트 + 아이콘 형태. 상품 SVG는 캐릭터 실루엣 + 등급 색 + 사이즈 라벨 형태로 단순화. 사용자가 디자인 결과에 만족 못하면 M3 백로그로 보강.
8.2. **페이지플립 애니메이션** (T13): CSS `rotateY` + perspective. 모바일 성능 검증 필요. 60fps 미달 시 단순 페이드로 fallback.
8.3. **좌측 드래그** (T14): touchstart/move/end + pointer events 통합 핸들링. iOS Safari + Android Chrome 검증 필요.
8.4. **인벤토리 영속 마이그레이션** (T3): SCHEMA_VERSION v1→v2 시 기존 사용자의 박스 / 이력 보존 + `unopenedTickets = []` 초기화.
8.5. **Light 테마 시각 컨펌** (T7/T8): 사용자 의도와 격차 위험. T8 완료 직후 사용자 시각 컨펌 권장 (Day 1 종료 시점).

# 9. 사용자 승인 항목

9.1. 23개 태스크 분할 / 우선순위 동의?
9.2. 6.5일 추정 / Day 1~6 시퀀스 동의?
9.3. T8 (Light 테마 + main.css) 완료 직후 시각 컨펌 가질 수 있는지 (또는 단계 5 종료 후 한 번에 컨펌)?
9.4. 단계 5 implement 진입 승인?

승인 받으면 단계 5 implement (T1부터 시작) 진입.
