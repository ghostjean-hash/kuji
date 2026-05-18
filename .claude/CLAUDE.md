# kuji 도메인 - 추첨 메커닉 시뮬레이터

본 파일은 kuji 도메인 SSOT. 신 자비스 v6.0.5 사양 §7.1 도메인 CLAUDE.md (80줄 이하) 정합.

# 1. 정체성

1.1. kuji = 일본 쿠지(クジ) 추첨 시스템 메커닉을 모바일 웹에서 굴려보는 시뮬레이터. <!-- rule:identity-simulator -->
1.2. 결제 / 실물 배송 / 백엔드 없음. 학습 / 체험 목적. <!-- rule:no-monetization -->
1.3. 신 자비스 사양 분류: §4.3 웹 게임 프로토타입 sub-도메인 (verifiable correctness). <!-- rule:domain-4-3-sub -->
1.4. §4.2 스타비긴즈 "쿠지"(디지털 굿즈 시스템)와는 본질이 다름. 본 프로젝트는 메커닉 시뮬레이터, 사용자 관계 / 결제 없음. <!-- rule:not-starbeginz-kuji -->

# 2. 작업 모드

2.1. 신 자비스 5단계 풀 사이클 (Research → Plan → Execute → Review → Ship). <!-- rule:cycle-5-stage-full -->
2.2. handoff JSON 5종 instance는 `docs/pipeline/<sprint>/`에 작성, unversioned (사양 §3.5.7). <!-- rule:handoff-json-instance -->
2.3. Default-FAIL contract 게이트 (`/jarvis-contract new` + `sign`)로 단계 종료. <!-- rule:contract-default-fail -->
2.4. 단계 압축 모드(§6.5.4)는 마이크로 patch 한정. 일반 사이클은 풀 5단계. <!-- rule:compression-micro-only -->

# 3. 절대 규칙

3.1. 게임 로직과 렌더링은 절대 한 모듈에 두지 않음. <!-- rule:core-render-split -->
3.2. 매직 넘버 금지. 모든 수치는 `docs/02_data.md` → `src/data/numbers.js` 상수. <!-- rule:no-magic-numbers -->
3.3. `src/core/`는 DOM / Canvas / window / document 일체 import 금지. <!-- rule:core-no-dom -->
3.4. 사행성 / 도박성 표현 금지. "확률 향상" / "필승" 절대 금지. <!-- rule:no-gambling -->
3.5. docs SSOT. docs와 코드 충돌 시 docs가 진실. <!-- rule:docs-ssot -->
3.6. 라인업 데이터 신뢰도(`estimated:true` / `data_status`) 보존. 추정값을 사실로 전환 금지. <!-- rule:lineup-trust-preserve -->

# 4. 평가 Rubric (사양 §6.4.6 후보)

4.1. 확률 메커닉 정확성: 박스 비복원 / 등급 분포 / Last One / Double Chance / 천장 룰 데이터 정합. <!-- rule:rubric-prob-mechanic -->
4.2. 라인업 데이터 SSOT 흐름: `research/lineups.json` → `docs/02_data.md` → `src/data/numbers.js` 단방향. <!-- rule:rubric-lineup-ssot -->
4.3. 모듈 분리: core / render / data import 그래프 위반 0건. <!-- rule:rubric-module-split -->
4.4. 톤 정합: 학습 / 체험 표현 유지, 사행성 표현 0건. <!-- rule:rubric-tone -->
4.5. 인계 가능성: handoff JSON 5종 instance 완결성 (다음 사이클이 본 산출물만으로 진입 가능). <!-- rule:rubric-handoff -->

# 5. 파일 인덱스

5.1. `docs/01_spec.md` - 사양 / 시나리오 / 화면 흐름.
5.2. `docs/02_data.md` - 라인업 수치 / 색상 SSOT.
5.3. `docs/03_architecture.md` - 모듈 / 의존성.
5.4. `docs/04_conventions.md` - 네이밍 / 토큰 / 테스트.
5.5. `docs/05_pipeline.md` - 구 8단계 (M-jarvis-v6-migrate 종료 후 archive).
5.6. `research/lineups.json` - 도메인 1차 SSOT.
5.7. `D:/claude_code/kuji/CLAUDE.md` - root CLAUDE.md (v5 잔재, M2에서 슬림화 검토).
5.8. `docs/pipeline/M-jarvis-v6-migrate/` - 신 자비스 마이그레이션 메타 스프린트.

# 6. 기술 환경

6.1. ES Modules 직접 사용. 빌드 / 번들러 / TypeScript 금지.
6.2. import는 상대경로 + `.js` 확장자 명시.
6.3. 외부 라이브러리 최소화. 필요시 CDN ESM 빌드만.
6.4. 영속 데이터는 localStorage. 키 prefix는 `kuji_`.
6.5. 모바일 우선 PWA. 터치 우선 + 데스크톱 보조.

# 7. 변경 이력

7.1. 2026-05-19: 신설. M-jarvis-v6-migrate M1 산출물. 신 자비스 v6.0.5 도메인 SSOT 위치 정합.
