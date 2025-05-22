import { useState, useEffect } from "react";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

export default function AdminPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCardText, setNewCardText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const initSocket = async () => {
      try {
        await fetch("/api/socketio");
        const newSocket = io({
          path: "/api/socketio",
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
          addToast("Connected to server", "success");
          newSocket.emit("get-cards");
        });

        newSocket.on("cards", (data) => {
          setCards(data);
          setLoading(false);
        });

        newSocket.on("card-created", (newCard) => {
          setCards((prev) => [...prev, newCard]);
          addToast("Card created successfully", "success");
        });

        newSocket.on("card-deleted", (deletedCardId) => {
          setCards((prev) => prev.filter(card => card._id !== deletedCardId));
          addToast("Card deleted successfully", "success");
        });

        setSocket(newSocket);
      } catch (err) {
        addToast("Failed to connect to server", "error");
        setLoading(false);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCardText.trim() || isSubmitting || !socket) return;

    setIsSubmitting(true);
    try {
      socket.emit("create-card", { text: newCardText.trim() });
      setNewCardText("");
    } catch (error) {
      addToast("Failed to create card", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = (cardId) => {
    if (!socket) return;
    socket.emit("delete-card", cardId);
  };

  if (loading) return <LoadingScreen />;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Card Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create and manage your decision cards
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-primary-500/10 text-primary-500">
            {socket?.connected ? "Connected" : "Disconnected"}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { label: "Total Cards", value: cards.length, icon: "📚" },
            { label: "Active Cards", value: cards.filter(c => !c.archived).length, icon: "✨" },
            { label: "Archived Cards", value: cards.filter(c => c.archived).length, icon: "📦" }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Card Form */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Create New Card</h2>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <textarea
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="Enter card text..."
                  className="w-full px-4 py-3 rounded-lg resize-none
                           bg-white dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700
                           focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                  rows="4"
                  maxLength="160"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {newCardText.length}/160 characters
                </p>
              </div>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!newCardText.trim() || isSubmitting}
                className="w-full"
              >
                Create Card
              </Button>
            </form>
          </Card>

          {/* Cards List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Existing Cards</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {cards.map((card) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative"
                    >
                      <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-900 dark:text-gray-100 pr-8">
                            {card.text}
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                            onClick={() => handleDeleteCard(card._id)}
                          >
                            Delete
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Created: {new Date(card.createdAt).toLocaleDateString()}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
