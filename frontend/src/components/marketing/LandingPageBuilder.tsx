'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  RocketLaunchIcon,
  BeakerIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  CogIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface LandingPage {
  id: number;
  name: string;
  slug: string;
  page_type: string;
  optimization_goal: string;
  status: 'draft' | 'published' | 'archived' | 'testing';
  views: number;
  conversions: number;
  conversion_rate: number;
  bounce_rate: number;
  ab_testing_enabled: boolean;
  mobile_optimized: boolean;
  page_speed_score: number;
  created_at: string;
  variants_count: number;
  is_testing: boolean;
}

interface PageSummary {
  total_pages: number;
  published_pages: number;
  testing_pages: number;
  total_views: number;
  total_conversions: number;
  average_conversion_rate: number;
  average_bounce_rate: number;
}

export default function LandingPageBuilder() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [summary, setSummary] = useState<PageSummary>({
    total_pages: 0,
    published_pages: 0,
    testing_pages: 0,
    total_views: 0,
    total_conversions: 0,
    average_conversion_rate: 0,
    average_bounce_rate: 0,
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In real implementation, these would be actual API calls
        // For now, using mock data
        const mockPages: LandingPage[] = [
          {
            id: 1,
            name: 'AI Consultation Landing Page',
            slug: 'ai-consultation',
            page_type: 'consultation_booking',
            optimization_goal: 'conversions',
            status: 'published',
            views: 2456,
            conversions: 89,
            conversion_rate: 3.6,
            bounce_rate: 45.2,
            ab_testing_enabled: true,
            mobile_optimized: true,
            page_speed_score: 92,
            created_at: '2024-01-15',
            variants_count: 3,
            is_testing: true,
          },
          {
            id: 2,
            name: 'Free AI Assessment',
            slug: 'free-ai-assessment',
            page_type: 'lead_capture',
            optimization_goal: 'email_signup',
            status: 'published',
            views: 1834,
            conversions: 156,
            conversion_rate: 8.5,
            bounce_rate: 38.7,
            ab_testing_enabled: false,
            mobile_optimized: true,
            page_speed_score: 87,
            created_at: '2024-01-20',
            variants_count: 1,
            is_testing: false,
          },
          {
            id: 3,
            name: 'Demo Request Page',
            slug: 'demo-request',
            page_type: 'demo_request',
            optimization_goal: 'form_completion',
            status: 'testing',
            views: 1245,
            conversions: 67,
            conversion_rate: 5.4,
            bounce_rate: 42.1,
            ab_testing_enabled: true,
            mobile_optimized: true,
            page_speed_score: 95,
            created_at: '2024-01-25',
            variants_count: 2,
            is_testing: true,
          },
          {
            id: 4,
            name: 'AI Implementation Pricing',
            slug: 'pricing',
            page_type: 'pricing',
            optimization_goal: 'conversions',
            status: 'draft',
            views: 0,
            conversions: 0,
            conversion_rate: 0,
            bounce_rate: 0,
            ab_testing_enabled: false,
            mobile_optimized: true,
            page_speed_score: 0,
            created_at: '2024-01-30',
            variants_count: 1,
            is_testing: false,
          },
        ];

        const mockSummary: PageSummary = {
          total_pages: mockPages.length,
          published_pages: mockPages.filter(p => p.status === 'published').length,
          testing_pages: mockPages.filter(p => p.is_testing).length,
          total_views: mockPages.reduce((sum, p) => sum + p.views, 0),
          total_conversions: mockPages.reduce((sum, p) => sum + p.conversions, 0),
          average_conversion_rate: mockPages.reduce((sum, p) => sum + p.conversion_rate, 0) / mockPages.length,
          average_bounce_rate: mockPages.reduce((sum, p) => sum + p.bounce_rate, 0) / mockPages.length,
        };

        setPages(mockPages);
        setSummary(mockSummary);
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTypeIcon = (type: string) => {
    switch (type) {
      case 'lead_capture': return <GlobeAltIcon className="h-4 w-4" />;
      case 'consultation_booking': return <RocketLaunchIcon className="h-4 w-4" />;
      case 'demo_request': return <EyeIcon className="h-4 w-4" />;
      case 'pricing': return <ChartBarIcon className="h-4 w-4" />;
      default: return <GlobeAltIcon className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handlePublishPage = async (pageId: number) => {
    try {
      // await marketingAPI.publishLandingPage(pageId);
      setPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, status: 'published' as const } : page
      ));
    } catch (error) {
      console.error('Error publishing page:', error);
    }
  };

  const handleDuplicatePage = async (pageId: number) => {
    try {
      // await marketingAPI.duplicateLandingPage(pageId);
      console.log(`Duplicating page ${pageId}`);
    } catch (error) {
      console.error('Error duplicating page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <GlobeAltIcon className="h-6 w-6 mr-2 text-blue-600" />
            Landing Page Builder
          </h2>
          <p className="text-gray-600">Create, optimize, and A/B test high-converting landing pages</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Page</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <GlobeAltIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_pages}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <CloudArrowUpIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{summary.published_pages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900">{summary.average_conversion_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">A/B Testing</p>
              <p className="text-2xl font-bold text-gray-900">{summary.testing_pages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'pages', label: 'Pages', icon: GlobeAltIcon },
            { id: 'templates', label: 'Templates', icon: SparklesIcon },
            { id: 'analytics', label: 'Analytics', icon: BeakerIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{summary.total_views.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{summary.total_conversions}</p>
                <p className="text-sm text-gray-600">Total Conversions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{summary.average_bounce_rate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Avg Bounce Rate</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <PlusIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Create New Page</p>
                  <p className="text-xs text-gray-500">Start with a template</p>
                </div>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
                <div className="text-center">
                  <BeakerIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Start A/B Test</p>
                  <p className="text-xs text-gray-500">Optimize conversion rate</p>
                </div>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                <div className="text-center">
                  <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">View Analytics</p>
                  <p className="text-xs text-gray-500">Detailed performance</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'pages' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Landing Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{page.name}</div>
                          <div className="text-sm text-gray-500">/{page.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        {getPageTypeIcon(page.page_type)}
                        <span className="ml-2 capitalize">{page.page_type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Views: {page.views.toLocaleString()}</div>
                        <div>Conv Rate: {page.conversion_rate.toFixed(1)}%</div>
                        <div className={`font-medium ${getPerformanceColor(page.page_speed_score)}`}>
                          Speed: {page.page_speed_score || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {page.ab_testing_enabled && (
                          <BeakerIcon className="h-4 w-4 text-blue-500" title="A/B Testing" />
                        )}
                        {page.mobile_optimized && (
                          <DevicePhoneMobileIcon className="h-4 w-4 text-green-500" title="Mobile Optimized" />
                        )}
                        {page.is_testing && (
                          <BoltIcon className="h-4 w-4 text-orange-500" title="Currently Testing" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Page">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit Page">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDuplicatePage(page.id)}
                          className="text-purple-600 hover:text-purple-900" 
                          title="Duplicate Page"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        {page.status === 'draft' && (
                          <button 
                            onClick={() => handlePublishPage(page.id)}
                            className="text-green-600 hover:text-green-900" 
                            title="Publish Page"
                          >
                            <CloudArrowUpIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-red-600 hover:text-red-900" title="Delete Page">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Page Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Lead Capture',
                description: 'High-converting lead capture with email signup',
                preview: '/templates/lead-capture.jpg',
                conversion_rate: '12.3%',
                features: ['Email form', 'Social proof', 'Mobile optimized']
              },
              {
                name: 'Consultation Booking',
                description: 'Schedule consultations with calendar integration',
                preview: '/templates/consultation.jpg',
                conversion_rate: '8.7%',
                features: ['Calendar widget', 'Form validation', 'Confirmation page']
              },
              {
                name: 'Demo Request',
                description: 'Request product demos with qualifying questions',
                preview: '/templates/demo.jpg',
                conversion_rate: '15.1%',
                features: ['Multi-step form', 'Progress bar', 'Qualifying questions']
              }
            ].map((template, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <GlobeAltIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-green-600">
                    {template.conversion_rate} conv. rate
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Popular
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                      {feature}
                    </div>
                  ))}
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">A/B Testing Results</h3>
            <div className="space-y-4">
              {pages.filter(p => p.is_testing).map((page) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{page.name}</h4>
                      <p className="text-sm text-gray-600">{page.variants_count} variants testing</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Testing
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current Leader</p>
                      <p className="font-medium">Variant B</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Improvement</p>
                      <p className="font-medium text-green-600">+23.4%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Confidence</p>
                      <p className="font-medium">87%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}