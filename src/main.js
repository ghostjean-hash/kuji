// 진입점. #app에 render/main.mount 호출 (03_architecture 3.11).

import { mount } from "./render/main.js";

const appEl = document.getElementById("app");
if (!appEl) {
  throw new Error("#app element not found");
}
mount(appEl);
