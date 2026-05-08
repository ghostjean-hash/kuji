import { suite, test, assertEq } from "../core.js";
import { lastOnePrize } from "../../src/core/last_one.js";
// M3: LINEUP / TIERS 단수 폐기 → LINEUP_DRAGONBALL alias.
import { LINEUP_DRAGONBALL as LINEUP, TIERS_DRAGONBALL as TIERS } from "../../src/data/numbers.js";

suite("last_one", () => {
  test("lastOnePrize는 TIERS의 'Last One' 행과 정합", () => {
    const p = lastOnePrize(LINEUP);
    const t = TIERS.find((x) => x.tier === "Last One");
    assertEq(p.tier, "Last One");
    assertEq(p.nameJa, t.nameJa);
    assertEq(p.nameKo, t.nameKo);
    assertEq(p.sizeLabel, t.sizeLabel);
  });
});
