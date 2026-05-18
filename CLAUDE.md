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

# 2. 도메인 SSOT

도메인 운영 룰(정체성 / 작업 모드 / 절대 규칙 / 평가 rubric / 파일 인덱스 / 기술 환경)은 `.claude/CLAUDE.md` 참조. 신 자비스 v6.0.6 §7.1 도메인 80줄 룰 정합.

# 3. 색상과 스타일

3.1. 게임 데이터(등급 색 등): `src/data/colors.js` 상수만 사용.
3.2. 디자인 토큰(UI 색 / 간격 / 폰트): `styles/tokens.css` 변수만 사용.
3.3. 인라인 매직 값 금지.

# 4. 실행

4.1. 로컬 dev 서버: 프로젝트 루트에서 정적 파일 서버 (Cache-Control no-store 권장).
4.2. 테스트: `tests/test.html`을 브라우저에서 열기 (모든 suites 자동 실행).
4.3. 배포: 추후 결정 (GitHub Pages / Cloudflare Pages 등).

# 5. 변경 이력

5.1. 2026-05-02: 초기 셋업. lotto 폴더 / 파이프라인 패턴 차용.
5.2. 2026-05-02: 도메인 리서치 (시스템 5종 + 라인업 + 한국 입수). `research/` 디렉토리.
5.3. 2026-05-02: 8단계 파이프라인 SSOT 도입.
5.4. 2026-05-19: M-jarvis-v6-migrate M1 종료 - 신 자비스 v6.0.6 정체성 정합. 도메인 SSOT를 `.claude/CLAUDE.md`로 분리, root 93줄 → 약 55줄 슬림화. 8단계 파이프라인은 신 5단계 사이클로 점진 이관 중 (M3 시범 사이클 이후 archive 예정).

# 6. 참고

6.1. 패턴 출처: `D:\claude_code\game\games\lotto`.
6.2. html-game 표준 본체: `D:\claude_code\game\standards\html-game\STANDARD.md` (정합 검증은 비강제, 패턴만 차용).
6.3. 도메인 리서치 SSOT: `research/lineups.json` (라인업 데이터의 1차 출처. `docs/02_data.md`로 변환되어 `src/data/numbers.js`로 흐름).
