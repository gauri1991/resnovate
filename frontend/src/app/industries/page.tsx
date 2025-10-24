'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  BanknotesIcon,
  CogIcon,
  ShoppingCartIcon,
  ComputerDesktopIcon,
  BoltIcon,
  BuildingLibraryIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const industries = [
  {
    slug: 'healthcare',
    name: 'Healthcare & Life Sciences',
    icon: HeartIcon,
    description: 'Transforming patient care through innovation and technology',
    color: 'from-red-500 to-pink-500'
  },
  {
    slug: 'financial',
    name: 'Financial Services',
    icon: BanknotesIcon,
    description: 'Modernizing finance with intelligent solutions',
    color: 'from-green-500 to-emerald-500'
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    icon: CogIcon,
    description: 'Driving efficiency through smart automation',
    color: 'from-gray-500 to-slate-500'
  },
  {
    slug: 'retail',
    name: 'Retail & E-commerce',
    icon: ShoppingCartIcon,
    description: 'Enhancing customer experiences and operational efficiency',
    color: 'from-purple-500 to-violet-500'
  },
  {
    slug: 'technology',
    name: 'Technology & Software',
    icon: ComputerDesktopIcon,
    description: 'Accelerating digital transformation and innovation',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    slug: 'energy',
    name: 'Energy & Utilities',
    icon: BoltIcon,
    description: 'Powering sustainable futures with smart solutions',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    slug: 'government',
    name: 'Government & Public Sector',
    icon: BuildingLibraryIcon,
    description: 'Modernizing public services and citizen engagement',
    color: 'from-indigo-500 to-blue-500'
  }
];

export default function IndustriesPage() {
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
              Industries We Serve
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We deliver tailored AI and consulting solutions across diverse industries,
              helping organizations transform their operations and achieve their goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Industry Expertise</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Discover how we help organizations across different sectors leverage AI and technology
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <div className="mb-6">
                      <Icon className="h-8 w-8 text-blue-900" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{industry.name}</h3>
                    <p className="mt-4 text-sm text-slate-600">{industry.description}</p>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-800"
                    >
                      Learn more <span className="ml-1">→</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Don't See Your Industry?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We work with organizations across all sectors. Contact us to discuss
              how we can help your specific industry with our AI and consulting solutions.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
