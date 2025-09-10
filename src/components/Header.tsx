import { Calendar, Scale, HelpCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-900">
            LawBandit Syllabus Converter
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Generate Calendar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
