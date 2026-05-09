# M3.1 lineup-presentation 단계 8 improve

작성일: 2026-05-08.
M3.1 스프린트 종료 + 차기 사이클 후보 등재.

# 1. M3.1 종료 요약

## 1.1. 산출물

| 단계 | 산출물 | 결과 |
|---|---|---|
| 1 plan | [01_plan.md](01_plan.md) | 사용자 승인 + 9.1~9.5 결정 5건 박제 |
| 2 design | 02_data.md (1.4.A / 1.4.B / 1.5 / 3.1.2 / 3.2.6) + 01_spec.md (4장 view / 5.13.A.3-4 / 5.13.B 신설) | 매직 넘버 0개 통과 |
| 3 design_review | [03_design_review.md](03_design_review.md) round 1 | P0 0 / P1 1 / P2 6 → 통과 (P1-1 단계 4 흡수) |
| 4 impl_plan | [04_impl_plan.md](04_impl_plan.md) + 03_architecture.md (3.10.M3.1 / 3.17~3.22 / 4.M3.1 / 4.M3.5 / 4.M3.1.B / 5.13~5.15 / 6.8) | T1~T10 분할 + design_review 이월 8건 답 박제 |
| 5 implement | T1~T10 모두 적용 | 매직 넘버 0개 + core/ DOM 0건 |
| 6 impl_review | [06_impl_review.md](06_impl_review.md) round 1 | P0 0 / P1 0 / P2 3 → 통과 |
| 7 qa | [07_qa.md](07_qa.md) | 자비스 정적 정합 통과 + 사용자 라이브 검수 의무 분리 |
| 8 improve | 본 문서 | 작성 완료 |

## 1.2. 코드 변경 합산

- **data**:
  - `numbers.js`: TIER_CLASS_HERO/MAIN/GOODS + TIER_CLASS_VALUES / STATE_VIEW_LOBBY/MAIN/VALUES/DEFAULT / DISPATCH_TYPE_OPEN_LOBBY/ENTER_LINEUP / LOBBY_GRID_COLS_MOBILE/TABLET / LOBBY_TABLET_BREAKPOINT_PX / SCHEMA_VERSION 4→5 / 라인업별 DC_TIER_CLASS + LOBBY_HERO_ASSET_PATH / TIERS_DRAGONBALL + TIERS_ONEPIECE 각 항목에 tierClass 추가 / LINEUP 객체에 dc.tierClass + lobbyHeroAssetPath 매핑 / 1.4.A.3 검증식 부팅 호출.
  - `storage.js`: GLOBAL_KEYS.lobbyAcked / migrateV4ToV5 / loadGlobalSettings 역직렬화 / saveGlobalSettings 직렬화 / loadState chain.
- **core**:
  - `lobby-preview.js` 신설 (heroPreview).
- **render**:
  - `lobby.js` 신설 (renderLobby + renderLobbyCard).
  - `main.js`: state.view + lobbyAcked + view 라우팅 + dispatch.open_lobby + dispatch.enter_lineup 분기 A/B + bootstrapState + persist 갱신.
  - `header.js`: IP 라벨 button + 클릭 활성.
  - `settings-tab.js`: "라인업 선택 화면으로" 버튼.
- **styles**: main.css에 .lobby* 클래스 + .settings-lobby-button + .app-lineup-ip 갱신.
- **tests**: 3개 suite 신설 (tier_class / storage_v5 / lobby_flow) + runner.js 등록.
- **docs**: 01_spec / 02_data / 03_architecture / pipeline/M3.1-lineup-presentation/01~08.

## 1.3. 단계 3/6 격리 검증 사이클

| 단계 | 라운드 | 결함 | 결과 |
|---|---|---|---|
| 3 | round 1 | P0 0 / P1 1 / P2 6 | **통과** |
| 6 | round 1 | P0 0 / P1 0 / P2 3 | **통과** |

**M3 (round 3) + M2.1 (round 5) 대비 가장 빠른 통과 패턴**. 단계 3/6 모두 round 1.

## 1.4. 사용자 결정 5건 박제 정합

| # | 결정 | 적용 위치 |
|---|---|---|
| 9.1 | 전체 화면 view (state.view) | 02_data 1.4.B / spec 5.13.B.2 / numbers.js / main.js view 라우팅 |
| 9.2 | 드롭다운 quick-switch 유지 | settings-tab.js dropdown + main.js dispatch.set_current_lineup |
| 9.3 | 토글 미도입 | 5.13.B.3.3 명시 / 코드 영역 0 |
| 9.4 | hero 1개 미리보기 | core/lobby-preview.heroPreview / lobby.js card 5번 영역 |
| 9.5 | 헤더 라벨 클릭 활성 | header.js + .app-lineup-ip CSS |

## 1.5. design_review 이월 8건 답 정합

| # | 항목 | 답 적용 위치 |
|---|---|---|
| 2.1 | P1-1 enter_lineup 분기 A/B | main.js dispatch.enter_lineup 분기 |
| 2.2 | P2-1 03_architecture 갱신 | 단계 4 일괄 작성 |
| 2.3 | P2-2 CTA 색 = COLOR_FRAME_RED | render/lobby.js + .lobby-card-cta CSS |
| 2.4 | P2-3 saveState 객체 인자 | main.js / storage.js 호출처 모두 객체 인자 |
| 2.5 | P2-4 라인업 추가 절차 SSOT | 02_data 8단계 채택 (코드 영역 0) |
| 2.6 | P2-5 lobbyAcked 직렬화 string | storage.js String(Boolean) + === "true" |
| 2.7 | P2-6 첫 방문자 isCurrent 조건 | render/lobby.renderLobby line 33 |
| 2.8 | 단위 테스트 신설 | T7 / T8 / T9 |

# 2. 단계 6 P2 결함 3건 처리 결정

## 2.1. P2-1. storage_v5.test.js v3 fixture chain 통합 시나리오 부재

- 현황: chain 자체는 storage.js loadState() 코드로 보장 (line 354 migrateV3ToV4 → line 358 migrateV4ToV5 순차).
- 결정: **차기 사이클 백로그 등재** (M3.2 또는 라인업 추가 사이클의 단계 5 단위 테스트 보강 항목).
- 우선순위: P2 (정보성).

## 2.2. P2-2. document.createElement("main")의 "main" 인라인

- 현황: HTML5 시멘틱 태그명. 매직 넘버 룰 위반 아님.
- 결정: **정정 불요**. 03_architecture 5.15에 의도적 인라인 OK 명시.

## 2.3. P2-3. lobby-preview.js의 "Last One" 인라인

- 현황: 기존 코드베이스 전반 컨벤션 답습 (history.js / main.js / draw.js 동일 패턴).
- 결정: **차기 정리 라운드 백로그 등재**. LAST_ONE_TIER_NAME 상수화는 본 사이클 비목표.

# 3. 자비스 사용자 결정 게이트 (단계 8 → 종료)

3.1. **사용자 라이브 검수 결과 보고 의무** (07_qa 4장):
- tests/test.html ALL PASS 확인.
- 첫 방문 / 재방문 / 분기 A/B / 헤더 라벨 / 설정 탭 / 768px 반응형 / placeholder fallback.
- 결함 발견 시 단계 7 round 2 또는 단계 5 재진입.

3.2. **결함 0건 보고 시** M3.1 정식 종료 + 차기 사이클 진입.

# 4. 차기 사이클 후보 (M3.1 비목표 + 단계 6 P2)

## 4.1. 즉시 후보 (M3.2 또는 다음 라인업 사이클 직전)

4.1.1. **본편 화면(추첨/기록/DC)의 tier_class 시각 적용** (M3.1 비목표 5.13.B.8.3):
- hero/main/goods 별 카드 강조 차별화.
- 결과 모달 hero 등급 시 특별 모션.
- 갤러리에 클래스별 그룹화 옵션.

4.1.2. **storage_v5.test.js v3 fixture chain 통합 시나리오 추가** (단계 6 P2-1).

4.1.3. **LAST_ONE_TIER_NAME 상수화 정리 라운드** (단계 6 P2-3): "Last One" 문자열 인라인 5+ 곳 일괄 상수화.

## 4.2. 메이저 사이클 후보 (M4)

4.2.1. **コトブキヤくじ アイドルマスター XENOGLOSSIA 30연 천장 룰** (확장 로드맵 M3 항목, 첫 메커닉 분기):
- core/draw.js에 천장 카운터 도입.
- 30연 도달 시 S賞 확정 lock 분기.
- spec 5.x 천장 메커닉 절 신설.
- storage v6 마이그레이션 (천장 카운터 영속).

4.2.2. **Happyくじ PIXAR 13등급 확장 검증** (확장 로드맵 M4): 등급 수 가변성이 13까지 정합한지 검증.

4.2.3. **세가 럭키쿠지 잔여 카운터 UI 모드** (확장 로드맵 M5).

## 4.3. 자산 외부 작업 (사용자 의무)

4.3.1. assetsAvailable=false 라인업의 placeholder webp 배치:
- `assets/products/the_chronicle_of_goku_placeholder/lobby_hero.webp`
- `assets/products/monkey_d_luffy_placeholder/lobby_hero.webp`
- 사용자 외부 도구 (Midjourney 등) 생성 + 라이선스 안전 검증.
- 배치 후 numbers.js의 LINEUP_*_ASSETS_AVAILABLE = true 갱신.

## 4.4. 라인업별 IP 액센트 색 토큰

4.4.1. 단계 4 이월 결정 P2-2에서 본 사이클은 공통 브랜드 빨강 채택. 차기 사이클에 IP 액센트 도입 검토 (라인업 N≥3 시 의미 강해짐).

# 5. M3.1 학습 / 다음 사이클 정합 권고

5.1. **단계 3/6 round 1 통과 패턴**: M2.1 (round 3-5) 대비 round 1 통과는 design 단계 정밀도 향상 + design_review 이월 답을 단계 4에서 박제하는 패턴이 효과적이었음. 다음 사이클도 답습.

5.2. **사용자 결정 박제 정밀도**: plan 9.1~9.5 단계에서 5건 권장안 일괄 답변 받은 것이 design / impl_plan 진행을 매끄럽게 함. 향후 사이클도 plan 마지막에 결정 게이트 항목을 명시.

5.3. **dispatch 분기 매트릭스**: 03_architecture 4.M3.1.B에 dispatch 사용 매트릭스 표 (open_lobby / enter_lineup A/B / set_current_lineup)를 박제한 것이 단계 6 검증을 단순화. 차기 사이클도 dispatch 매트릭스 표 의무.

# 6. PROGRESS 갱신 권고

6.1. PROGRESS.md `# 1. 현재 상태`: M3.1 종료 (단계 8 통과) + 다음 사이클 결정 대기.
6.2. `# 6. 백로그`에 4.1.1 (본편 tier_class 시각) / 4.1.2 (v3 chain 테스트) / 4.1.3 (LAST_ONE 상수화) 등재.

# 7. 변경 이력

7.1. 2026-05-08: 초기 작성. M3.1 종료 + 차기 사이클 후보 등재. 단계 6 P2 3건 처리 결정 박제. 사용자 라이브 검수 결과 대기.
