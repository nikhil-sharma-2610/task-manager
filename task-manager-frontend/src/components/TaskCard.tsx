import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { Calendar, Flag, Check, Clock } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import axios from "axios";

// Define Task type
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "inProgress" | "completed" | "overdue" | "dueToday";
  column: "TODO" | "IN_PROGRESS" | "COMPLETED";
}

// Define TaskCardProps type
interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
  onComplete: (task: Task) => void;
}

const TaskCard = ({ task, index, onClick, onComplete }: TaskCardProps) => {
  const { toast } = useToast();
  const status = task.status;
  const priority = task.priority || "medium"; // Ensure default value for priority if missing

  // Get the appropriate status color for the task
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-50 hover:bg-green-100 border-green-500 text-green-700";
      case "dueToday":
        return "bg-blue-50 hover:bg-blue-100 border-blue-500 text-blue-700";
      case "overdue":
        return "bg-red-50 hover:bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  // Get the priority color
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold";
      case "medium":
        return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-semibold";
      case "low":
        return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "text-gray-500 bg-gray-50 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  // Handle completing the task
  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Update the task as completed on the backend
      await axios.patch(`http://localhost:6001/tasks/${task.id}`, {
        ...task,
        status: "completed",
      });

      // Call the onComplete callback to update the UI
      onComplete({
        ...task,
        status: "completed",
      });

      // Show a success toast
      toast({
        title: "Task completed",
        description: `"${task.title}" has been marked as completed.`,
      });
    } catch (error) {
      // Show an error toast if something goes wrong
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to mark task as completed.",
        variant: "destructive",
      });
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm ${getStatusColor()}`}
          onClick={onClick}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Flag
                  className={`w-4 h-4 ${
                    priority === "high"
                      ? "text-red-500"
                      : priority === "medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                />
                <span className={getPriorityColor()}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
              <p className="text-sm mb-3 line-clamp-2 text-gray-600">
                {task.description}
              </p>
            </div>
            {status !== "completed" && (
              <button
                onClick={handleComplete}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-green-100"
                title="Mark as completed"
              >
                <Check className="w-4 h-4 text-green-600" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
            </div>
            {status === "dueToday" && (
              <div className="flex items-center gap-1 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Due Today</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
