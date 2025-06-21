'use client';

import { useState } from 'react';
import { SpanishEmojiData, EmojiGroup } from '@/lib/types';
import EmojiSelector from './EmojiSelector';

interface QuickEmojiGridProps {
  emojis: SpanishEmojiData[];
  groups: EmojiGroup[];
  onEmojiSelect: (emoji: SpanishEmojiData) => void;
  initialSelectedEmoji?: SpanishEmojiData;
}

export default function QuickEmojiGrid({ emojis, groups, onEmojiSelect, initialSelectedEmoji }: QuickEmojiGridProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialSelectedEmoji ? initialSelectedEmoji.group : null
  );
  const [showAllInCategory, setShowAllInCategory] = useState(false);

  // Popular emojis optimized for mixing (funny + commonly used combinations)
  const popularEmojis = [
    // Top faces - very mixable and expressive
    '😀', '😊', '😍', '😂', '🤣', '😭', '😡', '🤔', '😴', '🤯', '🥵', '🤮',
    // Essential expressions
    '❤️', '🔥', '💯', '👍', '👎', '🙌', '👋', '🤝', '💪', '🧠', '👀', '💀',
    // Fun animals for mixing
    '🐱', '🐶', '🦄', '🐧', '🦊', '🐼', '🐸', '🦖', '🐸', '🦁', '🐢', '🦋',
    // Food that creates funny mixes
    '🍕', '🍎', '🍰', '🍔', '🌮', '🥘', '🍷', '☕', '🍌', '🌶️', '🧄', '🥚',
    // Party & celebration
    '🎉', '🎊', '🎁', '🌟', '🎈', '⚽', '🏆', '🎯'
  ];

  // Get emoji data for popular emojis
  const quickEmojis = popularEmojis
    .map(emojiChar => emojis.find(e => e.emoji === emojiChar))
    .filter(Boolean) as SpanishEmojiData[];

  // Filter by category if selected
  const categoryEmojis = selectedCategory !== null 
    ? emojis.filter(emoji => emoji.group === selectedCategory)
    : [];
  
  const displayEmojis = selectedCategory !== null 
    ? (showAllInCategory ? categoryEmojis : categoryEmojis.slice(0, 80))
    : quickEmojis;

  const categories = [
    { id: 0, name: 'Caras', emoji: '😀' },
    { id: 1, name: 'Personas', emoji: '👋' },
    { id: 3, name: 'Animales', emoji: '🐱' },
    { id: 4, name: 'Comida', emoji: '🍕' },
    { id: 5, name: 'Viajes', emoji: '✈️' },
    { id: 6, name: 'Actividades', emoji: '⚽' },
    { id: 7, name: 'Objetos', emoji: '📱' },
    { id: 8, name: 'Símbolos', emoji: '❤️' }
  ];

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 justify-center">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowAllInCategory(false);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Popular
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setShowAllInCategory(false);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-sm">{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Quick Emoji Grid */}
      <div className={`${selectedCategory !== null ? 'max-h-80 overflow-y-auto' : ''}`}>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {displayEmojis.map((emoji) => (
            <button
              key={emoji.hexcode}
              onClick={() => onEmojiSelect(emoji)}
              className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <span className="text-2xl sm:text-3xl block">{emoji.emoji}</span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {emoji.spanishTitle}
              </div>
            </button>
          ))}
        </div>
      </div>
      

      {/* Show More / Advanced Options */}
      <div className="text-center">
        {selectedCategory !== null && !showAllInCategory && categoryEmojis.length > 80 && (
          <button
            onClick={() => setShowAllInCategory(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 mx-auto"
          >
            <span>Ver todos ({categoryEmojis.length})</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Advanced Selector (Modal-like) */}
      {showAdvanced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedCategory !== null 
                  ? `Todos los emojis - ${categories.find(c => c.id === selectedCategory)?.name}`
                  : 'Buscar Emoji'
                }
              </h3>
              <button
                onClick={() => setShowAdvanced(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[calc(80vh-80px)] overflow-y-auto">
              {selectedCategory !== null ? (
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
                  {emojis.filter(emoji => emoji.group === selectedCategory).map((emoji) => (
                    <button
                      key={emoji.hexcode}
                      onClick={() => {
                        onEmojiSelect(emoji);
                        setShowAdvanced(false);
                      }}
                      className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                      title={emoji.spanishTitle}
                    >
                      <span className="text-2xl block">{emoji.emoji}</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {emoji.spanishTitle}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <EmojiSelector
                  emojis={emojis}
                  groups={groups}
                  onEmojiSelect={(emoji) => {
                    onEmojiSelect(emoji);
                    setShowAdvanced(false);
                  }}
                  placeholder="Buscar entre todos los emojis..."
                />
              )}
            </div>
            {selectedCategory !== null && (
              <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
                {emojis.filter(emoji => emoji.group === selectedCategory).length} emojis en total
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}