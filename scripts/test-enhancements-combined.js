const data = require('emojibase-data/en/data.json');

// Manual enhancements (from emoji-data.ts)
const manualEnhancements = {
  '😀': {
    spanishTitle: 'Cara sonriente',
    spanishDescription: 'Una cara feliz con gran sonrisa mostrando los dientes',
    spanishTags: ['feliz', 'alegre', 'sonrisa', 'contento'],
  },
  '🤷': {
    spanishTitle: 'Persona encogiendo hombros',
    spanishDescription: 'Expresa duda, desconocimiento o indiferencia ante una situación',
    spanishTags: ['no sé', 'duda', 'indiferente', 'hombros', 'encogiendo'],
  },
};

// AI enhancements
let aiEnhancements = {};
try {
  aiEnhancements = require('../lib/spanish-emoji-data.json');
} catch (error) {
  console.warn('AI enhancements not found');
}

console.log('=== Enhancement Test ===');
console.log('Manual enhancements:', Object.keys(manualEnhancements).length);
console.log('AI enhancements:', Object.keys(aiEnhancements).length);

// Test some specific emojis
const testEmojis = ['😀', '🤷', '📚', '🏠', '🍕'];

testEmojis.forEach(emoji => {
  const manual = manualEnhancements[emoji];
  const ai = aiEnhancements[emoji];
  const original = data.find(e => e.emoji === emoji);
  
  console.log(`\n=== ${emoji} ===`);
  console.log('Original:', original?.label);
  console.log('Manual:', manual ? 'YES' : 'NO');
  console.log('AI:', ai ? 'YES' : 'NO');
  
  // Show final result (manual takes priority)
  const finalTitle = manual?.spanishTitle || ai?.spanishTitle || original?.label;
  const finalTags = manual?.spanishTags || ai?.spanishTags || [];
  
  console.log('Final title:', finalTitle);
  console.log('Final tags:', finalTags.slice(0, 3).join(', '));
});

// Test search capabilities
console.log('\n=== Search Test ===');
const searchTerms = ['feliz', 'casa', 'comida'];

searchTerms.forEach(term => {
  let matches = 0;
  data.forEach(emoji => {
    const manual = manualEnhancements[emoji.emoji];
    const ai = aiEnhancements[emoji.emoji];
    
    const title = manual?.spanishTitle || ai?.spanishTitle || emoji.label || '';
    const tags = manual?.spanishTags || ai?.spanishTags || [];
    const description = manual?.spanishDescription || ai?.spanishDescription || '';
    
    if (title.toLowerCase().includes(term) || 
        tags.some(tag => tag.toLowerCase().includes(term)) ||
        description.toLowerCase().includes(term)) {
      matches++;
    }
  });
  
  console.log(`Search "${term}": ${matches} matches`);
});