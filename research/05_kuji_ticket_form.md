# 05. 一番くじ(이찌방쿠지) 복권 폼 조사 보고서

문서 목적: Kuji 모바일 웹 시뮬레이터의 "복권 뜯기" UI 구현을 위한 실제 일본 이찌방쿠지(一番くじ) 복권권의 시각적 폼/사용자 동작 조사.

작성일: 2026-05-02.

표기 규약:
- `[사실]`: 출처 URL로 검증된 사실.
- `[추정]`: 직접 출처가 없으나 복수 정황 증거로 합리적으로 추정.
- 일본어 원어는 괄호 병기. 예: 응모권(応募券).

---

## 1. 복권의 물리적 폼 (くじ券)

### 1.1. 형태와 구조

1.1.1. `[사실]` 이찌방쿠지의 복권은 봉투형이 아닌 "떼어 펴는(めくりくじ / peel-open lottery)" 방식의 두꺼운 종이 카드 1매. 외부 면이 내부 면에 접착되어 있고, 사용자가 한쪽 가장자리를 떼면 내부 면이 드러나 등급이 노출되는 구조. 출처: [小松総合印刷 めくりくじ 안내](https://www.ko-ma-tsu.co.jp/sp_tool/mekurikuji/), [Tokyo Iroha](https://tokyo-iroha.com/culture/36/) ("designed to be peeled open from the left side").

1.1.2. `[사실]` 떼는 동작의 의성어가 일본 팬덤에서 "ペリペリ(periperi)"로 불리며, 공식 팬커뮤니티 명칭이 "ペリペリ団(periperi-dan)", 공식 슬로건이 "ペリペリしなきゃ、はじまらない。NO PERIPERI, NO LIFE." (떼지 않으면 시작되지 않는다). 출처: [一番くじ公式コミュニティ ペリペリ団](https://community.1kuji.com/), [一番くじ 超20周年祭 특설사이트](https://sf.1kuji.com/20th/), [BANDAI SPIRITS press release](https://www.bandaispirits.co.jp/press/2023/231214.php).

1.1.3. `[추정]` 일본어 Yahoo 지혜주머니 답변에 따르면 제조 시점에는 1로트 분량(약 80매)이 1장의 큰 종이 시트(A3급 추정)에 인쇄된 상태로 매장 도착, 매장 측에서 미싱선/절취선을 따라 1매씩 잘라 박스에 투입. 즉 "1매 단위로 절취된 후 박스에 들어간 상태"가 사용자가 만나는 실제 폼. 출처: [Yahoo 지혜주머니 q1090859700](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1090859700).

### 1.2. 크기와 두께

1.2.1. `[추정]` 인쇄업자(株式会社A-teku) 표준 엔터테인먼트 쿠지권의 외부면 H40×W55mm(가로 5.5cm × 세로 4cm), 내부면 H30×W45mm(접힘 마진 포함), 라운드 코너. 이찌방쿠지의 정확한 공식 치수는 미공개이나, 손으로 떼는 동일 카테고리 제품의 일반 사이즈는 **명함보다 약간 작은 5~6cm × 4cm 수준**으로 추정. 출처: [A-teku エンタメくじ仕様](https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/).

1.2.2. `[추정]` 자작 글에서 "60×40 두꺼운 종이 2장"으로 모사한 사례가 있어 6cm × 4cm 안팎이 실제 체감 사이즈에 가까움. 출처: [キラのブログ 一番くじ 自作](https://ameblo.jp/akinorikanairi1103/entry-12803777569.html).

1.2.3. `[사실]` 재질은 "厚紙(두꺼운 종이) 합지(合紙)" 방식 - 외부 종이와 내부 종이를 풀로 붙인 두 겹 구조. 매트 코트지(マットコート135k 등) 또는 광택 코트지 사용. UV 코팅이 떼는 부분에는 도포되지 않아 손으로 쉽게 분리. 출처: [小松総合印刷](https://www.ko-ma-tsu.co.jp/sp_tool/mekurikuji/), [A-teku](https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/).

### 1.3. 외부 면(개봉 전) 디자인 요소

1.3.1. `[사실 + 추정]` 외부 면에는 등급이 **표시되지 않음** (사용자가 떼기 전에는 어떤 상이 나올지 모르는 것이 핵심 게임 메커니즘). 출처: [Tokyo Iroha](https://tokyo-iroha.com/culture/36/), [Anime Yokocho](https://www.animeyokocho.com/articles/ichiban-kuji-guide-japan).

1.3.2. `[추정]` 외부 면 인쇄 요소(IP 일러스트/타이틀/로고/시리얼)는 시리즈마다 다르나, 공식 20주년 시각 자료 및 매장 노출 사진들로 미루어 **공통적으로 다음을 포함**:
- 一番くじ 로고(빨강 프레임, 흰 바탕에 검정 굵은 명조/고딕).
- 시리즈 IP 타이틀(예: ドラゴンボール / 鬼滅の刃 / 推しの子).
- 시리즈 메인 비주얼(캐릭터 일러스트 또는 로고 단순 배치).
- 발매 차수/관리 코드(작은 글씨).

출처: [sf.1kuji.com/20th](https://sf.1kuji.com/20th/), [Anime Yokocho 가이드](https://www.animeyokocho.com/articles/ichiban-kuji-guide-japan).

1.3.3. `[추정]` QR 코드는 외부 면이 아니라 **내부 면(또는 떼낸 후 노출되는 영역)에 인쇄**된 것으로 추정. 외부면에 노출 시 매장 단계에서 사진만으로 응모가 가능해지므로 비합리적. 더블찬스용 QR 또는 캠페인 넘버는 떼낸 이후 보이도록 설계되었을 가능성이 높음. 출처: [@ichibanKUJI 공식 X](https://x.com/ichibanKUJI/status/1372850429139111938) ("くじ券に記載されているキャンペーンナンバー"), [figure-lab 가이드](https://figure-lab.com/ichibankuji-doublechance/).

### 1.4. 내부 면(개봉 후) 표시 요소

1.4.1. `[사실]` 가장 핵심 요소는 큰 글자로 인쇄된 **등급 표기 "○○賞"** (○○상). 알파벳 1글자(A~Z) 또는 "ラストワン賞(라스트원상)" 표기. 출처: [hiroiyominomori 가이드](https://hiroiyominomori.com/kujinokaikata/) ("○○賞이라 적힌 부분을 점원에게 제시"), [KUJIconnect](https://www.kujiconnect.com/ichiban-kuji), [GLT Trip](https://www.gltjp.com/en/article/item/21141/).

1.4.2. `[사실]` "다브루찬스 캠페인 넘버(キャンペーンナンバー)" + 응모용 QR 코드. LINE 또는 一番くじONLINE에 카메라로 인식시켜 추가 추첨에 응모 가능. 출처: [1kuji.com 더블찬스 안내](https://1kuji.com/home/howto_doublechance), [@ichibanKUJI X](https://x.com/ichibanKUJI/status/1372850429139111938).

1.4.3. `[사실]` 응모 마감일이 작은 글씨로 인쇄. 통상 발매월로부터 약 2개월 이내. 출처: [figure-style 더블찬스](https://figure-style.com/kuji-w-chance/).

1.4.4. `[추정]` 종 인덱스(예: A상 1/2)는 일반적으로 **내부 면에 인쇄되지 않음**. 등급 글자만 표시되고 같은 등급 내 어떤 변형(컬러/포즈)을 받을지는 매장 진열대(스코어보드)에서 별도 선택. 출처: [KUJIconnect](https://www.kujiconnect.com/ichiban-kuji) ("Scoreboard").

1.4.5. `[추정]` 시리얼 넘버(고유 ID)는 더블찬스 응모 추적을 위해 인쇄 단계에서 가변 데이터로 인쇄됨. 출처: [A-teku 가변 인쇄 설명](https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/).

---

## 2. 사용자 동작 시퀀스

### 2.1. 매장 vs 사용자 - 누가 뜯는가

2.1.1. `[사실]` **사용자가 직접 뜯음** (매장 점원이 아니라). 떼는 행위 자체가 "ペリペリ" 게임 체험의 핵심이며, 공식 슬로건 "떼지 않으면 시작되지 않는다"가 이를 강조. 출처: [Tokyo Iroha](https://tokyo-iroha.com/culture/36/) ("Peel the ticket yourself"), [Anime Yokocho](https://www.animeyokocho.com/articles/ichiban-kuji-guide-japan), [sf.1kuji.com/20th](https://sf.1kuji.com/20th/).

### 2.2. 표준 시퀀스 (편의점 기준)

2.2.1. `[사실]` 절차:
1. 진열대에서 구매 안내권(購入券) 또는 직접 카운터로 이동.
2. 카운터에서 회 수(几枚) 알림 후 결제.
3. 점원이 박스를 내밀고, 사용자가 **박스에서 직접 권을 1매(혹은 결제 수만큼) 뽑음**.
4. **사용자가 권을 떼서(ペリペリ) 등급(○○賞) 확인**.
5. 떼진 권을 점원에게 제시.
6. 점원이 등급에 해당하는 경품을 진열대에서 가져와 전달.
7. 점원이 사용된 권의 절반(반권/半券)을 스코어보드에 부착하여 잔여 분포 갱신.

출처: [hiroiyominomori 절차](https://hiroiyominomori.com/kujinokaikata/), [KUJIconnect](https://www.kujiconnect.com/ichiban-kuji), [Tokyo Iroha](https://tokyo-iroha.com/culture/36/).

2.2.2. `[사실]` 떼는 방향: 좌측에서 우측으로 떼는 것이 일반적. 출처: [Tokyo Iroha](https://tokyo-iroha.com/culture/36/) ("peeled open from the left side").

### 2.3. 더블찬스 응모 절차

2.3.1. `[사실]` 떼낸 권의 캠페인 넘버 또는 QR을 다음 채널 중 하나로 전송:
- 一番くじ倶楽部 회원 전용 웹페이지 입력.
- LINE 공식 계정 친구 추가 후, "ダブルチャンス" 메뉴에서 카메라 촬영.
- LINE에서 1장당 최대 4매(이미지당 캠페인 넘버 최대 10건) 일괄 인식.

출처: [1kuji.com 더블찬스](https://1kuji.com/home/howto_doublechance), [figure-lab 더블찬스](https://figure-lab.com/ichibankuji-doublechance/).

2.3.2. `[사실]` 떼낸 권은 **반드시 보관**해야 함. 분실 시 응모 불가, 재발급 불가. 출처: [一番くじONLINE FAQ](https://faq-on-line.1kuji.com/%E3%83%80%E3%83%96%E3%83%AB%E3%83%81%E3%83%A3%E3%83%B3%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%9A%E3%83%BC%E3%83%B3%E3%81%AB%E6%8C%91%E6%88%A6%E3%81%99%E3%82%8B-66ac5ebb1cae58001c81798d).

---

## 3. 시각 디테일 (SVG/CSS 모사용)

### 3.1. 색감과 톤

3.1.1. `[사실]` **일관 브랜드 컬러: 빨강 프레임 + 흰 바탕 + 검정 텍스트**. 一番くじ 로고는 흰 사각 안에 빨강 외곽 프레임. 출처: [sf.1kuji.com/20th](https://sf.1kuji.com/20th/).

3.1.2. `[추정]` 외부 면은 IP에 따라 시리즈 메인 컬러를 따름:
- 鬼滅의 刃: 흑/적/시장.
- ドラゴンボール: 주황/노랑.
- 推しの子: 핑크/검정.

질감은 **매트 코트지(マットコート) 또는 광택 코트지** - SVG/CSS에서는 약한 그레인(noise) + 부드러운 그라데이션으로 모사 가능. 출처: [A-teku](https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/).

3.1.3. `[추정]` 내부 면은 보통 **단순 흰 바탕 + 큰 등급 글자** (시리즈 메인 컬러 일부 채택). 외부의 화려함과 대비되는 미니멀 디자인이 등급 글자의 "임팩트"를 강조.

### 3.2. 라벨 위치 매트릭스

| 위치 | 면 | 요소 | 추정/사실 |
| --- | --- | --- | --- |
| 상단 | 외부 | 一番くじ 로고 | 사실 |
| 중앙 | 외부 | IP 메인 비주얼/타이틀 | 사실 |
| 하단 | 외부 | 시리즈 차수 코드/소형 카피 | 추정 |
| 가장자리 좌측 | 외부 | 떼는 가이드/화살표(▶) | 추정 |
| 정중앙 | 내부 | 큰 등급 글자(○○賞) | 사실 |
| 우하단 | 내부 | QR 코드 + 캠페인 넘버 | 추정 |
| 하단 | 내부 | 응모 마감일 (作: ~~まで) | 사실 |
| 우하단 또는 뒷면 | - | 시리얼 넘버 | 사실 |

### 3.3. 등급 표시 폰트와 크기

3.3.1. `[추정]` 폰트: 굵은 일본어 고딕(예: 모리사와 신고B/UD신고) + 알파벳은 두꺼운 산세리프. 한 글자 알파벳 + "賞"를 한 줄에 배치. 글자 높이는 카드 짧은변의 50~60%로 매우 큼 - 떼는 순간 시각적 임팩트가 핵심.

3.3.2. `[추정]` 색: 등급별로 동일 색(주로 검정)이거나 IP 메인 컬러. ラストワン賞은 금색/특별 강조 처리.

### 3.4. IP 일러스트 비중

3.4.1. `[추정]` 외부 면의 60~70%는 캐릭터 일러스트 또는 시리즈 키비주얼. 나머지 30%는 一番くじ 로고 + 타이틀.

### 3.5. 봉인 / 시일 / 절취선

3.5.1. `[사실]` 외부와 내부의 접착은 **약한 풀 접착(점착)**으로 손가락 힘으로 분리 가능. 강한 봉인이나 압축봉인(プレスシール)이 아니라 떼기 쉬운 약접착. 출처: [小松総合印刷](https://www.ko-ma-tsu.co.jp/sp_tool/mekurikuji/) ("UV 코팅 없음, 누구나 쉽게").

3.5.2. `[추정]` 떼는 가이드: 좌측 가장자리에 "ここからめくる(여기부터 떼기)" 같은 안내 또는 손가락/화살표 아이콘이 인쇄되어 있을 가능성이 높음.

3.5.3. `[사실]` 절취선/미싱선은 시트 단계의 1매 분리용으로만 존재. 사용자 손에 도달한 시점에는 이미 1매로 잘려 있음. 출처: [Yahoo 지혜주머니](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1090859700).

3.5.4. `[추정]` "반권(半券)" 개념: 매장이 등급 부분을 떼고 잔여를 사용자에게 돌려줌 - 떼낸 권은 "위쪽 등급부 + 아래쪽 더블찬스 응모부"의 2분할로 절취선이 한 번 더 있을 가능성. 출처: [한국어 가이드(degiondx)](https://degiondx.com/entry/2024/12/30/111020), [Yahoo 지혜주머니 ](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1090859700) ("券貼付け表" 언급).

---

## 4. 모바일 웹 시뮬레이터 권고

### 4.1. 외부 면(개봉 전)

4.1.1. 카드 비율 5.5:4 (가로 long 또는 세로 long 둘 다 가능, 기본 권장은 세로 long). 모바일에서는 화면 폭 80% 정도, 좌우 여유.

4.1.2. 레이어 구성:
- 베이스: 매트 종이 텍스처(미세 노이즈 + 약한 그라데이션).
- 외곽 프레임: 빨강(`#D7233A` 안팎) 굵은 라운드 사각.
- 상단 헤더: 一番くじ 로고 SVG.
- 중앙: IP 메인 비주얼(시뮬레이터 IP 컬러를 매개변수로).
- 좌측 가장자리: 점선 + ▶ 떼기 가이드 아이콘.
- 미세 그림자: 카드 입체감을 위해 약 4~8px 드롭섀도우.

4.1.3. 등급 정보는 외부에 절대 노출하지 않음 - 변환 단계 전 상태가 신뢰성의 핵심.

### 4.2. 내부 면(개봉 후)

4.2.1. 흰 바탕 + 큰 등급 글자 정중앙 배치. 글자 크기는 카드 짧은변의 50~60% (예: 카드 높이 320px이면 등급 글자 높이 160~190px).

4.2.2. 등급 글자 폰트: 두꺼운 일본어 고딕 또는 한국어 환경에선 "Pretendard SemiBold/Bold"의 굵은 무게. 영문 알파벳은 두꺼운 산세리프(Inter Black, Pretendard Black 등).

4.2.3. 우하단에 QR 코드(시뮬레이터에서는 비활성 placeholder) + 캠페인 넘버 placeholder + 응모 마감일.

4.2.4. ラストワン賞은 골드 그라데이션 텍스트 + 별/스파클 효과.

### 4.3. 뜯기 애니메이션

4.3.1. `[권고]` 동작 모형:
- 사용자가 카드 좌측 가장자리에 터치(드래그) 입력.
- 드래그 진행률에 따라 외부 면이 좌→우로 페이지 컬(curl) 또는 좌측이 들어 올려지는 회전(rotateY -180deg) 애니메이션.
- 진행률 70% 이상에서 손을 놓으면 자동으로 끝까지 펼침, 70% 미만이면 원위치 복귀.
- 펼쳐지는 동안 "ペリペリ" 효과음 (옵션, 기본 OFF, 사용자 토글로 ON).
- 펼침 완료 후 등급 글자에 "팡(POP)" 스케일 애니메이션(0.5 → 1.1 → 1.0, 0.4초)으로 임팩트.

4.3.2. `[권고]` 애니메이션 사양:
- duration 600~900ms.
- easing: cubic-bezier(0.2, 0.8, 0.2, 1) (자연스러운 빠름→느림).
- 라이브러리: Framer Motion(React) 또는 GSAP. SVG `<path>` 기반 페이지 컬은 GSAP MorphSVG 또는 단순 `transform: rotateY()` + `transform-origin: left`로 충분.

4.3.3. `[권고]` 모바일 터치 UX:
- 드래그 임계값: 카드 폭의 30%.
- 햅틱 피드백: 50% 통과 시 light, 완료 시 medium (Vibration API or iOS haptics).
- 한 손 사용 가능하도록 카드 위치는 화면 하단 1/3 ~ 중앙에.

4.3.4. `[권고]` 등급 노출 후 절차:
- 등급 글자 강조 후, 하단에 "확인(確認/タップして次へ)" 버튼 노출.
- 더블찬스 영역(QR + 넘버)은 카드 하단으로 슬라이드 인.
- 다음 권으로 넘어가는 트랜지션은 좌→우 슬라이드 또는 카드 덱 셔플 모션.

### 4.4. 다중 권 뽑기 UX

4.4.1. `[권고]` 1회 결제 다회 뽑기는 "카드 덱"이 좌측에서 한 장씩 사용자 손으로 들어오는 모션 → 1장 ペリペリ → 등급 노출 → 우측 결과 더미로 이동의 반복.

4.4.2. `[권고]` 일괄 모드(once-mode)도 제공: 5장/10장 모두 뜯기 애니메이션 일괄 실행 후 결과 그리드 표시. 시간이 없는 사용자를 위한 옵션.

### 4.5. 시각 자산 매개변수화

4.5.1. `[권고]` 시리즈(IP) 별로 외부 면 비주얼이 달라야 하므로 다음 변수를 분리:
- `seriesPrimaryColor` (예: `#D7233A`).
- `seriesAccentColor`.
- `seriesLogoSvg` (URL 또는 inline SVG).
- `seriesKeyVisualUrl` (PNG/WebP).
- `seriesTitleJa` / `seriesTitleKo`.

4.5.2. `[권고]` 一番くじ 공식 로고 사용 시 상표 이슈 가능 - 시뮬레이터는 일반 표기("Kuji Sim" 같은 자체 브랜드)를 사용하고, IP 비주얼도 사용자 업로드 또는 더미로 처리.

---

## 5. 출처 URL 일람

### 5.1. 공식 소스

5.1.1. 一番くじ倶楽部 BANDAI SPIRITS 공식: [https://1kuji.com/](https://1kuji.com/)
5.1.2. あそびかた(놀이방법): [https://1kuji.com/home/howto](https://1kuji.com/home/howto)
5.1.3. 더블찬스 캠페인: [https://1kuji.com/home/howto_doublechance](https://1kuji.com/home/howto_doublechance)
5.1.4. 一番くじONLINE 가이드: [https://on-line.1kuji.com/Page/guide.aspx](https://on-line.1kuji.com/Page/guide.aspx)
5.1.5. 一番くじONLINE FAQ - 더블찬스: [https://faq-on-line.1kuji.com/%E3%83%80%E3%83%96%E3%83%AB%E3%83%81%E3%83%A3%E3%83%B3%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%9A%E3%83%BC%E3%83%B3%E3%81%AB%E6%8C%91%E6%88%A6%E3%81%99%E3%82%8B-66ac5ebb1cae58001c81798d](https://faq-on-line.1kuji.com/%E3%83%80%E3%83%96%E3%83%AB%E3%83%81%E3%83%A3%E3%83%B3%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%9A%E3%83%BC%E3%83%B3%E3%81%AB%E6%8C%91%E6%88%A6%E3%81%99%E3%82%8B-66ac5ebb1cae58001c81798d)
5.1.6. 一番くじ 超20周年 특설사이트: [https://sf.1kuji.com/20th/](https://sf.1kuji.com/20th/)
5.1.7. ペリペリ団 공식 커뮤니티: [https://community.1kuji.com/](https://community.1kuji.com/)
5.1.8. BANDAI SPIRITS 공식 보도자료(20주년): [https://www.bandaispirits.co.jp/press/2023/231214.php](https://www.bandaispirits.co.jp/press/2023/231214.php)
5.1.9. 一番くじ 공식 X(@ichibanKUJI): [https://x.com/ichibanKUJI/status/1372850429139111938](https://x.com/ichibanKUJI/status/1372850429139111938)

### 5.2. 가이드 / 블로그 / 후기

5.2.1. Tokyo Iroha "What is Ichiban Kuji?": [https://tokyo-iroha.com/culture/36/](https://tokyo-iroha.com/culture/36/)
5.2.2. Anime Yokocho Ichiban Kuji Guide: [https://www.animeyokocho.com/articles/ichiban-kuji-guide-japan](https://www.animeyokocho.com/articles/ichiban-kuji-guide-japan)
5.2.3. KUJIconnect Ichiban Kuji: [https://www.kujiconnect.com/ichiban-kuji](https://www.kujiconnect.com/ichiban-kuji)
5.2.4. GLT Trip Complete Guide: [https://www.gltjp.com/en/article/item/21141/](https://www.gltjp.com/en/article/item/21141/)
5.2.5. ヒロイヨミノ森 編의점 구매법: [https://hiroiyominomori.com/kujinokaikata/](https://hiroiyominomori.com/kujinokaikata/)
5.2.6. degiondx 일번쿠지 방법론: [https://degiondx.com/entry/2024/12/30/111020](https://degiondx.com/entry/2024/12/30/111020)
5.2.7. figure-lab 더블찬스 가이드: [https://figure-lab.com/ichibankuji-doublechance/](https://figure-lab.com/ichibankuji-doublechance/)
5.2.8. figure-style 더블찬스: [https://figure-style.com/kuji-w-chance/](https://figure-style.com/kuji-w-chance/)
5.2.9. 一番くじの「お値段探偵」倶楽部 - 더블찬스: [https://ichibankuji.ymt-pr.com/%E5%BD%93%E3%81%9F%E3%82%8B%E7%A2%BA%E7%8E%87%E3%81%AF%EF%BC%9F%EF%BC%81%E3%80%80%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98%E3%80%8C%E3%83%80%E3%83%96%E3%83%AB%E3%83%81%E3%83%A3%E3%83%B3%E3%82%B9%E3%82%AD/](https://ichibankuji.ymt-pr.com/%E5%BD%93%E3%81%9F%E3%82%8B%E7%A2%BA%E7%8E%87%E3%81%AF%EF%BC%9F%EF%BC%81%E3%80%80%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98%E3%80%8C%E3%83%80%E3%83%96%E3%83%AB%E3%83%81%E3%83%A3%E3%83%B3%E3%82%B9%E3%82%AD/)
5.2.10. お値段探偵 - ペリペリ団 소개: [https://ichibankuji.ymt-pr.com/%E3%81%8A%E5%BE%97%EF%BC%9F%EF%BC%81-%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98%E3%80%8C-%E3%83%9A%E3%83%AA%E3%83%9A%E3%83%AA%E5%9B%A3%E3%80%8D%E3%81%A3%E3%81%A6%E4%BD%95%EF%BC%9F/](https://ichibankuji.ymt-pr.com/%E3%81%8A%E5%BE%97%EF%BC%9F%EF%BC%81-%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98%E3%80%8C-%E3%83%9A%E3%83%AA%E3%83%9A%E3%83%AA%E5%9B%A3%E3%80%8D%E3%81%A3%E3%81%A6%E4%BD%95%EF%BC%9F/)

### 5.3. 자작 후기

5.3.1. キラのブログ - 一番くじ 自作 (60×40 두꺼운종이): [https://ameblo.jp/akinorikanairi1103/entry-12803777569.html](https://ameblo.jp/akinorikanairi1103/entry-12803777569.html)
5.3.2. 引退. - 一番くじ 검증글: [https://ameblo.jp/xxkaws/entry-11977089409.html](https://ameblo.jp/xxkaws/entry-11977089409.html)

### 5.4. Q&A / 사용자 지식

5.4.1. Yahoo 지혜주머니 - 시트 구조 질문: [https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1090859700](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1090859700)

### 5.5. 인쇄 업자 (제조 측 소스)

5.5.1. 小松総合印刷 めくりくじ(peel-open lottery): [https://www.ko-ma-tsu.co.jp/sp_tool/mekurikuji/](https://www.ko-ma-tsu.co.jp/sp_tool/mekurikuji/)
5.5.2. 株式会社A-teku 엔터테인먼트 쿠지: [https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/](https://www.a-teku.co.jp/goods/speed-lot/entertainment-lots/)

### 5.6. 위키

5.6.1. 一番くじ - Wikipedia(JP): [https://ja.wikipedia.org/wiki/%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98](https://ja.wikipedia.org/wiki/%E4%B8%80%E7%95%AA%E3%81%8F%E3%81%98)

---

## 6. 데이터 부재 및 추가 조사 필요 사항

6.1. `[데이터 없음]` BANDAI SPIRITS의 공식 쿠지권 사이즈 사양(공식 도면/PDF). 인쇄업자 표준 사이즈로 추정 중.

6.2. `[데이터 없음]` 외부 면의 정확한 인쇄 요소 배치도. 시리즈마다 다르며, 공식 가이드에 카드 정면도가 없음. 매장 사진/유튜브 개봉 영상의 프레임 캡처가 더 필요.

6.3. `[데이터 없음]` 캠페인 넘버/QR의 정확한 인쇄 위치(외부면 vs 내부면). 본 보고서는 게임 메커니즘상 내부면으로 추정.

6.4. `[권고]` 다음 단계로 유튜브 개봉 영상(예: [鬼滅の刃 一番くじ 개봉](https://www.youtube.com/watch?v=ZasPbMc7rhw))의 실제 프레임 캡처를 통해 사이즈/색감/라벨 위치를 시각적으로 검증할 것을 권고.
