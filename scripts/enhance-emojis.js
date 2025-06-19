#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

/**
 * Script to enhance emoji data with Spanish translations using AI
 * 
 * Usage:
 * node scripts/enhance-emojis.js
 * 
 * Environment variables:
 * - OPENAI_API_KEY: Your OpenAI API key
 * - ANTHROPIC_API_KEY: Your Anthropic API key (alternative)
 * - BATCH_SIZE: Number of emojis to process at once (default: 10)
 * - START_INDEX: Index to start from (default: 0)
 * - MAX_EMOJIS: Maximum number of emojis to process (default: all)
 * - OVERWRITE: Set to 'true' to overwrite existing enhancements (default: false)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE) || 10,
  START_INDEX: parseInt(process.env.START_INDEX) || 0,
  MAX_EMOJIS: parseInt(process.env.MAX_EMOJIS) || Infinity,
  OUTPUT_FILE: path.join(__dirname, '../lib/spanish-emoji-data.json'),
  DELAY_MS: 1000, // Delay between API calls
  OVERWRITE: process.env.OVERWRITE === 'true', // Force overwrite existing enhancements
};

// AI Provider configuration
const AI_PROVIDERS = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022', // Best Anthropic model for this task
    maxTokens: 800, // Increased for longer descriptions and more tags
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    maxTokens: 800, // Increased for longer descriptions and more tags
  }
};

class EmojiEnhancer {
  constructor() {
    this.provider = this.selectProvider();
    this.enhancedData = {};
    this.processedCount = 0;
    this.loadExistingData();
  }

  selectProvider() {
    // Prefer Anthropic first (better for this task)
    if (AI_PROVIDERS.anthropic.apiKey) return 'anthropic';
    if (AI_PROVIDERS.openai.apiKey) return 'openai';
    throw new Error('No AI provider API key found. Set ANTHROPIC_API_KEY (recommended) or OPENAI_API_KEY');
  }

  loadExistingData() {
    try {
      if (fs.existsSync(CONFIG.OUTPUT_FILE)) {
        const data = fs.readFileSync(CONFIG.OUTPUT_FILE, 'utf8');
        this.enhancedData = JSON.parse(data);
        console.log(`📂 Loaded ${Object.keys(this.enhancedData).length} existing enhancements`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load existing data:', error.message);
    }
  }

  async enhanceEmoji(emoji) {
    // Skip if already enhanced (unless overwrite mode is enabled)
    if (this.enhancedData[emoji.emoji] && !CONFIG.OVERWRITE) {
      console.log(`⏭️  Skipping ${emoji.emoji} (already enhanced, use OVERWRITE=true to force)`);
      return this.enhancedData[emoji.emoji];
    }

    if (this.enhancedData[emoji.emoji] && CONFIG.OVERWRITE) {
      console.log(`🔄 Overwriting ${emoji.emoji} (overwrite mode enabled)`);
    }

    const prompt = this.createPrompt(emoji);
    
    try {
      const response = await this.callAI(prompt);
      const enhancement = this.parseResponse(response, emoji);
      
      // Store the enhancement
      this.enhancedData[emoji.emoji] = enhancement;
      this.processedCount++;
      
      console.log(`✅ Enhanced ${emoji.emoji} (${emoji.annotation})`);
      return enhancement;
      
    } catch (error) {
      console.error(`❌ Failed to enhance ${emoji.emoji}:`, error.message);
      return null;
    }
  }

  createPrompt(emoji) {
    return `Eres un español nativo que crea contenido sobre emojis. Piensa como un usuario español común buscaría y describiría este emoji, sin forzar demasiadas referencias culturales.

EMOJI: ${emoji.emoji}
NOMBRE EN INGLÉS: ${emoji.label || emoji.annotation || 'desconocido'}
TAGS ORIGINALES: ${emoji.tags ? emoji.tags.join(', ') : 'ninguno'}

TAREA: Busca en tu conocimiento sobre páginas de emojis populares (Emojipedia, Unicode.org, etc.) para inspirarte en las descripciones y tags que suelen usarse. Crea contenido natural en español.

Responde ÚNICAMENTE con un JSON válido:

{
  "spanishTitle": "Título natural en español (máximo 30 caracteres)",
  "spanishDescription": "Descripción completa y útil que explique cuándo y cómo se usa este emoji (máximo 150 caracteres)",
  "spanishTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "culturalReferences": ["referencia opcional si es muy relevante"],
  "aliases": ["sinónimo1", "sinónimo2", "sinónimo3"]
}

DIRECTRICES:
- DESCRIPCIÓN: Explica el significado, uso común, contexto emocional. Sé descriptivo pero natural.
- TAGS: Incluye 6 tags variados: emociones, sinónimos, contextos de uso, relacionados. Piensa qué palabras usaría un español para buscar esto.
- CULTURAL REFERENCES: Solo si es muy relevante (ej: paella, flamenco, siesta). Muchos emojis no necesitan referencias culturales.
- ALIASES: Formas alternativas comunes de llamar a este emoji en español.
- Usa lenguaje natural de España, no muy formal ni muy coloquial.
- Piensa en diferentes contextos: WhatsApp, redes sociales, trabajo, familia.

EJEMPLOS DE BUENAS DESCRIPCIONES:
- "Se usa para expresar alegría extrema o cuando algo te parece muy divertido"
- "Representa amor, cariño hacia alguien especial o algo que te gusta mucho"
- "Indica que estás durmiendo, tienes sueño o que algo es aburrido"

Responde SOLO el JSON, sin explicaciones.`;
  }

  async callAI(prompt) {
    const config = AI_PROVIDERS[this.provider];
    
    if (this.provider === 'openai') {
      return await this.callOpenAI(prompt, config);
    } else if (this.provider === 'anthropic') {
      return await this.callAnthropic(prompt, config);
    }
  }

  async callOpenAI(prompt, config) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: config.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(prompt, config) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  parseResponse(response, emoji) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const required = ['spanishTitle', 'spanishDescription', 'spanishTags'];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure arrays and validate lengths
      parsed.spanishTags = Array.isArray(parsed.spanishTags) ? parsed.spanishTags.slice(0, 8) : [];
      parsed.culturalReferences = Array.isArray(parsed.culturalReferences) ? parsed.culturalReferences.slice(0, 3) : [];
      parsed.aliases = Array.isArray(parsed.aliases) ? parsed.aliases.slice(0, 4) : [];

      // Validate text lengths
      if (parsed.spanishTitle.length > 35) {
        parsed.spanishTitle = parsed.spanishTitle.substring(0, 35);
      }
      if (parsed.spanishDescription.length > 160) {
        parsed.spanishDescription = parsed.spanishDescription.substring(0, 160);
      }

      return parsed;
      
    } catch (error) {
      console.warn(`⚠️  Parse error for ${emoji.emoji}, using fallback`);
      return this.createFallback(emoji);
    }
  }

  createFallback(emoji) {
    return {
      spanishTitle: emoji.annotation,
      spanishDescription: emoji.annotation,
      spanishTags: emoji.tags || [],
      culturalReferences: [],
      aliases: [],
    };
  }

  async processEmojis() {
    // Load emoji data
    const emojiData = require('emojibase-data/en/data.json');
    
    const emojisToProcess = emojiData
      .slice(CONFIG.START_INDEX, CONFIG.START_INDEX + CONFIG.MAX_EMOJIS)
      .slice(0, CONFIG.MAX_EMOJIS);

    console.log(`🚀 Starting enhancement of ${emojisToProcess.length} emojis`);
    console.log(`📊 Using ${this.provider.toUpperCase()} API`);
    console.log(`⚙️  Batch size: ${CONFIG.BATCH_SIZE}, Delay: ${CONFIG.DELAY_MS}ms`);
    console.log(`🔄 Overwrite mode: ${CONFIG.OVERWRITE ? 'ENABLED' : 'DISABLED'}`);

    // Process in batches
    for (let i = 0; i < emojisToProcess.length; i += CONFIG.BATCH_SIZE) {
      const batch = emojisToProcess.slice(i, i + CONFIG.BATCH_SIZE);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / CONFIG.BATCH_SIZE) + 1}/${Math.ceil(emojisToProcess.length / CONFIG.BATCH_SIZE)}`);
      
      // Process batch
      const promises = batch.map(emoji => this.enhanceEmoji(emoji));
      await Promise.allSettled(promises);
      
      // Save progress
      this.saveData();
      
      // Rate limiting delay
      if (i + CONFIG.BATCH_SIZE < emojisToProcess.length) {
        console.log(`⏱️  Waiting ${CONFIG.DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_MS));
      }
    }

    console.log(`\n🎉 Enhancement complete! Processed ${this.processedCount} new emojis`);
    console.log(`💾 Data saved to: ${CONFIG.OUTPUT_FILE}`);
  }

  saveData() {
    try {
      const json = JSON.stringify(this.enhancedData, null, 2);
      fs.writeFileSync(CONFIG.OUTPUT_FILE, json, 'utf8');
      console.log(`💾 Saved ${Object.keys(this.enhancedData).length} enhancements`);
    } catch (error) {
      console.error('❌ Failed to save data:', error.message);
    }
  }
}

// Run the script
async function main() {
  try {
    const enhancer = new EmojiEnhancer();
    await enhancer.processEmojis();
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}