import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - BuscaEmojis',
  description: 'Términos y condiciones de uso del servicio de búsqueda de emojis en español BuscaEmojis.es',
  openGraph: {
    title: 'Términos y Condiciones - BuscaEmojis',
    description: 'Términos y condiciones de uso del servicio de búsqueda de emojis en español',
  },
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-slate-600 hover:text-slate-800 font-medium"
        >
          ← Volver al inicio
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar BuscaEmojis.es (el "Servicio"), usted acepta estar sujeto a estos Términos y Condiciones. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
            <p>
              Última actualización: <strong>Enero 2025</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Descripción del Servicio
            </h2>
            <p>
              BuscaEmojis.es es una herramienta gratuita que permite a los usuarios buscar emojis en español con 
              descripciones culturalmente relevantes, referencias españolas y la capacidad de copiar emojis al portapapeles.
            </p>
            <p>
              El servicio incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Búsqueda de emojis en español</li>
              <li>Navegación por categorías</li>
              <li>Información detallada de cada emoji</li>
              <li>Función de copia al portapapeles</li>
              <li>Historial de búsquedas (almacenado localmente)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Uso Aceptable
            </h2>
            <p>
              Al utilizar BuscaEmojis.es, usted se compromete a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar el servicio únicamente para fines legales y apropiados</li>
              <li>No intentar acceder a sistemas restringidos o vulnerabilidades</li>
              <li>No sobrecargar nuestros servidores con solicitudes automatizadas excesivas</li>
              <li>No copiar, distribuir o modificar el contenido del sitio sin autorización</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Propiedad Intelectual
            </h2>
            <p>
              Los emojis utilizados en este servicio están basados en el estándar Unicode y son de dominio público. 
              Las descripciones, traducciones y contenido original creado por BuscaEmojis.es están protegidos por 
              derechos de autor.
            </p>
            <p>
              Los usuarios pueden copiar y utilizar libremente los emojis para uso personal y comercial, ya que 
              forman parte del estándar Unicode.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Privacidad y Datos
            </h2>
            <p>
              BuscaEmojis.es respeta su privacidad:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>No recopilamos información personal identificable</li>
              <li>El historial de búsquedas se almacena únicamente en su dispositivo (localStorage)</li>
              <li>No compartimos datos con terceros</li>
              <li>Utilizamos cookies técnicas necesarias para el funcionamiento del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Limitación de Responsabilidad
            </h2>
            <p>
              BuscaEmojis.es se proporciona "tal como está". No garantizamos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Disponibilidad continua del servicio</li>
              <li>Exactitud absoluta de las descripciones o traducciones</li>
              <li>Compatibilidad con todos los dispositivos o navegadores</li>
            </ul>
            <p>
              En ningún caso seremos responsables de daños directos, indirectos, incidentales o consecuentes 
              derivados del uso del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Modificaciones del Servicio
            </h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar el servicio en cualquier momento 
              sin previo aviso. También podemos actualizar estos términos ocasionalmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Contacto
            </h2>
            <p>
              Para consultas sobre estos términos y condiciones, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: <strong>legal@buscaemojis.es</strong></li>
              <li>Sitio web: <strong>buscaemojis.es</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Ley Aplicable
            </h2>
            <p>
              Estos términos se rigen por las leyes de España. Cualquier disputa se resolverá en los tribunales 
              competentes de España.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              Estos términos y condiciones son efectivos a partir del 19 de enero de 2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}