'use client';

import { useMemo } from 'react';
import { SpanishEmojiData } from '@/lib/types';
import { searchEmojis } from '@/lib/search';

// Popular Spanish search terms and cultural references
const POPULAR_SUGGESTIONS = [
  'feliz', 'triste', 'amor', 'risa', 'llorar',
  'comida', 'paella', 'siesta', 'fiesta', 'sol',
  'sevillana', 'flamenco', 'corazón', 'beso', 'abrazo',
  'trabajo', 'estudiar', 'vacaciones', 'familia', 'amigos',
  'fútbol', 'música', 'bailar', 'celebrar', 'dormir',
];

// Emotional and contextual suggestions
const EMOTIONAL_SUGGESTIONS = [
  'alegría', 'tristeza', 'enfado', 'sorpresa', 'miedo',
  'cansado', 'emocionado', 'nervioso', 'relajado', 'confundido',
];

// Cultural and Spanish-specific suggestions
const CULTURAL_SUGGESTIONS = [
  'español', 'españa', 'andalucía', 'madrid', 'barcelona',
  'tapas', 'sangría', 'tortilla', 'jamón', 'churros',
  'gitano', 'ole', 'vamos', 'guay', 'chulo',
];

export interface SearchSuggestion {
  text: string;
  type: 'popular' | 'cultural' | 'emotional' | 'history' | 'emoji';
  emoji?: string;
  slug?: string;
}

export function useSearchSuggestions(
  query: string,
  searchHistory: string[],
  emojiData?: SpanishEmojiData[]
) {
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      // When no query, show recent searches + popular suggestions
      const historySuggestions: SearchSuggestion[] = searchHistory.slice(0, 3).map(term => ({
        text: term,
        type: 'history' as const,
      }));

      const popularSuggestions: SearchSuggestion[] = POPULAR_SUGGESTIONS
        .slice(0, 5)
        .map(term => ({
          text: term,
          type: 'popular' as const,
        }));

      return [...historySuggestions, ...popularSuggestions];
    }

    const lowerQuery = query.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

    // History matches
    searchHistory
      .filter(term => term.includes(lowerQuery))
      .slice(0, 2)
      .forEach(term => {
        suggestions.push({
          text: term,
          type: 'history',
        });
      });

    // Popular suggestions that match
    POPULAR_SUGGESTIONS
      .filter(term => term.includes(lowerQuery))
      .slice(0, 3)
      .forEach(term => {
        if (!suggestions.some(s => s.text === term)) {
          suggestions.push({
            text: term,
            type: 'popular',
          });
        }
      });

    // Emotional suggestions
    EMOTIONAL_SUGGESTIONS
      .filter(term => term.includes(lowerQuery))
      .slice(0, 2)
      .forEach(term => {
        if (!suggestions.some(s => s.text === term)) {
          suggestions.push({
            text: term,
            type: 'emotional',
          });
        }
      });

    // Cultural suggestions
    CULTURAL_SUGGESTIONS
      .filter(term => term.includes(lowerQuery))
      .slice(0, 2)
      .forEach(term => {
        if (!suggestions.some(s => s.text === term)) {
          suggestions.push({
            text: term,
            type: 'cultural',
          });
        }
      });

    // Emoji-based suggestions using Fuse.js search (same as homepage)
    if (emojiData && lowerQuery.length >= 2) {
      const emojiSuggestions: SearchSuggestion[] = [];
      
      // Use the same search algorithm as homepage
      const searchResults = searchEmojis(lowerQuery);
      
      searchResults
        .slice(0, 6) // Limit to top 6 results
        .forEach(result => {
          const emoji = result.emoji;
          const suggestionText = emoji.spanishTitle || emoji.annotation;
          if (suggestionText) {
            const lowercaseText = suggestionText.toLowerCase();
            // Check for duplicates in both existing suggestions and current emoji suggestions
            if (!suggestions.some(s => s.text === lowercaseText) && 
                !emojiSuggestions.some(s => s.text === lowercaseText)) {
              emojiSuggestions.push({
                text: lowercaseText,
                type: 'emoji',
                emoji: emoji.emoji,
                slug: emoji.slug,
              });
            }
          }
        });
      
      // Add emoji suggestions at the beginning
      suggestions.unshift(...emojiSuggestions);
    }

    return suggestions.slice(0, 10); // Limit to 10 suggestions max
  }, [query, searchHistory, emojiData]);

  return suggestions;
}