import React from 'react';
import Image from 'next/image';

// Type definitions for our data structure
interface VoteCount {
  left: number;
  right: number;
}

interface VotedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
  votes: VoteCount;
}

interface BasicResultsProps {
  images: VotedImage[];
}

/**
 * BasicResults displays a simple grid of voted images with their vote counts
 * Images are ordered chronologically and displayed in a responsive grid
 */
const BasicResults: React.FC<BasicResultsProps> = ({ images }) => {
  // Sort images by creation date (newest first)
  const sortedImages = [...images].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedImages.map((image) => (
          <div 
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Image container with fixed aspect ratio */}
            <div className="relative aspect-square">
              <Image
                src={image.imageUrl}
                alt="Voted image"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Vote counts display */}
            <div className="p-4">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <span className="text-gray-600">Left:</span>
                  <span className="ml-2 font-semibold">{image.votes.left}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">Right:</span>
                  <span className="ml-2 font-semibold">{image.votes.right}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(image.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicResults;
