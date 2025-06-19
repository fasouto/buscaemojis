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

const spanishEnhancements: Record<string, Partial<SpanishEmojiData>> = {
  '😀': {
    spanishTitle: 'Cara sonriente',
    spanishDescription: 'Una cara feliz con gran sonrisa mostrando los dientes',
    spanishTags: ['feliz', 'alegre', 'sonrisa', 'contento'],
    culturalReferences: ['buen rollo', 'estar como unas castañuelas'],
    aliases: ['sonrisa', 'felicidad', 'alegría'],
  },
  '😂': {
    spanishTitle: 'Cara llorando de risa',
    spanishDescription: 'Cara con lágrimas de tanto reír',
    spanishTags: ['risa', 'llorar de risa', 'gracioso', 'divertido'],
    culturalReferences: ['mondarse de risa', 'partirse de risa', 'troncharse'],
    aliases: ['risa', 'carcajada', 'humor'],
  },
  '❤️': {
    spanishTitle: 'Corazón rojo',
    spanishDescription: 'Corazón rojo clásico representando amor',
    spanishTags: ['amor', 'corazón', 'cariño', 'romance'],
    culturalReferences: ['querer', 'estar colado', 'media naranja'],
    aliases: ['amor', 'te quiero', 'corazón'],
  },
  '🥘': {
    spanishTitle: 'Paella',
    spanishDescription: 'Plato tradicional español con arroz',
    spanishTags: ['paella', 'comida española', 'arroz', 'mariscos'],
    culturalReferences: ['Valencia', 'domingo familiar', 'tradición española'],
    aliases: ['paella', 'arroz', 'comida española'],
  },
  '💃': {
    spanishTitle: 'Mujer bailando',
    spanishDescription: 'Mujer bailando flamenco o sevillanas',
    spanishTags: ['baile', 'flamenco', 'sevillanas', 'danza'],
    culturalReferences: ['sevillana', 'flamenco', 'feria', 'andalucía'],
    aliases: ['bailar', 'sevillana', 'flamenco', 'danza'],
  },
  '🎸': {
    spanishTitle: 'Guitarra',
    spanishDescription: 'Guitarra española clásica',
    spanishTags: ['guitarra', 'música', 'flamenco', 'español'],
    culturalReferences: ['guitarra española', 'paco de lucía', 'flamenco'],
    aliases: ['guitarra', 'música', 'flamenco'],
  },
  '😴': {
    spanishTitle: 'Cara durmiendo',
    spanishDescription: 'Cara con ojos cerrados durmiendo',
    spanishTags: ['dormir', 'sueño', 'siesta', 'cansado'],
    culturalReferences: ['siesta', 'echar la siesta', 'cabezada'],
    aliases: ['dormir', 'siesta', 'sueño'],
  },
  '☀️': {
    spanishTitle: 'Sol',
    spanishDescription: 'Sol brillante y radiante',
    spanishTags: ['sol', 'calor', 'verano', 'playa'],
    culturalReferences: ['costa del sol', 'buen tiempo', 'playa española'],
    aliases: ['sol', 'calor', 'verano'],
  },
  '🤷': {
    spanishTitle: 'Persona encogiendo hombros',
    spanishDescription: 'Expresa duda, desconocimiento o indiferencia ante una situación. Se usa para decir no sé o me da igual',
    spanishTags: ['no sé', 'duda', 'indiferente', 'desconocimiento', 'hombros', 'encogiendo'],
    culturalReferences: [],
    aliases: ['ni idea', 'yo qué sé', 'me da igual'],
  },
  '🤷‍♂️': {
    spanishTitle: 'Hombre encogiendo hombros',
    spanishDescription: 'Expresa duda, desconocimiento o indiferencia ante una situación. Se usa para decir no sé o me da igual',
    spanishTags: ['no sé', 'duda', 'indiferente', 'desconocimiento', 'hombros', 'encogiendo'],
    culturalReferences: [],
    aliases: ['ni idea', 'yo qué sé', 'me da igual'],
  },
  '🤷‍♀️': {
    spanishTitle: 'Mujer encogiendo hombros',
    spanishDescription: 'Expresa duda, desconocimiento o indiferencia ante una situación. Se usa para decir no sé o me da igual',
    spanishTags: ['no sé', 'duda', 'indiferente', 'desconocimiento', 'hombros', 'encogiendo'],
    culturalReferences: [],
    aliases: ['ni idea', 'yo qué sé', 'me da igual'],
  },
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
    // Manual enhancements take priority over AI ones
    const manualEnhancement = spanishEnhancements[emoji.emoji] || {};
    const aiEnhancement = aiEnhancements[emoji.emoji] || {};
    
    const spanishTitle = manualEnhancement.spanishTitle || aiEnhancement.spanishTitle || emoji.label || emoji.annotation;
    
    return {
      ...emoji,
      annotation: emoji.label || emoji.annotation, // Use label as annotation
      spanishTitle,
      spanishDescription: manualEnhancement.spanishDescription || aiEnhancement.spanishDescription || emoji.label || emoji.annotation,
      spanishTags: manualEnhancement.spanishTags || aiEnhancement.spanishTags || emoji.tags || [],
      culturalReferences: manualEnhancement.culturalReferences || aiEnhancement.culturalReferences || [],
      aliases: manualEnhancement.aliases || aiEnhancement.aliases || [],
      similarEmojis: manualEnhancement.similarEmojis || [],
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