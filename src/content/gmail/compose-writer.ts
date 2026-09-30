import type { CoachingIssue } from "@/src/_shared/types";
import { getComposeRecipients } from "@/src/_shared/helpers/gmail/get-compose-recipients";

type RecipientField = "to" | "cc" | "bcc";

const RECIPIENT_INPUTS: Record<RecipientField, string> = {
    to: 'input[aria-label="To recipients" i], input[name="to" i]',
    cc: 'input[aria-label="CC recipients" i], input[name="cc" i]',
    bcc: 'input[aria-label="BCC recipients" i], input[name="bcc" i]',
};

const FIELD_BUTTONS: Record<Exclude<RecipientField, "to">, RegExp> = {
    cc: /add\s*cc|cc\s*recipients/i,
    bcc: /add\s*bcc|bcc\s*recipients/i,
};

function getRecipientInput(compose: HTMLElement, field: RecipientField) {
    return compose.querySelector<HTMLInputElement>(RECIPIENT_INPUTS[field]);
}

function revealRecipientField(
    compose: HTMLElement,
    field: Exclude<RecipientField, "to">
): boolean {
    if (getRecipientInput(compose, field)) return true;

    const button = [...compose.querySelectorAll<HTMLElement>(
        'button, [role="button"]'
    )].find((element) => {
        const label = `${element.getAttribute("aria-label") ?? ""} ${element.textContent ?? ""}`;
        return FIELD_BUTTONS[field].test(label);
    });

    button?.click();
    return Boolean(getRecipientInput(compose, field));
}

async function addRecipient(compose: HTMLElement, field: RecipientField, email: string): Promise<boolean> {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return false;

    const input = getRecipientInput(compose, field);
    if (!input) return false;

    const label = field === "to" ? "To recipients" : field === "cc" ? "CC recipients" : "BCC recipients";
    const existing = getComposeRecipients(compose, label, field)
        .some((address) => address.toLowerCase() === normalizedEmail.toLowerCase());
    if (existing) return true;

    input.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, normalizedEmail);
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: normalizedEmail }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", code: "Enter", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    return getComposeRecipients(compose, label, field)
        .some((address) => address.toLowerCase() === normalizedEmail.toLowerCase());
}

function removeRecipient(compose: HTMLElement, field: RecipientField, email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const input = getRecipientInput(compose, field);
    if (!input) return false;

    let recipientArea: HTMLElement | null = input.parentElement;
    while (recipientArea && compose.contains(recipientArea)) {
        const addressNode = [...recipientArea.querySelectorAll<HTMLElement>("[email], [data-hovercard-id]")]
            .find((node) => {
                const address = node.getAttribute("email") ?? node.getAttribute("data-hovercard-id");
                return address?.trim().toLowerCase() === normalizedEmail;
            });
        if (addressNode) {
            let chip: HTMLElement | null = addressNode;
            while (chip && chip !== recipientArea.parentElement) {
                const removeButton = chip.querySelector<HTMLElement>(
                    'button[aria-label*="remove" i], [role="button"][aria-label*="remove" i], button[title*="remove" i]'
                );
                if (removeButton) {
                    removeButton.click();
                    return true;
                }
                if (chip === recipientArea) break;
                chip = chip.parentElement;
            }
            return false;
        }
        if (recipientArea === compose) break;
        recipientArea = recipientArea.parentElement;
    }
    return true;
}

export async function applyRecipientChanges(
    compose: HTMLElement,
    issue: CoachingIssue
): Promise<boolean> {
    const action = issue.action;
    const fields: RecipientField[] = ["to", "cc", "bcc"];
    const changes: { field: RecipientField; add: string[]; remove: string[] }[] = [
        { field: "to", add: action.addTo ?? [], remove: action.removeTo ?? [] },
        { field: "cc", add: action.addCc ?? [], remove: action.removeCc ?? [] },
        { field: "bcc", add: action.addBcc ?? [], remove: action.removeBcc ?? [] },
    ];

    for (const field of fields) {
        if ((changes.find((change) => change.field === field)?.add.length ?? 0) > 0 && field !== "to") {
            revealRecipientField(compose, field);
        }
    }

    // Gmail may render a newly revealed field asynchronously.
    await new Promise((resolve) => window.setTimeout(resolve, 100));

    let success = true;
    for (const change of changes) {
        for (const email of change.add) success = await addRecipient(compose, change.field, email) && success;
        for (const email of change.remove) success = removeRecipient(compose, change.field, email) && success;
    }
    return success;
}

export function updateComposeBody(
    compose: HTMLElement,
    replacement: string | undefined,
    bodyText: unknown
): boolean {

    if (typeof replacement !== "string" || !replacement.trim()) return false;

    console.log("Compose Writer started");
    console.log("Replacement:", replacement);
    console.log("Body Text:", bodyText);
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

    div.innerText = replacement;

    body.appendChild(div);

    body.dispatchEvent(
        new InputEvent("input", {
            bubbles: true,
            inputType: "insertText",
            data: `${typeof bodyText === "string" ? bodyText : ""}${replacement}`,
        })
    );

    return true;
}
