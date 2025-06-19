import { notFound } from 'next/navigation';
import EmojiGrid from '@/components/EmojiGrid';
import Link from 'next/link';
import { Metadata } from 'next';

interface CategoriaPageProps {
  params: {
    slug: string;
  };
}

async function fetchGroupBySlug(slug: string) {
  try {
    // Import the function directly instead of making HTTP request
    const { getGroupBySlug } = await import('@/lib/emoji-data');
    return getGroupBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch group by slug:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const group = await fetchGroupBySlug(params.slug);
  
  if (!group) {
    return {
      title: 'Categoría no encontrada - BuscaEmojis',
    };
  }

  return {
    title: `${group.spanishName} - BuscaEmojis`,
    description: `Explora todos los emojis de ${group.spanishName.toLowerCase()}. ${group.emojis.length} emojis disponibles.`,
    openGraph: {
      title: `${group.spanishName} - BuscaEmojis`,
      description: `Explora todos los emojis de ${group.spanishName.toLowerCase()}. ${group.emojis.length} emojis disponibles.`,
      type: 'website',
    },
    alternates: {
      canonical: `/categorias/${group.slug}`,
    },
  };
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const group = await fetchGroupBySlug(params.slug);
  
  if (!group) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="mb-4">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Inicio
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link 
              href="/categorias" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Categorías
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{group.spanishName}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {group.spanishName}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {group.emojis.length} emojis en esta categoría
          </p>
        </div>
      </div>

      <EmojiGrid emojis={group.emojis} maxResults={200} />
    </div>
  );
}