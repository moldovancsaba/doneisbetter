import { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Home() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState({ column: '', index: -1, value: '' });

  useEffect(() => {
    fetchTasks();
    socket.on('tasksUpdated', (updatedTasks) => {
      setTasks(updatedTasks);
    });
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
      socket.emit('tasksUpdated', updatedTasks);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;
    const updatedTasks = { ...tasks };
    updatedTasks.todo.push(newTask);
    setTasks(updatedTasks);
    setNewTask('');
    updateTasks(updatedTasks);
  };

  const deleteTask = (column, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[column].splice(index, 1);
    setTasks(updatedTasks);
    updateTasks(updatedTasks);
  };

  const handleEdit = (column, index, value) => {
    setEditTask({ column, index, value });
  };

  const saveEdit = () => {
    if (editTask.index !== -1) {
      const updatedTasks = { ...tasks };
      updatedTasks[editTask.column][editTask.index] = editTask.value;
      setTasks(updatedTasks);
      updateTasks(updatedTasks);
      setEditTask({ column: '', index: -1, value: '' });
    }
  };

  const moveTask = (fromColumn, toColumn, index) => {
    if (toColumn) {
      const updatedTasks = { ...tasks };
      const [movedTask] = updatedTasks[fromColumn].splice(index, 1);
      updatedTasks[toColumn].push(movedTask);
      setTasks(updatedTasks);
      updateTasks(updatedTasks);
    }
  };

  const moveTaskUp = (column, index) => {
    if (index > 0) {
      const updatedTasks = { ...tasks };
      const temp = updatedTasks[column][index - 1];
      updatedTasks[column][index - 1] = updatedTasks[column][index];
      updatedTasks[column][index] = temp;
      setTasks(updatedTasks);
      updateTasks(updatedTasks);
    }
  };

  const moveTaskDown = (column, index) => {
    if (index < tasks[column].length - 1) {
      const updatedTasks = { ...tasks };
      const temp = updatedTasks[column][index + 1];
      updatedTasks[column][index + 1] = updatedTasks[column][index];
      updatedTasks[column][index] = temp;
      setTasks(updatedTasks);
      updateTasks(updatedTasks);
    }
  };

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inProgress', title: 'In Progress' },
    { key: 'done', title: 'Done' }
  ];

  const getPreviousColumn = (columnKey) => {
    if (columnKey === 'todo') return null;
    if (columnKey === 'inProgress') return 'todo';
    if (columnKey === 'done') return 'inProgress';
  };

  const getNextColumn = (columnKey) => {
    if (columnKey === 'todo') return 'inProgress';
    if (columnKey === 'inProgress') return 'done';
    if (columnKey === 'done') return null;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Kanban Board</h1>

      <div className="text-center mb-4">
        {!session ? (
          <button className="btn btn-primary" onClick={() => signIn('google')}>Login with Google</button>
        ) : (
          <>
            <p>Welcome, {session.user.name}</p>
            <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
          </>
        )}
      </div>

      <div className="row mt-4">
        {columns.map(column => (
          <div className="col-md-4" key={column.key}>
            <h3 className="text-center">{column.title}</h3>
            {column.key === 'todo' && (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New Task"
                />
                <button className="btn btn-success mb-3" onClick={addTask}>Add Task</button>
              </>
            )}
            {tasks[column.key].map((task, index) => (
              <div key={index} className="card mb-2">
                <div className="card-body">
                  {(editTask?.column === column.key && editTask?.index === index) ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTask.value}
                      onChange={(e) => handleEdit(column.key, index, e.target.value)}
                      onBlur={saveEdit}
                      autoFocus
                    />
                  ) : (
                    <div onDoubleClick={() => handleEdit(column.key, index, task)}>
                      {task}
                    </div>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => moveTaskUp(column.key, index)} disabled={index === 0}>↑</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => moveTaskDown(column.key, index)} disabled={index === tasks[column.key].length - 1}>↓</button>
                  <button className="btn btn-warning btn-sm" onClick={() => moveTask(column.key, getPreviousColumn(column.key), index)} disabled={!getPreviousColumn(column.key)}>←</button>
                  <button className="btn btn-warning btn-sm" onClick={() => moveTask(column.key, getNextColumn(column.key), index)} disabled={!getNextColumn(column.key)}>→</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTask(column.key, index)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
