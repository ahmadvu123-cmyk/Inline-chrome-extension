import { getComposeRecipients } from "./get-compose-recipients";

export function getCcRecipients(compose: HTMLElement): string[]{
    return getComposeRecipients(compose, "CC recipients", "cc");
}