"use client";

import { useEffect, useState } from 'react';
import { ICard } from '@/interfaces/Card';

export default function CardManagementPage() {
    const [cards, setCards] = useState<ICard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<ICard>>({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchCards = async () => {
        try {
            const response = await fetch('/api/v1/admin/cards');
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error('Failed to fetch cards', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleCreate = () => {
        setFormData({});
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEdit = (card: ICard) => {
        setFormData(card);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (cardId: string) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await fetch(`/api/v1/admin/cards/${cardId}`, { method: 'DELETE' });
                fetchCards();
            } catch (error) {
                console.error('Failed to delete card', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing ? `/api/v1/admin/cards/${formData.uuid}` : '/api/v1/admin/cards';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setShowForm(false);
                fetchCards();
            } else {
                console.error('Failed to save card');
            }
        } catch (error) {
            console.error('Failed to save card', error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">Card Management</h1>
            <button onClick={handleCreate} className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                Create New Card
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 mb-4 bg-white rounded shadow-md">
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Type</label>
                        <select
                            value={formData.type || 'text'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'text' | 'media' })}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        >
                            <option value="text">Text</option>
                            <option value="media">Media</option>
                        </select>
                    </div>
                    {formData.type === 'text' ? (
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">Text Content</label>
                            <textarea
                                value={formData.content?.text || ''}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
                                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">Media URL</label>
                            <input
                                type="text"
                                value={formData.content?.mediaUrl || ''}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, mediaUrl: e.target.value } })}
                                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )}
                    <button type="submit" className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
                        {isEditing ? 'Update Card' : 'Create Card'}
                    </button>
                    <button onClick={() => setShowForm(false)} type="button" className="px-4 py-2 ml-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
                        Cancel
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.uuid} className="p-4 bg-white rounded shadow-md">
                        <h3 className="text-lg font-bold">{card.title}</h3>
                        <p className="text-sm text-gray-500">{card.type}</p>
                        <div className="mt-4">
                            <button onClick={() => handleEdit(card)} className="px-2 py-1 mr-2 text-sm font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(card.uuid)} className="px-2 py-1 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
