import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PrepZero AI — Stealth Real-Time Interview & DSA Copilot',
    short_name: 'PrepZero AI',
    description:
      'Undetectable AI copilot for technical interviews, DSA rounds, and system design assessments with audio loopback and invisible screen OCR.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0E1A',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
