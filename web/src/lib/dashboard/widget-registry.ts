import type { DashboardWidgetDefinition } from "./dashboard-types";
import { AnnouncementsWidget } from "@/components/dashboard/widgets/AnnouncementsWidget";
import { AtRiskStudentsWidget } from "@/components/dashboard/widgets/AtRiskStudentsWidget";
import { CalendarWidget } from "@/components/dashboard/widgets/CalendarWidget";
import { CoursesWidget } from "@/components/dashboard/widgets/CoursesWidget";
import { GroupsWidget } from "@/components/dashboard/widgets/GroupsWidget";
import { MessagesWidget } from "@/components/dashboard/widgets/MessagesWidget";
import { PendingReviewsWidget } from "@/components/dashboard/widgets/PendingReviewsWidget";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { StudentsStatsWidget } from "@/components/dashboard/widgets/StudentsStatsWidget";
import { TestsWidget } from "@/components/dashboard/widgets/TestsWidget";
import { TodayScheduleWidget } from "@/components/dashboard/widgets/TodayScheduleWidget";

export const widgetRegistry: DashboardWidgetDefinition[] = [
  { id: "today_schedule", title: "Розклад на сьогодні", description: "Найближчі уроки та слоти", defaultSize: "wide", component: TodayScheduleWidget },
  { id: "pending_reviews", title: "На перевірці", description: "Домашні завдання, що очікують оцінки", defaultSize: "medium", component: PendingReviewsWidget },
  { id: "messages", title: "Повідомлення", description: "Останні LMS/Telegram діалоги", defaultSize: "medium", component: MessagesWidget },
  { id: "students_stats", title: "Статистика учнів", description: "Прогрес і відвідуваність", defaultSize: "medium", component: StudentsStatsWidget },
  { id: "courses", title: "Курси", description: "Стан активних курсів", defaultSize: "small", component: CoursesWidget },
  { id: "groups", title: "Групи", description: "Групи та коди запрошення", defaultSize: "small", component: GroupsWidget },
  { id: "tests", title: "Тести", description: "Останні тести та результати", defaultSize: "small", component: TestsWidget },
  { id: "quick_actions", title: "Швидкі дії", description: "Створення уроку, курсу, задачі", defaultSize: "small", component: QuickActionsWidget },
  { id: "announcements", title: "Оголошення", description: "Анонси для груп", defaultSize: "medium", component: AnnouncementsWidget },
  { id: "recent_activity", title: "Остання активність", description: "Що робили учні", defaultSize: "wide", component: RecentActivityWidget },
  { id: "at_risk_students", title: "Учні в ризику", description: "Ті, кому потрібна увага", defaultSize: "medium", component: AtRiskStudentsWidget },
  { id: "calendar", title: "Календар", description: "Події та дедлайни", defaultSize: "medium", component: CalendarWidget },
];

export const widgetRegistryMap = new Map(widgetRegistry.map((widget) => [widget.id, widget]));
