import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BuscaEmojis - Busca emojis en español',
    short_name: 'BuscaEmojis',
    description: 'La mejor herramienta para buscar emojis en español con referencias culturales, emociones y significados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#334155',
    theme_color: '#334155',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['utilities', 'lifestyle', 'education'],
    lang: 'es',
    scope: '/',
    orientation: 'portrait-primary',
  }
}