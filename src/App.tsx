import React, { useState, useCallback } from 'react';
import { Calendar, Upload, Scale, ChevronLeft, ChevronRight, List, CalendarDays, HelpCircle } from 'lucide-react';

interface SyllabusItem {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'reading';
  date: Date;
  description?: string;
}

interface CalendarEvent {
  date: number;
  items: SyllabusItem[];
}

const App: React.FC = () => {
  const [parsedItems, setParsedItems] = useState<SyllabusItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // September 2025
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isDragActive, setIsDragActive] = useState(false);

  // Mock data for demonstration
  const mockItems: SyllabusItem[] = [
    {
      id: '1',
      title: 'Constitutional Law Reading Ch. 1-3',
      type: 'reading',
      date: new Date(2025, 8, 5), // Sept 5
      description: 'Introduction to Constitutional Principles'
    },
    {
      id: '2',
      title: 'Case Brief Assignment',
      type: 'assignment',
      date: new Date(2025, 8, 8), // Sept 8
      description: 'Marbury v. Madison case analysis'
    },
    {
      id: '3',
      title: 'Midterm Exam',
      type: 'exam',
      date: new Date(2025, 8, 12), // Sept 12
      description: 'Covers chapters 1-5'
    }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      // In a real implementation, you would parse the PDF here
      // For demo purposes, we'll use mock data
      setParsedItems(mockItems);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // In a real implementation, you would parse the PDF here
      setParsedItems(mockItems);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const events = getCalendarEvents();
    
    const days = [];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    // Day headers
    dayNames.forEach(day => (
      days.push(
        <div key={day} className="text-xs font-medium text-gray-500 p-2 text-center">
          {day}
        </div>
      )
    ));
    
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
      const isToday = day === 5; // Highlighting Sept 5 as today for demo
      
      days.push(
        <div key={day} className={`p-1 h-20 text-sm border-r border-b border-gray-100 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          {event && (
            <div className="mt-1 space-y-1">
              {event.items.slice(0, 2).map(item => (
                <div
                  key={item.id}
                  className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                    item.type === 'assignment' ? 'bg-blue-500' :
                    item.type === 'exam' ? 'bg-red-500' : 'bg-green-500'
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
    const remainingCells = totalCells - days.length + 7; // +7 for day headers
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="p-2 h-20 text-gray-400 text-sm">
          {day}
        </div>
      );
    }
    
    return days;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'reading': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '●';
      case 'exam': return '●';
      case 'reading': return '●';
      default: return '●';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-gray-700" />
            <h1 className="text-xl font-semibold text-gray-900">LawBandit Syllabus Converter</h1>
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Parse */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload & Parse</h2>
              <p className="text-gray-600 mb-4">
                Drop your syllabus PDF and we'll extract assignments, readings, and exams tailored for law students.
              </p>
              
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your syllabus PDF here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  We'll parse assignments, readings, and exams
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <span className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
                    Upload Syllabus
                  </span>
                </label>
              </div>
            </div>

            {/* Parsed Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Parsed Items</h3>
                <span className="text-sm text-gray-500">{selectedItems.size} selected</span>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 min-h-64">
                {parsedItems.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Upload a syllabus PDF to see parsed items here.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {parsedItems.map(item => (
                      <label key={item.id} className="flex items-start space-x-3 p-4 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)} {item.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {item.date.toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {parsedItems.length > 0 && (
              <button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                Generate Calendar
              </button>
            )}
          </div>

          {/* Right Column - Calendar */}
          <div className="space-y-6">
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

              {/* Calendar Header */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => navigateMonth('next')}
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
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 ${
                      viewMode === 'calendar'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Calendar View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 ${
                      viewMode === 'list'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span>List View</span>
                  </button>
                </div>

                {/* Calendar Grid */}
                {viewMode === 'calendar' ? (
                  <div className="grid grid-cols-7">
                    {renderCalendarGrid()}
                  </div>
                ) : (
                  <div className="p-4">
                    {parsedItems.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No items to display. Upload a syllabus to see events.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {parsedItems
                          .filter(item => 
                            item.date.getMonth() === currentDate.getMonth() &&
                            item.date.getFullYear() === currentDate.getFullYear()
                          )
                          .sort((a, b) => a.date.getTime() - b.date.getTime())
                          .map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)} {item.type}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-600">
                                  {item.date.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;