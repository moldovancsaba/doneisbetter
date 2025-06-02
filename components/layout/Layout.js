import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';
import { usePageTransition } from './pageTransitions';
import { ToastProvider } from '../ui/Toast';
import Header from './Header';

export const Layout = ({ children }) => {
  const router = useRouter();
  const { theme: moduleTheme } = useModuleTheme();
  const { transition } = usePageTransition();

  // Default content margin and layout based on navigation
  const layoutStyles = {
    container: 'min-h-screen flex flex-col md:flex-row',
    nav: 'hidden md:block md:w-72 md:flex-shrink-0', // Increased width for better readability
    content: {
      wrapper: 'flex-1 flex flex-col min-h-screen',
      main: 'flex-1 pt-16 pb-20 md:pt-20 md:pb-8 px-4 sm:px-6 lg:px-8', // Consistent padding across breakpoints
    },
  };

  return (
    <ToastProvider>
      <div 
        className={`
          ${layoutStyles.container}
          bg-[rgb(var(--md-surface))]
          text-[rgb(var(--md-on-surface))]
        `}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            fixed top-4 left-4 z-50
            bg-[rgb(var(--md-primary))] text-[rgb(var(--md-on-primary))]
            px-4 py-2 rounded-md-md
            focus:outline-none focus:ring-2 focus:ring-[rgb(var(--md-primary))]/50
          "
        >
          Skip to main content
        </a>

        {/* Fixed header */}
        <Header />

        {/* Content wrapper */}
        <div className={layoutStyles.content.wrapper}>
          {/* Main content area */}
          <main
            id="main-content"
            className={`
              ${layoutStyles.content.main}
              transition-all duration-300
              ${moduleTheme?.bgClass || ''}
            `}
            role="main"
            aria-live="polite"
          >
            <div className="container-responsive">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={router.pathname}
                  {...transition}
                  className="
                    relative
                    rounded-md-lg
                    bg-[rgb(var(--md-surface-variant))]/5
                    md-elevation-1
                    overflow-hidden
                  "
                >
                  {/* Module-specific theme gradient */}
                  {moduleTheme?.gradient && (
                    <div
                      className={`
                        absolute inset-0
                        opacity-10
                        pointer-events-none
                        ${moduleTheme.gradient}
                      `}
                      aria-hidden="true"
                    />
                  )}

                  {/* Page content */}
                  <div className="relative p-4 sm:p-6 lg:p-8">
                    {children}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Notification container */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="
              fixed z-50
              pointer-events-none
              bottom-20 left-4 right-4 // Mobile positioning
              md:bottom-4 md:left-auto md:right-4 md:w-96 // Desktop positioning
              flex flex-col gap-2
            "
          />

          {/* Global theme gradient */}
          <div 
            className="
              fixed inset-0 -z-10
              pointer-events-none
              bg-gradient-radial
              from-[rgb(var(--md-surface))]
              to-[rgb(var(--md-surface-variant))]/20
            "
            aria-hidden="true"
          />
        </div>
      </div>
    </ToastProvider>
  );
};

Layout.displayName = 'Layout';

export default React.memo(Layout);
