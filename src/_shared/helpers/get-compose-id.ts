const composeIds = new WeakMap<HTMLElement, string>();
let composeCounter = 0;

export function getComposeId(compose: HTMLElement): string {
  let id = composeIds.get(compose);

  if (!id) {
    composeCounter++;
    id = `compose-${composeCounter}`;
    composeIds.set(compose, id);
  }

  return id;
}