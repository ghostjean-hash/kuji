import {
  LINEUP_TITLE_KO,
  LINEUP_TITLE_JA,
  LINEUP_IP,
  LINEUP_OPERATOR,
  LINEUP_RELEASE_DATE_STORE,
  LINEUP_END_DATE,
  LINEUP_OUTLETS,
  LINEUP_PRICE_JPY,
  BOX_SIZE,
  BOX_SIZE_ESTIMATED,
  TIERS_COUNT_ESTIMATED,
  LINEUP_SOURCES,
} from "../data/numbers.js";

export function renderSettingsTab(state, dispatch) {
  const el = document.createElement("div");
  el.className = "settings-tab";

  // 시드
  const seedSection = document.createElement("section");
  seedSection.className = "settings-section";
  seedSection.innerHTML = "<h2>시드</h2>";
  const seedRow = document.createElement("div");
  seedRow.className = "seed-row";
  const seedInput = document.createElement("input");
  seedInput.type = "number";
  seedInput.value = String(state.seed);
  seedInput.className = "seed-input";
  const seedBtn = document.createElement("button");
  seedBtn.textContent = "변경";
  seedBtn.addEventListener("click", () => {
    const v = Number(seedInput.value);
    if (Number.isFinite(v)) dispatch({ type: "set_seed", seed: v });
  });
  seedRow.appendChild(seedInput);
  seedRow.appendChild(seedBtn);
  seedSection.appendChild(seedRow);
  el.appendChild(seedSection);

  // 박스 리셋
  const boxSection = document.createElement("section");
  boxSection.className = "settings-section";
  boxSection.innerHTML = "<h2>박스</h2>";
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "박스 리셋 (회차 +1)";
  resetBtn.addEventListener("click", () => dispatch({ type: "reset_box" }));
  boxSection.appendChild(resetBtn);
  el.appendChild(boxSection);

  // 라인업 정보
  const infoSection = document.createElement("section");
  infoSection.className = "settings-section";
  infoSection.innerHTML = `
    <h2>라인업 정보</h2>
    <table class="lineup-info">
      <tr><th>제목</th><td>${LINEUP_TITLE_KO}<br><small>${LINEUP_TITLE_JA}</small></td></tr>
      <tr><th>IP</th><td>${LINEUP_IP}</td></tr>
      <tr><th>운영사</th><td>${LINEUP_OPERATOR}</td></tr>
      <tr><th>가격</th><td>${LINEUP_PRICE_JPY}엔 (1회)</td></tr>
      <tr><th>박스 매수</th><td>${BOX_SIZE}매${BOX_SIZE_ESTIMATED ? " (추정)" : ""}</td></tr>
      <tr><th>등급별 매수</th><td>${TIERS_COUNT_ESTIMATED ? "추정값" : "확정"}</td></tr>
      <tr><th>발매일</th><td>${LINEUP_RELEASE_DATE_STORE}</td></tr>
      <tr><th>캠페인 종료</th><td>${LINEUP_END_DATE}</td></tr>
      <tr><th>매장</th><td>${LINEUP_OUTLETS.join(", ")}</td></tr>
    </table>
  `;
  const sourceTitle = document.createElement("h3");
  sourceTitle.textContent = "출처";
  infoSection.appendChild(sourceTitle);
  const sourceList = document.createElement("ul");
  for (const s of LINEUP_SOURCES) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`;
    sourceList.appendChild(li);
  }
  infoSection.appendChild(sourceList);
  el.appendChild(infoSection);

  // 면책
  const disclaimerSection = document.createElement("section");
  disclaimerSection.className = "settings-section settings-disclaimer";
  disclaimerSection.innerHTML = `
    <h2>면책</h2>
    <p>본 시뮬레이터는 일본 쿠지 메커닉의 학습 / 체험 목적입니다. 실제 추첨이 아니며 상품이 실물로 지급되지 않습니다. 등급별 매수 / 박스 매수는 추정값일 수 있습니다. "수집 / 완주 경험" 목적이며 사행성 / 도박성 권유가 아닙니다.</p>
  `;
  el.appendChild(disclaimerSection);

  // 전체 초기화
  const dangerSection = document.createElement("section");
  dangerSection.className = "settings-section settings-danger";
  dangerSection.innerHTML = "<h2>전체 초기화</h2>";
  const clearBtn = document.createElement("button");
  clearBtn.className = "danger-button";
  clearBtn.textContent = "모든 데이터 삭제";
  clearBtn.addEventListener("click", () => dispatch({ type: "clear_all" }));
  dangerSection.appendChild(clearBtn);
  el.appendChild(dangerSection);

  // 스토리지 모드
  const modeSection = document.createElement("section");
  modeSection.className = "settings-section";
  modeSection.innerHTML = `<p class="storage-mode">스토리지 모드: ${state.storageMode === "memory" ? "메모리 (영속 안 됨)" : "영속 (localStorage)"}</p>`;
  el.appendChild(modeSection);

  return el;
}
