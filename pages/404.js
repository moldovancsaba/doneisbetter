import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { PageWrapper } from "../components/layout/Header";

export default function Custom404() {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Error Animation */}
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-8xl sm:text-9xl font-bold text-primary-500"
            >
              404
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sorry, we couldnt find the page youre looking for.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/">
                <Button
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Return Home
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-50"
            >
              <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-transparent rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
