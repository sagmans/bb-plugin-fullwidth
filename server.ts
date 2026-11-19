// bb-plugin-fullwidth backend entry.
//
// bb requires every plugin to declare a server entry. All behaviour lives in
// app.tsx (a layout content script), so the backend intentionally does nothing.
import type { BbPluginApi } from "@get-bb/plugin-sdk";

export default function fullwidthPlugin(_bb: BbPluginApi): void {}
