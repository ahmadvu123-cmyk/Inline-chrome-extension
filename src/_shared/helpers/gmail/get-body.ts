import { getBodyElement } from "./get-body-element";

export function getBody(compose: HTMLElement): string{
    const body = getBodyElement(compose);
    return body?.innerText.trim() ?? "";
}