export function getBccRecipients(compose: HTMLElement): string[]{
    return Array.from(
        compose.querySelectorAll<HTMLInputElement>(
            'input[name="bcc"]'
        )
    ).map((element) => element.value.trim()).filter(Boolean);
}