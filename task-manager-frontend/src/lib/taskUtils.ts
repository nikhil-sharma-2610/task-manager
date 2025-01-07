import { Task, BoardData } from "./types";

// Function to fetch tasks from the backend API
export const fetchTasks = async (): Promise<BoardData> => {
  try {
    const response = await fetch("http://localhost:6001/tasks"); // URL to your backend API
    const data = await response.json();

    // Convert the task array to a task object by task ID
    const tasks = data.reduce((acc: any, task: any) => {
      acc[task.id] = task;
      return acc;
    }, {});

    return {
      tasks,
      columns: {
        TODO: { id: "TODO", title: "To Do", taskIds: [] },
        IN_PROGRESS: { id: "IN_PROGRESS", title: "In Progress", taskIds: [] },
        DONE: { id: "DONE", title: "Done", taskIds: [] },
      },
      columnOrder: ["TODO", "IN_PROGRESS", "DONE"],
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return getInitialData(); // Return default data in case of error
  }
};

// Function to get initial data for the board (default data if fetching fails)
export const getInitialData = (): BoardData => ({
  tasks: {},
  columns: {
    TODO: {
      id: "TODO",
      title: "To Do",
      taskIds: [],
    },
    IN_PROGRESS: {
      id: "IN_PROGRESS",
      title: "In Progress",
      taskIds: [],
    },
    DONE: {
      id: "DONE",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["TODO", "IN_PROGRESS", "DONE"],
});

// Function to reorder tasks in columns when drag-and-drop occurs
export const reorderTasks = (
  boardData: BoardData,
  source: any,
  destination: any
): BoardData => {
  const start = boardData.columns[source.droppableId];
  const finish = boardData.columns[destination.droppableId];

  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, start.taskIds[source.index]);

    const newColumn = {
      ...start,
      taskIds: newTaskIds,
    };

    return {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newColumn.id]: newColumn,
      },
    };
  }

  const startTaskIds = Array.from(start.taskIds);
  startTaskIds.splice(source.index, 1);
  const newStart = {
    ...start,
    taskIds: startTaskIds,
  };

  const finishTaskIds = Array.from(finish.taskIds);
  finishTaskIds.splice(destination.index, 0, start.taskIds[source.index]);
  const newFinish = {
    ...finish,
    taskIds: finishTaskIds,
  };

  return {
    ...boardData,
    columns: {
      ...boardData.columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    },
  };
};

// Function to add a new task to the backend
export const addTask = async (task: Task) => {
  try {
    const response = await fetch("http://localhost:6001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const newTask = await response.json();
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

// Function to update the task status in the backend
export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const response = await fetch(`http://localhost:6001/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Function to delete a task from the backend
export const deleteTask = async (taskId: string) => {
  try {
    await fetch(`http://localhost:6001/tasks/${taskId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Helper function to get the task status based on its due date
export const getTaskStatus = (task: Task): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (task.status === "completed") return "completed";
  if (dueDate.getTime() === today.getTime()) return "dueToday";
  if (dueDate.getTime() < today.getTime()) return "overdue";
  return "upcoming";
};
