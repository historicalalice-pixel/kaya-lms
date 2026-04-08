import type { ComponentType } from "react";

// =====================================================
// Розміри віджетів
// =====================================================

export type WidgetSize = "small" | "medium" | "wide" | "full";

// =====================================================
// Визначення віджета (метадані для registry)
// =====================================================

export type DashboardWidgetDefinition = {
  /** Унікальний ID типу віджета (наприклад, "today_schedule") */
  id: string;
  /** Заголовок, який показується в шапці віджета і в панелі додавання */
  title: string;
  /** Короткий опис для панелі додавання */
  description: string;
  /** Розмір за замовчуванням при додаванні */
  defaultSize: WidgetSize;
  /** Чи показувати віджет у дефолтному layout */
  defaultVisible?: boolean;
  /** Мінімальний дозволений розмір (опціонально) */
  minSize?: WidgetSize;
  /** Максимальний дозволений розмір (опціонально) */
  maxSize?: WidgetSize;
  /** React-компонент, який рендерить вміст віджета */
  component: ComponentType<DashboardWidgetProps>;
};

// =====================================================
// Пропси, які отримує кожен віджет при рендері
// =====================================================

export type DashboardWidgetProps = {
  /** ID екземпляра віджета в layout (не плутати з widgetId) */
  instanceId: string;
};

// =====================================================
// Один елемент у збереженому layout
// =====================================================

export type DashboardLayoutItem = {
  /** Унікальний ID екземпляра у layout (наприклад, "today_schedule-1") */
  id: string;
  /** ID типу віджета з registry */
  widgetId: string;
  /** Чи видимий зараз */
  visible: boolean;
  /** Поточний розмір */
  size: WidgetSize;
  /** Координати у grid (для react-grid-layout) */
  x: number;
  y: number;
  w: number;
  h: number;
};

// =====================================================
// Повний layout, що зберігається в Supabase
// =====================================================

export type DashboardLayout = {
  version: number;
  items: DashboardLayoutItem[];
};

// =====================================================
// Брейкпоінти grid-системи
// =====================================================

export type GridBreakpoint = "desktop" | "tablet" | "mobile";