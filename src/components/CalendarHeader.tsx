import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  navigateMonth: (direction: "prev" | "next") => void;
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, navigateMonth, viewMode, setViewMode }) => {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-xs text-gray-600 mr-3">
            <span className="w-3 h-3 bg-blue-500 rounded mr-1"></span> Assignment
            <span className="w-3 h-3 bg-red-500 rounded ml-3 mr-1"></span> Exam
            <span className="w-3 h-3 bg-green-500 rounded ml-3 mr-1"></span> Reading
          </span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 ${
            viewMode === "calendar"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Calendar View</span>
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 ${
            viewMode === "list"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <List className="h-4 w-4" />
          <span>List View</span>
        </button>
      </div>
    </>
  );
};

export default CalendarHeader;
