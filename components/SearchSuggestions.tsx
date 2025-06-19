'use client';

import { SearchSuggestion } from '@/hooks/useSearchSuggestions';
import { Clock, TrendingUp, Heart, Globe } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: string, suggestionData?: SearchSuggestion) => void;
  isVisible: boolean;
  activeIndex: number;
}

export default function SearchSuggestions({ 
  suggestions, 
  onSelect, 
  isVisible,
  activeIndex 
}: SearchSuggestionsProps) {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: SearchSuggestion['type'], emoji?: string) => {
    switch (type) {
      case 'history':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'emotional':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'cultural':
        return <Globe className="h-4 w-4 text-orange-500" />;
      case 'emoji':
        return <span className="text-lg">{emoji}</span>;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return 'Búsqueda reciente';
      case 'popular':
        return 'Popular';
      case 'emotional':
        return 'Emoción';
      case 'cultural':
        return 'Cultural';
      case 'emoji':
        return 'Emoji';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.text}`}
            type="button"
            onClick={() => onSelect(suggestion.text, suggestion)}
            onMouseDown={(e) => e.preventDefault()}
            className={`
              w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors
              ${index === activeIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
            `}
            role="option"
            aria-selected={index === activeIndex}
          >
            {getIcon(suggestion.type, suggestion.emoji)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {suggestion.emoji && suggestion.type !== 'emoji' && (
                  <span className="text-lg">{suggestion.emoji}</span>
                )}
                <span className="text-gray-900 font-medium truncate">
                  {suggestion.text}
                </span>
              </div>
            </div>
            
            <span className="text-xs text-gray-500 hidden sm:block">
              {getTypeLabel(suggestion.type)}
            </span>
          </button>
        ))}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-600">
          Usa las flechas ↑↓ para navegar, Enter para seleccionar
        </p>
      </div>
    </div>
  );
}