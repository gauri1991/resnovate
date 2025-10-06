'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  client: string;
  location: string;
  budget: number;
  duration: string;
  category: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featuredImage: string;
  beforeImage: string;
  afterImage: string;
  tags: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
}

// Mock data for development
const mockCaseStudy: CaseStudy = {
  id: 1,
  title: 'Healthcare AI Implementation at Seattle Medical',
  slug: 'healthcare-ai-implementation-seattle-medical',
  excerpt: 'Complete AI transformation of patient data analysis and diagnostic workflows, improving accuracy by 45% and reducing processing time.',
  content: `
# Project Overview

This comprehensive AI implementation project transformed Seattle Medical Center's approach to patient data analysis and diagnostic workflows. Our team worked closely with healthcare professionals to develop and deploy custom AI solutions that significantly improved both accuracy and efficiency.

## The Challenge

Seattle Medical Center was facing several critical challenges:
- Manual data analysis processes taking 4-6 hours per patient
- Inconsistent diagnostic accuracy across different departments
- Limited ability to identify patterns in patient data
- Overwhelming administrative burden on medical staff

## Our Approach

We developed a comprehensive AI strategy that included:

### 1. Data Infrastructure Modernization
- Implemented secure, HIPAA-compliant data pipelines
- Created unified patient data models
- Established real-time data processing capabilities

### 2. Machine Learning Models
- Custom diagnostic assistance algorithms
- Predictive risk assessment models
- Natural language processing for medical records
- Computer vision for medical imaging analysis

### 3. User Interface Design
- Intuitive dashboard for medical staff
- Mobile-responsive design for on-the-go access
- Integration with existing hospital systems

## Implementation Process

The project was executed in four phases over 4 months:

**Phase 1: Discovery & Planning (4 weeks)**
- Stakeholder interviews and requirements gathering
- Technical architecture design
- Data audit and preparation
- Team training and onboarding

**Phase 2: Core Development (8 weeks)**
- AI model development and training
- Backend infrastructure setup
- Initial testing and validation
- Security and compliance review

**Phase 3: Integration & Testing (3 weeks)**
- System integration with existing hospital infrastructure
- User acceptance testing
- Performance optimization
- Staff training programs

**Phase 4: Deployment & Support (1 week)**
- Production deployment
- Go-live support
- Documentation and handover
- Ongoing monitoring setup

## Results Achieved

The implementation delivered exceptional results:

- **45% improvement** in diagnostic accuracy
- **75% reduction** in data processing time
- **60% decrease** in administrative workload
- **$500K annual savings** in operational costs
- **98% user satisfaction** rate among medical staff

## Technologies Used

- **Machine Learning**: TensorFlow, PyTorch, Scikit-learn
- **Data Processing**: Apache Spark, Pandas, NumPy
- **Backend**: Python, Django, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **Cloud Infrastructure**: AWS, Docker, Kubernetes
- **Security**: HIPAA compliance, end-to-end encryption

## Lessons Learned

This project highlighted several key insights:

1. **User-Centric Design**: Close collaboration with medical staff was crucial for adoption
2. **Gradual Implementation**: Phased rollout allowed for continuous feedback and improvement
3. **Data Quality**: Significant time investment in data cleaning paid dividends
4. **Change Management**: Comprehensive training programs were essential for success

## Future Opportunities

Based on the success of this implementation, Seattle Medical Center is exploring:
- Expansion to additional departments
- Integration with wearable devices and IoT sensors
- Advanced predictive analytics for patient outcomes
- AI-powered research and clinical trial optimization
  `,
  status: 'published',
  client: 'Seattle Medical Center',
  location: 'Seattle, WA',
  budget: 125000,
  duration: '4 months',
  category: 'AI Strategy & Planning',
  completedAt: '2024-01-15',
  createdAt: '2024-01-10',
  updatedAt: '2024-01-16',
  views: 1847,
  featuredImage: '/images/case-studies/healthcare-ai-featured.jpg',
  beforeImage: '/images/case-studies/healthcare-before.jpg',
  afterImage: '/images/case-studies/healthcare-after.jpg',
  tags: ['Healthcare', 'AI Implementation', 'Data Analytics', 'Machine Learning', 'HIPAA Compliance'],
  challenges: [
    'Legacy system integration complexity',
    'HIPAA compliance requirements',
    'Staff resistance to change',
    'Data quality and consistency issues',
    'Real-time processing requirements'
  ],
  solutions: [
    'Custom API middleware for legacy system integration',
    'End-to-end encryption and audit logging',
    'Comprehensive training and change management program',
    'Automated data cleaning and validation pipelines',
    'Scalable cloud infrastructure with auto-scaling'
  ],
  results: [
    '45% improvement in diagnostic accuracy',
    '75% reduction in data processing time',
    '60% decrease in administrative workload',
    '$500K annual operational cost savings',
    '98% user satisfaction rate'
  ]
};

export default function CaseStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudy();
  }, [params.id]);

  const fetchCaseStudy = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get(`/case-studies/${params.id}/`);
      // setCaseStudy(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setCaseStudy(mockCaseStudy);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching case study:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this case study?')) {
      try {
        // await api.delete(`/case-studies/${params.id}/`);
        router.push('/admin/content/case-studies');
      } catch (error) {
        console.error('Error deleting case study:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h2>
        <p className="text-gray-600 mb-6">The case study you're looking for doesn't exist.</p>
        <Link
          href="/admin/content/case-studies"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Case Studies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/content/case-studies"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{caseStudy.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              {getStatusBadge(caseStudy.status)}
              <span className="text-sm text-gray-500">
                Last updated {new Date(caseStudy.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/case-studies/${caseStudy.slug}`}
            target="_blank"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </Link>
          <Link
            href={`/admin/content/case-studies/${caseStudy.id}/edit`}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Case Study Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <img
              src={caseStudy.featuredImage}
              alt={caseStudy.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-case-study.svg';
              }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Study Content</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {caseStudy.content}
              </div>
            </div>
          </motion.div>

          {/* Before/After Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Before & After</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Before</h3>
                <img
                  src={caseStudy.beforeImage}
                  alt="Before"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-case-study.svg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">After</h3>
                <img
                  src={caseStudy.afterImage}
                  alt="After"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-case-study.svg';
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{caseStudy.client}</p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{caseStudy.location}</p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">${caseStudy.budget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Budget</p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{caseStudy.duration}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
              </div>
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{caseStudy.category}</p>
                  <p className="text-xs text-gray-500">Category</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {caseStudy.completedAt ? new Date(caseStudy.completedAt).toLocaleDateString() : 'In Progress'}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Results</h2>
            <div className="space-y-3">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-700">{result}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Views</span>
                <span className="text-sm font-medium text-gray-900">{caseStudy.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(caseStudy.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(caseStudy.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}