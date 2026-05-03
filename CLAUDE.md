# Kuji (제일복권) 시뮬레이터

# 1. 한 줄

일본 쿠지(クジ, 추첨식 상품) 시스템 메커닉을 모바일 웹에서 그대로 굴려보는 시뮬레이터. 박스 단위 비복원 추첨, 등급 분포, Last One / Double Chance 룰을 실제 라인업 데이터로 재현. 결제 / 실물 배송 / 백엔드 없음. 학습 / 체험 목적.

## 1.1. 첫 구현 대상 (M1)

`一番くじ ドラゴンボール THE CHRONICLE OF GOKU` (BANDAI SPIRITS, 2026-05-08 발매, 1회 790엔, 박스 80매 추정). 이찌방쿠지 표준 메커닉 (박스 비복원 + Last One + Double Chance).

## 1.2. 확장 로드맵

| 순서 | 시스템 | 라인업 | 추가 메커닉 |
|---|---|---|---|
| 1 (M1) | 一番くじ | ドラゴンボール THE CHRONICLE OF GOKU | 표준 (박스 비복원 + Last One + Double Chance) |
| 2 (M2) | 一番くじ | ワンピース MONKEY.D.LUFFY | 라인업 데이터만 추가 |
| 3 (M3) | コトブキヤくじ | アイドルマスター XENOGLOSSIA | 30연 S賞 확정 (천장 룰) |
| 4 (M4) | Happyくじ | PIXAR 2026 | 표준 (13등급 확장 검증) |
| 5 (M5) | セガ ラッキーくじ | 呪術廻戦 5주년 | 온라인 잔여 카운터 UI 모드 |
| 보류 | フリューくじ | 데이터 보강 후 | 표준 |

# 2. 작업 워크플로우 - 8단계 파이프라인

모든 작업 사이클은 8단계 파이프라인을 거친다. 단계 SSOT는 `docs/05_pipeline.md`.

| # | 단계 | ID | 산출물 위치 | 통과 게이트 |
|---|---|---|---|---|
| 1 | 플랜 | `plan` | `docs/pipeline/<sprint>/01_plan.md` | 사용자 승인 |
| 2 | 기획 | `design` | `docs/01_spec.md` + `docs/02_data.md` 갱신 | 매직 넘버 0개 |
| 3 | 기획 검증 | `design_review` | `docs/pipeline/<sprint>/03_design_review.md` | subagent 격리 검증 통과 |
| 4 | 구현 플랜 | `impl_plan` | `docs/03_architecture.md` + `docs/pipeline/<sprint>/04_impl_plan.md` | 사용자 승인 |
| 5 | 구현 | `implement` | `src/` + `tests/` | 컴파일 / 실행 |
| 6 | 구현 검증 | `impl_review` | `docs/pipeline/<sprint>/06_impl_review.md` | subagent 격리 검증 + 모든 suite pass |
| 7 | QA | `qa` | `docs/pipeline/<sprint>/07_qa.md` | 사용자 승인 |
| 8 | 개선 | `improve` | `PROGRESS.md` + 다음 plan 후보 | 발견 이슈 처리 또는 백로그 등재 |

2.1. 단계 스킵 시 `PROGRESS.md`에 사유 명시 의무. 스킵 가능 단계는 1 / 4 / 7만.
2.2. 작업 단위는 혼합. 큰 사이클은 스프린트, 소규모는 기능 단위.
2.3. 단계 3 / 6은 subagent 격리 검증을 통과해야 함.
2.4. 검증 실패 시 자동 재시도 1회 후 사용자 핸드오프.

# 3. 문서 인덱스

3.1. `docs/01_spec.md` - 시뮬레이터 사양, 사용자 시나리오, 화면 흐름.
3.2. `docs/02_data.md` - 라인업 데이터, 수치, 색상 SSOT.
3.3. `docs/03_architecture.md` - 폴더/모듈 구조, 의존성 규칙.
3.4. `docs/04_conventions.md` - 네이밍, 주석, 테스트, 토큰 규칙.
3.5. `docs/05_pipeline.md` - 8단계 파이프라인 SSOT.
3.6. `docs/pipeline/<sprint>/` - 스프린트별 단계 메타 산출물.
3.7. `research/` - 도메인 리서치 (시스템 카테고리 / 라인업 / 한국 입수).

# 4. 절대 규칙

4.1. 게임 로직과 렌더링은 절대 한 모듈에 두지 않는다.
4.2. 매직 넘버 금지. 모든 수치는 `docs/02_data.md` → `src/data/numbers.js` 상수.
4.3. `src/core/`는 DOM/Canvas/window/document 일체 import 금지.
4.4. 핵심 로직 변경 시 반드시 테스트 코드 업데이트.
4.5. docs와 코드가 충돌하면 docs가 진실. 코드를 docs에 맞춰 수정.
4.6. 사행성 / 도박성 표현 금지. "확률 향상" / "필승" 절대 금지. 시뮬레이터 목적은 "수집/완주 경험".
4.7. 8단계 파이프라인 준수. 스킵 시 사유 명시.
4.8. 라인업 데이터 신뢰도는 `lineups.json`의 `estimated:true` / `data_status` 필드 그대로 보존. 추정값을 사실로 전환하지 않는다.

# 5. 기술 환경

5.1. ES Modules 직접 사용. 빌드/번들러/TypeScript 금지.
5.2. import는 상대경로 + `.js` 확장자 명시.
5.3. 외부 라이브러리 최소화. 필요시 CDN ESM 빌드만.
5.4. 영속 데이터는 localStorage. 키 prefix는 `kuji_`.
5.5. 모바일 우선 PWA. 터치 우선 + 데스크톱 보조.

# 6. 색상과 스타일

6.1. 게임 데이터(등급 색 등): `src/data/colors.js` 상수만 사용.
6.2. 디자인 토큰(UI 색/간격/폰트): `styles/tokens.css` 변수만 사용.
6.3. 인라인 매직 값 금지.

# 7. 실행

7.1. 로컬 dev 서버: 프로젝트 루트에서 정적 파일 서버 (Cache-Control no-store 권장).
7.2. 테스트: `tests/test.html`을 브라우저에서 열기 (모든 suites 자동 실행).
7.3. 배포: 추후 결정 (GitHub Pages / Cloudflare Pages 등).

# 8. 변경 이력

8.1. 2026-05-02: 초기 셋업. lotto 폴더/파이프라인 패턴 차용.
8.2. 2026-05-02: 도메인 리서치 (시스템 5종 + 라인업 + 한국 입수). `research/` 디렉토리.
8.3. 2026-05-02: 8단계 파이프라인 SSOT 도입. 첫 스프린트 M1-base-system 시작 (一番くじ ドラゴンボール).

# 9. 참고

9.1. 패턴 출처: `D:\claude_code\game\games\lotto`.
9.2. html-game 표준 본체: `D:\claude_code\game\standards\html-game\STANDARD.md` (정합 검증은 비강제, 패턴만 차용).
9.3. 도메인 리서치 SSOT: `research/lineups.json` (라인업 데이터의 1차 출처. `docs/02_data.md`로 변환되어 `src/data/numbers.js`로 흐름).
