# BuscaEmojis - Proyecto Español de Búsqueda de Emojis

## Descripción del Proyecto
BuscaEmojis es una aplicación web en español para buscar emojis con referencias culturales específicas de España y países hispanohablantes. Los usuarios pueden buscar emojis por significado, emociones, referencias culturales como "sevillana", "siesta", "paella", etc.

## Arquitectura Técnica
- **Framework**: Next.js 14 con App Router
- **Base de datos**: Emojibase con mejoras en español
- **Búsqueda**: Fuse.js para búsqueda difusa
- **Estilos**: Tailwind CSS
- **Tipado**: TypeScript

## Estructura del Proyecto
```
/app/                 # Next.js App Router
  /emoji/[hexcode]/   # Páginas individuales de emojis
  /grupos/           # Páginas de grupos de emojis
  layout.tsx         # Layout principal
  page.tsx          # Página de inicio
  globals.css       # Estilos globales

/components/         # Componentes React
  SearchBar.tsx     # Barra de búsqueda
  EmojiCard.tsx     # Tarjeta individual de emoji
  EmojiGrid.tsx     # Grid de emojis

/lib/               # Lógica de negocio
  emoji-data.ts     # Datos de emojis mejorados en español
  search.ts         # Funcionalidad de búsqueda
  types.ts         # Tipos TypeScript
```

## Características Implementadas
1. **Búsqueda multilingüe**: Busca por título, descripción, tags, referencias culturales
2. **Páginas individuales**: Cada emoji tiene su propia página con detalles completos
3. **Navegación por grupos**: Organizado por categorías (caritas, animales, comida, etc.)
4. **Copiar al portapapeles**: Un clic para copiar cualquier emoji
5. **Referencias culturales**: Términos específicos españoles como "sevillana", "siesta"
6. **Responsive**: Funciona en móvil, tablet y desktop
7. **SEO optimizado**: Meta tags y URLs amigables

## Comandos de Desarrollo
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # Linting
npm run typecheck  # Verificación de tipos
```

## Datos de Emoji
Los emojis base vienen de Emojibase y se mejoran con:
- Títulos en español
- Descripciones culturalmente relevantes
- Tags en español
- Referencias culturales específicas
- Aliases y nombres alternativos

## Mejoras Futuras Sugeridas
1. **Base de datos expandida**: Más referencias culturales por región
2. **Integración AI**: Script para generar automáticamente mejoras culturales
3. **Favoritos**: Sistema de emojis favoritos del usuario
4. **Compartir**: URLs para compartir emojis específicos
5. **PWA**: Convertir en Progressive Web App
6. **Analytics**: Tracking de búsquedas populares

## Deployment
Ver README.md para instrucciones detalladas de deployment en Vercel, Netlify, etc.