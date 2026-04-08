import type { ComponentType } from "react";
import type { DashboardWidgetDefinition, DashboardWidgetProps } from "./dashboard-types";

// =====================================================
// Тимчасова заглушка для всіх віджетів
// На наступному етапі замінимо на реальні компоненти
// з components/dashboard/widgets/
// =====================================================

const PlaceholderWidget: ComponentType<DashboardWidgetProps> = () => null;

// =====================================================
// Реєстр усіх доступних віджетів
// =====================================================

export const WIDGET_REGISTRY: DashboardWidgetDefinition[] = [
  {
    id: "today_schedule",
    title: "Уроки сьогодні",
    description: "Розклад занять, Zoom-посилання та найближчі уроки",
    defaultSize: "wide",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "pending_reviews",
    title: "Перевірка ДЗ",
    description: "Здані роботи, що очікують оцінювання",
    defaultSize: "medium",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "messages",
    title: "Повідомлення",
    description: "Останні повідомлення від учнів і колег",
    defaultSize: "medium",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "students_stats",
    title: "Статистика учнів",
    description: "Прогрес, активність і успішність ваших учнів",
    defaultSize: "medium",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "courses",
    title: "Курси",
    description: "Швидкий доступ до ваших курсів",
    defaultSize: "medium",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "groups",
    title: "Групи",
    description: "Огляд активних груп та їхніх учасників",
    defaultSize: "small",
    defaultVisible: false,
    component: PlaceholderWidget,
  },
  {
    id: "tests",
    title: "Тести",
    description: "Заплановані та активні тести",
    defaultSize: "small",
    defaultVisible: false,
    component: PlaceholderWidget,
  },
  {
    id: "quick_actions",
    title: "Швидкі дії",
    description: "Кнопки для частих операцій: створити урок, тест, ДЗ",
    defaultSize: "small",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "announcements",
    title: "Оголошення",
    description: "Важливі повідомлення для учнів і груп",
    defaultSize: "small",
    defaultVisible: false,
    component: PlaceholderWidget,
  },
  {
    id: "recent_activity",
    title: "Остання активність",
    description: "Що нещодавно робили ваші учні в курсах",
    defaultSize: "medium",
    defaultVisible: true,
    component: PlaceholderWidget,
  },
  {
    id: "at_risk_students",
    title: "Учні в зоні ризику",
    description: "Учні з низькою активністю або відстаючою успішністю",
    defaultSize: "medium",
    defaultVisible: false,
    component: PlaceholderWidget,
  },
  {
    id: "calendar",
    title: "Календар",
    description: "Найближчі події, дедлайни та зустрічі",
    defaultSize: "wide",
    defaultVisible: false,
    component: PlaceholderWidget,
  },
];

// =====================================================
// Утиліти для роботи з реєстром
// =====================================================

/** Знайти визначення віджета за його ID */
export function getWidgetDefinition(widgetId: string): DashboardWidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => w.id === widgetId);
}

/** Перевірити, чи існує віджет із таким ID */
export function isKnownWidget(widgetId: string): boolean {
  return WIDGET_REGISTRY.some((w) => w.id === widgetId);
}

/** Список ID усіх віджетів */
export function getAllWidgetIds(): string[] {
  return WIDGET_REGISTRY.map((w) => w.id);
}