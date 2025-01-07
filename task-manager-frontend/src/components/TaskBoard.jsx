import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Loader, CheckCircle } from "lucide-react";

const TaskBoard = ({ data, onDragEnd, onTaskClick, onTaskComplete }) => {
  const getColumnTasks = (columnId) => {
    const column = data.columns[columnId];
    return column.taskIds.map((taskId) => data.tasks[taskId]);
  };

  const renderTaskList = (tasks) => (
    <div className="min-h-[200px] space-y-4">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          onClick={() => onTaskClick(task)}
          onComplete={onTaskComplete}
        />
      ))}
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-xl opacity-50" />
        <div className="relative">
          <Tabs defaultValue="TODO" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="TODO"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <ClipboardList className="w-4 h-4" />
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="IN_PROGRESS"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                <Loader className="w-4 h-4" />
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="DONE"
                className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <CheckCircle className="w-4 h-4" />
                Done
              </TabsTrigger>
            </TabsList>

            {data.columnOrder.map((columnId) => (
              <TabsContent key={columnId} value={columnId}>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-100">
                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                      >
                        {renderTaskList(getColumnTasks(columnId))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
