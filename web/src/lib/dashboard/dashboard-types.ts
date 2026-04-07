import type React from "react";

export type WidgetSize = "small" | "medium" | "wide" | "full";

export type DashboardWidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: WidgetSize;
  defaultVisible?: boolean;
  minSize?: WidgetSize;
  maxSize?: WidgetSize;
  component: React.ComponentType;
};

export type DashboardLayoutItem = {
  id: string;
  widgetId: string;
  visible: boolean;
  size: WidgetSize;
  x: number;
  y: number;
  w: number;
  h: number;
  order: number;
};

export type TeacherDashboardLayout = {
  version: 1;
  items: DashboardLayoutItem[];
};
