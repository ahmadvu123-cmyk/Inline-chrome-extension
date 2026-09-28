export function getSubject(compose: HTMLElement): string{
    const subject = compose.querySelector<HTMLInputElement>(
        'input[name="subjectbox"]'
    );
    return subject?.value.trim() ?? "";
}