'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  DocumentTextIcon,
  CalendarIcon,
  CursorArrowRaysIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';
import { adminAPI } from '@/lib/api';

interface DashboardStats {
  totalLeads: number;
  totalPosts: number;
  totalConsultations: number;
  conversionRate: number;
  revenueGrowth: number;
  activeProjects: number;
  websiteViews: number;
  responseTime: string;
}

interface ChartData {
  monthlyPerformance: Array<{ month: string; leads: number; consultations: number; revenue: number }>;
  trafficSources: Array<{ name: string; value: number; color: string }>;
  recentActivity: Array<{ type: string; message: string; time: string; user?: string }>;
  leadPipeline: Array<{ status: string; count: number; value: number }>;
}

export default function AdminDashboard() {
  const [apiData, setApiData] = useState<any>({});
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalPosts: 0,
    totalConsultations: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    activeProjects: 0,
    websiteViews: 0,
    responseTime: '0h',
  });
  
  const [chartData, setChartData] = useState<ChartData>({
    monthlyPerformance: [],
    trafficSources: [],
    recentActivity: [],
    leadPipeline: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real dashboard stats from API
      const response = await adminAPI.getDashboardStats();
      const apiData = response.data;
      console.log('Dashboard API Data:', apiData); // Debug log
      setApiData(apiData); // Store for use in component
      
      // Map API data to dashboard stats
      setStats({
        totalLeads: apiData.total_leads || 0,
        totalPosts: apiData.total_posts || 0,
        totalConsultations: apiData.total_bookings || 0,
        conversionRate: apiData.total_leads > 0 ? ((apiData.total_bookings || 0) / apiData.total_leads * 100) : 0,
        revenueGrowth: apiData.revenue_growth || 0,
        activeProjects: apiData.total_case_studies || 0,
        websiteViews: apiData.website_views || 0,
        responseTime: `${apiData.avg_response_hours || 0}h`,
      });

      setChartData({
        monthlyPerformance: apiData.monthly_performance || [],
        trafficSources: apiData.traffic_sources || [],
        recentActivity: [
          ...apiData.recent_leads?.map((lead: any) => ({
            type: 'lead',
            message: `New lead: ${lead.name} from ${lead.company || 'Unknown Company'}`,
            time: new Date(lead.created_at).toLocaleString(),
            user: 'System'
          })) || [],
          ...apiData.recent_posts?.map((post: any) => ({
            type: 'post',
            message: `Blog post "${post.title}" published`,
            time: new Date(post.published_at).toLocaleString(),
            user: post.author__username || 'Admin'
          })) || [],
        ].slice(0, 5),
        leadPipeline: apiData.lead_stats?.map((stat: any) => ({
          status: stat.status,
          count: stat.count,
          value: stat.count * 4000 // Rough estimate for demo
        })) || [
          { status: 'New', count: 0, value: 0 },
        ],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Here's what's happening with your AI consulting business.
          </p>
        </div>
        <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
          <Link
            href="/admin/blog/edit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Blog Post
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UsersIcon className="h-4 w-4 mr-2" />
            View Leads
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          change={apiData.leads_trend || 0}
          changeType="increase"
          icon={<UsersIcon className="h-6 w-6" />}
          iconBgColor="bg-blue-500"
          description="Active prospects in pipeline"
          trend={[
            { month: 'Jan', value: 45 },
            { month: 'Feb', value: 52 },
            { month: 'Mar', value: 48 },
            { month: 'Apr', value: 61 },
            { month: 'May', value: 58 },
            { month: 'Jun', value: 67 },
          ]}
        />
        <StatsCard
          title="Blog Posts"
          value={stats.totalPosts}
          change={apiData.posts_trend || 0}
          changeType="increase"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          iconBgColor="bg-green-500"
          description="Published content pieces"
        />
        <StatsCard
          title="Consultations"
          value={stats.totalConsultations}
          change={apiData.consultations_trend || 0}
          changeType="increase"
          icon={<CalendarIcon className="h-6 w-6" />}
          iconBgColor="bg-orange-500"
          description="Booked this month"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change={apiData.conversion_trend || 0}
          changeType="increase"
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          iconBgColor="bg-purple-500"
          description="Lead to consultation rate"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue Growth"
          value={`+${stats.revenueGrowth}%`}
          change={stats.revenueGrowth}
          changeType="increase"
          icon={<CursorArrowRaysIcon className="h-6 w-6" />}
          iconBgColor="bg-emerald-500"
          description="Monthly recurring revenue"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          change={-2.1}
          changeType="decrease"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          iconBgColor="bg-cyan-500"
          description="Currently in progress"
        />
        <StatsCard
          title="Website Views"
          value={stats.websiteViews.toLocaleString()}
          change={23.8}
          changeType="increase"
          icon={<EyeIcon className="h-6 w-6" />}
          iconBgColor="bg-indigo-500"
          description="Monthly unique visitors"
        />
        <StatsCard
          title="Response Time"
          value={stats.responseTime}
          change={-15.2}
          changeType="increase"
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
          iconBgColor="bg-rose-500"
          description="Average lead response time"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Leads</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Consultations</span>
              </div>
            </div>
          </div>
          {chartData.monthlyPerformance.length === 0 || 
           chartData.monthlyPerformance.every(month => month.leads === 0 && month.consultations === 0) ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm">No data yet - charts will appear as leads and consultations are added</p>
              </div>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              />
              <Line
                type="monotone"
                dataKey="consultations"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          {chartData.trafficSources.length === 0 || 
           chartData.trafficSources.every(source => source.value === 0) ? (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <p className="text-sm">No traffic data yet - will show sources as leads are captured</p>
              </div>
            </div>
          ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Traffic']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {chartData.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="text-gray-600">{source.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </>
          )}
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow-sm rounded-xl border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link 
                href="/admin/activity" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {chartData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'lead' ? 'bg-green-400' :
                    activity.type === 'post' ? 'bg-blue-400' :
                    activity.type === 'consultation' ? 'bg-orange-400' :
                    'bg-purple-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{activity.time}</span>
                      {activity.user && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{activity.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lead Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow-sm rounded-xl border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
              <Link 
                href="/admin/leads" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage leads
              </Link>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.leadPipeline} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="status" 
                  stroke="#6b7280" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'count' ? `${value} leads` : `$${value.toLocaleString()}`,
                    name === 'count' ? 'Leads' : 'Value'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white shadow-sm rounded-xl border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Create Blog Post', href: '/admin/content/blog/new', icon: DocumentTextIcon, color: 'bg-blue-500' },
            { name: 'Add Case Study', href: '/admin/content/case-studies/new', icon: CursorArrowRaysIcon, color: 'bg-green-500' },
            { name: 'Schedule Consultation', href: '/admin/consultations/new', icon: CalendarIcon, color: 'bg-orange-500' },
            { name: 'View Analytics', href: '/admin/analytics', icon: EyeIcon, color: 'bg-purple-500' },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center justify-center p-6 text-center rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.name}</span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}