import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTaskStatus } from "../lib/taskUtils";

const CalendarView = ({ tasks, onTaskClick }) => {
  const events = tasks.map((task) => {
    const status = getTaskStatus(task);
    let backgroundColor = "#3b82f6"; // blue for due today
    let borderColor = "#2563eb";

    if (status === "completed") {
      backgroundColor = "#22c55e"; // green
      borderColor = "#16a34a";
    } else if (status === "overdue") {
      backgroundColor = "#ef4444"; // red
      borderColor = "#dc2626";
    }

    const opacity =
      task.priority === "high"
        ? "1"
        : task.priority === "medium"
        ? "0.8"
        : "0.6";

    return {
      id: task.id,
      title: task.title,
      date: task.dueDate,
      backgroundColor: backgroundColor + opacity,
      borderColor,
      textColor: "#ffffff",
      classNames: ["rounded-md", "shadow-sm"],
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          const task = tasks.find((t) => t.id === info.event.id);
          if (task) onTaskClick(task);
        }}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        dayMaxEvents={true}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        eventDisplay="block"
        eventClassNames="rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        dayCellClassNames="hover:bg-gray-50"
        slotLabelClassNames="text-gray-600"
        dayHeaderClassNames="text-gray-700 font-semibold"
        titleFormat={{ year: "numeric", month: "long" }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
        }}
        buttonClassNames="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
        viewClassNames="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default CalendarView;
