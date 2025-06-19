'use client';

import { SpanishEmojiData } from '@/lib/types';
import CopyButton from './CopyButton';
import Link from 'next/link';

interface EmojiCardProps {
  emoji: SpanishEmojiData;
  showDetails?: boolean;
}

export default function EmojiCard({ emoji, showDetails = false }: EmojiCardProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/?q=${encodeURIComponent(tag)}`;
  };

  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="emoji-medium">{emoji.emoji}</span>
            <div onClick={handleCopy}>
              <CopyButton 
                emoji={emoji.emoji} 
                title={emoji.spanishTitle}
                size="small"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {emoji.spanishTitle}
          </h3>
          
          {showDetails && (
            <p className="text-gray-600 mb-3">
              {emoji.spanishDescription}
            </p>
          )}
          
          {emoji.spanishTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {emoji.spanishTags.slice(0, showDetails ? 10 : 3).map((tag, index) => (
                <button
                  key={index}
                  onClick={(e) => handleTagClick(e, tag)}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
              {!showDetails && emoji.spanishTags.length > 3 && (
                <span className="inline-block text-gray-400 text-xs px-2 py-1">
                  +{emoji.spanishTags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {showDetails && emoji.culturalReferences.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Referencias culturales:
              </h4>
              <div className="flex flex-wrap gap-1">
                {emoji.culturalReferences.map((ref, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleTagClick(e, ref)}
                    className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full hover:bg-orange-200 transition-colors cursor-pointer"
                  >
                    {ref}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {showDetails && emoji.aliases.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                También conocido como:
              </h4>
              <p className="text-sm text-gray-600">
                {emoji.aliases.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (showDetails) {
    return <CardContent />;
  }

  return (
    <Link href={`/emoji/${emoji.slug}`}>
      <CardContent />
    </Link>
  );
}