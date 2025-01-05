import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { BoardData, Task } from '@/lib/types';
import TaskCard from './TaskCard';
import axios from 'axios';  // Import axios for API calls
import { useEffect, useState } from 'react';

interface TaskBoardProps {
  data: BoardData;
  onDragEnd: (result: any) => void;
  onTaskClick: (task: Task) => void;
}

const TaskBoard = ({ data, onDragEnd, onTaskClick }: TaskBoardProps) => {
  const [boardData, setBoardData] = useState<BoardData>(data);  // Local state for board data

  useEffect(() => {
    // Fetch initial data from backend (tasks, columns, etc.)
    const fetchBoardData = async () => {
      try {
        const response = await axios.get('http://localhost:6001/tasks'); // Adjust the endpoint as needed
        setBoardData(response.data);  // Set the board data received from the backend
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoardData();
  }, []);

  // Function to update task order in the backend (update taskIds in columns)
  const updateTaskOrderInBackend = async (updatedColumns: any) => {
    try {
      // Send API request to save the new column order
      await axios.put('http://localhost:6001/tasks', updatedColumns);
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  // Function to update the task's column in the backend when moved to another column
  const updateTaskColumnInBackend = async (taskId: string, columnId: string) => {
    try {
      // Send API request to update the task's column
      await axios.put(`http://localhost:6001/tasks/${taskId}`, { column: columnId });
    } catch (error) {
      console.error('Error updating task column:', error);
    }
  };

  // Function to handle task deletion
  const handleDeleteTask = async (taskId: string, columnId: string) => {
    try {
      // Send DELETE request to remove the task from backend
      await axios.delete(`http://localhost:6001/tasks/${taskId}`);
      
      // Remove task from the state
      const updatedColumns = { ...boardData.columns };
      Object.keys(updatedColumns).forEach((columnId) => {
        updatedColumns[columnId].taskIds = updatedColumns[columnId].taskIds.filter(id => id !== taskId);
      });

      // Update local state after deletion
      setBoardData({ ...boardData, columns: updatedColumns });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    // Ensure drag destination is valid
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = boardData.columns[source.droppableId];
    const destinationColumn = boardData.columns[destination.droppableId];

    if (sourceColumn.id === destinationColumn.id) {
      const reorderedTaskIds = Array.from(sourceColumn.taskIds);
      reorderedTaskIds.splice(source.index, 1);
      reorderedTaskIds.splice(destination.index, 0, sourceColumn.taskIds[source.index]);

      const updatedColumn = { ...sourceColumn, taskIds: reorderedTaskIds };
      const updatedColumns = { ...boardData.columns, [sourceColumn.id]: updatedColumn };

      // Update task order in the backend and locally
      await updateTaskOrderInBackend(updatedColumns);
      setBoardData({ ...boardData, columns: updatedColumns });
      onDragEnd(result);
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const destinationTaskIds = Array.from(destinationColumn.taskIds);

      const [movedTaskId] = sourceTaskIds.splice(source.index, 1);
      destinationTaskIds.splice(destination.index, 0, movedTaskId);

      const updatedSourceColumn = { ...sourceColumn, taskIds: sourceTaskIds };
      const updatedDestinationColumn = { ...destinationColumn, taskIds: destinationTaskIds };

      const updatedColumns = {
        ...boardData.columns,
        [sourceColumn.id]: updatedSourceColumn,
        [destinationColumn.id]: updatedDestinationColumn,
      };

      // Update task column and task order in the backend
      await updateTaskOrderInBackend(updatedColumns);
      await updateTaskColumnInBackend(movedTaskId, destinationColumn.id);

      setBoardData({ ...boardData, columns: updatedColumns });
      onDragEnd(result);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return (
            <div key={column.id} className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-4 text-gray-700">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onClick={() => onTaskClick(task)}  // Handle task click
                        onTaskDelete={handleDeleteTask}  // Handle task deletion
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
