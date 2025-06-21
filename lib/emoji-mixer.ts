import { SpanishEmojiData } from './types';
// @ts-ignore - emoji-mixer doesn't have type definitions
import * as emojiMixer from 'emoji-mixer';

interface EmojiCombination {
  leftEmoji: string;
  rightEmoji: string;
  date: string;
}

export interface EmojiMix {
  emoji1: string;
  emoji2: string;
  emoji1Data: SpanishEmojiData;
  emoji2Data: SpanishEmojiData;
  imageUrl: string;
  spanishName: string;
  spanishDescription: string;
  timestamp: number;
}

export class EmojiMixer {
  
  /**
   * Generate the mix image URL for two emojis using Google's official Emoji Kitchen
   */
  static getMixUrl(emoji1: string, emoji2: string, size: number = 128): string {
    try {
      return emojiMixer.default(emoji1, emoji2);
    } catch (error) {
      // Return empty string if combination doesn't exist
      return '';
    }
  }

  /**
   * Validate if a combination exists by attempting to generate the URL
   */
  static async isValidMix(emoji1: string, emoji2: string): Promise<boolean> {
    try {
      // The most reliable way is to just try generating the URL
      // If emojiMixer.default() succeeds, the combination exists
      const url = this.getMixUrl(emoji1, emoji2);
      return url !== '';
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if emojis are likely to have combinations using emoji-mixer data
   */
  static isLikelyToHaveCombination(emoji1: string, emoji2: string): boolean {
    try {
      // Check if both emojis are in the supported list
      const supportedEmojis = emojiMixer.supportedEmojis;
      const emoji1Unicode = emojiMixer.toUnicode(emoji1);
      const emoji2Unicode = emojiMixer.toUnicode(emoji2);
      
      const emoji1Supported = supportedEmojis.includes(emoji1Unicode);
      const emoji2Supported = supportedEmojis.includes(emoji2Unicode);
      
      // Both emojis need to be supported to have any chance of combination
      return emoji1Supported && emoji2Supported;
    } catch (error) {
      // Fallback to old logic if package fails
      const flagPattern = /[\uD83C][\uDDE6-\uDDFF]/;
      if (flagPattern.test(emoji1) || flagPattern.test(emoji2)) {
        return false;
      }

      const veryNewEmojis = ['🫠', '🫡', '🫢', '🫣', '🫤', '🫥', '🫶'];
      if (veryNewEmojis.includes(emoji1) || veryNewEmojis.includes(emoji2)) {
        return false;
      }

      return true;
    }
  }

  /**
   * Generate a Spanish name for the emoji combination
   */
  static generateSpanishName(emoji1Data: SpanishEmojiData, emoji2Data: SpanishEmojiData): string {
    // Check for predefined cultural combinations first
    const culturalName = this.getCulturalCombinationName(emoji1Data.emoji, emoji2Data.emoji);
    if (culturalName) {
      return culturalName;
    }

    // Generate creative combinations
    const title1 = emoji1Data.spanishTitle.toLowerCase();
    const title2 = emoji2Data.spanishTitle.toLowerCase();
    
    // Simple combination patterns
    const patterns = [
      `${title1} ${title2}`,
      `${title1} con ${title2}`,
      `${title2} ${title1}`,
      `Mezcla de ${title1} y ${title2}`
    ];

    // Return the shortest sensible combination
    return patterns
      .filter(p => p.length <= 50)
      .sort((a, b) => a.length - b.length)[0] || `${title1} + ${title2}`;
  }

  /**
   * Generate a Spanish description for the combination
   */
  static generateSpanishDescription(emoji1Data: SpanishEmojiData, emoji2Data: SpanishEmojiData): string {
    const culturalDesc = this.getCulturalCombinationDescription(emoji1Data.emoji, emoji2Data.emoji);
    if (culturalDesc) {
      return culturalDesc;
    }

    // Extract key themes from both emojis
    const tags1 = emoji1Data.spanishTags.slice(0, 2);
    const tags2 = emoji2Data.spanishTags.slice(0, 2);
    
    const themes = [...tags1, ...tags2].join(', ');
    
    return `Una combinación única que mezcla ${emoji1Data.spanishTitle.toLowerCase()} con ${emoji2Data.spanishTitle.toLowerCase()}. Perfecto para expresar ${themes}.`;
  }

  /**
   * Get predefined Spanish cultural combinations
   */
  private static getCulturalCombinationName(emoji1: string, emoji2: string): string | null {
    const combinations = this.getSpanishCulturalCombinations();
    const key1 = `${emoji1}${emoji2}`;
    const key2 = `${emoji2}${emoji1}`;
    
    return combinations[key1]?.name || combinations[key2]?.name || null;
  }

  private static getCulturalCombinationDescription(emoji1: string, emoji2: string): string | null {
    const combinations = this.getSpanishCulturalCombinations();
    const key1 = `${emoji1}${emoji2}`;
    const key2 = `${emoji2}${emoji1}`;
    
    return combinations[key1]?.description || combinations[key2]?.description || null;
  }

  /**
   * Spanish cultural emoji combinations
   */
  private static getSpanishCulturalCombinations(): Record<string, { name: string; description: string }> {
    return {
      '🥘❤️': {
        name: 'Amor por la paella',
        description: 'La pasión española por la gastronomía mediterránea. Un amor que se siente en cada grano de arroz.'
      },
      '😴☀️': {
        name: 'Siesta perfecta',
        description: 'El arte español del descanso bajo el sol. Una tradición que combina relajación y bienestar.'
      },
      '💃🌹': {
        name: 'Sevillana flamenca',
        description: 'La elegancia del flamenco andaluz. Pasión, arte y tradición en un solo gesto.'
      },
      '🍷🧀': {
        name: 'Tapeo tradicional',
        description: 'La cultura española del tapeo. Vino y queso para compartir entre amigos.'
      },
      '⚽🇪🇸': {
        name: 'Fútbol español',
        description: 'La pasión nacional por el fútbol. Desde La Liga hasta el Mundial, España late con cada gol.'
      },
      '🌊🏖️': {
        name: 'Costa mediterránea',
        description: 'Las hermosas playas españolas. Sol, arena y mar azul que enamoran a todos.'
      },
      '🎉🎊': {
        name: 'Fiesta española',
        description: 'La alegría de las celebraciones españolas. Desde las fallas hasta los sanfermines.'
      },
      '🔥🌶️': {
        name: 'Picante español',
        description: 'El sabor intenso de la cocina española. Pimentón, chorizo y sabores que encienden el paladar.'
      },
      '🏛️🎨': {
        name: 'Arte y cultura',
        description: 'La riqueza cultural española. Desde el Prado hasta la Sagrada Familia.'
      },
      '🌅🏔️': {
        name: 'Paisaje español',
        description: 'La diversidad geográfica de España. Desde los Pirineos hasta Andalucía.'
      }
    };
  }

  /**
   * Create a complete emoji mix object with improved error handling
   */
  static async createMix(
    emoji1Data: SpanishEmojiData, 
    emoji2Data: SpanishEmojiData, 
    size: number = 128
  ): Promise<EmojiMix | null> {
    try {
      // Simplified approach: just try to generate the URL directly
      const imageUrl = this.getMixUrl(emoji1Data.emoji, emoji2Data.emoji, size);
      
      if (!imageUrl) {
        return null;
      }

      return {
        emoji1: emoji1Data.emoji,
        emoji2: emoji2Data.emoji,
        emoji1Data,
        emoji2Data,
        imageUrl,
        spanishName: this.generateSpanishName(emoji1Data, emoji2Data),
        spanishDescription: this.generateSpanishDescription(emoji1Data, emoji2Data),
        timestamp: Date.now()
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a fallback visual mix using CSS (for when Emoji Kitchen doesn't have the combination)
   */
  static createFallbackMix(
    emoji1Data: SpanishEmojiData,
    emoji2Data: SpanishEmojiData
  ): EmojiMix {
    return {
      emoji1: emoji1Data.emoji,
      emoji2: emoji2Data.emoji,
      emoji1Data,
      emoji2Data,
      imageUrl: '', // No image URL for fallback
      spanishName: this.generateSpanishName(emoji1Data, emoji2Data),
      spanishDescription: this.generateSpanishDescription(emoji1Data, emoji2Data),
      timestamp: Date.now()
    };
  }

  /**
   * Filter emojis to only include ones that are supported by Emoji Kitchen
   */
  static filterMixerFriendlyEmojis(emojis: SpanishEmojiData[]): SpanishEmojiData[] {
    try {
      const supportedEmojis = emojiMixer.supportedEmojis;
      
      return emojis.filter(emoji => {
        try {
          const unicode = emojiMixer.toUnicode(emoji.emoji);
          return supportedEmojis.includes(unicode);
        } catch (error) {
          // If toUnicode fails, the emoji is likely not supported
          return false;
        }
      });
    } catch (error) {
      // Fallback: filter out known problematic categories
      return emojis.filter(emoji => {
        // Skip flags (group 9)
        if (emoji.group === 9) return false;
        
        // Skip skin tone modifiers (group 2)
        if (emoji.group === 2) return false;
        
        // Skip very new emojis that likely don't have combinations
        const veryNewEmojis = ['🫠', '🫡', '🫢', '🫣', '🫤', '🫥', '🫶'];
        if (veryNewEmojis.includes(emoji.emoji)) return false;
        
        return true;
      });
    }
  }

  /**
   * Get explanation for why a combination failed
   */
  static getFailureReason(emoji1: string, emoji2: string): string {
    try {
      const supportedEmojis = emojiMixer.supportedEmojis;
      const emoji1Unicode = emojiMixer.toUnicode(emoji1);
      const emoji2Unicode = emojiMixer.toUnicode(emoji2);
      
      const emoji1Supported = supportedEmojis.includes(emoji1Unicode);
      const emoji2Supported = supportedEmojis.includes(emoji2Unicode);
      
      if (!emoji1Supported && !emoji2Supported) {
        return `Ninguno de estos emojis (${emoji1} ${emoji2}) está disponible en Google Emoji Kitchen.`;
      } else if (!emoji1Supported) {
        return `El emoji ${emoji1} no está disponible en Google Emoji Kitchen.`;
      } else if (!emoji2Supported) {
        return `El emoji ${emoji2} no está disponible en Google Emoji Kitchen.`;
      } else {
        return `Aunque ambos emojis están disponibles individualmente (${emoji1} ${emoji2}), Google no ha creado una combinación específica para esta pareja.`;
      }
    } catch (error) {
      return `No se pudo verificar la disponibilidad de la combinación ${emoji1} + ${emoji2}.`;
    }
  }
}

/**
 * Client-side storage for recent mixes
 */
export class MixHistory {
  private static readonly STORAGE_KEY = 'buscaemojis-recent-mixes';
  private static readonly MAX_HISTORY = 50;

  static save(mix: EmojiMix): void {
    if (typeof window === 'undefined') return;
    
    const history = this.getHistory();
    
    // Remove if already exists to avoid duplicates
    const filtered = history.filter(
      h => !(h.emoji1 === mix.emoji1 && h.emoji2 === mix.emoji2)
    );
    
    // Add to beginning
    filtered.unshift(mix);
    
    // Keep only recent ones
    const updated = filtered.slice(0, this.MAX_HISTORY);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static getHistory(): EmojiMix[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getRecent(count: number = 10): EmojiMix[] {
    return this.getHistory().slice(0, count);
  }
}