// 테스트 러너 코어. suite / test / assert.

const _suites = [];
let _currentSuite = null;

export function suite(name, fn) {
  _currentSuite = { name, tests: [] };
  fn();
  _suites.push(_currentSuite);
  _currentSuite = null;
}

export function test(name, fn) {
  if (!_currentSuite) throw new Error("test() outside of suite()");
  _currentSuite.tests.push({ name, fn });
}

export function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assert failed");
}

export function assertEq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg || "assertEq failed"}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertDeepEq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg || "assertDeepEq failed"}: expected ${e}, got ${a}`);
  }
}

export function assertThrows(fn, msg) {
  try {
    fn();
  } catch (e) {
    return;
  }
  throw new Error(msg || "expected throw");
}

export async function runAll(rootEl) {
  let passCount = 0, failCount = 0;
  for (const s of _suites) {
    const suiteEl = document.createElement("div");
    suiteEl.className = "suite";
    const h2 = document.createElement("h2");
    h2.textContent = s.name;
    suiteEl.appendChild(h2);
    rootEl.appendChild(suiteEl);
    for (const t of s.tests) {
      const tEl = document.createElement("div");
      tEl.className = "test";
      try {
        await t.fn();
        tEl.classList.add("pass");
        tEl.textContent = `✓ ${t.name}`;
        passCount++;
      } catch (e) {
        tEl.classList.add("fail");
        tEl.textContent = `✗ ${t.name}\n    ${e.message}`;
        failCount++;
      }
      suiteEl.appendChild(tEl);
    }
  }
  const summary = document.createElement("div");
  summary.className = `summary ${failCount === 0 ? "ok" : "bad"}`;
  summary.textContent = `${passCount} passed, ${failCount} failed`;
  rootEl.appendChild(summary);
  return { passCount, failCount };
}
