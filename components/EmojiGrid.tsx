import { SpanishEmojiData } from '@/lib/types';
import EmojiCard from './EmojiCard';

interface EmojiGridProps {
  emojis: SpanishEmojiData[];
  maxResults?: number;
}

export default function EmojiGrid({ emojis, maxResults = 50 }: EmojiGridProps) {
  const displayEmojis = emojis.slice(0, maxResults);

  if (displayEmojis.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron emojis
        </h2>
        <p className="text-gray-600">
          Prueba con otros términos de búsqueda como "feliz", "comida" o "amor"
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayEmojis.map((emoji) => (
        <EmojiCard key={emoji.hexcode} emoji={emoji} />
      ))}
    </div>
  );
}