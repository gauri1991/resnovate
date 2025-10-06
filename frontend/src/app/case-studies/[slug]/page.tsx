'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../../components/LeadCaptureForm';
import { contentAPI } from '../../../lib/api';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  client_industry: string;
  challenge: string;
  solution: string;
  results: string;
  featured_image?: string;
  metrics: Record<string, string>;
}

// Mock data for development
const mockCaseStudies: Record<string, CaseStudy> = {
  'healthcare-ai-implementation-seattle-medical': {
    id: 1,
    title: 'Healthcare AI Implementation at Seattle Medical',
    slug: 'healthcare-ai-implementation-seattle-medical',
    client_name: 'Seattle Medical Center',
    client_industry: 'Healthcare & Life Sciences',
    challenge: 'Seattle Medical Center was struggling with manual data analysis processes taking 4-6 hours per patient, inconsistent diagnostic accuracy across departments, and limited ability to identify patterns in complex medical data. The overwhelming administrative burden on medical staff was reducing their ability to focus on patient care.',
    solution: 'Resnovate AI developed a comprehensive AI solution including custom diagnostic assistance algorithms, computer vision systems for medical imaging analysis, natural language processing for medical records, and predictive analytics for patient risk assessment. We implemented secure, HIPAA-compliant data pipelines and created unified patient data models across all departments.',
    results: 'The AI implementation delivered transformational results with a 45% improvement in diagnostic accuracy, 75% reduction in data processing time, 60% decrease in administrative workload, and $500,000 in annual operational cost savings. The system achieved 98% user satisfaction among medical staff and 100% HIPAA compliance.',
    featured_image: '/images/case-studies/healthcare-ai-featured.jpg',
    metrics: {
      'Diagnostic Accuracy': '+45%',
      'Processing Time': '-75%',
      'Cost Savings': '$500K',
      'User Satisfaction': '98%'
    }
  }
};

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [relatedStudies, setRelatedStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCaseStudy = async () => {
      try {
        // Try to fetch from API first
        try {
          const response = await contentAPI.getCaseStudy(slug);
          setCaseStudy(response.data);
          
          // Fetch related case studies
          const allStudiesResponse = await contentAPI.getCaseStudies();
          const related = allStudiesResponse.data
            .filter((cs: CaseStudy) => cs.slug !== slug)
            .slice(0, 3);
          setRelatedStudies(related);
        } catch (apiError) {
          // Fallback to mock data
          console.log('API not available, using mock data');
          const mockCaseStudy = mockCaseStudies[slug];
          if (mockCaseStudy) {
            setCaseStudy(mockCaseStudy);
            setRelatedStudies([]);
          } else {
            setError('Case study not found.');
          }
        }
      } catch (error) {
        console.error('Failed to fetch case study:', error);
        setError('Failed to load the case study.');
      }
      setIsLoading(false);
    };

    fetchCaseStudy();
  }, [slug]);

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

  if (error || !caseStudy) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {error || 'Case study not found'}
          </h1>
          <p className="text-slate-600 mb-8">
            The case study you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/case-studies"
            className="inline-flex items-center rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back Navigation */}
      <div className="bg-slate-50 py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Case Studies
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {caseStudy.client_industry}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
              {caseStudy.title}
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              <strong>Client:</strong> {caseStudy.client_name}
            </p>

            <div className="mb-12">
              <img
                src={caseStudy.featured_image || '/images/placeholder-case-study.svg'}
                alt={caseStudy.title}
                className="w-full rounded-2xl bg-slate-100 object-cover h-96"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-case-study.svg';
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      {caseStudy.metrics && Object.keys(caseStudy.metrics).length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Key Results</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(caseStudy.metrics).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 mb-4">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <dt className="text-sm font-medium text-slate-600 capitalize">
                      {key.replace('_', ' ')}
                    </dt>
                    <dd className="text-3xl font-bold text-blue-900 sm:text-4xl">
                      {value}
                    </dd>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Case Study Content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-16">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The Challenge</h2>
              <div className="prose prose-lg prose-slate max-w-none">
                <p>{caseStudy.challenge}</p>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Solution</h2>
              <div className="prose prose-lg prose-slate max-w-none">
                <p>{caseStudy.solution}</p>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Results & Impact</h2>
              <div className="prose prose-lg prose-slate max-w-none">
                <p>{caseStudy.results}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Related Success Stories
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Discover more client success stories
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {relatedStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
                >
                  <div>
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
                    
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {study.challenge.substring(0, 120)}...
                    </p>
                  </div>
                  
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-800"
                  >
                    Read more <span className="ml-1">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to Achieve Similar Results?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Let's discuss how we can help you overcome your challenges and achieve your goals.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl">
            <LeadCaptureForm
              title="Start Your Success Story"
              description="Get a free consultation to explore how our solutions can deliver similar results for your business."
              submitText="Get Free Consultation"
              source="case_study_page"
            />
          </div>
        </div>
      </section>
    </div>
  );
}