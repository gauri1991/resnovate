'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DocumentTextIcon,
  VideoCameraIcon,
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import NewsletterForm from '../../components/NewsletterForm';
import LeadCaptureForm from '../../components/LeadCaptureForm';

const resourceCategories = [
  {
    name: 'Industry Reports',
    description: 'Comprehensive analysis of AI adoption trends and market forecasts across industries',
    icon: ChartBarIcon,
    count: 15,
    color: 'blue',
  },
  {
    name: 'White Papers',
    description: 'In-depth research on AI implementation strategies and best practices',
    icon: DocumentTextIcon,
    count: 12,
    color: 'amber',
  },
  {
    name: 'Webinars',
    description: 'Educational sessions from AI experts and industry leaders',
    icon: VideoCameraIcon,
    count: 8,
    color: 'green',
  },
  {
    name: 'Case Studies',
    description: 'Real-world AI transformation success stories and implementation guides',
    icon: BookOpenIcon,
    count: 25,
    color: 'purple',
  },
];

const featuredResources = [
  {
    title: '2024 Enterprise AI Adoption Report',
    description: 'Comprehensive analysis of how AI is transforming business operations across different industries.',
    type: 'Industry Report',
    downloadUrl: '#',
    image: '/resources/ai-report-2024.jpg',
  },
  {
    title: 'AI Implementation Strategy Framework',
    description: 'Technical whitepaper on developing and executing successful AI transformation initiatives.',
    type: 'White Paper',
    downloadUrl: '#',
    image: '/resources/ai-framework.jpg',
  },
  {
    title: 'AI ROI Assessment Tool',
    description: 'Interactive calculator to evaluate potential returns on AI investments and implementations.',
    type: 'Tool',
    downloadUrl: '#',
    image: '/resources/ai-roi-calculator.jpg',
  },
  {
    title: 'Machine Learning Masterclass Series',
    description: 'Expert insights on implementing ML solutions for business process optimization.',
    type: 'Webinar',
    downloadUrl: '#',
    image: '/resources/ml-webinar-series.jpg',
  },
];

const tools = [
  {
    name: 'AI Readiness Assessment',
    description: 'Comprehensive evaluation toolkit to assess your organization\'s AI readiness',
    type: 'Assessment Tool',
    size: '2.5 MB',
  },
  {
    name: 'AI Implementation Checklist',
    description: 'Step-by-step guide for planning and executing AI projects',
    type: 'PDF Guide',
    size: '1.8 MB',
  },
  {
    name: 'AI ROI Calculator',
    description: 'Interactive calculator for estimating AI project returns and benefits',
    type: 'Web Tool',
    size: 'Online',
  },
  {
    name: 'Data Quality Auditor',
    description: 'AI-powered tool for evaluating data quality and ML-readiness',
    type: 'Web Tool',
    size: 'Online',
  },
];

export default function Resources() {
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
              <span className="text-gradient">Resources</span> & Tools
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Access our comprehensive library of industry reports, tools, and educational content 
              to accelerate your AI transformation journey and drive business innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Resource Library</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Succeed
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div>
                  <div className="mb-6">
                    <category.icon className={`h-8 w-8 text-${category.color}-600`} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                  <p className="mt-4 text-sm text-slate-600">{category.description}</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{category.count} resources</span>
                  <Link
                    href="#featured-resources"
                    className="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-800"
                  >
                    Browse <span className="ml-1">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section id="featured-resources" className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Resources
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our most popular and valuable resources to help you make informed decisions
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {featuredResources.map((resource, index) => (
              <motion.article
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-start justify-between rounded-2xl bg-white p-8 shadow-lg"
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {resource.type}
                  </span>
                </div>
                
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 group-hover:text-slate-600">
                    {resource.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {resource.description}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-x-4">
                  <a
                    href={resource.downloadUrl}
                    className="inline-flex items-center rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                  >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Calculators */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tools & Calculators
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Free tools and templates to help you assess AI readiness and make informed technology decisions
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <DocumentTextIcon className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{tool.name}</h3>
                    <p className="text-sm text-slate-500">{tool.description}</p>
                    <div className="mt-1 flex items-center text-xs text-slate-400">
                      <span>{tool.type}</span>
                      <span className="mx-2">•</span>
                      <span>{tool.size}</span>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
                  <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                  Get Tool
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-blue-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-amber-400">Learn & Grow</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Educational Resources
            </p>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Expand your knowledge with our comprehensive educational content library
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <AcademicCapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Online Courses
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Comprehensive courses on AI strategy, machine learning implementation, and digital transformation.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <VideoCameraIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Video Tutorials
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Step-by-step video guides on AI implementation, tool usage, and best practices.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <BookOpenIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Knowledge Base
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Extensive library of articles, guides, and FAQs covering all aspects of AI transformation.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Industry Reports
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Regular reports on AI trends, technology adoption, and industry transformation forecasts.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </section>

      {/* Newsletter and Contact CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Newsletter */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Stay Updated with New Resources
              </h3>
              <p className="text-slate-600 mb-6">
                Be the first to know when we publish new reports, tools, and educational content.
              </p>
              <NewsletterForm
                title=""
                description=""
                placeholder="Enter your email"
                buttonText="Subscribe for Updates"
                inline={true}
              />
            </div>
            
            {/* Custom Resource Request */}
            <div>
              <LeadCaptureForm
                title="Need Something Specific?"
                description="Can't find what you're looking for? Let us know what resources would be most valuable for your business."
                submitText="Request Resource"
                source="resources_page"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}