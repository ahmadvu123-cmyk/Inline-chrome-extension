import { debounce } from "../debounce";
import { observeCompose } from "@/src/content/gmail/compose-observer";
import { analyzeCurrentCompose } from "./analyze-current-compose";

const observers = new WeakMap<HTMLElement, MutationObserver>();
const enabledComposes = new WeakSet<HTMLElement>();

export function enableComposeAutoAnalysis(compose: HTMLElement) {
  enabledComposes.add(compose);
}

export function setupCompose(compose: HTMLElement) {
  if (observers.has(compose)) {
    return;
  }

  const analyze = debounce(() => {
    if (!enabledComposes.has(compose)) {
      return;
    }

    void analyzeCurrentCompose(compose).catch((error: unknown) => {
      console.error("Automatic compose analysis failed:", error);
    });
  }, 500);

  const observer = observeCompose(compose, analyze);

  observers.set(compose, observer);
}