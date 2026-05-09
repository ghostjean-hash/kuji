// 라인업 선택 화면 (M3.1 신설).
// 03_architecture 3.21 / spec 5.13.B 정합.
// state.view === STATE_VIEW_LOBBY 시 render/main.js가 호출.

import {
  LINEUPS,
  DISPATCH_TYPE_ENTER_LINEUP,
} from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";
import { heroPreview } from "../core/lobby-preview.js";

// 메인: 로비 컨테이너 + 카드 그리드 + 푸터.
export function renderLobby(state, dispatch) {
  const root = document.createElement("section");
  root.className = "lobby";

  const header = document.createElement("header");
  header.className = "lobby-header";
  const title = document.createElement("h1");
  title.className = "lobby-title";
  title.textContent = "Kuji 시뮬레이터";
  header.appendChild(title);
  const sub = document.createElement("p");
  sub.className = "lobby-sub";
  sub.textContent = "라인업을 선택하세요";
  header.appendChild(sub);
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "lobby-grid";
  for (const lineup of LINEUPS) {
    // M3.1 design_review P2-6 흡수: lobbyAcked === false 시 모든 카드 isCurrent: false (= "현재" 배지 미노출).
    const isCurrent = state.lobbyAcked === true && lineup.id === state.currentLineupId;
    grid.appendChild(renderLobbyCard(lineup, isCurrent, dispatch));
  }
  root.appendChild(grid);

  return root;
}

// 라인업 카드. spec 5.13.B.4.2 표 6요소.
export function renderLobbyCard(lineup, isCurrent, dispatch) {
  const card = document.createElement("article");
  card.className = "lobby-card" + (isCurrent ? " is-current" : "");
  card.setAttribute("data-lineup-id", lineup.id);

  // 1. lobby hero 이미지 (assetsAvailable=false면 placeholder gray + IP 라벨)
  const heroSlot = document.createElement("div");
  heroSlot.className = "lobby-card-hero";
  if (lineup.assetsAvailable) {
    const img = document.createElement("img");
    img.className = "lobby-card-hero-img";
    img.src = `./assets/products/${lineup.lobbyHeroAssetPath}`;
    img.alt = lineup.titleKo;
    img.loading = "lazy";
    heroSlot.appendChild(img);
  } else {
    heroSlot.classList.add("is-placeholder");
    const ipText = document.createElement("span");
    ipText.className = "lobby-card-hero-placeholder-ip";
    ipText.textContent = lineup.ip;
    heroSlot.appendChild(ipText);
  }
  if (isCurrent) {
    const badge = document.createElement("span");
    badge.className = "lobby-card-current-badge";
    badge.textContent = "현재";
    heroSlot.appendChild(badge);
  }
  card.appendChild(heroSlot);

  // 2. 한국어 제목
  const titleEl = document.createElement("h2");
  titleEl.className = "lobby-card-title";
  titleEl.textContent = lineup.titleKo;
  card.appendChild(titleEl);

  // 3. IP 라벨
  const ipEl = document.createElement("p");
  ipEl.className = "lobby-card-ip";
  ipEl.textContent = lineup.ip;
  card.appendChild(ipEl);

  // 4. 메타 한 줄: 발매일 + 가격 + 박스 매수 + 추정 배지
  const metaEl = document.createElement("p");
  metaEl.className = "lobby-card-meta";
  const dateSpan = document.createElement("span");
  dateSpan.textContent = lineup.releaseDateStore;
  metaEl.appendChild(dateSpan);
  const sep1 = document.createElement("span");
  sep1.className = "lobby-card-meta-sep";
  sep1.textContent = " · ";
  metaEl.appendChild(sep1);
  const priceSpan = document.createElement("span");
  priceSpan.textContent = `${lineup.priceJpy}엔`;
  metaEl.appendChild(priceSpan);
  const sep2 = document.createElement("span");
  sep2.className = "lobby-card-meta-sep";
  sep2.textContent = " · ";
  metaEl.appendChild(sep2);
  const boxSpan = document.createElement("span");
  boxSpan.textContent = `박스 ${lineup.boxSize}매`;
  metaEl.appendChild(boxSpan);
  if (lineup.boxSizeEstimated) {
    const est = document.createElement("span");
    est.className = "lobby-card-meta-estimated";
    est.textContent = "추정";
    metaEl.appendChild(est);
  }
  card.appendChild(metaEl);

  // 5. 메인 상품 미리보기 (spec 5.13.B.4.3 heroPreview)
  const preview = heroPreview(lineup);
  if (preview) {
    const previewEl = document.createElement("div");
    previewEl.className = "lobby-card-preview";
    const tierBadge = document.createElement("span");
    tierBadge.className = "lobby-card-preview-tier";
    tierBadge.textContent = `${preview.tier}상`;
    const tierColor = TIER_COLORS[preview.tier] || TIER_COLORS.A;
    tierBadge.style.borderColor = tierColor;
    tierBadge.style.color = tierColor;
    previewEl.appendChild(tierBadge);
    const previewName = document.createElement("span");
    previewName.className = "lobby-card-preview-name";
    previewName.textContent = preview.nameKo;
    previewEl.appendChild(previewName);
    card.appendChild(previewEl);
  }

  // 6. CTA 버튼: "이 라인업으로 진입"
  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "lobby-card-cta";
  cta.textContent = "이 라인업으로 진입";
  cta.addEventListener("click", () => {
    dispatch({ type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: lineup.id });
  });
  card.appendChild(cta);

  // 카드 전체도 클릭 가능 (CTA 외 영역)
  card.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.closest(".lobby-card-cta")) return;
    dispatch({ type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: lineup.id });
  });

  return card;
}
