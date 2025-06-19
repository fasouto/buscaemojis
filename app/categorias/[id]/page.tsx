import { notFound } from 'next/navigation';
import EmojiGrid from '@/components/EmojiGrid';
import Link from 'next/link';
import { Metadata } from 'next';

interface CategoriaPageProps {
  params: {
    id: string;
  };
}

async function fetchGroup(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/groups/${id}`, {
      cache: 'force-cache'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.group;
  } catch (error) {
    console.error('Failed to fetch group:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const group = await fetchGroup(params.id);
  
  if (!group) {
    return {
      title: 'Categoría no encontrada - BuscaEmojis',
    };
  }

  return {
    title: `${group.spanishName} - BuscaEmojis`,
    description: `Explora todos los emojis de ${group.spanishName.toLowerCase()}. ${group.emojis.length} emojis disponibles.`,
  };
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const group = await fetchGroup(params.id);
  
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