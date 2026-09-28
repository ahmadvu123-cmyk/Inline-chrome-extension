export function getCcRecipients(compose: HTMLElement): string[]{
    return Array.from(
        compose.querySelectorAll<HTMLInputElement>(
            'input[name="cc"]'
        )
    ).map((element) => element.value.trim()).filter(Boolean);
}