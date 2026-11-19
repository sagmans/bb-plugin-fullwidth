// bb-plugin-fullwidth frontend entry.
//
// The thread layout lives in host-owned DOM that no slot exposes, so the rules
// go in through a content script (bb's documented hook for styling app-shell
// DOM). An imported app.css would not work here: its lifetime follows the
// plugin's own rendered UI, not the whole app window.
import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { STYLE_ELEMENT_ID, buildLayoutCss } from "./src/layout.ts";

/** Content script id; unique within this plugin. */
const CONTENT_SCRIPT_ID = "fullwidth-layout";

export default definePluginApp((app) => {
  app.contentScripts.register({
    id: CONTENT_SCRIPT_ID,
    mount() {
      // A stale node can survive a crashed earlier generation; replace it so
      // only one copy of the rules is ever active.
      document.getElementById(STYLE_ELEMENT_ID)?.remove();
      const style = document.createElement("style");
      style.id = STYLE_ELEMENT_ID;
      style.textContent = buildLayoutCss();
      document.head.append(style);
      // bb calls this on disable, reload and window teardown, which restores
      // the default 760px layout immediately.
      return () => style.remove();
    },
  });
});
