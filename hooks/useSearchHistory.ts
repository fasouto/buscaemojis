'use client';

import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'buscaemojis_search_history';
const MAX_HISTORY_ITEMS = 8;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored) as string[];
        // Filter out very short or invalid entries
        const validHistory = history.filter(term => 
          typeof term === 'string' && 
          term.trim().length >= 2 &&
          term.trim().length <= 50
        );
        setSearchHistory(validHistory);
        
        // Update localStorage if we filtered anything
        if (validHistory.length !== history.length) {
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(validHistory));
        }
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
      // Clear corrupted data
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  }, []);

  // Add a search term to history
  const addToHistory = (term: string) => {
    if (!term.trim()) return;
    
    const trimmedTerm = term.trim().toLowerCase();
    
    // Don't add very short searches (likely incomplete) or very long ones
    if (trimmedTerm.length < 2 || trimmedTerm.length > 50) return;
    
    // Don't add terms that are just spaces or special characters
    if (!/[a-záéíóúñü]/.test(trimmedTerm)) return;
    
    setSearchHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== trimmedTerm);
      
      // Add to beginning
      const newHistory = [trimmedTerm, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Failed to save search history:', error);
      }
      
      return newHistory;
    });
  };

  // Clear all search history
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  };

  // Remove specific item from history
  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item !== term);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Failed to update search history:', error);
      }
      return newHistory;
    });
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}