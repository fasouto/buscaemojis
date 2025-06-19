export interface EmojiData {
  emoji: string;
  hexcode: string;
  group: number;
  subgroup: number;
  annotation: string;
  tags: string[];
  version: number;
  skins?: EmojiData[];
}

export interface SpanishEmojiData extends EmojiData {
  spanishTitle: string;
  spanishDescription: string;
  spanishTags: string[];
  culturalReferences: string[];
  aliases: string[];
  similarEmojis: string[];
  slug: string;
}

export interface EmojiGroup {
  id: number;
  name: string;
  spanishName: string;
  slug: string;
  emojis: SpanishEmojiData[];
}

export interface SearchResult {
  emoji: SpanishEmojiData;
  score: number;
}