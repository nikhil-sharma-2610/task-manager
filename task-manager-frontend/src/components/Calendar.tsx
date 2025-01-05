import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@/lib/types';
import { getTaskStatus } from '@/lib/taskUtils';
import axios from 'axios';  // Import axios for API calls
import { useEffect, useState } from 'react';

interface CalendarViewProps {
  onTaskClick: (task: Task) => void;
}

const CalendarView = ({ onTaskClick }: CalendarViewProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);  // State to store tasks fetched from the backend

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:6001/tasks'); // Adjust the URL as needed
        setTasks(response.data);  // Set tasks in state
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();  // Fetch tasks when component mounts
  }, []);

  // Map tasks to events for the FullCalendar
  const events = tasks.map((task) => {
    const status = getTaskStatus(task);
    let backgroundColor = '#3b82f6'; // Default: blue for due today

    if (status === 'completed') {
      backgroundColor = '#22c55e'; // Green for completed tasks
    } else if (status === 'overdue') {
      backgroundColor = '#ef4444'; // Red for overdue tasks
    }

    return {
      id: task.id,
      title: task.title,
      date: task.dueDate,
      backgroundColor,
      borderColor: backgroundColor,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          const task = tasks.find((t) => t.id === info.event.id);
          if (task) onTaskClick(task);  // Trigger the onTaskClick callback when a task is clicked
        }}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
      />
    </div>
  );
};

export default CalendarView;
