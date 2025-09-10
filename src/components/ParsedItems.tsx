import type { SyllabusItem } from "../types/syllabus";

interface ParsedItemsProps {
  items: SyllabusItem[];
  selectedItems: Set<string>;
  toggleItemSelection: (id: string) => void;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "assignment": return "bg-blue-100 text-blue-800";
    case "exam": return "bg-red-100 text-red-800";
    case "reading": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const ParsedItems: React.FC<ParsedItemsProps> = ({ items, selectedItems, toggleItemSelection }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Parsed Items</h3>
        <span className="text-sm text-gray-500">{selectedItems.size} selected</span>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 min-h-64">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Upload a syllabus PDF to see parsed items here.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map(item => (
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
                      ● {item.type}
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
  );
};

export default ParsedItems;
