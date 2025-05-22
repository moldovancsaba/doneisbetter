import { useState, useEffect } from "react";
import { PageWrapper } from "../components/layout/Header";
import { CardStack } from "../components/features/CardStack";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";
import io from "socket.io-client";

export default function SwipePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
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
          addToast("Connected successfully!", "success");
          newSocket.emit("get-cards");
        });

        newSocket.on("cards", (data) => {
          setCards(data);
          setLoading(false);
        });

        newSocket.on("connect_error", () => {
          addToast("Connection error. Retrying...", "error");
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

  const handleSwipe = (direction) => {
    if (!socket) return;

    socket.emit("swipe-card", {
      cardId: cards[0]._id,
      direction,
    });

    setCards((prev) => prev.slice(1));
  };

  if (loading) return <LoadingScreen />;

  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Cards Left:
              </span>
              <span className="text-lg font-semibold text-primary-500">
                {cards.length}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 rounded-full bg-primary-500/10 text-primary-500"
            >
              {socket?.connected ? "Connected" : "Disconnected"}
            </motion.div>
          </div>

          {/* Card Stack */}
          <CardStack
            cards={cards}
            onSwipe={handleSwipe}
          />

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Swipe right to like, left to pass
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
