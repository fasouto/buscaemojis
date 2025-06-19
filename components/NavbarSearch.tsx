'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { SpanishEmojiData } from '@/lib/types';
import SearchSuggestions from './SearchSuggestions';

export default function NavbarSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { searchHistory, addToHistory } = useSearchHistory();
  
  // Get emoji data for suggestions - we'll fetch this from API
  const [emojiData, setEmojiData] = useState<SpanishEmojiData[]>([]);
  const suggestions = useSearchSuggestions(query, searchHistory, emojiData);
  
  // Fetch emoji data for suggestions (minimal data needed)
  useEffect(() => {
    const fetchEmojiData = async () => {
      try {
        const response = await fetch('/api/suggestions');
        const data = await response.json();
        setEmojiData(data.emojis);
      } catch (error) {
        console.error('Failed to fetch emoji data for suggestions:', error);
      }
    };
    
    fetchEmojiData();
  }, []);

  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery('');
    setShowSuggestions(false);
    setActiveIndex(-1);
    
    // Add to history
    addToHistory(searchQuery.trim());
    
    // Navigate to homepage with search
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/?q=${encodedQuery}`);
    
    // Blur the input
    inputRef.current?.blur();
  };

  const selectSuggestion = (suggestion: string, suggestionData?: any) => {
    // Check if this suggestion has an emoji (direct emoji suggestion)
    if (suggestionData?.emoji && suggestionData?.slug) {
      // Redirect to emoji page using slug
      router.push(`/emoji/${suggestionData.slug}`);
      
      // Clear the search state
      setQuery('');
      setShowSuggestions(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }
    
    // Regular search
    executeSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user has selected a suggestion with arrow keys, use it
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex].text, suggestions[activeIndex]);
    } else {
      // Otherwise, search for the typed query
      executeSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
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
          selectSuggestion(suggestions[activeIndex].text, suggestions[activeIndex]);
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

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Buscar emojis..."
            className="block w-full pl-9 pr-3 py-2 border border-slate-400/30 rounded-lg text-sm leading-5 bg-white/95 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:ring-2 focus:ring-white/50 focus:border-white/30 focus:bg-white shadow-sm"
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
    </div>
  );
}