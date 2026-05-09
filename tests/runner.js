// 테스트 진입점. 모든 suite import 후 runAll 호출.

import { runAll } from "./core.js";
import "./suites/random.test.js";
import "./suites/hash.test.js";
import "./suites/box.test.js";
import "./suites/draw.test.js";
import "./suites/draw_pick.test.js";  // M2.1
import "./suites/last_one.test.js";
import "./suites/double_chance.test.js";
import "./suites/history.test.js";
import "./suites/storage.test.js";
import "./suites/storage_v3.test.js";  // M2.1
import "./suites/buy.test.js";
import "./suites/build_consumed_grid_set.test.js";  // M2.1 / 4.14.7
import "./suites/storage_v4.test.js";  // M3
import "./suites/lineup_isolation.test.js";  // M3
import "./suites/tier_class.test.js";  // M3.1
import "./suites/storage_v5.test.js";  // M3.1
import "./suites/lobby_flow.test.js";  // M3.1
import "./suites/tier_class_lookup.test.js";  // M3.2
import "./suites/tier_class_counts.test.js";  // M3.3

const rootEl = document.getElementById("root");
runAll(rootEl).then(({ passCount, failCount }) => {
  document.title = `Tests: ${passCount} pass / ${failCount} fail`;
});
