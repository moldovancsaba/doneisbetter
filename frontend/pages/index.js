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
      updateTasks(updatedTasks);
      setEditTask({ column: '', index: -1, value: '' });
    }
  };

  const moveTask = (fromColumn, toColumn, index) => {
    const updatedTasks = { ...tasks };
    const [movedTask] = updatedTasks[fromColumn].splice(index, 1);
    updatedTasks[toColumn].push(movedTask);
    setTasks(updatedTasks);
    updateTasks(updatedTasks);
  };

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inProgress', title: 'In Progress' },
    { key: 'done', title: 'Done' }
  ];

  const getNextColumnKey = (currentKey) => {
    const currentIndex = columns.findIndex(col => col.key === currentKey);
    return columns[currentIndex + 1]?.key;
  };

  const getPrevColumnKey = (currentKey) => {
    const currentIndex = columns.findIndex(col => col.key === currentKey);
    return columns[currentIndex - 1]?.key;
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
            <div className="card">
              <div className="card-body">
                {tasks[column.key].map((task, index) => {
                  const nextColumn = getNextColumnKey(column.key);
                  const prevColumn = getPrevColumnKey(column.key);

                  return (
                    <div
                      key={index}
                      className="card mb-2"
                    >
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
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => moveTask(column.key, prevColumn, index)}
                            disabled={!prevColumn}
                          >
                            ←
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => moveTask(column.key, nextColumn, index)}
                            disabled={!nextColumn}
                          >
                            →
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTask(column.key, index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center mt-5">
        <a href="https://docs.google.com/document/d/1H4fIfpSYVMuOPOFpm3m_X9mXNhM_UK8DlnqP_AJF_Lg/edit?tab=t.0" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a> | 
        <a href="https://docs.google.com/document/d/130GbiVZCT9M9lM0X5b-kfyvs6m0cPxWQpgzPyleLdGg/edit?tab=t.0#heading=h.ng3xjmtnbph" target="_blank" rel="noopener noreferrer">
          General Terms and Conditions
        </a>
      </footer>
    </div>
  );
}
