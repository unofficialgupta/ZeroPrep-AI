import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'Guides & Resources | PrepZero AI Blog',
  description:
    'Free tutorials on setting up your free Google Gemini API key, BYOK AI tool economics, and acing technical coding interviews with undetectable AI copilots.',
  alternates: {
    canonical: 'https://www.prepzero.in/blog',
  },
  openGraph: {
    title: 'PrepZero AI Blog — Free Guides & Resources',
    description:
      'Tutorials on Google Gemini API keys, stealth interview best practices, and cracking DSA coding rounds.',
    url: 'https://www.prepzero.in/blog',
    siteName: 'PrepZero AI',
    images: [{ url: '/zeroprep-preview.jpg', width: 1200, height: 630, alt: 'PrepZero AI Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI Knowledge Base & Guides',
    description: 'Free tutorials on cracking technical interviews with undetectable AI copilots.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function BlogIndexPage() {
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
        name: 'Blog',
        item: 'https://www.prepzero.in/blog',
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Resources & Guides
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            ZeroPrep AI Knowledge Base
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Tutorials on setting up your free Gemini API key, understanding BYOK economics, and acing technical rounds.
          </p>
        </div>

        {/* Post Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read guide</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
