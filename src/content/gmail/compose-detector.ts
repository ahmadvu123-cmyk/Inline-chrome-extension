export function findComposeWindow(): HTMLElement[] {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>(
            '[role="dialog"], .aoI'
        )
    )
    return elements.filter((element) => {
        return Boolean(
            element.querySelector(
                '[contenteditable = true]'
            )
        )
    })
}