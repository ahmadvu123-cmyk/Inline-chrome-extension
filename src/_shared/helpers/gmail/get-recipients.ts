export function getRecipients(compose: HTMLElement): string[]{
    return Array.from(
        compose.querySelectorAll<HTMLInputElement>(
            'input[name="to"]'
        )
    ).map((element) => element.value.trim()).filter(Boolean);
}