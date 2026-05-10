# M4.1 home-entry-fix - 03 design_review

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.1-home-entry-fix |
| 단계 | 3 design_review |
| 검증자 | 격리 subagent (general-purpose) |
| round | 1 |
| 검토 일자 | 2026-05-10 |
| 검토 산출물 | 단계 2 design (spec/data/arch 갱신 본문) |
| 결과 | **정정 필요** (P0 4건) |

# 1. 결과 요약

| # | 분류 | 건수 |
|---|---|---|
| P0 | 블로킹 | 4 |
| P1 | 보강 권고 | 3 |
| P2 | 선택 | 2 |

# 2. P0 결함 (블로킹)

## 2.1. P0-1 - arch 3.21 renderHome 명세 "헤더 IP 라벨 미렌더" 표기가 spec 5.13.A.3.3 / 5.13.B.2.3과 직접 충돌

### 2.1.1. 근거 (사실 인용)

`docs/03_architecture.md` 3.21 `renderHome` 함수 명세 (line 508):
```
//   레이아웃: 헤더 (시뮬레이터 타이틀, IP 라벨 미렌더) + 라인업 카드 그리드 + 푸터.
```

vs `docs/01_spec.md` 5.13.A.3.3 (line 270):
```
5.13.A.3.3. **M4.1 갱신**: 모든 탭에서 헤더 IP 라벨 노출. M4까지의 "홈 view 시 헤더 IP 라벨 미렌더" 정책 폐기 (view 모델 폐기 정합, 4장).
```

vs `docs/01_spec.md` 5.13.B.2.3 (line 304~306):
```
5.13.B.2.3. **모든 탭 공통 노출 컴포넌트 (M4.1 갱신)**:
- 헤더 = 활성 라인업 IP 라벨 (5.13.A.3, 클릭 affordance 폐기 - 표시 전용).
- 하단 탭 바 = 4탭 항상 노출.
- M4의 "home view 시 탭바 / 본편 컴포넌트 미렌더" 정책 폐기 (`5.13.B.2.3 v6` 폐기).
```

### 2.1.2. 영향

arch와 spec이 충돌하는 SSOT 결함. 단계 5 implement 진입 시 어느 SSOT를 따를지 불명. CLAUDE.md 4.5 "docs와 코드가 충돌하면 docs가 진실"는 docs 내부 충돌은 미해소. M4.1 핵심 정책(view 폐기 = 모든 탭 동등 노출) 정합 미달.

### 2.1.3. 정정 권고

arch 3.21 line 508 본문을 다음으로 정정:
```
//   레이아웃: **헤더 + 라인업 카드 그리드 + 푸터** (헤더는 render/main.js가 모든 탭에 공통 렌더하므로 본 함수 시그니처 외부. spec 5.13.A.3.3 / 5.13.B.2.3 정합).
```

또는 헤더가 renderHome 내부에 포함된다면 "활성 라인업 IP 라벨 표시 + 클릭 affordance 폐기"로 정정.

**트레이드오프**: 헤더 책임 분리(render/main.js 공통)가 명확해지나 단계 5 구현 시 헤더 모듈 호출처를 명시 의무. 본 사이클 단계 4 impl_plan에 흡수 가능.

## 2.2. P0-2 - arch 4.M3.1 부팅 절차 "view 결정" 단계 잔존

### 2.2.1. 근거 (사실 인용)

`docs/03_architecture.md` 4.M3.1 (line 642~664):
```
mount(rootEl):
  ...
  5. **view 결정 (M3.1 신설)**:
     - state.lobbyAcked === false → state.view = STATE_VIEW_LOBBY.
     - state.lobbyAcked === true → state.view = STATE_VIEW_MAIN (= STATE_VIEW_DEFAULT).
  6. rerender.
```

이는 02_data 1.4.B `STATE_VIEW_*` 4종 폐기 박제 + 5.20 게이트 "state.view 키 / view 라우팅 분기 잔존 0건"과 직접 충돌. M3.1 시점 본문이 M4.1 갱신 누락.

### 2.2.2. 영향

부팅 절차 SSOT 결함. arch 3.11 라우팅 단일화 본문은 갱신됐으나 4.M3.1 부팅 절차는 STATE_VIEW 잔존. M4.1 핵심 (view 폐기 = activeTab 단일 라우팅) 정합 미달. 단계 6 게이트 5.20 "STATE_VIEW_* 4종 잔존 0건 grep" 자기-충돌.

### 2.2.3. 정정 권고

arch 4.M3.1을 M4.1 부팅 흐름(arch 3.11에 박제된 4단계)으로 흡수 또는 본 절을 갱신:
1. loadState → activeTab / homeAcked / currentLineupId 복원.
2. activeTab 미존재 → STATE_TAB_DEFAULT = STATE_TAB_HOME.
3. homeAcked === false → 면책 모달 노출 → dismiss 시 homeAcked = true.
4. 라우팅 시작 (activeTab 분기).

마이그레이션 chain은 v3 → v7 (migrateV2ToV3 → migrateV3ToV4 → migrateV4ToV5 → migrateV5ToV6 → migrateV6ToV7) 순차로 수정.

**트레이드오프**: 본문 분량 증가하나 SSOT 정합 회복 + 5.20 게이트 자기-충돌 해소.

## 2.3. P0-3 - arch 4.M3.1.B "로비 ↔ main view 전환 흐름" 절 전체 폐기 누락

### 2.3.1. 근거 (사실 인용)

`docs/03_architecture.md` 4.M3.1.B (line 708~745) 전체가 STATE_VIEW_LOBBY / STATE_VIEW_MAIN / render/lobby.renderLobby / open_lobby / state.lobbyAcked 잔존:
```
부팅 (4.M3.1) → state.lobbyAcked === false → state.view = STATE_VIEW_LOBBY → render/lobby.renderLobby
사용자 카드 클릭 → dispatch.enter_lineup (3.20)
  분기 A 또는 B 적용 (lineupId 동일 여부)
  → state.view = STATE_VIEW_MAIN → main view 렌더
...
| `open_lobby` | 헤더 라벨 / 설정 탭 버튼 | main → lobby | 없음 | 없음 | 없음 |
| `enter_lineup` (분기 A 동일) | 로비 카드 (동일 라인업) | lobby → main | 없음 | 없음 | lobbyAcked 부족 시만 갱신 |
```

본 절이 M4.1 view 모델 폐기 + open_lobby 폐기(M4 = open_home 개명)를 반영하지 않음.

### 2.3.2. 영향

arch SSOT 결함 누적. dispatch 사용 매트릭스가 M3.1 시점 그대로. 단계 5 implement 진입 시 어느 매트릭스를 적용할지 불명. spec 5.13.B.5 + 5.13.B.6과 arch 4.M3.1.B 매트릭스 충돌.

### 2.3.3. 정정 권고

arch 4.M3.1.B 절 전면 폐기 표기 + M4.1 활성 탭 라우팅 매트릭스로 갱신 또는 절 자체 폐기 후 arch 3.19 / 3.20 / 3.20.M4.1 dispatch 명세를 SSOT로 채택.

추천 정정 (절 폐기 + 박제):
```
### 4.M3.1.B. ~~로비 ↔ main view 전환 흐름~~ (M4.1 폐기)

**M4.1 폐기**: state.view 모델 폐기 + open_lobby 폐기 (open_home 개명, arch 3.19) → 본 절 무의미.
M4.1 라우팅 흐름은 arch 3.11 (4단계 부팅) + 3.19~3.20.M4.1 dispatch 명세를 SSOT로 채택.
```

**트레이드오프**: arch 분량 감소 + SSOT 단일화. 단점 = 폐기 박제 가독성 위해 잔존 본문은 ~~ 처리 권고.

## 2.4. P0-4 - arch 5.13 + 5.15 게이트가 STATE_VIEW_LOBBY / STATE_VIEW_MAIN 잔존, 5.20 게이트와 자기-충돌

### 2.4.1. 근거 (사실 인용)

`docs/03_architecture.md` 5.13 (line 774~781):
```
5.13. **M3.1 lobbyAcked + view 매트릭스 (단계 6 신설)**:
- 부팅 시 schemaVersion < 5 → migrateV4ToV5 호출 정합. existingLineupId 부재 → lobbyAcked=false 부여.
- state.lobbyAcked === false 시 state.view = STATE_VIEW_LOBBY 강제.
- state.lobbyAcked === true 시 state.view = STATE_VIEW_MAIN default.
- view === STATE_VIEW_LOBBY 시 4탭 / 헤더 / 본편 컴포넌트 미렌더 정합.
```

`docs/03_architecture.md` 5.15 (line 791):
```
- "lobby" / "main" 문자열 리터럴은 STATE_VIEW_LOBBY / STATE_VIEW_MAIN 상수 경유. 값 자체 import 패턴 grep.
```

vs 5.20 (line 847):
```
- M4까지 STATE_VIEW_* 4종 (HOME/MAIN/VALUES/DEFAULT) 코드 잔존 0건 grep (자비스 단계 1 결정 4.3.A 채택).
```

5.13 / 5.15는 STATE_VIEW_* 잔존을 검증 의무로 박제, 5.20은 잔존 0건을 검증 의무로 박제. 단계 6 게이트 자기-모순.

### 2.4.2. 영향

단계 6 impl_review 진입 시 게이트 충돌. 5.13 통과 = 5.20 위반. 5.20 통과 = 5.13 위반. 사이클 단계 6 자동 fail.

### 2.4.3. 정정 권고

5.13 / 5.15 본문에 폐기 마크 + M4.1 갱신 박제:
```
5.13. **~~M3.1 lobbyAcked + view 매트릭스~~ (M4.1 폐기, view 모델 폐기 정합 - 5.20 흡수)**.

5.15. **M3.1 매직 넘버 grep (단계 6 신설 / M4.1 부분 폐기)**:
- ~~"lobby" / "main" 문자열 리터럴은 STATE_VIEW_LOBBY / STATE_VIEW_MAIN 상수 경유~~ (M4.1 폐기, 5.20 흡수).
- "open_lobby" / "enter_lineup" 문자열 리터럴은 ~~DISPATCH_TYPE_OPEN_LOBBY~~ DISPATCH_TYPE_OPEN_HOME / DISPATCH_TYPE_ENTER_LINEUP 경유.
- "hero" / "main" / "goods" 문자열 리터럴은 TIER_CLASS_HERO / TIER_CLASS_MAIN / TIER_CLASS_GOODS 경유 (잔존).
- ~~"kuji_lobby_acked" 키~~ → "kuji_home_acked" (M4 갱신).
- 768 / 1 / 2 (LOBBY_GRID_COLS_*) 잔존 (M4.1 추가 폐기 없음 - M4.2-tidy 후보).
```

**트레이드오프**: 게이트 폐기/갱신 박제로 SSOT 정합 회복. 단점 = M3.1 시점 게이트 의도 박제는 변경이력에 잔존 의무.

# 3. P1 결함 (보강 권고)

## 3.1. P1-1 - lobbyHeroAssetPath 키 개명 결정 미명시 (M4.1 본 사이클 vs M4.2-tidy)

### 3.1.1. 근거

spec 5.13.A.6.4 (line 291) / 5.13.B.4.2 (line 323) / 5.13.B.7.1 (line 381):
```
`lineup.homeHeroAssetPath` (M3.1 `lobbyHeroAssetPath` 개명 검토 - 단계 4)
```

02_data 1.4.0 (line 57) / 1.4-DB.5 (line 261) / 1.4-OP.5 (line 341)는 `lobbyHeroAssetPath` 잔존 (M3.1 본문 미갱신).

### 3.1.2. 영향

키명 SSOT 충돌. spec은 homeHeroAssetPath 권고, 02_data는 lobbyHeroAssetPath 잔존. 단계 4 impl_plan / 단계 5 implement 진입 시 어느 키를 사용할지 불명.

### 3.1.3. 정정 권고

[의견] 자비스 추천: M4.1 본 사이클은 **M4.2-tidy로 미루기**가 정합. 사유:
- 본 사이클 핵심 = 진입 정책 보정. 식별자 개명은 dead code 정리 영역.
- plan 9.1 M4.2-tidy 백로그가 본 류 dead 정리 후보 (lobby.js / lobby-preview.js 등 dead alias 포함).
- 키 개명은 storage 영속 키도 함께 갱신 의무이므로 마이그레이션 v8 비용 발생.

정정안: spec 5.13.A.6.4 / 5.13.B.4.2 / 5.13.B.7.1 본문을 "(키명은 lobbyHeroAssetPath 잔존, M4.2-tidy에서 homeHeroAssetPath 개명 결정)" 명시. 02_data는 변경 0.

**트레이드오프**: 본 사이클 분량 최소화 + M4.2-tidy 백로그 흡수 = 단점 = 사용자 인지에 lobby/home 혼재 잔존.

## 3.2. P1-2 - arch 3.10.M3.1 saveState 시그니처에 lobbyAcked 잔존 (homeAcked 통일 누락)

### 3.2.1. 근거

`docs/03_architecture.md` 3.10.M3.1 (line 292~294):
```
// **saveState 시그니처 객체 인자 명시** (P2-3 흡수):
//   saveState({ currentLineupId?, lobbyAcked?, ...라인업별 키들 })
//   currentLineupId / lobbyAcked는 saveGlobalSettings 경유, 라인업별 키는 saveStateForLineup 경유.
```

vs arch 3.11 영속 매트릭스 (line 329):
```
- 영속: ... `homeAcked` (M4.1 의미 변경 = 면책 동의 표시) / `activeTab` ...
```

3.10.M3.1은 lobbyAcked 잔존, 3.11은 homeAcked 사용. SSOT 충돌.

### 3.2.2. 영향

storage 모듈 시그니처가 모듈별로 다른 키명 사용 = 단계 5 implement 진입 시 호출처 grep 결과 충돌 가능.

### 3.2.3. 정정 권고

arch 3.10.M3.1 본문에 "M4 갱신: lobbyAcked → homeAcked (의미는 M4.1에서 변경 = 면책 동의 표시)" 박제 또는 saveState 시그니처 본문을 `homeAcked?`로 갱신.

**트레이드오프**: SSOT 정합 회복. 단점 = M3.1 시점 의도 박제는 변경이력에 잔존 의무.

## 3.3. P1-3 - arch 3.18 ~~set_current_lineup~~ 절 폐기 박제 잔존이 M4 영역, M4.1 추가 폐기 명시 부족

### 3.3.1. 근거

`docs/03_architecture.md` 3.18 (line 436~443):
```
## 3.18. ~~dispatch.set_current_lineup~~ (**M4 폐기** - enter_lineup 통합, 5.13.A.4.3)
```

본 절은 M4 폐기 박제. M4.1 본 사이클에서 추가 폐기 / 잔존 결정이 명시되지 않음.

### 3.3.2. 영향

본 사이클 영향 매트릭스 plan 6.1에는 dispatch.set_current_lineup 영향 0이지만 arch 본문은 미박제. 단계 5 implement 진입 시 본 dispatch가 M4.1에서 추가 변경 있는지 불명.

### 3.3.3. 정정 권고

arch 3.18 본문에 한 줄 추가:
```
## 3.18. ~~dispatch.set_current_lineup~~ (**M4 폐기 / M4.1 추가 폐기 0**)
```

또는 spec 5.13.B.6.4 박제 답습:
```
5.13.B.6.4. **`set_current_lineup` 폐기 (M4)**: 잔존. M4.1 추가 폐기 없음.
```

**트레이드오프**: SSOT 정합 회복. 단점 = 미세 변경.

# 4. P2 결함 (선택)

## 4.1. P2-1 - 02_data 1.1 SCHEMA_VERSION 본문 "v6 chain 보존" 표현 모호

### 4.1.1. 근거

02_data 1.1 (line 16):
```
| `SCHEMA_VERSION` | 7 | localStorage 스키마 버전. **M4.1 갱신 (2026-05-10)**: 진입 정책 보정으로 v7 증가 (`kuji_home_acked` 의미 변경 = 면책 동의 표시로만 잔존, 진입 흐름과 분리. 4탭 환원으로 영속 활성 탭 매핑은 v6 chain 보존). ...
```

"v6 chain 보존" 표현은 (a) v6 마이그레이션 chain이 v7에서도 적용된다는 의미인지 (b) v6 영속 값이 v7에서 그대로 valid라는 의미인지 모호.

### 4.1.2. 영향

P2 (가독성). 02_data 3.2.8 본문은 chain 정합 (v3→v4→v5→v6→v7) 명시. 충돌은 없음.

### 4.1.3. 정정 권고

본문 명시: "v6 영속 activeTab 값은 v7에서 valid 보존 (4탭 환원이 v6 3탭을 포함하는 superset)".

**트레이드오프**: 가독성 향상. 단점 0.

## 4.2. P2-2 - spec 5.13.B.4.6 / arch 3.21 isCurrent 분기에 "첫 방문자도 currentLineupId default가 활성 카드"의 사용자 인식 정합 박제 부족

### 4.2.1. 근거

spec 5.13.B.4.6 (line 347):
```
5.13.B.4.6. ... **M4.1**: home_acked 분기 조건 폐기 ... = `lineup.id === state.currentLineupId` 단독 ... 첫 방문자도 currentLineupId default(드래곤볼) = 활성 카드.
```

첫 방문자가 "현재" 배지 + 카드 보더 강조를 본 라인업으로 인식하는 것이 도메인 정합인지 명시 없음.

### 4.2.2. 영향

P2 (사용자 도메인 인식). 첫 방문자는 라인업 진행 0이므로 "현재" 배지가 사용자 인식상 위화감 가능. 단계 7 QA에서 라이브 검수 항목.

### 4.2.3. 정정 권고

spec 5.13.B.4.6에 [의견] 박제 또는 단계 7 QA 항목으로 등재. 본 사이클은 진행 0건 첫 방문자 시 "현재" 배지 노출 정책 동결 (M5+ 검토).

**트레이드오프**: 본 사이클 분량 0. 단점 = 사용자 라이브 검수에서 위화감 발견 시 보정 사이클 필요.

# 5. 검증 통과 항목

## 5.1. 1. SSOT 정합

- 1.1. 02_data 1.4.B 상수 (`STATE_TAB_HOME` / `STATE_TAB_DRAW` / `STATE_TAB_PRODUCTS_HISTORY` / `STATE_TAB_SETTINGS` / `STATE_TAB_VALUES` / `STATE_TAB_DEFAULT` / `DISPATCH_TYPE_OPEN_HOME` / `DISPATCH_TYPE_ENTER_LINEUP` / `DISPATCH_TYPE_SET_ACTIVE_TAB`)가 spec 4장 / 5.13.B / arch 3.11 / 3.19 / 3.20 / 3.20.M4.1에서 식별자 그대로 인용 - 변형/오타/누락 0건.
- 1.2. 폐기 박제 (`STATE_VIEW_HOME` / `STATE_VIEW_MAIN` / `STATE_VIEW_VALUES` / `STATE_VIEW_DEFAULT`) 02_data 1.4.B 표 + spec 5.13.B.2.1 + arch 3.11 line 303에 박제 (단, 5.13/5.15 게이트는 P0-4 결함).
- 1.3. 4탭 위치 표기 (홈=탭1 / 추첨=탭2 / 갤러리+기록=탭3 / 설정=탭4) spec 4장 + 02_data 1.4.B + spec 5.13.F.1 모두 정합.
- 1.4. M3 3탭 STATE_TAB_DEFAULT = STATE_TAB_DRAW의 M4.1 변경 (= STATE_TAB_HOME) 02_data 1.4.B + arch 5.20 박제.

## 5.2. 2. 마이그레이션 정합

- 2.1. 3.2.8 v6 → v7 chain (v3→v4→v5→v6→v7) arch 4.M3.1 + 02_data 3.2.8 의존성 박제. 단계별 멱등 게이트 명시.
- 2.2. home_acked 키/값 보존 + 의미만 변경 정책 02_data 3.2.8 (b) + arch 3.11 부팅 흐름 line 339~343 정합.
- 2.3. v7 신규 사용자 빈 storage 시 STATE_TAB_DEFAULT = STATE_TAB_HOME 부여 02_data 3.2.8 (c) + arch 3.11 line 341 정합.
- 2.4. kuji_view 키 안전 제거 02_data 3.2.8 (a) localStorage.removeItem 명시.

## 5.3. 3. dispatch 의미 갱신 정합

- 3.1. dispatch.open_home (arch 3.19) ↔ spec 5.13.B.6.1 일관 (state.activeTab = STATE_TAB_HOME 강제 + view 키 변경 폐기).
- 3.2. dispatch.enter_lineup (arch 3.20) ↔ spec 5.13.B.6.2 일관 (state.activeTab = STATE_TAB_DRAW 강제 + state.homeAcked = true).
- 3.3. dispatch.set_active_tab (arch 3.20.M4.1) ↔ spec 5.13.B.6.3 일관 (4탭 정합).
- 3.4. open_home과 set_active_tab(tab=HOME)의 의미 동등은 arch 3.20.M4.1 본문 + spec 5.13.B.5.1 + 5.13.B.6.3에 박제. 호출처 단일화 권고는 단계 4 결정으로 명시.

## 5.4. 4. 라우팅 정합

- 4.1. arch 3.11 라우팅 (line 331~336) 4탭 분기 모두 명시 (HOME → renderHome / DRAW / PRODUCTS_HISTORY → renderProductsHistoryTab / SETTINGS → renderSettingsTab).
- 4.2. 헤더 / 하단 탭 바 모든 탭 공통 노출 spec 4장 line 26~91 + spec 5.13.A.3.3 + arch 3.11 line 337에 일관 박제 (단, arch 3.21 line 508은 P0-1 충돌).
- 4.3. 첫 방문자 부팅 흐름 (homeAcked false → 면책 → homeAcked true → 홈 탭) arch 3.11 line 339~343에 4단계로 박제.
- 4.4. B-α 새로고침 복원 activeTab === STATE_TAB_DRAW 시에만 적용 arch 3.11 line 345에 명시.

## 5.5. 5. 사용자 결정 / 자비스 추천 정합

- 5.1. 사용자 결정 3.1 (재방문 시도 홈 entry) spec 5.13.B.3.2 + 02_data 1.4.B + 02_data 3.1.2 home_acked 의미 변경에 명시.
- 5.2. 자비스 추천 4.1.A (헤더 IP 라벨 클릭 affordance 폐기) spec 5.13.A.3.2 + 5.13.B.5.3 + arch 5.20 (line 851)에 박제.
- 5.3. 자비스 추천 4.2.A (면책 1회만 + home_acked 의미 분리) spec 5.13.B.3.3 + 02_data 3.1.2 + arch 3.11 부팅 흐름에 박제.
- 5.4. 자비스 추천 4.3.A (STATE_VIEW 폐기) 02_data 1.4.B 폐기 표 + arch 3.11 line 303 + arch 5.20 line 847에 박제 (단, arch 4.M3.1 line 661~663 + 4.M3.1.B + 5.13/5.15는 P0 결함).

## 5.6. 6. 비목표 / 학습 정합

- 6.1. spec 5.13.B.8.6 비목표 4건 (헤더 외 진입점 / 빈 화면 view / 매 진입 면책 / M5 분리) 명시.
- 6.2. M4 학습 (view 모델 격리 결정 사용자 도메인 인식 정합 미달) plan 10.1에 박제 (단계 8 흡수 예정).
- 6.3. M4.1-tidy → M4.2-tidy 개명 의무 plan 9.1 + 02_data 1.1 변경이력 관련 박제. 단계 8 흡수 예정.

# 6. 단계 4 진입 가능 여부

**단계 4 진입 불가 (P0 4건)**.

P0-1 ~ P0-4 정정 의무. 정정 round 2 후 P0 0건 확인 시 단계 4 진입 가능.

P1 3건 / P2 2건은 단계 4 impl_plan에서 흡수 가능 또는 차기 사이클(M4.2-tidy)로 백로그 등재 가능.

## 6.1. 정정 권고 우선순위

| # | 결함 | 우선순위 | 정정 위치 |
|---|---|---|---|
| P0-1 | renderHome "IP 라벨 미렌더" | 1 | arch 3.21 line 508 |
| P0-2 | 4.M3.1 view 결정 단계 잔존 | 2 | arch 4.M3.1 line 661~664 |
| P0-3 | 4.M3.1.B 절 view 잔존 | 2 | arch 4.M3.1.B line 708~745 |
| P0-4 | 5.13/5.15 게이트 STATE_VIEW 잔존 | 3 | arch 5.13 line 774~781 + 5.15 line 791 |

P0-2 / P0-3은 동일 절(arch 4.M3.1 / 4.M3.1.B = M3.1 시점 본문)의 M4.1 미갱신이 원인. 1회 정정으로 동시 해소 가능.

P0-4는 단계 6 게이트 영역. 5.20 게이트와의 자기-충돌 해소 의무. 1회 정정으로 해소 가능.

총 정정 round 1회 추정. round 폭증 위험 = M3.5 시점 답습 대비 작음 (본 사이클은 시각/렌더 분기 변경 0 + 라우팅 본문 정정만).

## 6.2. 검증 round 1 자기-진단

본 검증 round에서 단계 2 design 본문이 spec 영역은 M4.1 정합 + arch 영역은 M4.1 신설 절(3.11 / 3.19 / 3.20 / 3.20.M4.1 / 3.21 / 5.20)은 정합이지만 **M3.1 시점 잔존 절(3.10.M3.1 / 4.M3.1 / 4.M3.1.B / 5.13 / 5.15)의 M4.1 갱신이 누락**된 패턴 발견. P0-2 / P0-3 / P0-4는 동일 원인의 다른 표면. 정정 시 "M3.1 시점 절 폐기 박제 또는 M4.1 갱신 박제" 일괄 적용 권고.

[의견] 본 결손은 plan 6.1 영향 매트릭스에서 arch 영역으로 "3.11 / 3.17 / 3.19~3.22 / 변경이력 신설"만 박제됐고 **3.10.M3.1 / 4.M3.1 / 4.M3.1.B / 5.13 / 5.15 갱신 의무 누락**이 원인. 단계 8 학습 박제 후보 = "M3.1 본문 stale 정합 의무 (시점별 절은 차기 사이클에서 폐기/갱신 박제)".

# 7. round 2 재검증 (2026-05-10)

| 항목 | 값 |
|---|---|
| round | 2 |
| 검토 일자 | 2026-05-10 |
| 검토 산출물 | round 1 정정 후 spec/data/arch 본문 |
| 결과 | **통과** (P0 0건 / 신규 결함 0건) |

## 7.1. round 1 P0 결함 해소 검증

### 7.1.1. P0-1 (arch 3.21 renderHome "IP 라벨 미렌더") - **해소**

`docs/03_architecture.md` 3.21 line 518 정정 본문:
```
//   레이아웃: **라인업 카드 그리드 + 푸터** (헤더 / 하단 탭 바는 render/main.js가 모든 탭 공통 렌더 - spec 5.13.A.3.3 / 5.13.B.2.3 / arch 3.11 정합. 본 함수 시그니처 외부).
```

vs spec 5.13.A.3.3 / 5.13.B.2.3 / arch 3.11 line 347 ("헤더 / 하단 탭 바는 모든 탭에서 공통 노출"). 충돌 0건. 헤더 책임 분리(render/main.js 공통) 명시로 SSOT 단일화 정합.

### 7.1.2. P0-2 (arch 4.M3.1 "view 결정" 단계) - **해소**

`docs/03_architecture.md` 4.M3.1 line 651~680 정정 후:
- 1단계 마이그레이션 chain v3→v7 확장 (line 654~659).
- `migrateV6ToV7` 신설 알고리즘 박제 (line 660~665, 멱등 게이트 + kuji_view 안전 제거 + home_acked 보존 + active_tab 보존 + schemaVersion = 7).
- 2단계 homeAcked / activeTab 역직렬화 명시 (line 668~669, STATE_TAB_VALUES 검증 + STATE_TAB_DEFAULT fallback).
- 5단계 면책 모달 분기로 재기술 (line 675~678, "lobbyAcked → STATE_VIEW_MAIN 자동 진입" 분기 폐기 박제).
- 6단계 rerender = activeTab 분기 (line 679, STATE_VIEW_* 잔존 0건).

STATE_VIEW_LOBBY / STATE_VIEW_MAIN 잔존 0건 확인. arch 3.11 부팅 흐름 (line 349~353)과 단계 1 → 6 동등.

### 7.1.3. P0-3 (arch 4.M3.1.B 절 폐기 박제) - **해소**

`docs/03_architecture.md` 4.M3.1.B line 723~739 정정 후:
- 절 헤더 ~~취소선~~ + (M4.1 폐기) 박제 (line 723).
- M4.1 라우팅 흐름 SSOT 박제 (line 727~730, arch 4.M3.1 / 3.19 / 3.20 / 3.20.M4.1 / spec 5.13.B.5).
- M3.1 시점 매트릭스는 변경이력 박제 표로 잔존 (line 732~739, 단계 8 흡수 예정).

본 절이 M4.1 라우팅과 충돌하지 않음. dispatch 사용 매트릭스가 spec 5.13.B.6 (arch 3.19 / 3.20 / 3.20.M4.1 SSOT)으로 단일화.

### 7.1.4. P0-4 (arch 5.13 / 5.15 STATE_VIEW 잔존) - **해소**

`docs/03_architecture.md` 5.13 line 770~776 정정 후:
- STATE_VIEW_LOBBY / STATE_VIEW_MAIN 항목 4건 모두 ~~취소선~~ + (M4.1 폐기) 박제.
- M4 / M4.1 갱신 항목 3건 (open_home / enter_lineup 분기 / kuji_home_acked 의미 변경) 박제.
- 5.20 흡수 명시.

`docs/03_architecture.md` 5.15 line 785~791 정정 후:
- STATE_VIEW_LOBBY / STATE_VIEW_MAIN grep 항목 ~~취소선~~ + 5.20 흡수 박제.
- "open_home" / "enter_lineup" / "set_active_tab" 상수 경유 명시.
- "kuji_home_acked" 키 (M4 개명 / M4.1 의미 변경) 박제.
- "kuji_active_tab" 키 (M4.1 영속 채택) 박제.

5.13 / 5.15 / 5.20 자기-충돌 0건. 단계 6 게이트 grep 통과 가능.

## 7.2. round 2 신규 결함

**신규 결함 0건.**

### 7.2.1. 마이그레이션 chain (v5→v7 추가)

arch 4.M3.1 line 654~659 chain 확장이 02_data 3.2.7 (v5→v6) + 3.2.8 (v6→v7) 알고리즘과 정합. 02_data 3.2.8 906번 line "v3/v4/v5 사용자는 v3→v4→v5→v6→v7 chain 적용. loadState() 안에서 schemaVersion 비교로 자동 chain"과 1:1 일치.

### 7.2.2. 4.M3.1.B 폐기 표 vs spec 5.13.B.6

arch 4.M3.1.B 변경이력 박제 표(line 734~738)가 spec 5.13.B.6 dispatch (open_home / enter_lineup / set_active_tab) 매트릭스와 충돌하지 않음. 본 표는 "M3.1 시점 의미"를 박제할 뿐 SSOT는 아님 (line 727 명시: SSOT는 arch 4.M3.1 + 3.19 / 3.20 / 3.20.M4.1).

### 7.2.3. 5.13 / 5.15 ~~취소선~~ 가독성

[의견] 가독성 결손 미발생. 폐기 항목 ~~취소선~~ + 갱신 항목 잔존 패턴은 M4 6.12 변경이력 / M3.5 5.18 / 5.19 등 이미 채택된 박제 패턴과 일관. 단계 8 흡수 시 M3.1 시점 게이트 의도가 변경이력에 잔존 의무.

### 7.2.4. P1-2 보강 정합

arch 3.10.M3.1 line 287~304 (P1-2 보강) 정정 본문:
- migrateV5ToV6 / migrateV6ToV7 함수 export 박제 (line 287~293).
- loadGlobalSettings 반환 객체에 homeAcked / activeTab 박제 (line 296).
- saveGlobalSettings partial 인자에 homeAcked / activeTab 직렬화 정책 박제 (line 300).
- saveState 시그니처 객체 인자가 homeAcked / activeTab으로 갱신 (line 303).

vs arch 3.11 영속 매트릭스 line 339 ("`homeAcked` (M4.1 의미 변경 = 면책 동의 표시) / `activeTab` (M4.1 영속 채택, kuji_active_tab)"). SSOT 정합 회복.

## 7.3. round 1 미정정 P1/P2 항목 영향

### 7.3.1. P1-1 (lobbyHeroAssetPath 키 개명) - M4.2-tidy 백로그 정합

자비스 추천대로 M4.2-tidy 백로그 등재. 본 사이클 영향 0. spec 5.13.A.6.4 / 5.13.B.4.2 / 5.13.B.7.1 본문에 "lobbyHeroAssetPath 잔존, M4.2-tidy 개명 결정" 박제 권고는 단계 4 impl_plan 흡수 가능 (블로킹 X).

### 7.3.2. P1-3 (arch 3.18 set_current_lineup) - 영향 0 정합

arch 3.18 line 446 "~~dispatch.set_current_lineup~~ (M4 폐기 - enter_lineup 통합, 5.13.A.4.3)" 잔존. spec 5.13.B.6.4 line 377 "`set_current_lineup` 폐기 (M4): 잔존. M4.1 추가 폐기 없음" 박제. arch와 spec 양쪽 모두 M4.1 추가 폐기 없음 일관 (spec은 명시 박제, arch는 M4 폐기만 박제). plan 6.1 영향 매트릭스 정합. 단계 5 implement 진입 시 호출처 grep 0건 의무는 변경 없음.

### 7.3.3. P2-1 / P2-2 - 가독성 / 라이브 검수 항목

P2-1 (SCHEMA_VERSION "v6 chain 보존" 모호)은 02_data 3.2.8 의존성 본문 (line 906)에서 chain 정합 명시되어 본 round 영향 0. P2-2 (첫 방문자 isCurrent 위화감)는 단계 7 QA 라이브 검수 항목으로 동결.

## 7.4. round 1 통과 항목 회귀 검증

### 7.4.1. 사용자 결정 3.1 / 자비스 추천 4.1.A / 4.2.A / 4.3.A 박제 유지

- 사용자 결정 3.1 (재방문 시도 홈 entry): spec 5.13.B.3.2 + 02_data 3.1.2 home_acked 의미 변경 + arch 3.11 부팅 흐름 line 349~353 박제 잔존.
- 자비스 추천 4.1.A (헤더 IP 라벨 클릭 affordance 폐기): spec 5.13.A.3.2 + 5.13.B.5.3 + arch 5.20 line 847 박제 잔존.
- 자비스 추천 4.2.A (면책 1회만 + home_acked 의미 분리): spec 5.13.B.3.3 + 02_data 3.1.2 + arch 4.M3.1 line 675~678 (정정 후) 박제.
- 자비스 추천 4.3.A (STATE_VIEW 폐기): 02_data 1.4.B 폐기 표 + arch 3.11 line 313 + arch 4.M3.1 (정정 후) + 4.M3.1.B (정정 후) + 5.13 / 5.15 (정정 후) + 5.20 line 843 모두 박제 정합.

회귀 0건.

### 7.4.2. M3 시점 절 stale 정합 신규 결함 미발견

round 1 6.2 자기-진단 "M3.1 시점 잔존 절 (3.10.M3.1 / 4.M3.1 / 4.M3.1.B / 5.13 / 5.15)의 M4.1 갱신 누락"이 round 2 정정으로 5건 모두 해소. 신규 stale 절 발견 0건.

[의견] arch 4.M3.5 v4→v5 마이그레이션 절 (line 712~721)은 M3.1 시점 본문 그대로 잔존 (lobbyAcked 키 사용). 본 절은 마이그레이션 알고리즘 박제이므로 M3.1 시점 의미 보존이 정합 (M4 v6에서 키 개명, M4.1 v7에서 의미 변경은 후속 마이그레이션 절에 박제). 신규 결함 X.

## 7.5. 단계 4 진입 가능 여부

**단계 4 진입 통과** (P0 0건 + 신규 결함 0건).

| 항목 | round 1 | round 2 |
|---|---|---|
| P0 결함 | 4건 | **0건** |
| P1 결함 | 3건 | 1건 (P1-1 M4.2-tidy 백로그) + 1건 (P1-3 미세 변경 영향 0) |
| P2 결함 | 2건 | 2건 (P2-1 가독성 / P2-2 라이브 검수) |
| 신규 결함 | - | **0건** |

P1-1은 M4.2-tidy 백로그로 정정 미수행 (자비스 추천 정합). P1-3은 미세 변경으로 본 사이클 영향 0. P2 2건은 단계 7 QA 또는 가독성 영역. 모두 단계 4 impl_plan 진입 블로킹 X.

### 7.5.1. round 2 통과 정합

총 정정 round 1회로 P0 4건 모두 해소. round 폭증 0. round 1 6.1 "총 정정 round 1회 추정"과 정합.

[의견] round 1 자기-진단 (6.2) "M3.1 본문 stale 정합 의무"가 round 2 정정으로 검증 가능했음. 본 학습 항목은 plan 9.x 또는 PROGRESS 단계 8에 박제 후보 (시점별 절 stale 룰 정착).
