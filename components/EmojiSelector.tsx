'use client';

import { useState, useMemo } from 'react';
import { SpanishEmojiData, EmojiGroup } from '@/lib/types';
import { searchEmojis } from '@/lib/search';

interface EmojiSelectorProps {
  emojis: SpanishEmojiData[];
  groups: EmojiGroup[];
  onEmojiSelect: (emoji: SpanishEmojiData) => void;
  selectedEmoji?: SpanishEmojiData;
  placeholder?: string;
  className?: string;
}

export default function EmojiSelector({ 
  emojis, 
  groups, 
  onEmojiSelect, 
  selectedEmoji,
  placeholder = "Selecciona un emoji",
  className = ""
}: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // Filter emojis based on search and group
  const filteredEmojis = useMemo(() => {
    let result = emojis;

    // Filter by group
    if (selectedGroup !== null) {
      result = result.filter(emoji => emoji.group === selectedGroup);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const searchResults = searchEmojis(searchQuery);
      // Filter search results to match group if selected
      result = searchResults
        .map(r => r.emoji)
        .filter(emoji => selectedGroup === null || emoji.group === selectedGroup);
    }

    // Limit results for performance
    return result.slice(0, 100);
  }, [emojis, selectedGroup, searchQuery]);

  const handleEmojiClick = (emoji: SpanishEmojiData) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Emoji Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors bg-white"
      >
        {selectedEmoji ? (
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{selectedEmoji.emoji}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{selectedEmoji.spanishTitle}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span className="text-2xl">➕</span>
            <span>{placeholder}</span>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar emojis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            
            {/* Group Filter */}
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedGroup(null)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedGroup === null 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedGroup === group.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {group.spanishName}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Grid */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {filteredEmojis.length > 0 ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {filteredEmojis.map((emoji) => (
                  <button
                    key={emoji.hexcode}
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors group relative"
                    title={emoji.spanishTitle}
                  >
                    <span className="text-2xl block">{emoji.emoji}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {emoji.spanishTitle}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl block mb-2">🔍</span>
                <p>No se encontraron emojis</p>
                <p className="text-sm">Prueba con otros términos de búsqueda</p>
              </div>
            )}
          </div>

          {/* Results Count */}
          {filteredEmojis.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 text-sm text-gray-500">
              {filteredEmojis.length} emoji{filteredEmojis.length !== 1 ? 's' : ''} encontrado{filteredEmojis.length !== 1 ? 's' : ''}
              {filteredEmojis.length >= 100 && ' (mostrando los primeros 100)'}
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}