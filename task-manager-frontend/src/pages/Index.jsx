import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import CalendarView from '../components/Calendar';
import { getInitialData, reorderTasks } from '../lib/taskUtils';
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Calendar, LayoutGrid } from 'lucide-react';
import { useToast } from "../components/ui/use-toast";

const Index = () => {
  const [boardData, setBoardData] = useState(getInitialData());
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newData = reorderTasks(boardData, source, destination);
    setBoardData(newData);
  };

  const handleSaveTask = (taskData) => {
    const newBoardData = { ...boardData };
    
    if (selectedTask) {
      // Edit existing task
      newBoardData.tasks[selectedTask.id] = {
        ...selectedTask,
        ...taskData,
      };
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      // Create new task
      const newTask = {
        id: uuidv4(),
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate || new Date(),
        status: 'todo',
        column: 'TODO',
        priority: taskData.priority || 'medium',
      };
      
      newBoardData.tasks[newTask.id] = newTask;
      newBoardData.columns.TODO.taskIds.push(newTask.id);
      toast({
        title: "Task created",
        description: "Your new task has been successfully created.",
      });
    }
    
    setBoardData(newBoardData);
    setSelectedTask(undefined);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskComplete = (task) => {
    const newBoardData = { ...boardData };
    const sourceColumn = Object.values(newBoardData.columns).find(
      (column) => column.taskIds.includes(task.id)
    );
    
    // Remove task from current column
    sourceColumn.taskIds = sourceColumn.taskIds.filter((id) => id !== task.id);
    
    // Add task to DONE column
    newBoardData.columns.DONE.taskIds.push(task.id);
    
    // Update task status
    newBoardData.tasks[task.id] = {
      ...task,
      status: 'done',
      column: 'DONE',
    };
    
    setBoardData(newBoardData);
  };

  const tasks = Object.values(boardData.tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      <div className="container mx-auto py-8 px-4 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Task Manager
          </h1>
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="board" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board">
            <TaskBoard
              data={boardData}
              onDragEnd={handleDragEnd}
              onTaskClick={handleTaskClick}
              onTaskComplete={handleTaskComplete}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />
          </TabsContent>
        </Tabs>

        <TaskModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(undefined);
          }}
          onSave={handleSaveTask}
          task={selectedTask}
        />
      </div>
    </div>
  );
};

export default Index;