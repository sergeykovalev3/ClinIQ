export const MAGNETIC_DURATION = 0.52;
export const MAGNETIC_EASE = "power2.out";
export const MAGNETIC_SPRING_DURATION = 1.05;
export const MAGNETIC_SPRING_EASE = "elastic.out(1, 0.52)";

export function magneticOffset(
  dx: number,
  dy: number,
  radius: number,
  strength: number,
) {
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || radius === 0) return { x: 0, y: 0 };
  const norm = Math.min(dist / radius, 1);
  const edge = 0.3 + 0.7 * norm * norm;
  return { x: dx * strength * edge, y: dy * strength * edge };
}
