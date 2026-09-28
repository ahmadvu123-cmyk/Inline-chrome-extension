export function observeCompose(
    compose: HTMLElement,
    callback: (mutations: MutationRecord[]) => void
): MutationObserver {
    const observer = new MutationObserver((mutations) => {
        const composeChanges = mutations.filter((mutation) => {
            const target = mutation.target;
            if (target instanceof Element && target.closest("[data-gmail-coach-panel]")) {
                return false;
            }

            const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
            return !changedNodes.some((node) =>
                node instanceof Element &&
                (node.matches("[data-gmail-coach-panel]") ||
                    node.querySelector("[data-gmail-coach-panel]"))
            );
        });

        if (composeChanges.length > 0) {
            callback(composeChanges);
        }
    })
    observer.observe(compose, {
        childList: true,
        subtree: true,
        characterData: true,
    })
    return observer;
}