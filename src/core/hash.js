// FNV-1a 32비트 해시. 박스 ID 결정론 생성에 사용 (01_spec 5.7.1).

import { BOX_ID_HEX_LENGTH } from "../data/numbers.js";

const FNV_OFFSET = 0x811c9dc5 >>> 0;
const FNV_PRIME = 0x01000193;
const HEX_RADIX = 16;

export function fnv1a(str) {
  let h = FNV_OFFSET;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME);
  }
  return h >>> 0;
}

// M3 단계 3 P0 2.1 정합: lineup.id 포함 (라인업 격리 + 결정론 회귀 회피).
// 시그니처: boxId(seed, boxRound, lineupId).
// lineupId 미전달 시 호환 동작 (M2.1 이전 호출 - 단계 6 grep으로 0건 보장).
export function boxId(seed, boxRound, lineupId) {
  const key = lineupId !== undefined && lineupId !== null
    ? `${lineupId}|${seed >>> 0}|${boxRound}`
    : `${seed >>> 0}|${boxRound}`;
  return fnv1a(key).toString(HEX_RADIX).padStart(BOX_ID_HEX_LENGTH, "0");
}
