// Check if there are any remaining unswiped cards via API
export const hasRemainingUnswiped = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/cards/hasUnswiped');
    if (!response.ok) {
      throw new Error('Failed to check remaining cards');
    }
    const data = await response.json();
    return data.hasUnswiped;
  } catch (error) {
    console.error('Error checking remaining cards:', error);
    return false; // Default to allowing navigation on error
  }
};
