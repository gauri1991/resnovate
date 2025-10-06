'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import { api } from '@/lib/api';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
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
}

const mockCaseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Healthcare AI Implementation at Seattle Medical',
    slug: 'healthcare-ai-implementation-seattle-medical',
    excerpt: 'Complete AI transformation of patient data analysis and diagnostic workflows, improving accuracy by 45% and reducing processing time.',
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
  },
  {
    id: 2,
    title: 'Financial Services ML Fraud Detection',
    slug: 'financial-services-ml-fraud-detection',
    excerpt: 'Advanced machine learning system for real-time fraud detection, reducing false positives by 60% and saving $2M annually.',
    status: 'published',
    client: 'Portland Credit Union',
    location: 'Portland, OR',
    budget: 85000,
    duration: '6 weeks',
    category: 'Machine Learning Implementation',
    completedAt: '2024-01-08',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-09',
    views: 2156,
    featuredImage: '/images/case-studies/fintech-ml-featured.jpg',
    beforeImage: '/images/case-studies/fintech-before.jpg',
    afterImage: '/images/case-studies/fintech-after.jpg',
  },
  {
    id: 3,
    title: 'Manufacturing Process Optimization with AI',
    slug: 'manufacturing-process-optimization-ai',
    excerpt: 'Intelligent automation and predictive maintenance system reducing downtime by 30% and increasing production efficiency.',
    status: 'draft',
    client: 'Pacific Manufacturing Corp',
    location: 'San Francisco, CA',
    budget: 180000,
    duration: '5 months',
    category: 'Process Automation',
    completedAt: '',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
    views: 0,
    featuredImage: '/images/case-studies/manufacturing-ai-featured.jpg',
    beforeImage: '/images/case-studies/manufacturing-before.jpg',
    afterImage: '/images/case-studies/manufacturing-after.jpg',
  },
  {
    id: 4,
    title: 'Retail Analytics & Customer Intelligence Platform',
    slug: 'retail-analytics-customer-intelligence',
    excerpt: 'Advanced AI-driven customer behavior analysis and inventory optimization, increasing sales by 25% and reducing waste by 40%.',
    status: 'published',
    client: 'Northwest Retail Group',
    location: 'Salem, OR',
    budget: 95000,
    duration: '4 months',
    category: 'Data Analytics & BI',
    completedAt: '2023-12-20',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-05',
    views: 3421,
    featuredImage: '/images/case-studies/retail-analytics-featured.jpg',
    beforeImage: '/images/case-studies/retail-before.jpg',
    afterImage: '/images/case-studies/retail-after.jpg',
  },
];

const categories = [
  'AI Strategy & Planning',
  'Machine Learning Implementation',
  'Process Automation',
  'Data Analytics & BI',
  'Custom AI Solutions',
  'AI Training & Change Management',
];

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get('/case-studies/');
      // setCaseStudies(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setCaseStudies(mockCaseStudies);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setLoading(false);
    }
  };

  const handleDeleteCaseStudy = async (caseStudyId: number) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      try {
        // await api.delete(`/case-studies/${caseStudyId}/`);
        setCaseStudies(caseStudies.filter(cs => cs.id !== caseStudyId));
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
    ];
    
    const colorIndex = categories.indexOf(category) % colors.length;
    const colorClass = colors[colorIndex];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  const filteredCaseStudies = selectedCategory
    ? caseStudies.filter(cs => cs.category === selectedCategory)
    : caseStudies;

  const columns = [
    {
      key: 'title',
      title: 'Case Study',
      sortable: true,
      render: (value: string, row: CaseStudy) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={row.featuredImage}
              alt={value}
              className="h-16 w-24 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-case-study.svg';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{value}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{row.excerpt}</div>
            <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
              <div className="flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {row.location}
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-3 w-3 mr-1" />
                {row.views.toLocaleString()} views
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      title: 'Client',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'budget',
      title: 'Budget',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">
            ${value.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (value: string) => getCategoryBadge(value),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'completedAt',
      title: 'Completed',
      sortable: true,
      render: (value: string, row: CaseStudy) => (
        <div className="text-sm text-gray-600">
          {value ? (
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {new Date(value).toLocaleDateString()}
            </div>
          ) : (
            <span className="text-gray-400">In Progress</span>
          )}
          <div className="text-xs text-gray-400 mt-1">{row.duration}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: CaseStudy) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/content/case-studies/${row.id}`}
            className="text-blue-600 hover:text-blue-700 p-1"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <Link
            href={`/case-studies/${row.slug}`}
            target="_blank"
            className="text-gray-600 hover:text-gray-700 p-1"
            title="View"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDeleteCaseStudy(row.id)}
            className="text-red-600 hover:text-red-700 p-1"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const totalBudget = caseStudies.reduce((sum, cs) => sum + cs.budget, 0);
  const avgBudget = caseStudies.length > 0 ? totalBudget / caseStudies.length : 0;
  const completedProjects = caseStudies.filter(cs => cs.completedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="mt-1 text-sm text-gray-600">
            Showcase your completed renovation projects
          </p>
        </div>
        <Link
          href="/admin/content/case-studies/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Case Study
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{caseStudies.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(avgBudget / 1000)}K
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCaseStudies}
        loading={loading}
        emptyMessage="No case studies found. Create your first case study to get started."
        onRowClick={(row) => {
          window.location.href = `/admin/content/case-studies/${row.id}`;
        }}
      />
    </div>
  );
}