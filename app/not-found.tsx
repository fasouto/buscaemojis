import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada - BuscaEmojis',
  description: 'La página que buscas no existe. Vuelve al inicio para buscar emojis en español.',
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {/* Large 404 Emoji */}
        <div className="mb-8">
          <span className="text-8xl">🤔</span>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¡Ups! Página no encontrada
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Parece que esta página no existe o el emoji que buscas ya no está disponible. 
          No te preocupes, ¡tenemos miles de emojis esperándote!
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            🏠 Volver al inicio
          </Link>
          
          <Link
            href="/categorias"
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            📂 Ver categorías
          </Link>
        </div>
        
        {/* Popular Searches */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Búsquedas populares:
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { emoji: '❤️', term: 'amor' },
              { emoji: '😂', term: 'risa' },
              { emoji: '🥘', term: 'paella' },
              { emoji: '🎉', term: 'fiesta' },
              { emoji: '😴', term: 'siesta' },
              { emoji: '☀️', term: 'sol' },
              { emoji: '🇪🇸', term: 'españa' }
            ].map(({ emoji, term }) => (
              <Link
                key={term}
                href={`/?q=${encodeURIComponent(term)}`}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
              >
                <span>{emoji}</span>
                <span>{term}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            💡 ¿No encuentras lo que buscas?
          </h3>
          <p className="text-blue-700">
            Prueba a buscar con diferentes palabras o explora nuestras categorías. 
            Tenemos emojis con descripciones culturales españolas y referencias locales.
          </p>
        </div>
      </div>
    </div>
  );
}