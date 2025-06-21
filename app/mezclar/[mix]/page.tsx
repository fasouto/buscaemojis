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
    
    // Simple approach: split on dash and take first and last parts
    const parts = decoded.split('-');
    
    if (parts.length >= 2) {
      // Take the first part as emoji1 and join the rest as emoji2
      // This handles cases where emoji2 might contain dashes in its encoding
      const emoji1 = parts[0];
      const emoji2 = parts.slice(1).join('-');
      
      if (emoji1 && emoji2) {
        return {
          emoji1: emoji1.trim(),
          emoji2: emoji2.trim()
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
  
  const emoji1Data = emojis.find(e => e.emoji === parsedEmojis.emoji1);
  const emoji2Data = emojis.find(e => e.emoji === parsedEmojis.emoji2);
  
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
      
      <div className="min-h-screen bg-gray-50 py-8">
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