// Full-width thread layout rules.
//
// bb caps the thread transcript and the composer at a 760px reading measure,
// while markdown tables "break out" of that measure towards the pane edges.
// The two widths clash on wide windows. These rules lift the cap so messages,
// the composer and the cards above it share the same width as the tables.
// The content script in app.tsx injects them; smoke.ts checks them.

/** Element id of the injected `<style>`, so a remount can find and replace it. */
export const STYLE_ELEMENT_ID = "bb-plugin-fullwidth-style";

/**
 * bb host elements that carry the 760px cap. Neither selector uses the
 * Tailwind width class, so a bb class rename cannot widen unrelated surfaces.
 * - Transcript column: always the element right before the scroll footer.
 *   Its own `data-scroll-attached` marker is not usable: bb drops it while
 *   the user is scrolled up, which would snap the column back to 760px.
 *   Scoped to `main` so app chrome outside the page is never matched.
 * - Composer: the prompt box wrapper, which also holds the cards above it.
 */
export const WIDTH_CAPPED_SELECTORS = [
  "main div:has(+ [data-scroll-footer])",
  ".chat-prompt-box",
] as const;

/**
 * `none` removes the cap; the existing side padding (1rem) stays, which is
 * also the gap bb leaves beside a broken-out table, so the edges line up.
 */
export const UNCAPPED_MAX_WIDTH = "none";

/**
 * Builds the stylesheet text. `!important` because the host cap is an
 * equal-specificity utility class whose source order the plugin cannot control.
 * One rule per selector: a browser drops a whole rule when it cannot parse
 * one selector (such as `:has()` on old WebKit), and the others must survive.
 */
export function buildLayoutCss(): string {
  return WIDTH_CAPPED_SELECTORS.map(
    (selector) => `${selector} {\n  max-width: ${UNCAPPED_MAX_WIDTH} !important;\n}\n`,
  ).join("");
}
