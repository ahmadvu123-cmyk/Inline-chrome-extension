import { getComposeRecipients } from "./get-compose-recipients";

export function getRecipients(compose: HTMLElement): string[]{
    return getComposeRecipients(compose, "To recipients", "to");
} 