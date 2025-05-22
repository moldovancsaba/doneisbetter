import { motion } from "framer-motion";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { ToastProvider } from "../ui/Toast";

export const Layout = ({ children }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.main>

        <MobileNav />

        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </ToastProvider>
  );
};
