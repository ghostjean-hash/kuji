// M4 폐기 (lobby → home 일괄 개명, 단계 4 결정 4.4).
// 본 모듈은 호출처 0건으로 dead. M4.1-tidy 정리 라운드에서 파일 삭제 의무.
// 신 구현: src/render/home.js (renderHome / renderHomeCard).

export { renderHome as renderLobby, renderHomeCard as renderLobbyCard } from "./home.js";
