'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import { api } from '@/lib/api';

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
  displayOrder: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
  bookingsCount: number;
}

const mockServices: Service[] = [
  {
    id: 1,
    name: 'AI Strategy & Implementation',
    slug: 'ai-strategy-implementation',
    description: 'Comprehensive AI strategy development and implementation across your organization, including roadmap planning, technology selection, and pilot project execution.',
    shortDescription: 'End-to-end AI strategy and implementation for business transformation',
    category: 'AI Strategy',
    basePrice: 85000,
    estimatedDuration: '12-16 weeks',
    status: 'active',
    featured: true,
    displayOrder: 1,
    icon: '🧠',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    bookingsCount: 24,
  },
  {
    id: 2,
    name: 'Machine Learning Solutions',
    slug: 'machine-learning-solutions',
    description: 'Custom machine learning model development, training, and deployment for predictive analytics, pattern recognition, and intelligent automation.',
    shortDescription: 'Custom ML models for predictive analytics and intelligent automation',
    category: 'Machine Learning',
    basePrice: 65000,
    estimatedDuration: '8-12 weeks',
    status: 'active',
    featured: true,
    displayOrder: 2,
    icon: '🤖',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    bookingsCount: 18,
  },
  {
    id: 3,
    name: 'Data Analytics & Business Intelligence',
    slug: 'data-analytics-business-intelligence',
    description: 'Advanced data analytics platform development with real-time dashboards, reporting, and business intelligence insights.',
    shortDescription: 'Transform data into actionable business insights and intelligence',
    category: 'Data Analytics',
    basePrice: 45000,
    estimatedDuration: '6-10 weeks',
    status: 'active',
    featured: false,
    displayOrder: 3,
    icon: '📊',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    bookingsCount: 12,
  },
  {
    id: 4,
    name: 'Process Automation & RPA',
    slug: 'process-automation-rpa',
    description: 'Intelligent process automation using RPA, workflow optimization, and AI-powered decision making to streamline operations.',
    shortDescription: 'Automate repetitive processes with intelligent RPA solutions',
    category: 'Automation',
    basePrice: 35000,
    estimatedDuration: '4-8 weeks',
    status: 'active',
    featured: false,
    displayOrder: 4,
    icon: '⚙️',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08',
    bookingsCount: 8,
  },
  {
    id: 5,
    name: 'AI Training & Change Management',
    slug: 'ai-training-change-management',
    description: 'Comprehensive AI literacy training, change management, and organizational transformation to ensure successful AI adoption.',
    shortDescription: 'Prepare your team for AI transformation with training and support',
    category: 'Training',
    basePrice: 25000,
    estimatedDuration: '6-8 weeks',
    status: 'coming_soon',
    featured: false,
    displayOrder: 5,
    icon: '🎓',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
    bookingsCount: 0,
  },
  {
    id: 6,
    name: 'Custom AI Solutions Development',
    slug: 'custom-ai-solutions-development',
    description: 'Bespoke AI solution development tailored to your specific business needs, including natural language processing, computer vision, and specialized algorithms.',
    shortDescription: 'Custom-built AI solutions for unique business challenges',
    category: 'Custom Solutions',
    basePrice: 95000,
    estimatedDuration: '12-20 weeks',
    status: 'inactive',
    featured: false,
    displayOrder: 6,
    icon: '🔧',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-03',
    bookingsCount: 3,
  },
];

const categories = ['AI Strategy', 'Machine Learning', 'Data Analytics', 'Automation', 'Training', 'Custom Solutions', 'Consulting'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get('/services/');
      // setServices(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setServices(mockServices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        // await api.delete(`/services/${serviceId}/`);
        setServices(services.filter(service => service.id !== serviceId));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleToggleStatus = async (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    
    try {
      // await api.patch(`/services/${serviceId}/`, { status: newStatus });
      setServices(services.map(s => 
        s.id === serviceId ? { ...s, status: newStatus as any } : s
      ));
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const handleToggleFeatured = async (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      // await api.patch(`/services/${serviceId}/`, { featured: !service.featured });
      setServices(services.map(s => 
        s.id === serviceId ? { ...s, featured: !s.featured } : s
      ));
    } catch (error) {
      console.error('Error updating service featured status:', error);
    }
  };

  const handleReorder = async (serviceId: number, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === serviceId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= services.length) return;

    const reorderedServices = [...services];
    const [movedService] = reorderedServices.splice(currentIndex, 1);
    reorderedServices.splice(newIndex, 0, movedService);

    // Update display orders
    const updatedServices = reorderedServices.map((service, index) => ({
      ...service,
      displayOrder: index + 1,
    }));

    try {
      // await api.post('/services/reorder/', { services: updatedServices });
      setServices(updatedServices);
    } catch (error) {
      console.error('Error reordering services:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      coming_soon: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const statusLabels = {
      active: 'Active',
      inactive: 'Inactive',
      coming_soon: 'Coming Soon',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
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
      'bg-pink-100 text-pink-800',
    ];
    
    const colorIndex = categories.indexOf(category) % colors.length;
    const colorClass = colors[colorIndex];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  const sortedServices = filteredServices.sort((a, b) => a.displayOrder - b.displayOrder);

  const columns = [
    {
      key: 'displayOrder',
      title: 'Order',
      sortable: false,
      width: 'w-20',
      render: (value: number, row: Service) => (
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => handleReorder(row.id, 'up')}
            disabled={value === 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronUpIcon className="h-3 w-3" />
          </button>
          <span className="text-sm font-medium text-center">{value}</span>
          <button
            onClick={() => handleReorder(row.id, 'down')}
            disabled={value === services.length}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronDownIcon className="h-3 w-3" />
          </button>
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Service',
      sortable: true,
      render: (value: string, row: Service) => (
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{row.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 flex items-center">
              {value}
              {row.featured && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Featured
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{row.shortDescription}</div>
            <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
              <div className="flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {row.estimatedDuration}
              </div>
              <div className="flex items-center">
                <WrenchScrewdriverIcon className="h-3 w-3 mr-1" />
                {row.bookingsCount} bookings
              </div>
            </div>
          </div>
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
      key: 'basePrice',
      title: 'Base Price',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">
            {value.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string, row: Service) => (
        <div className="space-y-2">
          {getStatusBadge(value)}
          <div>
            <button
              onClick={() => handleToggleStatus(row.id)}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Toggle Status
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'featured',
      title: 'Featured',
      sortable: true,
      render: (value: boolean, row: Service) => (
        <div className="space-y-2">
          <div className={`text-sm ${value ? 'text-yellow-600' : 'text-gray-400'}`}>
            {value ? '⭐ Yes' : '☆ No'}
          </div>
          <div>
            <button
              onClick={() => handleToggleFeatured(row.id)}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Toggle Featured
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: Service) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/content/services/${row.id}`}
            className="text-blue-600 hover:text-blue-700 p-1"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <a
            href={`/services/${row.slug}`}
            target="_blank"
            className="text-gray-600 hover:text-gray-700 p-1"
            title="View"
          >
            <EyeIcon className="h-4 w-4" />
          </a>
          <button
            onClick={() => handleDeleteService(row.id)}
            className="text-red-600 hover:text-red-700 p-1"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const totalRevenue = services.reduce((sum, service) => sum + (service.basePrice * service.bookingsCount), 0);
  const averagePrice = services.length > 0 ? services.reduce((sum, service) => sum + service.basePrice, 0) / services.length : 0;
  const activeServices = services.filter(service => service.status === 'active').length;
  const featuredServices = services.filter(service => service.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your AI consulting services and pricing
          </p>
        </div>
        <Link
          href="/admin/content/services/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
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
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
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
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
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
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{featuredServices}</p>
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
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(averagePrice / 1000)}K
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
            Showing {filteredServices.length} of {services.length} services
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedServices}
        loading={loading}
        emptyMessage="No services found. Add your first service to get started."
        pagination={false}
      />
    </div>
  );
}

// Import CheckCircleIcon from Heroicons
import { CheckCircleIcon } from '@heroicons/react/24/outline';