/**
 * Checks if the provided URL is a valid image URL from an allowed domain
 * @param url URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const allowedDomains = ['i.ibb.co', 'image.ibb.co'];
    return allowedDomains.some(domain => parsedUrl.hostname === domain);
  } catch {
    return false;
  }
}

/**
 * Validates image dimensions and type
 * @param url URL of the image to validate
 * @returns Promise resolving to validation result
 */
export function validateImage(url: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve({ valid: false, error: 'Image load timed out' });
    }, 10000); // 10 second timeout

    img.onload = () => {
      clearTimeout(timeout);
      // Check minimum dimensions
      if (img.width < 100 || img.height < 100) {
        resolve({
          valid: false,
          error: 'Image dimensions too small (minimum 100x100px required)'
        });
        return;
      }
      resolve({ valid: true });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve({ valid: false, error: 'Failed to load image' });
    };

    img.src = url;
  });
}

/**
 * Returns a fallback image URL based on the error condition
 * @param error Error message or condition
 * @returns URL to an appropriate fallback image
 */
export function getFallbackImageUrl(error?: string): string {
  // Use appropriate fallback images based on error condition
  if (error?.includes('dimensions')) {
    return '/images/fallback-small-image.png';
  }
  if (error?.includes('timed out')) {
    return '/images/fallback-timeout.png';
  }
  return '/images/fallback-generic.png';
}

/**
 * Handles image load errors and provides fallback options
 * @param event Error event from image load
 * @param setError Function to set error state
 * @param setFallbackSrc Function to set fallback image source
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  setError: (error: string) => void,
  setFallbackSrc: (src: string) => void
): void {
  const target = event.target as HTMLImageElement;
  const error = 'Failed to load image';
  setError(error);
  setFallbackSrc(getFallbackImageUrl());
  
  // Log error for monitoring
  console.error('Image load failed:', {
    src: target.src,
    error,
    timestamp: new Date().toISOString()
  });
}
