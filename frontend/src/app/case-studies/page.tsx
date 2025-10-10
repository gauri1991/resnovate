'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../components/LeadCaptureForm';
import { contentAPI } from '../../lib/api';
import { CaseStudy } from '../../types';
import { useCMSContent } from '@/hooks/useCMSContent';

const industries = [
  'All Industries',
  'Residential',
  'Commercial',
  'Industrial',
  'Retail',
  'Hospitality',
  'Mixed-Use',
];

const iconMapping: Record<string, any> = {
  'Average ROI Improvement': ChartBarIcon,
  'Projects Completed': BuildingOfficeIcon,
  'Client Satisfaction': TrophyIcon,
};

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const { sections, loading } = useCMSContent('case_studies');

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await contentAPI.getCaseStudies();
        const studies = Array.isArray(response.data) ? response.data : [];
        setCaseStudies(studies);
        setFilteredStudies(studies);
      } catch (error) {
        console.error('Failed to fetch case studies:', error);
        setCaseStudies([]);
        setFilteredStudies([]);
      }
      setIsLoading(false);
    };

    fetchCaseStudies();
  }, []);

  useEffect(() => {
    if (!Array.isArray(caseStudies)) {
      setFilteredStudies([]);
      return;
    }

    if (selectedIndustry === 'All Industries') {
      setFilteredStudies(caseStudies);
    } else {
      setFilteredStudies(
        caseStudies.filter(study => 
          study.client_industry.toLowerCase().includes(selectedIndustry.toLowerCase())
        )
      );
    }
  }, [caseStudies, selectedIndustry]);

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
              {sections.header?.title || 'Success Stories'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {sections.header?.description || 'Discover how our AI-powered solutions have transformed real estate businesses across industries, delivering measurable results and competitive advantages.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">{sections.metrics?.subtitle || 'Proven Results'}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {sections.metrics?.title || 'Real Impact, Measurable Success'}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {sections.metrics_data?.metrics?.map((metric, index) => {
                const IconComponent = iconMapping[metric.label] || ChartBarIcon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-16 text-center lg:text-left"
                  >
                    <dt className="text-base font-semibold leading-7 text-slate-900">
                      <div className="absolute left-1/2 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 lg:left-0 transform -translate-x-1/2 lg:transform-none">
                        <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {metric.label}
                    </dt>
                    <dd className="mt-2 text-3xl font-bold text-blue-900 sm:text-4xl">
                      {metric.value}
                    </dd>
                  </motion.div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedIndustry === industry
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredStudies.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-shadow duration-300"
                >
                  {study.featured_image && (
                    <div className="mb-6">
                      <img
                        src={study.featured_image}
                        alt={study.title}
                        className="aspect-[16/9] w-full rounded-lg bg-slate-100 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <div className="mb-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {study.client_industry}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {study.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-4">
                      <strong>Client:</strong> {study.client_name}
                    </p>
                    
                    <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                      {study.challenge.substring(0, 150)}...
                    </p>
                    
                    {/* Key Metrics */}
                    {study.metrics && Object.keys(study.metrics).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Results:</h4>
                        <div className="space-y-1">
                          {Object.entries(study.metrics).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-semibold text-blue-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 transition-colors duration-200"
                  >
                    Read Full Story
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-24 w-24 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No case studies found</h3>
              <p className="mt-2 text-sm text-slate-500">
                No case studies match your current filter. Try selecting a different industry.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {sections.cta?.title || 'Ready to Create Your Own Success Story?'}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              {sections.cta?.description || 'Join our growing list of successful clients and discover how AI can transform your real estate business.'}
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl">
            <LeadCaptureForm
              title="Start Your Transformation"
              description="Get a free consultation and discover how we can help you achieve similar results."
              submitText="Get Started Today"
              source="case_studies"
              className="bg-white"
            />
          </div>
        </div>
      </section>
    </div>
  );
}