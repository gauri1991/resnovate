'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalLeads: number;
    consultations: number;
    conversionRate: number;
    revenue: number;
  };
  trends: {
    leads: { period: string; value: number }[];
    consultations: { period: string; value: number }[];
    revenue: { period: string; value: number }[];
  };
  topPages: { page: string; views: number; bounce_rate: number }[];
  leadSources: { source: string; count: number; percentage: number }[];
}

const mockAnalytics: AnalyticsData = {
  overview: {
    totalLeads: 1247,
    consultations: 89,
    conversionRate: 7.1,
    revenue: 284500,
  },
  trends: {
    leads: [
      { period: 'Jan', value: 145 },
      { period: 'Feb', value: 167 },
      { period: 'Mar', value: 189 },
      { period: 'Apr', value: 234 },
      { period: 'May', value: 198 },
      { period: 'Jun', value: 314 },
    ],
    consultations: [
      { period: 'Jan', value: 12 },
      { period: 'Feb', value: 15 },
      { period: 'Mar', value: 18 },
      { period: 'Apr', value: 22 },
      { period: 'May', value: 16 },
      { period: 'Jun', value: 26 },
    ],
    revenue: [
      { period: 'Jan', value: 45000 },
      { period: 'Feb', value: 52000 },
      { period: 'Mar', value: 48000 },
      { period: 'Apr', value: 67000 },
      { period: 'May', value: 59000 },
      { period: 'Jun', value: 78000 },
    ],
  },
  topPages: [
    { page: '/services', views: 15420, bounce_rate: 34.2 },
    { page: '/about', views: 12890, bounce_rate: 28.5 },
    { page: '/case-studies', views: 11340, bounce_rate: 22.8 },
    { page: '/contact', views: 9870, bounce_rate: 15.6 },
    { page: '/industries/healthcare', views: 8560, bounce_rate: 31.4 },
  ],
  leadSources: [
    { source: 'Organic Search', count: 487, percentage: 39.1 },
    { source: 'Direct', count: 312, percentage: 25.0 },
    { source: 'LinkedIn', count: 198, percentage: 15.9 },
    { source: 'Referral', count: 156, percentage: 12.5 },
    { source: 'Email Campaign', count: 94, percentage: 7.5 },
  ],
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track performance metrics and business insights
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <select
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analytics.overview.totalLeads)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      12.3%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Consultations</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analytics.overview.consultations)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      8.7%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {analytics.overview.conversionRate}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      <span className="sr-only">Decreased by</span>
                      2.1%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(analytics.overview.revenue)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      15.2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lead Generation Trends</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.trends.leads.map((item, index) => (
                <div key={item.period} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.period}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.value / Math.max(...analytics.trends.leads.map(l => l.value))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.trends.revenue.map((item, index) => (
                <div key={item.period} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.period}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(item.value / Math.max(...analytics.trends.revenue.map(r => r.value))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Pages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{page.page}</p>
                      <p className="text-xs text-gray-500">Bounce rate: {page.bounce_rate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(page.views)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lead Sources</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.leadSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{source.source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {source.count}
                    </span>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Key Performance Indicators</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">Avg. Session Duration</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">3m 42s</dd>
            </div>
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">Pages per Session</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">4.7</dd>
            </div>
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">Lead Quality Score</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">8.2/10</dd>
            </div>
            <div className="text-center">
              <dt className="text-sm font-medium text-gray-500">Client Retention</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">94%</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}