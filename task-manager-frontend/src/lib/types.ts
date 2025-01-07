export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "todo" | "inProgress" | "completed" | "overdue" | "dueToday";
  column: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "medium";
}

export interface Column {
  id: "TODO" | "IN_PROGRESS" | "DONE";
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}
