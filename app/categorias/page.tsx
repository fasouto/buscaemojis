import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías de Emojis - BuscaEmojis',
  description: 'Explora emojis organizados por categorías: caritas, animales, comida, viajes y más.',
};

async function fetchGroups() {
  try {
    // Import the function directly instead of making HTTP request
    const { getEmojiGroups } = await import('@/lib/emoji-data');
    return getEmojiGroups();
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    return [];
  }
}

export default async function CategoriasPage() {
  const groups = await fetchGroups();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Volver al inicio
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Categorías de Emojis
        </h1>
        <p className="text-lg text-gray-600">
          Explora emojis organizados por categorías
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups && groups.length > 0 ? groups.map((group: any) => (
          <Link
            key={group.id}
            href={`/categorias/${group.slug}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {group.spanishName}
              </h2>
              <span className="text-sm text-gray-500">
                {group.emojis.length} emojis
              </span>
            </div>
            
            <div className="flex space-x-2 mb-4">
              {group.emojis.slice(0, 6).map((emoji: any, index: number) => (
                <span key={index} className="text-2xl">
                  {emoji.emoji}
                </span>
              ))}
              {group.emojis.length > 6 && (
                <span className="text-2xl text-gray-400">...</span>
              )}
            </div>
            
            <div className="text-blue-600 font-medium">
              Ver todos →
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No se pudieron cargar las categorías</p>
            <p className="text-gray-400 text-sm mt-2">Por favor, recarga la página</p>
          </div>
        )}
      </div>
    </div>
  );
}