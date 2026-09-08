import React from 'react';

export default function StructuredData() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PrepZero AI',
      alternateName: ['Prep Zero', 'Prep Zero AI', 'ZeroPrep AI', 'PrepZero'],
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
      alternateName: ['Prep Zero', 'PrepZero', 'Prep Zero AI'],
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
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'PrepZero AI Home',
          item: 'https://www.prepzero.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Download',
          item: 'https://www.prepzero.in/download',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Pricing',
          item: 'https://www.prepzero.in/pricing',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'How It Works',
          item: 'https://www.prepzero.in/how-it-works',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Prep Zero AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prep Zero AI (PrepZero AI) is an undetectable real-time AI copilot for technical interviews, DSA coding rounds, and system design assessments. It runs as an invisible floating overlay on Zoom, Google Meet, and Microsoft Teams.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is PrepZero AI detectable on screen share?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. PrepZero AI uses a system-level window flag to exclude itself from screen capture, making it invisible on Zoom, Google Meet, and Microsoft Teams screen shares.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Prep Zero cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PrepZero AI uses a Bring Your Own Key (BYOK) model — you pay nothing to PrepZero. You only pay Google for API usage (Gemini 2.5 Flash), which costs approximately $0.001 per interview session.',
          },
        },
        {
          '@type': 'Question',
          name: 'What platforms does PrepZero work on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PrepZero AI works on macOS (Apple Silicon & Intel), Windows 10/11, and Linux. A web-based version is also available for instant use without installation.',
          },
        },
      ],
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
