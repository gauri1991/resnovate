'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CogIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../components/LeadCaptureForm';
import NewsletterForm from '../components/NewsletterForm';
import { contentAPI } from '../lib/api';
import { BlogPost, CaseStudy } from '../types';
import { useCMSContent } from '@/hooks/useCMSContent';

const iconMapping: Record<string, any> = {
  'AI-Powered Analytics': ChartBarIcon,
  'Smart Automation': CogIcon,
  'Innovation Strategy': LightBulbIcon,
  'Risk Management': ShieldCheckIcon,
};

const testimonials = [
  {
    id: 1,
    body: 'Resnovate.ai transformed our approach to business operations. Their AI insights helped us identify optimization opportunities and streamline our processes, resulting in 40% higher efficiency.',
    author: {
      name: 'Sarah Chen',
      handle: 'sarah_chen',
      imageUrl: '/testimonial-1.jpg',
      logoUrl: '/company-1.png',
    },
  },
  {
    id: 2,
    body: 'The predictive analytics platform provided by Resnovate.ai gave us a significant competitive advantage. We can now forecast business trends and customer behavior with incredible accuracy.',
    author: {
      name: 'Michael Rodriguez',
      handle: 'mrodriguez',
      imageUrl: '/testimonial-2.jpg',
      logoUrl: '/company-2.png',
    },
  },
  {
    id: 3,
    body: 'Working with Resnovate.ai was game-changing for our enterprise transformation. Their innovative approach to AI implementation and process optimization exceeded our expectations.',
    author: {
      name: 'Jennifer Park',
      handle: 'jpark',
      imageUrl: '/testimonial-3.jpg',
      logoUrl: '/company-3.png',
    },
  },
];

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use CMS hook
  const { sections } = useCMSContent('homepage');
  const heroSection = sections.hero;
  const ctaSection = sections.cta;
  const testimonialsSection = sections.testimonials;
  const statsSection = sections.stats;
  const featuresSection = sections.features;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [postsResponse, caseStudiesResponse] = await Promise.all([
          contentAPI.getBlogPosts(),
          contentAPI.getCaseStudies(),
        ]);

        // Handle paginated response structure
        const posts = postsResponse.data.results || postsResponse.data;
        const caseStudies = caseStudiesResponse.data.results || caseStudiesResponse.data;

        // Ensure we have arrays before using array methods
        if (Array.isArray(posts)) {
          setRecentPosts(posts.slice(0, 3));
        }

        if (Array.isArray(caseStudies)) {
          setFeaturedCaseStudies(caseStudies.filter((cs: CaseStudy) => cs.is_featured).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        
        // Fallback to mock data for better presentation
        const mockPosts: BlogPost[] = [
          {
            id: 1,
            title: 'The Future of AI in Business Automation',
            slug: 'future-ai-business-automation',
            excerpt: 'Explore how artificial intelligence is revolutionizing business processes and driving unprecedented efficiency gains across industries.',
            published_at: new Date().toISOString(),
            author_name: 'Dr. Alex Chen',
            tags: ['AI', 'Automation', 'Business Strategy']
          },
          {
            id: 2,
            title: 'Machine Learning Implementation Best Practices',
            slug: 'ml-implementation-best-practices',
            excerpt: 'A comprehensive guide to successfully implementing machine learning solutions in enterprise environments.',
            published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            author_name: 'Sarah Rodriguez',
            tags: ['Machine Learning', 'Implementation', 'Enterprise']
          },
          {
            id: 3,
            title: 'Data Analytics Revolution: Turning Insights into Action',
            slug: 'data-analytics-revolution',
            excerpt: 'How modern businesses are leveraging advanced analytics to make data-driven decisions and gain competitive advantages.',
            published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            author_name: 'Michael Park',
            tags: ['Data Analytics', 'Business Intelligence', 'Strategy']
          }
        ];

        const mockCaseStudies: CaseStudy[] = [
          {
            id: 1,
            title: 'Healthcare AI Implementation at Seattle Medical',
            slug: 'healthcare-ai-implementation-seattle-medical',
            client_name: 'Seattle Medical Center',
            client_industry: 'Healthcare & Life Sciences',
            challenge: 'Seattle Medical Center was struggling with manual data analysis processes taking 4-6 hours per patient, inconsistent diagnostic accuracy across departments, and limited ability to identify patterns in complex medical data.',
            is_featured: true
          },
          {
            id: 2,
            title: 'Financial Services ML Fraud Detection',
            slug: 'financial-services-ml-fraud-detection',
            client_name: 'Portland Credit Union',
            client_industry: 'Financial Services',
            challenge: 'The financial institution needed a robust fraud detection system that could process thousands of transactions in real-time while minimizing false positives.',
            is_featured: true
          },
          {
            id: 3,
            title: 'Manufacturing Process Optimization with AI',
            slug: 'manufacturing-process-optimization-ai',
            client_name: 'Pacific Manufacturing Corp',
            client_industry: 'Manufacturing',
            challenge: 'The manufacturing company faced significant downtime issues, inefficient resource allocation, and needed predictive maintenance capabilities.',
            is_featured: true
          }
        ];

        setRecentPosts(mockPosts);
        setFeaturedCaseStudies(mockCaseStudies);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      {heroSection && (
        <section className="relative bg-gradient-primary">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {heroSection.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90">
                {heroSection.subtitle}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href={heroSection.cta_link || '/contact'}
                  className="btn-secondary rounded-md px-6 py-3 text-base font-semibold shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  {heroSection.cta_text}
                </Link>
                <Link
                  href="/case-studies"
                  className="flex items-center text-base font-semibold leading-6 text-white hover:text-amber-200 transition-colors duration-200"
                >
                  View Case Studies <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Floating elements for visual appeal */}
          <div className="absolute top-20 left-10 opacity-20">
            <div className="h-16 w-16 rounded-full bg-white animate-pulse"></div>
          </div>
          <div className="absolute top-40 right-16 opacity-15">
            <div className="h-12 w-12 rounded-full bg-amber-300 animate-bounce"></div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {statsSection && statsSection.stats && statsSection.stats.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {statsSection.stats.map((stat, index) => (
                <motion.div
                  key={stat.id || index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto flex max-w-xs flex-col gap-y-4"
                >
                  <dt className="text-base leading-7 text-slate-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-blue-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Features Section */}
      {featuresSection && (
        <section className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-900">{featuresSection.subtitle}</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {featuresSection.title}
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {featuresSection.description}
              </p>
            </div>

            {featuresSection.features && featuresSection.features.length > 0 && (
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                  {featuresSection.features.map((feature) => {
                    const IconComponent = iconMapping[feature.name] || ChartBarIcon;
                    return (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative pl-16"
                      >
                        <dt className="text-base font-semibold leading-7 text-slate-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900">
                            <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          {feature.name}
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-slate-600">{feature.description}</dd>
                      </motion.div>
                    );
                  })}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonialsSection && (
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-900">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {testimonialsSection.title}
              </p>
            </div>

            {(testimonialsSection.testimonials && testimonialsSection.testimonials.length > 0) && (
              <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {testimonialsSection.testimonials.map((testimonial: any) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col justify-between rounded-2xl bg-slate-50 p-8 shadow-lg"
                    >
                      <blockquote className="text-base leading-7 text-slate-700">
                        <p>"{testimonial.body || testimonial.quote || testimonial.text}"</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-300"></div>
                        <div>
                          <div className="font-semibold text-slate-900">{testimonial.author?.name || testimonial.name}</div>
                          <div className="text-sm leading-6 text-slate-600">{testimonial.author?.handle ? `@${testimonial.author.handle}` : (testimonial.title || testimonial.company)}</div>
                        </div>
                      </figcaption>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recent Content Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Latest Insights & Success Stories
            </h2>
            <p className="mt-2 text-lg leading-8 text-slate-600">
              Stay updated with the latest trends in AI innovation and learn from our client success stories.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Recent Blog Posts */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Research Insights</h3>
                <Link
                  href="/research-insights"
                  className="text-sm font-semibold text-blue-900 hover:text-blue-800"
                >
                  View all <ArrowRightIcon className="ml-1 h-4 w-4 inline" />
                </Link>
              </div>
              
              {isLoading ? (
                <div className="mt-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {recentPosts.map((post, index) => (
                    <motion.article 
                      key={post.id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <Link
                        href={`/research-insights/${post.slug}`}
                        className="block"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-900 transition-colors duration-200 mb-2">
                              {post.title}
                            </h4>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-slate-500">
                                <time>{new Date(post.published_at).toLocaleDateString()}</time>
                                {post.author_name && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{post.author_name}</span>
                                  </>
                                )}
                              </div>
                              <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center py-8 bg-white rounded-lg border border-slate-200">
                  <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
                    <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">No insights yet</h4>
                  <p className="text-sm text-slate-500 mb-4">Check back soon for the latest AI research and insights.</p>
                  <Link
                    href="/research-insights"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Explore research topics
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Featured Case Studies */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Success Stories</h3>
                <Link
                  href="/case-studies"
                  className="text-sm font-semibold text-blue-900 hover:text-blue-800"
                >
                  View all <ArrowRightIcon className="ml-1 h-4 w-4 inline" />
                </Link>
              </div>
              
              {isLoading ? (
                <div className="mt-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : featuredCaseStudies.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {featuredCaseStudies.map((caseStudy, index) => (
                    <motion.article 
                      key={caseStudy.id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <Link
                        href={`/case-studies/${caseStudy.slug}`}
                        className="block"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {caseStudy.client_industry}
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-900 transition-colors duration-200 mb-2">
                              {caseStudy.title}
                            </h4>
                            <p className="text-sm font-medium text-slate-700 mb-2">
                              {caseStudy.client_name}
                            </p>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                              {caseStudy.challenge.substring(0, 120)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-600 font-medium">View case study</span>
                              <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center py-8 bg-white rounded-lg border border-slate-200">
                  <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
                    <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Success stories coming soon</h4>
                  <p className="text-sm text-slate-500 mb-4">We're working on exciting case studies to share with you.</p>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all case studies
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {ctaSection && (
        <section className="bg-blue-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {ctaSection.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                {ctaSection.description}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Lead Capture Form */}
                <div>
                  <LeadCaptureForm
                    title="Start Your Transformation"
                    description="Get a free consultation and discover how AI can revolutionize your business operations."
                    submitText="Get Free Consultation"
                    source="homepage_cta"
                    className="bg-white"
                  />
                </div>

                {/* Newsletter Signup */}
                <div className="flex flex-col justify-center">
                  <div className="rounded-lg bg-blue-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Stay Ahead of the Curve
                    </h3>
                    <p className="text-blue-100 mb-6">
                      Get weekly insights on AI innovation, business transformation trends, and technology applications delivered to your inbox.
                    </p>
                    <NewsletterForm
                      title=""
                      description=""
                      buttonText="Subscribe"
                      className="text-white"
                      inline={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
