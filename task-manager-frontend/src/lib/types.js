export const Task = {
  id: "",
  title: "",
  description: "",
  dueDate: new Date(),
  status: "todo",
  column: "TODO",
  priority: "medium", // new field
};

export const Column = {
  id: "TODO",
  title: "",
  taskIds: [],
};

export const BoardData = {
  tasks: {},
  columns: {},
  columnOrder: [],
};
