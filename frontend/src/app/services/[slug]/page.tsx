'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '@/components/LeadCaptureForm';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  basePrice: number;
  estimatedDuration: string;
  status: 'active' | 'inactive' | 'coming_soon';
  featured: boolean;
  icon: string;
  features: string[];
  benefits: string[];
  process: string[];
  deliverables: string[];
  targetAudience: string[];
  caseStudy?: {
    client: string;
    challenge: string;
    solution: string;
    result: string;
    metrics: { label: string; value: string }[];
  };
}

const mockServices: { [key: string]: Service } = {
  'ai-strategy-implementation': {
    id: 1,
    name: 'AI Strategy & Implementation',
    slug: 'ai-strategy-implementation',
    description: 'Comprehensive AI strategy development and implementation across your organization, including roadmap planning, technology selection, and pilot project execution. Our expert team works closely with your leadership to identify high-impact AI opportunities, develop a strategic roadmap, and guide your organization through successful AI adoption.',
    shortDescription: 'End-to-end AI strategy and implementation for business transformation',
    category: 'AI Strategy',
    basePrice: 85000,
    estimatedDuration: '12-16 weeks',
    status: 'active',
    featured: true,
    icon: '🧠',
    features: [
      'AI readiness assessment and current state analysis',
      'Strategic roadmap development with clear milestones',
      'Technology selection and architecture design',
      'Pilot project implementation and validation',
      'Change management and organizational alignment',
      'ROI measurement and optimization frameworks',
      'Risk assessment and mitigation strategies',
      'Stakeholder training and education programs'
    ],
    benefits: [
      'Accelerated time-to-value for AI initiatives',
      'Reduced implementation risks and costs',
      'Clear ROI tracking and measurement',
      'Organization-wide AI adoption readiness',
      'Competitive advantage through AI innovation',
      'Improved decision-making capabilities'
    ],
    process: [
      'Discovery and current state assessment',
      'AI opportunity identification and prioritization',
      'Strategic roadmap development',
      'Pilot project selection and planning',
      'Implementation and validation',
      'Scaling and optimization'
    ],
    deliverables: [
      'AI Readiness Assessment Report',
      'Strategic AI Roadmap with Timeline',
      'Technology Architecture Blueprint',
      'Pilot Project Implementation',
      'Change Management Plan',
      'ROI Measurement Framework',
      'Training Materials and Documentation'
    ],
    targetAudience: [
      'C-level executives and senior leadership',
      'IT directors and technology leaders',
      'Innovation managers and strategy teams',
      'Business unit leaders seeking AI transformation',
      'Organizations planning digital transformation'
    ],
    caseStudy: {
      client: 'Global Manufacturing Company',
      challenge: 'Needed to implement AI-driven predictive maintenance to reduce downtime and costs across 50+ facilities.',
      solution: 'Developed comprehensive AI strategy with phased implementation, starting with pilot facility and scaling across operations.',
      result: 'Achieved 40% reduction in unplanned downtime and $2.5M annual cost savings within 18 months.',
      metrics: [
        { label: 'Downtime Reduction', value: '40%' },
        { label: 'Cost Savings', value: '$2.5M' },
        { label: 'Implementation Time', value: '14 weeks' },
        { label: 'ROI', value: '350%' }
      ]
    }
  },
  'machine-learning-solutions': {
    id: 2,
    name: 'Machine Learning Solutions',
    slug: 'machine-learning-solutions',
    description: 'Custom machine learning model development, training, and deployment for predictive analytics, pattern recognition, and intelligent automation. Our data scientists and ML engineers build scalable, production-ready solutions tailored to your specific business needs and data characteristics.',
    shortDescription: 'Custom ML models for predictive analytics and intelligent automation',
    category: 'Machine Learning',
    basePrice: 65000,
    estimatedDuration: '8-12 weeks',
    status: 'active',
    featured: true,
    icon: '🤖',
    features: [
      'Custom model development and training',
      'Data preprocessing and feature engineering',
      'Model validation and performance optimization',
      'Production deployment and scaling',
      'Real-time prediction APIs',
      'Model monitoring and maintenance',
      'A/B testing and continuous improvement',
      'Integration with existing systems'
    ],
    benefits: [
      'Improved prediction accuracy and insights',
      'Automated decision-making capabilities',
      'Reduced manual processing time',
      'Better customer experiences',
      'Increased operational efficiency',
      'Data-driven business optimization'
    ],
    process: [
      'Data assessment and preparation',
      'Model architecture design',
      'Training and validation',
      'Performance optimization',
      'Deployment and integration',
      'Monitoring and maintenance'
    ],
    deliverables: [
      'Trained ML Models',
      'Model Documentation and Performance Reports',
      'Deployment Infrastructure',
      'API Endpoints and Integration Code',
      'Monitoring Dashboard',
      'Maintenance and Update Procedures'
    ],
    targetAudience: [
      'Data science teams and analysts',
      'Product managers seeking predictive capabilities',
      'Operations leaders focused on automation',
      'Financial services and fintech companies',
      'E-commerce and retail organizations'
    ]
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    
    // Simulate API call
    setTimeout(() => {
      const foundService = mockServices[slug];
      setService(foundService || null);
      setLoading(false);
    }, 500);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link
            href="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                href="/services"
                className="inline-flex items-center text-blue-200 hover:text-blue-100 mb-8"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
              
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{service.icon}</div>
                {service.featured && (
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-yellow-300">Featured Service</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                {service.name}
              </h1>
              
              <p className="text-xl leading-8 text-blue-100 mb-8">
                {service.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Starting at ${service.basePrice.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {service.estimatedDuration}
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {service.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                Service Overview
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features and Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">What's Included</h3>
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Key Benefits</h3>
              <ul className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRightIcon className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Process</h3>
            <div className="space-y-8">
              {service.process.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="text-lg text-gray-900">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Project Deliverables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.deliverables.map((deliverable, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-900">{deliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Case Study */}
      {service.caseStudy && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mx-auto max-w-4xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Success Story</h3>
              <div className="bg-blue-50 rounded-lg p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Client: {service.caseStudy.client}
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Challenge:</h5>
                    <p className="text-gray-700">{service.caseStudy.challenge}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Solution:</h5>
                    <p className="text-gray-700">{service.caseStudy.solution}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Result:</h5>
                    <p className="text-gray-700">{service.caseStudy.result}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {service.caseStudy.metrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Target Audience */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Who This Service Is For
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.targetAudience.map((audience, index) => (
                <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-900">{audience}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <LeadCaptureForm
                title="Ready to Get Started?"
                description={`Contact us to discuss how ${service.name} can transform your business.`}
                submitText="Request Consultation"
                source={`service_${service.slug}`}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}