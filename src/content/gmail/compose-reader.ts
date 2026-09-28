import type { ComposeData } from "../../_shared/types";
import { getSubject } from "@/src/_shared/helpers/gmail/get-subject";
import { getRecipients } from "@/src/_shared/helpers/gmail/get-recipients";
import { getCcRecipients } from "@/src/_shared/helpers/gmail/get-cc-recipients";
import { getBccRecipients } from "@/src/_shared/helpers/gmail/get-bcc-recipients";
import { getBody } from "@/src/_shared/helpers/gmail/get-body";


export function readCompose(
  compose: HTMLElement,
  composeId: string,
  sender: string
): ComposeData {
  return {
    composeId,
    sender,
    recipients: getRecipients(compose),
    ccRecipients: getCcRecipients(compose),
    bccRecipients: getBccRecipients(compose),
    subject: getSubject(compose),
    body: getBody(compose),
  };
}