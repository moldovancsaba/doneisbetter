import { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

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

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inProgress', title: 'In Progress' },
    { key: 'done', title: 'Done' }
  ];

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
                <button className="btn btn-success mb-3" onClick={() => addTask(column.key)}>Add Task</button>
              </>
            )}
            <div className="card">
              <div className="card-body">
                {tasks[column.key].map((task, index) => (
                  <div className="card mb-2" key={index}>
                    <div className="card-body">
                      {editTask.column === column.key && editTask.index === index ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editTask.value}
                          onChange={(e) => setEditTask({ ...editTask, value: e.target.value })}
                          onBlur={saveEdit}
                          autoFocus
                        />
                      ) : (
                        <div onDoubleClick={() => handleEdit(column.key, index, task)}>
                          {task}
                        </div>
                      )}
                      <div className="mt-2">
                        {column.key !== 'done' && (
                          <button className="btn btn-primary btn-sm" onClick={() => moveTask(column.key, columns[columns.findIndex(col => col.key === column.key) + 1].key, index)}>Move to Next</button>
                        )}
                        {column.key !== 'todo' && (
                          <button className="btn btn-secondary btn-sm ms-2" onClick={() => moveTask(column.key, columns[columns.findIndex(col => col.key === column.key) - 1].key, index)}>Move to Previous</button>
                        )}
                        <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTask(column.key, index)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center mt-5">
        <a href="https://docs.google.com/document/d/1H4fIfpSYVMuOPOFpm3m_X9mXNhM_UK8DlnqP_AJF_Lg/edit?tab=t.0" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | 
        <a href="https://docs.google.com/document/d/130GbiVZCT9M9lM0X5b-kfyvs6m0cPxWQpgzPyleLdGg/edit?tab=t.0#heading=h.ng3xjmtnbph" target="_blank" rel="noopener noreferrer"> General Terms and Conditions</a>
      </footer>
    </div>
  );
}
