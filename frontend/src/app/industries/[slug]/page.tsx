'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePageSections } from '@/hooks/usePageSections';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CogIcon,
  RocketLaunchIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Industry metadata for each slug
const industries = {
  healthcare: {
    title: 'Healthcare & Life Sciences',
    subtitle: 'Transforming patient care through innovation',
    icon: '🏥',
    description: 'Revolutionize healthcare delivery with AI-powered solutions that improve patient outcomes, streamline operations, and advance medical research.'
  },
  financial: {
    title: 'Financial Services',
    subtitle: 'Modernizing finance with intelligent solutions',
    icon: '💰',
    description: 'Transform financial operations with cutting-edge AI solutions for fraud detection, risk management, and customer experience enhancement.'
  },
  manufacturing: {
    title: 'Manufacturing',
    subtitle: 'Driving efficiency through smart automation',
    icon: '🏭',
    description: 'Optimize production processes, reduce downtime, and enhance quality control with intelligent manufacturing solutions.'
  },
  retail: {
    title: 'Retail & E-commerce',
    subtitle: 'Enhancing customer experiences',
    icon: '🛒',
    description: 'Create personalized shopping experiences, optimize inventory, and boost sales with AI-driven retail solutions.'
  },
  technology: {
    title: 'Technology & Software',
    subtitle: 'Accelerating digital transformation',
    icon: '💻',
    description: 'Empower your technology initiatives with advanced AI integration, automation, and innovative software solutions.'
  },
  energy: {
    title: 'Energy & Utilities',
    subtitle: 'Powering sustainable futures',
    icon: '⚡',
    description: 'Drive sustainability and operational efficiency with smart energy management and predictive analytics solutions.'
  },
  government: {
    title: 'Government & Public Sector',
    subtitle: 'Modernizing public services',
    icon: '🏛️',
    description: 'Enhance citizen services, improve operational efficiency, and enable data-driven policy making with modern technology solutions.'
  }
};

export default function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { sections, loading } = usePageSections(`industries-${slug}`);
  const industry = industries[slug as keyof typeof industries];

  if (!industry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Industry Not Found</h1>
          <Link href="/industries" className="text-blue-600 hover:text-blue-800">
            Back to Industries
          </Link>
        </div>
      </div>
    );
  }

  // Get CMS content or use defaults
  const heroSection = sections.find(s => s.section_key === 'hero');
  const overviewSection = sections.find(s => s.section_key === 'overview');
  const challengesSection = sections.find(s => s.section_key === 'challenges');
  const solutionsSection = sections.find(s => s.section_key === 'solutions');
  const caseStudiesSection = sections.find(s => s.section_key === 'case_studies');
  const ctaSection = sections.find(s => s.section_key === 'cta');

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
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-6xl">{industry.icon}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              {heroSection?.content?.title || industry.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {heroSection?.content?.subtitle || industry.subtitle}
            </p>
            {(heroSection?.content?.description || industry.description) && (
              <p className="mt-4 text-base leading-7 text-slate-600 max-w-3xl mx-auto">
                {heroSection?.content?.description || industry.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">
              {overviewSection?.content?.title || 'Industry Overview'}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Comprehensive Solutions for Your Industry
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {overviewSection?.content?.description ||
               'Our comprehensive solutions are designed specifically for the unique challenges and opportunities in this industry.'}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {(overviewSection?.content?.benefits || [
                  'Increased operational efficiency',
                  'Enhanced customer experience',
                  'Data-driven decision making',
                  'Compliance and security'
                ]).map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-blue-900 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {challengesSection?.content?.title || 'Common Industry Challenges'}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Understanding the challenges you face
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {(challengesSection?.content?.challenges || [
              { title: 'Digital Transformation', description: 'Adapting to rapidly changing technology landscape' },
              { title: 'Regulatory Compliance', description: 'Meeting industry-specific regulations and standards' },
              { title: 'Customer Expectations', description: 'Delivering seamless, personalized experiences' }
            ]).map((challenge: any, index: number) => (
              <div key={index} className="flex flex-col rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{challenge.title}</h3>
                <p className="text-sm text-slate-600">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {solutionsSection?.content?.title || 'Our Solutions'}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {solutionsSection?.content?.description || 'Tailored solutions to drive your success'}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {(solutionsSection?.content?.solutions || [
              { title: 'Strategy & Consulting', description: 'Expert guidance to align technology with business objectives and create actionable roadmaps', icon: 'chart' },
              { title: 'Technology Implementation', description: 'End-to-end deployment of AI and automation solutions tailored to your needs', icon: 'cog' },
              { title: 'Innovation & R&D', description: 'Cutting-edge research and development to keep you ahead of the curve', icon: 'lightbulb' },
              { title: 'Training & Support', description: 'Comprehensive training programs and ongoing support to ensure success', icon: 'users' }
            ]).map((solution: any, index: number) => {
              const iconMap: Record<string, any> = {
                chart: ChartBarIcon,
                cog: CogIcon,
                lightbulb: LightBulbIcon,
                users: UserGroupIcon,
                shield: ShieldCheckIcon,
                rocket: RocketLaunchIcon,
              };
              const IconComponent = solution.icon ? iconMap[solution.icon] || CogIcon : CogIcon;

              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-start justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 mb-6">
                      <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold leading-6 text-slate-900">
                      {solution.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {solution.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-x-4">
                    <Link
                      href="/services"
                      className="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-800"
                    >
                      Learn more <span className="ml-1">→</span>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {sections.find(s => s.section_key === 'stats')?.content?.stats && (
        <section className="bg-blue-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-amber-400">
                {sections.find(s => s.section_key === 'stats')?.content?.subtitle || 'Impact'}
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {sections.find(s => s.section_key === 'stats')?.content?.title || 'Proven Results'}
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center md:grid-cols-2 lg:grid-cols-4">
              {sections.find(s => s.section_key === 'stats')?.content?.stats.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mx-auto flex max-w-xs flex-col gap-y-4"
                >
                  <dt className="text-base leading-7 text-blue-100">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Case Studies/Success Stories Section */}
      {sections.find(s => s.section_key === 'case_studies')?.content?.stories && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {sections.find(s => s.section_key === 'case_studies')?.content?.title || 'Success Stories'}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.find(s => s.section_key === 'case_studies')?.content?.description || 'See how we\'ve helped organizations like yours achieve their goals'}
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {sections.find(s => s.section_key === 'case_studies')?.content?.stories.map((story: any, index: number) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
                >
                  <div className="flex items-center gap-x-4 text-xs mb-4">
                    {story.tag && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {story.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {story.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    {story.description}
                  </p>
                  {story.results && (
                    <div className="mt-auto">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Results:</h4>
                      <ul className="space-y-2">
                        {story.results.map((result: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {story.link && (
                    <div className="mt-6">
                      <Link
                        href={story.link}
                        className="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-800"
                      >
                        Read full case study <span className="ml-1">→</span>
                      </Link>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {ctaSection?.content?.title || 'Ready to Transform Your Business?'}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {ctaSection?.content?.description ||
               'Let\'s discuss how we can help you achieve your goals in this industry.'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
              >
                Get Started
              </Link>
              <Link
                href="/book-consultation"
                className="text-base font-semibold text-blue-900 hover:text-blue-800"
              >
                Book Consultation <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
