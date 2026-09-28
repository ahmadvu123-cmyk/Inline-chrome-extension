import { findComposeWindow } from "@/src/content/gmail/compose-detector";
import { setupCompose } from "./setup-compose";

let pageObserver: MutationObserver | undefined;

export async function scanComposes() {
    const composes = findComposeWindow();

    for (const compose of composes) {
        setupCompose(compose);
    }
    if (pageObserver) {
        return;
    }

    pageObserver = new MutationObserver(scanComposes);

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}