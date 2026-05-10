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

# 4. 화면 흐름 - 4탭 모델 (M4.1 환원, 위→아래 우선순위) + **홈 = 탭 1 (M4.1 격상)**

화면 위쪽 우선순위 정책: 모바일에서 스크롤 부담 최소화하도록 핵심 정보를 위에서부터 N단 배치.

**라우팅 모델 (M3.1 view 신설 / M4 view 격상 / M4.1 view 폐기 + activeTab 단일 라우팅)**: `state.activeTab ∈ STATE_TAB_VALUES` (= `{"home", "draw", "products_history", "settings"}`, 02_data 1.4.B). M4까지 `state.view ∈ {"home", "main"}`로 분리되어 있던 모델은 **M4.1에서 폐기**. 사용자 도메인 인식 정합("쿠지 매장 = 모든 화면이 동등 + 매번 홈에서 시작") + 발견성 강화 (하단 탭 = 1차 진입점 단일화).

**탭 모델 (M4.1 환원)**: 3탭 → **4탭 = 홈 / 추첨 / 갤러리+기록 (통합) / 설정**. M4의 3탭은 사용자 발화 "쿠지 종류 선택이 너무 어려워"로 발견성 결손 진단 → M4.1에서 홈을 1급 탭으로 환원. M3.5까지 4탭 (추첨 / 전적(기록) / DC / 설정)과는 의미 다름 (홈 vs DC 자리).

```
[홈 탭] (탭 1, M4.1 격상 - 5.13.B)
  1. 헤더 (공통): 활성 라인업 IP 라벨 (M3 잔존). 클릭 affordance 폐기 (M4.1, 5.13.A.3)
  2. 라인업 카드 그리드 (N개 카드, 모바일 1열 / 태블릿 2열). 사용자 도메인 = "쿠지 시리즈 선택"
     각 카드:
       ├─ home_hero 이미지 (assetsAvailable=false면 placeholder gray + IP 라벨)
       ├─ 한국어 제목 (titleKo)
       ├─ IP 라벨 + 발매일 + 끝일 + 가격/매수 + 매장 (메타 풍부화)
       ├─ 메인 상품 미리보기 슬롯 (tier_class=hero 1개 = A상, 5.13.B.4)
       ├─ 진행 상태: 박스 회차 / 추첨 누적 / DC 응모 누적 (M4 잔존)
       └─ "이 라인업으로 진입" 버튼 또는 카드 전체 클릭
  3. 푸터: schemaVersion + 빌드 메타

[추첨 탭] (탭 2, M4 = 탭 1 → M4.1 위치 변경)
  1. 헤더 (압축): 라인업 타이틀 + 가격 + 추정 배지 + **라인업 IP 라벨 (M3 신설, 5.13.A.3 "DRAGONBALL"/"ONE PIECE"/...). M3.1/M4 갱신: 클릭 = 홈 복귀 (5.13.B.5)** (1줄)
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

[갤러리+기록 탭] (탭 3, M4 신설 = M3.3 갤러리 그룹화 + M3.3 history 대시보드 + M2 history 리스트 + M1 DC 응모 통합)
  1. 상단: history 대시보드 (M3.3 자산 흡수). 4 카운터 카드 = 전체 / hero / main / goods.
  2. 중단: 상품 갤러리 (M3.3 product-gallery 흡수). hero / main / goods 섹션 + 카드. Last One = hero 마지막.
  3. 하단: history 리스트 (M2 자산 흡수). 시간순 추첨 이력 + 시간 / 등급 / 박스 ID.
  4. **DC 응모 영역 (M4 통합 - 단계 2 결정)**: DC 응모 카운터 + 응모 이력. M1~M3 잔존 별도 탭 → 본 탭 sub-section 흡수 또는 DC 모달만 잔존.

[설정 탭] (탭 4, M3.5까지의 자산 + M4 / M4.1 갱신)
  - "통에서 선택 건너뛰기" 체크박스 (M2.1 잔존)
  - **M4: 'Lineup' 섹션 dropdown 폐기** (사용자 결정 10.3 = 폐기). 라인업 전환은 홈 탭에서만.
  - **M4.1**: 설정 탭 "홈으로" 버튼 잔존 (M4 결정 답습). 클릭 = `dispatch({type: 'open_home'})` = activeTab = home (M4.1 의미 갱신).
  - 박스 리셋 / 시드 변경 / localStorage 비활성 안내 등

[하단 탭 바] **4탭 SVG 아이콘** (홈 / 추첨 / 갤러리+기록 / 설정, 02_data 1.10 갱신 의무 - 단계 5 T1)

[모달 / 시트] (M2 갱신: 결과 / Last One 합산 모달 폐기. 인플레이스 처리)
  ├─ Double Chance 결과 모달 (DC 탭 전용)
  ├─ 박스 리셋 / 시드 변경 확인
  ├─ 첫 진입 면책
  ├─ localStorage 비활성 안내
  └─ 추정 출처
```

4.1. **첫 진입 (M3.1 신설 / M4 / M4.1 / M4.2 갱신)**: 면책 안내 dismiss → `state.meta.disclaimerSeen = true` (M2 trigger 잔존) → **홈 탭 자동 활성** (= activeTab = home, 5.13.B). 사용자 라인업 카드 선택 → 추첨 탭으로 자동 전환 → 구매 씬. **M4.2 정정 (M4.1 P1-1 흡수, round 1 P1-1 재정정)**: M4 / M4.1 본문의 "homeAcked === false → 면책 모달" 표기는 M2 코드 trigger(`state.meta.disclaimerSeen`)와 정합 미달이라 정정. homeAcked는 본 dismiss 분기에서 갱신되지 않음 (M2 dismiss case는 disclaimerSeen만 갱신). homeAcked 의미는 5.13.B.3.3 박제 (라우팅 호환 키).
4.2. **이후 진입 (M4.1 / M4.2 갱신)**: 면책 모달 미노출 (`state.meta.disclaimerSeen === true`) → **홈 탭 자동 활성** (M4까지 = "마지막 라인업 main view 자동 진입" 폐기). 사용자가 마지막 진행하던 라인업으로 가려면 홈 카드 클릭. 인벤토리 잔존 시 추첨 탭에서 뜯기 씬, 0매면 구매 씬.
4.3. **탭 전환 (M4 / M4.1 갱신)**: 4탭 하단 탭 클릭 → `state.activeTab` 갱신 → 본문만 다시 렌더. 탭 enum = `{"home", "draw", "products_history", "settings"}` (M4의 3탭에서 home 추가, 02_data 1.4.B `STATE_TAB_VALUES` 정합). 영속 활성 탭 (`kuji_active_tab`)도 동기 갱신.
4.4. **홈 ↔ 본편 탭 전환 (M3.1 view 신설 / M4 / M4.1 view 폐기, 5.13.B.5)**: M4까지의 view 모델은 폐기. 진입 경로:
- 본편 → 홈: (a) 하단 탭 "홈" 클릭 (M4.1 1차 진입점) (b) 설정 탭 "홈으로" 버튼 (M4 잔존, 본 사이클 의미 = activeTab = home dispatch).
- 홈 → 본편: 라인업 카드 클릭 → `dispatch({type: 'enter_lineup', lineupId})` → state.currentLineupId 갱신 + state.activeTab = 'draw' (라인업 진입 = 추첨부터 도메인 정합).
- **M4 헤더 IP 라벨 클릭 affordance 폐기** (M4.1 결정 4.1.A): 헤더 = 라벨 표시 전용. 꺾쇠 아이콘 / 홈 복귀 호출처 폐기.
- 라인업 전환(다른 라인업 카드 클릭) 시 메모리 only state(`pendingPeelResult` / `selectedGridIndices`) 폐기 (5.13.A.4.4 정합).

# 5. 메커닉 상세

## 5.1. 박스 (Box)

5.1.1. 박스 1개는 SSOT 정의 등급별 매수 분포의 카드 모음.
5.1.2. 박스 매수(`lineup.boxSize`, 02_data 1.4.0 명세 / 1.4-DB.1 / 1.4-OP.1)는 등급별 매수 합 (Last One 1매 포함). **M3 갱신**: 단수 `BOX_SIZE` 글로벌은 폐기. 라인업별 동적 lookup.
5.1.3. 박스 ID는 라인업 + 시드 + 박스 회차로 결정. **M3 갱신**: 라인업 격리(5.13.A.2) 정합 위해 `lineup.id` 포함. 동일 라인업 + 동일 시드 + 동일 회차 → 동일 박스. 시드 동일 + 라인업만 다른 박스는 다른 box.id (격리 보장).
5.1.4. 박스 잔여 = 박스 매수 - 추첨 횟수. (deck 잔여 + Last One 미수령 여부와 별개로 사용자 표시는 5.1.4 정의)

## 5.2. 등급 (Tier)

5.2.1. 등급 = 라인업 정의 (A / B / C / ... / Last One).
5.2.2. 각 등급은 (라벨, 일본어, 한국어, 종 수, 매수, 사이즈, 자산 ID) 속성 (02_data 1.4-DB.2 / 1.4-OP.2 + 1.7).
5.2.3. 종 수 ≥ 2 등급(예: G등급 8종)은 추첨 시 종 인덱스를 별도 결정 (서브 추첨).
5.2.4. **등급 표기 정책**. 데이터 컬럼 / 라벨 / 코드 식별자는 영문 단독 (`A`, `B`, ..., `Last One`). 본문 자연어 설명은 한국어 음역 (`A등급`, `Last One 등급`). 일본어 원어 인용 시 `A賞` 형태.

## 5.3. 추첨 (Draw)

5.3.1. PRNG: 02_data 1.2 `PRNG_NAME`.
5.3.2. 박스 초기화 시: `lineup.boxSize - 1` 매(Last One 제외)의 등급 라벨 배열 셔플 (Fisher-Yates). 라인업별 boxSize에 따라 셔플 길이 동적.
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
5.4.2. 마지막 추첨이 실행되는 순간 Last One 보너스 상품(02_data 1.4-DB.2 / 1.4-OP.2 Last One 행)이 자동 지급.
5.4.3. 결과 모달은 마지막 카드의 등급 + Last One 보너스를 동시 표시.
5.4.4. 시뮬레이터 내부 구현: 79매 셔플 + 마지막 1매 추첨 시 Last One 자동 지급. 박스 매수는 79 + Last One 1 = 80.
5.4.5. **M2: Last One 시각 강조** (5.11.3 갤러리 강조 + 5.12 디자인 언어).

## 5.5. Double Chance

5.5.1. 추첨 1회마다 Double Chance 응모권 1매 자동 누적.
5.5.2. 응모권 = (박스 ID, 추첨 회차, 시각). **M3 갱신**: 박스 ID가 lineup.id 포함하므로 DC 응모권도 자연 격리. 02_data 3.1.1 `kuji_dc_tickets_${lineup_id}` 정합.
5.5.3. Double Chance 추첨은 사용자 명시 트리거 (DC 탭).
5.5.4. 추첨 풀 = 누적 응모권. 일본 캠페인 당첨자 수는 `lineup.dc.winnersTotal` (02_data 1.4-DB.3 / 1.4-OP.3). **M3 갱신**: 라인업별 차이 (드래곤볼 50 / 원피스 100).
5.5.5. 시뮬레이터에서는 사용자 1인이므로 베르누이 단순화.
5.5.6. 당첨 확률 = `lineup.dc.winnersTotal` / `DC_POOL_SIZE_DEFAULT` (02_data 1.3). 응모권 N매에 대해 1 - (1 - p)^N. UI에 단순화 가정 명시.

## 5.6. 추첨 이력

5.6.1. 모든 추첨 결과는 localStorage에 누적 (02_data 3.1 `kuji_history`).
5.6.2. 항목: 추첨 시각, 박스 ID, 등급, 종 인덱스, 상품명, Last One 동시 지급 여부.
5.6.3. 박스 리셋 시 이력 보존, 박스 ID만 새로 발급.

## 5.7. 시드 / 결정론

5.7.1. **박스 ID = `fnv1a("${lineup.id}|${seed}|${box_round}")` → 8 hex (BOX_ID_HEX_LENGTH)**. 같은 라인업 + 같은 시드 + 같은 회차 → 같은 박스. **M3 갱신 (단계 3 P0 2.1 정정)**: 시드 동일 + 라인업만 다른 박스는 다른 box.id (라인업 격리 + 결정론 회귀 회피).
5.7.2. 시드는 사용자가 입력하거나 기본값 사용 (02_data 1.1 `DEFAULT_SEED_FALLBACK_BITS`). **M3**: 시드는 라인업 공유 (사용자 결정 8.2 (A)). settings-tab seed 입력 1건. 모든 라인업이 같은 seed 사용.
5.7.3. 시드 변경 시 박스 진행 중이면 확인 모달. **M3**: 시드 변경은 모든 라인업 박스에 영향 (전역 키 변경). 확인 모달에 명시.
5.7.4. 박스 리셋 시 `box_round` += 1. 시드 변경 시 `box_round`는 `BOX_ROUND_INITIAL` 리셋. **M3**: `box_round`는 라인업별 격리 키 (`kuji_box_round_${lineup_id}`). 라인업별 독립 회차.
5.7.5. **drawRng 격리 (M3 단계 3 P1 3.4 정합)**: `drawRng`는 박스 단위 fresh PRNG. drawOne 호출 시점에 `createRng(fnv1a("${seed}|${box_round}|${drawIndex}"))`로 매번 재초기화 (M2 / M2.1 정합 유지). 라인업 전환 시 drawRng 자동 격리 (라인업별 box_round + lineup_id 포함 box.id 정합).

## 5.8. 신뢰도 표시 ("추정" 배지)

5.8.1. 라인업 데이터의 `box_size_estimated:true` 또는 `count_estimated:true` 항목은 UI에 "추정" 배지 표시.
5.8.2. 배지 클릭 시 출처 URL 일람 모달 표시 (02_data 1.4-DB.4 / 1.4-OP.4).
5.8.3. 배지 색은 02_data 2.2 `COLOR_BADGE_ESTIMATED` (M2 골드 톤).

## 5.9. 구매 (Buy) - M2 신설

5.9.1. 박스 deck 잔여 ≥ 1 시 구매 가능.
5.9.2. 구매 매수 옵션:
- Quick 버튼: 02_data 1.6 `BUY_QUICK_OPTIONS` (= [1, 3, 5, 10]).
- 자유 입력: `BUY_FREE_INPUT_MIN` (= 1) ~ (박스 deck 잔여 - 누적 인벤토리) 매수 사이 정수.
5.9.3. **(누적 인벤토리 + 신규 구매 매수) ≤ 박스 deck 잔여** invariant. 부족 시 buy 비활성 + 안내. 통 선택 격자 잔여 슬롯 ≥ 인벤토리 보장의 근거 (5.14, 7.12).
5.9.4. 가격 = `구매매수 × lineup.priceJpy` 화면 표시. **M3**: 라인업별 priceJpy 동적 lookup.
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
- **(skip ON)**: `core/draw.drawOne(boxState, drawRng, lineup)` 호출 (`pickIndex` 미전달 → `splice(0)`). 페이지플립 시작 시점 = drawOne 호출 시점. 즉시 history append + 갤러리 갱신. **M3 갱신**: 활성 lineup 객체 인자 전달 (`LINEUP` 단수 글로벌 폐기).
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

## 5.13.A. 다중 라인업 (M3 신설 / **M4 갱신 - 메인 entry 격상**)

### 5.13.A.1. 활성 라인업

5.13.A.1.0. **표기 정책 (M3 단계 3 P0 2.3 정합)**: 본 문서에서 소문자 `lineup`은 **활성 라인업 객체** = `LINEUPS[state.currentLineupId]`를 의미.
5.13.A.1.1. 시뮬레이터는 동시에 **하나의 활성 라인업**을 표시한다 (`state.currentLineupId`).
5.13.A.1.2. 첫 진입 시 default 라인업 = `LINEUP_DEFAULT_ID` (= 드래곤볼).
5.13.A.1.3. **M4 / M4.1 갱신**: 활성 라인업 전환은 **홈 탭에서만** 발생 (5.13.B). 설정 탭 dropdown quick-switch는 폐기 (M4 사용자 결정 10.3). 메뉴 정합 단순화 + 도메인 인식 ("쿠지 매장에서 다른 시리즈 보러 가기 = 홈 탭으로") 정합. M4.1: "홈 view"는 "홈 탭"으로 의미 변경 (view 모델 폐기, 4장).

### 5.13.A.2. 라인업별 데이터 격리 (사용자 결정 8.1 (A1))

5.13.A.2.1. **격리 키 (라인업별 독립)**: `kuji_history_${lineup_id}` / `kuji_unopened_tickets_${lineup_id}` / `kuji_box_state_${lineup_id}` / `kuji_box_round_${lineup_id}` / `kuji_dc_tickets_${lineup_id}` / `kuji_dc_results_${lineup_id}`. 02_data 3.1.1 정합.
5.13.A.2.2. **전역 키 (라인업 무관)**: `kuji_seed` (사용자 결정 8.2 (A) = 라인업 공유) / `kuji_settings_skip_pick` / `kuji_meta` / `kuji_current_lineup_id` / `kuji_schema_version`. 02_data 3.1.2 정합.
5.13.A.2.3. **격리 효과**: 라인업 A에서 박스 N매 진행 → 라인업 B 전환 → 라인업 A 복귀 시 박스 + 인벤토리 + 이력 + DC 모두 N매 그대로 보존. 수집/완주 경험 보존.

### 5.13.A.3. 헤더 라인업 라벨 (사용자 결정 8.3 (A) → M3.1 / M4 / **M4.1 갱신 - 클릭 affordance 폐기**)

5.13.A.3.1. 헤더에 활성 라인업 짧은 라벨 (`lineup.ip`, 예: `"DRAGONBALL"` / `"ONE PIECE"`) 표시.
5.13.A.3.2. **M4.1 갱신 (자비스 단계 1 결정 4.1.A 채택)**: 헤더 IP 라벨 클릭 affordance **폐기**. 라벨 = 표시 전용 (현재 라인업 식별). 사유: 하단 홈 탭이 1차 진입점 (5.13.B.5)이므로 헤더 보조 진입점은 발견성 분산 + 인지 부담만 일으킴. M4까지의 꺾쇠 아이콘(`›`) / "홈" 텍스트 / 클릭 핸들러 폐기 의무 (단계 5 T5 grep + 잔존 0).
5.13.A.3.3. **M4.1 갱신**: 모든 탭에서 헤더 IP 라벨 노출. M4까지의 "홈 view 시 헤더 IP 라벨 미렌더" 정책 폐기 (view 모델 폐기 정합, 4장). 홈 탭 활성 시도 헤더 = 활성 라인업 IP 라벨 (= 라인업 미선택 상태가 부재. currentLineupId는 항상 default 또는 마지막 진입 라인업).

### 5.13.A.4. ~~설정 탭 'Lineup' 섹션~~ (**M4 폐기 - 사용자 결정 10.3**)

5.13.A.4.1. ~~설정 탭 상단 'Lineup' 섹션 + dropdown quick-switch~~. **M4 폐기**. M3.1까지 보조 진입 경로로 잔존했으나 메뉴 정합 단순화 위해 제거.
5.13.A.4.2. **라인업 전환은 홈 view에서만** (5.13.B). 헤더 IP 라벨 클릭 → 홈 → 다른 라인업 카드 선택 → 진입.
5.13.A.4.3. **M4 갱신**: dispatch.set_current_lineup은 dispatch.enter_lineup으로 통합 (단계 4 결정). 별도 set_current_lineup 호출처 0건 - 단계 5에서 grep + 폐기.
5.13.A.4.4. **라인업 전환 시 폐기되는 메모리 only state**: `pendingPeelResult` (메모리 전용 reveal 상태) / `selectedGridIndices` (B-α 격자 선택 메모리). 영속 데이터(history / inventory / DC / box) 0건 손실. 5.13.B.5 enter_lineup 분기 B 정합.
5.13.A.4.5. **M4 / M4.1 갱신**: 설정 탭 "홈으로" 버튼 잔존. M4.1 의미 갱신 = 클릭 시 `dispatch({type: 'open_home'})` → state.activeTab = home (view 변경 폐기). 라벨 = "홈으로" (M4 결정 답습).

### 5.13.A.5. 자산 fallback (사용자 결정 8.4 (A))

5.13.A.5.1. `lineup.assetsAvailable === false` 라인업은 02_data 1.7.3 SVG fallback 사용. M2.1 G~J SVG 자산 패턴 답습.
5.13.A.5.2. SVG fallback에 라인업 IP 표기 0건 (라이선스 안전). 등급 라벨(A~J)만 골드 텍스트로.
5.13.A.5.3. 사용자 외부 작업으로 placeholder webp 배치 후 `assetsAvailable: true`로 갱신 + base path 정합.

### 5.13.A.6. 라인업 추가 절차 (M5+ 새 라인업 시)

5.13.A.6.1. 02_data 1.4-XX 절 신설 (메타 + 등급 + DC + 출처 + LINEUP 객체 + 검증식).
5.13.A.6.2. `LINEUPS` 배열 추가 + 02_data 1.7.1-XX 자산 매핑 추가.
5.13.A.6.3. 단계 6 게이트 검증 (라인업 격리 + 등급 수 가변성 + box.id 충돌 0).
5.13.A.6.4. **M3.1 추가**: 등급별 `tierClass` 부여 (02_data 1.4.A.4) + DC `tierClass` + `lobbyHeroAssetPath` (M4 의도 = `homeHeroAssetPath` 키 개명 검토 - 단계 4) 정의 + 1.4.A.3 검증식 통과 (M3.5 룰 완화 = hero ≥ 1 + goods ≥ 1).
5.13.A.6.5. **M4 추가**: 홈 카드 메타 풍부도 정합 (5.13.B.4) - 출시일 / 끝일 / 가격 / 매장 / 진행 상태. 산출식 = 5.13.B.4.3.

## 5.13.B. 쿠지 홈 (M3.1 lobby 신설 / M4 home 격상 / **M4.1 = 1급 entry 탭 + 매번 노출**)

### 5.13.B.1. 목적

M3.1에서 설정 탭에 묻혀있던 라인업 전환을 메인 흐름으로 승격 (lobby = 보조 진입). M4에서 home으로 격상 (= "전체 화면 격리 view" 모델). **M4.1에서 1급 entry 탭으로 재격상**: 사용자 발화 ("기본적으로 진입하면 쿠지 홈이 있어야", 2026-05-10) 답습. M4의 "재방문 시 마지막 라인업 자동 진입" + "홈 = 격리 view" 모델은 사용자 도메인 인식 ("매번 쿠지 매장에서 시작") 정합 미달이라 폐기. 홈 = 하단 탭 1 + 매번 자동 활성 + 모든 본편 탭과 동등.

### 5.13.B.2. 라우팅 모델 (M3.1 view 신설 / M4 view 격상 / **M4.1 view 폐기 + activeTab 단일 라우팅**)

5.13.B.2.1. **state.view 모델 폐기 (M4.1)**: M4까지의 `state.view ∈ {"home", "main"}`는 폐기. 자비스 단계 1 결정 4.3.A 채택. 라우팅은 `state.activeTab` 단일 축으로 통합 (02_data 1.4.B).
5.13.B.2.2. **홈 = 탭 1**: 하단 탭 4탭 중 첫 번째. activeTab === "home" 시 라인업 카드 그리드 렌더. 다른 탭과 동등한 본문 영역.
5.13.B.2.3. **모든 탭 공통 노출 컴포넌트 (M4.1 갱신)**:
- 헤더 = 활성 라인업 IP 라벨 (5.13.A.3, 클릭 affordance 폐기 - 표시 전용).
- 하단 탭 바 = 4탭 항상 노출.
- M4의 "home view 시 탭바 / 본편 컴포넌트 미렌더" 정책 폐기 (`5.13.B.2.3 v6` 폐기).

### 5.13.B.3. 진입 흐름 (M3.1 결정 9.3 → M4 결정 10.4 → **M4.1 재정정**)

5.13.B.3.1. **첫 방문자** (`state.meta.disclaimerSeen === false`): 면책 모달 dismiss → `meta.disclaimerSeen = true` 갱신 (M2 trigger 잔존) → **홈 탭 자동 활성** (= activeTab = home). **M4.2 정정 (M4.1 P1-1 흡수 + round 1 P1-1 재정정)**: 면책 모달 trigger 키 = `state.meta.disclaimerSeen` (M2 잔존). M4 / M4.1 spec 본문의 "homeAcked === false → 면책 모달" 표기는 M2 코드 trigger와 정합 미달이라 정정. dismiss 분기에서 home_acked 갱신은 일어나지 않음 (코드 정합). home_acked 키 = 라우팅 호환 (M3.1 lobbyAcked → M4 개명) + 의미 = M4.1에서 "면책 동의 표시"로 박제했지만 trigger와 분리 (5.13.B.3.3 박제).
5.13.B.3.2. **재방문자** (`state.meta.disclaimerSeen === true`): 면책 모달 미노출 → **홈 탭 자동 활성** (M4까지 = 마지막 라인업 main view 자동 진입은 폐기). currentLineupId 보존 (마지막 진입 라인업) + activeTab = home 강제.
5.13.B.3.3. **`home_acked` 의미 변경 (M4.1, 02_data 3.1.2 정합)**: M4까지 = "마지막 라인업 자동 진입 플래그" → M4.1 = "면책 동의 표시 전용". 진입 흐름과 분리. 면책 1회 ack 흐름 잔존 (사용자 단계 1 결정 4.2.A 채택).
5.13.B.3.4. **홈 탭 복귀 진입 경로** (5.13.B.5 정합): 본편 탭(추첨/갤러리+기록/설정)에서 홈 탭으로 복귀 = 하단 탭 "홈" 버튼 클릭 (1차) 또는 설정 탭 "홈으로" 버튼 (보조).

### 5.13.B.4. 카드 구성 (사용자 결정 9.4 - hero 1개 미리보기 / **M4 메타 풍부화**)

5.13.B.4.1. 라인업 카드 N개를 그리드 레이아웃으로 노출. 모바일 1열 / 태블릿 이상 2열 (반응형).
5.13.B.4.2. 카드 구성 요소 (위→아래 순서, **M4 갱신**):

| # | 영역 | 내용 | 자산 부재 시 fallback |
|---|---|---|---|
| 1 | hero 이미지 | `lineup.homeHeroAssetPath` (M3.1 `lobbyHeroAssetPath` 개명 검토 - 단계 4) | placeholder gray + IP 라벨 |
| 2 | 한국어 제목 | `lineup.titleKo` | - |
| 3 | IP 라벨 | `lineup.ip` | - |
| 4 | 메타 (M4 풍부화) | 발매일 + **끝일 (신규)** + 가격(엔) + 박스 매수 + 추정 배지 + **매장 (신규, M4 단계 2 결정)** | - |
| 5 | 메인 상품 미리보기 | tier_class === "hero" 등급 중 박스 등급 첫 항목 1개 (= 보통 A상) 썸네일 + 등급 라벨 + 한국어 상품명 | SVG fallback (1.7.3) + 등급 색 보더 |
| 6 | **진행 상태 (M4 신설, 단계 2 결정)** | 박스 회차 / 추첨 누적 / DC 응모 누적 (선택). state.history + boxState 기반 산출 | 미진행 라인업 = "아직 시작 안 함" |
| 7 | "이 라인업으로 진입" 버튼 | 풀 폭 버튼. CTA 색 = 브랜드 빨강 | - |

5.13.B.4.3. **M4 진행 상태 산출식 (단계 2 결정 - round 2 박제)**: 카드 6번 항목 "진행 상태"의 산출식.
- 박스 회차: `loadStateForLineup(lineup.id).boxRound` (영속).
- 추첨 누적: `loadStateForLineup(lineup.id).history.length` (영속).
- DC 응모 누적: `loadStateForLineup(lineup.id).dcTickets.length` (영속).
- 비활성 라인업도 storage에서 직접 lookup 의무 (활성/비활성 카드 모두 정합).
- 미진행 라인업 (boxRound = 0 또는 history = []) = "아직 시작 안 함" 표기.

5.13.B.4.4. **M4 진행 상태 표시 정책**: 사용자 도메인 인식 = "어느 라인업을 진행 중인가 한눈에". 2 라인업 (M3) 환경에서는 차이 작지만 M5+ 3+ 라인업 시점에 가치 ↑.

5.13.B.4.5. **메인 상품 미리보기 산출식** (1.4.A 정합):
```
heroTiers = lineup.tiers.filter(t => t.tierClass === "hero" && t.tier !== "Last One")
preview = heroTiers[0]   // 통상 A상
```
Last One도 hero지만 미리보기 슬롯에서는 A상 우선. 박스 등급 첫 hero를 라인업 대표로 채택. heroTiers 배열이 비어있으면 1.4.A.3 검증식 위반이라 부팅 실패 (선조건).

5.13.B.4.6. 활성 라인업(`state.currentLineupId`와 일치하는 카드)에는 "현재" 배지 + 카드 보더 강조. **M4.1**: home_acked 분기 조건 폐기 (M4까지 = `homeAcked === true && lineup.id === currentLineupId`). M4.1 = `lineup.id === state.currentLineupId` 단독 (homeAcked 진입 흐름 분리 정합). 첫 방문자도 currentLineupId default(드래곤볼) = 활성 카드.

### 5.13.B.5. 홈 진입 경로 (M3.1 결정 9.5 / M4 갱신 / **M4.1 재정정 - 하단 탭 1차**)

5.13.B.5.1. **하단 탭 "홈" 버튼 (M4.1 1차 진입점)**: 모든 탭에서 발견성 최고. 클릭 = `dispatch({type: 'set_active_tab', tab: 'home'})` 또는 `dispatch({type: 'open_home'})` (M4.1 의미 동일, 단계 4 단일화 결정).
5.13.B.5.2. **설정 탭 "홈으로" 버튼 (보조 진입점, M4 잔존)**: 설정 후 즉시 홈 복귀 동선. 클릭 = `dispatch({type: 'open_home'})`. 라벨 = "홈으로" (M4 결정 답습).
5.13.B.5.3. **헤더 IP 라벨 진입 경로 폐기 (M4.1)**: M4까지의 헤더 클릭 → 홈 복귀 폐기. 자비스 단계 1 결정 4.1.A 채택. 헤더는 표시 전용 (5.13.A.3.2).

### 5.13.B.6. dispatch (M3.1 신설 / M4 갱신 / **M4.1 의미 갱신 - activeTab 라우팅**)

5.13.B.6.1. **`dispatch({type: 'open_home'})`** (M3.1 open_lobby 개명):
- **M4.1 의미 갱신**: state.activeTab = STATE_TAB_HOME 강제. view 키 변경 폐기 (view 모델 폐기).
- currentLineupId / homeAcked 보존.
- 영속: kuji_active_tab = "home" 갱신 (영속 활성 탭 정합).
- activeTab === STATE_TAB_HOME 시 호출 = no-op.
- 호출처: 하단 탭 "홈" 클릭 / 설정 탭 "홈으로" 버튼 / 첫 방문자 면책 dismiss 직후.

5.13.B.6.2. **`dispatch({type: 'enter_lineup', lineupId})`** (M4.1 의미 갱신):
- state.currentLineupId = lineupId (변경 시 라인업 공간 재로드).
- state.homeAcked = true (면책 동의 표시. 의미 = M4.1 변경, 진입 흐름 분리).
- **state.activeTab = STATE_TAB_DRAW** (M4까지 = state.view = 'main' 폐기. M4.1 = "라인업 진입 = 추첨부터" 도메인 정합).
- saveState(currentLineupId, homeAcked: true) + saveGlobal(activeTab: "draw").
- 메모리 only state(`pendingPeelResult` / `selectedGridIndices`) 폐기 (5.13.A.4.4 정합 - 라인업 전환 분기 B만).
- rerender.

5.13.B.6.3. **`dispatch({type: 'set_active_tab', tab})`** (M4 신설 잔존):
- state.activeTab = tab (STATE_TAB_VALUES 검증).
- 영속 갱신.
- M4.1: tab === STATE_TAB_HOME 호출 시 5.13.B.6.1 의미와 동등. 단계 4 단일화 결정.

5.13.B.6.4. **`set_current_lineup` 폐기 (M4)**: 잔존. M4.1 추가 폐기 없음.

### 5.13.B.7. 자산 정책

5.13.B.7.1. `homeHeroAssetPath` (M3.1 `lobbyHeroAssetPath` 키 개명 검토 - 단계 4)는 라인업별 `assetsBasePath` 하위 `home_hero.webp`. assetsAvailable=false면 placeholder gray + IP 라벨로 fallback.
5.13.B.7.2. 라이선스 안전 정책 (5.13.A.5.2): 자산 부재 시 placeholder는 라인업 IP 텍스트만 표기, IP 비주얼/캐릭터 비표기.

### 5.13.B.8. 비목표 (M4 / **M4.1 갱신**)

5.13.B.8.1. 카드 swipe / 디테일 시트 / 영상 미리보기 등 풍부한 인터랙션 - 차기 사이클.
5.13.B.8.2. 라인업 추천 / 정렬 (인기순, 발매일순 등) - N≥3 시점에 검토 (M5+).
5.13.B.8.3. 본편 화면(추첨/기록/DC) tier_class 시각 - **M3.2/M3.3에서 흡수 완료**.
5.13.B.8.4. 홈 다국어 - 한국어/일본어만.
5.13.B.8.5. **M4 추가 비목표**: 진행 상태(박스 회차 / 추첨 누적) 그래프 / 차트 - 단순 카운트 표시만. 카드 부담 회피.
5.13.B.8.6. **M4.1 추가 비목표**:
- 헤더 외 추가 진입점(햄버거 메뉴 등) 신설 = 본 사이클 비목표. 하단 탭이 1차 진입점이고 설정 탭 "홈으로" 버튼이 보조. 추가 분산 금지.
- 라인업 미선택 빈 화면 view 신설 = 비목표. currentLineupId는 항상 default 또는 마지막 진입 라인업으로 보존. view 모델 자체 폐기 정합.
- 면책 모달 매 진입 시 노출 = 비목표 (자비스 단계 1 결정 4.2.A 1회만 채택).
- 코토부키야쿠지 30연 천장 룰 = M5 별도 사이클.

## 5.13.C. tier_class 시각 적용 (M3.2 신설)

### 5.13.C.1. 목적

M3.1에서 데이터 메타로 도입한 tier_class(hero/main/goods)를 본편 화면 시각으로 흘려보냄. 등급 위상의 "느낌"을 사용자 시각에 전달. 등급 색(A=골드, B=실버 ...)은 그대로 유지하고, 클래스는 **카드 보더/배경 톤** + **결과 reveal 등장 모션** (추첨 = 페이지플립 인플레이스 / DC = 결과 모달)으로 표현.

**M2 K-1 정합 (8.8)**: 추첨 결과는 모달 미사용. 페이지플립 카드(`peel-card.js`) 내부 면 + 4장 영역 2/3/4 인플레이스 갱신. DC 결과는 별도 모달 유지(`dc-result-modal.js`).

### 5.13.C.2. 추첨 탭 hero-carousel / minor-row 액센트 (사용자 결정 M3.2 9.1~9.3)

5.13.C.2.1. **카드 속성 부착**: hero-card / minor-row-item 모두 `data-tier-class` 속성 부착. 값 = `getTierClassForTier(lineup, tier)` (02_data 1.4.A.5).

5.13.C.2.2. **CSS 셀렉터 적용** (styles/main.css 신설):

| tier_class | 카드 보더 | 카드 배경 | 글로우 |
|---|---|---|---|
| `hero` | `var(--gold-edge)` | `var(--tier-class-hero-bg-tint)` | 약한 정적 골드 박스 그림자 (`HERO_STATIC_GLOW_BLUR_PX` blur + `HERO_STATIC_GLOW_ALPHA` 알파) |
| `main` | `var(--border-subtle)` (기존) | `var(--tier-class-main-bg-tint)` (= bg-card, 무변형) | 없음 |
| `goods` | `var(--border-subtle)` | `var(--tier-class-goods-bg-tint)` (= bg-elevated, 옅은 회색) | 없음 |

5.13.C.2.3. **PEEL_REVEAL_VIEW_MS 글로우와의 충돌 회피**: hero 정적 글로우는 약한 강도(알파 0.25)로 PEEL 뽑힌 직후 강한 글로우와 시각 분리. PEEL 글로우는 reveal 직후 1.5초 동안 강한 효과 → 페이드 → 정적 hero 글로우 잔존.

5.13.C.2.4. **minor-row 시각 차이**: 현재 minor-row 등급(드래곤볼 G/H/I/J + 원피스 G/H/I)은 모두 goods 클래스. data-tier-class 속성만 부착(차기 사이클 hook). 시각 변화는 미세(보더 그대로 + 배경 옅은 회색 톤).

### 5.13.C.3. 결과 reveal hero 등장 특별 모션 (사용자 결정 M3.2 9.1)

**적용 영역**: 추첨 결과 = 페이지플립 카드 인플레이스 (`peel-card.js`, M2 K-1 정합). DC 결과 = `dc-result-modal.js`.

5.13.C.3.1. **분기 조건**: `result.isLastOne === true` 또는 `getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO`. lookup 주체는 결과 표시 영역(렌더 모듈). main.js dispatch는 `result` + `lineup` 인자만 전달, 클래스 판정은 1.4.A.5 헬퍼.

  **OR 중복 의도**: Last One의 tier_class도 hero (1.4-DB.2 / 1.4-OP.2). 따라서 둘째 항만으로 충분하나 첫째 항을 명시적으로 둠 = result 객체에 "Last One" tier 라벨 미부여 흐름(5.10.6) + tierClass lookup 실패 안전 fallback. 의도적 redundant.

5.13.C.3.2. **hero 모션 적용 효과** (페이지플립 카드 / DC 모달 공통):
- 카드(또는 모달 카드) transform scale 피크 = `HERO_POP_SCALE_PEAK` (= 1.18, 02_data 1.5).
- 결과 텍스트 골드 글로우 1회 펄스 (`HERO_GLOW_DURATION_MS` = 1200ms 동안 페이드 인 → 아웃).
- 등급 색은 기존 `TIER_COLORS` 유지.

5.13.C.3.3. **분기 외 (main / goods)**: 기존 `RESULT_POP_SCALE_PEAK = 1.1` 모션 유지. 회귀 위험 0.

5.13.C.3.4. **DC 결과 모달 정합**: DC.tierClass === hero (1.4-DB.3 / 1.4-OP.3). dc-result-modal.js도 5.13.C.3.2와 동일 hero 모션 적용. 사용자가 DC 당첨을 "특별한 느낌"으로 인지.

### 5.13.C.4. 비목표 (M3.2 한정)

5.13.C.4.1. **상품 갤러리 클래스 그룹화** - 차기 사이클.
5.13.C.4.2. **history 탭 클래스별 통계** - 차기 사이클.
5.13.C.4.3. **라인업별 IP 액센트 색** - 라인업 N≥3 도달 시 재검토.
5.13.C.4.4. **mid 클래스 도입** (4분류) - M3.1 plan 8.2.3 동결 정책 유지 (02_data 1.4.A.4 분류 정책 정합).

## 5.13.D. tier_class 확장 시각 (M3.3 신설) - 갤러리 그룹화 + history 대시보드

### 5.13.D.1. 목적

M3.2에서 추첨 탭 + 결과 reveal에 적용한 tier_class를 갤러리 / history 영역으로 확장. 사용자가 "수집 진행도"를 직관적으로 인지하도록 hero/main/goods 단위로 시각 분할.

### 5.13.D.2. 상품 갤러리 클래스 그룹화 (사용자 결정 9.1 / 9.3 / 9.4)

5.13.D.2.1. **펼침 상태(`galleryExpanded === true`)에서만 그룹화 적용**. 접힘 상태는 기존 흐름 그대로 (회귀 위험 0).

5.13.D.2.2. **그룹 정렬 순서** (사용자 결정 9.3): hero → main → goods (위상 내림차순). 박스 등급 순서(A → B → ...)는 각 그룹 내부에서 보존.

5.13.D.2.3. **Last One 위치** (사용자 결정 9.4): hero 그룹의 **마지막 자리**. 박스 등급 첫 자리 hero(통상 A상)부터 순서대로 + 마지막에 Last One.

5.13.D.2.4. **섹션 헤더**: 각 그룹 위에 한국어 라벨 (`TIER_CLASS_LABEL_KO`, 02_data 1.4.A.6).
- hero → "메인 등급"
- main → "표준 등급"
- goods → "굿즈"

5.13.D.2.5. **섹션 헤더 시각**: 작은 헤딩(`<h3>` 등) + tier_class 색 톤 액센트(예: 좌측 색 막대, 라인업 IP 액센트는 비목표 유지).

5.13.D.2.6. **빈 그룹 처리**: 라인업에 해당 클래스 등급이 0개일 경우 그룹 헤더 미표시. **M3.5 룰 완화 후 main = 0 라인업 허용** (1.4.A.3 검증식 갱신, 5.13.E 정합). 원피스가 본 분기 발동 사례 (B/C/D/E/F가 hero로 재조정되어 main = 0).

### 5.13.D.3. history 탭 상단 대시보드 (사용자 결정 9.2 / 9.5)

5.13.D.3.1. **위치**: history 탭 진입 시 가장 먼저 노출(상단). 기존 history 리스트는 대시보드 아래 그대로 유지(회귀 위험 0).

5.13.D.3.2. **카운터 카드 4개**: 전체 / hero / main / goods. 각 카드 = 큰 숫자 + tier_class 색 톤 + 한국어 라벨.

5.13.D.3.3. **레이아웃** (사용자 결정 9.2):
- 모바일(`< HISTORY_DASHBOARD_TABLET_BREAKPOINT_PX`): 2x2 그리드 (`HISTORY_DASHBOARD_COLS_MOBILE = 2`).
- 태블릿 이상: 4열 가로 (`HISTORY_DASHBOARD_COLS_TABLET = 4`).

5.13.D.3.4. **카운터 산출 (M3.3 신설)**: `core/history.tierClassCounts(state.history, lineup)` 호출. 활성 라인업 전체 history (라인업별 격리, 사용자 결정 9.4) → `{ hero, main, goods, total }` 반환.

5.13.D.3.5. **카드 시각 매트릭스**:

| 카드 | 라벨 | 배경 | 강조 |
|---|---|---|---|
| 전체 | "전체" | `var(--bg-card)` | 큰 숫자 |
| hero | `TIER_CLASS_LABEL_KO[hero]` (= "메인 등급") | `var(--tier-class-hero-bg-tint)` | 골드 액센트 |
| main | `TIER_CLASS_LABEL_KO[main]` (= "표준 등급") | `var(--tier-class-main-bg-tint)` | 무변형 |
| goods | `TIER_CLASS_LABEL_KO[goods]` (= "굿즈") | `var(--tier-class-goods-bg-tint)` | 옅은 회색 |

5.13.D.3.6. **빈 history 시**: 대시보드는 표시하되 모든 카운터 0. 빈 상태 안내 문구는 기존 흐름 그대로 (대시보드 아래 history 리스트 영역).

5.13.D.3.7. **받은/미받은 분리 미도입** (사용자 결정 9.5): hero 카운터는 통합 카운트만(reveal 완료 history 항목 그대로 카운트). M2 requiresReceive 플래그와 본 카운터는 무관.

### 5.13.D.4. 비목표 (M3.3 한정 / **M4 갱신**)

**M4 갱신**: M3.3 시점 비목표였던 "history 탭과 갤러리 통합"이 M4에서 채택됨. 5.13.F (통합 탭) 정합. 본 절(5.13.D)의 갤러리 그룹화 + history 대시보드 자산은 5.13.F 통합 탭의 sub-section으로 흡수.

#### 5.13.D.4.X. 잔존 비목표 (M3.3 한정)

5.13.D.4.1. 박스별 분리 통계 - 활성 라인업 전체 이력만.
5.13.D.4.2. 그래프 / 차트 UI - 단순 카운트만.
5.13.D.4.3. 라인업별 IP 액센트 색 - M3.1 / M3.2 비목표 유지.
5.13.D.4.4. mid 클래스 도입 - M3.1 동결 정책 유지.
5.13.D.4.5. M4 천장 룰 - 별도 사이클.

## 5.13.E. tier_class 라인업별 자율 분류 (M3.5 신설)

### 5.13.E.1. 목적

M3.1~M3.3에서 tier_class 시각/카운트/그룹화 기반을 구축. M3.5는 "라인업별 도메인 인식상 hero 그룹 범위가 다름"을 시스템적으로 수용. 원피스는 사용자가 A~F를 모두 "주요 상품"으로 인식 → B/C/D/E/F tierClass main → hero 재조정. 드래곤볼은 기존 분류 유지.

### 5.13.E.2. 검증식 룰 완화

5.13.E.2.1. 02_data 1.4.A.3 검증식에서 `∃ t2: t2.tierClass === "main"` 룰 제거.
5.13.E.2.2. main 등급 부재 라인업 허용. hero ≥ 1 + goods ≥ 1만 의무.
5.13.E.2.3. hero / goods 룰은 잔존. dc.tierClass ∈ TIER_CLASS_VALUES 잔존.

### 5.13.E.3. 영향 매트릭스 (시각/카운트 영역) - **round 3 정정**

분기 식 변경은 **드래곤볼 + 원피스 양쪽**에 동시 적용. 라인업별 회귀 0이 의무.

| 영역 | 드래곤볼 | 원피스 | 비고 |
|---|---|---|---|
| product-gallery (5.13.D.2) | hero=A+LastOne / main=B/C/D/E/F / goods=G/H/I/J | hero=A+B+C+D+E+F+LastOne (7) / main=빈 헤더 미렌더 / goods=G/H/I (3) | 자동 정합 (M3.3 그룹화 = tierClass 기반) |
| hero-carousel (5.13.C.2) | A/B/C/D/E/F (6 등급, hero+main) | A/B/C/D/E/F (6 등급, hero) | filter 식 (M3.5 round 3 정정 적용 완료) = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== LAST_ONE_TIER_NAME`. 양쪽 라인업 6 등급 동등 노출. data-tier-class 속성으로 hero/main 톤 차이 유지. **M4.2 정정 (M3.5 P2-1 흡수)**: 시점 표기 "코드 변경 의무" → "적용 완료". 매직 문자열 `"Last One"` → 상수 `LAST_ONE_TIER_NAME`. |
| minor-row (5.13.C.2) | G/H/I/J (4 등급, goods) | G/H/I (3 등급, goods) | filter 식 (M3.5 round 1 P0-1 정정 적용 완료) = `t.tierClass === TIER_CLASS_GOODS && t.tier !== LAST_ONE_TIER_NAME`. **M4.2 정정**: 시점 표기 단순화 + 매직 문자열 상수화. |
| 결과 reveal hero 모션 (5.13.C.3) | A/LastOne (변경 0) | A/B/C/D/E/F/LastOne (확장) | 자동 정합 (peel-card.js hero 분기 식 = `getTierClassForTier(lineup, result.tier) === TIER_CLASS_HERO` 그대로) |
| dc-result-modal (5.13.C.3) | 변경 0 (DC.tierClass=hero 고정) | 변경 0 (DC.tierClass=hero 고정, 1.4-OP.3 잔존) | 자동 정합 (사실 박제) |
| history 대시보드 (5.13.D.3) | 변경 0 (hero=A+LastOne / main=B~F / goods=G~J) | hero=A+B+C+D+E+F+LastOne / main=0 / goods=G+H+I | 자동 정합 |
| validateLineup (1.4.A.3) | 통과 (변경 0) | 통과 (main=0 허용 룰 완화) | 코드 변경 의무 (`_validateLineupTierClass` main 룰 제거) |

### 5.13.E.4. 비목표 (M3.5 한정)

5.13.E.4.1. 드래곤볼 분류 변경 - 사용자 결정 (라인업별 자율).
5.13.E.4.2. 신규 클래스 도입 (예: hero/major/main/goods 4단계) - M3.1 동결 정책 유지.
5.13.E.4.3. hero-carousel 6+1 등급 노출 시 가독성 / scroll 정합 재설계 - 라이브 검수 결함 보고 시 별도 사이클. **본 사이클은 분기 식만 tierClass 기반으로 변경** (시각 토큰 / scroll 동작 / 카드 크기 정책 변경 0).
5.13.E.4.4. minor-row 빈 main 영역 별도 처리 - 본 사이클은 분기 식이 goods로 한정되어 main = 0 자연 흡수. 별도 빈 영역 안내 / 라벨 표시 미도입.
5.13.E.4.5. M3.4-tidy 정리 라운드 항목 - 별도 사이클.

## 5.13.F. 갤러리+기록 통합 탭 (M4 신설 - 4탭→3탭 / **M4.1 = 탭 3 위치 변경, 통합 자산 보존**)

### 5.13.F.1. 목적

M3.5까지 4탭 (추첨 / 전적(기록) / DC / 설정) 구조에서 사용자 도메인 인식 = "수집 한눈에"를 위해 history 대시보드 + 상품 갤러리 + 추첨 이력 리스트를 단일 탭에 통합. M3.3 갤러리 그룹화 + 대시보드 자산을 그대로 활용 + M2 history 리스트 흡수. **M4.1 갱신**: 통합 자산은 보존, 탭 위치만 변경 (M4 탭 2 → M4.1 탭 3, 홈 탭 1 신설로 시프트).

### 5.13.F.2. sub-section 구성 (사용자 결정 10.2 - **round 2 채택 박제**)

채택 순서 (위→아래, 권고 그대로 채택):

| # | sub-section | 내용 | 출처 자산 |
|---|---|---|---|
| 1 | 상단 대시보드 | 4 카운터 카드 = 전체 / hero / main / goods. 모바일 2x2 / 태블릿 4열 | 5.13.D.3 (M3.3) |
| 2 | 중단 갤러리 그룹 | hero / main / goods 섹션 + 카드. Last One = hero 마지막. 펼침/접힘 토글 | 5.13.D.2 (M3.3) + product-gallery.js |
| 3 | 하단 history 리스트 | 시간순 추첨 이력. 시간 / 등급 / 박스 ID. **무한 스크롤 (round 2 채택)** | M2 history-tab.js |
| 4 | DC 응모 (**round 2 채택 = 별도 sub-section**) | 응모 카운터 + 응모 이력. DC 결과 모달은 잔존 (`dc-result-modal.js`) | M1 DC 탭 자산 |

### 5.13.F.3. 폐기되는 탭 / 모듈

5.13.F.3.1. **history 탭 폐기 (round 2 채택)**: M2 시점 별도 탭. M4에서 본 통합 탭의 sub-section 3으로 자산 이전. render/history-tab.js 자산은 sub-section 3 렌더 함수로 이전 후 모듈 폐기. 단계 4 grep + 폐기.
5.13.F.3.2. **DC 탭 폐기 (round 2 채택)**: DC 결과 모달은 잔존(`dc-result-modal.js`). 별도 DC 탭 → sub-section 4로 통합.
5.13.F.3.3. **render/dc-tab.js 폐기**: round 2 채택. 단계 4에서 grep + 폐기 의무.

### 5.13.F.4. 비목표 (M4 한정)

5.13.F.4.1. 그래프 / 차트 UI - 단순 카운트 + 리스트.
5.13.F.4.2. 리스트 검색 / 필터 - N≥3 라인업 시점에 검토.
5.13.F.4.3. 갤러리 카드 디테일 시트 - product-detail-modal 잔존 (5.13.B.8 패턴).
5.13.F.4.4. M5 천장 룰 - 별도 사이클.

## 5.14. 통 선택 (Pick from Bin) - M2.1 신설 + B-α 재정정 (단계 5 T19 결함 정정)

매장 추첨함(クジ箱)에서 직접 N매를 모두 골라 손에 든 다음 한 장씩 뜯는 체험. 사용자 선택 = 셔플 배열 인덱스 매핑. 5.7 시드 결정론은 그대로 유지.

### 5.14.0. 메커닉 모델 (B-α)

5.14.0.1. **선택 단위**: N매 통째 (구매 매수 N개 슬롯 모두 선택 후 "확인" 버튼 = 1회 확정). 단계 1 plan의 (a) "1매당 1번"은 폐기 (단계 5 T19 사용자 시각 컨펌에서 매장 경험과 어긋남 발견).
5.14.0.2. **인벤토리 ticket 모델**: 구매 직후 인벤토리에 N매 raw ticket 추가 (`lockedResult: null` = 등급 미결정). "확인" 시 N매 모두 `lockedResult` 부여 (각 ticket에 등급/종/사이즈/lastOnePrize 등 결과 정보 포함). 사용자에게는 reveal 전까지 미공개.
5.14.0.3. **결과 시각 분리** (T19 결함 2 정정): 슬롯 선택 / "확인" 시점에 등급은 결정되지만 사용자에게는 미공개. 갤러리 / 캐러셀 / 마이너 row / Last One row 갱신은 reveal 시점에만 (history는 reveal 시점에만 append. revealed 필드는 deprecated).
5.14.0.4. **drawOne 호출 시점**: "확인" 버튼 클릭 = `core/draw.drawOne(boxState, drawRng, lineup, deckIndex)` N회 연속 호출 (사용자 슬롯 선택 순서대로). 각 호출이 deck splice + lockedResult 결정. **M3**: `lineup` = 활성 라인업 객체 (= `LINEUPS[state.currentLineupId]`).
5.14.0.5. **pendingPickResult 폐기**: M2.1 1차 설계의 `pendingPickResult` 메모리 변수는 폐기. ticket.lockedResult 로 통합. (state 객체에서도 제거.)

### 5.14.1. 진입 조건 (B-α)

5.14.1.1. 인벤토리 ≥ 1매 + **인벤토리 첫 ticket의 `lockedResult === null`** (= raw ticket 존재 = 통 선택 미완료).
5.14.1.2. `kuji_settings_skip_pick` (= 02_data 3.1, 기본 `BUY_SKIP_PICK_DEFAULT` = false) **OFF**.
5.14.1.3. `pendingPeelResult` 부재 (reveal 진행 중 아님).
5.14.1.4. 위 조건 만족 시 4장 화면 흐름 6.b1 영역에 통 선택 격자 패널 표시.

### 5.14.2. 격자 레이아웃

5.14.2.1. 격자 차원: `cols × rows`. `cols = lineup.gridCols ?? PICK_GRID_COLS_DEFAULT` (02_data 1.12, 기본 10). `rows = Math.ceil(NORMAL_SLOT_COUNT / cols)`. **2026-05-08 정정**: 통(bin) 격자에 표시되는 슬롯은 **일반 슬롯만** (Last One 슬롯 비노출, 4.14.14). **M3 갱신**: `NORMAL_SLOT_COUNT = lineup.boxSize - 1` (라인업별 동적, 드래곤볼 79 / 원피스 79). 위치는 무작위 좌표가 아닌 격자 셀 + jitter 산개 (4.16).
5.14.2.2. **통 격자 슬롯 수 = `NORMAL_SLOT_COUNT`** (= `lineup.boxSize - 1`). 내부 구성:
- **일반 슬롯**: `lineup.boxSize - 1` 개 (드래곤볼 79 / 원피스 79). 셔플 배열 인덱스 0 ~ `lineup.boxSize - 2` 와 1:1 매핑. 사용자 클릭 가능.
- **Last One 슬롯**: ~~격자 마지막 셀 1개~~. **2026-05-08 정정 (4.14.14)**: 통 격자에 노출하지 않음. 별도 영역 `last-one-row` (4번 영역)에 단일 행으로 표시. `last-one-row`는 마지막 일반 슬롯 reveal 시점에 자동 지급 + 글로우 + "LAST ONE!" 배지로 동시 표시 (5.14.4.5 / 5.4 자동 지급 흐름 정합).
5.14.2.3. 슬롯 최소 터치 타깃 = `PICK_SLOT_MIN_TAP_PX` (= 24px). 화면 폭이 부족하면 `cols`를 `PICK_GRID_COLS_MIN` (= 4) 까지 자동 축소.
5.14.2.4. 슬롯 간 간격 = `PICK_SLOT_GAP_PX` (= 4px).
5.14.2.5. ~~**Last One 슬롯 위치**: 격자 마지막 셀 (gridIndex = `lineup.boxSize - 1`).~~ **2026-05-08 폐기 (4.14.14)** - Last One 슬롯은 통에 노출하지 않으며 `last-one-row`에서 별도 표시. `LAST_ONE_GRID_INDEX` 상수도 dead. `gridIndex = lineup.boxSize - 1` 값은 history 데이터 모델에서 더 이상 사용되지 않음 (Last One은 `isLastOne: true` + `gridIndex: null` 또는 `lastDrawnTier`로 식별).

### 5.14.3. 슬롯 상태 (B-α 5상태 + ~~Last One 2상태~~ - 2026-05-08 일반 3상태로 축소)

5.14.3.1. **잔여 미선택** (`normal-available`): 활성. 클릭 가능 (선택 토글). 배경 `COLOR_PICK_SLOT_BG` + 테두리 `COLOR_PICK_SLOT_BORDER` (골드).
5.14.3.2. **잔여 선택됨** (`normal-selected`): 활성. 클릭 가능 (선택 해제 토글). 배경 `COLOR_PICK_SLOT_SELECTED_BG` + 테두리 `COLOR_PICK_SLOT_SELECTED_BORDER` + 체크 마크 또는 펄스 강조.
5.14.3.3. **뽑힘** (`normal-drawn`): 비활성. 이전 사이클의 lockedResult ticket이 인벤토리에 있거나 reveal 완료된 슬롯. 배경 `COLOR_PICK_SLOT_EMPTY_BG` + 테두리 `COLOR_PICK_SLOT_EMPTY_BORDER` (약한 잉크). 클릭 무시.
5.14.3.4. 슬롯 시각 모티프: 작은 복권 모양 (브랜드 빨강 점) 또는 골드 점. 선택 시 모티프 + 체크 마크.
5.14.3.5. ~~**Last One 슬롯 대기** (`last-one-pending`)~~ **2026-05-08 폐기 (4.14.14)**. Last One 슬롯이 통에 노출되지 않으므로 본 상태 미사용. `pick-slot.js`의 `LAST_ONE_PENDING` 상수 dead (호환 export로만 잔존, 다음 정리 라운드 제거 후보).
5.14.3.6. ~~**Last One 슬롯 지급 완료** (`last-one-drawn`)~~ **2026-05-08 폐기 (4.14.14)**. 동일.

### 5.14.4. 인터랙션 (B-α)

5.14.4.1. **호버**: 일반 슬롯 (미선택)이 `PICK_SLOT_HOVER_LIFT_PX` (= 4px) 부상 + `PICK_SLOT_HOVER_GLOW_PX` (= 12px) 글로우 (색상 `COLOR_PICK_SLOT_HOVER_GLOW`). 데스크톱 마우스 hover, 모바일은 hover 미지원. ~~Last One 슬롯은 호버 시 5.14.3.5 안내 toast~~ (2026-05-08 toast 폐기 + Last One 슬롯 통 비노출).
5.14.4.2. **클릭 / 탭 (잔여 일반 슬롯)**: 선택 / 해제 토글 (메모리 전용. deck splice 없음. drawOne 호출 없음. history 미커밋). 같은 슬롯 재클릭 = 해제. 다른 슬롯 클릭 = 추가 선택.
5.14.4.3. **선택 카운트 헤더**: 격자 패널 상단에 "선택 K / N" 표시. K = 현재 선택된 슬롯 수, N = 인벤토리 raw ticket 수 (= 사용자가 골라야 할 매수).
5.14.4.4. **"확인" 버튼**: K === N 시 활성. 클릭 시:
- 사용자 슬롯 선택 순서대로 `core/draw.drawOne(boxState, drawRng, lineup, deckIndex)` N회 연속 호출. 각 호출 전 격자 위치 → 잔여 deck 인덱스 변환 (5.14.2.2 매핑 + 03_architecture 3.14 알고리즘. 단 N개 동시 변환 시 매 호출마다 splice로 잔여 deck이 줄어드는 것을 반영하여 변환). **M3**: `lineup` 활성 객체 인자.
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

### 5.14.7. 첫 진입 안내 (**2026-05-08 폐기**)

5.14.7.1. ~~`kuji_meta` 에 `pickHintSeen` 플래그 추가. 최초 통 선택 격자 진입 시 1회 toast 표시.~~ **폐기됨 (2026-05-08, PROGRESS 4.14.1)**. 사용자 메모리 룰 `feedback_lottery_red_text`("복권 영역 안내·힌트·경고 문구 금지") 우선 적용. `pick-hint-toast.js` 모듈 삭제. `dispatch.pick_hint_seen` 호출처 0건. `kuji_meta.pickHintSeen` 영속 키는 호환을 위해 유지하되 읽지 않음 (deprecated). `PICK_FIRST_HINT_TEXT_KO` / `PICK_FIRST_HINT_DURATION_MS` 상수는 numbers.js 잔존하나 사용처 0 (deprecated, 다음 정리 라운드 제거 후보).
5.14.7.2. ~~문구 = `PICK_FIRST_HINT_TEXT_KO`~~ **폐기**.
5.14.7.3. ~~표시 시간 = `PICK_FIRST_HINT_DURATION_MS`~~ **폐기**.

# 6. 사용자 시나리오 (M2 + M2.1 갱신)

6.1. **첫 진입**: 면책 안내 → 추첨 탭 → 구매 씬 (인벤토리 0매) → 박스 카드 + 갤러리 (모두 미뽑힘) + 구매 패널 (skip 체크박스 OFF 기본).
6.2. **첫 구매 + 첫 통 선택 + 첫 뜯기 (skip OFF, 기본 흐름, B-α, 2026-05-08 toast 폐기 정합)**: Quick 1매 → 가격 790엔 표시 → 구매 → 인벤토리 1매 raw → 통 선택 격자 자동 표시 (산개 배치 79슬롯) + "선택 0/1 · 잔여 80" 헤더 → 슬롯 1개 클릭 (selected 상태) + "선택 1/1" → 200ms 후 자동 confirm → drawOne 1회 호출 + ticket lockedResult 부여 + 격자 종료 → 페이지플립 카드 표시 (외부 면, 등급 미공개) → 좌측 드래그 / 클릭 → 페리페리 reveal → 등급 / 상품 인플레이스 표시 + 갤러리 갱신 (이 시점에 첫 갤러리 변화) → 확인 버튼 → 인벤토리 0매 → 구매 씬 복귀.
6.3. **5매 통째 선택 (skip OFF, 2026-05-08 자동 전이 정합)**: Quick 5매 → 인벤토리 5매 raw → 격자 표시 + "선택 0/5" 헤더 → 사용자가 슬롯 5개 클릭 (예: gridIndex 17, 3, 50, 22, 8) → 5번째 클릭 시점 200ms 후 자동 confirm → drawOne 5회 연속 호출 + ticket 5매 lockedResult 부여 (선택 순서 그대로) + 격자 종료 → 페이지플립 패널 진입 → 카드 1장씩 reveal → 5번째 reveal 후 인벤토리 0매 → 구매 씬 복귀. 갤러리는 매 reveal마다 1매씩 갱신.
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
7.9. 라인업 등급별 매수 합 ≠ `lineup.boxSize` → 부팅 실패 (02_data 1.4-DB.2.1 / 1.4-OP.2.1).
7.10. 뜯기 애니메이션 도중 사용자가 탭 전환 → 결과 영속 보장. M2.1 B-α: skip OFF는 "확인" 버튼 시점 (drawOne N회 + lockedResult 부여 + 영속). skip ON은 페이지플립 시작 시점 (drawOne 1회 + 즉시 reveal).
7.11. **M2.1 B-α: 통 선택 격자 표시 중 새로고침** → 사용자 슬롯 선택 상태 폐기 (메모리 전용). 인벤토리 raw ticket 그대로 영속됨 (lockedResult: null) → 새로고침 후 격자 다시 표시. 사용자 처음부터 다시 선택.
7.11.b. **M2.1 B-α: "확인" 클릭 후 reveal 전 새로고침** → ticket.lockedResult 영속 → 새로고침 시 b2 분기 진입 (페이지플립 카드 표시). 사용자 reveal 진행. 박스 deck splice + lockedResult 영속이 함께 일어나므로 결정론 / 박스 상태 정합 안전.
7.12. **M2.1: 통 선택 격자에서 잔여 슬롯이 인벤토리보다 적은 경우** (예: deck 잔여 3 + 인벤토리 raw 5) → 시뮬레이터 부팅 실패 또는 인벤토리 자동 정리. 정상 흐름에서 발생 불가 (구매 검증 5.9.3 invariant). 발생 시 storage corruption → 마이그레이션 처리.
7.13. **M2.1 B-α: skip 토글 + 격자 표시 중** → 5.14.6.5 분기 (사용자 선택 폐기 + splice(0) N회 + lockedResult 일괄 + peel 진입). reveal 진행 중 (pendingPeelResult) 토글은 다음 사이클에 적용.
7.14. **M2.1 B-α: 격자에서 사용자가 선택을 N개보다 적게 한 상태에서 다른 액션** (탭 전환 / 박스 리셋 / 시드 변경) → 사용자 선택 메모리 폐기. 박스 리셋 / 시드 변경은 인벤토리도 폐기. 탭 전환은 인벤토리 raw 보존, 다시 격자 진입 시 처음부터 선택.
7.15. **M3: 라인업 전환 시 진행 중 reveal** → confirmModal에서 사용자에게 명시 (메모리 only state 폐기 안내). 사용자가 확인 시 `pendingPeelResult` / `selectedGridIndices` 폐기. 영속 데이터(history / inventory / DC / box) 라인업 A 공간 그대로 유지. 라인업 B 공간 로드.
7.16. **M3: 라인업 전환 시 새로고침 직후 (`kuji_current_lineup_id` 부재)** → `LINEUP_DEFAULT_ID` (드래곤볼) 부여. 다른 라인업 데이터는 격리 키에 그대로 유지 (다음 전환 시 복원).
7.16.1. **M3: 라인업 X가 LINEUPS 배열에서 미발견** (예: M5에서 라인업 X 추가 후 다시 M3 코드로 회귀, 또는 `kuji_current_lineup_id`에 알 수 없는 ID가 영속됨) → `getLineupById`가 `LINEUP_DEFAULT` 반환 + `console.warn`. **사용자 데이터 처리**: X의 격리 키 (`kuji_history_X`, `kuji_unopened_tickets_X` 등) 그대로 잔존 (폐기 X). 활성 라인업만 `LINEUP_DEFAULT_ID`로 복귀. 다음에 X 라인업이 LINEUPS 배열에 다시 추가되면 자동 복원.
7.17. **M3: 마이그레이션 v3 → v4 도중 일부 키 이전 실패** → 다음 부팅 시 `kuji_schema_version` 미존재 또는 < 4 + source 키 잔존 detect → 재시도. 멱등 정합 (이미 이전된 키는 source 기준 미존재이므로 건너뜀).
7.18. **M3: 라인업별 가변성** → 등급 수 (드래곤볼 10등급 vs 원피스 9등급), 등급별 매수, type_count, DC winnersTotal 모두 다름. render 모듈은 `lineup.tiers.length` 동적 처리 (활성 lineup 객체 = `LINEUPS[state.currentLineupId]`). 하드코딩 발견 시 단계 6 검증 fail.

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
8.13. 2026-05-08: **M3 단계 2 design**. (1) 5.13.A **다중 라인업 절 신설** (5.13.A.1 활성 라인업 / 5.13.A.2 격리 정책 / 5.13.A.3 헤더 라벨 / 5.13.A.4 설정 탭 dropdown / 5.13.A.5 자산 fallback / 5.13.A.6 라인업 추가 절차). (2) 4장 헤더에 라인업 IP 라벨 추가 + 설정 탭에 'Lineup' 섹션 추가. (3) 7.15~7.18 엣지 케이스 신설 (전환 시 진행 중 reveal / 새로고침 / 마이그레이션 실패 / 라인업 가변성). 사용자 결정 4건 정합 (전환 UI A / 격리 정책 A1 / 정리 라운드 A / kuji_seed 공유 A / 헤더 라벨만 A / 자산 SVG fallback A).
8.14. 2026-05-08: **M3.1 단계 2 design - 라인업 로비 + tier_class**. (1) 4장 view 모델 신설 (state.view ∈ {'lobby', 'main'}) + [로비 view] 화면 구성 추가 + 4.1 첫 진입 흐름 갱신 (면책 → 로비 → 라인업 선택 → 추첨) + 4.4 view 전환 dispatch 신설. (2) 5.13.A.3 헤더 라벨 클릭 활성 (M3 보수 정책 폐기, 로비 복귀 진입). (3) 5.13.A.4 설정 탭 dropdown 위상 변경 = quick-switch 보조 경로. 5.13.A.4.5 "라인업 선택 화면으로" 버튼 추가. (4) 5.13.A.6.4 라인업 추가 절차에 tier_class + lobbyHeroAssetPath 항목 추가. (5) **5.13.B 라인업 로비 절 신설** (5.13.B.1 목적 / 5.13.B.2 view 모델 / 5.13.B.3 진입 흐름 / 5.13.B.4 카드 구성 + 메인 상품 미리보기 산출식 / 5.13.B.5 보조 진입 경로 / 5.13.B.6 dispatch 신규 (open_lobby / enter_lineup) / 5.13.B.7 자산 정책 / 5.13.B.8 비목표). 사용자 결정 5건 정합 (전체 화면 view / 드롭다운 quick-switch 유지 / 토글 미도입 / hero 1개 미리보기 / 헤더 라벨 클릭 활성).
8.15. 2026-05-09: **M3.2 단계 2 design - tier_class 시각 적용 (round 1 정정 흡수)**. (1) 5.13.C 절 신설 (5.13.C.1 목적 / 5.13.C.2 추첨 탭 액센트 + CSS 셀렉터 매트릭스 + PEEL 글로우 충돌 회피 / 5.13.C.3 결과 reveal hero 모션 분기 + DC 모달 정합 / 5.13.C.4 비목표). (2) 5.13.B.8.3 "본편 tier_class 시각 적용 → M3.2에서 흡수" 갱신. (3) **round 1 P0 2.1 정정** - "결과 모달" 표현 → "결과 reveal" / 페이지플립 인플레이스 (`peel-card.js`, 5.13.C.1 + 5.13.C.3). M2 K-1 정합 (8.8). DC 결과 모달은 그대로 유지(`dc-result-modal.js`, 4장 모달 목록). (4) 5.13.C.3.1 OR 분기 의도(Last One redundant) 박제. lookup 주체 = 결과 표시 영역 명시. 사용자 결정 4건 정합 (DC 모달도 hero / minor-row 속성만 / 약한 골드 글로우 / lookup 헬퍼).
8.16. 2026-05-09: **M3.3 단계 2 design - tier_class 갤러리 그룹화 + history 대시보드**. (1) 5.13.D 절 신설 (5.13.D.1 목적 / 5.13.D.2 갤러리 섹션 헤더 + 정렬 + Last One 위치 / 5.13.D.3 history 대시보드 + 카드 시각 매트릭스 / 5.13.D.4 비목표). 사용자 결정 5건 정합 ("메인 등급/표준 등급/굿즈" 라벨 / 2x2 모바일 그리드 / hero→main→goods 정렬 / Last One hero 마지막 / 통합 카운트).

8.18. 2026-05-10: **M4 단계 2 design - 메뉴 재설계 (홈 격상 + 4탭 → 3탭)**. (1) 4장 view 모델 갱신: lobby → home 의미 격상. 4탭 → 3탭 (추첨 / 갤러리+기록 / 설정). state 키 명 currentTab → activeTab 갱신 (단계 4 코드 식별자 개명). (2) 5.13.A.4 설정 탭 dropdown quick-switch 폐기. (3) 5.13.A.3 헤더 IP 라벨 클릭 = 홈 복귀. (4) 5.13.B 라인업 로비 → 쿠지 홈 격상. 카드 메타 풍부화 (출시일 + 끝일 + 가격 + 매장 + 진행 상태) + 5.13.B.4.3 산출식 박제. (5) 5.13.B.6 dispatch 갱신 (open_home + set_active_tab 신설 / set_current_lineup 폐기). (6) 5.13.D.4 비목표 갱신. (7) **5.13.F 통합 탭 절 신설** (대시보드 + 갤러리 + history 리스트 무한 스크롤 + DC sub-section 4). 사용자 결정 5건 + 단계 1 채택 2건 (10.3/10.4) + **round 2 채택 6건** (10.1/10.2 권고 / 10.5 별도 M4.1-tidy / 10.7 IP 라벨 클릭만 / DC = sub-section 4 / history = 무한 스크롤 / "홈으로" 라벨). **round 1 P0 3건 정정 (round 2 박제)**: P0-1 currentTab vs activeTab 통일 / P0-2 arch 3.11 view/탭 4탭 enum → 3탭 home 갱신 / P0-3 SCHEMA_VERSION v5 → v6 + 02_data 3.2.7 마이그레이션 절 + 3.1.2 home_acked 키 + active_tab 키 박제.

8.17. 2026-05-10: **M3.5 단계 2 design - tier_class 라인업별 자율 분류 (원피스 B~F hero)**. (1) 5.13.E 절 신설 (5.13.E.1 목적 / 5.13.E.2 검증식 룰 완화 / 5.13.E.3 영향 매트릭스 / 5.13.E.4 비목표). (2) 02_data 1.4.A.3 검증식 룰 main ≥ 1 제거. 1.4.A.4 분류 정책 라인업별 자율 명문화. 1.4-OP.2 등급표 B/C/D/E/F tierClass main → hero 변경. 사용자 결정 5건 정합 (변경 의미 / 포함 범위 / DB 정합 / 검증식 / 라이브 검수 시점). **round 1 P0 정정 (2026-05-10 round 2)**: hero-carousel/minor-row 분기 식이 count 기반(`count === 1` / `count >= 2`)이라 tierClass 변경만으로 시각 자동 정합 미성립. (b) 분기 식을 tierClass 기반으로 변경 채택 (round 1 답 = `tierClass === HERO` / `tierClass === GOODS`). spec 5.13.E.3 + 5.13.E.4 + arch 5.18 + plan 4.8/8.3 정합 갱신. dc-result-modal 행 추가. **round 2 P0 재정정 (2026-05-10 round 3)**: round 2 채택 `tierClass === HERO` 분기 식이 드래곤볼 hero-carousel 6→1 등급 회귀 야기 (비목표 4.1 위반). round 3 = `t.tierClass !== TIER_CLASS_GOODS && t.tier !== "Last One"` 재채택. 드래곤볼: A/B/C/D/E/F (hero+main 6) / 원피스: A/B/C/D/E/F (hero 6) 양쪽 동등. minor-row는 round 1 답 그대로 (`tierClass === GOODS`) 유지. spec 5.13.E.3을 라인업별 컬럼(드래곤볼/원피스)으로 갱신.

8.19. 2026-05-10: **M4.1 단계 2 design - 진입 정책 보정 (홈 = 1급 entry 탭 + 4탭 환원 + view 모델 폐기)**. **트리거** = M4 종료 직후 사용자 발화: "기본적으로 진입하면 쿠지 홈이 있어야 하고, 내가 원하는 쿠지를 선택해서 게임을 진행하는 방식이어야 해. 근데 쿠지 종류를 선택하는게 너무 어려워." (1) 4장 라우팅 모델 전면 갱신: state.view 모델 폐기 + activeTab 단일 라우팅 + 4탭 환원 (홈 / 추첨 / 갤러리+기록 / 설정). 첫 진입 / 재방문 모두 홈 탭 자동 활성. 4.4 view 전환 dispatch 의미 갱신 (activeTab 라우팅). (2) 5.13.A.1.3 활성 라인업 전환 = 홈 탭에서만 (의미 답습). (3) 5.13.A.3 헤더 IP 라벨 클릭 affordance 폐기 (자비스 단계 1 결정 4.1.A 채택). 모든 탭에서 헤더 라벨 노출. (4) 5.13.A.4.5 설정 탭 "홈으로" 버튼 의미 갱신 (open_home → activeTab = home). (5) 5.13.B 전면 갱신: B.1 목적 재기술 / B.2 라우팅 모델 (view 폐기) / B.3 진입 흐름 (재방문도 홈 자동) / B.4.6 isCurrent 분기 (homeAcked 분리) / B.5 진입 경로 (하단 탭 1차 + 설정 보조 + 헤더 폐기) / B.6 dispatch (open_home / enter_lineup / set_active_tab 의미 갱신) / B.8.6 비목표 추가 (헤더 외 진입점 / 빈 화면 view / 매 진입 면책 / M5 분리). (6) 5.13.F 탭 위치 갱신 (탭 2 → 탭 3, 통합 자산 보존). 자비스 단계 1 결정 4.1.A/4.2.A/4.3.A 채택 (헤더 클릭 폐기 / 면책 1회만 / STATE_VIEW 폐기). 사용자 결정 3.1/3.2/3.3 (재방문 시도 홈 / Q1=A안 / Q2=M4.1).
