'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SimpleSearchBar from '@/components/SimpleSearchBar';
import EmojiGrid from '@/components/EmojiGrid';
import NoResults from '@/components/NoResults';
import { SpanishEmojiData } from '@/lib/types';
import Link from 'next/link';

export default function HomeClient() {
  const [emojis, setEmojis] = useState<SpanishEmojiData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    
    try {
      const queryParam = searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : '';
      const response = await fetch(`/api/search${queryParam}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setEmojis(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setEmojis([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Check for search query in URL
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      handleSearch(urlQuery);
    } else {
      handleSearch(''); // This will fetch popular emojis
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          Encuentra el emoji perfecto
        </h1>
        
        <SimpleSearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {query ? `Resultados para "${query}"` : 'Emojis populares'}
          </h2>
          
          <Link 
            href="/categorias" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver por categorías →
          </Link>
        </div>
        
        {isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : emojis.length === 0 && query ? (
          <NoResults 
            query={query} 
            onSearch={handleSearch}
            popularEmojis={[]}
          />
        ) : (
          <EmojiGrid emojis={emojis} />
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Sabías que...?
        </h3>
        <p className="text-blue-800">
          Puedes buscar emojis usando referencias culturales españolas como "sevillana", 
          "siesta", "paella" o expresiones como "estar como unas castañuelas"
        </p>
      </div>
    </div>
  );
}