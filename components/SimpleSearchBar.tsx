'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import SearchHistory from './SearchHistory';

interface SimpleSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showHistory?: boolean;
}

export default function SimpleSearchBar({ 
  onSearch, 
  placeholder = "Busca emojis...",
  showHistory = true
}: SimpleSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Debounced search for live results
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  // Execute search and add to history (for submitted searches)
  const executeSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Only add to history for actual searches (not while typing)
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
    }
    
    onSearch(searchQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleHistorySearch = (term: string) => {
    setQuery(term);
    executeSearch(term);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
            autoComplete="off"
          />
        </div>
      </form>

      {showHistory && (
        <SearchHistory
          searchHistory={searchHistory}
          onSearch={handleHistorySearch}
          onRemove={removeFromHistory}
          onClearAll={clearHistory}
          isVisible={!query && searchHistory.length > 0 && !isFocused}
        />
      )}

      {!query && !isFocused && searchHistory.length === 0 && (
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