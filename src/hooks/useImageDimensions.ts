import { useState, useEffect } from 'react';
import { calculateImageDimensions } from '@/utils/layout';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const useImageDimensions = (imageUrl: string) => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setError('No image URL provided');
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  return { dimensions, isLoading, error };
};

export const useResponsiveImageSize = (
  imageUrl: string,
  containerWidth: number,
  containerHeight: number
) => {
  const { dimensions, isLoading, error } = useImageDimensions(imageUrl);
  const [responsiveDimensions, setResponsiveDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (dimensions && containerWidth && containerHeight) {
      const { width, height } = calculateImageDimensions(
        containerWidth,
        containerHeight,
        dimensions.width,
        dimensions.height
      );
      setResponsiveDimensions({ width, height });
    }
  }, [dimensions, containerWidth, containerHeight]);

  return { responsiveDimensions, isLoading, error };
};
