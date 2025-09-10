export interface SyllabusItem {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'reading';
  date: Date;
  description?: string;
}

export interface CalendarEvent {
  date: number;
  items: SyllabusItem[];
}