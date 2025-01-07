import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TaskBoard from "@/components/TaskBoard";
import TaskModal from "@/components/TaskModal";
import CalendarView from "@/components/Calendar";
import { Task, BoardData } from "@/lib/types";
import { getInitialData, reorderTasks } from "@/lib/taskUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, LayoutGrid } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Index = () => {
  const [boardData, setBoardData] = useState<BoardData>(getInitialData());
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const { toast } = useToast();

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:6001/tasks"); // Adjust the URL as needed
      setTasks(response.data); // Set tasks in state
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task drag-and-drop event
  const handleDragEnd = (result: any) => {
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

  // Save task (create or edit)
  const handleSaveTask = async (taskData: Task) => {
    const newBoardData = { ...boardData };

    if (selectedTask) {
      // Edit existing task
      newBoardData.tasks[selectedTask.id!] = {
        ...selectedTask,
        ...taskData,
      };
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        status: "todo",
        column: "TODO",
        priority: taskData.priority,
      };

      newBoardData.tasks[newTask.id] = newTask;
      newBoardData.columns.TODO.taskIds.push(newTask.id);
      toast({
        title: "Task created",
        description: "Your new task has been successfully created.",
      });

      // Also add the new task to the tasks array for the calendar view
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    setBoardData(newBoardData);
    setSelectedTask(undefined);
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="board">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Board
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <TaskBoard
            data={boardData}
            onDragEnd={handleDragEnd}
            onTaskClick={handleTaskClick}
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
  );
};

export default Index;
