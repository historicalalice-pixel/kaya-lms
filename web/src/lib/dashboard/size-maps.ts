import type { WidgetSize } from "./dashboard-types";

export const GRID_COLUMNS = {
  desktop: 12,
  tablet: 6,
  mobile: 1,
} as const;

export const DESKTOP_WIDTH_BY_SIZE: Record<WidgetSize, number> = {
  small: 3,
  medium: 6,
  wide: 9,
  full: 12,
};

export const TABLET_WIDTH_BY_SIZE: Record<WidgetSize, number> = {
  small: 3,
  medium: 6,
  wide: 6,
  full: 6,
};

export const MOBILE_WIDTH_BY_SIZE: Record<WidgetSize, number> = {
  small: 1,
  medium: 1,
  wide: 1,
  full: 1,
};

export function widthForSize(size: WidgetSize, columns: number) {
  if (columns === GRID_COLUMNS.mobile) return MOBILE_WIDTH_BY_SIZE[size];
  if (columns === GRID_COLUMNS.tablet) return TABLET_WIDTH_BY_SIZE[size];
  return DESKTOP_WIDTH_BY_SIZE[size];
}
