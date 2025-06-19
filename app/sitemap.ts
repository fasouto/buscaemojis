import { MetadataRoute } from 'next'
import { getEmojiGroups, enhanceEmojiData } from '@/lib/emoji-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category pages (using slugs)
  const groups = getEmojiGroups()
  const categoryPages: MetadataRoute.Sitemap = groups.map((group) => ({
    url: `${baseUrl}/categorias/${group.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Individual emoji pages (using slugs)
  const emojis = enhanceEmojiData()
  const emojiPages: MetadataRoute.Sitemap = emojis
    .filter(emoji => emoji.slug) // Only include emojis with valid slugs
    .slice(0, 1000) // Limit to first 1000 emojis to avoid huge sitemaps
    .map((emoji) => ({
      url: `${baseUrl}/emoji/${emoji.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...categoryPages, ...emojiPages]
}