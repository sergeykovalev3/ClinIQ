export type ScrollToHashOptions = {
  offset?: number;
  onComplete?: () => void;
};

export type NavTransitionRequest = {
  href: string;
  options?: ScrollToHashOptions;
};

type NavTransitionRunner = (request: NavTransitionRequest) => boolean;

let navTransitionRunner: NavTransitionRunner | null = null;

export function registerNavTransitionRunner(runner: NavTransitionRunner | null) {
  navTransitionRunner = runner;
}

export function requestNavTransition(request: NavTransitionRequest) {
  if (!navTransitionRunner) return false;
  return navTransitionRunner(request);
}
