import { notFound } from 'next/navigation';
import EmojiCard from '@/components/EmojiCard';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { Metadata } from 'next';

interface EmojiPageProps {
  params: {
    slug: string;
  };
}

async function fetchEmojiData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/emoji/slug/${slug}`, {
      cache: 'force-cache' // Cache the response
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch emoji data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EmojiPageProps): Promise<Metadata> {
  const data = await fetchEmojiData(params.slug);
  
  if (!data?.emoji) {
    return {
      title: 'Emoji no encontrado - BuscaEmojis',
    };
  }

  const { emoji } = data;
  
  return {
    title: `${emoji.emoji} ${emoji.spanishTitle} - BuscaEmojis`,
    description: `${emoji.spanishDescription}. Copia y pega este emoji: ${emoji.emoji}`,
    openGraph: {
      title: `${emoji.emoji} ${emoji.spanishTitle}`,
      description: emoji.spanishDescription,
    },
  };
}

export default async function EmojiPage({ params }: EmojiPageProps) {
  const data = await fetchEmojiData(params.slug);
  
  if (!data?.emoji) {
    notFound();
  }

  const { emoji, similarEmojis } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Volver a la búsqueda
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="text-center mb-8">
          <div className="emoji-large mb-6">{emoji.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {emoji.spanishTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {emoji.spanishDescription}
          </p>
          
          <div className="flex justify-center space-x-4">
            <CopyButton 
              emoji={emoji.emoji} 
              title={emoji.spanishTitle}
              size="large"
            />
            
            <Link
              href={`/mezclar?e1=${encodeURIComponent(emoji.emoji)}`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>🔀</span>
              <span>Mezclar este emoji</span>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información técnica
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Unicode:</dt>
                <dd className="text-sm text-gray-900 font-mono">{emoji.hexcode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Versión:</dt>
                <dd className="text-sm text-gray-900">Emoji {emoji.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre en inglés:</dt>
                <dd className="text-sm text-gray-900">{emoji.annotation}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Etiquetas
            </h2>
            {emoji.spanishTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emoji.spanishTags.map((tag: string, index: number) => (
                  <Link
                    key={index}
                    href={`/?q=${encodeURIComponent(tag)}`}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {emoji.culturalReferences.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Referencias culturales
            </h2>
            <div className="flex flex-wrap gap-2">
              {emoji.culturalReferences.map((ref: string, index: number) => (
                <Link
                  key={index}
                  href={`/?q=${encodeURIComponent(ref)}`}
                  className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full hover:bg-orange-200 transition-colors cursor-pointer"
                >
                  {ref}
                </Link>
              ))}
            </div>
          </div>
        )}

        {emoji.aliases.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              También conocido como
            </h2>
            <p className="text-gray-700">
              {emoji.aliases.join(', ')}
            </p>
          </div>
        )}
      </div>

      {similarEmojis.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Emojis similares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {similarEmojis.map((similarEmoji: any) => (
              <EmojiCard key={similarEmoji.hexcode} emoji={similarEmoji} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}