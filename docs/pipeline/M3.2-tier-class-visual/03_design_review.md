# M3.2 tier-class-visual 단계 3 design_review

작성일: 2026-05-09.
검증 방식: subagent 격리 검증 (general-purpose, 깨끗한 컨텍스트, 결정론).
라운드: 2 (round 1 미통과 + 자동 재시도 1회 후 round 2 통과).

# 1. 결과

| 라운드 | P0 | P1 | P2 | 판정 |
|---|---|---|---|---|
| round 1 | 1 | 3 | 4 | 미통과 |
| round 2 | **0** | 1 | 1 | **통과** |

round 2 잔존 P1 1건 + P2 1건은 단계 4 / 단계 8 이월 정합. P0 0건 → 단계 4 진입.

# 2. round 1 결함 (자비스 자동 정정)

## 2.1. P0 2.1 - "결과 모달" 표현 부활 (M2 K-1 정합 위반)

위치: spec 5.13.C.1 / 5.13.C.3 / 5.13.C.3.2 / 5.13.C.3.4 + 02_data 1.4.A.5 호출처 4번째 + 02_data 1.5 의미문.

결함: spec 8.8 K-1 정정으로 추첨 결과 모달은 폐기 (페이지플립 카드 인플레이스로 대체). M3.2 spec 5.13.C는 "결과 모달" 표현을 부활시키며 호출처를 `result-modal.js`로 박제. 단계 4 결정 불가능.

정정 (round 2):
- spec 5.13.C.1 "결과 모달 등장 모션" → "결과 reveal 등장 모션" + M2 K-1 cross-link.
- spec 5.13.C.3 "결과 모달 hero 등장" → "결과 reveal hero 등장". 페이지플립 카드 + DC 모달 분리 명기.
- 02_data 1.4.A.5 호출처 4번째 = `peel-card.js` (추첨, M2 K-1 정합) + `dc-result-modal.js` (DC).
- 02_data 1.5 HERO_POP/GLOW 의미문 = "페이지플립 카드 + DC 모달 공통".

## 2.2. P1 3.1 - CSS 변수 ↔ JS 상수 매핑 박제 부재

위치: spec 5.13.C.2.2 매트릭스가 `var(--tier-class-{hero,main,goods}-bg-tint)` 등 8종 사용. 02_data 어디에도 정의처 없음.

결함: M3 단계 6 P0 2.4 / 2.5 학습(토큰명 ↔ COLOR_* 상수 1:1 박제) 답습 누락.

정정 (round 2):
- 02_data 2.3 절 신설 = CSS 변수 ↔ JS 상수 매핑 표 (2.3.1 색 7행 + 2.3.2 모션 3행 + 2.3.3 단계 6 게이트 grep).

## 2.3. P1 3.2 - 분기 lookup 주체 미정

위치: spec 5.13.C.3.1.

결함: `isHero` lookup이 main.js dispatch에서 부여 vs render 자체 lookup 미정.

정정 (round 2):
- spec 5.13.C.3.1에 "lookup 주체는 결과 표시 영역(렌더 모듈). main.js dispatch는 result + lineup 인자만 전달, 클래스 판정은 1.4.A.5 헬퍼." 1줄 박제.

## 2.4. P1 3.3 - PEEL 글로우 vs hero 정적 글로우 동시 노출 정책

위치: spec 5.13.C.2.3.

결함: 두 글로우 동시 노출 시 box-shadow 합산 vs 일시 hide 정책 미정.

처리: **단계 4 impl_plan 이월** (단계 4 T 분할 시 CSS 키프레임 결정 + 시퀀스 타임라인 박제).

## 2.5. P2 4.1 - OR 중복 의도 박제

정정 (round 2): spec 5.13.C.3.1 OR 중복 의도 박제 (Last One redundant + lookup 실패 fallback).

## 2.6. P2 4.2 - 02_data 4.13/4.14 시간 오름차순 재정렬

정정 (round 2): 4.13 (M3.1) → 4.14 (M3.2) 시간 순 재정렬. **단, 정정 시 4.13 본문 누락 + 4.14 본문 통합 회귀 발생** → round 2 신규 P1 (3.1 아래)으로 등재 후 즉시 정정 (분리).

## 2.7. P2 4.3 - minor-row 보더 정책 명시

처리: **단계 4 impl_plan 이월** (CSS 셀렉터 보더 var() 결정).

## 2.8. P2 4.4 - 5.13.C.4.4 cross-link

처리: **단계 4 impl_plan 이월** (03_architecture 연결 보강).

# 3. round 2 결함

## 3.1. P1 신규 (round 1 P2 4.2 정정 회귀) - 02_data 4.13 본문 공동화 + 4.14 두 묶음 통합

위치: 02_data 4.13 / 4.14.

결함: 시간 오름차순 재정렬 시 M3.1 본문 7항이 잘못 4.14로 이주 + 4.13 헤더 1줄만 잔존.

정정 (round 2 후속): 4.13 본문에 M3.1 7항 복원 + 4.14 본문 M3.2 (1)~(7)로 분리. 즉시 정정 완료.

## 3.2. P2 신규 - spec 8.14/8.15 줄 순서 시간 역순

위치: spec 변경 이력 끝부분.

결함: 8.14 (M3.1, 2026-05-08) < 8.15 (M3.2, 2026-05-09) 번호 정합이지만 줄 순서가 8.15 → 8.14 역순.

정정 (round 2 후속): 줄 순서 재정렬 (8.14 → 8.15). 즉시 정정 완료.

# 4. 통과 항목 (정합 검증 완료, round 1 / round 2 모두)

4.1. CLAUDE.md 4.1 게임 로직 / 렌더 분리 - getTierClassForTier는 numbers.js 정의 (DOM 0건 + lineup 인자 결정론).
4.2. CLAUDE.md 4.2 매직 넘버 0개 - 1.18 / 1200 / 12 / 0.25 / hex 4종 모두 02_data 1.5 / 2.2 박제. CSS 변수 ↔ JS 상수 매핑은 2.3 박제.
4.3. CLAUDE.md 4.3 src/core/ DOM 0건 - M3.2 core 신설 0.
4.4. CLAUDE.md 4.4 - tier_class_lookup.test.js 신설 plan 명시.
4.5. CLAUDE.md 4.6 - "확률 향상" / "필승" 0건.
4.6. CLAUDE.md 4.7 / 4.8 - 8단계 파이프라인 + 데이터 신뢰도 보존.
4.7. 사용자 결정 9.1~9.4 박제 정합 (DC 모달 hero / minor-row 속성만 / 약한 골드 글로우 / 헬퍼 신설).
4.8. M3.1 사양(5.13.A / 5.13.B)과 M3.2 사양(5.13.C) 충돌 0.
4.9. M2 K-1 정합 회복 (round 2 정정).

# 5. 통과 판단

P0 0건 (round 2). **단계 4 impl_plan 진입**.

잔존 P1 1건 (3.1 즉시 정정 완료) + P2 1건 (3.2 즉시 정정 완료) + 단계 4 이월 P1 1건 (2.4) + 단계 4 이월 P2 2건 (2.7 / 2.8). 단계 4에서 흡수.

# 6. 단계 4 이월 결정 사항

6.1. **PEEL 글로우 vs hero 정적 글로우 동시 노출 정책** (P1 2.4): box-shadow 합산 vs 일시 hide vs 색/blur 자연 분리 중 결정. CSS 키프레임 시퀀스 박제.
6.2. **minor-row 보더 정책** (P2 2.7): 등급 색 유지 vs goods 클래스 보더 적용 결정.
6.3. **5.13.C.4.4 cross-link** (P2 2.8): "(02_data 1.4.A.4 정합)" 추가.
6.4. **03_architecture M3.2 일괄 갱신**: state 영향 0 (시각 단독). 1장 트리에 신규 모듈 0. 3.x 모듈 docstring 갱신 (hero-carousel / minor-row / peel-card / dc-result-modal에 tierClass 분기 추가). 5.16 게이트 grep 추가 (CSS 변수 ↔ JS 상수 1:1 / data-tier-class 부착 / hero 분기 식 정합).

# 7. 변경 이력

7.1. 2026-05-09: round 1 검증 (P0 1 / P1 3 / P2 4 미통과). 자동 재시도 1회.
7.2. 2026-05-09: round 1 정정 적용 (P0 2.1 / P1 3.1 / P1 3.2 / P2 4.1 / P2 4.2). round 2 재검증.
7.3. 2026-05-09: round 2 통과 (P0 0). 신규 P1 1 (3.1) + P2 1 (3.2) 즉시 정정 완료. 단계 4 이월 결정 4건 박제.
