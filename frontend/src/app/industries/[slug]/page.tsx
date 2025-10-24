'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePageSections } from '@/hooks/usePageSections';
import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Industry metadata for each slug
const industries = {
  healthcare: {
    title: 'Healthcare & Life Sciences',
    subtitle: 'Transforming patient care through innovation',
    icon: '🏥'
  },
  financial: {
    title: 'Financial Services',
    subtitle: 'Modernizing finance with intelligent solutions',
    icon: '💰'
  },
  manufacturing: {
    title: 'Manufacturing',
    subtitle: 'Driving efficiency through smart automation',
    icon: '🏭'
  },
  retail: {
    title: 'Retail & E-commerce',
    subtitle: 'Enhancing customer experiences',
    icon: '🛒'
  },
  technology: {
    title: 'Technology & Software',
    subtitle: 'Accelerating digital transformation',
    icon: '💻'
  },
  energy: {
    title: 'Energy & Utilities',
    subtitle: 'Powering sustainable futures',
    icon: '⚡'
  },
  government: {
    title: 'Government & Public Sector',
    subtitle: 'Modernizing public services',
    icon: '🏛️'
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{industry.icon}</span>
            <div>
              <h1 className="text-5xl font-bold mb-2">
                {heroSection?.content?.title || industry.title}
              </h1>
              <p className="text-xl text-blue-100">
                {heroSection?.content?.subtitle || industry.subtitle}
              </p>
            </div>
          </div>
          <p className="text-lg text-blue-50 max-w-3xl">
            {heroSection?.content?.description ||
             'We help organizations in this industry leverage technology to achieve their business goals.'}
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {overviewSection?.content?.title || 'Industry Overview'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 leading-relaxed">
                {overviewSection?.content?.description ||
                 'Our comprehensive solutions are designed specifically for the unique challenges and opportunities in this industry.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {(overviewSection?.content?.benefits || [
                  'Increased operational efficiency',
                  'Enhanced customer experience',
                  'Data-driven decision making',
                  'Compliance and security'
                ]).map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {challengesSection?.content?.title || 'Common Challenges'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(challengesSection?.content?.challenges || [
              { title: 'Digital Transformation', description: 'Adapting to rapidly changing technology landscape' },
              { title: 'Regulatory Compliance', description: 'Meeting industry-specific regulations and standards' },
              { title: 'Customer Expectations', description: 'Delivering seamless, personalized experiences' }
            ]).map((challenge: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {solutionsSection?.content?.title || 'Our Solutions'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(solutionsSection?.content?.solutions || [
              { title: 'Consulting Services', description: 'Strategic guidance for digital transformation' },
              { title: 'Technology Implementation', description: 'End-to-end solution delivery' },
              { title: 'Managed Services', description: 'Ongoing support and optimization' },
              { title: 'Training & Support', description: 'Empowering your team for success' }
            ]).map((solution: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-xl mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <Link
                  href="/services"
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            {ctaSection?.content?.title || 'Ready to Transform Your Business?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {ctaSection?.content?.description ||
             'Let\'s discuss how we can help you achieve your goals in this industry.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/book-consultation"
              className="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
