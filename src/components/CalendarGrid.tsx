import type { ReactNode } from "react";

import type { CalendarEvent } from "../types/syllabus";
import { getDaysInMonth, getFirstDayOfMonth } from "../utils/dateUtils";
import type { SyllabusItem } from "../types/syllabus";

interface CalendarGridProps {
  currentDate: Date;
  events: Map<number, CalendarEvent>;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events }) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days: ReactNode[] = [];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Day headers
  dayNames.forEach(day =>
    days.push(
      <div key={day} className="text-xs font-medium text-gray-500 p-2 text-center">
        {day}
      </div>
    )
  );

  // Previous month's trailing dates
  const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(
      <div key={`prev-${prevMonthDays - i}`} className="p-2 h-20 text-gray-400 text-sm">
        {prevMonthDays - i}
      </div>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const event = events.get(day);
    const isToday = false; // you could hook into real today check

    days.push(
      <div
        key={day}
        className={`p-1 h-20 text-sm border-r border-b border-gray-100 ${isToday ? "bg-blue-50" : "bg-white"}`}
      >
        <div className={`font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>
          {day}
        </div>
        {event && (
          <div className="mt-1 space-y-1">
            {event.items.slice(0, 2).map((item: SyllabusItem) => (
              <div
                key={item.id}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                  item.type === "assignment"
                    ? "bg-blue-500"
                    : item.type === "exam"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                title={item.title}
              >
                {item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
              </div>
            ))}
            {event.items.length > 2 && (
              <div className="text-xs text-gray-500">
                +{event.items.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Next month's leading dates
  const totalCells = 42; // 6 rows × 7 days
  const remainingCells = totalCells - days.length + 7;
  for (let day = 1; day <= remainingCells; day++) {
    days.push(
      <div key={`next-${day}`} className="p-2 h-20 text-gray-400 text-sm">
        {day}
      </div>
    );
  }

  return <div className="grid grid-cols-7">{days}</div>;
};

export default CalendarGrid;
