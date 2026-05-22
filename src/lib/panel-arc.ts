export const arcPanelEdgeOrigin = "100% 50%";

export const arcFlatTransform = {
  scaleX: 0,
  transformOrigin: arcPanelEdgeOrigin,
  force3D: true,
} as const;

export const arcFullTransform = {
  scaleX: 1,
  transformOrigin: arcPanelEdgeOrigin,
  force3D: true,
} as const;

export function getPanelHiddenTransform() {
  return {
    xPercent: 100,
    x: 0,
  };
}

export const panelVisibleTransform = {
  xPercent: 0,
  x: 0,
} as const;
