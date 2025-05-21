import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    const data = await res.json();
    setCards(data);
  };

  const addCard = async () => {
    if (!text || text.length > 160) return;
    setLoading(true);
    await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    setText('');
    fetchCards();
    setLoading(false);
  };

  const deleteCard = async (id) => {
    setLoading(true);
    await fetch('/api/cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchCards();
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin – Card Manager</h1>
      <div>
        <input
          type="text"
          placeholder="New card text (max 160 chars)"
          maxLength={160}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '300px' }}
        />
        <button onClick={addCard} disabled={loading || !text}>
          Add Card
        </button>
      </div>
      <hr />
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            {card.text}
            <button onClick={() => deleteCard(card._id)} disabled={loading} style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
