export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'todo' | 'inProgress' | 'done';
  column: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface Column {
  id: 'TODO' | 'IN_PROGRESS' | 'DONE';
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}