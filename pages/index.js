import { useEffect, useState } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const match = window.location.href.match(/[?&]token=([^&]+)/);
    const foundToken = match ? match[1] : null;

    if (foundToken) {
      document.cookie = `token=${foundToken}; path=/`;
      setToken(foundToken);
      const cleanUrl = window.location.href.split('?token=')[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
    const tokenValue = cookieToken ? cookieToken.split('=')[1] : null;

    if (tokenValue) {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenValue })
      })
        .then(res => res.json())
        .then(data => {
          if (data.identifier) {
            setIdentifier(data.identifier);
            setLoggedIn(true);
            setToken(tokenValue);
          }
        });
    }

    fetch('/api/list')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://thanperfect.vercel.app?redirect=${redirectUrl}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(editingId ? '/api/update' : '/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, token, id: editingId })
    });
    const data = await res.json();
    if (data.success) {
      if (editingId) {
        setItems(items.map(item => (item._id === editingId ? data.entry : item)));
        setEditingId(null);
        setMessage('✅ Updated successfully');
      } else {
        setItems([...items, data.entry]);
        setMessage('✅ Submitted successfully');
      }
      setText('');
    } else {
      setMessage(data.error || '❌ Submission failed');
      console.log('[ERROR]', data);
    }
  };

  const handleEdit = (entry) => {
    setText(entry.text);
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, id })
    });
    const data = await res.json();
    if (data.success) {
      setItems(items.filter(item => item._id !== id));
      setMessage('🗑️ Deleted successfully');
    } else {
      setMessage(data.error || '❌ Delete failed');
      console.log('[DELETE ERROR]', data);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          onClick={handleLogin}
        >
          Login with thanperfect SSO
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl mb-4">Welcome, {identifier}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 w-full"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Submit a new string"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
          {editingId ? 'Update' : 'Submit'}
        </button>
        <p className="text-green-600 mt-2">{message}</p>
      </form>
      <ul>
        {items.map((entry) => (
          <li key={entry._id} className="mb-4 border p-3">
            <div className="w-full">
              <div className="flex justify-between">
                <div>
                  <strong>{entry.text}</strong> — <span className="text-sm text-gray-500">{entry.author}</span>
                </div>
              </div>
              {entry.activities && entry.activities.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  <p className="font-semibold">Activity Log:</p>
                  <ul className="ml-4 list-disc">
                    <li>created @ {new Date(entry.createdAt).toISOString()}</li>
                    {entry.activities.map((log, idx) => (
                      <li key={idx}>{log.type} @ {new Date(log.timestamp).toISOString()}</li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.author === identifier && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(entry)} className="text-blue-500 text-sm">Edit</button>
                  <button onClick={() => handleDelete(entry._id)} className="text-red-500 text-sm">Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
