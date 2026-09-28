export function getBodyElement(compose: HTMLElement): HTMLElement | null {
    return compose.querySelector<HTMLElement>(
        '[contenteditable="true"]'
    );
}