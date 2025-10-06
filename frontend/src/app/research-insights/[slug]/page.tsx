'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import NewsletterForm from '../../../components/NewsletterForm';
import LeadCaptureForm from '../../../components/LeadCaptureForm';
import { contentAPI } from '../../../lib/api';
import { BlogPost } from '../../../types';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await contentAPI.getBlogPost(slug);
        setPost(response.data);
        
        // Fetch related posts (you might want to implement a related posts endpoint)
        const allPostsResponse = await contentAPI.getBlogPosts();
        const related = allPostsResponse.data
          .filter((p: BlogPost) => p.slug !== slug)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        setError('Failed to load the blog post.');
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <p className="text-slate-600 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/research-insights"
            className="inline-flex items-center rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Research Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back Navigation */}
      <div className="bg-slate-50 py-4">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link
            href="/research-insights"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Research Insights
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Meta Information */}
          <div className="flex items-center gap-x-4 text-sm text-slate-600 mb-6">
            <time dateTime={post.published_at}>
              <CalendarIcon className="mr-1 inline h-4 w-4" />
              {formatDate(post.published_at)}
            </time>
            {post.author_name && (
              <span>
                <UserIcon className="mr-1 inline h-4 w-4" />
                {post.author_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl leading-8 text-slate-600 mb-8">
            {post.excerpt}
          </p>

          {/* Tags and Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-slate-200">
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="h-4 w-4 text-slate-400" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {tag}
                  </span>
                ))}\n              </div>
            )}
            
            <button
              onClick={handleShare}
              className="inline-flex items-center rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <ShareIcon className="mr-2 h-4 w-4" />
              Share
            </button>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-2xl bg-slate-100 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Related Insights
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Explore more insights on similar topics
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-start"
                >
                  {relatedPost.featured_image && (
                    <div className="relative w-full">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                      />
                    </div>
                  )}
                  
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time dateTime={relatedPost.published_at} className="text-slate-500">
                        {formatDate(relatedPost.published_at)}
                      </time>
                    </div>
                    
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 group-hover:text-slate-600">
                        <Link href={`/research-insights/${relatedPost.slug}`}>
                          <span className="absolute inset-0" />
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter and CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Newsletter */}
            <div className="flex flex-col justify-center">
              <div className="rounded-lg bg-blue-50 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Get More Insights Like This
                </h3>
                <p className="text-slate-600 mb-6">
                  Subscribe to our newsletter for weekly research insights, market analysis, 
                  and industry trends delivered to your inbox.
                </p>
                <NewsletterForm
                  title=""
                  description=""
                  buttonText="Subscribe Now"
                  inline={true}
                />
              </div>
            </div>
            
            {/* CTA */}
            <div>
              <LeadCaptureForm
                title="Want to Discuss This Further?"
                description="Get personalized insights and recommendations from our experts. Schedule a free consultation to explore how these insights apply to your business."
                submitText="Schedule Consultation"
                source="blog_post"
                className="h-full flex flex-col justify-center"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}