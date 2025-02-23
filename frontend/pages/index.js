import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Home() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  useEffect(() => {
    fetchTasks();
    socket.on('tasksUpdated', () => {
      fetchTasks();
    });

    return () => {
      socket.off('tasksUpdated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data || { todo: [], inProgress: [], done: [] });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (task.trim() === '') return;
    try {
      await axios.post('/tasks', { task });
      setTask('');
      socket.emit('tasksUpdated');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Hello World App</h1>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a card"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="space-y-2">
          {tasks.todo.map((task, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              {task}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
