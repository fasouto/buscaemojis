import { SpanishEmojiData } from '@/lib/types';

interface NoResultsProps {
  query: string;
  onSearch: (term: string) => void;
  popularEmojis?: SpanishEmojiData[];
}

export default function NoResults({ query, onSearch, popularEmojis }: NoResultsProps) {
  const suggestions = [
    'feliz', 'triste', 'amor', 'comida', 'fiesta',
    'siesta', 'paella', 'flamenco', 'sol', 'corazón'
  ];

  const culturalExamples = [
    { term: 'sevillana', description: 'Para encontrar 💃 y bailes tradicionales' },
    { term: 'siesta', description: 'Para encontrar 😴 y descanso' },
    { term: 'paella', description: 'Para encontrar 🥘 y comida española' },
    { term: 'ole', description: 'Para encontrar 🎉 y celebraciones' }
  ];

  return (
    <div className="text-center py-12 max-w-2xl mx-auto">
      <div className="text-6xl mb-6">🤔</div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        No encontramos emojis para "{query}"
      </h2>
      
      <p className="text-gray-600 mb-8">
        Prueba con otros términos o usa nuestras sugerencias
      </p>

      {/* Quick suggestions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Búsquedas populares:
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSearch(suggestion)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Cultural examples */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Prueba con referencias culturales:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {culturalExamples.map((example) => (
            <button
              key={example.term}
              onClick={() => onSearch(example.term)}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
            >
              <div className="font-medium text-orange-900">"{example.term}"</div>
              <div className="text-sm text-orange-700">{example.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular emojis fallback */}
      {popularEmojis && popularEmojis.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            O explora nuestros emojis más populares:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularEmojis.slice(0, 12).map((emoji) => (
              <button
                key={emoji.hexcode}
                onClick={() => onSearch(emoji.spanishTitle || emoji.annotation)}
                className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                title={emoji.spanishDescription || emoji.spanishTitle}
              >
                <span className="text-2xl mb-1">{emoji.emoji}</span>
                <span className="text-xs text-gray-600 text-center">
                  {emoji.spanishTitle || emoji.annotation}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos de búsqueda:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Usa palabras simples: "feliz" en lugar de "estar contento"</li>
          <li>• Prueba con emociones: "triste", "alegre", "enfadado"</li>
          <li>• Busca por contexto: "trabajo", "familia", "vacaciones"</li>
          <li>• Incluye referencias españolas: "flamenco", "tapas", "fútbol"</li>
        </ul>
      </div>
    </div>
  );
}