'use client';

import { X, Trash2 } from 'lucide-react';

interface SearchHistoryProps {
  searchHistory: string[];
  onSearch: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
  isVisible: boolean;
}

export default function SearchHistory({ 
  searchHistory, 
  onSearch, 
  onRemove, 
  onClearAll,
  isVisible 
}: SearchHistoryProps) {
  if (!isVisible || searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Búsquedas recientes
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1"
          title="Limpiar historial"
        >
          <Trash2 className="h-3 w-3" />
          <span>Limpiar</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((term) => (
          <div
            key={term}
            className="group flex items-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <button
              onClick={() => onSearch(term)}
              className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              {term}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
              className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
              title={`Eliminar "${term}"`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}