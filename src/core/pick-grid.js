// 통(bin) 격자 위치 추적 - 단일 진실원 (4.14.7 / 4.15.5).
// M3 단계 4 T9: render/main.js에서 core로 이전 (M2.1 정리 3.5.1).
// CLAUDE.md 4.1 (게임 로직 / 렌더 분리) 정합. DOM 의존성 0건.

// buildConsumedGridSet: 현재 박스에서 "이미 뽑힌" 일반 격자 위치 집합 (Last One 제외).
// - history(boxId == 현재 박스 + gridIndex 기록) + lockedResult ticket의 gridIndex 추적.
// - skip 모드 뽑기처럼 gridIndex가 null인 미추적 뽑기는 deck 소진은 됐지만 집합에 없음.
// - deck 소진 수와 추적 집합 크기가 어긋나면 낮은 번호부터 placeholder로 채워 정합성 맞춤.
// - render(pick-panel)와 confirm(performPickConfirm)이 동일 결과를 보도록 단일 진실원.
// M3: lineup 인자 추가. lineup.boxSize - 1 (NORMAL_SLOT_COUNT) 동적.
export function buildConsumedGridSet(state, lineup) {
  if (!lineup || typeof lineup.boxSize !== "number") {
    throw new Error("[pick-grid] lineup.boxSize required.");
  }
  if (!state || !state.boxState) {
    throw new Error("[pick-grid] state.boxState required.");
  }
  const boxId = state.boxState.id;
  const tracked = new Set();
  for (const e of (state.history || [])) {
    if (e && e.boxId === boxId && e.gridIndex !== null && e.gridIndex !== undefined) {
      tracked.add(e.gridIndex);
    }
  }
  for (const t of (state.unopenedTickets || [])) {
    if (t && t.lockedResult && t.lockedResult.gridIndex !== null && t.lockedResult.gridIndex !== undefined) {
      tracked.add(t.lockedResult.gridIndex);
    }
  }
  const NORMAL_SLOT_COUNT = lineup.boxSize - 1;
  const expected = NORMAL_SLOT_COUNT - state.boxState.deck.length;
  if (tracked.size < expected) {
    for (let i = 0; i < NORMAL_SLOT_COUNT && tracked.size < expected; i++) {
      if (!tracked.has(i)) tracked.add(i);
    }
  }
  return tracked;
}
