# 04. 컨벤션

(placeholder. 작성 예정.)

## 1. 네이밍

1.1. 파일명: `kebab-case.js` (예: `box-card.js`).
1.2. 모듈/함수/변수: `camelCase`.
1.3. 상수: `UPPER_SNAKE_CASE`.
1.4. CSS 클래스: `kebab-case`.

## 2. 주석

2.1. 코드는 자기 설명적으로 작성. 주석은 "왜"를 설명할 때만.
2.2. JSDoc는 `core/` 함수의 입출력 타입 명시에 한해 사용.

## 3. 테스트

3.1. 모든 `core/` 모듈은 `tests/suites/<module>.test.js` 1:1 대응.
3.2. 결정론 검증 우선 (같은 시드 → 같은 결과).
3.3. 브라우저에서 `tests/test.html` 열면 자동 실행.

## 4. 토큰

4.1. UI 색/간격/폰트는 `styles/tokens.css` CSS 변수만 사용.
4.2. 게임 데이터 색(등급 색 등)은 `src/data/colors.js` 상수만 사용.
4.3. 매직 넘버는 `src/data/numbers.js` 상수만 사용.

## 5. 커밋

5.1. Conventional Commits. `<type>(<scope>): <subject>`.
5.2. type: `feat` / `fix` / `chore` / `docs` / `refactor` / `test`.
5.3. scope: `kuji` / `docs` / `core` / `render` / `data` / `tests` / `styles`.
