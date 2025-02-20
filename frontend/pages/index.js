import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTasks = async (updatedTasks) => {
    try {
      await axios.post('/tasks', updatedTasks);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const addTask = async (column) => {
    if (newTask.trim() === '') return;
    try {
      const response = await axios.post('/tasks/add', { column, task: newTask });
      setTasks(response.data);
      setNewTask('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (column, index) => {
    try {
      const response = await axios.delete('/tasks/delete', {
        data: { column, index }
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const moveTask = (from, to, index) => {
    const taskToMove = tasks[from][index];
    const newFromTasks = tasks[from].filter((_, i) => i !== index);
    const newToTasks = [...tasks[to], taskToMove];
    const updatedTasks = {
      ...tasks,
      [from]: newFromTasks,
      [to]: newToTasks
    };
    updateTasks(updatedTasks);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Kanban Board</h1>
      <div className="row mt-4">
        <div className="col-md-4">
          <h3 className="text-center">To Do</h3>
          <input
            type="text"
            className="form-control mb-2"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New Task"
          />
          <button className="btn btn-success mb-3" onClick={() => addTask('todo')}>Add Task</button>
          <div className="card">
            <div className="card-body">
              {tasks.todo.map((task, index) => (
                <div className="card mb-2" key={index}>
                  <div className="card-body">
                    {task}
                    <div className="mt-2">
                      <button className="btn btn-primary btn-sm" onClick={() => moveTask('todo', 'inProgress', index)}>Move to In Progress</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTask('todo', index)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h3 className="text-center">In Progress</h3>
          <div className="card">
            <div className="card-body">
              {tasks.inProgress.map((task, index) => (
                <div className="card mb-2" key={index}>
                  <div className="card-body">
                    {task}
                    <div className="mt-2">
                      <button className="btn btn-success btn-sm" onClick={() => moveTask('inProgress', 'done', index)}>Move to Done</button>
                      <button className="btn btn-secondary btn-sm ms-2" onClick={() => moveTask('inProgress', 'todo', index)}>Move to To Do</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTask('inProgress', index)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h3 className="text-center">Done</h3>
          <div className="card">
            <div className="card-body">
              {tasks.done.map((task, index) => (
                <div className="card mb-2" key={index}>
                  <div className="card-body">
                    {task}
                    <div className="mt-2">
                      <button className="btn btn-warning btn-sm" onClick={() => moveTask('done', 'inProgress', index)}>Move to In Progress</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTask('done', index)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
