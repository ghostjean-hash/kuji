// 테스트 진입점. 모든 suite import 후 runAll 호출.

import { runAll } from "./core.js";
import "./suites/random.test.js";
import "./suites/hash.test.js";
import "./suites/box.test.js";
import "./suites/draw.test.js";
import "./suites/last_one.test.js";
import "./suites/double_chance.test.js";
import "./suites/history.test.js";
import "./suites/storage.test.js";
import "./suites/buy.test.js";

const rootEl = document.getElementById("root");
runAll(rootEl).then(({ passCount, failCount }) => {
  document.title = `Tests: ${passCount} pass / ${failCount} fail`;
});
