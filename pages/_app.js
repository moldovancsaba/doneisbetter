import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "../components/ui/Toast";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";

function MyApp({ Component, pageProps, router }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
