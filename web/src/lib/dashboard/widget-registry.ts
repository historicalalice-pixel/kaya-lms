import type { DashboardWidgetDefinition } from "./dashboard-types";

import TodayScheduleWidget from "@/components/dashboard/widgets/TodayScheduleWidget";
import PendingReviewsWidget from "@/components/dashboard/widgets/PendingReviewsWidget";
import MessagesWidget from "@/components/dashboard/widgets/MessagesWidget";
import StudentsStatsWidget from "@/components/dashboard/widgets/StudentsStatsWidget";
import CoursesWidget from "@/components/dashboard/widgets/CoursesWidget";
import GroupsWidget from "@/components/dashboard/widgets/GroupsWidget";
import TestsWidget from "@/components/dashboard/widgets/TestsWidget";
import QuickActionsWidget from "@/components/dashboard/widgets/QuickActionsWidget";
import AnnouncementsWidget from "@/components/dashboard/widgets/AnnouncementsWidget";
import RecentActivityWidget from "@/components/dashboard/widgets/RecentActivityWidget";
import AtRiskStudentsWidget from "@/components/dashboard/widgets/AtRiskStudentsWidget";
import CalendarWidget from "@/components/dashboard/widgets/CalendarWidget";

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
    component: TodayScheduleWidget,
  },
  {
    id: "pending_reviews",
    title: "Перевірка ДЗ",
    description: "Здані роботи, що очікують оцінювання",
    defaultSize: "medium",
    defaultVisible: true,
    component: PendingReviewsWidget,
  },
  {
    id: "messages",
    title: "Повідомлення",
    description: "Останні повідомлення від учнів і колег",
    defaultSize: "medium",
    defaultVisible: true,
    component: MessagesWidget,
  },
  {
    id: "students_stats",
    title: "Статистика учнів",
    description: "Прогрес, активність і успішність ваших учнів",
    defaultSize: "medium",
    defaultVisible: true,
    component: StudentsStatsWidget,
  },
  {
    id: "courses",
    title: "Курси",
    description: "Швидкий доступ до ваших курсів",
    defaultSize: "medium",
    defaultVisible: true,
    component: CoursesWidget,
  },
  {
    id: "groups",
    title: "Групи",
    description: "Огляд активних груп та їхніх учасників",
    defaultSize: "small",
    defaultVisible: false,
    component: GroupsWidget,
  },
  {
    id: "tests",
    title: "Тести",
    description: "Заплановані та активні тести",
    defaultSize: "small",
    defaultVisible: false,
    component: TestsWidget,
  },
  {
    id: "quick_actions",
    title: "Швидкі дії",
    description: "Кнопки для частих операцій: створити урок, тест, ДЗ",
    defaultSize: "small",
    defaultVisible: true,
    component: QuickActionsWidget,
  },
  {
    id: "announcements",
    title: "Оголошення",
    description: "Важливі повідомлення для учнів і груп",
    defaultSize: "small",
    defaultVisible: false,
    component: AnnouncementsWidget,
  },
  {
    id: "recent_activity",
    title: "Остання активність",
    description: "Що нещодавно робили ваші учні в курсах",
    defaultSize: "medium",
    defaultVisible: true,
    component: RecentActivityWidget,
  },
  {
    id: "at_risk_students",
    title: "Учні в зоні ризику",
    description: "Учні з низькою активністю або відстаючою успішністю",
    defaultSize: "medium",
    defaultVisible: false,
    component: AtRiskStudentsWidget,
  },
  {
    id: "calendar",
    title: "Календар",
    description: "Найближчі події, дедлайни та зустрічі",
    defaultSize: "wide",
    defaultVisible: false,
    component: CalendarWidget,
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