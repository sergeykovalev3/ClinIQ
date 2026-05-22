const FADE_START = 8;
const FADE_END = 96;

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

export function getMenuFabProgress(scrollY: number) {
  if (scrollY <= FADE_START) return 0;
  if (scrollY >= FADE_END) return 1;
  const linear = (scrollY - FADE_START) / (FADE_END - FADE_START);
  return smoothstep(linear);
}
