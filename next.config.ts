import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/hizmetler',
        destination: '/services',
      },
      {
        source: '/hizmetler/:id',
        destination: '/services/:id',
      },
      {
        source: '/projeler',
        destination: '/work',
      },
      {
        source: '/projeler/:slug',
        destination: '/work/:slug',
      },
      {
        source: '/gunlukler',
        destination: '/chronicles',
      },
      {
        source: '/gunlukler/:slug',
        destination: '/chronicles/:slug',
      },
      {
        source: '/atolye',
        destination: '/workshop',
      },
      {
        source: '/iletisim',
        destination: '/contact',
      },
      {
        source: '/ekip',
        destination: '/team',
      },
      {
        source: '/manifesto-tr',
        destination: '/manifesto',
      },
      {
        source: '/gizlilik',
        destination: '/privacy',
      },
      {
        source: '/sartlar',
        destination: '/terms',
      },
    ];
  },
};

export default nextConfig;
