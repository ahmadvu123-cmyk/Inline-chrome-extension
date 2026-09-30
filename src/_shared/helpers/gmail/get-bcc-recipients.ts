import { getComposeRecipients } from "./get-compose-recipients";

export function getBccRecipients(compose: HTMLElement): string[]{
    return getComposeRecipients(compose, "BCC recipients", "bcc");
}