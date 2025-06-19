#!/usr/bin/env node

/**
 * Clear search history helper
 * This can be run in the browser console to clear corrupted search history
 */

const clearSearchHistoryScript = `
// Clear BuscaEmojis search history
try {
  localStorage.removeItem('buscaemojis_search_history');
  console.log('✅ Search history cleared successfully!');
  console.log('🔄 Refresh the page to see the changes.');
} catch (error) {
  console.error('❌ Failed to clear search history:', error);
}
`;

console.log('🧹 Search History Cleaner for BuscaEmojis');
console.log('');
console.log('If you have corrupted search history (like "groendlandia", "groenland", etc.),');
console.log('run this script in your browser console:');
console.log('');
console.log('1. Open BuscaEmojis in your browser');
console.log('2. Press F12 to open Developer Tools');
console.log('3. Go to the Console tab');
console.log('4. Copy and paste this code:');
console.log('');
console.log(clearSearchHistoryScript);
console.log('');
console.log('The updated app will automatically filter out corrupted entries in the future.');