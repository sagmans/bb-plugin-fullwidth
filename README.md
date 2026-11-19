# bb-plugin-fullwidth

A bb plugin that lets the thread page use the full pane width.

bb limits the thread transcript and the composer to a 760px column. Markdown
tables break out of that column, so on a wide window the tables are wider
than the messages around them. This plugin removes the 760px limit. Messages,
the composer, and the cards above the composer then use the same width as the
tables.

## Install

```sh
npm ci
npm run build
bb plugin install "$PWD" --yes
```

To go back to the default layout, disable the plugin:

```sh
bb plugin disable fullwidth
```

The change applies at once in every open bb window. No reload is necessary.

## How it works

`app.tsx` registers a content script. The script adds one `<style>` element
that sets `max-width: none` on two bb elements:

| Selector | Element |
| --- | --- |
| `main div:has(+ [data-scroll-footer])` | Thread transcript column |
| `.chat-prompt-box` | Composer and the cards above it |

The rules are in `src/layout.ts`. When bb disables or reloads the plugin, the
script removes the element.

If a bb update changes these selectors, the plugin does nothing and bb shows
its default layout. Update `src/layout.ts` and the roster in
`scripts/smoke.ts` together.

## Checks

```sh
npm run typecheck
npm run smoke
npm run build
```

Run `scripts/setup-hooks` once after you clone. The `pre-push` hook runs the
same checks and `npm audit`.

## License

MIT. See [LICENSE](LICENSE).
