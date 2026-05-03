// Mulberry32 PRNG (02_data 1.2). 32비트 시드 기반 결정론 난수.
// core/는 DOM/window/document/localStorage import 0개 (CLAUDE.md 4.3).

import { PRNG_OUTPUT_DIVISOR } from "../data/numbers.js";

export function createRng(seed) {
  let a = (seed >>> 0);
  return function rng() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / PRNG_OUTPUT_DIVISOR;
  };
}

export function nextInt(rng, max) {
  if (!Number.isInteger(max) || max <= 0) {
    throw new Error(`[random] nextInt max must be positive integer, got ${max}`);
  }
  return Math.floor(rng() * max);
}
