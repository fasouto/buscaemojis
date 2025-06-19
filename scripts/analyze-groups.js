const data = require('emojibase-data/en/data.json');

const groups = {};
data.forEach(e => { 
  if (e.group !== undefined) { 
    if (!groups[e.group]) groups[e.group] = []; 
    groups[e.group].push({emoji: e.emoji, label: e.label, tags: e.tags}); 
  } 
}); 

console.log('Emojibase Group Analysis:');
Object.keys(groups).sort((a,b) => Number(a) - Number(b)).forEach(g => { 
  console.log(`Group ${g}: ${groups[g].length} emojis`);
  console.log('  Examples:', groups[g].slice(0,5).map(e => `${e.emoji} (${e.label})`).join(', ')); 
  console.log('');
});

// Check specific emojis
console.log('Specific emoji analysis:');
const testEmojis = ['🍉', '🐒', '🐵', '🍎', '🌍', '😀', '🚗'];
testEmojis.forEach(emoji => {
  const found = data.find(e => e.emoji === emoji);
  if (found) {
    console.log(`${emoji} (${found.label}) - Group ${found.group}`);
  }
});