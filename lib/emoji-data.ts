import data from 'emojibase-data/en/data.json';
import { SpanishEmojiData, EmojiGroup } from './types';

// Function to create SEO-friendly slugs from Spanish text
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

const spanishGroupNames: Record<number, string> = {
  0: 'Caritas y emociones',
  1: 'Personas y cuerpo', 
  2: 'Tonos de piel',
  3: 'Animales y naturaleza',
  4: 'Comida y bebida',
  5: 'Viajes y lugares',
  6: 'Actividades',
  7: 'Objetos',
  8: 'Símbolos',
  9: 'Banderas',
};

const groupSlugs: Record<number, string> = {
  0: 'caritas-y-emociones',
  1: 'personas-y-cuerpo',
  2: 'tonos-de-piel',
  3: 'animales-y-naturaleza',
  4: 'comida-y-bebida',
  5: 'viajes-y-lugares',
  6: 'actividades',
  7: 'objetos',
  8: 'simbolos',
  9: 'banderas',
};


// Import AI-generated enhancements
let aiEnhancements: Record<string, any> = {};
try {
  aiEnhancements = require('./spanish-emoji-data.json');
} catch (error) {
  console.warn('AI enhancements not found, using manual only');
}

export function enhanceEmojiData(): SpanishEmojiData[] {
  return data.map((emoji: any) => {
    // Use AI-generated enhancements
    const aiEnhancement = aiEnhancements[emoji.emoji] || {};
    
    const spanishTitle = aiEnhancement.spanishTitle || emoji.label || emoji.annotation;
    
    return {
      ...emoji,
      annotation: emoji.label || emoji.annotation, // Use label as annotation
      spanishTitle,
      spanishDescription: aiEnhancement.spanishDescription || emoji.label || emoji.annotation,
      spanishTags: aiEnhancement.spanishTags || emoji.tags || [],
      culturalReferences: aiEnhancement.culturalReferences || [],
      aliases: aiEnhancement.aliases || [],
      similarEmojis: aiEnhancement.similarEmojis || [],
      slug: createSlug(spanishTitle),
    } as SpanishEmojiData;
  });
}

export function getEmojiGroups(): EmojiGroup[] {
  const enhancedData = enhanceEmojiData();
  const groups: Record<number, EmojiGroup> = {};

  enhancedData.forEach((emoji) => {
    // Skip emojis without a valid group
    if (emoji.group === undefined || emoji.group === null) {
      return;
    }
    
    // Skip "Tonos de piel" category (group 2) from browsable categories
    if (emoji.group === 2) {
      return;
    }
    
    if (!groups[emoji.group]) {
      groups[emoji.group] = {
        id: emoji.group,
        name: emoji.group.toString(),
        spanishName: spanishGroupNames[emoji.group] || `Grupo ${emoji.group}`,
        slug: groupSlugs[emoji.group] || createSlug(spanishGroupNames[emoji.group] || `grupo-${emoji.group}`),
        emojis: [],
      };
    }
    groups[emoji.group].emojis.push(emoji);
  });

  return Object.values(groups);
}

export function getEmojiByUnicode(hexcode: string): SpanishEmojiData | undefined {
  const enhancedData = enhanceEmojiData();
  return enhancedData.find(emoji => emoji.hexcode === hexcode);
}

export function getEmojiBySlug(slug: string): SpanishEmojiData | undefined {
  const enhancedData = enhanceEmojiData();
  return enhancedData.find(emoji => emoji.slug === slug);
}

export function getGroupBySlug(slug: string): EmojiGroup | undefined {
  const groups = getEmojiGroups();
  return groups.find(group => group.slug === slug);
}

export function getGroupById(id: number): EmojiGroup | undefined {
  const groups = getEmojiGroups();
  return groups.find(group => group.id === id);
}