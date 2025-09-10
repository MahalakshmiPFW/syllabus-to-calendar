import type { SyllabusItem } from "../types/syllabus";

interface ListViewProps {
  items: SyllabusItem[];
  currentDate: Date;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "assignment": return "bg-blue-100 text-blue-800";
    case "exam": return "bg-red-100 text-red-800";
    case "reading": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const ListView: React.FC<ListViewProps> = ({ items, currentDate }) => {
  const filtered = items
    .filter(item => 
      item.date.getMonth() === currentDate.getMonth() &&
      item.date.getFullYear() === currentDate.getFullYear()
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="p-4">
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items to display. Upload a syllabus to see events.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                ● {item.type}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">
                  {item.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;
