# AGENTS.md

A bb plugin that removes bb's 760px cap on the thread transcript and the
composer, so they use the full pane width like markdown tables do. The plugin
is frontend only: one content script adds one `<style>` element.
[README.md](README.md) gives the user view.

## Map

| Path | Role |
| --- | --- |
| `src/layout.ts` | The selectors and the CSS. All layout behavior is here. |
| `app.tsx` | Content script: adds the `<style>` on mount, removes it on dispose. |
| `server.ts` | Empty backend. bb requires a server entry. |
| `scripts/smoke.ts` | Release gate for `src/layout.ts`. Runs without bb. |
| `.githooks/` | Git hooks. See "Hooks" below. |
| `dist/` | Build output. Generated and ignored. Do not edit. |

## Commands

```sh
scripts/setup-hooks          # once per clone
npm ci --ignore-scripts      # install from the lockfile
npm run lint                 # Biome format + lint check
npm run format               # Biome safe fixes
npm run typecheck
npm run smoke
npm run build                # bb plugin build into dist/
```

A change is done when `lint`, `typecheck`, `smoke` and `build` pass, and the
change works in a running bb:

```sh
bb plugin install "$PWD" --yes   # first time
bb plugin reload fullwidth       # after each build
```

Check the thread page at the bottom and after you scroll up. Check also with
`bb plugin disable fullwidth`: the page must go back to 760px at once.

## Rules for the layout code

- Do not select bb elements by Tailwind width classes. A class rename in bb
  could then widen other pages.
- Do not use `[data-scroll-attached]`. bb removes it while the user scrolls up,
  and the column then goes back to 760px.
- Keep one CSS rule for each selector. A browser drops a full rule when it
  cannot parse one selector, for example `:has()` on old WebKit.
- The CSS may only set `max-width: none !important`. `scripts/smoke.ts` enforces
  this and the selector list. When you change a selector, change the roster in
  `scripts/smoke.ts` in the same commit.
- The content script must remove every node it adds. bb calls the disposer on
  disable, reload and window close.
- To find new selectors after a bb update, inspect the live thread page DOM.
  Do not guess them from class names.

## Hooks

`scripts/setup-hooks` sets `core.hooksPath=.githooks` for this clone.

- `pre-commit`: secret scan, whitespace and Markdown lint, then
  `.githooks/pre-commit.d/10-staged-lint` (Biome on the full staged snapshot).
- `commit-msg`: Conventional Commits subject, a body, and `Signed-off-by`.
  [.githooks/GIT_CONVENTION.md](.githooks/GIT_CONVENTION.md) has the rules.
- `pre-push`: signature, DCO, message and secret scan on each pushed commit,
  then the generic scanners and `.githooks/pre-push.d/10-npm-checks`
  (`npm ci`, lint, typecheck, build, smoke, `npm audit`).

Do not edit the generic hook files (`.githooks/*` and `.githooks/lib/`). They
are copies of a shared template. Put repository checks in
`.githooks/<hook>.d/`. Never use `--no-verify`.

## Dependencies and security

- `.npmrc` turns off install scripts, pins exact versions and blocks packages
  younger than 7 days. Keep these settings.
- Pin the `@get-bb/plugin-sdk` version to a release that is at least 7 days old.
- The plugin runs as full-trust page code in bb. Do not add network calls,
  storage, or DOM changes outside the layout rules.
- Report vulnerabilities as [SECURITY.md](SECURITY.md) tells you.

## More

- [CONTRIBUTING.md](CONTRIBUTING.md): how to send a change.
- [SECURITY.md](SECURITY.md): how to report a vulnerability.
- [LICENSE](LICENSE): MIT.
