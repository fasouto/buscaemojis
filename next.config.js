/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14, no need for experimental flag
  async redirects() {
    return [
      {
        source: '/categorias/0',
        destination: '/categorias/caritas-y-emociones',
        permanent: true,
      },
      {
        source: '/categorias/1',
        destination: '/categorias/personas-y-cuerpo',
        permanent: true,
      },
      {
        source: '/categorias/2',
        destination: '/categorias/tonos-de-piel',
        permanent: true,
      },
      {
        source: '/categorias/3',
        destination: '/categorias/animales-y-naturaleza',
        permanent: true,
      },
      {
        source: '/categorias/4',
        destination: '/categorias/comida-y-bebida',
        permanent: true,
      },
      {
        source: '/categorias/5',
        destination: '/categorias/viajes-y-lugares',
        permanent: true,
      },
      {
        source: '/categorias/6',
        destination: '/categorias/actividades',
        permanent: true,
      },
      {
        source: '/categorias/7',
        destination: '/categorias/objetos',
        permanent: true,
      },
      {
        source: '/categorias/8',
        destination: '/categorias/simbolos',
        permanent: true,
      },
      {
        source: '/categorias/9',
        destination: '/categorias/banderas',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig