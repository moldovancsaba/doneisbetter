import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('/tasks');
        setCards(response.data.cards || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();

    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socket.on('updateCards', fetchCards);

    return () => {
      socket.disconnect();
    };
  }, []);

  const addCard = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      try {
        await axios.post('/tasks', { card: e.target.value.trim() });
        e.target.value = '';
      } catch (error) {
        console.error('Error adding card:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Hello World App</h1>
      <div className="text-center mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Add a card"
          onKeyDown={addCard}
        />
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {cards.map((card, index) => (
            <div key={index} className="p-4 bg-white rounded shadow mb-3">
              {card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Rebuild index.js from scratch
