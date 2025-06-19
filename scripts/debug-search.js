// Debug script to test search functionality
const data = require('emojibase-data/en/data.json');

const spanishEnhancements = {
  '😀': {
    spanishTitle: 'Cara sonriente',
    spanishDescription: 'Una cara feliz con gran sonrisa mostrando los dientes',
    spanishTags: ['feliz', 'alegre', 'sonrisa', 'contento'],
    culturalReferences: ['buen rollo', 'estar como unas castañuelas'],
    aliases: ['sonrisa', 'felicidad', 'alegría'],
  },
  '💃': {
    spanishTitle: 'Mujer bailando',
    spanishDescription: 'Mujer bailando flamenco o sevillanas',
    spanishTags: ['baile', 'flamenco', 'sevillanas', 'danza'],
    culturalReferences: ['sevillana', 'flamenco', 'feria', 'andalucía'],
    aliases: ['bailar', 'sevillana', 'flamenco', 'danza'],
  },
};

// Simulate the enhance function
function enhanceEmojiData() {
  return data.map((emoji) => {
    const enhancement = spanishEnhancements[emoji.emoji] || {};
    
    return {
      ...emoji,
      annotation: emoji.label || emoji.annotation,
      spanishTitle: enhancement.spanishTitle || emoji.label || emoji.annotation,
      spanishDescription: enhancement.spanishDescription || emoji.label || emoji.annotation,
      spanishTags: enhancement.spanishTags || emoji.tags || [],
      culturalReferences: enhancement.culturalReferences || [],
      aliases: enhancement.aliases || [],
    };
  });
}

// Test search
console.log('=== Enhanced data test ===');
const enhanced = enhanceEmojiData();

// Find specific emojis
const happyFace = enhanced.find(e => e.emoji === '😀');
const dancer = enhanced.find(e => e.emoji === '💃');

console.log('😀 enhanced data:');
console.log('  Spanish title:', happyFace?.spanishTitle);
console.log('  Spanish tags:', happyFace?.spanishTags);

console.log('\n💃 enhanced data:');
console.log('  Spanish title:', dancer?.spanishTitle);
console.log('  Spanish tags:', dancer?.spanishTags);

// Test search by tag
console.log('\n=== Search test ===');
const searchTerm = 'feliz';
const matches = enhanced.filter(emoji => 
  emoji.spanishTags?.includes(searchTerm) ||
  emoji.spanishTitle?.toLowerCase().includes(searchTerm) ||
  emoji.spanishDescription?.toLowerCase().includes(searchTerm)
);

console.log(`Searching for "${searchTerm}":`, matches.map(e => `${e.emoji} (${e.spanishTitle})`));

// Test another search
const searchTerm2 = 'sevillana';
const matches2 = enhanced.filter(emoji => 
  emoji.spanishTags?.includes(searchTerm2) ||
  emoji.culturalReferences?.includes(searchTerm2) ||
  emoji.aliases?.includes(searchTerm2)
);

console.log(`Searching for "${searchTerm2}":`, matches2.map(e => `${e.emoji} (${e.spanishTitle})`));