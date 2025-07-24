"use client";
import { useEffect, useState } from "react";

// Define the structure of a Card document
interface Card {
  _id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export default function CardPage() {
  const [input, setInput] = useState("");
  const [cards, setCards] = useState<Card[]>([]);

  // Load all cards from the database
  const fetchCards = async () => {
    const res = await fetch("/api/cards");
    const data = await res.json();
    setCards(data);
  };

  // Submit new cards from multiline input
  const submit = async () => {
    const urls = input
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u !== "");
    if (!urls.length) return;
    await fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({ urls }),
      headers: { "Content-Type": "application/json" },
    });
    setInput("");
    fetchCards();
  };

  // Delete card by ID
  const remove = async (id: string) => {
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    fetchCards();
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Cards</h1>
      <textarea
        className="w-full p-2 border rounded mb-2 text-black"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste image URLs here, one per line"
      />
      <button
        onClick={submit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      <div className="mt-8 space-y-4">
        {cards.map((card: Card) => (
          <div key={card._id} className="border p-2 rounded shadow flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.url} alt="card" className="w-24 h-auto rounded" />
            <code className="text-xs break-all ml-4 flex-1">{card._id}</code>
            <button
              className="ml-4 text-red-500 hover:underline"
              onClick={() => remove(card._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
