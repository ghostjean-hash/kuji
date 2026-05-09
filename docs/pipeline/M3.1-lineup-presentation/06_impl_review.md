# M3.1 lineup-presentation 단계 6 impl_review

작성일: 2026-05-08.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 1 (round 1 통과).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | **0** | **0** | 3 | **통과** |

P0/P1 0건 → 단계 7 QA 사용자 라이브 검수 진입 가능. P2 3건은 정보성, 단계 8/차기 사이클 백로그.

# 2. 검증 카테고리

2.1. CLAUDE.md 4장 절대 규칙 (4.1 게임 로직/렌더 분리 / 4.2 매직 넘버 / 4.3 core DOM 0 / 4.4 테스트 갱신 / 4.5 docs↔code / 4.6 사행성 표현 / 4.7 8단계 / 4.8 데이터 신뢰도).
2.2. 03_architecture 단계 6 게이트 (5.13 lobbyAcked + view 매트릭스 / 5.14 tier_class 검증식 / 5.15 매직 넘버 grep).
2.3. spec ↔ 코드 1:1 정합 (5.13.A / 5.13.B / 4장 view).
2.4. design_review 이월 8건 답 정합.
2.5. 결정론 / 회귀 위험.

# 3. 통과 항목

3.1. **CLAUDE.md 4.1**: src/core/lobby-preview.js DOM 0건 + lineup 인자 단일 입력 결정론.
3.2. **CLAUDE.md 4.2 매직 넘버 0개**: "hero" / "main" / "goods" / "lobby" / "open_lobby" / "enter_lineup" 모두 numbers.js 1곳 + 호출처 상수 import. "kuji_lobby_acked"는 storage.js GLOBAL_KEYS.lobbyAcked 1곳. 768/1/2는 numbers.js LOBBY_TABLET_BREAKPOINT_PX / LOBBY_GRID_COLS_*.
3.3. **CLAUDE.md 4.3**: src/core/*.js의 import + document/window/localStorage/Canvas grep 0건.
3.4. **CLAUDE.md 4.4**: T7/T8/T9 신설 + tests/runner.js 등록 정합 (19개 suite).
3.5. **CLAUDE.md 4.5**: spec / 02_data / 03_architecture ↔ 코드 1:1 정합.
3.6. **CLAUDE.md 4.6**: "확률 향상" / "필승" 표현 0건.
3.7. **CLAUDE.md 4.7**: 단계 1~5 모두 사용자 승인/통과 보고서 보유.
3.8. **CLAUDE.md 4.8**: count_estimated:true / boxSizeEstimated 보존.
3.9. **5.13 lobbyAcked + view 매트릭스**: migrateV4ToV5 호출 / 빈 storage → false 부여 / bootstrapState view 결정 / lobby view 시 본편 미렌더 / open_lobby no-op / enter_lineup 분기 A/B 의도 분리 / lobbyAcked 직렬화-역직렬화 정합. 모두 통과.
3.10. **5.14 tier_class 검증식**: numbers.js _validateLineupTierClass 부팅 호출 + TIER_CLASS_VALUES 외 0 + DC.tierClass 검증 + hero/main/goods 각 ≥ 1 + heroPreview Last One 제외. T7 단위 테스트 모두 커버.
3.11. **5.15 매직 넘버 grep**: 4.2와 동일.
3.12. **spec ↔ 코드 1:1**: 5.13.B.4.2 카드 6요소 / 5.13.B.4.3 heroTiers / 5.13.B.4.4 isCurrent / 5.13.B.6.1 open_lobby / 5.13.B.6.2 enter_lineup A/B / 5.13.A.4.5 버튼 / 5.13.A.3.2 헤더 라벨 정합.
3.13. **design_review 이월 8건 답 정합**: P1-1 분기 / P2-2 CTA 색 / P2-3 saveState 객체 / P2-5 직렬화 / P2-6 isCurrent 모두 코드 정합.
3.14. **결정론 / 회귀**: M3 set_current_lineup 흐름 보존 / M2.1 통 선택 흐름 보존 / 기존 테스트 16건 유지 + 3건 추가 / heroPreview PRNG 의존 0.
3.15. **CSS 디자인 토큰 정합**: lobby 스타일 모든 var(--*) 토큰이 styles/tokens.css 정의 보유. 인라인 매직 값 0건.
3.16. **PROGRESS.md M3.1 절 신설**: T10 정합.

# 4. P0 결함

없음.

# 5. P1 결함

없음.

# 6. P2 결함 3건 (정보성)

## 6.1. P2-1. storage_v5.test.js v3 fixture chain 통합 시나리오 명시 부재

위치: `tests/suites/storage_v5.test.js`.

내용: 02_data 3.2.6 "테스트 의무" 4건 중 "v3 fixture → v3→v4→v5 chain 적용 후 lobbyAcked=true" 시나리오가 명시 작성되지 않음. 빈 storage / v4 fixture / v5 멱등 / lobby_acked 이미 존재 4종은 커버. v3 chain은 storage_v4.test.js의 v3→v4 + storage_v5.test.js의 v4→v5 단독으로 간접 커버.

권고: 차기 사이클 또는 단계 8 개선 백로그. chain 자체는 storage.js loadState() 안에서 v2→v3→v4→v5 순차 호출이 코드로 보장됨 (line 358 migrateV4ToV5 호출이 line 354 migrateV3ToV4 직후). 단계 6 통과 차단 사유 아님.

## 6.2. P2-2. document.createElement("main")의 "main" 인라인

위치: `src/render/main.js:168`.

내용: HTML5 시멘틱 태그명 "main"은 STATE_VIEW_MAIN 상수와 동일 문자열이라 grep 시 혼동 여지. 의도적 인라인 (HTML 태그명) - 매직 넘버 룰 위반 아님.

권고: 정정 불요. 검증 카테고리 5.15에 의도적 인라인 OK 명시.

## 6.3. P2-3. lobby-preview.js의 "Last One" 인라인

위치: `src/core/lobby-preview.js:17`.

내용: `t.tier !== "Last One"` 비교에서 "Last One" 인라인. spec/data 어디에도 LAST_ONE_TIER_NAME 상수 없으며, 본 컨벤션은 history.js / main.js / draw.js 등 기존 코드베이스 전반에 인라인. M3.1 신설 코드의 신규 매직 넘버 위반 아님 (기존 컨벤션 답습).

권고: 차기 사이클에 LAST_ONE_TIER_NAME 상수화 정리 라운드 검토 (M3.1 비목표 수준).

# 7. 통과 판단

P0 0건 + P1 0건 → **통과**. 단계 7 QA 사용자 라이브 검수 진입.

[의견] M3.1은 M2.1 라이브 정정 사이클의 학습(매직 넘버 / 분류 격리 / saveState 객체 인자 / 직렬화 정책)을 전부 흡수한 정합 모범 사이클. 단계 3 P0 0건 → 단계 6 P0 0건 stream을 유지. M3 단계 6 round 1 통과 패턴 + M2.1 단계 6 round 3 통과 패턴 모두 흡수.

# 8. 단계 7 QA 사용자 검수 권고 항목 (브라우저 라이브 검수 의무)

8.1. **첫 방문 시나리오**: localStorage 비움(또는 시크릿 모드) 후 진입 → 면책 모달 → **로비 화면 카드 그리드** 노출. 카드 6요소 (placeholder hero + 한국어 제목 + IP 라벨 + 메타 한 줄 + 메인 상품 미리보기 + CTA) 시각 확인. "현재" 배지가 모든 카드에서 미노출 (lobbyAcked === false 조건).

8.2. **카드 클릭 → main view 진입**: 라인업 카드 클릭 → main view 4탭 모델 노출. lobbyAcked = true 영속 (다음 새로고침 시 로비 미노출).

8.3. **재방문자 시나리오**: lobbyAcked=true 상태에서 새로고침 → 마지막 라인업 main view 자동 진입. 로비 미노출.

8.4. **헤더 IP 라벨 클릭 → 로비 복귀**: 진행 중(reveal 또는 격자 선택) 헤더 IP 라벨 클릭 → 로비 화면. 같은 라인업 카드 클릭 (분기 A) → reveal/격자 그대로 보존.

8.5. **다른 라인업 카드 클릭 (분기 B)**: 라인업 전환 + 새 라인업 공간 격리 확인. 메모리 only state 폐기.

8.6. **설정 탭 quick-switch (set_current_lineup)** vs **설정 탭 "라인업 선택 화면으로" (open_lobby)** 둘 다 동작. 전자는 main 유지 / 후자는 로비 진입.

8.7. **모바일 1열 / 태블릿 2열 반응형**: 768px breakpoint 기준 시각 검수.

8.8. **assetsAvailable=false placeholder gray + IP 라벨 fallback** 시각 확인.

8.9. **빈 storage 첫 방문에서 원피스(non-default) 카드 선택 → 분기 B 정합**: 새 라인업 공간 정상 로드.

8.10. **tests/test.html 모든 suite ALL PASS** (브라우저 실행).

# 9. 변경 이력

9.1. 2026-05-08: round 1 검증 완료. P0 0건 + P1 0건 + P2 3건. 통과 판정. 단계 7 QA 진입.
