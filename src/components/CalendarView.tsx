import { useState } from "react";
import type { SyllabusItem, CalendarEvent } from "../types/syllabus";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ListView from "./ListView";

interface CalendarViewProps {
  parsedItems: SyllabusItem[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ parsedItems }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1));
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const getCalendarEvents = (): Map<number, CalendarEvent> => {
    const events = new Map<number, CalendarEvent>();
    parsedItems.forEach(item => {
      if (item.date.getMonth() === currentDate.getMonth() && 
          item.date.getFullYear() === currentDate.getFullYear()) {
        const day = item.date.getDate();
        if (!events.has(day)) {
          events.set(day, { date: day, items: [] });
        }
        events.get(day)!.items.push(item);
      }
    });
    return events;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Calendar</h2>
      <p className="text-gray-600 mb-4">
        View your syllabus in a monthly calendar or list. Hover events for details.
      </p>

      {/* Preview Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Preview sample calendar</strong> — upload a PDF to populate
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <CalendarHeader
          currentDate={currentDate}
          navigateMonth={navigateMonth}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        {viewMode === "calendar" ? (
          <CalendarGrid currentDate={currentDate} events={getCalendarEvents()} />
        ) : (
          <ListView items={parsedItems} currentDate={currentDate} />
        )}
      </div>
    </div>
  );
};

export default CalendarView;
