import type { NextConfig } from "next";

/**
 * Build target detection:
 *
 *  - ELECTRON_BUILD=true  → set during `npm run dist:*` scripts
 *    output: 'standalone' bundles .next/standalone/server.js so Electron
 *    can serve the app without a running dev server.
 *
 *  - Default (Vercel / `next dev` / `next start`) → no output override.
 *    Vercel handles bundling itself; 'standalone' would conflict.
 */
const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

const nextConfig: NextConfig = {
  ...(isElectronBuild ? { output: 'standalone' } : {}),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
