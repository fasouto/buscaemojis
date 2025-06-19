# 🔍 BuscaEmojis

**La mejor herramienta para buscar emojis en español con referencias culturales**

BuscaEmojis es una aplicación web que permite buscar emojis usando términos en español, incluyendo referencias culturales específicas como "sevillana", "siesta", "paella" y expresiones típicas españolas.

## 🚀 Características

- **Búsqueda inteligente**: Busca por significado, emociones y referencias culturales
- **Contenido en español**: Todos los títulos, descripciones y tags en español
- **Referencias culturales**: Incluye términos específicos de España y Latinoamérica
- **Páginas individuales**: Cada emoji tiene su propia página con información completa
- **Navegación por grupos**: Explora emojis organizados por categorías
- **Copiar con un clic**: Copia cualquier emoji al portapapeles fácilmente
- **Responsive**: Funciona perfectamente en móvil, tablet y desktop
- **SEO optimizado**: URLs amigables y meta tags optimizados

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Emojibase** - Base de datos de emojis
- **Fuse.js** - Búsqueda difusa
- **Lucide React** - Iconos

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/buscaemojis.git
   cd buscaemojis
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Vercel (Recomendado)

1. **Deploy automático desde GitHub**
   - Conecta tu repositorio a Vercel
   - El deploy se hará automáticamente

2. **Deploy manual con Vercel CLI**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Netlify

1. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy con Netlify CLI**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=.next
   ```

### Servidor tradicional

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Inicia el servidor**
   ```bash
   npm start
   ```

## 🔧 Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # Linting con ESLint
npm run typecheck  # Verificación de tipos TypeScript
```

## 📁 Estructura del proyecto

```
buscaemojis/
├── app/                    # Next.js App Router
│   ├── emoji/[hexcode]/   # Páginas individuales de emojis
│   ├── grupos/            # Páginas de grupos
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página de inicio
│   └── globals.css       # Estilos globales
├── components/            # Componentes React
│   ├── EmojiCard.tsx     # Tarjeta de emoji
│   ├── EmojiGrid.tsx     # Grid de emojis
│   └── SearchBar.tsx     # Barra de búsqueda
├── lib/                  # Lógica de negocio
│   ├── emoji-data.ts     # Datos de emojis en español
│   ├── search.ts         # Funcionalidad de búsqueda
│   └── types.ts          # Tipos TypeScript
└── public/               # Archivos estáticos
```

## 🎯 Ejemplos de búsqueda

Prueba estos términos para ver la potencia del buscador:

- **Emociones**: "feliz", "triste", "enfadado", "enamorado"
- **Cultura española**: "sevillana", "siesta", "paella", "flamenco"  
- **Expresiones**: "estar como unas castañuelas", "mondarse de risa"
- **Comida**: "tortilla", "jamón", "gazpacho", "sangría"
- **Lugares**: "playa", "costa del sol", "andalucía"

## 🤝 Contribuir

1. **Fork el proyecto**
2. **Crea una rama para tu feature** (`git checkout -b feature/nueva-caracteristica`)
3. **Commit tus cambios** (`git commit -m 'Añadir nueva característica'`)
4. **Push a la rama** (`git push origin feature/nueva-caracteristica`)
5. **Abre un Pull Request**

## 📝 Añadir nuevos emojis españoles

Para añadir referencias culturales a más emojis, edita el archivo `lib/emoji-data.ts`:

```typescript
const spanishEnhancements: Record<string, Partial<SpanishEmojiData>> = {
  '🎭': {
    spanishTitle: 'Máscaras de teatro',
    spanishDescription: 'Máscaras representando drama y comedia',
    spanishTags: ['teatro', 'drama', 'comedia', 'actuación'],
    culturalReferences: ['teatro español', 'siglo de oro', 'lope de vega'],
    aliases: ['teatro', 'drama', 'actuación'],
  },
  // Más emojis...
};
```

## 🐛 Reportar problemas

Si encuentras algún problema o tienes sugerencias:

1. **Revisa los issues existentes** en GitHub
2. **Crea un nuevo issue** con una descripción detallada
3. **Incluye pasos para reproducir** el problema

## 📊 Variables de entorno

No se requieren variables de entorno para el funcionamiento básico. Para funcionalidades avanzadas:

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=tu-analytics-id
```

## 🔒 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Emojibase** por la excelente base de datos de emojis
- **Comunidad española** por las referencias culturales
- **Unicode Consortium** por el estándar de emojis

---

**¿Te gusta BuscaEmojis?** ⭐ ¡Dale una estrella al proyecto!

**¿Tienes ideas?** 💡 ¡Compártelas en los issues!

**¿Quieres contribuir?** 🤝 ¡Los PRs son bienvenidos!