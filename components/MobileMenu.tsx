'use client'

import { useState } from 'react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { href: "/categorias/caritas-y-emociones", emoji: "😀", name: "Caritas y emociones" },
    { href: "/categorias/personas-y-cuerpo", emoji: "👋", name: "Personas y cuerpo" },
    { href: "/categorias/animales-y-naturaleza", emoji: "🐱", name: "Animales y naturaleza" },
    { href: "/categorias/comida-y-bebida", emoji: "🍕", name: "Comida y bebida" },
    { href: "/categorias/viajes-y-lugares", emoji: "✈️", name: "Viajes y lugares" },
    { href: "/categorias/actividades", emoji: "⚽", name: "Actividades" },
    { href: "/categorias/objetos", emoji: "📱", name: "Objetos" },
    { href: "/categorias/simbolos", emoji: "❤️", name: "Símbolos" },
    { href: "/categorias/banderas", emoji: "🇪🇸", name: "Banderas" },
  ]

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-slate-600/75 rounded-md p-2 transition-colors"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Cerrar menú"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                  <a 
                    href="/" 
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-3">🏠</span>
                    Inicio
                  </a>
                  
                  <a 
                    href="/mezclar" 
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-3">🔀</span>
                    Mezclar
                  </a>

                  {/* Categories Section */}
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Categorías
                    </h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <a
                          key={category.href}
                          href={category.href}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-lg mr-3">{category.emoji}</span>
                          {category.name}
                        </a>
                      ))}
                      
                      <a
                        href="/categorias"
                        className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-gray-50 transition-colors mt-2 border-t border-gray-100 pt-3"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg mr-3">📋</span>
                        Ver todas las categorías
                      </a>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4">
                <a 
                  href="/terminos" 
                  className="block text-sm text-slate-600 hover:text-slate-800 font-medium underline"
                  onClick={() => setIsOpen(false)}
                >
                  Términos y Condiciones
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}