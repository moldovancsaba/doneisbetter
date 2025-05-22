import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export const CardList = ({
  cards,
  onDelete,
  className = "",
  showActions = true,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card._id}
            variants={item}
            exit={{ opacity: 0, scale: 0.8 }}
            layoutId={card._id}
          >
            <Card
              variant="glass"
              isInteractive
              className="h-full transform-gpu transition-all duration-200"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 text-lg">
                    {card.text}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Created: {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {showActions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(card._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {cards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full"
        >
          <Card variant="glass" className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No cards available
            </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export const CardGrid = {
  Container: ({ children, className = "" }) => (
    <div className={`grid gap-6 ${className}`}>
      {children}
    </div>
  ),

  Stats: ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  ),

  Form: ({ children, className = "" }) => (
    <Card className={`p-6 ${className}`}>
      {children}
    </Card>
  ),
};
