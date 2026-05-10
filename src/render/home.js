// 쿠지 홈 (M3.1 lobby 신설 → M4 home 격상).
// 03_architecture 3.21 / spec 5.13.B 정합.
// state.view === STATE_VIEW_HOME 시 render/main.js가 호출.

import {
  LINEUPS,
  DISPATCH_TYPE_ENTER_LINEUP,
} from "../data/numbers.js";
import { TIER_COLORS } from "../data/colors.js";
import { heroPreview } from "../core/home-preview.js";
import { loadStateForLineup } from "../data/storage.js";

// 메인: 홈 컨테이너 + 카드 그리드 + 푸터.
export function renderHome(state, dispatch) {
  const root = document.createElement("section");
  root.className = "home";

  const header = document.createElement("header");
  header.className = "home-header";
  const title = document.createElement("h1");
  title.className = "home-title";
  title.textContent = "Kuji 시뮬레이터";
  header.appendChild(title);
  const sub = document.createElement("p");
  sub.className = "home-sub";
  sub.textContent = "라인업을 선택하세요";
  header.appendChild(sub);
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "home-grid";
  for (const lineup of LINEUPS) {
    // M3.1 design_review P2-6 흡수 / M4 갱신: homeAcked === false 시 모든 카드 isCurrent: false (= "현재" 배지 미노출).
    const isCurrent = state.homeAcked === true && lineup.id === state.currentLineupId;
    grid.appendChild(renderHomeCard(lineup, isCurrent, dispatch));
  }
  root.appendChild(grid);

  return root;
}

// 라인업 카드. spec 5.13.B.4.2 표 6요소 + M4 메타 풍부화 (끝일 / 매장 / 진행 상태).
export function renderHomeCard(lineup, isCurrent, dispatch) {
  const card = document.createElement("article");
  card.className = "home-card" + (isCurrent ? " is-current" : "");
  card.setAttribute("data-lineup-id", lineup.id);

  // 1. home hero 이미지 (assetsAvailable=false면 placeholder gray + IP 라벨)
  const heroSlot = document.createElement("div");
  heroSlot.className = "home-card-hero";
  if (lineup.assetsAvailable) {
    const img = document.createElement("img");
    img.className = "home-card-hero-img";
    img.src = `./assets/products/${lineup.homeHeroAssetPath}`;
    img.alt = lineup.titleKo;
    img.loading = "lazy";
    heroSlot.appendChild(img);
  } else {
    heroSlot.classList.add("is-placeholder");
    const ipText = document.createElement("span");
    ipText.className = "home-card-hero-placeholder-ip";
    ipText.textContent = lineup.ip;
    heroSlot.appendChild(ipText);
  }
  if (isCurrent) {
    const badge = document.createElement("span");
    badge.className = "home-card-current-badge";
    badge.textContent = "현재";
    heroSlot.appendChild(badge);
  }
  card.appendChild(heroSlot);

  // 2. 한국어 제목
  const titleEl = document.createElement("h2");
  titleEl.className = "home-card-title";
  titleEl.textContent = lineup.titleKo;
  card.appendChild(titleEl);

  // 3. IP 라벨
  const ipEl = document.createElement("p");
  ipEl.className = "home-card-ip";
  ipEl.textContent = lineup.ip;
  card.appendChild(ipEl);

  // 4. 메타 한 줄 (M4 풍부화): 발매일 + 끝일 + 가격 + 박스 매수 + 추정 배지 + 매장
  const metaEl = document.createElement("p");
  metaEl.className = "home-card-meta";
  appendMetaSpan(metaEl, lineup.releaseDateStore);
  appendMetaSep(metaEl);
  if (lineup.endDate) {
    appendMetaSpan(metaEl, `~ ${lineup.endDate}`);
    appendMetaSep(metaEl);
  }
  appendMetaSpan(metaEl, `${lineup.priceJpy}엔`);
  appendMetaSep(metaEl);
  appendMetaSpan(metaEl, `박스 ${lineup.boxSize}매`);
  if (lineup.boxSizeEstimated) {
    const est = document.createElement("span");
    est.className = "home-card-meta-estimated";
    est.textContent = "추정";
    metaEl.appendChild(est);
  }
  if (Array.isArray(lineup.outlets) && lineup.outlets.length > 0) {
    appendMetaSep(metaEl);
    appendMetaSpan(metaEl, formatOutlets(lineup.outlets));
  }
  card.appendChild(metaEl);

  // 5. 메인 상품 미리보기 (spec 5.13.B.4.5 heroPreview)
  const preview = heroPreview(lineup);
  if (preview) {
    const previewEl = document.createElement("div");
    previewEl.className = "home-card-preview";
    const tierBadge = document.createElement("span");
    tierBadge.className = "home-card-preview-tier";
    tierBadge.textContent = `${preview.tier}상`;
    const tierColor = TIER_COLORS[preview.tier] || TIER_COLORS.A;
    tierBadge.style.borderColor = tierColor;
    tierBadge.style.color = tierColor;
    previewEl.appendChild(tierBadge);
    const previewName = document.createElement("span");
    previewName.className = "home-card-preview-name";
    previewName.textContent = preview.nameKo;
    previewEl.appendChild(previewName);
    card.appendChild(previewEl);
  }

  // 6. 진행 상태 (M4 신설, spec 5.13.B.4.3 산출식)
  const progress = computeLineupProgress(lineup);
  const progressEl = document.createElement("p");
  progressEl.className = "home-card-progress";
  if (progress.untouched) {
    progressEl.classList.add("is-untouched");
    progressEl.textContent = "아직 시작 안 함";
  } else {
    progressEl.textContent = `박스 ${progress.boxRound}회차 · 추첨 ${progress.drawCount}회 · DC 응모 ${progress.dcCount}`;
  }
  card.appendChild(progressEl);

  // 7. CTA 버튼: "이 라인업으로 진입"
  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "home-card-cta";
  cta.textContent = "이 라인업으로 진입";
  cta.addEventListener("click", () => {
    dispatch({ type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: lineup.id });
  });
  card.appendChild(cta);

  // 카드 전체도 클릭 가능 (CTA 외 영역)
  card.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.closest(".home-card-cta")) return;
    dispatch({ type: DISPATCH_TYPE_ENTER_LINEUP, lineupId: lineup.id });
  });

  return card;
}

// 진행 상태 산출식 (spec 5.13.B.4.3): 비활성 라인업도 storage 직접 lookup.
function computeLineupProgress(lineup) {
  const lineupState = loadStateForLineup(lineup.id);
  const boxRound = lineupState && typeof lineupState.boxRound === "number" ? lineupState.boxRound : 0;
  const drawCount = lineupState && Array.isArray(lineupState.history) ? lineupState.history.length : 0;
  const dcCount = lineupState && Array.isArray(lineupState.dcTickets) ? lineupState.dcTickets.length : 0;
  const untouched = boxRound <= 1 && drawCount === 0 && dcCount === 0;
  return { boxRound, drawCount, dcCount, untouched };
}

function appendMetaSpan(parent, text) {
  const sp = document.createElement("span");
  sp.textContent = text;
  parent.appendChild(sp);
}

function appendMetaSep(parent) {
  const sep = document.createElement("span");
  sep.className = "home-card-meta-sep";
  sep.textContent = " · ";
  parent.appendChild(sep);
}

function formatOutlets(outlets) {
  // 매장 N≥3은 "N곳" 단축. 1~2개는 그대로.
  if (outlets.length >= 3) return `${outlets.length}곳`;
  return outlets.join(" / ");
}
