import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export const metadata = {
  title: 'Guides & Resources | ZeroPrep AI Blog',
  description:
    'Free guides on Gemini API keys, BYOK AI tools, and cracking technical coding interviews with undetectable AI copilots.',
};

export default function BlogIndexPage() {
  return (
    <div className="py-16 sm:py-24">
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
