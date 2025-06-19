const data = require('emojibase-data/en/data.json');

const spanishEnhancements = {
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

// Find all shrug emojis
const shrugEmojis = data.filter(e => e.emoji === '🤷' || e.emoji === '🤷‍♂️' || e.emoji === '🤷‍♀️');

console.log('=== Shrug emojis found ===');
shrugEmojis.forEach(emoji => {
  console.log(`Emoji: ${emoji.emoji}`);
  console.log(`Label: ${emoji.label}`);
  console.log(`Hexcode: ${emoji.hexcode}`);
  
  const enhancement = spanishEnhancements[emoji.emoji];
  if (enhancement) {
    console.log(`✅ Enhancement found!`);
    console.log(`Spanish title: ${enhancement.spanishTitle}`);
    console.log(`Spanish tags: ${enhancement.spanishTags.join(', ')}`);
  } else {
    console.log(`❌ No enhancement found`);
  }
  console.log('---');
});

// Test search functionality
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

console.log('\n=== Search test ===');
const enhanced = enhanceEmojiData();

// Test searches
const searchTerms = ['hombros', 'encogiendo', 'duda', 'no sé'];

searchTerms.forEach(term => {
  const matches = enhanced.filter(emoji => 
    emoji.spanishTags?.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
    emoji.spanishTitle?.toLowerCase().includes(term.toLowerCase()) ||
    emoji.spanishDescription?.toLowerCase().includes(term.toLowerCase()) ||
    emoji.aliases?.some(alias => alias.toLowerCase().includes(term.toLowerCase()))
  );
  
  console.log(`Search "${term}": ${matches.map(e => `${e.emoji} (${e.spanishTitle})`).join(', ')}`);
});