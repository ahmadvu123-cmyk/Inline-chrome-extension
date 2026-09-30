const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function findEmails(value: string | null | undefined): string[] {
    return value?.match(EMAIL_PATTERN) ?? [];
}

export function getComposeRecipients(
    compose: HTMLElement,
    ariaLabel: string,
    inputName: string
): string[] {
    const inputs = compose.querySelectorAll<HTMLInputElement>(
        `input[aria-label="${ariaLabel}" i], input[name="${inputName}" i]`
    );
    const recipients = new Map<string, string>();

    const addEmails = (value: string | null | undefined) => {
        for (const email of findEmails(value)) {
            recipients.set(email.toLowerCase(), email);
        }
    };

    for (const input of inputs) {
        addEmails(input.value);

        let ancestor = input.parentElement;
        while (ancestor && compose.contains(ancestor)) {
            const chips = ancestor.querySelectorAll<HTMLElement>(
                "[email], [data-hovercard-id]"
            );
            let foundChipEmail = false;

            for (const chip of chips) {
                const emails = [
                    ...findEmails(chip.getAttribute("email")),
                    ...findEmails(chip.getAttribute("data-hovercard-id")),
                ];
                if (emails.length) foundChipEmail = true;
                emails.forEach(addEmails);
            }

            if (foundChipEmail || ancestor === compose) break;
            ancestor = ancestor.parentElement;
        }
    }

    return [...recipients.values()];
}