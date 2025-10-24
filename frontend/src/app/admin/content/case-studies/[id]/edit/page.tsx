'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import DynamicArrayField from '@/components/admin/DynamicArrayField';

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
  content: `# Project Overview

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

## Results Achieved

The implementation delivered exceptional results:

- **45% improvement** in diagnostic accuracy
- **75% reduction** in data processing time
- **60% decrease** in administrative workload
- **$500K annual savings** in operational costs
- **98% user satisfaction** rate among medical staff`,
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

const categories = [
  'AI Strategy & Planning',
  'Machine Learning Implementation',
  'Process Automation',
  'Data Analytics & BI',
  'Custom AI Solutions',
  'AI Training & Change Management',
];

// Zod validation schema
const caseStudySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title is too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(500, 'Excerpt is too long'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  status: z.enum(['draft', 'published', 'archived']),
  client: z.string().min(2, 'Client name is required'),
  location: z.string().min(2, 'Location is required'),
  budget: z.number().min(0, 'Budget cannot be negative'),
  duration: z.string().min(1, 'Duration is required'),
  category: z.string().min(1, 'Please select a category'),
  completedAt: z.string(),
  featuredImage: z.string().url('Must be a valid URL').or(z.literal('')),
  beforeImage: z.string().url('Must be a valid URL').or(z.literal('')),
  afterImage: z.string().url('Must be a valid URL').or(z.literal('')),
  tags: z.array(z.string()).min(1, 'Add at least one tag'),
  challenges: z.array(z.string()).min(1, 'Add at least one challenge'),
  solutions: z.array(z.string()).min(1, 'Add at least one solution'),
  results: z.array(z.string()).min(1, 'Add at least one result'),
});

type CaseStudyFormData = z.infer<typeof caseStudySchema>;

export default function EditCaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      client: '',
      location: '',
      budget: 0,
      duration: '',
      category: '',
      completedAt: '',
      featuredImage: '',
      beforeImage: '',
      afterImage: '',
      tags: [],
      challenges: [],
      solutions: [],
      results: [],
    },
  });

  const watchedTitle = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !post) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, post, setValue]);

  useEffect(() => {
    fetchCaseStudy();
  }, [params.id]);

  const fetchCaseStudy = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get(`/case-studies/${params.id}/`);
      // const data = response.data;

      // For now, use mock data
      setTimeout(() => {
        const data = { ...mockCaseStudy };
        setPost(data);

        // Populate form with case study data
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('excerpt', data.excerpt);
        setValue('content', data.content);
        setValue('status', data.status);
        setValue('client', data.client);
        setValue('location', data.location);
        setValue('budget', data.budget);
        setValue('duration', data.duration);
        setValue('category', data.category);
        setValue('completedAt', data.completedAt);
        setValue('featuredImage', data.featuredImage);
        setValue('beforeImage', data.beforeImage);
        setValue('afterImage', data.afterImage);
        setValue('tags', data.tags);
        setValue('challenges', data.challenges);
        setValue('solutions', data.solutions);
        setValue('results', data.results);

        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching case study:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: CaseStudyFormData) => {
    try {
      // In a real app, this would save to the API
      // await api.put(`/case-studies/${params.id}/`, data);
      console.log('Saving case study:', data);

      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/admin/content/case-studies/${params.id}`);
    } catch (error) {
      console.error('Error saving case study:', error);
    }
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

  if (!post && !loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h2>
        <p className="text-gray-600 mb-6">The case study you're trying to edit doesn't exist.</p>
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
            href={`/admin/content/case-studies/${params.id}`}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Case Study</h1>
            {post && (
              <p className="text-sm text-gray-600">
                Last updated {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/case-studies/${watch('slug')}`}
            target="_blank"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </Link>
          <button
            type="button"
            onClick={() => router.push(`/admin/content/case-studies/${params.id}`)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
            View
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Study Content (Markdown supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="Write your case study content in Markdown format..."
                />
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Before Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.beforeImage}
                    onChange={(e) => handleInputChange('beforeImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/before.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    After Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.afterImage}
                    onChange={(e) => handleInputChange('afterImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/after.jpg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Challenges, Solutions, Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Challenges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {challenge}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeChallenge(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newChallenge}
                      onChange={(e) => setNewChallenge(e.target.value)}
                      placeholder="Add challenge..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChallenge())}
                    />
                    <button
                      type="button"
                      onClick={addChallenge}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solutions
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.solutions.map((solution, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {solution}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSolution(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSolution}
                      onChange={(e) => setNewSolution(e.target.value)}
                      placeholder="Add solution..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSolution())}
                    />
                    <button
                      type="button"
                      onClick={addSolution}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.results.map((result, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {result}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeResult(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newResult}
                      onChange={(e) => setNewResult(e.target.value)}
                      placeholder="Add result..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResult())}
                    />
                    <button
                      type="button"
                      onClick={addResult}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Publishing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={formData.completedAt ? formData.completedAt.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('completedAt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 4 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-blue-600 hover:text-blue-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Save Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl border border-gray-100"
            >
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}