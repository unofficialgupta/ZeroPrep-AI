import React from 'react';

export default function StructuredData() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PrepZero AI',
      alternateName: ['ZeroPrep AI', 'PrepZero'],
      url: 'https://www.prepzero.in',
      logo: 'https://www.prepzero.in/favicon.svg',
      description:
        'PrepZero AI is the world’s leading undetectable AI copilot for technical interviews, DSA coding rounds, and system design assessments.',
      sameAs: [
        'https://github.com/unofficialgupta/ZeroPrep-AI',
        'https://twitter.com/prepzero_ai',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        url: 'https://www.prepzero.in/about',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PrepZero AI',
      alternateName: 'PrepZero',
      url: 'https://www.prepzero.in',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.prepzero.in/dashboard?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PrepZero AI',
      alternateName: 'ZeroPrep AI',
      operatingSystem: 'macOS, Windows, Linux, Web',
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Interview Preparation & Coding Assistant',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1480',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        'Invisible Floating Stealth HUD on Zoom, Google Meet & Teams',
        'Real-time dual-channel internal audio loopback capture',
        'Sub-800ms Gemini 2.5 Flash multimodal reasoning',
        'One-click Screen OCR for LeetCode, CoderPad & HackerRank',
        'Bring Your Own Key (BYOK) with $0 subscription costs',
      ],
      description:
        'Real-time undetectable AI copilot for technical interviews, DSA algorithms, and system design rounds. Invisible on screen share.',
    },
  ];

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
