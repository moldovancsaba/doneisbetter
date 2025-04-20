'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from 'react';

// Type for the onSubmit function passed as a prop
type OnSubmitFn = (data: { content: string }) => Promise<{ success: boolean; error?: string }>;

// Props interface
interface InputProps {
  onSubmit: OnSubmitFn;
}

export default function Input({ onSubmit }: InputProps) {
  // State with proper types
  const [content, setContent] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Input reference with proper type
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    }
    
    // Add event listener with correct type
    document.addEventListener('mousedown', handleClickOutside as EventListener);
    
    // Clean up listener
    return () => document.removeEventListener('mousedown', handleClickOutside as EventListener);
  }, []);

  // Handle form submission
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!content.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await onSubmit({ content: content.trim() });
      
      if (result?.success) {
        setContent('');
        setIsActive(false);
        inputRef.current?.blur();
      } else {
        setError(result?.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to connect. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle key presses
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsActive(false);
      setContent('');
      setError(null);
      inputRef.current?.blur();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setContent(e.target.value);
          if (error) setError(null);
        }}
        onFocus={() => setIsActive(true)}
        onKeyDown={handleKeyDown}
        placeholder={isActive ? "Press Enter to save..." : "Click to add new item..."}
        className={`input-base ${isActive ? 'input-active' : 'input-inactive'} ${isLoading ? 'input-loading' : ''} ${error ? 'input-error' : ''}`}
        disabled={isLoading}
        aria-invalid={!!error}
        aria-describedby={error ? "input-error-message" : undefined}
      />
      
      {error && (
        <p id="input-error-message" className="error-message" role="alert">
          {error}
        </p>
      )}
      
      {isLoading && (
        <span 
          className="loading-indicator absolute right-3 top-1/2 transform -translate-y-1/2" 
          aria-hidden="true"
        >
          <svg 
            className="animate-spin h-5 w-5 text-gray-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </form>
  );
}

