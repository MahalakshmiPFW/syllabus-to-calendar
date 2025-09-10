import { useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import ParsedItems from "./components/ParsedItems";
import CalendarView from "./components/CalendarView";
import type { SyllabusItem } from "./types/syllabus";

const App = () => {
  const [parsedItems, setParsedItems] = useState<SyllabusItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDragActive, setIsDragActive] = useState(false);

  const mockItems: SyllabusItem[] = [
    { id: "1", title: "Constitutional Law Reading Ch. 1-3", type: "reading", date: new Date(2025, 8, 5), description: "Intro to Constitutional Principles" },
    { id: "2", title: "Case Brief Assignment", type: "assignment", date: new Date(2025, 8, 8), description: "Marbury v. Madison" },
    { id: "3", title: "Midterm Exam", type: "exam", date: new Date(2025, 8, 12), description: "Covers chapters 1-5" }
  ];

  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileUpload 
            onParse={setParsedItems} 
            isDragActive={isDragActive} 
            setIsDragActive={setIsDragActive}
            mockItems={mockItems}
          />
          <ParsedItems 
            items={parsedItems} 
            selectedItems={selectedItems} 
            toggleItemSelection={toggleItemSelection} 
          />
        </div>
        <CalendarView parsedItems={parsedItems} />
      </div>
    </div>
  );
};

export default App;
