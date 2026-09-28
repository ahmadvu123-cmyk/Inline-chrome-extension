import { debounce } from "../debounce";
import { observeCompose } from "@/src/content/gmail/compose-observer";
import { analyzeCurrentCompose } from "./analyze-current-compose";

const observers = new WeakMap<HTMLElement, MutationObserver>();


export function setupCompose(compose: HTMLElement) {
  if (observers.has(compose)) {
    return;
  }

  const analyze = debounce(() => {
    void analyzeCurrentCompose(compose).catch((error: unknown) => {
      console.error("Automatic compose analysis failed:", error);
    });
  }, 1200);

  const observer = observeCompose(compose, analyze);

  observers.set(compose, observer);
}