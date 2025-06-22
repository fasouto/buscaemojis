import { Metadata } from 'next';
import { enhanceEmojiData, getEmojiGroups } from '@/lib/emoji-data';
import EmojiMixer from '@/components/EmojiMixer';

export const metadata: Metadata = {
  title: 'Mezclador de Emojis - BuscaEmojis',
  description: 'Combina dos emojis para crear mezclas únicas con Google Emoji Kitchen. Descubre combinaciones culturales españolas y crea tus propias mezclas personalizadas.',
  keywords: 'mezclar emojis, emoji kitchen, combinaciones emoji, emojis españoles, cultura española',
  openGraph: {
    title: 'Mezclador de Emojis - BuscaEmojis',
    description: 'Combina dos emojis para crear mezclas únicas con Google Emoji Kitchen.',
    type: 'website',
  },
  alternates: {
    canonical: '/mezclar',
  },
};

interface MezcladorPageProps {
  searchParams: {
    e1?: string;
    e2?: string;
  };
}

async function getEmojisForMixer() {
  const emojis = enhanceEmojiData();
  const groups = getEmojiGroups();
  
  return { emojis, groups };
}

function findEmojiByCharacter(emojis: any[], character: string) {
  return emojis.find(emoji => emoji.emoji === character);
}

export default async function MezcladorPage({ searchParams }: MezcladorPageProps) {
  const { emojis, groups } = await getEmojisForMixer();
  
  // Find initial emojis from URL parameters
  const initialEmoji1 = searchParams.e1 ? findEmojiByCharacter(emojis, searchParams.e1) : undefined;
  const initialEmoji2 = searchParams.e2 ? findEmojiByCharacter(emojis, searchParams.e2) : undefined;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mezclador de Emojis",
    "description": "Combina dos emojis para crear mezclas únicas con Google Emoji Kitchen",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es'}/mezclar`,
    "inLanguage": "es-ES",
    "applicationCategory": "Utility",
    "operatingSystem": "Web Browser"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white py-8 rounded-lg">
        <EmojiMixer
          emojis={emojis}
          groups={groups}
          initialEmoji1={initialEmoji1}
          initialEmoji2={initialEmoji2}
        />
      </div>
    </>
  );
}