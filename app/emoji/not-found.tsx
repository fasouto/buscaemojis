import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji no encontrado - BuscaEmojis',
  description: 'El emoji que buscas no existe. Explora nuestra colección completa de emojis en español.',
};

export default function EmojiNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {/* Back link */}
        <div className="mb-8 text-left">
          <Link 
            href="/" 
            className="text-slate-600 hover:text-slate-800 font-medium"
          >
            ← Volver a la búsqueda
          </Link>
        </div>
        
        {/* Large Emoji */}
        <div className="mb-8">
          <span className="text-8xl">🔍</span>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Emoji no encontrado
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          El emoji que buscas no existe o la URL puede haber cambiado. 
          ¿Quieres buscar algo específico?
        </p>
        
        {/* Search Suggestions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Prueba buscando:
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'corazón', 'risa', 'casa', 'gato', 'sol', 
              'comida', 'español', 'fiesta', 'trabajo'
            ].map((term) => (
              <Link
                key={term}
                href={`/?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors font-medium"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            🔍 Buscar emojis
          </Link>
          
          <Link
            href="/categorias"
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            📂 Explorar categorías
          </Link>
        </div>
        
        {/* Featured Emojis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Emojis populares
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {[
              { emoji: '😀', name: 'sonrisa' },
              { emoji: '❤️', name: 'corazón' },
              { emoji: '😂', name: 'risa' },
              { emoji: '🥘', name: 'paella' },
              { emoji: '🏠', name: 'casa' },
              { emoji: '☀️', name: 'sol' },
              { emoji: '🇪🇸', name: 'españa' }
            ].map(({ emoji, name }) => (
              <Link
                key={name}
                href={`/?q=${encodeURIComponent(name)}`}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-colors group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {emoji}
                </span>
                <span className="text-xs text-gray-600 text-center">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}