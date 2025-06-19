'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { enhanceEmojiData } from '@/lib/emoji-data';
import SearchSuggestions from './SearchSuggestions';
import SearchHistory from './SearchHistory';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Busca emojis..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  
  // Get emoji data for suggestions
  const emojiData = enhanceEmojiData();
  const suggestions = useSearchSuggestions(query, searchHistory, emojiData);

  // Debounced search for live results (no history)
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  // Execute search and add to history (for submitted searches)
  const executeSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(false);
    setActiveIndex(-1);
    
    // Only add to history for actual searches (not while typing)
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
    }
    
    onSearch(searchQuery);
  };

  const selectSuggestion = (suggestion: string) => {
    executeSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex].text);
    } else {
      executeSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          e.preventDefault();
          selectSuggestion(suggestions[activeIndex].text);
        }
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }, 150);
  };

  const handleHistorySearch = (term: string) => {
    executeSearch(term);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
        </div>

        <SearchSuggestions
          suggestions={suggestions}
          onSelect={selectSuggestion}
          isVisible={showSuggestions && (isFocused || query.length > 0)}
          activeIndex={activeIndex}
        />
      </form>

      <SearchHistory
        searchHistory={searchHistory}
        onSearch={handleHistorySearch}
        onRemove={removeFromHistory}
        onClearAll={clearHistory}
        isVisible={!query && searchHistory.length > 0 && !showSuggestions}
      />

      {!query && !isFocused && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Prueba buscar: "feliz", "sevillana", "comida española", "amor"
        </div>
      )}
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}