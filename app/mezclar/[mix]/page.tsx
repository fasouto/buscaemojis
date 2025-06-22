import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { enhanceEmojiData, getEmojiGroups } from '@/lib/emoji-data';
import { EmojiMixer as MixerEngine } from '@/lib/emoji-mixer';
import EmojiMixer from '@/components/EmojiMixer';

interface MixPageProps {
  params: {
    mix: string;
  };
}

function parseEmojisFromMix(mixParam: string): { emoji1: string; emoji2: string } | null {
  try {
    // First decode the URL parameter
    const decoded = decodeURIComponent(mixParam);
    
    // Normalize function to handle variation selectors
    const normalizeEmoji = (emoji: string): string => {
      // Remove Variation Selector-16 (U+FE0F) for consistent matching
      return emoji.replace(/\uFE0F/g, '');
    };
    
    // Simple approach: split on dash and take first and last parts
    const parts = decoded.split('-');
    
    if (parts.length >= 2) {
      // Take the first part as emoji1 and join the rest as emoji2
      // This handles cases where emoji2 might contain dashes in its encoding
      let emoji1 = parts[0].trim();
      let emoji2 = parts.slice(1).join('-').trim();
      
      // Normalize both emojis to ensure consistent matching with emoji data
      emoji1 = normalizeEmoji(emoji1);
      emoji2 = normalizeEmoji(emoji2);
      
      if (emoji1 && emoji2) {
        return {
          emoji1,
          emoji2
        };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

async function getMixData(mixParam: string) {
  const emojis = enhanceEmojiData();
  const groups = getEmojiGroups();
  
  const parsedEmojis = parseEmojisFromMix(mixParam);
  if (!parsedEmojis) {
    return null;
  }
  
  // Helper function to normalize emojis for matching
  const normalizeEmoji = (emoji: string): string => {
    return emoji.replace(/\uFE0F/g, '');
  };
  
  // Try to find emoji data by exact match first, then by normalized match
  const findEmojiData = (targetEmoji: string) => {
    // First try exact match
    let found = emojis.find(e => e.emoji === targetEmoji);
    if (found) return found;
    
    // If not found, try matching with normalized versions
    found = emojis.find(e => normalizeEmoji(e.emoji) === normalizeEmoji(targetEmoji));
    return found;
  };
  
  const emoji1Data = findEmojiData(parsedEmojis.emoji1);
  const emoji2Data = findEmojiData(parsedEmojis.emoji2);
  
  if (!emoji1Data || !emoji2Data) {
    return null;
  }
  
  // Create the mix for metadata
  const mix = await MixerEngine.createMix(emoji1Data, emoji2Data, 256);
  
  return {
    emojis,
    groups,
    emoji1Data,
    emoji2Data,
    mix
  };
}

export async function generateMetadata({ params }: MixPageProps): Promise<Metadata> {
  const mixData = await getMixData(params.mix);
  
  if (!mixData || !mixData.mix) {
    return {
      title: 'Mezcla no encontrada - BuscaEmojis',
      description: 'Esta combinación de emojis no está disponible.',
    };
  }

  const { mix } = mixData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es';

  return {
    title: `${mix.spanishName} - Mezclador de Emojis`,
    description: mix.spanishDescription,
    keywords: `${mix.spanishName}, mezcla emoji, ${mix.emoji1Data.spanishTitle}, ${mix.emoji2Data.spanishTitle}`,
    openGraph: {
      title: `${mix.spanishName} - BuscaEmojis`,
      description: mix.spanishDescription,
      type: 'website',
      images: [
        {
          url: mix.imageUrl,
          width: 256,
          height: 256,
          alt: mix.spanishName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${mix.spanishName} - BuscaEmojis`,
      description: mix.spanishDescription,
      images: [mix.imageUrl],
    },
    alternates: {
      canonical: `/mezclar/${params.mix}`,
    },
  };
}

export default async function MixPage({ params }: MixPageProps) {
  const mixData = await getMixData(params.mix);
  
  if (!mixData) {
    notFound();
  }
  
  const { emojis, groups, emoji1Data, emoji2Data, mix } = mixData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es';
  
  // Structured data for the specific mix
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": mix?.spanishName || `${emoji1Data.spanishTitle} + ${emoji2Data.spanishTitle}`,
    "description": mix?.spanishDescription || `Combinación de ${emoji1Data.spanishTitle} con ${emoji2Data.spanishTitle}`,
    "image": mix?.imageUrl,
    "url": `${baseUrl}/mezclar/${params.mix}`,
    "inLanguage": "es-ES",
    "creator": {
      "@type": "Organization",
      "name": "BuscaEmojis"
    }
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
          initialEmoji1={emoji1Data}
          initialEmoji2={emoji2Data}
        />
      </div>
    </>
  );
}