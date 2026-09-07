import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Tag, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found | PrepZero AI' };

  const canonicalUrl = `https://www.prepzero.in/blog/${post.slug}`;

  return {
    title: `${post.title} | PrepZero AI`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | PrepZero AI`,
      description: post.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: '2026-09-01T00:00:00.000Z',
      authors: ['PrepZero AI Team'],
      siteName: 'PrepZero AI',
      images: [
        {
          url: '/zeroprep-preview.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | PrepZero AI`,
      description: post.description,
      images: ['/zeroprep-preview.jpg'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.prepzero.in/blog/${post.slug}`,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: 'PrepZero AI Team',
      url: 'https://www.prepzero.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PrepZero AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.prepzero.in/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.prepzero.in/blog/${post.slug}`,
    },
    datePublished: '2026-09-01T00:00:00.000Z',
    dateModified: new Date().toISOString(),
    image: 'https://www.prepzero.in/zeroprep-preview.jpg',
  };

  return (
    <article className="py-16 sm:py-20">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Resources</span>
        </Link>

        {/* Post Metadata */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
          <span>•</span>
          <span>{post.date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          {post.description}
        </p>

        {/* Markdown Rendered Content */}
        <div className="mt-10 border-t border-slate-200 pt-8 prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
          {post.content.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-bold text-slate-900 pt-4 pb-1">
                  {block.replace('### ', '')}
                </h3>
              );
            }
            if (block.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-base font-bold text-slate-900 pt-2 pb-1">
                  {block.replace('#### ', '')}
                </h4>
              );
            }
            if (block.startsWith('---')) {
              return <hr key={idx} className="border-slate-200 my-6" />;
            }
            return (
              <p key={idx} className="leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>

        {/* Download Callout in Article */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
          <h3 className="text-xl font-bold">Ready to pass your upcoming interviews?</h3>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Download the ZeroPrep AI desktop app with native audio loopback, stealth screen exclusion, and Google Gemini 2.5 Flash reasoning.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-blue-900 shadow-md hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Desktop App (.dmg / .exe)</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
