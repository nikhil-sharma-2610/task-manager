import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;  // Expecting the full task to be returned after saving
  task?: Task;
}

const TaskModal = ({ open, onClose, onSave, task }: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate ? new Date(task.dueDate) : new Date());
  const [loading, setLoading] = useState(false);  // Manage loading state for saving

  // Handle Save button click
  const handleSave = async () => {
    setLoading(true);  // Set loading state while making API call

    const taskData = {
      title,
      description,
      dueDate,
      status: task?.status || 'todo',
      column: task?.column || 'TODO',
    };

    // Log the task data being sent to the backend
    console.log('Saving task data:', taskData);

    try {
      let response;
      if (task?.id) {
        // If task has an ID, it's an update
        console.log('Updating task with ID:', task.id);  // Debug: Show task ID being updated
        response = await axios.put(`http://localhost:6001/tasks/${task.id}`, taskData);
      } else {
        // If task doesn't have an ID, create a new task
        console.log('Creating a new task');  // Debug: Show that we're creating a new task
        response = await axios.post('http://localhost:6001/tasks', taskData);
      }

      // Log the response from the backend
      console.log('Response from backend:', response.data);

      onSave(response.data);  // Trigger the onSave callback with the response data
      onClose();  // Close the modal after saving
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);  // Set loading state back to false
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate));
    }
  }, [task]);  // Update form fields when task prop changes

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
