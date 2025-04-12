'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { CardFormData } from '@/types';

interface SmartInputProps {
  onSubmit: (data: CardFormData) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Smart input component with active/inactive state management
 * 
 * Features:
 * - Click to activate
 * - Escape key or click outside to deactivate
 * - Enter key to submit
 */
export default function SmartInput({ onSubmit, isSubmitting = false }: SmartInputProps) {
  // State for input value and active state
  const [inputValue, setInputValue] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState<boolean>(false);
  
  // Reference to the input element for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmittingLocal || isSubmitting) {
      return;
    }
    
    try {
      setIsSubmittingLocal(true);
      await onSubmit({ content: inputValue.trim() });
      setInputValue(''); // Clear input after successful submission
    } catch (error) {
      console.error('Error submitting card:', error);
      // Could enhance with toast notification for better UX
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  // Handle key down events (Escape and Enter)
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
  
  // Handle active state focus
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div 
      ref={inputContainerRef}
      className={`w-full max-w-md transition-all duration-200 rounded-lg border ${
        isActive 
          ? 'border-blue-500 shadow-sm' 
          : 'border-gray-300 dark:border-gray-700'
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={() => setIsActive(true)}
          onFocus={() => setIsActive(true)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 bg-transparent rounded-lg focus:outline-none"
          disabled={isSubmittingLocal || isSubmitting}
          aria-label="Task input"
        />
        {(isSubmittingLocal || isSubmitting) && (
          <div className="absolute right-3 top-2.5">
            <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </form>
    </div>
  );
}
