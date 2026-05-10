# M4.2-tidy - 08 improve

| 항목 | 값 |
|---|---|
| 사이클 ID | M4.2-tidy |
| 단계 | 8 improve |
| 작성일 | 2026-05-10 |
| 사이클 종료 | 자비스 정적 정합 통과 + 사용자 라이브 검수 의무 (07_qa 2절) |

# 1. 사이클 종료 자기-진단

1.1. **트리거**: 사용자 차기 사이클 결정 = "M4.2-tidy 정리 라운드 (자비스 추천)" + 자율 진행 신호.

1.2. **본 사이클 결손 해소**:
- M4 / M4.1 사이클로 누적된 dead alias 4 + dead test 3 + dead 모듈 1 (tier-grid) = 8 파일 fs 삭제.
- "Last One" 매직 문자열 분기 식 11 호출처 단일화 (M3.1 P2-3 흡수).
- M4.1 P1-1 spec 본문 stale 정정 (면책 trigger 키).
- M4.1 P1-2 arch / impl_plan 명명 stale 정정.
- spec 5.13.E.3 시점 표기 단순화 (M3.5 P2-1 흡수).
- styles/main.css `.tier-grid*` 셀렉터 폐기.

1.3. **코드 동작 변경 0 + storage 마이그레이션 0 + 단위 테스트 변경 0** 의무 정합.

# 2. M4.2 학습

2.1. **정리 라운드 사이클 의미 한정**: "정리 라운드" = 단순 정리 (dead 폐기 + spec stale + 매직 문자열 분기 식). 데이터 정의 / 자산 키 / 표시 라벨 단일화는 별도 사이클(M5+) 명시. 본 사이클 분기 식 11건만 흡수.

2.2. **누적 백로그 일괄 처리 vs 분리**: 사용자 결정 = 자비스 추천 채택 + 자율 진행. 차기 사이클 답습.

2.3. **fs rm vs dead alias 박제 결정**: 정리 라운드 의미 정합 + 자비스 권한 행사 + 사용자 명시 결정 영역 = fs rm 정합. M4 dead alias 패턴은 자비스 권한 부재 시점 박제. 본 사이클은 사용자 결정 = M4.2-tidy 정리 라운드 → fs rm 자율 행사.

2.4. **단계 2 design에서 spec 정정 흡수의 부피 감소 효과 (M4.1 답습)**: T6/T7/T8/T9가 단계 2에서 흡수 → 단계 5 T 부피 = (1) fs rm 8 파일 + (2) LAST_ONE_TIER_NAME 신설 + (3) 분기 식 11건 + (4) tier-grid CSS 폐기. 깔끔.

2.5. **단계 6 P2 = 표기 모호 / 박제 주석 잔존**: 정리 라운드의 박제 주석은 의도된 잔존. 차기 사이클 정리 후보지만 P2급 우선순위.

# 3. 단계 6 P2 흡수

3.1.1. **P2-1 PROGRESS 13.2.5 T4 카운트 표기 모호** (`PROGRESS.md:718`): "분기 식 호출처 11건"이 모듈 카운트(10) 또는 분기 식 카운트(16)와 부정합. **본 사이클 단계 8 흡수**: PROGRESS 13.2.5 T4 본문에 "분기 식 호출처 11 module 16 분기 식 박제" 정정.

3.1.2. **P2-2 styles/main.css 1632 line 박제 주석 잔존**: 정리 라운드 박제 자체 = 잔존 정합. 차기 사이클 미정정 (정합 의도).

# 4. 본 사이클 산출물

| # | 산출물 | 파일 |
|---|---|---|
| 1 | plan | docs/pipeline/M4.2-tidy/01_plan.md |
| 2 | design | spec/data/arch + M4.1 04_impl_plan stale 정정 |
| 3 | design_review | docs/pipeline/M4.2-tidy/03_design_review.md (round 1 P0=0) |
| 4 | impl_plan | docs/pipeline/M4.2-tidy/04_impl_plan.md |
| 5 | implement | T1~T10 (fs rm 8 + LAST_ONE_TIER_NAME 신설 + 분기 식 11 호출 + tier-grid CSS + PROGRESS) |
| 6 | impl_review | docs/pipeline/M4.2-tidy/06_impl_review.md (round 1 P0=0/P1=0/P2=2) |
| 7 | QA | docs/pipeline/M4.2-tidy/07_qa.md |
| 8 | improve (본 문서) | docs/pipeline/M4.2-tidy/08_improve.md |

# 5. 차기 사이클 후보 (PROGRESS 13.4 흡수 완료)

5.1. **M5 = コトブキヤくじ XENOGLOSSIA 30연 천장 룰** (메이저 사이클, 확장 로드맵 슬롯 보존). 첫 메커닉 분기.
5.2. **lobbyHeroAssetPath → homeHeroAssetPath 키 개명** (M5 흡수 또는 별도, storage v8 마이그레이션 동반).
5.3. **"Last One" 데이터 정의 / 자산 키 / 표시 라벨 단일화** (M5+ 별도, 부피 대): numbers.js 등급 정의 / colors.js 키 / assets.js 키 / dataset / template.
5.4. **M3 series + M4 + M4.1 + M4.2 라이브 검수 결과 보정** (사용자 액션 의존).

# 6. 사용자 액션 의무

6.1. 07_qa.md 2절 라이브 검수: 정리 라운드 회귀 (dead 폐기 / Last One 단일화 / tier-grid 폐기 / storage 마이그) + M4.1 누적.
6.2. 검수 결함 발견 시 자비스에 신호 → 보정 사이클 진입 또는 차기 사이클 흡수.

# 7. 사이클 종료 박제

7.1. 본 사이클(M4.2-tidy) 8단계 파이프라인 종료.
7.2. 자비스 정적 정합 = 통과. 라이브 검수 = 사용자 액션.
7.3. 차기 사이클 결정은 사용자 신호 후 진입.
