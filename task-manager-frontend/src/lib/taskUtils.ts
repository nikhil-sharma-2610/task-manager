import { Task, BoardData } from './types';

export const getTaskStatus = (task: Task): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (task.status === 'done') return 'completed';
  if (dueDate.getTime() === today.getTime()) return 'dueToday';
  if (dueDate.getTime() < today.getTime()) return 'overdue';
  return 'upcoming';
};

export const getInitialData = (): BoardData => ({
  tasks: {},
  columns: {
    TODO: {
      id: 'TODO',
      title: 'To Do',
      taskIds: [],
    },
    IN_PROGRESS: {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      taskIds: [],
    },
    DONE: {
      id: 'DONE',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['TODO', 'IN_PROGRESS', 'DONE'],
});

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