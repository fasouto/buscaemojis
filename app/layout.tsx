import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'
import ConditionalNavbarSearch from '@/components/ConditionalNavbarSearch'
import MobileMenu from '@/components/MobileMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es'),
  title: 'BuscaEmojis - Busca emojis en español',
  description: 'La mejor herramienta para buscar emojis en español con referencias culturales, emociones y significados.',
  keywords: 'emoji, emojis, español, buscar, emociones, cultura, spain, castellano, emoticones, símbolos',
  authors: [{ name: 'BuscaEmojis' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'BuscaEmojis - Busca emojis en español',
    description: 'La mejor herramienta para buscar emojis en español con referencias culturales, emociones y significados.',
    url: 'https://buscaemojis.es',
    siteName: 'BuscaEmojis',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'BuscaEmojis - Busca emojis en español',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'BuscaEmojis - Busca emojis en español',
    description: 'La mejor herramienta para buscar emojis en español',
    images: ['/icon-512.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buscaemojis.es'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BuscaEmojis",
    "description": "La mejor herramienta para buscar emojis en español con referencias culturales, emociones y significados.",
    "url": baseUrl,
    "inLanguage": "es-ES",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BuscaEmojis",
      "url": baseUrl
    }
  }

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-full">
            {/* Header with brand color background */}
            <div className="bg-slate-700 pb-48">
              <nav className="border-b border-slate-500/25 bg-slate-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                      <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <span className="text-2xl">🔍</span>
                        <h1 className="ml-2 text-xl font-bold text-white">
                          BuscaEmojis
                        </h1>
                      </a>
                      
                      {/* Desktop Navigation */}
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          <a href="/" className="text-white hover:bg-slate-600/75 rounded-md px-3 py-2 text-sm font-medium">
                            Inicio
                          </a>
                          <a href="/mezclar" className="text-white hover:bg-slate-600/75 rounded-md px-3 py-2 text-sm font-medium flex items-center space-x-1">
                            <span>🔀</span>
                            <span>Mezclar</span>
                          </a>
                          <div className="relative group">
                            <button className="text-white hover:bg-slate-600/75 rounded-md px-3 py-2 text-sm font-medium flex items-center space-x-1">
                              <span>Categorías</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <div className="p-2">
                                <div className="space-y-1">
                                  <a href="/categorias/caritas-y-emociones" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">😀</span>
                                    <span className="text-sm font-medium text-gray-900">Caritas y emociones</span>
                                  </a>
                                  <a href="/categorias/personas-y-cuerpo" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">👋</span>
                                    <span className="text-sm font-medium text-gray-900">Personas y cuerpo</span>
                                  </a>
                                  <a href="/categorias/animales-y-naturaleza" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">🐱</span>
                                    <span className="text-sm font-medium text-gray-900">Animales y naturaleza</span>
                                  </a>
                                  <a href="/categorias/comida-y-bebida" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">🍕</span>
                                    <span className="text-sm font-medium text-gray-900">Comida y bebida</span>
                                  </a>
                                  <a href="/categorias/viajes-y-lugares" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">✈️</span>
                                    <span className="text-sm font-medium text-gray-900">Viajes y lugares</span>
                                  </a>
                                  <a href="/categorias/actividades" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">⚽</span>
                                    <span className="text-sm font-medium text-gray-900">Actividades</span>
                                  </a>
                                  <a href="/categorias/objetos" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">📱</span>
                                    <span className="text-sm font-medium text-gray-900">Objetos</span>
                                  </a>
                                  <a href="/categorias/simbolos" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">❤️</span>
                                    <span className="text-sm font-medium text-gray-900">Símbolos</span>
                                  </a>
                                  <a href="/categorias/banderas" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <span className="text-xl">🇪🇸</span>
                                    <span className="text-sm font-medium text-gray-900">Banderas</span>
                                  </a>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <a href="/categorias" className="block text-center text-sm text-slate-600 hover:text-slate-800 font-medium">
                                    Ver todas las categorías →
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search Bar and Mobile Menu */}
                    <div className="flex items-center space-x-2">
                      <ConditionalNavbarSearch />
                      <MobileMenu />
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Main Content with overlap */}
            <main className="-mt-48">
              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white shadow">
                  {children}
                </div>
              </div>
            </main>
          </div>
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600 space-y-2">
                <div>
                  <a 
                    href="/terminos" 
                    className="text-slate-600 hover:text-slate-800 text-sm font-medium underline"
                  >
                    Términos y Condiciones
                  </a>
                </div>
                <p>&copy; 2025 BuscaEmojis.es - Encuentra el emoji perfecto</p>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}