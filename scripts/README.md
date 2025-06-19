# 🤖 AI Enhancement Scripts

Scripts para mejorar automáticamente los datos de emojis con traducciones y referencias culturales españolas usando IA.

## 🚀 Configuración

### 1. Instalar dependencias
```bash
# El script usa fetch nativo de Node.js 18+
# No requiere dependencias adicionales
```

### 2. Configurar API Key
Elige uno de estos proveedores de IA:

#### Anthropic (Recomendado - Mejor para contexto cultural español)
```bash
export ANTHROPIC_API_KEY="tu-api-key-aqui"
```

#### OpenAI (Alternativa)
```bash
export OPENAI_API_KEY="tu-api-key-aqui"
```

## 📋 Uso Básico

### Procesar todos los emojis
```bash
node scripts/enhance-emojis.js
```

### Procesar con configuración personalizada
```bash
# Procesar solo 100 emojis, empezando desde el índice 50
START_INDEX=50 MAX_EMOJIS=100 node scripts/enhance-emojis.js

# Procesar en lotes más pequeños (5 por vez)
BATCH_SIZE=5 node scripts/enhance-emojis.js

# Empezar desde donde se quedó la última vez
START_INDEX=500 node scripts/enhance-emojis.js

# SOBRESCRIBIR emojis ya procesados (útil con prompts mejorados)
OVERWRITE=true node scripts/enhance-emojis.js

# Sobrescribir solo una muestra para probar
OVERWRITE=true MAX_EMOJIS=50 node scripts/enhance-emojis.js
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `ANTHROPIC_API_KEY` | API key de Anthropic (recomendado) | - |
| `OPENAI_API_KEY` | API key de OpenAI (alternativa) | - |
| `BATCH_SIZE` | Emojis por lote | 10 |
| `START_INDEX` | Índice para empezar | 0 |
| `MAX_EMOJIS` | Máximo emojis a procesar | Todos |
| `OVERWRITE` | Sobrescribir emojis existentes | false |

## 🔄 Modo Sobrescritura

Cuando mejoras el prompt y quieres regenerar emojis ya procesados:

```bash
# Sobrescribir todos los emojis existentes
npm run enhance:overwrite

# Sobrescribir solo una muestra para probar el nuevo prompt
npm run enhance:overwrite-sample

# Sobrescribir emojis específicos por rango
OVERWRITE=true START_INDEX=100 MAX_EMOJIS=50 node scripts/enhance-emojis.js
```

**⚠️ Importante**: El modo sobrescritura regenerará completamente los emojis seleccionados, perdiendo las mejoras anteriores.

## 📊 Lo que hace el script

Para cada emoji, la IA genera:

- **spanishTitle**: Título natural en español (máx. 30 caracteres)
- **spanishDescription**: Descripción completa sobre cuándo y cómo usarlo (máx. 150 caracteres)
- **spanishTags**: 6+ etiquetas variadas para búsqueda (emociones, contextos, sinónimos)
- **culturalReferences**: Referencias culturales solo si son muy relevantes
- **aliases**: 3+ nombres alternativos comunes

### Ejemplo de salida mejorada:
```json
{
  "😂": {
    "spanishTitle": "Cara llorando de risa",
    "spanishDescription": "Se usa cuando algo te parece extremadamente divertido o gracioso, expresando risa intensa hasta las lágrimas",
    "spanishTags": ["risa", "divertido", "gracioso", "humor", "carcajada", "llorar de risa"],
    "culturalReferences": ["mondarse de risa"],
    "aliases": ["risa", "muerto de risa", "carcajada"]
  }
}
```

## 🔄 Reanudar Proceso

El script guarda el progreso automáticamente en `lib/spanish-emoji-data.json`. Si se interrumpe:

1. **Ve cuántos ya están procesados**:
   ```bash
   node -e "console.log(Object.keys(require('./lib/spanish-emoji-data.json')).length)"
   ```

2. **Continúa desde donde se quedó**:
   ```bash
   START_INDEX=850 node scripts/enhance-emojis.js
   ```

## 📁 Integrar con la aplicación

Una vez generados los datos, actualiza `lib/emoji-data.ts`:

```typescript
// Importar los datos generados
import spanishEnhancements from './spanish-emoji-data.json';

export function enhanceEmojiData(): SpanishEmojiData[] {
  return data.map((emoji: any) => {
    // Usar datos generados por IA como fallback
    const aiEnhancement = spanishEnhancements[emoji.emoji] || {};
    const manualEnhancement = spanishEnhancements[emoji.emoji] || {};
    
    return {
      ...emoji,
      spanishTitle: manualEnhancement.spanishTitle || aiEnhancement.spanishTitle || emoji.annotation,
      spanishDescription: manualEnhancement.spanishDescription || aiEnhancement.spanishDescription || emoji.annotation,
      spanishTags: manualEnhancement.spanishTags || aiEnhancement.spanishTags || emoji.tags || [],
      culturalReferences: manualEnhancement.culturalReferences || aiEnhancement.culturalReferences || [],
      aliases: manualEnhancement.aliases || aiEnhancement.aliases || [],
      similarEmojis: manualEnhancement.similarEmojis || [],
    } as SpanishEmojiData;
  });
}
```

## 💰 Costos Estimados

### Anthropic (Claude 3.5 Sonnet) - Recomendado
- ~$0.006 por emoji (con descripciones más largas)
- 3,600 emojis ≈ $21.60
- **Mejor calidad, descripciones más útiles y naturales**

### OpenAI (GPT-3.5-turbo) - Alternativa
- ~$0.003 por emoji (con descripciones más largas)
- 3,600 emojis ≈ $10.80

## 🐛 Troubleshooting

### Error: "No AI provider API key found"
```bash
# Asegúrate de tener una API key configurada (Anthropic recomendado)
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Error: "Rate limit exceeded"
```bash
# Reduce el tamaño del lote y aumenta el delay
BATCH_SIZE=5 node scripts/enhance-emojis.js
```

### Mejorar calidad de traducciones
```bash
# Procesa menos emojis por vez para mejor calidad
BATCH_SIZE=3 node scripts/enhance-emojis.js
```

## 📈 Monitoreo

El script muestra progreso en tiempo real:
```
🚀 Starting enhancement of 3637 emojis
📊 Using ANTHROPIC API (Claude 3.5 Sonnet)
⚙️  Batch size: 10, Delay: 1000ms

📦 Processing batch 1/364
✅ Enhanced 😀 (grinning face)
✅ Enhanced 😃 (grinning face with big eyes)
⏭️  Skipping ❤️ (already enhanced)
💾 Saved 1253 enhancements
```