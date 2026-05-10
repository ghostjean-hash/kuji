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
// M4 폐기: import "./suites/storage_v5.test.js" - storage_v6.test.js로 자산 흡수 (M4.1-tidy 파일 삭제)
// M4 폐기: import "./suites/lobby_flow.test.js" - home_flow.test.js로 자산 이전 (M4.1-tidy 파일 삭제)
import "./suites/tier_class_lookup.test.js";  // M3.2
import "./suites/tier_class_counts.test.js";  // M3.3
import "./suites/lineup_validation.test.js";  // M3.5
import "./suites/home_flow.test.js";  // M4 (구 lobby_flow) / M4.1 갱신 (view 모델 폐기 + 4탭 환원 자산 흡수)
import "./suites/storage_v6.test.js";  // M4 (chain 보존)
// M4.1 폐기: import "./suites/state_view.test.js" - tab_routing.test.js로 자산 흡수 (STATE_VIEW_* 폐기 = M4.2-tidy 파일 삭제 후보)
import "./suites/products_history_layout.test.js";  // M4
import "./suites/storage_v7.test.js";  // M4.1 신설
import "./suites/tab_routing.test.js";  // M4.1 신설 (구 state_view 자산 흡수)

const rootEl = document.getElementById("root");
runAll(rootEl).then(({ passCount, failCount }) => {
  document.title = `Tests: ${passCount} pass / ${failCount} fail`;
});
