type NavScrollHandlers = {
  onStart?: () => void;
  onEnd?: () => void;
};

const handlers = new Set<NavScrollHandlers>();

let navScrolling = false;
let navGeneration = 0;

export function isNavScrolling() {
  return navScrolling;
}

export function subscribeNavScroll(listener: NavScrollHandlers) {
  handlers.add(listener);
  return () => {
    handlers.delete(listener);
  };
}

export function beginNavScroll() {
  navGeneration += 1;
  navScrolling = true;
  handlers.forEach((handler) => handler.onStart?.());
  return navGeneration;
}

export function endNavScroll(generation: number) {
  if (generation !== navGeneration) return;
  navScrolling = false;
  handlers.forEach((handler) => handler.onEnd?.());
}
