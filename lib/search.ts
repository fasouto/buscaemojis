import Fuse from 'fuse.js';
import { SpanishEmojiData, SearchResult } from './types';
import { enhanceEmojiData } from './emoji-data';

let searchIndex: Fuse<SpanishEmojiData> | null = null;

function initializeSearch() {
  if (searchIndex) return searchIndex;

  const emojiData = enhanceEmojiData();
  
  const options = {
    keys: [
      { name: 'spanishTitle', weight: 0.3 },
      { name: 'spanishDescription', weight: 0.2 },
      { name: 'spanishTags', weight: 0.2 },
      { name: 'culturalReferences', weight: 0.15 },
      { name: 'aliases', weight: 0.1 },
      { name: 'annotation', weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  searchIndex = new Fuse(emojiData, options);
  return searchIndex;
}

export function searchEmojis(query: string): SearchResult[] {
  if (!query.trim()) {
    return enhanceEmojiData().slice(0, 50).map(emoji => ({
      emoji,
      score: 1,
    }));
  }

  const fuse = initializeSearch();
  const results = fuse.search(query);

  return results.map(result => ({
    emoji: result.item,
    score: result.score || 0,
  }));
}

export function getPopularEmojis(): SpanishEmojiData[] {
  const popular = [
    // Most popular faces and emotions
    '😂', '❤️', '😍', '😘', '😊', '😢', '😭', '🥰', '😎', '🤗',
    // Common gestures and people
    '👍', '👎', '👏', '🙏', '🤝', '👋', '🤷', '💃', '🕺', '👌',
    // Popular symbols and celebrations
    '🎉', '🎊', '🔥', '💯', '✨', '⭐', '🌟', '💖', '💕', '🌹',
    // Food and drinks (Spanish favorites)
    '🥘', '🍕', '🍷', '🍺', '☕', '🥖', '🧀', '🍎', '🍇', '🍊',
    // Spanish culture and travel
    '🎸', '⚽', '🏖️', '☀️', '🌴', '🏛️', '🚗', '✈️', '🏠', '🌍',
    // Work and communication
    '💼', '📱', '💻', '📧', '📅', '🎯', '💡', '📝', '🔍', '⏰',
  ];

  const enhancedData = enhanceEmojiData();
  return popular
    .map(emoji => enhancedData.find(e => e.emoji === emoji))
    .filter(Boolean) as SpanishEmojiData[];
}