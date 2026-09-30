import type { CoachingAnalysis } from "../types";
import { applyRecipientChanges, updateComposeBody } from "@/src/content/gmail/compose-writer";

const PANEL_ATTRIBUTE = "data-gmail-coach-panel";

export function showSuggestionBox(
    compose: HTMLElement,
    suggestionData: CoachingAnalysis,
    bodyText: unknown
): void {
    compose.querySelector(`[${PANEL_ATTRIBUTE}]`)?.remove();

    if (!suggestionData?.shouldShow || !suggestionData.issues?.length) return;

    const issues = suggestionData.issues.filter((issue) => {
        if (issue.type === "RECIPIENT_SUGGESTION") {
            const action = issue.action;
            return [action?.addTo, action?.removeTo, action?.addCc, action?.removeCc,
                action?.addBcc, action?.removeBcc].some((addresses) => addresses?.length);
        }
        return Boolean(issue.action?.replacement?.trim());
    });
    if (!issues.length) return;

    if (getComputedStyle(compose).position === "static") {
        compose.style.position = "relative";
    }

    const host = document.createElement("div");
    host.setAttribute(PANEL_ATTRIBUTE, "");
    host.style.cssText =
        "position:absolute;right:16px;bottom:64px;z-index:2147483647;";

    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
    .box { width: 280px; box-sizing: border-box; padding: 12px; background: #fff;
      border: 1px solid #dadce0; border-left: 4px solid #1a73e8; border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,.2); font: 13px Arial, sans-serif; color: #202124; }
    .text { margin: 0 0 10px; padding: 8px; background: #e8f0fe; border-radius: 4px;
      line-height: 1.45; white-space: pre-wrap; max-height: 120px; overflow: auto; }
    .actions { display: flex; gap: 8px; }
    button { padding: 5px 12px; border: 1px solid #dadce0; border-radius: 4px;
      background: #fff; color: #202124; cursor: pointer; font-size: 12px; }
    button.accept { border-color: #1a73e8; background: #1a73e8; color: #fff; }
  `;

    const box = document.createElement("div");
    box.className = "box";
    shadow.append(style, box);
    compose.append(host);

    let index = 0;

    const render = () => {
        const issue = issues[index];
        const replacement = issue.action.replacement;
        box.replaceChildren();

        const text = document.createElement("p");
        text.className = "text";
        text.textContent = issue.type === "RECIPIENT_SUGGESTION"
            ? issue.suggestion || issue.message || issue.title
            : replacement ?? issue.suggestion ?? issue.message;

        if (issue.type === "RECIPIENT_SUGGESTION") {
            const changes = [
                ["To", issue.action.addTo, issue.action.removeTo],
                ["CC", issue.action.addCc, issue.action.removeCc],
                ["BCC", issue.action.addBcc, issue.action.removeBcc],
            ] as const;
            for (const [field, additions, removals] of changes) {
                if (!additions?.length && !removals?.length) continue;
                const line = document.createElement("div");
                line.textContent = `${field}: ${[
                    ...(additions ?? []).map((address) => `Add ${address}`),
                    ...(removals ?? []).map((address) => `Remove ${address}`),
                ].join("; ")}`;
                text.append(document.createElement("br"), line);
            }
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const accept = document.createElement("button");
        accept.className = "accept";
        accept.textContent = "Accept";
        accept.addEventListener("click", async () => {
            accept.disabled = true;
            if (issue.type === "RECIPIENT_SUGGESTION") {
                const applied = await applyRecipientChanges(compose, issue);
                if (applied) host.remove();
                else {
                    accept.disabled = false;
                    text.textContent = "Could not apply every recipient change. Please check the To, CC, and BCC fields and try again.";
                }
                return;
            }
            if (updateComposeBody(compose, replacement, bodyText)) host.remove();
            else accept.disabled = false;
        });

        const reject = document.createElement("button");
        reject.textContent = "Reject";
        reject.addEventListener("click", () => {
            index++;
            if (index >= issues.length) host.remove();
            else render();
        });

        actions.append(accept, reject);
        box.append(text, actions);
    };

    render();
}
