'use client';

import { useState, useRef, useEffect } from 'react';

export default function Input({ onSubmit }) {
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State for displaying error messages
  const inputRef = useRef(null); // Ref for the input element

  // Effect to handle clicks outside the input to deactivate it
  useEffect(() => {
    function handleClickOutside(event) {
      // If the click is outside the input's current ref
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsActive(false);
        // Optionally clear error when clicking away, or keep it until typing resumes
        // setError(null);
      }
    }
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array means this runs once on mount

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    // Don't submit if content is empty/whitespace or if already loading
    if (!content.trim() || isLoading) return;

    setError(null); // Clear previous errors before submitting
    setIsLoading(true); // Set loading state

    try {
      // Call the server action passed via props
      const result = await onSubmit({ content: content.trim() });
      // Check the result from the server action
      if (result?.success) {
        setContent(''); // Clear input on success
        setIsActive(false); // Deactivate input on success
        inputRef.current?.blur(); // Remove focus
      } else {
         // Set error message from server action's response, or a default
        setError(result?.error || 'An unexpected error occurred.');
      }
    } catch (err) { // Catch network errors or unexpected issues during the action call
      console.error('Submission failed:', err);
      setError('Failed to connect. Please check your network and try again.');
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  }

  // Handle key presses within the input
  function handleKeyDown(e) {
    // If Escape key is pressed
    if (e.key === 'Escape') {
      setIsActive(false); // Deactivate the input
      setContent(''); // Optionally clear content on escape
      setError(null); // Clear any errors
      inputRef.current?.blur(); // Remove focus
    }
    // Note: Enter key press triggers the form's onSubmit automatically
  }

  return (
    // Form submission is handled by the handleSubmit function
    <form onSubmit={handleSubmit} className="w-full relative"> {/* Added relative positioning */}
      <input
        ref={inputRef} // Assign ref to the input element
        type="text"
        value={content} // Bind input value to state
        // Update state and clear error on typing
        onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null); // Clear error message when user starts typing
        }}
        // Set input active on focus
        onFocus={() => setIsActive(true)}
        onKeyDown={handleKeyDown} // Handle Escape key
        placeholder={isActive ? "Press Enter to save..." : "Click to add new item..."}
        // Dynamically apply CSS classes based on state
        className={`input-base ${isActive ? 'input-active' : 'input-inactive'} ${isLoading ? 'input-loading' : ''} ${error ? 'input-error' : ''}`}
        disabled={isLoading} // Disable input while loading
        aria-invalid={!!error} // Accessibility attribute for errors
        aria-describedby={error ? "input-error-message" : undefined} // Link input to error message
      />
      {/* Display error message if present */}
      {error && <p id="input-error-message" className="error-message">{error}</p>}
      {/* Subtle loading indicator shown next to the input */}
       {isLoading && (
          <span className="loading-indicator absolute right-3 top-1/2 transform -translate-y-1/2">
             <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          </span>
        )}
    </form>
  );
}

