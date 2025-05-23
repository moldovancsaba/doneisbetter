import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PageWrapper } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Loading";
import { useToast } from "../components/ui/Toast";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const router = useRouter();
  const { username } = router.query;
  
  const [results, setResults] = useState({ likes: [], dislikes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      if (!username) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/results?username=${encodeURIComponent(username)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch results");
        }
        
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch results");
        }
      } catch (err) {
        setError(err.message);
        addToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [username, addToast]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
            <h1 className="text-3xl font-bold">Results for {username}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View card interactions and rankings
            </p>
          </div>

          <Button
            onClick={() => router.back()}
            variant="secondary"
          >
            Go Back
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            { label: "Liked Cards", value: results.likes.length, icon: "👍" },
            { label: "Disliked Cards", value: results.dislikes.length, icon: "👎" }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liked Cards */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Liked Cards ({results.likes.length})</h2>
              <div className="space-y-4">
                {results.likes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No liked cards yet.</p>
                ) : (
                  results.likes.map((card) => (
                    <Card key={card.cardId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-900 dark:text-gray-100">{card.text}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(card.timestamp)}
                          </p>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            card.rank === "unranked" 
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
                              : "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
                          }`}>
                            {card.rank === "unranked" ? "Unranked" : `Rank #${card.rank}`}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Disliked Cards */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Disliked Cards ({results.dislikes.length})</h2>
              <div className="space-y-4">
                {results.dislikes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No disliked cards yet.</p>
                ) : (
                  results.dislikes.map((card) => (
                    <Card key={card.cardId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-900 dark:text-gray-100">{card.text}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(card.timestamp)}
                          </p>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            card.rank === "unranked" 
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
                              : "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
                          }`}>
                            {card.rank === "unranked" ? "Unranked" : `Rank #${card.rank}`}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

