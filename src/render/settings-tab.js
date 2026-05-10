// 설정 탭. M3 dropdown / M3.1 "라인업 선택 화면으로" → M4 dropdown 폐기 + "홈으로" 버튼.

import { getLineupById, DISPATCH_TYPE_OPEN_HOME } from "../data/numbers.js";

export function renderSettingsTab(state, dispatch) {
  const lineup = getLineupById(state.currentLineupId);
  const el = document.createElement("div");
  el.className = "settings-tab";

  // M4 갱신 (5.13.A.4 폐기 + 5.13.B.5.1): dropdown quick-switch 폐기. "홈으로" 버튼만 잔존.
  const lineupSection = document.createElement("section");
  lineupSection.className = "settings-section settings-lineup";
  lineupSection.innerHTML = "<h2>라인업</h2>";
  const currentLine = document.createElement("p");
  currentLine.className = "settings-current-lineup";
  currentLine.innerHTML = `현재: <strong>${lineup.ip}</strong> - ${lineup.titleKo}`;
  lineupSection.appendChild(currentLine);
  const homeBtn = document.createElement("button");
  homeBtn.type = "button";
  homeBtn.className = "settings-home-button";
  homeBtn.textContent = "홈으로";
  homeBtn.addEventListener("click", () => {
    dispatch({ type: DISPATCH_TYPE_OPEN_HOME });
  });
  lineupSection.appendChild(homeBtn);
  const lineupHelp = document.createElement("p");
  lineupHelp.className = "settings-help";
  lineupHelp.textContent = "다른 라인업으로 전환하려면 홈에서 선택하세요. 현재 라인업의 박스 / 인벤토리 / 이력 / DC는 보존됩니다.";
  lineupSection.appendChild(lineupHelp);
  el.appendChild(lineupSection);

  // 시드 (라인업 공유 - 사용자 결정 8.2 (A))
  const seedSection = document.createElement("section");
  seedSection.className = "settings-section";
  seedSection.innerHTML = "<h2>시드 (모든 라인업 공유)</h2>";
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

  // 박스 리셋 (활성 라인업)
  const boxSection = document.createElement("section");
  boxSection.className = "settings-section";
  boxSection.innerHTML = "<h2>박스 (활성 라인업)</h2>";
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "박스 리셋 (회차 +1)";
  resetBtn.addEventListener("click", () => dispatch({ type: "reset_box" }));
  boxSection.appendChild(resetBtn);
  el.appendChild(boxSection);

  // M2.1: 통 선택 토글
  const pickSection = document.createElement("section");
  pickSection.className = "settings-section";
  pickSection.innerHTML = "<h2>통 선택</h2>";
  const pickRow = document.createElement("label");
  pickRow.className = "settings-skip-row";
  const pickInput = document.createElement("input");
  pickInput.type = "checkbox";
  pickInput.className = "settings-skip-checkbox";
  pickInput.checked = !!state.settingsSkipPick;
  pickInput.addEventListener("change", () => {
    dispatch({ type: "set_skip_pick", value: pickInput.checked });
  });
  const pickLabel = document.createElement("span");
  pickLabel.className = "settings-skip-label";
  pickLabel.textContent = "통에서 선택 건너뛰기 (바로 뜯기)";
  pickRow.appendChild(pickInput);
  pickRow.appendChild(pickLabel);
  pickSection.appendChild(pickRow);
  const pickHelp = document.createElement("p");
  pickHelp.className = "settings-help";
  pickHelp.textContent = "체크 시 구매 후 통 격자 단계 없이 바로 페이지플립 카드로 진입합니다. 결정론은 시드와 박스 회차로 보장되며, 슬롯 선택 순서는 결과 공개 순서에만 영향을 줍니다.";
  pickSection.appendChild(pickHelp);
  el.appendChild(pickSection);

  // 라인업 정보 (활성 라인업)
  const infoSection = document.createElement("section");
  infoSection.className = "settings-section";
  infoSection.innerHTML = `
    <h2>라인업 정보 (활성)</h2>
    <table class="lineup-info">
      <tr><th>제목</th><td>${lineup.titleKo}<br><small>${lineup.titleJa}</small></td></tr>
      <tr><th>IP</th><td>${lineup.ip}</td></tr>
      <tr><th>운영사</th><td>${lineup.operator}</td></tr>
      <tr><th>가격</th><td>${lineup.priceJpy}엔 (1회)</td></tr>
      <tr><th>박스 매수</th><td>${lineup.boxSize}매${lineup.boxSizeEstimated ? " (추정)" : ""}</td></tr>
      <tr><th>등급별 매수</th><td>${lineup.tiersCountEstimated ? "추정값" : "확정"} (${lineup.tiers.length}등급)</td></tr>
      <tr><th>발매일</th><td>${lineup.releaseDateStore}</td></tr>
      <tr><th>캠페인 종료</th><td>${lineup.endDate}</td></tr>
      <tr><th>매장</th><td>${lineup.outlets.join(", ")}</td></tr>
    </table>
  `;
  const sourceTitle = document.createElement("h3");
  sourceTitle.textContent = "출처";
  infoSection.appendChild(sourceTitle);
  const sourceList = document.createElement("ul");
  for (const s of lineup.sources) {
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
