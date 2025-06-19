const data = require('emojibase-data/en/data.json');

// Find watermelon and monkey to check their groups
const watermelon = data.find(emoji => emoji.emoji === '🍉');
const monkey = data.find(emoji => emoji.emoji === '🐒');

console.log('Watermelon:', watermelon ? { emoji: watermelon.emoji, annotation: watermelon.annotation, group: watermelon.group } : 'Not found');
console.log('Monkey:', monkey ? { emoji: monkey.emoji, annotation: monkey.annotation, group: monkey.group } : 'Not found');

// Show all groups and their counts
const groupCounts = {};
const groupSamples = {};

data.forEach(emoji => {
  if (emoji.group !== undefined && emoji.group !== null) {
    if (!groupCounts[emoji.group]) {
      groupCounts[emoji.group] = 0;
      groupSamples[emoji.group] = [];
    }
    groupCounts[emoji.group]++;
    if (groupSamples[emoji.group].length < 5) {
      groupSamples[emoji.group].push({ emoji: emoji.emoji, annotation: emoji.annotation });
    }
  }
});

console.log('\nGroup breakdown:');
Object.keys(groupCounts).sort((a, b) => Number(a) - Number(b)).forEach(group => {
  console.log(`Group ${group}: ${groupCounts[group]} emojis`);
  console.log('  Samples:', groupSamples[group].map(e => `${e.emoji} (${e.annotation})`).join(', '));
  console.log('');
});

// Look for food items in wrong groups
console.log('Food items potentially in wrong groups:');
const foodKeywords = ['fruit', 'food', 'vegetable', 'meat', 'drink', 'beverage'];
data.forEach(emoji => {
  if (emoji.group !== 3 && emoji.annotation && foodKeywords.some(keyword => 
    emoji.annotation.toLowerCase().includes(keyword)
  )) {
    console.log(`${emoji.emoji} (${emoji.annotation}) - Group ${emoji.group}`);
  }
});

// Look for animals in wrong groups  
console.log('\nAnimal items potentially in wrong groups:');
const animalKeywords = ['animal', 'face', 'monkey', 'cat', 'dog', 'bird'];
data.forEach(emoji => {
  if (emoji.group !== 2 && emoji.annotation && animalKeywords.some(keyword => 
    emoji.annotation.toLowerCase().includes(keyword)
  )) {
    console.log(`${emoji.emoji} (${emoji.annotation}) - Group ${emoji.group}`);
  }
});