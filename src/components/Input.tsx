'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { CardInput } from '@/types';

interface InputProps {
  onSubmit: (data: CardInput) => Promise<void>;
}

export default function Input({ onSubmit }: InputProps) {
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ content: text.trim() });
      setText('');
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle key down events (Escape key)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsActive(false);
      inputRef.current?.blur();
    }
  };
  
  // Handle click outside to deactivate
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isActive && 
        inputContainerRef.current && 
        !inputContainerRef.current.contains(e.target as Node)
      ) {
        setIsActive(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  return (
    <div 
      ref={inputContainerRef}
      className={`w-full border rounded-md transition-all duration-200 ${
        isActive ? 'border-blue-500 shadow' : 'border-gray-300 dark:border-gray-700'
      }`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          className="w-full p-3 bg-transparent outline-none"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsActive(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type something and press Enter..."
          disabled={isSubmitting}
        />
        {isSubmitting && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </form>
    </div>
  );
}
