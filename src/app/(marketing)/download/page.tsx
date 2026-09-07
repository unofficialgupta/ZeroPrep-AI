import React from 'react';
import type { Metadata } from 'next';
import DownloadClient from '@/components/marketing/DownloadClient';

export const metadata: Metadata = {
  title: 'Download PrepZero AI — macOS, Windows & Linux Desktop Installers',
  description:
    'Download PrepZero AI desktop application for macOS (Apple Silicon & Intel), Windows 10/11 (.exe), and Linux (.AppImage). Free BYOK stealth interview and DSA copilot.',
  alternates: {
    canonical: 'https://www.prepzero.in/download',
  },
  openGraph: {
    title: 'Download PrepZero AI Desktop App',
    description:
      'Direct free download for macOS, Windows & Linux. Zero subscriptions, undetectable on screen share, sub-second Gemini 2.5 Flash reasoning.',
    url: 'https://www.prepzero.in/download',
    siteName: 'PrepZero AI',
    images: [
      {
        url: '/zeroprep-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Download PrepZero AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download PrepZero AI Desktop App',
    description:
      'Direct free download for macOS (.dmg), Windows (.exe), and Linux (.AppImage). Setup in 2 minutes.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function DownloadPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.prepzero.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Download',
        item: 'https://www.prepzero.in/download',
      },
    ],
  };

  const softwareDownloadSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PrepZero AI Desktop App',
    operatingSystem: 'macOS, Windows, Linux',
    applicationCategory: 'DeveloperApplication',
    downloadUrl: 'https://www.prepzero.in/download',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareDownloadSchema) }}
      />
      <DownloadClient />
    </>
  );
}
