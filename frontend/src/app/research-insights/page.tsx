'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import NewsletterForm from '../../components/NewsletterForm';
import { contentAPI } from '../../lib/api';
import { BlogPost } from '../../types';
import { useCMSContent } from '@/hooks/useCMSContent';

const categories = [
  'All',
  'AI Strategy & Planning',
  'Machine Learning',
  'Data Analytics',
  'Process Automation',
  'Industry Solutions',
  'Digital Transformation',
  'Technology Trends',
];

export default function ResearchInsights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { sections, loading } = useCMSContent('research_insights');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await contentAPI.getBlogPosts();
        const postsData = Array.isArray(response.data) ? response.data : 
                         (response.data.results && Array.isArray(response.data.results)) ? response.data.results : [];
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        // Set empty arrays on error
        setPosts([]);
        setFilteredPosts([]);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Ensure posts is an array before filtering
    if (!Array.isArray(posts)) {
      setFilteredPosts([]);
      return;
    }

    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => 
        post.tags && Array.isArray(post.tags) && 
        post.tags.some(tag => tag && tag.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.tags && Array.isArray(post.tags) && 
         post.tags.some(tag => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              {sections.header?.title || 'Research Insights'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {sections.header?.description || 'Stay ahead of the curve with our latest AI research, implementation guides, and industry insights. Discover trends, strategies, and innovations shaping the future of AI-driven business transformation.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">{sections.featured?.subtitle || 'Featured Topics'}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {sections.featured?.title || 'Explore Key Areas of Innovation'}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {sections.featured_topics_data?.topics?.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col justify-between rounded-2xl bg-slate-50 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{topic.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{topic.description}</p>
                </div>
                <div className="mt-6 flex items-center text-sm text-blue-900">
                  <span className="font-medium">{topic.posts} articles</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-start"
                >
                  {post.featured_image && (
                    <div className="relative w-full">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                      />
                    </div>
                  )}
                  
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time dateTime={post.published_at} className="text-slate-500">
                        <CalendarIcon className="mr-1 inline h-4 w-4" />
                        {formatDate(post.published_at)}
                      </time>
                      {post.author_name && (
                        <span className="text-slate-500">
                          <UserIcon className="mr-1 inline h-4 w-4" />
                          {post.author_name}
                        </span>
                      )}
                    </div>
                    
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 group-hover:text-slate-600">
                        <Link href={`/research-insights/${post.slug}`}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="mt-6 flex items-center gap-2 flex-wrap">
                        <TagIcon className="h-4 w-4 text-slate-400" />
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-slate-400">
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-slate-900">No insights found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Check back soon for new insights and analysis.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {sections.cta?.title || 'Stay Updated with Latest Insights'}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              {sections.cta?.description || 'Get our latest research insights and market analysis delivered to your inbox every week.'}
            </p>
          </div>
          
          <div className="mx-auto mt-12 max-w-md">
            <NewsletterForm
              title=""
              description=""
              placeholder="Enter your email"
              buttonText="Subscribe to Updates"
              className="text-white"
              inline={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
}