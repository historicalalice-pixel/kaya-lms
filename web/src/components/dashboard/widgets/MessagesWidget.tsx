import type { DashboardWidgetProps } from "@/lib/dashboard/dashboard-types";

export default function MessagesWidget(_props: DashboardWidgetProps) {
  return (
    <div style={{ padding: "16px 4px" }}>
      <p
        style={{
          fontSize: "0.78rem",
          color: "rgba(229,223,212,0.74)",
          lineHeight: 1.5,
        }}
      >
        Тут з'явиться вміст блоку «Повідомлення». Підключення до даних — на наступному етапі.
      </p>
    </div>
  );
}