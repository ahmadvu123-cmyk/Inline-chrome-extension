export function updateComposeBody(
    compose: HTMLElement,
    replacement: string,
    bodyText: unknown
): boolean {

    const body =
        compose.querySelector<HTMLElement>(
            '[contenteditable="true"]'
        );

    if (!body) {
        return false;
    }

    body.focus();

    body.innerHTML = "";

    const div =
        document.createElement("div");

    div.innerText =
        replacement;

    body.appendChild(div);

    body.dispatchEvent(
        new InputEvent("input", {
            bubbles: true,
            inputType: "insertText",
            data: bodyText + replacement,
        })
    );

    return true;
}