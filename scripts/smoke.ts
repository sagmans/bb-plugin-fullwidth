// Release gate for the layout rules. It runs without bb or a browser, so a bad
// edit to the selectors or the CSS fails in seconds, before any build.

import {
  buildLayoutCss,
  STYLE_ELEMENT_ID,
  UNCAPPED_MAX_WIDTH,
  WIDTH_CAPPED_SELECTORS,
} from "../src/layout.ts";

// The intended roster: dropping a selector would silently bring back a
// narrow column, so removal must also change this list.
const EXPECTED_SELECTORS = ["main div:has(+ [data-scroll-footer])", ".chat-prompt-box"] as const;
// Only a max-width override may ship; anything else could break host layout.
const ALLOWED_DECLARATION = /^max-width: none !important;$/;
// Captures each `selector { body }` rule; selectors never contain braces.
const RULE_PATTERN = /([^{}]+?)\s*\{([^{}]*)\}\s*/g;
// Rejects anything that could load remote resources or escape the rule block.
const FORBIDDEN_TOKENS = ["url(", "@import", "expression(", "</style"] as const;

const css = buildLayoutCss();
const problems: string[] = [];

if (JSON.stringify(WIDTH_CAPPED_SELECTORS) !== JSON.stringify(EXPECTED_SELECTORS)) {
  problems.push(`selectors ${JSON.stringify(WIDTH_CAPPED_SELECTORS)} differ from the roster`);
}
if (UNCAPPED_MAX_WIDTH !== "none") problems.push(`max-width is "${UNCAPPED_MAX_WIDTH}"`);
if (STYLE_ELEMENT_ID.trim() === "") problems.push("style element id is empty");
for (const token of FORBIDDEN_TOKENS) {
  if (css.includes(token)) problems.push(`css contains forbidden token ${token}`);
}
// One rule per selector, so an unparsable selector cannot take the others down.
const rules = [...css.matchAll(RULE_PATTERN)];
if (rules.map((rule) => rule[1]).join("\n") !== EXPECTED_SELECTORS.join("\n")) {
  problems.push(`rules ${JSON.stringify(rules.map((rule) => rule[1]))} are not one per selector`);
}
for (const rule of rules) {
  const declarations = (rule[2] ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  if (declarations.length !== 1 || !ALLOWED_DECLARATION.test(declarations[0] ?? "")) {
    problems.push(`unexpected declarations ${JSON.stringify(declarations)} for ${rule[1]}`);
  }
}
// Leftover text outside the parsed rules would be unreviewed CSS.
if (css.replace(RULE_PATTERN, "").trim() !== "") problems.push("css has text outside rules");

if (problems.length > 0) {
  console.error(`smoke: FAIL\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`smoke: OK (${WIDTH_CAPPED_SELECTORS.length} selectors uncapped)`);
