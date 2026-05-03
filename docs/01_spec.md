# 01. 시뮬레이터 사양

본 문서는 Kuji 시뮬레이터의 사양 SSOT. M1-base-system + M2-ux-redesign + M2.1-pick-from-bin 통합.

# 1. 한 줄

이찌방쿠지 표준 메커닉을 모바일 웹에서 그대로 굴리되 매장 경험(복권 구매 + 통에서 N매 직접 골라 손에 들기 + 한 장씩 페리페리 뜯기 + 상품 갤러리)을 모사한 시뮬레이터. 첫 라인업은 `一番くじ ドラゴンボール THE CHRONICLE OF GOKU`. 결제 / 실물 배송 / 백엔드 없음. M2 에서 Light 테마 + 디자인 언어 + 구매/뜯기 / 갤러리 도입. M2.1 에서 통(bin) N매 통째 선택 + 확인 버튼 + skip 옵션 도입 (B-α 메커닉).

# 2. 코어 루프 (M2 + M2.1 B-α 갱신)

2.1. 박스 진입 → 박스 카드(잔여 / 회차 / 시드 / Last One 인디케이터) + 상품 갤러리 + 구매 패널.
2.2. **구매 씬**: 1매 / 3매 / 5매 / 10매 quick 또는 자유 입력 → 가격 합산 → 구매 → 인벤토리에 raw 복권 N매 추가 (`lockedResult: null`). 구매 패널에 "통에서 선택 건너뛰기" 체크박스 (M2.1 신설, 5.14).
2.3. **통 선택 씬 (M2.1 B-α)**: skip OFF 시 진입. 잔여 슬롯 격자 표시 + 사용자가 N매 슬롯 선택 (메모리 토글) + "확인" 버튼 클릭 → drawOne N회 연속 호출 + 인벤토리 ticket N매에 `lockedResult` 부여 + 격자 종료 → 2.4 진입. skip ON 시 본 씬 미진입 (2.4 직진).
2.4. **뜯기 씬**: 인벤토리 ≥ 1 + (첫 ticket.lockedResult 보유 또는 skip ON). 좌측 가장자리 드래그(페리페리) 또는 클릭 → 두겹 카드 펼침 애니메이션 → 등급 / 상품 공개. 결과 = ticket.lockedResult (skip OFF) 또는 drawOne 즉시 호출 (skip ON).
2.5. 결과는 페이지플립 카드 내부 면에 인플레이스 표시 (M2 갱신, 모달 폐기). 마지막 1매 시점이면 Last One 골드 강조 동시 표시. **갤러리 / 캐러셀 갱신 = reveal 시점에만** (T19 결함 2 정정).
2.6. **상품 갤러리 자동 갱신**: 1매 등급은 딤드 + 복권 오버레이, 다수 등급은 게이지 + 적층.
2.7. 인벤토리 0매 도달 → 구매 씬 자동 복귀. 박스 deck 0 → 박스 종료 안내.

# 3. 조작

3.1. 터치 우선 (모바일 PWA).
3.2. 키보드 보조: Tab 이동, Enter 추첨/뜯기, Esc 모달 닫기.
3.3. 마우스는 데스크톱에서 터치와 동일 동작.
3.4. 뜯기 동작은 좌측 가장자리 드래그 임계값 (`02_data` 1.8 `PEEL_DRAG_THRESHOLD_RATIO`) 또는 카드 클릭(보조).

# 4. 화면 흐름 - 4탭 모델 (M2 재설계, 위→아래 우선순위)

화면 위쪽 우선순위 정책: 모바일에서 스크롤 부담 최소화하도록 핵심 정보를 위에서부터 7단 배치.

```
[추첨 탭] (기본)
  1. 헤더 (압축): 라인업 타이틀 + 가격 + 추정 배지 (1줄)
  2. 메인 캐러셀 (A~F, 1매 등급 6개): 가로 드래그.
     ├─ 중심 카드 = 큰 상품 이미지 + 등급 배지 + 1/1
     ├─ 좌우 미리보기 (peek)
     ├─ 뽑힌 등급 = 딤드 + 미니 복권 오버레이
     └─ 갓 뽑힌 등급 = 글로우 강조 (PEEL_REVEAL_VIEW_MS)
  3. 마이너 row (G~J, 다수 등급 4개): 가로 스크롤 1줄.
     ├─ 작은 상품 이미지 + 등급 배지
     ├─ 게이지 바 (drawn / total)
     └─ 카운트 (예: 17 / 24)
  4. Last One row: 1줄.
     ├─ 골드 테두리 + 작은 이미지 + 등급 배지 + 1/1
     └─ 박스 deck 잔여 1매 시점 펄스 발광
  5. 상품 갤러리 (디폴트 접힘): "▼ 자세히 보기" 토글.
     └─ 펼침 시 11종 모두 자세히 (1매 등급 / 다수 등급 + 종별 아코디언)
  6. 구매 / 통 선택 / 뜯기 공간 (M2.1 B-α 갱신):
     ├─ (a) 인벤토리 0매 + deck ≥ 1 → 구매 패널 (Quick 1/3/5/10 + 자유 입력 + "통에서 선택 건너뛰기" 체크박스)
     ├─ (b1) 인벤토리 ≥ 1 + 첫 ticket.lockedResult === null + skip OFF + pendingPeelResult 없음 → 통 선택 격자 (M2.1 B-α, 5.14)
     ├─ (b2) 인벤토리 ≥ 1 + pendingPeelResult 없음 + (skip ON 또는 첫 ticket.lockedResult 보유) → 뜯기 카드 (페이지플립 → 인플레이스 결과)
     ├─ (b3) 인벤토리 ≥ 1 + pendingPeelResult 존재 → reveal 진행 중 (페이지플립 카드 + 결과 표시 + 확인 버튼 대기)
     └─ (c) deck 0 → "박스 종료" 안내
  7. 기타 정보 (작게): 박스 ID / 회차 / 시드 / 미개봉 카운트 / skip 상태

[전적 탭] (M1 그대로 + 새 디자인 언어)
[Double Chance 탭] (M1 그대로 + 새 디자인 언어)
[설정 탭] (M1 그대로 + 새 디자인 언어 + M2.1 "통에서 선택 건너뛰기" 체크박스 추가)

[하단 탭 바] 4탭 SVG 아이콘 (추첨 / 전적 / DC / 설정, 02_data 1.10)

[모달 / 시트] (M2 갱신: 결과 / Last One 합산 모달 폐기. 인플레이스 처리)
  ├─ Double Chance 결과 모달 (DC 탭 전용)
  ├─ 박스 리셋 / 시드 변경 확인
  ├─ 첫 진입 면책
  ├─ localStorage 비활성 안내
  └─ 추정 출처
```

4.1. **첫 진입**: 면책 안내 → 추첨 탭 → 구매 씬.
4.2. **이후 진입**: 인벤토리 잔존 시 뜯기 씬, 0매면 구매 씬.
4.3. **탭 전환**: 하단 탭 클릭 → `state.currentTab` 갱신 → 본문만 다시 렌더.

# 5. 메커닉 상세

## 5.1. 박스 (Box)

5.1.1. 박스 1개는 SSOT 정의 등급별 매수 분포의 카드 모음.
5.1.2. 박스 매수(`BOX_SIZE`, 02_data 1.4.1)는 등급별 매수 합 (Last One 1매 포함).
5.1.3. 박스 ID는 시드 + 박스 회차로 결정. 동일 시드 + 동일 회차 → 동일 박스.
5.1.4. 박스 잔여 = 박스 매수 - 추첨 횟수. (deck 잔여 + Last One 미수령 여부와 별개로 사용자 표시는 5.1.4 정의)

## 5.2. 등급 (Tier)

5.2.1. 등급 = 라인업 정의 (A / B / C / ... / Last One).
5.2.2. 각 등급은 (라벨, 일본어, 한국어, 종 수, 매수, 사이즈, 자산 ID) 속성 (02_data 1.4.2 + 1.7).
5.2.3. 종 수 ≥ 2 등급(예: G등급 8종)은 추첨 시 종 인덱스를 별도 결정 (서브 추첨).
5.2.4. **등급 표기 정책**. 데이터 컬럼 / 라벨 / 코드 식별자는 영문 단독 (`A`, `B`, ..., `Last One`). 본문 자연어 설명은 한국어 음역 (`A등급`, `Last One 등급`). 일본어 원어 인용 시 `A賞` 형태.

## 5.3. 추첨 (Draw)

5.3.1. PRNG: 02_data 1.2 `PRNG_NAME`.
5.3.2. 박스 초기화 시: `BOX_SIZE - 1` 매(Last One 제외)의 등급 라벨 배열 셔플 (Fisher-Yates).
5.3.3. 추첨 1회 = 셔플된 배열의 `splice(pickIndex)`. 비복원 보장. **M2.1 갱신**: `pickIndex` 옵셔널. 미전달 또는 skip ON 시 `splice(0)` (= 현행 head pop 동작).
5.3.4. 등급 결정 후 종 수 ≥ 2 등급은 종 인덱스를 별도 PRNG 호출로 결정 (균등 분포).
5.3.5. 결과 = (등급, 종 인덱스, 상품명, 사이즈, 시각, pickIndex).
5.3.6. **M2: 추첨 트리거 = 사용자가 복권을 뜯는 시점** (5.10). 구매(5.9)는 추첨이 아니라 인벤토리 추가만.
5.3.7. **M2.1 (B-α): 추첨 결정 시점 분기**:
- (skip OFF) 통 선택(5.14)에서 사용자 N매 선택 후 **"확인" 버튼 클릭 시점** = `splice(deckIndex)` N회 연속 호출 = N개 결과 동시 결정. 결과는 인벤토리 ticket의 `lockedResult` 에 저장 (사용자에게 미공개). 페이지플립(5.10)은 결과 표시만 (drawOne 재호출 없음).
- (skip ON) 페이지플립(5.10) 시작 시점 = `splice(0)` 호출 = 결과 결정 (현행 M2 동일). lockedResult 미사용 (즉시 reveal).
- 슬롯 선택(5.14.4.2) 자체는 메모리 토글만 = 등급 결정 없음 (T19 결함 2 정정).
5.3.8. **결정론 보장**: 시드 + 박스 회차로 셔플 배열은 동일 결정. 사용자 슬롯 선택 순서 = drawOne 호출 순서 = 결과 매핑 + typeIndex 순서를 결정. 같은 시드 + 같은 슬롯 선택 순서 → 같은 결과 100% 재현. 박스 셔플 자체는 불변.

## 5.4. Last One 보너스

5.4.1. 박스 잔여가 1매가 된 시점 = 다음 추첨이 "마지막 추첨".
5.4.2. 마지막 추첨이 실행되는 순간 Last One 보너스 상품(02_data 1.4.2 Last One 행)이 자동 지급.
5.4.3. 결과 모달은 마지막 카드의 등급 + Last One 보너스를 동시 표시.
5.4.4. 시뮬레이터 내부 구현: 79매 셔플 + 마지막 1매 추첨 시 Last One 자동 지급. 박스 매수는 79 + Last One 1 = 80.
5.4.5. **M2: Last One 시각 강조** (5.11.3 갤러리 강조 + 5.12 디자인 언어).

## 5.5. Double Chance

5.5.1. 추첨 1회마다 Double Chance 응모권 1매 자동 누적.
5.5.2. 응모권 = (박스 ID, 추첨 회차, 시각).
5.5.3. Double Chance 추첨은 사용자 명시 트리거 (DC 탭).
5.5.4. 추첨 풀 = 누적 응모권. 일본 캠페인 당첨자 수는 02_data 1.4.3 (`DC_WINNERS_TOTAL`).
5.5.5. 시뮬레이터에서는 사용자 1인이므로 베르누이 단순화.
5.5.6. 당첨 확률 = `DC_WINNERS_TOTAL` / `DC_POOL_SIZE_DEFAULT` (02_data 1.3). 응모권 N매에 대해 1 - (1 - p)^N. UI에 단순화 가정 명시.

## 5.6. 추첨 이력

5.6.1. 모든 추첨 결과는 localStorage에 누적 (02_data 3.1 `kuji_history`).
5.6.2. 항목: 추첨 시각, 박스 ID, 등급, 종 인덱스, 상품명, Last One 동시 지급 여부.
5.6.3. 박스 리셋 시 이력 보존, 박스 ID만 새로 발급.

## 5.7. 시드 / 결정론

5.7.1. 박스 ID = `hash(seed, box_round)`. 같은 시드 + 같은 회차 → 같은 박스.
5.7.2. 시드는 사용자가 입력하거나 기본값 사용 (02_data 1.1 `DEFAULT_SEED_FALLBACK_BITS`).
5.7.3. 시드 변경 시 박스 진행 중이면 확인 모달.
5.7.4. 박스 리셋 시 `box_round` += 1. 시드 변경 시 `box_round`는 `BOX_ROUND_INITIAL` 리셋.

## 5.8. 신뢰도 표시 ("추정" 배지)

5.8.1. 라인업 데이터의 `box_size_estimated:true` 또는 `count_estimated:true` 항목은 UI에 "추정" 배지 표시.
5.8.2. 배지 클릭 시 출처 URL 일람 모달 표시 (02_data 1.4.4).
5.8.3. 배지 색은 02_data 2.2 `COLOR_BADGE_ESTIMATED` (M2 골드 톤).

## 5.9. 구매 (Buy) - M2 신설

5.9.1. 박스 deck 잔여 ≥ 1 시 구매 가능.
5.9.2. 구매 매수 옵션:
- Quick 버튼: 02_data 1.6 `BUY_QUICK_OPTIONS` (= [1, 3, 5, 10]).
- 자유 입력: `BUY_FREE_INPUT_MIN` (= 1) ~ (박스 deck 잔여 - 누적 인벤토리) 매수 사이 정수.
5.9.3. **(누적 인벤토리 + 신규 구매 매수) ≤ 박스 deck 잔여** invariant. 부족 시 buy 비활성 + 안내. 통 선택 격자 잔여 슬롯 ≥ 인벤토리 보장의 근거 (5.14, 7.12).
5.9.4. 가격 = `구매매수 × LINEUP_PRICE_JPY` 화면 표시.
5.9.5. 구매 완료 = 인벤토리(`unopenedTickets`)에 미개봉 복권 N매 추가.
5.9.6. 미개봉 복권 항목 = `Ticket = { id, purchasedAt }`. 구매 시점만 기록. 등급은 미결정 (5.10 뜯기 시점에 결정).
5.9.7. 구매 자체는 deck 변화 없음. deck shift는 5.10 뜯기에서만 발생.

## 5.10. 뜯기 (Peel) - M2 신설 + M2.1 B-α 갱신

5.10.1. 인벤토리에 미개봉 복권 1매 이상 + **첫 ticket의 lockedResult 보유 (또는 skip ON)** 시 뜯기 가능. skip OFF + 첫 ticket의 lockedResult === null (= raw) 상태에서는 뜯기 패널 미표시 (4장 화면 흐름 6.b1 격자 진입).
5.10.2. 뜯기 동작:
- (a) **모바일**: 좌측 가장자리 드래그. 임계값 = 카드 폭 × `PEEL_DRAG_THRESHOLD_RATIO` (02_data 1.8 = 0.30).
- (b) **데스크톱 / 보조**: 카드 클릭 또는 Enter.
5.10.3. 뜯기 애니메이션 (research/05_kuji_ticket_form.md 모사):
- 카드 비율 `CARD_ASPECT_RATIO` (02_data 1.9 = "5.5 / 4").
- 외부 면 → 내부 면 페이지 컬 또는 `rotateY` 페이지 플립.
- duration: `PEEL_DURATION_MS` (02_data 1.8 = 700).
- 50% 시점 햅틱: `navigator.vibrate(PEEL_HAPTIC_HALF_MS)` (02_data 1.8). 완료 시점 햅틱: `navigator.vibrate(PEEL_HAPTIC_FULL_MS)`. 가능 시.
5.10.4. 뜯기 시점:
- **(skip OFF, B-α)**: 결과는 첫 ticket의 `lockedResult` 사용 (drawOne 재호출 없음. 5.14.4 확인 시점에 이미 결정됨). 페이지플립 reveal 시점에 history append + 갤러리 갱신.
- **(skip ON)**: `core/draw.drawOne(boxState, drawRng, LINEUP)` 호출 (`pickIndex` 미전달 → `splice(0)`). 페이지플립 시작 시점 = drawOne 호출 시점. 즉시 history append + 갤러리 갱신.
결과는 **페이지플립 카드 내부 면에 직접 표시** (등급 + 상품). **모달 없음** (M2 재설계). 카드는 `PEEL_REVEAL_VIEW_MS` (02_data 1.9) 후 fade out. 동시에 4장 영역 2/3/4 (메인 캐러셀 / 마이너 row / Last One row) 중 해당 등급 위치에 인플레이스 시각 반영 (글로우 + 카운트 +1 + 미니 복권 오버레이). **갱신 트리거 = reveal 시점 history append** (T19 결함 2 정정. 슬롯 선택 / 확인 시점에는 갱신 X).
5.10.5. 결과 = 등급 / 종 인덱스 / 상품 / Last One 트리거 (5.3, 5.4 동일).
5.10.6. 마지막 1매 (`isLastDraw(boxState)` true) 시점 뜯기 = 페이지플립 내부 면에 **마지막 카드 + Last One 동시** 표시 (골드 톤 + 큰 글자). 동시에 Last One row 골드 펄스 강조. 모달 없음.
5.10.7. 뜯어진 복권은 인벤토리에서 제거. 동시에 추첨 이력 + DC 응모권 1매 누적.
5.10.8. 인벤토리 0매 도달 → 구매 씬 자동 복귀.
5.10.9. **결과 등장 모션 (M2 + K-1 정정)**: 결과 reveal 시점에 등급 글자에 `0.5 → RESULT_POP_SCALE_PEAK → 1.0` 스케일 POP 애니메이션 (02_data 1.9 `RESULT_POP_SCALE_PEAK`). Last One 동시 reveal도 동일 적용. (M2 모달 폐기 정책 5.10.4 / 5.10.6 정합. "결과 모달" / "Last One 합산 모달" 표현은 폐기.)

## 5.11. 상품 표시 - M2 재설계 (위→아래 우선순위)

5.11.1. **화면 위쪽 우선순위 정책**: 사용자가 모바일에서 스크롤 부담 최소화하도록 핵심 정보를 위에서부터 4단 배치 (4장 영역 2/3/4/5).

5.11.2. **메인 캐러셀** (4장 영역 2, A~F 1매 등급 6개):
- 가로 드래그 캐러셀 (CSS scroll-snap 또는 swipe).
- 중심 카드 = 큰 상품 이미지 + 등급 배지 + 잔여 (1/1).
- 좌우 미리보기 peek (`HERO_CAROUSEL_VISIBLE_PEEK_PX`, 02_data 1.9).
- 뽑힌 등급 = 이미지 딤드 (`COLOR_TICKET_DIM_RGBA`) + 미니 복권 오버레이 1장.
- 갓 뽑힌 등급 = 글로우 강조 일정 시간 (`PEEL_REVEAL_VIEW_MS`).

5.11.3. **마이너 row** (4장 영역 3, G~J 다수 등급 4개):
- 한 줄 가로 스크롤. 4개 등급 압축.
- 항목 = 작은 상품 이미지 + 등급 배지 + 게이지 바 + 카운트 (예: 17 / 24).

5.11.4. **Last One row** (4장 영역 4):
- 1줄. 골드 테두리 + 작은 이미지 + 등급 라벨 + 잔여 (1/1).
- 박스 deck 잔여 1매 시점에 펄스 발광 (5.12 디자인 언어).

5.11.5. **상품 갤러리 (디폴트 접힘)** (4장 영역 5):
- 헤더 토글 ("▼ 자세히 보기"). 디폴트 접힘.
- 펼침 시 11종 모두 자세히:
  - 1매 등급 (A~F + Last One 7종): 큰 이미지 + 딤드 + 오버레이 1장.
  - 다수 등급 (G/H/I/J 4종): 큰 이미지 + 게이지 + 종별 아코디언 (typeCount ≥ 2).

5.11.6. **갱신 결정론**: 갤러리 / 캐러셀 / row 모두 추첨 이력(`kuji_history`)을 박스 ID 필터링하여 도출. 다시 박스 진입해도 동일 갱신 상태.

## 5.12. 디자인 언어 - M2 신설

5.12.1. **테마**: Light. `COLOR_BG_PAPER` 베이지 배경 + `COLOR_INK_PRIMARY` 짙은 잉크 텍스트 (02_data 2.2).
5.12.2. **톤**: 일본 쿠지 매장의 종이 / 카드. 이찌방쿠지 브랜드 빨강(`COLOR_FRAME_RED`) + 골드 액센트(`COLOR_GOLD_EDGE`).
5.12.3. **타이포그래피** (02_data 1.11):
- 본문: Noto Sans KR.
- 일본어 라벨: Noto Serif JP.
- 등급 글자 / 굵은 표제: 산세리프 굵은체.
5.12.4. **카드 / 패널**: 둥근 모서리 + 경미한 그림자 + (P2) 종이 텍스처.
5.12.5. **아이콘**: SVG 자체 제작. 외부 lib 없음.
5.12.6. **모션 시간** (02_data 1.9): 뜯기 `PEEL_DURATION_MS` (1.8), 모달 슬라이드 `MODAL_SLIDE_DURATION_MS`, 게이지 갱신 `GAUGE_TRANSITION_DURATION_MS`.

## 5.13. SVG 자산 정책 - M2 신설

5.13.1. **상품 일러스트**: 단순 캐릭터 실루엣 / 색상 톤 / 사이즈 표기. 실물 사진 미사용 (라이선스 0).
5.13.2. **위치**: `src/assets/products/` 디렉토리에 SVG 모듈 또는 인라인 SVG.
5.13.3. **명명**: `<tier>-main` (메인) / `<tier>-<typeIndex>` (종별). 예: `A-main`, `G-3`. M2 1차 = 메인 11종 우선 + 종별 placeholder (02_data 1.7).
5.13.4. **탭 아이콘**: `src/assets/icons/` (4개: draw / history / dc / settings).
5.13.5. **복권 카드 디자인 (research/05_kuji_ticket_form.md 모사)**:
- 외부 면: `COLOR_TICKET_OUTER_BG` (브랜드 빨강) + IP 일러스트 + 좌측 떼기 가이드 ▶.
- 내부 면: `COLOR_TICKET_INNER_BG` (종이) + 큰 등급 글자 (카드 짧은변 50~60% 크기) + 상품명 / 사이즈.

## 5.14. 통 선택 (Pick from Bin) - M2.1 신설 + B-α 재정정 (단계 5 T19 결함 정정)

매장 추첨함(クジ箱)에서 직접 N매를 모두 골라 손에 든 다음 한 장씩 뜯는 체험. 사용자 선택 = 셔플 배열 인덱스 매핑. 5.7 시드 결정론은 그대로 유지.

### 5.14.0. 메커닉 모델 (B-α)

5.14.0.1. **선택 단위**: N매 통째 (구매 매수 N개 슬롯 모두 선택 후 "확인" 버튼 = 1회 확정). 단계 1 plan의 (a) "1매당 1번"은 폐기 (단계 5 T19 사용자 시각 컨펌에서 매장 경험과 어긋남 발견).
5.14.0.2. **인벤토리 ticket 모델**: 구매 직후 인벤토리에 N매 raw ticket 추가 (`lockedResult: null` = 등급 미결정). "확인" 시 N매 모두 `lockedResult` 부여 (각 ticket에 등급/종/사이즈/lastOnePrize 등 결과 정보 포함). 사용자에게는 reveal 전까지 미공개.
5.14.0.3. **결과 시각 분리** (T19 결함 2 정정): 슬롯 선택 / "확인" 시점에 등급은 결정되지만 사용자에게는 미공개. 갤러리 / 캐러셀 / 마이너 row / Last One row 갱신은 reveal 시점에만 (history는 reveal 시점에만 append. revealed 필드는 deprecated).
5.14.0.4. **drawOne 호출 시점**: "확인" 버튼 클릭 = `core/draw.drawOne(boxState, drawRng, LINEUP, deckIndex)` N회 연속 호출 (사용자 슬롯 선택 순서대로). 각 호출이 deck splice + lockedResult 결정.
5.14.0.5. **pendingPickResult 폐기**: M2.1 1차 설계의 `pendingPickResult` 메모리 변수는 폐기. ticket.lockedResult 로 통합. (state 객체에서도 제거.)

### 5.14.1. 진입 조건 (B-α)

5.14.1.1. 인벤토리 ≥ 1매 + **인벤토리 첫 ticket의 `lockedResult === null`** (= raw ticket 존재 = 통 선택 미완료).
5.14.1.2. `kuji_settings_skip_pick` (= 02_data 3.1, 기본 `BUY_SKIP_PICK_DEFAULT` = false) **OFF**.
5.14.1.3. `pendingPeelResult` 부재 (reveal 진행 중 아님).
5.14.1.4. 위 조건 만족 시 4장 화면 흐름 6.b1 영역에 통 선택 격자 패널 표시.

### 5.14.2. 격자 레이아웃

5.14.2.1. 격자 차원: `cols × rows`. `cols = LINEUP.gridCols ?? PICK_GRID_COLS_DEFAULT` (02_data 1.12, 기본 10). `rows = Math.ceil(BOX_SIZE / cols)`. 드래곤볼 80 = 10×8 (일반 슬롯 79 + Last One 슬롯 1).
5.14.2.2. **슬롯 수 = `BOX_SIZE`**. 내부 구성:
- **일반 슬롯**: `BOX_SIZE - 1` 개 (드래곤볼 79). 셔플 배열 인덱스 0 ~ `BOX_SIZE - 2` 와 1:1 매핑. 사용자 클릭 가능.
- **Last One 슬롯**: 1개. 셔플 배열에 포함되지 않음 (5.3.2 / 5.4.4 정합). 사용자 클릭 불가 (5.14.3.5). 마지막 일반 슬롯 "확인" 시 5.4 자동 지급 흐름과 연동 (5.14.4.5).
5.14.2.3. 슬롯 최소 터치 타깃 = `PICK_SLOT_MIN_TAP_PX` (= 24px). 화면 폭이 부족하면 `cols`를 `PICK_GRID_COLS_MIN` (= 4) 까지 자동 축소.
5.14.2.4. 슬롯 간 간격 = `PICK_SLOT_GAP_PX` (= 4px).
5.14.2.5. **Last One 슬롯 위치**: 격자 마지막 셀 (gridIndex = `BOX_SIZE - 1`). 일반 슬롯 79개를 인덱스 순으로 배치 후 Last One 슬롯이 마지막 위치.

### 5.14.3. 슬롯 상태 (B-α 5상태 + Last One 2상태)

5.14.3.1. **잔여 미선택** (`normal-available`): 활성. 클릭 가능 (선택 토글). 배경 `COLOR_PICK_SLOT_BG` + 테두리 `COLOR_PICK_SLOT_BORDER` (골드).
5.14.3.2. **잔여 선택됨** (`normal-selected`): 활성. 클릭 가능 (선택 해제 토글). 배경 `COLOR_PICK_SLOT_SELECTED_BG` + 테두리 `COLOR_PICK_SLOT_SELECTED_BORDER` + 체크 마크 또는 펄스 강조.
5.14.3.3. **뽑힘** (`normal-drawn`): 비활성. 이전 사이클의 lockedResult ticket이 인벤토리에 있거나 reveal 완료된 슬롯. 배경 `COLOR_PICK_SLOT_EMPTY_BG` + 테두리 `COLOR_PICK_SLOT_EMPTY_BORDER` (약한 잉크). 클릭 무시.
5.14.3.4. 슬롯 시각 모티프: 작은 복권 모양 (브랜드 빨강 점) 또는 골드 점. 선택 시 모티프 + 체크 마크.
5.14.3.5. **Last One 슬롯 대기** (`last-one-pending`): 비활성. 배경 `COLOR_PICK_SLOT_BG` + 테두리 `COLOR_GOLD_EDGE` 강조. 라벨 = "L1" (등급 표기 정책 5.2.4 영문 단독). 호버 안내 toast "마지막 일반 슬롯 뽑힐 때 자동 지급".
5.14.3.6. **Last One 슬롯 지급 완료** (`last-one-drawn`): 비활성. 회색.

### 5.14.4. 인터랙션 (B-α)

5.14.4.1. **호버**: 일반 슬롯 (미선택)이 `PICK_SLOT_HOVER_LIFT_PX` (= 4px) 부상 + `PICK_SLOT_HOVER_GLOW_PX` (= 12px) 글로우 (색상 `COLOR_PICK_SLOT_HOVER_GLOW`). 데스크톱 마우스 hover, 모바일은 hover 미지원. Last One 슬롯은 호버 시 5.14.3.5 안내 toast.
5.14.4.2. **클릭 / 탭 (잔여 일반 슬롯)**: 선택 / 해제 토글 (메모리 전용. deck splice 없음. drawOne 호출 없음. history 미커밋). 같은 슬롯 재클릭 = 해제. 다른 슬롯 클릭 = 추가 선택.
5.14.4.3. **선택 카운트 헤더**: 격자 패널 상단에 "선택 K / N" 표시. K = 현재 선택된 슬롯 수, N = 인벤토리 raw ticket 수 (= 사용자가 골라야 할 매수).
5.14.4.4. **"확인" 버튼**: K === N 시 활성. 클릭 시:
- 사용자 슬롯 선택 순서대로 `core/draw.drawOne(boxState, drawRng, LINEUP, deckIndex)` N회 연속 호출. 각 호출 전 격자 위치 → 잔여 deck 인덱스 변환 (5.14.2.2 매핑 + 03_architecture 3.14 알고리즘. 단 N개 동시 변환 시 매 호출마다 splice로 잔여 deck이 줄어드는 것을 반영하여 변환).
- N개 결과를 인벤토리의 raw ticket N매에 `lockedResult` 순차 부여 (사용자 선택 순서 그대로 ticket 인덱스 0 ~ N-1).
- **history 미커밋** (T19 결함 2 정정): 결과는 ticket.lockedResult에만 저장. history는 reveal 시점에만 append.
- 격자 패널 닫힘 → peel 패널 자동 진입 (4장 6.b2 분기).
5.14.4.5. **마지막 일반 슬롯 선택 + 확인 시 Last One 자동 지급 (5.4 연동, C-R4-2 정정)**: 사용자 N개 선택에 마지막 일반 슬롯이 포함되어 있고 확인 시점 splice가 deck.length === 1 도달 = isLastOne true → 그 ticket의 lockedResult에 `lastOnePrize` 첨부 (5.10 뜯기 시 카드 내부 면에 동시 표시). 격자의 Last One 슬롯 시각 처리: **격자는 확인 클릭 시점에 닫힘** (5.14.4.4) → 다음 사이클(예: 박스 리셋 후 또는 추가 구매 후)에 다시 격자 진입 시 history의 lastOne 동시 지급 항목이 reveal 완료된 상태(`isLastOne: true`이면서 history append 완료) 기준으로 Last One 슬롯이 `last-one-drawn` 상태로 렌더. 즉 시각 분리(5.14.0.3) 정합 = 갤러리 / 캐러셀과 동일하게 Last One 슬롯도 reveal 후에만 회색.
5.14.4.6. **영속 정책 (T19 결함 2 정정)**: 슬롯 선택 상태 = 메모리 전용. 확인 클릭 시점 = `boxState.deck` splice + `unopenedTickets[i].lockedResult` 부여 + 영속(`kuji_box_state` / `kuji_unopened_tickets`). history는 reveal 시점에 append.
5.14.4.7. **결정론**: 같은 시드 + 같은 박스 회차 + 같은 슬롯 선택 순서 → 같은 결과 100% 재현 (drawOne N회의 호출 순서가 결과 순서 + typeIndex 결정).

5.14.4.8. **자동 선택 (B-α 보강)**: 격자 패널 하단 "확인" 버튼 옆에 "자동 선택 N매" 버튼.
- N = `rawCount` (인벤토리 raw ticket 수, 5.14.4.4 정의).
- 클릭 동작:
  - 기존 `state.selectedGridIndices` 모두 초기화.
  - 잔여 일반 슬롯 (drawnSet ∪ Last One 제외) 중 **격자 인덱스 오름차순 첫 N개**를 selected로 설정.
  - 시각: 즉시 일괄 selected (펄스 시작).
- 자동 선택 후 사용자가 슬롯 클릭으로 자유 변경 가능 (해제 + 다른 슬롯 선택).
- 비활성 조건: `rawCount === 0` 또는 잔여 일반 슬롯 < N (정상 흐름에서 발생 불가, invariant 5.9.3).
- 결정론 영향 없음: 자동 선택은 메모리 토글만. PRNG 호출 X. drawOne 호출 X. "확인" 클릭 시점에 5.14.4.4 흐름으로 진입.
- skip ON과의 차이: 격자 표시 유지 + 사용자가 변경 가능 vs skip ON은 격자 미진입.

### 5.14.5. 반복 / 사이클

5.14.5.0. **"통 선택 완료" 정의 (B-α 재정의, C-N1 / O-3 정정 잔존 정합)**: 인벤토리의 raw ticket (`lockedResult === null`) 수 == 0 = "통 선택 완료" (다음 단계 = 뜯기). raw ticket 수 > 0 = "통 선택 미완료" (격자 표시). 5.10.1 / 4장 6.b2 진입 조건 = "skip ON 또는 첫 ticket의 lockedResult 보유" (양쪽 모두 pendingPeelResult 부재 전제). reveal 진행 중 (pendingPeelResult 존재) = 4장 6.b3 분기.
5.14.5.1. 확인 클릭 → 인벤토리 N매 모두 lockedResult 부여 → 즉시 peel 단계 진입 (4장 6.b2). 사용자가 한 장씩 뜯기.
5.14.5.2. peel 1매 reveal 확인 완료 → 인벤토리에서 1매 제거 + history append (revealed 필드 미사용) → 다음 ticket이 lockedResult 보유 → b2 분기 유지 (격자 미진입).
5.14.5.3. 인벤토리 0 도달 → 구매 씬 자동 복귀.
5.14.5.4. 다시 N매 구매 → 인벤토리 N매 raw → b1 분기 (격자 진입). 새 사이클 시작.

### 5.14.6. skip 토글

5.14.6.1. **위치**: 구매 패널 + 설정 탭 양쪽. 양방향 동기화.
5.14.6.2. **영속**: localStorage `kuji_settings_skip_pick` (02_data 3.1).
5.14.6.3. **기본값**: `BUY_SKIP_PICK_DEFAULT` (= false, 통 선택 ON).
5.14.6.4. **토글 시점 적용**: 다음 구매 사이클부터. 현재 사이클의 격자 표시 / peel 진행 중에는 영향 없음 (단 5.14.6.5 예외).
5.14.6.5. **OFF → ON 전환 + 인벤토리 ≥ 1 raw (격자 표시 중)**: 사용자가 일부 슬롯 선택 중이라도 격자 즉시 닫힘. **drawOne N회 호출 = `splice(0)` 반복** (= skip ON 흐름. 사용자 선택 폐기) → 인벤토리 raw N매에 lockedResult 일괄 부여 → peel 단계 자동 진입.
5.14.6.6. **ON → OFF 전환 + 인벤토리 ≥ 1 raw**: 즉시 격자 표시 (b1 분기). 단 인벤토리에 lockedResult 보유 ticket이 있으면 그 ticket 우선 reveal (b2). 모두 reveal 후 raw가 남으면 격자.

### 5.14.7. 첫 진입 안내

5.14.7.1. `kuji_meta` 에 `pickHintSeen` 플래그 추가. 최초 통 선택 격자 진입 시 1회 toast 표시.
5.14.7.2. 문구 = `PICK_FIRST_HINT_TEXT_KO` (02_data 1.12). B-α 재정정으로 문구 갱신: "N매 모두 골라 확인 버튼을 눌러주세요. 결과는 시드와 슬롯 선택 순서로 결정됩니다." (사행성 표현 0건).
5.14.7.3. 표시 시간 = `PICK_FIRST_HINT_DURATION_MS` (= 4000ms). 사용자 탭 시 즉시 닫힘.

# 6. 사용자 시나리오 (M2 + M2.1 갱신)

6.1. **첫 진입**: 면책 안내 → 추첨 탭 → 구매 씬 (인벤토리 0매) → 박스 카드 + 갤러리 (모두 미뽑힘) + 구매 패널 (skip 체크박스 OFF 기본).
6.2. **첫 구매 + 첫 통 선택 + 첫 뜯기 (skip OFF, 기본 흐름, B-α)**: Quick 1매 → 가격 790엔 표시 → 구매 → 인벤토리 1매 raw → 통 선택 격자 자동 표시 (10×8 슬롯) + "선택 0/1" 헤더 + 첫 진입 안내 toast → 슬롯 1개 클릭 (selected 상태) + "선택 1/1" → "확인" 버튼 활성 → 클릭 → drawOne 1회 호출 + ticket lockedResult 부여 + 격자 종료 → 페이지플립 카드 표시 (외부 면, 등급 미공개) → 좌측 드래그 / 클릭 → 페리페리 reveal → 등급 / 상품 인플레이스 표시 + 갤러리 갱신 (이 시점에 첫 갤러리 변화) → 확인 버튼 → 인벤토리 0매 → 구매 씬 복귀.
6.3. **5매 통째 선택 (skip OFF)**: Quick 5매 → 인벤토리 5매 raw → 격자 표시 + "선택 0/5" 헤더 → 사용자가 슬롯 5개 클릭 (예: gridIndex 17, 3, 50, 22, 8) + "선택 5/5" → 확인 → drawOne 5회 연속 호출 + ticket 5매 lockedResult 부여 (선택 순서 그대로) + 격자 종료 → 페이지플립 패널 진입 → 카드 1장씩 reveal → 5번째 reveal 후 인벤토리 0매 → 구매 씬 복귀. 갤러리는 매 reveal마다 1매씩 갱신.
6.4. **skip ON 흐름**: 구매 패널에서 "통에서 선택 건너뛰기" 체크 → Quick 10매 → 인벤토리 10매 raw (lockedResult 즉시 미부여 - skip ON에서는 lockedResult 미사용) → 통 선택 격자 미표시, 페이지플립 카드 곧바로 표시 → 좌측 드래그 / 클릭 = drawOne(splice(0)) 즉시 호출 → 인플레이스 표시 → 확인 → 다음 (M2 흐름과 동일).
6.5. **80매 풀 추첨**: 사용자가 5매씩 16회 또는 1매 80회 등 자유. 사용자 선택의 마지막 일반 슬롯 splice 시점에 isLastOne true → 그 ticket의 lockedResult에 lastOnePrize 첨부 → reveal 시 페이지플립 카드에 마지막 카드 + 大猿悟空 SOFVICS 동시 인플레이스 표시. 격자의 Last One 슬롯도 reveal 시점에 회색화.
6.6. **결정론 검증 (skip ON)**: 시드 메모 → 80매 뜯기 → 동일 시드 다시 입력 (`box_round` `BOX_ROUND_INITIAL` 리셋, 5.7.4) → 첫 박스 추첨 순서 동일 재현.
6.6.b. **결정론 검증 (skip OFF B-α)**: 시드 + 사용자 슬롯 선택 순서 (전체 80매에 걸친 누적 순서) 메모 → 80매 뜯기 → 동일 시드 다시 입력 → 동일 슬롯 선택 순서 재현 → 동일 결과 100% 재현. 시드는 박스 셔플을 결정, 사용자 슬롯 선택 순서는 drawOne 호출 순서 = 결과 매핑 + typeIndex 순서를 결정.
6.7. **skip 토글 라이브 전환 (B-α)**: 구매 패널에서 skip OFF 상태 + 5매 raw 인벤토리 + 격자 표시 (선택 일부 진행 중) → skip ON 토글 → 사용자 선택 폐기 + drawOne 5회 = splice(0) 일괄 호출 + 인벤토리 lockedResult 일괄 부여 + 격자 종료 → 페이지플립 패널 진입 (5.14.6.5). 다시 OFF 토글: 다음 구매 사이클부터 격자 표시 (5.14.6.6).
6.8. **DC 추첨**: DC 탭 → 응모권 80매 → 추첨 → 베르누이 결과.
6.9. **박스 리셋**: 설정 탭 → 박스 리셋 → 확인 → `box_round` += 1, 잔여 80매 복원, 추첨 이력 보존, 인벤토리 / lockedResult 폐기. 통 선택 격자 80슬롯 활성으로 재표시.

# 7. 엣지 케이스 (M2 + M2.1 갱신)

7.1. 박스 deck 0에서 구매 시도 → buy 버튼 비활성 + "박스 종료, 박스 리셋 안내" 텍스트.
7.2. 인벤토리 0매에서 뜯기 패널 / 통 선택 패널 진입 시도 → 자동 구매 씬 표시.
7.3. 자유 입력 매수 > deck 잔여 → 입력 검증 + buy 비활성.
7.4. 자유 입력 매수 ≤ 0 또는 비정수 → 입력 검증.
7.5. 뜯기 도중 새로고침 → 인벤토리 영속(`kuji_unopened_tickets`). 미뜯힌 복권 그대로 복원.
7.6. DC 응모권 0에서 추첨 비활성.
7.7. 시드 변경 + 박스 진행 중 → 확인 모달.
7.8. localStorage 비활성 → 메모리 모드 fallback + 4장 시트 안내. **M2.1 추가**: skip 설정도 메모리 모드 fallback (세션 한정 적용).
7.9. 라인업 등급별 매수 합 ≠ `BOX_SIZE` → 부팅 실패 (02_data 1.4.2.1).
7.10. 뜯기 애니메이션 도중 사용자가 탭 전환 → 결과 영속 보장. M2.1 B-α: skip OFF는 "확인" 버튼 시점 (drawOne N회 + lockedResult 부여 + 영속). skip ON은 페이지플립 시작 시점 (drawOne 1회 + 즉시 reveal).
7.11. **M2.1 B-α: 통 선택 격자 표시 중 새로고침** → 사용자 슬롯 선택 상태 폐기 (메모리 전용). 인벤토리 raw ticket 그대로 영속됨 (lockedResult: null) → 새로고침 후 격자 다시 표시. 사용자 처음부터 다시 선택.
7.11.b. **M2.1 B-α: "확인" 클릭 후 reveal 전 새로고침** → ticket.lockedResult 영속 → 새로고침 시 b2 분기 진입 (페이지플립 카드 표시). 사용자 reveal 진행. 박스 deck splice + lockedResult 영속이 함께 일어나므로 결정론 / 박스 상태 정합 안전.
7.12. **M2.1: 통 선택 격자에서 잔여 슬롯이 인벤토리보다 적은 경우** (예: deck 잔여 3 + 인벤토리 raw 5) → 시뮬레이터 부팅 실패 또는 인벤토리 자동 정리. 정상 흐름에서 발생 불가 (구매 검증 5.9.3 invariant). 발생 시 storage corruption → 마이그레이션 처리.
7.13. **M2.1 B-α: skip 토글 + 격자 표시 중** → 5.14.6.5 분기 (사용자 선택 폐기 + splice(0) N회 + lockedResult 일괄 + peel 진입). reveal 진행 중 (pendingPeelResult) 토글은 다음 사이클에 적용.
7.14. **M2.1 B-α: 격자에서 사용자가 선택을 N개보다 적게 한 상태에서 다른 액션** (탭 전환 / 박스 리셋 / 시드 변경) → 사용자 선택 메모리 폐기. 박스 리셋 / 시드 변경은 인벤토리도 폐기. 탭 전환은 인벤토리 raw 보존, 다시 격자 진입 시 처음부터 선택.

# 8. 변경 이력

8.1. 2026-05-02: M1 단계 2 design 작성. placeholder 교체. 一番くじ ドラゴンボール 라인업 SSOT 도입.
8.2. 2026-05-02: 단계 3 design_review 1차 검증 결과 반영 (M1, M2, M3, M4, C2).
8.3. 2026-05-02: 단계 3 design_review 2차 검증 결과 반영 (C2-R2-2).
8.4. 2026-05-02: M2 단계 2 design. 4탭 모델 재구성 (구매 / 뜯기 sub-screen) + 5.9 구매 / 5.10 뜯기 / 5.11 갤러리 / 5.12 디자인 언어 / 5.13 SVG 자산 정책 신설. 6장 시나리오 6.1~6.7 갱신. 7장 엣지 7.5 / 7.10 신설. `research/05_kuji_ticket_form.md` 폼 조사 결과 반영.
8.5. 2026-05-02: M2 단계 3 1차 검증 결과 반영. D-1 `PEEL_HAPTIC_DURATIONS_MS[i]` → `PEEL_HAPTIC_HALF_MS` / `PEEL_HAPTIC_FULL_MS` 분리 참조 (5.10.3). D-2 `COLOR_TICKET_DIM` → `COLOR_TICKET_DIM_RGBA` 정정 (5.11.2). D-3 5.4.5 "5.11.4 갤러리" → "5.11.3 갤러리 강조" 절번호 정정.
8.6. 2026-05-02: M2 단계 3 2차 검증 결과 반영 (사용자 (c) 옵션 자체 정정). D-1-R2 5.12.6 `MODAL_SLIDE_DURATION_MS` 키명 참조. D-2-R2 5.12.6 `GAUGE_TRANSITION_DURATION_MS` 키명 참조. M-1-R2 5.10.9 결과 등장 모션 신설 (`RESULT_POP_SCALE_PEAK` 적용).
8.7. 2026-05-03: **M2.1 단계 2 design**. 1장 한 줄 + 2장 코어 루프(2.3 통 선택 씬 신설 / 2.7 인벤토리 0 복귀 절번호 시프트) / 4장 화면 흐름(6번 영역 b1/b2 분기 + 7번 skip 상태 추가 + 설정 탭 체크박스 추가) / 5.3.3 `splice(pickIndex)` 갱신 / 5.3.5 결과에 pickIndex 추가 / 5.3.7 추첨 결정 시점 분기 신설 / 5.3.8 결정론 보장 신설 / 5.10.1 진입 조건 갱신 / 5.10.4 drawOne 시그니처 + pendingPickResult 갱신 / **5.14 통 선택 (Pick from Bin) 신설** (5.14.1 진입 조건 ~ 5.14.7 첫 진입 안내) / 6장 시나리오 6.2~6.4/6.6.b/6.7 갱신 / 7.8/7.10 갱신 + 7.11/7.12/7.13 신설.
8.8. 2026-05-03: **M2.1 단계 3 design_review 정정 사이클 (1차)**. C-1 (5.14.2.1/2.2/2.5 슬롯 80 = 일반 79 + Last One 1, 셔플 배열 인덱스 매핑 명확화 + 5.14.3.4 Last One 슬롯 비활성 + 5.14.4.5 마지막 일반 슬롯 클릭 시 Last One 동시 지급) / C-2 (4장 6.b1/6.b2/6.b3 분기에 `pendingPeelResult` 조건 추가) / C-3 (5.9.2 BUY_QUICK_OPTIONS [1,3,10] → [1,3,5,10] 정정) / O-1 (5.14.4.2/4.6 즉시 history 커밋 정책 + `revealed: boolean` 필드 + 7.11 새로고침 복원 흐름 명확화) / O-2 (5.14.6.5 OFF→ON 전환 시 drawOne 호출 시점 = 사용자 뜯기 액션 시점 명시) / O-3 (5.14.5.0 "통 선택 완료" 정의 추가) / K-1 (5.10.9 "결과 모달" → "결과 reveal" 정정, M2 모달 폐기 정책 정합) / I-1 (5.9.3 "(누적 인벤토리 + 신규 구매 매수) ≤ 박스 deck 잔여" invariant 명확화).
8.9. 2026-05-03: **M2.1 단계 3 design_review 정정 사이클 (2차, 사용자 한도 초과 명시 승인)**. C-N1 ("통 선택 완료" 용어 의미 통일 - 옵션 A 채택: `pendingPickResult` 존재 상태 = 통 선택 완료). 5.14.5.0 본문 재기술 (정의 + 5.10.1 / 4장 6.b2 진입 조건 매핑 정합). C-N2 (5.14.5.0 마지막 줄 b2 ↔ b3 혼동 표현 정정) 자동 동시 해소.
8.10. 2026-05-03: **M2.1 단계 5 T19 결함 정정 → 단계 2 design B-α 재정정 (사용자 명시 승인)**. 결함 1 (메커닉 단위, 단계 1 plan 권장 오류): 선택 단위 (a) "1매당 1번" → (b) "N매 통째" (B-α: 확인 버튼). 결함 2 (시각 노출): 슬롯 클릭 시점 history 즉시 커밋이 갤러리 즉시 노출 유발. 정정: history 커밋을 reveal 시점으로 이동. 5.14 절 전면 재작성 (5.14.0 메커닉 모델 신설 + 5.14.1~5.14.7 B-α 재기술 + pendingPickResult 폐기 + ticket.lockedResult 통합) / 5.3.7 / 5.3.8 / 5.10.1 / 5.10.4 / 4장 6.b1/b2/b3 분기 갱신 / 1장 한 줄 / 2장 코어 루프 갱신 / 6장 시나리오 6.2/6.3/6.5/6.6.b/6.7 갱신 / 7.10/7.11/7.13 갱신 + 7.11.b/7.14 신설.
8.11. 2026-05-03: **M2.1 단계 3 round 4 검증 결함 정정 (자동 재시도 1회)**. C-R4-1 (5.14.7.2 spec 본문 vs 02_data 1.12 PICK_FIRST_HINT_TEXT_KO 값 일치 - 02_data + src/data/numbers.js 동시 갱신). C-R4-2 (5.14.4.5 Last One 슬롯 회색화 시점 - 격자 닫힘 시점 후 다음 사이클 격자 재진입 시 시각 분리 정합 명확화). M-R4-1 (02_data 3.2.4 신설 - 기존 v3 사용자의 unopenedTickets[*].lockedResult in-place backfill 정책 추가, schemaVersion bump 없음).
8.12. 2026-05-03: **M2.1 B-α 보강 - 자동 선택 버튼 (사용자 명시 승인)**. 5.14.4.8 신설 = 격자 패널 하단 "자동 선택 N매" 버튼 (잔여 일반 슬롯 중 격자 인덱스 오름차순 첫 N개를 selected로 일괄 설정. 메모리 토글만. PRNG / drawOne 호출 0. 결정론 영향 0). 사용자가 자동 선택 후 변경 가능. skip ON과의 차이 명시.
