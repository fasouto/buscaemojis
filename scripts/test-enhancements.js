const data = require('emojibase-data/en/data.json');

const spanishEnhancements = {
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
  '💃': {
    spanishTitle: 'Mujer bailando',
    spanishDescription: 'Mujer bailando flamenco o sevillanas',
    spanishTags: ['baile', 'flamenco', 'sevillanas', 'danza'],
    culturalReferences: ['sevillana', 'flamenco', 'feria', 'andalucía'],
    aliases: ['bailar', 'sevillana', 'flamenco', 'danza'],
  },
};

// Test the enhancement logic
function testEnhancement() {
  const testEmojis = ['😀', '😂', '💃'];
  
  testEmojis.forEach(emojiChar => {
    const originalEmoji = data.find(e => e.emoji === emojiChar);
    const enhancement = spanishEnhancements[emojiChar];
    
    console.log(`\n=== Testing ${emojiChar} ===`);
    console.log('Original:', originalEmoji ? originalEmoji.label : 'Not found');
    console.log('Enhancement exists:', !!enhancement);
    
    if (enhancement) {
      console.log('Spanish title:', enhancement.spanishTitle);
      console.log('Spanish description:', enhancement.spanishDescription);
      console.log('Spanish tags:', enhancement.spanishTags);
    }
    
    // Simulate the enhancement logic
    if (originalEmoji) {
      const enhanced = {
        ...originalEmoji,
        annotation: originalEmoji.label || originalEmoji.annotation,
        spanishTitle: enhancement?.spanishTitle || originalEmoji.label || originalEmoji.annotation,
        spanishDescription: enhancement?.spanishDescription || originalEmoji.label || originalEmoji.annotation,
        spanishTags: enhancement?.spanishTags || originalEmoji.tags || [],
        culturalReferences: enhancement?.culturalReferences || [],
        aliases: enhancement?.aliases || [],
      };
      
      console.log('Enhanced result:');
      console.log('  Title:', enhanced.spanishTitle);
      console.log('  Description:', enhanced.spanishDescription);
      console.log('  Tags:', enhanced.spanishTags);
    }
  });
}

testEnhancement();